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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <FeatureCard
            title="智能博弈风险发现"
            description="通过智能博弈技术主动发现网络安全风险，利用先进的风险评估模型，对潜在威胁进行预警，帮助组织提前做好防御准备。"
            imageSrc="/static/front/banner/banner1.png"
            linkHref="/discovery"
            linkText="探索风险发现"
          />

          <FeatureCard
            title="情报知识共享平面"
            description="构建安全情报知识共享平台，整合多源威胁情报，提供可视化分析工具，促进威胁情报的高效流通与共享，提升整体安全防御水平。"
            imageSrc="/static/front/banner/banner3.png"
            linkHref="/share"
            linkText="查看情报共享"
          />

          <FeatureCard
            title="未知风险主动防御"
            description="利用智能技术实现动态攻击防御，自动识别和应对各类网络攻击，提供实时保护，降低安全事件响应时间，提高防御效率。"
            imageSrc="/static/front/banner/banner2.png"
            linkHref="/defense"
            linkText="了解智能防御"
          />
        </div>

        <div className="mt-16 bg-primary-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">技术架构</h3>
            <p className="mt-2 text-gray-600">
              智能博弈网络安全能力集成平台采用先进的微前端架构，确保系统的灵活性、可扩展性和高性能。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
              title="微前端架构"
              description="采用微前端架构实现各功能模块的松耦合集成，提供统一的用户体验和数据共享机制，便于独立开发和部署。"
            />

            <TechCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              }
              title="智能分析引擎"
              description="强大的智能分析引擎，支持风险评估、威胁情报分析和攻击防御，为各个功能模块提供核心算法支持。"
            />

            <TechCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              }
              title="可视化展示"
              description="丰富的可视化展示组件，直观呈现安全风险、威胁情报和防御效果，帮助用户快速理解和决策。"
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
