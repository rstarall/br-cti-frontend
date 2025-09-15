from typing import Optional
from fastapi import APIRouter, Body, HTTPException
from rag.service.graph_service import GraphService

# 创建路由
graph = APIRouter(prefix="/graph")

# 初始化图谱服务
graph_service = GraphService()


@graph.get("/")
async def get_graph_info():
    """获取图数据库信息"""
    result = graph_service.get_graph_info()
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message", "图数据库获取出错"))
    return result


@graph.post("/index-nodes")
async def index_nodes(data: dict = Body(default={})):
    """为节点添加嵌入向量索引"""
    # 获取参数或使用默认值
    kgdb_name = data.get('kgdb_name', 'neo4j')

    result = graph_service.index_nodes(kgdb_name=kgdb_name)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@graph.get("/node")
async def get_graph_node(entity_name: str):
    """获取图节点信息"""
    result = graph_service.get_graph_node(entity_name)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@graph.get("/nodes")
async def get_graph_nodes(kgdb_name: str, num: int):
    """获取图节点列表"""
    result = graph_service.get_graph_nodes(kgdb_name, num)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@graph.post("/add-by-jsonl")
async def add_graph_entity(file_path: str = Body(...), kgdb_name: Optional[str] = Body(None)):
    """通过JSONL文件添加图实体"""
    result = await graph_service.add_graph_entity(file_path, kgdb_name)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@graph.post("/start-indexer")
async def start_graph_indexer(interval: Optional[int] = Body(3600),
                             batch_size: Optional[int] = Body(100),
                             kgdb_name: Optional[str] = Body("neo4j")):
    """启动图数据库索引器"""
    result = graph_service.start_graph_indexer(interval, batch_size, kgdb_name)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@graph.post("/stop-indexer")
async def stop_graph_indexer():
    """停止图数据库索引器"""
    result = graph_service.stop_graph_indexer()
    if result.get("status") == "failed":
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


@graph.get("/indexer-status")
async def get_graph_indexer_status():
    """获取图数据库索引器状态"""
    result = graph_service.get_graph_indexer_status()
    if result.get("status") == "failed":
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result


@graph.post("/run-indexer-now")
async def run_graph_indexer_now(batch_size: Optional[int] = Body(None),
                               kgdb_name: Optional[str] = Body(None)):
    """立即运行一次索引"""
    result = graph_service.run_graph_indexer_now(batch_size, kgdb_name)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result