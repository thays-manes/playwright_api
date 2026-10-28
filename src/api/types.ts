export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryParams = Record<string, string | number | boolean>;

export interface RequestOptions {
  data?: unknown;
  params?: QueryParams;
}

/** Resposta normalizada devolvida pelos API Objects. O corpo é `unknown` até passar pelo schema. */
export interface ApiResponse {
  method: HttpMethod;
  url: string;
  status: number;
  headers: Record<string, string>;
  body: unknown;
  durationMs: number;
}
