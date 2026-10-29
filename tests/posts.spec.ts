// test e expect vêm do Playwright: "test" cria um teste e "expect" faz as validações.
import { expect, test } from '@playwright/test';
// Nossa classe com os métodos GET, POST, PUT, PATCH e DELETE.
import { ApiClient } from '../src/api/ApiClient';
// Os JSONs que vamos enviar nas chamadas (POST, PUT e PATCH).
import payloads from '../src/data/payloads.json';
// Os schemas (formato esperado) e a função que valida o schema.
import { listaDePostsSchema, postSchema } from '../src/schemas/schemas';
import { validarSchema } from '../src/schemas/validarSchema';

// "describe" agrupa os testes de um mesmo assunto. No relatório aparecem juntos como "Posts".
test.describe('Posts', () => {
  // Cada teste recebe o { request } do Playwright, que usamos para criar o ApiClient.
  // Todos os testes seguem os mesmos 3 passos de validação:
  //   1) status code  2) corpo da resposta  3) schema (contrato)

  test('GET /posts - deve listar todos os posts', async ({ request }) => {
    const api = new ApiClient(request);

    // Faz a chamada GET
    const resposta = await api.get('/posts');

    // 1) Status code: 200 significa "OK"
    expect(resposta.status()).toBe(200);

    // 2) Corpo: .json() transforma a resposta em um objeto que podemos ler
    const posts = await resposta.json();
    expect(posts.length).toBeGreaterThan(0); // a lista não pode vir vazia

    // 3) Schema: cada post da lista precisa ter o formato correto
    validarSchema(listaDePostsSchema, posts);
  });

  test('GET /posts/1 - deve buscar o post de id 1', async ({ request }) => {
    const api = new ApiClient(request);

    const resposta = await api.get('/posts/1');

    // 1) Status code
    expect(resposta.status()).toBe(200);

    // 2) Corpo: conferimos que veio o post que pedimos
    const post = await resposta.json();
    expect(post.id).toBe(1);

    // 3) Schema
    validarSchema(postSchema, post);
  });

  test('GET /posts/999999 - deve retornar 404 para post que não existe', async ({ request }) => {
    const api = new ApiClient(request);

    const resposta = await api.get('/posts/999999');

    // 1) Status code: 404 significa "não encontrado"
    expect(resposta.status()).toBe(404);

    // 2) Corpo: o JSONPlaceholder devolve um objeto vazio {}
    const corpo = await resposta.json();
    expect(corpo).toEqual({});

    // 3) Schema: não se aplica, pois não há post na resposta
  });

  test('POST /posts - deve criar um post', async ({ request }) => {
    const api = new ApiClient(request);

    // Enviamos o JSON "criarPost" que está em src/data/payloads.json
    const resposta = await api.post('/posts', payloads.criarPost);

    // 1) Status code: 201 significa "criado"
    expect(resposta.status()).toBe(201);

    // 2) Corpo: a API devolve o que enviamos + um id novo
    const postCriado = await resposta.json();
    expect(postCriado.title).toBe(payloads.criarPost.title);
    expect(postCriado.body).toBe(payloads.criarPost.body);
    expect(postCriado.userId).toBe(payloads.criarPost.userId);
    expect(postCriado.id).toBeDefined(); // o id é gerado pela API

    // 3) Schema
    validarSchema(postSchema, postCriado);
  });

  test('PUT /posts/1 - deve substituir o post inteiro', async ({ request }) => {
    const api = new ApiClient(request);

    // Enviamos TODOS os campos do post (JSON "atualizarPostCompleto")
    const resposta = await api.put('/posts/1', payloads.atualizarPostCompleto);

    // 1) Status code
    expect(resposta.status()).toBe(200);

    // 2) Corpo: a resposta deve ser igual ao que enviamos
    const postAtualizado = await resposta.json();
    expect(postAtualizado).toEqual(payloads.atualizarPostCompleto);

    // 3) Schema
    validarSchema(postSchema, postAtualizado);
  });

  test('PATCH /posts/1 - deve alterar só o título', async ({ request }) => {
    const api = new ApiClient(request);

    // Enviamos SÓ o campo que queremos mudar (JSON "atualizarSoTitulo")
    const resposta = await api.patch('/posts/1', payloads.atualizarSoTitulo);

    // 1) Status code
    expect(resposta.status()).toBe(200);

    // 2) Corpo: o título mudou e o resto do post continua lá
    const post = await resposta.json();
    expect(post.title).toBe(payloads.atualizarSoTitulo.title);
    expect(post.id).toBe(1);
    expect(post.body).toBeTruthy(); // o body não foi enviado, mas continua preenchido

    // 3) Schema
    validarSchema(postSchema, post);
  });

  test('DELETE /posts/1 - deve apagar o post', async ({ request }) => {
    const api = new ApiClient(request);

    const resposta = await api.delete('/posts/1');

    // 1) Status code
    expect(resposta.status()).toBe(200);

    // 2) Corpo: o JSONPlaceholder devolve um objeto vazio {}
    const corpo = await resposta.json();
    expect(corpo).toEqual({});

    // 3) Schema: não se aplica (corpo vazio)
  });
});
