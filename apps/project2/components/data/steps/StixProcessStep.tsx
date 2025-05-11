import React, { useState, useEffect } from 'react';
import { Form, Card, Button, Select, Input, FormInstance } from 'antd';
import { useStixProcess, StixProcessConfig } from '@/hooks/localData/useStixProcess';
import { useDataStore } from '@/store/dataStore';
import { useMessage } from '@/provider/MessageProvider';

interface StixProcessStepProps {
  fileHash: string;
  status: {
    upload: boolean;
    stix: boolean;
  };
  form: FormInstance;
}

export function StixProcessStep({ fileHash, status, form }: StixProcessStepProps) {
  const { startStixProcess, getTrafficFeatures } = useStixProcess();
  const [stixLabelList, setStixLabelList] = useState<string[]>([]);
  const { updateTaskStatus } = useDataStore();
  const { messageApi } = useMessage();

  const handleStixConversion = async () => {
    try {
      // 验证表单
      const values = await form.validateFields();

      // 验证必填字段
      if (!values.stix_type) {
        messageApi.error('请选择情报类型');
        return;
      }

      // 构建配置
      const config: StixProcessConfig = {
        process_id: Date.now().toString(),
        file_hash: fileHash,
        stix_type: parseInt(values.stix_type),
        stix_traffic_features: values.traffic_feature_field || '',
        stix_iocs: values.stix_iocs || [],
        stix_label: values.stix_label || [],
        stix_compress: parseInt(values.stix_compress) || 1
      };

      // 开始处理前显示加载状态
      messageApi.loading('正在处理STIX转换...');

      // 调用处理函数
      const result = await startStixProcess(config);

      if (result) {
        // 更新任务状态
        updateTaskStatus(fileHash, 'stix', true);
      } else {
        messageApi.error('STIX转换失败');
      }
    } catch (e: any) {
      messageApi.error(e.message || 'STIX转换失败');
    }
  };

  const processTrafficLabels = (features_string: string) => {
    const features_list = features_string.split(';');
    setStixLabelList(features_list);
  };  

  const handleGetTrafficFeatures = async () => {
    try {
      const features = await getTrafficFeatures(fileHash);
      form.setFieldsValue({
        traffic_feature_field: features
      });
      processTrafficLabels(features);
      messageApi.success('获取特征字段成功');
    } catch (e: any) {
      messageApi.error(e.message || '获取特征字段失败');
    }
  };

  useEffect(() => {
    if (stixLabelList.includes('attack')) {
      form.setFieldsValue({ stix_label: 'attack' });
    } else if (stixLabelList.includes('label')) {
      form.setFieldsValue({ stix_label: 'label' });
    } else if (stixLabelList.length > 0) {
      form.setFieldsValue({ stix_label: stixLabelList[0] });
    }
  }, [stixLabelList, form]);

  return (
    <Form form={form} layout="vertical">
      <Card
        title={<span className="text-lg font-semibold">STIX转换配置</span>}
        className="mb-4 rounded-lg shadow bg-white border border-gray-100 p-3"
        extra={
          !status.stix && (
            <Button
              type="primary"
              onClick={handleStixConversion}
              disabled={!status.upload}
            >
              开始转换
            </Button>
          )
        }
      >
        <Form.Item label={<span className="font-medium">情报类型</span>} name="stix_type" className="mb-4">
          <Select  className="w-full">
            <Select.Option value="1">恶意流量</Select.Option>
            <Select.Option value="2">蜜罐情报</Select.Option>
            <Select.Option value="3">僵尸网络</Select.Option>
            <Select.Option value="4">应用层攻击</Select.Option>
            <Select.Option value="5">开源情报</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="特征字段">
          <div className="flex w-full gap-2">
            <Form.Item name="traffic_feature_field" className="flex-1 mb-0">
              <Input />
            </Form.Item>
            <Button onClick={handleGetTrafficFeatures}>获取特征字段</Button>
          </div>
        </Form.Item>
        <Form.Item label={<span className="font-medium">分类标签</span>} name="stix_label" className="mb-4">
          <Select  className="w-full">
            {
              stixLabelList.map((label) => (
                <Select.Option key={label} value={label}>
                  {label}
                </Select.Option>
              ))
            }   
          </Select>
        </Form.Item>
        <Form.Item label={<span className="font-medium">提取IOCs</span>} name="stix_iocs" className="mb-4">
          <Select mode="multiple" className="w-full">
            <Select.Option value="ip">IP</Select.Option>
            <Select.Option value="port">端口</Select.Option>
            <Select.Option value="payload">Payload</Select.Option>
            <Select.Option value="hash">HASH</Select.Option>
            <Select.Option value="url">URL</Select.Option>
            <Select.Option value="flow_feature">流特征</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={<span className="font-medium">数据压缩</span>} name="stix_compress" className="mb-4">
          <Select defaultValue="1" className="w-full">
            <Select.Option value="1">1条</Select.Option>
            <Select.Option value="100">100条</Select.Option>
            <Select.Option value="500">500条</Select.Option>
            <Select.Option value="1000">1000条</Select.Option>
          </Select>
        </Form.Item>
      </Card>
    </Form>
  );
}

