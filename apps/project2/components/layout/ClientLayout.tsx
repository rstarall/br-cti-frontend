'use client';

import React, { useEffect } from 'react';
import { Navigation } from '@/components/front/layout/Navigation';
import { Footer } from '@/components/front/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { useNetworkStore } from '@/store/networkStore';

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { loadConfig } = useNetworkStore();

  useEffect(() => {
    // 应用启动时自动加载网络配置
    loadConfig();
  }, [loadConfig]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
      <Sidebar />
        {children}
      </main>
      <Footer />
    </div>
  );
}
