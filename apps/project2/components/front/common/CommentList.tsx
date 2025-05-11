import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 根据后端结构定义评论接口
interface Comment {
  comment_id: string;           // 评论ID
  user_id?: string;             // 用户ID
  user_name?: string;           // 用户名称 (前端展示用，后端没有直接提供)
  user_level?: number;          // 用户等级(1:普通用户value<1000、2:高级用户value>1000、3:专家用户value>20000)
  comment_doc_type?: string;    // 评论文档类型(cti:情报、model:模型)
  comment_ref_id?: string;      // 评论关联ID(情报ID、模型ID)
  comment_score?: number;       // 评论分数
  comment_status?: number;      // 评论状态(1:待审核、2:已审核、3:已拒绝)
  comment_content?: string;     // 评论内容
  create_time?: string;         // 创建时间
  doctype?: string;             // 文档类型(comment)
}

interface CommentListProps {
  comments?: Comment[];
  className?: string;
}

export function CommentList({ comments = [], className = '' }: CommentListProps) {
  // 确保comments是数组
  const validComments = Array.isArray(comments) ? comments : [];

  return (
    <div className={`space-y-6 ${className} cursor-default`}>
      {validComments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          暂无评论
        </div>
      ) : (
        validComments.map((comment) => (
          <CommentItem
            key={comment.comment_id || `comment-${Math.random().toString(36).slice(2, 11)}`}
            comment={comment}
          />
        ))
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  // 格式化时间
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
    } catch (error) {
      return timeString;
    }
  };

  // 获取用户名首字母或默认值
  const getUserInitial = () => {
    if (!comment.user_id) {
      return '用';  // 用户的首字母
    }
    return comment.user_id.charAt(0);
  };

  // 获取显示的用户名或默认值
  const getDisplayName = () => {
    return `用户${comment.user_id?.substring(0, 6) || ''}`;
  };

  // 获取用户等级标签
  const getUserLevelTag = () => {
    const level = comment.user_level || 1;
    let levelText = '普通用户';
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-600';

    if (level === 2) {
      levelText = '高级用户';
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-600';
    } else if (level === 3) {
      levelText = '专家用户';
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-600';
    }

    return (
      <span className={`text-xs ${bgColor} ${textColor} px-2 py-0.5 rounded-full ml-2`}>
        {levelText}
      </span>
    );
  };

  // 计算评分星星 (将评分转换为0-5的范围)
  const getStarRating = () => {
    const score = comment.comment_score || 0;
    // 假设后端评分是0-100，转换为0-5
    return Math.round(score / 20);
  };

  return (
    <div className="border-b pb-6">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
            {getUserInitial()}
          </div>
          <div className="ml-3">
            <div className="font-medium flex items-center">
              {getDisplayName()}
              {getUserLevelTag()}
            </div>
            <div className="text-xs text-gray-500">{formatTime(comment.create_time || '')}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < getStarRating() ? 'text-yellow-500' : 'text-gray-300'}>★</span>
            ))}
          </div>
          <div className="ml-2 text-sm font-medium">{comment.comment_score || 0}</div>
        </div>
      </div>
      <div className="text-gray-700 whitespace-pre-line">
        {comment.comment_content || ''}
      </div>
    </div>
  );
}
