'use client';
import { useState, useEffect } from 'react';
import { Menu, Dropdown, Avatar } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import type { MenuProps } from 'antd';
import {
    MessageOutlined,
    BulbOutlined,
    DeploymentUnitOutlined,
    RedditOutlined,
    ApiOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useFixedSiderWidth } from './ClientLayout'; 
import { useAuthStore } from '@/stores/authStore';

const mainItems: MenuProps['items'] = [
    { key: '/chat', label: '实时聊天', icon: <MessageOutlined /> },
    { key: '/data', label: '知识库', icon: <BulbOutlined /> },
    { key: '/kg', label: '知识图谱', icon: <DeploymentUnitOutlined /> },
    { key: '/agent', label: '智能体', icon: <RedditOutlined /> },
    { key: '/mcp', label: 'MCP', icon: <ApiOutlined /> },
];

const sideContainerWidthList: Record<string, number> = {
    '/chat': 300,
    '/data': 300,
    '/kg': 300,
    '/agent': 300,
    '/mcp': 300,
};

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [current, setCurrent] = useState("/chat");
    const { setWidth } = useFixedSiderWidth();
    const token = useAuthStore((s) => s.token);
    const clear = useAuthStore((s) => s.clear);

    useEffect(() => {
        setCurrent(pathname);
    }, [pathname]);

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        const newWidth = sideContainerWidthList[e.key] || 300;
        setWidth(newWidth);
        router.push(e.key);
    };

    const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'logout') {
            clear();
            router.replace('/auth/login');
        }
    };
    
    const userMenuItems: MenuProps['items'] = token
        ? [ { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, danger: true } ]
        : [];

    return (
        <div className="h-full flex flex-col items-center py-2 bg-gray-50">
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="topRight">
                <Avatar icon={<UserOutlined />} className="cursor-pointer" size="large" />
            </Dropdown>

            <Menu
                mode='inline'
                inlineCollapsed={true}
                selectedKeys={[current]}
                items={mainItems}
                onClick={handleMenuClick}
                className='bg-transparent border-none mt-3'
            />
        </div>
    );
}