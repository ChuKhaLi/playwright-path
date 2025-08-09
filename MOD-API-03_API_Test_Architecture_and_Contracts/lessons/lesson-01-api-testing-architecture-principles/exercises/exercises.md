# Exercises: API Testing Architecture Principles

## Exercise 1: Identify Architectural Smells

**Objective:** Identify architectural problems in a poorly structured test suite.

**Instructions:**

Review the following two test files. Identify at least **three** architectural "smells" or violations of good design principles (like DRY). For each smell, explain why it's a problem and suggest a specific improvement.

**Test File 1: `tests/products.spec.ts`**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Product API', () => {
  const BASE_URL = 'https://api.ecommerce.com';

  test('should retrieve a specific product', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/v1/products/prod_123`, {
      headers: {
        'Authorization': 'Bearer hardcoded-token-xyz'
      }
    });
    expect(response.status()).toBe(200);
    const product = await response.json();
    expect(product.id).toBe('prod_123');
  });

  test('should return 404 for a non-existent product', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/v1/products/prod_999`, {
      headers: {
        'Authorization': 'Bearer hardcoded-token-xyz'
      }
    });
    expect(response.status()).toBe(404);
  });
});
```

**Test File 2: `tests/inventory.spec.ts`**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Inventory API', () => {
  test('should retrieve inventory for a specific product', async ({ request }) => {
    const response = await request.get(`https://api.ecommerce.com/v1/inventory/prod_123`, {
      headers: {
        'Authorization': 'Bearer hardcoded-token-xyz'
      }
    });
    expect(response.status()).toBe(200);
    const inventory = await response.json();
    expect(inventory.stock).toBeGreaterThan(0);
  });
});
```

---

## Exercise 2: Design a Layered Architecture

**Objective:** Propose a layered architecture for a given test automation scenario.

**Instructions:**

You are tasked with creating a test framework for a social media application. The application has the following APIs:
-   **Users API:** `POST /users`, `GET /users/{id}`
-   **Posts API:** `POST /users/{id}/posts`, `GET /posts/{postId}`
-   **Comments API:** `POST /posts/{postId}/comments`

A common test scenario is: "A user creates a post, and another user can comment on it."

1.  **Draw or describe a layered architecture** for this test framework. Identify at least three distinct layers.
2.  For each layer, describe its **primary responsibility**.
3.  Place each of the following components into the appropriate layer:
    -   The test script file (`social-flow.spec.ts`)
    -   A function `createPostAndComment(user1, user2, postContent, commentContent)`
    -   A class `PostsApiClient` with a method `createPost(userId, content)`
    -   The core Playwright `request` object
    -   A configuration file (`config.ts`)

---

## Exercise 3: Refactor to be Configuration-Driven

**Objective:** Refactor a test to remove hardcoded values and use a configuration-driven approach.

**Instructions:**

1.  Take the `products.spec.ts` file from Exercise 1.
2.  Assume you have a configuration system that exports a `config` object like this:
    ```typescript
    // src/config.ts
    export const config = {
      api: {
        baseUrl: 'https://api.ecommerce.com/v1',
        token: 'some-secret-token'
      }
    };
    ```
3.  Rewrite the `should retrieve a specific product` test to use the values from the `config` object instead of the hardcoded `BASE_URL` and `Authorization` token.
