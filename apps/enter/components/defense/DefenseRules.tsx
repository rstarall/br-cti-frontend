'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chart } from 'chart.js/auto';

type TimelineEntry = {
  step: string;
  recv?: number;
  sent?: number;
  is_ddos?: boolean;
  ip?: string[];
  success?: boolean;
  message?: string;
  description?: string;
  profit?: number[];
}

export default function DDoSDefenseDemo() {
  // 状态管理
  const [selectedFile, setSelectedFile] = useState('ip_result.jsonl');
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

  /** 获取时间线数据 */
  const fetchTimeline = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/ddos/ddos_ability/${encodeURIComponent(selectedFile)}`
      );
      if (!response.ok) throw new Error(`HTTP错误! 状态码: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('请求失败:', error);
      setLogs(prev => [...prev, `❌ 请求失败: ${error instanceof Error ? error.message : '未知错误'}`]);
      return null;
    }
  };

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
          tension: 0.4, // 添加曲线平滑
          spanGaps: false, // 改为false确保折线连续
        pointRadius: 3, // 添加数据点可见性
        pointBackgroundColor: '#DC143C80' // 添加数据点颜色
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

  /** 处理数据帧 */
  // 新增的useEffect控制动画流程
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
  }, [isStarted]); // 仅依赖 isStarted

  /** 开始检测 */
  const startDetection = async () => {
    setIsStarted(false);
    clearTimeout(timerRef.current);
    
    const response = await fetchTimeline();
    if (!response) return;

    // 重置状态
    currentIndexRef.current = 0;
    trafficCountRef.current = 0;
    timelineRef.current = response.timeline;
    setLogs([]);
    
    setupCharts();
    setIsStarted(true);
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">DDoS攻击防御展示</h2>
      
      <div className="flex flex-col items-center gap-4 mb-8">
        <select 
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="w-64 border rounded-md px-3 py-2 text-sm"
        >
          <option value="ip_result.jsonl">IP网络防御</option>
          <option value="5g_result.jsonl">5G网络防御</option>
          <option value="satellite_result.jsonl">卫星网络防御</option>
        </select>
        
        <button
          onClick={startDetection}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          开始检测
        </button>
      </div>

      <div className="flex flex-col items-center gap-8 mb-8">
        <div className="w-full max-w-4xl">
          <h3 className="text-lg font-semibold mb-4">服务器流量收发情况</h3>
          <canvas ref={canvasRef} className="w-full h-64" />
        </div>
        <div className="w-full max-w-4xl">
          <h3 className="text-lg font-semibold mb-4">攻击收益变化趋势</h3>
          <canvas ref={profitCanvasRef} className="w-full h-64" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">检测过程日志</h3>
        <div 
          ref={logContainerRef}
          className="border rounded-md p-4 bg-gray-50 h-48 overflow-y-auto"
        >
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono mb-2">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}