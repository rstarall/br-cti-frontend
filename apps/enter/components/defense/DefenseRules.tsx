'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DefenseRules() {
  const [activeTab, setActiveTab] = useState('rules');
  const [showAddRule, setShowAddRule] = useState(false);

  const rules = [
    { id: 1, name: 'SQL注入防御规则', type: 'Web应用防护 (IP网络)', priority: 'high', status: 'enabled', description: '检测和阻止SQL注入攻击，保护Web应用和数据库安全。' },
    { id: 2, name: 'XSS攻击防御规则', type: 'Web应用防护 (IP网络)', priority: 'high', status: 'enabled', description: '检测和阻止跨站脚本攻击，保护Web应用用户安全。' },
    { id: 3, name: 'DDoS流量限制规则', type: '网络流量防护 (IP网络)', priority: 'high', status: 'enabled', description: '检测异常流量模式，限制DDoS攻击流量，保护网络服务可用性。' },
    { id: 4, name: '5G信令风暴防护规则', type: '5G网络防护', priority: 'high', status: 'enabled', description: '检测和阻止5G网络中的信令风暴攻击，保护核心网络设备。' },
    { id: 5, name: '5G切片隔离规则', type: '5G网络防护', priority: 'high', status: 'enabled', description: '确保5G网络切片之间的安全隔离，防止跨切片攻击。' },
    { id: 6, name: '卫星通信干扰防护', type: '卫星网络防护', priority: 'high', status: 'enabled', description: '检测和缓解针对卫星通信链路的干扰攻击。' },
    { id: 7, name: '卫星地面站保护规则', type: '卫星网络防护', priority: 'medium', status: 'enabled', description: '保护卫星地面站免受网络攻击，确保通信链路安全。' },
    { id: 8, name: 'API滥用防护规则', type: 'API防护 (IP网络)', priority: 'low', status: 'enabled', description: '限制API调用频率，防止API滥用和资源耗尽攻击。' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled': return 'bg-green-100 text-green-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'enabled': return '已启用';
      case 'disabled': return '已禁用';
      default: return status;
    }
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">防御规则</h2>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['rules', 'templates', 'logs'].map((tab) => (
              <button
                key={tab}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'rules' && '规则管理'}
                {tab === 'templates' && '规则模板'}
                {tab === 'logs' && '规则日志'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'rules' && (
        <>
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>防御规则列表</CardTitle>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                onClick={() => setShowAddRule(!showAddRule)}
              >
                {showAddRule ? '取消' : '添加规则'}
              </button>
            </CardHeader>
            <CardContent>
              {showAddRule && (
                <div className="mb-6 p-4 border border-gray-200 rounded-md">
                  <h3 className="text-lg font-medium mb-4">添加新规则</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">规则名称</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="输入规则名称"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">规则类型</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>Web应用防护 (IP网络)</option>
                        <option>网络流量防护 (IP网络)</option>
                        <option>API防护 (IP网络)</option>
                        <option>5G网络防护</option>
                        <option>卫星网络防护</option>
                        <option>认证防护</option>
                        <option>数据防护</option>
                        <option>行为分析</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>高</option>
                        <option>中</option>
                        <option>低</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>启用</option>
                        <option>禁用</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">规则描述</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      placeholder="输入规则描述"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">规则配置</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                      rows={5}
                      placeholder="输入规则配置（JSON格式）"
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                      保存规则
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        规则名称
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        优先级
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rules.map((rule) => (
                      <tr key={rule.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                              <div className="text-sm text-gray-500">{rule.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rule.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(rule.priority)}`}>
                            {rule.priority === 'high' ? '高' : rule.priority === 'medium' ? '中' : '低'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(rule.status)}`}>
                            {getStatusText(rule.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">
                            编辑
                          </button>
                          <button className={`mr-3 ${rule.status === 'enabled' ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'}`}>
                            {rule.status === 'enabled' ? '禁用' : '启用'}
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>规则统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">规则统计图表</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>规则触发次数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">规则触发次数图表</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            'IP网络Web应用防护模板',
            'IP网络流量防护模板',
            'IP网络API防护模板',
            '5G网络防护模板',
            '卫星网络防护模板',
            '多网络综合防护模板',
            '认证防护模板',
            '数据防护模板'
          ].map((template, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-primary-100 text-primary-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{template}</h3>
                <p className="text-sm text-gray-500 mb-4">预配置的{template.replace('模板', '')}规则集，包含针对特定网络环境的防御策略。</p>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  使用此模板
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <Card>
          <CardHeader>
            <CardTitle>规则触发日志</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="搜索日志..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>所有规则</option>
                  <option>SQL注入防御规则</option>
                  <option>XSS攻击防御规则</option>
                  <option>DDoS流量限制规则</option>
                  <option>暴力破解防护规则</option>
                </select>
              </div>
              <div>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>所有结果</option>
                  <option>已阻止</option>
                  <option>已警告</option>
                  <option>已记录</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                搜索
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      规则
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      来源IP
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      目标
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      结果
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      详情
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(10)].map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(Date.now() - index * 1000 * 60 * 5).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index % 5 === 0 ? 'SQL注入防御规则' :
                         index % 5 === 1 ? 'XSS攻击防御规则' :
                         index % 5 === 2 ? 'DDoS流量限制规则' :
                         index % 5 === 3 ? '暴力破解防护规则' :
                         '敏感数据保护规则'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {`192.168.${index + 1}.${index * 10 + 10}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index % 3 === 0 ? 'Web服务器' :
                         index % 3 === 1 ? '数据库服务器' :
                         '认证服务'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          index % 4 === 0 ? 'bg-green-100 text-green-800' :
                          index % 4 === 1 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index % 4 === 0 ? '已阻止' :
                           index % 4 === 1 ? '已警告' :
                           '已记录'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900">
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
