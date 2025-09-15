'use client';

import { useState, useEffect } from 'react';
import {
    Button,
    Upload,
    Table,
    message,
    Typography,
    Spin,
    Breadcrumb,
    Modal,
    Tabs,
    Input,
    InputNumber,
    Switch,
    Space,
    Form,
    Divider,
    List,
    Badge,
    Tag,
    Alert
} from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    FileTextOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
    FileWordOutlined,
    FileImageOutlined,
    FileUnknownOutlined,
    InboxOutlined,
    FileSearchOutlined,
    LinkOutlined,
    BuildOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { useKnowledgeStore, KnowledgeFile } from '@/stores/knowledgeStore';
import type { UploadProps } from 'antd';
import Link from 'next/link';

const { Dragger } = Upload;
const { TabPane } = Tabs;

// 文件图标映射
const FileIcon = ({ type }: { type: string }) => {
    const lcType = type.toLowerCase();
    if (lcType === 'txt') return <FileTextOutlined />;
    if (lcType === 'pdf') return <FilePdfOutlined />;
    if (lcType === 'xlsx' || lcType === 'xls') return <FileExcelOutlined />;
    if (lcType === 'docx' || lcType === 'doc') return <FileWordOutlined />;
    if (lcType === 'jpg' || lcType === 'png' || lcType === 'jpeg' || lcType === 'gif') return <FileImageOutlined />;
    return <FileUnknownOutlined />;
};

// 状态图标映射
const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'done':
            return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
        case 'failed':
            return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
        case 'processing':
            return <SyncOutlined spin style={{ color: '#1890ff' }} />;
        case 'waiting':
            return <ClockCircleOutlined style={{ color: '#faad14' }} />;
        default:
            return <FileUnknownOutlined />;
    }
};

// 提取文件名
const getFileName = (filePath: string) => {
    const parts = filePath.split('/');
    return parts[parts.length - 1];
};

export default function KnowledgeDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const databaseId = Array.isArray(id) ? id[0] : id;
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [databaseInfo, setDatabaseInfo] = useState<any>(null);
    const {
        fetchDatabaseFiles,
        fetchDatabases,
        uploadFile,
        deleteFile,
        databases,
        databaseFiles,
        pendingFiles,
        generateChunks
    } = useKnowledgeStore();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<KnowledgeFile | null>(null);
    const [activeKey, setActiveKey] = useState('1');
    const [form] = Form.useForm();
    const [queryResult, setQueryResult] = useState<any>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [urlLoading, setUrlLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // 获取当前知识库的待处理文件
    const currentPendingFiles = pendingFiles[databaseId] || [];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                console.log('页面开始加载知识库数据:', { databaseId });

                // 先确保知识库列表已加载
                if (databases.length === 0) {
                    console.log('知识库列表为空，先加载知识库列表');
                    await fetchDatabases();
                }

                console.log('当前知识库列表:', databases);

                // 再获取文件列表 - 现在databaseId实际上是db_id
                await fetchDatabaseFiles(databaseId);

                // 获取数据库信息 - 现在要通过db_id查找
                const dbInfo = databases.find(db => db.db_id === databaseId);
                console.log('数据库信息:', dbInfo);
                if (dbInfo) {
                    setDatabaseInfo(dbInfo);
                } else {
                    // 如果还是找不到，可能是数据刚刚加载，再试一次
                    const updatedDatabases = useKnowledgeStore.getState().databases;
                    const updatedDbInfo = updatedDatabases.find(db => db.db_id === databaseId);
                    console.log('重新查找数据库信息:', updatedDbInfo);
                    if (updatedDbInfo) {
                        setDatabaseInfo(updatedDbInfo);
                    } else {
                        console.error('找不到对应的知识库:', { databaseId, availableDatabases: updatedDatabases });
                        message.error('知识库不存在或已被删除');
                    }
                }
            } catch (error) {
                console.error('页面加载失败:', error);
                const errorMessage = error instanceof Error ? error.message : '获取知识库文件失败';
                message.error(`加载失败: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        if (databaseId) {
            loadData();
        }
    }, [databaseId, fetchDatabaseFiles, fetchDatabases]); // 添加 fetchDatabases 依赖

    // 单独监听 databases 变化来更新 databaseInfo
    useEffect(() => {
        if (databases.length > 0 && databaseId && !databaseInfo) {
            const dbInfo = databases.find(db => db.db_id === databaseId);
            if (dbInfo) {
                console.log('从更新的知识库列表中找到数据库信息:', dbInfo);
                setDatabaseInfo(dbInfo);
            }
        }
    }, [databases, databaseId, databaseInfo]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            console.log('手动刷新知识库文件列表:', { databaseId });
            await fetchDatabaseFiles(databaseId);
            message.success('刷新成功');
        } catch (error) {
            console.error('刷新失败:', error);
            const errorMessage = error instanceof Error ? error.message : '刷新失败';
            message.error(`刷新失败: ${errorMessage}`);
        } finally {
            setRefreshing(false);
        }
    };

    const handleDelete = async () => {
        if (!fileToDelete) return;
        try {
            // 使用file_id进行删除
            await deleteFile(databaseId, fileToDelete.file_id);
            message.success('文件删除成功');
            setDeleteModalVisible(false);
            setFileToDelete(null);
        } catch (error) {
            message.error('文件删除失败');
        }
    };

    const showDeleteModal = (file: KnowledgeFile) => {
        setFileToDelete(file);
        setDeleteModalVisible(true);
    };

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: true,
        action: `http://localhost:8000/data/upload?db_id=${databaseId}`,
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList: false,
        beforeUpload: file => {
            // 检查文件大小
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                message.error('文件必须小于50MB!');
                return false;
            }
            return true;
        },
        onChange: async info => {
            if (info.file.status === 'uploading') {
                setUploading(true);
                return;
            }

            if (info.file.status === 'done') {
                setUploading(false);
                message.success(`${info.file.name} 文件上传成功`);

                try {
                    // 只上传文件，不生成分块
                    await uploadFile(databaseId, info.file.originFileObj as File);
                } catch (error) {
                    message.error('文件上传失败');
                }
            } else if (info.file.status === 'error') {
                setUploading(false);
                message.error(`${info.file.name} 文件上传失败`);
            }
        },
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            message.warning('请输入检索问题');
            return;
        }

        setSearchLoading(true);
        try {
            const result = await useKnowledgeStore.getState().queryTest(databaseId, query);
            setQueryResult(result);
        } catch (error) {
            message.error('检索失败');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleUrlSubmit = async () => {
        if (!urlInput.trim() || !urlInput.startsWith('http')) {
            message.warning('请输入有效的网址');
            return;
        }

        setUrlLoading(true);
        try {
            // 调用API上传URL - 现在databaseId就是db_id
            const response = await fetch('http://localhost:8000/data/add-by-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    db_id: databaseId,
                    url: urlInput
                })
            });

            if (!response.ok) {
                throw new Error('网址添加失败');
            }

            message.success('网址添加成功');
            setUrlInput('');

            // 刷新文件列表
            await fetchDatabaseFiles(databaseId);
        } catch (error) {
            console.error('添加网址失败:', error);
            message.error('添加网址失败');
        } finally {
            setUrlLoading(false);
        }
    };

    // 处理生成分块
    const handleGenerateChunks = async () => {
        if (currentPendingFiles.length === 0) {
            message.warning('没有待处理的文件');
            return;
        }

        const formValues = form.getFieldsValue();
        const params = {
            chunk_size: formValues.chunkSize || 1000,
            chunk_overlap: formValues.chunkOverlap || 200,
            use_parser: formValues.useParser || false
        };

        setGenerating(true);
        try {
            await generateChunks(databaseId, currentPendingFiles, params);
            message.success('文件分块生成并添加成功');
        } catch (error) {
            console.error('生成分块错误:', error);
            const errorMessage = error instanceof Error ? error.message : '生成分块失败';
            message.error(`生成分块失败: ${errorMessage}`);
        } finally {
            setGenerating(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (text: string, record: KnowledgeFile, index: number) => {
                // 计算考虑分页的自增ID：(当前页-1) * 页面大小 + 当前行索引 + 1
                const displayId = (currentPage - 1) * pageSize + index + 1;

                return (
                    <span className="text-sm text-gray-700">{displayId}</span>
                );
            }
        },
        {
            title: '文件名',
            dataIndex: 'filename',
            key: 'filename',
            render: (text: string, record: KnowledgeFile) => (
                <div className="flex items-center">
                    <FileIcon type={record.file_type || record.type || ''} />
                    <span className="ml-2">{text}</span>
                </div>
            ),
        },
        {
            title: '类型',
            dataIndex: 'file_type',
            key: 'file_type',
            width: 80,
            render: (text: string) => text?.toUpperCase() || 'UNKNOWN'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status: string) => <StatusIcon status={status} />
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
            render: (time: string) => {
                if (!time) return '无时间信息';
                try {
                    let date;

                    // 尝试不同的时间格式
                    if (typeof time === 'string' && time.includes('T')) {
                        // ISO 格式: 2024-01-01T12:00:00Z
                        date = new Date(time);
                    } else if (typeof time === 'string' && time.includes('-')) {
                        // 普通格式: 2024-01-01 12:00:00
                        date = new Date(time);
                    } else if (!isNaN(Number(time))) {
                        // 时间戳格式
                        const timestamp = Number(time);
                        // 如果是秒级时间戳，转换为毫秒
                        if (timestamp < 10000000000) {
                            date = new Date(timestamp * 1000);
                        } else {
                            date = new Date(timestamp);
                        }
                    } else {
                        date = new Date(time);
                    }

                    if (isNaN(date.getTime())) {
                        return '时间格式错误';
                    }

                    // 检查日期是否合理（不是1970年）
                    if (date.getFullYear() < 2000) {
                        return '时间数据异常';
                    }

                    return date.toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                } catch (error) {
                    return '时间解析错误';
                }
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
            render: (_: any, record: KnowledgeFile) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteModal(record)}
                >
                    删除
                </Button>
            ),
        },
    ];

    return (
        <div className="h-full w-full p-6 bg-white min-h-screen">
            <Breadcrumb className="mb-6">
                <Breadcrumb.Item>
                    <Link href="/data">
                        <div className="flex items-center">
                            <ArrowLeftOutlined />
                            <span className="ml-2">知识库列表</span>
                        </div>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{databaseInfo?.name || '知识库详情'}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="flex justify-between items-center mb-4">
                <Typography.Title level={3}>{databaseInfo?.name || '知识库详情'}</Typography.Title>
                {databaseInfo && (
                    <div className="flex items-center space-x-2">
                        {databaseInfo.embed_model && (
                            <Tag color="blue">{databaseInfo.embed_model}</Tag>
                        )}
                        {databaseInfo.dimension && (
                            <Tag color="green">{databaseInfo.dimension}</Tag>
                        )}
                        <span className="text-gray-500">
                            {Array.isArray(databaseFiles[databaseId]) ? databaseFiles[databaseId].length : 0} 文件 · {databaseInfo.db_id}
                        </span>
                    </div>
                )}
            </div>

            {databaseInfo?.description && (
                <Typography.Paragraph className="mb-4 text-gray-500">
                    {databaseInfo.description}
                </Typography.Paragraph>
            )}

            <Tabs
                activeKey={activeKey}
                onChange={setActiveKey}
                type="card"
                className="mb-4 h-full"
                style={{ height: 'calc(100vh - 200px)' }}
            >
                <TabPane
                    tab={
                        <span>
                            <FileTextOutlined />
                            文件列表
                        </span>
                    }
                    key="1"
                >
                    <div className="mb-4 flex justify-between items-center">
                        <Alert
                            message="已处理文件列表"
                            description="以下是已成功添加到知识库并完成分块处理的文件。"
                            type="success"
                            showIcon
                        />
                        <Button
                            onClick={handleRefresh}
                            loading={refreshing}
                            icon={<SyncOutlined />}
                        >
                            刷新
                        </Button>
                    </div>
                    <Spin spinning={loading}>
                        <Table
                            dataSource={Array.isArray(databaseFiles[databaseId]) ? databaseFiles[databaseId] : []}
                            columns={columns}
                            rowKey="file_id"
                            scroll={{ y: 'calc(100vh - 400px)' }}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                defaultPageSize: 20,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50', '100'],
                                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                                onChange: (page, size) => {
                                    setCurrentPage(page);
                                    if (size !== pageSize) {
                                        setPageSize(size);
                                    }
                                },
                                onShowSizeChange: (current, size) => {
                                    setCurrentPage(1); // 改变页面大小时回到第一页
                                    setPageSize(size);
                                }
                            }}
                        />
                    </Spin>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <UploadOutlined />
                            添加文件
                        </span>
                    }
                    key="2"
                >
                    <div className="flex gap-6">
                        {/* 左侧参数设置 */}
                        <div className="w-80 p-6 bg-gray-50 rounded-lg border">
                            <Typography.Title level={5} className="mb-4">分块参数设置</Typography.Title>
                            <Alert
                                message="参数说明"
                                description="调整分块参数可以控制文本的切分方式，影响检索质量和文档加载效率。"
                                type="info"
                                showIcon
                                className="mb-4"
                            />
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={{
                                    chunkSize: 1000,
                                    chunkOverlap: 200,
                                    useParser: false
                                }}
                            >
                                <Form.Item
                                    label="Chunk Size"
                                    name="chunkSize"
                                    help="每个文本片段的最大字符数"
                                >
                                    <InputNumber
                                        min={100}
                                        max={10000}
                                        style={{ width: '100%' }}
                                        placeholder="每个文本片段的字符数"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Chunk Overlap"
                                    name="chunkOverlap"
                                    help="相邻文本片段间的重叠字符数"
                                >
                                    <InputNumber
                                        min={0}
                                        max={5000}
                                        style={{ width: '100%' }}
                                        placeholder="相邻文本片段间的重叠字符数"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="使用文件节点解析器"
                                    name="useParser"
                                    help="启用特定文件格式的智能分析"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Form>
                        </div>

                        {/* 右侧上传区域 */}
                        <div className="flex-1">
                            <Tabs defaultActiveKey="1" className="mb-4">
                                <TabPane
                                    tab={
                                        <span>
                                            <UploadOutlined /> 上传文件
                                        </span>
                                    }
                                    key="1"
                                >
                                    <Dragger {...uploadProps}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">点击或者把文件拖拽到这里上传</p>
                                        <p className="ant-upload-hint">
                                            目前仅支持上传文本文件，如 .pdf, .txt, .md。且同名文件无法重复添加
                                        </p>
                                    </Dragger>
                                </TabPane>
                                <TabPane
                                    tab={
                                        <span>
                                            <LinkOutlined /> 输入网址
                                        </span>
                                    }
                                    key="2"
                                >
                                    <div className="p-4">
                                        <Typography.Paragraph className="text-gray-500 mb-4">
                                            输入网址添加到知识库，系统将自动抓取网页内容。
                                        </Typography.Paragraph>
                                        <Input.Search
                                            placeholder="输入网址，如 https://example.com/article"
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            enterButton="添加"
                                            loading={urlLoading}
                                            onSearch={handleUrlSubmit}
                                        />
                                    </div>
                                </TabPane>
                            </Tabs>

                            {/* 待处理文件列表 */}
                            {currentPendingFiles.length > 0 && (
                                <div className="p-4 border rounded-lg bg-gray-50">
                                    <div className="mb-4">
                                        <Badge count={currentPendingFiles.length} style={{ backgroundColor: '#1890ff' }}>
                                            <Typography.Title level={5} className="mb-0">待处理文件</Typography.Title>
                                        </Badge>
                                    </div>
                                    <Alert
                                        message="提示"
                                        description="以下文件已上传但尚未生成分块，点击'生成分块'按钮进行处理。"
                                        type="info"
                                        showIcon
                                        className="mb-4"
                                    />
                                    <List
                                        size="small"
                                        bordered
                                        dataSource={currentPendingFiles}
                                        renderItem={filePath => (
                                            <List.Item>
                                                <FileTextOutlined style={{ marginRight: 8 }} />
                                                {getFileName(filePath)}
                                                <Tag color="orange" className="ml-2">待处理</Tag>
                                            </List.Item>
                                        )}
                                        className="mb-4"
                                    />
                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={<BuildOutlined />}
                                            onClick={handleGenerateChunks}
                                            loading={generating}
                                        >
                                            生成分块
                                        </Button>
                                    </Space>
                                </div>
                            )}
                        </div>
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <FileSearchOutlined />
                            检索测试
                        </span>
                    }
                    key="3"
                >
                    <div className="p-4 border rounded-md">
                        <Typography.Title level={5}>检索测试</Typography.Title>
                        <Typography.Paragraph className="text-gray-500">
                            在此页面中可以测试知识库的检索效果，输入问题查看匹配结果。
                        </Typography.Paragraph>
                        <Input.Search
                            placeholder="输入检索问题"
                            allowClear
                            enterButton="检索"
                            size="large"
                            loading={searchLoading}
                            onSearch={handleSearch}
                        />

                        {queryResult && (
                            <div className="mt-4">
                                <Typography.Title level={5}>检索结果</Typography.Title>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <Typography.Title level={5}>回答：</Typography.Title>
                                    <Typography.Paragraph>
                                        {queryResult.answer || '未找到匹配结果'}
                                    </Typography.Paragraph>

                                    {queryResult.references && queryResult.references.length > 0 && (
                                        <>
                                            <Typography.Title level={5} className="mt-4">参考来源：</Typography.Title>
                                            <ul className="pl-5 list-disc">
                                                {queryResult.references.map((ref: any, index: number) => (
                                                    <li key={index} className="mb-2">
                                                        <div>
                                                            <strong>来源：</strong> {ref.source || '未知'}
                                                        </div>
                                                        {ref.text && (
                                                            <div className="bg-white p-2 rounded-md border mt-1">
                                                                {ref.text}
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </TabPane>
            </Tabs>

            <Modal
                title="确认删除"
                open={deleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setDeleteModalVisible(false)}
                okText="删除"
                cancelText="取消"
            >
                <p>确定要删除文件 "{fileToDelete?.filename}" 吗？此操作不可恢复。</p>
            </Modal>
        </div>
    );
} 