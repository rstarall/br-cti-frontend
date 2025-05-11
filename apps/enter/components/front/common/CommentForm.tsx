import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal, Input, Form, message } from 'antd';

interface CommentFormProps {
  onSubmit: (content: string, score: number, password: string) => Promise<void>;
  className?: string;
}

export function CommentForm({ onSubmit, className = '' }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [score, setScore] = useState(50); // 默认50分
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      message.error('请输入评论内容');
      return;
    }

    if (score < 0 || score > 100) {
      message.error('评分必须在0-100之间');
      return;
    }

    // 打开密码输入弹窗
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    if (!password) {
      message.error('请输入密码');
      return;
    }

    setIsSubmitting(true);
    setIsModalOpen(false);

    try {
      await onSubmit(content, score, password);
      setContent('');
      setScore(50);
      setPassword('');
      message.success('评论提交成功');
    } catch (error) {
      console.error('提交评论失败:', error);
      message.error('提交评论失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setPassword('');
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setScore(Math.min(100, Math.max(0, value)));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            评价分数 (0-100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={handleScoreChange}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            评论内容
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="请输入您的评论..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting || !content.trim()}
          >
            提交评论
          </Button>
        </div>
      </form>

      <Modal
        title="请输入钱包密码"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ loading: isSubmitting }}
      >
        <Form layout="vertical">
          <Form.Item label="钱包密码" required>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入您的钱包密码"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
