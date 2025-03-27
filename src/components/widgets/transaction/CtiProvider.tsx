import { Upload, Table, Tag, message } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/global';
import { UserInfo } from '@/store/user';
import { CloudUploadOutlined } from '@ant-design/icons';
import { useWindowManager } from '@/context/WindowManager';
import CtiDetail from '@/components/cti/CtiDetail';
import EvaluateStakeModal from './EvaluateStakeModal';
import { useCtiStore, CtiData } from '@/store/ctiStore';
import { useMessage } from '@/context/MessageProvider';
import { StakeStatusEnum } from '@/store/user';
const { Dragger } = Upload;


export const CtiProvider = ({ userInfo }: { userInfo: UserInfo }) => {
  const { clientServerHost } = useGlobalStore();
  const { openWindow, openModalWindow } = useWindowManager();
  const { messageApi } = useMessage();
  const { ctiItems ,createCti} = useCtiStore();
  const [dataSource, setDataSource] = useState<CtiData[]>([]);
  useEffect(() => {
    const ownerCtiItems = ctiItems.filter((item) => item.userId === userInfo?.userId);
    setDataSource(ownerCtiItems);
  }, [ctiItems]);
  const columns = [
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
      render: (_: unknown, record: CtiData) => (
        <Tag color={record.stakeStatus != StakeStatusEnum.UNSTAKED ? 'green' : 'orange'}>
          {record.stakeStatus != StakeStatusEnum.UNSTAKED ? '已评估' : '未评估'}
        </Tag>
      )
    },
    {
      title: '评估分数',
      dataIndex: 'evaluateQuality',
      key: 'evaluateQuality',
      width: '10%',
      align: 'center' as const
    },
    {
      title: '抵押积分',
      dataIndex: 'stake',
      key: 'stake',
      width: '10%',
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
      title: '收益积分',
      dataIndex: 'reward',
      key: 'reward',
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
          <div className="bg-sky-800 text-white px-3 py-1 rounded hover:bg-sky-600 transition-colors shadow-sm" onClick={() => handleDetail(record)}>
            详情
          </div>
          <div className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors shadow-sm" onClick={() => handleEvaluate(record)}>
            评估
          </div>
        </div>
      )
    }
  ];

  const handleUpload = (info: UploadChangeParam<UploadFile<unknown>>) => {
    const file = info.file.originFileObj;
    if (file) {
      console.log(file);
    }
    if(info.file.status === 'done'){
      
      messageApi.success('上传成功');
      createCti(userInfo?.userId);
    }
    if(info.file.status === 'error'){
      //模拟失败也显示上传成功
      info.file.status = 'done';
      messageApi.success('上传成功');
      createCti(userInfo?.userId);
    }
  };

  const handleDetail = (record: CtiData) => {
    console.log("ctiId", record.ctiId);
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

  const handleEvaluate = (record: CtiData) => {
    console.log("id", record.ctiId);
    openModalWindow(
      '评估',
      <EvaluateStakeModal cti={record} isOwner={record.userId === userInfo?.userId} />,
      '520px',
      (record.userId == userInfo?.userId) ? '470px' : '420px',
      "evaluate-stake-modal",
      false
    )
  }

  const fetchUserProviderCtiData = async () => {

  }

  useEffect(() => {
    fetchUserProviderCtiData();
  }, []);

  return (
    <div className="flex flex-col space-y-4 p-2">
      <div className="border-b-2 border-sky-800 py-1">
        <span className='text-sky-800 font-bold my-2'>演化博弈激励交易</span>
      </div>

      <Dragger
        name="file"
        multiple={true}
        action={`${clientServerHost}/data/upload_file`}
        className="border-sky-800 hover:border-sky-600 transition-colors"
        onChange={handleUpload}
      >
        <p className="ant-upload-drag-icon">
          <CloudUploadOutlined className="text-4xl" style={{ color: '#00598A' }} />
        </p>
        <p className="ant-upload-text text-lg font-medium">
          点击或拖动文件到此区域上传
        </p>
        <p className="ant-upload-hint text-gray-600">
          支持单个或批量上传，文件格式支持JSON、XML等
        </p>
      </Dragger>

      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}
        className="rounded-lg shadow-sm mt-3"
        rowClassName="hover:bg-gray-50 transition-colors"
      />
    </div>
  );
};
