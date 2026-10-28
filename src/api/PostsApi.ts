import type { PostInput, PostPatch, PostUpdate } from '../schemas/post.schema';
import { BaseApi } from './BaseApi';
import type { ApiResponse } from './types';

export class PostsApi extends BaseApi {
  private static readonly resource = '/posts';

  getAll(): Promise<ApiResponse> {
    return this.get(PostsApi.resource);
  }

  getById(id: number): Promise<ApiResponse> {
    return this.get(`${PostsApi.resource}/${id}`);
  }

  create(payload: PostInput): Promise<ApiResponse> {
    return this.post(PostsApi.resource, { data: payload });
  }

  replace(id: number, payload: PostUpdate): Promise<ApiResponse> {
    return this.put(`${PostsApi.resource}/${id}`, { data: payload });
  }

  partialUpdate(id: number, payload: PostPatch): Promise<ApiResponse> {
    return this.patch(`${PostsApi.resource}/${id}`, { data: payload });
  }

  remove(id: number): Promise<ApiResponse> {
    return this.delete(`${PostsApi.resource}/${id}`);
  }
}
