'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function RiskAssessment() {
  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">风险评估</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>风险评分</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-red-600">78</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#f0f0f0" 
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="10" 
                    strokeDasharray="283" 
                    strokeDashoffset="62" 
                    strokeLinecap="round" 
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-center text-gray-600">高风险</p>
              <p className="text-center text-sm text-gray-500 mt-2">基于当前网络环境和威胁情报的综合评分</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>风险分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">网络攻击</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">数据泄露</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">内部威胁</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">其他风险</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>最新风险预警</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h4 className="text-base font-medium text-gray-900">高危漏洞风险预警 CVE-2023-{1000 + item}</h4>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    高危
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">远程代码执行漏洞可能导致系统被完全控制，建议立即更新相关组件。</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">发现时间: 2023-11-{15 - item}</span>
                  <button className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>风险趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-gray-500">风险趋势图表</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>建议措施</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-800 rounded-full mr-2 flex-shrink-0">1</span>
                <span>立即更新所有系统和应用程序到最新版本</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-800 rounded-full mr-2 flex-shrink-0">2</span>
                <span>加强网络边界防护，限制不必要的对外服务</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 text-orange-800 rounded-full mr-2 flex-shrink-0">3</span>
                <span>实施多因素认证，特别是对关键系统</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 text-orange-800 rounded-full mr-2 flex-shrink-0">4</span>
                <span>加强员工安全意识培训，防范社会工程学攻击</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-100 text-yellow-800 rounded-full mr-2 flex-shrink-0">5</span>
                <span>定期备份关键数据，并测试恢复流程</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
