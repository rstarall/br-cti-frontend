'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SharePage() {
  const [activeTab, setActiveTab] = useState('global');

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">情报知识共享平面</h1>
          <p className="mt-2 text-lg text-gray-600">
            整合多源威胁情报，提供可视化分析工具，促进威胁情报的高效流通与共享
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="情报总量"
            value="24,892"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />

          <StatCard
            title="今日更新"
            value="128"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            }
          />

          <StatCard
            title="情报源"
            value="42"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />

          <StatCard
            title="关联分析"
            value="1,456"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>情报搜索</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="搜索威胁情报（IP、域名、哈希值等）"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="all">所有类型</option>
                  <option value="ip">IP地址</option>
                  <option value="domain">域名</option>
                  <option value="hash">文件哈希</option>
                  <option value="url">URL</option>
                </select>
                <button className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                  搜索
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="w-full"
          items={[
            {
              key: 'global',
              label: '全球威胁态势',
              children: (
                <div className="mt-6">
                  <Card>
                    <CardContent className="p-0">
                      <div className="h-96 flex items-center justify-center bg-gray-100">
                        <p className="text-gray-500">全球威胁态势地图</p>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>攻击源TOP10</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center">
                              <div className="w-8 text-right mr-2 text-gray-500">{i + 1}.</div>
                              <div className="flex-1">
                                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary-600"
                                    style={{ width: `${90 - i * 15}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="w-24 text-right text-gray-700 font-medium">
                                {i === 0 ? '美国' : i === 1 ? '中国' : i === 2 ? '俄罗斯' : i === 3 ? '巴西' : '印度'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>攻击类型分布</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                          <p className="text-gray-500">攻击类型饼图</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ),
            },
            {
              key: 'ioc',
              label: 'IOC分析',
              children: (
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>最新IOC情报</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">指标</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">威胁等级</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">来源</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新时间</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {[...Array(5)].map((_, i) => (
                              <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {i % 3 === 0 ? 'IP地址' : i % 3 === 1 ? '域名' : '文件哈希'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {i % 3 === 0 ? `192.168.1.${i + 1}` : i % 3 === 1 ? `malicious${i}.example.com` : `44d88612fea8a8f36de82e1278abb02f${i}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${i % 3 === 0 ? 'bg-red-100 text-red-800' : i % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {i % 3 === 0 ? '高' : i % 3 === 1 ? '中' : '低'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {i % 2 === 0 ? '内部分析' : '外部情报'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  2023-11-{15 - i}
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
              key: 'reports',
              label: '情报报告',
              children: (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <ReportCard
                      key={i}
                      title={`APT组织分析报告：${['Lazarus', 'APT29', 'Sandworm', 'Equation Group'][i]}`}
                      description="详细分析了该APT组织的攻击手法、使用工具、目标行业以及典型攻击案例，提供了有效的防御建议。"
                      date={`2023-${11 - Math.floor(i / 2)}-${15 - (i % 2) * 7}`}
                      tags={['APT', '威胁分析', '防御建议']}
                    />
                  ))}
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

interface ReportCardProps {
  title: string;
  description: string;
  date: string;
  tags: string[];
}

function ReportCard({ title, description, date, tags }: ReportCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">发布日期: {date}</span>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            查看报告
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
