"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import type { BubbleProps } from '@ant-design/x';
import { XProvider, Bubble, Sender } from '@ant-design/x';
import { Avatar, Typography, message, Select, Tag, Dropdown, Button, Switch, Popover, Tooltip } from 'antd';
import { DeleteOutlined, DatabaseOutlined, PartitionOutlined, CaretDownOutlined, PlusOutlined, FileSearchOutlined, MenuUnfoldOutlined, CheckOutlined } from '@ant-design/icons';
import { useChatStore, Message } from '../stores/chatStore';
import { useKnowledgeStore } from '../stores/knowledgeStore';
import { useAuthStore } from '../stores/authStore';
import MarkdownRenderer from './Markdown';
import { useAgentStore } from '../stores/agentStore';
import RetrievedDocs from './RetrievedDocs';
import ChatAPI from '@/api/chat';
import { useUIStore } from '@/stores/uiStore';
import { usePathname } from 'next/navigation';
import { useFixedSiderWidth } from './ClientLayout';


const { Option } = Select;

const MemoizedMarkdownRenderer = memo(({ content }: { content: string }) => (
  <Typography>
    <MarkdownRenderer content={content} />
  </Typography>
));

// // Thinking 组件
// const ThinkingComponent = memo(() => (
//   <div className="flex items-center gap-2 text-gray-500">
//     <div className="flex space-x-1">
//       <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
//       <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
//       <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
//     </div>
//     <span className="text-sm">Thinking...</span>
//   </div>
// ));

const Chat: React.FC = () => {
  const [value, setValue] = useState('');
  const [toolsOpen, setToolsOpen] = useState(false);
  const conversationsRef = useRef<any>(null);
  const senderRef = useRef<any>(null);
  const containerRef = useRef<any>(null);
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { width: fixedSiderWidth } = useFixedSiderWidth();
  const pathname = usePathname();

  const showSideContainer = pathname.startsWith('/chat');
  const sessionSiderWidth = showSideContainer && !isSidebarCollapsed ? fixedSiderWidth : 0;
  const iconSiderWidth = 50;
  const totalSiderWidth = iconSiderWidth + sessionSiderWidth;

  const {
    currentSessionId,
    setCurrentSessionId,
    streamRequest,
    createSession,
    currentSessionMessages,
    meta,
    setMeta,
    currentModel,
    availableModels,
    modelProviders,
    fetchModels,
    isInitialized,
    initializeApp,
    fetchSessions,
    appendMessage,
    updateMessage,
  } = useChatStore();

  // 获取用户ID
  const { user } = useAuthStore();

  const { databases, fetchDatabases } = useKnowledgeStore();

  // 当前选中的Agent
  const { agents, selectedAgentId, selectAgent } = useAgentStore();
  const [deleteAgent, setDeleteAgent] = useState(false);

  // 初始化知识库数据
  useEffect(() => {
    if (databases.length === 0) {
      fetchDatabases().catch(console.error);
    }
  }, [databases.length, fetchDatabases]);

  // 初始化时获取默认模型提供商的模型列表
  useEffect(() => {
    const initializeModels = async () => {
      // 只获取deepseek的模型列表
      if (!availableModels['deepseek'] && !availableModels['openai'] && !availableModels['ollama']) {
        try {
          await fetchModels('deepseek');
          await fetchModels('openai');
          await fetchModels('ollama');
        } catch (error) {
          console.error('获取deepseek模型列表失败:', error);
        }
      }
    };

    initializeModels();
  }, []);  // 只在组件初始化时运行

  // 定义滚动函数
  const autoScrollToBottom = useCallback(() => {
    // 延迟 100ms 后执行
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 100);
  }, []);

  // 应用初始化 - 只在组件首次加载时执行一次
  useEffect(() => {
    if (!isInitialized) {
      console.log('Chat组件：开始初始化应用');
      initializeApp();
    }
  }, [isInitialized, initializeApp]);

  // 消息更新逻辑 - 当会话ID或消息变化时更新
  useEffect(() => {
    if (currentSessionId && Array.isArray(currentSessionMessages) && currentSessionMessages.length > 0) {
      console.log(`更新消息列表，会话ID: ${currentSessionId}, 消息数: ${currentSessionMessages.length}`);

      // 消息变化立即更新
      // setMessages([...currentSessionMessages]); // This line is removed

      // 有新消息时，滚动到底部
      autoScrollToBottom();

      // 保存当前消息以备后续比较
      // prevMessagesRef.current = [...currentSessionMessages]; // This line is removed
    } else if (currentSessionId) {
      console.log(`会话ID ${currentSessionId} 没有消息`);
      // setMessages([]); // This line is removed
    }
  }, [currentSessionId, currentSessionMessages, autoScrollToBottom]);

  // 当切换会话时，加载消息历史
  useEffect(() => {
    // 只有当存在会话ID和用户ID时才加载
    if (currentSessionId && user?.userId) {
      console.log('准备加载会话消息历史:', currentSessionId);
      
      // 直接调用API，不再通过store action
      ChatAPI.getSessionMessages(currentSessionId, Number(user.userId))
        .then(messages => {
          const formattedMessages: Message[] = messages.map((msg, index) => ({
            id: `${msg.timestamp}-${index}`, // 使用 timestamp 和 index 生成唯一ID
            role: msg.role,
            content: msg.content
          }));
          // 直接更新store状态
          useChatStore.setState({ currentSessionMessages: formattedMessages });
        })
        .catch((error: any) => {
          console.error('加载消息失败:', error);
          
          // 如果是 404 错误，说明会话不存在
          if (error?.response?.status === 404) {
            message.warning('会话不存在或已删除');
            // 同时清空本地状态
            useChatStore.setState({ currentSessionMessages: [] });
          } else {
            message.error('无法加载聊天记录');
          }
        });
    }
    // 移除 fetchSessionMessages 的依赖，因为它来自 store 是稳定的
  }, [currentSessionId, user?.userId]);

  // 优化提交处理函数
  const handleSubmit = async (content: string) => {
    if (!content.trim()) return;

    if (!user?.userId) {
      message.error('请先登录');
      return;
    }

    // 深度思考模式
    if (meta.use_deep_thought) {
      if (!meta.db_id) {
        message.error('深度思考模式需要选择一个知识库');
        return;
      }

      let sessionId = currentSessionId;
      let isNewSession = false;
      if (!sessionId) {
        try {
          sessionId = await createSession(Number(user.userId), undefined, meta.system_prompt);
          setCurrentSessionId(sessionId);
          isNewSession = true;
        } catch (error) {
          console.error('创建会话失败:', error);
          message.error('创建会话失败');
          return;
        }
      }

      setValue('');

      // 在添加新消息前，捕获当前的历史记录
      const history = isNewSession ? [] : [...currentSessionMessages];

      const userMessage: Message = {
        id: `${Date.now()}-user`,
        role: 'user',
        content,
      };
      appendMessage(userMessage);

      const assistantMessageId = `${Date.now()}-assistant`;
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '正在进行深度思考...',
        loading: true,
      };
      appendMessage(assistantMessage);
      autoScrollToBottom();

      try {
        const response = await ChatAPI.hybridRetrieval(content, meta, history, sessionId);

        if (response.status === 'success' && response.generated_answer.content) {
          const finalContent = `#### 检索总结\n${response.retrieval_summary || '无可用总结'}\n\n---\n\n#### 生成答案\n${response.generated_answer.content}`;
          updateMessage(assistantMessageId, (msg) => ({
            ...msg,
            content: finalContent,
            loading: false,
          }));
        } else {
          updateMessage(assistantMessageId, (msg) => ({
            ...msg,
            content: `深度思考失败: ${response.generated_answer.error || '未知错误'}`,
            loading: false,
          }));
        }
      } catch (error: any) {
        console.error('深度思考请求失败:', error);
        const errorMsg = error.response?.data?.detail || error.message || '未知错误';
        message.error(`深度思考请求失败: ${errorMsg}`);
        updateMessage(assistantMessageId, (msg) => ({
          ...msg,
          content: `深度思考请求失败: ${errorMsg}`,
          loading: false,
        }));
      } finally {
        autoScrollToBottom();
      }
      return; // 结束深度思考模式的执行
    }

    // --- 原有的流式请求逻辑 ---
    let sessionId = currentSessionId;

    // 如果没有当前会话，创建新会话
    if (!sessionId) {
      try {
        sessionId = await createSession(Number(user.userId), undefined, meta.system_prompt);
        setCurrentSessionId(sessionId);
      } catch (error) {
        console.error('创建会话失败:', error);
        message.error('创建会话失败');
        return;
      }
    }

    setValue('');
    try {
      console.log("发送请求到会话:", sessionId);
      await streamRequest(sessionId, content, Number(user.userId));
    } catch (error) {
      console.error('请求失败:', error);
      message.error("请求失败！");
    }
  };

  // 处理知识库选择
  const handleDatabaseChange = (value: string) => {
    // 根据选择的数据库ID，查找对应的db_id
    const selectedDb = databases.find(db => db.id === value);
    if (selectedDb) {
      console.log('选择知识库:', selectedDb.name, '数据库ID:', selectedDb.db_id);
      setMeta({ db_id: selectedDb.db_id }); // 使用db_id而不是id
    } else {
      console.log('清除知识库选择');
      setMeta({ db_id: '' });
    }
  };

  // 处理知识图谱开关
  const handleGraphToggle = (checked: boolean) => {
    setMeta({ use_graph: checked });
  };

  // 处理 Web 搜索开关
  const handleWebSearchToggle = (checked: boolean) => {
    setMeta({ use_web: checked });
  };

  // 处理模型提供商选择
  const handleProviderChange = async (provider: string) => {
    setMeta({ model_provider: provider, model_name: '' });
    if (provider) {
      await fetchModels(provider);
    }
  };

  // 创建模型选择菜单项 (新版本)
  const renderModelMenu = () => (
    <div className="bg-white rounded-lg shadow-lg w-64 p-2 border border-gray-200">
      <div className="px-3 py-2 text-sm text-gray-500">选择模型</div>
      {modelProviders.map(provider => {
      const providerModels = availableModels[provider] || [];
        if (providerModels.length === 0) return null;
        
        // 简单的模型描述
        const modelDescriptions: Record<string, string> = {
          'deepseek-chat': '快速提供全方位的帮助',
          'deepseek-coder': '推理、数学和编码',
        };

        return (
          <div key={provider}>
            {modelProviders.length > 1 && <div className="px-3 py-2 mt-2 text-xs font-semibold text-gray-400 uppercase">{provider}</div>}
            {providerModels.map(model => {
              const isSelected = meta.model_provider === provider && meta.model_name === model;
              return (
                <div
                  key={`${provider}-${model}`}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setMeta({ model_provider: provider, model_name: model });
                  }}
                >
                  <div>
                    <div className="text-sm font-medium text-gray-800">{model}</div>
                    <div className="text-xs text-gray-500">{modelDescriptions[model] || '通用模型'}</div>
                  </div>
                  {isSelected && <CheckOutlined className="text-blue-500" />}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  // 获取当前显示的模型名称
  const getCurrentModelDisplay = () => {
    if (meta.model_name && meta.model_provider) {
      if (meta.model_provider === 'deepseek') {
        return `DeepSeek ${meta.model_name}`;
      }
      return `${meta.model_provider.toUpperCase()} ${meta.model_name}`;
    }
    if (currentModel) {
      return currentModel;
    }
    return 'DeepSeek-chat';
  };

  // 使用 useMemo 缓存消息渲染函数
  const messageRenderer = useMemo(() => {
    return (content: string, msg?: Message) => {
      // 添加调试信息
      if (msg?.retrieved_docs && msg.retrieved_docs.length > 0) {
        console.log('渲染召回文档:', msg.retrieved_docs);
      }

      // // 如果是思考状态，显示Thinking组件
      // if (content === '🤔 Thinking...' && msg?.loading) {
      //   return <ThinkingComponent />;
      // }

      return (
        <div>
          {/* 召回信息显示 */}
          {msg?.retrieved_docs && msg.retrieved_docs.length > 0 && (
            <RetrievedDocs documents={msg.retrieved_docs} />
          )}
          {/* 消息内容 */}
          <MemoizedMarkdownRenderer content={content} />
        </div>
      );
    };
  }, []);

  // 优化 commonBubble，添加 Markdown 到依赖数组
  const commonBubble = useCallback((msg: Message) => {
    const isUser = msg.role === 'user';
    console.log(`Message ${msg.id} streaming: ${msg.streaming}, loading: ${msg.loading}`); // 添加调试日志
    return {
      key: msg.id,
      content: msg.content,
      messageRender: (content: string) => messageRenderer(content, msg), // 传递消息对象
      placement: isUser ? 'end' as const : 'start' as const,
      variant: isUser ? 'filled' as const : 'outlined' as const,
      loading: msg.loading,
      typing: msg.role === 'assistant' && msg.streaming === true,
      shape: 'round' as const,
      avatar: msg.role === 'assistant' ? <Avatar>AI</Avatar> : undefined,
      className: 'p-0',
      contentClassName: `${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2 shadow-sm max-w-[720px]`,
    } as BubbleProps;
  }, [messageRenderer]);

  // 删除当前选中的Agent
  const handleDeleteAgent = () => {
    // 删除当前选中的Agent
    const currentAgent = agents.find(a => a.id === selectedAgentId);
    if (currentAgent) {
      selectAgent("");
    }
  };

  const handleDeepThoughtSelect = () => {
    setMeta({ use_deep_thought: true });
    setToolsOpen(false);
  };

  const toolsContent = (
    <div className="w-72">
      <div className="p-2">
        <div
          className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer"
          onClick={handleDeepThoughtSelect}
        >
          <FileSearchOutlined className="mr-3 text-gray-600" />
          <span className="text-sm text-gray-800">深度思考</span>
        </div>
      </div>
      <div className="border-t border-gray-200 mx-2 my-1"></div>
      <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">开启 Web 搜索</span>
          <Switch size="small" checked={!!meta.use_web} onChange={handleWebSearchToggle} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">知识图谱</span>
          <Switch size="small" checked={!!meta.use_graph} onChange={handleGraphToggle} />
        </div>
        <div>
          <span className="text-sm text-gray-700 mb-2 block">选择知识库</span>
          <Select
            placeholder="选择知识库"
            allowClear
            size="small"
            style={{ width: '100%' }}
            value={databases.find(db => db.db_id === meta.db_id)?.id || undefined}
            onChange={handleDatabaseChange}
            suffixIcon={<DatabaseOutlined />}
          >
            {databases.map(db => (
              <Option key={db.id} value={db.id}>
                {db.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <XProvider>
      <div ref={containerRef} className='h-[calc(100vh-50px)] bg-white w-full flex flex-col'>
        {/* Header bar that spans full width */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md py-4 border-b border-gray-200 w-full">
          <div className="w-full px-4 flex justify-between items-center">
            <Dropdown
              dropdownRender={renderModelMenu}
              trigger={['click']}
              placement="bottomLeft"
            >
              <Button
                type="text"
                className="flex items-center gap-2 px-5 py-2.5 text-4xl font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
              >
                <span>{getCurrentModelDisplay()}</span>
              </Button>
            </Dropdown>
            <div className="text-sm text-gray-500">
              消息数: {Array.isArray(currentSessionMessages) ? currentSessionMessages.length : 0}
            </div>
          </div>
          </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto pb-32">
          {isSidebarCollapsed && (
            <Tooltip title="展开菜单">
              <Button
                type="text"
                shape="circle"
                icon={<MenuUnfoldOutlined />}
                onClick={toggleSidebar}
                className="absolute top-4 left-4 z-20" 
              />
            </Tooltip>
          )}

          {Array.isArray(currentSessionMessages) && currentSessionMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <h1 className="text-5xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    你好, {user?.username || '用户'}
                  </span>
                </h1>
                <p className="mt-4 text-2xl text-gray-400">今天有什么可以帮你的吗？</p>
              </div>
            </div>
          ) : (
            <div
              ref={conversationsRef}
              className='bg-white w-full max-w-3xl mx-auto px-4 flex flex-col'
            >
          {/* 功能状态指示 */}
              {(meta.use_graph || meta.db_id) && (
                <div className="my-4 flex justify-center">
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {meta.use_graph && (
                  <span className="flex items-center gap-1">
                    <PartitionOutlined />
                    知识图谱
                  </span>
                )}
                {meta.use_graph && meta.db_id && <span>•</span>}
                {meta.db_id && (
                  <span className="flex items-center gap-1">
                    <DatabaseOutlined />
                    {databases.find(db => db.db_id === meta.db_id)?.name || '知识库'}
                  </span>
                )}
              </div>
            </div>
          )}

          <Bubble.List
                className='bg-white pb-8'
                items={Array.isArray(currentSessionMessages) ? currentSessionMessages.map((msg) => commonBubble(msg)) : []}
          />
            </div>
          )}
          </div>
        </div>

        <div
        className="fixed bottom-0 bg-transparent"
        style={{ width: `calc(100% - ${totalSiderWidth}px)`, left: `${totalSiderWidth}px` }}
      >
        <div className="mx-auto max-w-3xl p-4">
          <div className="relative flex items-center w-full p-1 bg-white border border-gray-200 rounded-full shadow-sm">
            <Popover content={toolsContent} trigger="click" placement="topLeft" open={toolsOpen} onOpenChange={setToolsOpen}>
              <Button type="primary" shape="circle" icon={<PlusOutlined />} className="m-1" />
            </Popover>
            
            {meta.use_deep_thought && (
              <Tag
                closable
                onClose={() => setMeta({ use_deep_thought: false })}
                className="flex items-center m-1"
                icon={<FileSearchOutlined/>}
                color="processing"
              >
                深度思考
              </Tag>
            )}

            <div className="flex-1">
          <Sender
            ref={senderRef}
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
                placeholder={meta.use_deep_thought ? "" : "问问我..."}
            submitType="enter"
                style={{
                  '--ant-input-bg-color': 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      </div>
    </XProvider>
  );
};

export default Chat;
