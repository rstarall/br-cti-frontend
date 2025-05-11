'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Spin, Switch, Tooltip } from 'antd';
import { SendOutlined, DatabaseOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { CTISidebar } from '@/components/chat/CTISidebar';
import { MessageItem } from '@/components/chat/MessageItem';
import { useChat } from '@/hooks/useChat';

export default function ChatPage() {
  // 使用自定义 hook 获取聊天状态和操作
  const [
    { messages, conversations, isLoading },
    { sendMessage, createConversation }
  ] = useChat();

  const [inputText, setInputText] = useState('');
  const [useCTILibrary, setUseCTILibrary] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 如果没有当前会话，创建一个新会话
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation('新会话');
    }
  }, [conversations.length, createConversation]);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 切换侧边栏可见性
  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  // 切换是否使用情报库
  const toggleUseCTILibrary = (checked: boolean) => {
    setUseCTILibrary(checked);
  };

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      await sendMessage(inputText, useCTILibrary);
      setInputText('');
    } catch (err) {
      // 错误已在 hook 中处理
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-50" style={{ height: '100%' }}>
      {/* Main Chat Container */}
      <div className={`flex flex-col flex-grow transition-all duration-300 ${isSidebarVisible ? 'w-[calc(100%-220px)]' : 'w-full'}`}>
        {/* Header */}
        <div className="p-4 bg-white border-b z-10 flex-shrink-0 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">B&R威胁情报助手</h2>
            <p className="text-sm text-gray-500">基于区块链威胁情报的智能问答系统</p>
          </div>
          <Button
            type="text"
            icon={isSidebarVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            onClick={toggleSidebar}
            title={isSidebarVisible ? "关闭情报库" : "打开情报库"}
          />
        </div>

        {/* Chat area - Scrollable */}
        <div className="flex-grow overflow-y-auto p-4 h-[400px]">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white text-gray-800 rounded-lg rounded-tl-none p-3 shadow-sm">
                <Spin size="small" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area - Fixed at bottom using flex layout */}
        <div className="p-4 bg-white border-t shadow-md flex-shrink-0">
          {/* CTI Library Toggle */}
          <div className="mb-2 flex items-center">
            <Switch
              size="small"
              checked={useCTILibrary}
              onChange={toggleUseCTILibrary}
            />
            <span className="ml-2 text-sm text-gray-600 flex items-center">
              <DatabaseOutlined className="mr-1" />
              使用情报库
            </span>
          </div>

          <div className="flex">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPressEnter={handleSendMessage}
              placeholder="输入您的问题..."
              size="large"
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              size="large"
              className="ml-2"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            提示：您可以询问有关威胁情报、攻击特征、恶意软件等问题
            {useCTILibrary && " - 已启用情报库，回答将基于您的情报数据"}
          </div>
        </div>
      </div>

      {/* CTI Sidebar */}
      {isSidebarVisible && (
        <div className="w-80 border-l border-gray-200 bg-white shadow-md">
          <CTISidebar
            visible={true}
            onClose={() => setIsSidebarVisible(false)}
          />
        </div>
      )}
    </div>
  );
}
