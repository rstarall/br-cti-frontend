import { create } from 'zustand';
import { persist, type StorageValue } from 'zustand/middleware';

export interface Agent {
    id: string;
    name: string;
    description: string,
    prompt: string,
    avatar: any,
    skills: string[],
    mcpList: string[],
}

interface AgentStoreState {
    agents: Agent[];
    selectedAgentId: string | null;
    selectAgent: (id: string) => void;
    createAgent: (agent: Agent) => void;
    deleteAgent: (id: string) => void;
    editAgent: (id: string, update: Agent) => void;
    setAgentList: (list: Agent[]) => void;
}


const MockData:Agent[] = [
  {
    id: "1", 
    name: '翻译助手',
    description: '多语言翻译专家',
    prompt: '请将以下文本翻译成中文：',
    avatar: '🌐',
    skills: ['中英互译', '多语种翻译', '专业术语翻译'],
    mcpList: ['http://mcp.com/translate'],
  }
];


export const useAgentStore = create<AgentStoreState>()(
    persist(
        (set, get) => ({
            agents: [...MockData],
            selectedAgentId: null,

            selectAgent: (id) => set({ selectedAgentId: id }),

            createAgent: (agent) =>
                set((state) => ({
                    agents: [...state.agents, agent],
                    selectedAgentId: agent.id,
                })),

            deleteAgent: (id) =>
                set((state) => {
                    const filteredAgents = state.agents.filter((a) => a.id !== id);
                    const isSelectedDeleted = state.selectedAgentId === id;
                    return {
                        agents: filteredAgents,
                        selectedAgentId: isSelectedDeleted
                            ? filteredAgents.length > 0
                                ? filteredAgents[0].id
                                : null
                            : state.selectedAgentId,
                    };
                }),
            editAgent: (id, update) =>
                set((state) => ({
                    agents: state.agents.map((a) => (a.id === id ? { ...a, ...update } : a)),
                })),
            setAgentList: (list) => set({ agents: list })
        }),
        {
            name: 'agent-storage',
            partialize: (state) => ({ agents: state.agents, selectedAgentId: state.selectedAgentId }),
            storage: typeof window !== 'undefined' ? {
                getItem: (name): StorageValue<{ agents: Agent[], selectedAgentId: string | null }> | null => {
                    try {
                        const str = localStorage.getItem(name);
                        return str ? JSON.parse(str) : null;
                    } catch (err) {
                        console.warn('Agent存储访问失败:', err);
                        return null;
                    }
                },
                setItem: (name, value: StorageValue<{ agents: Agent[], selectedAgentId: string | null }>) => {
                    try {
                        localStorage.setItem(name, JSON.stringify(value));
                    } catch (err) {
                        console.warn('Agent存储写入失败:', err);
                    }
                },
                removeItem: (name) => {
                    try {
                        localStorage.removeItem(name);
                    } catch (err) {
                        console.warn('Agent存储删除失败:', err);
                    }
                }
            } : undefined
        }
    )
);