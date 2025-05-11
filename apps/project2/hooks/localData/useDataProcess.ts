import { useCallback } from 'react';
import { useDataStore } from '@/store/dataStore';
import { localDataApi } from '@/api/localData';

/**
 * 用于数据处理流程的 hooks，封装 API 调用和 store 更新
 */
export function useDataProcessActions() {
  const { addOrUpdateTask, updateTaskStatus, updateTaskProgress, setTaskUploadError, removeTask } = useDataStore();

  // 上传文件并添加任务
  const uploadAndAddTask = useCallback(async (formData: FormData, taskId?: string) => {
    try {
      // 调用API上传文件
      const res = await localDataApi.uploadFile(formData);

      // 检查响应是否成功
      if (res.code === 200 && res.data) {
        const { file_hash, file_size } = res.data;

        // 确保文件哈希存在
        if (!file_hash) {
          throw new Error('上传成功但未获取到文件哈希');
        }

        // 创建任务对象
        const task = {
          file_id: taskId || file_hash, // 使用传入的taskId或文件哈希作为ID
          file_hash,
          file_name: (formData.get('file') as File)?.name,
          file_size: file_size ? file_size + 'B' : undefined,
          status: { upload: true, stix: false, cti: false, upchain: false },
          progress: 100,
          uploading: false
        };

        // 更新任务状态（不创建新任务）
        addOrUpdateTask({
          ...task,
          progress: {
            upload: task.progress as number,
            stix: 0,
            cti: 0,
            upchain: 0,
            current: task.progress as number
          }
        });

        // 如果有任务记录，可以处理历史任务状态
        if (res.data.task_record) {
          // 如果有step_status，可以更新相应的任务状态
          if (res.data.task_record.step_status && res.data.task_record.step_status.length > 0) {
            res.data.task_record.step_status.forEach((stepStatus: any) => {
              if (stepStatus.status === "finished") {
                // 根据步骤更新任务状态
                const stepMap: Record<string, keyof typeof task.status> = {
                  "0": "upload",
                  "1": "stix",
                  "2": "cti",
                  "3": "upchain"
                };

                const step = stepStatus.step.toString();
                if (step in stepMap) {
                  updateTaskStatus(file_hash, stepMap[step], true);
                }
              }
            });
          }
        }

        return task;
      } else {
        throw new Error(res.error || res.msg || '上传失败');
      }
    } catch (error) {

      // 更新任务进度为100%（失败）
      if (taskId) {
        updateTaskProgress(taskId, 'upload', 100);
        setTaskUploadError(taskId, error instanceof Error ? error.message : '上传失败');
      }

      throw error instanceof Error ? error : new Error('上传失败');
    }
  }, [addOrUpdateTask, updateTaskProgress, updateTaskStatus, setTaskUploadError]);

  return {
    uploadAndAddTask,
    removeTask
  };
}
