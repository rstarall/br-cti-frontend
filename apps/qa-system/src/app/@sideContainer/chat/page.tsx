'use client';

import { Input, Button, theme, message, Modal, Skeleton, Empty } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState, useCallback, memo, useMemo, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';

export default function ChatSideContainer() {
  const [messageApi, contextHolder] = message.useMessage();
  const { 
    sessions, 
    currentSessionId, 
    setCurrentSessionId, 
    deleteSession, 
    createSession, 
    updateSessionTitle,
    fetchSessions,
    sessionsLoading 
  } = useChatStore();
  const { user } = useAuthStore();
  const [items, setItems] = useState<Array<{ id: string; title: string; created_time: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingThreadId, setEditingThreadId] = useState('');
  const [deletingThreadId, setDeletingThreadId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(500);
  const [listWidth, setListWidth] = useState(300);


  // 初始化时加载会话列表
  useEffect(() => {
    if (user?.userId) {
      setLoading(true);
      fetchSessions(Number(user.userId))
        .catch((error) => {
          console.error('加载会话列表失败:', error);
          messageApi.error('加载会话列表失败');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user?.userId, fetchSessions, messageApi]);

  // 1. 使用 useMemo 优化 items 列表
  const memoizedItems = useMemo(() => {
    return sessions.map(session => ({
      id: session.session_id, // 修正：使用 session.session_id
      title: session.title || '新会话',
      created_time: session.created_at
    }));
  }, [sessions]);

  const getSortedItems = useCallback(() => {
    // 修改排序逻辑，使最新的对话排在最前面（降序排列）
    return [...memoizedItems].sort((a, b) => (
      new Date(b.created_time).getTime() - new Date(a.created_time).getTime()
    ));
  }, [memoizedItems]);

  // 2. 使用 useEffect 更新 items 状态
  useEffect(() => {
    setItems(getSortedItems());
    setLoading(sessionsLoading);
  }, [getSortedItems, sessionsLoading]);

  const handleDelete = useCallback((threadId: string) => {
    setDeletingThreadId(threadId);
    setIsDeleteModalVisible(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!user?.userId) {
      messageApi.error('请先登录');
      return;
    }
    
    try {
      // 调用后端 API 删除会话
      await deleteSession(deletingThreadId, Number(user.userId));
      messageApi.success('删除成功');
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error('删除会话失败:', error);
      messageApi.error('删除失败');
    }
  }, [deletingThreadId, deleteSession, messageApi, user?.userId]);

  const handleEdit = useCallback((threadId: string) => {
    const session = sessions.find(s => s.session_id === threadId); // 修正：使用 s.session_id
    if (session) {
      setEditingThreadId(threadId);
      setNewTitle(session.title || '');
      setIsEditModalVisible(true);
    }
  }, [sessions]);

  const handleSaveTitle = useCallback(async () => {
    if (!newTitle.trim()) {
      messageApi.error('标题不能为空');
      return;
    }
    
    if (!user?.userId) {
      messageApi.error('请先登录');
      return;
    }
    
    try {
      await updateSessionTitle(editingThreadId, Number(user.userId), newTitle);
      messageApi.success('修改成功');
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('修改标题失败:', error);
      messageApi.error('修改失败');
    }
  }, [editingThreadId, newTitle, updateSessionTitle, messageApi, user?.userId]);

  const handleCreateSession = useCallback(async () => {
    if (!user?.userId) {
      messageApi.error('请先登录');
      return;
    }

    try {
      const sessionId = await createSession(Number(user.userId));
      setCurrentSessionId(sessionId);
      messageApi.success('新会话创建成功');
    } catch (error) {
      console.error('创建会话失败:', error);
      messageApi.error('创建会话失败');
    }
  }, [user?.userId, createSession, setCurrentSessionId, messageApi]);

  // 3. 使用 memo 优化 Row 组件
  const MemoizedRow = memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    return (
      <div
        style={style}
        className={`rounded-md p-2 cursor-pointer ${item.id === currentSessionId ? 'bg-blue-100' : ''}`}
        onClick={() => setCurrentSessionId(item.id)}
      >
        <div className="flex justify-between items-center ">
          <span className='overflow-hidden text-ellipsis whitespace-nowrap' title={item.title || '新对话'}>
            {(item.title === '' || item.title == null) ? '新对话' : item.title}
          </span>
          <div className='flex items-center gap-2'>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(item.id);
              }}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
            />
          </div>
        </div>
      </div>
    );
  });

  // 4. 添加列表高度动态计算
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

  return (
    <div className="h-full relative">
      {contextHolder}
      <div className="p-4 pb-3 border-b h-[60px]">
        <Input
          placeholder="搜索聊天记录"
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>
      <div ref={listContainerRef} className="p-2 z-0 h-[calc(100%-100px)] w-full">
        <Skeleton loading={loading} active>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">暂无会话记录</p>
                    <p className="text-gray-400 text-sm">点击下方按钮开始新的对话</p>
                  </div>
                }
              />
            </div>
          ) : (
            <List
              className='z-0'
              height={listHeight}
              itemCount={items.length}
              itemSize={50}
              width={listWidth}
              itemData={items} // 5. 添加itemData属性
              overscanCount={5} // 6. 添加overscanCount提升滚动性能
            >
              {MemoizedRow}
            </List>
          )}
        </Skeleton>
      </div>
      <div className="absolute bottom-0 left-0 border-t p-4 bg-white  w-[calc(100%-10px)] h-[90px] z-10">
        <Button onClick={handleCreateSession} type="primary" block icon={<PlusOutlined />}>
          新建会话
        </Button>
      </div>

      <Modal
        title="修改会话名称"
        open={isEditModalVisible}
        onOk={handleSaveTitle}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="请输入新的会话名称"
          maxLength={50}
          showCount
        />
      </Modal>

      <Modal
        title="确认删除"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      >
        <p>确定要删除这个会话吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
}