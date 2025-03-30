import { Table, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useCtiStore, CtiData } from '@/store/ctiStore';
import { StakeStatusEnum } from '@/store/user';
import { useWindowManager } from '@/context/WindowManager';
import CtiDetail from '@/components/cti/CtiDetail';
import { useUserStore } from '@/store/user';
import EvaluateStakeModal from './EvaluateStakeModal';

export const CtiPurchased = () => {
  const { openWindow, openModalWindow } = useWindowManager();
  const { ctiItems } = useCtiStore();
  const { userInfo } = useUserStore();
  const [dataSource, setDataSource] = useState<CtiData[]>([]);

  useEffect(() => {
    const purchasedCtiItems = ctiItems.filter((item) => {
      return item.paymentUserList?.includes(userInfo?.walletId || '');
    });
    setDataSource(purchasedCtiItems);
  }, [ctiItems, userInfo]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ctiId',
      key: 'ctiId',
      width: '12%',
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
      width: '12%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => {
        const evaluateList = record.requesterEvaluateList || [];
        const isExistEvaluate = evaluateList.find((item) => item.walletId === userInfo?.walletId);
        if(isExistEvaluate){
          return <Tag color='green'>{isExistEvaluate.evaluateQuality}</Tag>
        }
        return <Tag color='gray'>未评估</Tag>
      }
    },
    {
      title: '评估状态',
      dataIndex: 'evaluateStatus',
      key: 'evaluateStatus',
      width: '10%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => {
        const evaluateList = record.requesterEvaluateList || [];
        const isExistEvaluate = evaluateList.find((item) => item.walletId === userInfo?.walletId);
        if(isExistEvaluate){
          return <Tag color='green'>已评估</Tag>
        }
        return <Tag color='gray'>未评估</Tag>
      }
    },
    {
      title: '押金状态',
      dataIndex: 'stakeStatus',
      key: 'stakeStatus',
      width: '10%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => {
        const evaluateList = record.requesterEvaluateList || [];
        const isExistEvaluate = evaluateList.find((item) => item.walletId === userInfo?.walletId);
        if(!isExistEvaluate){
          return <Tag color='orange'>
            {'授权押金'+(record.value*0.1).toFixed(2)}
          </Tag>
        }
        const evaluateInfo = evaluateList.find((item) => item.walletId === userInfo?.walletId);
        if (!evaluateInfo){return <Tag color='gray'>押金异常</Tag>}
        if (evaluateInfo.stakeStatus === StakeStatusEnum.STAKING){
          return <Tag color='orange'>
            {'抵押中'+(evaluateInfo.stake).toFixed(2)}
          </Tag>
        }
        if (evaluateInfo.stakeStatus === StakeStatusEnum.RETURNED){
          return <Tag color='green'>
            {'已返回'+(evaluateInfo.stake).toFixed(2)}
          </Tag>
        }
        if (evaluateInfo.stakeStatus === StakeStatusEnum.DEDUCTED){
          return <Tag color='red'>
            {'已扣除'+(evaluateInfo.stake).toFixed(2)}
          </Tag>
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      width: '25%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => (
        <div className="flex space-x-2 w-full justify-center cursor-pointer">
          <div 
            className="bg-sky-800 text-white px-3 py-1 rounded hover:bg-sky-600 transition-colors shadow-sm" 
            onClick={() => handleDetail(record)}
          >
            详情
          </div>
          <div
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors shadow-sm"
            onClick={() => handleEvaluate(record)}
          >
            评价
          </div>
        </div>
      )
    }
  ];

  const handleDetail = (record: CtiData) => {
    if (!record.ctiId && record.ctiId !== '0') {
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

  const handleEvaluate = (record: CtiData) => {
    openModalWindow(
      '情报评估',
      <EvaluateStakeModal cti={record} isOwner={record.walletId === userInfo?.walletId} />,
      '570px',
      (record.walletId == userInfo?.walletId) ? '570px' : '480px',
      "evaluate-stake-modal",
      false
    )
  }

  return (
    <div className="flex flex-col space-y-4 p-2">
      <div className="border-b-2 border-sky-800 py-1">
        <span className='text-sky-800 font-bold my-2'>已购买的情报</span>
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
