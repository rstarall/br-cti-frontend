"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import type { BubbleProps } from '@ant-design/x';
import { XProvider, Bubble, Sender } from '@ant-design/x';
import { Avatar, Typography, message, Select, Tag, Dropdown, Button } from 'antd';
import { DeleteOutlined, DatabaseOutlined, PartitionOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useChatStore, Message } from '../stores/chatStore';
import { useKnowledgeStore } from '../stores/knowledgeStore';
import MarkdownRenderer from './Markdown';
import { useAgentStore } from '../stores/agentStore';
import RetrievedDocs from './RetrievedDocs';

const { Option } = Select;

const MemoizedMarkdownRenderer = memo(({ content }: { content: string }) => (
  <Typography>
    <MarkdownRenderer content={content} />
  </Typography>
));

const Chat: React.FC<{ siderWidth: number }> = ({ siderWidth = 300 }) => {
  const [value, setValue] = useState('');
  const conversationsRef = useRef<any>(null);
  const senderRef = useRef<any>(null);
  const containerRef = useRef<any>(null);

  const {
    currentConversationId,
    setCurrentConversationId,
    streamRequest,
    createConversation,
    conversationMessageHistory,
    meta,
    setMeta,
    currentModel,
    availableModels,
    modelProviders,
    fetchModels,
    isInitialized,
    initializeApp,
    titleGenerating
  } = useChatStore();

  const { databases, fetchDatabases } = useKnowledgeStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const prevMessagesRef = useRef<Message[]>([]);

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
      if (!availableModels['deepseek']) {
        try {
          await fetchModels('deepseek');
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

  // 消息更新逻辑 - 当会话ID或消息历史变化时更新
  useEffect(() => {
    if (currentConversationId && conversationMessageHistory[currentConversationId]) {
      const currentMessages = conversationMessageHistory[currentConversationId].messages || [];
      console.log(`更新消息列表，会话ID: ${currentConversationId}, 消息数: ${currentMessages.length}`);

      // 消息变化立即更新
      setMessages([...currentMessages]);

      // 有新消息时，滚动到底部
      autoScrollToBottom();

      // 保存当前消息以备后续比较
      prevMessagesRef.current = [...currentMessages];
    } else if (currentConversationId) {
      console.log(`会话ID ${currentConversationId} 没有对应的消息记录`);
      setMessages([]);
    }
  }, [currentConversationId, conversationMessageHistory, autoScrollToBottom]);

  // 优化提交处理函数
  const handleSubmit = async (content: string) => {
    if (!content.trim()) return;

    let convId = currentConversationId;
    if (!convId) {
      // 创建新会话并确保立即设置
      convId = createConversation('');
      setCurrentConversationId(convId);

      // 立即更新消息列表，确保界面显示欢迎消息
      const welcomeMessages = conversationMessageHistory[convId]?.messages || [];
      setMessages([...welcomeMessages]);
    }

    setValue('');
    try {
      console.log("发送请求到会话:", convId);
      await streamRequest(convId, content);
    } catch (error) {
      console.error('请求失败:', error);
      message.error("请求失败！")
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

  // 处理模型提供商选择
  const handleProviderChange = async (provider: string) => {
    setMeta({ model_provider: provider, model_name: '' });
    if (provider) {
      await fetchModels(provider);
    }
  };



  // 创建模型选择菜单项
  const getModelMenuItems = () => {
    const items: any[] = [];

    modelProviders.forEach(provider => {
      const providerModels = availableModels[provider] || [];
      if (providerModels.length > 0) {
        items.push({
          type: 'group',
          label: provider === 'deepseek' ? 'DeepSeek' : provider.toUpperCase(),
          children: providerModels.map(model => ({
            key: `${provider}-${model}`,
            label: model,
            onClick: () => {
              setMeta({ model_provider: provider, model_name: model });
            }
          }))
        });
      } else {
        // 如果没有加载模型，添加提供商选项来触发加载
        items.push({
          key: provider,
          label: `${provider === 'deepseek' ? 'DeepSeek' : provider.toUpperCase()}`,
          onClick: () => handleProviderChange(provider)
        });
      }
    });

    return items;
  };

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
    console.log(`Message ${msg.id} streaming: ${msg.streaming}, loading: ${msg.loading}`); // 添加调试日志
    return {
      key: msg.id,
      content: msg.content,
      messageRender: (content: string) => messageRenderer(content, msg), // 传递消息对象
      placement: msg.role === 'user' ? 'end' as const : 'start' as const,
      variant: msg.role === 'user' ? 'filled' as const : 'outlined' as const,
      loading: msg.loading,
      typing: msg.role === 'assistant' && msg.streaming === true,
      shape: 'round' as const,
      avatar: msg.role === 'assistant' ? <Avatar>AI</Avatar> : undefined,
      className: 'p-0',
      contentClassName: 'flex justify-center items-center mb-[-12px]', // 使用 contentClassName 来控制内容区域的样式
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

  return (
    <XProvider>
      <div ref={containerRef} className='h-[calc(100vh-50px)] bg-white relative overflow-auto' style={{
        backgroundImage: "url('./Q&A.png')",
        backgroundSize: '85%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <div
          ref={conversationsRef}
          className='bg-white'
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            opacity: 1
          }}
        >
          {/* ChatGPT样式的模型选择器 */}
          <div className="mb-4 flex justify-center">
            <Dropdown
              menu={{ items: getModelMenuItems() }}
              trigger={['click']}
              placement="bottomCenter"
            >
              <Button
                type="text"
                className="flex items-center gap-2 px-6 py-3 text-xl font-semibold hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
                style={{
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  background: 'white'
                }}
              >
                <span>{getCurrentModelDisplay()}</span>
                <CaretDownOutlined className="text-sm opacity-60" />
              </Button>
            </Dropdown>
          </div>

          {/* 功能状态指示 */}
          {(meta.use_graph || meta.db_id || titleGenerating) && (
            <div className="mb-4 flex justify-center">
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
                {titleGenerating && (
                  <>
                    {(meta.use_graph || meta.db_id) && <span>•</span>}
                    <span className="flex items-center gap-1">
                      <span className="animate-spin">⚙️</span>
                      正在生成标题...
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <Bubble.List
            className='bg-white pb-[140px] overflow-hidden'
            items={messages.map((msg) => commonBubble(msg))}
          />

          <div style={{ position: 'absolute', top: 0, right: 0, background: '#f0f0f0', padding: '2px 5px', fontSize: '12px' }}>
            消息数: {messages.length}
          </div>
        </div>

        <div
          className="fixed bottom-[0] right-0 bg-white"
          style={{ padding: '10px', borderTop: '1px solid #eee', width: `calc(100% - ${siderWidth}px)` }}
        >
          {/* Agent显示 */}
          {selectedAgentId && agents.find(a => a.id === selectedAgentId) && (
            <div className='flex items-center gap-2 mb-2'>
              <div className='flex items-center gap-2 border border-2 border-blue-400 hover:border-red-300 pr-2 rounded-md cursor-pointer'
                onMouseEnter={() => setDeleteAgent(true)}
                onMouseLeave={() => setDeleteAgent(false)}
              >
                <span className="text-2xl">{agents.find(a => a.id === selectedAgentId)?.avatar}</span>
                <span className="text-sm font-medium text-gray-700">{agents.find(a => a.id === selectedAgentId)?.name}</span>
                <span className='text-sm text-red-500' style={{ display: deleteAgent ? 'block' : 'none' }}
                  onClick={handleDeleteAgent}
                >
                  <DeleteOutlined />
                </span>
              </div>
            </div>
          )}

          {/* 输入框 */}
          <Sender
            ref={senderRef}
            value={value}
            onChange={setValue}
            onSubmit={handleSubmit}
            placeholder="请输入消息..."
            submitType="enter"
          />

          {/* 功能选择区域 */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {/* 知识库选择 */}
            <div className="flex items-center gap-1">
              <Select
                placeholder="选择知识库"
                allowClear
                size="small"
                style={{ minWidth: 120 }}
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
              {meta.db_id && (
                <Tag color="blue">
                  知识库已选
                </Tag>
              )}
            </div>

            {/* 知识图谱按钮 */}
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full border cursor-pointer transition-all ${meta.use_graph
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              onClick={() => handleGraphToggle(!meta.use_graph)}
            >
              <PartitionOutlined />
              <span className="text-sm">知识图谱</span>
            </div>
          </div>
        </div>
      </div>
    </XProvider>
  );
};

export default Chat;
