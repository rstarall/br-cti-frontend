import { Table, Tag, message, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useCtiStore, CtiData } from '@/store/ctiStore';
import { useWindowManager } from '@/context/WindowManager';
import CtiDetail from '@/components/cti/CtiDetail';
import { StakeStatusEnum } from '@/store/user';
import { useUserStore } from '@/store/user';
export const CtiOnchain = () => {
  const { openWindow } = useWindowManager();
  const { ctiItems } = useCtiStore();
  const { userInfo } = useUserStore();
  const [dataSource, setDataSource] = useState<CtiData[]>([]);

  useEffect(() => {
    const onchainCtiItems = ctiItems.filter((item) => {
      return (item.onChain)&&(item.walletId === userInfo?.walletId)
    });
    //反向排序
    onchainCtiItems.reverse();
    setDataSource(onchainCtiItems);
  }, [ctiItems,userInfo]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ctiId',
      key: 'ctiId',
      width: '16%',
      align: 'center' as const,
    },
    {
      title: 'IPFS地址',
      dataIndex: 'ipfsAddress',
      key: 'ipfsAddress',
      width: '15%',
      align: 'center' as const,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <span className='truncate' style={{cursor: 'pointer'}}>
            {text}
          </span>
        </Tooltip>
      )
    },
    {
      title: '密钥',
      dataIndex: 'cryptoKey',
      key: 'cryptoKey',
      width: '15%',
      align: 'center' as const,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <span className='truncate' style={{cursor: 'pointer'}}>
            {text}
          </span>
        </Tooltip>
      )
    },
    {
      title: '评估分数',
      dataIndex: 'evaluateQuality',
      key: 'evaluateQuality',
      width: '15%',
      align: 'center' as const,
    },
    {
      title: '状态',
      dataIndex: 'onChain',
      key: 'onChain',
      width: '10%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => (
        <Tag color={record.onChain ? 'green' : 'orange'}>
          {record.onChain ? '已上链' : '未上链'}
        </Tag>
      )
    },
    {
      title: '抵押积分',
      dataIndex: 'stake',
      key: 'stake',
      width: '12%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => (
        <Tag color={record.stakeStatus === StakeStatusEnum.UNSTAKED ? 'orange' : 
        (record.stakeStatus === StakeStatusEnum.STAKING ? 'orange' : 
        (record.stakeStatus === StakeStatusEnum.RETURNED ? 'green' : 'red'))}>
          {record.stakeStatus === StakeStatusEnum.UNSTAKED ? '未抵押' : 
          (record.stakeStatus === StakeStatusEnum.STAKING ? `抵押${record.stake}` : 
          (record.stakeStatus === StakeStatusEnum.RETURNED ? `返回${record.stake}` : `扣除${record.stake}`))}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => (
        <div className="flex space-x-2 w-full justify-center cursor-pointer">
          <div 
            className="bg-sky-800 text-white px-3 py-1 rounded hover:bg-sky-600 transition-colors shadow-sm" 
            onClick={() => handleDetail(record)}
          >
            详情
          </div>
        </div>
      )
    }
  ];

  const handleDetail = (record: CtiData) => {
    if (!record.ctiId && record.ctiId !== '0') {
        message.error('CTI ID 不能为空');
        return;
    };
    openWindow(
      'CTI详情',
      <CtiDetail record={record} />,
      '800px',
      '500px',
      undefined,
      false
    )
  }

  return (
    <div className="flex flex-col space-y-4 p-2">
      <div className="border-b-2 border-sky-800 py-1">
        <span className='text-sky-800 font-bold my-2'>已上链情报</span>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="ctiId"
        bordered
        pagination={false}
        className="rounded-lg shadow-sm"
        rowClassName="hover:bg-gray-50 transition-colors"
      />
    </div>
  );
};
