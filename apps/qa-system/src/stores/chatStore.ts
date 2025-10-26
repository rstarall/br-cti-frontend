import { create } from 'zustand';
import { persist, type StorageValue } from 'zustand/middleware';
import { useAuthStore } from '@/stores/authStore';
import ChatAPI from '@/api/chat';
import type { ChatSessionListItem, ChatMessageItem } from '@/api/types';

export type RetrievalContext = {
  id: string;
  data: string;
  source: string;
}

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  loading?: boolean;
  reasoning_content?: string;
  refs?: any[];
  retrieved_docs?: any[];
};

export type ChatMeta = {
  use_graph?: boolean;
  db_id?: string;
  history_round?: number;
  system_prompt?: string;
  model_provider?: string;
  model_name?: string;
  use_web?: boolean;
  show_retrieval_info?: boolean;
  search_mode?: 'local' | 'global' | 'hybrid';
  top_k?: number;
  threshold?: number;
  use_deep_thought?: boolean;
};

export type ChatState = {
  // 会话列表（从服务器获取，不持久化）
  sessions: ChatSessionListItem[];
  // 当前会话ID（thread_id）
  currentSessionId: string;
  // 当前会话的消息（仅内存缓存，用于流式更新）
  currentSessionMessages: Message[];
  // 会话配置
  meta: ChatMeta;
  // 模型相关
  currentModel: string;
  availableModels: Record<string, string[]>;
  modelProviders: string[];
  // 系统状态
  isInitialized: boolean;
  sessionsLoading: boolean;
  messagesLoading: boolean;
  
  // === Actions ===
  // 会话管理
  fetchSessions: (userId: number) => Promise<void>;
  createSession: (userId: number, title?: string, systemPrompt?: string) => Promise<string>;
  deleteSession: (threadId: string, userId: number, hardDelete?: boolean) => Promise<void>;
  updateSessionTitle: (threadId: string, userId: number, title: string) => Promise<void>;
  setCurrentSessionId: (threadId: string) => void;
  
  // 消息管理
  deleteMessage: (threadId: string, messageId: number, userId: number) => Promise<void>;
  appendMessage: (msg: Message) => void;
  updateMessage: (id: string, update: string | ((msg: Message) => Message)) => void;
  clearCurrentMessages: () => void;
  
  // 聊天
  streamRequest: (threadId: string, input: string, userId: number) => Promise<void>;
  
  // 模型
  setMeta: (meta: Partial<ChatMeta>) => void;
  setCurrentModel: (model: string) => void;
  fetchModels: (provider: string) => Promise<void>;
  
  // 系统
  initializeApp: () => void;
};
const apiUrl = '/api';

// 辅助函数：从第一条用户消息提取标题（取前20个字符）
const extractTitleFromMessage = (content: string): string => {
  const title = content.trim().slice(0, 20);
  return title.length < content.trim().length ? `${title}...` : title;
};

const useStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // === 初始状态 ===
      sessions: [],
      currentSessionId: '',
      currentSessionMessages: [],
      meta: {
        use_graph: false,
        db_id: '',
        history_round: 5,
        system_prompt: '',
        model_provider: '',
        model_name: '',
        show_retrieval_info: true,
        use_web: false
      },
      currentModel: '',
      availableModels: {},
      modelProviders: ['deepseek', 'openai', 'ollama'],
      isInitialized: false,
      sessionsLoading: false,
      messagesLoading: false,

      // === 会话管理 ===
      fetchSessions: async (userId: number) => {
        try {
          set({ sessionsLoading: true });
          const sessions = await ChatAPI.getSessions(userId);
          
          // 为每个会话生成标题（如果没有）
          const sessionsWithTitles = sessions.map(session => ({
            ...session,
            title: session.title || `会话 ${new Date(session.created_at).toLocaleDateString()}`
          }));
          
          set({ sessions: sessionsWithTitles });
        } catch (error) {
          console.error('获取会话列表失败:', error);
          throw error;
        } finally {
          set({ sessionsLoading: false });
        }
      },

      createSession: async (userId: number, title?: string, systemPrompt?: string) => {
        try {
          const response = await ChatAPI.createSession(userId, title, systemPrompt);
          
          // 创建成功后重新加载会话列表
          await get().fetchSessions(userId);
          
          // 设置为当前会话
          set({
            currentSessionId: response.session_id,
            currentSessionMessages: []
          });
          
          return response.session_id;
        } catch (error) {
          console.error('创建会话失败:', error);
          throw error;
        }
      },

      deleteSession: async (threadId: string, userId: number, hardDelete = false) => {
        try {
          await ChatAPI.deleteSession(threadId, userId, hardDelete);
          
          set((state) => ({
            sessions: state.sessions.filter(s => s.session_id !== threadId),
            currentSessionId: state.currentSessionId === threadId ? '' : state.currentSessionId,
            currentSessionMessages: state.currentSessionId === threadId ? [] : state.currentSessionMessages
          }));
        } catch (error) {
          console.error('删除会话失败:', error);
          throw error;
        }
      },

      updateSessionTitle: async (threadId: string, userId: number, title: string) => {
        try {
          // 验证标题长度（最大 50 字符）
          const MAX_TITLE_LENGTH = 50;
          let validatedTitle = title.trim();
          
          if (validatedTitle.length > MAX_TITLE_LENGTH) {
            console.warn(`标题过长（${validatedTitle.length}字符），已截断至 ${MAX_TITLE_LENGTH} 字符`);
            validatedTitle = validatedTitle.substring(0, MAX_TITLE_LENGTH);
          }
          
          await ChatAPI.updateSession(threadId, userId, { title: validatedTitle });
          
          set((state) => ({
            sessions: state.sessions.map(s =>
              s.session_id === threadId 
                ? { ...s, title: validatedTitle } 
                : s
            )
          }));
        } catch (error) {
          console.error('更新会话标题失败:', error);
          throw error;
        }
      },

      setCurrentSessionId: (threadId: string) => {
        set({ currentSessionId: threadId });
      },

      // === 消息管理 ===
      deleteMessage: async (threadId: string, messageId: number, userId: number) => {
        try {
          await ChatAPI.deleteMessage(threadId, messageId, userId);
          
          set({
            currentSessionMessages: get().currentSessionMessages.filter(
              msg => msg.id !== messageId.toString()
            )
          });
        } catch (error) {
          console.error('删除消息失败:', error);
          throw error;
        }
      },

      appendMessage: (msg: Message) => {
        set({
          currentSessionMessages: [...get().currentSessionMessages, msg]
        });
      },

      updateMessage: (id: string, update: string | ((msg: Message) => Message)) => {
        set({
          currentSessionMessages: get().currentSessionMessages.map(msg =>
            msg.id === id
              ? (typeof update === 'function' ? update(msg) : { ...msg, content: update })
              : msg
          )
        });
      },

      clearCurrentMessages: () => {
        set({ currentSessionMessages: [] });
      },

      // === 模型管理 ===
      setMeta: (newMeta: Partial<ChatMeta>) => {
        set({ meta: { ...get().meta, ...newMeta } });
      },

      setCurrentModel: (model: string) => {
        set({ currentModel: model });
      },

      fetchModels: async (provider: string) => {
        try {
          const response = await fetch(`${apiUrl}/chat/models?model_provider=${provider}`, {
            method: 'GET',
          });

          if (!response.ok) {
            throw new Error(`获取模型列表失败: ${response.status}`);
          }

          const data = await response.json();
          const models = data.models || [];

          set({
            availableModels: {
              ...get().availableModels,
              [provider]: models
            }
          });
        } catch (error) {
          console.error('获取模型列表失败:', error);
        }
      },

      // === 聊天流式请求 ===
      streamRequest: async (threadId: string, input: string, userId: number) => {
        const { appendMessage, updateMessage, meta, updateSessionTitle } = get();
        const isFirstMessage = get().currentSessionMessages.length === 0;

        const userMsg: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: input
        };

        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          streaming: true,
          loading: true
        };

        // 添加用户消息和初始机器人消息
        appendMessage(userMsg);
        appendMessage(botMsg);

        try {
          // 构建meta参数，但不包含user_id
          const cleanMeta: any = {};

          if (meta.use_graph) cleanMeta.use_graph = true;
          if (meta.db_id) cleanMeta.db_id = meta.db_id;
          if (meta.system_prompt) cleanMeta.system_prompt = meta.system_prompt;
          if (meta.model_provider) cleanMeta.model_provider = meta.model_provider;
          if (meta.model_name) cleanMeta.model_name = meta.model_name;
          if (meta.history_round && meta.history_round !== 5) cleanMeta.history_round = meta.history_round;
          if (meta.use_web) cleanMeta.use_web = true;
          if (meta.show_retrieval_info) cleanMeta.show_retrieval_info = true;

          const requestBody: any = {
            query: input,
            user_id: userId, // user_id 移到顶层
            meta: cleanMeta,
            thread_id: threadId
          };

          // 构建历史消息（排除当前正在添加的消息）
          const localHistory = get().currentSessionMessages
            .filter((msg: Message) => !msg.streaming && !msg.loading)
            .slice(-10) // 最近10条
            .map((msg: Message) => ({
                role: msg.role,
                content: msg.content
              }));

          if (localHistory.length > 0) {
            requestBody.history = localHistory;
          }

          const endpoint = '/api/chat/stream';
          console.log('发送聊天请求:', requestBody);

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });

          console.log('响应状态:', response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let finalContent = '';
          let finalRefs: any[] = [];

          while (reader) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.trim()) continue;

              try {
                const data = JSON.parse(line);
                console.log('接收到数据:', data);

                // 保存服务器返回的模型名称
                if (data.meta?.server_model_name) {
                  set({ currentModel: data.meta.server_model_name });
                }

                // 监听标题生成事件
                if (data.status === 'title_generated' && data.title) {
                  updateSessionTitle(threadId, userId, data.title);
                }

                if (data.status === 'searching') {
                  updateMessage(botMsg.id, (msg) => ({
                    ...msg,
                    content: '🔍 正在搜索知识库...',
                    loading: true,
                    streaming: true
                  }));
                } else if (data.status === 'generating') {
                  updateMessage(botMsg.id, (msg) => ({
                    ...msg,
                    content: '💭 正在生成回答...',
                    loading: true,
                    streaming: true
                  }));
                } else if (data.status === 'reasoning') {
                  if (data.reasoning_content) {
                    updateMessage(botMsg.id, (msg) => ({
                      ...msg,
                      reasoning_content: data.reasoning_content,
                      content: '🤔 正在推理...',
                      loading: true,
                      streaming: true
                    }));
                  }
                } else if (data.status === 'loading') {
                  if (data.response || data.content) {
                    finalContent += (data.response || data.content);
                    updateMessage(botMsg.id, (msg) => ({
                      ...msg,
                      content: finalContent,
                      loading: false,
                      streaming: true
                    }));
                  }
                } else if (data.status === 'finished') {
                  // 保存引用
                  if (data.refs) {
                    finalRefs = data.refs;
                  }

                  updateMessage(botMsg.id, (msg) => ({
                    ...msg,
                    content: finalContent || msg.content,
                    refs: finalRefs,
                    retrieved_docs: data.retrieved_docs || [],
                    streaming: false,
                    loading: false
                  }));

                  // 如果是第一条消息，从用户输入提取标题
                  if (isFirstMessage) {
                    const title = extractTitleFromMessage(input);
                    updateSessionTitle(threadId, userId, title);
                  }

                  break;
                } else if (data.status === 'error') {
                  updateMessage(botMsg.id, (msg) => ({
                    ...msg,
                    content: `❌ 错误: ${data.message || '未知错误'}`,
                    streaming: false,
                    loading: false
                  }));
                  break;
                }
              } catch (error) {
                console.error('解析响应数据失败:', error, 'Line:', line);
              }
            }
          }

        } catch (error) {
          console.error('聊天请求失败:', error);
          updateMessage(botMsg.id, (msg) => ({
            ...msg,
            content: '⚠️ 连接服务器失败，请检查服务器是否正常运行',
            streaming: false,
            loading: false
          }));
        }
      },

      initializeApp: () => {
        console.log('初始化聊天应用...');
        set({ isInitialized: true });
      }
    }),
    {
      name: 'chat-storage',
      // 仅持久化必要的状态
      partialize: (state) => ({
        currentSessionId: state.currentSessionId,
        meta: state.meta,
        currentModel: state.currentModel,
        availableModels: state.availableModels
      })
    }
  )
);

export const useChatStore = useStore;