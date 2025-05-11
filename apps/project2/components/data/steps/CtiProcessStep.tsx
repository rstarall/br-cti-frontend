import React from 'react';
import { Form, Card, Button, Select, Input, FormInstance } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useCtiProcess } from '@/hooks/localData/useCtiProcess';
import { useMessage } from '@/provider/MessageProvider';
import { ProcessCTIConfig } from '@/api/types/localData';
import { localDataApi } from '@/api/localData';

const { TextArea } = Input;

interface CtiProcessStepProps {
  fileHash: string;
  status: {
    stix: boolean;
    cti: boolean;
  };
  form: FormInstance;
}

export function CtiProcessStep({ fileHash, status, form }: CtiProcessStepProps) {
  const { processStixToCTI } = useCtiProcess();
  const { messageApi } = useMessage();

  const handleCtiConversion = async () => {
    try {
      // 验证表单
      const values = await form.validateFields();

      // 验证必填字段
      if (values.cti_type === undefined || values.cti_type === null) {
        messageApi.error('请选择情报类型');
        return;
      }
      if (!values.cti_name) {
        messageApi.error('请输入CTI名称');
        return;
      }
      if (values.incentive_mechanism === undefined || values.incentive_mechanism === null) {
        messageApi.error('请选择激励机制');
        return;
      }

      // 确保类型正确
      const ctiType = typeof values.cti_type === 'number' ? values.cti_type : parseInt(values.cti_type);
      const incentiveMechanism = typeof values.incentive_mechanism === 'number' ? values.incentive_mechanism : parseInt(values.incentive_mechanism);

      if (isNaN(ctiType)) {
        messageApi.error('情报类型格式错误');
        return;
      }

      if (isNaN(incentiveMechanism)) {
        messageApi.error('激励机制格式错误');
        return;
      }

      // 构建配置
      const config: ProcessCTIConfig = {
        process_id: Date.now().toString(),
        file_hash: fileHash,
        cti_type: ctiType,
        open_source: values.open_source || '0',
        cti_name: values.cti_name,
        cti_description: values.cti_description || '',
        incentive_mechanism: incentiveMechanism,
        default_value: parseFloat(values.default_value) || 0
      };

      // 开始处理前显示加载状态
      messageApi.loading('处理CTI转换...');

      // 调用处理函数（带进度轮询）
      await processStixToCTI(config);
      // 不需要在这里更新任务状态，轮询会自动更新
      // 轮询完成后会自动将状态设置为完成
    } catch (e: any) {
      messageApi.error(e.message || 'CTI转换失败');
    }
  };

  const handleGetDefaultPoints = async () => {
    const values = await form.validateFields(['cti_type', 'incentive_mechanism']);
    if (values.cti_type === undefined || values.cti_type === null ||
        values.incentive_mechanism === undefined || values.incentive_mechanism === null) {
      messageApi.error('请先选择情报类型和激励机制');
      return;
    }

    // 确保类型正确
    const ctiType = typeof values.cti_type === 'number' ? values.cti_type : parseInt(values.cti_type);
    const incentiveMechanism = typeof values.incentive_mechanism === 'number' ? values.incentive_mechanism : parseInt(values.incentive_mechanism);

    if (isNaN(ctiType) || isNaN(incentiveMechanism)) {
      messageApi.error('类型格式错误');
      return;
    }

    try {
      const response = await localDataApi.getDefaultPoints({
        cti_type: ctiType,
        incentive_mechanism: incentiveMechanism
      });
      if (response.code === 200) {
        form.setFieldsValue({
          default_value: response.data.points
        });
        messageApi.success('获取默认积分成功');
      } else {
        messageApi.error(response.error || '获取默认积分失败');
      }
    } catch (e: any) {
      messageApi.error(e.message || '获取默认积分失败');
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Card
        title={<span className="text-lg font-semibold">CTI转换配置</span>}
        className="mb-4 rounded-lg shadow bg-white border border-gray-100 p-6"
        extra={
          !status.cti && (
            <Button
              type="primary"
              onClick={handleCtiConversion}
              disabled={!status.stix}
            >
              开始转换
            </Button>
          )
        }
      >
        <Form.Item label={<span className="font-medium">情报类型</span>} name="cti_type" className="mb-4">
          <Select  className="w-full">
            <Select.Option value={1}>恶意流量</Select.Option>
            <Select.Option value={2}>蜜罐情报</Select.Option>
            <Select.Option value={3}>僵尸网络</Select.Option>
            <Select.Option value={4}>应用层攻击</Select.Option>
            <Select.Option value={5}>开源情报</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={<span className="font-medium">开源类型</span>} name="open_source" className="mb-4">
          <Select className="w-full">
            <Select.Option value="1">是</Select.Option>
            <Select.Option value="0">否</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={<span className="font-medium">Tags</span>} name="cti_tags" className="mb-4">
          <Select mode="multiple" className="w-full">
            <Select.Option value="honeypot">蜜罐情报</Select.Option>
            <Select.Option value="satellite">卫星网络</Select.Option>
            <Select.Option value="sdn">SDN网络</Select.Option>
            <Select.Option value="5g">5G网络</Select.Option>
            <Select.Option value="malware">恶意软件</Select.Option>
            <Select.Option value="ddos">DDoS</Select.Option>
            <Select.Option value="phishing">钓鱼</Select.Option>
            <Select.Option value="botnet">僵尸网络</Select.Option>
            <Select.Option value="other">其他</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={<span className="font-medium">CTI名称</span>} name="cti_name" className="mb-4">
          <Input className="w-full" />
        </Form.Item>
        <Form.Item label={<span className="font-medium">情报描述</span>} name="cti_description" className="mb-4">
          <TextArea rows={4} className="w-full" />
        </Form.Item>
        <Form.Item label={<span className="font-medium">激励机制</span>} name="incentive_mechanism" className="mb-4">
          <Select className="w-full">
            <Select.Option value="1">积分激励</Select.Option>
            <Select.Option value="2">三方博弈</Select.Option>
            <Select.Option value="3">演化博弈</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={<span className="font-medium">默认积分</span>} className="mb-4">
          <div className="flex w-full">
            <Form.Item name="default_value" noStyle>
              <Input type="number" className="flex-1" />
            </Form.Item>
            <Button
              icon={<LeftOutlined />}
              onClick={handleGetDefaultPoints}
              className="ml-1"
            />
          </div>
        </Form.Item>
      </Card>
    </Form>
  );
}
