'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DefenseRulesDiscovery() {
  const [activeTab, setActiveTab] = useState('rules');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRuleDetail, setShowRuleDetail] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 防御规则数据
  const defenseRules = [
    {
      id: 1,
      name: '联盟防御规则-1',
      category: 'alliance',
      description: '基于联盟博弈模型的多方协作防御规则，适用于多组织协同防御场景',
      priority: 'high',
      status: 'active',
      gameTheoryModel: '联盟博弈',
      conditions: [
        '检测到针对多个组织的协同攻击',
        '攻击特征符合已知APT组织特征',
        '攻击目标涉及关键基础设施'
      ],
      actions: [
        '触发组织间威胁情报共享',
        '启动协同防御响应机制',
        '实施跨组织流量分析和阻断'
      ],
      effectiveness: 90,
      implementationComplexity: 'high',
      lastUpdated: '2023-11-10'
    },
    {
      id: 2,
      name: '超博弈欺骗规则-1',
      category: 'hyper',
      description: '基于超博弈理论的网络欺骗防御规则，利用攻击者信息不完备性获取防御优势',
      priority: 'medium',
      status: 'active',
      gameTheoryModel: '超博弈',
      conditions: [
        '检测到网络扫描和信息收集活动',
        '攻击者尝试获取网络拓扑信息',
        '攻击者进行横向移动尝试'
      ],
      actions: [
        '部署虚假网络拓扑信息',
        '激活蜜罐和蜜网系统',
        '提供误导性的系统信息'
      ],
      effectiveness: 85,
      implementationComplexity: 'medium',
      lastUpdated: '2023-11-05'
    },
    {
      id: 3,
      name: '随机博弈防御规则-1',
      category: 'stochastic',
      description: '基于随机博弈模型的动态防御规则，通过随机变化增加攻击者不确定性',
      priority: 'high',
      status: 'active',
      gameTheoryModel: '随机博弈',
      conditions: [
        '检测到持续的攻击尝试',
        '攻击者对网络结构表现出了解',
        '传统静态防御措施效果下降'
      ],
      actions: [
        '随机变更网络端口和服务',
        '动态调整防火墙规则',
        '实施IP地址和网络拓扑变化'
      ],
      effectiveness: 80,
      implementationComplexity: 'high',
      lastUpdated: '2023-10-28'
    },
    {
      id: 4,
      name: '演化博弈适应规则-1',
      category: 'evolutionary',
      description: '基于演化博弈理论的自适应防御规则，根据攻击演化动态调整防御策略',
      priority: 'medium',
      status: 'active',
      gameTheoryModel: '演化博弈',
      conditions: [
        '攻击模式显示出适应性变化',
        '攻击者绕过现有防御措施',
        '检测到新型攻击技术'
      ],
      actions: [
        '分析攻击演化模式',
        '自动生成和部署新防御规则',
        '调整检测阈值和响应策略'
      ],
      effectiveness: 85,
      implementationComplexity: 'very high',
      lastUpdated: '2023-10-15'
    },
    {
      id: 5,
      name: '信息不完备博弈规则-1',
      category: 'incomplete',
      description: '基于信息不完备博弈的防御规则，利用信息不对称优势进行防御',
      priority: 'high',
      status: 'active',
      gameTheoryModel: '信息不完备博弈',
      conditions: [
        '攻击者尝试获取系统信息',
        '检测到信息收集和侦察活动',
        '攻击者进行试探性攻击'
      ],
      actions: [
        '限制系统信息泄露',
        '提供误导性错误信息',
        '隐藏关键资产和服务'
      ],
      effectiveness: 90,
      implementationComplexity: 'medium',
      lastUpdated: '2023-09-20'
    },
    {
      id: 6,
      name: '联盟防御规则-2',
      category: 'alliance',
      description: '基于联盟博弈的资源优化分配规则，在多方防御中实现资源最优配置',
      priority: 'medium',
      status: 'active',
      gameTheoryModel: '联盟博弈',
      conditions: [
        '多个防御系统检测到协同攻击',
        '防御资源出现紧张状态',
        '攻击影响多个防御域'
      ],
      actions: [
        '动态调整防御资源分配',
        '优先保护高价值资产',
        '协调多方防御响应'
      ],
      effectiveness: 85,
      implementationComplexity: 'high',
      lastUpdated: '2023-09-10'
    }
  ];

  // 规则模板数据
  const ruleTemplates = [
    {
      id: 1,
      name: '联盟博弈防御模板',
      category: 'alliance',
      description: '适用于多方协作防御场景的规则模板，基于联盟博弈理论设计',
      complexity: 'medium',
      applicableScenarios: ['多组织协作', '行业联防', '供应链安全']
    },
    {
      id: 2,
      name: '超博弈欺骗模板',
      category: 'hyper',
      description: '利用信息不对称实施网络欺骗的规则模板，基于超博弈理论设计',
      complexity: 'high',
      applicableScenarios: ['高价值目标保护', '军事网络', '研究机构']
    },
    {
      id: 3,
      name: '随机博弈动态防御模板',
      category: 'stochastic',
      description: '通过随机变化增加攻击难度的规则模板，基于随机博弈理论设计',
      complexity: 'high',
      applicableScenarios: ['持续受到攻击的网络', '关键基础设施', '金融机构']
    },
    {
      id: 4,
      name: '演化博弈自适应模板',
      category: 'evolutionary',
      description: '根据攻击演化动态调整防御的规则模板，基于演化博弈理论设计',
      complexity: 'very high',
      applicableScenarios: ['面临APT威胁的组织', '技术企业', '研发机构']
    }
  ];

  // 过滤规则
  const filteredRules = defenseRules.filter(rule => {
    // 类别过滤
    if (selectedCategory !== 'all' && rule.category !== selectedCategory) {
      return false;
    }
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        rule.name.toLowerCase().includes(query) ||
        rule.description.toLowerCase().includes(query) ||
        rule.gameTheoryModel.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // 获取优先级标签样式
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态标签样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取复杂度标签
  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      case 'very high': return '非常高';
      default: return complexity;
    }
  };

  // 获取复杂度样式
  const getComplexityStyle = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'very high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">防御规则</h2>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rules'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('rules')}
            >
              规则列表
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('templates')}
            >
              规则模板
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              规则分析
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'rules' && (
        <>
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索规则..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                className={`px-3 py-2 rounded-md text-sm ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                全部
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm ${
                  selectedCategory === 'alliance'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory('alliance')}
              >
                联盟博弈
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm ${
                  selectedCategory === 'hyper'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory('hyper')}
              >
                超博弈
              </button>
            </div>
          </div>
          
          {showRuleDetail !== null ? (
            <div className="mb-4">
              <button
                className="mb-4 flex items-center text-primary-600 hover:text-primary-700"
                onClick={() => setShowRuleDetail(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                返回规则列表
              </button>
              
              {(() => {
                const rule = defenseRules.find(r => r.id === showRuleDetail);
                if (!rule) return null;
                
                return (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{rule.name}</CardTitle>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle(rule.priority)}`}>
                            {rule.priority === 'high' ? '高优先级' : 
                             rule.priority === 'medium' ? '中优先级' : '低优先级'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(rule.status)}`}>
                            {rule.status === 'active' ? '已启用' : 
                             rule.status === 'inactive' ? '未启用' : '测试中'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">规则描述</h3>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">博弈理论模型</h3>
                            <p className="text-sm text-primary-600 font-medium">{rule.gameTheoryModel}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">有效性评分</h3>
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-primary-600 mr-2">{rule.effectiveness}%</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-primary-600 h-2.5 rounded-full" 
                                  style={{ width: `${rule.effectiveness}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">触发条件</h3>
                            <ul className="space-y-2 text-sm">
                              {rule.conditions.map((condition, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-800 rounded-full mr-2 flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <span>{condition}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">执行动作</h3>
                            <ul className="space-y-2 text-sm">
                              {rule.actions.map((action, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-800 rounded-full mr-2 flex-shrink-0">
                                    {index + 1}
                                  </span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>实施复杂度: {getComplexityLabel(rule.implementationComplexity)}</span>
                          <span>最后更新: {rule.lastUpdated}</span>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                            编辑规则
                          </button>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            部署规则
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      规则名称
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      博弈模型
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      优先级
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      有效性
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                        <div className="text-xs text-gray-500">{rule.description.substring(0, 50)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rule.gameTheoryModel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityStyle(rule.priority)}`}>
                          {rule.priority === 'high' ? '高' : 
                           rule.priority === 'medium' ? '中' : '低'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(rule.status)}`}>
                          {rule.status === 'active' ? '已启用' : 
                           rule.status === 'inactive' ? '未启用' : '测试中'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-2">{rule.effectiveness}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-primary-600 h-1.5 rounded-full" 
                              style={{ width: `${rule.effectiveness}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-primary-600 hover:text-primary-900 mr-3"
                          onClick={() => setShowRuleDetail(rule.id)}
                        >
                          详情
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          部署
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ruleTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-md bg-primary-100 text-primary-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">复杂度:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityStyle(template.complexity)}`}>
                      {getComplexityLabel(template.complexity)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-1">适用场景:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.applicableScenarios.map((scenario, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {scenario}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  使用此模板
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>规则有效性分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-gray-500">规则有效性分析图表</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>博弈模型分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-gray-500">博弈模型分布图表</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
