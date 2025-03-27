import React, { useState, useEffect } from 'react';
import { Input, message, Button, List } from 'antd';
import { useCtiRequestStore } from '@/store/ctiRequestStore';
import { CtiData } from '@/store/ctiStore';
import { CreditCardOutlined, WalletOutlined, KeyOutlined } from '@ant-design/icons';

// 情报类型映射
const CTI_TYPE_MAP = {
  1: "恶意流量",
  2: "蜜罐情报", 
  3: "僵尸网络",
  4: "应用层攻击",
  5: "开源情报",
  0: "其他"
};

// 激励机制映射
const INCENTIVE_MAP = {
  1: "积分激励",
  2: "三方博弈",
  3: "演化博弈"
};

interface Comment {
  id: string;
  content: string;
}

interface IncentiveEvent {
  id: string;
  description: string;
}

const CtiDetail = ({ record }: { record: CtiData }) => {
  const [ctiData, setCtiData] = useState(record);
  const [activeTab, setActiveTab] = useState('0');
  const [comments, setComments] = useState<Comment[]>([]);
  const [incentiveEvents, setIncentiveEvents] = useState<IncentiveEvent[]>([]);
  const { addToCtiRequest } = useCtiRequestStore();

  useEffect(() => {
    setCtiData(record);
  }, [record]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === '1') {
      fetchComments();
    } else if (key === '2') {
      fetchIncentiveEvents();
    }
  };

  const fetchComments = async () => {
    // 获取评论数据
    // 示例数据
    setComments([
      { id: '1', content: '这是一个评论' },
      { id: '2', content: '另一个评论' }
    ]);
  };

  const fetchIncentiveEvents = async () => {
    // 获取激励事件数据
    // 示例数据
    setIncentiveEvents([
      { id: '1', description: '激励事件1' },
      { id: '2', description: '激励事件2' }
    ]);
  };

  const handleAddToCart = () => {
    if (ctiData) {
      addToCtiRequest(ctiData);
      message.success('已加入交易清单');
    }
  };

  const renderDetailContent = () => {
    if (!ctiData) return null;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CreditCardOutlined className="mr-2 text-sky-800" />
              <span>所需积分: {ctiData.value}</span>
            </div>
            <div className="flex items-center">
              <WalletOutlined className="mr-2 text-sky-800" />
              <span>我的积分: 0</span>
            </div>
          </div>
          <Button 
            type="primary"
            icon={<KeyOutlined />}
            onClick={handleAddToCart}
            className="bg-sky-800 hover:bg-sky-700"
          >
            获取授权
          </Button>
        </div>

        <List
          className="bg-white rounded-lg"
          itemLayout="horizontal"
          dataSource={Object.entries(ctiData)}
          renderItem={([key, value]) => (
            <List.Item className="px-6 py-3 hover:bg-gray-50 cursor-pointer">
              <div className="w-full flex justify-between items-center">
                <div className="font-medium text-gray-700 pl-3">{key}</div>
                <div className="text-gray-600 truncate max-w-[70%] pr-3">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  };

  const renderCommentSection = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <Input.TextArea rows={4} placeholder="请输入评论" />
          <div className='bg-sky-800 text-white text-[14px] px-2 py-1 cursor-pointer shadow-md rounded-sm w-[100px] mt-2 text-center'>
            提交评论
          </div>
        </div>

        <div className="space-y-2">
          {comments.map(comment => (
            <div key={comment.id} className="p-4 bg-white rounded-lg shadow-sm">
              <div>{comment.content}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderIncentiveSection = () => {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div>激励介绍</div>
          <div>图表区域</div>
        </div>

        <div className="space-y-2">
          {incentiveEvents.map(event => (
            <div key={event.id} className="p-4 bg-white rounded-lg shadow-sm">
              <div>{event.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-1">
      <div className="flex space-x-4 mb-4 w-full">
        <div 
          className={`flex-1 text-center py-2 rounded-lg cursor-pointer 
            ${activeTab === '0' ? 'bg-sky-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('0')}
        >
          情报详情
        </div>
        <div 
          className={`flex-1 text-center py-2 rounded-lg cursor-pointer 
            ${activeTab === '1' ? 'bg-sky-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('1')}
        >
          情报评论
        </div>
        <div 
          className={`flex-1 text-center py-2 rounded-lg cursor-pointer 
            ${activeTab === '2' ? 'bg-sky-800 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handleTabChange('2')}
        >
          积分激励
        </div>
      </div>

      {activeTab === '0' && renderDetailContent()}
      {activeTab === '1' && renderCommentSection()}
      {activeTab === '2' && renderIncentiveSection()}
    </div>
  );
};

export default CtiDetail;
