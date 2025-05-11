'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, message } from 'antd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/front/common/StatCard';
import { BlockList } from '@/components/front/blockchain/BlockList';
import { TransactionList } from '@/components/front/blockchain/TransactionList';
import { BlockchainSearch } from '@/components/front/blockchain/BlockchainSearch';
import { useBlockchainStore } from '@/store/blockchainStore';

export default function BlockchainExplorerPage() {
  const [activeTab, setActiveTab] = useState('blocks');
  const { stats, isLoading, fetchBlockchainStats } = useBlockchainStore();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // 显示加载消息
    const loadingMessage = messageApi.loading('正在加载区块链数据...', 0);

    // 获取区块链统计数据
    fetchBlockchainStats();

    // 当组件卸载时关闭消息
    return () => {
      loadingMessage();
    };
  }, [messageApi, fetchBlockchainStats]);

  // 监听加载状态变化
  useEffect(() => {
    if (!isLoading) {
      // 数据加载完成，关闭所有消息
      messageApi.destroy();
    }
  }, [isLoading, messageApi]);

  return (
    <div className="py-8">
      {contextHolder}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">区块链浏览器</h1>
          <p className="mt-2 text-lg text-gray-600">
            探索B&R去中心化威胁情报共享平台的区块链数据
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="区块高度"
            value={stats.blockHeight.toLocaleString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />

          <StatCard
            title="交易总数"
            value={stats.totalTransactions.toLocaleString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
          />

          <StatCard
            title="用户数量"
            value={stats.totalUsers.toLocaleString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />

          <StatCard
            title="情报数量"
            value={stats.totalCTI.toLocaleString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <BlockchainSearch />
          </CardContent>
        </Card>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="w-full"
          items={[
            {
              key: 'blocks',
              label: '最新区块',
              children: (
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>最新区块</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BlockList />
                    </CardContent>
                  </Card>
                </div>
              ),
            },
            {
              key: 'transactions',
              label: '最新情报交易',
              children: (
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>最新情报交易</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TransactionList />
                    </CardContent>
                  </Card>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
