import api from './api';
import { ChatRequest, ChatResponse, ConversationListResponse, DeleteConversationResponse } from './types/chat';

/**
 * Chat API functions
 */
export const chatApi = {
  /**
   * Send a message to the chat API (non-streaming)
   * @param message User message
   * @param conversationId Optional conversation ID
   * @param useCtiLibrary Whether to use CTI library for context
   * @returns Promise with chat response
   */
  sendMessage: async (
    message: string,
    conversationId?: string,
    useCtiLibrary: boolean = false
  ): Promise<ChatResponse> => {
    const request: ChatRequest = {
      message,
      conversation_id: conversationId,
      use_cti_library: useCtiLibrary
    };

    const response = await api.post('/chat', request);
    return response.data;
  },

  /**
   * Get the URL for streaming chat responses
   * @returns The streaming API URL
   */
  getStreamUrl: (): string => {
    // Get server hosts from localStorage with defaults
    const clientServerHost = localStorage.getItem('clientServerHost') || 'http://127.0.0.1:5000';
    return `${clientServerHost}/chat/stream`;
  },

  /**
   * Get list of conversations
   * @returns Promise with conversation list
   */
  getConversations: async (): Promise<ConversationListResponse> => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  /**
   * Delete a conversation
   * @param conversationId Conversation ID to delete
   * @returns Promise with delete response
   */
  deleteConversation: async (conversationId: string): Promise<DeleteConversationResponse> => {
    const response = await api.delete(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  /**
   * Rename a conversation
   * @param conversationId Conversation ID to rename
   * @param title New title for the conversation
   * @returns Promise with update response
   */
  renameConversation: async (conversationId: string, title: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/chat/conversations/${conversationId}`, { title });
    return response.data;
  }
};