import { POST_ID_WITH_COMMENTS, POST_ID_WITHOUT_COMMENTS } from '../../src/data/comments.data';
import { expect, test } from '../../src/fixtures/api.fixtures';
import { CommentListSchema } from '../../src/schemas/comment.schema';
import { describeResponse } from '../../src/utils/describeResponse';
import { validateSchema } from '../../src/utils/schemaValidation';

test.describe('Comments', () => {
  test('GET /comments?postId=1 retorna 200 e apenas comentários do post 1', { tag: ['@comments', '@leitura'] }, async ({ commentsApi }) => {
    const response = await commentsApi.listByPostId(POST_ID_WITH_COMMENTS);

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 200')).toBe(200);
    });

    const comments = await test.step('Contrato Comment[]', () => validateSchema(CommentListSchema, response.body, 'Comment[]'));

    await test.step('Response body', async () => {
      expect(comments.length, 'O post 1 deve ter comentários').toBeGreaterThan(0);
      const outOfFilter = comments.filter((comment) => comment.postId !== POST_ID_WITH_COMMENTS);
      expect(outOfFilter, `Todos os comentários devem ter postId === ${POST_ID_WITH_COMMENTS}`).toEqual([]);
    });
  });

  test('GET /comments?postId=999999 retorna 200 com lista vazia para filtro sem correspondência', { tag: ['@comments', '@negativo'] }, async ({ commentsApi }) => {
    const response = await commentsApi.listByPostId(POST_ID_WITHOUT_COMMENTS);

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 200 mesmo sem resultados')).toBe(200);
    });

    const comments = await test.step('Contrato Comment[]', () => validateSchema(CommentListSchema, response.body, 'Comment[]'));

    await test.step('Response body', async () => {
      expect(comments, 'Filtro sem correspondência deve retornar lista vazia').toEqual([]);
    });
  });
});
