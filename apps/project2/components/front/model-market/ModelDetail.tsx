import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TagList } from '@/components/front/common/TagList';
import { CommentList } from '@/components/front/common/CommentList';
import { CommentForm } from '@/components/front/common/CommentForm';
import { formatFileSize } from '@/lib/utils';
import { useModelMarketStore } from '@/store/modelMarketStore';
import { useWalletStore } from '@/store/walletStore';
import { useMessage } from '@/hooks/useMessage';
import { Modal, Input } from 'antd';

interface ModelDetailProps {
  modelId: string;
  className?: string;
}

export function ModelDetail({ modelId, className = '' }: ModelDetailProps) {
  const {
    currentModel,
    modelComments,
    isLoading,
    error,
    fetchModelDetail,
    fetchModelComments,
    addComment,
    purchaseModel
  } = useModelMarketStore();
  const { walletId } = useWalletStore();
  const { messageApi, contextHolder } = useMessage();

  // 购买相关状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);

  React.useEffect(() => {
    // 获取模型详情和评论
    fetchModelDetail(modelId);
    fetchModelComments(modelId);
  }, [modelId]);

  // 处理购买模型
  const handlePurchase = async () => {
    if (!walletId) {
      messageApi.error('请先登录钱包');
      return;
    }
    setIsModalOpen(true);
  };

  // 确认购买
  const handleConfirmPurchase = async () => {
    if (!password) {
      messageApi.error('请输入钱包密码');
      return;
    }

    setIsPurchasing(true);
    try {
      const response = await purchaseModel(modelId, password);
      messageApi.success('购买成功');
      setIsModalOpen(false);
      setPassword('');
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : '购买失败');
    } finally {
      setIsPurchasing(false);
    }
  };

  // 获取模型类型名称
  const getTypeName = (type: number): string => {
    switch (type) {
      case 1: return '分类模型';
      case 2: return '回归模型';
      case 3: return '聚类模型';
      case 4: return 'NLP模型';
      default: return '未知类型';
    }
  };

  // 获取激励机制名称
  const getIncentiveMechanismName = (type: number): string => {
    switch (type) {
      case 1: return '积分激励';
      case 2: return '三方博弈';
      case 3: return '演化博弈';
      default: return '未知机制';
    }
  };

  // 处理评论提交
  const handleCommentSubmit = async (content: string, score: number, password: string) => {
    await addComment(modelId, content, score, password);
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !currentModel) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex flex-col items-center justify-center h-64">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-4">{error || '无法加载模型详情'}</p>
          <Button
            variant="primary"
            onClick={() => {
              fetchModelDetail(modelId);
              fetchModelComments(modelId);
            }}
          >
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{currentModel.model_name}</h1>
          <div className="text-2xl font-bold text-primary-600">
            {currentModel.price} 积分
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">模型信息</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex">
                <span className="font-medium w-24">模型ID:</span>
                <span>{currentModel.model_id}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">模型类型:</span>
                <span>{getTypeName(currentModel.model_type)}</span>
              </div>

              {/* 新增字段 - 数据类型 */}
              {currentModel.model_data_type !== undefined && (
                <div className="flex">
                  <span className="font-medium w-24">数据类型:</span>
                  <span>
                    {currentModel.model_data_type === 1 ? '流量(数据集)' :
                     currentModel.model_data_type === 2 ? '情报(文本)' : '未知类型'}
                  </span>
                </div>
              )}

              <div className="flex">
                <span className="font-medium w-24">创建者:</span>
                <span>{currentModel.creator_user_name || (currentModel.creator_user_id ? currentModel.creator_user_id.substring(0, 6) : '未知')}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">模型大小:</span>
                <span>{formatFileSize(currentModel.model_size || 0)}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">创建时间:</span>
                <span>{currentModel.create_time ? new Date(currentModel.create_time).toLocaleString() : '未知'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">激励机制:</span>
                <span>{getIncentiveMechanismName(currentModel.incentive_mechanism || 0)}</span>
              </div>

              {/* 新增字段 - 是否开源 */}
              {currentModel.model_open_source !== undefined && (
                <div className="flex">
                  <span className="font-medium w-24">是否开源:</span>
                  <span>{currentModel.model_open_source === 1 ? '是' : '否'}</span>
                </div>
              )}

              {/* 新增字段 - 模型算法 */}
              {currentModel.model_algorithm && (
                <div className="flex">
                  <span className="font-medium w-24">模型算法:</span>
                  <span>{currentModel.model_algorithm}</span>
                </div>
              )}

              {/* 新增字段 - 训练框架 */}
              {currentModel.model_train_framework && (
                <div className="flex">
                  <span className="font-medium w-24">训练框架:</span>
                  <span>{currentModel.model_train_framework}</span>
                </div>
              )}

              {/* 新增字段 - 下载次数 */}
              {currentModel.downloads !== undefined && (
                <div className="flex">
                  <span className="font-medium w-24">下载次数:</span>
                  <span>{currentModel.downloads}</span>
                </div>
              )}

              {/* 新增字段 - 评分 */}
              {currentModel.rating !== undefined && (
                <div className="flex">
                  <span className="font-medium w-24">评分:</span>
                  <span>{currentModel.rating.toFixed(1)}</span>
                </div>
              )}

              {/* 新增字段 - 模型价值 */}
              {currentModel.value !== undefined && (
                <div className="flex">
                  <span className="font-medium w-24">模型价值:</span>
                  <span>{currentModel.value}</span>
                </div>
              )}

              {/* 新增字段 - 需求量 */}
              {currentModel.need !== undefined && (
                <div className="flex">
                  <span className="font-medium w-24">需求量:</span>
                  <span>{currentModel.need}</span>
                </div>
              )}

              {currentModel.tags && (
                <div className="flex">
                  <span className="font-medium w-24">标签:</span>
                  <TagList tags={currentModel.tags} size="sm" />
                </div>
              )}

              {currentModel.ref_cti_id && (
                <div className="flex">
                  <span className="font-medium w-24">关联情报:</span>
                  <Link href={`/cti-market/${currentModel.ref_cti_id}`} className="text-primary-600 hover:underline">
                    查看关联情报
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">模型详情</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-2">模型描述</h4>
                <p className="text-gray-600 whitespace-pre-line">
                  {currentModel.description}
                </p>
              </div>

              {currentModel.model_algorithm && (
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-2">算法详情</h4>
                  <p className="text-gray-600">
                    {currentModel.model_algorithm}
                  </p>
                </div>
              )}

              {currentModel.model_features && currentModel.model_features.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-2">模型特征</h4>
                  <ul className="list-disc pl-5 text-gray-600">
                    {currentModel.model_features.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {currentModel.value !== undefined && (
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-2">模型价值</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${Math.min(currentModel.value / 10, 100)}%` }}></div>
                    </div>
                    <span className="ml-2 text-gray-600">{currentModel.value}</span>
                  </div>
                </div>
              )}

              {currentModel.need !== undefined && (
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-2">需求量</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(currentModel.need / 10, 100)}%` }}></div>
                    </div>
                    <span className="ml-2 text-gray-600">{currentModel.need}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button variant="primary" size="lg" onClick={handlePurchase}>
            购买模型
          </Button>
        </div>

        {/* 购买确认模态框 */}
        <Modal
          title="确认购买"
          open={isModalOpen}
          onOk={handleConfirmPurchase}
          onCancel={() => setIsModalOpen(false)}
          confirmLoading={isPurchasing}
          okText="确认"
          cancelText="取消"
        >
          <p className="mb-4">您确定要购买此模型吗？价格: {currentModel.price} 积分</p>
          <Input.Password
            placeholder="请输入钱包密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal>

        {/* 消息提示 */}
        {contextHolder}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">用户评价</h3>

        <div className="mb-8">
          <CommentForm onSubmit={handleCommentSubmit} />
        </div>

        <CommentList comments={modelComments} />
      </div>
    </div>
  );
}
