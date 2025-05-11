import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Banner() {
  return (
    <div className="relative bg-primary-900 text-white" style={{ zIndex: 1 }}>

      {/* 内容 */}
      <div className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center md:text-left md:max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            B&R去中心化威胁情报共享平台
          </h1>
          <p className="mt-6 text-xl">
            打造去中心化、可信、安全的B&R威胁情报共享生态
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/client/wallet"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
            >
              用户登录
            </Link>
            <Link
              href="/client/wallet_register"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              钱包注册
            </Link>
          </div>
        </div>
      </div>

      {/* 导航标签 */}
      <div className="relative z-1 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center md:justify-start space-x-8 py-4">
            <button
              className="text-white hover:text-primary-200 px-3 py-2 text-xl font-medium"
              onClick={() => scrollToView('platform-intro')}
            >
              平台介绍
            </button>
            <button
              className="text-white hover:text-primary-200 px-3 py-2 text-xl font-medium"
              onClick={() => scrollToView('incentive-mechanism')}
            >
              激励机制
            </button>
            <button
              className="text-white hover:text-primary-200 px-3 py-2 text-xl font-medium"
              onClick={() => scrollToView('platform-features')}
            >
              平台特色
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 滚动到指定元素
function scrollToView(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
