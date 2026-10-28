import type { HttpMethod } from './types';

/**
 * Lançado quando a requisição não obtém resposta HTTP (DNS, conexão recusada, timeout, proxy).
 * Diferencia indisponibilidade da API de uma falha de asserção ou de contrato.
 */
export class ApiInfrastructureError extends Error {
  override readonly name = 'ApiInfrastructureError';

  constructor(method: HttpMethod, url: string, cause: unknown) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    super(
      `[FALHA DE INFRAESTRUTURA] ${method} ${url} não recebeu resposta HTTP.\n` +
        `Motivo: ${reason}\n` +
        'Isto não é uma falha de asserção: verifique rede, proxy, VPN, firewall ou a disponibilidade da API.',
      { cause },
    );
  }
}
