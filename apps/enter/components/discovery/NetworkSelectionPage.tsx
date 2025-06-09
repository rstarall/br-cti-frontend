'use client';

import React from 'react';
import { Card, Button } from 'antd';

interface NetworkSelectionPageProps {
  onNetworkSelect: (network: 'ip' | '5g' | 'satellite') => void;
}

export default function NetworkSelectionPage({ onNetworkSelect }: NetworkSelectionPageProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">博弈模型选择</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* IP网络卡片 */}
        <Card
          hoverable
          className="transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
          cover={
            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden">
              <img
                src="./static/game/ip.png"
                alt="IP网络"
                className="w-[100%] h-[100%] object-cover z-10"
              />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          }
          onClick={() => onNetworkSelect('ip')}
        >
          <Card.Meta
            title={<h2 className="text-xl font-bold text-gray-800">端网协同防御</h2>}
            description={
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">防御者静态过滤博弈</h3>
                <p className="text-gray-600 mb-4">利用静态博弈决定DDoS过滤策略</p>
                <Button type="primary" className="w-full">
                  了解更多
                </Button>
              </div>
            }
          />
        </Card>

        {/* 5G网络卡片 */}
        <Card
          hoverable
          className="transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
          cover={
            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative overflow-hidden">
              <img
                src="./static/game/5g.png"
                alt="5G网络"
                className="w-[100%] h-[100%] object-cover z-10"
              />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          }
          onClick={() => onNetworkSelect('5g')}
        >
          <Card.Meta
            title={<h2 className="text-xl font-bold text-gray-800">攻防对抗动态博弈</h2>}
            description={
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">动态Stackelberg攻防博弈</h3>
                <p className="text-gray-600 mb-4">利用攻防动态博弈分析双方收益</p>
                <Button type="primary" className="w-full">
                  了解更多
                </Button>
              </div>
            }
          />
        </Card>

        {/* 卫星网络卡片 */}
        <Card
          hoverable
          className="transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
          cover={
            <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center relative overflow-hidden">
              <img
                src="./static/game/sate.png"
                alt="卫星网络"
                className="w-[100%] h-[100%] object-cover z-10"
              />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          }
          onClick={() => onNetworkSelect('satellite')}
        >
          <Card.Meta
            title={<h2 className="text-xl font-bold text-gray-800">智能博弈风险抑制</h2>}
            description={
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">平均场动态博弈</h3>
                <p className="text-gray-600 mb-4">利用平均场博弈动态决定防御资源分配</p>
                <Button type="primary" className="w-full">
                  了解更多
                </Button>
              </div>
            }
          />
        </Card>
      </div>
    </div>
  );
}
