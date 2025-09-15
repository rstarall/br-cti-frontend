import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { message } from 'antd';

import 'katex/dist/katex.min.css';

interface CodeProps {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
  node?: any;
}
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiCopy, FiCheck } from 'react-icons/fi';

const MarkdownRenderer = ({ content }: { content: string }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    setCopiedCode(code);
    message.success('复制成功');
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
              <div className="absolute right-0 top-0 z-10">
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
                className='p-2 rounded-md bg-gray-100'
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