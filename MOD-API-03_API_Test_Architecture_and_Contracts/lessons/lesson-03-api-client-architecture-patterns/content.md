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
import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiClientError, ApiValidationError } from './types';

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

  /**
   * Execute HTTP request with built-in error handling and retries
   */
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
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);
    
    let lastError: Error | undefined;
    
    // Retry mechanism with exponential backoff
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
    
    throw new ApiClientError(`Request failed after ${this.config.retries} attempts for ${method} ${endpoint}`, lastError);
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.config.baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      }
    }
    return url.toString();
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

  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  public clearAuthToken(): void {
    this.authToken = undefined;
  }
}
```

### 2. Response and Error Types

```typescript
// src/api/types.ts
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
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}
```

## 🔐 Authentication Architecture Patterns

(Content from the original file for Authentication, Resilience, etc. remains here...)

## 🧱 Advanced Structural and Creational Patterns

Beyond the foundational patterns, several other classic design patterns are highly effective for building clean and scalable API test frameworks.

### 1. Repository Pattern

The Repository pattern abstracts the data layer. In API testing, we can think of our API endpoints as a data source. The repository mediates between the domain and data mapping layers, acting like an in-memory collection of domain objects.

**Concept:** Instead of having `UserApiClient` with methods like `getUser`, `createUser`, we create a `UserRepository` that provides these methods. This decouples the test logic from the specifics of the API client implementation. Your tests interact with a "repository" of users, not directly with an HTTP client.

**Benefits:**
-   **Decoupling:** Your tests don't need to know about HTTP methods (`GET`, `POST`). They just ask the repository to `find`, `add`, or `remove` a user.
-   **Testability:** You can easily mock the repository in your tests to provide fake data, allowing you to test business logic without making real API calls.
-   **Flexibility:** If the underlying data source changes (e.g., from a REST API to GraphQL), you only need to update the repository implementation, not the tests that use it.

**Implementation:**

```typescript
// src/api/repositories/UserRepository.ts
import { User, CreateUserRequest, UpdateUserRequest } from '../clients/UserApiClient';
import { UserApiClient } from '../clients/UserApiClient';

// The repository interface defines the contract
export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findAll(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<User>>;
  create(data: CreateUserRequest): Promise<User>;
  update(id: number, data: UpdateUserRequest): Promise<User>;
  delete(id: number): Promise<void>;
}

// The concrete repository implements the interface using an API client
export class UserRepository implements IUserRepository {
  constructor(private apiClient: UserApiClient) {}

  async findById(id: number): Promise<User | null> {
    try {
      return await this.apiClient.getUserById(id);
    } catch (error) {
      if (error instanceof ApiValidationError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findAll(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<User>> {
    return this.apiClient.getUsers(params);
  }

  async create(data: CreateUserRequest): Promise<User> {
    return this.apiClient.createUser(data);
  }

  async update(id: number, data: UpdateUserRequest): Promise<User> {
    return this.apiClient.updateUser(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.deleteUser(id);
  }
}
```

**Usage in a Test:**

```typescript
test('should create and then find a user via repository', async ({ request }) => {
  const userApiClient = new UserApiClient(request, { baseUrl: '...' });
  const userRepository = new UserRepository(userApiClient);

  const newUser = await userRepository.create({
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'password123'
  });

  const foundUser = await userRepository.findById(newUser.id);
  expect(foundUser).toBeDefined();
  expect(foundUser!.id).toBe(newUser.id);
});
```

### 2. Factory Pattern

The Factory pattern provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created. It's useful for creating complex objects, like different types of API clients or test data.

**Concept:** Instead of using the `new` keyword directly in your tests, you use a factory function or class.

**Use Cases in API Testing:**
1.  **API Client Factory:** Create different API clients (e.g., `UserApiClient`, `ProductApiClient`) from a central factory.
2.  **Test Data Factory:** Generate test data objects with default values, which can be overridden for specific tests.

**Implementation (Test Data Factory):**

```typescript
// src/test-data/factories/UserFactory.ts
import { CreateUserRequest } from '../../api/clients/UserApiClient';
import { faker } from '@faker-js/faker';

export class UserFactory {
  static create(overrides: Partial<CreateUserRequest> = {}): CreateUserRequest {
    return {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
      role: 'user',
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<CreateUserRequest> = {}): CreateUserRequest[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
```

**Usage in a Test:**

```typescript
test('should create a user with a specific role', async ({ userRepository }) => {
  // Create a user with a specific role, letting the factory handle the rest
  const adminUserData = UserFactory.create({ role: 'admin' });
  
  const adminUser = await userRepository.create(adminUserData);
  
  expect(adminUser.role).toBe('admin');
});
```

### 3. Builder Pattern

The Builder pattern is used to construct complex objects step by step. It's particularly useful for creating request payloads where many fields are optional. The builder provides a "fluent" API that is highly readable.

**Concept:** Instead of passing a large configuration object to a constructor, you use a series of methods to build the object.

**Implementation (Request Payload Builder):**

```typescript
// src/api/builders/UserSearchBuilder.ts
export class UserSearchBuilder {
  private params: { [key: string]: any } = {};

  withEmail(email: string): this {
    this.params.email = email;
    return this;
  }

  withRole(role: 'admin' | 'user'): this {
    this.params.role = role;
    return this;
  }

  isActive(status: boolean): this {
    this.params.isActive = status;
    return this;
  }

  createdAfter(date: Date): this {
    this.params.createdAfter = date.toISOString();
    return this;
  }

  build(): { [key: string]: any } {
    return this.params;
  }
}
```

**Usage in a Test:**

```typescript
test('should search for active admin users', async ({ userApiClient }) => {
  const searchParams = new UserSearchBuilder()
    .withRole('admin')
    .isActive(true)
    .build();

  const results = await userApiClient.searchUsers(searchParams);
  
  // Assert that all returned users are active admins
  results.forEach(user => {
    expect(user.role).toBe('admin');
    expect(user.isActive).toBe(true);
  });
});
```

## 🏢 Tying It All Together: A Modern API Test Framework

Here is how these patterns combine to create a powerful and clean architecture:

```
+-----------------------------------------------------------------+
|                           Test Layer                            |
|    (e.g., user.spec.ts - uses repositories and factories)       |
|-----------------------------------------------------------------|
|                       Business Logic Layer                      |
| (e.g., loginAsAdmin() - uses repositories for complex workflows)|
|-----------------------------------------------------------------|
|                        Repository Layer                         |
|      (e.g., UserRepository - abstracts data access)             |
|-----------------------------------------------------------------|
|                         API Client Layer                          |
| (e.g., UserApiClient - handles HTTP requests and responses)     |
|-----------------------------------------------------------------|
|                         Framework Core                          |
|   (BaseApiClient, AuthManager, Config, Resilience Patterns)     |
+-----------------------------------------------------------------+
```

Your tests become incredibly clean and focused on the business logic, not the implementation details of HTTP or authentication.

**Example Test with Full Architecture:**

```typescript
// tests/advanced-user.spec.ts
import { test, expect } from '@playwright/test';
import { test } from '../fixtures'; // Custom fixture that provides repositories
import { UserFactory } from '../test-data/factories/UserFactory';

test.describe('Advanced User Management', () => {
  test('should create a user and be able to find them', async ({ userRepository }) => {
    // Arrange: Use a factory to create test data
    const userData = UserFactory.create({ role: 'editor' });

    // Act: Use the repository to interact with the API
    const createdUser = await userRepository.create(userData);
    const foundUser = await userRepository.findById(createdUser.id);

    // Assert
    expect(foundUser).toBeDefined();
    expect(foundUser!.email).toBe(userData.email);
    expect(foundUser!.role).toBe('editor');
  });
});
```

This approach provides maximum scalability and maintainability for large, enterprise-level projects.