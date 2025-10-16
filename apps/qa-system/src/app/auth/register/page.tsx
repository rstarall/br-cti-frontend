'use client';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterPage() {
    const router = useRouter();
    const { register, registering } = useAuthStore();

    const onFinish = async (values: { username: string; password: string; email?: string }) => {
        try {
            await register(values);
            message.success('注册成功，请登录');
            router.replace('/auth/login');
        } catch (e: any) {
            message.error(e?.response?.data?.message || '注册失败');
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <Card title="注册" className="w-full max-w-md">
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '请输入合法邮箱' }]}>
                        <Input placeholder="请输入邮箱（可选）" />
                    </Form.Item>
                    <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={registering}>注册</Button>
                    </Form.Item>
                </Form>
                <Typography.Paragraph className="text-center">
                    已有账号？ <a href="/auth/login">去登录</a>
                </Typography.Paragraph>
            </Card>
        </div>
    );
}


