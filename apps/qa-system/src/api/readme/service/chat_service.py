import os
import json
import asyncio
import traceback
import uuid
from typing import Dict, List, Optional, AsyncGenerator
from dotenv import load_dotenv

from packages import retriever, config
from packages.core.memory.history import HistoryManager
from packages.models import select_model
from packages.utils.logging_config import logger
from rag.cache.redis_session import RedisSessionManager
from rag.utils.coroutine_pool import CoroutinePool


class ChatService:
    """聊天服务类，处理所有聊天相关的业务逻辑"""

    def __init__(self):
        """初始化聊天服务"""
        # 加载环境变量
        load_dotenv()

        # 初始化Redis会话管理器（带容错机制）
        self.redis_session = None
        try:
            self.redis_session = RedisSessionManager(
                redis_url=os.getenv("REDIS_URL", "redis://localhost:6379"),
                expire_time=int(os.getenv("SESSION_EXPIRE_TIME", "3600"))
            )
            logger.info("Redis会话管理器初始化成功")
        except Exception as e:
            logger.warning(f"Redis会话管理器初始化失败，将使用内存模式: {e}")
            self.redis_session = None

        # 初始化协程池
        self.coroutine_pool = CoroutinePool(
            max_workers=int(os.getenv("MAX_CONCURRENT_CHATS", "20"))
        )

    async def safe_redis_operation(self, operation, *args, **kwargs):
        """安全执行Redis操作，失败时返回None"""
        if self.redis_session is None:
            return None
        try:
            return await operation(*args, **kwargs)
        except Exception as e:
            logger.warning(f"Redis操作失败: {e}")
            return None

    def need_retrieve(self, meta: dict) -> bool:
        """判断是否需要检索"""
        return meta.get("use_web") or meta.get("use_graph") or meta.get("db_id")

    def make_chunk(self, content=None, meta=None, thread_id=None, **kwargs):
        """创建SSE格式的响应数据块"""
        data = json.dumps({
            "response": content,
            "meta": meta or {},
            "thread_id": thread_id,
            **kwargs
        }, ensure_ascii=False)
        # 返回SSE格式：data: {json_data}\n\n
        return f"data: {data}\n\n".encode('utf-8')

    async def _handle_retrieval(self, query: str, history_messages: list, meta: dict, thread_id: str):
        """处理检索逻辑

        Args:
            query: 用户查询
            history_messages: 历史消息
            meta: 元数据
            thread_id: 会话ID

        Returns:
            tuple: (modified_query, refs, retrieved_docs)
        """
        yield self.make_chunk(status="searching", meta=meta, thread_id=thread_id)

        modified_query = query
        refs = None
        retrieved_docs = []

        try:
            # 直接调用检索器
            if retriever:
                modified_query, refs = await retriever(modified_query, history_messages, meta)
            else:
                logger.warning("检索器未初始化，跳过检索")
                refs = None
        except Exception as e:
            logger.error(f"Retriever error: {e}, {traceback.format_exc()}")
            yield self.make_chunk(message=f"Retriever error: {e}", status="error", meta=meta, thread_id=thread_id)
            yield (modified_query, None, [])
            return

        # 构造检索结果信息
        # 处理知识库文档
        if refs and "knowledge_base" in refs and "results" in refs["knowledge_base"]:
            for doc in refs["knowledge_base"]["results"]:
                if "entity" in doc and "text" in doc["entity"]:
                    retrieved_docs.append({
                        "type": "document",
                        "id": doc.get("id", ""),
                        "filename": doc.get("entity", {}).get("metadata", {}).get("filename", "未知文档"),
                        "content": doc["entity"]["text"][:200] + "..." if len(doc["entity"]["text"]) > 200 else doc["entity"]["text"]
                    })

        # 处理图谱信息
        if refs and "graph_base" in refs and "results" in refs["graph_base"]:
            graph_data = refs["graph_base"]["results"]
            if "nodes" in graph_data and len(graph_data["nodes"]) > 0:
                for node in graph_data["nodes"]:
                    retrieved_docs.append({
                        "type": "graph_node",
                        "id": node.get("id", ""),
                        "name": node.get("name", ""),
                        "label": node.get("label", "")
                    })

        # 最后yield结果元组
        yield (modified_query, refs, retrieved_docs)

    async def _handle_generation(self, messages: list, meta: dict, thread_id: str):
        """处理问答生成逻辑

        Args:
            messages: 消息列表
            meta: 元数据
            thread_id: 会话ID

        Returns:
            tuple: (content, reasoning_content)
        """
        model = select_model()
        content = ""
        reasoning_content = ""

        try:
            # 直接调用模型预测，获取流式输出
            model_stream = model.predict(messages, stream=True)

            for delta in model_stream:
                # 确保delta是GeneralResponse对象
                if not hasattr(delta, 'content'):
                    logger.warning(f"Unexpected delta type: {type(delta)}")
                    continue

                # 处理推理内容（如果存在）
                if hasattr(delta, 'reasoning_content') and delta.reasoning_content:
                    reasoning_content += delta.reasoning_content
                    chunk = self.make_chunk(reasoning_content=reasoning_content, status="reasoning", meta=meta, thread_id=thread_id)
                    yield chunk
                    # 如果只有推理内容，继续下一个循环
                    if not delta.content:
                        continue

                # 处理正常内容
                if hasattr(delta, 'is_full') and delta.is_full:
                    # 如果是完整内容，直接设置
                    content = delta.content or ""
                else:
                    # 如果是增量内容，累加
                    content += delta.content or ""

                # 发送增量内容（只有当有内容时才发送）
                if delta.content:
                    chunk = self.make_chunk(content=delta.content, status="loading", meta=meta, thread_id=thread_id)
                    yield chunk

            logger.debug(f"Final response: {content}")
            logger.debug(f"Final reasoning response: {reasoning_content}")

            # 最后yield结果元组
            yield (content, reasoning_content)

        except Exception as e:
            logger.error(f"Model error: {e}, {traceback.format_exc()}")
            yield self.make_chunk(message=f"Model error: {e}", status="error", meta=meta, thread_id=thread_id)
            raise e

    async def _generate_session_title(self, query: str, response: str, thread_id: str, meta: dict):
        """生成会话标题

        Args:
            query: 用户问题
            response: 助手回答
            thread_id: 会话ID
            meta: 元数据
        """
        try:
            yield self.make_chunk(status="title_generating", meta=meta, thread_id=thread_id)

            # 构造标题生成提示
            title_prompt = f"""请根据以下对话内容，生成一个简洁的会话标题（不超过20个字符）：

                用户问题：{query}
                助手回答：{response[:200]}...

                要求：
                1. 标题要简洁明了，能概括对话主题
                2. 不超过20个字符
                3. 不要包含标点符号
                4. 直接返回标题，不要其他内容

                标题："""

            # 使用简化的模型调用生成标题
            model = select_model()
            title_response = model.predict(title_prompt)
            title = title_response.content.strip()

            # 清理标题，确保符合要求
            title = title.replace("标题：", "").replace("：", "").replace(":", "").strip()
            if len(title) > 20:
                title = title[:20]

            if not title:
                title = "新对话"

            # 更新Redis中的会话标题
            await self.safe_redis_operation(self.redis_session.update_session_title, thread_id, title)

            # 返回标题生成完成状态
            yield self.make_chunk(status="title_generated", title=title, meta=meta, thread_id=thread_id)

        except Exception as e:
            logger.error(f"Title generation error: {e}")
            # 如果标题生成失败，使用默认标题
            default_title = "新对话"
            await self.safe_redis_operation(self.redis_session.update_session_title, thread_id, default_title)
            # 即使失败也要发送标题生成完成状态
            yield self.make_chunk(status="title_generated", title=default_title, meta=meta, thread_id=thread_id)

    async def process_chat_stream(self, query: str, meta: dict = None, history: List[dict] = None, thread_id: str = None) -> AsyncGenerator[bytes, None]:
        """处理聊天请求的主要逻辑，返回流式响应

        Args:
            query: 用户的输入查询文本
            meta: 包含请求元数据的字典
            history: 对话历史记录列表
            thread_id: 对话线程ID

        Yields:
            bytes: 流式响应数据块
        """
        meta = meta or {}
        model = select_model()
        meta["server_model_name"] = model.model_name

        # 标记是否为新会话
        is_new_session = False

        # 会话管理逻辑
        if thread_id and self.redis_session:
            cached_history = await self.safe_redis_operation(self.redis_session.get_history, thread_id)
            if cached_history and not history:
                history = cached_history
                logger.debug(f"Using cached history for thread_id: {thread_id}")
        elif not thread_id and self.redis_session:
            # 如果没有thread_id，创建新会话
            thread_id = await self.safe_redis_operation(self.redis_session.create_session, system_prompt=meta.get("system_prompt"))
            if thread_id:
                is_new_session = True
                logger.debug(f"Created new session with thread_id: {thread_id}")

        # 如果Redis不可用，生成一个临时thread_id
        if not thread_id:
            thread_id = str(uuid.uuid4())
            is_new_session = True
            logger.debug(f"Generated temporary thread_id: {thread_id}")

        # 初始化历史管理器
        history_manager = HistoryManager(history, system_prompt=meta.get("system_prompt"))
        logger.debug(f"Received query: {query} with meta: {meta}")

        modified_query = query
        refs = None
        retrieved_docs = []

        # 1. 处理检索阶段
        if meta and self.need_retrieve(meta):
            async for chunk in self._handle_retrieval(query, history_manager.messages, meta, thread_id):
                if isinstance(chunk, tuple):
                    # 如果返回的是结果元组
                    modified_query, refs, retrieved_docs = chunk
                    break
                else:
                    # 如果是状态更新chunk
                    yield chunk

            # 在generating阶段返回检索结果
            yield self.make_chunk(status="generating", retrieved_docs=retrieved_docs, meta=meta, thread_id=thread_id)
        else:
            yield self.make_chunk(status="generating", meta=meta, thread_id=thread_id)

        # 2. 准备消息和更新历史
        messages = history_manager.get_history_with_msg(modified_query, max_rounds=meta.get('history_round'))
        history_manager.add_user(query)  # 注意这里使用原始查询

        # 更新Redis中的会话历史（使用安全操作）
        await self.safe_redis_operation(self.redis_session.add_message, thread_id, "user", query)

        # 3. 处理生成阶段
        content = ""
        reasoning_content = ""
        try:
            async for chunk in self._handle_generation(messages, meta, thread_id):
                if isinstance(chunk, tuple):
                    # 如果返回的是结果元组
                    content, reasoning_content = chunk
                    break
                else:
                    # 如果是状态更新chunk
                    yield chunk

            # 更新历史管理器
            history_manager.update_ai(content)

            # 更新Redis中的会话历史（使用安全操作）
            await self.safe_redis_operation(self.redis_session.add_message, thread_id, "assistant", content)

            # 发送完成状态
            yield self.make_chunk(status="finished",
                                history=history_manager.messages,
                                refs=refs,
                                meta=meta,
                                thread_id=thread_id)

            # 4. 如果是新会话，生成标题
            if is_new_session and content and query:
                async for chunk in self._generate_session_title(query, content, thread_id, meta):
                    yield chunk

        except Exception as e:
            logger.error(f"Model error: {e}, {traceback.format_exc()}")
            yield self.make_chunk(message=f"Model error: {e}", status="error", meta=meta, thread_id=thread_id)
            return

    async def call_model(self, query: str, meta: dict = None) -> dict:
        """直接调用模型进行预测

        Args:
            query: 用户查询
            meta: 元数据，包含模型配置

        Returns:
            dict: 包含响应内容的字典
        """
        meta = meta or {}
        model = select_model(model_provider=meta.get("model_provider"), model_name=meta.get("model_name"))

        try:
            # 直接调用模型预测
            response = model.predict(query)
            logger.debug({"query": query, "response": response.content})
            return {"response": response.content}
        except Exception as e:
            logger.error(f"Model prediction error: {e}")
            raise Exception(f"Model prediction failed: {str(e)}")

    async def get_session(self, thread_id: str) -> dict:
        """获取指定会话的历史记录

        Args:
            thread_id: 会话ID

        Returns:
            dict: 会话历史记录
        """
        if not self.redis_session:
            raise Exception("Redis session manager not available")

        try:
            session = await self.redis_session.get_session(thread_id)
            if not session:
                raise Exception("Session not found")
            return session
        except Exception as e:
            logger.error(f"Error getting session: {e}")
            raise Exception(str(e))

    async def delete_session(self, thread_id: str) -> dict:
        """删除指定会话

        Args:
            thread_id: 会话ID

        Returns:
            dict: 删除结果
        """
        if not self.redis_session:
            raise Exception("Redis session manager not available")

        try:
            result = await self.redis_session.delete_session(thread_id)
            if not result:
                raise Exception("Session not found")
            return {"success": True}
        except Exception as e:
            logger.error(f"Error deleting session: {e}")
            raise Exception(str(e))

    def get_chat_models(self, model_provider: str) -> dict:
        """获取指定模型提供商的模型列表

        Args:
            model_provider: 模型提供商

        Returns:
            dict: 模型列表
        """
        model = select_model(model_provider=model_provider)
        return {"models": model.get_models()}

    def update_chat_models(self, model_provider: str, model_names: List[str]) -> dict:
        """更新指定模型提供商的模型列表

        Args:
            model_provider: 模型提供商
            model_names: 模型名称列表

        Returns:
            dict: 更新后的模型列表
        """
        config.model_names[model_provider]["models"] = model_names
        config._save_models_to_file()
        return {"models": config.model_names[model_provider]["models"]}