# E2E Testing Best Practices and Patterns

Writing tests that work is one thing; writing tests that are reliable, maintainable, and easy to understand is another. This lesson summarizes key best practices and design patterns that will help you build a professional-grade E2E test suite.

## 1. The Test Pyramid

The Test Pyramid is a model for thinking about how to balance different types of tests.
-   **Unit Tests (Base):** The largest number of tests. They are fast, cheap, and test small, isolated pieces of code.
-   **Integration/Service Tests (Middle):** Fewer tests that verify interactions between different components or services (e.g., API tests).
-   **E2E Tests (Top):** The smallest number of tests. They are slow and expensive but provide the highest confidence by testing the full application stack from a user's perspective.

**Key Takeaway:** Don't try to cover everything with E2E tests. Use them to validate critical user workflows. Push as much logic testing as possible down the pyramid to faster, more stable tests.

## 2. The Arrange-Act-Assert (AAA) Pattern

Structure your tests in three distinct phases for maximum clarity.

-   **Arrange:** Set up the test's preconditions. This includes navigating to a page, creating data via API, mocking network requests, or setting `localStorage`.
-   **Act:** Perform the main action or user interaction that you are testing. This should ideally be a single, focused action.
-   **Assert:** Verify the outcome. Check that the application is in the expected state after the action.

### Example of AAA

```typescript
import { test, expect } from '@playwright/test';

test('should add an item to the to-do list', async ({ page }) => {
  // --- Arrange ---
  await page.goto('/todo-app');
  const todoInput = page.getByPlaceholder('New to-do');
  const addButton = page.getByRole('button', { name: 'Add' });
  const todoList = page.locator('.todo-list');

  // --- Act ---
  await todoInput.fill('Write better tests');
  await addButton.click();

  // --- Assert ---
  await expect(todoList).toContainText('Write better tests');
  await expect(todoInput).toBeEmpty();
});
```

## 3. Writing Independent and Isolated Tests

Tests should not depend on each other. The failure of one test should never cause another to fail.
-   **Avoid Chaining:** Don't make `test B` depend on the state created by `test A`.
-   **Use Hooks for Setup/Teardown:** Use `beforeEach` and `afterEach` to ensure each test starts from a clean, known state.
-   **Log In Once:** Use global setup (`auth.setup.ts`) to handle authentication once for the entire test run.

## 4. Descriptive Naming and Organization

A well-named test is self-documenting.
-   **Test Titles:** Use clear, descriptive titles. A good format is "should [do something] when [in some state]".
-   **`test.describe` Blocks:** Group related tests into `describe` blocks for organization and shared hooks.
-   **Annotations:** Use `test.skip()`, `test.fail()`, and tags (`@smoke`) to manage and categorize tests.

```typescript
test.describe('Product Page', () => {
  test('should display product details correctly', {
    tag: ['@smoke', '@product'],
  }, async ({ page }) => {
    // ...
  });
});
```

## 5. Prefer User-Facing Locators

Select elements the way a user would. This makes your tests more resilient to code refactoring.
-   **Best:** Use roles, text, and labels (`getByRole`, `getByText`, `getByLabel`).
-   **Good:** Use test IDs (`getByTestId`).
-   **Avoid:** Relying on brittle CSS selectors or complex XPath.

## 6. Refactoring for Maintainability

-   **Extract Helpers:** If you see repeated code, pull it out into a helper function.
-   **Use Page Object Models (POMs):** For large applications, consider using the Page Object Model pattern to encapsulate page-specific locators and interactions into classes.

## Summary

Building a high-quality E2E test suite is a software engineering discipline. By applying patterns like AAA, ensuring test isolation, using descriptive naming, and choosing robust locators, you create tests that are not just functional but also a long-term asset to your project.