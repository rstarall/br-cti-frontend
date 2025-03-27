import { Table, Tag, Modal } from 'antd';
import { useState } from 'react';
import { useCtiRequestStore } from '@/store/ctiRequestStore';
import { UserInfo } from '@/store/user';
import { useWindowManager } from '@/context/WindowManager';
import CtiDetail from '@/components/cti/CtiDetail';
import EvaluateStakeModal from '@/components/widgets/transaction/EvaluateStakeModal';
import { CtiData } from '@/store/ctiStore';
import { useMessage } from '@/context/MessageProvider';
import { ExclamationCircleFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

export const CtiRequest = ({userInfo}: {userInfo: UserInfo}) => {
  const { ctiRequestItems, removeFromCtiRequest } = useCtiRequestStore();
  const { openWindow, openModalWindow } = useWindowManager();
  const { messageApi } = useMessage();
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<CtiData> = [
    {
      title: 'ID',
      dataIndex: 'ctiId',
      key: 'ctiId',
      width: '10%',
      align: 'center' as const
    },
    {
      title: '类型',
      dataIndex: 'tags',
      key: 'tags', 
      width: '10%',
      align: 'center' as const
    },
    {
      title: '状态',
      dataIndex: 'evaluateStatus',
      key: 'evaluateStatus',
      width: '10%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => {
        const exitUserId = record.requesterEvaluateList?.some((evaluate) => evaluate.userId === userInfo?.userId);
        return <Tag color={exitUserId ? 'green' : 'orange'}>
          {exitUserId ? '已评估' : '未评估'}
        </Tag>
      }
    },
    {
      title: '评估分数',
      dataIndex: 'evaluateQuality',
      key: 'evaluateQuality',
      width: '10%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => {
        const evaluateItem = record.requesterEvaluateList?.find((evaluate) => evaluate.userId === userInfo?.userId);
        return <Tag color={evaluateItem?.evaluateQuality ? 'green' : 'orange'}>
          {evaluateItem?.evaluateQuality ? evaluateItem?.evaluateQuality : 0}
        </Tag>
      }
    },
    {
      title: '抵押积分',
      dataIndex: 'stake',
      key: 'stake',
      width: '10%',
      align: 'center' as const
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      align: 'center' as const,
      render: (_: unknown, record: CtiData) => (
        <div className="flex space-x-2 w-full justify-center cursor-pointer">
          <div className="bg-sky-800 text-white p-1 px-2 rounded hover:bg-sky-600 transition-colors shadow-sm" onClick={() => handleDetail(record)}>
            详情
          </div>
          <div className="bg-green-500 text-white p-1 px-2 rounded hover:bg-green-600 transition-colors shadow-sm" onClick={() => handleEvaluate(record)}>
            评估
          </div>
          <div className="bg-red-500 text-white p-1 px-2 rounded hover:bg-red-600 transition-colors shadow-sm" onClick={() => handleRemove(record)}>
            移除
          </div>
        </div>
      )
    }
  ];

  const handleDetail = (record: CtiData) => {
    console.log("ctiId", record.ctiId);
    if (!record.ctiId && record.ctiId !== '0') {
      messageApi.error('CTI ID 不能为空');
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
    console.log("id", record.ctiId);
    openModalWindow(
      '评估',
      <EvaluateStakeModal cti={record} isOwner={record.userId === userInfo?.userId} />,
      '520px',
      (record.userId == userInfo?.userId) ? '470px' : '390px',
      "evaluate-stake-modal",
      false
    )
  }

  const handleRemove = (record: CtiData) => {
    removeFromCtiRequest(record.ctiId);
    messageApi.success('移除成功');
  }

  return (
    <div className="flex flex-col space-y-4 p-2">
      <div className="border-b-2 border-sky-800 py-1">
        <span className="text-sky-800 font-bold my-2">情报交易清单</span>
      </div>

      <Table
        columns={columns}
        dataSource={ctiRequestItems}
        bordered
        pagination={false}
        className="rounded-lg shadow-sm mt-3"
        rowClassName="hover:bg-gray-50 transition-colors"
        loading={loading}
      />
    </div>
  );
};
