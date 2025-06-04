import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NetworkState {
  clientServerHost: string;
  blockchainServerHost: string;
  networkMode: 'local' | 'remote';
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;

  // 操作
  setClientServerHost: (host: string) => void;
  setBlockchainServerHost: (host: string) => void;
  setNetworkMode: (mode: 'local' | 'remote') => void;
  checkConnection: () => Promise<boolean>;
  saveConfig: () => void;
  loadConfig: () => void;
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set, get) => ({
      ctiFrontendHost: 'https://2.hb6dee21a.nyat.app:28607',//'http://127.0.0.1:3001',
      frontendHost: 'http://127.0.0.1:3000',
      clientServerHost: 'https://3.hb6dee21a.nyat.app:19090',//'http://127.0.0.1:5000',
      blockchainServerHost: 'https://4.hb6dee21a.nyat.app:45549',//'http://127.0.0.1:7777',
      networkMode: 'local',
      isConnected: false,
      isLoading: false,
      error: null,
     
      // 设置客户端服务器地址
      setClientServerHost: (host) => {
        set({ clientServerHost: host });
      },

      // 设置区块链服务器地址
      setBlockchainServerHost: (host) => {
        set({ blockchainServerHost: host });
      },

      // 设置网络模式
      setNetworkMode: (mode) => {
        set({ networkMode: mode });
      },

      // 检查连接状态
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
            error: error instanceof Error ? error.message : '网络连接失败',
            isLoading: false
          });
          return false;
        }
      },

      // 保存配置到localStorage
      saveConfig: () => {
        const { clientServerHost, blockchainServerHost, networkMode } = get();

        if (typeof window !== 'undefined') {
          localStorage.setItem('clientServerHost', clientServerHost);
          localStorage.setItem('blockchainServerHost', blockchainServerHost);
          localStorage.setItem('networkMode', networkMode);
        }
      },

      // 从localStorage加载配置
      loadConfig: () => {
        if (typeof window !== 'undefined') {
          const clientServerHost = localStorage.getItem('clientServerHost') || 'http://127.0.0.1:5000';
          const blockchainServerHost = localStorage.getItem('blockchainServerHost') || 'http://127.0.0.1:7777';
          const networkMode = (localStorage.getItem('networkMode') as 'local' | 'remote') || 'local';

          set({
            clientServerHost,
            blockchainServerHost,
            networkMode
          });
        }
      }
    }),
    {
      name: 'network-storage', // 存储的键名
    }
  )
);