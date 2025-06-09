'use client';

import React from 'react';
import { Card, Button, Form, Tabs, Image, InputNumber } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface FiveGNetworkPageProps {
  fiveGData: any;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (values: any) => Promise<void>;
}

export default function FiveGNetworkPage({ fiveGData, isLoading, onBack, onSubmit }: FiveGNetworkPageProps) {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    await onSubmit(values);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* 导航栏 */}
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="mr-4"
        >
          返回网络选择
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">DDoS攻防动态Stackelberg博弈</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：博弈分析 */}
        <Card title="博弈分析" className="h-fit">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">防御者选择协同博弈决定防御策略</h4>
            <h4 className="font-semibold text-gray-700">攻击者观察防御者策略选择进攻策略</h4>

            {fiveGData?.images?.effect && (
              <div className="text-center">
                <Image
                  src={`data:image/png;base64,${fiveGData.images.effect}`}
                  alt="效果对比图"
                  width="100%"
                  style={{ maxWidth: '480px' }}
                />
                <p className="mt-2 text-lg font-medium text-green-600">
                  防御成本下降 {fiveGData.reduce}%
                </p>
              </div>
            )}

            {!fiveGData && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">请设置攻击者预算参数以查看博弈分析结果</p>
              </div>
            )}

            <h4 className="font-semibold text-gray-700">防御者选择协同，攻击者被迫选择分散攻击，使得进攻者收益下降，防御收益变高</h4>
          </div>
        </Card>

        {/* 右侧：策略展示 */}
        <Card title="策略展示" className="h-fit">
          <Tabs defaultActiveKey="attacker" className="min-h-96">
            <Tabs.TabPane tab="DDoS进攻者" key="attacker">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">DDoS进攻者</h3>
                {fiveGData ? (
                  <>
                    <p>DDoS流量预算: {fiveGData.budget}</p>
                    <p>DDoS攻击者选择分散进攻各个防御者</p>
                    {fiveGData.images?.attacker && (
                      <Image
                        src={`data:image/png;base64,${fiveGData.images.attacker}`}
                        alt="攻击者策略图"
                        width="100%"
                        style={{ maxWidth: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">请先设置攻击者预算</p>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="防御者A" key="defenderA">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">5G网络防御者A</h3>
                {fiveGData ? (
                  <>
                    <p>总流量: {fiveGData.atrategy1}</p>
                    <p>选择与各个防御者和云协同过滤</p>
                    {fiveGData.images?.strategy1 && (
                      <Image
                        src={`data:image/png;base64,${fiveGData.images.strategy1}`}
                        alt="防御者A策略图"
                        width="100%"
                        style={{ maxWidth: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">请先设置攻击者预算</p>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="防御者B" key="defenderB">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">5G网络防御者B</h3>
                {fiveGData ? (
                  <>
                    <p>总流量: {fiveGData.atrategy2}</p>
                    <p>选择与各个防御者和云协同过滤</p>
                    {fiveGData.images?.strategy2 && (
                      <Image
                        src={`data:image/png;base64,${fiveGData.images.strategy2}`}
                        alt="防御者B策略图"
                        width="100%"
                        style={{ maxWidth: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">请先设置攻击者预算</p>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="防御者C" key="defenderC">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">5G网络防御者C</h3>
                {fiveGData ? (
                  <>
                    <p>总流量: {fiveGData.atrategy3}</p>
                    <p>选择与各个防御者和云协同过滤</p>
                    {fiveGData.images?.strategy3 && (
                      <Image
                        src={`data:image/png;base64,${fiveGData.images.strategy3}`}
                        alt="防御者C策略图"
                        width="100%"
                        style={{ maxWidth: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">请先设置攻击者预算</p>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="攻击者预算设置" key="settings">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ budget: 150000 }}
              >
                <Form.Item
                  label="进攻者预算"
                  name="budget"
                  rules={[{ required: true, message: '请输入进攻者预算' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="请输入进攻者的DDoS流量预算"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isLoading} className="w-full">
                    计算策略
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
