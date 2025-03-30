import { useState } from 'react';
import { useWindowManager } from '@/context/WindowManager';
import { useMessage } from '@/context/MessageProvider';
import { Input, Button, Steps } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useLoading } from '@/context/LoadingProvider';
import { useUserStore,UserInfo } from '@/store/user';
const { Step } = Steps;

export const WalletRegisterWindow = () => {
  const { closeWindow } = useWindowManager();
  const { messageApi } = useMessage();
  const { showLoading, hideLoading } = useLoading();
  const { userInfoDic,setUserInfo,updateUserInfoDic } = useUserStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountName, setAccountName] = useState('');
  const [walletId, setWalletId] = useState('');

  const handleRefreshWallet = async () => {
    // 实现刷新钱包逻辑
    showLoading();
    setTimeout(() => {
        // 实现刷新钱包逻辑
        hideLoading();
        messageApi.success('刷新钱包成功');
    }, 300+Math.random()*1000);
  };
  const generateTimeBasedWalletId = (): string => {
    // 获取当前时间的16进制表示（尾部随时间变化）
    const timeHex = Date.now().toString(16).slice(-6); // 取最后6位
    
    // 生成安全随机数（兼容浏览器和Node.js）
    const crypto = window.crypto || (window as any).msCrypto;
    const randomBuffer = new Uint8Array(8);
    crypto.getRandomValues(randomBuffer);
    
    // 转换为16进制字符串
    const randomHex = Array.from(randomBuffer, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('').slice(0, 10);
  
    // 组合成完整地址
    return `0x${randomHex}${timeHex}`.toLowerCase();
  };
  const generateRandomKey = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 64; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }
  const generateHashKey = (): string => {
    // 生成64位小写字母和数字组合的密钥
    const chars = 'abcdef0123456789';
    let key = '';
    for (let i = 0; i < 64; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  const handleSavePassword = () => {
    if (!password || !confirmPassword) {
      messageApi.error('密码不能为空');
      return;
    }
    if (password !== confirmPassword) {
      messageApi.error('两次输入的密码不一致');
      return;
    }
    setCurrentStep(2);
    setWalletId(generateTimeBasedWalletId());
  };

  const handleCreateWallet = async () => {
    // 实现创建钱包逻辑
    setCurrentStep(3);
  };

  const handleCreateAccount = async () => {
    if (!accountName) {
      messageApi.error('账户名称不能为空');
      return;
    }
    if (!walletId) {
      messageApi.error('钱包ID不能为空');
      return;
    }
    if (userInfoDic[walletId]) {
      messageApi.error('钱包ID已存在');
      return;
    }
    showLoading();

    const userInfo:UserInfo = {
      walletId: walletId,
      userName: accountName,
      tokenNumber: 100,
      transactions: [],
      ownerCtiList: [],
      extraInfo: {
        publicKey: generateRandomKey(),
        privateKey: generateRandomKey(),
        searchKey: generateHashKey(),
        cryptoKey: generateHashKey(),
        iv: generateHashKey()
      }
    }
    updateUserInfoDic(userInfo.walletId,userInfo);
    setUserInfo(userInfo);
    setTimeout(() => {
        // 实现创建链上账户逻辑
        closeWindow('wallet-register-window');
        hideLoading();

       messageApi.success('创建钱包成功');
    }, 300+Math.random()*1000);
    
  };
  
  const steps = [
    {
      title: '创建钱包',
      content: (
        <div className="flex flex-col items-center p-4">
          <img src="/imgs/wallet.png" alt="钱包banner" className="w-48 mt-7 mb-12"/>
          <div className="flex gap-4">
            <Button type="primary" onClick={() => setCurrentStep(1)}>
              创建钱包
            </Button>
            <Button onClick={handleRefreshWallet}>
              刷新钱包
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: '设置密码',
      content: (
        <div className="p-4">
          <div className="mb-4">
            <p className="font-bold">创建密码</p>
            <p className="text-sm text-gray-500">系统不保存密码，忘记密码将导致钱包丢失</p>
          </div>
          <div className="space-y-4">
            <Input.Password
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input.Password
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button 
              type="primary" 
              block
              onClick={handleSavePassword}
            >
              下一步
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: '确认密码',
      content: (
        <div className="p-4">
          <div className="mb-4">
            <p className="font-bold">创建本地钱包</p>
            <p className="text-sm text-gray-500">钱包公私钥文件将加密保存在本地客户端，是否确认创建钱包?</p>
          </div>
          <Button 
            type="primary" 
            block
            onClick={handleCreateWallet}
          >
            确认创建
          </Button>
        </div>
      ),
    },
    {
      title: '账户上链',
      content: (
        <div className="p-4">
          <div className="mb-4">
            <p className="font-bold">创建链上账户</p>
            <p className="text-sm text-gray-500">请输入账户名称</p>
          </div>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="钱包ID"
              defaultValue={walletId}
              value={walletId}
              readOnly
            />
            <Input
              placeholder="请输入账户名称"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
            <Button 
              type="primary" 
              block
              onClick={handleCreateAccount}
            >
              创建账户
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center py-2 border-b w-full relative">
        <Button 
          type="text"
          className="absolute left-0 "
          icon={<LeftOutlined />}
          onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : closeWindow('wallet-register-window')}
        >
            返回
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2 cursor-pointer">
          {steps[currentStep].title}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {steps[currentStep].content}
      </div>

      <div className="p-2 border-t default-pointer">
        <Steps current={currentStep} size="small" className="default-pointer">
          {steps.map((step, index) => (
            <Step key={index} title={step.title.split('').slice(0,2).join('')}/>
          ))}
        </Steps>
      </div>
    </div>
  );
};
