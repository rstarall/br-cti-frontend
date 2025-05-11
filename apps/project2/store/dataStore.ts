import { create } from 'zustand';

interface CTIData {
  cti_id: string;
  cti_hash: string;
  cti_name: string;
  cti_type: number;
  cti_traffic_type: number;
  open_source: number;
  creator_user_id: string;
  tags: string[];
  iocs: string[];
  stix_data: string;
  statistic_info: string;
  description: string;
  data_size: number;
  create_time: string;
  status: string;
}

interface DataTask {
  file_id: string;
  file_hash: string;
  file_name?: string;
  file_size?: string;
  // 每个步骤的独立进度
  progress: {
    upload: number;
    stix: number;
    cti: number;
    upchain: number;
    current: number; // 当前总体进度
  };
  uploading?: boolean;
  uploadError?: string;
  // 每个步骤的状态
  status: {
    upload: boolean;
    stix: boolean;
    cti: boolean;
    upchain: boolean;
  };
  // 当前活动步骤
  activeStep?: 'upload' | 'stix' | 'cti' | 'upchain';
}

interface DataState {
  // Data
  ctiData: CTIData[];
  tasks: DataTask[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCtiData: (data: CTIData[]) => void;
  addTask: (task: DataTask) => void;
  addOrUpdateTask: (task: DataTask) => void;
  updateTaskStatus: (fileHash: string, step: 'upload' | 'stix' | 'cti' | 'upchain', status: boolean) => void;
  reset: () => void;
  updateTaskProgress: (fileIdOrHash: string, step: 'upload' | 'stix' | 'cti' | 'upchain', progress: number) => void;
  updateTaskActiveStep: (fileIdOrHash: string, step: 'upload' | 'stix' | 'cti' | 'upchain') => void;
  setTaskUploadError: (fileIdOrHash: string, error: string) => void;
  removeTask: (fileIdOrHash: string) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  // Panel data
  onchainCtiCount: 0,
  ownCtiCount: 0,
  ownOnchainCtiCount: 0,
  localCtiCount: 0,

  // Data
  ctiData: [],
  tasks: [],
  isLoading: false,
  error: null,

  // Actions
  setCtiData: (data) => {
    set({ ctiData: data });
  },

  addTask: (task) => {
    const { tasks } = get();
    // Check if task already exists
    const existingTask = tasks.find(t => t.file_hash === task.file_hash);
    if (!existingTask) {
      set({ tasks: [...tasks, task] });
    }
  },

  addOrUpdateTask: (task) => {
    const { tasks } = get();

    // 首先检查是否有匹配的file_hash
    let idx = tasks.findIndex(t => t.file_hash === task.file_hash && task.file_hash !== '');

    // 如果没有找到匹配的file_hash，则检查file_id
    if (idx === -1 && task.file_id) {
      idx = tasks.findIndex(t => t.file_id === task.file_id);
    }

    if (idx !== -1) {
      // 更新现有任务
      const updated = [...tasks];

      // 如果新任务有file_hash但旧任务没有，则更新file_hash
      if (task.file_hash && !updated[idx].file_hash) {
        updated[idx].file_hash = task.file_hash;
      }

      // 处理进度数据
      let updatedProgress = updated[idx].progress;

      // 如果传入的是旧格式的进度（单个数字），则更新当前活动步骤的进度
      if (typeof task.progress === 'number') {
        const activeStep = updated[idx].activeStep || 'upload';
        updatedProgress = {
          ...updatedProgress,
          [activeStep]: task.progress,
          current: task.progress
        };
      }
      // 如果传入的是新格式的进度对象，则合并进度
      else if (task.progress && typeof task.progress === 'object') {
        updatedProgress = {
          ...updatedProgress,
          ...task.progress
        };
      }

      // 更新其他属性
      updated[idx] = {
        ...updated[idx],
        ...task,
        progress: updatedProgress,
        status: { ...updated[idx].status, ...task.status },
        // 确保不会丢失file_id
        file_id: updated[idx].file_id || task.file_id
      };

      set({ tasks: updated });
    } else {
      // 添加新任务，确保进度对象格式正确
      const newTask = {
        ...task,
        // 如果没有提供进度对象，则初始化一个
        progress: task.progress && typeof task.progress === 'object'
          ? task.progress
          : {
              upload: typeof task.progress === 'number' ? task.progress : 0,
              stix: 0,
              cti: 0,
              upchain: 0,
              current: typeof task.progress === 'number' ? task.progress : 0
            },
        // 如果没有提供活动步骤，则默认为上传
        activeStep: task.activeStep || 'upload'
      };

      set({ tasks: [...tasks, newTask] });
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


  reset: () => {
    set({
      ctiData: [],
      tasks: [],
      error: null
    });
  },

  updateTaskProgress: (fileIdOrHash, step, progress) => {
    const { tasks } = get();

    const updatedTasks = tasks.map(task => {
      if (task.file_hash === fileIdOrHash || task.file_id === fileIdOrHash) {
        // 确保task.progress是一个对象
        const currentProgress = typeof task.progress === 'object' ? task.progress : {
          upload: 0, stix: 0, cti: 0, upchain: 0, current: 0
        };

        // 更新特定步骤的进度
        const updatedProgress = {
          ...currentProgress,
          [step]: progress,
          // 更新当前总体进度
          current: progress
        };

        return {
          ...task,
          progress: updatedProgress
        };
      }
      return task;
    });

    set({ tasks: updatedTasks });
  },

  updateTaskActiveStep: (fileIdOrHash, step) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.file_hash === fileIdOrHash || task.file_id === fileIdOrHash) {
        return {
          ...task,
          activeStep: step,
          // 更新当前总体进度为活动步骤的进度
          progress: {
            ...task.progress,
            current: task.progress[step]
          }
        };
      }
      return task;
    });
    set({ tasks: updatedTasks });
  },

  setTaskUploadError: (fileIdOrHash, error) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.file_hash === fileIdOrHash || task.file_id === fileIdOrHash) {
        return {
          ...task,
          uploadError: error
        };
      }
      return task;
    });
    set({ tasks: updatedTasks });
  },

  removeTask: (fileIdOrHash) => {
    const { tasks } = get();
    const updatedTasks = tasks.filter(task => task.file_hash !== fileIdOrHash && task.file_id !== fileIdOrHash);
    set({ tasks: updatedTasks });
  }
}));
