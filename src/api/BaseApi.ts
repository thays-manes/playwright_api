import type { APIRequestContext, APIResponse, TestInfo } from '@playwright/test';
import { environment } from '../config/environment';
import { ApiInfrastructureError } from './ApiInfrastructureError';
import type { ApiResponse, HttpMethod, RequestOptions } from './types';

/**
 * Base dos API Objects: concentra a execução HTTP, o parse do corpo, o tratamento de
 * falhas de infraestrutura e o anexo de evidências (método, URL, status, corpos) ao relatório.
 */
export abstract class BaseApi {
  constructor(
    protected readonly request: APIRequestContext,
    private readonly testInfo?: TestInfo,
  ) {}

  protected get(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse> {
    return this.send('GET', endpoint, options);
  }

  protected post(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse> {
    return this.send('POST', endpoint, options);
  }

  protected put(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse> {
    return this.send('PUT', endpoint, options);
  }

  protected patch(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse> {
    return this.send('PATCH', endpoint, options);
  }

  protected delete(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse> {
    return this.send('DELETE', endpoint, options);
  }

  private async send(method: HttpMethod, endpoint: string, options: RequestOptions): Promise<ApiResponse> {
    const startedAt = Date.now();
    let response: APIResponse;

    try {
      response = await this.request.fetch(endpoint, {
        method,
        data: options.data,
        params: options.params,
        timeout: environment.requestTimeoutMs,
      });
    } catch (error) {
      const url = `${environment.apiBaseUrl}${endpoint}`;
      await this.attachEvidence({ method, url, error: error instanceof Error ? error.message : String(error) });
      throw new ApiInfrastructureError(method, url, error);
    }

    const result: ApiResponse = {
      method,
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
      body: BaseApi.parseBody(await response.text()),
      durationMs: Date.now() - startedAt,
    };

    await this.attachEvidence({
      method: result.method,
      url: result.url,
      status: result.status,
      durationMs: result.durationMs,
      requestBody: options.data,
      responseBody: result.body,
    });

    return result;
  }

  private static parseBody(text: string): unknown {
    if (text.trim() === '') return null;
    try {
      return JSON.parse(text) as unknown;
    } catch {
      // Corpo não-JSON é devolvido como texto para que o teste de contrato acuse a divergência.
      return text;
    }
  }

  private async attachEvidence(evidence: Record<string, unknown>): Promise<void> {
    if (!this.testInfo) return;
    const title = `${String(evidence.method)} ${new URL(String(evidence.url)).pathname}`;
    await this.testInfo.attach(`HTTP ${title}`, {
      body: JSON.stringify(evidence, null, 2),
      contentType: 'application/json',
    });
  }
}
