'use client';

import { Layout, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

function useMenuItems() {
  const token = useAuthStore((s) => s.token);
  const clear = useAuthStore((s) => s.clear);
  const router = useRouter();
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      clear();
      router.replace('/auth/login');
    }
    if (key === 'login') {
      router.push('/auth/login');
    }
    if (key === 'register') {
      router.push('/auth/register');
    }
  };
  const items: MenuProps['items'] = token
    ? [
      { key: 'settings', label: '设置', icon: <SettingOutlined /> },
      { type: 'divider' },
      { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, danger: true },
    ]
    : [
      { key: 'login', label: '登录' },
      { key: 'register', label: '注册' },
    ];
  return { items, onClick };
}

export default function ChatHeader() {
  const { items, onClick } = useMenuItems();
  return (
    <div className="w-full h-[50px] bg-white shadow border-b border-gray-200 columns-auto">
      <div className="ml-4 h-full flex items-center w-full font-bold">
        <span className="text-xl text-blue-500 flex items-center">B&R</span>
        <span className="text-xl ml-2 flex items-center">安全智能问答系统</span>
      </div>
      <div className="w-10 absolute right-[1%] top-[10%]">
        <Dropdown menu={{ items, onClick }} arrow>
          <Avatar
            icon={<UserOutlined />}
            className="cursor-pointer h-full"
            size="large"
          />
        </Dropdown>
      </div>
    </div>
  );
}

