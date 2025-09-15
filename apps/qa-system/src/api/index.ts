import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    console.log('发送API请求:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      params: config.params
    });

    // 可以在这里添加认证token等
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    console.log('收到API响应:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });

    return response;
  },
  (error) => {
    console.error('响应拦截器错误:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data
    });

    // 统一错误处理
    if (error.response?.status === 401) {
      // 处理未授权错误
      console.warn('未授权访问，可能需要重新登录');
    } else if (error.response?.status === 500) {
      // 处理服务器错误
      console.error('服务器内部错误');
    }

    return Promise.reject(error);
  }
);

// 创建流式请求的特殊实例（用于聊天流式响应）
export const createStreamRequest = async (
  url: string,
  data: any,
  onChunk: (chunk: any) => void,
  onError: (error: Error) => void,
  onComplete: () => void
) => {
  try {
    console.log('发送流式请求:', { url, data });

    const response = await fetch(`${api.defaults.baseURL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    console.log('流式响应状态:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        // 处理SSE格式：data: {json}
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6); // 移除 "data: " 前缀
          try {
            const data = JSON.parse(jsonStr);
            onChunk(data);
          } catch (error) {
            console.error('解析SSE数据失败:', error, 'Line:', line);
          }
        } else {
          // 兼容处理：如果不是SSE格式，尝试直接解析JSON
          try {
            const data = JSON.parse(line);
            onChunk(data);
          } catch (error) {
            console.error('解析流式数据失败:', error, 'Line:', line);
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    console.error('流式请求失败:', error);
    onError(error as Error);
  }
};

// 导出API模块
export { ChatAPI } from './chat';
export { KnowledgeAPI } from './knowledge';
export { GraphAPI } from './graph';

// 导出类型
export * from './types';

export default api;
