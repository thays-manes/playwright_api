import { BaseApi } from './BaseApi';
import type { ApiResponse } from './types';

export class UsersApi extends BaseApi {
  private static readonly resource = '/users';

  getAll(): Promise<ApiResponse> {
    return this.get(UsersApi.resource);
  }

  getById(id: number): Promise<ApiResponse> {
    return this.get(`${UsersApi.resource}/${id}`);
  }
}
