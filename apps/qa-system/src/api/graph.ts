import api from './index';
import {
  GraphInfo,
  GraphNodesResponse,
  GraphNodeResponse,
  AddEntitiesByJsonlRequest,
  IndexNodesRequest,
  IndexNodesResponse,
  ApiResponse
} from './types';

/**
 * 知识图谱API模块
 */
export class GraphAPI {
  /**
   * 获取图谱信息
   */
  static async getGraphInfo(): Promise<GraphInfo> {
    const response = await api.get<GraphInfo>('/graph/');
    return response.data;
  }

  /**
   * 获取图谱节点
   */
  static async getGraphNodes(kgdbName: string, num: number): Promise<GraphNodesResponse> {
    const response = await api.get<GraphNodesResponse>('/graph/nodes', {
      params: { kgdb_name: kgdbName, num }
    });
    return response.data;
  }

  /**
   * 查询特定节点
   */
  static async getGraphNode(entityName: string): Promise<GraphNodeResponse> {
    const response = await api.get<GraphNodeResponse>('/graph/node', {
      params: { entity_name: entityName }
    });
    return response.data;
  }

  /**
   * 通过JSONL文件添加实体
   */
  static async addEntitiesByJsonl(request: AddEntitiesByJsonlRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/graph/add-by-jsonl', request);
    return response.data;
  }

  /**
   * 为节点添加索引
   */
  static async indexNodes(request: IndexNodesRequest = {}): Promise<IndexNodesResponse> {
    const response = await api.post<IndexNodesResponse>('/graph/index-nodes', request);
    return response.data;
  }

  /**
   * 启动图数据库索引器
   */
  static async startIndexer(
    interval: number = 3600,
    batchSize: number = 100,
    kgdbName: string = 'neo4j'
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/graph/start-indexer', {
      interval,
      batch_size: batchSize,
      kgdb_name: kgdbName
    });
    return response.data;
  }

  /**
   * 停止图数据库索引器
   */
  static async stopIndexer(): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/graph/stop-indexer');
    return response.data;
  }

  /**
   * 获取图数据库索引器状态
   */
  static async getIndexerStatus(): Promise<any> {
    const response = await api.get<any>('/graph/indexer-status');
    return response.data;
  }

  /**
   * 立即运行一次索引
   */
  static async runIndexerNow(
    batchSize?: number,
    kgdbName?: string
  ): Promise<IndexNodesResponse> {
    const request: any = {};
    if (batchSize !== undefined) request.batch_size = batchSize;
    if (kgdbName !== undefined) request.kgdb_name = kgdbName;

    const response = await api.post<IndexNodesResponse>('/graph/run-indexer-now', request);
    return response.data;
  }
}

export default GraphAPI;
