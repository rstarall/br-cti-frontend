'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Radio, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNetworkStore } from '@/store/networkStore';

export default function NetworkComponent() {
  const {
    clientServerHost,
    blockchainServerHost,
    networkMode,
    isConnected,
    isLoading,
    error,
    setClientServerHost,
    setBlockchainServerHost,
    setNetworkMode,
    checkConnection,
    saveConfig
  } = useNetworkStore();

  const [localClientHost, setLocalClientHost] = useState(clientServerHost);
  const [localBlockchainHost, setLocalBlockchainHost] = useState(blockchainServerHost);
  const [localNetworkMode, setLocalNetworkMode] = useState<'local' | 'remote'>(networkMode);

  useEffect(() => {
    // 组件加载时检查连接
    checkConnection();
  }, []);

  useEffect(() => {
    // 当store中的值变化时，更新本地状态
    setLocalClientHost(clientServerHost);
    setLocalBlockchainHost(blockchainServerHost);
    setLocalNetworkMode(networkMode);
  }, [clientServerHost, blockchainServerHost, networkMode]);

  const handleSaveConfig = () => {
    setClientServerHost(localClientHost);
    setBlockchainServerHost(localBlockchainHost);
    setNetworkMode(localNetworkMode);
    saveConfig();

    // 使用新设置检查连接
    checkConnection();

    message.success('配置已保存');
  };

  const handleCheckConnection = () => {
    checkConnection();
  };

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <Card
        title="网络连接设置"
        className="w-full"
        styles={{ body: { padding: '24px' } }}
      >
        <div className="space-y-6">
          {/* 连接状态 */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <CheckCircleOutlined className="text-green-500 text-lg" />
              ) : (
                <CloseCircleOutlined className="text-red-500 text-lg" />
              )}
              <div>
                <p className="font-medium">连接状态</p>
                <p className="text-sm text-gray-500">
                  {isLoading ? '检查中...' : isConnected ? '已连接' : '未连接'}
                </p>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </div>
            <Button
              type="default"
              size="small"
              icon={<ReloadOutlined />}
              className="ml-auto"
              onClick={handleCheckConnection}
              loading={isLoading}
            >
              检查连接
            </Button>
          </div>

          {/* 网络模式 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">网络模式</label>
            <Radio.Group
              value={localNetworkMode}
              onChange={(e) => setLocalNetworkMode(e.target.value)}
            >
              <Radio value="local">本地模式</Radio>
              <Radio value="remote">远程模式</Radio>
            </Radio.Group>
          </div>

          {/* 客户端服务器 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Client 服务地址</label>
            <Input
              value={localClientHost}
              onChange={(e) => setLocalClientHost(e.target.value)}
              placeholder="例如: http://127.0.0.1:5000"
              size="large"
            />
          </div>

          {/* 区块链服务器 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">区块链服务地址</label>
            <Input
              value={localBlockchainHost}
              onChange={(e) => setLocalBlockchainHost(e.target.value)}
              placeholder="例如: http://127.0.0.1:7777"
              size="large"
            />
          </div>

          {/* 保存按钮 */}
          <div className="flex justify-end pt-4">
            <Button
              type="primary"
              onClick={handleSaveConfig}
              size="large"
            >
              保存配置
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}