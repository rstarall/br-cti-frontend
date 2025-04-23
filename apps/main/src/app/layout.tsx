import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../styles/header.css";
import "../styles/main.css";
import "../styles/footer.css";
import { HeaderLayout } from '@/components/layouts/headerLayout';
import { FooterLayout } from "@/components/layouts/footerLayout";
import { MainLayout } from "@/components/layouts/mainLayout";

import { WindowManagerProvider } from '@/context/WindowManager';
import { MessageProvider } from '@/context/MessageProvider';
import { LoadingProvider } from '@/context/LoadingProvider';
// 配置字体
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// 配置元数据
export const metadata: Metadata = {
  title: "CTI sharing platform",
  description: "",
};

// 使用 App Router 的根布局组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <LoadingProvider>
          <MessageProvider>
            <WindowManagerProvider>
                <HeaderLayout />
                    <MainLayout>{children}</MainLayout>
                <FooterLayout />
            </WindowManagerProvider>
          </MessageProvider>
        </LoadingProvider>      
      </body>
    </html>
  );
}
