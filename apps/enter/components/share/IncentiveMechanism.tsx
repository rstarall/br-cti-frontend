'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, Progress } from 'antd';
import { TrophyOutlined, RiseOutlined, TeamOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
// 不使用翻译，统一使用中文

// 只需要排行榜数据类型

// 定义排行榜数据类型
interface RankingData {
  key: string;
  user_id: string;
  user_name: string;
  contribution_score: number;
  cti_count: number;
  rank: number;
}

export default function IncentiveMechanism() {
  // 不使用翻译，统一使用中文
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取激励机制数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 模拟从API获取数据
        // 实际项目中应该调用真实API
        // const response = await incentiveApi.queryIncentiveEvents();

        // 不需要模拟激励数据，只需要排行榜数据

        // 模拟排行榜数据
        const mockRankingData: RankingData[] = [
          {
            key: '1',
            user_id: 'user123',
            user_name: '用户A',
            contribution_score: 850,
            cti_count: 12,
            rank: 1
          },
          {
            key: '2',
            user_id: 'user456',
            user_name: '用户B',
            contribution_score: 720,
            cti_count: 8,
            rank: 2
          },
          {
            key: '3',
            user_id: 'user789',
            user_name: '用户C',
            contribution_score: 650,
            cti_count: 6,
            rank: 3
          },
          {
            key: '4',
            user_id: 'user101',
            user_name: '用户D',
            contribution_score: 580,
            cti_count: 5,
            rank: 4
          },
          {
            key: '5',
            user_id: 'user202',
            user_name: '用户E',
            contribution_score: 520,
            cti_count: 4,
            rank: 5
          }
        ];

        // 不需要设置incentiveData
        setRankingData(mockRankingData);
        setLoading(false);
      } catch (error) {
        console.error('获取激励机制数据失败:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 不需要激励机制表格列定义

  // 排行榜表格列定义
  const rankingColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank: number) => {
        const color = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? '#cd7f32' : '';
        return (
          <div className="flex items-center">
            {rank <= 3 ? (
              <TrophyOutlined style={{ color, marginRight: 8 }} />
            ) : null}
            <span>{rank}</span>
          </div>
        );
      }
    },
    {
      title: '用户名',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '贡献分数',
      dataIndex: 'contribution_score',
      key: 'contribution_score',
      render: (score: number) => (
        <div>
          <span className="mr-2">{score}</span>
          <Progress
            percent={Math.min(100, (score / 1000) * 100)}
            showInfo={false}
            strokeColor="#1890ff"
            size="small"
          />
        </div>
      )
    },
    {
      title: '情报数量',
      dataIndex: 'cti_count',
      key: 'cti_count',
    }
  ];

  // 获取趋势图表选项
  const getTrendOption = () => {
    return {
      title: {
        text: '激励趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        type: 'value',
        name: '激励值'
      },
      series: [
        {
          name: '积分激励',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
          smooth: true
        },
        {
          name: '三方博弈',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149],
          smooth: true
        },
        {
          name: '演化博弈',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410, 320, 332, 301, 334, 390],
          smooth: true
        }
      ]
    };
  };

  // 获取机制分布图表选项
  const getDistributionOption = () => {
    return {
      title: {
        text: '激励机制分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '分布',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: '积分激励' },
            { value: 735, name: '三方博弈' },
            { value: 580, name: '演化博弈' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">激励机制</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TrophyOutlined className="mr-2 text-yellow-500" />
              积分激励
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">根据情报价值奖励贡献者积分</p>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">1,048</div>
              <div className="text-sm text-gray-500">总积分</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TeamOutlined className="mr-2 text-blue-500" />
              三方博弈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">涉及三方的博弈理论模型，用于优化激励</p>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">735</div>
              <div className="text-sm text-gray-500">总积分</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <RiseOutlined className="mr-2 text-green-500" />
              演化博弈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">基于参与度动态演化的激励机制</p>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">580</div>
              <div className="text-sm text-gray-500">总积分</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-0">
            <ReactECharts
              option={getTrendOption()}
              style={{ height: '350px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <ReactECharts
              option={getDistributionOption()}
              style={{ height: '350px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>贡献者排名</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            dataSource={rankingData}
            columns={rankingColumns}
            loading={loading}
            pagination={false}
            rowKey="key"
          />
        </CardContent>
      </Card>
    </div>
  );
}
