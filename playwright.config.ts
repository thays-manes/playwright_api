// Arquivo de configuração do Playwright: define ONDE estão os testes, QUAL API chamar e QUAIS relatórios gerar.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Pasta onde ficam os arquivos de teste
  testDir: './tests',

  // Tempo máximo de cada teste (30 segundos)
  timeout: 30_000,

  // Relatórios gerados ao final da execução:
  // - list: mostra o resultado no terminal
  // - html: relatório do Playwright na pasta playwright-report
  // - allure-playwright: dados para o relatório com gráficos (pasta allure-results)
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],

  use: {
    // URL base da API. Nos testes escrevemos só o final, ex.: '/posts/1'.
    // Para usar outra URL: $env:API_BASE_URL="https://..." (PowerShell) antes de rodar os testes.
    baseURL: process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  },

  // Dois grupos de testes, para poder rodar cada um separado:
  // - api: testes que chamam a API (todos, menos o schemas.spec.ts)
  // - schemas: testes dos schemas, que não chamam a API
  projects: [
    { name: 'api', testIgnore: 'schemas.spec.ts' },
    { name: 'schemas', testMatch: 'schemas.spec.ts' },
  ],
});
