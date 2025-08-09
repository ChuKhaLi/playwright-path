# Lesson 4: Fixture Management

## 1. What are Test Fixtures?

In testing, a fixture is something that you set up before a test runs and tear down after it completes. It's the "state" that your test needs to run. This could be:
- A logged-in user session.
- A specific set of data in a database.
- A pre-configured browser context.
- An instance of a page object.

Playwright has a powerful built-in fixture system that helps you manage this state in a clean and reusable way.

## 2. Built-in Playwright Fixtures

Playwright provides several built-in fixtures, including:
- **`page`:** The main fixture you've been using. It provides an isolated `Page` object for each test.
- **`context`:** Provides an isolated `BrowserContext` for each test.
- **`browser`:** Provides the `Browser` instance.
- **`request`:** Provides an `APIRequestContext` for making API calls.

## 3. Creating Custom Fixtures

The real power comes from creating your own custom fixtures. This allows you to encapsulate complex setup and teardown logic into reusable components.

**Creating a Simple Fixture:**
You create fixtures by extending the base `test` object.

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  myFixture: async ({}, use) => {
    // Set up the fixture.
    const myValue = 'Hello, from fixture!';

    // Use the fixture value in the test.
    await use(myValue);

    // Clean up the fixture.
  },
});
```

**Using the Custom Fixture:**
```typescript
// my-test.spec.ts
import { test } from './fixtures';

test('my test', async ({ myFixture }) => {
  console.log(myFixture); // "Hello, from fixture!"
});
```

## 4. A Practical Example: Authentication Fixture

A common use case for fixtures is to handle authentication. Instead of logging in at the start of every test, you can create a fixture that does it for you.

```typescript
// auth.fixture.ts
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  authenticatedPage: async ({ page, loginPage }, use) => {
    await page.goto('/login');
    await loginPage.login('testuser', 'password');
    await expect(page).toHaveURL('/dashboard');
    await use(page);
  },
});
```

Now your tests can use the `authenticatedPage` fixture to start in a logged-in state.

```typescript
// dashboard.spec.ts
import { test } from './auth.fixture';

test('User can view dashboard', async ({ authenticatedPage }) => {
  // No need to log in here!
  // ... test dashboard functionality ...
});
```

## 5. Fixture Overrides and Dependencies

- **Dependencies:** Fixtures can depend on other fixtures (like `authenticatedPage` depends on `page` and `loginPage`). Playwright resolves this dependency chain for you.
- **Worker Fixtures:** You can create fixtures that are set up once per worker process, which is useful for expensive setup operations.
- **Automatic Fixtures:** You can create fixtures that are automatically run for every test, without needing to be explicitly declared in the test function.

## 6. Conclusion

Playwright fixtures are a powerful tool for managing test state. By creating custom fixtures, you can make your tests cleaner, more readable, and more maintainable. They are a cornerstone of a well-designed, scalable test framework.