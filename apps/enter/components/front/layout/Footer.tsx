import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">关于我们</h3>
            <p className="text-gray-300 text-sm">
              B&R威胁情报共享平台致力于打造去中心化、可信、安全的威胁情报共享生态。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/cti-market" className="text-gray-300 hover:text-white text-sm">
                  情报市场
                </Link>
              </li>
              <li>
                <Link href="/model-market" className="text-gray-300 hover:text-white text-sm">
                  模型市场
                </Link>
              </li>
              <li>
                <Link href="/knowledge-plane" className="text-gray-300 hover:text-white text-sm">
                  知识平面
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">资源</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-gray-300 hover:text-white text-sm">
                  文档
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-300 hover:text-white text-sm">
                  API
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white text-sm">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">
                邮箱: contact@br-cti.com
              </li>
              <li className="text-gray-300 text-sm">
                电话: 123-456-7890
              </li>
              <li className="text-gray-300 text-sm">
                地址: 中国广州市黄埔区
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} B&R威胁情报共享平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}
