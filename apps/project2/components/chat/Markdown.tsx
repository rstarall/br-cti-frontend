import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useMessage } from '@/provider/MessageProvider';

import 'katex/dist/katex.min.css';

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
  node?: any;
}

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { messageApi } = useMessage();

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    messageApi.success('复制成功');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ className, children, ...props }: CodeProps) {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');
          
          if (!match) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
          
          return (
            <div className="relative">
              <div className="absolute right-1 top-1 z-10">
                <CopyToClipboard text={codeString} onCopy={() => handleCopy(codeString)}>
                  <button 
                    className="p-1 rounded bg-gray-200 hover:bg-gray-300 text-black"
                    title="复制代码"
                  > 
                    <div className='flex items-center'>
                      {copiedCode === codeString ? <FiCheck /> : <FiCopy />}
                    </div>
                  </button>
                </CopyToClipboard>
              </div>
              <SyntaxHighlighter
                className=' rounded-md bg-gray-100 overflow-x-auto'
                language={match[1].toLowerCase()}
                PreTag="div"
              >
                {codeString}  
              </SyntaxHighlighter>
            </div>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
