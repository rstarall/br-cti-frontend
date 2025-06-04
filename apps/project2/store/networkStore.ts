import { create } from 'zustand';

interface NetworkState {
  clientServerHost: string;
  blockchainServerHost: string;
  networkMode: 'local' | 'remote';
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setClientServerHost: (host: string) => void;
  setBlockchainServerHost: (host: string) => void;
  setNetworkMode: (mode: 'local' | 'remote') => void;
  checkConnection: () => Promise<boolean>;
  saveConfig: () => void;
  loadConfig: () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  clientServerHost: typeof window !== 'undefined' ? localStorage.getItem('clientServerHost') || 'https://3.hb6dee21a.nyat.app:19090' : 'http://127.0.0.1:5000',
  blockchainServerHost: typeof window !== 'undefined' ? localStorage.getItem('blockchainServerHost') || 'https://4.hb6dee21a.nyat.app:45549' : 'http://127.0.0.1:7777',
  networkMode: (typeof window !== 'undefined' ? localStorage.getItem('clientNetworkMode') as 'local' | 'remote' : 'local') || 'local',
  isConnected: false,
  isLoading: false,
  error: null,
  
  setClientServerHost: (host) => {
    set({ clientServerHost: host });
  },
  
  setBlockchainServerHost: (host) => {
    set({ blockchainServerHost: host });
  },
  
  setNetworkMode: (mode) => {
    set({ networkMode: mode });
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
    const { clientServerHost, blockchainServerHost, networkMode } = get();
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientServerHost', clientServerHost);
      localStorage.setItem('blockchainServerHost', blockchainServerHost);
      localStorage.setItem('clientNetworkMode', networkMode);
      
      // Save mode-specific hosts
      if (networkMode === 'local') {
        localStorage.setItem('clientLocalServerHost', clientServerHost);
      } else {
        localStorage.setItem('clientRemoteServerHost', clientServerHost);
      }
    }
  },
  
  loadConfig: () => {
    if (typeof window !== 'undefined') {
      const networkMode = (localStorage.getItem('clientNetworkMode') as 'local' | 'remote') || 'local';
      const clientServerHost = localStorage.getItem('clientServerHost') || 'http://127.0.0.1:5000';
      const blockchainServerHost = localStorage.getItem('blockchainServerHost') || 'http://127.0.0.1:7777';
      
      set({
        networkMode,
        clientServerHost,
        blockchainServerHost
      });
    }
  }
}));
