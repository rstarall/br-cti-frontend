'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from 'antd';
import { ShareAltOutlined, ArrowRightOutlined, SearchOutlined } from '@ant-design/icons';
// 不需要导入API，使用模拟数据


// 定义情报数据类型
interface IntelligenceData {
  key: string;
  cti_id: string;
  cti_name: string;
  cti_type: number;
  tags: string[];
  creator_user_id: string;
  create_time: string;
  value: number;
}

export default function IntelligenceSharing() {
  // 不使用翻译，统一使用中文
  const [intelligenceData, setIntelligenceData] = useState<IntelligenceData[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取情报数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 模拟从API获取数据
        // 实际项目中应该调用真实API
        // const response = await ctiApi.queryCTIData(1, 10);

        // 模拟数据
        const mockData: IntelligenceData[] = [
          {
            key: '1',
            cti_id: 'CTI-001',
            cti_name: 'APT41组织攻击活动情报',
            cti_type: 1,
            tags: ['APT41', '金融行业', '恶意软件'],
            creator_user_id: 'user123',
            create_time: '2023-11-15',
            value: 120
          },
          {
            key: '2',
            cti_id: 'CTI-002',
            cti_name: 'BlackCat勒索软件分析',
            cti_type: 2,
            tags: ['勒索软件', 'BlackCat', '加密'],
            creator_user_id: 'user456',
            create_time: '2023-11-10',
            value: 150
          },
          {
            key: '3',
            cti_id: 'CTI-003',
            cti_name: '最新DDoS攻击手法分析',
            cti_type: 1,
            tags: ['DDoS', '流量分析', '防御策略'],
            creator_user_id: 'user789',
            create_time: '2023-11-05',
            value: 100
          }
        ];

        setIntelligenceData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('获取情报数据失败:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 跳转到project2
  const redirectToProject2 = () => {
    window.open('http://localhost:3001', '_blank');
  };

  // 表格列定义
  const columns = [
    {
      title: '情报ID',
      dataIndex: 'cti_id',
      key: 'cti_id',
    },
    {
      title: '情报名称',
      dataIndex: 'cti_name',
      key: 'cti_name',
    },
    {
      title: '情报类型',
      dataIndex: 'cti_type',
      key: 'cti_type',
      render: (type: number) => {
        switch (type) {
          case 1: return '恶意流量';
          case 2: return '蜜罐情报';
          case 3: return '僵尸网络';
          case 4: return '应用层攻击';
          case 5: return '开源情报';
          default: return '未知';
        }
      }
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      )
    },
    {
      title: '价值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `${value} 积分`
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    }
  ];

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">情报共享</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={redirectToProject2}>
          <CardHeader className="pb-2">
            <CardTitle>情报平台</CardTitle>
            <CardDescription>访问综合情报共享平台</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24 w-full bg-primary-50 rounded-md mb-4">
              <ShareAltOutlined className="text-4xl text-primary-600" />
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between items-center">
            <span className="text-sm text-gray-500">点击进入平台</span>
            <ArrowRightOutlined className="text-primary-600" />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>最新情报</CardTitle>
            <CardDescription>最近共享的情报信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {intelligenceData.slice(0, 3).map((item) => (
                <div key={item.key} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  <div className="text-sm truncate">{item.cti_name}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="p-0 h-auto text-primary-600">
              查看更多
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>情报搜索</CardTitle>
            <CardDescription>搜索特定情报数据</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 flex-wrap">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="输入关键词搜索..."
              />
              <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                <SearchOutlined />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>情报列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            dataSource={intelligenceData}
            columns={columns}
            loading={loading}
            pagination={{ pageSize: 5 }}
            rowKey="cti_id"
          />
        </CardContent>
      </Card>
    </div>
  );
}
