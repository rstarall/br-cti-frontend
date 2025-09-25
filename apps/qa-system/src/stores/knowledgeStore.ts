
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type KnowledgeDatabase = {
    id: string;
    db_id: string; // SQLite中的db_id字段
    name: string;
    description: string;
    file_count: number;
    time: string;
    embed_model: string; // 嵌入模型
    dimension: number; // 维度
    meta_info?: any; // 元信息
    created_at?: string; // 创建时间
};

export type KnowledgeFile = {
    id: string;
    file_id: string; // 数据库中的file_id字段
    database_id: string; // 关联的数据库ID
    filename: string; // 文件名
    path: string; // 文件路径
    file_type: string; // 文件类型
    status: string; // 文件状态：done, processing, failed等
    created_at: string; // 创建时间

    // 为了兼容前端显示，添加一些别名字段
    name?: string; // filename的别名
    type?: string; // file_type的别名
    size?: string; // 文件大小（如果后端提供）
    upload_time?: string; // created_at的别名
};

type ChunkParams = {
    chunk_size?: number;
    chunk_overlap?: number;
    use_parser?: boolean;
};

type KnowledgeState = {
    databases: KnowledgeDatabase[];
    currentDatabaseId: string;
    databaseFiles: Record<string, KnowledgeFile[]>;
    pendingFiles: Record<string, string[]>; // 存储已上传但未生成分块的文件路径
    fetchDatabases: () => Promise<void>;
    createDatabase: (name: string, description: string) => Promise<void>;
    deleteDatabase: (databaseId: string) => Promise<void>;
    setCurrentDatabaseId: (databaseId: string) => void;
    fetchDatabaseFiles: (databaseId: string) => Promise<void>;
    uploadFile: (databaseId: string, file: File) => Promise<string>; // 返回文件路径
    generateChunks: (databaseId: string, filePaths: string[], params: ChunkParams) => Promise<void>;
    deleteFile: (databaseId: string, fileId: string) => Promise<void>;
    queryTest: (databaseId: string, query: string) => Promise<any>;
    addPendingFile: (databaseId: string, filePath: string) => void;
    clearPendingFiles: (databaseId: string) => void;
};

const API_BASE_URL = '/api';

export const useKnowledgeStore = create<KnowledgeState>()(
    persist(
        (set, get) => ({
            databases: [],
            currentDatabaseId: '',
            databaseFiles: {},
            pendingFiles: {},

            fetchDatabases: async () => {
                try {
                    console.log('开始获取知识库列表');

                    const response = await fetch(`${API_BASE_URL}/data/`, {
                        method: 'GET',

                    });

                    console.log('获取知识库列表响应状态:', response.status, response.statusText);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('获取知识库列表API错误:', { status: response.status, statusText: response.statusText, errorText });
                        throw new Error(`获取知识库列表失败: ${response.status} - ${errorText}`);
                    }

                    const data = await response.json();
                    console.log('知识库列表API响应数据:', data);

                    const databases = data.databases || [];
                    console.log('解析出的知识库列表:', databases);

                    set({ databases });
                } catch (error) {
                    console.error('获取知识库列表完整错误:', error);
                    throw error;
                }
            },

            createDatabase: async (name, description) => {
                try {
                    const response = await fetch(`${API_BASE_URL}/data/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({
                            database_name: name,
                            description: description
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`创建知识库失败: ${response.status}`);
                    }

                    await get().fetchDatabases();
                } catch (error) {
                    console.error('创建知识库失败:', error);
                    throw error;
                }
            },

            deleteDatabase: async (databaseId) => {
                try {
                    // 找到对应的数据库记录，获取db_id
                    const database = get().databases.find(db => db.id === databaseId);
                    if (!database) {
                        throw new Error('知识库不存在');
                    }

                    // 使用查询参数传递db_id进行删除
                    const response = await fetch(`${API_BASE_URL}/data/?db_id=${database.db_id}`, {
                        method: 'DELETE',

                    });

                    if (!response.ok) {
                        throw new Error(`删除知识库失败: ${response.status}`);
                    }

                    set((state) => ({
                        databases: state.databases.filter(db => db.id !== databaseId),
                        databaseFiles: Object.fromEntries(
                            Object.entries(state.databaseFiles).filter(([id]) => id !== databaseId)
                        ),
                        pendingFiles: Object.fromEntries(
                            Object.entries(state.pendingFiles).filter(([id]) => id !== databaseId)
                        )
                    }));

                    if (get().currentDatabaseId === databaseId) {
                        set({ currentDatabaseId: '' });
                    }
                } catch (error) {
                    console.error('删除知识库失败:', error);
                    throw error;
                }
            },

            setCurrentDatabaseId: (databaseId) => {
                set({ currentDatabaseId: databaseId });
            },

            fetchDatabaseFiles: async (databaseId) => {
                try {
                    console.log('开始获取知识库文件列表:', { databaseId });

                    // 使用新的专门的文件列表API
                    const url = `${API_BASE_URL}/data/files?db_id=${databaseId}`;
                    console.log('请求URL:', url);

                    const response = await fetch(url, {
                        method: 'GET',

                    });

                    console.log('响应状态:', response.status, response.statusText);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('API错误响应:', { status: response.status, statusText: response.statusText, errorText });
                        throw new Error(`获取知识库文件列表失败: ${response.status} - ${errorText}`);
                    }

                    const data = await response.json();
                    console.log('API响应数据:', data);

                    // 检查API状态
                    if (data.status !== 'success') {
                        throw new Error(data.message || '获取文件列表失败');
                    }

                    // 从新API获取文件列表
                    const rawFiles = Array.isArray(data.files) ? data.files : [];
                    console.log('原始文件数据:', rawFiles);

                    // 将数据库字段映射到前端显示字段
                    const files = rawFiles.map((file: any) => {
                        console.log('单个文件原始数据:', file);
                        console.log('file.id的值:', file.id, '类型:', typeof file.id);
                        console.log('file.file_id的值:', file.file_id, '类型:', typeof file.file_id);

                        const mappedFile = {
                            ...file,
                            // 保留原始数据库字段 - 尝试多种方式获取数字ID
                            id: (() => {
                                // 首先尝试直接的id字段
                                if (file.id && file.id !== file.file_id) {
                                    return file.id;
                                }
                                // 如果没有，尝试从file_id中提取数字
                                if (file.file_id) {
                                    const match = file.file_id.toString().match(/\d+/);
                                    if (match) {
                                        return match[0];
                                    }
                                }
                                // 最后返回原始值
                                return file.id || file.file_id || file.document_id;
                            })(),
                            file_id: file.file_id || file.id,
                            database_id: file.database_id || file.db_id,
                            filename: file.filename || file.name || file.file_name,
                            path: file.path || file.file_path || file.filepath || file.document_path,
                            file_type: file.file_type || file.type || file.extension,
                            status: file.status || 'done',
                            created_at: file.created_at || file.upload_time || file.create_time || file.timestamp || file.date_created,

                            // 添加前端兼容字段
                            name: file.filename || file.name || file.file_name, // 兼容显示
                            type: file.file_type || file.type || file.extension, // 兼容显示
                            upload_time: file.created_at || file.upload_time || file.create_time || file.timestamp, // 兼容显示
                            size: file.size || file.file_size || '未知' // 如果后端提供size字段
                        };

                        console.log('映射后的文件数据:', mappedFile);
                        console.log('最终ID值:', mappedFile.id, '类型:', typeof mappedFile.id);
                        return mappedFile;
                    });

                    console.log('处理后的文件列表:', files);

                    set((state) => ({
                        databaseFiles: {
                            ...state.databaseFiles,
                            [databaseId]: files
                        }
                    }));

                    console.log('文件列表更新成功:', files.length, '个文件');
                } catch (error) {
                    console.error('获取知识库文件列表完整错误:', error);
                    throw error;
                }
            },

            // 只上传文件，不生成分块
            uploadFile: async (databaseId, file) => {
                try {
                    const formData = new FormData();
                    formData.append('file', file);

                    // 现在databaseId实际上就是db_id，直接使用
                    const uploadResponse = await fetch(`${API_BASE_URL}/data/upload?db_id=${databaseId}`, {
                        method: 'POST',

                        body: formData
                    });

                    if (!uploadResponse.ok) {
                        const errorText = await uploadResponse.text();
                        throw new Error(`上传文件失败: ${uploadResponse.status} - ${errorText}`);
                    }

                    const uploadResult = await uploadResponse.json();

                    const filePath = uploadResult.file_path;

                    if (!filePath) {
                        throw new Error('文件上传成功但未返回文件路径');
                    }

                    // 添加到待处理文件
                    get().addPendingFile(databaseId, filePath);

                    return filePath; // 返回文件路径，用于后续生成分块
                } catch (error) {
                    console.error('上传文件失败:', error);
                    throw error;
                }
            },

            // 生成分块并添加到知识库
            generateChunks: async (databaseId, filePaths, params) => {
                try {
                    //console.log('开始三步上传流程:', { databaseId, filePaths, params });

                    // 步骤1: 文件已经通过 /data/upload 上传完成，filePaths 包含文件路径

                    // 步骤2: 调用 /data/file-to-chunk 进行文件分块
                    // console.log('步骤2: 调用 file-to-chunk 进行分块处理');
                    const chunkResponse = await fetch(`${API_BASE_URL}/data/file-to-chunk`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({
                            files: filePaths,
                            params: {
                                chunk_size: params.chunk_size || 1000,
                                chunk_overlap: params.chunk_overlap || 200,
                                use_parser: params.use_parser || false
                            }
                        })
                    });

                    if (!chunkResponse.ok) {
                        const errorText = await chunkResponse.text();
                        throw new Error(`文件分块处理失败: ${chunkResponse.status} - ${errorText}`);
                    }

                    const chunkResult = await chunkResponse.json();
                    //console.log('文件分块成功:', chunkResult);

                    // 步骤3: 调用 /data/add-by-chunks 将分块添加到数据库
                    //console.log('步骤3: 调用 add-by-chunks 添加到数据库');
                    const addResponse = await fetch(`${API_BASE_URL}/data/add-by-chunks`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({
                            db_id: databaseId,
                            file_chunks: chunkResult
                        })
                    });

                    if (!addResponse.ok) {
                        const errorText = await addResponse.text();
                        throw new Error(`添加分块到数据库失败: ${addResponse.status} - ${errorText}`);
                    }

                    const addResult = await addResponse.json();
                    //console.log('添加分块成功:', addResult);

                    // 清除已处理的待处理文件
                    get().clearPendingFiles(databaseId);

                    // 刷新文件列表
                    await get().fetchDatabaseFiles(databaseId);

                    console.log('三步上传流程完成!');
                } catch (error) {
                    console.error('三步上传流程失败:', error);
                    throw error;
                }
            },

            addPendingFile: (databaseId, filePath) => {
                set(state => ({
                    pendingFiles: {
                        ...state.pendingFiles,
                        [databaseId]: [...(state.pendingFiles[databaseId] || []), filePath]
                    }
                }));
            },

            clearPendingFiles: (databaseId) => {
                set(state => ({
                    pendingFiles: {
                        ...state.pendingFiles,
                        [databaseId]: []
                    }
                }));
            },

            deleteFile: async (databaseId, fileId) => {
                try {
                    console.log('删除文件:', { databaseId, fileId });

                    // 使用新的专门的文件删除API
                    const response = await fetch(`${API_BASE_URL}/data/file`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({
                            db_id: databaseId,
                            file_id: fileId
                        })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`删除文件失败: ${response.status} - ${errorText}`);
                    }

                    const result = await response.json();
                    console.log('删除文件API响应:', result);

                    // 检查API状态
                    if (result.status !== 'success') {
                        throw new Error(result.message || '删除文件失败');
                    }

                    console.log('删除文件成功:', result);

                    // 更新本地状态，移除已删除的文件
                    set((state) => ({
                        databaseFiles: {
                            ...state.databaseFiles,
                            [databaseId]: state.databaseFiles[databaseId]?.filter(file => file.file_id !== fileId) || []
                        }
                    }));
                } catch (error) {
                    console.error('删除文件失败:', error);
                    throw error;
                }
            },

            queryTest: async (databaseId, query) => {
                try {
                    // 现在databaseId实际上就是db_id，直接使用
                    const response = await fetch(`${API_BASE_URL}/data/query-test`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({
                            query,
                            meta: { db_id: databaseId }
                        })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`检索测试失败: ${response.status} - ${errorText}`);
                    }

                    return await response.json();
                } catch (error) {
                    console.error('检索测试失败:', error);
                    throw error;
                }
            }
        }),
        {
            name: 'knowledge-storage',
            partialize: (state) => ({
                currentDatabaseId: state.currentDatabaseId,
                pendingFiles: state.pendingFiles
            })
        }
    )
);
