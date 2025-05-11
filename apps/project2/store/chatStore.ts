import { create } from 'zustand';
import { persist, type StorageValue } from 'zustand/middleware';

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
  retrievalContexts?: RetrievalContext[];
};

export type Conversation = {
  id: string;
  title: string;
  time: string;
};

// 分离会话记录和消息
export type ConversationMessages = {
  messages: Message[];
};

export type ChatState = {
  apiUrl: string;
  currentConversationId: string;
  conversationHistory: Record<string, Conversation>;
  conversationMessageHistory: Record<string, ConversationMessages>;
  setApiUrl: (url: string) => void;
  setCurrentConversationId: (id: string) => void;
  createConversation: (title: string) => string;
  resetConversationId: (oldId: string,newId: string) => void;
  resetConversationTitle: (conversationId: string, title: string) => void;
  deleteConversation: (conversationId: string) => boolean;
  appendMessage: (conversationId: string, msg: Message) => void;
  updateMessage: (conversationId: string, id: string, update: string | ((msg: Message) => Message)) => void;
  streamRequest: (conversationId: string, input: string, useCtiLibrary?: boolean) => Promise<void>;
};

const useStore = create<ChatState>()(
  persist(
    (set, get) => ({
      apiUrl: 'http://localhost:8000/chat/stream',
      conversationHistory: {},
      conversationMessageHistory: {},
      currentConversationId: '',
      setApiUrl: (url) => set({ apiUrl: url }),
      setCurrentConversationId: (id: string) => set({ currentConversationId: id }),
      createConversation: (title) =>{
        const conversationId = Date.now().toString();
        const welcomeMsg = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '您好！我是B&R威胁情报助手，有什么可以帮助您的吗？'
        } as Message;
        set({
          conversationHistory: {
            ...get().conversationHistory,
            [conversationId]: {
              id: conversationId,
              title: title,
              time: new Date().getTime().toString(),
            }
          },
          conversationMessageHistory: {
            ...get().conversationMessageHistory,
            [conversationId]: {
              messages: []
            }
          }
        });
        set({currentConversationId: conversationId});
        return conversationId;
      },
      resetConversationTitle: (conversationId, title) => {
        set({
          conversationHistory: {
            ...get().conversationHistory,
            [conversationId]: {
              ...get().conversationHistory[conversationId],
              title
            }
          }
        });
      },
      deleteConversation: (conversationId) => {
        set({
          conversationHistory: Object.fromEntries(
            Object.entries(get().conversationHistory).filter(([id]) => id !== conversationId)
          ),
          conversationMessageHistory: Object.fromEntries(
            Object.entries(get().conversationMessageHistory).filter(([id]) => id !== conversationId)
          )
        });
        return true;
      },
      appendMessage: (conversationId, msg) =>
        set({
          conversationMessageHistory: {
            ...get().conversationMessageHistory,
            [conversationId]: {
              messages: [...(get().conversationMessageHistory[conversationId]?.messages || []), msg]
            }
          }
        }),
      resetConversationId: (oldId: string,newId: string) => {
        const conversationHistory = get().conversationHistory;
        const oldConversation = conversationHistory[oldId];
        const oldConversationMessages = get().conversationMessageHistory[oldId];
        if (oldConversation) {
          delete conversationHistory[oldId];
          set({
            conversationHistory: {
              ...conversationHistory,
              [newId]: {
                ...oldConversation,
                id: newId
              }
            },
            conversationMessageHistory: {
              ...get().conversationMessageHistory,
              [newId]: {
                ...oldConversationMessages
              }
            }
          });
          set({currentConversationId: newId});
        }
      },
      updateMessage: (conversationId, id, update) =>
        set({
          conversationMessageHistory: {
            ...get().conversationMessageHistory,
            [conversationId]: {
              ...get().conversationMessageHistory[conversationId],
              messages: get().conversationMessageHistory[conversationId]?.messages.map(msg =>
                msg.id === id
                  ? (typeof update === 'function' ? update(msg) : { ...msg, content: update })
                  : msg
              ) || []
            }
          }
        }),
      streamRequest: async (conversationId, input, useCtiLibrary = false) => {
        const { apiUrl, appendMessage, updateMessage, resetConversationId, resetConversationTitle } = get();
        const userMsg = {
          id: Date.now().toString(),
          role: 'user' as const,
          content: input
        };
        const botMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: '',
          streaming: true,
          loading: true
        };

        // 添加消息到状态
        appendMessage(conversationId, userMsg);
        appendMessage(conversationId, botMsg);

        function parseJsonData(data: string) {
          // 只匹配最外层的JSON对象，不匹配嵌套的JSON
          const regex = /\{(?:[^{}]|(?:\\{)|(?:\\}))*\}/g;
          let match;
          let results = [];

          try {
            //解析成功直接返回
            const jsonData = JSON.parse(data);
            results.push(jsonData);
            return results;

          } catch (e) {

            while ((match = regex.exec(data)) !== null) {
              try {
                // 预处理JSON字符串，处理转义字符
                let jsonStr = match[0];
                // 替换转义的引号和换行符
                jsonStr = jsonStr.replace(/\\"/g, '"')
                                 .replace(/\\n/g, '\n')
                                 .replace(/\\\\/g, '\\');

                try {
                  const jsonData = JSON.parse(jsonStr);
                  results.push(jsonData);
                } catch (innerError) {
                  // 如果解析失败，尝试提取字符串内容而不是解析JSON
                  console.warn('JSON解析失败，尝试作为纯文本处理:', jsonStr);
                  results.push({ content: jsonStr });
                }
              } catch (e) {
                console.error('处理JSON字符串失败:', match[0]);
                // 不抛出异常，继续处理下一个匹配项
                throw e;
              }
            }

          }

          return results;
        }

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              message: input,
              conversation_id: conversationId,
              use_cti_library: useCtiLibrary
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          // 设置一个标志表示是否已完成
          let isCompleted = false;

          while (reader && !isCompleted) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // 使用正则表达式匹配完整的SSE数据行
            const regex = /data:\s*(.*?)(?=\n(?:data:|event:|$)|\n\n|$)/g;
            let match;
            let processedBuffer = '';
            let lastIndex = 0;

            while ((match = regex.exec(buffer)) !== null) {
              const data = match[1].trim();
              lastIndex = match.index + match[0].length;

              if (data === '[DONE]') {
                isCompleted = true;
                break;
              }
              try {
                // 处理会话ID返回
                if (data.startsWith('[conversation_id]:')) {
                  const returnedConversationId = data.substring('[conversation_id]:'.length).trim();
                  console.log('服务器返回会话ID:', returnedConversationId);
                  // 如果需要，可以在这里更新会话ID
                  resetConversationId(conversationId, returnedConversationId);
                  conversationId = returnedConversationId;
                  continue;
                }
              } catch (e) {
                console.error('解析会话ID失败:', data, e);
              }

              try{

                if(data.startsWith('[conversation_title]:')){
                  const returnedConversationTitle = data.substring('[conversation_title]:'.length).trim();
                  console.log('服务器返回会话Title:', returnedConversationTitle);
                  // 如果需要，可以在这里更新会话Title
                  resetConversationTitle(conversationId, returnedConversationTitle);
                  continue;
                }

              }catch(e){
                console.error('解析会话Title失败:', data, e);
              }
              try{
                //处理retrievalContexts
                if(data.startsWith('[rag_context]:')){
                  const returnedRetrievalContexts = data.substring('[rag_context]:'.length).trim();
                  console.log('服务器返回RAG相关信息:', returnedRetrievalContexts);
                  const retrievalContexts = JSON.parse(returnedRetrievalContexts);
                  if(retrievalContexts.length > 0){
                    updateMessage(conversationId, botMsg.id, msg => ({
                      ...msg,
                      retrievalContexts: retrievalContexts
                    }));
                  }
                  continue;
                }
              }catch(e){
                console.error('解析RAG相关信息失败:', data, e);
              }

              try {
                // 尝试解析JSON
                const jsonObjList = parseJsonData(data)

                for (const jsonObj of jsonObjList) {

                  const obj_type = typeof jsonObj;
                  let obj_content = "";

                  if(obj_type === "object"){
                    if(jsonObj.type=="conversation"&&jsonObj.data != undefined){
                      //只返回流式会话
                      obj_content = jsonObj.data;
                    }else if(jsonObj.type=="conversation_full"&&jsonObj.data != undefined){
                      //全部会话数据的处理
                      // 不处理完整会话数据
                    }
                  }else{
                    obj_content = JSON.stringify(jsonObj);
                  }

                  // 只有当有内容时才更新消息
                  if (obj_content) {
                    updateMessage(conversationId, botMsg.id, msg => ({
                      ...msg,
                      loading: false,
                      content: msg.content + obj_content
                    }));
                  }
                }
              } catch (e) {
                // 如果不是JSON，直接使用原始数据
                if (data && data !== '[DONE]') {
                  updateMessage(conversationId, botMsg.id, msg => ({
                    ...msg,
                    loading: false,
                    content: msg.content + data
                  }));
                }
              }

              processedBuffer += match[0];
            }

            // 保留未处理的部分为新的缓冲区
            if (lastIndex > 0) {
              buffer = buffer.substring(lastIndex);
            }
          }

          // 处理最后可能剩余的缓冲区数据
          if (buffer.trim()) {
            const dataMatch = buffer.match(/data:\s*(.*)/);
            if (dataMatch && dataMatch[1] && dataMatch[1] !== '[DONE]') {
              try {
                const jsonData = JSON.parse(dataMatch[1].trim());
                let content = '';

                if (jsonData.content) {
                  content = jsonData.content;
                } else if (jsonData.text) {
                  content = jsonData.text;
                } else if (jsonData.choices && jsonData.choices[0]?.delta?.content) {
                  content = jsonData.choices[0].delta.content;
                }

                if (content) {
                  updateMessage(conversationId, botMsg.id, msg => ({
                    ...msg,
                    content: msg.content + content
                  }));
                }
              } catch (e) {
                // 不是JSON，使用原始内容
                updateMessage(conversationId, botMsg.id, msg => ({
                  ...msg,
                  content: msg.content + dataMatch[1].trim()
                }));
              }
            }
          }

          // 更新最终状态
          updateMessage(conversationId, botMsg.id, msg => ({
            ...msg,
            streaming: false,
            loading: false
          }));
        } catch (error) {
          updateMessage(conversationId, botMsg.id, msg => ({
            ...msg,
            content: '⚠️ 连接服务器失败',
            streaming: false,
            loading: false
          }));
          console.error('流式传输错误:', error);
          throw new Error(`HTTP error! status: ${error}`);
        }
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        apiUrl: state.apiUrl,
        conversationHistory: state.conversationHistory
      }),
      storage: typeof window !== 'undefined' ? {
        getItem: (name): StorageValue<{ apiUrl: string, conversationHistory: Record<string, Conversation> }> | null => {
          try {
            const str = localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          } catch (err) {
            console.warn('存储访问失败:', err);
            return null;
          }
        },
        setItem: (name, value: StorageValue<{ apiUrl: string, conversationHistory: Record<string, Conversation> }>) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (err) {
            console.warn('存储写入失败:', err);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (err) {
            console.warn('存储删除失败:', err);
          }
        }
      } : undefined
    }
  )
);

export const useChatStore = useStore;