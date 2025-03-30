import { Upload, Table, Tag, message, Button, Tooltip } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/global';
import { useUserStore } from '@/store/user';
import { CloudUploadOutlined } from '@ant-design/icons';
import { useWindowManager } from '@/context/WindowManager';
import CtiDetail from '@/components/cti/CtiDetail';
import EvaluateStakeModal from './EvaluateStakeModal';
import { useCtiStore, CtiData } from '@/store/ctiStore';
import { useMessage } from '@/context/MessageProvider';
import { StakeStatusEnum } from '@/store/user';
import { RowSelectMethod } from 'antd/es/table/interface';
const { Dragger } = Upload;

export const CtiProvider = () => {
  const { clientServerHost } = useGlobalStore();
  const { openWindow, openModalWindow } = useWindowManager();
  const { messageApi } = useMessage();
  const { ctiItems ,createCti,updateCtiItem} = useCtiStore();
  const { userInfo } = useUserStore();
  const [dataSource, setDataSource] = useState<CtiData[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<CtiData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ownerCtiItems = ctiItems.filter((item) => {
      return (item.walletId === userInfo?.walletId)&&(!item.onChain)
    });
    setDataSource(ownerCtiItems);
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
      width: '8%',
      align: 'center' as const,
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
          <div className="bg-sky-800 text-white px-3 py-1 rounded hover:bg-sky-600 transition-colors shadow-sm" onClick={() => handleDetail(record)}>
            详情
          </div>
          {!record.evaluateStatus&&<div className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors shadow-sm" onClick={() => handleEvaluate(record)}>
            评估
          </div>}
          {record.evaluateStatus&&<div className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors shadow-sm" onClick={() => handleOnChain(record)}>
            上链
          </div>}

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
      createCti(userInfo?.walletId,userInfo);
    }
    if(info.file.status === 'error'){
      info.file.status = 'done';
      messageApi.success('上传成功');
      createCti(userInfo?.walletId,userInfo);
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
      '情报评估',
      <EvaluateStakeModal cti={record} isOwner={record.walletId === userInfo?.walletId} />,
      '570px',
      (record.walletId == userInfo?.walletId) ? '570px' : '530px',
      "evaluate-stake-modal",
      false
    )
  }

  const handleOnChain = (record?: CtiData) => {
    setLoading(true);
     //单个上链
     if(record){
      // 上链操作
      setTimeout(() => {
        setSelectedRowKeys(selectedRowKeys.filter((item) => item !== record.ctiId));
        const newCti = {...record,onChain:true};
        updateCtiItem(record.ctiId,newCti);
        setLoading(false);
        messageApi.success('上链成功');
      }, 1000);
     }else{
      //批量上链
      // 上链操作
      setTimeout(() => {
        selectedRows.map((item) => {
          if(item.ctiId){
            updateCtiItem(item.ctiId,{...item,onChain:true});
          }
        });
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setLoading(false);
      }, 1000);
    }
  };

  const onSelectChange = (selectedRowKeys: string[],selectedRows: CtiData[],info: { type: RowSelectMethod }) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: 'checkbox' as const,
    hideSelectAll: false
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="flex flex-col space-y-4 p-2">
      <div className="border-b-2 border-sky-800 py-1">
        <span className='text-sky-800 font-bold my-2'>演化博弈激励交易</span>
      </div>

      <Dragger
        name="file"
        multiple={true}
        action={`${clientServerHost}/data/upload_file`}
        className="border-sky-800 hover:border-sky-600 transition-colors mb-3"
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

      <div className="mt-3 border-t-2 border-sky-800 flex flex-col gap-3">
        <div className="flex justify-start items-center h-full pt-2">
          <Button type="primary" onClick={() => handleOnChain()} disabled={!hasSelected} loading={loading}>
            上链
          </Button>
          <span className="text-gray-600 px-3">
            {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : null}
          </span>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          rowKey="ctiId"
          bordered
          pagination={false}
          className="rounded-lg shadow-sm"
          rowClassName="hover:bg-gray-50 transition-colors"
          // scroll={{ x: 'max-content' }}
        />
        
      </div>
      
    </div>
  );
};
