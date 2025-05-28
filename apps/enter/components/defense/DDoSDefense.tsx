'use client';

import React, { useState } from 'react';
import { Spin, Alert } from 'antd';
import { useDefenseStore } from '@/store/defenseStore';
import NetworkSelectionPage from '@/components/defense/NetworkSelectionPage';
import IPNetworkDefense from '@/components/defense/IPNetworkDefense';
import FiveGNetworkDefense from '@/components/defense/FiveGNetworkDefense';
import SatelliteNetworkDefense from '@/components/defense/SatelliteNetworkDefense';

export default function DefenseMain() {
  const [activeNetwork, setActiveNetwork] = useState<'main' | 'ip' | '5g' | 'satellite'>('main');

  const {
    ipData,
    fiveGData,
    satelliteData,
    isLoading,
    error,
    fetchIPDefenseData,
    fetch5GDefenseData,
    fetchSatelliteDefenseData,
    clearError
  } = useDefenseStore();

  // 处理网络选择
  const handleNetworkSelect = (network: 'ip' | '5g' | 'satellite') => {
    setActiveNetwork(network);
  };

  // 处理返回主页
  const handleBackToMain = () => {
    setActiveNetwork('main');
  };

  // 处理IP网络防御
  const handleIPDefense = async () => {
    await fetchIPDefenseData();
  };

  // 处理5G网络防御
  const handle5GDefense = async () => {
    await fetch5GDefenseData();
  };

  // 处理卫星网络防御
  const handleSatelliteDefense = async () => {
    await fetchSatelliteDefenseData();
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
          <IPNetworkDefense
            defenseData={ipData}
            isLoading={isLoading}
            onBack={handleBackToMain}
            onStartDefense={handleIPDefense}
          />
        )}
        {activeNetwork === '5g' && (
          <FiveGNetworkDefense
            defenseData={fiveGData}
            isLoading={isLoading}
            onBack={handleBackToMain}
            onStartDefense={handle5GDefense}
          />
        )}
        {activeNetwork === 'satellite' && (
          <SatelliteNetworkDefense
            defenseData={satelliteData}
            isLoading={isLoading}
            onBack={handleBackToMain}
            onStartDefense={handleSatelliteDefense}
          />
        )}
      </Spin>
    </div>
  );
}