# Lesson 07: API Testing in CI/CD Pipelines - Comprehensive Content

## 🎯 Introduction

API testing in CI/CD pipelines is a critical component of modern software development and deployment strategies. This lesson provides comprehensive coverage of integrating API testing into GitHub Actions workflows, covering everything from basic automation to advanced contract testing, performance validation, and production deployment integration.

## 📚 Part 1: API Testing Workflow Design (60 minutes)

### **Environment-Specific API Testing Strategies**

Modern applications typically deploy across multiple environments (development, staging, production), each requiring specific API testing approaches. Here's how to design effective environment-specific testing strategies:

#### **Environment Configuration Management**

```yaml
# .github/workflows/api-testing.yml
name: API Testing Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to test'
        required: true
        default: 'staging'
        type: choice
        options:
        - development
        - staging
        - production

env:
  NODE_VERSION: '18'

jobs:
  api-testing:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [development, staging]
        include:
          - environment: development
            api_url: ${{ secrets.DEV_API_URL }}
            api_key: ${{ secrets.DEV_API_KEY }}
          - environment: staging
            api_url: ${{ secrets.STAGING_API_URL }}
            api_key: ${{ secrets.STAGING_API_KEY }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run API tests
        env:
          API_BASE_URL: ${{ matrix.api_url }}
          API_KEY: ${{ matrix.api_key }}
          ENVIRONMENT: ${{ matrix.environment }}
        run: |
          npx playwright test --config=playwright.api.config.ts \
            --reporter=html,json \
            --output-dir=test-results/${{ matrix.environment }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: api-test-results-${{ matrix.environment }}
          path: |
            test-results/${{ matrix.environment }}
            playwright-report/
          retention-days: 30
```

#### **Environment-Specific Configuration Files**

```typescript
// config/environments.ts
export interface EnvironmentConfig {
  apiBaseUrl: string;
  apiKey: string;
  timeout: number;
  retries: number;
  rateLimit: {
    requests: number;
    window: number;
  };
  features: {
    authRequired: boolean;
    rateLimitingEnabled: boolean;
    cachingEnabled: boolean;
  };
}

export const environments: Record<string, EnvironmentConfig> = {
  development: {
    apiBaseUrl: process.env.DEV_API_URL || 'http://localhost:3000/api',
    apiKey: process.env.DEV_API_KEY || 'dev-api-key',
    timeout: 10000,
    retries: 2,
    rateLimit: {
      requests: 100,
      window: 60000
    },
    features: {
      authRequired: false,
      rateLimitingEnabled: false,
      cachingEnabled: false
    }
  },
  staging: {
    apiBaseUrl: process.env.STAGING_API_URL || 'https://staging-api.example.com/api',
    apiKey: process.env.STAGING_API_KEY || '',
    timeout: 15000,
    retries: 3,
    rateLimit: {
      requests: 1000,
      window: 60000
    },
    features: {
      authRequired: true,
      rateLimitingEnabled: true,
      cachingEnabled: true
    }
  },
  production: {
    apiBaseUrl: process.env.PROD_API_URL || 'https://api.example.com/api',
    apiKey: process.env.PROD_API_KEY || '',
    timeout: 20000,
    retries: 5,
    rateLimit: {
      requests: 10000,
      window: 60000
    },
    features: {
      authRequired: true,
      rateLimitingEnabled: true,
      cachingEnabled: true
    }
  }
};

export function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.ENVIRONMENT || 'development';
  const config = environments[env];
  
  if (!config) {
    throw new Error(`Unknown environment: ${env}`);
  }
  
  return config;
}
```

#### **API Test Organization and Structure**

```typescript
// tests/api/base/api-client.ts
import { APIRequestContext, expect } from '@playwright/test';
import { EnvironmentConfig, getEnvironmentConfig } from '../../../config/environments';

export class APIClient {
  private config: EnvironmentConfig;
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.config = getEnvironmentConfig();
    this.request = request;
  }

  async get(endpoint: string, options: any = {}) {
    const response = await this.request.get(`${this.config.apiBaseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: this.config.timeout,
      ...options
    });

    return response;
  }

  async post(endpoint: string, data: any, options: any = {}) {
    const response = await this.request.post(`${this.config.apiBaseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      data,
      timeout: this.config.timeout,
      ...options
    });

    return response;
  }

  async put(endpoint: string, data: any, options: any = {}) {
    const response = await this.request.put(`${this.config.apiBaseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      data,
      timeout: this.config.timeout,
      ...options
    });

    return response;
  }

  async delete(endpoint: string, options: any = {}) {
    const response = await this.request.delete(`${this.config.apiBaseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: this.config.timeout,
      ...options
    });

    return response;
  }

  async validateResponse(response: any, expectedStatus: number = 200) {
    expect(response.status()).toBe(expectedStatus);
    
    if (response.status() >= 200 && response.status() < 300) {
      const contentType = response.headers()['content-type'];
      if (contentType && contentType.includes('application/json')) {
        const body = await response.json();
        expect(body).toBeDefined();
        return body;
      }
    }
    
    return null;
  }
}
```

### **Secret Management for API Authentication**

```typescript
// tests/api/auth/auth-manager.ts
export class AuthManager {
  private static instance: AuthManager;
  private tokens: Map<string, string> = new Map();
  private tokenExpiry: Map<string, number> = new Map();

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  async getAuthToken(request: APIRequestContext, environment: string): Promise<string> {
    const existingToken = this.tokens.get(environment);
    const expiry = this.tokenExpiry.get(environment);

    // Check if token exists and is not expired
    if (existingToken && expiry && Date.now() < expiry) {
      return existingToken;
    }

    // Get new token
    const newToken = await this.fetchNewToken(request, environment);
    this.tokens.set(environment, newToken);
    this.tokenExpiry.set(environment, Date.now() + (55 * 60 * 1000)); // 55 minutes

    return newToken;
  }

  private async fetchNewToken(request: APIRequestContext, environment: string): Promise<string> {
    const config = getEnvironmentConfig();
    
    const response = await request.post(`${config.apiBaseUrl}/auth/token`, {
      data: {
        client_id: process.env.API_CLIENT_ID,
        client_secret: process.env.API_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });

    expect(response.status()).toBe(200);
    const tokenData = await response.json();
    return tokenData.access_token;
  }

  clearTokens(): void {
    this.tokens.clear();
    this.tokenExpiry.clear();
  }
}
```

## 📚 Part 2: Contract Testing and Schema Validation (60 minutes)

### **OpenAPI/Swagger Integration in Pipelines**

Contract testing ensures that APIs conform to their specifications and that changes don't break existing consumers. Here's how to implement comprehensive contract testing:

#### **OpenAPI Schema Validation**

```typescript
// tests/api/contract/schema-validator.ts
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { join } from 'path';

export class SchemaValidator {
  private ajv: Ajv;
  private schemas: Map<string, any> = new Map();

  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(this.ajv);
    this.loadSchemas();
  }

  private loadSchemas() {
    try {
      const openApiSpec = JSON.parse(
        readFileSync(join(__dirname, '../../../schemas/openapi.json'), 'utf8')
      );

      // Extract schemas from OpenAPI spec
      if (openApiSpec.components && openApiSpec.components.schemas) {
        Object.entries(openApiSpec.components.schemas).forEach(([name, schema]) => {
          this.schemas.set(name, schema);
          this.ajv.addSchema(schema, name);
        });
      }

      // Extract response schemas from paths
      if (openApiSpec.paths) {
        Object.entries(openApiSpec.paths).forEach(([path, pathItem]: [string, any]) => {
          Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
            if (operation.responses) {
              Object.entries(operation.responses).forEach(([status, response]: [string, any]) => {
                if (response.content && response.content['application/json']) {
                  const schema = response.content['application/json'].schema;
                  const schemaName = `${method.toUpperCase()}_${path.replace(/[^a-zA-Z0-9]/g, '_')}_${status}`;
                  this.schemas.set(schemaName, schema);
                  this.ajv.addSchema(schema, schemaName);
                }
              });
            }
          });
        });
      }
    } catch (error) {
      console.error('Failed to load OpenAPI schemas:', error);
    }
  }

  validateResponse(data: any, schemaName: string): { valid: boolean; errors?: any[] } {
    const validate = this.ajv.getSchema(schemaName);
    
    if (!validate) {
      return { valid: false, errors: [`Schema '${schemaName}' not found`] };
    }

    const valid = validate(data);
    return {
      valid,
      errors: valid ? undefined : validate.errors
    };
  }

  validateRequestBody(data: any, schemaName: string): { valid: boolean; errors?: any[] } {
    return this.validateResponse(data, schemaName);
  }

  getAvailableSchemas(): string[] {
    return Array.from(this.schemas.keys());
  }
}
```

#### **Contract Testing Implementation**

```typescript
// tests/api/contract/contract-tests.spec.ts
import { test, expect } from '@playwright/test';
import { APIClient } from '../base/api-client';
import { SchemaValidator } from './schema-validator';

test.describe('API Contract Testing', () => {
  let apiClient: APIClient;
  let schemaValidator: SchemaValidator;

  test.beforeAll(async ({ request }) => {
    apiClient = new APIClient(request);
    schemaValidator = new SchemaValidator();
  });

  test('GET /users - should conform to schema', async ({ request }) => {
    const response = await apiClient.get('/users');
    const responseData = await apiClient.validateResponse(response, 200);

    // Validate response schema
    const validation = schemaValidator.validateResponse(responseData, 'GET_users_200');
    
    if (!validation.valid) {
      console.error('Schema validation errors:', validation.errors);
    }
    
    expect(validation.valid).toBe(true);

    // Additional contract validations
    expect(responseData).toHaveProperty('data');
    expect(responseData).toHaveProperty('meta');
    expect(Array.isArray(responseData.data)).toBe(true);
    
    if (responseData.data.length > 0) {
      const user = responseData.data[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(typeof user.id).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.name).toBe('string');
    }
  });

  test('POST /users - should accept valid user data', async ({ request }) => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user'
    };

    // Validate request schema
    const requestValidation = schemaValidator.validateRequestBody(userData, 'UserCreateRequest');
    expect(requestValidation.valid).toBe(true);

    const response = await apiClient.post('/users', userData);
    const responseData = await apiClient.validateResponse(response, 201);

    // Validate response schema
    const responseValidation = schemaValidator.validateResponse(responseData, 'POST_users_201');
    expect(responseValidation.valid).toBe(true);

    // Contract-specific validations
    expect(responseData).toHaveProperty('id');
    expect(responseData.name).toBe(userData.name);
    expect(responseData.email).toBe(userData.email);
    expect(responseData.role).toBe(userData.role);
    expect(responseData).toHaveProperty('createdAt');
    expect(responseData).toHaveProperty('updatedAt');
  });

  test('API versioning - should maintain backward compatibility', async ({ request }) => {
    // Test v1 API
    const v1Response = await apiClient.get('/v1/users');
    const v1Data = await apiClient.validateResponse(v1Response, 200);
    
    // Test v2 API
    const v2Response = await apiClient.get('/v2/users');
    const v2Data = await apiClient.validateResponse(v2Response, 200);

    // Ensure v2 maintains v1 compatibility
    expect(v2Data).toHaveProperty('data');
    expect(Array.isArray(v2Data.data)).toBe(true);
    
    if (v1Data.data.length > 0 && v2Data.data.length > 0) {
      const v1User = v1Data.data[0];
      const v2User = v2Data.data.find((u: any) => u.id === v1User.id);
      
      if (v2User) {
        // Check that all v1 fields are present in v2
        Object.keys(v1User).forEach(key => {
          expect(v2User).toHaveProperty(key);
        });
      }
    }
  });

  test('Error response contracts', async ({ request }) => {
    // Test 404 error contract
    const notFoundResponse = await apiClient.get('/users/nonexistent-id');
    expect(notFoundResponse.status()).toBe(404);
    
    const errorData = await notFoundResponse.json();
    const errorValidation = schemaValidator.validateResponse(errorData, 'ErrorResponse');
    expect(errorValidation.valid).toBe(true);

    expect(errorData).toHaveProperty('error');
    expect(errorData).toHaveProperty('message');
    expect(errorData).toHaveProperty('timestamp');
    expect(errorData.error).toBe('NOT_FOUND');

    // Test 400 error contract
    const badRequestResponse = await apiClient.post('/users', { invalid: 'data' });
    expect(badRequestResponse.status()).toBe(400);
    
    const badRequestData = await badRequestResponse.json();
    const badRequestValidation = schemaValidator.validateResponse(badRequestData, 'ValidationErrorResponse');
    expect(badRequestValidation.valid).toBe(true);

    expect(badRequestData).toHaveProperty('error');
    expect(badRequestData).toHaveProperty('message');
    expect(badRequestData).toHaveProperty('details');
    expect(Array.isArray(badRequestData.details)).toBe(true);
  });
});
```

### **Breaking Change Detection**

```typescript
// tests/api/contract/breaking-change-detector.ts
export interface APIChange {
  type: 'breaking' | 'non-breaking';
  category: 'endpoint' | 'schema' | 'response' | 'parameter';
  description: string;
  path: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class BreakingChangeDetector {
  detectChanges(oldSpec: any, newSpec: any): APIChange[] {
    const changes: APIChange[] = [];

    // Check for removed endpoints
    changes.push(...this.detectRemovedEndpoints(oldSpec, newSpec));
    
    // Check for changed response schemas
    changes.push(...this.detectSchemaChanges(oldSpec, newSpec));
    
    // Check for removed required parameters
    changes.push(...this.detectParameterChanges(oldSpec, newSpec));

    return changes;
  }

  private detectRemovedEndpoints(oldSpec: any, newSpec: any): APIChange[] {
    const changes: APIChange[] = [];
    
    if (!oldSpec.paths || !newSpec.paths) return changes;

    Object.keys(oldSpec.paths).forEach(path => {
      if (!newSpec.paths[path]) {
        changes.push({
          type: 'breaking',
          category: 'endpoint',
          description: `Endpoint removed: ${path}`,
          path,
          severity: 'critical'
        });
        return;
      }

      const oldMethods = Object.keys(oldSpec.paths[path]);
      const newMethods = Object.keys(newSpec.paths[path]);

      oldMethods.forEach(method => {
        if (!newMethods.includes(method)) {
          changes.push({
            type: 'breaking',
            category: 'endpoint',
            description: `Method removed: ${method.toUpperCase()} ${path}`,
            path: `${method.toUpperCase()} ${path}`,
            severity: 'critical'
          });
        }
      });
    });

    return changes;
  }

  private detectSchemaChanges(oldSpec: any, newSpec: any): APIChange[] {
    const changes: APIChange[] = [];
    
    // Compare response schemas
    if (oldSpec.paths && newSpec.paths) {
      Object.keys(oldSpec.paths).forEach(path => {
        if (newSpec.paths[path]) {
          Object.keys(oldSpec.paths[path]).forEach(method => {
            if (newSpec.paths[path][method]) {
              const oldResponses = oldSpec.paths[path][method].responses;
              const newResponses = newSpec.paths[path][method].responses;
              
              if (oldResponses && newResponses) {
                Object.keys(oldResponses).forEach(status => {
                  if (newResponses[status]) {
                    const schemaChanges = this.compareSchemas(
                      oldResponses[status],
                      newResponses[status],
                      `${method.toUpperCase()} ${path} ${status}`
                    );
                    changes.push(...schemaChanges);
                  }
                });
              }
            }
          });
        }
      });
    }

    return changes;
  }

  private compareSchemas(oldResponse: any, newResponse: any, path: string): APIChange[] {
    const changes: APIChange[] = [];
    
    const oldSchema = oldResponse.content?.['application/json']?.schema;
    const newSchema = newResponse.content?.['application/json']?.schema;
    
    if (oldSchema && newSchema) {
      // Check for removed required properties
      if (oldSchema.required && newSchema.required) {
        oldSchema.required.forEach((prop: string) => {
          if (!newSchema.required.includes(prop)) {
            changes.push({
              type: 'breaking',
              category: 'schema',
              description: `Required property removed: ${prop}`,
              path: `${path}.${prop}`,
              severity: 'high'
            });
          }
        });
      }

      // Check for removed properties
      if (oldSchema.properties && newSchema.properties) {
        Object.keys(oldSchema.properties).forEach(prop => {
          if (!newSchema.properties[prop]) {
            changes.push({
              type: 'breaking',
              category: 'schema',
              description: `Property removed: ${prop}`,
              path: `${path}.${prop}`,
              severity: 'medium'
            });
          }
        });
      }
    }

    return changes;
  }

  private detectParameterChanges(oldSpec: any, newSpec: any): APIChange[] {
    const changes: APIChange[] = [];
    
    if (!oldSpec.paths || !newSpec.paths) return changes;

    Object.keys(oldSpec.paths).forEach(path => {
      if (newSpec.paths[path]) {
        Object.keys(oldSpec.paths[path]).forEach(method => {
          if (newSpec.paths[path][method]) {
            const oldParams = oldSpec.paths[path][method].parameters || [];
            const newParams = newSpec.paths[path][method].parameters || [];
            
            oldParams.forEach((oldParam: any) => {
              const newParam = newParams.find((p: any) => p.name === oldParam.name);
              
              if (!newParam) {
                changes.push({
                  type: 'breaking',
                  category: 'parameter',
                  description: `Parameter removed: ${oldParam.name}`,
                  path: `${method.toUpperCase()} ${path}`,
                  severity: oldParam.required ? 'high' : 'medium'
                });
              } else if (oldParam.required && !newParam.required) {
                changes.push({
                  type: 'non-breaking',
                  category: 'parameter',
                  description: `Parameter made optional: ${oldParam.name}`,
                  path: `${method.toUpperCase()} ${path}`,
                  severity: 'low'
                });
              } else if (!oldParam.required && newParam.required) {
                changes.push({
                  type: 'breaking',
                  category: 'parameter',
                  description: `Parameter made required: ${oldParam.name}`,
                  path: `${method.toUpperCase()} ${path}`,
                  severity: 'high'
                });
              }
            });
          }
        });
      }
    });

    return changes;
  }
}
```

## 📚 Part 3: API Performance Testing in CI/CD (60 minutes)

### **Load Testing Automation with Playwright**

Performance testing ensures that APIs can handle expected load and perform within acceptable limits. Here's how to implement comprehensive performance testing:

#### **Performance Testing Framework**

```typescript
// tests/api/performance/performance-tester.ts
export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  concurrency: number;
  duration: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
}

export interface LoadTestConfig {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  concurrency: number;
  duration: number; // in seconds
  rampUpTime: number; // in seconds
  data?: any;
  headers?: Record<string, string>;
  thresholds: {
    averageResponseTime: number;
    p95ResponseTime: number;
    errorRate: number;
    throughput: number;
  };
}

export class PerformanceTester {
  private results: number[] = [];
  private errors: number = 0;
  private startTime: number = 0;
  private endTime: number = 0;

  async runLoadTest(config: LoadTestConfig, apiClient: APIClient): Promise<PerformanceMetrics> {
    this.reset();
    this.startTime = Date.now();

    const promises: Promise<void>[] = [];
    const requestsPerSecond = Math.ceil(config.concurrency / config.duration);
    
    // Ramp up phase
    if (config.rampUpTime > 0) {
      await this.rampUp(config, apiClient, requestsPerSecond);
    }

    // Main load test phase
    for (let i = 0; i < config.concurrency; i++) {
      promises.push(this.executeRequest(config, apiClient));
      
      // Add delay to distribute requests over time
      if (i % requestsPerSecond === 0 && i > 0) {
        await this.sleep(1000);
      }
    }

    await Promise.all(promises);
    this.endTime = Date.now();

    return this.calculateMetrics(config);
  }

  private async rampUp(config: LoadTestConfig, apiClient: APIClient, requestsPerSecond: number) {
    const rampUpRequests = Math.ceil(config.concurrency * 0.1); // 10% of total requests
    const rampUpPromises: Promise<void>[] = [];

    for (let i = 0; i < rampUpRequests; i++) {
      rampUpPromises.push(this.executeRequest(config, apiClient));
      
      if (i % Math.ceil(requestsPerSecond / 10) === 0) {
        await this.sleep(100);
      }
    }

    await Promise.all(rampUpPromises);
  }

  private async executeRequest(config: LoadTestConfig, apiClient: APIClient): Promise<void> {
    const requestStart = Date.now();
    
    try {
      let response;
      
      switch (config.method) {
        case 'GET':
          response = await apiClient.get(config.endpoint, { headers: config.headers });
          break;
        case 'POST':
          response = await apiClient.post(config.endpoint, config.data, { headers: config.headers });
          break;
        case 'PUT':
          response = await apiClient.put(config.endpoint, config.data, { headers: config.headers });
          break;
        case 'DELETE':
          response = await apiClient.delete(config.endpoint, { headers: config.headers });
          break;
      }

      const requestEnd = Date.now();
      const responseTime = requestEnd - requestStart;
      
      if (response.status() >= 200 && response.status() < 400) {
        this.results.push(responseTime);
      } else {
        this.errors++;
      }
    } catch (error) {
      this.errors++;
      console.error('Request failed:', error);
    }
  }

  private calculateMetrics(config: LoadTestConfig): PerformanceMetrics {
    const totalRequests = this.results.length + this.errors;
    const successfulRequests = this.results.length;
    const failedRequests = this.errors;
    const duration = (this.endTime - this.startTime) / 1000; // Convert to seconds
    
    this.results.sort((a, b) => a - b);
    
    const averageResponseTime = this.results.reduce((sum, time) => sum + time, 0) / this.results.length;
    const p95Index = Math.ceil(this.results.length * 0.95) - 1;
    const p99Index = Math.ceil(this.results.length * 0.99) - 1;
    const p95ResponseTime = this.results[p95Index] || 0;
    const p99ResponseTime = this.results[p99Index] || 0;
    
    const throughput = totalRequests / duration;
    const errorRate = (failedRequests / totalRequests) * 100;

    return {
      responseTime: averageResponseTime,
      throughput,
      errorRate,
      concurrency: config.concurrency,
      duration,
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime,
      p95ResponseTime,
      p99ResponseTime
    };
  }

  private reset() {
    this.results = [];
    this.errors = 0;
    this.startTime = 0;
    this.endTime = 0;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  validateThresholds(metrics: PerformanceMetrics, thresholds: LoadTestConfig['thresholds']): {
    passed: boolean;
    failures: string[];
  } {
    const failures: string[] = [];

    if (metrics.averageResponseTime > thresholds.averageResponseTime) {
      failures.push(`Average response time ${metrics.averageResponseTime}ms exceeds threshold ${thresholds.averageResponseTime}ms`);
    }

    if (metrics.p95ResponseTime > thresholds.p95ResponseTime) {
      failures.push(`P95 response time ${metrics.p95ResponseTime}ms exceeds threshold ${thresholds.p95ResponseTime}ms`);
    }

    if (metrics.errorRate > thresholds.errorRate) {
      failures.push(`Error rate ${metrics.errorRate}% exceeds threshold ${thresholds.errorRate}%`);
    }

    if (metrics.throughput < thresholds.throughput) {
      failures.push(`Throughput ${metrics.throughput} req/s is below threshold ${thresholds.throughput} req/s`);
    }

    return {
      passed: failures.length === 0,
      failures
    };
  }
}
```

#### **Performance Test Implementation**

```typescript
// tests/api/performance/load-tests.spec.ts
import { test, expect } from '@playwright/test';