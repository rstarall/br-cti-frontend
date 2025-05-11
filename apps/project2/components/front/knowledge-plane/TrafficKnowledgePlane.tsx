import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useKnowledgePlaneStore } from '@/store/knowledgePlaneStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function TrafficKnowledgePlane() {
  const { 
    trafficFeatureData, 
    trafficSceneData, 
    trafficTimelineData, 
    trafficIOCTotal,
    isLoading,
    error,
    fetchTrafficFeatureData,
    fetchTrafficSceneData,
    fetchTrafficTimelineData,
    fetchIOCTotals
  } = useKnowledgePlaneStore();
  
  const [timelineMode, setTimelineMode] = useState<'hour' | 'day' | 'month'>('day');
  
  useEffect(() => {
    // 获取数据
    fetchTrafficFeatureData();
    fetchTrafficSceneData();
    fetchTrafficTimelineData('day');
    fetchIOCTotals();
  }, []);
  
  // 处理时间线模式切换
  const handleTimelineModeChange = (mode: 'hour' | 'day' | 'month') => {
    setTimelineMode(mode);
    fetchTrafficTimelineData(mode);
  };
  
  // 特征分布图配置
  const getFeatureOption = () => {
    return {
      title: {
        text: '流量特征分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: trafficFeatureData.map(item => item.name)
      },
      series: [
        {
          name: '特征类型',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: trafficFeatureData,
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
  
  // 场景分布图配置
  const getSceneOption = () => {
    return {
      title: {
        text: '应用场景分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [
        {
          name: '应用场景',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: trafficSceneData
        }
      ]
    };
  };
  
  // 时间线图配置
  const getTimelineOption = () => {
    const dates = trafficTimelineData.map(item => item.date);
    const values = trafficTimelineData.map(item => item.value);
    
    return {
      title: {
        text: '流量时间分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          rotate: timelineMode === 'hour' ? 0 : 45
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '流量数量',
          type: 'line',
          smooth: true,
          data: values,
          areaStyle: {
            opacity: 0.3
          },
          itemStyle: {
            color: '#1f77b4'
          }
        }
      ]
    };
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-md p-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-900 mb-2">加载失败</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button 
          variant="primary"
          onClick={() => {
            fetchTrafficFeatureData();
            fetchTrafficSceneData();
            fetchTrafficTimelineData(timelineMode);
            fetchIOCTotals();
          }}
        >
          重试
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>流量攻击知识平面</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary-600">{trafficIOCTotal.toLocaleString()}</div>
            <div className="text-sm text-gray-500">总流量IOC数量</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80">
              <ReactECharts 
                option={getFeatureOption()} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
            
            <div className="h-80">
              <ReactECharts 
                option={getSceneOption()} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>流量时间分布</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant={timelineMode === 'hour' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => handleTimelineModeChange('hour')}
            >
              小时
            </Button>
            <Button 
              variant={timelineMode === 'day' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => handleTimelineModeChange('day')}
            >
              天
            </Button>
            <Button 
              variant={timelineMode === 'month' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => handleTimelineModeChange('month')}
            >
              月
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ReactECharts 
              option={getTimelineOption()} 
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
