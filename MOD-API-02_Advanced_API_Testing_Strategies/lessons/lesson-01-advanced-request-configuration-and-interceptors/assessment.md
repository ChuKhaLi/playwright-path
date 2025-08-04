# Lesson 1: Assessment

## Knowledge Check

1.  **Question:** What is the primary benefit of using `playwright.request.newContext()` with a `baseURL`?
    *   a) To make all requests faster.
    *   b) To allow the use of relative paths for endpoints in API tests.
    *   c) To automatically add authentication headers.
    *   d) To bypass network firewalls.

2.  **Question:** Which `page.route()` handler method is used to stop a network request and provide a custom, client-side response without hitting the server?
    *   a) `route.continue()`
    *   b) `route.abort()`
    *   c) `route.fulfill()`
    *   d) `route.modify()`

3.  **Question:** How can you modify the headers of an outgoing request using `page.route()`?
    *   a) It's not possible to modify headers, only to view them.
    *   b) `route.continue({ headers: newHeaders })`
    *   c) `route.fulfill({ headers: newHeaders })`
    *   d) `route.setHeaders(newHeaders)`

## Practical Exercise

### Objective

Create a test that mocks an API response to verify that the application's UI correctly displays user data fetched from an API.

### Scenario

You are testing a user profile page located at `/profile`. This page makes a `GET` request to `/api/user/profile` to fetch user information. Your task is to write a Playwright test that intercepts this API call and provides a mock response.

### Requirements

1.  Create a new test file `profile.spec.ts`.
2.  Navigate to the `/profile` page (you can assume this page exists).
3.  Use `page.route()` to intercept `GET` requests to `/api/user/profile`.
4.  Use `route.fulfill()` to return a mock JSON response with the following structure:
    ```json
    {
      "id": "mock-user-123",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "isAdmin": true
    }
    ```
5.  After the page loads, assert that the following information is visible on the page:
    *   The name "Jane Doe".
    *   The email "jane.doe@example.com".
    *   A "Admin User" badge or text, which is only displayed if `isAdmin` is `true`.

### Solution

```typescript
// tests/e2e/profile.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Profile Page', () => {
  test('should display user data from a mocked API response', async ({ page }) => {
    // 1. Intercept the API call and provide a mock response
    await page.route('**/api/user/profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-user-123',
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          isAdmin: true,
        }),
      });
    });

    // 2. Navigate to the profile page
    await page.goto('/profile');

    // 3. Assert that the UI displays the mocked data
    await expect(page.getByText('Jane Doe')).toBeVisible();
    await expect(page.getByText('jane.doe@example.com')).toBeVisible();
    await expect(page.getByText('Admin User')).toBeVisible();
  });
});