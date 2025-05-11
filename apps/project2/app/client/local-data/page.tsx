'use client';

import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { KnowledgePlane } from '@/components/charts/KnowledgePlane';
import { DataHeader } from '@/components/data/DataHeader';
import { DataProcess } from '@/components/data/DataProcess';
import { useCtiStore } from '@/store/ctiStore';

export default function LocalDataPage() {
  const { fetchCtiStatistics } = useCtiStore();
  const [activeTab, setActiveTab] = useState('traffic');

  useEffect(() => {
    // Fetch initial data
    fetchCtiStatistics()
  }, []);

  return (
    <div className="w-full h-full overflow-auto bg-gray-50 px-3 py-3">
      <div className="mb-4">
        <DataHeader />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="w-full px-2 py-2"
          items={[
            {
              key: 'traffic',
              label: '流量(蜜罐)数据',
              children: (
                <div className="p-0">
                  <DataProcess />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
