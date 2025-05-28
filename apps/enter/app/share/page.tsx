'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CtiShare, CtiMarket, CtiIncentive, CtiKP } from '@/components/share/CtiComponent';

export default function SharePage() {
  const [activeTab, setActiveTab] = useState('share');

  return (
    <div className="pt-2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-1">
          <h1 className="text-3xl font-bold text-gray-900">情报知识共享平面</h1>
          <p className="mt-2 text-lg text-gray-600">
            整合多源威胁情报，提供可视化分析工具，促进威胁情报的高效流通与共享
          </p>
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
