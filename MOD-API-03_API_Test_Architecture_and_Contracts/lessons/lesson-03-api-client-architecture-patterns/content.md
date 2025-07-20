# API Client Architecture Patterns - Comprehensive Content

## 🏗️ Introduction to API Client Architecture

API client architecture is the foundation of professional API test automation. Unlike simple request-response testing, enterprise-grade API testing requires sophisticated patterns that handle authentication, error management, retry logic, and scalability concerns.

### Why API Client Architecture Matters

**Traditional Approach Problems:**
```typescript
// ❌ Poor approach - Direct API calls in tests
test('user management', async ({ request }) => {
  // Authentication scattered throughout tests
  const loginResponse = await request.post('/api/auth/login', {
    data: { email: 'test@example.com', password: 'password123' }
  });
  const token = (await loginResponse.json()).token;

  // No error handling
  const userResponse = await request.get('/api/users/123', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  // Repeated code, no reusability
  expect(userResponse.status()).toBe(200);
});
```

**Professional Architecture Benefits:**
```typescript
// ✅ Professional approach - API Client Architecture
test('user management', async ({ apiClient }) => {
  // Authentication handled by client
  await apiClient.auth.login('test@example.com', 'password123');
  
  // Error handling built-in, reusable methods
  const user = await apiClient.users.getById(123);
  
  // Clean, maintainable, testable
  expect(user.id).toBe(123);
  expect(user.email).toBe('test@example.com');
});
```

## 🏛️ Core Architecture Patterns

### 1. Base API Client Pattern

The foundation of professional API testing is a well-designed base client that handles common concerns:

```typescript
// src/api/BaseApiClient.ts
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  auth?: AuthConfig;
}

export interface AuthConfig {
  type: 'bearer' | 'basic' | 'apikey' | 'oauth2';
  credentials: Record<string, string>;
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

  /**
   * Execute HTTP request with built-in error handling and retries
   */
  protected async executeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    options: {
      data?: any;
      params?: Record<string, string>;
      headers?: Record<string, string>;
      expectedStatus?: number | number[];
    } = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);
    
    let lastError: Error;
    
    // Retry mechanism with exponential backoff
    for (let attempt = 1; attempt <= this.config.retries!; attempt++) {
      try {
        const response = await this.request.fetch(url, {
          method,
          headers,
          data: options.data ? JSON.stringify(options.data) : undefined,
          timeout: this.config.timeout
        });

        // Validate response status
        await this.validateResponse(response, options.expectedStatus);
        
        // Parse and return response
        return await this.parseResponse<T>(response);
        
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.config.retries!) {
          // Exponential backoff: 1s, 2s, 4s, etc.
          const delay = Math.pow(2, attempt - 1) * 1000;
          await this.sleep(delay);
          
          // Log retry attempt
          console.log(`API request failed, retrying in ${delay}ms (attempt ${attempt}/${this.config.retries})`);
        }
      }
    }
    
    throw new ApiClientError(`Request failed after ${this.config.retries} attempts`, lastError);
  }

  /**
   * Build complete URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.config.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return url.toString();
  }

  /**
   * Build request headers with authentication
   */
  private buildHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...this.config.headers,
      ...additionalHeaders
    };

    // Add authentication header if available
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Validate HTTP response status
   */
  private async validateResponse(
    response: Response, 
    expectedStatus?: number | number[]
  ): Promise<void> {
    const status = response.status();
    
    if (expectedStatus) {
      const expected = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
      if (!expected.includes(status)) {
        const body = await response.text();
        throw new ApiValidationError(
          `Expected status ${expected.join(' or ')}, got ${status}`,
          status,
          body
        );
      }
    } else if (status >= 400) {
      const body = await response.text();
      throw new ApiValidationError(`HTTP ${status} error`, status, body);
    }
  }

  /**
   * Parse API response with error handling
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const status = response.status();
    const headers = response.headers();
    
    let data: T;
    const contentType = headers['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text() as unknown as T;
    }

    return {
      status,
      headers,
      data,
      success: status >= 200 && status < 300
    };
  }

  /**
   * Set authentication token
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  public clearAuthToken(): void {
    this.authToken = undefined;
  }

  /**
   * Utility method for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 2. Response and Error Types

Professional API clients require well-defined types for responses and errors:

```typescript
// src/api/types.ts
export interface ApiResponse<T = any> {
  status: number;
  headers: Record<string, string>;
  data: T;
  success: boolean;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export class ApiValidationError extends ApiClientError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly responseBody: string
  ) {
    super(message);
    this.name = 'ApiValidationError';
  }
}

export class AuthenticationError extends ApiClientError {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Common API response patterns
export interface StandardApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
  path: string;
}
```

## 🔐 Authentication Architecture Patterns

### 1. Authentication Strategy Pattern

Different APIs require different authentication methods. The Strategy pattern allows flexible authentication handling:

```typescript
// src/api/auth/AuthStrategy.ts
export interface AuthStrategy {
  authenticate(credentials: Record<string, string>): Promise<AuthResult>;
  refreshToken?(): Promise<AuthResult>;
  isTokenExpired?(token: string): boolean;
  getAuthHeaders(): Record<string, string>;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  expiresAt?: Date;
  error?: string;
}

// Bearer Token Authentication
export class BearerTokenAuth implements AuthStrategy {
  private token?: string;
  private refreshToken?: string;
  private expiresAt?: Date;

  constructor(private apiClient: BaseApiClient) {}

  async authenticate(credentials: Record<string, string>): Promise<AuthResult> {
    try {
      const response = await this.apiClient.executeRequest<{
        token: string;
        refreshToken: string;
        expiresIn: number;
      }>('POST', '/auth/login', {
        data: {
          email: credentials.email,
          password: credentials.password
        },
        expectedStatus: 200
      });

      this.token = response.data.token;
      this.refreshToken = response.data.refreshToken;
      this.expiresAt = new Date(Date.now() + response.data.expiresIn * 1000);

      return {
        success: true,
        token: this.token,
        refreshToken: this.refreshToken,
        expiresAt: this.expiresAt
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  async refreshToken(): Promise<AuthResult> {
    if (!this.refreshToken) {
      return { success: false, error: 'No refresh token available' };
    }

    try {
      const response = await this.apiClient.executeRequest<{
        token: string;
        expiresIn: number;
      }>('POST', '/auth/refresh', {
        data: { refreshToken: this.refreshToken },
        expectedStatus: 200
      });

      this.token = response.data.token;
      this.expiresAt = new Date(Date.now() + response.data.expiresIn * 1000);

      return {
        success: true,
        token: this.token,
        expiresAt: this.expiresAt
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed'
      };
    }
  }

  isTokenExpired(token: string): boolean {
    if (!this.expiresAt) return true;
    return new Date() >= this.expiresAt;
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.token) {
      throw new AuthenticationError('No authentication token available');
    }
    return { 'Authorization': `Bearer ${this.token}` };
  }
}

// API Key Authentication
export class ApiKeyAuth implements AuthStrategy {
  constructor(
    private apiKey: string,
    private headerName: string = 'X-API-Key'
  ) {}

  async authenticate(): Promise<AuthResult> {
    // API key authentication doesn't require a separate auth call
    return { success: true };
  }

  getAuthHeaders(): Record<string, string> {
    return { [this.headerName]: this.apiKey };
  }
}

// OAuth 2.0 Authentication
export class OAuth2Auth implements AuthStrategy {
  private accessToken?: string;
  private refreshToken?: string;
  private expiresAt?: Date;

  constructor(
    private clientId: string,
    private clientSecret: string,
    private apiClient: BaseApiClient
  ) {}

  async authenticate(credentials: Record<string, string>): Promise<AuthResult> {
    try {
      const response = await this.apiClient.executeRequest<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
      }>('POST', '/oauth/token', {
        data: {
          grant_type: 'password',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          username: credentials.username,
          password: credentials.password
        },
        expectedStatus: 200
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.expiresAt = new Date(Date.now() + response.data.expires_in * 1000);

      return {
        success: true,
        token: this.accessToken,
        refreshToken: this.refreshToken,
        expiresAt: this.expiresAt
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OAuth authentication failed'
      };
    }
  }

  getAuthHeaders(): Record<string, string> {
    if (!this.accessToken) {
      throw new AuthenticationError('No OAuth access token available');
    }
    return { 'Authorization': `Bearer ${this.accessToken}` };
  }
}
```

### 2. Authentication Manager

A centralized authentication manager handles different strategies and automatic token refresh:

```typescript
// src/api/auth/AuthManager.ts
export class AuthManager {
  private strategy?: AuthStrategy;
  private credentials?: Record<string, string>;

  constructor(private apiClient: BaseApiClient) {}

  /**
   * Set authentication strategy
   */
  setStrategy(strategy: AuthStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Authenticate with stored credentials
   */
  async authenticate(credentials: Record<string, string>): Promise<void> {
    if (!this.strategy) {
      throw new AuthenticationError('No authentication strategy configured');
    }

    this.credentials = credentials;
    const result = await this.strategy.authenticate(credentials);

    if (!result.success) {
      throw new AuthenticationError(result.error || 'Authentication failed');
    }

    if (result.token) {
      this.apiClient.setAuthToken(result.token);
    }
  }

  /**
   * Refresh authentication token if supported
   */
  async refreshAuthentication(): Promise<void> {
    if (!this.strategy?.refreshToken) {
      throw new AuthenticationError('Token refresh not supported by current strategy');
    }

    const result = await this.strategy.refreshToken();

    if (!result.success) {
      // If refresh fails, try re-authenticating with original credentials
      if (this.credentials) {
        await this.authenticate(this.credentials);
      } else {
        throw new AuthenticationError('Token refresh failed and no credentials available for re-authentication');
      }
    } else if (result.token) {
      this.apiClient.setAuthToken(result.token);
    }
  }

  /**
   * Get current authentication headers
   */
  getAuthHeaders(): Record<string, string> {
    if (!this.strategy) {
      return {};
    }
    return this.strategy.getAuthHeaders();
  }

  /**
   * Check if current token is expired
   */
  isTokenExpired(): boolean {
    if (!this.strategy?.isTokenExpired) {
      return false;
    }
    
    const headers = this.getAuthHeaders();
    const authHeader = headers['Authorization'];
    
    if (!authHeader) return true;
    
    const token = authHeader.replace('Bearer ', '');
    return this.strategy.isTokenExpired(token);
  }

  /**
   * Clear authentication
   */
  clearAuthentication(): void {
    this.apiClient.clearAuthToken();
    this.credentials = undefined;
  }
}
```

## 🔄 Advanced Resilience Patterns

### 1. Circuit Breaker Pattern

Prevent cascading failures when APIs are down:

```typescript
// src/api/resilience/CircuitBreaker.ts
export enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, reject requests
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

export interface CircuitBreakerConfig {
  failureThreshold: number;    // Number of failures before opening
  recoveryTimeout: number;     // Time to wait before trying again (ms)
  monitoringPeriod: number;    // Time window for failure counting (ms)
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private nextAttemptTime: number = 0;

  constructor(private config: CircuitBreakerConfig) {}

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error('Circuit breaker is OPEN - request rejected');
      }
      // Try to recover
      this.state = CircuitState.HALF_OPEN;
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }
}
```

### 2. Rate Limiting Pattern

Respect API rate limits and implement intelligent throttling:

```typescript
// src/api/resilience/RateLimiter.ts
export interface RateLimitConfig {
  requestsPerSecond: number;
  burstSize?: number;        // Allow burst of requests
  queueSize?: number;        // Max queued requests
}

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private queue: Array<{
    resolve: (value: void) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor(private config: RateLimitConfig) {
    this.tokens = config.burstSize || config.requestsPerSecond;
    this.lastRefill = Date.now();
    
    // Start token refill process
    this.startTokenRefill();
  }

  /**
   * Wait for permission to make request
   */
  async waitForPermission(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.tokens > 0) {
        this.tokens--;
        resolve();
        return;
      }

      // Queue the request if under limit
      const maxQueue = this.config.queueSize || 100;
      if (this.queue.length >= maxQueue) {
        reject(new Error('Rate limit queue is full'));
        return;
      }

      this.queue.push({ resolve, reject });
    });
  }

  private startTokenRefill(): void {
    setInterval(() => {
      const now = Date.now();
      const timePassed = now - this.lastRefill;
      const tokensToAdd = Math.floor(timePassed / 1000 * this.config.requestsPerSecond);
      
      if (tokensToAdd > 0) {
        const maxTokens = this.config.burstSize || this.config.requestsPerSecond;
        this.tokens = Math.min(this.tokens + tokensToAdd, maxTokens);
        this.lastRefill = now;
        
        // Process queued requests
        while (this.queue.length > 0 && this.tokens > 0) {
          const request = this.queue.shift()!;
          this.tokens--;
          request.resolve();
        }
      }
    }, 100); // Check every 100ms
  }
}
```

## 🏢 Enterprise API Client Implementation

### Complete User API Client Example

```typescript
// src/api/clients/UserApiClient.ts
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

export class UserApiClient extends BaseApiClient {
  private circuitBreaker: CircuitBreaker;
  private rateLimiter: RateLimiter;

  constructor(request: APIRequestContext, config: ApiClientConfig) {
    super(request, config);
    
    // Initialize resilience patterns
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      recoveryTimeout: 30000,
      monitoringPeriod: 60000
    });
    
    this.rateLimiter = new RateLimiter({
      requestsPerSecond: 10,
      burstSize: 20,
      queueSize: 50
    });
  }

  /**
   * Get all users with pagination
   */
  async getUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  } = {}): Promise<PaginatedResponse<User>> {
    await this.rateLimiter.waitForPermission();
    
    return this.circuitBreaker.execute(async () => {
      const response = await this.executeRequest<PaginatedResponse<User>>(
        'GET',
        '/users',
        {
          params: {
            page: options.page?.toString() || '1',
            limit: options.limit?.toString() || '20',
            ...(options.search && { search: options.search }),
            ...(options.role && { role: options.role })
          },
          expectedStatus: 200
        }
      );
      
      return response.data;
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User> {
    await this.rateLimiter.waitForPermission();
    
    return this.circuitBreaker.execute(async () => {
      const response = await this.executeRequest<StandardApiResponse<User>>(
        'GET',
        `/users/${id}`,
        { expectedStatus: 200 }
      );
      
      if (!response.data.success) {
        throw new ApiValidationError(
          response.data.message || 'Failed to get user',
          response.status,
          JSON.stringify(response.data)
        );
      }
      
      return response.data.data;
    });
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    await this.rateLimiter.waitForPermission();
    
    return this.circuitBreaker.execute(async () => {
      const response = await this.executeRequest<StandardApiResponse<User>>(
        'POST',
        '/users',
        {
          data: userData,
          expectedStatus: 201
        }
      );
      
      if (!response.data.success) {
        throw new ApiValidationError(
          response.data.message || 'Failed to create user',
          response.status,
          JSON.stringify(response.data.errors || [])
        );
      }
      
      return response.data.data;
    });
  }

  /**
   * Update user
   */
  async updateUser(id: number, updates: UpdateUserRequest): Promise<User> {
    await this.rateLimiter.waitForPermission();
    
    return this.circuitBreaker.execute(async () => {
      const response = await this.executeRequest<StandardApiResponse<User>>(
        'PUT',
        `/users/${id}`,
        {
          data: updates,
          expectedStatus: 200
        }
      );
      
      if (!response.data.success) {
        throw new ApiValidationError(
          response.data.message || 'Failed to update user',
          response.status,
          JSON.stringify(response.data.errors || [])
        );
      }
      
      return response.data.data;
    });
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<void> {
    await this.rateLimiter.waitForPermission();
    
    return this.circuitBreaker.execute(async () => {
      await this.executeRequest(
        'DELETE',
        `/users/${id}`,
        { expectedStatus: 204 }
      );
    });
  }

  /**
   * Bulk operations
   */
  async bulkCreateUsers(users: CreateUserRequest[]): Promise<User[]> {
    const results: User[] = [];
    
    // Process in batches to respect rate limits
    const batchSize = 5;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const batchPromises = batch.map(user => this.createUser(user));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * Search users with advanced filtering
   */
  async searchUsers(criteria: {
    email?: string;
    name?: string;
    role?: string;
    isActive?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
  }): Promise<User[]> {
    await this.rateLimiter.waitForPermission();
    
    return this.circuitBreaker.execute(async () => {
      const params: Record<string, string> = {};
      
      if (criteria.email) params.email = criteria.email;
      if (criteria.name) params.name = criteria.name;
      if (criteria.role) params.role = criteria.role;
      if (criteria.isActive !== undefined) params.isActive = criteria.isActive.toString();
      if (criteria.createdAfter) params.createdAfter = criteria.createdAfter.toISOString();
      if (criteria.createdBefore) params.createdBefore = criteria.createdBefore.toISOString();
      
      const response = await this.executeRequest<StandardApiResponse<User[]>>(
        'GET',
        '/users/search',
        {
          params,
          expectedStatus: 200
        }
      );
      
      return response.data.data;
    });
  }
}
```

## 🔧 Configuration Management

### Environment-Specific Configuration

```typescript
// src/api/config/ApiConfig.ts
export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  timeout: number;
  retries: number;
  rateLimit: {
    requestsPerSecond: number;
    burstSize: number;
  };
  circuitBreaker: {
    failureThreshold: number;
    recoveryTimeout: number;
  };
  auth: {
    type: 'bearer' | 'apikey' | 'oauth2';
    endpoints: {
      login: string;
      refresh: string;
      logout: string;
    };
  };
}

export class ApiConfigManager {
  private static configs: Record<string, EnvironmentConfig> = {
    development: {
      name: 'development',
      baseUrl: 'http://localhost:3001/api',
      timeout: 30000,
      retries: 3,
      rateLimit: {
        requestsPerSecond: 100,
        burstSize: 200
      },
      circuitBreaker: {
        failureThreshold: 10,
        recoveryTimeout: 30000
      },
      auth: {
        type: 'bearer',
        endpoints: {
          login: '/auth/login',
          refresh: '/auth/refresh',
          logout: '/auth/logout'
        }
      }
    },
    staging: {
      name: 'staging',
      baseUrl: 'https://api-staging.example.com',
      timeout: 45000,
      retries: 5,
      rateLimit: {
        requestsPerSecond: 50,
        burstSize: 100
      },
      circuitBreaker: {
        failureThreshold: 5,
        recoveryTimeout: 60000
      },
      auth: {
        type: 'bearer',
        endpoints: {
          login: '/auth/login',
          refresh: '/auth/refresh',
          logout: '/auth/logout'
        }
      }
    },
    production: {
      name: 'production',
      baseUrl: 'https://api.example.com',
      timeout: 60000,
      retries: 3,
      rateLimit: {
        requestsPerSecond: 20,
        burstSize: 40
      },
      circuitBreaker: {
        failureThreshold: 3,
        recoveryTimeout: 120000
      },
      auth: {
        type: 'bearer',
        endpoints: {
          login: '/auth/login',
          refresh: '/auth/refresh',
          logout: '/auth/logout'
        }
      }
    }
  };

  static getConfig(environment: string): EnvironmentConfig {
    const config = this.configs[environment];
    if (!config) {
      throw new Error(`Configuration not found for environment: ${environment}`);
    }
    return config;
  }

  static getAllEnvironments(): string[] {
    return Object.keys(this.configs);
  }

  static addConfig(environment: string, config: EnvironmentConfig): void {
    this.configs[environment] = config;
  }
}
```

## 🧪 Integration with Playwright

### Custom Fixture for API Client

```typescript
// src/fixtures/apiClient.ts
import { test as base, APIRequestContext } from '@playwright/test';
import { UserApiClient } from '../api/clients/UserApiClient';
import { AuthManager } from '../api/auth/AuthManager';
import { BearerTokenAuth } from '../api/auth/AuthStrategy';
import { ApiConfigManager } from '../api/config/ApiConfig';

interface ApiFixtures {
  apiClient: {
    users: UserApiClient;
    auth: AuthManager;
  };
}

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    // Get environment configuration
    const environment = process.env.TEST_ENV || 'development';
    const