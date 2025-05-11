// Chat API Types

export interface RetrievalContext {
  id: string;
  data: string;
  source: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  retrievalContexts?: RetrievalContext[];
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  use_cti_library?: boolean;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  conversation_title?: string;
  retrievalContexts?: RetrievalContext[];
}

export interface ConversationInfo {
  id: string;
  title: string;
  time: string;
}

export interface ConversationListResponse {
  conversations: ConversationInfo[];
}

export interface DeleteConversationResponse {
  success: boolean;
  message: string;
}
