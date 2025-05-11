'use client';

import React, { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useNetworkStore } from '@/store/networkStore';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { loadConfig } = useNetworkStore();

  useEffect(() => {
    // Load network configuration from localStorage
    loadConfig();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-4 px-4">
        {children}
      </div>
    </div>
  );
}
