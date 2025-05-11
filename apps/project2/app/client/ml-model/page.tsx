'use client';

import React, { useEffect } from 'react';
import { ModelHeader } from '@/components/model/ModelHeader';
import { ModelProcess } from '@/components/model/ModelProcess';
import { Tabs } from 'antd';
import { useLocalMLStore } from '@/store/localMLStore';

export default function MLModelPage() {
  const { fetchModelStats } = useLocalMLStore();

  useEffect(() => {
    // 获取初始数据
    fetchModelStats();
  }, []);

  return (
    <div className="w-full h-full overflow-auto bg-gray-50 px-3 py-3">
      <div className="mb-4">
        <ModelHeader />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Tabs
          activeKey="process"
          className="w-full px-2 py-2"
          items={[
            {
              key: 'process',
              label: '模型处理',
              children: (
                <div className="p-1">
                  <ModelProcess />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
