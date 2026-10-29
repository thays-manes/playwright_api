import { expect } from '@playwright/test';
import { z } from 'zod';

/**
 * validarSchema
 * -------------
 * Confere se o JSON recebido da API tem o formato descrito no schema.
 *
 * Como usar dentro de um teste:
 *   validarSchema(postSchema, corpoDaResposta);
 *
 * Se algum campo estiver faltando ou com o tipo errado, o teste FALHA
 * e a mensagem mostra exatamente qual campo deu problema.
 */
export function validarSchema(schema: z.ZodType, json: unknown): void {
  // safeParse compara o JSON com o schema e devolve { success: true } ou { success: false, error }
  const resultado = schema.safeParse(json);

  // Se deu erro, transformamos o erro em um texto fácil de ler (ex.: "✖ Invalid input → at title")
  const detalhes = resultado.success ? '' : z.prettifyError(resultado.error);

  // A validação de verdade: esperamos que "success" seja true
  expect(resultado.success, `O JSON não está no formato esperado:\n${detalhes}`).toBe(true);
}
