'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { WalletHeader } from '@/components/wallet/WalletHeader';
import { WalletInfo } from '@/components/wallet/WalletInfo';
import { TransactionTabs } from '@/components/wallet/TransactionTabs';
import { useWalletStore } from '@/store/walletStore';
import { useNetworkStore } from '@/store/networkStore';
import { useWindowManager } from '@/provider/WindowManager';
import { useMessage } from '@/provider/MessageProvider';
import { showConfirm } from '@/components/ui/modal';
import WalletRegisterPage from '@/app/client/wallet_register/page';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export default function WalletPage() {
  const {
    walletId,
    walletList,
    fetchWalletList,
    fetchUserDetailInfo,
    checkWalletOnchain,
    loadWalletId,
    isLoading
  } = useWalletStore();

  const [refreshing, setRefreshing] = useState(false);

  const { checkConnection } = useNetworkStore();
  const { openFramelessWindow } = useWindowManager();
  const { messageApi } = useMessage();

  // Function to refresh transaction data
  const handleRefresh = useCallback(async () => {
    if (isLoading || refreshing || !walletId) return;

    try {
      setRefreshing(true);
      await fetchUserDetailInfo();
      messageApi.success('用户信息和交易记录已更新');
    } catch (error) {
      messageApi.error('更新用户信息和交易记录失败');
      console.error('Failed to refresh user info and transactions:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchUserDetailInfo, isLoading, messageApi, refreshing, walletId]);
  //防抖
  let initTimer:any = null
  // Use a ref to track if initial data has been loaded
  const initialLoadDone = React.useRef(false);

  useEffect(() => {
    // 先加载 walletId
    loadWalletId();

    // Only run initialization once
    if (initialLoadDone.current) return;

    const initWallet = async () => {
        // Check network connection
        const isConnected = await checkConnection();
        if (!isConnected) {
          messageApi.error('网络连接失败，请检查网络设置');
          return;
        }

        // Check if wallet exists
        if (!walletId) {
          await fetchWalletList();
          // 获取 walletList 而不是使用 fetchWalletList 的返回值
          if (walletList.length === 0) {
            // 使用 Modal.confirm 替代 confirm
            showConfirm({
              title: '未查询到本地钱包',
              content: '未查询到本地钱包，是否前往注册？',
              onOk: () => {
                // 打开钱包注册窗口而不是跳转页面
                openFramelessWindow('钱包注册', <WalletRegisterPage />, '400px', '600px', 'wallet-register-window');
              }
            });
            return;
          }
        } else {
          // Check if wallet is on chain
          const isOnchain = await checkWalletOnchain(walletId);
          if (!isOnchain) {
            messageApi.warning('钱包未上链');
            // 使用 Modal.confirm 替代 confirm
            showConfirm({
              title: '钱包未上链',
              content: '您的钱包未上链，是否前往注册？',
              onOk: () => {
                // 打开钱包注册窗口而不是跳转页面
                openFramelessWindow('钱包注册', <WalletRegisterPage />, '400px', '600px', 'wallet-register-window');
              }
            });
          }

          // Fetch user detail info (includes both user info and transactions)
          await fetchUserDetailInfo();

          // Mark initial load as done
          initialLoadDone.current = true;
        }
    };

    // Use a timeout to prevent immediate execution
    initTimer = setTimeout(() => {
      if(initTimer){
        clearTimeout(initTimer);
        initTimer = null;
        initWallet();
      }
    }, 500);

    // Cleanup function
    return () => {
      if (initTimer) {
        clearTimeout(initTimer);
        initTimer = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletId, fetchWalletList, fetchUserDetailInfo, checkWalletOnchain, loadWalletId, checkConnection, openFramelessWindow, messageApi, walletList]);

  return (
    <div className="bg-white w-full h-full rounded-lg shadow-lg">
      <div className="h-full overflow-hidden">
        <WalletHeader />
        <WalletInfo />
        <div className="px-3">
          <TransactionTabs />
        </div>
      </div>
    </div>
  );
}
