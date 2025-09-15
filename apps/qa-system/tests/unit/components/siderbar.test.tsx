//测试sidebar组件
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useChatStore } from '@/stores/chatStore';
import ChatSideContainer from '@/app/@sideContainer/chat/page';

// Mock zustand store
jest.mock('@/stores/chatStore', () => ({
  useChatStore: jest.fn()
}));

describe('ChatSideContainer组件', () => {
  // 模拟会话数据
  const mockConversations = {
    'conv-1': {
      id: 'conv-1',
      title: '测试会话1',
      time: '2024-01-01'
    },
    'conv-2': {
      id: 'conv-2',
      title: '测试会话2',
      time: '2024-01-02'
    }
  };

  // 在每个测试前设置模拟数据
  const resetConversationTitle = jest.fn();
  const setCurrentConversationId= jest.fn();
  const deleteConversation = jest.fn();
  const createConversation = jest.fn();
  beforeEach(() => {
    ((useChatStore as unknown) as jest.Mock).mockImplementation(() => ({
      conversationHistory: mockConversations,
      currentConversationId: 'conv-1',
      setCurrentConversationId: setCurrentConversationId,
      deleteConversation: deleteConversation,
      createConversation: createConversation,
      resetConversationTitle: resetConversationTitle
    }));
  });

  test('渲染基础组件元素', () => {
    render(<ChatSideContainer />);
    
    // 验证搜索框存在
    expect(screen.getByPlaceholderText('搜索聊天记录')).toBeInTheDocument();
    
    // 验证新建会话按钮存在
    expect(screen.getByText('新建会话')).toBeInTheDocument();
  });

  test('显示会话列表', () => {
    render(<ChatSideContainer />);
    
    // 验证会话标题显示
    expect(screen.getByText('测试会话1')).toBeInTheDocument();
    expect(screen.getByText('测试会话2')).toBeInTheDocument();
  });

  test('点击新建会话按钮', () => {
    ((useChatStore as unknown) as jest.Mock).mockImplementation(() => ({
      conversationHistory: mockConversations,
      currentConversationId: 'conv-1',
      setCurrentConversationId: jest.fn(),
      deleteConversation: jest.fn(),
      createConversation,
      resetConversationTitle: jest.fn()
    }));
  
    render(<ChatSideContainer />);
    
    const newChatButton = screen.getByText('新建会话');
    fireEvent.click(newChatButton);
    
    expect(createConversation).toHaveBeenCalledWith('');
  });

  test('编辑会话标题', async () => {
    
    ((useChatStore as unknown) as jest.Mock).mockImplementation(() => ({
      ...useChatStore(),
      resetConversationTitle
    }));

    render(<ChatSideContainer />);
    
    // 点击第一个会话的编辑按钮
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    
    // 验证编辑模态框出现
    expect(screen.getByText('修改会话名称')).toBeInTheDocument();
    
    // 输入新标题
    const input = screen.getByPlaceholderText('请输入新的会话名称');
    fireEvent.change(input, { target: { value: '新标题' } });
    
    // 点击确认按钮
    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);
    
    expect(resetConversationTitle).toHaveBeenCalledWith('conv-1', '新标题');
  });

  test('删除会话', () => {
    ((useChatStore as unknown) as jest.Mock).mockImplementation(() => ({
      ...useChatStore(),
      deleteConversation
    }));

    render(<ChatSideContainer />);
    
    // 点击第一个会话的删除按钮
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // 验证确认对话框出现
    expect(screen.getByText('确定要删除这个会话吗？此操作不可恢复。')).toBeInTheDocument();
    
    // 点击确认删除
    const confirmButton = screen.getByText('OK');
    fireEvent.click(confirmButton);
    
    expect(deleteConversation).toHaveBeenCalledWith('conv-1');
  });

  test('切换当前会话', () => {
    ((useChatStore as unknown) as jest.Mock).mockImplementation(() => ({
      ...useChatStore(),
      setCurrentConversationId
    }));

    render(<ChatSideContainer />);
    
    // 点击第二个会话
    fireEvent.click(screen.getByText('测试会话2'));
    
    expect(setCurrentConversationId).toHaveBeenCalledWith('conv-2');
  });

  test('空标题显示为"新对话"', () => {
    const mockConversationsWithEmptyTitle = {
      'conv-3': {
        id: 'conv-3',
        title: '',
        time: '2024-01-03'
      }
    };

    ((useChatStore as unknown) as jest.Mock).mockImplementation(() => ({
      ...useChatStore(),
      conversationHistory: mockConversationsWithEmptyTitle
    }));

    render(<ChatSideContainer />);
    
    expect(screen.getByText('新对话')).toBeInTheDocument();
  });
});


