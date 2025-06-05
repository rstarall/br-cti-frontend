import { create } from 'zustand';

// 默认地址配置
const DEFAULT_CONFIG = {
  local: {
    clientServerHost: 'http://127.0.0.1:5000',
    blockchainServerHost: 'http://127.0.0.1:7777'
  },
  remote: {
    clientServerHost: 'https://3.hb6dee21a.nyat.app:19090',
    blockchainServerHost: 'https://4.hb6dee21a.nyat.app:45549'
  }
};

interface NetworkState {
  clientServerHost: string;
  blockchainServerHost: string;
  localClientServerHost: string;
  localBlockchainServerHost: string;
  remoteClientServerHost: string;
  remoteBlockchainServerHost: string;
  networkMode: 'local' | 'remote';
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setClientServerHost: (host: string) => void;
  setBlockchainServerHost: (host: string) => void;
  setLocalClientServerHost: (host: string) => void;
  setLocalBlockchainServerHost: (host: string) => void;
  setRemoteClientServerHost: (host: string) => void;
  setRemoteBlockchainServerHost: (host: string) => void;
  setNetworkMode: (mode: 'local' | 'remote') => void;
  resetToDefaults: () => void;
  checkConnection: () => Promise<boolean>;
  saveConfig: () => void;
  loadConfig: () => void;
  autoDetectMode: () => 'local' | 'remote';
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  // 当前使用的地址（根据模式自动切换）
  clientServerHost: '',
  blockchainServerHost: '',

  // 本地模式地址
  localClientServerHost: typeof window !== 'undefined' ?
    localStorage.getItem('localClientServerHost') || DEFAULT_CONFIG.local.clientServerHost :
    DEFAULT_CONFIG.local.clientServerHost,
  localBlockchainServerHost: typeof window !== 'undefined' ?
    localStorage.getItem('localBlockchainServerHost') || DEFAULT_CONFIG.local.blockchainServerHost :
    DEFAULT_CONFIG.local.blockchainServerHost,

  // 远程模式地址
  remoteClientServerHost: typeof window !== 'undefined' ?
    localStorage.getItem('remoteClientServerHost') || DEFAULT_CONFIG.remote.clientServerHost :
    DEFAULT_CONFIG.remote.clientServerHost,
  remoteBlockchainServerHost: typeof window !== 'undefined' ?
    localStorage.getItem('remoteBlockchainServerHost') || DEFAULT_CONFIG.remote.blockchainServerHost :
    DEFAULT_CONFIG.remote.blockchainServerHost,

  networkMode: 'local', // 初始值，会在loadConfig中自动检测
  isConnected: false,
  isLoading: false,
  error: null,

  setClientServerHost: (host) => {
    const { networkMode } = get();
    const updates: any = { clientServerHost: host };

    // 同时更新对应模式的地址
    if (networkMode === 'local') {
      updates.localClientServerHost = host;
    } else {
      updates.remoteClientServerHost = host;
    }

    set(updates);
  },

  setBlockchainServerHost: (host) => {
    const { networkMode } = get();
    const updates: any = { blockchainServerHost: host };

    // 同时更新对应模式的地址
    if (networkMode === 'local') {
      updates.localBlockchainServerHost = host;
    } else {
      updates.remoteBlockchainServerHost = host;
    }

    set(updates);
  },

  setLocalClientServerHost: (host) => {
    const { networkMode } = get();
    const updates: any = { localClientServerHost: host };

    // 如果当前是本地模式，同时更新当前使用的地址
    if (networkMode === 'local') {
      updates.clientServerHost = host;
    }

    set(updates);
  },

  setLocalBlockchainServerHost: (host) => {
    const { networkMode } = get();
    const updates: any = { localBlockchainServerHost: host };

    // 如果当前是本地模式，同时更新当前使用的地址
    if (networkMode === 'local') {
      updates.blockchainServerHost = host;
    }

    set(updates);
  },

  setRemoteClientServerHost: (host) => {
    const { networkMode } = get();
    const updates: any = { remoteClientServerHost: host };

    // 如果当前是远程模式，同时更新当前使用的地址
    if (networkMode === 'remote') {
      updates.clientServerHost = host;
    }

    set(updates);
  },

  setRemoteBlockchainServerHost: (host) => {
    const { networkMode } = get();
    const updates: any = { remoteBlockchainServerHost: host };

    // 如果当前是远程模式，同时更新当前使用的地址
    if (networkMode === 'remote') {
      updates.blockchainServerHost = host;
    }

    set(updates);
  },

  setNetworkMode: (mode) => {
    const state = get();
    let clientServerHost: string;
    let blockchainServerHost: string;

    if (mode === 'local') {
      clientServerHost = state.localClientServerHost;
      blockchainServerHost = state.localBlockchainServerHost;
    } else {
      clientServerHost = state.remoteClientServerHost;
      blockchainServerHost = state.remoteBlockchainServerHost;
    }

    set({
      networkMode: mode,
      clientServerHost,
      blockchainServerHost
    });
  },

  resetToDefaults: () => {
    // 自动检测当前环境模式
    const detectedMode = get().autoDetectMode();

    // 重置为默认配置
    const localClientServerHost = DEFAULT_CONFIG.local.clientServerHost;
    const localBlockchainServerHost = DEFAULT_CONFIG.local.blockchainServerHost;
    const remoteClientServerHost = DEFAULT_CONFIG.remote.clientServerHost;
    const remoteBlockchainServerHost = DEFAULT_CONFIG.remote.blockchainServerHost;

    // 根据检测到的模式设置当前使用的地址
    let clientServerHost: string;
    let blockchainServerHost: string;

    if (detectedMode === 'local') {
      clientServerHost = localClientServerHost;
      blockchainServerHost = localBlockchainServerHost;
    } else {
      clientServerHost = remoteClientServerHost;
      blockchainServerHost = remoteBlockchainServerHost;
    }

    set({
      localClientServerHost,
      localBlockchainServerHost,
      remoteClientServerHost,
      remoteBlockchainServerHost,
      networkMode: detectedMode,
      clientServerHost,
      blockchainServerHost,
      isConnected: false,
      error: null
    });

    // 清除localStorage中的配置，让系统重新使用默认值
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clientServerHost');
      localStorage.removeItem('blockchainServerHost');
      localStorage.removeItem('clientNetworkMode');
      localStorage.removeItem('localClientServerHost');
      localStorage.removeItem('localBlockchainServerHost');
      localStorage.removeItem('remoteClientServerHost');
      localStorage.removeItem('remoteBlockchainServerHost');
    }
  },

  checkConnection: async () => {
    const { clientServerHost } = get();
    set({ isLoading: true, error: null });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(clientServerHost, {
        method: 'HEAD',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const isConnected = response.ok;
      set({ isConnected, isLoading: false });
      return isConnected;
    } catch (error) {
      set({
        isConnected: false,
        error: error instanceof Error ? error.message : 'Network connection failed',
        isLoading: false
      });
      return false;
    }
  },

  saveConfig: () => {
    const {
      clientServerHost,
      blockchainServerHost,
      networkMode,
      localClientServerHost,
      localBlockchainServerHost,
      remoteClientServerHost,
      remoteBlockchainServerHost
    } = get();

    if (typeof window !== 'undefined') {
      localStorage.setItem('clientServerHost', clientServerHost);
      localStorage.setItem('blockchainServerHost', blockchainServerHost);
      localStorage.setItem('clientNetworkMode', networkMode);
      localStorage.setItem('localClientServerHost', localClientServerHost);
      localStorage.setItem('localBlockchainServerHost', localBlockchainServerHost);
      localStorage.setItem('remoteClientServerHost', remoteClientServerHost);
      localStorage.setItem('remoteBlockchainServerHost', remoteBlockchainServerHost);
    }
  },

  loadConfig: () => {
    if (typeof window !== 'undefined') {
      // 自动检测模式
      const detectedMode = get().autoDetectMode();

      // 获取存储的模式，如果没有则使用检测到的模式
      const savedMode = localStorage.getItem('clientNetworkMode') as 'local' | 'remote';
      const networkMode = savedMode || detectedMode;

      const state = get();
      let clientServerHost: string;
      let blockchainServerHost: string;

      if (networkMode === 'local') {
        clientServerHost = state.localClientServerHost;
        blockchainServerHost = state.localBlockchainServerHost;
      } else {
        clientServerHost = state.remoteClientServerHost;
        blockchainServerHost = state.remoteBlockchainServerHost;
      }

      set({
        networkMode,
        clientServerHost,
        blockchainServerHost
      });
    }
  },

  autoDetectMode: () => {
    if (typeof window === 'undefined') return 'local';

    const hostname = window.location.hostname;

    // 判断是否为本地域名
    const isLocalHost = hostname === 'localhost' ||
                       hostname === '127.0.0.1' ||
                       hostname.startsWith('192.168.') ||
                       hostname.startsWith('10.') ||
                       hostname.startsWith('172.');

    return isLocalHost ? 'local' : 'remote';
  }
}));