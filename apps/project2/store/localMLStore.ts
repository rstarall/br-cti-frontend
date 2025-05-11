import { create } from 'zustand';
import { localMLApi } from '@/api/localML';

// 模型任务状态
interface ModelTask {
  file_id: string;
  file_hash: string;
  file_name: string;
  file_size: number;
  model_hash?: string;
  status: {
    upload: boolean;
    train: boolean;
    evaluate: boolean;
    info: boolean;
    upchain: boolean;
  };
  progress: {
    upload: number;
    train: number;
    evaluate: number;
    info: number;
    upchain: number;
    current?: number;
  };
  activeStep?: 'upload' | 'train' | 'evaluate' | 'info' | 'upchain';
  train_request_id?: string;
  evaluation_metrics?: any;
}

// 模型记录
interface ModelRecord {
  request_id: string;
  source_file_hash: string;
  model_info: {
    model_hash: string;
    model_name: string;
    model_type: number;
    model_algorithm: string;
    model_framework: string;
    model_open_source: number;
    features: string[];
    model_data_type: number;
    model_size: number;
    test_size: string;
    training_time: string;
    feature_count: number;
    rows_count: number;
    incentive_mechanism: number;
  };
  status: string;
  created_time: string;
  onchain: boolean;
}

// 模型处理状态
interface ModelState {
  // 面板数据
  onchainModelCount: number;
  ownModelCount: number;
  ownOnchainModelCount: number;
  localModelCount: number;
  processedModelCount: number;
  processingModelCount: number;

  // 模型数据
  tasks: ModelTask[];
  modelRecords: ModelRecord[];
  currentStep: number;
  isLoading: boolean;
  error: string | null;

  // 操作
  fetchModelStats: () => Promise<void>;
  addTask: (task: ModelTask) => void;
  updateTaskStatus: (fileHash: string, step: 'upload' | 'train' | 'evaluate' | 'info' | 'upchain', status: boolean) => void;
  updateTaskProgress: (fileHash: string, step: 'upload' | 'train' | 'evaluate' | 'info' | 'upchain', progress: number) => void;
  updateTaskModelHash: (fileHash: string, modelHash: string) => void;
  updateTaskTrainRequestId: (fileHash: string, requestId: string) => void;
  updateTaskActiveStep: (fileHash: string, step: 'upload' | 'train' | 'evaluate' | 'info' | 'upchain') => void;
  updateTaskEvaluationMetrics: (fileHash: string, metrics: any) => void;
  fetchModelRecords: (fileHash: string) => Promise<void>;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}

export const useLocalMLStore = create<ModelState>((set, get) => ({
  // 面板数据
  onchainModelCount: 0,
  ownModelCount: 0,
  ownOnchainModelCount: 0,
  localModelCount: 0,
  processedModelCount: 0,
  processingModelCount: 0,

  // 模型数据
  tasks: [],
  modelRecords: [],
  currentStep: 0,
  isLoading: false,
  error: null,

  // 操作
  fetchModelStats: async () => {
    set({ isLoading: true, error: null });

    try {
      // 计算统计数据
      const { tasks } = get();
      const localModelCount = tasks.length;
      const processedModelCount = tasks.filter(task =>
        task.status.train && task.status.info && task.status.upchain
      ).length;
      const processingModelCount = tasks.filter(task =>
        task.status.upload && (!task.status.train || !task.status.info || !task.status.upchain)
      ).length;

      // 设置统计数据
      set({
        localModelCount,
        processedModelCount,
        processingModelCount,
        onchainModelCount: 0, // 这些值应该从区块链API获取
        ownModelCount: 0,
        ownOnchainModelCount: 0,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch model stats:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch model stats',
        isLoading: false
      });
    }
  },

  addTask: (task) => {
    const { tasks } = get();
    // 检查任务是否已存在
    const existingTask = tasks.find(t => t.file_hash === task.file_hash);
    if (!existingTask) {
      set({ tasks: [...tasks, task] });
    }
  },

  updateTaskStatus: (fileHash, step, status) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.file_hash === fileHash) {
        return {
          ...task,
          status: {
            ...task.status,
            [step]: status
          }
        };
      }
      return task;
    });
    set({ tasks: updatedTasks });
  },

  updateTaskProgress: (fileHash, step, progress) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.file_hash === fileHash) {
        return {
          ...task,
          progress: {
            ...task.progress,
            [step]: progress
          }
        };
      }
      return task;
    });
    set({ tasks: updatedTasks });
  },

  updateTaskModelHash: (fileHash, modelHash) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.file_hash === fileHash) {
        return {
          ...task,
          model_hash: modelHash
        };
      }
      return task;
    });
    set({ tasks: updatedTasks });
  },

  updateTaskTrainRequestId: (fileHash, requestId) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.file_hash === fileHash) {
        return {
          ...task,
          train_request_id: requestId
        };
      }
      return task;
    });
    set({ tasks: updatedTasks });
  },

  updateTaskActiveStep: (fileHash, step) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.file_hash === fileHash) {
        return {
          ...task,
          activeStep: step,
          // 更新当前总体进度为活动步骤的进度
          progress: {
            ...task.progress,
            current: task.progress[step] || 0
          }
        };
      }
      return task;
    });
    set({ tasks: updatedTasks });
  },

  updateTaskEvaluationMetrics: (fileHash, metrics) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.file_hash === fileHash) {
        return {
          ...task,
          evaluation_metrics: metrics,
          // 如果有评估指标，则将评估状态设置为完成
          status: {
            ...task.status,
            evaluate: true
          }
        };
      }
      return task;
    });
    set({ tasks: updatedTasks });
  },

  fetchModelRecords: async (fileHash) => {
    set({ isLoading: true, error: null });

    try {
      const response = await localMLApi.getModelTrainRecordByRequestId(fileHash);
      if (response.code === 200 && response.data) {
        const { modelRecords } = get();
        const updatedRecords = [...modelRecords];

        // 将API返回的数据转换为ModelRecord格式
        const modelRecord: ModelRecord = {
          request_id: response.data.request_id,
          source_file_hash: fileHash,
          model_info: {
            model_hash: response.data.model_hash || '',
            model_name: response.data.model_name || '',
            model_type: response.data.model_type || 1,
            model_algorithm: 'RandomForest', // 默认值
            model_framework: 'scikit-learn', // 默认值
            model_open_source: 0,
            features: [], // 默认空数组
            model_data_type: 0,
            model_size: 0,
            test_size: '',
            training_time: '',
            feature_count: 0,
            rows_count: 0,
            incentive_mechanism: 0
          },
          status: response.data.status || '',
          created_time: response.data.create_time || '',
          onchain: false
        };

        // 检查记录是否已存在
        const existingIndex = modelRecords.findIndex(
          record => record.source_file_hash === fileHash
        );

        if (existingIndex >= 0) {
          updatedRecords[existingIndex] = modelRecord;
        } else {
          updatedRecords.push(modelRecord);
        }

        set({ modelRecords: updatedRecords, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch model records:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch model records',
        isLoading: false
      });
    }
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  reset: () => {
    set({
      tasks: [],
      modelRecords: [],
      error: null
    });
  }
}));
