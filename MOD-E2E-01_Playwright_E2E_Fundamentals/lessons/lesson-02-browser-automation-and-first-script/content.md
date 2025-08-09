# Lesson 2: Browser Automation & Your First Script

## 1. Understanding Browser Automation

At its core, Playwright is a tool for browser automation. This means we can write scripts to control a web browser, just like a real person would. Our script can:

-   Open a new browser window.
-   Navigate to a specific URL.
-   Click on buttons and links.
-   Type text into input fields.
-   Read content from the page.

This is the foundation of E2E testing. By automating these actions, we can create repeatable tests that verify our application's functionality.

## 2. Anatomy of a Playwright Test

Let's break down the structure of a basic Playwright test. Open the `tests/example.spec.ts` file that was generated during installation.

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
```

-   **`import { test, expect } from '@playwright/test';`**: This line imports the necessary `test` and `expect` functions from the Playwright test library.
-   **`test('has title', ...)`**: This defines a new test case. The first argument is the name of the test, which should be descriptive.
-   **`async ({ page }) => { ... }`**: This is an asynchronous function that contains the test logic. Playwright provides the `page` object, which is our primary tool for interacting with the web page.
-   **`await page.goto('https://playwright.dev/');`**: This navigates the browser to the specified URL. The `await` keyword is crucial because most Playwright commands are asynchronous.
-   **`await expect(page).toHaveTitle(/Playwright/);`**: This is an assertion. We're using the `expect` function to check if the page's title contains the word "Playwright". If it doesn't, the test will fail.

## 3. Writing Your First Script

Let's create a new test file called `tests/todo.spec.ts` and write a script to interact with a simple to-do list application.

```typescript
import { test, expect } from '@playwright/test';

test.describe('TodoMVC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  test('should allow me to add todo items', async ({ page }) => {
    // Add a new todo item
    await page.locator('.new-todo').fill('Buy milk');
    await page.locator('.new-todo').press('Enter');

    // Expect the new item to be in the list
    await expect(page.locator('.todo-list li')).toHaveText([
      'Buy milk'
    ]);
  });
});
```

In this example, we're:
1.  Navigating to the TodoMVC demo page.
2.  Finding the input field with the class `.new-todo`.
3.  Typing "Buy milk" into it.
4.  Pressing the "Enter" key.
5.  Asserting that the new to-do item appears in the list.

## 4. Running Your Tests

To run your tests, open your terminal and run the following command:

```bash
npx playwright test
```

Playwright will run all the tests in your `tests` directory and show you the results. You'll also find a detailed HTML report in the `playwright-report` directory.