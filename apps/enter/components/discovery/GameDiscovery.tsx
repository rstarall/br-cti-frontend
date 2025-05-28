'use client';

import React, { useState } from 'react';
import { Spin, Alert } from 'antd';
import { useGameDiscoveryStore } from '@/store/gameDiscoveryStore';
import NetworkSelectionPage from '@/components/discovery/NetworkSelectionPage';
import IPNetworkPage from '@/components/discovery/IPNetworkPage';
import FiveGNetworkPage from '@/components/discovery/FiveGNetworkPage';
import SatelliteNetworkPage from '@/components/discovery/SatelliteNetworkPage';

export default function GameDiscovery() {
  const [activeNetwork, setActiveNetwork] = useState<'main' | 'ip' | '5g' | 'satellite'>('main');

  const {
    ipData,
    fiveGData,
    satelliteData,
    isLoading,
    error,
    fetchIPStrategy,
    fetch5GStrategy,
    fetchSatelliteStrategy,
    clearError
  } = useGameDiscoveryStore();

  // 处理网络选择
  const handleNetworkSelect = (network: 'ip' | '5g' | 'satellite') => {
    setActiveNetwork(network);
  };

  // 处理返回主页
  const handleBackToMain = () => {
    setActiveNetwork('main');
  };

  // 处理IP网络提交
  const handleIPSubmit = async (values: any) => {
    await fetchIPStrategy(values.input1, values.input2, values.input3);
  };

  // 处理5G网络提交
  const handle5GSubmit = async (values: any) => {
    await fetch5GStrategy(values.budget);
  };

  // 处理卫星网络计算
  const handleSatelliteCalculate = async () => {
    await fetchSatelliteStrategy();
  };

  return (
    <div className="p-6 h-full overflow-auto bg-gray-50">
      {error && (
        <Alert
          message="错误"
          description={error}
          type="error"
          closable
          onClose={clearError}
          className="mb-4"
        />
      )}

      <Spin spinning={isLoading}>
        {activeNetwork === 'main' && (
          <NetworkSelectionPage onNetworkSelect={handleNetworkSelect} />
        )}
        {activeNetwork === 'ip' && (
          <IPNetworkPage
            ipData={ipData}
            isLoading={isLoading}
            onBack={handleBackToMain}
            onSubmit={handleIPSubmit}
          />
        )}
        {activeNetwork === '5g' && (
          <FiveGNetworkPage
            fiveGData={fiveGData}
            isLoading={isLoading}
            onBack={handleBackToMain}
            onSubmit={handle5GSubmit}
          />
        )}
        {activeNetwork === 'satellite' && (
          <SatelliteNetworkPage
            satelliteData={satelliteData}
            isLoading={isLoading}
            onBack={handleBackToMain}
            onCalculate={handleSatelliteCalculate}
          />
        )}
      </Spin>
    </div>
  );
}
