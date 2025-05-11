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
  title: 'B&R去中心化威胁情报共享平台',
  description: '打造去中心化、可信、安全的B&R威胁情报共享生态',
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
