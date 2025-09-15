import os
import asyncio
import traceback
from typing import List, Optional, Dict, Any
from packages.utils import logger, hashstr
from packages import config, executor, retriever, knowledge_base


class DataService:
    """数据服务类，处理知识库相关的业务逻辑"""

    def __init__(self):
        """初始化数据服务"""
        pass

    def get_databases(self) -> Dict[str, Any]:
        """获取数据库列表

        Returns:
            Dict[str, Any]: 数据库列表信息
        """
        try:
            database = knowledge_base.get_databases()
            return database
        except Exception as e:
            logger.error(f"获取数据库列表失败 {e}, {traceback.format_exc()}")
            return {"message": f"获取数据库列表失败 {e}", "databases": []}

    def create_database(self, database_name: str, description: str, dimension: Optional[int] = None) -> Dict[str, Any]:
        """创建数据库

        Args:
            database_name: 数据库名称
            description: 数据库描述
            dimension: 向量维度

        Returns:
            Dict[str, Any]: 创建结果
        """
        logger.debug(f"Create database {database_name}")
        try:
            database_info = knowledge_base.create_database(
                database_name,
                description,
                dimension=dimension
            )
            return database_info
        except Exception as e:
            logger.error(f"创建数据库失败 {e}, {traceback.format_exc()}")
            return {"message": f"创建数据库失败 {e}", "status": "failed"}

    def delete_database(self, db_id: str) -> Dict[str, Any]:
        """删除数据库

        Args:
            db_id: 数据库ID

        Returns:
            Dict[str, Any]: 删除结果
        """
        logger.debug(f"Delete database {db_id}")
        try:
            knowledge_base.delete_database(db_id)
            return {"message": "删除成功"}
        except Exception as e:
            logger.error(f"删除数据库失败 {e}, {traceback.format_exc()}")
            return {"message": f"删除数据库失败 {e}", "status": "failed"}

    async def query_test(self, query: str, meta: dict) -> Dict[str, Any]:
        """查询测试

        Args:
            query: 查询文本
            meta: 元数据

        Returns:
            Dict[str, Any]: 查询结果
        """
        logger.debug(f"Query test in {meta}: {query}")
        try:
            result = await retriever.query_knowledgebase(query, history=None, refs={"meta": meta})
            return result
        except Exception as e:
            logger.error(f"查询测试失败 {e}, {traceback.format_exc()}")
            return {"message": f"查询测试失败 {e}", "status": "failed"}

    def file_to_chunk(self, files: List[str], params: dict) -> Dict[str, Any]:
        """文件转换为分块

        Args:
            files: 文件列表
            params: 参数

        Returns:
            Dict[str, Any]: 转换结果
        """
        logger.debug(f"File to chunk: {files}")
        try:
            result = knowledge_base.file_to_chunk(files, params=params)
            return result
        except Exception as e:
            logger.error(f"文件转换失败 {e}, {traceback.format_exc()}")
            return {"message": f"文件转换失败 {e}", "status": "failed"}

    async def add_files(self, db_id: str, files: List[str]) -> Dict[str, Any]:
        """通过文件添加文档

        Args:
            db_id: 数据库ID
            files: 文件列表

        Returns:
            Dict[str, Any]: 添加结果
        """
        logger.debug(f"Add document in {db_id} by file: {files}")
        try:
            # 使用线程池执行耗时操作
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                executor,  # 使用与chat_router相同的线程池
                lambda: knowledge_base.add_files(db_id, files)
            )
            return {"message": "文件添加完成", "status": "success"}
        except Exception as e:
            logger.error(f"添加文件失败: {e}, {traceback.format_exc()}")
            return {"message": f"添加文件失败: {e}", "status": "failed"}

    async def add_chunks(self, db_id: str, file_chunks: dict) -> Dict[str, Any]:
        """通过分块添加文档

        Args:
            db_id: 数据库ID
            file_chunks: 文件分块数据

        Returns:
            Dict[str, Any]: 添加结果
        """
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                executor,  # 使用与chat_router相同的线程池
                lambda: knowledge_base.add_chunks(db_id, file_chunks)
            )
            return {"message": "分块添加完成", "status": "success"}
        except Exception as e:
            logger.error(f"添加分块失败: {e}, {traceback.format_exc()}")
            return {"message": f"添加分块失败: {e}", "status": "failed"}

    def get_database_info(self, db_id: str) -> Dict[str, Any]:
        """获取数据库信息

        Args:
            db_id: 数据库ID

        Returns:
            Dict[str, Any]: 数据库信息
        """
        try:
            database = knowledge_base.get_database_info(db_id)
            return database
        except Exception as e:
            logger.error(f"获取数据库信息失败 {e}, {traceback.format_exc()}")
            return {"message": f"获取数据库信息失败 {e}", "status": "failed"}

    def delete_document(self, db_id: str, file_id: str) -> Dict[str, Any]:
        """删除文档

        Args:
            db_id: 数据库ID
            file_id: 文件ID

        Returns:
            Dict[str, Any]: 删除结果
        """
        logger.debug(f"DELETE document {file_id} info in {db_id}")
        try:
            knowledge_base.delete_file(db_id, file_id)
            return {"message": "删除成功"}
        except Exception as e:
            logger.error(f"删除文档失败 {e}, {traceback.format_exc()}")
            return {"message": f"删除文档失败 {e}", "status": "failed"}

    def get_document_info(self, db_id: str, file_id: str) -> Dict[str, Any]:
        """获取文档信息

        Args:
            db_id: 数据库ID
            file_id: 文件ID

        Returns:
            Dict[str, Any]: 文档信息
        """
        logger.debug(f"GET document {file_id} info in {db_id}")
        try:
            info = knowledge_base.get_file_info(db_id, file_id)
            return info
        except Exception as e:
            logger.error(f"Failed to get file info, {e}, {db_id=}, {file_id=}, {traceback.format_exc()}")
            return {"message": "Failed to get file info", "status": "failed"}

    async def upload_file(self, file_content: bytes, filename: str, db_id: Optional[str] = None) -> Dict[str, Any]:
        """上传文件

        Args:
            file_content: 文件内容
            filename: 文件名
            db_id: 数据库ID（可选）

        Returns:
            Dict[str, Any]: 上传结果
        """
        if not filename:
            return {"message": "No selected file", "status": "failed"}

        # 根据db_id获取上传路径，如果db_id为None则使用默认路径
        if db_id:
            upload_dir = knowledge_base.get_db_upload_path(db_id)
        else:
            upload_dir = os.path.join(config.save_dir, "data", "uploads")

        basename, ext = os.path.splitext(filename)
        new_filename = f"{basename}_{hashstr(basename, 4, with_salt=True)}{ext}".lower()
        file_path = os.path.join(upload_dir, new_filename)
        os.makedirs(upload_dir, exist_ok=True)

        try:
            with open(file_path, "wb") as buffer:
                buffer.write(file_content)
            return {"message": "File successfully uploaded", "file_path": file_path, "db_id": db_id}
        except Exception as e:
            logger.error(f"文件上传失败: {e}, {traceback.format_exc()}")
            return {"message": f"文件上传失败: {e}", "status": "failed"}

    def get_files_list(self, db_id: str) -> Dict[str, Any]:
        """获取指定数据库中的所有文件列表

        Args:
            db_id: 数据库ID

        Returns:
            Dict[str, Any]: 文件列表
        """
        logger.debug(f"GET files list in database {db_id}")

        try:
            # 获取文件列表
            files = knowledge_base.get_files_list(db_id)

            return {
                "message": "获取文件列表成功",
                "status": "success",
                "db_id": db_id,
                "files": files,
                "total_count": len(files)
            }
        except Exception as e:
            logger.error(f"获取文件列表失败: {e}, {traceback.format_exc()}")
            return {"message": f"获取文件列表失败: {e}", "status": "failed", "files": []}

    def delete_file_by_id(self, db_id: str, file_id: str) -> Dict[str, Any]:
        """删除指定数据库中的指定文件

        Args:
            db_id: 数据库ID
            file_id: 文件ID

        Returns:
            Dict[str, Any]: 删除结果
        """
        logger.debug(f"DELETE file {file_id} from database {db_id}")

        try:
            # 先检查数据库是否存在
            db = knowledge_base.get_kb_by_id(db_id)
            if db is None:
                return {"message": f"数据库不存在，db_id: {db_id}", "status": "failed"}

            # 根据file_id获取文件信息
            file_info = knowledge_base.get_file_by_id(file_id)
            if file_info is None:
                return {"message": f"文件不存在，file_id: {file_id}", "status": "failed"}

            # 验证文件是否属于指定的数据库
            file_db_id = file_info.get("database_id")
            if file_db_id != db_id:
                return {
                    "message": f"文件不属于指定数据库。文件属于数据库: {file_db_id}，请求的数据库: {db_id}",
                    "status": "failed"
                }

            # 执行删除操作
            knowledge_base.delete_file(db_id, file_id)

            return {
                "message": "文件删除成功",
                "status": "success",
                "file_id": file_id,
                "db_id": db_id,
                "filename": file_info.get("filename", "未知")
            }
        except Exception as e:
            logger.error(f"删除文件失败: {e}, {traceback.format_exc()}")
            return {"message": f"删除文件失败: {e}", "status": "failed"}