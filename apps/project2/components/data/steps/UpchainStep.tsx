import React, { useEffect, useState } from 'react';
import { Form, Card, Button, Input, FormInstance, Progress } from 'antd';
import { useUpchainProcess } from '@/hooks/localData/useUpchainProcess';
import { useDataStore } from '@/store/dataStore';
import { useMessage } from '@/provider/MessageProvider';
import { CTIUpchainConfig } from '@/api/types/localData';
import { localDataApi } from '@/api/localData';
import { useWalletStore } from '@/store/walletStore';

interface UpchainStepProps {
  fileHash: string;
  status: {
    cti: boolean;
    upchain: boolean;
  };
  form: FormInstance;
}

export function UpchainStep({ fileHash, status, form }: UpchainStepProps) {
  const { upchainCTI } = useUpchainProcess();
  const { updateTaskStatus, tasks } = useDataStore();
  const { messageApi } = useMessage();
  const { walletId } = useWalletStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 获取当前任务的进度
  const currentTask = tasks.find(task => task.file_hash === fileHash);
  const upchainProgress = currentTask?.progress?.upchain || 0;

  // 监听上链状态变化
  useEffect(() => {
    if (currentTask?.status?.upchain) {
      setIsProcessing(false);
      setErrorMessage(null);
      messageApi.success('上链成功！');
    }
  }, [currentTask?.status?.upchain, messageApi]);

  // 处理常规上链
  const handleUpchain = async () => {
    try {
      // 清除之前的错误
      setErrorMessage(null);

      // 验证表单
      const values = await form.validateFields();

      // 验证必填字段
      if (!values.ipfs_address) {
        messageApi.error('请输入IPFS地址');
        return;
      }
      if (!values.upchain_account) {
        messageApi.error('请输入上链账户');
        return;
      }
      if (!values.upchain_account_password) {
        messageApi.error('请输入账户密码');
        return;
      }

      // 设置处理状态
      setIsProcessing(true);

      // 构建配置
      const config: CTIUpchainConfig = {
        file_hash: fileHash,
        ipfs_address: values.ipfs_address,
        upchain_account: values.upchain_account,
        upchain_account_password: values.upchain_account_password,
      };

      // 开始处理前显示加载状态
      messageApi.loading('正在处理上链...');

      try {
        // 调用处理函数
        console.log('开始上链处理，配置:', config);
        await upchainCTI(config);

        // 成功消息会在轮询完成后显示
        messageApi.success('上链请求已提交，正在处理中...');
      } catch (apiError: any) {
        console.error('上链API调用失败:', apiError);
        setIsProcessing(false);
        setErrorMessage(apiError.message || '上链API调用失败');
        messageApi.error(apiError.message || '上链失败');
      }
    } catch (e: any) {
      console.error('上链处理异常:', e);
      setIsProcessing(false);
      setErrorMessage(e.message || '上链失败');
      messageApi.error(e.message || '上链失败');
    }
  };





  const handleGetIPFSAddress = async () => {
    try {
      const response = await localDataApi.getIPFSAddress();
      if (response.code === 200) {
        form.setFieldsValue({
          ipfs_address: response.data.ipfs_address
        });
        messageApi.success('获取IPFS地址成功');
      } else {
        messageApi.error(response.error || '获取IPFS地址失败');
      }
    } catch (e: any) {
      messageApi.error(e.message || '获取IPFS地址失败');
    }
  };

  const handleGetUpchainAccount = () => {
    if (walletId) {
      form.setFieldsValue({
        upchain_account: walletId
      });
      messageApi.success('获取上链账户成功');
    } else {
      messageApi.error('未找到钱包账户，请先登录钱包');
    }
  };

  const handleCheckWalletPassword = async () => {
    const values = await form.validateFields(['upchain_account', 'upchain_account_password']);
    if (!values.upchain_account || !values.upchain_account_password) {
      messageApi.error('账户或钱包密码不能为空');
      return;
    }
    try {
      const response = await localDataApi.checkWalletPassword(
        values.upchain_account,
        values.upchain_account_password
      );
      if (response.code === 200) {
        if (response.data) {
          messageApi.success('钱包密码正确');
        } else {
          messageApi.error('钱包密码错误');
        }
      } else {
        messageApi.error(response.error || '检查钱包密码失败');
      }
    } catch (e: any) {
      messageApi.error(e.message || '检查钱包密码失败');
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Card
        title={<span className="text-lg font-semibold">上链配置</span>}
        className="mb-4 rounded-lg shadow bg-white border border-gray-100 p-6"
        extra={
          !status.upchain && (
            <Button
              type="primary"
              onClick={handleUpchain}
              disabled={!status.cti || isProcessing}
            >
              开始上链
            </Button>
          )
        }
      >
      
        <Form.Item label="IPFS地址">
          <div className="flex w-full gap-2">
            <Form.Item name="ipfs_address" noStyle className="flex-1">
              <Input className="w-full" />
            </Form.Item>
            <Button onClick={handleGetIPFSAddress} disabled={isProcessing}>获取IPFS地址</Button>
          </div>
        </Form.Item>
        <Form.Item label="上链账户">
          <div className="flex w-full gap-2">
            <Form.Item name="upchain_account" noStyle className="flex-1">
              <Input className="w-full" />
            </Form.Item>
            <Button onClick={handleGetUpchainAccount} disabled={isProcessing}>获取上链账户</Button>
          </div>
        </Form.Item>
        <Form.Item label="账户密码">
          <div className="flex w-full gap-2">
            <Form.Item name="upchain_account_password" noStyle className="flex-1">
              <Input.Password className="w-full" />
            </Form.Item>
            <Button onClick={handleCheckWalletPassword} disabled={isProcessing}>检查密码</Button>
          </div>
        </Form.Item>

        <div className="mt-4 text-gray-500 text-sm">
          <p>说明：</p>
          <ul className="list-disc pl-5">
            <li>开始上链：使用标准上链流程，通过钱包ID和密码上链</li>
            <li>如果上链失败，请检查账户和密码是否正确</li>
          </ul>
        </div>
      </Card>
    </Form>
  );
}
