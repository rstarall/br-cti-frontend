'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="已拦截攻击"
            value="12,486"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          <StatCard
            title="今日拦截"
            value="342"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />

          <StatCard
            title="防御规则"
            value="128"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />

          <StatCard
            title="防御模型"
            value="18"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            }
          />
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="w-full"
          items={[
            {
              key: 'dashboard',
              label: '防御仪表盘',
              children: (
                <div className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>实时攻击监控</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                          <p className="text-gray-500">实时攻击监控图表</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>攻击类型分布</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                          <p className="text-gray-500">攻击类型分布图表</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>最近拦截的攻击</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">攻击类型</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">来源IP</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">目标</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">严重程度</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {[...Array(5)].map((_, i) => (
                              <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(Date.now() - i * 1000 * 60 * 5).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {i % 4 === 0 ? 'SQL注入' : i % 4 === 1 ? 'XSS攻击' : i % 4 === 2 ? 'DDoS攻击' : '暴力破解'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {`192.168.${i + 1}.${i * 20 + 10}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {i % 3 === 0 ? 'Web服务器' : i % 3 === 1 ? '数据库服务器' : '认证服务'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${i % 3 === 0 ? 'bg-red-100 text-red-800' : i % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {i % 3 === 0 ? '高' : i % 3 === 1 ? '中' : '低'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    已拦截
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <a href="#" className="text-primary-600 hover:text-primary-900">详情</a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ),
            },
            {
              key: 'models',
              label: '防御模型',
              children: (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ModelCard
                      key={i}
                      title={[
                        'DDoS攻击防御模型',
                        'SQL注入检测模型',
                        'XSS攻击防御模型',
                        '异常流量检测模型',
                        '恶意代码检测模型',
                        '身份认证防护模型'
                      ][i]}
                      description={`基于深度学习的${[
                        'DDoS攻击防御模型，能够实时检测和阻断各类DDoS攻击流量',
                        'SQL注入检测模型，可识别和阻止各种SQL注入攻击',
                        'XSS攻击防御模型，有效防止跨站脚本攻击',
                        '异常流量检测模型，能够识别网络中的异常流量模式',
                        '恶意代码检测模型，可检测各类恶意软件和病毒',
                        '身份认证防护模型，防止暴力破解和凭证盗用'
                      ][i]}`}
                      accuracy={95 - i * 2}
                      status={i < 4 ? '已启用' : '未启用'}
                    />
                  ))}
                </div>
              ),
            },
            {
              key: 'rules',
              label: '防御规则',
              children: (
                <div className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>防御规则配置</CardTitle>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        添加规则
                      </button>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">规则ID</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">规则名称</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">防御类型</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">优先级</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {[...Array(5)].map((_, i) => (
                              <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {`RULE-${1000 + i}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {i % 5 === 0 ? 'SQL注入防御规则' : i % 5 === 1 ? 'XSS攻击防御规则' : i % 5 === 2 ? 'DDoS流量限制规则' : i % 5 === 3 ? '暴力破解防护规则' : '敏感数据保护规则'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {i % 3 === 0 ? 'Web应用防护' : i % 3 === 1 ? '网络流量防护' : '数据防护'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {i % 3 === 0 ? '高' : i % 3 === 1 ? '中' : '低'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${i % 4 === 0 ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                                    {i % 4 === 0 ? '已禁用' : '已启用'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <a href="#" className="text-primary-600 hover:text-primary-900">编辑</a>
                                    <a href="#" className="text-red-600 hover:text-red-900">删除</a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
