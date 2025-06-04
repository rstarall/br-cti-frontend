'use client';

import { useEffect } from 'react';
import { useNetworkStore } from '@/store/networkStore';

export function NetworkInitializer() {
  const { loadConfig } = useNetworkStore();

  useEffect(() => {
    // 在应用启动时加载网络配置
    loadConfig();
  }, [loadConfig]);

  return null; // 这个组件不渲染任何内容
}
