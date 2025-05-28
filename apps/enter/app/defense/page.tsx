'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DDoSDefenseDemo from '@/components/defense/DefenseRules';

export default function DefensePage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">未知风险主动防御</h1>
          <p className="mt-2 text-lg text-gray-600">
            利用智能技术实现动态攻击防御，自动识别和应对各类网络攻击，提供实时保护
          </p>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="w-full"
          items={[
            // {
            //   key: 'dashboard',
            //   label: 'IP网络防御', //修改过
            // },
            // {
            //   key: 'models',
            //   label: '5G网络防御', //修改过
            // },
            {
              key: 'rules',
              label: 'DDoS攻击检测',  //修改过
              children: (
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                </CardHeader>
                <CardContent>
                  <DDoSDefenseDemo />
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

interface ModelCardProps {
  title: string;
  description: string;
  accuracy: number;
  status: string;
}

function ModelCard({ title, description, accuracy, status }: ModelCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 h-24 overflow-hidden">{description}</p>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">准确率</span>
            <span className="text-sm font-medium text-gray-700">{accuracy}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary-600 rounded-full"
              style={{ width: `${accuracy}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === '已启用' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            {status === '已启用' ? '禁用' : '启用'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
