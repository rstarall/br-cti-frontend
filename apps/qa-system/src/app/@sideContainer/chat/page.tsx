'use client';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { Button, Input, Modal, message, Tooltip } from 'antd';
import { EditOutlined, MessageOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { FixedSizeList as List } from 'react-window';
import { useUIStore } from '@/stores/uiStore';

const ChatSideContainer = () => {
  const {
    sessions,
    fetchSessions,
    createSession,
    deleteSession,
    updateSessionTitle,
    setCurrentSessionId,
    currentSessionId,
  } = useChatStore();
  const { user } = useAuthStore();
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  useEffect(() => {
    if (user?.userId) {
      fetchSessions(Number(user.userId));
    }
  }, [user?.userId, fetchSessions]);

  const handleCreateSession = async () => {
    if (user?.userId) {
      try {
        const newSessionId = await createSession(Number(user.userId));
        setCurrentSessionId(newSessionId);
      } catch (error) {
        message.error('创建新会话失败');
      }
    }
  };

  const confirmDelete = (sessionId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '你确定要删除这个会话吗？这个操作无法撤销。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        if (user?.userId) {
          deleteSession(sessionId, Number(user.userId));
        }
      },
    });
  };

  const handleEdit = (session: { id: string; title: string }) => {
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveTitle = (sessionId: string) => {
    if (user?.userId && editingTitle.trim()) {
      updateSessionTitle(sessionId, Number(user.userId), editingTitle);
      setEditingSessionId(null);
    }
  };

  const memoizedItems = useMemo(() => {
    return sessions.map(session => ({
      id: session.session_id,
      title: session.title || '新会话',
      created_time: session.created_at,
    }));
  }, [sessions]);

  const getSortedItems = useCallback(() => {
    return [...memoizedItems].sort((a, b) => (
      new Date(b.created_time).getTime() - new Date(a.created_time).getTime()
    ));
  }, [memoizedItems]);

  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(500);
  const [listWidth, setListWidth] = useState(300);

  useEffect(() => {
    const calculateSize = () => {
      if (listContainerRef.current) {
        const { height, width } = listContainerRef.current.getBoundingClientRect();
        setListHeight(height);
        setListWidth(width);
      }
    };
    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  const items = getSortedItems();

  const MemoizedRow = React.memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const session = items[index];
    const isActive = session.id === currentSessionId;

    return (
      <div style={style}>
        {editingSessionId === session.id ? (
          <div className="flex items-center p-2">
            <Input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onPressEnter={() => handleSaveTitle(session.id)}
              className="flex-grow"
            />
            <Button icon={<CheckOutlined />} onClick={() => handleSaveTitle(session.id)} className="ml-2" />
            <Button icon={<CloseOutlined />} onClick={() => setEditingSessionId(null)} className="ml-1" />
          </div>
        ) : (
          <div
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${isActive ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            onClick={() => setCurrentSessionId(session.id)}
          >
            <div className="flex items-center overflow-hidden">
              <MessageOutlined className="mr-3" />
              <span className="truncate text-sm">{session.title}</span>
            </div>
            {isActive && (
              <div className="flex items-center">
                <Tooltip title="编辑标题">
                  <Button type="text" shape="circle" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); handleEdit(session); }} />
                </Tooltip>
                <Tooltip title="删除会话">
                  <Button type="text" shape="circle" danger icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); confirmDelete(session.id); }} />
                </Tooltip>
              </div>
            )}
          </div>
        )}
      </div>
    );
  });
  MemoizedRow.displayName = 'MemoizedRow';

  return (
    <div
      className="bg-gray-50 h-full w-full flex flex-col p-2 border-r border-gray-200 overflow-hidden"
    >
      <div className={`flex flex-col h-full overflow-hidden ${isSidebarCollapsed ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between p-2 mb-2">
          <h1 className="text-lg font-semibold">
            <span className="text-blue-600 font-bold">B&R</span> 安全问答系统
          </h1>
          <Tooltip title="收起菜单">
            <Button type="text" shape="circle" icon={<MenuFoldOutlined />} onClick={toggleSidebar} />
          </Tooltip>
        </div>
        <Button
          type="primary"
          ghost
          icon={<EditOutlined />}
          onClick={handleCreateSession}
          className="w-full mb-4"
        >
          发起新对话
        </Button>
        <div ref={listContainerRef} className="flex-grow">
          {items.length > 0 && (
            <List
              height={listHeight}
              itemCount={items.length}
              itemSize={55}
              width={listWidth}
              itemData={items}
              overscanCount={5}
            >
              {MemoizedRow}
            </List>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSideContainer;