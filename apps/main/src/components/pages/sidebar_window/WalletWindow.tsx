'use client'
import { useUserStore } from "@/store/user";
import { Select, Tabs } from "antd";
import { useState, useEffect } from "react";
import { Transaction } from "@/store/user";
import { useMessage } from "@/context/MessageProvider";
import { useWindowManager } from "@/context/WindowManager";
import { GlobalOutlined, SettingOutlined } from '@ant-design/icons';
import { WalletRegisterWindow } from "./WalletRegisterWindow";
import { TransactionTypeEnum } from "@/store/user";

export const WalletWindow = () => {
  const { userInfo, userInfoDic, setUserInfo,initializeUserInfo } = useUserStore();
  const {openFramelessWindow, closeWindow, openWindow} = useWindowManager();
  const {messageApi} = useMessage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [userTransaction, setUserTransaction] = useState<Transaction[]>(userInfo?.transactions || []);
  useEffect(() => {
    initializeUserInfo();
  }, []);
  useEffect(() => {
    setUserTransaction(userInfo.transactions);
    if (userInfo) {
      setTransactions(userInfo.transactions);
    }
  }, [userInfo]);
  const handleCreateWallet = () => {
    openFramelessWindow(
      "注册新账号", 
      <WalletRegisterWindow />, 
      "340px", 
      "580px", 
      "wallet-register-window"
    );
    closeWindow("wallet-window");
  }
  const handleUserChange = () => {
    setShowUserSelect(true);
  }

  const handleSelectUser = (walletId: string) => {
    const currentUserInfo = userInfoDic[walletId];
    if(walletId && currentUserInfo){
      setUserInfo(currentUserInfo);
      setShowUserSelect(false);
      setShowMenu(false);
      messageApi.success("切换账户成功")
    }else{
      messageApi.error("账户不存在")
    }
  }

  const handleUserInfo = () => {
    openWindow(
      "我的密钥", 
      <div className="flex flex-col p-2 space-y-2 text-sm">
        <span>公钥: {userInfo?.extraInfo?.publicKey} ...</span>
        <span>私钥: {userInfo?.extraInfo?.privateKey} ...</span>
        <span>搜索密钥: {userInfo?.extraInfo?.searchKey}</span>
        {/* <span>加密密钥: {userInfo?.extraInfo?.cryptoKey}</span> */}
      </div>, 
      "640px", 
      "160px", 
      "user-info-window",
      false
    );
  }
  return (
    <div className="flex flex-col h-full bg-white" onClick={() => setShowMenu(false)}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-2 border-b">   
        <div className="flex items-center cursor-pointer">
             <GlobalOutlined style={{color: "white"}} className="text-2xl bg-sky-600  rounded-full p-2 hover:bg-sky-700 shadow-md" />
        </div>
        <div className="text-center default-pointer">
          <div className="font-medium">{userInfo?.userName}</div>
          <div className="text-gray-500 text-sm">
            {userInfo?.walletId && userInfo.walletId.length > 10 ?
            (userInfo.walletId.slice(0,6)+"..."+userInfo.walletId.slice(-4)) :
            userInfo?.walletId || ''}
          </div>
        </div>
        <div className="relative">
          <div className="text-2xl cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}>
            <SettingOutlined style={{color: "white"}} className="text-2xl bg-sky-600 rounded-full p-2 hover:bg-sky-700 shadow-md" />
          </div>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-30 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-2 px-2 hover:bg-gray-100 text-sm cursor-pointer"
              onClick={() => {
                setShowMenu(false);
                
                handleCreateWallet();

              }}>注册新账号</div>
              <div className="py-2 px-2 hover:bg-gray-100 text-sm cursor-pointer"
              onClick={handleUserChange}>切换账号</div>
              <div className="py-2 px-2 hover:bg-gray-100 text-sm cursor-pointer"
              onClick={() => {
                setShowMenu(false);
                handleUserInfo();
              }}>我的密钥</div>
              <div className="py-2 px-2 hover:bg-gray-100 text-sm cursor-pointer text-red-500"
              onClick={() => {
                setShowMenu(false);
                closeWindow("wallet-window");
              }}>退出</div>
            </div>
          )}
          {showUserSelect && (
            <div className="absolute right-[10%] mt-5 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-2">
              <Select
                style={{ width: '100%' }}
                placeholder="选择账户"
                options={Object.entries(userInfoDic).map(([key, user]) => ({
                  label: user.userName,
                  value: user.walletId
                }))}
                onChange={handleSelectUser}
                onBlur={() => setShowUserSelect(false)}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* 积分信息 */}
      <div className="p-4 bg-gray-50">
        <div className="flex justify-between mb-4">
          <div className="text-2xl font-bold">{userInfo?.tokenNumber || 0} 积分</div>
            <div className={`${userTransaction?.[0]?.transactionType === TransactionTypeEnum.INCOME ? 'text-green-500' : 'text-green-500'}`}>
              {userTransaction?.[0]&&(userTransaction?.[0]?.transactionType === TransactionTypeEnum.INCOME ? '+' : '-')}{userTransaction?.[0]?.transactionToken || 0} 积分
            </div>
        </div>

        <div className="grid grid-cols-4 gap-4 cursor-pointer">
          {[
            {icon: "↓", text: "转入"},
            {icon: "↑", text: "转出"},
            {icon: "📈", text: "收益"},
            {icon: "💎", text: "资产"}
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
                {item.icon}
              </div>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 交易记录标签页 */}
      <div className="flex-1 overflow-auto mb-0">
        <Tabs
          defaultActiveKey="1"
          className="mb-0"
          items={[
            {
              key: '1',
              label: '积分收入',
              children: (
                <div className="overflow-scroll default-pointer mt-0">
                  {transactions.filter(t => t.transactionType === TransactionTypeEnum.INCOME).map(tx => (
                    <div key={tx.transactionId} className="m-1 p-2 bg-gray-50 rounded flex flex-col space-y-2 default-pointer">
                      <div className="text-lg text-green-500">+{tx.transactionToken} 积分</div>
                      <div className="text-sm text-gray-500">转入账户: {tx.transactionFrom}</div>
                      <div className="text-sm text-gray-500">情报ID: {tx.refInfoId}</div>
                      <div className="text-sm text-gray-500">创建时间: {new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              key: '2', 
              label: '积分支出',
              children: (
                <div className="overflow-scroll default-pointer">
                  {transactions.filter(t => t.transactionType === TransactionTypeEnum.OUTCOME).map(tx => (
                    <div key={tx.transactionId} className="m-1 p-2 bg-gray-50 rounded flex flex-col space-y-2 default-pointer">
                      <div className="text-lg text-red-500">-{tx.transactionToken} 积分</div>
                      <div className="text-sm text-gray-500">转出账户: {tx.transactionTo}</div>
                      <div className="text-sm text-gray-500">情报ID: {tx.refInfoId}</div>
                      <div className="text-sm text-gray-500">创建时间: {new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              key: '3',
              label: '交易记录',
              children: (
                <div className="overflow-scroll default-pointer">
                  {transactions.map(tx => (
                    <div key={tx.transactionId} className="m-1 p-2 bg-gray-50 rounded flex flex-col space-y-2 default-pointer">
                      <div className="flex items-center mb-2">
                        <span className="mr-2">{tx.transactionType === TransactionTypeEnum.INCOME ? "↓" : "↑"}</span>
                        <span>{tx.transactionType === TransactionTypeEnum.INCOME ? "转入" : "转出"}</span>
                      </div>
                      <div className={`text-lg ${tx.transactionType === TransactionTypeEnum.INCOME ? "text-green-500" : "text-red-500"}`}>
                        {tx.transactionType === TransactionTypeEnum.INCOME ? "+" : "-"}{tx.transactionToken} 积分
                      </div>
                      <div className="text-sm text-gray-500">
                        对方账户: {tx.transactionType === TransactionTypeEnum.INCOME ? tx.transactionFrom : tx.transactionTo}
                      </div>
                      <div className="text-sm text-gray-500">交易哈希: {tx.transactionId}</div>
                      <div className="text-sm text-gray-500">创建时间: {new Date(tx.timestamp).toLocaleString()}</div>
                      <div className="text-sm text-green-500">已完成</div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
