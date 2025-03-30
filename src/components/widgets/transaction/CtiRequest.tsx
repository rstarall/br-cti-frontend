import { Table, Tag, Button, Tooltip } from 'antd';
import { useState } from 'react';
import { useCtiStore } from '@/store/ctiStore';
import { useCtiRequestStore } from '@/store/ctiRequestStore';
import { useUserStore ,Transaction, TransactionTypeEnum } from '@/store/user';
import { CtiData } from '@/store/ctiStore';
import { useMessage } from '@/context/MessageProvider';
import type { ColumnsType } from 'antd/es/table';
import { Key, RowSelectMethod } from 'antd/es/table/interface';

const generateTransactionId = (): string => {
  // 获取当前时间的36进制表示
  const timeBase36 = Date.now().toString(36);
  
  // 生成安全随机数（兼容浏览器和Node.js）
  const crypto = window.crypto || (window as any).msCrypto;
  const randomBuffer = new Uint8Array(8);
  crypto.getRandomValues(randomBuffer);
  
  // 转换为36进制字符串
  const randomBase36 = Array.from(randomBuffer, byte => 
    byte.toString(36).padStart(2, '0')
  ).join('').slice(0, 10);

  // 组合成完整交易ID
  return `${timeBase36}${randomBase36}`.toLowerCase();
}


export const CtiRequest = () => {
  const { userInfo, addTransaction } = useUserStore();
  const { ctiRequestItems,removeFromCtiRequest } = useCtiRequestStore();
  const { updateCtiItem } = useCtiStore();
  const { messageApi } = useMessage();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<CtiData[]>([]);

  const columns: ColumnsType<CtiData> = [
    {
      title: 'ID',
      dataIndex: 'ctiId',
      key: 'ctiId',
      width: '20%',
      align: 'center' as const
    },
    {
      title: 'IPFS地址',
      dataIndex: 'ipfsAddress',
      key: 'ipfsAddress',
      width: '12%',
      align: 'center' as const,
      ellipsis: true,
      render: (_: unknown, record: CtiData) => {
        return <Tooltip title={record.paymentUserList?.includes(userInfo.walletId) ? record.ipfsAddress : '*********'} placement="topLeft">
          <span className='truncate' style={{cursor: 'pointer'}}>
                {record.paymentUserList?.includes(userInfo.walletId) ? record.ipfsAddress : '*********'}
              </span>
        </Tooltip>
      }
    },
    {
      title: '密钥',
      dataIndex: 'cryptoKey',
      key: 'cryptoKey',
      width: '12%',
      align: 'center' as const,
      ellipsis: true,
      render: (_: unknown, record: CtiData) => {
        return <Tooltip title={record.paymentUserList?.includes(userInfo.walletId) ? record.cryptoKey : '*********'}placement="topLeft">
          <span className='truncate' style={{cursor: 'pointer'}}>
            {record.paymentUserList?.includes(userInfo.walletId) ? record.cryptoKey : '*********'}
          </span>
        </Tooltip>
      }
    },
    {
      title: '授权押金',
      dataIndex: 'value',
      key: 'value',
      width: '15%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => {
        return <div className="text-center">
         {(record.value * 0.1).toFixed(2)}
        </div>
      }
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: '10%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => {
        return <Tag color={record.paymentUserList?.includes(userInfo.walletId) ? 'green' : 'orange'}>
          {record.paymentUserList?.includes(userInfo.walletId) ? '已支付' : '未支付'}
        </Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => (
        <div className="flex flex-between space-x-2  justify-center cursor-pointer">
          <div className={`text-white p-1 px-2 rounded hover:bg-blue-600 transition-colors shadow-sm
           ${record.paymentUserList?.includes(userInfo.walletId) ? 'bg-blue-500' : 'bg-blue-500'}`} 
          onClick={() => {if(!record.paymentUserList?.includes(userInfo.walletId)) handlePayment(record)}}
          >
            {record.paymentUserList?.includes(userInfo.walletId) ? '已支付' : '支付'}
          </div>
          <div className="bg-red-400 text-white p-1 px-2 rounded hover:bg-red-300 transition-colors shadow-sm" onClick={() => handleRemove(record)}>
            移除
          </div>
        </div>
      )
    }
  ];
  const createTokenTransaction = (cti:CtiData,from:string,to:string,amount:number) => {
    if(from ==''||to===''){
      return;
    }
    if(from === to){
      messageApi.error('不能给自己转账');
      return;
    }
    if(amount <= 0){
      messageApi.error('转账金额不能小于0');
      return;
    }
    if(from === 'platform'){
      messageApi.info(`收入${amount}积分`);
    }else{
      messageApi.info(`支出${amount}积分`);
    }
    const timestamp:string = new Date().toISOString()
    const outComeTransaction:Transaction = {
      transactionId: generateTransactionId(),
      transactionFrom: from,
      transactionTo: to,
      transactionToken: parseFloat(amount.toFixed(2)),
      transactionUserId: from,
      transactionType: TransactionTypeEnum.OUTCOME,
      timestamp: timestamp,
      refInfoId: cti.ctiId,
    }

    const inComeTransaction:Transaction = {
      transactionId: generateTransactionId(),
      transactionFrom: to,
      transactionTo: from,
      transactionToken: parseFloat(amount.toFixed(2)),
      transactionUserId: from,
      transactionType: TransactionTypeEnum.INCOME,
      timestamp: timestamp,
      refInfoId: cti.ctiId,
    }
    //支出
    addTransaction(from,outComeTransaction);
    //收入
    addTransaction(to,inComeTransaction);
  }


  const handleRemove = (record: CtiData) => {
    removeFromCtiRequest(record.ctiId);
    messageApi.success('移除成功');
  }

  const handlePayment = (record: CtiData | undefined) => {
    setLoading(true);
    //单个支付
    if(record){
      //不可购买自己的情报
      if(record.walletId === userInfo.walletId){
        messageApi.info('不可购买自己的情报');
        setLoading(false);
        return;
      }
      // 支付操作
      setTimeout(() => {
        setSelectedRowKeys(selectedRowKeys.filter((item) => item !== record.ctiId));
        updateCtiItem(record.ctiId, {
          ...record,
          paymentUserList: [...(record.paymentUserList||[]), userInfo?.walletId]
        });
        createTokenTransaction(record,userInfo.walletId,record.walletId,record.value * 0.1);
        setLoading(false);
        messageApi.success('支付成功');
        removeFromCtiRequest(record.ctiId);
      }, 1000);
    }else{
      //批量支付
      // 支付操作
      setTimeout(() => {
        messageApi.info(`支付${selectedRows.length}项情报`);
        selectedRows.map((item) => {
          if(item.ctiId){
            if(item.walletId === userInfo.walletId){
              messageApi.info('不可购买自己的情报');
              setLoading(false);
              return;
            }
            updateCtiItem(item.ctiId, {
              ...item,
              paymentUserList: [...(item.paymentUserList||[]), userInfo?.walletId]
            });
            createTokenTransaction(item,userInfo.walletId,item.walletId,item.value * 0.1);
            removeFromCtiRequest(item.ctiId);
          }
        });
        setSelectedRowKeys([]);
        setSelectedRows([]);
        messageApi.success('支付成功');
        setLoading(false);
      }, 1000);
    }
  }
  const onSelectChange = (selectedRowKeys: string[],selectedRows: CtiData[],info: { type: RowSelectMethod }) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection = {
    fixed: 'left',
    selectedRowKeys,
    onChange: onSelectChange,
    type: 'checkbox' as const,
    hideSelectAll: false
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="flex flex-col space-y-2 p-2">
      <div className="border-b-2 border-sky-800 py-1">
        <span className="text-sky-800 font-bold my-2">情报交易清单</span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-start items-center h-full pt-2">
          <Button type="primary" onClick={() => handlePayment(undefined)} disabled={!hasSelected} loading={loading}>
            支付
          </Button>
          <span className="text-gray-600 px-3">
            {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : null}
          </span>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={ctiRequestItems}
          rowKey="ctiId"
          bordered
          pagination={false}
          className="rounded-lg shadow-sm"
          rowClassName="hover:bg-gray-50 transition-colors"
        />
      </div>
    </div>
  );
};
