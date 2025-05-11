import api from './api';
import { CommentInfo, CommentListResponse, RegisterCommentRequest, RegisterCommentResponse } from './types/comment';

/**
 * Comment API functions
 */
export const commentApi = {
  /**
   * Register a new comment
   * @param walletId Wallet ID
   * @param password Wallet password
   * @param refId Reference ID (CTI ID or Model ID)
   * @param score Comment score (0-100)
   * @param content Comment content
   * @param docType Document type ('cti' or 'model')
   * @returns Promise with comment registration information
   */
  registerComment: async (
    walletId: string,
    password: string,
    refId: string,
    score: number,
    content: string,
    docType: 'cti' | 'model'
  ): Promise<RegisterCommentResponse> => {
    const request: RegisterCommentRequest = {
      wallet_id: walletId,
      password: password,
      comment_data: {
        comment_ref_id: refId,
        comment_score: score,
        comment_content: content,
        comment_doc_type: docType
      }
    };

    const response = await api.post('/comment/registerComment', request);
    return response.data;
  },

  /**
   * Query comments by reference ID
   * @param refId Reference ID (CTI ID or Model ID)
   * @param page Page number
   * @param pageSize Page size
   * @param sort Sort field (default: 'create_time')
   * @returns Promise with comment list
   */
  queryCommentsByRefId: async (
    refId: string,
    page: number = 1,
    pageSize: number = 10,
    sort: string = 'create_time'
  ): Promise<CommentListResponse> => {
    try {
      const response = await api.post('/comment/queryCommentsByRefID', {
        ref_id: refId,
        page,
        page_size: pageSize,
        sort
      });

      console.log('Comment API response:', response);

      if (response.data && response.data.result) {
        return JSON.parse(response.data.result);
      }

      // If no data or result is returned, return empty response
      return {
        comment_infos: [],
        total: 0,
        page: page,
        page_size: pageSize
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Return empty response on error
      return {
        comment_infos: [],
        total: 0,
        page: page,
        page_size: pageSize
      };
    }
  }
};
