# Testes de API com Playwright — JSONPlaceholder

Projeto de testes automatizados da API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com),
feito com **Playwright + TypeScript**. Cada teste valida 3 coisas:

1. **Status code**: o código da resposta (200, 201, 404...)
2. **Corpo da resposta**: os dados que voltaram
3. **Schema (contrato)**: se o JSON tem os campos e tipos certos

## Estrutura do projeto

```text
api_playwright/
├── src/
│   ├── api/
│   │   └── ApiClient.ts       ← classe com os métodos GET, POST, PUT, PATCH e DELETE
│   ├── data/
│   │   └── payloads.json      ← JSONs enviados nas chamadas POST, PUT e PATCH
│   └── schemas/
│       ├── schemas.ts         ← formato esperado de Post, User e Comment
│       └── validarSchema.ts   ← função que confere o JSON com o schema
├── tests/
│   ├── posts.spec.ts          ← testes de /posts (GET, POST, PUT, PATCH, DELETE)
│   ├── users.spec.ts          ← testes de /users
│   ├── comments.spec.ts       ← testes de /comments
│   └── schemas.spec.ts        ← testes dos schemas (não chamam a API)
├── playwright.config.ts       ← URL da API, relatórios e grupos de teste
├── tsconfig.json              ← configuração do TypeScript
└── package.json               ← dependências e comandos (scripts)
```

## Como funciona (passo a passo de um teste)

```ts
test('GET /posts/1 - deve buscar o post de id 1', async ({ request }) => {
  const api = new ApiClient(request);           // 1. cria o cliente da API
  const resposta = await api.get('/posts/1');   // 2. faz a chamada

  expect(resposta.status()).toBe(200);          // 3. valida o status code
  const post = await resposta.json();           // 4. lê o corpo da resposta
  expect(post.id).toBe(1);                      // 5. valida o conteúdo
  validarSchema(postSchema, post);              // 6. valida o schema
});
```

Para enviar um JSON (POST, PUT ou PATCH), use os dados de `src/data/payloads.json`:

```ts
const resposta = await api.post('/posts', payloads.criarPost);
```

## Instalação (Windows / PowerShell)

Pré-requisito: **Node.js 20 ou superior**. Não é preciso instalar navegador nem Java.

```powershell
cd "C:\Users\thays.manes\Documents\projetos_automação\api_playwright"
npm install
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm test` | Roda todos os testes |
| `npm run test:api` | Roda só os testes que chamam a API |
| `npm run test:schemas` | Roda só os testes dos schemas |
| `npm run typecheck` | Confere se o código TypeScript não tem erros |
| `npm run report:html` | Abre o relatório do Playwright |
| `npm run report:allure:generate` | Gera o relatório Allure (com gráficos) |
| `npm run report:allure:open` | Abre o relatório Allure |

Para rodar só um arquivo: `npx playwright test tests/posts.spec.ts`

## Relatórios

| Relatório | Pasta |
|---|---|
| Playwright HTML | `playwright-report/` |
| Dados do Allure | `allure-results/` (limpa automaticamente a cada execução) |
| Relatório Allure | `allure-report/` |

Ordem para ver o Allure: `npm test` → `npm run report:allure:generate` → `npm run report:allure:open`.
O gráfico de pizza mostra quantos testes passaram (verde), falharam (vermelho) ou deram erro (amarelo).

## Mudar a URL da API

Por padrão é `https://jsonplaceholder.typicode.com`. Para usar outra no PowerShell:

```powershell
$env:API_BASE_URL = "https://outra-url.com"
npm test
```

## Comportamento da API (confirmado na execução)

| Chamada | Status | Corpo |
|---|---|---|
| `GET /posts/999999` | 404 | `{}` |
| `POST /posts` | 201 | dados enviados + `id` novo |
| `PUT /posts/1` / `PATCH /posts/1` | 200 | post com os dados alterados |
| `DELETE /posts/1` | 200 | `{}` |
| `GET /comments?postId=999999` | 200 | `[]` |

**Importante:** o JSONPlaceholder é uma API de teste. POST, PUT, PATCH e DELETE **fingem** que
alteraram os dados, mas nada é salvo de verdade. Por isso os testes não dependem um do outro.

## Como adicionar um novo teste

Exemplo para `GET /albums/1`:

1. Em `src/schemas/schemas.ts`, crie o schema:
   ```ts
   export const albumSchema = z.object({ userId: z.number(), id: z.number(), title: z.string() });
   ```
2. Crie `tests/albums.spec.ts` copiando a estrutura de um teste existente e troque o endpoint e o schema.
3. Se for um POST, PUT ou PATCH, coloque o JSON em `src/data/payloads.json`.
4. Rode `npm run typecheck` e `npm test`.

## Problemas comuns

| Mensagem | O que significa | O que fazer |
|---|---|---|
| `getaddrinfo ENOTFOUND` / `EAI_AGAIN` / `ECONNREFUSED` | Sem acesso à internet ou à API | Verifique a internet, VPN ou proxy da empresa |
| `Expected: 200 Received: 404` | A API respondeu com outro status | Confira o endpoint chamado no teste |
| `O JSON não está no formato esperado` | Algum campo faltou ou veio com tipo diferente | A mensagem mostra o campo. Compare com `schemas.ts` |
| `'allure' não é reconhecido` | Dependências não instaladas | Rode `npm install` |
