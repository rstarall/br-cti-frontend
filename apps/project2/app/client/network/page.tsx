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
   const { messageApi } = useMessage();
  const [localClientHost, setLocalClientHost] = useState(clientServerHost);
  const [localBlockchainHost, setLocalBlockchainHost] = useState(blockchainServerHost);
  const [localNetworkMode, setLocalNetworkMode] = useState<'local' | 'remote'>(networkMode);

  useEffect(() => {
    // Check connection on load
    checkConnection();
  }, []);

  const handleSaveConfig = () => {
    setClientServerHost(localClientHost);
    setBlockchainServerHost(localBlockchainHost);
    setNetworkMode(localNetworkMode);
    saveConfig();

    // Check connection with new settings
    checkConnection();

    messageApi.success('配置已保存');
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

          {/* Network Mode */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">网络模式</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="networkMode"
                  value="local"
                  checked={localNetworkMode === 'local'}
                  onChange={() => setLocalNetworkMode('local')}
                  className="h-4 w-4 text-primary-600"
                />
                <span>本地模式</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="networkMode"
                  value="remote"
                  checked={localNetworkMode === 'remote'}
                  onChange={() => setLocalNetworkMode('remote')}
                  className="h-4 w-4 text-primary-600"
                />
                <span>远程模式</span>
              </label>
            </div>
          </div>

          {/* Client Server */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Client 服务地址</label>
            <input
              type="text"
              value={localClientHost}
              onChange={(e) => setLocalClientHost(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="例如: http://127.0.0.1:5000"
            />
          </div>

          {/* Blockchain Server */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">区块链服务地址</label>
            <input
              type="text"
              value={localBlockchainHost}
              onChange={(e) => setLocalBlockchainHost(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="例如: http://127.0.0.1:7777"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="primary" onClick={handleSaveConfig}>
            保存配置
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
