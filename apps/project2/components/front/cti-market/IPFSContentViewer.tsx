import React, { useEffect, useState } from 'react';
import { ipfsApi } from '@/api/ipfs';
import { useMessage } from '@/provider/MessageProvider';

interface IPFSContentViewerProps {
  ipfsHash: string;
  windowId?: string;
}

export function IPFSContentViewer({ ipfsHash, windowId }: IPFSContentViewerProps) {
  const [content, setContent] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { messageApi } = useMessage();

  useEffect(() => {
    const fetchIPFSContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!ipfsHash) {
          throw new Error('IPFS哈希为空');
        }

        const result = await ipfsApi.getIPFSContent(ipfsHash);
        setContent(result.content);
        setUrl(result.url);
        setIsLoading(false);
      } catch (err) {
        console.error('获取IPFS内容失败:', err);
        setError(err instanceof Error ? err.message : '获取IPFS内容失败');
        setIsLoading(false);
        messageApi.error('获取IPFS内容失败');
      }
    };

    fetchIPFSContent();
  }, [ipfsHash, messageApi]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-900 mb-2">加载失败</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700"
        >
          尝试在新窗口中打开
        </a>
      </div>
    );
  }

  // 尝试检测内容类型并适当显示
  const isJsonContent = content.startsWith('{') || content.startsWith('[');
  const isHtmlContent = content.includes('<html') || content.includes('<body');

  return (
    <div className="h-full p-2 pb-0 text-sm">
      {isHtmlContent ? (
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="IPFS Content"
          sandbox="allow-scripts"
        />
      ) : isJsonContent ? (
        <div className="bg-gray-50 p-4 rounded-md overflow-hidden">
          <div
            className="custom-scrollbar whitespace-nowrap overflow-x-auto"
            style={{
              paddingBottom: '4px'
            }}
          >
            <pre
              className="text-sm inline-block"
              style={{
                minWidth: 'max-content'
              }}
            >
              {content}
            </pre>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div
            className="custom-scrollbar overflow-x-auto"
            style={{
              paddingBottom: '4px'
            }}
          >
            <pre
              className="text-sm whitespace-pre-wrap inline-block"
              style={{
                minWidth: 'max-content'
              }}
            >
              {content}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-4 text-right">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          在新窗口中打开
        </a>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* 基本滚动条样式 */
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }

        /* 滚动条轨道 */
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        /* 滚动条滑块 */
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f1f1;
          border-radius: 2px;
        }

        /* 鼠标悬停时的滑块 */
        .custom-scrollbar:hover {
          scrollbar-color: rgba(136, 136, 136, 0.5) transparent;
        }

        /* 隐藏滚动条但保持功能 */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(136, 136, 136, 0.3) transparent;
          border-radius: 2px;
        }
      `}} />
    </div>
  );
}
