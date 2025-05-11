/**
 * 文件大小格式化函数
 */
export function formatFileSize(size?: string | number): string {
  if (!size) return '-';
  let num = typeof size === 'string' ? parseFloat(size) : size;
  if (isNaN(num)) return '-';
  if (num < 1024) return num + 'B';
  if (num < 1024 * 1024) return (num / 1024).toFixed(2) + 'KB';
  if (num < 1024 * 1024 * 1024) return (num / 1024 / 1024).toFixed(2) + 'MB';
  return (num / 1024 / 1024 / 1024).toFixed(2) + 'GB';
}
