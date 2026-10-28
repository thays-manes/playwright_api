import { EXISTING_POST_ID, NON_EXISTENT_POST_ID, newPost, partialPostUpdate, replacedPost } from '../../src/data/posts.data';
import { expect, test } from '../../src/fixtures/api.fixtures';
import { EmptyObjectSchema } from '../../src/schemas/common.schema';
import { CreatedPostSchema, PostListSchema, PostSchema } from '../../src/schemas/post.schema';
import { describeResponse } from '../../src/utils/describeResponse';
import { validateSchema } from '../../src/utils/schemaValidation';

test.describe('Posts', () => {
  test('GET /posts retorna 200 e uma lista não vazia de posts válidos', { tag: ['@posts', '@leitura'] }, async ({ postsApi }) => {
    const response = await postsApi.getAll();

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 200')).toBe(200);
    });

    const posts = await test.step('Contrato Post[]', () => validateSchema(PostListSchema, response.body, 'Post[]'));

    await test.step('Response body', async () => {
      expect(posts.length, 'A lista de posts não deve ser vazia').toBeGreaterThan(0);
      const ids = posts.map((post) => post.id);
      expect(new Set(ids).size, 'Os IDs dos posts devem ser únicos').toBe(ids.length);
    });
  });

  test('GET /posts/1 retorna 200 e o post de ID 1', { tag: ['@posts', '@leitura'] }, async ({ postsApi }) => {
    const response = await postsApi.getById(EXISTING_POST_ID);

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 200')).toBe(200);
    });

    const post = await test.step('Contrato Post', () => validateSchema(PostSchema, response.body, 'Post'));

    await test.step('Response body', async () => {
      expect(post.id, 'O post retornado deve ser o solicitado').toBe(EXISTING_POST_ID);
      expect(typeof post.userId, 'userId deve ser numérico').toBe('number');
    });
  });

  test('GET /posts/999999 retorna 404 com objeto vazio para ID inexistente', { tag: ['@posts', '@negativo'] }, async ({ postsApi }) => {
    const response = await postsApi.getById(NON_EXISTENT_POST_ID);

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 404 para post inexistente')).toBe(404);
    });

    await test.step('Contrato objeto vazio', () => validateSchema(EmptyObjectSchema, response.body, '{} (recurso inexistente)'));

    await test.step('Response body', async () => {
      expect(response.body, 'O corpo deve ser um objeto vazio').toEqual({});
    });
  });

  test('POST /posts retorna 201 com os dados enviados e um ID simulado', { tag: ['@posts', '@escrita'] }, async ({ postsApi }) => {
    const response = await postsApi.create(newPost);

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 201 na criação')).toBe(201);
    });

    const created = await test.step('Contrato Post criado', () => validateSchema(CreatedPostSchema, response.body, 'Post (criado)'));

    await test.step('Response body', async () => {
      expect(created, 'A resposta deve ecoar os dados enviados').toMatchObject(newPost);
      expect(created.id, 'A API deve devolver um ID simulado positivo').toBeGreaterThan(0);
    });
  });

  test('PUT /posts/1 retorna 200 com todos os campos substituídos', { tag: ['@posts', '@escrita'] }, async ({ postsApi }) => {
    const response = await postsApi.replace(EXISTING_POST_ID, replacedPost);

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 200 na substituição')).toBe(200);
    });

    const updated = await test.step('Contrato Post', () => validateSchema(PostSchema, response.body, 'Post (PUT)'));

    await test.step('Response body', async () => {
      expect(updated, 'A resposta deve conter exatamente os campos enviados').toEqual(replacedPost);
    });
  });

  test('PATCH /posts/1 retorna 200 e reflete apenas o campo alterado', { tag: ['@posts', '@escrita'] }, async ({ postsApi }) => {
    const response = await postsApi.partialUpdate(EXISTING_POST_ID, partialPostUpdate);

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 200 na atualização parcial')).toBe(200);
    });

    const patched = await test.step('Contrato Post', () => validateSchema(PostSchema, response.body, 'Post (PATCH)'));

    await test.step('Response body', async () => {
      expect(patched.id, 'O ID não deve mudar').toBe(EXISTING_POST_ID);
      expect(patched.title, 'O título deve refletir o PATCH').toBe(partialPostUpdate.title);
      expect(patched.body.length, 'Campos não enviados devem permanecer preenchidos').toBeGreaterThan(0);
    });
  });

  test('DELETE /posts/1 retorna 200 com corpo vazio', { tag: ['@posts', '@escrita'] }, async ({ postsApi }) => {
    const response = await postsApi.remove(EXISTING_POST_ID);

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 200 na exclusão')).toBe(200);
    });

    await test.step('Contrato objeto vazio', () => validateSchema(EmptyObjectSchema, response.body, '{} (DELETE)'));

    await test.step('Response body', async () => {
      expect(response.body, 'O corpo da exclusão deve ser um objeto vazio').toEqual({});
    });
  });
});
