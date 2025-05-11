import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface KnowledgePlaneProps {
  data?: any;
  title?: string;
  type?: 'normal' | 'traffic';
}

export function KnowledgePlane({ data, title = '知识平面', type = 'normal' }: KnowledgePlaneProps) {
  const [chartOption, setChartOption] = useState({});
  
  useEffect(() => {
    // Generate sample data if none provided
    const sampleData = generateSampleData(type);
    const chartData = data || sampleData;
    
    if (type === 'normal') {
      setChartOption(generateNormalChartOption(chartData));
    } else {
      setChartOption(generateTrafficChartOption(chartData));
    }
  }, [data, type]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ReactECharts 
            option={chartOption} 
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function generateSampleData(type: 'normal' | 'traffic') {
  if (type === 'normal') {
    return {
      nodes: [
        { id: '1', name: 'CVE-2023-1234', value: 60, category: 0 },
        { id: '2', name: 'Malware-XYZ', value: 40, category: 1 },
        { id: '3', name: 'Exploit-ABC', value: 30, category: 2 },
        { id: '4', name: 'Vulnerability-DEF', value: 50, category: 0 },
        { id: '5', name: 'Threat-GHI', value: 35, category: 1 },
        { id: '6', name: 'Attack-JKL', value: 45, category: 2 },
        { id: '7', name: 'CVE-2023-5678', value: 55, category: 0 },
      ],
      links: [
        { source: '1', target: '2' },
        { source: '1', target: '3' },
        { source: '2', target: '4' },
        { source: '2', target: '5' },
        { source: '3', target: '6' },
        { source: '4', target: '7' },
        { source: '5', target: '7' },
      ]
    };
  } else {
    return {
      timestamps: ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05'],
      traffic: [120, 200, 150, 80, 170],
      attacks: [20, 40, 10, 5, 30]
    };
  }
}

function generateNormalChartOption(data: any) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}'
    },
    legend: {
      data: ['漏洞', '恶意软件', '攻击']
    },
    series: [
      {
        name: '知识图谱',
        type: 'graph',
        layout: 'force',
        data: data.nodes.map((node: any) => ({
          id: node.id,
          name: node.name,
          value: node.value,
          symbolSize: node.value / 2,
          category: node.category
        })),
        links: data.links,
        categories: [
          { name: '漏洞' },
          { name: '恶意软件' },
          { name: '攻击' }
        ],
        roam: true,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}'
        },
        force: {
          repulsion: 100,
          edgeLength: 50
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 4
          }
        }
      }
    ]
  };
}

function generateTrafficChartOption(data: any) {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['流量', '攻击']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: data.timestamps
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '流量',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: data.traffic
      },
      {
        name: '攻击',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: data.attacks
      }
    ]
  };
}
