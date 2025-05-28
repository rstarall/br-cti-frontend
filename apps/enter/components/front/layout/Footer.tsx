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
              智能博弈网络安全能力集成平台致力于打造主动性、协同性、智能化的网络安全能力生态。
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
                <Link href="/discovery" className="text-gray-300 hover:text-white text-sm">
                  未知风险发现
                </Link>
              </li>
              <li>
                <Link href="/share" className="text-gray-300 hover:text-white text-sm">
                  情报共享
                </Link>
              </li>
              <li>
                <Link href="/defense" className="text-gray-300 hover:text-white text-sm">
                  主动防御
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
