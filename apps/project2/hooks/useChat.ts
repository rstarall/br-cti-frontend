import { useState, useCallback, useEffect } from 'react';
import { useChatStore, Message, Conversation } from '@/store/chatStore';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { message } from 'antd';

export interface ChatHookState {
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: string;
  isLoading: boolean;
  error: string | null;
}

export interface ChatHookActions {
  sendMessage: (content: string, useCtiLibrary?: boolean) => Promise<void>;
  createConversation: (title?: string) => string;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => boolean;
  renameConversation: (id: string, title: string) => void;
}

export function useChat(): [ChatHookState, ChatHookActions] {
  const {
    currentConversationId,
    conversationHistory,
    conversationMessageHistory,
    createConversation: storeCreateConversation,
    setCurrentConversationId,
    deleteConversation: storeDeleteConversation,
    resetConversationTitle,
    streamRequest
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取当前会话的消息
  const getCurrentMessages = useCallback(() => {
    if (!currentConversationId || !conversationMessageHistory[currentConversationId]) {
      return [];
    }
    return conversationMessageHistory[currentConversationId].messages;
  }, [currentConversationId, conversationMessageHistory]);

  // 获取所有会话
  const getConversations = useCallback(() => {
    return Object.values(conversationHistory).sort((a, b) => 
      parseInt(b.time) - parseInt(a.time)
    );
  }, [conversationHistory]);

  // 发送消息
  const sendMessage = useCallback(async (content: string, useCtiLibrary = false) => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 如果没有当前会话，创建一个新会话
      let conversationId = currentConversationId;
      if (!conversationId) {
        conversationId = createConversation();
      }
      
      // 使用 store 的 streamRequest 发送消息
      await streamRequest(conversationId, content, useCtiLibrary);
    } catch (err: any) {
      setError(err.message || '发送消息失败');
      message.error('发送消息失败: ' + (err.message || '未知错误'));
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, streamRequest]);

  // 创建新会话
  const createConversation = useCallback((title?: string) => {
    const defaultTitle = `新会话 ${formatDistanceToNow(new Date(), { locale: zhCN, addSuffix: true })}`;
    return storeCreateConversation(title || defaultTitle);
  }, [storeCreateConversation]);

  // 选择会话
  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, [setCurrentConversationId]);

  // 删除会话
  const deleteConversation = useCallback((id: string) => {
    return storeDeleteConversation(id);
  }, [storeDeleteConversation]);

  // 重命名会话
  const renameConversation = useCallback((id: string, title: string) => {
    resetConversationTitle(id, title);
  }, [resetConversationTitle]);

  // 状态
  const state: ChatHookState = {
    messages: getCurrentMessages(),
    conversations: getConversations(),
    currentConversationId,
    isLoading,
    error
  };

  // 操作
  const actions: ChatHookActions = {
    sendMessage,
    createConversation,
    selectConversation,
    deleteConversation,
    renameConversation
  };

  return [state, actions];
}
