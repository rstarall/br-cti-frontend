// 通用API响应类型
export interface ApiResponse<T = any> {
  message?: string;
  status?: string;
  data?: T;
}

// 聊天相关类型
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatMeta {
  use_graph?: boolean;
  use_web?: boolean;
  db_id?: string;
  history_round?: number;
  system_prompt?: string;
  model_provider?: string;
  model_name?: string;
  server_model_name?: string;
}

export interface ChatRequest {
  query: string;
  meta?: ChatMeta;
  history?: ChatMessage[];
  thread_id?: string;
}

// 召回文档类型
export interface RetrievedDocument {
  type: 'document' | 'graph_node';
  id: string;
  filename?: string;  // 文档类型
  content?: string;   // 文档类型
  name?: string;      // 图谱节点类型
  label?: string;     // 图谱节点类型
}

export interface ChatStreamChunk {
  response?: string;  // 兼容旧版本
  content?: string;   // 后端实际使用的字段
  reasoning_content?: string;
  status: 'searching' | 'generating' | 'reasoning' | 'loading' | 'finished' | 'error' | 'title_generating' | 'title_generated';
  message?: string;
  meta?: ChatMeta;
  thread_id?: string;
  history?: ChatMessage[];
  refs?: any[];
  retrieved_docs?: RetrievedDocument[];  // 召回文档字段
  title?: string;  // 新增：会话标题字段
}

export interface ChatCallRequest {
  query: string;
  meta?: {
    model_provider?: string;
    model_name?: string;
  };
}

export interface ChatCallResponse {
  response: string;
}

export interface ChatModelsResponse {
  models: string[];
}

export interface ChatSession {
  id: string;
  history: ChatMessage[];
  created_at: string;
  updated_at: string;
}

// 知识库相关类型
export interface KnowledgeDatabase {
  id: string;
  db_id: string;
  name: string;
  description: string;
  file_count: number;
  time: string;
  embed_model: string;
  dimension: number;
  meta_info?: any;
  created_at?: string;
}

export interface KnowledgeFile {
  id: string;
  file_id: string;
  database_id: string;
  filename: string;
  path: string;
  file_type: string;
  status: string;
  created_at: string;
  name?: string;
  type?: string;
  size?: string;
  upload_time?: string;
}

export interface CreateDatabaseRequest {
  database_name: string;
  description: string;
  dimension?: number;
}

export interface UploadFileResponse {
  message: string;
  file_path: string;
  db_id: string;
}

export interface ChunkParams {
  chunk_size?: number;
  chunk_overlap?: number;
  use_parser?: boolean;
}

export interface FileToChunkRequest {
  files: string[];
  params: ChunkParams;
}

export interface AddChunksRequest {
  db_id: string;
  file_chunks: any;
}

export interface QueryTestRequest {
  query: string;
  meta: {
    db_id: string;
  };
}

export interface DeleteFileRequest {
  db_id: string;
  file_id: string;
}

export interface FilesListResponse {
  message: string;
  status: string;
  db_id: string;
  files: KnowledgeFile[];
  total_count: number;
}

// 知识图谱相关类型
export interface GraphNode {
  id: string;
  name: string;
  properties?: Record<string, any>;
}

export interface GraphEdge {
  source_id: string;
  target_id: string;
  type: string;
  source: string | GraphNode;
  target: string | GraphNode;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphInfo {
  graph_name: string;
  entity_count: number;
  relationship_count: number;
  embed_model_name: string;
  status: string;
  unindexed_node_count: number;
}

export interface GraphNodesResponse {
  result: GraphData;
  message: string;
}

export interface GraphNodeResponse {
  result: GraphData;
  message: string;
}

export interface AddEntitiesByJsonlRequest {
  file_path: string;
  kgdb_name?: string;
}

export interface IndexNodesRequest {
  kgdb_name?: string;
}

export interface IndexNodesResponse {
  status: string;
  message: string;
  indexed_count?: number;
}
