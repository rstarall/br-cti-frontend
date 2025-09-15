from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import StreamingResponse
from typing import List
from rag.service.chat_service import ChatService

# 创建路由
chat = APIRouter(prefix="/chat")

# 初始化聊天服务
chat_service = ChatService()


@chat.get("/")
async def chat_get():
    return "Chat Get!"


@chat.post("/")
async def chat_post(
        query: str = Body(...),
        meta: dict = Body(None),
        history: List[dict] = Body(None),
        thread_id: str = Body(None)):
    """处理聊天请求的主要端点。
    Args:
        query: 用户的输入查询文本
        meta: 包含请求元数据的字典，可以包含以下字段：
            - use_web: 是否使用网络搜索
            - use_graph: 是否使用知识图谱
            - db_id: 数据库ID
            - history_round: 历史对话轮数限制
            - system_prompt: 系统提示词（str，不含变量）
        history: 对话历史记录列表
        thread_id: 对话线程ID
    Returns:
        StreamingResponse: 返回一个SSE流式响应
    """
    # 使用ChatService处理聊天请求，返回SSE格式的流式响应
    return StreamingResponse(
        chat_service.process_chat_stream(query, meta, history, thread_id),
        media_type='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'  # 禁用nginx缓冲
        }
    )

@chat.post("/call")
async def call(query: str = Body(...), meta: dict = Body(None)):
    """直接调用模型进行预测"""
    try:
        return await chat_service.call_model(query, meta)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@chat.get("/sessions/{thread_id}")
async def get_session(thread_id: str):
    """获取指定会话的历史记录

    Args:
        thread_id: 会话ID

    Returns:
        会话历史记录
    """
    try:
        return await chat_service.get_session(thread_id)
    except Exception as e:
        if "not available" in str(e):
            raise HTTPException(status_code=503, detail=str(e))
        elif "not found" in str(e):
            raise HTTPException(status_code=404, detail=str(e))
        else:
            raise HTTPException(status_code=500, detail=str(e))


@chat.delete("/sessions/{thread_id}")
async def delete_session(thread_id: str):
    """删除指定会话

    Args:
        thread_id: 会话ID

    Returns:
        删除结果
    """
    try:
        return await chat_service.delete_session(thread_id)
    except Exception as e:
        if "not available" in str(e):
            raise HTTPException(status_code=503, detail=str(e))
        elif "not found" in str(e):
            raise HTTPException(status_code=404, detail=str(e))
        else:
            raise HTTPException(status_code=500, detail=str(e))


@chat.get("/models")
async def get_chat_models(model_provider: str):
    """获取指定模型提供商的模型列表"""
    return chat_service.get_chat_models(model_provider)


@chat.post("/models/update")
async def update_chat_models(model_provider: str, model_names: List[str]):
    """更新指定模型提供商的模型列表"""
    return chat_service.update_chat_models(model_provider, model_names)

