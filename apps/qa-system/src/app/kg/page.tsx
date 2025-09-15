'use client';

import { useEffect, useState } from 'react';
import { useKGStore } from '@/stores/kgStore';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import { Card, Input, Button, notification, InputNumber, Modal, Upload, Space, message, Form, Spin } from 'antd';
import { UploadOutlined, InboxOutlined, FileTextOutlined, SyncOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

export default function KGPage() {
    const {
        graphInfo,
        graphData,
        isLoading,
        error,
        isRunning,
        searchLoading,
        indexing,
        fetchGraphInfo,
        fetchGraphNodes,
        searchNode,
        checkDatabaseStatus,
        addEntitiesByFile,
        indexNodes
    } = useKGStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [nodeCount, setNodeCount] = useState(100);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);
    const [form] = Form.useForm();

    // 计算未索引节点数量
    const unindexedCount = graphInfo?.unindexed_node_count || 0;

    // 计算图谱描述
    const graphDescription = () => {
        if (!graphInfo) return '';
        const dbName = graphInfo.graph_name || '';
        const entityCount = graphInfo.entity_count || 0;
        const relationCount = graphInfo.relationship_count || 0;
        const unindexed = unindexedCount > 0 ? `，${unindexedCount}个节点未索引` : '';

        let description = `${dbName} - 共 ${entityCount} 实体，${relationCount} 个关系`;

        // 只有当存在向量模型时才显示
        if (graphInfo.embed_model_name) {
            description += `。向量模型：${graphInfo.embed_model_name}`;
        }

        description += unindexed;

        return description;
    };

    useEffect(() => {
        // 添加错误处理，防止API调用失败导致页面崩溃
        const loadData = async () => {
            try {
                setLocalError(null);
                // 检查数据库状态
                await checkDatabaseStatus();
                // 先获取图谱信息
                await fetchGraphInfo();
                // 再获取节点数据
                await fetchGraphNodes(nodeCount);
            } catch (err: any) {
                console.error('加载图数据库信息失败:', err);
                setLocalError(err.message || '加载图谱数据失败，请稍后再试');
            }
        };

        loadData();
    }, []);

    // 当store中的error状态变化时，显示错误通知
    useEffect(() => {
        if (error) {
            notification.error({
                message: '操作失败',
                description: error,
                placement: 'top',
                duration: 3 // 3秒后自动关闭
            });
        }
    }, [error]);

    // 使用本地错误状态显示错误信息
    useEffect(() => {
        if (localError) {
            notification.error({
                message: '加载失败',
                description: localError,
                placement: 'top',
                duration: 3 // 3秒后自动关闭
            });
        }
    }, [localError]);

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            notification.warning({
                message: '请输入搜索内容',
                placement: 'top'
            });
            return;
        }
        searchNode(searchQuery);
    };

    const handleFetchNodes = () => {
        fetchGraphNodes(nodeCount);
    };

    const showUploadModal = () => {
        setIsUploadModalVisible(true);
    };

    const handleFileUpload = (info: any) => {
        setFileList(info.fileList);
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        fileList: fileList,
        // 改为手动上传，不使用内置action
        action: undefined,
        beforeUpload: (file: any) => {
            // 仅校验与拦截自动上传
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                message.error('文件必须小于10MB!');
                return Upload.LIST_IGNORE;
            }
            setFileList([file]);
            return false; // 阻止 antd 自动上传
        },
        onRemove: () => {
            setFileList([]);
        },
        onChange: handleFileUpload,
    } as any;

    const handleUpload = async () => {
        if (!fileList.length) {
            message.warning('请先选择文件');
            return;
        }

        const rawFile: File = fileList[0].originFileObj || fileList[0];

        setProcessing(true);

        try {
            message.loading('正在添加实体到图数据库...');

            const result = await addEntitiesByFile(rawFile, {
                // 不显式指定 language，交由前端自动检测
                kgdbName: 'neo4j'
            });

            if (result.success) {
                message.success(result.message || '添加成功');
                setIsUploadModalVisible(false);
                setFileList([]);

                // 刷新图谱信息
                fetchGraphInfo();
                fetchGraphNodes(nodeCount);
            } else {
                message.error(result.message || '添加实体失败');
            }
        } catch (error: any) {
            console.error('上传失败:', error);
            const errorMsg = error.message || '上传文件失败';
            notification.error({
                message: '上传失败',
                description: errorMsg,
                placement: 'top'
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleIndexNodes = async () => {
        if (unindexedCount === 0) {
            message.info('没有需要添加索引的节点');
            return;
        }

        try {
            const result = await indexNodes();
            if (result.success) {
                message.success(result.message);
                // 刷新图谱信息
                fetchGraphInfo();
            } else {
                message.error(result.message);
            }
        } catch (error: any) {
            message.error('添加索引失败');
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* 标题栏 */}
            <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold mr-4">知识图谱</h1>
                    {/* 数据库状态指示器 */}
                    <div className="flex items-center mr-4">
                        <div
                            className={`w-3 h-3 rounded-full mr-2 ${isLoading ? 'bg-yellow-500' :
                                isRunning ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            title={
                                isLoading ? '加载中' :
                                    isRunning ? '已连接' : '已关闭'
                            }
                        />
                    </div>
                </div>

                {/* 右上角按钮 */}
                <Space>
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        onClick={showUploadModal}
                        className="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                    >
                        上传文件
                    </Button>
                    {unindexedCount > 0 && (
                        <Button
                            type="primary"
                            icon={<SyncOutlined />}
                            onClick={handleIndexNodes}
                            loading={indexing}
                            className="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                        >
                            为{unindexedCount}个节点添加索引
                        </Button>
                    )}
                </Space>
            </div>

            {/* 图谱信息 */}
            {graphInfo && (
                <div className="px-4 py-2 border-b bg-gray-50">
                    <p className="text-sm text-gray-700">{graphDescription()}</p>
                </div>
            )}

            {/* 操作栏 */}
            <div className="flex justify-between p-4 border-b bg-white">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="输入要查询的实体"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ width: '200px' }}
                    />
                    <Button
                        type="primary"
                        onClick={handleSearch}
                        loading={searchLoading}
                        disabled={searchLoading}
                    >
                        检索实体
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <InputNumber
                        min={10}
                        max={1000}
                        value={nodeCount}
                        onChange={(value) => setNodeCount(value || 100)}
                        style={{ width: '100px' }}
                    />
                    <Button onClick={handleFetchNodes} loading={isLoading}>
                        获取节点
                    </Button>
                    <Button
                        onClick={() => {
                            fetchGraphInfo();
                            fetchGraphNodes(nodeCount);
                        }}
                    >
                        刷新数据
                    </Button>
                </div>
            </div>

            {/* 图谱可视化区域 */}
            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                        <Spin size="large" tip="加载中..." />
                    </div>
                )}
                {(!graphData || graphData.nodes.length === 0) && !isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center p-8">
                            <p className="text-gray-500 mb-4">暂无图谱数据</p>
                            <Button onClick={handleFetchNodes} type="primary">
                                获取节点数据
                            </Button>
                        </div>
                    </div>
                ) : (
                    <KnowledgeGraph
                        data={graphData}
                        loading={isLoading}
                    />
                )}
            </div>

            {/* 上传模态框 */}
            <Modal
                title="上传文件"
                open={isUploadModalVisible}
                onOk={handleUpload}
                onCancel={() => {
                    setIsUploadModalVisible(false);
                    setFileList([]);
                }}
                okText="添加到图数据库"
                cancelText="取消"
                okButtonProps={{ disabled: fileList.length === 0 }}
                confirmLoading={processing}
                width={600}
            >
                <div className="p-4">
                    {graphInfo?.embed_model_name && (
                        <div className="mb-4">
                            <p>当前图数据库向量模型：{graphInfo.embed_model_name}</p>
                        </div>
                    )}
                    {!graphInfo?.embed_model_name && (
                        <div className="mb-4">
                            <p>第一次创建之后将无法修改向量模型</p>
                        </div>
                    )}

                    <div className="mb-4">
                        <Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                            <p className="ant-upload-hint">目前仅支持上传 jsonl 文件。且同名文件无法重复添加。</p>
                        </Dragger>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 