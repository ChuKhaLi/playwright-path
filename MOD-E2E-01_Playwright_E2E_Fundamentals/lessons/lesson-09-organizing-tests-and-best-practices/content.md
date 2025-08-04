# Lesson 9: Organizing Tests and Best Practices

## Learning Objectives
After completing this lesson, you will be able to:
- Group related tests using `test.describe()`.
- Use hooks (`beforeEach`, `afterEach`, `beforeAll`, `afterAll`) for setup and teardown.
- Understand how to structure test files and directories for a growing project.
- Apply best practices for writing clear, concise, and independent tests.
- Use test annotations like `.skip` and `.only` to control test execution.

---

## 1. Grouping Tests with `test.describe()`

As you've seen in previous lessons, `test.describe()` is used to create a suite of related tests. This is the primary way to organize tests within a single file.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to log in', () => {
    // ... test logic
  });

  test('should show an error for a locked out user', () => {
    // ... test logic
  });

  test('should allow a user to log out', () => {
    // ... test logic
  });
});

test.describe('Shopping Cart', () => {
  test('should allow adding an item to the cart', () => {
    // ... test logic
  });
});
```
Grouping tests this way makes your files more readable and allows you to apply hooks to a specific group of tests.

## 2. Using Hooks for Setup and Teardown

Often, multiple tests need to perform the same setup (like logging in) or teardown (like logging out or cleaning up created data). Repeating this code in every test is inefficient. Hooks allow you to run code before or after tests.

- **`beforeEach`**: Runs before **each** test in a `describe` block. Perfect for tasks that need to be done for every single test, like navigating to a page or logging in.
- **`afterEach`**: Runs after **each** test. Useful for cleanup, like logging out.
- **`beforeAll`**: Runs **once** before all tests in a `describe` block have started. Use this for expensive, one-time setup, like seeding a database.
- **`afterAll`**: Runs **once** after all tests in the block have finished. Use for global cleanup.

**Example using `beforeEach`:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Inventory Page Functionality', () => {
  // This hook runs before each of the tests below
  test.beforeEach(async ({ page }) => {
    // Log in the user
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    // Ensure we are on the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('should be able to add an item to the cart', async ({ page }) => {
    // No need to log in here, beforeEach did it!
    await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('should be able to sort items by price', async ({ page }) => {
    // No need to log in here either
    await page.locator('.product_sort_container').selectOption('lohi');
    // ... assertions to check the sort order
  });
});
```
By moving the login logic to `beforeEach`, we've made our tests cleaner and removed code duplication.

## 3. Structuring Your Project

For a small project, having all your tests in the `tests/` directory is fine. As your project grows, you should organize your test files into subdirectories that mirror your application's structure.

**Example Project Structure:**
```
tests/
├── auth/
│   ├── login.spec.ts
│   └── registration.spec.ts
├── checkout/
│   ├── guest-checkout.spec.ts
│   └── registered-user-checkout.spec.ts
├── products/
│   ├── product-details.spec.ts
│   └── product-search.spec.ts
└── e2e/
    └── full-purchase-flow.spec.ts
```
This structure makes it easy to find tests related to a specific feature and to run all tests for a feature at once (e.g., `npx playwright test tests/auth/`).

## 4. Best Practices for Writing Tests

- **Tests should be independent.** Each test should be able to run on its own without depending on the state left by a previous test. `beforeEach` helps enforce this.
- **Write descriptive names.** Test names should clearly state what they are testing. `test('should display an error on invalid login')` is much better than `test('login test 2')`.
- **One assertion per test (is a guideline, not a rule).** A test should ideally verify one specific piece of behavior. However, it's pragmatic to have a few related assertions in one test if they are all part of the same logical check.
- **Don't use `page.waitForTimeout()`**. This is a "sleep" command and a major source of flaky and slow tests. Rely on Playwright's auto-waiting locators and assertions instead.

## 5. Controlling Test Execution

Playwright provides annotations to control which tests are run, which is very useful during development and debugging.

- **`test.only()`**: If you mark a test or a `describe` block with `.only()`, Playwright will **only** run that specific test or suite. This is great for focusing on a single test you are writing or fixing.

  ```typescript
  // Only this test will run
  test.only('should be the only test that runs', async ({ page }) => {
    // ...
  });
  ```

- **`test.skip()`**: This will skip a test. You can provide a reason. The test will be marked as "skipped" in the report. This is useful for temporarily disabling a test that is failing due to a known bug in the application that you don't want to fix right now.

  ```typescript
  // This test will be skipped
  test.skip(true, 'Skipping because the feature is currently disabled.');
  test('a test that needs a feature', async ({ page }) => {
    // ...
  });
  ```

**Important:** Remember to remove `.only()` before committing your code, otherwise, you will prevent the full test suite from running in your CI/CD pipeline.

---

## Summary

In this lesson, you learned essential techniques for organizing your test suite and writing high-quality, maintainable tests. You can now group tests, use hooks for efficient setup and teardown, structure your project for scalability, and apply best practices for test independence and clarity. These organizational skills are just as important as the technical ability to write tests.