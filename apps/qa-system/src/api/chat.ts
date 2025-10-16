import api, { createStreamRequest } from './index';
import {
  ChatRequest,
  ChatStreamChunk,
  ChatCallRequest,
  ChatCallResponse,
  ChatModelsResponse,
  ChatSession,
  ApiResponse,
  ChatSessionListItem,
  ChatSessionDetail,
  ChatMessageItem,
  CreateSessionRequest,
  CreateSessionResponse,
  UpdateSessionRequest,
  GetSessionsResponse
} from './types';

/**
 * 聊天API模块
 */
export class ChatAPI {
  /**
   * 发送流式聊天请求
   */
  static async streamChat(
    request: ChatRequest,
    onChunk: (chunk: ChatStreamChunk) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void> {
    return createStreamRequest(
      '/chat/stream',
      request,
      onChunk,
      onError,
      onComplete
    );
  }

  /**
   * 发送普通聊天请求（非流式）
   */
  static async call(request: ChatCallRequest): Promise<ChatCallResponse> {
    const response = await api.post<ChatCallResponse>('/chat/call', request);
    return response.data;
  }

  /**
   * 获取指定模型提供商的模型列表
   */
  static async getModels(modelProvider: string): Promise<ChatModelsResponse> {
    const response = await api.get<ChatModelsResponse>('/chat/models', {
      params: { model_provider: modelProvider }
    });
    return response.data;
  }

  /**
   * 更新指定模型提供商的模型列表
   */
  static async updateModels(modelProvider: string, modelNames: string[]): Promise<ChatModelsResponse> {
    const response = await api.post<ChatModelsResponse>('/chat/models/update', null, {
      params: {
        model_provider: modelProvider,
        model_names: modelNames
      }
    });
    return response.data;
  }

  // ========== 新增：会话管理接口 ==========

  /**
   * 创建新会话
   */
  static async createSession(userId: number, title?: string, systemPrompt?: string): Promise<CreateSessionResponse> {
    const response = await api.post<CreateSessionResponse>('/chat/sessions/create', {
      user_id: userId,
      title,
      system_prompt: systemPrompt
    });
    return response.data;
  }

  /**
   * 获取用户的所有会话列表
   */
  static async getSessions(userId: number, limit: number = 50, offset: number = 0): Promise<ChatSessionListItem[]> {
    const response = await api.get<GetSessionsResponse>('/chat/sessions', {
      params: { user_id: userId, limit, offset }
    });
    return response.data.sessions || [];
  }

  /**
   * 获取会话详情（含消息历史）
   */
  static async getSessionDetail(threadId: string, userId: number, includeMessages: boolean = true): Promise<ChatSessionDetail> {
    const response = await api.get<{ success: boolean; session: ChatSessionDetail }>(`/chat/sessions/${threadId}`, {
      params: { user_id: userId, include_messages: includeMessages }
    });
    return response.data.session;
  }

  /**
   * 获取会话的消息历史
   */
  static async getSessionMessages(threadId: string, userId: number, limit?: number): Promise<ChatMessageItem[]> {
    const response = await api.get<{ success: boolean; messages: ChatMessageItem[] }>(`/chat/sessions/${threadId}/messages`, {
      params: { user_id: userId, ...(limit && { limit }) }
    });
    return response.data.messages || [];
  }

  /**
   * 更新会话（标题或系统提示词）
   */
  static async updateSession(threadId: string, userId: number, data: UpdateSessionRequest): Promise<ApiResponse> {
    const response = await api.put<ApiResponse>(`/chat/sessions/${threadId}`, {
      user_id: userId,
      ...data
    });
    return response.data;
  }

  /**
   * 删除会话
   * @param threadId 会话ID
   * @param userId 用户ID
   * @param hardDelete 是否物理删除（默认软删除）
   */
  static async deleteSession(threadId: string, userId: number, hardDelete: boolean = false): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/chat/sessions/${threadId}`, {
      params: { user_id: userId, hard_delete: hardDelete }
    });
    return response.data;
  }

  /**
   * 删除单条消息
   */
  static async deleteMessage(threadId: string, messageId: number, userId: number): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/chat/sessions/${threadId}/messages/${messageId}`, {
      params: { user_id: userId }
    });
    return response.data;
  }

  // ========== 兼容旧接口 ==========

  /**
   * 获取指定会话的历史记录（兼容旧版）
   */
  static async getSession(threadId: string): Promise<ChatSession> {
    const response = await api.get<ChatSession>(`/chat/sessions/${threadId}`);
    return response.data;
  }
}

export default ChatAPI;
