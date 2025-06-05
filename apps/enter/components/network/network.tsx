'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Radio } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNetworkStore } from '@/store/networkStore';
import { useMessage } from '@/provider/MessageProvider';

export default function NetworkComponent() {
  const {
    clientServerHost,
    blockchainServerHost,
    localClientServerHost,
    localBlockchainServerHost,
    remoteClientServerHost,
    remoteBlockchainServerHost,
    networkMode,
    isConnected,
    isLoading,
    error,
    setLocalClientServerHost,
    setLocalBlockchainServerHost,
    setRemoteClientServerHost,
    setRemoteBlockchainServerHost,
    setNetworkMode,
    resetToDefaults,
    checkConnection,
    saveConfig,
    autoDetectMode
  } = useNetworkStore();

  const { messageApi } = useMessage();

  // 本地状态用于编辑
  const [editLocalClientHost, setEditLocalClientHost] = useState(localClientServerHost);
  const [editLocalBlockchainHost, setEditLocalBlockchainHost] = useState(localBlockchainServerHost);
  const [editRemoteClientHost, setEditRemoteClientHost] = useState(remoteClientServerHost);
  const [editRemoteBlockchainHost, setEditRemoteBlockchainHost] = useState(remoteBlockchainServerHost);
  const [editNetworkMode, setEditNetworkMode] = useState<'local' | 'remote'>(networkMode);

  useEffect(() => {
    // 组件加载时检查连接
    checkConnection();
  }, []);

  // 同步store状态到编辑状态
  useEffect(() => {
    setEditLocalClientHost(localClientServerHost);
    setEditLocalBlockchainHost(localBlockchainServerHost);
    setEditRemoteClientHost(remoteClientServerHost);
    setEditRemoteBlockchainHost(remoteBlockchainServerHost);
    setEditNetworkMode(networkMode);
  }, [localClientServerHost, localBlockchainServerHost, remoteClientServerHost, remoteBlockchainServerHost, networkMode]);

  const handleSaveConfig = () => {
    // 先更新对应模式的地址到store
    setLocalClientServerHost(editLocalClientHost);
    setLocalBlockchainServerHost(editLocalBlockchainHost);
    setRemoteClientServerHost(editRemoteClientHost);
    setRemoteBlockchainServerHost(editRemoteBlockchainHost);

    // 设置网络模式（这会自动切换当前使用的地址）
    setNetworkMode(editNetworkMode);

    // 保存配置
    saveConfig();

    // 使用新设置检查连接
    checkConnection();

    messageApi.success('配置已保存');
  };

  const handleAutoDetect = () => {
    const detectedMode = autoDetectMode();
    setEditNetworkMode(detectedMode);
    messageApi.info(`检测到${detectedMode === 'local' ? '本地' : '远程'}环境`);
  };

  const handleResetToDefaults = () => {
    resetToDefaults();
    messageApi.success('已恢复默认配置');
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

          {/* 当前模式显示 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">当前模式</label>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
              <span className="font-medium">
                {networkMode === 'local' ? '本地模式' : '远程模式'}
              </span>
              <div className="flex space-x-2">
                <Button
                  type="default"
                  size="small"
                  onClick={handleAutoDetect}
                >
                  自动检测
                </Button>
                <Button
                  type="default"
                  size="small"
                  onClick={handleResetToDefaults}
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  恢复默认
                </Button>
              </div>
            </div>
          </div>

          {/* 网络模式选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">选择网络模式</label>
            <Radio.Group
              value={editNetworkMode}
              onChange={(e) => setEditNetworkMode(e.target.value)}
            >
              <Radio value="local">本地模式</Radio>
              <Radio value="remote">远程模式</Radio>
            </Radio.Group>
          </div>

          {/* 配置区域 */}
          {editNetworkMode === 'local' ? (
            <div className="space-y-4 p-4 border rounded-md bg-blue-50">
              <h3 className="font-medium text-gray-900">本地模式配置</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Client 服务地址</label>
                <Input
                  value={editLocalClientHost}
                  onChange={(e) => setEditLocalClientHost(e.target.value)}
                  placeholder="例如: http://127.0.0.1:5000"
                  size="large"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">区块链服务地址</label>
                <Input
                  value={editLocalBlockchainHost}
                  onChange={(e) => setEditLocalBlockchainHost(e.target.value)}
                  placeholder="例如: http://127.0.0.1:7777"
                  size="large"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 border rounded-md bg-green-50">
              <h3 className="font-medium text-gray-900">远程模式配置</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Client 服务地址</label>
                <Input
                  value={editRemoteClientHost}
                  onChange={(e) => setEditRemoteClientHost(e.target.value)}
                  placeholder="例如: https://api.example.com:19090"
                  size="large"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">区块链服务地址</label>
                <Input
                  value={editRemoteBlockchainHost}
                  onChange={(e) => setEditRemoteBlockchainHost(e.target.value)}
                  placeholder="例如: https://blockchain.example.com:45549"
                  size="large"
                />
              </div>
            </div>
          )}

          {/* 当前使用的地址 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">当前使用的地址</label>
            <div className="space-y-2 p-3 bg-gray-50 rounded-md text-sm">
              <div>Client: <span className="font-mono">{clientServerHost}</span></div>
              <div>区块链: <span className="font-mono">{blockchainServerHost}</span></div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-between pt-4">
            <Button
              type="default"
              onClick={handleResetToDefaults}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              恢复默认配置
            </Button>
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