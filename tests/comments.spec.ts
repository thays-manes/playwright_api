import { expect, test } from '@playwright/test';
import { ApiClient } from '../src/api/ApiClient';
import { listaDeCommentsSchema } from '../src/schemas/schemas';
import { validarSchema } from '../src/schemas/validarSchema';

test.describe('Comments', () => {
  test('GET /comments?postId=1 - deve trazer só comentários do post 1', async ({ request }) => {
    const api = new ApiClient(request);

    // O "?postId=1" é um filtro (query string): pedimos só os comentários do post 1
    const resposta = await api.get('/comments?postId=1');

    // 1) Status code
    expect(resposta.status()).toBe(200);

    // 2) Corpo: a lista tem itens e TODOS têm postId igual a 1
    const comentarios = await resposta.json();
    expect(comentarios.length).toBeGreaterThan(0);
    for (const comentario of comentarios) {
      expect(comentario.postId).toBe(1);
    }

    // 3) Schema
    validarSchema(listaDeCommentsSchema, comentarios);
  });

  test('GET /comments?postId=999999 - deve retornar lista vazia', async ({ request }) => {
    const api = new ApiClient(request);

    // Filtro por um post que não existe
    const resposta = await api.get('/comments?postId=999999');

    // 1) Status code: a busca funciona (200), só não encontra nada
    expect(resposta.status()).toBe(200);

    // 2) Corpo: lista vazia []
    const comentarios = await resposta.json();
    expect(comentarios).toEqual([]);
  });
});
