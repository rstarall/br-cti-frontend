import { useUserStore } from "@/store/user";
import { Input, Select, Button } from "antd";
import { useState } from "react";
import { UserInfo } from "@/store/user";
import { useMessage } from "@/context/MessageProvider";
import { useWindowManager } from "@/context/WindowManager";
const { Option } = Select;

export const WalletWindow = () => {
  const { userInfo, setUserInfo } = useUserStore();
  const { messageApi } = useMessage();
  const { openModalWindow,closeWindow } = useWindowManager();
  const [selectedUser, setSelectedUser] = useState<string>();

  const handleConfirm = () => {
    if (selectedUser) {
      setUserInfo({
        userId: selectedUser,
        username: selectedUser,
        tokenNumber: 1000
      } as UserInfo);
      messageApi.success('切换用户成功');
      closeWindow('wallet-window');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Select
        placeholder="选择用户"
        style={{ width: 200 }}
        onChange={(value) => setSelectedUser(value)}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
          <Option key={num} value={`user${num}`}>user{num}</Option>
        ))}
      </Select>
      <div className="bg-sky-800 text-white px-3 py-1 rounded hover:bg-sky-600 transition-colors shadow-sm mt-4 cursor-pointer" onClick={handleConfirm}>
          确认

      </div>
    </div>
  );
};

