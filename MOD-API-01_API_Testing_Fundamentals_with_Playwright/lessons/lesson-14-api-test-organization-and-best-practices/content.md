# Lesson 14: API Test Organization and Best Practices

## From Tests to a Test Suite

As you write more tests, your project will grow from a few files into a full **test suite**. Without a good organizational strategy, this suite can quickly become messy, hard to navigate, and difficult to maintain. This lesson covers the best practices that will help you build a professional, scalable API test suite.

## 1. Folder and File Structure

A logical folder structure is the foundation of a clean project. The most common and effective strategy is to **organize your test files by API resource**.

**A Good Structure:**
```
tests/
└── api/
    ├── resources/
    │   ├── users.spec.ts
    │   ├── products.spec.ts
    │   └── orders.spec.ts
    ├── utils/
    │   ├── api-helpers.ts
    │   └── test-data-generators.ts
    └── E2E/
        └── ...
```
-   `tests/api/resources/`: Each file in here contains all the tests for a specific resource (e.g., `users.spec.ts` contains all tests for the `/users` endpoints).
-   `tests/api/utils/`: This directory holds reusable helper functions that can be shared across multiple test files.

## 2. Grouping Tests with `test.describe()`

Within a single test file, you should group related tests using `test.describe()`. This makes your files easier to read and also makes your test reports much clearer. You can even nest `describe` blocks.

```typescript
// tests/api/resources/users.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  test.describe('GET /api/users', () => {
    test('should return a list of users', () => { /* ... */ });
    test('should handle pagination correctly', () => { /* ... */ });
  });

  test.describe('POST /api/users', () => {
    test('should create a new user with valid data', () => { /* ... */ });
    test('should return an error for missing data', () => { /* ... */ });
  });

  test.describe('GET /api/users/{id}', () => {
    test('should return a single user', () => { /* ... */ });
    test('should return 404 for a non-existent user', () => { /* ... */ });
  });
});
```
This structure mirrors the API's own structure, making it incredibly intuitive to find the test you're looking for.

## 3. Creating Reusable Helper Functions

As you write more tests, you'll notice you're repeating the same lines of code. For example, logging in to get a token. You should extract this repeated logic into **helper functions**.

**Before (Repetitive):**
```typescript
test('test one', async ({ request }) => {
  const loginResponse = await request.post('/api/login', { data: { ... } });
  const token = (await loginResponse.json()).token;
  // ... use token
});

test('test two', async ({ request }) => {
  const loginResponse = await request.post('/api/login', { data: { ... } });
  const token = (await loginResponse.json()).token;
  // ... use token
});
```

**After (Clean and Reusable):**
```typescript
// tests/api/utils/api-helpers.ts
import { APIRequestContext } from '@playwright/test';

export async function getAuthToken(request: APIRequestContext): Promise<string> {
  const loginResponse = await request.post('/api/login', {
    data: {
      email: process.env.API_USER_EMAIL,
      password: process.env.API_USER_PASSWORD,
    },
  });
  const body = await loginResponse.json();
  return body.token;
}

// tests/api/resources/some-test.spec.ts
import { getAuthToken } from '../utils/api-helpers';

test('test one', async ({ request }) => {
  const token = await getAuthToken(request);
  // ... use token
});
```

## 4. The API Client Pattern

You can take helper functions a step further by creating an "API Client". This is a class or object that encapsulates all the logic for interacting with a specific resource. It hides the implementation details (like the exact URL or headers) from your tests.

**Example API Client:**
```typescript
// tests/api/utils/userApiClient.ts
import { APIRequestContext } from '@playwright/test';

export class UserApiClient {
  constructor(private request: APIRequestContext) {}

  async getUsers() {
    return this.request.get('/api/users');
  }

  async getUserById(id: number) {
    return this.request.get(`/api/users/${id}`);
  }

  async createUser(userData: object) {
    return this.request.post('/api/users', { data: userData });
  }
}

// tests/api/resources/users.spec.ts
import { UserApiClient } from '../utils/userApiClient';

test('should create and then get a user', async ({ request }) => {
  const client = new UserApiClient(request);

  const createResponse = await client.createUser({ name: 'test', job: 'dev' });
  expect(createResponse.status()).toBe(201);
  const createdUser = await createResponse.json();

  const getResponse = await client.getUserById(createdUser.id);
  expect(getResponse.status()).toBe(200);
});
```
**Benefits of this pattern:**
-   **Readability**: The test reads like a series of actions, not a series of HTTP requests.
-   **Maintainability**: If an endpoint URL changes (e.g., from `/api/users` to `/api/v2/users`), you only have to update it in one place: the API client.

## 5. Naming Conventions

-   **Test Files**: Name them after the resource they test (e.g., `users.spec.ts`).
-   **`describe` Blocks**: Describe the endpoint or feature being tested (e.g., `POST /api/users`).
-   **`test` Blocks**: Use "should" to describe the expected behavior (e.g., `test('should return a 400 error if email is missing')`).

A good test name clearly states **what** is being tested and **what** the expected outcome is.

## Summary

-   **Structure your project** by organizing test files by API resource.
-   **Group related tests** within files using `test.describe()`.
-   **Keep your code DRY** by extracting repeated logic into reusable helper functions.
-   **Consider using the API Client pattern** to make your tests cleaner and more maintainable.
-   **Use clear and consistent naming conventions** to make your test suite easy to understand.

These practices will transform your collection of tests into a professional, scalable, and maintainable automation suite.

## Next Steps

You've learned how to write and organize a full suite of API tests. In the final lesson, we'll bring everything together and discuss how API tests can be integrated with E2E tests.
-   **Lesson 15**: Module Recap and Integration Testing