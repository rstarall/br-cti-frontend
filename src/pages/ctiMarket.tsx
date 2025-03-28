import { useTranslation } from 'react-i18next'
import { Input, Button, Table, Pagination, Tag, Select, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useWindowManager } from '@/context/WindowManager';
// import { queryCTIData } from '@/api/cti_market'  // 注释掉原来的API调用
import { TablePaginationConfig, FilterValue, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface'
import { useCtiStore, CtiData, CtiTypeEnum, CtiIncentiveEnum } from '@/store/ctiStore'
import { useCtiRequestStore } from '@/store/ctiRequestStore'
import { useUserStore } from '@/store/user'
import CtiDetail from '@/components/cti/CtiDetail'
const { Search } = Input
const { Option } = Select

// 情报类型映射
const CTI_TYPE_MAP = {
  1: "恶意流量",
  2: "蜜罐情报",
  3: "僵尸网络",
  4: "应用层攻击",
  5: "开源情报",
  0: "其他"
} as { [key: number]: string }


const CTI_TAG_MAP = {
  1: "IP",
  2: "domain",
  3: "URL",
  4: "hash",
  5: "phishing",
  0: "others"
} as { [key: number]: string }


// 激励机制映射
const INCENTIVE_MAP = {
  1: "积分激励",
  2: "三方博弈",
  3: "演化博弈"
} as { [key: number]: string }



// Mock数据生成函数
const generateMockData = (page: number, pageSize: number,mockCtiData:CtiData[]) => {

  const data: CtiData[] = [];
  const startIndex = (page - 1) * pageSize;
  
  for (let i = 0; i < pageSize; i++) {
    const id = startIndex + i + 1;
    if(id>=mockCtiData.length){
      break;
    }
    data.push(mockCtiData[id]);
  }

  return {
    cti_infos: data,
    total: mockCtiData.length
  };
}

// Mock的fetch函数
const mockFetchCTIData = async (params: Record<string, unknown> = {}) => {
  
  return new Promise(resolve => {
    setTimeout(() => {
      const page = params.page || 1;
      const pageSize = params.pageSize || 15;
      const mockCtiData = params.mockCtiData ||[]
      resolve(generateMockData(page as number, pageSize as number,mockCtiData as CtiData[]));
    }, 500); // 模拟500ms的网络延迟
  });
}

export const CtiMarket = () => {
  const { t } = useTranslation('ctiMarket')
  const {ctiItems,initializeCti} = useCtiStore()
  const [messageApi, contextHolder] = message.useMessage();
  const { userInfo } = useUserStore()
  const [data, setData] = useState<CtiData[]>([])
  const { openWindow } = useWindowManager();
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })
  const [filters, setFilters] = useState({
    type: -1,
    incentive: 1,
    sort: 'create_time'
  })
  const { addToCtiRequest } = useCtiRequestStore()

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      align: 'center'
    },
    {
      title: 'CTI编号',
      dataIndex: 'ctiId',
      key: 'ctiId',
      width: '15%',
      align: 'center'
    },
    {
      title: '情报类型',
      dataIndex: 'ctiType',
      key: 'ctiType',
      width: '10%',
      align: 'center',
      render: (text: string, record: CtiData) => (
        <span>{CTI_TYPE_MAP[record.ctiType] || text}</span>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: '8%',
      align: 'center'
    },
    {
      title: 'HASH',
      dataIndex: 'ctiHash',
      key: 'ctiHash',
      width: '13%',
      align: 'center',
      render: (text: string) => (
        <span>{text.slice(0, 10)}...{text.slice(-3)}</span>
      )
    },
    {
      title: '发布时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: '13%',
      align: 'center',
      render: (text: string) => (
        <span>{new Date(text).toLocaleString()}</span>
      )
    },
    {
      title: '激励机制',
      dataIndex: 'incentiveMechanism',
      key: 'incentiveMechanism',
      width: '10%',
      align: 'center',
      render: (text: number) => (
        <Tag color={text === CtiIncentiveEnum.EVOLUTION ? 'blue': 'green'}>{INCENTIVE_MAP[text as keyof typeof INCENTIVE_MAP]}</Tag>
      )
    },
    {
      title: '积分',
      dataIndex: 'value',
      key: 'value',
      width: '6%',
      align: 'center',
      render: (value: number,record:CtiData) => (
        <Tag color={record.incentiveMechanism === CtiIncentiveEnum.EVOLUTION ? 'blue': 'green'} >
          <span className={record.incentiveMechanism === CtiIncentiveEnum.EVOLUTION ? '': ''}>
            {record.incentiveMechanism === CtiIncentiveEnum.EVOLUTION ? 'dynamic':value}
            </span>
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: '14%',
      align: 'center',
      render: (_: unknown, record: CtiData) => (
        <div className="flex flex-col space-y-3 h-full text-white px-[12%]">
          <div className='bg-sky-800 rounded-sm py-[2px] cursor-pointer shadow-md' onClick={() => handleDetail(record)}>情报详情</div>
          <div className='bg-sky-800 rounded-sm py-[2px] cursor-pointer shadow-md' onClick={() => handleCtiRequest(record)}>加入清单</div>
        </div>
      )
    }
  ]

  const fetchData = async (params: Record<string, unknown> = {}) => {
    setLoading(true)
    try {
      const response = await mockFetchCTIData({
        type: filters.type,
        page: pagination.current,
        pageSize: pagination.pageSize,
        incentive: filters.incentive,
        mockCtiData:ctiItems,
        ...params
      }) as { cti_infos: CtiData[], total: number };
      setData(response.cti_infos)
      setPagination(prev => ({
        ...prev,
        total: response.total
      }))
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    _sorter: SorterResult<CtiData> | SorterResult<CtiData>[],
    _extra: TableCurrentDataSource<CtiData>
  ) => {
    if (pagination.current && pagination.pageSize) {
      setPagination(prev => ({
        ...prev,
        current: pagination.current as number,
        pageSize: pagination.pageSize as number
      }));
      fetchData({
        page: pagination.current,
        pageSize: pagination.pageSize
      });
    }
  };

  const handleSearch = (value: string) => {
    fetchData({
      keyword: value
    })
  }

  const handleFilterChange = (type: string, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }))
    fetchData({
      [type]: value,
      page: 1
    })
  }

  const handleDetail = (cti: CtiData) => {
    // 打开详情窗口，使用CtiDetail组件
    openWindow(
      'CTI详情',
      <CtiDetail record={cti} />,
      '800px',  // 设置窗口宽度
      '500px'   // 设置窗口高度
    )
  }

  const handleCtiRequest = (cti: CtiData) => {
    if(cti.walletId === userInfo?.walletId){
      messageApi.open({
        type: 'error',
        content: '您是该情报提供者，不能加入交易清单',
      });
      return;
    }
    addToCtiRequest(cti)
    messageApi.open({
      type: 'success',
      content: '已成功加入交易清单',
    });
  }

   useEffect(() => {
    //初始化
    initializeCti()

    fetchData();
  
  }, [])

  return (
    <div className="p-4 w-[80%] h-[80%] bg-white m-auto mt-2">
      {contextHolder}
      <div className="mb-4">
        <Search
          placeholder="请输入关键词搜索"
          enterButton={
            <Button  type="primary" icon={<SearchOutlined />}>
              搜索
            </Button>
          }
          onSearch={handleSearch}
        />
      </div>

      <div className="mb-4 space-y-4">
        <div className="flex items-center">
          <span className="mr-2">分类:</span>
          <Select
            defaultValue={-1}
            style={{ width: 120 }}
            onChange={value => handleFilterChange('type', value)}
          >
            <Option value={-1}>全部</Option>
            {Object.entries(CTI_TYPE_MAP).map(([key, value]) => (
              <Option key={key} value={key}>{value}</Option>
            ))}
          </Select>
        </div>

        <div className="flex items-center">
          <span className="mr-2">激励机制:</span>
          <Select
            defaultValue={-1}
            style={{ width: 120 }}
            onChange={value => handleFilterChange('incentive', value)}
          >
            <Option value={-1}>全部</Option>
            {Object.entries(INCENTIVE_MAP).map(([key, value]) => (
              <Option key={key} value={key}>{value}</Option>
            ))}
          </Select>
        </div>

        <div className="flex items-center">
          <span className="mr-2">排序:</span>
          <Select
            defaultValue="create_time"
            style={{ width: 120 }}
            onChange={value => handleFilterChange('sort', value)}
          >
            <Option value="create_time">发布时间</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default CtiMarket
