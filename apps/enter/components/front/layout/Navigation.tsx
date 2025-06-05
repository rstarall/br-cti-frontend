'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Drawer, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useWindowManager } from '@/provider/WindowManager';
import NetworkComponent from '@/components/network/network';

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openWindow } = useWindowManager();

  const navLinks = [
    { href: "/", label: "首页", active: pathname === '/' },
    { href: "/discovery", label: "智能博弈风险发现", active: pathname.startsWith('/discovery') },
    { href: "/share", label: "情报知识共享平面", active: pathname.startsWith('/share') },
    { href: "/defense", label: "未知风险主动防御", active: pathname.startsWith('/defense') }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openNetworkConfig = () => {
    openWindow(
      '网络配置',
      <NetworkComponent />,
      '800px',
      '650px'
    );
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                智能博弈网络安全能力集成平台
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link, index) => (
                <NavLink key={index} href={link.href} active={link.active}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* 右侧按钮区域 */}
          <div className="flex items-center space-x-4">
            {/* 网络配置按钮 */}
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={openNetworkConfig}
              className="hidden sm:flex items-center"
              title="网络配置"
            />

            {/* 移动端菜单按钮 */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">打开菜单</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端菜单抽屉 */}
      <Drawer
        title="导航菜单"
        placement="right"
        onClose={toggleMobileMenu}
        open={mobileMenuOpen}
        width={300}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex flex-col py-2">
          {/* 移动端导航链接 */}
          <div className="px-4 py-2 border-b border-gray-200">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`block py-2 px-3 rounded-md text-base font-medium ${
                  link.active
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={toggleMobileMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Drawer>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
        active
          ? 'border-primary-600 text-gray-900'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
    >
      {children}
    </Link>
  );
}
