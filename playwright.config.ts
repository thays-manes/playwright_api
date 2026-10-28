import { defineConfig } from '@playwright/test';
import { environment } from './src/config/environment';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Cada reporter grava em sua própria pasta, sem sobrescrever o outro.
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          API_BASE_URL: environment.apiBaseUrl,
          NODE_VERSION: process.version,
          OS: process.platform,
        },
      },
    ],
  ],

  // Somente APIRequestContext: nenhum navegador é usado ou instalado.
  use: {
    baseURL: environment.apiBaseUrl,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
    },
  },

  projects: [
    {
      name: 'api',
      testDir: './tests',
      testIgnore: '**/schemas/**',
    },
    {
      name: 'schemas',
      testDir: './tests/schemas',
    },
  ],
});
