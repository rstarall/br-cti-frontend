'use client';

import React from 'react';
import { Card, Button, Tabs, Image } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface SatelliteNetworkPageProps {
  satelliteData: any;
  isLoading: boolean;
  onBack: () => void;
  onCalculate: () => Promise<void>;
}

export default function SatelliteNetworkPage({ satelliteData, isLoading, onBack, onCalculate }: SatelliteNetworkPageProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {/* 导航栏 */}
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="mr-4"
        >
          返回网络选择
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">卫星网络平均场动态博弈</h1>
      </div>

      {/* 卫星系统模型概览 */}
      <Card title="卫星网络系统模型" className="mb-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 系统模型图 */}
          <div className="lg:col-span-2">
            <div className="text-center">
              <Image
                src="/static/game/sate/sate-systemmodel.jpg"
                alt="卫星网络系统模型"
                width="80%"
                height="60%"
              />
              <p className="mt-3 text-sm text-gray-600">卫星网络系统架构与攻防博弈模型</p>
            </div>
          </div>

          {/* 模型说明 */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🛰️ 卫星网络特点</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 大规模分布式节点</li>
                <li>• 动态拓扑结构</li>
                <li>• 高延迟通信环境</li>
                <li>• 资源受限约束</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">🎯 平均场博弈</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• 多智能体决策优化</li>
                <li>• 平均场近似方法</li>
                <li>• 动态资源分配</li>
                <li>• 协同防御策略</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：博弈分析与攻防模型 */}
        <div className="space-y-6">
          {/* 博弈分析 */}
          <Card title="博弈分析" className="h-fit">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">利用平均场博弈动态决定防御资源分配</h4>

              {satelliteData?.images?.effect && (
                <div className="text-center">
                  <Image
                    src={`data:image/png;base64,${satelliteData.images.effect}`}
                    alt="效果对比图"
                    width="100%"
                    style={{ maxWidth: '500px' }}
                  />
                  <p className="mt-2 text-lg font-medium text-green-600">
                    防御成本下降 {satelliteData.reduce}%
                  </p>
                </div>
              )}

              {!satelliteData && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">点击计算策略按钮查看卫星网络博弈分析结果</p>
                  <Button type="primary" onClick={onCalculate} loading={isLoading}>
                    计算卫星网络策略
                  </Button>
                </div>
              )}

              <h4 className="font-semibold text-gray-700">平均场博弈模型优化防御资源配置</h4>
            </div>
          </Card>

          {/* 攻防模型展示 */}
          <Card title="攻防模型" className="h-fit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 攻击者模型 */}
              <div className="text-center">
                <Image
                  src="/static/game/sate/attacker.png"
                  alt="卫星网络攻击者模型"
                  width="100%"
                  style={{ maxWidth: '200px' }}
                  className="rounded-lg shadow-sm"
                />
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                  <h5 className="font-semibold text-red-800 mb-1">攻击者模型</h5>
                  <p className="text-xs text-red-600">
                    针对卫星节点的<br/>
                    分布式攻击策略
                  </p>
                </div>
              </div>

              {/* 防御者模型 */}
              <div className="text-center">
                <Image
                  src="/static/game/sate/defender.png"
                  alt="卫星网络防御者模型"
                  width="100%"
                  style={{ maxWidth: '200px' }}
                  className="rounded-lg shadow-sm"
                />
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-1">防御者模型</h5>
                  <p className="text-xs text-green-600">
                    协同防御与<br/>
                    资源优化配置
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 右侧：策略展示 */}
        <Card title="策略展示" className="h-fit">
          <Tabs defaultActiveKey="defenderA" className="min-h-96">
            <Tabs.TabPane tab="防御者A" key="defenderA">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">卫星网络防御者A</h3>
                {satelliteData ? (
                  <>
                    <p>选择与各个防御者和云协同过滤</p>
                    {satelliteData.images?.strategy1 && (
                      <Image
                        src={`data:image/png;base64,${satelliteData.images.strategy1}`}
                        alt="防御者A策略图"
                        width="100%"
                        style={{ maxWidth: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">请先计算策略</p>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="防御者B" key="defenderB">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">卫星网络防御者B</h3>
                {satelliteData ? (
                  <>
                    <p>选择与各个防御者和云协同过滤</p>
                    {satelliteData.images?.strategy2 && (
                      <Image
                        src={`data:image/png;base64,${satelliteData.images.strategy2}`}
                        alt="防御者B策略图"
                        width="100%"
                        style={{ maxWidth: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">请先计算策略</p>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="防御者C" key="defenderC">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">卫星网络防御者C</h3>
                {satelliteData ? (
                  <>
                    <p>选择与各个防御者和云协同过滤</p>
                    {satelliteData.images?.strategy3 && (
                      <Image
                        src={`data:image/png;base64,${satelliteData.images.strategy3}`}
                        alt="防御者C策略图"
                        width="100%"
                        style={{ maxWidth: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">请先计算策略</p>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="策略计算" key="calculate">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">卫星网络策略计算</h3>
                <p className="text-gray-600">卫星网络使用平均场博弈模型，无需额外参数设置</p>

                <div className="space-y-4">
                  <Button
                    type="primary"
                    onClick={onCalculate}
                    loading={isLoading}
                    className="w-full"
                    size="large"
                  >
                    计算卫星网络策略
                  </Button>

                  {satelliteData && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">计算结果：</h4>
                      <p>博弈防御成本: {satelliteData.game_cost}</p>
                      <p>独立防御成本: {satelliteData.single_cost}</p>
                      <p className="text-green-600 font-medium">
                        成本降低: {satelliteData.reduce}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
