// Comment API Types

// 根据后端结构定义评论信息接口
export interface CommentInfo {
  comment_id: string;           // 评论ID
  user_id: string;              // 用户ID
  user_name: string;            // 用户名称 (前端展示用，后端没有直接提供)
  user_level?: number;          // 用户等级(1:普通用户value<1000、2:高级用户value>1000、3:专家用户value>20000)
  comment_doc_type?: string;    // 评论文档类型(cti:情报、model:模型)
  comment_ref_id?: string;      // 评论关联ID(情报ID、模型ID)
  comment_score: number;        // 评论分数
  comment_status?: number;      // 评论状态(1:待审核、2:已审核、3:已拒绝)
  comment_content: string;      // 评论内容
  create_time: string;          // 创建时间
  doctype?: string;             // 文档类型(comment)
}

export interface CommentListResponse {
  comment_infos: CommentInfo[];
  total: number;
  page: number;
  page_size: number;
}

export interface CommentData {
  comment_ref_id: string;       // 评论关联ID(情报ID、模型ID)
  comment_score: number;        // 评论分数
  comment_content: string;      // 评论内容
  comment_doc_type: string;     // 评论文档类型(cti:情报、model:模型)
}

export interface RegisterCommentRequest {
  wallet_id: string;            // 钱包ID
  password: string;             // 钱包密码
  comment_data: CommentData;    // 评论数据
}

export interface RegisterCommentResponse {
  code: number;                 // 状态码
  message: string;              // 消息
  data: {
    comment_id: string;         // 评论ID
    transaction_id?: string;    // 交易ID
  };
}
