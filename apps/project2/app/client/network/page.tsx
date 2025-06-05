'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useNetworkStore } from '@/store/networkStore';
import { useMessage } from '@/provider/MessageProvider';
export default function NetworkPage() {
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
    // Check connection on load
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

    // Check connection with new settings
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

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>网络连接设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <p className="font-medium">连接状态</p>
              <p className="text-sm text-gray-500">
                {isLoading ? '检查中...' : isConnected ? '已连接' : '未连接'}
              </p>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => checkConnection()}
              disabled={isLoading}
            >
              检查连接
            </Button>
          </div>

          {/* Current Mode Display */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">当前模式</label>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
              <span className="font-medium">
                {networkMode === 'local' ? '本地模式' : '远程模式'}
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAutoDetect}
                >
                  自动检测
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetToDefaults}
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  恢复默认
                </Button>
              </div>
            </div>
          </div>

          {/* Network Mode Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">选择网络模式</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="networkMode"
                  value="local"
                  checked={editNetworkMode === 'local'}
                  onChange={() => setEditNetworkMode('local')}
                  className="h-4 w-4 text-primary-600"
                />
                <span>本地模式</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="networkMode"
                  value="remote"
                  checked={editNetworkMode === 'remote'}
                  onChange={() => setEditNetworkMode('remote')}
                  className="h-4 w-4 text-primary-600"
                />
                <span>远程模式</span>
              </label>
            </div>
          </div>

          {/* Configuration for Selected Mode */}
          {editNetworkMode === 'local' ? (
            <div className="space-y-4 p-4 border rounded-md bg-blue-50">
              <h3 className="font-medium text-gray-900">本地模式配置</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Client 服务地址</label>
                <input
                  type="text"
                  value={editLocalClientHost}
                  onChange={(e) => setEditLocalClientHost(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="例如: http://127.0.0.1:5000"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">区块链服务地址</label>
                <input
                  type="text"
                  value={editLocalBlockchainHost}
                  onChange={(e) => setEditLocalBlockchainHost(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="例如: http://127.0.0.1:7777"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 border rounded-md bg-green-50">
              <h3 className="font-medium text-gray-900">远程模式配置</h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Client 服务地址</label>
                <input
                  type="text"
                  value={editRemoteClientHost}
                  onChange={(e) => setEditRemoteClientHost(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="例如: https://api.example.com:19090"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">区块链服务地址</label>
                <input
                  type="text"
                  value={editRemoteBlockchainHost}
                  onChange={(e) => setEditRemoteBlockchainHost(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="例如: https://blockchain.example.com:45549"
                />
              </div>
            </div>
          )}

          {/* Current Active Addresses */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">当前使用的地址</label>
            <div className="space-y-2 p-3 bg-gray-50 rounded-md text-sm">
              <div>Client: <span className="font-mono">{clientServerHost}</span></div>
              <div>区块链: <span className="font-mono">{blockchainServerHost}</span></div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleResetToDefaults}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            恢复默认配置
          </Button>
          <Button variant="primary" onClick={handleSaveConfig}>
            保存配置
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
