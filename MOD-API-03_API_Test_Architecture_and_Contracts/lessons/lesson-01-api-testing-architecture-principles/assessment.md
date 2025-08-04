# Lesson 1: Assessment

## Knowledge Check

1.  **Question:** What are the three main benefits of having a well-defined test architecture?
    -   a) Faster test execution, fewer bugs in the app, better-looking reports.
    -   b) Scalability, maintainability, and reliability.
    -   c) Lower cost, less code, and easier debugging.
    -   d) Tighter integration with the application code, ability to test private methods, and use of the latest programming language features.

2.  **Question:** The "S" in the SOLID principles stands for Single Responsibility Principle. How does this apply to API test automation?
    -   a) Every test file should only have a single test case.
    -   b) A class or module in the test framework should have only one primary reason to change.
    -   c) The entire test framework should be in a single file.
    -   d) Only one person should be responsible for maintaining the test framework.

3.  **Question:** What is the primary purpose of the API Client Layer in a layered test architecture?
    -   a) To write the test assertions.
    -   b) To manage test data.
    -   c) To model the API by handling request construction and response parsing.
    -   d) To configure the test runner and reporting.

4.  **Question:** Why is hardcoding configuration values like `baseUrl` a bad practice in a test framework?
    -   a) It makes the code harder to read.
    -   b) It makes the framework difficult to run against different environments (e.g., staging, production).
    -   c) It can cause security vulnerabilities.
    -   d) It slows down test execution.

## Practical Exercise

### Objective

Refactor a small set of "bad" API tests to apply the DRY principle and introduce a basic layered architecture.

### Provided Code

You are given two test files with duplicated code.

**`tests/products.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Product API', () => {
  const baseUrl = 'https://api.yourapp.com';
  const authToken = 'hardcoded-secret-token';

  test('should get a list of all products', async ({ request }) => {
    const response = await request.get(`${baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('should get a single product by ID', async ({ request }) => {
    const productId = 'prod_123';
    const response = await request.get(`${baseUrl}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(productId);
  });
});
```

**`tests/orders.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Order API', () => {
  const baseUrl = 'https://api.yourapp.com';
  const authToken = 'hardcoded-secret-token';

  test('should create a new order', async ({ request }) => {
    const newOrder = { productId: 'prod_123', quantity: 2 };
    const response = await request.post(`${baseUrl}/orders`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      data: newOrder
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.status).toBe('created');
  });
});
```

### Your Task

1.  **Create a new directory structure:**
    -   `src/`
        -   `clients/`
        -   `config/`
    -   `tests/` (keep the existing test files here for now)

2.  **Configuration Management:**
    -   Create a file `src/config/app.config.ts`.
    -   Move `baseUrl` and `authToken` into this configuration file. Export them so they can be imported elsewhere.

3.  **API Client Layer:**
    -   Create a file `src/clients/apiClient.ts`.
    -   Create a `ApiClient` class.
    -   The constructor should accept the Playwright `request` object.
    -   Import the configuration from `app.config.ts`.
    -   Create generic `get` and `post` methods that automatically include the `baseUrl` and `Authorization` header.

4.  **Refactor the Tests (Test Layer):**
    -   Update `products.spec.ts` and `orders.spec.ts`.
    -   In each test, create an instance of your new `ApiClient`.
    -   Use the `apiClient` to make the API calls instead of using `request` directly.
    -   Remove the hardcoded `baseUrl` and `authToken` from the test files.

### Expected Outcome

Your refactored test files should be much cleaner and should not contain any duplicated setup code for the API client. The configuration should be centralized. This exercise demonstrates the first steps toward building a layered and configuration-driven test architecture.