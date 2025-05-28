'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {Tabs} from 'antd';
import GameDiscovery from '@/components/discovery/GameDiscovery';

export default function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState('game');
  return (
    <div className="py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-1">
          <h1 className="text-3xl font-bold text-gray-900">智能博弈风险发现</h1>
          <p className="mt-2 text-lg text-gray-600">
            通过智能博弈技术主动发现网络安全风险，提前预警潜在威胁
          </p>
        </div>
      <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="w-full"
          items={[
            {
              key: 'game',
              label: '博弈策略分析',  //修改过
              children: (
              <Card className="mt-1 mb-8">
                <CardContent>
                  <GameDiscovery />
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

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className="rounded-full bg-primary-50 p-3 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-2xl font-bold text-primary-600">{value}</p>
      </div>
    </div>
  );
}

interface RiskItemProps {
  title: string;
  description: string;
  level: string;
  date: string;
}

function RiskItem({ title, description, level, date }: RiskItemProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case '高危':
        return 'bg-red-100 text-red-800';
      case '中危':
        return 'bg-yellow-100 text-yellow-800';
      case '低危':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-gray-900">{title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
          {level}
        </span>
      </div>
      <p className="mt-2 text-gray-600">{description}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm text-gray-500">发现时间: {date}</span>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          查看详情
        </button>
      </div>
    </div>
  );
}
