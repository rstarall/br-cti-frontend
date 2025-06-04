import React from 'react';
import { Card, Empty, Table, Tag } from 'antd';
import { Line } from '@ant-design/charts';
import Image from 'next/image';
import { IncentiveEventInfo, IncentiveTrendDataPoint, INCENTIVE_MECHANISM_DESCRIPTIONS } from '@/api/types/incentive';

interface IncentivePanelProps {
  incentiveMechanism: number;
  incentiveEvents: IncentiveEventInfo[];
  incentiveTrendData: IncentiveTrendDataPoint[];
  incentiveTotal: number;
}

export function IncentivePanel({
  incentiveMechanism,
  incentiveEvents,
  incentiveTrendData,
  incentiveTotal
}: IncentivePanelProps) {
  // 获取激励机制名称
  const getIncentiveMechanismName = (type: number): string => {
    switch (type) {
      case 1: return '积分激励';
      case 2: return '三方博弈';
      case 3: return '演化博弈';
      default: return '未知机制';
    }
  };

  // 根据激励机制类型获取对应的图片
  const renderIncentiveImages = () => {
    switch (incentiveMechanism) {
      case 1:
        return (
          <div className="flex justify-center">
            <Image
              src="/images/incentive/common-incentive.png"
              alt="积分激励机制"
              width={600}
              height={400}
              className="max-w-full h-auto"
            />
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/images/incentive/three-party-game-1.png"
              alt="三方博弈机制1"
              width={600}
              height={300}
              className="max-w-full h-auto"
            />
            <Image
              src="/images/incentive/three-party-game-2.png"
              alt="三方博弈机制2"
              width={600}
              height={300}
              className="max-w-full h-auto"
            />
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/images/incentive/evolutionary-incentive-1.png"
              alt="演化博弈机制"
              width={600}
              height={300}
              className="max-w-full h-auto"
            />
            <Image
              src="/images/incentive/evolutionary-incentive-2.png"
              alt="演化博弈机制"
              width={600}
              height={300}
              className="max-w-full h-auto"
            />
          </div>
        );
      default:
        return (
          <div className="flex justify-center">
            <Image
              src="/images/incentive/common-incentive.png"
              alt="默认激励机制"
              width={600}
              height={400}
              className="max-w-full h-auto"
            />
          </div>
        );
    }
  };

  return (
    <div className="mb-6">
      <Card className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            激励机制介绍 ({getIncentiveMechanismName(incentiveMechanism)})
          </h3>
          <p className="text-gray-600 mb-4">
            {INCENTIVE_MECHANISM_DESCRIPTIONS.find(
              item => item.mechanism_id === incentiveMechanism
            )?.mechanism_description || '暂无介绍'}
          </p>
          {renderIncentiveImages()}
        </div>
      </Card>

      <Card title="积分趋势" className="mb-6">
        {incentiveTrendData && incentiveTrendData.length > 0 ? (
          <div style={{ height: 300 }}>
            <Line
              data={incentiveTrendData}
              xField="date"
              yField="value"
              point={{
                size: 5,
                shape: 'diamond',
              }}
              tooltip={{
                formatter: (datum: any) => {
                  return { name: '积分', value: datum.value };
                },
              }}
            />
          </div>
        ) : (
          <Empty description="暂无积分趋势数据" />
        )}
      </Card>

      <Card title={`积分事件 (${incentiveTotal})`}>
        <Table
          dataSource={incentiveEvents}
          rowKey="incentive_id"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
          }}
          columns={[
            {
              title: '激励机制',
              dataIndex: 'incentive_mechanism',
              key: 'incentive_mechanism',
              align: 'center',
              render: (mechanism) => {
                let color = 'blue';
                let text = '未知';

                switch (mechanism) {
                  case 1:
                    color = 'blue';
                    text = '积分激励';
                    break;
                  case 2:
                    color = 'green';
                    text = '三方博弈';
                    break;
                  case 3:
                    color = 'purple';
                    text = '演化博弈';
                    break;
                }

                return <Tag color={color}>{text}</Tag>;
              }
            },
            {
              title: '评论分数',
              dataIndex: 'comment_score',
              key: 'comment_score',
              align: 'center',
              render: (score) => score ? <span>{score}</span> : <span>-</span>
            },
            {
              title: '积分变化',
              key: 'value_change',
              align: 'center',
              render: (_, record) => {
                // 计算积分变化值
                const valueChange = record.incentive_value - record.history_value;
                // 保留两位小数
                const formattedChange = valueChange.toFixed(2);
                // 添加正负号
                const valueChangeText = valueChange >= 0 ? `+${formattedChange}` : formattedChange;

                return <span className={valueChange >= 0 ? 'text-green-600' : 'text-red-600'}>{valueChangeText}</span>;
              }
            },
            {
              title: '更新时间',
              dataIndex: 'create_time',
              key: 'create_time',
              align: 'center',
              render: (time) => new Date(time).toLocaleString()
            }
          ]}
        />
      </Card>
    </div>
  );
}
