import { test } from '@playwright/test';
import { z } from 'zod';

export class SchemaValidationError extends Error {
  override readonly name = 'SchemaValidationError';

  constructor(
    readonly contractName: string,
    readonly details: string,
  ) {
    super(`[FALHA DE CONTRATO] A resposta não respeita o schema "${contractName}":\n${details}`);
  }
}

/**
 * Valida `data` contra o schema e devolve o valor tipado.
 * Em caso de divergência, anexa os detalhes ao relatório e lança SchemaValidationError
 * com a lista de campos e problemas encontrados.
 */
export async function validateSchema<S extends z.ZodType>(
  schema: S,
  data: unknown,
  contractName: string,
): Promise<z.output<S>> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  const details = z.prettifyError(result.error);
  await test.info().attach(`Contrato inválido: ${contractName}`, {
    body: `${details}\n\nPayload recebido:\n${JSON.stringify(data, null, 2)}`,
    contentType: 'text/plain',
  });
  throw new SchemaValidationError(contractName, details);
}

/** Caminhos (ex.: "address.geo") dos campos com problema — útil nos testes unitários dos schemas. */
export function issuePaths(error: z.ZodError): string[] {
  return error.issues.map((issue) => issue.path.map(String).join('.'));
}
