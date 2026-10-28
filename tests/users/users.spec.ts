import { EXISTING_USER_ID, NON_EXISTENT_USER_ID } from '../../src/data/users.data';
import { expect, test } from '../../src/fixtures/api.fixtures';
import { EmptyObjectSchema } from '../../src/schemas/common.schema';
import { UserListSchema, UserSchema } from '../../src/schemas/user.schema';
import { describeResponse } from '../../src/utils/describeResponse';
import { validateSchema } from '../../src/utils/schemaValidation';

test.describe('Users', () => {
  test('GET /users retorna 200 e todos os usuários respeitam o contrato', { tag: ['@users', '@leitura'] }, async ({ usersApi }) => {
    const response = await usersApi.getAll();

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 200')).toBe(200);
    });

    const users = await test.step('Contrato User[]', () => validateSchema(UserListSchema, response.body, 'User[]'));

    await test.step('Response body', async () => {
      expect(users.length, 'A lista de usuários não deve ser vazia').toBeGreaterThan(0);
      const ids = users.map((user) => user.id);
      expect(new Set(ids).size, 'Os IDs dos usuários devem ser únicos').toBe(ids.length);
    });
  });

  test('GET /users/1 retorna 200 com id, nome, username, e-mail e endereço', { tag: ['@users', '@leitura'] }, async ({ usersApi }) => {
    const response = await usersApi.getById(EXISTING_USER_ID);

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 200')).toBe(200);
    });

    const user = await test.step('Contrato User', () => validateSchema(UserSchema, response.body, 'User'));

    await test.step('Response body', async () => {
      expect(user.id, 'O usuário retornado deve ser o solicitado').toBe(EXISTING_USER_ID);
      expect(user.name.trim(), 'name deve estar preenchido').not.toBe('');
      expect(user.username.trim(), 'username deve estar preenchido').not.toBe('');
      expect(user.email, 'email deve ter formato válido').toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(user.address, 'address deve conter os campos do contrato').toEqual(
        expect.objectContaining({
          street: expect.any(String),
          suite: expect.any(String),
          city: expect.any(String),
          zipcode: expect.any(String),
          geo: expect.objectContaining({ lat: expect.any(String), lng: expect.any(String) }),
        }),
      );
    });
  });

  test('GET /users/999999 retorna 404 com objeto vazio para ID inexistente', { tag: ['@users', '@negativo'] }, async ({ usersApi }) => {
    const response = await usersApi.getById(NON_EXISTENT_USER_ID);

    await test.step('Status code', async () => {
      expect(response.status, describeResponse(response, 'Esperado 404 para usuário inexistente')).toBe(404);
    });

    await test.step('Contrato objeto vazio', () => validateSchema(EmptyObjectSchema, response.body, '{} (recurso inexistente)'));

    await test.step('Response body', async () => {
      expect(response.body, 'O corpo deve ser um objeto vazio').toEqual({});
    });
  });
});
