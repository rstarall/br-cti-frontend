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
              href={typeof window !== 'undefined' ? localStorage.getItem('networkMode') === 'remote' ? 'https://2.hb6dee21a.nyat.app:28607' : 'http://127.0.0.1:3001' : 'http://127.0.0.1:3001'}
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
            },
            {
              key: 'qa',
              label: '安全智能问答系统',
              children: (
                <div className="max-w-4xl mx-auto py-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">安全智能问答系统</h2>
                    <p className="text-lg text-gray-600 mb-2">基于威胁情报的智能问答系统</p>
                    <p className="text-gray-500">提供专业的安全知识解答和威胁情报分析</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="aspect-video bg-gray-100">
                      <img 
                        src="/qa-system/docs/imgs/frontend.png" 
                        alt="安全智能问答系统界面预览"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2IvPgo8cGF0aCBkPSJNMzY1IDIwMEg0MzVWNDAwSDM2NVYyMDBaIiBmaWxsPSIjOUVBN0Y5Ii8+CjxwYXRoIGQ9Ik0yODUgMTUwQzI4NSAxMzQuNSAyOTcuNSAxMjIgMzEzIDEyMkMzMjguNSAxMjIgMzQxIDEzNC41IDM0MSAxNTBDMzQxIDE2NS41IDMyOC41IDE3OCAzMTMgMTc4QzI5Ny41IDE3OCAyODUgMTY1LjUgMjg1IDE1MFoiIGZpbGw9IiM2MjdERkEiLz4KPHBhdGggZD0iTTQwMCAxNTBDNDAwIDEzNC41IDQxMi41IDEyMiA0MjggMTIyQzQ0My41IDEyMiA0NTYgMTM0LjUgNDU2IDE1MEM0NTYgMTY1LjUgNDQzLjUgMTc4IDQyOCAxNzhDNDEyLjUgMTc4IDQwMCAxNjUuNSA0MDAgMTUwWiIgZmlsbD0iIzYyN0RGQSIvPgo8cGF0aCBkPSJNNDU1IDIwMEg1MjVWNDBwSDQ1NVYyMDBaIiBmaWxsPSIjOUVBN0Y5Ii8+CjxwYXRoIGQ9Ik01MTUgMTUwQzUxNSAxMzQuNSA1MjcuNSAxMjIgNTQzIDEyMkM1NTguNSAxMjIgNTcxIDEzNC41IDU3MSAxNTBDNTcxIDE2NS41IDU1OC41IDE3OCA1NDMgMTc4QzUyNy41IDE3OCA1MTUgMTY1LjUgNTE1IDE1MFoiIGZpbGw9IiM2MjdERkEiLz4KPC9zdmc+';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">系统特色功能</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span>智能问答：基于威胁情报知识库的AI对话</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span>知识图谱：可视化威胁关系网络</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span>实时分析：动态威胁情报处理</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span>文档检索：精准的知识库查询</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Link
                      href={typeof window !== 'undefined' ? localStorage.getItem('networkMode') === 'remote' ? 'https://2.hb6dee21a.nyat.app:3002' : 'http://127.0.0.1:3002' : 'http://127.0.0.1:3002'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      立即体验问答系统
                    </Link>
                  </div>
                </div>
              ),
            }
          ]}
        />
       </div>
       
      </div>
    </div>
  );
}
