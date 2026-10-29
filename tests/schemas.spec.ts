// Estes testes NÃO chamam a API.
// Eles provam que os schemas funcionam: aceitam um JSON correto e recusam um JSON errado.
// Os JSONs abaixo foram montados à mão, só para o teste.
import { expect, test } from '@playwright/test';
import { postSchema, userSchema } from '../src/schemas/schemas';

test.describe('Schemas', () => {
  // Um post correto, usado como base nos testes
  const postValido = { userId: 1, id: 1, title: 'Título', body: 'Texto' };

  test('aceita um post com o formato correto', () => {
    // safeParse devolve { success: true } quando o JSON está correto
    expect(postSchema.safeParse(postValido).success).toBe(true);
  });

  test('recusa um post sem o campo title', () => {
    const postSemTitulo = { userId: 1, id: 1, body: 'Texto' };
    expect(postSchema.safeParse(postSemTitulo).success).toBe(false);
  });

  test('recusa um post com id do tipo texto', () => {
    // "..." copia todos os campos do postValido e depois trocamos o id por um texto
    const postComIdTexto = { ...postValido, id: '1' };
    expect(postSchema.safeParse(postComIdTexto).success).toBe(false);
  });

  test('recusa um usuário com e-mail inválido', () => {
    const usuarioComEmailErrado = {
      id: 1,
      name: 'Maria',
      username: 'maria',
      email: 'email-sem-arroba', // e-mail inválido
      address: {
        street: 'Rua A',
        suite: 'Apto 1',
        city: 'São Paulo',
        zipcode: '01000-000',
        geo: { lat: '-23.55', lng: '-46.63' },
      },
      phone: '11 99999-0000',
      website: 'maria.com',
      company: { name: 'Empresa', catchPhrase: 'Frase', bs: 'negócios' },
    };
    expect(userSchema.safeParse(usuarioComEmailErrado).success).toBe(false);
  });
});
