import traceback
from typing import Optional, Dict, Any
from packages.utils import logger
from packages import config, graph_base
from packages.core.graph.graph_indexer import graph_indexer


class GraphService:
    """图谱服务类，处理知识图谱相关的业务逻辑"""

    def __init__(self):
        """初始化图谱服务"""
        pass

    def get_graph_info(self) -> Dict[str, Any]:
        """获取图数据库信息

        Returns:
            Dict[str, Any]: 图数据库信息
        """
        try:
            graph_info = graph_base.get_graph_info()
            if graph_info is None:
                return {"message": "图数据库获取出错", "status": "failed"}
            return graph_info
        except Exception as e:
            logger.error(f"获取图数据库信息失败: {e}, {traceback.format_exc()}")
            return {"message": f"获取图数据库信息失败: {e}", "status": "failed"}

    def index_nodes(self, kgdb_name: str = 'neo4j') -> Dict[str, Any]:
        """为节点添加嵌入向量索引

        Args:
            kgdb_name: 知识图谱数据库名称

        Returns:
            Dict[str, Any]: 索引结果
        """
        if not graph_base.is_running():
            return {"message": "图数据库未启动", "status": "failed"}

        try:
            # 调用GraphDatabase的add_embedding_to_nodes方法
            count = graph_base.add_embedding_to_nodes(kgdb_name=kgdb_name)
            return {"status": "success", "message": f"已成功为{count}个节点添加嵌入向量", "indexed_count": count}
        except Exception as e:
            logger.error(f"节点索引失败: {e}, {traceback.format_exc()}")
            return {"message": f"节点索引失败: {e}", "status": "failed"}

    def get_graph_node(self, entity_name: str) -> Dict[str, Any]:
        """获取图节点信息

        Args:
            entity_name: 实体名称

        Returns:
            Dict[str, Any]: 节点信息
        """
        try:
            result = graph_base.query_node(entity_name=entity_name)
            return {"result": graph_base.format_query_result_to_graph(result), "message": "success"}
        except Exception as e:
            logger.error(f"获取图节点失败: {e}, {traceback.format_exc()}")
            return {"message": f"获取图节点失败: {e}", "status": "failed"}

    def get_graph_nodes(self, kgdb_name: str, num: int) -> Dict[str, Any]:
        """获取图节点列表

        Args:
            kgdb_name: 知识图谱数据库名称
            num: 节点数量

        Returns:
            Dict[str, Any]: 节点列表
        """
        if not config.enable_knowledge_graph:
            return {"message": "Knowledge graph is not enabled", "status": "failed"}

        logger.debug(f"Get graph nodes in {kgdb_name} with {num} nodes")
        try:
            result = graph_base.get_sample_nodes(kgdb_name, num)
            return {"result": graph_base.format_general_results(result), "message": "success"}
        except Exception as e:
            logger.error(f"获取图节点列表失败: {e}, {traceback.format_exc()}")
            return {"message": f"获取图节点列表失败: {e}", "status": "failed"}

    async def add_graph_entity(self, file_path: str, kgdb_name: Optional[str] = None) -> Dict[str, Any]:
        """通过JSONL文件添加图实体

        Args:
            file_path: JSONL文件路径
            kgdb_name: 知识图谱数据库名称

        Returns:
            Dict[str, Any]: 添加结果
        """
        if not config.enable_knowledge_graph:
            return {"message": "知识图谱未启用", "status": "failed"}

        if not file_path.endswith('.jsonl'):
            return {"message": "文件格式错误，请上传jsonl文件", "status": "failed"}

        try:
            await graph_base.jsonl_file_add_entity(file_path, kgdb_name)
            return {"message": "实体添加成功", "status": "success"}
        except Exception as e:
            logger.error(f"添加实体失败: {e}, {traceback.format_exc()}")
            return {"message": f"添加实体失败: {e}", "status": "failed"}

    def start_graph_indexer(self, interval: int = 3600, batch_size: int = 100, kgdb_name: str = "neo4j") -> Dict[str, Any]:
        """启动图数据库索引器

        Args:
            interval: 扫描间隔（秒）
            batch_size: 批处理大小
            kgdb_name: 知识图谱数据库名称

        Returns:
            Dict[str, Any]: 启动结果
        """
        if not config.enable_knowledge_graph:
            return {"message": "知识图谱未启用", "status": "failed"}

        if not graph_base.is_running():
            return {"message": "图数据库未启动", "status": "failed"}

        try:
            # 更新索引器配置
            graph_indexer.interval = interval
            graph_indexer.batch_size = batch_size
            graph_indexer.kgdb_name = kgdb_name

            # 启动索引器
            success = graph_indexer.start()
            if success:
                return {"message": f"图数据库索引器已启动，扫描间隔: {interval}秒", "status": "success"}
            else:
                return {"message": "图数据库索引器启动失败", "status": "failed"}
        except Exception as e:
            logger.error(f"启动图数据库索引器失败: {e}, {traceback.format_exc()}")
            return {"message": f"启动图数据库索引器失败: {e}", "status": "failed"}

    def stop_graph_indexer(self) -> Dict[str, Any]:
        """停止图数据库索引器

        Returns:
            Dict[str, Any]: 停止结果
        """
        try:
            graph_indexer.stop()
            return {"message": "图数据库索引器已停止", "status": "success"}
        except Exception as e:
            logger.error(f"停止图数据库索引器失败: {e}, {traceback.format_exc()}")
            return {"message": f"停止图数据库索引器失败: {e}", "status": "failed"}

    def get_graph_indexer_status(self) -> Dict[str, Any]:
        """获取图数据库索引器状态

        Returns:
            Dict[str, Any]: 索引器状态
        """
        try:
            return graph_indexer.get_status()
        except Exception as e:
            logger.error(f"获取图数据库索引器状态失败: {e}, {traceback.format_exc()}")
            return {"message": f"获取图数据库索引器状态失败: {e}", "status": "failed"}

    def run_graph_indexer_now(self, batch_size: Optional[int] = None, kgdb_name: Optional[str] = None) -> Dict[str, Any]:
        """立即运行一次索引

        Args:
            batch_size: 批处理大小（可选）
            kgdb_name: 知识图谱数据库名称（可选）

        Returns:
            Dict[str, Any]: 索引结果
        """
        if not config.enable_knowledge_graph:
            return {"message": "知识图谱未启用", "status": "failed"}

        if not graph_base.is_running():
            return {"message": "图数据库未启动", "status": "failed"}

        # 临时更新批处理大小和数据库名称（如果提供）
        original_batch_size = graph_indexer.batch_size
        original_kgdb_name = graph_indexer.kgdb_name

        if batch_size is not None:
            graph_indexer.batch_size = batch_size
        if kgdb_name is not None:
            graph_indexer.kgdb_name = kgdb_name

        try:
            # 运行索引
            indexed_count = graph_indexer._index_nodes()
            return {
                "message": f"索引完成，共为 {indexed_count} 个节点添加了嵌入向量",
                "status": "success",
                "indexed_count": indexed_count
            }
        except Exception as e:
            logger.error(f"运行图数据库索引失败: {e}, {traceback.format_exc()}")
            return {"message": f"运行图数据库索引失败: {e}", "status": "failed"}
        finally:
            # 恢复原始配置
            graph_indexer.batch_size = original_batch_size
            graph_indexer.kgdb_name = original_kgdb_name