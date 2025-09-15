from typing import List, Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, Body, Query
from rag.service.data_service import DataService

data = APIRouter(prefix="/data")

# 初始化数据服务
data_service = DataService()


@data.get("/")
async def get_databases():
    """获取数据库列表"""
    return data_service.get_databases()


@data.post("/")
async def create_database(
    database_name: str = Body(...),
    description: str = Body(...),
    dimension: Optional[int] = Body(None)
):
    """创建数据库"""
    result = data_service.create_database(database_name, description, dimension)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.delete("/")
async def delete_database(db_id: str):
    """删除数据库"""
    result = data_service.delete_database(db_id)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.post("/query-test")
async def query_test(query: str = Body(...), meta: dict = Body(...)):
    """查询测试"""
    result = await data_service.query_test(query, meta)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.post("/file-to-chunk")
async def file_to_chunk(files: List[str] = Body(...), params: dict = Body(...)):
    """文件转换为分块"""
    result = data_service.file_to_chunk(files, params)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.post("/add-by-file")
async def create_document_by_file(db_id: str = Body(...), files: List[str] = Body(...)):
    """通过文件添加文档"""
    result = await data_service.add_files(db_id, files)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.post("/add-by-chunks")
async def add_by_chunks(db_id: str = Body(...), file_chunks: dict = Body(...)):
    """通过分块添加文档"""
    result = await data_service.add_chunks(db_id, file_chunks)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.get("/info")
async def get_database_info(db_id: str):
    """获取数据库信息"""
    result = data_service.get_database_info(db_id)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.delete("/document")
async def delete_document(db_id: str = Body(...), file_id: str = Body(...)):
    """删除文档"""
    result = data_service.delete_document(db_id, file_id)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.get("/document")
async def get_document_info(db_id: str, file_id: str):
    """获取文档信息"""
    result = data_service.get_document_info(db_id, file_id)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db_id: Optional[str] = Query(None)
):
    """上传文件"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No selected file")

    file_content = await file.read()
    result = await data_service.upload_file(file_content, file.filename, db_id)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.get("/files")
async def get_files_list(db_id: str):
    """获取指定数据库中的所有文件列表"""
    result = data_service.get_files_list(db_id)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@data.delete("/file")
async def delete_file_by_id(db_id: str = Body(...), file_id: str = Body(...)):
    """删除指定数据库中的指定文件"""
    result = data_service.delete_file_by_id(db_id, file_id)
    if result.get("status") == "failed":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

