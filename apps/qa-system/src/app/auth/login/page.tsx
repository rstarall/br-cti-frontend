'use client';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
    const router = useRouter();
    const { login, loggingIn } = useAuthStore();

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            await login(values);
            message.success('登录成功');
            router.replace('/chat');
        } catch (e: any) {
            const detail = e?.response?.data?.detail || e?.response?.data?.message;
            message.error(detail || '登录失败');
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <Card title="登录" className="w-full max-w-md">
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loggingIn}>登录</Button>
                    </Form.Item>
                </Form>
                <Typography.Paragraph className="text-center">
                    还没有账号？ <a href="/auth/register">去注册</a>
                </Typography.Paragraph>
            </Card>
        </div>
    );
}


