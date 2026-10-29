import { expect, test } from '@playwright/test';
import { ApiClient } from '../src/api/ApiClient';
import { listaDeUsersSchema, userSchema } from '../src/schemas/schemas';
import { validarSchema } from '../src/schemas/validarSchema';

test.describe('Users', () => {
  test('GET /users - deve listar todos os usuários', async ({ request }) => {
    const api = new ApiClient(request);

    const resposta = await api.get('/users');

    // 1) Status code
    expect(resposta.status()).toBe(200);

    // 2) Corpo: a lista não pode vir vazia
    const usuarios = await resposta.json();
    expect(usuarios.length).toBeGreaterThan(0);

    // 3) Schema: todos os usuários precisam ter o formato correto
    validarSchema(listaDeUsersSchema, usuarios);
  });

  test('GET /users/1 - deve buscar o usuário de id 1', async ({ request }) => {
    const api = new ApiClient(request);

    const resposta = await api.get('/users/1');

    // 1) Status code
    expect(resposta.status()).toBe(200);

    // 2) Corpo: conferimos o id e os campos principais
    const usuario = await resposta.json();
    expect(usuario.id).toBe(1);
    expect(usuario.name).toBeTruthy(); // nome preenchido
    expect(usuario.username).toBeTruthy(); // username preenchido
    expect(usuario.email).toContain('@'); // e-mail com @
    expect(usuario.address.city).toBeTruthy(); // endereço com cidade

    // 3) Schema
    validarSchema(userSchema, usuario);
  });
});
