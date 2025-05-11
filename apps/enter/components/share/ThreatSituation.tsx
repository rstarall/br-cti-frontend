'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, Table, Badge } from 'antd';
import { AlertOutlined, GlobalOutlined, BarChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
// 不使用翻译，统一使用中文

// 定义威胁态势数据类型
interface ThreatData {
  key: string;
  threat_id: string;
  threat_name: string;
  threat_type: string;
  source_ip: string;
  target_ip: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
  status: 'active' | 'mitigated' | 'resolved';
}

export default function ThreatSituation() {
  // 不使用翻译，统一使用中文
  const [threatData, setThreatData] = useState<ThreatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // 获取威胁态势数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 模拟从API获取数据
        // 实际项目中应该调用真实API

        // 模拟威胁数据
        const mockThreatData: ThreatData[] = [
          {
            key: '1',
            threat_id: 'T-001',
            threat_name: 'DDoS攻击',
            threat_type: 'DDoS',
            source_ip: '192.168.1.1',
            target_ip: '10.0.0.1',
            severity: 'high',
            time: '2023-11-15 08:30:25',
            status: 'active'
          },
          {
            key: '2',
            threat_id: 'T-002',
            threat_name: 'SQL注入尝试',
            threat_type: '注入攻击',
            source_ip: '192.168.1.2',
            target_ip: '10.0.0.2',
            severity: 'medium',
            time: '2023-11-15 09:15:10',
            status: 'mitigated'
          },
          {
            key: '3',
            threat_id: 'T-003',
            threat_name: '恶意软件传播',
            threat_type: '恶意软件',
            source_ip: '192.168.1.3',
            target_ip: '10.0.0.3',
            severity: 'high',
            time: '2023-11-14 14:22:45',
            status: 'resolved'
          },
          {
            key: '4',
            threat_id: 'T-004',
            threat_name: '暴力破解尝试',
            threat_type: '暴力破解',
            source_ip: '192.168.1.4',
            target_ip: '10.0.0.4',
            severity: 'medium',
            time: '2023-11-14 16:45:30',
            status: 'active'
          },
          {
            key: '5',
            threat_id: 'T-005',
            threat_name: '钓鱼攻击',
            threat_type: '钓鱼',
            source_ip: '192.168.1.5',
            target_ip: '10.0.0.5',
            severity: 'low',
            time: '2023-11-13 11:10:15',
            status: 'mitigated'
          }
        ];

        setThreatData(mockThreatData);
        setLoading(false);
      } catch (error) {
        console.error('获取威胁态势数据失败:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 威胁表格列定义
  const threatColumns = [
    {
      title: '威胁ID',
      dataIndex: 'threat_id',
      key: 'threat_id',
    },
    {
      title: '威胁名称',
      dataIndex: 'threat_name',
      key: 'threat_name',
    },
    {
      title: '威胁类型',
      dataIndex: 'threat_type',
      key: 'threat_type',
    },
    {
      title: '源IP',
      dataIndex: 'source_ip',
      key: 'source_ip',
    },
    {
      title: '目标IP',
      dataIndex: 'target_ip',
      key: 'target_ip',
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: 'high' | 'medium' | 'low') => {
        const color = severity === 'high' ? 'red' : severity === 'medium' ? 'orange' : 'green';
        const text = severity === 'high' ? '高危' : severity === 'medium' ? '中危' : '低危';
        return <Badge color={color} text={text} />;
      }
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'active' | 'mitigated' | 'resolved') => {
        const color = status === 'active' ? 'red' : status === 'mitigated' ? 'blue' : 'green';
        const text = status === 'active' ? '活跃' : status === 'mitigated' ? '已缓解' : '已解决';
        return <Badge color={color} text={text} />;
      }
    }
  ];

  // 获取威胁类型分布图表选项
  const getThreatTypeOption = () => {
    return {
      title: {
        text: '威胁类型分布',
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
          name: '威胁数量',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 35, name: 'DDoS' },
            { value: 25, name: '注入攻击' },
            { value: 20, name: '恶意软件' },
            { value: 15, name: '暴力破解' },
            { value: 10, name: '钓鱼攻击' }
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

  // 获取威胁趋势图表选项
  const getThreatTrendOption = () => {
    return {
      title: {
        text: '威胁趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['高危', '中危', '低危'],
        bottom: 0
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
      },
      yAxis: {
        type: 'value',
        name: '威胁数量'
      },
      series: [
        {
          name: '高危',
          type: 'line',
          data: [5, 3, 2, 8, 12, 10, 7, 6],
          smooth: true,
          lineStyle: {
            color: '#f5222d'
          },
          itemStyle: {
            color: '#f5222d'
          }
        },
        {
          name: '中危',
          type: 'line',
          data: [8, 6, 5, 10, 15, 13, 10, 9],
          smooth: true,
          lineStyle: {
            color: '#fa8c16'
          },
          itemStyle: {
            color: '#fa8c16'
          }
        },
        {
          name: '低危',
          type: 'line',
          data: [12, 10, 8, 15, 20, 18, 15, 13],
          smooth: true,
          lineStyle: {
            color: '#52c41a'
          },
          itemStyle: {
            color: '#52c41a'
          }
        }
      ]
    };
  };

  // 获取地理分布图表选项
  const getGeoDistributionOption = () => {
    return {
      title: {
        text: '威胁地理分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        min: 0,
        max: 200,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: true
      },
      series: [
        {
          name: '威胁数量',
          type: 'map',
          map: 'world',
          roam: true,
          emphasis: {
            label: {
              show: true
            }
          },
          data: [
            { name: 'China', value: 180 },
            { name: 'United States', value: 150 },
            { name: 'Russia', value: 120 },
            { name: 'Brazil', value: 80 },
            { name: 'India', value: 70 },
            { name: 'United Kingdom', value: 60 },
            { name: 'Germany', value: 50 },
            { name: 'France', value: 40 },
            { name: 'Japan', value: 35 },
            { name: 'South Korea', value: 30 }
          ]
        }
      ]
    };
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">威胁态势</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertOutlined className="mr-2 text-red-500" />
              活跃威胁
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">24</div>
              <div className="text-sm text-gray-500">系统中当前活跃的威胁</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <GlobalOutlined className="mr-2 text-blue-500" />
              受影响系统
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-500">受威胁影响的系统数量</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChartOutlined className="mr-2 text-green-500" />
              风险等级
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">中等</div>
              <div className="text-sm text-gray-500">当前整体风险等级</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: '概览',
            children: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Card>
                  <CardContent className="p-0">
                    <ReactECharts
                      option={getThreatTypeOption()}
                      style={{ height: '350px', width: '100%' }}
                      opts={{ renderer: 'canvas' }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-0">
                    <ReactECharts
                      option={getThreatTrendOption()}
                      style={{ height: '350px', width: '100%' }}
                      opts={{ renderer: 'canvas' }}
                    />
                  </CardContent>
                </Card>
              </div>
            )
          },
          {
            key: 'geo',
            label: '地理分布',
            children: (
              <Card className="mt-4">
                <CardContent className="p-0">
                  <div className="h-[500px]">
                    <ReactECharts
                      option={getGeoDistributionOption()}
                      style={{ height: '100%', width: '100%' }}
                      opts={{ renderer: 'canvas' }}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          },
          {
            key: 'list',
            label: '威胁列表',
            children: (
              <Card className="mt-4">
                <CardContent>
                  <Table
                    dataSource={threatData}
                    columns={threatColumns}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    rowKey="key"
                  />
                </CardContent>
              </Card>
            )
          }
        ]}
      />
    </div>
  );
}
