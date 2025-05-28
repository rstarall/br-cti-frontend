'use client';

import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, Progress, Spin } from 'antd';
import { TrophyOutlined, RiseOutlined, TeamOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useIncentiveStore } from '@/store/incentiveStore';
// 不使用翻译，统一使用中文

export default function IncentivePage() {
  // 使用激励机制store
  const {
    mechanismStats,
    rankingData,
    trendData,
    totalIncentiveValue,
    totalCTICount,
    totalUserCount,
    isLoading,
    error,
    fetchAllData
  } = useIncentiveStore();

  // 获取激励机制数据
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
        data: trendData.map(item => item.date)
      },
      yAxis: {
        type: 'value',
        name: '激励值'
      },
      series: [
        {
          name: '积分激励',
          type: 'line',
          data: trendData.map(item => item.point_incentive),
          smooth: true
        },
        {
          name: '三方博弈',
          type: 'line',
          data: trendData.map(item => item.tripartite_game),
          smooth: true
        },
        {
          name: '演化博弈',
          type: 'line',
          data: trendData.map(item => item.evolutionary_game),
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
          data: mechanismStats.map(stat => ({
            value: stat.total_value,
            name: stat.mechanism_name
          })),
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

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">获取数据失败: {error}</p>
        </div>
      )}

      {/* 加载状态 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {mechanismStats.map((stat, index) => {
              const icons = [TrophyOutlined, TeamOutlined, RiseOutlined];
              const colors = ['text-yellow-500', 'text-blue-500', 'text-green-500'];
              const IconComponent = icons[index];

              return (
                <Card key={stat.mechanism_id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <IconComponent className={`mr-2 ${colors[index]}`} />
                      {stat.mechanism_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {stat.mechanism_id === 1 && '根据情报价值奖励贡献者积分'}
                      {stat.mechanism_id === 2 && '涉及三方的博弈理论模型，用于优化激励'}
                      {stat.mechanism_id === 3 && '基于参与度动态演化的激励机制'}
                    </p>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">
                        {stat.total_value.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">总积分</div>
                      <div className="text-xs text-gray-400 mt-1">
                        占比: {stat.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {!isLoading && (
        <>
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
                loading={isLoading}
                pagination={false}
                rowKey="key"
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
