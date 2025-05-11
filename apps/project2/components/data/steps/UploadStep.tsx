import React from 'react';
import { Upload, UploadFile } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import { useDataStore } from '@/store/dataStore';
import { useDataProcessActions } from '@/hooks/localData/useDataProcess';
import { useMessage } from '@/provider/MessageProvider';

interface UploadStepProps {
  fileHash: string;
  status: {
    upload: boolean;
  };
  setFileHash: (hash: string) => void;
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
}

export function UploadStep({ status, setFileHash, fileList, setFileList }: UploadStepProps) {
  const { addOrUpdateTask, updateTaskProgress, setTaskUploadError } = useDataStore();
  const { uploadAndAddTask } = useDataProcessActions();
  const { messageApi } = useMessage();

  // 如果已经上传了文件，显示上传成功的信息
  if (status.upload) {
    return (
      <div className="text-center text-gray-500">
        文件已成功上传，可以进行下一步操作
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Upload.Dragger
        multiple
        accept=".xlsx,.csv,.txt"
        className="w-full rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 flex flex-col items-center justify-center transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50"
        customRequest={async ({ file, onSuccess, onError, onProgress }) => {
          // 生成唯一 task_id
          const taskId = Date.now() + Math.random().toString(36).slice(2, 8);

          try {
            // 添加初始任务状态
            addOrUpdateTask({
              file_id: taskId,
              file_hash: '',
              file_name: (file as File).name,
              file_size: (file as File).size + 'B',
              progress: {
                upload: 0,
                stix: 0,
                cti: 0,
                upchain: 0,
                current: 0
              },
              activeStep: 'upload',
              uploading: true,
              status: { upload: false, stix: false, cti: false, upchain: false }
            });

            // 直接设置初始进度为10%，确保能看到进度条
            updateTaskProgress(taskId, 'upload', 10);

            // 模拟进度 - 使用固定的进度点
            const progressPoints = [10, 25, 40, 55, 70, 85, 90];
            let progressIndex = 0;

            const interval = setInterval(() => {
              if (progressIndex < progressPoints.length) {
                const currentProgress = progressPoints[progressIndex];

                if (onProgress) {
                  onProgress({ percent: currentProgress });
                }

                // 更新任务进度
                updateTaskProgress(taskId, 'upload', currentProgress);

                // 增加索引
                progressIndex++;
              } else {
                clearInterval(interval);
              }
            }, 800); // 更长的间隔，便于观察

            // 准备表单数据
            const formData = new FormData();
            formData.append('file', file as File);
            formData.append('task_id', taskId);

            // 执行上传
            const result = await uploadAndAddTask(formData, taskId);

            // 清除进度模拟
            clearInterval(interval);
            updateTaskProgress(taskId, 'upload', 100);

            // 处理结果
            if (result?.file_hash) {
              // 更新文件哈希
              setFileHash(result.file_hash);

              // 通知上传组件成功
              if (onSuccess) {
                onSuccess({}, file);
              }

              messageApi.success('文件上传成功');
            } else {
              // 处理上传失败
              setTaskUploadError(taskId, '上传失败：未获取到文件哈希');
              messageApi.error('上传失败：未获取到文件哈希');

              if (onError) {
                onError(new Error('上传失败：未获取到文件哈希'));
              }
            }
          } catch (e: any) {
            // 错误处理
            updateTaskProgress(taskId, 'upload', 100);
            setTaskUploadError(taskId, e.message || '文件上传失败');

            if (onError) {
              onError(e);
            }

            messageApi.error(e.message || '文件上传失败');
          }
        }}
        onChange={({ fileList }) => {
          setFileList(fileList);
        }}
        fileList={fileList}
      >
        <div className="flex flex-col items-center justify-center p-8">
          <span className="text-3xl text-blue-500 mb-2"><FileOutlined /></span>
          <span className="text-base font-medium text-blue-700 mb-1">拖拽或添加文件上传</span>
          <span className="text-xs text-gray-500">支持格式: xlsx, csv, txt</span>
        </div>
      </Upload.Dragger>
    </div>
  );
}
