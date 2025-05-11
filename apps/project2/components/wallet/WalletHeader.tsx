import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Select, Upload, message } from 'antd';
import { useWalletStore } from '@/store/walletStore';
import { useNetworkStore } from '@/store/networkStore'
import { formatWalletId } from '@/lib/utils';
import { useWindowManager } from '@/provider/WindowManager';
import { useMessage } from '@/provider/MessageProvider';
import { showConfirm } from '@/components/ui/modal';
import {
  GlobalOutlined,
  SettingOutlined,
  PlusOutlined,
  ReloadOutlined,
  SwapOutlined,
  LogoutOutlined,
  ImportOutlined,
  InboxOutlined
} from '@ant-design/icons';
import WalletRegisterPage from '@/app/client/wallet_register/page';
import { useLoading } from '@/provider/LoadingProvider';
import { DragHandlers } from '@/components/window/WindowComponent';
export function WalletHeader() {
  const {
      userInfo,
      walletId,
      walletList,
      setWalletId,
      fetchWalletList,
      fetchUserDetailInfo,
      checkWalletOnchain,
      loadWalletId,
      isLoading
    } = useWalletStore();

  const { openFramelessWindow, closeWindow,getWindowDragHandlers } = useWindowManager();

  const [dragHandlers, setDragHandlers] = useState<DragHandlers | undefined>();
  const { messageApi } = useMessage();
  const { showLoading, hideLoading } = useLoading();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWalletSelectOpen, setIsWalletSelectOpen] = useState(false);
  const [isImportWalletOpen, setIsImportWalletOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const { checkConnection } = useNetworkStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 获取窗口的拖拽处理函数
  useEffect(() => {

    const handlers = getWindowDragHandlers("wallet-window");
    if (handlers) {
      setDragHandlers(handlers);
    }

  }, [getWindowDragHandlers]);
  const handleNetworkCheck = async () => {
    // This would typically check network status
    showLoading();
    checkConnection().then((isConnected) => {
      hideLoading();
      if (isConnected) {
        messageApi.success('网络连接正常');
      } else {
        messageApi.error('网络连接失败，请检查网络设置');
      }
    }).catch((error) => {
      console.error('Network check failed:', error);
      messageApi.error('网络检查失败，请稍后再试');
      hideLoading();
    });
  };

  const handleWalletSelect = async () => {
    if (!selectedWallet) {
      messageApi.warning('请选择一个钱包');
      return;
    }

    const isOnchain = await checkWalletOnchain(selectedWallet);
    setWalletId(selectedWallet);
    setIsWalletSelectOpen(false);
    if (isOnchain) {
      fetchUserDetailInfo();
    } else {
      messageApi.warning('钱包未上链');
      showConfirm({
        title: '钱包未上链',
        content: '您的钱包未上链，是否前往注册？',
        onOk: () => {
          // 打开钱包注册窗口而不是跳转页面
          openFramelessWindow('钱包注册', <WalletRegisterPage />, '400px', '600px', 'wallet-register-window');
          setIsWalletSelectOpen(false);
        }
      });
    }
  };

  const handleChangeWallet = async () => {

    try {
      showLoading();
      setIsSettingsOpen(false);
      await fetchWalletList();
      setIsWalletSelectOpen(true);
    } finally {
      hideLoading();
    }
  };

  const handleRedirectToRegister = () => {
    // 打开钱包注册窗口而不是跳转页面
    openFramelessWindow('钱包注册', <WalletRegisterPage />, '400px', '600px', 'wallet-register-window');
    setIsSettingsOpen(false);
  };

  const handleRefreshAccount = () => {
    fetchUserDetailInfo();
    setIsSettingsOpen(false);
  };

  const handleImportWallet = () => {
    setIsSettingsOpen(false);
    setIsImportWalletOpen(true);
  };

  const handleWalletFileSelect = async (file: File) => {
    try {
      showLoading();
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          if (e.target?.result) {
            const walletData = JSON.parse(e.target.result as string);

            // 这里应该调用钱包导入API
            // 假设钱包数据有一个address字段
            if (walletData && walletData.address) {
              // 成功导入
              messageApi.success('钱包导入成功');
              setWalletId(walletData.address);
              setIsImportWalletOpen(false);

              // 刷新钱包列表
              await fetchWalletList();
            } else {
              messageApi.error('无效的钱包文件格式');
            }
          }
        } catch (error) {
          console.error('Failed to parse wallet file:', error);
          messageApi.error('无法解析钱包文件');
        } finally {
          hideLoading();
        }
      };

      reader.onerror = () => {
        messageApi.error('读取文件失败');
        hideLoading();
      };

      reader.readAsText(file);
      return false; // 阻止自动上传
    } catch (error) {
      hideLoading();
      messageApi.error('导入钱包失败');
      return false;
    }
  };

  const handleClose = () => {
    // 使用 WindowManager 关闭窗口
    const windowId = 'wallet-window';
    // 尝试获取 WindowManager 的 closeWindow 方法
    try {
      // 如果在 WindowManager 环境中，使用 closeWindow 关闭窗口
      closeWindow(windowId)
    } catch (e) {
      console.error('Failed to close window:', e);
      window.close();
    }
  };

  return (
    <div className="bg-primary-600 p-4 shadow-lg rounded-t-lg"
     id="drag-handle"
     onMouseDown={dragHandlers?.onMouseDown}
     >
      <div className="flex justify-between items-center">
        {/* Network Status */}
        <div className="flex items-center justify-center w-16">
          <Button
            type="default"
            shape="circle"
            icon={<GlobalOutlined />}
            className="bg-white text-primary-600 hover:bg-blue-50 shadow-md"
            onClick={handleNetworkCheck}
            size="large"
          />
        </div>

        {/* Wallet Info */}
        <div className="flex flex-col items-center bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm shadow-inner">
          <div className="text-base font-bold text-white">
            {userInfo?.user_name || 'Account 1'}
          </div>
          <div className="text-xs text-blue-100">
            {walletId ? formatWalletId(walletId) : '0xbcbc...15bc'}
          </div>
        </div>

        {/* Settings */}
        <div className="flex items-center justify-center w-16">
          <Button
            type="default"
            shape="circle"
            icon={<SettingOutlined />}
            className="bg-white text-primary-600 hover:bg-blue-50 shadow-md"
            onClick={() => setIsSettingsOpen(true)}
            size="large"
          />
        </div>
      </div>

      {/* Settings Dialog */}
      <Modal
        open={isSettingsOpen}
        onCancel={() => setIsSettingsOpen(false)}
        title="设置"
        footer={null}
        width={300}
        className='p-2'
        styles={{
          body: { padding: '0' },     // 内容区域的内边距
          header: { padding: '0' }, // 标题区域的内边距
          footer: { padding: '0' }  // 底部区域的内边距
        }}
        style={{ top: 20 }}
      >
        <div className="flex flex-col space-y-2">
          <Button
            type="text"
            onClick={handleRedirectToRegister}
            className="justify-start hover:bg-blue-50 hover:text-primary-600 transition-colors text-left"
            icon={<PlusOutlined className="mr-2" />}
            block
          >
            新建账户
          </Button>
          <Button
            type="text"
            onClick={handleRefreshAccount}
            className="justify-start hover:bg-blue-50 hover:text-primary-600 transition-colors text-left"
            icon={<ReloadOutlined className="mr-2" />}
            block
          >
            刷新账户
          </Button>
          <Button
            type="text"
            onClick={handleImportWallet}
            className="justify-start hover:bg-blue-50 hover:text-primary-600 transition-colors text-left"
            icon={<ImportOutlined className="mr-2" />}
            block
            data-action="import-wallet"
          >
            导入钱包
          </Button>
          <div className="border-t my-2"></div>
          <Button
            type="text"
            onClick={handleChangeWallet}
            className="justify-start hover:bg-blue-50 hover:text-primary-600 transition-colors text-left"
            icon={<SwapOutlined className="mr-2" />}
            block
          >
            切换账户
          </Button>
          <Button
            type="text"
            onClick={handleClose}
            className="justify-start hover:bg-red-50 hover:text-red-600 transition-colors text-left"
            icon={<LogoutOutlined className="mr-2" />}
            block
          >
            退出
          </Button>
        </div>
      </Modal>

      {/* Wallet Select Dialog */}
      <Modal
        open={isWalletSelectOpen}
        onCancel={() => setIsWalletSelectOpen(false)}
        title="请选择钱包"
        styles={{ body: { padding: '12px' } }}
        footer={[
          <Button key="cancel" onClick={() => setIsWalletSelectOpen(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleWalletSelect}>
            确定
          </Button>
        ]}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">选择您的钱包</label>
          <Select
            className="w-full"
            placeholder="请选择钱包"
            value={selectedWallet || undefined}
            onChange={(value) => setSelectedWallet(value)}
            options={walletList.map((wallet) => ({
              value: wallet,
              label: formatWalletId(wallet)
            }))}
          />
        </div>
      </Modal>

      {/* Import Wallet Dialog */}
      <Modal
        open={isImportWalletOpen}
        onCancel={() => setIsImportWalletOpen(false)}
        title="导入钱包"
        footer={[
          <Button key="cancel" onClick={() => setIsImportWalletOpen(false)}>
            取消
          </Button>
        ]}
      >
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-4">
            请选择您的钱包文件进行导入。钱包文件应为JSON格式，包含钱包地址和私钥信息。
          </p>

          <Upload.Dragger
            name="walletFile"
            accept=".json"
            beforeUpload={handleWalletFileSelect}
            showUploadList={false}
            maxCount={1}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个钱包文件上传，文件格式为JSON
            </p>
          </Upload.Dragger>
        </div>
      </Modal>
    </div>
  );
}

