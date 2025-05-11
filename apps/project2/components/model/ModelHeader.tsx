import React, { useEffect } from 'react';
import { useLocalMLStore } from '@/store/localMLStore';
import { DatabaseOutlined, CloudOutlined, UserOutlined, AppstoreOutlined } from '@ant-design/icons';

export function ModelHeader() {
  const {
    onchainModelCount,
    ownModelCount,
    ownOnchainModelCount,
    localModelCount,
    processedModelCount,
    processingModelCount,
    fetchModelStats
  } = useLocalMLStore();

  // 初始化时获取统计数据
  useEffect(() => {
    fetchModelStats();
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-primary-600 text-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <CloudOutlined className="text-2xl mr-3" />
            <div>
              <div className="text-2xl font-bold">{onchainModelCount}</div>
              <div className="text-sm">链上模型数量</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <UserOutlined className="text-2xl text-primary-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">{ownModelCount}</div>
              <div className="text-sm text-gray-500">我的模型</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <CloudOutlined className="text-2xl text-primary-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">{ownOnchainModelCount}</div>
              <div className="text-sm text-gray-500">我的上链</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <AppstoreOutlined className="text-2xl text-primary-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">{localModelCount}</div>
              <div className="text-sm text-gray-500">全部模型</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <DatabaseOutlined className="text-2xl text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">{processedModelCount}</div>
              <div className="text-sm text-gray-500">步骤完成</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <DatabaseOutlined className="text-2xl text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">{processingModelCount}</div>
              <div className="text-sm text-gray-500">处理步骤</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
