import os
import json
import asyncio
import traceback
import uuid
from fastapi import APIRouter, Body, Depends, HTTPException, Header
from fastapi.responses import StreamingResponse
from langchain_core.messages import AIMessageChunk
from packages import executor, retriever, config
from packages.core import HistoryManager
from packages.models import select_model
from packages.utils.logging_config import logger
from rag.cache.redis_session import RedisSessionManager
from packages.manager.chat_session_manager import get_chat_session_manager
from rag.utils.coroutine_pool import CoroutinePool
from typing import Optional, Dict, List, Any
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 创建路由
chat = APIRouter(prefix="/chat")

# 初始化Redis会话管理器
redis_session = RedisSessionManager(
    redis_url=os.getenv("REDIS_URL", "redis://localhost:6379"),
    expire_time=int(os.getenv("SESSION_EXPIRE_TIME", "3600"))
)

# 初始化聊天会话管理器（整合MySQL和Redis）
chat_session_manager = get_chat_session_manager(redis_manager=redis_session)

# 初始化协程池
coroutine_pool = CoroutinePool(
    max_workers=int(os.getenv("MAX_CONCURRENT_CHATS", "20"))
)

@chat.get("/")
async def chat_get():
    return "Chat Get!"

@chat.post("/stream")
async def chat_post(
        query: str = Body(...),
        meta: dict = Body(None),
        history: list[dict] | None = Body(None),
        thread_id: str | None = Body(None),
        user_id: int = Body(..., description="用户ID")):
    """处理聊天请求的主要端点。
    Args:
        query: 用户的输入查询文本
        meta: 包含请求元数据的字典，可以包含以下字段：
            - use_web: 是否使用网络搜索
            - use_graph: 是否使用知识图谱
            - db_id: 数据库ID
            - history_round: 历史对话轮数限制
            - system_prompt: 系统提示词（str，不含变量）
            - search_mode: 图搜索模式 (local/global/hybrid，默认hybrid)
            - top_k: 搜索结果数量限制 (默认10)
            - threshold: 相似度阈值 (默认0.7)
            - model_provider: 模型提供商 (可选，如 "deepseek", "custom" 等)
            - model_name: 模型名称 (可选)
        history: 对话历史记录列表（可选，优先使用数据库中的历史）
        thread_id: 对话线程ID（可选，如果不提供则创建新会话）
        user_id: 用户ID（必需）
    Returns:
        StreamingResponse: 返回一个流式响应
    """
    meta = meta or {}
    
    # 根据请求参数选择模型
    model = select_model(
        model_provider=meta.get("model_provider"),
        model_name=meta.get("model_name")
    )
    meta["server_model_name"] = model.model_name
    meta["server_model_provider"] = meta.get("model_provider") or config.model_provider
    
    # 如果提供了thread_id，从数据库获取历史记录
    if thread_id:
        try:
            # 从MySQL/Redis获取会话历史（先Redis后MySQL）
            cached_history = await chat_session_manager.get_history(
                session_id=thread_id,
                user_id=user_id
            )
            if cached_history and not history:
                history = cached_history
                logger.debug(f"获取会话历史: thread_id={thread_id}, 消息数={len(history)}")
        except Exception as e:
            logger.error(f"获取会话历史失败: {e}")
    else:
        # 如果没有thread_id，创建新会话
        try:
            thread_id = await chat_session_manager.create_session(
                user_id=user_id,
                system_prompt=meta.get("system_prompt")
            )
            logger.debug(f"创建新会话: thread_id={thread_id}, user_id={user_id}")
        except Exception as e:
            logger.error(f"创建会话失败: {e}")
            raise HTTPException(status_code=500, detail=f"创建会话失败: {str(e)}")
    
    # 初始化历史管理器
    history_manager = HistoryManager(history, system_prompt=meta.get("system_prompt"))
    logger.debug(f"Received query: {query} with meta: {meta}")
    
    # 确保meta中包含show_retrieval_info参数，默认为True
    if "show_retrieval_info" not in meta:
        meta["show_retrieval_info"] = True

    def make_chunk(content=None, **kwargs):
        return json.dumps({
            "response": content,
            "meta": meta,
            "thread_id": thread_id,  # 返回thread_id给客户端
            **kwargs
        }, ensure_ascii=False).encode('utf-8') + b"\n"

    def need_retrieve(meta):
        return meta.get("use_web") or meta.get("use_graph") or meta.get("db_id")

    async def process_chat():
        modified_query = query
        refs = None

        # 处理知识库检索
        if meta and need_retrieve(meta):
            yield make_chunk(status="searching")

            try:
                # 使用协程池提交检索任务
                retrieval_result = await coroutine_pool.submit(
                    asyncio.to_thread(retriever, modified_query, history_manager.messages, meta)
                )
                modified_query, refs = retrieval_result
            except Exception as e:
                logger.error(f"Retriever error: {e}, {traceback.format_exc()}")
                yield make_chunk(message=f"Retriever error: {e}", status="error")
                return

            yield make_chunk(status="generating")

        messages = history_manager.get_history_with_msg(modified_query, max_rounds=meta.get('history_round'))
        history_manager.add_user(query)  # 注意这里使用原始查询
        
        # 保存用户消息到数据库（同时写入MySQL和Redis）
        try:
            await chat_session_manager.add_message(
                session_id=thread_id,
                role="user",
                content=query,
                user_id=user_id
            )
        except Exception as e:
            logger.error(f"保存用户消息失败: {e}")

        content = ""
        reasoning_content = ""
        try:
            # 使用协程池提交模型预测任务
            model_stream = model.predict(messages, stream=True)
            
            for delta in model_stream:
                if not delta.content and hasattr(delta, 'reasoning_content'):
                    reasoning_content += delta.reasoning_content or ""
                    chunk = make_chunk(reasoning_content=reasoning_content, status="reasoning")
                    yield chunk
                    continue

                # 文心一言
                if hasattr(delta, 'is_full') and delta.is_full:
                    content = delta.content
                else:
                    content += delta.content or ""

                chunk = make_chunk(content=delta.content, status="loading")
                yield chunk

            logger.debug(f"Final response: {content}")
            logger.debug(f"Final reasoning response: {reasoning_content}")
            
            # 保存助手回复到数据库（同时写入MySQL和Redis）
            try:
                await chat_session_manager.add_message(
                    session_id=thread_id,
                    role="assistant",
                    content=content,
                    user_id=user_id
                )
            except Exception as e:
                logger.error(f"保存助手回复失败: {e}")
                
            # 只返回refs的摘要信息，避免输出大量数据
            refs_summary = None
            if refs:
                refs_summary = {
                    "knowledge_base_count": len(refs.get("knowledge_base", {}).get("results", [])),
                    "graph_base_count": len(refs.get("graph_base", {}).get("results", [])),
                    "web_search_count": len(refs.get("web_search", {}).get("results", [])),
                    "entities": refs.get("entities", [])[:5]  # 只返回前5个实体
                }
            
            yield make_chunk(status="finished",
                            history=history_manager.update_ai(content),
                            refs=refs_summary)
        except Exception as e:
            logger.error(f"Model error: {e}, {traceback.format_exc()}")
            yield make_chunk(message=f"Model error: {e}", status="error")
            return

    # 使用StreamingResponse返回异步生成器
    return StreamingResponse(process_chat(), media_type='application/json')



@chat.post("/call")
async def call(query: str = Body(...), meta: dict = Body(None)):
    meta = meta or {}
    model = select_model(model_provider=meta.get("model_provider"), model_name=meta.get("model_name"))
    
    async def predict_async(query):
        # 使用协程池提交预测任务
        return await coroutine_pool.submit(
            asyncio.to_thread(model.predict, query)
        )

    response = await predict_async(query)
    logger.debug({"query": query, "response": response.content})

    return {"response": response.content}

@chat.get("/sessions")
async def list_sessions(
    user_id: int,
    limit: int = 50,
    offset: int = 0
):
    """获取用户的所有会话列表
    
    Args:
        user_id: 用户ID
        limit: 返回数量限制
        offset: 偏移量
        
    Returns:
        会话列表
    """
    try:
        sessions = await chat_session_manager.list_user_sessions(
            user_id=user_id,
            limit=limit,
            offset=offset
        )
        return {
            "success": True,
            "sessions": sessions,
            "total": len(sessions)
        }
    except Exception as e:
        logger.error(f"获取会话列表失败: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@chat.get("/sessions/{thread_id}")
async def get_session(
    thread_id: str,
    user_id: int,
    include_messages: bool = True
):
    """获取指定会话的详细信息
    
    Args:
        thread_id: 会话ID
        user_id: 用户ID
        include_messages: 是否包含消息列表
        
    Returns:
        会话详细信息
    """
    try:
        session = await chat_session_manager.get_session(
            session_id=thread_id,
            user_id=user_id,
            include_messages=include_messages
        )
        if not session:
            raise HTTPException(status_code=404, detail="会话不存在或无权访问")
        return {"success": True, "session": session}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取会话失败: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@chat.put("/sessions/{thread_id}")
async def update_session(
    thread_id: str,
    user_id: int = Body(...),
    title: str = Body(None),
    system_prompt: str = Body(None)
):
    """更新会话信息
    
    Args:
        thread_id: 会话ID
        user_id: 用户ID
        title: 新标题（可选）
        system_prompt: 新系统提示词（可选）
        
    Returns:
        更新结果
    """
    try:
        result = await chat_session_manager.update_session(
            session_id=thread_id,
            user_id=user_id,
            title=title,
            system_prompt=system_prompt
        )
        if not result:
            raise HTTPException(status_code=404, detail="会话不存在或无权访问")
        return {"success": True, "message": "会话更新成功"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"更新会话失败: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@chat.delete("/sessions/{thread_id}")
async def delete_session(
    thread_id: str,
    user_id: int,
    hard_delete: bool = False
):
    """删除指定会话
    
    Args:
        thread_id: 会话ID
        user_id: 用户ID
        hard_delete: 是否物理删除（默认软删除）
        
    Returns:
        删除结果
    """
    try:
        result = await chat_session_manager.delete_session(
            session_id=thread_id,
            user_id=user_id,
            hard_delete=hard_delete
        )
        if not result:
            raise HTTPException(status_code=404, detail="会话不存在或无权访问")
        return {"success": True, "message": "会话删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"删除会话失败: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@chat.get("/sessions/{thread_id}/messages")
async def get_session_messages(
    thread_id: str,
    user_id: int,
    limit: int = None
):
    """获取会话的消息历史
    
    Args:
        thread_id: 会话ID
        user_id: 用户ID
        limit: 限制返回消息数量（可选）
        
    Returns:
        消息列表
    """
    try:
        messages = await chat_session_manager.get_history(
            session_id=thread_id,
            user_id=user_id,
            limit=limit
        )
        return {
            "success": True,
            "messages": messages,
            "total": len(messages)
        }
    except Exception as e:
        logger.error(f"获取消息历史失败: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@chat.delete("/sessions/{thread_id}/messages/{message_id}")
async def delete_message(
    thread_id: str,
    message_id: int,
    user_id: int
):
    """删除指定消息
    
    Args:
        thread_id: 会话ID
        message_id: 消息ID
        user_id: 用户ID
        
    Returns:
        删除结果
    """
    try:
        result = await chat_session_manager.delete_message(
            message_id=message_id,
            session_id=thread_id,
            user_id=user_id
        )
        if not result:
            raise HTTPException(status_code=404, detail="消息不存在或无权访问")
        return {"success": True, "message": "消息删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"删除消息失败: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@chat.get("/models")
async def get_chat_models(model_provider: str):
    """获取指定模型提供商的模型列表（动态）"""
    try:
        # 对于 OpenAI 和 Ollama，返回预定义的模型列表
        if model_provider == "openai":
            return {
                "models": [
                    "gpt-4o-mini",
                    "gpt-3.5-turbo"
                ]
            }
        elif model_provider == "ollama":
            # 尝试从 Ollama 服务获取已下载的模型列表
            try:
                import requests
                ollama_base = os.getenv("OLLAMA_API_BASE", "http://ollama:11434")
                response = requests.get(f"{ollama_base}/api/tags", timeout=5)
                if response.status_code == 200:
                    models_data = response.json()
                    model_names = [m["name"] for m in models_data.get("models", [])]
                    return {"models": model_names}
                else:
                    # 返回推荐模型列表
                    return {
                        "models": [
                            "llama3.1:8b",
                            "qwen2.5:7b",
                            "deepseek-r1:7b"
                        ]
                    }
            except:
                # 如果无法连接 Ollama，返回推荐模型列表
                return {
                    "models": [
                        "llama3.1:8b",
                        "qwen2.5:7b",
                        "deepseek-r1:7b"
                    ]
                }
        elif model_provider == "deepseek":
            return {
                "models": ["deepseek-chat"]
            }
        else:
            # 其他提供商，使用原有逻辑
            model = select_model(model_provider=model_provider)
            return {"models": model.get_models()}
    except Exception as e:
        logger.error(f"Error getting models for {model_provider}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get models: {str(e)}")

@chat.post("/models/update")
async def update_chat_models(model_provider: str, model_names: list[str]):
    """更新指定模型提供商的模型列表"""
    config.model_names[model_provider]["models"] = model_names
    config._save_models_to_file()
    return {"models": config.model_names[model_provider]["models"]}



@chat.post("/hybrid-retrieval")
async def hybrid_retrieval(
        query: str = Body(...),
        meta: dict = Body(None),
        history: list[dict] | None = Body(None),
        thread_id: str | None = Body(None),
        response_mode: str = Body("simple")):
    """四阶段混合检索接口 - 自动生成最终答案
    
    Args:
        query: 用户的输入查询文本
        meta: 包含请求元数据的字典，可以包含以下字段：
            - db_id: 数据库ID (必需)
            - use_hybrid_retrieval: 是否启用四阶段混合检索 (默认True)
            - vector_top_k: 向量检索返回结果数量 (默认20)
            - vector_distance_threshold: 向量相似度阈值 (默认0.7)
            - graph_hops: 图遍历跳数 (默认2)
            - graph_top_k: 图检索返回结果数量 (默认15)
            - graph_threshold: 图检索阈值 (默认0.6)
            - use_web: 是否使用网络搜索 (默认False)
            - show_retrieval_info: 是否显示检索信息 (默认True)
            - system_prompt: 系统提示词 (可选)
            - model_provider: 模型提供商 (可选)
            - model_name: 模型名称 (可选)
        history: 对话历史记录列表
        thread_id: 对话线程ID
        response_mode: 响应模式 ('simple' 或 'full')，默认为 'simple'
        
    Returns:
        四阶段检索结果 + LLM生成的最终答案
    """
    meta = meta or {}
    
    # 强制启用四阶段混合检索
    meta["use_hybrid_retrieval"] = True
    
    # 设置默认参数
    defaults = {
        "vector_top_k": 20,
        "vector_distance_threshold": 0.6,
        "graph_hops": 2,
        "graph_top_k": 15,
        "graph_threshold": 0.5,
        "use_web": False,
        "show_retrieval_info": True,
    }
    
    for key, value in defaults.items():
        if key not in meta:
            meta[key] = value
    
    # 检查必需参数
    if not meta.get("db_id"):
        raise HTTPException(status_code=400, detail="db_id is required for hybrid retrieval")
    
    logger.info(f"开始四阶段混合检索: {query}")
    logger.debug(f"检索参数: {meta}")
    
    try:
        # 使用协程池提交检索任务
        retrieval_result = await coroutine_pool.submit(
            asyncio.to_thread(retriever, query, history or [], meta)
        )
        modified_query, refs = retrieval_result
        
        # 构建详细的返回结果
        result = {
            "status": "success",
            "query": query,
            "modified_query": modified_query,
            "meta": meta,
            "retrieval_results": {
                "entities": refs.get("entities", []),
                "knowledge_base": {
                    "count": len(refs.get("knowledge_base", {}).get("results", [])),
                    "results": refs.get("knowledge_base", {}).get("results", [])[:10]  # 限制返回数量
                },
                "graph_base": {
                    "count": len(refs.get("graph_base", {}).get("results", [])),
                    "results": _limit_graph_results(refs.get("graph_base", {}).get("results", []), 10)
                },
                "web_search": {
                    "count": len(refs.get("web_search", {}).get("results", [])),
                    "results": refs.get("web_search", {}).get("results", [])[:5]  # 限制返回数量
                }
            }
        }
        
        # 如果有融合上下文，添加到结果中
        if refs.get("fused_context"):
            result["retrieval_results"]["fused_context"] = refs["fused_context"]
        
        logger.info(f"四阶段混合检索完成: 实体{len(result['retrieval_results']['entities'])}个, "
                   f"文档{result['retrieval_results']['knowledge_base']['count']}个, "
                   f"图关系{result['retrieval_results']['graph_base']['count']}个")
        
        # 使用LLM生成最终答案
        try:
            logger.info("开始生成最终答案...")
            
            # 选择模型
            model = select_model(
                model_provider=meta.get("model_provider"),
                model_name=meta.get("model_name")
            )
            
            # 构建消息列表
            messages = []
            
            # 添加系统提示词
            system_prompt = meta.get("system_prompt", 
                "你是一个专业的威胁情报分析师。请基于提供的检索结果，生成一个全面、准确的答案。"
                "答案应该结合文档信息和知识图谱关系，提供既有宏观描述又包含精确事实的回答。")
            messages.append({"role": "system", "content": system_prompt})
            
            # 添加历史对话
            if history:
                for msg in history[-5:]:  # 限制最近5轮对话
                    if isinstance(msg, dict) and "role" in msg and "content" in msg:
                        messages.append(msg)
            
            # 构建包含检索结果的用户消息
            user_message = _build_user_message_with_context(query, refs)
            messages.append({"role": "user", "content": user_message})
            
            # 使用协程池提交模型预测任务
            model_response = await coroutine_pool.submit(
                asyncio.to_thread(model.predict, messages)
            )
            
            # 添加生成的答案到结果中
            result["generated_answer"] = {
                "content": model_response.content,
                "model_name": model.model_name,
                "model_provider": meta.get("model_provider", "default")
            }
            
            logger.info("最终答案生成完成")
            
        except Exception as e:
            logger.error(f"生成答案失败: {e}, {traceback.format_exc()}")
            result["generated_answer"] = {
                "error": f"生成答案失败: {str(e)}",
                "content": None
            }
        
        # 根据响应模式决定返回内容
        if response_mode == "simple":
            # 精简模式：只返回最重要的信息
            simple_result = {
                "status": result.get("status"),
                "query": result.get("query"),
                "generated_answer": result.get("generated_answer")
            }
            # 添加一个摘要，说明检索到了多少信息
            if "retrieval_results" in result:
                simple_result["retrieval_summary"] = (
                    f"检索到实体 {len(result['retrieval_results']['entities'])} 个, "
                    f"文档 {result['retrieval_results']['knowledge_base']['count']} 个, "
                    f"图关系 {result['retrieval_results']['graph_base']['count']} 个"
                )
            return simple_result
        
        # 默认返回完整结果
        return result
        
    except Exception as e:
        logger.error(f"四阶段混合检索失败: {e}, {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Hybrid retrieval failed: {str(e)}")

def _build_user_message_with_context(query: str, refs: dict) -> str:
    """构建包含检索结果的用户消息"""
    
    # 获取融合上下文
    fused_context = refs.get("fused_context", {})
    
    # 构建消息
    message_parts = []
    
    # 添加原始查询
    message_parts.append(f"用户问题: {query}")
    message_parts.append("")
    
    # 添加向量检索的文档信息
    vector_context = fused_context.get("vector_context", "")
    if vector_context:
        message_parts.append("相关文档信息:")
        message_parts.append(vector_context)
        message_parts.append("")
    
    # 添加图检索的关系信息
    graph_context = fused_context.get("graph_context", "")
    if graph_context:
        message_parts.append("知识图谱关系:")
        message_parts.append(graph_context)
        message_parts.append("")
    
    # 添加网络搜索结果
    web_results = refs.get("web_search", {}).get("results", [])
    if web_results:
        message_parts.append("网络搜索信息:")
        for i, result in enumerate(web_results[:3], 1):  # 限制前3个
            if isinstance(result, dict):
                title = result.get("title", "")
                content = result.get("content", "")
                message_parts.append(f"{i}. {title}: {content}")
        message_parts.append("")
    
    # 添加指导说明
    message_parts.append("请基于以上检索到的信息，回答用户的问题。")
    message_parts.append("要求:")
    message_parts.append("1. 结合文档信息和知识图谱关系")
    message_parts.append("2. 提供既有宏观描述又包含精确事实的回答")
    message_parts.append("3. 如果信息不足，请明确说明")
    message_parts.append("4. 保持回答的专业性和准确性")
    
    return "\n".join(message_parts)

def _limit_graph_results(graph_results, limit):
    """安全地限制图检索结果数量"""
    if not graph_results:
        return []
    
    # 如果结果是列表，直接切片
    if isinstance(graph_results, list):
        return graph_results[:limit]
    
    # 如果结果是字典，处理不同的结构
    if isinstance(graph_results, dict):
        # 如果包含edges，限制edges数量
        if "edges" in graph_results:
            limited_results = graph_results.copy()
            if isinstance(graph_results["edges"], list):
                limited_results["edges"] = graph_results["edges"][:limit]
            return limited_results
        
        # 如果包含nodes，限制nodes数量
        if "nodes" in graph_results:
            limited_results = graph_results.copy()
            if isinstance(graph_results["nodes"], list):
                limited_results["nodes"] = graph_results["nodes"][:limit]
            return limited_results
        
        # 其他情况，返回原结果
        return graph_results
    
    # 其他类型，返回空列表
    return []