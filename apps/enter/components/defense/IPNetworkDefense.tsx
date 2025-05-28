'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Chart } from 'chart.js/auto';
import { DefenseData, TimelineEntry } from '@/store/defenseStore';

interface IPNetworkDefenseProps {
  defenseData: DefenseData | null;
  isLoading: boolean;
  onBack: () => void;
  onStartDefense: () => void;
}

export default function IPNetworkDefense({
  defenseData,
  isLoading,
  onBack,
  onStartDefense
}: IPNetworkDefenseProps) {
  // 状态管理
  const [isStarted, setIsStarted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // 图表引用
  const flowChartRef = useRef<Chart<'line'> | null>(null);
  const profitChartRef = useRef<Chart<'line'> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const profitCanvasRef = useRef<HTMLCanvasElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // 使用 ref 管理可变状态
  const currentIndexRef = useRef(0);
  const trafficCountRef = useRef(0);
  const timelineRef = useRef<TimelineEntry[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  // 自动滚动日志
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  /** 初始化图表 */
  const setupCharts = () => {
    if (!canvasRef.current || !profitCanvasRef.current) return;

    [flowChartRef, profitChartRef].forEach(ref => {
      ref.current?.destroy();
      ref.current = null;
    });

    // 初始化流量图表
    flowChartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '接收流量 (recv)',
            data: [],
            borderColor: '#007ACC',
            borderWidth: 2,
            fill: false
          },
          {
            label: '发送流量 (sent)',
            data: [],
            borderColor: '#FF8C00',
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        animation: false,
        scales: { y: { beginAtZero: true } }
      }
    });

    // 初始化攻击收益图表
    profitChartRef.current = new Chart(profitCanvasRef.current, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: '攻击收益 (profit)',
          data: [],
          borderColor: '#DC143C',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          spanGaps: false,
          pointRadius: 3,
          pointBackgroundColor: '#DC143C80'
        }]
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${(Number(value) * 100).toFixed(0)}%`
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) =>
                `攻击收益: ${(context.parsed.y * 100).toFixed(2)}%`
            }
          }
        }
      }
    });
  };

  // 处理数据帧动画
  useEffect(() => {
    let frameTimer: NodeJS.Timeout;

    const processFrame = () => {
      if (currentIndexRef.current >= timelineRef.current.length) {
        setIsStarted(false);
        return;
      }

      const frame = timelineRef.current[currentIndexRef.current];
      currentIndexRef.current++;

      if (frame.step === 'traffic_sample') {
        trafficCountRef.current += 1;
        const newCount = trafficCountRef.current;

        // 更新流量图表
        flowChartRef.current?.data.labels?.push(newCount);
        flowChartRef.current?.data.datasets.forEach((dataset, i) => {
          dataset.data.push(i === 0 ? frame.recv! : frame.sent!);
        });

        // 处理收益数据
        const rawProfit = frame.profit?.[frame.profit.length - 1];
        let profitValue = Number(rawProfit) || 0;
        profitValue = Math.min(1, Math.max(0, profitValue));

        // 更新收益图表
        profitChartRef.current?.data.labels?.push(newCount);
        profitChartRef.current?.data.datasets[0].data.push(profitValue);

        // 更新图表
        flowChartRef.current?.update('none');
        profitChartRef.current?.update('none');
      }

      // 处理日志
      const logMap = {
        traffic_sample: '📊 流量采样更新',
        ddos_check: `DDoS 检测结果：${frame.is_ddos ? "⚠️ 有攻击" : "✅ 无异常"}`,
        ddos_source: `🚫 封锁恶意 IP：${frame.ip?.join(', ') || ''}，防御状态：${frame.success ? "成功" : "失败"}`,
        detection_model: `🧠 检测模型选择动作：${frame.message}`,
        defense_model: `🛡️ 防御模型选择动作：${frame.message}`,
        monitor_start: `📡 监控启动：${frame.description}`
      };

      if (frame.step in logMap) {
        setLogs(prev => [...prev.slice(-50), `[${new Date().toLocaleTimeString()}] ${logMap[frame.step as keyof typeof logMap]}`]);
      }
    };

    if (isStarted) {
      frameTimer = setInterval(() => {
        processFrame();
      }, 200);
    }

    return () => clearInterval(frameTimer);
  }, [isStarted]);

  /** 加载检测数据并开始检测 */
  const loadAndStartDetection = async () => {
    // 如果没有数据，先加载数据
    if (!defenseData) {
      await onStartDefense();
      // 数据加载后会自动触发重新渲染，此时 defenseData 会有值
      return;
    }

    // 如果已有数据，直接开始检测
    setIsStarted(false);
    clearTimeout(timerRef.current);

    // 重置状态
    currentIndexRef.current = 0;
    trafficCountRef.current = 0;
    timelineRef.current = defenseData.timeline;
    setLogs([]);

    setupCharts();
    setIsStarted(true);
  };

  // 当数据加载完成后自动开始检测
  React.useEffect(() => {
    if (defenseData && !isStarted && timelineRef.current.length === 0) {
      // 重置状态
      currentIndexRef.current = 0;
      trafficCountRef.current = 0;
      timelineRef.current = defenseData.timeline;
      setLogs([]);

      setupCharts();
      setIsStarted(true);
    }
  }, [defenseData]);

  return (
    <div className="p-6 h-full overflow-auto bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="mb-6"
        >
          返回网络选择
        </Button>

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">IP网络DDoS防御</h1>

        {/* 控制面板 */}
        <Card className="mb-6">
          <div className="flex flex-col items-center gap-4">
            <Button
              type="primary"
              size="large"
              onClick={loadAndStartDetection}
              loading={isLoading}
              disabled={isStarted}
              className="px-8 py-2"
            >
              {isLoading ? '加载中...' : defenseData ? '重新开始检测' : '加载检测数据'}
            </Button>
          </div>
        </Card>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="服务器流量收发情况" className="h-80">
            <canvas ref={canvasRef} className="w-full h-full" />
          </Card>
          <Card title="攻击收益变化趋势" className="h-80">
            <canvas ref={profitCanvasRef} className="w-full h-full" />
          </Card>
        </div>

        {/* 日志区域 */}
        <Card title="检测过程日志">
          <div
            ref={logContainerRef}
            className="bg-gray-50 p-4 rounded-md h-48 overflow-y-auto border"
          >
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-2 text-gray-700">
                {log}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500 text-center">等待开始检测...</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
