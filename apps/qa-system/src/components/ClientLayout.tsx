'use client';

import { useUIStore } from '@/stores/uiStore';
import React, { createContext, useContext, useState } from 'react';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';
import AuthGuard from './AuthGuard';

// 创建宽度上下文
interface SiderWidthContextType {
  width: number;
  setWidth: (width: number) => void;
}

export const FixedSiderWidthContext = createContext<SiderWidthContextType>({
  width: 300, // 默认宽度
  setWidth: () => {},
});

export const useFixedSiderWidth = () => useContext(FixedSiderWidthContext);

export default function ClientLayout({ children, sideContainer }: { children: React.ReactNode; sideContainer: React.ReactNode; }) {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const [fixedSiderWidth, setFixedSiderWidth] = useState(300);
  const pathname = usePathname();

  const showSideContainer = pathname.startsWith('/chat');

  return (
    <FixedSiderWidthContext.Provider value={{ width: fixedSiderWidth, setWidth: setFixedSiderWidth }}>
      <div className="flex h-screen overflow-hidden">
        {/* 固定的图标导航栏 */}
        <div className="w-[50px] bg-gray-50 border-r border-gray-200 flex-shrink-0">
          <Sidebar />
        </div>

        {/* 可收缩的会话历史侧边栏 */}
        {showSideContainer && (
            <aside 
                className="transition-all duration-300 ease-in-out flex-shrink-0"
                style={{ width: isSidebarCollapsed ? 0 : fixedSiderWidth }}
            >
                {sideContainer}
            </aside>
        )}
        
      {/* 主内容区 */}
      <main className="flex-1 transition-all duration-300 ease-in-out overflow-x-hidden">
        <AuthGuard>{children}</AuthGuard>
      </main>
      </div>
    </FixedSiderWidthContext.Provider>
  );
}
