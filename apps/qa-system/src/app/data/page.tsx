// pages/rag.tsx
'use client';
import { useState, useEffect } from 'react';
import { Button, Card, Empty, message, Modal, Form, Input, Typography, Popconfirm } from 'antd';
import { PlusOutlined, DatabaseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useKnowledgeStore, KnowledgeDatabase } from '@/stores/knowledgeStore';

export default function KnowledgeBasePage() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [databaseToDelete, setDatabaseToDelete] = useState<KnowledgeDatabase | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { databases, fetchDatabases, createDatabase, setCurrentDatabaseId, deleteDatabase } = useKnowledgeStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchDatabases();
      } catch (error) {
        message.error('获取知识库列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchDatabases]);

  const handleCreateKnowledge = async (values: { name: string; description: string }) => {
    try {
      setLoading(true);
      await createDatabase(values.name, values.description);
      message.success('创建知识库成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
    } catch (error) {
      message.error('创建知识库失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEnterKnowledge = (database: KnowledgeDatabase) => {
    setCurrentDatabaseId(database.db_id);
    router.push(`/data/${database.db_id}`);
  };

  const handleDeleteKnowledge = async () => {
    if (!databaseToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteDatabase(databaseToDelete.id);
      message.success(`知识库"${databaseToDelete.name}"已删除`);
      setDatabaseToDelete(null);
      setIsDeleteModalVisible(false);
    } catch (error) {
      message.error('删除知识库失败');
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteModal = (database: KnowledgeDatabase, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
    setDatabaseToDelete(database);
    setIsDeleteModalVisible(true);
  };

  return (
    <div className="h-full w-full p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <Typography.Title level={2}>文档知识库</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalVisible(true)}
        >
          新建知识库
        </Button>
      </div>

      {databases.length === 0 ? (
        <Empty
          description="暂无知识库"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {databases.map(database => (
            <Card
              key={database.id}
              hoverable
              onClick={() => handleEnterKnowledge(database)}
              className="shadow-md hover:shadow-lg transition-shadow"
              actions={[
                <div key="delete" onClick={(e) => showDeleteModal(database, e)}>
                  <DeleteOutlined style={{ color: '#ff4d4f' }} />
                  <span className="ml-1">删除</span>
                </div>
              ]}
            >
              <div className="flex items-center">
                <DatabaseOutlined style={{ fontSize: '32px', marginRight: '12px', color: '#1890ff' }} />
                <div className="flex-1">
                  <Typography.Title level={4} style={{ margin: 0 }}>{database.name}</Typography.Title>
                  <div className="text-xs text-gray-500 space-x-2">
                    <span>{database.file_count} 文件</span>
                    <span>•</span>
                    <span>模型: {database.embed_model}</span>
                    <span>•</span>
                    <span>维度: {database.dimension}</span>
                  </div>
                </div>
              </div>
              <Typography.Paragraph ellipsis={{ rows: 2 }} className="mt-2">{database.description}</Typography.Paragraph>
            </Card>
          ))}
        </div>
      )}

      {/* 新建知识库弹窗 */}
      <Modal
        title="新建知识库"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={() => createForm.submit()}
        confirmLoading={loading}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateKnowledge}
        >
          <Form.Item
            label="知识库名称"
            name="name"
            rules={[{ required: true, message: '请输入知识库名称' }]}
          >
            <Input placeholder="请输入知识库名称" />
          </Form.Item>
          <Form.Item
            label="知识库描述"
            name="description"
            rules={[{ required: true, message: '请输入知识库描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入知识库描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除知识库确认弹窗 */}
      <Modal
        title="删除知识库"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDeleteKnowledge}
        okText="删除"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        cancelText="取消"
      >
        <p>确定要删除知识库"{databaseToDelete?.name}"吗？</p>
        <p className="text-red-500">此操作不可恢复，知识库中的所有文件将被删除！</p>
      </Modal>
    </div>
  );
}
