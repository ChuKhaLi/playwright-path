import { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export class BaseApiClient {
  protected config: ApiClientConfig;
  protected request: APIRequestContext;
  private authToken?: string;

  constructor(request: APIRequestContext, config: ApiClientConfig) {
    this.request = request;
    this.config = {
      timeout: 30000,
      retries: 3,
      ...config
    };
  }

  protected async executeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    options: {
      data?: any;
      params?: Record<string, string | number>;
      headers?: Record<string, string>;
      expectedStatus?: number | number[];
    } = {}
  ): Promise<APIResponse> {
    const url = new URL(endpoint, this.config.baseUrl).toString();
    const headers = this.buildHeaders(options.headers);

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.config.retries!; attempt++) {
      try {
        const response = await this.request[method.toLowerCase() as 'get'](url, {
          headers,
          data: options.data,
          params: options.params,
          timeout: this.config.timeout
        });

        await this.validateResponse(response, options.expectedStatus);
        return response;
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.config.retries!) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }

    throw new Error(`Request failed after ${this.config.retries} attempts for ${method} ${endpoint}: ${lastError?.message}`);
  }

  private buildHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...this.config.headers,
      ...additionalHeaders
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async validateResponse(
    response: APIResponse,
    expectedStatus?: number | number[]
  ): Promise<void> {
    const status = response.status();

    if (expectedStatus) {
      const expected = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
      if (!expected.includes(status)) {
        const body = await response.text();
        throw new Error(`Expected status ${expected.join(' or ')}, got ${status}. Body: ${body}`);
      }
    } else if (status >= 400) {
      const body = await response.text();
      throw new Error(`HTTP ${status} error. Body: ${body}`);
    }
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  public clearAuthToken(): void {
    this.authToken = undefined;
  }
}