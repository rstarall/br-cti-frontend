import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useDataStore } from '@/store/dataStore';
import type { UploadFile } from 'antd/es/upload/interface';
import { useDataProcessActions } from '@/hooks/localData/useDataProcess';
import { useMessage } from '@/provider/MessageProvider';
import { DataTable } from './DataTable';
import { TaskCard } from './TaskCard';
import { UploadStep, StixProcessStep, CtiProcessStep, UpchainStep } from './steps';

export function DataProcess() {
  const [activeTab, setActiveTab] = useState('upload');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [fileHash, setFileHash] = useState<string>('');
  const { tasks, updateTaskProgress, updateTaskActiveStep } = useDataStore();
  const { removeTask } = useDataProcessActions();
  const { messageApi } = useMessage();

  const handleNextStep = () => {
    // 获取当前选中的文件哈希
    const selectedTask = tasks.find(task => task.file_hash === fileHash);

    // 更新当前步骤的进度为100%，表示已完成
    if (selectedTask && selectedTask.file_hash) {
      updateTaskProgress(selectedTask.file_hash, activeTab as any, 100);
    }

    if (activeTab === 'upload') {
      // 检查是否有已上传的文件
      const hasUploadedFiles = tasks.some(task => task.status.upload);
      if (hasUploadedFiles) {
        setActiveTab('stix');
        // 更新所有已上传任务的活动步骤
        tasks.forEach(task => {
          if (task.status.upload) {
            updateTaskActiveStep(task.file_hash, 'stix');
          }
        });
      } else {
        messageApi.warning('请先上传文件');
      }
    } else if (activeTab === 'stix') {
      // 检查是否有已完成STIX转换的文件
      const hasStixProcessedFiles = tasks.some(task => task.status.stix);
      if (hasStixProcessedFiles) {
        setActiveTab('cti');
        // 更新所有已完成STIX转换任务的活动步骤
        tasks.forEach(task => {
          if (task.status.stix) {
            updateTaskActiveStep(task.file_hash, 'cti');
          }
        });
      } else {
        messageApi.warning('请先完成STIX转换');
      }
    } else if (activeTab === 'cti') {
      // 检查是否有已完成CTI转换的文件
      const hasCtiProcessedFiles = tasks.some(task => task.status.cti);
      if (hasCtiProcessedFiles) {
        setActiveTab('upchain');
        // 更新所有已完成CTI转换任务的活动步骤
        tasks.forEach(task => {
          if (task.status.cti) {
            updateTaskActiveStep(task.file_hash, 'upchain');
          }
        });
      } else {
        messageApi.warning('请先完成CTI转换');
      }
    }
  };

  const handlePrevStep = () => {
    if (activeTab === 'stix') {
      setActiveTab('upload');
      // 更新所有任务的活动步骤
      tasks.forEach(task => {
        updateTaskActiveStep(task.file_hash, 'upload');
      });
    } else if (activeTab === 'cti') {
      setActiveTab('stix');
      // 更新所有任务的活动步骤
      tasks.forEach(task => {
        updateTaskActiveStep(task.file_hash, 'stix');
      });
    } else if (activeTab === 'upchain') {
      setActiveTab('cti');
      // 更新所有任务的活动步骤
      tasks.forEach(task => {
        updateTaskActiveStep(task.file_hash, 'cti');
      });
    }
  };

  const isNextStepEnabled = () => {
    if (activeTab === 'upload') {
      return tasks.some(task => task.status.upload);
    } else if (activeTab === 'stix') {
      return tasks.some(task => task.status.stix);
    } else if (activeTab === 'cti') {
      return tasks.some(task => task.status.cti);
    }
    return false;
  };

  const showPrevButton = () => {
    return activeTab !== 'upload';
  };

  // 任务卡片渲染函数
  const renderTaskCards = () => {
    return tasks.length > 0 && tasks.map(task => {
      // 确保任务有活动步骤
      const taskActiveStep = task.activeStep || activeTab as 'upload' | 'stix' | 'cti' | 'upchain';

      // 确保进度对象格式正确
      const taskProgress = task.progress && typeof task.progress === 'object'
        ? task.progress
        : { upload: 0, stix: 0, cti: 0, upchain: 0, current: 0 };

      // 渲染当前步骤的内容
      const renderStepContent = () => {
        if (taskActiveStep === 'upload') {
          return (
            <UploadStep
              fileHash={task.file_hash}
              status={task.status}
              setFileHash={setFileHash}
              fileList={fileList}
              setFileList={setFileList}
            />
          );
        } else if (taskActiveStep === 'stix') {
          return (
            <StixProcessStep
              fileHash={task.file_hash}
              status={task.status}
              form={form}
            />
          );
        } else if (taskActiveStep === 'cti') {
          return (
            <CtiProcessStep
              fileHash={task.file_hash}
              status={task.status}
              form={form}
            />
          );
        } else if (taskActiveStep === 'upchain') {
          return (
            <UpchainStep
              fileHash={task.file_hash}
              status={task.status}
              form={form}
            />
          );
        }

        return null;
      };

      return (
        <TaskCard
          key={task.file_id || task.file_hash}
          fileName={task.file_name || task.file_id}
          fileHash={task.file_hash}
          fileSize={task.file_size || '-'}
          status={task.status}
          progress={taskProgress}
          activeStep={taskActiveStep}
          uploadError={task.uploadError}
          showDelete={taskActiveStep === 'upload' && task.status.upload}
          onDelete={() => removeTask(task.file_hash)}
        >
          {renderStepContent()}
        </TaskCard>
      );
    });
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
            {activeTab === 'stix' ? '文件上传' :
             activeTab === 'cti' ? 'STIX转换' :
             activeTab === 'upchain' ? 'CTI转换' : ''}
          </span>
        </Button>

        {/* 步骤标题 */}
        <div className="flex-1 text-center font-medium text-blue-600">
          {activeTab === 'upload' ? '文件上传' :
           activeTab === 'stix' ? 'STIX转换' :
           activeTab === 'cti' ? 'CTI转换' :
           activeTab === 'upchain' ? '上链处理' : ''}
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
        {/* 任务卡片 */}
        <div className="mb-4">

          {tasks.length > 0 ? (
            renderTaskCards()
          ) : (
            // 如果没有任务，显示上传组件
            <UploadStep
              fileHash=""
              status={{ upload: false }}
              setFileHash={setFileHash}
              fileList={fileList}
              setFileList={setFileList}
            />
          )}
        </div>

        <DataTable />
      </div>
    </div>
  );
}
