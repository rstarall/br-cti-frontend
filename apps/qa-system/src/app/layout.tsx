
import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import MainLayout from '@/components/Index';
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "B&R Security Chat", 
  description: "B&R Security Chat",
};
//可以使用服务端渲染
async function getUserInfo() {
  const res = await fetch('http://localhost:3000/api/user/info');
  const data = await res.json();
  return data;
}
async function getUserChat() {
  const res = await fetch('http://localhost:3000/api/user/chat');
  const data = await res.json();
  return data;
}

export default function RootLayout({
  children,
  sideContainer,
}: Readonly<{
  children: React.ReactNode;
  sideContainer: React.ReactNode;
}>) {
   //从服务端获取数据
   //const serverData = await getUserInfo();
  return (
    <html lang="en">
      <body className="antialiased">
        <AntdRegistry>
          <ConfigProvider
            theme={{
              components: {
                Layout: {
                  headerBg: '#ffffff'
                }
              }
            }}
          >
            <MainLayout sideContainer={sideContainer}>
              {children}
            </MainLayout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}