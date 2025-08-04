# Lesson 1: Advanced Request Configuration and Interceptors

## 1. Introduction

In `MOD-API-01`, we learned the fundamentals of API testing with Playwright's `request` fixture. Now, we'll dive deeper into more advanced configurations that provide granular control over API requests. We will also explore one of Playwright's most powerful features for both E2E and API testing: network request interception.

Mastering these techniques is essential for tackling real-world enterprise scenarios where you might need to:
- Inject dynamic authentication tokens into every request.
- Test how your application behaves with slow network conditions.
- Isolate your frontend tests by mocking backend API responses.
- Validate complex request payloads and headers.

## 2. Advanced Request Context Configuration

Playwright's `request` context can be configured with options that apply to all requests made within that context. This is incredibly useful for setting up base URLs, headers, or timeouts that are common across a suite of API tests.

### Common Configuration Options

- `baseURL`: Sets a base URL for all requests, so you can use relative paths in your tests.
- `extraHTTPHeaders`: Provides a dictionary of headers to be sent with every request. This is perfect for static API keys or `Content-Type` headers.
- `timeout`: Sets a specific timeout for API requests, overriding the global test timeout.
- `ignoreHTTPSErrors`: Useful for testing against development environments with self-signed SSL certificates.

### Example: Creating a Reusable API Context

Let's create a test setup that uses a configured `APIRequestContext`.

```typescript
// tests/api/api-helper.ts
import { test as base, expect, APIRequestContext } from '@playwright/test';

export const test = base.extend<{ api: APIRequestContext }>({
  api: async ({ playwright }, use) => {
    const requestContext = await playwright.request.newContext({
      baseURL: 'https://api.yourapp.com/v1',
      extraHTTPHeaders: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 seconds
    });
    await use(requestContext);
    await requestContext.dispose();
  },
});

export { expect };
```

Now, you can import this custom `test` object in your spec files, and the `api` fixture will be pre-configured.

```typescript
// tests/api/users.spec.ts
import { test, expect } from './api-helper';

test('should fetch user profile', async ({ api }) => {
  const response = await api.get('/users/123');
  expect(response.ok()).toBe(true);
  const user = await response.json();
  expect(user.id).toBe(123);
});
```

## 3. Intercepting Network Requests with `page.route()`

Request interception allows you to pause, modify, or even block network requests made by a page. This is done using the [`page.route(url, handler)`](https://playwright.dev/docs/api/class-page#page-route) method.

The `url` parameter can be a string, a glob pattern, or a regular expression to match the requests you want to intercept. The `handler` is a callback function that receives the `route` and `request` objects.

Inside the handler, you have several choices:
- `route.continue()`: Continues the request without modification.
- `route.continue(overrides)`: Continues the request with modified parameters (e.g., different headers, method, or postData).
- `route.fulfill(response)`: Fulfills the request with a mock response, preventing it from ever reaching the network.
- `route.abort()`: Aborts the request.

### Use Case 1: Modifying Request Headers on the Fly

Imagine you need to add a transaction-specific header to a request initiated by your web application's UI.

```typescript
// tests/e2e/transaction.spec.ts
import { test, expect } from '@playwright/test';

test('should add a custom header to a specific API call', async ({ page }) => {
  const transactionId = `txn-${Date.now()}`;

  // Intercept the specific API endpoint
  await page.route('**/api/transactions', async (route) => {
    const headers = {
      ...route.request().headers(),
      'X-Transaction-ID': transactionId,
    };
    await route.continue({ headers });
  });

  // Perform an action that triggers the API call
  await page.goto('/new-transaction');
  await page.getByRole('button', { name: 'Submit' }).click();

  // You can add an assertion here to verify the UI,
  // or check server logs to confirm the header was received.
});
```

### Use Case 2: Mocking API Responses for UI Testing

This is one of the most powerful uses of interception. You can test your frontend application's behavior in various states (e.g., success, error, empty data) without needing a live backend.

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('should display an error message when the user data API fails', async ({ page }) => {
  // Mock the API endpoint to return a 500 server error
  await page.route('**/api/users/me', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    });
  });

  await page.goto('/dashboard');

  // Assert that the UI correctly handles the error
  await expect(page.getByText('Failed to load user data. Please try again.')).toBeVisible();
});

test('should display user name when the API call is successful', async ({ page }) => {
  // Mock the API endpoint to return a successful response
  await page.route('**/api/users/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'user-1', name: 'John Doe' }),
    });
  });

  await page.goto('/dashboard');

  // Assert that the UI displays the user's name
  await expect(page.getByText('Welcome, John Doe')).toBeVisible();
});
```

## 4. Summary

In this lesson, we've elevated our API testing skills by learning how to:
- **Create configured API contexts:** This helps in writing cleaner and more maintainable API tests by setting up common properties like `baseURL` and `extraHTTPHeaders`.
- **Intercept network requests:** Using `page.route()`, we can gain full control over requests made by a page.
- **Modify requests:** We can dynamically change headers, method, or body of a request before it's sent.
- **Mock responses:** `route.fulfill()` is a game-changer for testing UI components in isolation, allowing us to simulate any API response scenario.

These advanced techniques are fundamental for building a robust and comprehensive testing strategy for modern web applications.