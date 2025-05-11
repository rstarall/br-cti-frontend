'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DefenseData {
  sid_rev: string;
  src: string;
  dst: string;
  alarm: string;
  level: string;
  timestamp: string;
  defense_id: string[];
  other: {
    rule: string;
  };
}

export default function ActiveDefense() {
  const [defenseData, setDefenseData] = useState<DefenseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDefenseType, setActiveDefenseType] = useState('port'); // 'port', 'ip', 'traffic'
  const [isDefenseActive, setIsDefenseActive] = useState(false);
  const [selectedDefense, setSelectedDefense] = useState<number | null>(null);
  const [showDefenseDetails, setShowDefenseDetails] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [portHoppingInterval, setPortHoppingInterval] = useState(30); // seconds
  const [ipHoppingInterval, setIpHoppingInterval] = useState(60); // seconds
  const [trafficRedirectTarget, setTrafficRedirectTarget] = useState('honeypot-1');
  const [stats, setStats] = useState({
    totalAlerts: 0,
    portHopping: 0,
    ipHopping: 0,
    trafficRedirection: 0,
    activeDefenses: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const defenseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 模拟加载初始数据
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialData: DefenseData[] = [
        {
          sid_rev: "active_defense_subsystem",
          src: "10.2.87.12",
          dst: "10.10.128.23",
          alarm: "dos",
          level: "2",
          timestamp: "2024-5-18 15:12:18",
          defense_id: ["active_defense_subsystem_01"],
          other: {
            rule: "TCP"
          }
        },
        {
          sid_rev: "active_defense_subsystem",
          src: "10.2.87.45",
          dst: "10.10.128.56",
          alarm: "port_scan",
          level: "3",
          timestamp: "2024-5-18 15:10:05",
          defense_id: ["active_defense_subsystem_02"],
          other: {
            rule: "TCP"
          }
        },
        {
          sid_rev: "active_defense_subsystem",
          src: "10.2.88.78",
          dst: "10.10.129.90",
          alarm: "brute_force",
          level: "2",
          timestamp: "2024-5-18 15:08:32",
          defense_id: ["active_defense_subsystem_03"],
          other: {
            rule: "TCP"
          }
        },
        {
          sid_rev: "active_defense_subsystem",
          src: "10.2.89.34",
          dst: "10.10.130.45",
          alarm: "data_exfiltration",
          level: "3",
          timestamp: "2024-5-18 15:05:17",
          defense_id: ["active_defense_subsystem_01", "active_defense_subsystem_02"],
          other: {
            rule: "UDP"
          }
        },
        {
          sid_rev: "active_defense_subsystem",
          src: "10.2.90.56",
          dst: "10.10.131.67",
          alarm: "suspicious_traffic",
          level: "1",
          timestamp: "2024-5-18 15:02:45",
          defense_id: ["active_defense_subsystem_03"],
          other: {
            rule: "ICMP"
          }
        }
      ];

      setDefenseData(initialData);
      setStats({
        totalAlerts: initialData.length,
        portHopping: initialData.filter(d => d.defense_id.includes("active_defense_subsystem_01")).length,
        ipHopping: initialData.filter(d => d.defense_id.includes("active_defense_subsystem_02")).length,
        trafficRedirection: initialData.filter(d => d.defense_id.includes("active_defense_subsystem_03")).length,
        activeDefenses: initialData.filter(d => d.defense_id.length > 0).length
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 模拟实时防御数据更新
  useEffect(() => {
    if (!isLoading) {
      intervalRef.current = setInterval(() => {
        if (Math.random() > 0.7) { // 30% 概率生成新告警
          const alarmTypes = ['dos', 'port_scan', 'brute_force', 'data_exfiltration', 'suspicious_traffic'];
          const rules = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];
          const levels = ['1', '2', '3'];

          // 根据当前激活的防御类型选择防御ID
          let defenseIds: string[] = [];
          if (isDefenseActive) {
            if (activeDefenseType === 'port' || Math.random() > 0.7) {
              defenseIds.push("active_defense_subsystem_01");
            }
            if (activeDefenseType === 'ip' || Math.random() > 0.7) {
              defenseIds.push("active_defense_subsystem_02");
            }
            if (activeDefenseType === 'traffic' || Math.random() > 0.7) {
              defenseIds.push("active_defense_subsystem_03");
            }
          }

          const newDefense: DefenseData = {
            sid_rev: "active_defense_subsystem",
            src: `10.2.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            dst: `10.10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            alarm: alarmTypes[Math.floor(Math.random() * alarmTypes.length)],
            level: levels[Math.floor(Math.random() * levels.length)],
            timestamp: new Date().toLocaleString(),
            defense_id: defenseIds,
            other: {
              rule: rules[Math.floor(Math.random() * rules.length)]
            }
          };

          setDefenseData(prev => [newDefense, ...prev.slice(0, 19)]);

          // 更新统计数据
          setStats(prev => {
            const newStats = { ...prev, totalAlerts: prev.totalAlerts + 1 };
            if (newDefense.defense_id.includes("active_defense_subsystem_01")) newStats.portHopping += 1;
            if (newDefense.defense_id.includes("active_defense_subsystem_02")) newStats.ipHopping += 1;
            if (newDefense.defense_id.includes("active_defense_subsystem_03")) newStats.trafficRedirection += 1;
            if (newDefense.defense_id.length > 0) newStats.activeDefenses += 1;
            return newStats;
          });

          // 显示告警消息
          if (newDefense.level === '3') {
            setAlertMessage(`检测到高风险${getAlarmText(newDefense.alarm)}！来源: ${newDefense.src}, 目标: ${newDefense.dst}`);
            setTimeout(() => setAlertMessage(null), 5000);
          }
        }
      }, 8000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isLoading, isDefenseActive, activeDefenseType]);

  // 模拟主动防御操作
  useEffect(() => {
    if (isDefenseActive) {
      defenseIntervalRef.current = setInterval(() => {
        const defenseType = activeDefenseType;
        let message = '';

        switch (defenseType) {
          case 'port':
            message = `端口跳变防御执行成功，服务端口从 ${8000 + Math.floor(Math.random() * 1000)} 跳变到 ${8000 + Math.floor(Math.random() * 1000)}`;
            break;
          case 'ip':
            message = `IP跳变防御执行成功，服务IP从 10.10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)} 跳变到 10.10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            break;
          case 'traffic':
            message = `流量牵引防御执行成功，可疑流量已重定向至蜜罐 ${trafficRedirectTarget}`;
            break;
        }

        setAlertMessage(message);
        setTimeout(() => setAlertMessage(null), 3000);
      }, activeDefenseType === 'port' ? portHoppingInterval * 1000 :
         activeDefenseType === 'ip' ? ipHoppingInterval * 1000 : 10000);

      return () => {
        if (defenseIntervalRef.current) clearInterval(defenseIntervalRef.current);
      };
    }
  }, [isDefenseActive, activeDefenseType, portHoppingInterval, ipHoppingInterval, trafficRedirectTarget]);

  // 处理防御类型切换
  const handleDefenseTypeChange = (type: string) => {
    setActiveDefenseType(type);
    // 重启防御定时器
    if (defenseIntervalRef.current) {
      clearInterval(defenseIntervalRef.current);
      defenseIntervalRef.current = null;
    }

    if (isDefenseActive) {
      setAlertMessage(`已切换至${getDefenseTypeText(type)}防御模式`);
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  // 启动/停止防御
  const toggleDefense = () => {
    setIsDefenseActive(!isDefenseActive);
    setAlertMessage(isDefenseActive ? "已停止主动防御系统" : `已启动${getDefenseTypeText(activeDefenseType)}防御系统`);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // 手动执行防御
  const executeDefense = () => {
    let message = '';

    switch (activeDefenseType) {
      case 'port':
        message = `手动端口跳变防御执行成功，服务端口从 ${8000 + Math.floor(Math.random() * 1000)} 跳变到 ${8000 + Math.floor(Math.random() * 1000)}`;
        setStats(prev => ({ ...prev, portHopping: prev.portHopping + 1, activeDefenses: prev.activeDefenses + 1 }));
        break;
      case 'ip':
        message = `手动IP跳变防御执行成功，服务IP从 10.10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)} 跳变到 10.10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        setStats(prev => ({ ...prev, ipHopping: prev.ipHopping + 1, activeDefenses: prev.activeDefenses + 1 }));
        break;
      case 'traffic':
        message = `手动流量牵引防御执行成功，可疑流量已重定向至蜜罐 ${trafficRedirectTarget}`;
        setStats(prev => ({ ...prev, trafficRedirection: prev.trafficRedirection + 1, activeDefenses: prev.activeDefenses + 1 }));
        break;
    }

    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // 查看防御详情
  const handleViewDetails = (index: number) => {
    setSelectedDefense(index);
    setShowDefenseDetails(true);
  };

  // 获取告警文本
  const getAlarmText = (alarm: string) => {
    switch (alarm) {
      case 'dos': return 'DoS攻击';
      case 'port_scan': return '端口扫描';
      case 'brute_force': return '暴力破解';
      case 'data_exfiltration': return '数据泄露';
      case 'suspicious_traffic': return '可疑流量';
      default: return alarm;
    }
  };

  // 获取风险等级文本和样式
  const getLevelText = (level: string) => {
    switch (level) {
      case '1': return '低';
      case '2': return '中';
      case '3': return '高';
      default: return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case '1': return 'bg-blue-100 text-blue-800';
      case '2': return 'bg-yellow-100 text-yellow-800';
      case '3': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取防御类型文本
  const getDefenseTypeText = (type: string) => {
    switch (type) {
      case 'port': return '端口跳变';
      case 'ip': return 'IP跳变';
      case 'traffic': return '流量牵引';
      default: return type;
    }
  };

  // 获取防御ID文本
  const getDefenseIdText = (id: string) => {
    switch (id) {
      case 'active_defense_subsystem_01': return '端口跳变';
      case 'active_defense_subsystem_02': return 'IP跳变';
      case 'active_defense_subsystem_03': return '流量牵引';
      default: return id;
    }
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">未知风险主动防御</h2>

      {/* 告警消息 */}
      {alertMessage && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded relative">
          <strong className="font-bold">防御系统: </strong>
          <span className="block sm:inline">{alertMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setAlertMessage(null)}
          >
            <svg className="fill-current h-6 w-6 text-blue-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>关闭</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {/* 防御详情弹窗 */}
      {showDefenseDetails && selectedDefense !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  防御详情 #{selectedDefense + 1}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDefenseDetails(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {(() => {
                const defense = defenseData[selectedDefense];
                if (!defense) return <p>未找到防御数据</p>;

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">告警类型</h4>
                        <p className="text-lg font-medium">{getAlarmText(defense.alarm)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">时间</h4>
                        <p className="text-lg font-medium">{defense.timestamp}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">来源IP</h4>
                        <p className="text-lg font-medium">{defense.src}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">目标IP</h4>
                        <p className="text-lg font-medium">{defense.dst}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">风险等级</h4>
                        <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getLevelColor(defense.level)}`}>
                          {getLevelText(defense.level)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">协议</h4>
                        <p className="text-lg font-medium">{defense.other.rule}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">已应用防御措施</h4>
                      <div className="flex flex-wrap gap-2">
                        {defense.defense_id.length > 0 ? (
                          defense.defense_id.map((id, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              {getDefenseIdText(id)}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">未应用防御措施</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">防御详情</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
{`{
  "sid_rev": "${defense.sid_rev}",
  "src": "${defense.src}",
  "dst": "${defense.dst}",
  "alarm": "${defense.alarm}",
  "level": "${defense.level}",
  "timestamp": "${defense.timestamp}",
  "defense_id": ${JSON.stringify(defense.defense_id)},
  "other": {
    "rule": "${defense.other.rule}"
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">可用防御措施</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-3 ${defense.defense_id.includes("active_defense_subsystem_01") ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-800'} rounded-md`}>
                          <h5 className="text-xs font-medium mb-1">端口跳变</h5>
                          <p className="text-sm">动态改变服务端口，使攻击者无法锁定目标端口</p>
                        </div>
                        <div className={`p-3 ${defense.defense_id.includes("active_defense_subsystem_02") ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-800'} rounded-md`}>
                          <h5 className="text-xs font-medium mb-1">IP跳变</h5>
                          <p className="text-sm">动态改变服务IP地址，使攻击者无法锁定目标IP</p>
                        </div>
                        <div className={`p-3 ${defense.defense_id.includes("active_defense_subsystem_03") ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-800'} rounded-md`}>
                          <h5 className="text-xs font-medium mb-1">流量牵引</h5>
                          <p className="text-sm">将可疑流量重定向至蜜罐，保护真实服务</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      {!defense.defense_id.includes("active_defense_subsystem_01") && (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          onClick={() => {
                            setActiveDefenseType('port');
                            executeDefense();
                            setShowDefenseDetails(false);
                          }}
                        >
                          应用端口跳变
                        </button>
                      )}
                      {!defense.defense_id.includes("active_defense_subsystem_02") && (
                        <button
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                          onClick={() => {
                            setActiveDefenseType('ip');
                            executeDefense();
                            setShowDefenseDetails(false);
                          }}
                        >
                          应用IP跳变
                        </button>
                      )}
                      {!defense.defense_id.includes("active_defense_subsystem_03") && (
                        <button
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          onClick={() => {
                            setActiveDefenseType('traffic');
                            executeDefense();
                            setShowDefenseDetails(false);
                          }}
                        >
                          应用流量牵引
                        </button>
                      )}
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        onClick={() => setShowDefenseDetails(false)}
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

      {/* 控制面板 - 更紧凑的布局设计 */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="space-y-4">
          {/* 第一行：防御类型和操作按钮 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 防御类型 */}
            <div className="lg:col-span-2">
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                <h3 className="text-sm font-medium text-gray-800 mr-2 whitespace-nowrap">防御类型:</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeDefenseType === 'port' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handleDefenseTypeChange('port')}
                  >
                    端口跳变
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeDefenseType === 'ip' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handleDefenseTypeChange('ip')}
                  >
                    IP跳变
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeDefenseType === 'traffic' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handleDefenseTypeChange('traffic')}
                  >
                    流量牵引
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
                onClick={executeDefense}
              >
                手动执行
              </button>
            </div>
          </div>

          {/* 分隔线 */}
          <hr className="border-gray-200" />

          {/* 第二行：防御参数设置 */}
          <div>
            {activeDefenseType === 'port' && (
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                <h3 className="text-sm font-medium text-gray-800 mr-2 whitespace-nowrap">端口跳变间隔:</h3>
                <div className="relative w-32">
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={portHoppingInterval}
                    onChange={(e) => setPortHoppingInterval(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">秒</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">（5-300秒）</span>
              </div>
            )}

            {activeDefenseType === 'ip' && (
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                <h3 className="text-sm font-medium text-gray-800 mr-2 whitespace-nowrap">IP跳变间隔:</h3>
                <div className="relative w-32">
                  <input
                    type="number"
                    min="10"
                    max="600"
                    value={ipHoppingInterval}
                    onChange={(e) => setIpHoppingInterval(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">秒</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">（10-600秒）</span>
              </div>
            )}

            {activeDefenseType === 'traffic' && (
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                <h3 className="text-sm font-medium text-gray-800 mr-2 whitespace-nowrap">流量牵引目标:</h3>
                <div className="relative w-64">
                  <select
                    value={trafficRedirectTarget}
                    onChange={(e) => setTrafficRedirectTarget(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="honeypot-1">蜜罐 1 (Web服务器)</option>
                    <option value="honeypot-2">蜜罐 2 (数据库)</option>
                    <option value="honeypot-3">蜜罐 3 (文件服务器)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 防御状态信息 */}
          {isDefenseActive && (
            <div className="p-2 bg-blue-50 rounded-md text-xs text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>
                {activeDefenseType === 'port'
                  ? `端口跳变防御已激活，每 ${portHoppingInterval} 秒自动执行一次`
                  : activeDefenseType === 'ip'
                  ? `IP跳变防御已激活，每 ${ipHoppingInterval} 秒自动执行一次`
                  : `流量牵引防御已激活，可疑流量将被重定向至 ${trafficRedirectTarget}`}
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
                <h3 className="text-lg font-medium text-gray-900">{stats.totalAlerts}</h3>
                <p className="text-xs text-gray-500">总告警</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{stats.portHopping}</h3>
                <p className="text-xs text-gray-500">端口跳变</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{stats.ipHopping}</h3>
                <p className="text-xs text-gray-500">IP跳变</p>
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
                <h3 className="text-lg font-medium text-gray-900">{stats.trafficRedirection}</h3>
                <p className="text-xs text-gray-500">流量牵引</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-yellow-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{stats.activeDefenses}</h3>
                <p className="text-xs text-gray-500">总防御次数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 告警列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>告警列表</CardTitle>
          <div className="flex items-center gap-2">
            <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
              <option value="all">所有告警</option>
              <option value="dos">DoS攻击</option>
              <option value="port_scan">端口扫描</option>
              <option value="brute_force">暴力破解</option>
              <option value="data_exfiltration">数据泄露</option>
              <option value="suspicious_traffic">可疑流量</option>
            </select>
            <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
              <option value="all">所有等级</option>
              <option value="3">高风险</option>
              <option value="2">中风险</option>
              <option value="1">低风险</option>
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
                      告警类型
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      来源IP
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      目标IP
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      风险等级
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      防御措施
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {defenseData.map((defense, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {defense.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getAlarmText(defense.alarm)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {defense.src}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {defense.dst}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(defense.level)}`}>
                          {getLevelText(defense.level)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {defense.defense_id.length > 0 ? (
                            defense.defense_id.map((id, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs"
                              >
                                {getDefenseIdText(id)}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">未应用</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewDetails(index)}
                          >
                            详情
                          </button>
                          {defense.defense_id.length === 0 && (
                            <button
                              className="text-green-600 hover:text-green-900"
                              onClick={() => {
                                executeDefense();
                              }}
                            >
                              应用防御
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
  );
}
