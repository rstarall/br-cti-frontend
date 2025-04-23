import { useGlobalStore } from "@/store/global";

const { clientServerHost, blockchainServerHost } = useGlobalStore.getState();

// 用户相关接口
export const getUserCTIStatistics = async (walletId: string) => {
  const response = await fetch(`${clientServerHost}/user/getUserCTIStatistics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: walletId }),
  });
  const data = await response.json();
  if (data.code === 200) {
    return JSON.parse(data.data);
  }
  throw new Error('获取用户CTI统计数据失败');
};

export const getUserInfo = async (walletId: string) => {
  const response = await fetch(`${blockchainServerHost}/user/queryUserDetailInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: walletId }),
  });
  const data = await response.json();
  if (data.result) {
    return JSON.parse(data.result);
  }
  throw new Error('获取用户信息失败');
};

// CTI相关接口
export const queryCTIData = async (params: {
  type?: number;
  page?: number;
  pageSize?: number;
  incentive?: number;
}) => {
  const { type = -1, page = 1, pageSize = 15, incentive = 0 } = params;
  
  let url = `${blockchainServerHost}/cti/queryAllCtiInfoWithPagination`;
  if (incentive !== 0) {
    url = `${blockchainServerHost}/cti/queryCtiInfoByIncentiveMechanismWithPagination`;
  } else if (type !== -1) {
    url = `${blockchainServerHost}/cti/queryCtiInfoByTypeWithPagination`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page,
      page_size: pageSize,
      ...(incentive !== 0 && { incentive_mechanism: incentive }),
      ...(type !== -1 && { cti_type: type }),
    }),
  });

  const data = await response.json();
  if (data.result) {
    const result = JSON.parse(data.result);
    return {
      cti_infos: result.cti_infos,
      total: result.total,
      page: result.page,
      page_size: result.page_size,
    };
  }
  throw new Error('获取CTI数据失败');
};

export const purchaseCTI = async (walletId: string, password: string, ctiId: string) => {
  const response = await fetch(`${clientServerHost}/user/purchaseCTIFromBlockchain`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wallet_id: walletId,
      password: password,
      cti_id: ctiId,
    }),
  });
  const data = await response.json();
  if (data.code === 200 && data.data) {
    return data.data;
  }
  throw new Error(data.message || '购买CTI失败');
};

// IPFS相关接口
export const getIPFSFileUrl = async (hash: string) => {
  const response = await fetch(`${blockchainServerHost}/ipfs/getIPFSFileUrl`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hash }),
  });
  const data = await response.json();
  if (data.url) {
    return data.url;
  }
  throw new Error('获取IPFS文件URL失败');
};
