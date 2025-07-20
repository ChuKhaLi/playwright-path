# Lesson 07: API Testing in CI/CD Pipelines - Hands-on Exercises

## 🎯 Exercise Overview

These comprehensive exercises will guide you through implementing production-ready API testing in CI/CD pipelines. Each exercise builds upon the previous one, culminating in a complete API testing strategy suitable for enterprise environments.

## 📋 Prerequisites

Before starting these exercises, ensure you have:
- GitHub account with Actions enabled
- Node.js 18+ installed locally
- Docker Desktop installed and running
- Basic understanding of Playwright API testing
- Access to a test API (we'll provide mock API setup)

## 🏗️ Exercise 1: Multi-Environment API Testing Pipeline

### **Objective**
Create a complete API testing pipeline that runs across multiple environments with proper configuration management and secret handling.

### **Duration**: 90 minutes

### **Step 1: Project Setup**

Create a new repository and set up the basic structure:

```bash
mkdir api-testing-pipeline
cd api-testing-pipeline
npm init -y
npm install @playwright/test typescript @types/node
npm install --save-dev ajv ajv-formats
npx playwright install
```

Create the basic project structure:

```
api-testing-pipeline/
├── .github/
│   └── workflows/
│       └── api-testing.yml
├── config/
│   └── environments.ts
├── tests/
│   └── api/
│       ├── base/
│       │   └── api-client.ts
│       ├── auth/
│       │   └── auth-manager.ts
│       └── functional/
│           └── users.spec.ts
├── schemas/
│   └── openapi.json
├── playwright.api.config.ts
└── package.json
```

### **Step 2: Environment Configuration**

Create `config/environments.ts`:

```typescript
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
    apiBaseUrl: process.env.DEV_API_URL || 'https://jsonplaceholder.typicode.com',
    apiKey: process.env.DEV_API_KEY || 'dev-key',
    timeout: 10000,
    retries: 2,
    rateLimit: { requests: 100, window: 60000 },
    features: { authRequired: false, rateLimitingEnabled: false, cachingEnabled: false }
  },
  staging: {
    apiBaseUrl: process.env.STAGING_API_URL || 'https://staging-api.example.com',
    apiKey: process.env.STAGING_API_KEY || '',
    timeout: 15000,
    retries: 3,
    rateLimit: { requests: 1000, window: 60000 },
    features: { authRequired: true, rateLimitingEnabled: true, cachingEnabled: true }
  },
  production: {
    apiBaseUrl: process.env.PROD_API_URL || 'https://api.example.com',
    apiKey: process.env.PROD_API_KEY || '',
    timeout: 20000,
    retries: 5,
    rateLimit: { requests: 10000, window: 60000 },
    features: { authRequired: true, rateLimitingEnabled: true, cachingEnabled: true }
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

### **Step 3: API Client Implementation**

Create `tests/api/base/api-client.ts`:

```typescript
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

### **Step 4: Test Implementation**

Create `tests/api/functional/users.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { APIClient } from '../base/api-client';

test.describe('Users API - Multi-Environment Testing', () => {
  let apiClient: APIClient;

  test.beforeAll(async ({ request }) => {
    apiClient = new APIClient(request);
  });

  test('GET /users - should return users list', async ({ request }) => {
    const response = await apiClient.get('/users');
    const users = await apiClient.validateResponse(response, 200);

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);

    // Validate user structure
    const user = users[0];
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
  });

  test('GET /users/{id} - should return specific user', async ({ request }) => {
    const response = await apiClient.get('/users/1');
    const user = await apiClient.validateResponse(response, 200);

    expect(user).toHaveProperty('id', 1);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('address');
    expect(user).toHaveProperty('company');
  });

  test('POST /users - should create new user', async ({ request }) => {
    const newUser = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com'
    };

    const response = await apiClient.post('/users', newUser);
    const createdUser = await apiClient.validateResponse(response, 201);

    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.username).toBe(newUser.username);
    expect(createdUser.email).toBe(newUser.email);
  });

  test('Error handling - should handle 404 correctly', async ({ request }) => {
    const response = await apiClient.get('/users/999999');
    expect(response.status()).toBe(404);
  });
});
```

### **Step 5: GitHub Actions Workflow**

Create `.github/workflows/api-testing.yml`:

```yaml
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
        default: 'development'
        type: choice
        options:
        - development
        - staging

env:
  NODE_VERSION: '18'

jobs:
  api-testing:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [development]
        include:
          - environment: development
            api_url: 'https://jsonplaceholder.typicode.com'
            api_key: 'dev-key'
    
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
          DEV_API_URL: ${{ matrix.api_url }}
          DEV_API_KEY: ${{ matrix.api_key }}
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

      - name: Comment PR with results
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const fs = require('fs');
            const path = 'test-results/${{ matrix.environment }}/results.json';
            
            if (fs.existsSync(path)) {
              const results = JSON.parse(fs.readFileSync(path, 'utf8'));
              const { stats } = results;
              
              const comment = `## API Test Results - ${{ matrix.environment }}
              
              - ✅ Passed: ${stats.passed}
              - ❌ Failed: ${stats.failed}
              - ⏭️ Skipped: ${stats.skipped}
              - ⏱️ Duration: ${Math.round(stats.duration / 1000)}s
              
              [View detailed report](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})`;
              
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: comment
              });
            }
```

### **Step 6: Playwright Configuration**

Create `playwright.api.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: process.env.API_BASE_URL,
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    ignoreHTTPSErrors: true,
  },
});
```

### **Deliverables**

1. **Working GitHub Actions workflow** that runs API tests
2. **Environment-specific configuration** management
3. **Comprehensive test suite** with proper assertions
4. **Test results and reporting** with artifacts
5. **Documentation** explaining the setup and usage

### **Validation Criteria**

- [ ] Tests run successfully in GitHub Actions
- [ ] Environment configuration is properly managed
- [ ] Test results are uploaded as artifacts
- [ ] PR comments show test results summary
- [ ] All tests pass with proper assertions

---

## 🏗️ Exercise 2: API Contract Testing Implementation

### **Objective**
Implement comprehensive contract testing and schema validation using OpenAPI specifications.

### **Duration**: 120 minutes

### **Step 1: OpenAPI Schema Setup**

Create `schemas/openapi.json`:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Users API",
    "version": "1.0.0"
  },
  "paths": {
    "/users": {
      "get": {
        "responses": {
          "200": {
            "description": "List of users",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserCreateRequest"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User created",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "400": {
            "description": "Validation error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ValidationError"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "required": ["id", "name", "email"],
        "properties": {
          "id": {
            "type": "integer"
          },
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string",
            "format": "email"
          },
          "username": {
            "type": "string"
          },
          "address": {
            "$ref": "#/components/schemas/Address"
          },
          "company": {
            "$ref": "#/components/schemas/Company"
          }
        }
      },
      "UserCreateRequest": {
        "type": "object",
        "required": ["name", "email"],
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1
          },
          "email": {
            "type": "string",
            "format": "email"
          },
          "username": {
            "type": "string"
          }
        }
      },
      "Address": {
        "type": "object",
        "properties": {
          "street": {"type": "string"},
          "suite": {"type": "string"},
          "city": {"type": "string"},
          "zipcode": {"type": "string"}
        }
      },
      "Company": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "catchPhrase": {"type": "string"},
          "bs": {"type": "string"}
        }
      },
      "ValidationError": {
        "type": "object",
        "required": ["error", "message"],
        "properties": {
          "error": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "details": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "field": {"type": "string"},
                "message": {"type": "string"}
              }
            }
          }
        }
      }
    }
  }
}
```

### **Step 2: Schema Validator Implementation**

Create `tests/api/contract/schema-validator.ts`:

```typescript
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

### **Step 3: Contract Tests Implementation**

Create `tests/api/contract/contract-tests.spec.ts`:

```typescript
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
    const validation = schemaValidator.validateResponse(responseData, 'GET__users_200');
    
    if (!validation.valid) {
      console.error('Schema validation errors:', validation.errors);
    }
    
    expect(validation.valid).toBe(true);

    // Additional contract validations
    expect(Array.isArray(responseData)).toBe(true);
    
    if (responseData.length > 0) {
      const user = responseData[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(typeof user.id).toBe('number');
      expect(typeof user.email).toBe('string');
      expect(typeof user.name).toBe('string');
    }
  });

  test('POST /users - should accept valid user data', async ({ request }) => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      username: 'johndoe'
    };

    // Validate request schema
    const requestValidation = schemaValidator.validateRequestBody(userData, 'UserCreateRequest');
    expect(requestValidation.valid).toBe(true);

    const response = await apiClient.post('/users', userData);
    const responseData = await apiClient.validateResponse(response, 201);

    // Validate response schema
    const responseValidation = schemaValidator.validateResponse(responseData, 'User');
    expect(responseValidation.valid).toBe(true);

    // Contract-specific validations
    expect(responseData).toHaveProperty('id');
    expect(responseData.name).toBe(userData.name);
    expect(responseData.email).toBe(userData.email);
  });

  test('POST /users - should reject invalid data', async ({ request }) => {
    const invalidData = {
      name: '', // Invalid: empty name
      email: 'invalid-email' // Invalid: bad email format
    };

    const response = await apiClient.post('/users', invalidData);
    
    // For JSONPlaceholder, it will still return 201, but in real API it should be 400
    // This test demonstrates how to handle validation errors
    if (response.status() === 400) {
      const errorData = await response.json();
      const errorValidation = schemaValidator.validateResponse(errorData, 'ValidationError');
      expect(errorValidation.valid).toBe(true);
    }
  });

  test('Schema validation - all available schemas', async () => {
    const availableSchemas = schemaValidator.getAvailableSchemas();
    console.log('Available schemas:', availableSchemas);
    
    expect(availableSchemas.length).toBeGreaterThan(0);
    expect(availableSchemas).toContain('User');
    expect(availableSchemas).toContain('UserCreateRequest');
  });
});
```

### **Deliverables**

1. **OpenAPI specification** with comprehensive schemas
2. **Schema validator** with proper error handling
3. **Contract tests** validating request/response schemas
4. **Integration** with existing CI/CD pipeline
5. **Documentation** of contract testing approach

### **Validation Criteria**

- [ ] OpenAPI schema is properly structured
- [ ] Schema validator correctly validates data
- [ ] Contract tests pass with proper assertions
- [ ] Integration with CI/CD pipeline works
- [ ] Error handling for invalid schemas

---

## 🏗️ Exercise 3: API Performance Testing Automation

### **Objective**
Create automated API performance testing and monitoring with configurable thresholds and comprehensive reporting.

### **Duration**: 120 minutes

### **Step 1: Performance Testing Framework**

Create `tests/api/performance/performance-tester.ts`:

```typescript
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
  duration: number;
  rampUpTime: number;
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

  async runLoadTest(config: LoadTestConfig, apiClient: any): Promise<PerformanceMetrics> {
    this.reset();
    this.startTime = Date.now();

    const promises: Promise<void>[] = [];
    
    // Create concurrent requests
    for (let i = 0; i < config.concurrency; i++) {
      promises.push(this.executeRequest(config, apiClient));
    }

    await Promise.all(promises);
    this.endTime = Date.now();

    return this.calculateMetrics(config);
  }

  private async executeRequest(config: LoadTestConfig, apiClient: any): Promise<void> {
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
        default:
          throw new Error(`Unsupported method: ${config.method}`);
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
    const duration = (this.endTime - this.startTime) / 1000;
    
    this.results.sort((a, b) => a - b);
    
    const averageResponseTime = this.results.reduce((sum, time) => sum + time, 0) / this.results.length || 0;
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

### **Step 2: Performance Tests Implementation**

Create `tests/api/performance/load-tests.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { APIClient } from '../base/api-client';
import { PerformanceTester, LoadTestConfig } from './performance-tester';
import { writeFileSync } from 'fs';

test.describe('API Performance Testing', () => {
  let apiClient: APIClient;
  let performanceTester: PerformanceTester;

  test.beforeAll(async ({ request }) => {
    apiClient = new APIClient(request);
    performanceTester = new PerformanceTester();
  });

  test('Load test - GET /users endpoint', async ({ request }) => {
    const config: LoadTestConfig = {
      endpoint: '/users',
      method: 'GET',
      concurrency: 10,
      duration: 30,
      rampUpTime: 5,
      thresholds: {
        averageResponseTime: 1000, // 1 second
        p95ResponseTime: 2000,     // 2 seconds
        errorRate: 5,              // 5%
        throughput: 5              // 5 requests per second
      }
    };

    console.log('Starting load test with config:', config);
    
    const metrics = await performanceTester.runLoadTest(config, apiClient);
    
    console.log('Performance metrics:', metrics);

    // Save metrics to file for reporting
    writeFileSync(
      'test-results/performance-metrics.json',
      JSON.stringify(metrics, null, 2)
    );

    // Validate thresholds
    const validation = performanceTester.validateThresholds(metrics, config.thresholds);
    
    if (!validation.passed) {
      console.error('Performance thresholds failed:', validation.failures);
    }

    // Assertions
    expect(validation.passed).toBe(true);
    expect(metrics.errorRate).toBeLessThanOrEqual(config.thresholds.errorRate);
    expect(metrics.averageResponseTime).toBeLessThanOrEqual(config.thresholds.averageResponseTime);
    expect(metrics.throughput).toBeGreaterThanOrEqual(config.thresholds.throughput);
  });

  test('Stress test - increasing load', async ({ request }) => {
    const baseConfig: LoadTestConfig = {
      endpoint: '/users',
      method: 'GET',
      concurrency: 5,