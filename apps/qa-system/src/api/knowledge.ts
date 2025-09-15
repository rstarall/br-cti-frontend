import api from './index';
import {
  KnowledgeDatabase,
  KnowledgeFile,
  CreateDatabaseRequest,
  UploadFileResponse,
  FileToChunkRequest,
  AddChunksRequest,
  QueryTestRequest,
  DeleteFileRequest,
  FilesListResponse,
  ApiResponse
} from './types';

/**
 * 知识库API模块
 */
export class KnowledgeAPI {
  /**
   * 获取所有知识库列表
   */
  static async getDatabases(): Promise<{ databases: KnowledgeDatabase[] }> {
    const response = await api.get<{ databases: KnowledgeDatabase[] }>('/data/');
    return response.data;
  }

  /**
   * 创建新的知识库
   */
  static async createDatabase(request: CreateDatabaseRequest): Promise<KnowledgeDatabase> {
    const response = await api.post<KnowledgeDatabase>('/data/', request);
    return response.data;
  }

  /**
   * 删除知识库
   */
  static async deleteDatabase(dbId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>('/data/', {
      params: { db_id: dbId }
    });
    return response.data;
  }

  /**
   * 获取知识库信息
   */
  static async getDatabaseInfo(dbId: string): Promise<KnowledgeDatabase> {
    const response = await api.get<KnowledgeDatabase>('/data/info', {
      params: { db_id: dbId }
    });
    return response.data;
  }

  /**
   * 获取知识库文件列表
   */
  static async getFilesList(dbId: string): Promise<FilesListResponse> {
    const response = await api.get<FilesListResponse>('/data/files', {
      params: { db_id: dbId }
    });
    return response.data;
  }

  /**
   * 上传文件
   */
  static async uploadFile(dbId: string, file: File): Promise<UploadFileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadFileResponse>('/data/upload', formData, {
      params: { db_id: dbId },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * 文件转分块
   */
  static async fileToChunk(request: FileToChunkRequest): Promise<any> {
    const response = await api.post<any>('/data/file-to-chunk', request);
    return response.data;
  }

  /**
   * 通过文件添加到知识库
   */
  static async addByFile(dbId: string, files: string[]): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/data/add-by-file', {
      db_id: dbId,
      files
    });
    return response.data;
  }

  /**
   * 通过分块添加到知识库
   */
  static async addByChunks(request: AddChunksRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/data/add-by-chunks', request);
    return response.data;
  }

  /**
   * 删除文件
   */
  static async deleteFile(request: DeleteFileRequest): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>('/data/file', {
      data: request
    });
    return response.data;
  }

  /**
   * 获取文档信息
   */
  static async getDocumentInfo(dbId: string, fileId: string): Promise<KnowledgeFile> {
    const response = await api.get<KnowledgeFile>('/data/document', {
      params: { db_id: dbId, file_id: fileId }
    });
    return response.data;
  }

  /**
   * 删除文档
   */
  static async deleteDocument(dbId: string, fileId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>('/data/document', {
      data: { db_id: dbId, file_id: fileId }
    });
    return response.data;
  }

  /**
   * 查询测试
   */
  static async queryTest(request: QueryTestRequest): Promise<any> {
    const response = await api.post<any>('/data/query-test', request);
    return response.data;
  }
}

export default KnowledgeAPI;
