'use client'
import React, { createContext, useContext } from 'react';
import { message } from 'antd';

interface MessageContextType {
  messageApi: ReturnType<typeof message.useMessage>[0];
  contextHolder: ReturnType<typeof message.useMessage>[1];
}

const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageContext.Provider value={{ messageApi, contextHolder }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
