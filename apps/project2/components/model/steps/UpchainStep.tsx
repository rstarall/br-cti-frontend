import React, { useState, useEffect } from 'react';
import { Button, Progress, Card, Typography, Form, Input, Select, Row, Col, message } from 'antd';
import { CloudUploadOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useModelUpchain } from '@/hooks/mlModel/useModelUpchain';
import { useLocalMLStore } from '@/store/localMLStore';

const { Title, Text } = Typography;
const { Option } = Select;

export function UpchainStep() {
  const [form] = Form.useForm();
  const { tasks } = useLocalMLStore();
  const { 
    isUpchaining, 
    upchainProgress, 
    getIPFSAddress, 
    checkWalletPassword, 
    startUpchain 
  } = useModelUpchain();
  
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [ipfsAddress, setIpfsAddress] = useState('');
  const [walletId, setWalletId] = useState('');

  // 初始化时获取IPFS地址和钱包ID
  useEffect(() => {
    fetchIPFSAddress();
    
    // 从localStorage获取钱包ID
    const storedWalletId = localStorage.getItem('userWalletId');
    if (storedWalletId) {
      setWalletId(storedWalletId);
      form.setFieldsValue({ upchain_account: storedWalletId });
    }
  }, []);

  // 获取IPFS地址
  const fetchIPFSAddress = async () => {
    try {
      const address = await getIPFSAddress();
      if (address) {
        setIpfsAddress(address);
        form.setFieldsValue({ ipfs_address: address });
      }
    } catch (error) {
      console.error('Error fetching IPFS address:', error);
    }
  };

  // 检查钱包密码
  const handleCheckPassword = async () => {
    try {
      const values = await form.validateFields(['upchain_account', 'upchain_account_password']);
      const { upchain_account, upchain_account_password } = values;
      
      const isValid = await checkWalletPassword(upchain_account, upchain_account_password);
      
      if (isValid) {
        message.success('钱包密码正确');
      } else {
        message.error('钱包密码错误');
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 开始上链
  const handleStartUpchain = async () => {
    if (!selectedTask) return;
    
    try {
      const values = await form.validateFields();
      const { model_type, ipfs_address, upchain_account, upchain_account_password } = values;
      
      const currentTask = tasks.find(task => task.file_hash === selectedTask);
      if (!currentTask || !currentTask.model_hash) {
        message.error('未找到模型哈希，请先完成模型训练');
        return;
      }
      
      await startUpchain(
        selectedTask,
        currentTask.model_hash,
        model_type,
        ipfs_address,
        upchain_account,
        upchain_account_password
      );
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 获取当前选中的任务
  const currentTask = tasks.find(task => task.file_hash === selectedTask);

  return (
    <div className="w-full">
      <div className="mb-6">
        <Title level={4}>模型上链</Title>
        <Text type="secondary">将训练好的模型上传到区块链，实现模型共享和交易</Text>
      </div>

      <Card className="mb-6">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            model_type: 1,
            ipfs_address: ipfsAddress,
            upchain_account: walletId
          }}
        >
          <Form.Item
            label="选择模型"
            name="file_hash"
            rules={[{ required: true, message: '请选择模型' }]}
          >
            <Select 
              placeholder="选择已训练的模型" 
              onChange={(value) => setSelectedTask(value)}
            >
              {tasks
                .filter(task => task.status.train && task.model_hash)
                .map(task => (
                  <Option key={task.file_hash} value={task.file_hash}>
                    {task.file_name} ({task.model_hash?.substring(0, 8)}...)
                  </Option>
                ))
              }
            </Select>
          </Form.Item>

          <Form.Item
            label="模型类型"
            name="model_type"
            rules={[{ required: true, message: '请选择模型类型' }]}
          >
            <Select placeholder="选择模型类型">
              <Option value={1}>分类模型</Option>
              <Option value={2}>回归模型</Option>
              <Option value={3}>聚类模型</Option>
              <Option value={4}>NLP模型</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="IPFS地址"
            name="ipfs_address"
            rules={[{ required: true, message: '请输入IPFS地址' }]}
          >
            <Input 
              placeholder="IPFS地址"
              suffix={
                <Button type="link" size="small" onClick={fetchIPFSAddress}>
                  获取
                </Button>
              }
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="上链账户"
                name="upchain_account"
                rules={[{ required: true, message: '请输入上链账户' }]}
              >
                <Input placeholder="上链账户" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="账户密码"
                name="upchain_account_password"
                rules={[{ required: true, message: '请输入账户密码' }]}
              >
                <Input.Password 
                  placeholder="账户密码"
                  suffix={
                    <Button type="link" size="small" onClick={handleCheckPassword}>
                      检查
                    </Button>
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {selectedTask && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={5} className="m-0">上链状态</Title>
            
            {!currentTask?.status.upchain && (
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={handleStartUpchain}
                loading={isUpchaining}
                disabled={!currentTask?.model_hash || isUpchaining}
              >
                开始上链
              </Button>
            )}
          </div>

          <Progress 
            percent={currentTask?.status.upchain ? 100 : upchainProgress} 
            status={currentTask?.status.upchain ? "success" : "active"}
          />

          <div className="mt-4">
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>文件哈希：</Text>
                <Text>{selectedTask}</Text>
              </Col>
              <Col span={12}>
                <Text strong>模型哈希：</Text>
                <Text>{currentTask?.model_hash || '未生成'}</Text>
              </Col>
            </Row>

            <div className="mt-2">
              <Text strong>状态：</Text>
              <Text>
                {currentTask?.status.upchain ? (
                  <span className="text-green-500">
                    <CheckCircleOutlined /> 上链完成
                  </span>
                ) : isUpchaining ? (
                  <span className="text-blue-500">
                    <LoadingOutlined /> 上链中...
                  </span>
                ) : (
                  <span className="text-gray-500">未开始</span>
                )}
              </Text>
            </div>
          </div>

          {currentTask?.status.upchain && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <Title level={5}>上链成功</Title>
              <Text>模型已成功上传到区块链，可以在模型市场中查看和交易。</Text>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
