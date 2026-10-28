# Testes automatizados de API — JSONPlaceholder com Playwright

> ⚠️ **Status de validação: ainda não executado.**
> Este projeto foi gerado num ambiente sem acesso de rede ao registro do npm e ao
> `jsonplaceholder.typicode.com`. Por isso, **nenhum comando abaixo foi executado ainda**: instalação,
> verificação de tipos, testes e relatórios precisam ser rodados pela primeira vez na sua máquina.
> Siga a seção [Primeira execução](#primeira-execução-checklist-de-validação) e, se algo falhar,
> consulte [Como investigar falhas comuns](#13-como-investigar-falhas-comuns).

## 1. Objetivo

Validar a API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com) com testes automatizados
que verificam, de forma independente:

- **Status code** de cada operação;
- **Response body** (campos, tipos, valores enviados e filtros);
- **Contrato/schema** das respostas.

Os testes geram um relatório HTML do Playwright e um relatório visual do Allure com gráficos.

## 2. Tecnologias e justificativa

| Tecnologia | Uso | Por quê |
|---|---|---|
| TypeScript | Linguagem | Tipagem estrita, sem `any`, e tipos inferidos dos schemas |
| Playwright Test | Execução e requisições HTTP | `APIRequestContext` nativo, fixtures, paralelismo, steps e reporters, sem navegador |
| Zod 4 | Contrato/schema | Schemas declarativos que geram os tipos TypeScript e mensagens de erro legíveis |
| allure-playwright | Coleta de resultados para o Allure | Integração oficial do Allure com o Playwright |
| Allure Report 3 (`allure`) | Relatório visual com gráficos | CLI em Node.js, **sem necessidade de Java** |

## 3. Pré-requisitos e instalação no Windows

- **Node.js 20.12 ou superior** (recomendado: a versão LTS atual). Verifique com `node -v`.
- npm (instalado com o Node).
- Acesso à internet para `registry.npmjs.org` e `jsonplaceholder.typicode.com`.
- **Não é preciso instalar navegadores** (`npx playwright install` não é necessário) nem Java.

No PowerShell, dentro da pasta do projeto:

```powershell
cd "C:\Users\thays.manes\Documents\projetos_automação\api_playwright"
npm install
```

O `npm install` cria o `package-lock.json`. Versione esse arquivo; depois disso, em outras máquinas
ou na CI, prefira `npm ci` para instalar exatamente as mesmas versões.

> As dependências estão declaradas como faixas compatíveis (`^`). As versões exatas instaladas
> ficam registradas no `package-lock.json`. Confira com `npm ls --depth=0`.

## 4. Estrutura de pastas

```text
api_playwright/
├── src/
│   ├── api/            API Objects (Service Objects): encapsulam as chamadas HTTP
│   │   ├── BaseApi.ts                 execução HTTP, parse do corpo, evidências e erro de infraestrutura
│   │   ├── ApiInfrastructureError.ts  erro para quando não há resposta HTTP (rede, timeout, proxy)
│   │   ├── PostsApi.ts / UsersApi.ts / CommentsApi.ts
│   │   └── types.ts                   tipos de requisição/resposta
│   ├── schemas/        contratos Zod e tipos inferidos (Post, User, Comment, objeto vazio)
│   ├── fixtures/       fixtures do Playwright que injetam os API Objects em cada teste
│   ├── data/           dados de teste (payloads, IDs, amostras para testes de schema)
│   ├── utils/          validação de schema com mensagens úteis e descrição de respostas
│   └── config/         leitura de variáveis de ambiente (.env)
├── tests/
│   ├── posts/          cenários de /posts
│   ├── users/          cenários de /users
│   ├── comments/       cenários de /comments
│   └── schemas/        testes unitários dos schemas (sem HTTP)
├── docs/comportamento-api.md   comportamento esperado da API e como confirmá-lo
├── scripts/            clean.mjs (limpeza portátil) e explore-api.mjs (chamadas exploratórias)
├── playwright.config.ts
├── allurerc.mjs        configuração do Allure Report 3
├── tsconfig.json
├── .env.example
└── package.json
```

**Responsabilidades:**
- **Testes** descrevem comportamento. Não contêm URLs, headers nem detalhes HTTP.
- **API Objects** sabem *como* chamar cada endpoint e devolvem uma resposta normalizada
  (`status`, `body`, `url`, `method`, `durationMs`).
- **Schemas** definem o contrato e produzem os tipos usados nos testes.
- **BaseApi** anexa ao relatório, em cada chamada, método, URL, status, duração e corpos de requisição e resposta.

## 5. Configuração da URL base

A URL padrão é `https://jsonplaceholder.typicode.com`. Para alterá-la:

**Opção A, arquivo `.env`:**
```powershell
Copy-Item .env.example .env
# edite API_BASE_URL e/ou API_REQUEST_TIMEOUT_MS
```

**Opção B, variável de ambiente na sessão do PowerShell** (tem precedência sobre o `.env`):
```powershell
$env:API_BASE_URL = "https://jsonplaceholder.typicode.com"
$env:API_REQUEST_TIMEOUT_MS = "20000"
npm test
```

No Linux/macOS: `API_BASE_URL=https://... npm test`.

## 6. Execução dos testes

| Comando | O que faz |
|---|---|
| `npm test` | Executa toda a suíte (projetos `api` e `schemas`) |
| `npm run test:api` | Apenas os testes que chamam a API |
| `npm run test:schemas` | Apenas os testes unitários dos schemas |
| `npx playwright test tests/posts` | Apenas um recurso |
| `npx playwright test --grep "@negativo"` | Apenas os cenários com uma tag (`@posts`, `@users`, `@comments`, `@leitura`, `@escrita`, `@negativo`) |
| `npm run explore:api` | Chamadas exploratórias que imprimem status e corpo reais da API |

Antes de cada execução, `allure-results/` é limpo automaticamente (scripts `pre*`), para que o Allure
mostre apenas a execução atual.

## 7. Verificação de tipos

```powershell
npm run typecheck
```

Executa `tsc --noEmit` com `strict` e `noUncheckedIndexedAccess`.

## 8. Relatórios

| Relatório | Gerado em | Como abrir |
|---|---|---|
| Playwright HTML | `playwright-report/` (automaticamente em cada execução) | `npm run report:html` |
| Resultados brutos do Allure | `allure-results/` (automaticamente em cada execução) | — |
| Allure Report | `allure-report/` | `npm run report:allure:generate` e depois `npm run report:allure:open` |

Fluxo completo:

```powershell
npm test
npm run report:html              # abre o relatório do Playwright no navegador
npm run report:allure:generate   # gera allure-report/ a partir de allure-results/
npm run report:allure:open       # serve e abre o Allure no navegador
```

Os dois reporters gravam em pastas diferentes, então um não sobrescreve o outro. Para apagar todos os
artefatos, use `npm run clean`.

**Allure e Java:** o projeto usa o **Allure Report 3** (pacote npm `allure`), que roda em Node.js e
**não precisa de Java**. Se preferir o Allure 2 (`allure-commandline`), instale o Java 8+ e troque os
scripts por `allure generate allure-results --clean -o allure-report` e `allure open allure-report`.

## 9. Como interpretar os relatórios e gráficos

**Playwright HTML:** no topo aparecem os totais por status (passed, failed, flaky, skipped) e a duração.
Ao abrir um teste, você vê os *steps* `Status code`, `Contrato ...` e `Response body`, separados, e os
anexos `HTTP <MÉTODO> <caminho>` com URL, status, duração e corpos.

**Allure:**
- **Visão geral (Overview):** gráfico de pizza com a proporção de testes passed, failed, broken e
  skipped, total de testes e duração.
- **Suites:** árvore por arquivo e `describe` (Posts, Users, Comments, Schemas).
- **Graphs / Timeline** (quando disponíveis na versão instalada): distribuição de status, duração e
  linha do tempo da execução paralela.
- **Environment:** URL base, versão do Node e sistema operacional usados na execução.
- **Trend:** aparece a partir da segunda geração com histórico preservado.

Leitura dos status no Allure:
- **Failed:** falha de asserção, ou seja, a API respondeu algo diferente do esperado.
- **Broken:** erro inesperado no teste, por exemplo `[FALHA DE INFRAESTRUTURA]` (sem resposta HTTP)
  ou `[FALHA DE CONTRATO]` (schema).

## 10. Cenários implementados

**API (projeto `api`, 12 testes):**

| Recurso | Cenário | Valida |
|---|---|---|
| Posts | `GET /posts` | 200, lista não vazia, IDs únicos, contrato `Post[]` |
| Posts | `GET /posts/1` | 200, `id === 1`, contrato `Post` |
| Posts | `GET /posts/999999` | 404, corpo `{}` |
| Posts | `POST /posts` | 201, dados enviados ecoados, `id` simulado positivo |
| Posts | `PUT /posts/1` | 200, resposta igual ao payload enviado |
| Posts | `PATCH /posts/1` | 200, título alterado, `id` mantido, demais campos preenchidos |
| Posts | `DELETE /posts/1` | 200, corpo `{}` |
| Users | `GET /users` | 200, lista não vazia, IDs únicos, contrato `User[]` |
| Users | `GET /users/1` | 200, `id`, `name`, `username`, `email` (formato) e `address`/`geo` |
| Users | `GET /users/999999` | 404, corpo `{}` |
| Comments | `GET /comments?postId=1` | 200, todos com `postId === 1`, contrato `Comment[]` |
| Comments | `GET /comments?postId=999999` | 200, lista vazia |

**Schemas (projeto `schemas`, 12 testes, sem HTTP):** aceitam payloads válidos e rejeitam campo
ausente, tipo incorreto, e-mail inválido, objeto aninhado ausente, item inválido em array, PATCH vazio
e objeto não vazio onde se espera `{}`. Também comprovam que `validateSchema` gera uma mensagem com o
nome do contrato e o campo divergente. Esses payloads são locais e **não** representam respostas da API.

## 11. Limitações do JSONPlaceholder

- **Escritas simuladas:** `POST`, `PUT`, `PATCH` e `DELETE` respondem com sucesso, mas não persistem
  nada. Por isso nenhum teste verifica a alteração com um `GET` posterior, e os testes não dependem uns
  dos outros.
- O `id` devolvido no `POST` é sempre o mesmo valor simulado.
- A API não valida payloads: aceita campos inválidos ou ausentes. Por isso os cenários de contrato
  inválido são testados nos schemas, de forma controlada.
- A API é um serviço público e gratuito, sujeito a lentidão ou indisponibilidade. Essas situações
  aparecem como `[FALHA DE INFRAESTRUTURA]`, nunca como sucesso.
- O comportamento esperado está em [`docs/comportamento-api.md`](docs/comportamento-api.md).

## 12. Como adicionar um novo endpoint

Exemplo: `GET /albums/:id`.

1. **Schema:** crie `src/schemas/album.schema.ts`:
   ```ts
   import { z } from 'zod';
   import { IdSchema, NonEmptyStringSchema } from './common.schema';

   export const AlbumSchema = z.object({ userId: IdSchema, id: IdSchema, title: NonEmptyStringSchema });
   export const AlbumListSchema = z.array(AlbumSchema);
   export type Album = z.infer<typeof AlbumSchema>;
   ```
2. **API Object:** crie `src/api/AlbumsApi.ts`:
   ```ts
   import { BaseApi } from './BaseApi';
   import type { ApiResponse } from './types';

   export class AlbumsApi extends BaseApi {
     private static readonly resource = '/albums';
     getById(id: number): Promise<ApiResponse> {
       return this.get(`${AlbumsApi.resource}/${id}`);
     }
   }
   ```
3. **Fixture:** adicione `albumsApi` em `src/fixtures/api.fixtures.ts`, no mesmo formato das existentes.
4. **Dados:** se houver IDs ou payloads, crie `src/data/albums.data.ts`.
5. **Teste:** crie `tests/albums/albums.spec.ts` com os três steps (`Status code`, `Contrato`, `Response body`).
   Ele entra automaticamente no projeto `api`.
6. **Teste de schema:** adicione casos válidos e inválidos em `tests/schemas/schemas.spec.ts`.
7. Rode `npm run typecheck` e `npm test`.

## 13. Como investigar falhas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `[FALHA DE INFRAESTRUTURA] ... não recebeu resposta HTTP` | Sem rede, proxy corporativo, VPN, firewall ou API fora do ar | Teste `npm run explore:api` e abra a URL no navegador. Configure o proxy (`$env:HTTPS_PROXY`) se necessário |
| `npm install` falha com `E403`, `ECONNRESET` ou `UNABLE_TO_GET_ISSUER_CERT` | Rede ou proxy bloqueando o registro do npm | Configure `npm config set proxy`/`https-proxy` ou o certificado da empresa (`npm config set cafile`) |
| `Esperado 404 ... status recebido 200` (ou outro status) | O comportamento da API difere do esperado | Rode `npm run explore:api`, compare com `docs/comportamento-api.md` e ajuste o teste |
| `[FALHA DE CONTRATO] ... "Post[]"` | A resposta mudou de formato | Veja o anexo `Contrato inválido`, que lista campos e payload recebido |
| `status recebido 429` ou `5xx` | Limite de requisições ou instabilidade do serviço | Execute de novo depois. Na CI, há 1 retry automático |
| `allure: command not found` / `'allure' não é reconhecido` | Dependências não instaladas | Rode `npm install`. Os scripts usam o `allure` local de `node_modules` |
| `report:allure:open` sem dados | `report:allure:generate` não foi executado | Rode `npm test` e depois `npm run report:allure:generate` |
| `process.loadEnvFile is not a function` | Node anterior à 20.12 | Atualize o Node.js |
| Erros de tipos | Código ou dependências desatualizados | `npm run typecheck` mostra arquivo e linha |

Para depurar um teste específico: `npx playwright test tests/posts --grep "PATCH" --reporter=list`.

## Primeira execução (checklist de validação)

Como o projeto ainda não foi executado, faça esta sequência uma vez e confira cada item:

```powershell
npm install
npm run explore:api              # confirma status e corpos reais da API
npm run typecheck                # deve terminar sem erros
npm test                         # esperado: 24 testes aprovados (12 api + 12 schemas)
npm run report:html
npm run report:allure:generate   # deve criar allure-report/index.html
npm run report:allure:open
```

Se algum passo falhar, as causas mais prováveis estão no item 13. Dois pontos merecem atenção especial:
a sintaxe exata da CLI do Allure 3 (`--output`) e as expectativas de status listadas em
`docs/comportamento-api.md`.
