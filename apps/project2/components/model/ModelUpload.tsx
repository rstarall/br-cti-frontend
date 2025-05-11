import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogFooter } from '@/components/ui/dialog';
import { useLocalMLStore } from '@/store/localMLStore';

interface ModelUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelUpload({ isOpen, onClose }: ModelUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState('');
  const [modelType, setModelType] = useState('1');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addTask } = useLocalMLStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('请选择文件');
      return;
    }

    if (!modelName) {
      setError('请输入模型名称');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a mock file hash
      const fileHash = Math.random().toString(36).substring(2, 10);
      const fileId = Math.random().toString(36).substring(2, 8);

      // Add task to store
      addTask({
        file_id: fileId,
        file_hash: fileHash,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        status: {
          upload: true,
          train: false,
          info: false,
          upchain: false
        },
        progress: {
          upload: 100,
          train: 0,
          info: 0,
          upchain: 0
        }
      });

      // Close dialog and reset form
      onClose();
      resetForm();

    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setModelName('');
    setModelType('1');
    setDescription('');
    setError(null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="上传模型"
      className="max-w-lg"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">选择文件</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            onChange={handleFileChange}
            accept=".zip,.tar.gz,.pkl,.h5,.pt,.pb"
          />
          {selectedFile && (
            <div className="text-sm text-gray-500">
              已选择: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">模型名称</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="请输入模型名称"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">模型类型</label>
          <select
            className="w-full p-2 border rounded"
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
          >
            <option value="1">B&R检测</option>
            <option value="2">正则优化</option>
            <option value="3">漏洞分析</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">模型描述</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="请输入模型描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </div>

      <DialogFooter className="mt-6">
        <Button
          variant="outline"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          取消
        </Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          isLoading={isUploading}
        >
          上传
        </Button>
      </DialogFooter>
    </Dialog>
  );
}


