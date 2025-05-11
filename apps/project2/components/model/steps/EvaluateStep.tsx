import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Spin, Divider, Tag, Row, Col, Image, Empty, Alert } from 'antd';
import { ReloadOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useModelEvaluate } from '@/hooks/mlModel/useModelEvaluate';
import { useLocalMLStore } from '@/store/localMLStore';

const { Title, Text, Paragraph } = Typography;

interface EvaluationImage {
  image_type: string;
  image_data: string; // Base64 encoded image
}

export function EvaluateStep() {
  const { tasks } = useLocalMLStore();
  const { 
    isEvaluating,
    evaluationProgress,
    evaluationStage,
    evaluationMessage,
    evaluationMetrics,
    evaluationImages,
    startEvaluation,
    getEvaluationImages,
    refreshEvaluationData
  } = useModelEvaluate();
  
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState(false);

  // 当选择任务变化时，获取评估数据
  useEffect(() => {
    if (selectedTask) {
      const task = tasks.find(t => t.file_hash === selectedTask);
      if (task && task.model_hash && task.train_request_id) {
        loadEvaluationData(task.train_request_id);
      }
    }
  }, [selectedTask]);

  // 加载评估数据
  const loadEvaluationData = async (requestId: string) => {
    setLoadingImages(true);
    try {
      await refreshEvaluationData(requestId);
      await fetchEvaluationImages(requestId);
    } catch (error) {
      console.error('Error loading evaluation data:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  // 获取评估图像
  const fetchEvaluationImages = async (requestId: string) => {
    try {
      await getEvaluationImages(requestId);
    } catch (error) {
      console.error('Error fetching evaluation images:', error);
    }
  };

  // 开始评估
  const handleStartEvaluation = async (requestId: string) => {
    try {
      await startEvaluation(requestId);
    } catch (error) {
      console.error('Error starting evaluation:', error);
    }
  };

  // 刷新评估数据
  const handleRefreshEvaluation = async (requestId: string) => {
    setLoadingImages(true);
    try {
      await refreshEvaluationData(requestId);
      await fetchEvaluationImages(requestId);
    } catch (error) {
      console.error('Error refreshing evaluation data:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  // 获取当前选中的任务
  const currentTask = tasks.find(task => task.file_hash === selectedTask);
  const hasTrainedModel = currentTask?.status.train && currentTask?.model_hash;
  const requestId = currentTask?.train_request_id;

  return (
    <div className="w-full">
      <div className="mb-6">
        <Title level={4}>模型评估</Title>
        <Text type="secondary">查看模型训练后的评估结果和性能指标</Text>
      </div>

      <Card className="mb-6">
        <div className="mb-4">
          <Text strong>选择已训练的模型：</Text>
        </div>
        <div className="flex flex-wrap gap-3">
          {tasks
            .filter(task => task.status.train && task.model_hash)
            .map(task => (
              <Tag 
                key={task.file_hash}
                color={selectedTask === task.file_hash ? 'blue' : 'default'}
                className="px-3 py-2 cursor-pointer"
                onClick={() => setSelectedTask(task.file_hash)}
              >
                {task.file_name} ({task.file_hash.substring(0, 8)}...)
              </Tag>
            ))}
          {tasks.filter(task => task.status.train && task.model_hash).length === 0 && (
            <Empty description="暂无已训练完成的模型" />
          )}
        </div>
      </Card>

      {selectedTask && hasTrainedModel && requestId && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={5} className="m-0">评估结果</Title>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => handleRefreshEvaluation(requestId)}
              loading={loadingImages || isEvaluating}
            >
              刷新评估数据
            </Button>
          </div>

          {loadingImages || isEvaluating ? (
            <div className="text-center py-8">
              <Spin tip="加载评估数据..." />
            </div>
          ) : (
            <>
              {evaluationMetrics && Object.keys(evaluationMetrics).length > 0 ? (
                <>
                  <Divider />
                  <Title level={5}>性能指标</Title>
                  <Row gutter={16} className="mb-6">
                    {Object.entries(evaluationMetrics).map(([key, value]) => {
                      if (typeof value === 'number' && key !== 'visualization_path') {
                        return (
                          <Col key={key} span={8} className="mb-4">
                            <Card size="small" className="text-center">
                              <Statistic title={key} value={value} />
                            </Card>
                          </Col>
                        );
                      }
                      return null;
                    })}
                  </Row>
                </>
              ) : (
                <Alert 
                  message="暂无评估指标" 
                  description="模型尚未生成评估指标，请稍后刷新或检查模型训练状态。" 
                  type="info" 
                  showIcon 
                />
              )}

              {evaluationImages && evaluationImages.length > 0 ? (
                <>
                  <Divider />
                  <Title level={5}>评估可视化</Title>
                  <div className="flex flex-wrap gap-4">
                    {evaluationImages.map((image, index) => (
                      <div key={index} className="mb-4 border rounded-md overflow-hidden">
                        <Image
                          src={`data:image/${image.image_type};base64,${image.image_data}`}
                          alt={`Evaluation visualization ${index + 1}`}
                          style={{ maxWidth: '100%' }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Alert 
                  message="暂无评估图像" 
                  description="模型尚未生成评估可视化图像，请稍后刷新或检查模型训练状态。" 
                  type="info" 
                  showIcon 
                />
              )}
            </>
          )}
        </Card>
      )}

      {selectedTask && !hasTrainedModel && (
        <Alert 
          message="模型未训练完成" 
          description="请先完成模型训练步骤，训练完成后才能查看评估结果。" 
          type="warning" 
          showIcon 
        />
      )}
    </div>
  );
}

// 简单的统计组件
function Statistic({ title, value }: { title: string, value: number }) {
  return (
    <div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold">
        {typeof value === 'number' ? value.toFixed(4) : value}
      </div>
    </div>
  );
}
