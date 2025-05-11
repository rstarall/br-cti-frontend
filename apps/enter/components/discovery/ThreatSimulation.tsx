'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ThreatSimulation() {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<null | {
    vulnerabilities: number;
    criticalIssues: number;
    mediumIssues: number;
    lowIssues: number;
  }>(null);

  const startSimulation = () => {
    setSimulationRunning(true);
    setProgress(0);
    setResults(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulationRunning(false);
          setResults({
            vulnerabilities: 12,
            criticalIssues: 3,
            mediumIssues: 5,
            lowIssues: 4
          });
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">威胁模拟</h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>模拟配置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目标范围</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>全部系统</option>
                <option>网络边界</option>
                <option>内部网络</option>
                <option>Web应用</option>
                <option>数据库系统</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">攻击类型</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>综合攻击</option>
                <option>网络渗透</option>
                <option>社会工程学</option>
                <option>拒绝服务</option>
                <option>数据泄露</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">攻击强度</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>低（仅探测）</option>
                <option>中（有限攻击）</option>
                <option selected>高（全面攻击）</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">模拟持续时间</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>快速（5分钟）</option>
                <option selected>标准（15分钟）</option>
                <option>深度（30分钟）</option>
                <option>全面（60分钟）</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              className={`px-4 py-2 rounded-md text-white ${
                simulationRunning 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
              onClick={startSimulation}
              disabled={simulationRunning}
            >
              {simulationRunning ? '模拟进行中...' : '开始模拟'}
            </button>
          </div>
        </CardContent>
      </Card>
      
      {simulationRunning && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>模拟进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium text-gray-700">进度</span>
              <span className="text-sm font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-500">网络扫描</p>
                <p className="font-medium">{progress > 20 ? '完成' : '进行中'}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-500">漏洞识别</p>
                <p className="font-medium">{progress > 50 ? '完成' : progress > 20 ? '进行中' : '等待中'}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-500">攻击模拟</p>
                <p className="font-medium">{progress > 80 ? '完成' : progress > 50 ? '进行中' : '等待中'}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-500">报告生成</p>
                <p className="font-medium">{progress === 100 ? '完成' : progress > 80 ? '进行中' : '等待中'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {results && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>模拟结果摘要</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-2xl font-bold text-red-600">{results.vulnerabilities}</p>
                  <p className="text-sm text-gray-700">发现漏洞</p>
                </div>
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-2xl font-bold text-red-600">{results.criticalIssues}</p>
                  <p className="text-sm text-gray-700">严重问题</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-md">
                  <p className="text-2xl font-bold text-orange-500">{results.mediumIssues}</p>
                  <p className="text-sm text-gray-700">中等问题</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-2xl font-bold text-yellow-500">{results.lowIssues}</p>
                  <p className="text-sm text-gray-700">低危问题</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>关键发现</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-800 rounded-full mr-2 flex-shrink-0">!</span>
                    <span className="text-sm">发现未修补的远程代码执行漏洞（CVE-2023-1234）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-800 rounded-full mr-2 flex-shrink-0">!</span>
                    <span className="text-sm">Web应用存在SQL注入漏洞，可能导致数据泄露</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 text-orange-800 rounded-full mr-2 flex-shrink-0">!</span>
                    <span className="text-sm">发现弱密码策略，多个账户使用简单密码</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 text-orange-800 rounded-full mr-2 flex-shrink-0">!</span>
                    <span className="text-sm">内部网络分段不足，横向移动风险高</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-100 text-yellow-800 rounded-full mr-2 flex-shrink-0">!</span>
                    <span className="text-sm">SSL/TLS配置不安全，使用过时的加密算法</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>建议修复措施</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-100 text-primary-800 rounded-full mr-2 flex-shrink-0">1</span>
                    <span className="text-sm">立即更新所有系统到最新补丁版本</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-100 text-primary-800 rounded-full mr-2 flex-shrink-0">2</span>
                    <span className="text-sm">实施Web应用防火墙，防止SQL注入攻击</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-100 text-primary-800 rounded-full mr-2 flex-shrink-0">3</span>
                    <span className="text-sm">强制实施强密码策略，并启用多因素认证</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-100 text-primary-800 rounded-full mr-2 flex-shrink-0">4</span>
                    <span className="text-sm">改进网络分段，限制内部系统间的不必要访问</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-100 text-primary-800 rounded-full mr-2 flex-shrink-0">5</span>
                    <span className="text-sm">更新SSL/TLS配置，禁用不安全的加密算法</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
