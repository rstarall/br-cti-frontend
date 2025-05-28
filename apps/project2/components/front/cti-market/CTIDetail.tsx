import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TagList } from '@/components/front/common/TagList';
import { CommentList } from '@/components/front/common/CommentList';
import { CommentForm } from '@/components/front/common/CommentForm';
import { IncentivePanel } from '@/components/front/common/IncentivePanel';
import { formatFileSize } from '@/lib/utils';
import { useCtiStore } from '@/store/ctiStore';
import { useMessage } from '@/provider/MessageProvider';
import { useWalletStore } from '@/store/walletStore';
import { Modal, Form, Input, Tabs } from 'antd';
import { ctiApi } from '@/api/cti';

interface CTIDetailProps {
  ctiId: string;
  className?: string;
}

export function CTIDetail({ ctiId, className = '' }: CTIDetailProps) {
  const {
    currentCti,
    ctiComments,
    incentiveEvents,
    incentiveTrendData,
    incentiveTotal,
    isLoading,
    error,
    fetchCtiDetail,
    fetchCtiComments,
    fetchIncentiveEvents,
    fetchIncentiveTrend,
    addComment
  } = useCtiStore();
  const { messageApi } = useMessage();
  const { walletId } = useWalletStore();

  // 购买相关状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  React.useEffect(() => {
    // 获取情报详情和评论
    try {
      fetchCtiDetail(ctiId).then().catch(()=>{
        messageApi.error("获取情报详情失败");
      });
      fetchCtiComments(ctiId).then().catch(()=>{
        messageApi.error("获取情报评论失败");
      });
    } catch(error) {
      console.error("Error fetching CTI data:", error);
    }
  }, [ctiId]);

  // 当切换到激励机制标签时加载激励数据
  React.useEffect(() => {
    if (activeTab === '2' && currentCti) {
      fetchIncentiveEvents(ctiId).then().catch(() => {
        messageApi.error("获取激励事件失败");
      });
      fetchIncentiveTrend(ctiId).then().catch(() => {
        messageApi.error("获取激励趋势数据失败");
      });
    }
  }, [activeTab, currentCti, ctiId]);

  // 获取情报类型名称
  const getTypeName = (type: number): string => {
    switch (type) {
      case 1: return '恶意流量';
      case 2: return '蜜罐情报';
      case 3: return '僵尸网络';
      case 4: return '应用层攻击';
      case 5: return '开源情报';
      default: return '未知类型';
    }
  };

  // 处理购买按钮点击
  const handlePurchaseClick = () => {
    // 检查用户是否已登录
    if (!walletId) {
      messageApi.warning('请先登录钱包');
      return;
    }

    // 打开密码输入弹窗
    setIsModalOpen(true);
  };

  // 处理弹窗确认
  const handleModalOk = async () => {
    if (!password) {
      messageApi.warning('请输入钱包密码');
      return;
    }

    try {
      setIsPurchasing(true);

      // 调用购买API
      await ctiApi.purchaseCTI(walletId!, password, ctiId);

      // 关闭弹窗
      setIsModalOpen(false);
      setPassword('');

      // 显示成功消息
      messageApi.success('购买成功');

      // 刷新情报详情
      fetchCtiDetail(ctiId);
    } catch (error) {
      console.error('购买失败:', error);
      messageApi.error(error instanceof Error ? error.message : '购买失败，请稍后重试');
    } finally {
      setIsPurchasing(false);
    }
  };

  // 处理弹窗取消
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setPassword('');
  };

  // 获取流量类型名称
  const getTrafficTypeName = (type: number): string => {
    switch (type) {
      case 1: return '5G';
      case 2: return '卫星网络';
      case 3: return 'SDN';
      case 4: return '非流量';
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
    await addComment(ctiId, content, score, password);
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

  if (error || !currentCti) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex flex-col items-center justify-center h-64">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-4">{error || '无法加载情报详情'}</p>
          <Button
            variant="primary"
            onClick={() => {
              fetchCtiDetail(ctiId);
              fetchCtiComments(ctiId);
              if (activeTab === '2') {
                fetchIncentiveEvents(ctiId);
                fetchIncentiveTrend(ctiId);
              }
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
          <h1 className="text-2xl font-bold text-gray-900">{currentCti.cti_name}</h1>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-primary-600">
              {currentCti.price} 积分
            </div>
            <Button
              className="bg-primary-600 hover:bg-primary-700 text-white"
              onClick={handlePurchaseClick}
            >
              购买
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">情报信息</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex">
                <span className="font-medium w-24">情报ID:</span>
                <span>{currentCti.cti_id}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">情报类型:</span>
                <span>{getTypeName(currentCti.cti_type)}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">流量类型:</span>
                <span>{getTrafficTypeName(currentCti.cti_traffic_type)}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">创建者:</span>
                <span>{currentCti.creator_user_id? currentCti.creator_user_id.substring(0, 6):''}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">数据大小:</span>
                <span>{formatFileSize(currentCti.data_size)}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">创建时间:</span>
                <span>{new Date(currentCti.create_time).toLocaleString()}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">激励机制:</span>
                <span>{getIncentiveMechanismName(currentCti.incentive_mechanism)}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">情报标签:</span>
                <TagList tags={currentCti.tags} size="sm" />
              </div>
              <div className="flex">
                <span className="font-medium w-24">情报描述:</span>
                {currentCti.description}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={[
            {
              key: '1',
              label: '情报评论',
              children: (
                <div>
                  <div className="mb-8">
                    <CommentForm onSubmit={handleCommentSubmit} />
                  </div>
                  <CommentList comments={ctiComments} />
                </div>
              )
            },
            {
              key: '2',
              label: '激励机制',
              children: (
                <div>
                  {currentCti && (
                    <IncentivePanel
                      incentiveMechanism={currentCti.incentive_mechanism}
                      incentiveEvents={incentiveEvents}
                      incentiveTrendData={incentiveTrendData}
                      incentiveTotal={incentiveTotal}
                    />
                  )}
                </div>
              )
            }
          ]}
        />
      </div>

      {/* 购买密码输入弹窗 */}
      <Modal
        title="请输入钱包密码"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="确认购买"
        cancelText="取消"
        confirmLoading={isPurchasing}
      >
        <Form layout="vertical">
          <Form.Item label="钱包密码" required>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入您的钱包密码"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
