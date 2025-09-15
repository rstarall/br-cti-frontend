
import { create } from 'zustand';

// 后端API基础URL
const API_BASE_URL = 'http://localhost:8000';

interface GraphNode {
    id: string;
    name: string;
    properties?: Record<string, any>;
}

interface GraphEdge {
    source_id: string;
    target_id: string;
    type: string;
    source: string | GraphNode;
    target: string | GraphNode;
    label?: string;
}

interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

interface KGStore {
    graphInfo: {
        graph_name: string;
        entity_count: number;
        relationship_count: number;
        embed_model_name: string;
        status: string;
        unindexed_node_count: number;
    } | null;
    graphData: GraphData;
    isLoading: boolean;
    error: string | null;
    isRunning: boolean; // 数据库运行状态
    searchLoading: boolean;
    indexing: boolean;

    // 获取图谱信息
    fetchGraphInfo: () => Promise<void>;

    // 获取图谱节点
    fetchGraphNodes: (num: number) => Promise<void>;

    // 查询特定节点
    searchNode: (entityName: string) => Promise<void>;

    // 检查数据库运行状态
    checkDatabaseStatus: () => Promise<void>;

    // 通过上传文件添加实体（表单上传到后端处理）
    addEntitiesByFile: (
        file: File,
        options?: {
            language?: string;
            entityTypes?: string | string[];
            kgdbName?: string;
        }
    ) => Promise<{ success: boolean; message: string; entities_count?: number; relationships_count?: number }>;

    // 为未索引节点添加索引
    indexNodes: () => Promise<{ success: boolean; message: string }>;
}

export const useKGStore = create<KGStore>((set, get) => ({
    graphInfo: null,
    graphData: {
        nodes: [],
        edges: []
    },
    isLoading: false,
    error: null,
    isRunning: false,
    searchLoading: false,
    indexing: false,

    fetchGraphInfo: async () => {
        set({ isLoading: true, error: null });
        try {
            console.log('开始获取图谱信息');
            const response = await fetch(`${API_BASE_URL}/graph/info`, {
                method: 'GET',
                credentials: 'include'
            });

            console.log('图谱信息API响应状态:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('图谱信息API错误:', errorText);
                throw new Error(`获取图谱信息失败: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('图谱信息原始数据:', data);

            set({
                graphInfo: {
                    graph_name: data.graph_name || 'neo4j',
                    entity_count: data.entity_count || 0,
                    relationship_count: data.relationship_count || 0,
                    embed_model_name: data.embed_model_name || '',
                    status: data.status || 'closed',
                    unindexed_node_count: data.unindexed_node_count || 0
                },
                isLoading: false,
                isRunning: data.status === 'open'
            });
        } catch (error: any) {
            console.error('获取图谱信息错误:', error);
            set({
                error: error.message || '获取图谱信息失败',
                isLoading: false,
                isRunning: false
            });
        }
    },

    fetchGraphNodes: async (num: number) => {
        set({ isLoading: true, error: null });
        try {
            console.log(`开始获取${num}个图谱节点`);
            const response = await fetch(`${API_BASE_URL}/graph/nodes?kgdb_name=neo4j&num=${num}`, {
                method: 'GET',
                credentials: 'include'
            });

            console.log('图谱节点API响应状态:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('图谱节点API错误:', errorText);
                throw new Error(`获取图谱节点失败: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('图谱节点原始数据:', data);

            if (data.result && data.result.nodes && data.result.edges) {
                console.log('节点数据示例:', data.result.nodes.slice(0, 3));
                console.log('边数据示例:', data.result.edges.slice(0, 3));

                // 处理节点数据，确保name字段存在
                const processedNodes = data.result.nodes.map((node: any, index: number) => {
                    if (index < 3) { // 只打印前3个节点的详细信息
                        console.log(`节点${index}原始数据:`, node);
                        console.log(`节点${index}所有字段:`, Object.keys(node));
                    }

                    const name = node.name || node.label || node.title || node.text ||
                        node.displayName || node.caption || node.value ||
                        node.content || node.description || node.entity_name ||
                        node.entity || node.id || 'unknown';

                    if (index < 3) {
                        console.log(`节点${index}选择的name:`, name, '来源字段:',
                            node.name ? 'name' :
                                node.label ? 'label' :
                                    node.title ? 'title' :
                                        node.text ? 'text' :
                                            node.displayName ? 'displayName' :
                                                node.caption ? 'caption' :
                                                    node.value ? 'value' :
                                                        node.content ? 'content' :
                                                            node.description ? 'description' :
                                                                node.entity_name ? 'entity_name' :
                                                                    node.entity ? 'entity' :
                                                                        node.id ? 'id' : 'unknown');
                    }

                    return {
                        ...node,
                        name: name
                    };
                });

                // 处理边数据，确保source和target字段存在
                const processedEdges = data.result.edges.map((edge: any) => ({
                    ...edge,
                    source: edge.source_id,
                    target: edge.target_id,
                    label: edge.type
                }));

                console.log('处理后的节点示例:', processedNodes.slice(0, 3));
                console.log('处理后的边示例:', processedEdges.slice(0, 3));

                set({
                    graphData: {
                        nodes: processedNodes,
                        edges: processedEdges
                    },
                    isLoading: false
                });
            } else {
                throw new Error('返回数据格式不正确');
            }
        } catch (error: any) {
            console.error('获取图谱节点错误:', error);
            set({
                error: error.message || '获取图谱节点失败',
                isLoading: false
            });
        }
    },

    searchNode: async (entityName: string) => {
        set({ searchLoading: true, error: null });
        try {
            console.log(`开始搜索实体: ${entityName}`);
            const response = await fetch(`${API_BASE_URL}/graph/node?entity_name=${encodeURIComponent(entityName)}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `查询失败：${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('节点搜索结果:', data);

            if (data.result && data.result.nodes && data.result.edges) {
                console.log('搜索节点数据示例:', data.result.nodes.slice(0, 3));

                // 处理节点数据，确保name字段存在
                const processedNodes = data.result.nodes.map((node: any, index: number) => {
                    if (index < 3) { // 只打印前3个节点的详细信息
                        console.log(`节点${index}原始数据:`, node);
                        console.log(`节点${index}所有字段:`, Object.keys(node));
                    }

                    const name = node.name || node.label || node.title || node.text ||
                        node.displayName || node.caption || node.value ||
                        node.content || node.description || node.entity_name ||
                        node.entity || node.id || 'unknown';

                    if (index < 3) {
                        console.log(`节点${index}选择的name:`, name, '来源字段:',
                            node.name ? 'name' :
                                node.label ? 'label' :
                                    node.title ? 'title' :
                                        node.text ? 'text' :
                                            node.displayName ? 'displayName' :
                                                node.caption ? 'caption' :
                                                    node.value ? 'value' :
                                                        node.content ? 'content' :
                                                            node.description ? 'description' :
                                                                node.entity_name ? 'entity_name' :
                                                                    node.entity ? 'entity' :
                                                                        node.id ? 'id' : 'unknown');
                    }

                    return {
                        ...node,
                        name: name
                    };
                });

                // 处理边数据，确保source和target字段存在
                const processedEdges = data.result.edges.map((edge: any) => ({
                    ...edge,
                    source: edge.source_id,
                    target: edge.target_id,
                    label: edge.type
                }));

                set({
                    graphData: {
                        nodes: processedNodes,
                        edges: processedEdges
                    },
                    searchLoading: false
                });
            } else {
                throw new Error('返回数据格式不正确');
            }
        } catch (error: any) {
            console.error('搜索节点错误:', error);
            set({
                error: error.message || '查询节点失败',
                searchLoading: false
            });
        }
    },

    checkDatabaseStatus: async () => {
        try {
            console.log('检查数据库状态');
            const response = await fetch(`${API_BASE_URL}/graph/indexer-status`, {
                method: 'GET',
                credentials: 'include'
            });

            console.log('数据库状态检查响应:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('数据库状态检查返回数据:', data);
                set({ isRunning: data.status === 'open' });
            } else {
                console.log('数据库状态检查失败:', response.status);
                set({ isRunning: false });
            }
        } catch (error) {
            console.error('检查数据库状态失败:', error);
            set({ isRunning: false });
        }
    },

    addEntitiesByFile: async (
        file: File,
        options?: { language?: string; entityTypes?: string | string[]; kgdbName?: string }
    ) => {
        set({ isLoading: true, error: null });
        try {
            console.log('开始通过文件上传添加实体:', file?.name);

            const formData = new FormData();
            formData.append('file', file);
            // 自动语言检测：如果未显式传入 language，则读取文件前段进行简单判断
            let langToUse = options?.language;
            if (!langToUse) {
                try {
                    const sampleText = await file.slice(0, 20000).text();
                    const hasCJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/.test(sampleText);
                    langToUse = hasCJK ? 'chinese' : 'english';
                } catch (e) {
                    // 回退为 chinese，以与原先默认保持一致
                    langToUse = 'chinese';
                }
            }
            formData.append('language', langToUse);
            const entityTypes = options?.entityTypes;
            if (entityTypes !== undefined) {
                const toSend = Array.isArray(entityTypes) ? JSON.stringify(entityTypes) : entityTypes;
                formData.append('entity_types', toSend);
            }
            formData.append('kgdb_name', options?.kgdbName ?? 'neo4j');

            const response = await fetch(`${API_BASE_URL}/graph/extract-entities-from-file`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                let message = `添加实体失败: ${response.status}`;
                try {
                    const errorData = await response.json();
                    message = errorData.message || message;
                } catch { }
                throw new Error(message);
            }

            const data = await response.json();
            console.log('添加实体结果:', data);

            set({ isLoading: false });
            return {
                success: data.status === 'success',
                message: data.message,
                entities_count: data.entities_count,
                relationships_count: data.relationships_count
            };
        } catch (error: any) {
            console.error('添加实体错误:', error);
            set({
                error: error.message || '添加实体失败',
                isLoading: false
            });
            return {
                success: false,
                message: error.message || '添加实体失败'
            };
        }
    },

    indexNodes: async () => {
        set({ indexing: true, error: null });
        try {
            console.log('开始为节点添加索引');

            const response = await fetch(`${API_BASE_URL}/graph/index-nodes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    kgdb_name: 'neo4j'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `请求失败：${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('添加索引结果:', data);

            set({ indexing: false });
            return {
                success: true,
                message: data.message
            };
        } catch (error: any) {
            console.error('添加索引错误:', error);
            set({
                error: error.message || '添加索引失败',
                indexing: false
            });
            return {
                success: false,
                message: error.message || '添加索引失败'
            };
        }
    }
}));
