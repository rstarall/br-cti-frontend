'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useKnowledgePlaneStore } from '@/store/knowledgePlaneStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MapComponent from './map_component.jsx';
import ReactECharts from 'echarts-for-react';

export function NormalKnowledgePlane() {
  const {
    normalGeoData,
    normalTypeData,
    normalTimelineData,
    normalIOCTotal,
    isLoading,
    error,
    fetchNormalGeoData,
    fetchNormalTypeData,
    fetchNormalTimelineData,
    fetchIOCTotals
  } = useKnowledgePlaneStore();

  const [timelineMode, setTimelineMode] = useState<'hour' | 'day' | 'month'>('day');

  // 使用 ref 跟踪组件是否已挂载
  const dataFetched = useRef(false);

  // 只在组件挂载时获取数据
  useEffect(() => {
    // 避免重复获取数据
    if (!dataFetched.current) {
      dataFetched.current = true;

      // 获取数据
      fetchNormalGeoData();
      fetchNormalTypeData();
      fetchNormalTimelineData('day');
      fetchIOCTotals();
    }
  }, []);

  // 处理时间线模式切换
  const handleTimelineModeChange = (mode: 'hour' | 'day' | 'month') => {
    setTimelineMode(mode);
    fetchNormalTimelineData(mode);
  };

  // 地理分布图配置
  const getGeoOptions = () => {
    // 计算最大值，确保数据不为空
    const maxValue = normalGeoData.length > 0
      ? Math.max(...normalGeoData.map(item => item.value))
      : 100; // 默认值为100

    return {
      title: {
        text: '攻击地理分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}'
      },
      visualMap: {
        min: 0,
        max: maxValue,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: true,
        inRange: {
          color: ['#f2f2f2', '#4e79a7', '#1f77b4', '#0d4a6b']
        }
      }
    };
  };

  // 类型分布图配置
  const getTypeOption = () => {
    return {
      title: {
        text: 'IOC类型分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: normalTypeData.map(item => item.name)
      },
      series: [
        {
          name: 'IOC类型',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: normalTypeData,
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

  // 时间线图配置
  const getTimelineOption = () => {
    const dates = normalTimelineData.map(item => item.date);
    const values = normalTimelineData.map(item => item.value);

    return {
      title: {
        text: '攻击时间分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
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
          name: '攻击数量',
          type: 'bar',
          data: values,
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
            fetchNormalGeoData();
            fetchNormalTypeData();
            fetchNormalTimelineData(timelineMode);
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
          <CardTitle>常规攻击知识平面</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary-600">{normalIOCTotal.toLocaleString()}</div>
            <div className="text-sm text-gray-500">总IOC数量</div>
          </div>

          <div className="h-96 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em]"></div>
                  <p className="mt-2 text-gray-600">加载中...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                <div className="text-center text-red-500">
                  <p>加载失败</p>
                  <p className="text-sm">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      fetchNormalGeoData();
                    }}
                  >
                    重试
                  </Button>
                </div>
              </div>
            )}
            <MapComponent
              id="worldMapContainer"
              type="world"
              data={normalGeoData}
              options={{
                ...getGeoOptions(),
                series: [{
                  name: '威胁情报',
                  type: 'map',
                  map: 'world',
                  roam: true,
                  emphasis: {
                    label: {
                      show: true
                    }
                  },
                  // Don't set data here, let the component handle it
                }]
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>IOC类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em]"></div>
                    <p className="mt-2 text-gray-600">加载中...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                  <div className="text-center text-red-500">
                    <p>加载失败</p>
                    <p className="text-sm">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        fetchNormalTypeData();
                      }}
                    >
                      重试
                    </Button>
                  </div>
                </div>
              )}
              <ReactECharts
                option={getTypeOption()}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>攻击时间分布</CardTitle>
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
            <div className="h-80 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent align-[-0.125em]"></div>
                    <p className="mt-2 text-gray-600">加载中...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                  <div className="text-center text-red-500">
                    <p>加载失败</p>
                    <p className="text-sm">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        fetchNormalTimelineData(timelineMode);
                      }}
                    >
                      重试
                    </Button>
                  </div>
                </div>
              )}
              <ReactECharts
                option={getTimelineOption()}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
