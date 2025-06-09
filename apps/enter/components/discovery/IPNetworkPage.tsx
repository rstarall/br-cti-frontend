'use client';

import React from 'react';
import { Card, Button, Form, Tabs, Image, InputNumber } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface IPNetworkPageProps {
  ipData: any;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (values: any) => Promise<void>;
}

export default function IPNetworkPage({ ipData, isLoading, onBack, onSubmit }: IPNetworkPageProps) {
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
        <h1 className="text-2xl font-bold text-gray-800">静态协同DDOS博弈</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：博弈分析 */}
        <Card title="博弈分析" className="h-fit">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">防御者之间构建静态过滤博弈</h4>

            {ipData?.images?.effect && (
              <div className="text-center">
                <Image
                  src={`data:image/png;base64,${ipData.images.effect}`}
                  alt="效果对比图"
                  width="100%"
                  style={{ maxWidth: '500px' }}
                />
                <p className="mt-2 text-lg font-medium text-green-600">
                  防御成本下降 {ipData.reduce}%
                </p>
              </div>
            )}

            {!ipData && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">请设置DDoS流量参数以查看博弈分析结果</p>
              </div>
            )}

            <h4 className="font-semibold text-gray-700">防御者得出均衡过滤策略提高整体收益</h4>
          </div>
        </Card>

        {/* 右侧：策略展示 */}
        <Card title="策略展示" className="h-fit">
          <Tabs defaultActiveKey="defenderA" className="min-h-96">
            <Tabs.TabPane tab="防御者A" key="defenderA">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">IP网络防御者A</h3>
                {ipData ? (
                  <>
                    <p>DDoS流量: {ipData.input1}</p>
                    <p>选择与各个防御者和云协同过滤</p>
                    {ipData.images?.strategy1 && (
                      <Image
                        src={`data:image/png;base64,${ipData.images.strategy1}`}
                        alt="防御者A策略图"
                        width="100%"
                        style={{ maxWidth: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">请先设置流量参数</p>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="防御者B" key="defenderB">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">IP网络防御者B</h3>
                {ipData ? (
                  <>
                    <p>DDoS流量: {ipData.input2}</p>
                    <p>选择与各个防御者和云协同过滤</p>
                    {ipData.images?.strategy2 && (
                      <Image
                        src={`data:image/png;base64,${ipData.images.strategy2}`}
                        alt="防御者B策略图"
                        width="100%"
                        style={{ maxWidth: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">请先设置流量参数</p>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="防御者C" key="defenderC">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">IP网络防御者C</h3>
                {ipData ? (
                  <>
                    <p>DDoS流量: {ipData.input3}</p>
                    <p>选择与各个防御者和云协同过滤</p>
                    {ipData.images?.strategy3 && (
                      <Image
                        src={`data:image/png;base64,${ipData.images.strategy3}`}
                        alt="防御者C策略图"
                        width="100%"
                        style={{ maxWidth: '400px' }}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">请先设置流量参数</p>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="DDoS流量设置" key="settings">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ input1: 20000, input2: 25000, input3: 30000 }}
              >
                <Form.Item
                  label="防御者A流量"
                  name="input1"
                  rules={[{ required: true, message: '请输入防御者A流量' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="请输入防御者A的DDoS流量"
                  />
                </Form.Item>

                <Form.Item
                  label="防御者B流量"
                  name="input2"
                  rules={[{ required: true, message: '请输入防御者B流量' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="请输入防御者B的DDoS流量"
                  />
                </Form.Item>

                <Form.Item
                  label="防御者C流量"
                  name="input3"
                  rules={[{ required: true, message: '请输入防御者C流量' }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    placeholder="请输入防御者C的DDoS流量"
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
