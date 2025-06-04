'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs } from 'antd';
import DefenseMain from '@/components/defense/DDoSDefense';

export default function DefensePage() {
  const [activeTab, setActiveTab] = useState('defense');

  return (
    <div className="py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-1 mt-3">
          <h1 className="text-3xl font-bold text-gray-900">动态攻击智能防御</h1>
          <p className="mt-2 text-lg text-gray-600">
            基于强化学习的DDoS攻击检测与防御，实现DDoS监控和零抑制比防御
          </p>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="w-full"
          items={[
            {
              key: 'defense',
              label: 'DDoS智能防御',
              children: (
                <Card className="mt-1 mb-8">
                  <CardContent>
                    <DefenseMain />
                  </CardContent>
                </Card>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
