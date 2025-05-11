'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SecurityModels() {
  const [activeTab, setActiveTab] = useState('models');
  const [selectedModel, setSelectedModel] = useState<number | null>(null);

  const models = [
    {
      id: 1,
      name: 'DDoS攻击防御模型',
      description: '基于深度学习的DDoS攻击防御模型，能够实时检测和阻断各类DDoS攻击流量，适用于IP网络环境。',
      type: 'IP网络防御',
      accuracy: 95,
      status: 'active',
      lastUpdated: '2023-11-10',
      version: '2.3.1'
    },
    {
      id: 2,
      name: 'SQL注入检测模型',
      description: '基于机器学习的SQL注入检测模型，可识别和阻止各种SQL注入攻击，保护IP网络中的Web应用。',
      type: 'IP网络Web应用防御',
      accuracy: 93,
      status: 'active',
      lastUpdated: '2023-11-05',
      version: '1.8.5'
    },
    {
      id: 3,
      name: '5G信令攻击防御模型',
      description: '基于强化学习的5G信令攻击防御模型，能够检测和阻止针对5G核心网的各类攻击。',
      type: '5G网络防御',
      accuracy: 91,
      status: 'active',
      lastUpdated: '2023-10-28',
      version: '2.1.0'
    },
    {
      id: 4,
      name: '卫星通信干扰检测模型',
      description: '基于时间序列分析的卫星通信干扰检测模型，能够识别和缓解针对卫星通信链路的干扰攻击。',
      type: '卫星网络防御',
      accuracy: 89,
      status: 'active',
      lastUpdated: '2023-10-15',
      version: '1.5.2'
    },
    {
      id: 5,
      name: '5G切片安全模型',
      description: '基于深度学习的5G网络切片安全模型，确保不同切片之间的安全隔离，防止跨切片攻击。',
      type: '5G网络防御',
      accuracy: 94,
      status: 'active',
      lastUpdated: '2023-09-20',
      version: '3.0.1'
    },
    {
      id: 6,
      name: '卫星地面站防护模型',
      description: '基于行为分析的卫星地面站防护模型，保护地面站免受网络攻击，确保卫星通信链路安全。',
      type: '卫星网络防御',
      accuracy: 92,
      status: 'active',
      lastUpdated: '2023-09-10',
      version: '1.2.7'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '已启用';
      case 'inactive': return '未启用';
      case 'training': return '训练中';
      default: return status;
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 90) return 'text-blue-600';
    if (accuracy >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">安全模型</h2>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['models', 'training', 'performance'].map((tab) => (
              <button
                key={tab}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'models' && '模型管理'}
                {tab === 'training' && '模型训练'}
                {tab === 'performance' && '性能分析'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'models' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>模型列表</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="搜索模型..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-3">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedModel === model.id
                          ? 'bg-primary-50 border border-primary-200'
                          : 'hover:bg-gray-50 border border-gray-200'
                      }`}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-900">{model.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                          {getStatusText(model.status)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{model.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">{model.type}</span>
                        <span className={`text-xs font-medium ${getAccuracyColor(model.accuracy)}`}>
                          准确率: {model.accuracy}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-center">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    添加新模型
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedModel ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{models.find(m => m.id === selectedModel)?.name}</CardTitle>
                    <div className="flex space-x-2">
                      <button className={`px-3 py-1 rounded-md text-sm font-medium ${
                        models.find(m => m.id === selectedModel)?.status === 'active'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}>
                        {models.find(m => m.id === selectedModel)?.status === 'active' ? '禁用' : '启用'}
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200">
                        更新
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {models.find(m => m.id === selectedModel)?.type}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        版本: {models.find(m => m.id === selectedModel)?.version}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        更新时间: {models.find(m => m.id === selectedModel)?.lastUpdated}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      {models.find(m => m.id === selectedModel)?.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">模型性能</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="text-sm text-gray-500 mb-1">准确率</div>
                        <div className={`text-2xl font-bold ${getAccuracyColor(models.find(m => m.id === selectedModel)?.accuracy || 0)}`}>
                          {models.find(m => m.id === selectedModel)?.accuracy}%
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="text-sm text-gray-500 mb-1">精确率</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {(models.find(m => m.id === selectedModel)?.accuracy || 0) - 2}%
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="text-sm text-gray-500 mb-1">召回率</div>
                        <div className="text-2xl font-bold text-green-600">
                          {(models.find(m => m.id === selectedModel)?.accuracy || 0) - 4}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">性能趋势</h3>
                      <div className="h-48 flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500">性能趋势图表</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3">检测分布</h3>
                      <div className="h-48 flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500">检测分布图表</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">配置参数</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <pre className="text-sm text-gray-700 overflow-x-auto">
{`{
  "model_type": "${models.find(m => m.id === selectedModel)?.type}",
  "version": "${models.find(m => m.id === selectedModel)?.version}",
  "threshold": 0.85,
  "max_detection_time": 100,
  "features": ["traffic_pattern", "payload_analysis", "header_inspection"],
  "preprocessing": {
    "normalization": true,
    "feature_selection": "auto"
  },
  "update_frequency": "daily"
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg p-8">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">选择模型</h3>
                  <p className="text-gray-500">从左侧列表中选择一个模型查看详情</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'training' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>模型训练</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">模型类型</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>DDoS攻击防御模型 (IP网络)</option>
                    <option>SQL注入检测模型 (IP网络)</option>
                    <option>5G信令攻击防御模型</option>
                    <option>5G切片安全模型</option>
                    <option>卫星通信干扰检测模型</option>
                    <option>卫星地面站防护模型</option>
                    <option>自定义模型</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">训练数据集</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>系统默认数据集</option>
                    <option>历史攻击数据集</option>
                    <option>综合安全数据集</option>
                    <option>自定义数据集</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">训练方法</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>监督学习</option>
                    <option>无监督学习</option>
                    <option>半监督学习</option>
                    <option>强化学习</option>
                    <option>迁移学习</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">训练资源</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>标准资源</option>
                    <option>高性能资源</option>
                    <option>分布式训练</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">高级参数</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  rows={5}
                  placeholder="输入训练参数（JSON格式）"
                  defaultValue={`{
  "learning_rate": 0.001,
  "batch_size": 64,
  "epochs": 100,
  "early_stopping": true,
  "validation_split": 0.2,
  "optimizer": "adam",
  "loss": "binary_crossentropy"
}`}
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  开始训练
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>训练任务</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        任务ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        模型类型
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        开始时间
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        进度
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(3)].map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {`TRAIN-${1000 + index}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index === 0 ? 'DDoS攻击防御模型' :
                           index === 1 ? 'SQL注入检测模型' :
                           '异常流量检测模型'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(Date.now() - index * 1000 * 60 * 30).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            index === 0 ? 'bg-blue-100 text-blue-800' :
                            index === 1 ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {index === 0 ? '训练中' :
                             index === 1 ? '已完成' :
                             '等待中'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-primary-600 h-2.5 rounded-full"
                              style={{ width: `${index === 0 ? 65 : index === 1 ? 100 : 0}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {index === 0 ? '65%' : index === 1 ? '100%' : '0%'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">
                            详情
                          </button>
                          {index !== 1 && (
                            <button className="text-red-600 hover:text-red-900">
                              取消
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>模型准确率对比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">模型准确率对比图表</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>检测时间对比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">检测时间对比图表</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>模型性能详情</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        模型名称
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        准确率
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        精确率
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        召回率
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        F1分数
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        平均检测时间
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {models.map((model) => (
                      <tr key={model.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {model.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={getAccuracyColor(model.accuracy)}>
                            {model.accuracy}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {model.accuracy - 2}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {model.accuracy - 4}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {model.accuracy - 3}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {10 + model.id * 5} ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
