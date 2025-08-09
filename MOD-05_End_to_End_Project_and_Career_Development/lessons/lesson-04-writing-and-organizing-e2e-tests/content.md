# Lesson 4: Writing and Organizing E2E Tests

## 1. Introduction

Now that we have a solid framework foundation with our first page objects, it's time to write the actual tests. This lesson will cover how to write clean, readable, and maintainable E2E tests using Playwright and the Page Object Model we've just created.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

-   **Write a Playwright Test:** Understand the structure of a Playwright test file, including `test` and `expect`.
-   **Integrate Page Objects:** Use your page objects within your tests to interact with the application.
-   **Use Web-First Assertions:** Write powerful and reliable assertions using Playwright's `expect`.
-   **Organize Tests:** Structure your tests logically using `describe` blocks and meaningful test names.
-   **Career Context:** Appreciate how well-written tests contribute to the overall quality and reliability of the software development process.

## 3. The Structure of a Playwright Test

Let's look at the basic anatomy of a Playwright test file, which we'll place in our `tests/` directory.

```typescript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  // Go to a page
  await page.goto('https://playwright.dev/');

  // Assert that the title is correct
  await expect(page).toHaveTitle(/Playwright/);
});
```

-   **`import { test, expect } from '@playwright/test';`**: Imports the necessary functions from the Playwright test runner.
-   **`test(...)`**: Defines a new test case. The first argument is the test name, and the second is an async function that contains the test logic.
-   **`{ page }`**: Playwright provides "fixtures" like `page` as arguments to your test function. The `page` fixture is your main tool for interacting with the browser.
-   **`expect(...)`**: The assertion library. This is how you check if the application behaves as expected.

## 4. Integrating Our Page Objects

Here's where the power of POM comes in. Let's write a test for a successful login using the `LoginPage` we created in the last lesson.

Create a new file `tests/login.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { AccountPage } from '../src/pages/account.page';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let accountPage: AccountPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects before each test
    loginPage = new LoginPage(page);
    accountPage = new AccountPage(page);
    await loginPage.navigateTo('https://example.com/login');
  });

  test('should allow a user to log in with valid credentials', async () => {
    // Act
    await loginPage.login('testuser', 'password123');

    // Assert
    await expect(accountPage.getPageTitle()).resolves.toBe('My Account');
  });

  test('should show an error message with invalid credentials', async () => {
    // Act
    await loginPage.login('invaliduser', 'wrongpassword');

    // Assert
    // (Assuming there's an error message locator on the LoginPage)
    // await expect(loginPage.getErrorMessage()).toBeVisible();
  });
});
```

-   **`test.describe(...)`**: Groups related tests together. This is great for organization.
-   **`test.beforeEach(...)`**: A hook that runs before each test in the `describe` block. We use it here to initialize our page objects and navigate to the login page, reducing code duplication.
-   **Readability:** Look at the test body. It reads like a set of user actions, not a series of complex UI interactions. `loginPage.login(...)` is much clearer than a list of `fill` and `click` commands.

## 5. Web-First Assertions

Playwright's `expect` is "web-first," meaning it will automatically wait for conditions to be met before failing. This makes your tests much more stable.

-   **`expect(locator).toBeVisible()`**: Waits for the element to be visible.
-   **`expect(page).toHaveURL(...)`**: Waits for the page URL to match.
-   **`expect(locator).toContainText(...)`**: Waits for the element to contain the specified text.

This automatic waiting eliminates the need for manual waits (`setTimeout`), which are a common source of flaky tests.

## 6. Organizing Your Tests

-   **One File Per Feature:** A good practice is to have one `.spec.ts` file for each major feature of your application (e.g., `login.spec.ts`, `search.spec.ts`).
-   **Use `describe` Blocks:** Group tests for a specific component or workflow within a `describe` block.
-   **Descriptive Test Names:** Your test names should clearly state what they are testing. A good format is "should [do something] when [in some state]".

## 7. Career Development: Writing Tests for Humans

Remember, you're not just writing tests for the computer to execute; you're writing them for other developers (and your future self) to read.

-   **Clarity is King:** A test that is easy to understand is also easier to debug and maintain.
-   **Tests as Documentation:** Well-written tests can serve as living documentation for how the application is supposed to work.
-   **Collaboration:** Clean tests make it easier for new team members to get up to speed and contribute.

## 8. Next Steps

We've now written our first E2E tests using our framework. In the next lesson, we'll explore how to handle more advanced and complex test scenarios.