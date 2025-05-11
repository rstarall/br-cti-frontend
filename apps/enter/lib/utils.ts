import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWalletId(walletId: string): string {
  if (!walletId) return '';
  if (walletId.length < 10) return walletId;

  // 如果钱包ID不是以0x开头，添加0x前缀
  const prefix = walletId.startsWith('0x') ? '' : '0x';
  return `${prefix}${walletId.substring(0, 6)}...${walletId.substring(walletId.length - 4)}`;
}

export function getLocalStorageItem(key: string, defaultValue: string = ''): string {
  if (typeof window === 'undefined') return defaultValue;
  return localStorage.getItem(key) || defaultValue;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
