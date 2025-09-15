import api, { createStreamRequest } from './index';
import {
  ChatRequest,
  ChatStreamChunk,
  ChatCallRequest,
  ChatCallResponse,
  ChatModelsResponse,
  ChatSession,
  ApiResponse
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
      '/chat/',
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

  /**
   * 获取指定会话的历史记录
   */
  static async getSession(threadId: string): Promise<ChatSession> {
    const response = await api.get<ChatSession>(`/chat/sessions/${threadId}`);
    return response.data;
  }

  /**
   * 删除指定会话
   */
  static async deleteSession(threadId: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/chat/sessions/${threadId}`);
    return response.data;
  }
}

export default ChatAPI;
