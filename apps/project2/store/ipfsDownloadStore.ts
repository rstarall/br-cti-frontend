import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DownloadedFile {
  hash: string;
  filePath: string;
  fileName: string;
  downloadTime: string;
  fileSize: number;
}

interface IPFSDownloadState {
  // 下载目录设置
  downloadDirectory: string;
  
  // 下载历史记录
  downloadHistory: DownloadedFile[];
  
  // 操作
  setDownloadDirectory: (directory: string) => void;
  addDownloadedFile: (file: Omit<DownloadedFile, 'downloadTime'>) => void;
  clearDownloadHistory: () => void;
  getDownloadedFileByHash: (hash: string) => DownloadedFile | undefined;
}

export const useIPFSDownloadStore = create<IPFSDownloadState>()(
  persist(
    (set, get) => ({
      // 默认下载目录
      downloadDirectory: '',
      
      // 下载历史记录
      downloadHistory: [],
      
      // 设置下载目录
      setDownloadDirectory: (directory: string) => {
        set({ downloadDirectory: directory });
      },
      
      // 添加下载记录
      addDownloadedFile: (file) => {
        const newFile: DownloadedFile = {
          ...file,
          downloadTime: new Date().toISOString()
        };
        
        set((state) => ({
          downloadHistory: [newFile, ...state.downloadHistory]
        }));
      },
      
      // 清空下载历史
      clearDownloadHistory: () => {
        set({ downloadHistory: [] });
      },
      
      // 根据哈希获取下载记录
      getDownloadedFileByHash: (hash: string) => {
        return get().downloadHistory.find(file => file.hash === hash);
      }
    }),
    {
      name: 'ipfs-download-storage',
    }
  )
);
