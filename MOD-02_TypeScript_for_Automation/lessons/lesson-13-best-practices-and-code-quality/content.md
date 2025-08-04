# Lesson 13: Best Practices and Code Quality

## Learning Objectives
After completing this lesson, you will be able to:
- Apply consistent naming conventions to variables, functions, classes, and files.
- Understand and apply the DRY (Don't Repeat Yourself) principle.
- Write meaningful comments and documentation for your test code.
- Recognize the importance of code formatting and linting for team collaboration.
- Appreciate that test code is "real code" and should be treated with the same quality standards.

## Introduction
Knowing the syntax of a language is one thing; writing high-quality, professional code is another. As a QA Automation Engineer, you are a software developer. Your test code is a real software product that needs to be readable, maintainable, and scalable.

Following a set of best practices ensures that the test framework you build is a valuable asset to your team, not a technical debt that becomes difficult to manage. This lesson covers some of the most important principles for writing clean TypeScript code.

## 1. Consistent Naming Conventions
A consistent naming style makes code predictable and easier to read. The TypeScript community generally follows these conventions:

-   **Variables and Functions:** Use `camelCase`.
    ```typescript
    const maxRetries = 3;
    function getUserData() { /* ... */ }
    ```

-   **Classes, Interfaces, Enums, and Type Aliases:** Use `PascalCase` (also known as `UpperCamelCase`).
    ```typescript
    class LoginPage { /* ... */ }
    interface UserProfile { /* ... */ }
    enum TestStatus { /* ... */ }
    type UserIdentifier = string | number;
    ```

-   **Constants:** For true, hardcoded constants that never change, use `UPPER_SNAKE_CASE`.
    ```typescript
    const DEFAULT_TIMEOUT = 30000; // 30 seconds
    const API_BASE_URL = "https://api.example.com";
    ```

-   **Files:** Use `kebab-case` for filenames. This is a common convention in web development projects.
    ```
    login-page.ts
    api-helpers.ts
    user-roles.enum.ts
    ```

## 2. The DRY Principle: Don't Repeat Yourself
The DRY principle is one of the most fundamental concepts in software development. **It means that every piece of knowledge or logic in your system should have a single, unambiguous representation.**

In test automation, this means avoiding copy-pasting code.

**WET Code (Write Everything Twice):**
```typescript
// Test 1
await page.locator('#username').fill('standard_user');
await page.locator('#password').fill('secret_sauce');
await page.locator('#login-button').click();
await expect(page).toHaveURL(/inventory.html/);

// Test 2
await page.locator('#username').fill('standard_user');
await page.locator('#password').fill('secret_sauce');
await page.locator('#login-button').click();
await expect(page).toHaveURL(/inventory.html/);
// ... then do something else
```
**Problem:** If the locator for the username input changes, you have to fix it in two places. Imagine if you had 50 tests!

**DRY Code (Applying the Principle):**
Create a reusable helper function.

**File: `src/actions/login-actions.ts`**
```typescript
import { Page } from '@playwright/test';

export async function loginAsStandardUser(page: Page): Promise<void> {
  await page.locator('#username').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory.html/);
}
```
Now your tests become much cleaner and easier to maintain.

**File: `src/tests/my-tests.spec.ts`**
```typescript
import { loginAsStandardUser } from '../actions/login-actions';

test('Test 1', async ({ page }) => {
  await loginAsStandardUser(page);
  // ... continue with test 1 logic
});

test('Test 2', async ({ page }) => {
  await loginAsStandardUser(page);
  // ... continue with test 2 logic
});
```
Now, if a locator changes, you only have to fix it in **one place**.

## 3. Comments and Documentation
Good code should be as self-documenting as possible, but comments are still essential for explaining the *why*, not the *what*.

**Bad Comment (Explains the obvious):**
```typescript
// This function adds two numbers
function add(a: number, b: number): number {
  return a + b;
}
```

**Good Comment (Explains the purpose or context):**
```typescript
/**
 * Navigates to a product's detail page.
 * @param productId - The unique ID of the product to navigate to.
 * @remarks This is necessary because product URLs are not static and must be constructed.
 */
async function navigateToProduct(productId: number): Promise<void> {
  // ...
}
```
The `/** ... */` syntax is for **JSDoc comments**. These are special comments that code editors like VS Code can understand. If you hover over a function with a JSDoc comment, the editor will show you your documentation as a helpful tooltip.

## 4. Code Formatting and Linting
**Code Formatting** deals with whitespace, indentation, and line breaks. Consistent formatting makes code easier to read for everyone on the team. Tools like **Prettier** can automatically format your code every time you save a file.

**Linting** is the process of running a tool (a "linter") that analyzes your code for potential errors, bugs, and stylistic issues. **ESLint** is the standard linter for the JavaScript/TypeScript ecosystem.

Playwright's setup command (`npm init playwright@latest`) often includes a basic setup for Prettier and/or ESLint. These tools are highly configurable and are essential for maintaining code quality in a team environment. They enforce the conventions we've discussed automatically.

## 5. Test Code is Real Code
This is the most important principle. Treat your test automation framework as a first-class software product.
-   It should be under version control (e.g., Git).
-   It should be reviewed by peers (code reviews).
-   It should be structured, maintainable, and reliable.
-   It should be documented.

A high-quality test framework inspires confidence in the test results and, by extension, in the quality of the application under test.

## Summary
-   **Naming Conventions:** Use `camelCase` for variables/functions, `PascalCase` for types/classes, `kebab-case` for files, and `UPPER_SNAKE_CASE` for constants.
-   **DRY Principle:** Don't repeat yourself. Encapsulate repeated logic into reusable functions or classes.
-   **Comments:** Explain the "why," not the "what." Use JSDoc for better documentation.
-   **Formatting/Linting:** Use tools like Prettier and ESLint to enforce consistency and catch issues early.
-   **Professionalism:** Treat your test code with the same care and quality standards as application code.