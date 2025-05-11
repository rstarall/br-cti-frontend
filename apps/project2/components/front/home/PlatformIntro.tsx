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
              B&R去中心化威胁情报共享平台
            </h3>
            <p className="text-gray-600 mb-6">
              B&R去中心化威胁情报共享平台是一个基于区块链技术的去中心化威胁情报共享生态系统，旨在解决传统威胁情报共享中的信任、隐私和激励问题。
            </p>
            <p className="text-gray-600 mb-6">
              平台利用区块链的不可篡改性和智能合约技术，确保情报数据的真实性和可追溯性，同时通过代币经济模型激励用户积极参与情报的贡献和验证。
            </p>
            <p className="text-gray-600">
              我们的目标是构建一个开放、透明、高效的威胁情报生态系统，帮助组织更好地应对网络安全威胁，提升整体网络安全防御能力。
            </p>
          </div>

          {/* <div className="relative h-80 md:h-96">
            <Image
              src="/static/front/imgs/platform-intro.jpg"
              alt="平台介绍"
              fill
              style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
            />
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="去中心化架构"
            description="基于区块链技术构建的去中心化架构，无需中心化机构，确保数据的透明性和不可篡改性。"
          />

          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="可信情报共享"
            description="通过区块链技术和共识机制，确保共享的威胁情报真实可靠，建立可信的情报共享生态。"
          />

          <FeatureCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="代币激励机制"
            description="通过代币经济模型激励用户贡献高质量情报和参与验证，形成良性循环的情报共享生态。"
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
