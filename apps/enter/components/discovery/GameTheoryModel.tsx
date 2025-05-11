'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function GameTheoryModel() {
  const [activeTab, setActiveTab] = useState('alliance');
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  // 联盟博弈数据
  const allianceGameData = {
    players: [
      { id: 1, name: '防御方A', strategy: ['加强防御', '保持现状'], payoff: [8, 5] },
      { id: 2, name: '防御方B', strategy: ['共享情报', '独立防御'], payoff: [7, 4] },
      { id: 3, name: '防御方C', strategy: ['部署蜜罐', '增加监控'], payoff: [6, 5] },
    ],
    attackers: [
      { id: 1, name: '攻击者X', strategy: ['DDoS攻击', '钓鱼攻击'], payoff: [6, 8] },
      { id: 2, name: '攻击者Y', strategy: ['漏洞利用', '社会工程学'], payoff: [7, 9] },
    ],
    equilibrium: {
      defenderStrategy: ['加强防御', '共享情报', '部署蜜罐'],
      attackerStrategy: ['钓鱼攻击', '社会工程学'],
      defenderPayoff: 21,
      attackerPayoff: 17,
      description: '防御方通过联盟合作获得更高收益，攻击者被迫选择次优策略'
    }
  };

  // 超博弈数据
  const hyperGameData = {
    realGame: {
      defenderPerception: [
        [3, 1],
        [0, 2]
      ],
      attackerPerception: [
        [3, 0],
        [1, 2]
      ],
      equilibrium: {
        defenderStrategy: '策略A',
        attackerStrategy: '策略A',
        defenderPayoff: 3,
        attackerPayoff: 3
      }
    },
    defenderPerception: {
      defenderPerception: [
        [3, 1],
        [0, 2]
      ],
      attackerPerception: [
        [3, 0],
        [1, 2]
      ],
      equilibrium: {
        defenderStrategy: '策略A',
        attackerStrategy: '策略A',
        defenderPayoff: 3,
        attackerPayoff: 3
      }
    },
    attackerPerception: {
      defenderPerception: [
        [3, 0],
        [4, 2]
      ],
      attackerPerception: [
        [3, 0],
        [1, 2]
      ],
      equilibrium: {
        defenderStrategy: '策略B',
        attackerStrategy: '策略A',
        defenderPayoff: 0,
        attackerPayoff: 0
      }
    },
    outcome: {
      description: '由于感知差异，攻击者选择了次优策略，防御方获得优势',
      advantage: '防御方'
    }
  };

  // 处理玩家选择
  const handlePlayerSelect = (playerId: number) => {
    setSelectedPlayer(playerId);
    setSelectedStrategy(null);
  };

  // 处理策略选择
  const handleStrategySelect = (strategy: string) => {
    setSelectedStrategy(strategy);
  };

  // 获取联盟收益
  const getAlliancePayoff = () => {
    return allianceGameData.players.reduce((sum, player) => sum + player.payoff[0], 0);
  };

  // 获取非联盟收益
  const getNonAlliancePayoff = () => {
    return allianceGameData.players.reduce((sum, player) => sum + player.payoff[1], 0);
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">博弈模型分析</h2>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alliance'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('alliance')}
            >
              联盟博弈模型
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'hyper'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('hyper')}
            >
              超博弈模型
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'simulation'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('simulation')}
            >
              博弈模拟
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'alliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>联盟博弈收益分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">联盟合作收益</span>
                      <span className="text-sm font-medium">{getAlliancePayoff()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(getAlliancePayoff() / (getAlliancePayoff() + getNonAlliancePayoff())) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">独立防御收益</span>
                      <span className="text-sm font-medium">{getNonAlliancePayoff()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${(getNonAlliancePayoff() / (getAlliancePayoff() + getNonAlliancePayoff())) * 100}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">博弈分析结论：</span> {allianceGameData.equilibrium.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>参与者策略选择</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {allianceGameData.players.map(player => (
                      <button
                        key={player.id}
                        className={`p-2 rounded-md text-sm ${
                          selectedPlayer === player.id
                            ? 'bg-primary-100 border border-primary-300'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => handlePlayerSelect(player.id)}
                      >
                        {player.name}
                      </button>
                    ))}
                  </div>
                  
                  {selectedPlayer && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">可选策略:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {allianceGameData.players
                          .find(p => p.id === selectedPlayer)
                          ?.strategy.map((strategy, index) => (
                            <button
                              key={index}
                              className={`p-2 rounded-md text-sm ${
                                selectedStrategy === strategy
                                  ? 'bg-green-100 border border-green-300'
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                              onClick={() => handleStrategySelect(strategy)}
                            >
                              {strategy}
                            </button>
                          ))}
                      </div>
                      
                      {selectedStrategy && (
                        <div className="mt-4 p-3 bg-green-50 rounded-md">
                          <p className="text-sm text-green-800">
                            <span className="font-medium">策略收益:</span> {
                              allianceGameData.players
                                .find(p => p.id === selectedPlayer)
                                ?.payoff[
                                  allianceGameData.players
                                    .find(p => p.id === selectedPlayer)
                                    ?.strategy.indexOf(selectedStrategy) || 0
                                ]
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>纳什均衡分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        参与者
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最优策略
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        收益
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allianceGameData.players.map((player, index) => (
                      <tr key={player.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {player.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {allianceGameData.equilibrium.defenderStrategy[index]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.payoff[0]}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        联盟总收益
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {allianceGameData.equilibrium.defenderPayoff}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        攻击者总收益
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {allianceGameData.equilibrium.attackerPayoff}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeTab === 'hyper' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>超博弈感知矩阵</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">防御方感知的博弈</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead>
                        <tr>
                          <th className="border border-gray-200 p-2"></th>
                          <th className="border border-gray-200 p-2 text-xs">攻击者策略A</th>
                          <th className="border border-gray-200 p-2 text-xs">攻击者策略B</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-200 p-2 text-xs font-medium">防御方策略A</td>
                          <td className="border border-gray-200 p-2 text-xs">{hyperGameData.defenderPerception.defenderPerception[0][0]},{hyperGameData.defenderPerception.attackerPerception[0][0]}</td>
                          <td className="border border-gray-200 p-2 text-xs">{hyperGameData.defenderPerception.defenderPerception[0][1]},{hyperGameData.defenderPerception.attackerPerception[0][1]}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 p-2 text-xs font-medium">防御方策略B</td>
                          <td className="border border-gray-200 p-2 text-xs">{hyperGameData.defenderPerception.defenderPerception[1][0]},{hyperGameData.defenderPerception.attackerPerception[1][0]}</td>
                          <td className="border border-gray-200 p-2 text-xs">{hyperGameData.defenderPerception.defenderPerception[1][1]},{hyperGameData.defenderPerception.attackerPerception[1][1]}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h3 className="text-sm font-medium mt-4">攻击方感知的博弈</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead>
                        <tr>
                          <th className="border border-gray-200 p-2"></th>
                          <th className="border border-gray-200 p-2 text-xs">攻击者策略A</th>
                          <th className="border border-gray-200 p-2 text-xs">攻击者策略B</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-200 p-2 text-xs font-medium">防御方策略A</td>
                          <td className="border border-gray-200 p-2 text-xs">{hyperGameData.attackerPerception.defenderPerception[0][0]},{hyperGameData.attackerPerception.attackerPerception[0][0]}</td>
                          <td className="border border-gray-200 p-2 text-xs">{hyperGameData.attackerPerception.defenderPerception[0][1]},{hyperGameData.attackerPerception.attackerPerception[0][1]}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 p-2 text-xs font-medium">防御方策略B</td>
                          <td className="border border-gray-200 p-2 text-xs">{hyperGameData.attackerPerception.defenderPerception[1][0]},{hyperGameData.attackerPerception.attackerPerception[1][0]}</td>
                          <td className="border border-gray-200 p-2 text-xs">{hyperGameData.attackerPerception.defenderPerception[1][1]},{hyperGameData.attackerPerception.attackerPerception[1][1]}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>超博弈分析结果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-md">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">博弈结果分析</h3>
                    <p className="text-sm text-blue-800">
                      {hyperGameData.outcome.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-100 rounded-md">
                      <h3 className="text-sm font-medium mb-2">防御方均衡策略</h3>
                      <p className="text-lg font-bold text-primary-600">
                        {hyperGameData.defenderPerception.equilibrium.defenderStrategy}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-100 rounded-md">
                      <h3 className="text-sm font-medium mb-2">攻击方均衡策略</h3>
                      <p className="text-lg font-bold text-red-600">
                        {hyperGameData.attackerPerception.equilibrium.attackerStrategy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-md">
                    <h3 className="text-sm font-medium text-green-800 mb-2">优势方</h3>
                    <p className="text-lg font-bold text-green-800">
                      {hyperGameData.outcome.advantage}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {activeTab === 'simulation' && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">博弈模拟功能正在开发中...</p>
        </div>
      )}
    </div>
  );
}
