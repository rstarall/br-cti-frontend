import type { Metadata } from 'next'
import './globals.css'
import { ClientLayout } from '@/components/layout/ClientLayout';
import { WindowManagerProvider } from '@/provider/WindowManager';
import { MessageProvider } from '@/provider/MessageProvider';
import { LoadingProvider } from '@/provider/LoadingProvider';
import { ConfigProvider } from 'antd';
import theme from '@/theme';
import { I18nextClientProvider } from '@/provider/I18nextClientProvider';
export const metadata: Metadata = {
  title: '智能博弈网络安全能力集成平台',
  description: '集成智能博弈风险发现、情报知识共享平面和未知风险主动防御的综合性网络安全解决方案',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body suppressHydrationWarning>
          <ConfigProvider theme={theme}>
            <I18nextClientProvider>
              <LoadingProvider>
                <MessageProvider>
                  <WindowManagerProvider>
                    <ClientLayout>
                      {children}
                    </ClientLayout>
                  </WindowManagerProvider>
                </MessageProvider>
              </LoadingProvider>
            </I18nextClientProvider>
          </ConfigProvider>
      </body>
    </html>
  )
}
