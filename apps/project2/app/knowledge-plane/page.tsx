'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import { NormalKnowledgePlane } from '@/components/front/knowledge-plane/NormalKnowledgePlane';
import { TrafficKnowledgePlane } from '@/components/front/knowledge-plane/TrafficKnowledgePlane';
import { IOCSearch } from '@/components/front/knowledge-plane/IOCSearch';

export default function KnowledgePlanePage() {
  const [activeTab, setActiveTab] = useState('normal');

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">知识平面</h1>
          <p className="mt-2 text-lg text-gray-600">
            可视化展示威胁情报数据，帮助您了解全球威胁态势
          </p>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="w-full"
          items={[
            {
              key: 'normal',
              label: '常规攻击',
              children: (
                <div className="mt-6">
                  <NormalKnowledgePlane />
                </div>
              ),
            },
            {
              key: 'traffic',
              label: '流量攻击',
              children: (
                <div className="mt-6">
                  <TrafficKnowledgePlane />
                </div>
              ),
            },
            {
              key: 'search',
              label: 'IOC搜索',
              children: (
                <div className="mt-6">
                  <IOCSearch />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
