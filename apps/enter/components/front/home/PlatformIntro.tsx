import React from 'react';
import Image from 'next/image';

export function PlatformIntro() {
  return (
    <section id="platform-intro" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">平台介绍</h2>
          <div className="mt-2 h-1 w-20 bg-primary-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              智能博弈网络安全能力集成平台
            </h3>
            <p className="text-gray-600 mb-6">
              智能博弈网络安全能力集成平台是一个集成了智能博弈风险发现、情报知识共享平面和未知风险主动防御三大功能的综合性网络安全解决方案。
            </p>
            <p className="text-gray-600 mb-6">
              平台采用微前端架构，实现了各个功能模块的松耦合集成，提供了统一的用户体验和数据共享机制，帮助组织全面提升网络安全防御能力。
            </p>
            <p className="text-gray-600">
              我们的目标是构建一个高效、智能、协同的网络安全生态系统，帮助组织更好地应对复杂多变的网络安全威胁，保障数字资产安全。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="智能博弈风险发现"
            description="通过智能博弈技术，主动发现网络安全风险，提前预警潜在威胁，为组织提供全面的风险评估。"
          />

          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            title="情报知识共享平面"
            description="构建安全情报知识共享平台，促进威胁情报的高效流通与共享，提升整体安全防御水平。"
          />

          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="未知风险主动防御"
            description="利用智能技术实现动态攻击防御，自动识别和应对各类网络攻击，提供实时保护。"
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
