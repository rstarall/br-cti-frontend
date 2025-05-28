import { create } from 'zustand';

interface UIConfigState {
  // 导航和页脚显示状态
  hideNav: boolean;
  hideFooter: boolean;
  
  // 操作
  setHideNav: (hide: boolean) => void;
  setHideFooter: (hide: boolean) => void;
  setUIConfig: (config: Partial<UIConfigState>) => void;
  
  // 从URL初始化配置
  initFromURL: () => void;
}

export const useUIConfigStore = create<UIConfigState>((set) => ({
  // 默认状态
  hideNav: true,
  hideFooter: true,
  
  // 设置导航显示状态
  setHideNav: (hide) => set({ hideNav: hide }),
  
  // 设置页脚显示状态
  setHideFooter: (hide) => set({ hideFooter: hide }),
  
  // 批量设置UI配置
  setUIConfig: (config) => set((state) => ({ ...state, ...config })),
  
  // 从URL初始化配置
  initFromURL: () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      
      // 检查hideNav参数
      const hideNavParam = url.searchParams.get('hideNav');
      const hideNav = hideNavParam === 'true';
      
      // 检查hideFooter参数
      const hideFooterParam = url.searchParams.get('hideFooter');
      const hideFooter = hideFooterParam === 'true';
      
      set({ hideNav, hideFooter });
    }
  }
}));