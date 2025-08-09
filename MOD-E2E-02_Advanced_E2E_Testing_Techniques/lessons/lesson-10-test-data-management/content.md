# Advanced Data Handling and State Management

Reliable E2E tests depend on a predictable application state. Relying on existing, shared data can lead to flaky tests that fail for reasons unrelated to the code being tested. This lesson explores advanced strategies for programmatically controlling test data and application state.

## 1. The Importance of Test Data Isolation

Tests should be independent and runnable in any order. This is only possible if each test sets up its own data and cleans up after itself.

**Anti-Pattern:** A test that relies on "product-123" always existing in the database. If another test deletes or modifies that product, the test will fail.

**Best Practice:** A test that needs a product should create it, use it, and then delete it.

## 2. Programmatic Data Seeding via API

The most efficient way to manage test data is by using the application's API, bypassing the UI. This is much faster and more reliable than creating data through form submissions.

Playwright's `request` object is ideal for this.

### Example: Creating a User Before a Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Profile Management', () => {
  let userId: string;

  test.beforeEach(async ({ request }) => {
    // Create a new user before each test
    const response = await request.post('/api/users', {
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
      },
    });
    expect(response.ok()).toBeTruthy();
    const user = await response.json();
    userId = user.id;
  });

  test.afterEach(async ({ request }) => {
    // Clean up the user after each test
    await request.delete(`/api/users/${userId}`);
  });

  test('should allow editing the user profile', async ({ page }) => {
    await page.goto(`/users/${userId}/edit`);
    
    await page.getByLabel('Name').fill('Updated Test User');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.notification')).toHaveText('Profile saved successfully!');
  });
});
```
In this example, `beforeEach` and `afterEach` hooks ensure that every test runs with a fresh, isolated user account.

## 3. Manipulating Application State Directly

Sometimes, it's useful to manipulate the application's state directly in the browser, especially for SPAs that store state in `localStorage` or `sessionStorage`. This can be a shortcut to get the app into a specific state without complex UI interactions.

### Example: Setting a Feature Flag in `localStorage`

Imagine a feature is hidden behind a feature flag stored in `localStorage`.

```typescript
import { test, expect } from '@playwright/test';

test('should display the beta feature when the flag is set', async ({ page }) => {
  await page.goto('/dashboard');

  // Initially, the feature is not visible
  await expect(page.locator('#beta-feature')).not.toBeVisible();

  // Use page.evaluate to set the localStorage item
  await page.evaluate(() => {
    localStorage.setItem('featureFlags', JSON.stringify({ enableBetaFeature: true }));
  });

  // Reload the page to apply the new state
  await page.reload();

  // Now, the feature should be visible
  await expect(page.locator('#beta-feature')).toBeVisible();
});
```
**Warning:** This approach couples your test to the application's implementation details (`localStorage` key). Use it judiciously. It's often better to control features via backend configuration if possible.

## 4. Combining API Mocking and State Injection

For complex scenarios, you can combine the techniques. You might use API mocking to control data from the server and `localStorage` to control client-side state.

### Example: Testing a "Welcome Back" Banner

A banner should only appear if the user has visited before (tracked in `localStorage`) and has a certain status from the API.

```typescript
import { test, expect } from '@playwright/test';

test('should show welcome back banner for returning premium user', async ({ page }) => {
  // Mock the API to return a premium user
  await page.route('**/api/user/me', async route => {
    await route.fulfill({ json: { status: 'premium' } });
  });

  // Inject client-side state to indicate a returning user
  await page.evaluate(() => {
    localStorage.setItem('lastVisit', new Date().toISOString());
  });

  await page.goto('/home');

  // Assert the banner is shown
  await expect(page.locator('#welcome-back-banner')).toBeVisible();
});
```

## Summary

Advanced data and state management are about moving beyond the UI to prepare your application for testing. By using APIs to seed and clean data, and by directly manipulating browser storage when necessary, you can create tests that are faster, more reliable, and capable of covering a wider range of scenarios. This control is essential for building a mature and effective E2E test suite.