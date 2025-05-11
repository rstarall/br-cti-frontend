import React, { useState } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocalMLStore } from '@/store/localMLStore';
import { useMessage } from '@/provider/MessageProvider';
import { UploadStep } from './steps/UploadStep';
import { TrainStep } from './steps/TrainStep';
import { EvaluateStep } from './steps/EvaluateStep';
import { UpchainStep } from './steps/UpchainStep';
import { ModelTable } from './ModelTable';

export function ModelProcess() {
  const [activeTab, setActiveTab] = useState('upload');
  const { tasks, updateTaskProgress, updateTaskActiveStep } = useLocalMLStore();
  const { messageApi } = useMessage();

  const handleNextStep = () => {
    // 获取当前选中的任务
    const selectedTask = tasks.length > 0 ? tasks[0] : null;

    // 更新当前步骤的进度为100%，表示已完成
    if (selectedTask && selectedTask.file_hash) {
      updateTaskProgress(selectedTask.file_hash, activeTab as any, 100);
    }

    if (activeTab === 'upload') {
      // 检查是否有已上传的文件
      const hasUploadedFiles = tasks.some(task => task.status.upload);
      if (hasUploadedFiles) {
        setActiveTab('train');
        // 更新所有已上传任务的活动步骤
        tasks.forEach(task => {
          if (task.status.upload) {
            updateTaskActiveStep(task.file_hash, 'train');
          }
        });
      } else {
        messageApi.warning('请先上传文件');
      }
    } else if (activeTab === 'train') {
      // 检查是否有已完成训练的文件
      const hasTrainedFiles = tasks.some(task => task.status.train);
      if (hasTrainedFiles) {
        setActiveTab('evaluate');
        // 更新所有已完成训练任务的活动步骤
        tasks.forEach(task => {
          if (task.status.train) {
            updateTaskActiveStep(task.file_hash, 'evaluate');
          }
        });
      } else {
        messageApi.warning('请先完成模型训练');
      }
    } else if (activeTab === 'evaluate') {
      // 检查是否有已完成评估的文件
      const hasEvaluatedFiles = tasks.some(task => task.status.evaluate);
      if (hasEvaluatedFiles) {
        setActiveTab('upchain');
        // 更新所有已完成评估任务的活动步骤
        tasks.forEach(task => {
          if (task.status.evaluate) {
            updateTaskActiveStep(task.file_hash, 'upchain');
          }
        });
      } else {
        messageApi.warning('请先完成模型评估');
      }
    }
  };

  const handlePrevStep = () => {
    if (activeTab === 'train') {
      setActiveTab('upload');
      // 更新所有任务的活动步骤
      tasks.forEach(task => {
        updateTaskActiveStep(task.file_hash, 'upload');
      });
    } else if (activeTab === 'evaluate') {
      setActiveTab('train');
      // 更新所有任务的活动步骤
      tasks.forEach(task => {
        updateTaskActiveStep(task.file_hash, 'train');
      });
    } else if (activeTab === 'upchain') {
      setActiveTab('evaluate');
      // 更新所有任务的活动步骤
      tasks.forEach(task => {
        updateTaskActiveStep(task.file_hash, 'evaluate');
      });
    }
  };

  const isNextStepEnabled = () => {
    if (activeTab === 'upload') {
      return tasks.some(task => task.status.upload);
    } else if (activeTab === 'train') {
      return tasks.some(task => task.status.train);
    } else if (activeTab === 'evaluate') {
      return tasks.some(task => task.status.evaluate);
    }
    return false;
  };

  const showPrevButton = () => {
    return activeTab !== 'upload';
  };

  // 任务步骤渲染函数
  const renderStepContent = () => {
    if (activeTab === 'upload') {
      return <UploadStep />;
    } else if (activeTab === 'train') {
      return <TrainStep />;
    } else if (activeTab === 'evaluate') {
      return <EvaluateStep />;
    } else if (activeTab === 'upchain') {
      return <UpchainStep />;
    }
    return null;
  };

  return (
    <div className="w-full bg-white">
      {/* 顶部工具栏 */}
      <div className="flex items-center h-12 border-b border-gray-200 px-4 bg-gray-50 shadow-sm">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handlePrevStep}
          disabled={!showPrevButton()}
          className="flex items-center px-2 py-1 text-gray-500 hover:text-blue-600 disabled:text-gray-300 bg-transparent border-none shadow-none text-base"
        >
          <span className="ml-1 text-xs font-medium align-middle">
            {activeTab === 'train' ? '数据集上传' :
             activeTab === 'evaluate' ? '模型训练' :
             activeTab === 'upchain' ? '模型评估' : ''}
          </span>
        </Button>

        {/* 步骤标题 */}
        <div className="flex-1 text-center font-medium text-blue-600">
          {activeTab === 'upload' ? '数据集上传' :
           activeTab === 'train' ? '模型训练' :
           activeTab === 'evaluate' ? '模型评估' :
           activeTab === 'upchain' ? '模型上链' : ''}
        </div>

        <Button
          type="primary"
          onClick={handleNextStep}
          disabled={!isNextStepEnabled()}
          className="h-7 px-5 rounded-md shadow-sm text-xs font-semibold flex items-center justify-center"
        >
          下一步
        </Button>
      </div>

      <div className="px-0 py-2">
        {/* 任务步骤内容 */}
        <div className="mb-4">
          {renderStepContent()}
        </div>

        {/* 模型列表表格 */}
        <ModelTable onUploadClick={() => setActiveTab('upload')} />
      </div>
    </div>
  );
}
