'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWalletStore } from '@/store/walletStore';
import { formatWalletId } from '@/lib/utils';
import { Drawer } from 'antd';
import { useWindowManager } from '@/provider/WindowManager';
import WalletPage from '@/app/client/wallet/page';
import WalletRegisterPage from '@/app/client/wallet_register/page';

export function Navigation() {
  const pathname = usePathname();
  const { walletId, userInfo,loadWalletId,fetchUserDetailInfo } = useWalletStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openFramelessWindow } = useWindowManager();

  useEffect(() => {
    // 检查用户是否已登录
    if(loadWalletId()){
      fetchUserDetailInfo();
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
    }
  }, []);

  // 打开钱包登录窗口
  const handleOpenWallet = (e: React.MouseEvent) => {
    e.preventDefault();
    openFramelessWindow('钱包登录', <WalletPage />, '400px', '650px', 'wallet-window');
  };

  // 打开钱包注册窗口
  const handleOpenRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    openFramelessWindow('钱包注册', <WalletRegisterPage />, '400px', '600px', 'wallet-register-window');
  };

  // 打开导入钱包窗口
  const handleOpenImportWallet = (e: React.MouseEvent) => {
    e.preventDefault();
    //直接打开钱包窗口，并传递一个初始状态参数，表示要打开导入界面
    openFramelessWindow('钱包登录', <WalletPage />, '400px', '650px', 'wallet-window');
  };

  const navLinks = [
    { href: "/", label: "首页", active: pathname === '/' },
    { href: "/cti-market", label: "情报市场", active: pathname.startsWith('/cti-market') },
    { href: "/model-market", label: "模型市场", active: pathname.startsWith('/model-market') },
    { href: "/knowledge-plane", label: "知识平面", active: pathname.startsWith('/knowledge-plane') },
    { href: "/blockchain-explorer", label: "区块链浏览器", active: pathname.startsWith('/blockchain-explorer') }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
          <div className="text-sm text-gray-500">
            {userInfo?.value || 0} 积分
          </div>
          <div className="relative">
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
              <span className="mr-1">{userInfo?.user_name || '用户'}</span>
              <span className="text-xs text-gray-500">{walletId ? formatWalletId(walletId) : ''}</span>
            </button>
          </div>
          <Link
            href="/cti-own"
            className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm text-center"
          >
            我的情报
          </Link>
          <Link
            href="/model-own"
            className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm text-center"
          >
            我的模型
          </Link>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
          <button
            onClick={handleOpenImportWallet}
            className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm text-center"
          >
            导入钱包
          </button>
          <button
            onClick={handleOpenRegister}
            className="px-3 py-1 border border-primary-600 text-primary-600 rounded-md text-sm text-center"
          >
            钱包注册
          </button>
          {/* <button
            onClick={handleOpenImportWallet}
            className="px-3 py-1 border border-primary-600 text-primary-600 rounded-md text-sm text-center"
          >
            导入钱包
          </button> */}
        </div>
      );
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                B&R去中心化威胁情报共享平台
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
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {renderAuthButtons()}
          </div>

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

          {/* 移动端用户操作区域 */}
          <div className="px-4 py-4">
            <div className="pt-2 pb-4">
              {renderAuthButtons()}
            </div>
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
