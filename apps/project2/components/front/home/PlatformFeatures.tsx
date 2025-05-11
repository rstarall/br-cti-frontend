import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function PlatformFeatures() {
  return (
    <section id="platform-features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">平台特色</h2>
          <div className="mt-2 h-1 w-20 bg-primary-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <FeatureCard
            title="情报市场"
            description="威胁情报市场提供丰富的威胁情报资源，包括恶意流量特征、攻击模式、漏洞信息等。用户可以使用积分购买高质量情报，也可以上传原创情报获取奖励。"
            imageSrc="/static/front/banner/banner1.png"
            linkHref="/cti-market"
            linkText="探索情报市场"
          />

          <FeatureCard
            title="模型市场"
            description="模型市场提供各类入侵检测和防御模型，包括流量检测、漏洞检测、攻击防御等模型。用户可以下载使用这些模型，也可以上传自己的模型获取奖励。"
            imageSrc="/static/front/banner/banner2.png"
            linkHref="/model-market"
            linkText="探索模型市场"
          />

          <FeatureCard
            title="知识平面"
            description="知识平面提供直观的威胁情报可视化界面，包括地理分布、攻击类型统计、时间序列分析等。用户可以快速了解全球威胁态势，发现潜在安全风险。"
            imageSrc="/static/front/banner/banner3.png"
            linkHref="/knowledge-plane"
            linkText="查看知识平面"
          />

          <FeatureCard
            title="区块链浏览器"
            description="区块链浏览器提供平台底层区块链的实时数据，包括区块信息、交易记录、智能合约状态等。用户可以验证情报和模型的真实性，追踪积分流转。"
            imageSrc="/static/front/banner/banner4.png"
            linkHref="/blockchain-explorer"
            linkText="访问区块链浏览器"
          />
        </div>

        <div className="mt-16 bg-primary-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">技术架构</h3>
            <p className="mt-2 text-gray-600">
              B&R去中心化威胁情报共享平台采用先进的技术架构，确保系统的安全性、可扩展性和高性能。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
              title="区块链层"
              description="基于联盟链技术构建的区块链网络，采用高效共识算法，确保数据的不可篡改性和可追溯性。"
            />

            <TechCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              }
              title="智能合约层"
              description="实现情报共享、验证、交易和激励机制的智能合约系统，确保规则的自动执行和透明性。"
            />

            <TechCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              }
              title="应用层"
              description="用户友好的Web界面和客户端应用，提供情报市场、模型市场、知识平面和区块链浏览器等功能。"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  linkHref: string;
  linkText: string;
}

function FeatureCard({ title, description, imageSrc, linkHref, linkText }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="relative h-48 md:h-64">
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          href={linkHref}
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          {linkText}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

interface TechCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TechCard({ icon, title, description }: TechCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-bold text-gray-900 ml-3">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
