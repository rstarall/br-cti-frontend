import { useCallback } from 'react';
import { useDataStore } from '@/store/dataStore';
import { localDataApi } from '@/api/localData';
import { useDataProcessActions } from './useDataProcess';

/**
 * 用于文件上传处理流程的 hooks，封装 API 调用和 store 更新
 */
export function useUploadProcessActions() {
  const { addOrUpdateTask, updateTaskProgress, setTaskUploadError } = useDataStore();

  // 多文件上传（模拟进度）
  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    let lastUploadedFile: { file_hash: string } | null = null;

    for (const file of Array.from(files)) {
      const fileId = Date.now() + Math.random().toString(36).slice(2, 8);

      // 初始化任务
      addOrUpdateTask({
        file_id: fileId,
        file_hash: '',
        file_name: file.name,
        file_size: file.size + 'B',
        progress: {
          upload: 0,
          stix: 0,
          cti: 0,
          upchain: 0,
          current: 0
        },
        uploading: true,
        status: { upload: false, stix: false, cti: false, upchain: false }
      });

      // 模拟进度
      let progress = 0;
      updateTaskProgress(fileId, 'upload', progress);
      const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 10 + 5, 80);
        updateTaskProgress(fileId, 'upload', Math.floor(progress));
      }, 200);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('task_id', fileId);

        const res = await localDataApi.uploadFile(formData);
        clearInterval(interval);
        updateTaskProgress(fileId, 'upload', 100);

        if (res.code === 200 && res.data) {
          const { file_hash, file_size } = res.data;
          lastUploadedFile = { file_hash };
          addOrUpdateTask({
            file_id: fileId,
            file_hash,
            file_name: file.name,
            file_size: file_size ? file_size + 'B' : undefined,
            progress: {
              upload: 100,
              stix: 0,
              cti: 0,
              upchain: 0,
              current: 100
            },
            uploading: false,
            status: { upload: true, stix: false, cti: false, upchain: false }
          });
        } else {
          setTaskUploadError(fileId, '上传失败');
        }
      } catch (error) {
        clearInterval(interval);
        setTaskUploadError(fileId, error instanceof Error ? error.message : '上传失败');
        updateTaskProgress(fileId, 'upload', 100);
      }
    }

    return lastUploadedFile;
  }, [addOrUpdateTask, updateTaskProgress, setTaskUploadError]);

  return {
    uploadFiles
  };
}
