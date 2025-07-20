# Hands-On Practice: API Client Architecture Patterns

## 🎯 Exercise Overview

These exercises will help you master professional API client architecture patterns through hands-on implementation. You'll build enterprise-grade API clients with authentication, error handling, and resilience patterns.

## 📋 Prerequisites

- Completion of Lesson 03 content
- Understanding of TypeScript classes and interfaces
- Basic knowledge of Playwright request fixture
- Familiarity with async/await patterns

## 🛠️ Exercise 1: Basic API Client Implementation

### **Objective**
Create a basic API client with proper error handling and retry mechanisms.

### **Requirements**
1. Implement a `BaseApiClient` class with the following features:
   - HTTP method support (GET, POST, PUT, DELETE)
   - Automatic retry with exponential backoff
   - Response validation and error handling
   - Request/response logging

### **Implementation Task**

```typescript
// exercises/basic-api-client/BaseApiClient.ts
import { APIRequestContext } from '@playwright/test';

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  status: number;
  headers: Record<string, string>;
  data: T;
  success: boolean;
}

// TODO: Implement BaseApiClient class
export class BaseApiClient {
  // Your implementation here
}
```

### **Test Your Implementation**

```typescript
// exercises/basic-api-client/test-basic-client.spec.ts
import { test, expect } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';

test.describe('Basic API Client', () => {
  let apiClient: BaseApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new BaseApiClient(request, {
      baseUrl: 'https://jsonplaceholder.typicode.com',
      timeout: 30000,
      retries: 3
    });
  });

  test('should make successful GET request', async () => {
    const response = await apiClient.executeRequest('GET', '/posts/1');
    
    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', 1);
  });

  test('should handle 404 errors gracefully', async () => {
    await expect(
      apiClient.executeRequest('GET', '/posts/999999')
    ).rejects.toThrow();
  });

  test('should retry failed requests', async () => {
    // Test with invalid URL to trigger retries
    await expect(
      apiClient.executeRequest('GET', '/invalid-endpoint')
    ).rejects.toThrow();
  });
});
```

### **Success Criteria**
- ✅ All tests pass
- ✅ Proper error handling implemented
- ✅ Retry mechanism works with exponential backoff
- ✅ Response validation functions correctly

---

## 🛠️ Exercise 2: Authentication Strategy Implementation

### **Objective**
Implement multiple authentication strategies using the Strategy pattern.

### **Requirements**
1. Create `AuthStrategy` interface
2. Implement `BearerTokenAuth` strategy
3. Implement `ApiKeyAuth` strategy
4. Create `AuthManager` to handle different strategies

### **Implementation Task**

```typescript
// exercises/auth-strategies/AuthStrategy.ts
export interface AuthStrategy {
  authenticate(credentials: Record<string, string>): Promise<AuthResult>;
  getAuthHeaders(): Record<string, string>;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  error?: string;
}

// TODO: Implement BearerTokenAuth class
export class BearerTokenAuth implements AuthStrategy {
  // Your implementation here
}

// TODO: Implement ApiKeyAuth class
export class ApiKeyAuth implements AuthStrategy {
  // Your implementation here
}

// TODO: Implement AuthManager class
export class AuthManager {
  // Your implementation here
}
```

### **Test Your Implementation**

```typescript
// exercises/auth-strategies/test-auth-strategies.spec.ts
import { test, expect } from '@playwright/test';
import { BearerTokenAuth, ApiKeyAuth, AuthManager } from './AuthStrategy';

test.describe('Authentication Strategies', () => {
  test('BearerTokenAuth should authenticate and provide headers', async ({ request }) => {
    const auth = new BearerTokenAuth(/* your parameters */);
    
    // Test authentication
    const result = await auth.authenticate({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    
    // Test headers
    const headers = auth.getAuthHeaders();
    expect(headers).toHaveProperty('Authorization');
    expect(headers.Authorization).toMatch(/^Bearer /);
  });

  test('ApiKeyAuth should provide correct headers', async () => {
    const auth = new ApiKeyAuth('test-api-key', 'X-API-Key');
    
    const headers = auth.getAuthHeaders();
    expect(headers).toEqual({ 'X-API-Key': 'test-api-key' });
  });

  test('AuthManager should handle strategy switching', async ({ request }) => {
    const manager = new AuthManager(/* your parameters */);
    
    // Test with Bearer token strategy
    const bearerAuth = new BearerTokenAuth(/* parameters */);
    manager.setStrategy(bearerAuth);
    
    await manager.authenticate({
      email: 'test@example.com',
      password: 'password123'
    });
    
    const bearerHeaders = manager.getAuthHeaders();
    expect(bearerHeaders).toHaveProperty('Authorization');
    
    // Switch to API key strategy
    const apiKeyAuth = new ApiKeyAuth('test-key');
    manager.setStrategy(apiKeyAuth);
    
    const apiKeyHeaders = manager.getAuthHeaders();
    expect(apiKeyHeaders).toHaveProperty('X-API-Key');
  });
});
```

### **Success Criteria**
- ✅ Multiple authentication strategies implemented
- ✅ Strategy pattern correctly applied
- ✅ AuthManager handles strategy switching
- ✅ All authentication tests pass

---

## 🛠️ Exercise 3: Resilience Patterns Implementation

### **Objective**
Implement Circuit Breaker and Rate Limiter patterns for API resilience.

### **Requirements**
1. Implement `CircuitBreaker` class with three states (CLOSED, OPEN, HALF_OPEN)
2. Implement `RateLimiter` class with token bucket algorithm
3. Integrate both patterns into API client

### **Implementation Task**

```typescript
// exercises/resilience-patterns/CircuitBreaker.ts
export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
}

// TODO: Implement CircuitBreaker class
export class CircuitBreaker {
  // Your implementation here
}
```

```typescript
// exercises/resilience-patterns/RateLimiter.ts
export interface RateLimitConfig {
  requestsPerSecond: number;
  burstSize?: number;
  queueSize?: number;
}

// TODO: Implement RateLimiter class
export class RateLimiter {
  // Your implementation here
}
```

### **Test Your Implementation**

```typescript
// exercises/resilience-patterns/test-resilience.spec.ts
import { test, expect } from '@playwright/test';
import { CircuitBreaker, CircuitState } from './CircuitBreaker';
import { RateLimiter } from './RateLimiter';

test.describe('Resilience Patterns', () => {
  test('CircuitBreaker should open after threshold failures', async () => {
    const circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      recoveryTimeout: 5000,
      monitoringPeriod: 10000
    });

    // Simulate failures
    for (let i = 0; i < 3; i++) {
      try {
        await circuitBreaker.execute(async () => {
          throw new Error('Simulated failure');
        });
      } catch (error) {
        // Expected to fail
      }
    }

    expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    
    // Next request should be rejected immediately
    await expect(
      circuitBreaker.execute(async () => 'success')
    ).rejects.toThrow('Circuit breaker is OPEN');
  });

  test('RateLimiter should throttle requests', async () => {
    const rateLimiter = new RateLimiter({
      requestsPerSecond: 2,
      burstSize: 3
    });

    // First 3 requests should pass immediately (burst)
    const startTime = Date.now();
    
    await rateLimiter.waitForPermission();
    await rateLimiter.waitForPermission();
    await rateLimiter.waitForPermission();
    
    const burstTime = Date.now() - startTime;
    expect(burstTime).toBeLessThan(100); // Should be immediate
    
    // 4th request should be delayed
    const delayStart = Date.now();
    await rateLimiter.waitForPermission();
    const delayTime = Date.now() - delayStart;
    
    expect(delayTime).toBeGreaterThan(400); // Should wait ~500ms
  });
});
```

### **Success Criteria**
- ✅ Circuit breaker correctly transitions between states
- ✅ Rate limiter properly throttles requests
- ✅ Both patterns integrate with API client
- ✅ All resilience tests pass

---

## 🛠️ Exercise 4: Complete User API Client

### **Objective**
Build a complete, production-ready User API client with all patterns integrated.

### **Requirements**
1. Extend `BaseApiClient` for user-specific operations
2. Integrate authentication, circuit breaker, and rate limiter
3. Implement CRUD operations with proper error handling
4. Add bulk operations and search functionality

### **Implementation Task**

```typescript
// exercises/user-api-client/UserApiClient.ts
import { BaseApiClient } from '../basic-api-client/BaseApiClient';
import { CircuitBreaker } from '../resilience-patterns/CircuitBreaker';
import { RateLimiter } from '../resilience-patterns/RateLimiter';

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

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

// TODO: Implement UserApiClient class
export class UserApiClient extends BaseApiClient {
  // Your implementation here
}
```

### **Test Your Implementation**

```typescript
// exercises/user-api-client/test-user-client.spec.ts
import { test, expect } from '@playwright/test';
import { UserApiClient } from './UserApiClient';

test.describe('User API Client', () => {
  let userClient: UserApiClient;

  test.beforeEach(async ({ request }) => {
    userClient = new UserApiClient(request, {
      baseUrl: 'https://jsonplaceholder.typicode.com',
      timeout: 30000,
      retries: 3
    });
  });

  test('should get users with pagination', async () => {
    const users = await userClient.getUsers({
      page: 1,
      limit: 10
    });

    expect(users.items).toBeInstanceOf(Array);
    expect(users.items.length).toBeGreaterThan(0);
    expect(users.totalCount).toBeGreaterThan(0);
    expect(users.currentPage).toBe(1);
  });

  test('should get user by ID', async () => {
    const user = await userClient.getUserById(1);

    expect(user).toHaveProperty('id', 1);
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('firstName');
  });

  test('should create new user', async () => {
    const newUser = await userClient.createUser({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
      role: 'user'
    });

    expect(newUser).toHaveProperty('id');
    expect(newUser.email).toBe('test@example.com');
    expect(newUser.firstName).toBe('Test');
  });

  test('should update user', async () => {
    const updatedUser = await userClient.updateUser(1, {
      firstName: 'Updated',
      lastName: 'Name'
    });

    expect(updatedUser.firstName).toBe('Updated');
    expect(updatedUser.lastName).toBe('Name');
  });

  test('should delete user', async () => {
    await expect(userClient.deleteUser(1)).resolves.not.toThrow();
  });

  test('should handle bulk operations', async () => {
    const usersToCreate = [
      {
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
        password: 'password123'
      },
      {
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
        password: 'password123'
      }
    ];

    const createdUsers = await userClient.bulkCreateUsers(usersToCreate);

    expect(createdUsers).toHaveLength(2);
    expect(createdUsers[0].email).toBe('user1@example.com');
    expect(createdUsers[1].email).toBe('user2@example.com');
  });

  test('should search users with criteria', async () => {
    const users = await userClient.searchUsers({
      role: 'admin',
      isActive: true
    });

    expect(users).toBeInstanceOf(Array);
    users.forEach(user => {
      expect(user.role).toBe('admin');
      expect(user.isActive).toBe(true);
    });
  });
});
```

### **Success Criteria**
- ✅ Complete CRUD operations implemented
- ✅ All resilience patterns integrated
- ✅ Bulk operations work correctly
- ✅ Search functionality implemented
- ✅ All tests pass with proper error handling

---

## 🛠️ Exercise 5: Playwright Integration

### **Objective**
Create a custom Playwright fixture that provides configured API clients for tests.

### **Requirements**
1. Create custom fixture for API client
2. Integrate with Playwright's request context
3. Support multiple environments
4. Provide authentication setup

### **Implementation Task**

```typescript
// exercises/playwright-integration/apiClient.fixture.ts
import { test as base, APIRequestContext } from '@playwright/test';
import { UserApiClient } from '../user-api-client/UserApiClient';
import { AuthManager } from '../auth-strategies/AuthStrategy';

interface ApiFixtures {
  apiClient: {
    users: UserApiClient;
    auth: AuthManager;
  };
}

// TODO: Implement custom fixture
export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    // Your implementation here
  }
});

export { expect } from '@playwright/test';
```

### **Test Your Implementation**

```typescript
// exercises/playwright-integration/test-fixture.spec.ts
import { test, expect } from './apiClient.fixture';

test.describe('API Client Fixture', () => {
  test('should provide configured API client', async ({ apiClient }) => {
    expect(apiClient.users).toBeDefined();
    expect(apiClient.auth).toBeDefined();
  });

  test('should authenticate and make API calls', async ({ apiClient }) => {
    // Authenticate
    await apiClient.auth.authenticate({
      email: 'test@example.com',
      password: 'password123'
    });

    // Make authenticated API call
    const users = await apiClient.users.getUsers({ page: 1, limit: 5 });
    
    expect(users.items).toBeInstanceOf(Array);
    expect(users.items.length).toBeGreaterThan(0);
  });

  test('should handle authentication errors', async ({ apiClient }) => {
    await expect(
      apiClient.auth.authenticate({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      })
    ).rejects.toThrow();
  });
});
```

### **Success Criteria**
- ✅ Custom fixture properly configured
- ✅ API clients available in tests
- ✅ Authentication integration works
- ✅ Environment configuration supported

---

## 🎯 Challenge Exercise: E-commerce API Client

### **Objective**
Build a complete e-commerce API client system with multiple resource clients.

### **Requirements**
1. Create clients for: Users, Products, Orders, Payments
2. Implement cross-client operations (e.g., create order with products)
3. Add comprehensive error handling and logging
4. Implement caching for frequently accessed data
5. Create integration tests for complete workflows

### **Implementation Guidelines**

```typescript
// exercises/ecommerce-challenge/EcommerceApiClient.ts
export class EcommerceApiClient {
  public users: UserApiClient;
  public products: ProductApiClient;
  public orders: OrderApiClient;
  public payments: PaymentApiClient;

  constructor(request: APIRequestContext, config: ApiClientConfig) {
    // Initialize all clients with shared configuration
  }

  // Cross-client operations
  async createOrderWithProducts(
    userId: number,
    productIds: number[],
    paymentMethod: string
  ): Promise<Order> {
    // Implementation that uses multiple clients
  }
}
```

### **Success Criteria**
- ✅ Multiple resource clients implemented
- ✅ Cross-client operations work correctly
- ✅ Comprehensive error handling
- ✅ Caching mechanism implemented
- ✅ Integration tests cover complete workflows
- ✅ Performance optimizations applied

---

## 📊 Assessment Rubric

### **Beginner Level (60-70%)**
- Basic API client structure implemented
- Simple error handling present
- Basic authentication working
- Tests pass for simple scenarios

### **Intermediate Level (70-85%)**
- Advanced patterns implemented correctly
- Resilience patterns integrated
- Complex scenarios handled
- Good test coverage

### **Advanced Level (85-100%)**
- Professional-grade implementation
- All patterns integrated seamlessly
- Excellent error handling and logging
- Comprehensive test suite
- Performance optimizations
- Clean, maintainable code

## 🎓 Next Steps

After completing these exercises:

1. **Review** your implementations with the provided solutions
2. **Refactor** your code based on best practices learned
3. **Extend** your API clients with additional features
4. **Integrate** with your existing test frameworks
5. **Prepare** for Lesson 07: Design Patterns in Test Automation

---

**Congratulations!** You've built professional-grade API client architectures. These patterns will serve as the foundation for enterprise-level test automation frameworks.