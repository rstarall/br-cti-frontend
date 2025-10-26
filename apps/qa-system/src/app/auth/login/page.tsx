'use client';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
// import CryptoJS from 'crypto-js';

// --- 安全提示 ---
// 在生产环境中，密钥(KEY)和初始化向量(IV)绝不应硬编码在前端代码中。
// 理想情况下，这些值应通过安全的方式（如环境变量）提供给一个受信任的后端服务，
// 并且加密操作也应在后端进行。
// 此处仅为演示目的，展示了如何在客户端加密负载。
// const KEY = CryptoJS.enc.Utf8.parse('B&R-CTI-PLATFORM'); // 16字节的密钥
// const IV = CryptoJS.enc.Utf8.parse('INITIAL_VECTOR');   // 16字节的IV

/**
 * 使用AES加密数据
 * @param data 要加密的字符串
 * @returns 加密后的Base64字符串
 */
// const encryptData = (data: string): string => {
//     const encrypted = CryptoJS.AES.encrypt(data, KEY, {
//         iv: IV,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//     });
//     return encrypted.toString();
// };


export default function LoginPage() {
    const router = useRouter();
    const { login, loggingIn } = useAuthStore();

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            // // 在发送前加密密码
            // const encryptedPassword = encryptData(values.password);
            
            // await login({
            //     username: values.username,
            //     password: encryptedPassword
            // });
            await login(values); // 恢复为明文登录
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


