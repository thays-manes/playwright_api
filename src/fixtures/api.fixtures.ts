import { test as base } from '@playwright/test';
import { CommentsApi } from '../api/CommentsApi';
import { PostsApi } from '../api/PostsApi';
import { UsersApi } from '../api/UsersApi';

interface ApiFixtures {
  postsApi: PostsApi;
  usersApi: UsersApi;
  commentsApi: CommentsApi;
}

/**
 * Cada teste recebe instâncias novas dos API Objects sobre o `request` do próprio teste,
 * que o Playwright cria e descarta automaticamente (isolamento e liberação de recursos).
 */
export const test = base.extend<ApiFixtures>({
  postsApi: async ({ request }, use, testInfo) => {
    await use(new PostsApi(request, testInfo));
  },
  usersApi: async ({ request }, use, testInfo) => {
    await use(new UsersApi(request, testInfo));
  },
  commentsApi: async ({ request }, use, testInfo) => {
    await use(new CommentsApi(request, testInfo));
  },
});

export { expect } from '@playwright/test';
