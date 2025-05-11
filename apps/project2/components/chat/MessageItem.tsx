'use client';

import React, { useState } from 'react';
import { Button, Tooltip, Collapse } from 'antd';
import { DownOutlined, UpOutlined, FileTextOutlined } from '@ant-design/icons';
import { Message, RetrievalContext } from '@/store/chatStore';
import { format } from 'date-fns';
import MarkdownRenderer from './Markdown';

const { Panel } = Collapse;

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [showRetrievalContexts, setShowRetrievalContexts] = useState(false);

  // 格式化时间
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp));
      return format(date, 'HH:mm');
    } catch (e) {
      return '';
    }
  };

  // 判断是否有检索上下文
  const hasRetrievalContexts = message.retrievalContexts && message.retrievalContexts.length > 0;

  // 切换显示/隐藏检索上下文
  const toggleRetrievalContexts = () => {
    setShowRetrievalContexts(!showRetrievalContexts);
  };

  return (
    <div className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[85%]">
        {/* 主消息内容 */}
        <div
          className={`rounded-lg p-3 ${
            message.role === 'user'
              ? 'bg-blue-500 text-white rounded-tr-none'
              : 'bg-white text-gray-800 rounded-tl-none shadow-sm w-full'
          }`}
        >
          <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
            {message.role === 'user' ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
            {message.loading && (
              <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse rounded-full"></span>
            )}
          </div>
          <div className={`text-xs mt-1 flex justify-between items-center ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
            <div className="flex items-center">
              <span>{message.id && formatTime(message.id)}</span>
              {message.streaming && (
                <span className="ml-2 text-xs text-blue-400">正在生成...</span>
              )}
            </div>

            {hasRetrievalContexts && (
              <Button
                type="text"
                size="small"
                className={`px-1 py-0 flex items-center ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}
                onClick={toggleRetrievalContexts}
                icon={showRetrievalContexts ?  <UpOutlined />:<DownOutlined /> }
              >
                {showRetrievalContexts ? '隐藏引用' : '显示引用'}
              </Button>
            )}
          </div>
        </div>

        {/* 检索上下文 */}
        {hasRetrievalContexts && showRetrievalContexts && (
          <div className="mt-2 text-xs">
            <div className="text-gray-500 mb-1 flex items-center">
              <span className="mr-1">引用的情报内容</span>
              <span className="text-gray-400">({message.retrievalContexts!.length}条)</span>
            </div>
            <Collapse
              className="bg-transparent border-0"
              expandIconPosition="end"
              ghost
            >
              {message.retrievalContexts!.map((context, index) => (
                <Panel
                  key={index}
                  header={
                    <div className="flex items-center text-gray-700 font-medium w-full">
                      <FileTextOutlined className="mr-1" />
                      <div className='ml-2'>{context.source || '情报文档'}</div>
                    </div>
                  }
                  className="mb-2 bg-gray-50 border border-gray-200 rounded overflow-hidden"
                >
                  <div className="text-gray-600 bg-white p-2 rounded border border-gray-100 max-h-48 overflow-y-auto">
                    <MarkdownRenderer content={context.data} />
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
        )}
      </div>
    </div>
  );
};
