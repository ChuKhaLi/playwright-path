# Lesson 11: TypeScript with Playwright Integration

## Learning Objectives
After completing this lesson, you will be able to:
- Install Playwright into a TypeScript project.
- Understand the structure of a basic Playwright test file.
- Explain the roles of `test`, `page`, and `expect` from `@playwright/test`.
- Write a simple, type-safe end-to-end test using TypeScript and Playwright.
- Run a Playwright test from the command line.

## Introduction
This is the moment we've been building towards! We will now combine your TypeScript knowledge with the power of the Playwright test framework. You will see firsthand how the TypeScript features we've learned—type safety, async/await, classes, and modules—come together to create clean, robust, and maintainable automated tests.

## Step 1: Setting Up a Playwright Project
Playwright provides a simple command-line tool to initialize a new project with all the necessary configurations for TypeScript.

1.  Create a new folder for your project and navigate into it.
    ```bash
    mkdir my-first-playwright-test
    cd my-first-playwright-test
    ```
2.  Run the Playwright installation command. This will ask you a few questions.
    ```bash
    npm init playwright@latest
    ```
    -   **Use TypeScript or JavaScript?** Choose **TypeScript**.
    -   **Name of your Tests folder?** Press Enter to accept the default (`tests`).
    -   **Add a GitHub Actions workflow?** Choose **false** for now.
    -   **Install Playwright browsers?** Choose **true**.

This command does a lot for you:
-   Creates a `package.json`.
-   Installs `@playwright/test`.
-   Creates a `playwright.config.ts` file, which is the main configuration file for Playwright.
-   Creates a `tests` folder with an example test file.
-   Creates a `tests-examples` folder with more examples.

## Anatomy of a Playwright Test File
Let's open the main example file: `tests/example.spec.ts`. It will look something like this:

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

Let's break down the key components:

### `import { test, expect } from '@playwright/test';`
This line imports the two fundamental building blocks of any Playwright test.
-   `test`: A function used to declare a new test case.
-   `expect`: A function used for making assertions to verify that things are as they should be.

### `test('has title', ...)`
This is the test block.
-   The first argument (`'has title'`) is the **name of the test**. This name will appear in test reports.
-   The second argument is an **anonymous `async` function**. This is where your test logic goes.

### `async ({ page }) => { ... }`
This is the test function itself. Notice two crucial things:
1.  It's an `async` function, because as we learned, all Playwright actions are asynchronous.
2.  It receives an object as its argument, and we are "destructuring" the `page` object from it. The `page` object is your main interface to the browser page you are controlling. It's automatically created for you by the Playwright test runner for each test.

### `await page.goto(...)`
This is a Playwright command to navigate the browser to a specific URL. We **must** `await` it to ensure the code pauses until the page has loaded.

### `await expect(...).toHaveTitle(...)`
This is an **assertion**. This is the "check" part of a test.
-   `expect(page)`: We pass what we want to check to the `expect` function.
-   `.toHaveTitle(/Playwright/)`: This is the "matcher". We are asserting that the page's title contains the word "Playwright". The `await` is crucial here because Playwright's "auto-waiting" assertions will intelligently wait for the condition to be true before succeeding or timing out.

## Writing Our Own Simple Test
Let's delete the contents of `tests/example.spec.ts` and write our own simple test from scratch. We will test the login page of a demo site.

**File: `tests/example.spec.ts`**
```typescript
import { test, expect } from '@playwright/test';

// We can group related tests using test.describe()
test.describe('Sauce Demo Login Page', () => {

  // This is a "hook" that runs before each test in this describe block.
  test.beforeEach(async ({ page }) => {
    // Navigate to the page before each test.
    await page.goto('https://www.saucedemo.com/');
  });

  test('should have the correct title', async ({ page }) => {
    // Assert that the page title is what we expect.
    await expect(page).toHaveTitle('Swag Labs');
  });

  test('should allow a standard user to log in', async ({ page }) => {
    // Use locators to find elements and interact with them.
    // Playwright's type system knows that page.locator() returns a Locator object.
    const usernameInput = page.locator('[data-test="username"]');
    const passwordInput = page.locator('[data-test="password"]');
    const loginButton = page.locator('[data-test="login-button"]');

    // Fill the inputs and click the button.
    // Notice the 'await' on every action!
    await usernameInput.fill('standard_user');
    await passwordInput.fill('secret_sauce');
    await loginButton.click();

    // Assert that the login was successful by checking the URL.
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Assert that the shopping cart icon is visible.
    const shoppingCart = page.locator('.shopping_cart_link');
    await expect(shoppingCart).toBeVisible();
  });

  test('should show an error for a locked out user', async ({ page }) => {
    // Fill with credentials for a locked out user
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Assert that the error message is visible and has the correct text.
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Sorry, this user has been locked out.');
  });
});
```

## Running the Test
To run your tests, open the terminal at the root of your project and run:

```bash
npx playwright test
```
Playwright will automatically find all files ending in `.spec.ts` inside the `tests` folder, launch a browser, run your tests, and print the results to the console. After it's done, it will give you a command to view a detailed HTML report of the test run.

## Summary
-   Playwright is installed and initialized using `npm init playwright@latest`.
-   Tests are written in `.spec.ts` files inside the `tests` directory.
-   The `test` function defines a test case, and `expect` is used for assertions.
-   The `page` object is your gateway to interacting with the browser.
-   **Every interaction with the `page` object is asynchronous and must be awaited.**
-   Playwright's assertions are also async and should be awaited to leverage their auto-waiting capabilities.
-   You have now written your first fully functional, type-safe E2E test!