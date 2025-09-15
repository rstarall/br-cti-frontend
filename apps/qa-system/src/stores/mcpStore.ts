import { create } from 'zustand';
import { persist, type StorageValue } from 'zustand/middleware';

export type MCPParam = {
    name: string;
    type: string;
    description: string;
};

export type MCPItem = {
    id: string;
    title: string;
    url: string;
    params_require: MCPParam[];
    description: string;
    method: string;
};

export type MCPState = {
    mcpList: MCPItem[];
    addMCP: (item: MCPItem) => void; 
    editMCP: (id: string, update: Partial<MCPItem>) => void;
    deleteMCP: (id: string) => void;
    setMCPList: (list: MCPItem[]) => void;
};

const MockData:MCPItem[] = [
  { 
    id: "1", 
    title: '加法计算',
    url: 'http://mcp.com/add',
    params_require:[{
      name: 'num1',
      type: 'number',
      description: 'the first number'
    },{ 
      name: 'num2',
      type: 'number',
      description: 'the second number'
    }],
    description: 'a mcp to caculate the sum of two numbers',
    method: 'POST',
  },
] 


export const useMCPStore = create<MCPState>()(
    persist(
        (set, get) => ({
            mcpList: [...MockData],
            addMCP: (item) => {
                const id = Date.now().toString();
                set({
                    mcpList: [
                        ...get().mcpList,
                        { ...item, id }
                    ]
                });
            },
            editMCP: (id, update) => {
                set({
                    mcpList: get().mcpList.map(mcp =>
                        mcp.id === id ? { ...mcp, ...update } : mcp
                    )
                });
            },
            deleteMCP: (id) => {
                set({
                    mcpList: get().mcpList.filter(mcp => mcp.id !== id)
                });
            },
            setMCPList: (list) => set({ mcpList: list }),
        }),
        {
            name: 'mcp-storage',
            partialize: (state) => ({ mcpList: state.mcpList }),
            storage: typeof window !== 'undefined' ? {
                getItem: (name): StorageValue<{ mcpList: MCPItem[] }> | null => {
                    try {
                        const str = localStorage.getItem(name);
                        return str ? JSON.parse(str) : null;
                    } catch (err) {
                        console.warn('MCP存储访问失败:', err);
                        return null;
                    }
                },
                setItem: (name, value: StorageValue<{ mcpList: MCPItem[] }>) => {
                    try {
                        localStorage.setItem(name, JSON.stringify(value));
                    } catch (err) {
                        console.warn('MCP存储写入失败:', err);
                    }
                },
                removeItem: (name) => {
                    try {
                        localStorage.removeItem(name);
                    } catch (err) {
                        console.warn('MCP存储删除失败:', err);
                    }
                }
            } : undefined
        }
    )
);

