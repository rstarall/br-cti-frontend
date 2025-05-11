'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AttackMonitoring() {
  const [attackData, setAttackData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [networkType, setNetworkType] = useState('ip'); // 'ip', '5g', 'satellite'
  const [defenseMode, setDefenseMode] = useState('auto'); // 'auto', 'manual', 'learning'
  const [isDefenseActive, setIsDefenseActive] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState('honeypot-1');
  const [selectedAttack, setSelectedAttack] = useState<number | null>(null);
  const [showAttackDetails, setShowAttackDetails] = useState(false);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [learningProgress, setLearningProgress] = useState(0);
  const [learningStatus, setLearningStatus] = useState('idle'); // 'idle', 'learning', 'completed'
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalAttacks: 342,
    blocked: 328,
    mitigated: 14,
    unhandled: 0,
    honeypotRedirects: 87,
    learningIterations: 1243
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const trafficIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 模拟加载初始数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setAttackData([
        { id: 1, time: '2023-11-15 14:32:45', type: 'DDoS攻击', source: '192.168.1.10', target: 'Web服务器 (IP网络)', severity: 'high', status: 'blocked', confidence: 95, method: 'RL-DDoS-Defender' },
        { id: 2, time: '2023-11-15 14:28:12', type: 'SQL注入', source: '192.168.1.15', target: 'Web应用 (IP网络)', severity: 'medium', status: 'blocked', confidence: 92, method: 'Pattern-Matcher' },
        { id: 3, time: '2023-11-15 14:25:30', type: 'DDoS攻击', source: '多个IP', target: '网络边界 (IP网络)', severity: 'high', status: 'mitigated', confidence: 98, method: 'RL-DDoS-Defender' },
        { id: 4, time: '2023-11-15 14:20:18', type: '信令攻击', source: '10.72.145.22', target: '5G基站', severity: 'high', status: 'redirected', confidence: 89, method: 'Honeypot-Redirector' },
        { id: 5, time: '2023-11-15 14:15:05', type: '中间人攻击', source: '10.72.168.30', target: '5G核心网', severity: 'high', status: 'blocked', confidence: 94, method: 'RL-Traffic-Analyzer' },
        { id: 6, time: '2023-11-15 14:10:42', type: '干扰攻击', source: '未知', target: '卫星通信链路', severity: 'medium', status: 'detected', confidence: 78, method: 'Signal-Analyzer' },
        { id: 7, time: '2023-11-15 14:05:23', type: '欺骗攻击', source: '未知', target: '卫星地面站', severity: 'high', status: 'redirected', confidence: 91, method: 'Honeypot-Redirector' },
        { id: 8, time: '2023-11-15 14:00:11', type: 'DDoS攻击', source: '192.168.1.12', target: 'Web服务器 (IP网络)', severity: 'medium', status: 'blocked', confidence: 96, method: 'RL-DDoS-Defender' },
      ]);
      setIsLoading(false);

      // 初始化流量数据
      const initialTrafficData = Array(20).fill(0).map((_, i) => ({
        time: new Date(Date.now() - (19 - i) * 5000).toISOString(),
        normal: Math.floor(Math.random() * 50) + 50,
        attack: Math.floor(Math.random() * 20),
        redirected: Math.floor(Math.random() * 10)
      }));
      setTrafficData(initialTrafficData);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 模拟实时攻击数据更新
  useEffect(() => {
    if (!isLoading) {
      intervalRef.current = setInterval(() => {
        if (Math.random() > 0.7) { // 30% 概率生成新攻击
          const newAttack = {
            id: Date.now(),
            time: new Date().toLocaleString(),
            type: ['DDoS攻击', 'SQL注入', '信令攻击', '欺骗攻击'][Math.floor(Math.random() * 4)],
            source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            target: ['Web服务器 (IP网络)', 'API服务 (IP网络)', '5G基站', '卫星通信链路'][Math.floor(Math.random() * 4)],
            severity: Math.random() > 0.6 ? 'high' : 'medium',
            status: isDefenseActive ? (Math.random() > 0.2 ? (Math.random() > 0.5 ? 'blocked' : 'redirected') : 'detected') : 'detected',
            confidence: Math.floor(Math.random() * 15) + 85,
            method: ['RL-DDoS-Defender', 'RL-Traffic-Analyzer', 'Honeypot-Redirector', 'Pattern-Matcher'][Math.floor(Math.random() * 4)]
          };

          setAttackData(prev => [newAttack, ...prev.slice(0, 19)]);

          // 更新统计数据
          setStats(prev => {
            const newStats = { ...prev, totalAttacks: prev.totalAttacks + 1 };
            if (newAttack.status === 'blocked') newStats.blocked += 1;
            if (newAttack.status === 'mitigated') newStats.mitigated += 1;
            if (newAttack.status === 'redirected') newStats.honeypotRedirects += 1;
            return newStats;
          });

          // 显示告警消息
          if (newAttack.severity === 'high') {
            setAlertMessage(`检测到${newAttack.type}！来源: ${newAttack.source}, 目标: ${newAttack.target}`);
            setTimeout(() => setAlertMessage(null), 5000);
          }
        }
      }, 8000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isLoading, isDefenseActive]);

  // 模拟实时流量数据更新
  useEffect(() => {
    if (!isLoading) {
      trafficIntervalRef.current = setInterval(() => {
        setTrafficData(prev => {
          const newData = [...prev.slice(1), {
            time: new Date().toISOString(),
            normal: Math.floor(Math.random() * 50) + 50,
            attack: isDefenseActive ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 30) + 10,
            redirected: isDefenseActive ? Math.floor(Math.random() * 15) : 0
          }];
          return newData;
        });
      }, 5000);

      return () => {
        if (trafficIntervalRef.current) clearInterval(trafficIntervalRef.current);
      };
    }
  }, [isLoading, isDefenseActive]);

  // 模拟强化学习进度
  useEffect(() => {
    if (learningStatus === 'learning') {
      const interval = setInterval(() => {
        setLearningProgress(prev => {
          if (prev >= 100) {
            setLearningStatus('completed');
            setStats(prevStats => ({
              ...prevStats,
              learningIterations: prevStats.learningIterations + 50
            }));
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [learningStatus]);

  // 处理网络类型切换
  const handleNetworkTypeChange = (type: string) => {
    setNetworkType(type);
    // 根据网络类型过滤攻击数据
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // 处理防御模式切换
  const handleDefenseModeChange = (mode: string) => {
    setDefenseMode(mode);
  };

  // 启动/停止防御
  const toggleDefense = () => {
    setIsDefenseActive(!isDefenseActive);
    setAlertMessage(isDefenseActive ? "已停止防御系统" : "已启动防御系统");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // 启动强化学习
  const startLearning = () => {
    setLearningStatus('learning');
    setLearningProgress(0);
    setAlertMessage("已启动强化学习模型训练");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // 处理流量重定向
  const handleRedirect = (attackId?: number) => {
    if (attackId) {
      setAttackData(prev =>
        prev.map(attack =>
          attack.id === attackId
            ? { ...attack, status: 'redirected' }
            : attack
        )
      );
      setAlertMessage(`已将攻击 #${attackId} 重定向到蜜罐`);
    } else {
      setAlertMessage(`已启动流量重定向到 ${redirectTarget}`);
    }

    setStats(prev => ({
      ...prev,
      honeypotRedirects: prev.honeypotRedirects + 1
    }));

    setTimeout(() => setAlertMessage(null), 3000);
  };

  // 处理攻击拦截
  const handleBlock = (attackId: number) => {
    setAttackData(prev =>
      prev.map(attack =>
        attack.id === attackId
          ? { ...attack, status: 'blocked' }
          : attack
      )
    );

    setStats(prev => ({
      ...prev,
      blocked: prev.blocked + 1
    }));

    setAlertMessage(`已拦截攻击 #${attackId}`);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // 查看攻击详情
  const handleViewDetails = (attackId: number) => {
    setSelectedAttack(attackId);
    setShowAttackDetails(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'bg-green-100 text-green-800';
      case 'mitigated': return 'bg-blue-100 text-blue-800';
      case 'redirected': return 'bg-purple-100 text-purple-800';
      case 'detected': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'blocked': return '已阻止';
      case 'mitigated': return '已缓解';
      case 'redirected': return '已重定向';
      case 'detected': return '已检测';
      default: return status;
    }
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">攻击监控</h2>

      {/* 告警消息 */}
      {alertMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
          <strong className="font-bold">告警: </strong>
          <span className="block sm:inline">{alertMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setAlertMessage(null)}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>关闭</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {/* 控制面板 - 更紧凑的布局设计 */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="space-y-4">
          {/* 第一行：网络环境和操作按钮 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 网络环境 */}
            <div className="lg:col-span-2">
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                <h3 className="text-sm font-medium text-gray-800 mr-2 whitespace-nowrap">网络环境:</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${networkType === 'ip' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handleNetworkTypeChange('ip')}
                  >
                    IP网络
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${networkType === '5g' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handleNetworkTypeChange('5g')}
                  >
                    5G网络
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${networkType === 'satellite' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handleNetworkTypeChange('satellite')}
                  >
                    卫星网络
                  </button>
                </div>
              </div>
            </div>

            {/* 主要操作按钮 */}
            <div className="flex items-center justify-end gap-2">
              <button
                className={`px-4 py-1.5 rounded-md text-white font-medium transition-colors ${isDefenseActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                onClick={toggleDefense}
              >
                {isDefenseActive ? '停止防御' : '启动防御'}
              </button>
              <button
                className="px-4 py-1.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => handleRedirect()}
              >
                流量重定向
              </button>
            </div>
          </div>

          {/* 分隔线 */}
          <hr className="border-gray-200" />

          {/* 第二行：防御模式和蜜罐选择 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 防御模式 */}
            <div className="lg:col-span-2">
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                <h3 className="text-sm font-medium text-gray-800 mr-2 whitespace-nowrap">防御模式:</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${defenseMode === 'auto' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handleDefenseModeChange('auto')}
                  >
                    自动防御
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${defenseMode === 'learning' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handleDefenseModeChange('learning')}
                  >
                    学习模式
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${defenseMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handleDefenseModeChange('manual')}
                  >
                    手动模式
                  </button>
                </div>
              </div>
            </div>

            {/* 蜜罐选择 */}
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-800 whitespace-nowrap">蜜罐选择:</h3>
              <div className="relative flex-1">
                <select
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={redirectTarget}
                  onChange={(e) => setRedirectTarget(e.target.value)}
                >
                  <option value="honeypot-1">蜜罐 1 (Web服务器)</option>
                  <option value="honeypot-2">蜜罐 2 (数据库)</option>
                  <option value="honeypot-3">蜜罐 3 (文件服务器)</option>
                </select>
             
              </div>
            </div>
          </div>

          {/* 学习模式按钮和进度条 */}
          {defenseMode === 'learning' && (
            <>
              <hr className="border-gray-200" />
              <div className="flex flex-col gap-2">
                {/* 学习按钮 */}
                <div className="flex justify-end">
                  <button
                    className={`px-4 py-1.5 rounded-md text-white font-medium transition-colors ${
                      learningStatus === 'learning' ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                    onClick={startLearning}
                    disabled={learningStatus === 'learning'}
                  >
                    {learningStatus === 'learning' ? '学习中...' : '启动学习'}
                  </button>
                </div>

                {/* 进度条 */}
                {learningStatus !== 'idle' && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-800">强化学习进度</h3>
                      <span className="text-sm font-medium text-blue-600">{learningProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${learningProgress}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <span>
                        {learningStatus === 'learning'
                          ? '正在训练强化学习模型，优化防御策略...'
                          : '学习完成！防御策略已更新'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 防御状态信息 */}
          {isDefenseActive && (
            <div className="p-2 bg-blue-50 rounded-md text-xs text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>
                {defenseMode === 'auto'
                  ? '自动防御已激活，系统将自动检测并防御攻击'
                  : defenseMode === 'learning'
                  ? '学习模式已激活，系统将收集数据并优化防御策略'
                  : '手动防御已激活，请手动选择防御措施'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{stats.totalAttacks}</h3>
                <p className="text-xs text-gray-500">总攻击</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{stats.blocked}</h3>
                <p className="text-xs text-gray-500">已阻止</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-yellow-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{stats.mitigated}</h3>
                <p className="text-xs text-gray-500">已缓解</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{stats.honeypotRedirects}</h3>
                <p className="text-xs text-gray-500">已重定向</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{stats.learningIterations}</h3>
                <p className="text-xs text-gray-500">学习迭代</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 实时流量监控 */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>实时流量监控</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-md p-4 relative">
              <div className="absolute inset-0 p-4">
                <div className="h-full flex items-end">
                  {trafficData.map((data, index) => (
                    <div key={index} className="w-full h-full flex flex-col justify-end items-center mx-0.5">
                      <div
                        className="w-full bg-red-500 rounded-t-sm"
                        style={{ height: `${Math.min(data.attack * 0.8, 100)}%` }}
                      ></div>
                      <div
                        className="w-full bg-purple-500 rounded-t-sm"
                        style={{ height: `${Math.min(data.redirected * 0.8, 100)}%` }}
                      ></div>
                      <div
                        className="w-full bg-green-500 rounded-t-sm"
                        style={{ height: `${Math.min(data.normal * 0.5, 100)}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-2 left-4 right-4">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>-100s</span>
                  <span>-80s</span>
                  <span>-60s</span>
                  <span>-40s</span>
                  <span>-20s</span>
                  <span>现在</span>
                </div>
              </div>
              <div className="absolute top-2 right-4 flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">正常流量</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">攻击流量</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">重定向流量</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 攻击详情弹窗 */}
      {showAttackDetails && selectedAttack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  攻击详情 #{selectedAttack}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAttackDetails(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {(() => {
                const attack = attackData.find(a => a.id === selectedAttack);
                if (!attack) return <p>未找到攻击数据</p>;

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">攻击类型</h4>
                        <p className="text-lg font-medium">{attack.type}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">时间</h4>
                        <p className="text-lg font-medium">{attack.time}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">来源</h4>
                        <p className="text-lg font-medium">{attack.source}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">目标</h4>
                        <p className="text-lg font-medium">{attack.target}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">严重程度</h4>
                        <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getSeverityColor(attack.severity)}`}>
                          {attack.severity === 'high' ? '高' : attack.severity === 'medium' ? '中' : '低'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">状态</h4>
                        <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(attack.status)}`}>
                          {getStatusText(attack.status)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">检测方法</h4>
                        <p className="text-lg font-medium">{attack.method}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">置信度</h4>
                        <div className="flex items-center">
                          <span className="text-lg font-medium mr-2">{attack.confidence}%</span>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                attack.confidence >= 95 ? 'bg-green-600' :
                                attack.confidence >= 85 ? 'bg-blue-600' :
                                'bg-yellow-600'
                              }`}
                              style={{ width: `${attack.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">攻击特征</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {`{
                            "attack_type": "${attack.type}",
                            "source_ip": "${attack.source}",
                            "target": "${attack.target}",
                            "timestamp": "${attack.time}",
                            "protocol": "TCP",
                            "port": 80,
                            "packet_count": ${Math.floor(Math.random() * 10000) + 1000},
                            "bytes": ${Math.floor(Math.random() * 100000000) + 1000000},
                            "duration": ${Math.floor(Math.random() * 300) + 10},
                            "features": {
                              "entropy": ${(Math.random() * 8 + 2).toFixed(2)},
                              "packet_size_mean": ${Math.floor(Math.random() * 1000) + 100},
                              "inter_arrival_time": ${(Math.random() * 0.1).toFixed(4)},
                              "flags": ["SYN", "ACK", "PSH"]
                            }
                          }`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">强化学习防御决策</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-blue-50 rounded-md">
                            <h5 className="text-xs font-medium text-blue-800 mb-1">状态空间</h5>
                            <p className="text-sm text-blue-800">流量特征、协议分布、目标服务</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-md">
                            <h5 className="text-xs font-medium text-green-800 mb-1">动作空间</h5>
                            <p className="text-sm text-green-800">阻止、重定向、限流、监控</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-md">
                            <h5 className="text-xs font-medium text-purple-800 mb-1">奖励函数</h5>
                            <p className="text-sm text-purple-800">服务可用性 + 攻击阻断率</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5 className="text-xs font-medium text-gray-700 mb-1">策略评估</h5>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs">阻止</span>
                              <span className="text-xs font-medium">{attack.type === 'DDoS攻击' ? '92%' : '78%'}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-600 h-1.5 rounded-full"
                                style={{ width: attack.type === 'DDoS攻击' ? '92%' : '78%' }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs">重定向</span>
                              <span className="text-xs font-medium">{attack.type === 'DDoS攻击' ? '95%' : '85%'}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-purple-600 h-1.5 rounded-full"
                                style={{ width: attack.type === 'DDoS攻击' ? '95%' : '85%' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      {attack.status !== 'blocked' && (
                        <button
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          onClick={() => {
                            handleBlock(attack.id);
                            setShowAttackDetails(false);
                          }}
                        >
                          拦截攻击
                        </button>
                      )}
                      {attack.status !== 'redirected' && (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          onClick={() => {
                            handleRedirect(attack.id);
                            setShowAttackDetails(false);
                          }}
                        >
                          重定向到蜜罐
                        </button>
                      )}
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        onClick={() => setShowAttackDetails(false)}
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>攻击日志</CardTitle>
              <div className="flex items-center gap-2">
                <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                  <option value="all">所有类型</option>
                  <option value="ddos">DDoS攻击</option>
                  <option value="sql">SQL注入</option>
                  <option value="xss">XSS攻击</option>
                </select>
                <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                  <option value="all">所有状态</option>
                  <option value="blocked">已阻止</option>
                  <option value="redirected">已重定向</option>
                  <option value="detected">已检测</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          时间
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          类型
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          来源
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          目标
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          严重程度
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attackData.map((attack) => (
                        <tr key={attack.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attack.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {attack.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attack.source}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attack.target}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(attack.severity)}`}>
                              {attack.severity === 'high' ? '高' : attack.severity === 'medium' ? '中' : '低'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(attack.status)}`}>
                              {getStatusText(attack.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                className="text-primary-600 hover:text-primary-900"
                                onClick={() => handleViewDetails(attack.id)}
                              >
                                详情
                              </button>
                              {attack.status !== 'blocked' && (
                                <button
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => handleBlock(attack.id)}
                                >
                                  拦截
                                </button>
                              )}
                              {attack.status !== 'redirected' && (
                                <button
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => handleRedirect(attack.id)}
                                >
                                  重定向
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>防御方法分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-md p-4 flex flex-col justify-center">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">RL-DDoS-Defender</span>
                      <span className="text-xs font-medium text-gray-700">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Honeypot-Redirector</span>
                      <span className="text-xs font-medium text-gray-700">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">RL-Traffic-Analyzer</span>
                      <span className="text-xs font-medium text-gray-700">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Pattern-Matcher</span>
                      <span className="text-xs font-medium text-gray-700">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-center text-gray-500">
                  基于强化学习的防御方法占比最高
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>蜜罐监控</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">蜜罐 1 (Web服务器)</h3>
                    <p className="text-xs text-gray-500">活跃连接: 12</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">活跃</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">蜜罐 2 (数据库)</h3>
                    <p className="text-xs text-gray-500">活跃连接: 8</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">活跃</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">蜜罐 3 (文件服务器)</h3>
                    <p className="text-xs text-gray-500">活跃连接: 5</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">活跃</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                </div>

                <button className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                  查看蜜罐详情
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
