'use client'; // 必须添加这个指令

import { Layout } from 'antd';
import Sidebar from './Sidebar';
import ChatHeader from './Header';
import AuthGuard from './AuthGuard';
import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
const { Content, Sider } = Layout;

const defaultSiderWidth = 340;
// 创建宽度上下文
interface SiderWidthContextType {
  width: number;
  setWidth: (width: number) => void;
}

export const FixedSiderWidthContext = createContext<SiderWidthContextType>({
  width: defaultSiderWidth,
  setWidth: () => { },
});

export const useFixedSiderWidth = () => useContext(FixedSiderWidthContext);

export default function MainLayout({
  children,
  sideContainer,
}: {
  children: React.ReactNode;
  sideContainer: React.ReactNode;
}) {
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const [fixedSiderWidth, setFixedSiderWidth] = useState(defaultSiderWidth);
  const [siderWidth, setSiderWidth] = useState(50);
  const [siderPageWidth, setSiderPageWidth] = useState(defaultSiderWidth - 50);

  // 判断是否登录页
  const onAuthPage = pathname.startsWith('/auth');
  const isAuthed = !!token;
  // 未登录或在 /auth 页面：不显示侧栏与副容器
  const showSidebar = isAuthed && !onAuthPage;
  const shouldShowSideContainer = showSidebar && !pathname.startsWith('/data') && !pathname.startsWith('/kg');

  useEffect(() => {
    setSiderWidth(50);
    setSiderPageWidth(fixedSiderWidth - 50);
    console.log('fixedSiderWidth changed:', fixedSiderWidth);
  }, [fixedSiderWidth]);

  const handleMouseEnter = useCallback(() => {
    setSiderWidth(140);
    setSiderPageWidth(fixedSiderWidth - 140);
  }, [fixedSiderWidth]);

  const handleMouseLeave = useCallback(() => {
    setSiderWidth(50);
    setSiderPageWidth(fixedSiderWidth - 50);
  }, [fixedSiderWidth]);

  return (
    <Layout className="h-screen">
      {/* Header */}
      <div className="bg-white fixed top-0 left-0 right-0 z-10 h-[50px]">
        <ChatHeader />
      </div>

      <Layout className="overflow-hidden h-[calc(100vh-50px)] mt-[50px]">
        {/* 左侧导航栏 */}
        {showSidebar && (
          <Sider
            theme="light"
            width={siderWidth}
            className="!border-r-0 border-r border-gray-200 overflow-hidden transition-all duration-300"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Sidebar />
          </Sider>
        )}

        {/* 主内容区域 */}
        {shouldShowSideContainer ? (
          // 有sideContainer的布局（chat等页面）
          <Layout className="!border-r-0 w-full border-r overflow-hidden w-full bg-white">
            {showSidebar && (
              <Sider
                width={siderPageWidth}
                theme="light"
                className="!border-r-0 border-r border-gray-200"
              >
                {sideContainer}
              </Sider>
            )}

            <Content className="h-full" style={{ width: `calc(100% - ${fixedSiderWidth}px)` }}>
              <FixedSiderWidthContext.Provider value={{
                width: fixedSiderWidth,
                setWidth: setFixedSiderWidth
              }}>
                <AuthGuard>{children}</AuthGuard>
              </FixedSiderWidthContext.Provider>
            </Content>
          </Layout>
        ) : (
          // 没有sideContainer的布局（data页面和kg页面）
          <Content className="h-full bg-white flex-1">
            <FixedSiderWidthContext.Provider value={{
              width: fixedSiderWidth,
              setWidth: setFixedSiderWidth
            }}>
              <AuthGuard>{children}</AuthGuard>
            </FixedSiderWidthContext.Provider>
          </Content>
        )}
      </Layout>
    </Layout>
  );
}