import type { ApiResponse } from '../api/types';

/** Mensagem de contexto para asserções: método, URL e status recebido. */
export function describeResponse(response: ApiResponse, expectation: string): string {
  return `${expectation} | ${response.method} ${response.url} → status recebido ${response.status}`;
}
