import { create } from 'zustand';
import { persist, type StorageValue } from 'zustand/middleware';

interface ApiStoreState {
  apiList: Record<string, { url: string, key: string }>;
  setApiUrl: (key: string, url: string) => void;
  getApiUrl: (key: string) => string;
}

export const useApiStore = create<ApiStoreState>()(
  persist(
    (set, get) => ({
      apiList: {
        "base": {
          url: "http://localhost:8080",
          key: "base"
        },
        "agent":{
            url:"http://localhost:8080/agent",
            key:'agent'
        }
      },
      setApiUrl: (key: string, url: string) => set((state) => ({ 
        apiList: { 
          ...state.apiList, 
          [key]: { url, key } 
        } 
      })),
      getApiUrl: (key: string) => {
        const api = get().apiList[key];
        return api ? api.url : "";
      }
    }),
    {
      name: 'api-storage',
      partialize: (state) => ({ apiList: state.apiList }),
      storage: typeof window !== 'undefined' ? {
        getItem: (name): StorageValue<{ apiList: Record<string, { url: string, key: string }> }> | null => {
          try {
            const str = localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          } catch (err) {
            console.warn('存储访问失败:', err);
            return null;
          }
        },
        setItem: (name, value: StorageValue<{ apiList: Record<string, { url: string, key: string }> }>) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (err) {
            console.warn('存储写入失败:', err);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (err) {
            console.warn('存储删除失败:', err);
          }
        }
      } : undefined
    }
  )
);
