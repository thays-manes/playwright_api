import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(process.cwd(), '.env');
if (existsSync(envFile)) {
  // Variáveis já definidas no ambiente (ex.: $env:API_BASE_URL) têm precedência sobre o .env.
  process.loadEnvFile(envFile);
}

const DEFAULT_API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;

function readPositiveInteger(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Variável de ambiente ${name} inválida: "${raw}". Informe um inteiro positivo (milissegundos).`);
  }
  return value;
}

function readBaseUrl(): string {
  const raw = (process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL).trim();
  try {
    return new URL(raw).toString().replace(/\/+$/, '');
  } catch {
    throw new Error(`Variável de ambiente API_BASE_URL inválida: "${raw}". Exemplo: ${DEFAULT_API_BASE_URL}`);
  }
}

export const environment = {
  apiBaseUrl: readBaseUrl(),
  requestTimeoutMs: readPositiveInteger('API_REQUEST_TIMEOUT_MS', DEFAULT_REQUEST_TIMEOUT_MS),
} as const;
