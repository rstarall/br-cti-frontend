import React, { useState, useEffect } from 'react';
import { Button, Progress, Card, Typography, Select, Form, Spin, Divider, Tag, Row, Col } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useModelTrain } from '@/hooks/mlModel/useModelTrain';
import { useLocalMLStore } from '@/store/localMLStore';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export function TrainStep() {
  const [form] = Form.useForm();
  const { tasks } = useLocalMLStore();
  const { 
    isTraining, 
    trainingProgress, 
    trainingStage, 
    trainingMessage, 
    modelMetrics,
    getFeatureList, 
    startTraining 
  } = useModelTrain();
  
  const [features, setFeatures] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  // 当选择任务变化时，获取特征列表
  useEffect(() => {
    if (selectedTask) {
      fetchFeatures(selectedTask);
    }
  }, [selectedTask]);

  // 获取特征列表
  const fetchFeatures = async (fileHash: string) => {
    setLoadingFeatures(true);
    try {
      const featuresStr = await getFeatureList(fileHash);
      if (featuresStr) {
        const featureList = featuresStr.split(';').filter(f => f.trim() !== '');
        setFeatures(featureList);
        
        // 重置表单
        form.resetFields();
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoadingFeatures(false);
    }
  };

  // 开始训练
  const handleStartTraining = async (fileHash: string) => {
    try {
      const values = await form.validateFields();
      const { label_column } = values;
      
      await startTraining(fileHash, label_column);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 获取当前选中的任务
  const currentTask = tasks.find(task => task.file_hash === selectedTask);

  return (
    <div className="w-full">
      <div className="mb-6">
        <Title level={4}>模型训练</Title>
        <Text type="secondary">选择数据集和标签列，开始训练模型</Text>
      </div>

      <Card className="mb-6">
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="选择数据集"
            name="file_hash"
            rules={[{ required: true, message: '请选择数据集' }]}
          >
            <Select 
              placeholder="选择已上传的数据集" 
              onChange={(value) => setSelectedTask(value)}
              loading={loadingFeatures}
            >
              {tasks
                .filter(task => task.status.upload)
                .map(task => (
                  <Option key={task.file_hash} value={task.file_hash}>
                    {task.file_name} ({task.file_hash.substring(0, 8)}...)
                  </Option>
                ))
              }
            </Select>
          </Form.Item>

          {loadingFeatures ? (
            <div className="text-center py-4">
              <Spin tip="加载特征列表..." />
            </div>
          ) : features.length > 0 ? (
            <>
              <Form.Item
                label="特征列表"
                name="features"
                initialValue={features.join(', ')}
              >
                <div className="p-2 border rounded-md bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Tag key={index} color="blue">{feature}</Tag>
                    ))}
                  </div>
                </div>
              </Form.Item>

              <Form.Item
                label="标签列"
                name="label_column"
                rules={[{ required: true, message: '请选择标签列' }]}
              >
                <Select placeholder="选择标签列">
                  <Option value="empty_label">无标签（自动识别）</Option>
                  {features.map((feature, index) => (
                    <Option key={index} value={feature}>{feature}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="测试集比例"
                name="test_ratio"
                initialValue="0.2"
              >
                <Select>
                  <Option value="0.2">20%</Option>
                  <Option value="0.3">30%</Option>
                  <Option value="0.4">40%</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="评估指标"
                name="model_metrics"
                initialValue={["accuracy"]}
              >
                <Select mode="multiple" placeholder="选择评估指标">
                  <Option value="accuracy">准确率</Option>
                  <Option value="precision">精确率</Option>
                  <Option value="recall">召回率</Option>
                </Select>
              </Form.Item>
            </>
          ) : selectedTask ? (
            <div className="text-center py-4">
              <Text type="secondary">未找到特征列表，请检查数据集格式</Text>
            </div>
          ) : null}
        </Form>
      </Card>

      {selectedTask && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={5} className="m-0">训练状态</Title>
            
            {!currentTask?.status.train && (
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStartTraining(selectedTask)}
                loading={isTraining}
                disabled={!features.length || isTraining}
              >
                开始训练
              </Button>
            )}
          </div>

          <Progress 
            percent={currentTask?.status.train ? 100 : trainingProgress} 
            status={currentTask?.status.train ? "success" : "active"}
          />

          <div className="mt-4">
            <Row gutter={16}>
              <Col span={8}>
                <Text strong>当前阶段：</Text>
                <Text>{trainingStage || '未开始'}</Text>
              </Col>
              <Col span={8}>
                <Text strong>状态：</Text>
                <Text>
                  {currentTask?.status.train ? (
                    <span className="text-green-500">
                      <CheckCircleOutlined /> 训练完成
                    </span>
                  ) : isTraining ? (
                    <span className="text-blue-500">
                      <LoadingOutlined /> 训练中...
                    </span>
                  ) : (
                    <span className="text-gray-500">未开始</span>
                  )}
                </Text>
              </Col>
              <Col span={8}>
                <Text strong>模型哈希：</Text>
                <Text>{currentTask?.model_hash || '未生成'}</Text>
              </Col>
            </Row>

            {trainingMessage && (
              <div className="mt-2">
                <Text strong>消息：</Text>
                <Text>{trainingMessage}</Text>
              </div>
            )}
          </div>

          {currentTask?.status.train && modelMetrics && (
            <>
              <Divider />
              <Title level={5}>模型评估结果</Title>
              
              <Row gutter={16}>
                {modelMetrics.accuracy !== undefined && (
                  <Col span={8}>
                    <Card size="small" className="text-center">
                      <Statistic title="准确率" value={modelMetrics.accuracy} suffix="%" />
                    </Card>
                  </Col>
                )}
                
                {modelMetrics.precision !== undefined && (
                  <Col span={8}>
                    <Card size="small" className="text-center">
                      <Statistic title="精确率" value={modelMetrics.precision} suffix="%" />
                    </Card>
                  </Col>
                )}
                
                {modelMetrics.recall !== undefined && (
                  <Col span={8}>
                    <Card size="small" className="text-center">
                      <Statistic title="召回率" value={modelMetrics.recall} suffix="%" />
                    </Card>
                  </Col>
                )}
              </Row>
            </>
          )}
        </Card>
      )}
    </div>
  );
}

// 简单的统计组件
function Statistic({ title, value, suffix = '' }: { title: string, value: number, suffix?: string }) {
  return (
    <div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold">
        {typeof value === 'number' ? value.toFixed(2) : value}
        {suffix}
      </div>
    </div>
  );
}
