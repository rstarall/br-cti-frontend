import { message } from 'antd';
import { useEffect } from 'react';

export const useMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return {
    messageApi,
    contextHolder
  };
};
