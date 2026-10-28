import { BaseApi } from './BaseApi';
import type { ApiResponse } from './types';

export class CommentsApi extends BaseApi {
  private static readonly resource = '/comments';

  listByPostId(postId: number): Promise<ApiResponse> {
    return this.get(CommentsApi.resource, { params: { postId } });
  }
}
