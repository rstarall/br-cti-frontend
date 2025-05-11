'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Button, List, Modal, Input, Tooltip, Spin, Empty, Alert, Tag, Typography } from 'antd';
import { SettingOutlined, DownloadOutlined, CloseOutlined, FolderOpenOutlined, CheckCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { useMessage } from '@/provider/MessageProvider';
import { useCtiStore } from '@/store/ctiStore';
import { useIPFSDownloadStore } from '@/store/ipfsDownloadStore';
import { ipfsApi } from '@/api/ipfs';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useWindowManager } from '@/provider/WindowManager';
import { IPFSContentViewer } from '@/components/front/cti-market/IPFSContentViewer';

interface CTISidebarProps {
  visible: boolean;
  onClose: () => void;
}

export function CTISidebar({ visible, onClose }: CTISidebarProps) {
  const { ownCtiList, isLoading, error, fetchOwnCtiList } = useCtiStore();
  const { downloadDirectory, setDownloadDirectory, addDownloadedFile, downloadHistory, getDownloadedFileByHash } = useIPFSDownloadStore();
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [newDownloadDirectory, setNewDownloadDirectory] = useState(downloadDirectory);
  const [downloadingHash, setDownloadingHash] = useState<string | null>(null);
  const { openWindow, openModalWindow } = useWindowManager();
  const { messageApi } = useMessage();

  // 重新下载确认模态框状态
  const [redownloadModalVisible, setRedownloadModalVisible] = useState(false);
  const [selectedCtiForRedownload, setSelectedCtiForRedownload] = useState<any>(null);

  // 使用useMemo创建带有下载状态的CTI列表
  const ctisWithDownloadStatus = useMemo(() => {
    return ownCtiList.map(cti => {
      const ipfsHash = cti.data_source_ipfs_hash||''; //使用源文件数据
      const downloadInfo = getDownloadedFileByHash(ipfsHash);
      return {
        ...cti,
        downloaded: !!downloadInfo,
        downloadInfo
      };
    });
  }, [ownCtiList, downloadHistory, getDownloadedFileByHash]);

  // 加载用户拥有的情报列表
  useEffect(() => {
    if (visible) {
      fetchOwnCtiList();
    }
  }, [visible, fetchOwnCtiList]);

  // 格式化时间
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
    } catch (error) {
      return timeString;
    }
  };

  // 打开设置模态框
  const showSettingsModal = () => {
    setNewDownloadDirectory(downloadDirectory);
    setIsSettingsModalVisible(true);
  };

  // 保存设置
  const saveSettings = () => {
    setDownloadDirectory(newDownloadDirectory);
    setIsSettingsModalVisible(false);
    messageApi.success('下载目录设置已保存');
  };

  // 下载情报文件
  const handleDownload = async (cti: any) => {
    try {
      // 直接下载数据源
      const ipfsHash = cti.data_source_ipfs_hash||'';
      console.log('使用的IPFS哈希:', ipfsHash);

      if (!ipfsHash) {
        console.error('情报哈希为空');
        messageApi.error('IPFS地址为空，无法下载');
        return;
      }

      if (!downloadDirectory) {
        console.warn('下载目录未设置');
        messageApi.warning('请先设置下载目录');
        showSettingsModal();
        return;
      }

      setDownloadingHash(ipfsHash);
      console.log('设置下载中状态:', ipfsHash);

      try {
        // 调用API下载文件
        const result = await ipfsApi.downloadFileToPath(ipfsHash, downloadDirectory);
        console.log('下载结果:', result);

        if (!result || !result.file_path) {
          console.error('下载结果无效:', result);
          messageApi.error('下载失败：服务器返回无效结果');
          return;
        }

        // 从ownCtiList中找到对应的CTI
        const cti = ownCtiList.find(item => (item.ipfs_hash || item.hash) === ipfsHash);
        console.log('找到对应CTI:', cti);

        if (cti) {
          // 创建文件名
          const fileName = `${cti.cti_name || 'cti'}_${ipfsHash.substring(0, 8)}.txt`;

          // 添加下载记录
          addDownloadedFile({
            hash: ipfsHash,
            filePath: result.file_path,
            fileName: fileName,
            fileSize: cti.data_size || 0
          });

          console.log('添加下载记录成功:', {
            hash: ipfsHash,
            filePath: result.file_path,
            fileName
          });
        } else {
          console.warn('未找到对应的CTI信息');

          // 即使没有找到CTI信息，也添加基本下载记录
          const fileName = `cti_${ipfsHash.substring(0, 8)}.txt`;
          addDownloadedFile({
            hash: ipfsHash,
            filePath: result.file_path,
            fileName: fileName,
            fileSize: 0
          });
        }

        messageApi.success('情报文件下载成功');
        // 刷新CTI列表以更新下载状态
        fetchOwnCtiList();
      } catch (error) {
        console.error('下载失败:', error);

        // 提供更具体的错误信息
        if (error instanceof Error) {
          messageApi.error(`下载失败: ${error.message}`);
        } else {
          messageApi.error('情报文件下载失败');
        }
      } finally {
        setDownloadingHash(null); // 重置下载状态
      }
    } catch (error) {
      console.error('下载处理失败:', error);
      setDownloadingHash(null);

      if (error instanceof Error) {
        messageApi.error(`下载处理失败: ${error.message}`);
      } else {
        messageApi.error('情报文件下载处理失败');
      }
    }
  };

  // 查看情报内容
  const handleViewContent = (cti: any) => {
    // 优先使用ipfs_hash，如果不存在则使用hash
    // const ipfsHash = cti.ipfs_hash || cti.hash;
    const ipfsHash = cti.data_source_ipfs_hash || cti.ipfs_hash;
    if (!ipfsHash) {
      messageApi.error('情报哈希为空，无法查看内容');
      return;
    }

    openWindow(
      `查看情报内容: ${cti.cti_name}`,
      <IPFSContentViewer ipfsHash={ipfsHash} />,
      '800px',
      '600px',
      'view-cti-context',
       false
    );
  };

  // 显示文件路径窗口
  const showFilePathWindow = (filePath: string) => {
    const FilePathContent = () => {
      const { Text, Paragraph } = Typography;

      const handleCopy = () => {
        navigator.clipboard.writeText(filePath)
          .then(() => messageApi.success('文件路径已复制到剪贴板'))
          .catch(() => messageApi.error('复制失败，请手动复制'));
      };

      return (
        <div className="p-1">
          <div className="mb-1">
            <Text strong>文件保存位置:</Text>
          </div>
          <div className="bg-gray-50 p-3 rounded border mb-4">
            <Paragraph
              className="mb-0"
              copyable={{
                text: filePath,
                onCopy: () => messageApi.success('文件路径已复制到剪贴板')
              }}
            >
              {filePath}
            </Paragraph>
          </div>
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={handleCopy}
            >
              复制路径
            </Button>
          </div>
        </div>
      );
    };

    openWindow(
      '文件位置',
      <FilePathContent />,
      '450px',
      '250px',
      'file-path-window',
      false
    );
  };

  // 重新下载文件
  const handleRedownload = (cti: any) => {
    // 设置选中的CTI并显示确认对话框
    setSelectedCtiForRedownload(cti);
    setRedownloadModalVisible(true);
  };

  // 确认重新下载
  const confirmRedownload = () => {
    if (selectedCtiForRedownload) {
      // 关闭对话框
      setRedownloadModalVisible(false);
      // 调用下载函数
      handleDownload(selectedCtiForRedownload);
    }
  };

  // 取消重新下载
  const cancelRedownload = () => {
    setRedownloadModalVisible(false);
    setSelectedCtiForRedownload(null);
  };

  if (!visible) return null;

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">我的情报库</h3>
        <div className="flex space-x-2">
          <Button
            icon={<SettingOutlined />}
            size="small"
            onClick={showSettingsModal}
            title="设置下载目录"
          />
          <Button
            icon={<CloseOutlined />}
            size="small"
            onClick={onClose}
            title="关闭"
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-red-500 mb-2">加载失败</div>
            <div className="text-gray-500 text-sm">{error}</div>
            <Button
              size="small"
              className="mt-2"
              onClick={() => fetchOwnCtiList()}
            >
              重试
            </Button>
          </div>
        ) : ownCtiList.length === 0 ? (
          <Empty description="暂无情报数据" />
        ) : (
          <List
            dataSource={ctisWithDownloadStatus}
            renderItem={(cti) => (
              <List.Item className="border-b py-2">
                <div className="w-full">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Tooltip title={cti.cti_name}>
                        <div className="font-medium truncate max-w-[150px]">{cti.cti_name}</div>
                      </Tooltip>
                      {cti.downloaded && (
                        <Tooltip title="已下载">
                          <Tag color="success" className="ml-2 flex items-center">
                            <CheckCircleOutlined className="mr-1" />已下载
                          </Tag>
                        </Tooltip>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{formatTime(cti.create_time)}</div>
                  </div>

                  <div className="flex mt-1 text-xs text-gray-500">
                    <div>类型: {cti.cti_type === 1 ? '恶意流量' :
                              cti.cti_type === 2 ? '蜜罐情报' :
                              cti.cti_type === 3 ? '僵尸网络' :
                              cti.cti_type === 4 ? '应用层攻击' :
                              cti.cti_type === 5 ? '开源情报' : '未知'}</div>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Button
                      type="link"
                      size="small"
                      className="p-0 h-auto"
                      onClick={() => handleViewContent(cti)}
                    >
                      查看内容
                    </Button>

                    {cti.downloaded ? (
                      <div className="flex space-x-1">
                        <Button
                          type="text"
                          size="small"
                          icon={<FolderOpenOutlined />}
                          onClick={() => cti.downloadInfo && showFilePathWindow(cti.downloadInfo.filePath)}
                          title="查看文件位置"
                        >
                          位置
                        </Button>
                        <Button
                          type="text"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => handleRedownload(cti)}
                          title="重新下载"
                        >
                          下载
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="text"
                        size="small"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(cti)}
                        loading={downloadingHash === (cti.ipfs_hash || cti.hash)}
                      >
                        下载
                      </Button>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>

      {/* 设置模态框 */}
      <Modal
        title="下载设置"
        open={isSettingsModalVisible}
        onOk={saveSettings}
        onCancel={() => setIsSettingsModalVisible(false)}
      >
        <div className="mb-4">
          <div className="mb-2">下载目录:</div>
          <div className="flex space-x-2">
            <Input
              value={newDownloadDirectory}
              onChange={(e) => setNewDownloadDirectory(e.target.value)}
              placeholder="请输入下载目录路径"
              suffix={<FolderOpenOutlined />}
              className="flex-1"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            请输入完整的目录路径，例如: C:\Users\Username\Downloads\CTI
          </div>
          <Alert
            className="mt-2 pl-3"
            type="info"
            showIcon
            message="关于文件路径"
            description={
              <div className="text-xs">
                <p>请确保输入的路径存在且有写入权限，否则下载可能会失败。</p>
                <ol className="list-decimal pl-4 mt-1">
                  <li>输入完整路径，包括驱动器盘符（如C:）</li>
                  <li>确保目录已存在，系统不会自动创建不存在的目录</li>
                  <li>下载后可以通过"位置"按钮查看文件保存位置</li>
                </ol>
              </div>
            }
          />
        </div>
      </Modal>

      {/* 重新下载确认模态框 */}
      <Modal
        title="重新下载确认"
        open={redownloadModalVisible}
        onOk={confirmRedownload}
        onCancel={cancelRedownload}
        okText="确定"
        cancelText="取消"
      >
        <p>您确定要重新下载此文件吗？这将覆盖已有的文件。</p>
      </Modal>
    </div>
  );
}
