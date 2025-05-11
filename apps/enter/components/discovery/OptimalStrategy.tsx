'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function OptimalStrategy() {
  const [activeTab, setActiveTab] = useState('network');
  const [selectedScenario, setSelectedScenario] = useState('ip');
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);

  // 网络环境策略数据
  const networkStrategies = {
    ip: [
      { 
        id: 1, 
        name: '多层防御策略', 
        description: '结合防火墙、IDS/IPS、WAF等多层防御措施，形成纵深防御体系',
        effectiveness: 85,
        cost: 'high',
        implementation: '中等',
        scenarios: ['大型企业网络', '政府机构', '金融机构'],
        gameTheoryBasis: '基于联盟博弈模型，通过多方协作提高整体防御效果'
      },
      { 
        id: 2, 
        name: '蜜罐诱捕策略', 
        description: '部署蜜罐系统，诱导攻击者攻击虚假目标，同时收集攻击情报',
        effectiveness: 75,
        cost: 'medium',
        implementation: '简单',
        scenarios: ['研究机构', '技术企业', '数据中心'],
        gameTheoryBasis: '基于超博弈模型，利用攻击者信息不对称性获取优势'
      },
      { 
        id: 3, 
        name: '动态防御策略', 
        description: '定期变更网络拓扑、服务配置和访问策略，增加攻击难度',
        effectiveness: 80,
        cost: 'medium',
        implementation: '复杂',
        scenarios: ['军事网络', '关键基础设施', '高价值目标'],
        gameTheoryBasis: '基于随机博弈模型，通过不确定性增加攻击成本'
      },
    ],
    '5g': [
      { 
        id: 1, 
        name: '网络切片隔离策略', 
        description: '利用5G网络切片技术，对不同业务进行安全隔离，限制攻击扩散范围',
        effectiveness: 90,
        cost: 'high',
        implementation: '复杂',
        scenarios: ['智慧城市', '工业物联网', '自动驾驶'],
        gameTheoryBasis: '基于联盟博弈模型，通过资源合理分配最大化整体安全性'
      },
      { 
        id: 2, 
        name: '边缘计算安全策略', 
        description: '在边缘节点部署安全防护，降低核心网络暴露风险',
        effectiveness: 85,
        cost: 'medium',
        implementation: '中等',
        scenarios: ['智能制造', '远程医疗', '智能电网'],
        gameTheoryBasis: '基于分层博弈模型，优化防御资源分配'
      },
      { 
        id: 3, 
        name: '零信任安全策略', 
        description: '实施零信任安全架构，对所有访问请求进行严格认证和授权',
        effectiveness: 95,
        cost: 'very high',
        implementation: '非常复杂',
        scenarios: ['金融服务', '政府网络', '医疗健康'],
        gameTheoryBasis: '基于重复博弈模型，通过持续验证建立信任机制'
      },
    ],
    satellite: [
      { 
        id: 1, 
        name: '通信加密策略', 
        description: '对卫星通信链路实施端到端加密，防止数据窃听和篡改',
        effectiveness: 90,
        cost: 'medium',
        implementation: '中等',
        scenarios: ['军事通信', '远程地区连接', '海洋监测'],
        gameTheoryBasis: '基于信息不完备博弈模型，通过加密提高攻击成本'
      },
      { 
        id: 2, 
        name: '抗干扰策略', 
        description: '采用频率跳变、扩频等技术，增强卫星通信抗干扰能力',
        effectiveness: 85,
        cost: 'high',
        implementation: '复杂',
        scenarios: ['战场通信', '应急响应', '关键基础设施'],
        gameTheoryBasis: '基于随机博弈模型，通过不确定性降低干扰效果'
      },
      { 
        id: 3, 
        name: '地面站防护策略', 
        description: '加强卫星地面站物理和网络安全防护，防止控制系统被攻击',
        effectiveness: 95,
        cost: 'very high',
        implementation: '复杂',
        scenarios: ['航天控制中心', '卫星运营商', '国防设施'],
        gameTheoryBasis: '基于多层博弈模型，综合物理和网络防御措施'
      },
    ]
  };

  // 攻击场景策略数据
  const attackStrategies = {
    ddos: [
      { 
        id: 1, 
        name: '流量清洗策略', 
        description: '部署DDoS流量清洗设备，过滤恶意流量',
        effectiveness: 85,
        cost: 'high',
        implementation: '中等',
        gameTheoryBasis: '基于资源博弈模型，通过资源优势抵御攻击'
      },
      { 
        id: 2, 
        name: '弹性扩展策略', 
        description: '利用云资源自动扩展能力，吸收DDoS攻击流量',
        effectiveness: 90,
        cost: 'medium',
        implementation: '简单',
        gameTheoryBasis: '基于资源博弈模型，通过资源动态调整应对攻击'
      },
    ],
    apt: [
      { 
        id: 1, 
        name: '威胁情报策略', 
        description: '收集和分析APT组织情报，预测和防御定向攻击',
        effectiveness: 80,
        cost: 'medium',
        implementation: '复杂',
        gameTheoryBasis: '基于信息博弈模型，通过情报优势获取主动'
      },
      { 
        id: 2, 
        name: '零日漏洞防护策略', 
        description: '部署行为分析和异常检测系统，识别未知威胁',
        effectiveness: 75,
        cost: 'high',
        implementation: '非常复杂',
        gameTheoryBasis: '基于不完全信息博弈模型，应对未知威胁'
      },
    ],
    insider: [
      { 
        id: 1, 
        name: '最小权限策略', 
        description: '实施最小权限原则，限制用户访问范围',
        effectiveness: 85,
        cost: 'low',
        implementation: '中等',
        gameTheoryBasis: '基于委托代理博弈模型，平衡安全与可用性'
      },
      { 
        id: 2, 
        name: '行为分析策略', 
        description: '部署用户行为分析系统，检测异常行为',
        effectiveness: 90,
        cost: 'medium',
        implementation: '复杂',
        gameTheoryBasis: '基于信号博弈模型，通过行为分析识别威胁'
      },
    ]
  };

  // 获取当前选择的网络环境策略
  const getCurrentNetworkStrategies = () => {
    return networkStrategies[selectedScenario as keyof typeof networkStrategies] || [];
  };

  // 获取策略有效性颜色
  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 90) return 'text-green-600';
    if (effectiveness >= 80) return 'text-blue-600';
    if (effectiveness >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 获取成本标签
  const getCostLabel = (cost: string) => {
    switch (cost) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      case 'very high': return '非常高';
      default: return cost;
    }
  };

  // 获取成本颜色
  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'very high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">最优防御策略</h2>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'network'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('network')}
            >
              网络环境策略
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attack'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('attack')}
            >
              攻击场景策略
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'custom'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('custom')}
            >
              自定义策略
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'network' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              className={`px-4 py-2 rounded-md text-sm ${
                selectedScenario === 'ip'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedScenario('ip')}
            >
              IP网络
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm ${
                selectedScenario === '5g'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedScenario('5g')}
            >
              5G网络
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm ${
                selectedScenario === 'satellite'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedScenario('satellite')}
            >
              卫星网络
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {getCurrentNetworkStrategies().map((strategy, index) => (
              <Card 
                key={strategy.id}
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  selectedStrategy === strategy.id ? 'border-primary-300 shadow-md' : ''
                }`}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{strategy.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCostColor(strategy.cost)}`}>
                      成本: {getCostLabel(strategy.cost)}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">有效性</span>
                      <span className={`text-sm font-medium ${getEffectivenessColor(strategy.effectiveness)}`}>
                        {strategy.effectiveness}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          strategy.effectiveness >= 90 ? 'bg-green-600' :
                          strategy.effectiveness >= 80 ? 'bg-blue-600' :
                          strategy.effectiveness >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                        }`} 
                        style={{ width: `${strategy.effectiveness}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">适用场景:</h4>
                    <div className="flex flex-wrap gap-2">
                      {strategy.scenarios.map((scenario, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {scenario}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">博弈理论基础:</h4>
                    <p className="text-sm text-blue-800">{strategy.gameTheoryBasis}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'attack' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              className={`px-4 py-2 rounded-md text-sm ${
                selectedScenario === 'ddos'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedScenario('ddos')}
            >
              DDoS攻击
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm ${
                selectedScenario === 'apt'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedScenario('apt')}
            >
              APT攻击
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm ${
                selectedScenario === 'insider'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedScenario('insider')}
            >
              内部威胁
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {attackStrategies[selectedScenario as keyof typeof attackStrategies]?.map((strategy) => (
              <Card 
                key={strategy.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{strategy.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCostColor(strategy.cost)}`}>
                      成本: {getCostLabel(strategy.cost)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{strategy.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">有效性</span>
                      <span className={`text-sm font-medium ${getEffectivenessColor(strategy.effectiveness)}`}>
                        {strategy.effectiveness}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          strategy.effectiveness >= 90 ? 'bg-green-600' :
                          strategy.effectiveness >= 80 ? 'bg-blue-600' :
                          strategy.effectiveness >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                        }`} 
                        style={{ width: `${strategy.effectiveness}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">{strategy.gameTheoryBasis}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'custom' && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">自定义策略功能正在开发中...</p>
        </div>
      )}
    </div>
  );
}
