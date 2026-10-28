// Chamadas exploratórias para confirmar o comportamento real da API antes de fixar expectativas.
// Uso: npm run explore:api
import { existsSync } from 'node:fs';

if (existsSync('.env')) process.loadEnvFile('.env');
const baseUrl = (process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com').replace(/\/+$/, '');

const headers = { 'Content-Type': 'application/json; charset=UTF-8', Accept: 'application/json' };
const calls = [
  ['GET', '/posts/999999'],
  ['GET', '/users/999999'],
  ['GET', '/comments?postId=999999'],
  ['POST', '/posts', { userId: 1, title: 'Explorar', body: 'Corpo de exploração' }],
  ['PUT', '/posts/1', { id: 1, userId: 1, title: 'Atualizado', body: 'Corpo atualizado' }],
  ['PATCH', '/posts/1', { title: 'Parcial' }],
  ['DELETE', '/posts/1'],
];

for (const [method, path, data] of calls) {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: data === undefined ? undefined : JSON.stringify(data),
    });
    const text = await response.text();
    console.log(`${method} ${path} -> ${response.status}\n  corpo: ${text.replace(/\s+/g, ' ').slice(0, 300)}\n`);
  } catch (error) {
    const reason = error instanceof Error ? (error.cause ?? error.message) : String(error);
    console.error(`${method} ${path} -> FALHA DE INFRAESTRUTURA: ${String(reason)}\n`);
    process.exitCode = 1;
  }
}
