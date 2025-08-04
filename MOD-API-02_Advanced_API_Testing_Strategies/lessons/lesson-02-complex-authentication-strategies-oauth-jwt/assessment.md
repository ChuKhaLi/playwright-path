# Lesson 2: Assessment

## Knowledge Check

1.  **Question:** In a typical JWT authentication flow, what is the first step your test automation should perform?
    *   a) Send a request to a protected endpoint to see if it fails.
    *   b) Send credentials to a login endpoint to receive a token.
    *   c) Decode a sample JWT to find the expiration date.
    *   d) Add a `Authorization: Bearer` header to the request.

2.  **Question:** What is the recommended approach in Playwright for handling JWT authentication across multiple test files?
    *   a) Log in at the beginning of every single test.
    *   b) Use a `global.setup.ts` file to authenticate once and save the `storageState`.
    *   c) Store the JWT in a global variable.
    *   d) Manually paste the token into each test file.

3.  **Question:** For automated testing, which OAuth 2.0 grant type is generally preferred due to its non-interactive nature?
    *   a) Authorization Code Grant
    *   b) Implicit Grant
    *   c) Client Credentials Grant
    *   d) Refresh Token Grant

## Practical Exercise

### Objective

Create a set of tests for a JWT-protected API endpoint. This will involve creating a helper to log in and then using the obtained token to access a protected resource.

### Scenario

You have an API with two endpoints:
1.  `POST /api/auth/login`: Accepts a username and password, and returns a JWT.
2.  `GET /api/user/orders`: A protected endpoint that returns a list of orders for the authenticated user.

### Requirements

1.  Create a new test file `orders.spec.ts`.
2.  Create a helper function or use a `beforeAll` hook to send a `POST` request to `/api/auth/login` with dummy credentials (e.g., `user: "testuser"`, `pass: "password123"`).
3.  Assume the login endpoint returns a JSON body like: `{ "token": "your.jwt.token" }`.
4.  Extract the `token` from the login response.
5.  Write a test that sends a `GET` request to `/api/user/orders`.
6.  In this request, you must include the `Authorization` header with the value `Bearer <your.jwt.token>`.
7.  Assert that the response status is `200 OK`.
8.  Assert that the response body is an array.

### Solution

```typescript
// tests/api/orders.spec.ts
import { test, expect, APIRequestContext } from '@playwright/test';

// We will store the token in a variable accessible to all tests in this file.
let authToken: string;
let api: APIRequestContext;

// Use beforeAll to authenticate once for all tests in this file.
test.beforeAll(async ({ playwright }) => {
  api = await playwright.request.newContext();
  
  const response = await api.post('/api/auth/login', {
    data: {
      username: 'testuser',
      password: 'password123',
    },
  });

  // Ensure the login was successful
  expect(response.ok()).toBe(true);

  const responseBody = await response.json();
  authToken = responseBody.token;
  expect(authToken).toBeDefined();
});

test.afterAll(async () => {
  // Dispose the context once all tests are done.
  await api.dispose();
});

test.describe('Protected User Endpoints', () => {
  test('should fetch user orders with a valid JWT', async () => {
    const response = await api.get('/api/user/orders', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    // Assert the request was successful
    expect(response.ok()).toBe(true);

    // Assert the response body is an array
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
  });

  test('should fail to fetch orders without a token', async () => {
    const response = await api.get('/api/user/orders');

    // Assert the request was unauthorized
    expect(response.status()).toBe(401);
  });
});