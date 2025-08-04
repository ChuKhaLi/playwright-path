# Lesson 6: Playwright Test Fixtures and Hooks

## 1. Understanding Test Hooks

Test hooks are functions that run before or after tests, allowing you to set up preconditions and clean up afterwards. `@playwright/test` provides four main hooks:

- `beforeEach`: Runs before each test in a file.
- `afterEach`: Runs after each test in a file.
- `beforeAll`: Runs once before all tests in a file.
- `afterAll`: Runs once after all tests in a file.

### Example Usage

```typescript
import { test, expect } from '@playwright/test';

// Runs once before all tests
beforeAll(async () => {
  console.log('Starting tests for this file...');
  // e.g., connect to a database
});

// Runs once after all tests
afterAll(async () => {
  console.log('Finished all tests in this file.');
  // e.g., close database connection
});

// Runs before each test
beforeEach(async ({ page }) => {
  console.log(`Starting test: ${test.info().title}`);
  await page.goto('/products');
});

// Runs after each test
afterEach(async ({ page }, testInfo) => {
  console.log(`Finished test: ${testInfo.title} with status: ${testInfo.status}`);
  if (testInfo.status === 'failed') {
    await page.screenshot({ path: `test-results/failure-${testInfo.title}.png` });
  }
});

test('should display products', async ({ page }) => {
  await expect(page.locator('.product-item')).toHaveCount(10);
});

test('can search for a product', async ({ page }) => {
  await page.getByLabel('Search').fill('My Product');
  await expect(page.locator('.product-item').first()).toContainText('My Product');
});
```

## 2. Introduction to Fixtures

While hooks are useful, Playwright's primary mechanism for setup and teardown is **fixtures**. A fixture is a piece of the test environment that is set up before a test runs and torn down afterwards.

You've already been using them! `page`, `context`, and `browser` are all built-in fixtures.

```typescript
// The `page` object is a fixture provided by Playwright.
// Playwright handles creating and cleaning it up for you.
test('my test', async ({ page }) => {
  // ...
});
```

The power of fixtures comes from the ability to create your own.

## 3. Creating Custom Fixtures with `test.extend()`

Custom fixtures allow you to encapsulate setup logic, making your tests cleaner and more declarative. Let's refactor our POM example to use a fixture.

### Before (Manual POM Instantiation)
```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page); // Manual instantiation
  await loginPage.goto();
  await loginPage.login('user', 'pass');
  // ...
});
```

### After (Using a Custom Fixture)

**Step 1: Define the custom fixture**

It's good practice to define your custom fixtures in a central file.

```typescript
// tests/my-fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';

// Define the types for our new fixtures
type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

// Extend the base test to include our custom fixtures
export const test = base.extend<MyFixtures>({
  // Define the 'loginPage' fixture
  loginPage: async ({ page }, use) => {
    // Set up the fixture
    const loginPage = new LoginPage(page);
    
    // Use the fixture value in the test
    await use(loginPage);
    
    // Teardown logic can go here, after `use()`
  },

  // Define the 'dashboardPage' fixture
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
```

**Step 2: Use the custom fixture in a test**

Now, import `test` from your custom fixtures file instead of `@playwright/test`.

```typescript
// tests/login.spec.ts
import { test, expect } from './my-fixtures'; // Import from our new file

test('should login successfully', async ({ loginPage, page }) => {
  // The `loginPage` fixture is automatically provided!
  await loginPage.goto();
  await loginPage.login('user', 'pass');
  
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('another test', async ({ loginPage, dashboardPage }) => {
  // You can use multiple fixtures
  await loginPage.goto();
  const dbPage = await loginPage.loginSuccessfully('user', 'pass');
  // or just use the dashboardPage fixture directly
  await expect(dashboardPage.welcomeMessage).toBeVisible();
});
```

## 4. Fixture Scopes: Test vs. Worker

Fixtures can have different scopes, which determine how often they are set up and torn down.

- **Test Scope (default):** The fixture is created for each test. This is the default and what we've used so far. `page` is a test-scoped fixture.
- **Worker Scope:** The fixture is created once per worker process. All tests running in that worker will share the same instance of the fixture. `browser` is a worker-scoped fixture.

You can define the scope when creating a fixture. This is useful for expensive resources.

```typescript
// tests/my-fixtures.ts
export const test = base.extend<MyFixtures>({
  myExpensiveResource: [async ({}, use) => {
    // This setup runs only once per worker
    const resource = await setupExpensiveResource();
    await use(resource);
    // This teardown runs when the worker is done
    await resource.cleanup();
  }, { scope: 'worker' }], // Set the scope here
});
```

## 5. Hooks vs. Fixtures: When to Use Which?

- **Use Hooks (`beforeEach`, etc.) for:**
  - Simple, self-contained logic that needs to run for every test in a file (e.g., logging, navigating to a common starting page).
  - Logic that doesn't need to be shared across multiple test files.

- **Use Fixtures for:**
  - Encapsulating setup and teardown for a specific piece of the environment (e.g., a Page Object, a database connection, a logged-in user state).
  - Creating reusable setup logic that can be shared across your entire test suite.
  - When you want your test to declaratively "ask" for what it needs.

**General Rule:** Prefer fixtures over hooks for managing test dependencies and environment setup. They lead to more modular, readable, and maintainable tests.

## 6. Summary

Fixtures are a powerful and elegant feature of the Playwright test runner. They allow you to abstract away setup and teardown logic, making your tests cleaner and more focused on the actual test steps. By creating custom fixtures for your Page Objects and other helper classes, you can build a highly organized and scalable test framework.