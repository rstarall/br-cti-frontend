'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CtiShare, CtiMarket, CtiIncentive, CtiKP } from '@/components/share/CtiComponent';
import Link from 'next/link';

export default function SharePage() {
  const [activeTab, setActiveTab] = useState('share');
  return (
    <div className="py-2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-2  mt-3">
          <h1 className="text-3xl font-bold text-gray-900">情报知识共享平面</h1>
          <p className="mt-2 text-lg text-gray-600">
            整合多源威胁情报，提供可视化分析工具，促进威胁情报的高效流通与共享
          </p>
          <Link
              href={typeof window !== 'undefined' ? localStorage.getItem('ctiFrontendHost') || 'https://2.hb6dee21a.nyat.app:28607' : 'http://127.0.0.1:3001'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 mt-4 mb-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              访问平台
            </Link>
        </div>
       <div className="px-5">
          <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{ marginBottom: "16px",paddingRight:"20px" }}
          className="w-full"
          items={[
            {
              key: 'share',
              label: '威胁情报共享',  
              children: (
              <CtiShare />
            ),
            },{
              key: ' market',
              label: '威胁情报市场',  
              children: (
                <CtiMarket />
              ),
            },{
              key: 'incentive',
              label: '激励机制',  
              children: (
                <CtiIncentive />
              ),
            },{
              key: 'kp',
              label: '知识平面',  
              children: (
                 <CtiKP />
              ),
            }
          ]}
        />
       </div>
       
      </div>
    </div>
  );
}
