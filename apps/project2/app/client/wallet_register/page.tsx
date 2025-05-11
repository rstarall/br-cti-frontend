'use client';

import React, { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWalletStore } from '@/store/walletStore';
import { walletApi } from '@/api/wallet';
import Image from 'next/image';
import { useWindowManager } from '@/provider/WindowManager';
import  {DragHandlers} from '@/components/window/WindowComponent';
import { useMessage } from '@/provider/MessageProvider';

export default function WalletRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [walletPassword, setWalletPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletId, setWalletId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { fetchWalletList, setWalletId: storeSetWalletId, walletList } = useWalletStore();
  const { closeWindow,getWindowDragHandlers } = useWindowManager();
  const [dragHandlers, setDragHandlers] = useState<DragHandlers | undefined>();
  const { messageApi } = useMessage();

  const stepTitles = ["我的钱包", "创建钱包", "输入密码", "创建本地钱包", "创建链上账户"];
  // 获取窗口的拖拽处理函数
  useEffect(() => {
    
    const handlers = getWindowDragHandlers("wallet-register-window");
    if (handlers) {
      setDragHandlers(handlers);
    }
    
  }, [getWindowDragHandlers]);
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // 关闭当前窗口
      closeWindow('wallet-register-window');
    }
  };

  const handleNextStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleReloadWallet = async () => {
    setIsLoading(true);

    try {
      await fetchWalletList();

      if (walletList.length === 0) {
        messageApi.error('未查询到本地钱包');
        setIsLoading(false);
        return;
      }

      // Show success message and close window
      const firstWallet = walletList[0];
      const shortId = firstWallet.substring(0, 6) + '...' + firstWallet.substring(firstWallet.length - 6);
      messageApi.success(`查询到钱包: ${shortId}`);

      // 关闭当前窗口
      closeWindow('wallet-register-window');
    } catch (err) {
      messageApi.error(err instanceof Error ? err.message : '网络异常');
      setIsLoading(false);
    }
  };

  const handleSavePassword = () => {
    if (!walletPassword || !confirmPassword) {
      messageApi.error('密码不能为空');
      return false;
    }

    if (walletPassword === confirmPassword) {
      handleNextStep(3);
      return true;
    } else {
      messageApi.error('两次输入的密码不一致');
      return false;
    }
  };

  const handleCreateWallet = async () => {
    if (walletPassword !== confirmPassword) {
      messageApi.error('两次输入的密码不一致');
      return;
    }

    setIsLoading(true);

    try {
      const response = await walletApi.createLocalUserWallet(walletPassword);

      if (response.code === 200) {
        setWalletId(response.data.wallet_id);
        handleNextStep(4);
      } else {
        messageApi.error(`钱包创建失败: ${response.message}`);
      }
    } catch (err) {
      messageApi.error(err instanceof Error ? err.message : '网络异常');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOnchainAccount = async () => {
    if (!accountName) {
      messageApi.error('账户名称不能为空');
      return;
    }

    setIsLoading(true);

    try {
      const response = await walletApi.registerOnchainAccount(walletId, accountName);

      if (response.code === 200) {
        const onchainWalletId = response.data.wallet_id;
        if (onchainWalletId) {
          // Update wallet ID in store and localStorage
          storeSetWalletId(onchainWalletId);
        }

        messageApi.success('链上账户创建成功!');
        // 关闭当前窗口
        closeWindow('wallet-register-window');
      } else {
        messageApi.error(`链上账户创建失败: ${response.message}`);
      }
    } catch (err) {
      messageApi.error(err instanceof Error ? err.message : '网络异常');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white shadow-lg border rounded-lg overflow-hidden">
      {/* Header */}
      <div
        id="drag-handle"
        className="p-3 flex items-center cursor-pointer"
        onMouseDown={dragHandlers?.onMouseDown}
      >
        <span onClick={handlePrevStep}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </span>
       
        <span className="ml-2">{stepTitles[currentStep - 1]}</span>
      </div>

      {/* Step 1: Initial Screen */}
      {currentStep === 1 && (
        <div className="flex flex-col items-center">
          <div className="w-4/5 h-80 relative my-4">
            <Image
              src="/static/client/imgs/wallet.png"
              alt="钱包banner"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>

          <div className="w-full flex flex-col items-center mt-8 p-4 space-y-4">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => handleNextStep(2)}
              isLoading={isLoading}
            >
              创建钱包
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleReloadWallet}
              isLoading={isLoading}
            >
              刷新钱包
            </Button>


          </div>
        </div>
      )}

      {/* Step 2: Password Creation */}
      {currentStep === 2 && (
        <div className="flex flex-col items-center p-4">
          <div className="text-center mt-12 mb-8">
            <h2 className="text-2xl font-bold mb-2">创建密码</h2>
            <p className="text-gray-500 text-sm">系统不保存密码，忘记密码将导致钱包丢失</p>
          </div>

          <Card className="w-full">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">钱包密码</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                    placeholder="请输入密码"
                    value={walletPassword}
                    onChange={(e) => setWalletPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">确认密码</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                    placeholder="请再次输入密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="w-full mt-8">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleSavePassword}
              isLoading={isLoading}
            >
              下一步
            </Button>


          </div>
        </div>
      )}

      {/* Step 3: Confirm Wallet Creation */}
      {currentStep === 3 && (
        <div className="flex flex-col items-center p-4">
          <div className="text-center mt-12 mb-12">
            <h2 className="text-2xl font-bold mb-4">创建本地钱包</h2>
            <p className="text-gray-500 text-sm px-8">
              钱包公私钥文件将加密保存在本地客户端，是否确认创建钱包?
            </p>
          </div>

          <div className="w-full mt-16">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleCreateWallet}
              isLoading={isLoading}
            >
              确认创建
            </Button>


          </div>
        </div>
      )}

      {/* Step 4: Create Onchain Account */}
      {currentStep === 4 && (
        <div className="flex flex-col items-center p-4">
          <div className="text-center mt-12 mb-8">
            <h2 className="text-2xl font-bold mb-2">创建链上账户</h2>
            <p className="text-gray-500 text-sm">请输入账户名称</p>
          </div>

          <Card className="w-full">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">钱包ID</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-gray-50"
                    value={walletId}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">账户名称</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="请输入账户名称"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="w-full mt-8">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleCreateOnchainAccount}
              isLoading={isLoading}
            >
              创建账户
            </Button>


          </div>
        </div>
      )}
    </div>
  );
}
