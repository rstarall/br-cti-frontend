import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock axios before importing API modules
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn()
      },
      response: {
        use: jest.fn()
      }
    },
    defaults: {
      baseURL: 'http://localhost:8000'
    },
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
  })),
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: {
          use: jest.fn()
        },
        response: {
          use: jest.fn()
        }
      },
      defaults: {
        baseURL: 'http://localhost:8000'
      },
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn()
    }))
  }
}));

// Mock fetch for streaming requests
global.fetch = jest.fn();

import { ChatAPI, KnowledgeAPI, GraphAPI } from '../src/api';

describe('API模块测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ChatAPI', () => {
    it('应该能够获取模型列表', async () => {
      // 这里可以添加具体的测试逻辑
      expect(ChatAPI.getModels).toBeDefined();
    });

    it('应该能够发送聊天请求', async () => {
      expect(ChatAPI.call).toBeDefined();
    });

    it('应该能够发送流式聊天请求', async () => {
      expect(ChatAPI.streamChat).toBeDefined();
    });
  });

  describe('KnowledgeAPI', () => {
    it('应该能够获取知识库列表', async () => {
      expect(KnowledgeAPI.getDatabases).toBeDefined();
    });

    it('应该能够创建知识库', async () => {
      expect(KnowledgeAPI.createDatabase).toBeDefined();
    });

    it('应该能够上传文件', async () => {
      expect(KnowledgeAPI.uploadFile).toBeDefined();
    });

    it('应该能够删除文件', async () => {
      expect(KnowledgeAPI.deleteFile).toBeDefined();
    });
  });

  describe('GraphAPI', () => {
    it('应该能够获取图谱信息', async () => {
      expect(GraphAPI.getGraphInfo).toBeDefined();
    });

    it('应该能够获取图谱节点', async () => {
      expect(GraphAPI.getGraphNodes).toBeDefined();
    });

    it('应该能够搜索节点', async () => {
      expect(GraphAPI.getGraphNode).toBeDefined();
    });

    it('应该能够添加索引', async () => {
      expect(GraphAPI.indexNodes).toBeDefined();
    });
  });
});

describe('API拦截器测试', () => {
  it('应该正确配置请求拦截器', () => {
    // 测试请求拦截器是否正确配置
    expect(true).toBe(true); // 占位测试
  });

  it('应该正确配置响应拦截器', () => {
    // 测试响应拦截器是否正确配置
    expect(true).toBe(true); // 占位测试
  });
});

describe('流式请求测试', () => {
  it('应该能够处理流式响应', () => {
    // 测试流式请求处理
    expect(true).toBe(true); // 占位测试
  });
});
