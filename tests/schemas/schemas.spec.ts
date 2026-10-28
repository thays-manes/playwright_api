/**
 * Testes unitários dos schemas: não fazem chamadas HTTP.
 * Os payloads malformados são construídos localmente para provar que o contrato os rejeita;
 * eles NÃO representam respostas reais da API.
 */
import { expect, test } from '@playwright/test';
import type { ZodError } from 'zod';
import { validComment, validPost, validUser } from '../../src/data/schema-samples';
import { CommentListSchema, CommentSchema } from '../../src/schemas/comment.schema';
import { EmptyObjectSchema } from '../../src/schemas/common.schema';
import { PostListSchema, PostPatchSchema, PostSchema } from '../../src/schemas/post.schema';
import { UserSchema } from '../../src/schemas/user.schema';
import { issuePaths, SchemaValidationError, validateSchema } from '../../src/utils/schemaValidation';

function rejectionPaths(result: { success: boolean; error?: ZodError }): string[] {
  expect(result.success, 'O schema deveria rejeitar o payload').toBe(false);
  if (!result.error) throw new Error('Resultado sem erro de validação');
  return issuePaths(result.error);
}

test.describe('Schema Post', () => {
  test('aceita um post válido', () => {
    expect(PostSchema.safeParse(validPost).success).toBe(true);
  });

  test('rejeita post sem o campo obrigatório title', () => {
    const { title: _omitted, ...withoutTitle } = validPost;
    expect(rejectionPaths(PostSchema.safeParse(withoutTitle))).toContain('title');
  });

  test('rejeita post com id do tipo string', () => {
    expect(rejectionPaths(PostSchema.safeParse({ ...validPost, id: '1' }))).toContain('id');
  });

  test('rejeita lista de posts com um item malformado', () => {
    const list = [validPost, { ...validPost, id: 2, userId: 'um' }];
    expect(rejectionPaths(PostListSchema.safeParse(list))).toContain('1.userId');
  });

  test('rejeita PATCH sem nenhum campo', () => {
    expect(PostPatchSchema.safeParse({}).success).toBe(false);
  });
});

test.describe('Schema User', () => {
  test('aceita um usuário válido', () => {
    expect(UserSchema.safeParse(validUser).success).toBe(true);
  });

  test('rejeita usuário com e-mail inválido', () => {
    expect(rejectionPaths(UserSchema.safeParse({ ...validUser, email: 'sem-arroba' }))).toContain('email');
  });

  test('rejeita usuário sem address.geo', () => {
    const { geo: _omitted, ...addressWithoutGeo } = validUser.address;
    const result = UserSchema.safeParse({ ...validUser, address: addressWithoutGeo });
    expect(rejectionPaths(result)).toContain('address.geo');
  });
});

test.describe('Schema Comment', () => {
  test('aceita um comentário válido', () => {
    expect(CommentSchema.safeParse(validComment).success).toBe(true);
  });

  test('rejeita comentário com postId negativo e body ausente', () => {
    const { body: _omitted, ...withoutBody } = validComment;
    const paths = rejectionPaths(CommentListSchema.safeParse([{ ...withoutBody, postId: -1 }]));
    expect(paths).toEqual(expect.arrayContaining(['0.postId', '0.body']));
  });
});

test.describe('Schema de objeto vazio', () => {
  test('aceita {} e rejeita objeto com propriedades', () => {
    expect(EmptyObjectSchema.safeParse({}).success).toBe(true);
    expect(EmptyObjectSchema.safeParse({ id: 1 }).success).toBe(false);
  });
});

test.describe('Mensagens de falha de contrato', () => {
  test('validateSchema lança erro descritivo com o nome do contrato e o campo divergente', async () => {
    const malformed = { ...validPost, title: 123 };
    const error = await validateSchema(PostSchema, malformed, 'Post').then(
      () => null,
      (reason: unknown) => reason,
    );

    expect(error).toBeInstanceOf(SchemaValidationError);
    expect((error as SchemaValidationError).message).toContain('"Post"');
    expect((error as SchemaValidationError).details).toContain('title');
  });
});
