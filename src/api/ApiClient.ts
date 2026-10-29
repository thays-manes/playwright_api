// Importamos dois "tipos" do Playwright:
// - APIRequestContext: é o objeto que faz as chamadas HTTP (o Playwright entrega ele nos testes como `request`)
// - APIResponse: é o que a chamada devolve (status, corpo, headers...)
import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * ApiClient
 * ---------
 * Classe comum com os 5 métodos HTTP: GET, POST, PUT, PATCH e DELETE.
 * Todos os testes usam esta mesma classe, assim não repetimos código em cada arquivo.
 *
 * A URL base (https://jsonplaceholder.typicode.com) está configurada no playwright.config.ts.
 * Por isso aqui passamos só o final do endereço, por exemplo: '/posts/1'.
 *
 * Como usar dentro de um teste:
 *   const api = new ApiClient(request);
 *   const resposta = await api.get('/posts/1');
 */
export class ApiClient {
  // O construtor recebe o `request` do Playwright e guarda para usar nos métodos abaixo.
  constructor(private readonly request: APIRequestContext) {}

  // GET -> BUSCA dados.
  // Exemplo: api.get('/posts/1')  ou  api.get('/comments?postId=1')
  async get(endpoint: string): Promise<APIResponse> {
    return this.request.get(endpoint);
  }

  // POST -> CRIA um registro novo.
  // "corpo" é o JSON que será enviado. Exemplo: api.post('/posts', payloads.criarPost)
  async post(endpoint: string, corpo: object): Promise<APIResponse> {
    return this.request.post(endpoint, { data: corpo });
  }

  // PUT -> SUBSTITUI o registro inteiro (enviamos todos os campos).
  // Exemplo: api.put('/posts/1', payloads.atualizarPostCompleto)
  async put(endpoint: string, corpo: object): Promise<APIResponse> {
    return this.request.put(endpoint, { data: corpo });
  }

  // PATCH -> ALTERA só alguns campos do registro.
  // Exemplo: api.patch('/posts/1', payloads.atualizarSoTitulo)
  async patch(endpoint: string, corpo: object): Promise<APIResponse> {
    return this.request.patch(endpoint, { data: corpo });
  }

  // DELETE -> APAGA um registro.
  // Exemplo: api.delete('/posts/1')
  async delete(endpoint: string): Promise<APIResponse> {
    return this.request.delete(endpoint);
  }
}
