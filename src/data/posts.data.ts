import type { PostInput, PostPatch, PostUpdate } from '../schemas/post.schema';

export const EXISTING_POST_ID = 1;
export const NON_EXISTENT_POST_ID = 999_999;

export const newPost: PostInput = {
  userId: 1,
  title: 'Post criado pela automação',
  body: 'Conteúdo enviado no teste de criação (POST /posts).',
};

export const replacedPost: PostUpdate = {
  id: EXISTING_POST_ID,
  userId: 1,
  title: 'Título substituído via PUT',
  body: 'Corpo substituído via PUT.',
};

export const partialPostUpdate: PostPatch = {
  title: 'Título alterado via PATCH',
};
