# Lesson 2: Your First Playwright Test

## Learning Objectives
After completing this lesson, you will be able to:
- Understand the structure of a Playwright test file.
- Write a basic test that navigates to a page and checks its title.
- Run tests from the command line.
- View and interpret the HTML test report.
- Understand the core concepts of `test`, `page`, and `expect`.

---

## 1. Anatomy of a Playwright Test File

Let's start by examining the `tests/example.spec.ts` file that Playwright created for us. This file demonstrates the basic structure of a test.

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

Let's break this down:

- **`import { test, expect } from '@playwright/test';`**: This line imports the necessary `test` function and `expect` assertion library from Playwright. Every test file will start with this.
- **`test('has title', async ({ page }) => { ... });`**: This is a test case.
    - The `test` function defines a new test.
    - The first argument, `'has title'`, is the name of the test. It should be descriptive.
    - The second argument is an anonymous `async` function that contains the test logic.
    - **`{ page }`**: The test function receives a `page` object as an argument. This is the most important object in Playwright; it represents a single tab in a browser and is your primary tool for interacting with the web page.
- **`async ({ page }) =>`**: Playwright's APIs are asynchronous, so tests are written using `async/await`. This is a concept you learned in MOD-02. It ensures that Playwright waits for each action to complete before moving to the next one.

## 2. Writing Your First Test

Let's create a new test file from scratch to solidify our understanding.

1.  **Create a New File:** In your `tests` directory, create a new file named `my-first-test.spec.ts`. The `.spec.ts` extension is a convention that Playwright uses to identify test files.

2.  **Write the Test Code:** Add the following code to your new file. We will test the official Playwright website.

    ```typescript
    // Import the necessary modules from Playwright
    import { test, expect } from '@playwright/test';

    // Define a test suite (optional, but good practice)
    test.describe('Playwright Website Navigation', () => {

      // Define a test case
      test('should navigate to the homepage and verify the title', async ({ page }) => {
        // 1. Navigate to the URL
        await page.goto('https://playwright.dev/');

        // 2. Create an expectation
        const pageTitle = await page.title();

        // 3. Assert that the title is correct
        expect(pageTitle).toBe('Fast and reliable end-to-end testing for modern web apps | Playwright');
      });

    });
    ```

### Code Breakdown:
- **`test.describe(...)`**: This function groups related tests together into a "test suite." It's useful for organization.
- **`await page.goto('https://playwright.dev/');`**: This is the first action in our test. The `goto` method navigates the `page` to the specified URL. `await` ensures we wait for the page to load.
- **`await page.title()`**: This method returns the title of the current page.
- **`expect(pageTitle).toBe(...)`**: This is an **assertion**. It checks if a condition is met. If the condition is false, the test will fail. Here, we are using the `toBe` matcher from `expect` to check if the `pageTitle` is exactly equal to the expected string.

## 3. Running Your Test

Now that you've written a test, let's run it.

### From the Command Line:
Open your terminal (PowerShell or Command Prompt) in the root of your project directory and run the following command:

```powershell
npx playwright test
```

This command will discover and run all the test files in your `tests` directory. By default, it runs the tests in **headless mode**, meaning you won't see the browser UI. It will also run the tests across all the projects defined in your `playwright.config.ts` (Chromium, Firefox, and WebKit).

### Running a Single Test File:
To run only your new test file, you can specify the path:

```powershell
npx playwright test tests/my-first-test.spec.ts
```

### Running in Headed Mode:
If you want to watch the test execute in a real browser, use the `--headed` flag:

```powershell
npx playwright test --headed
```

## 4. Viewing the HTML Report

After the test run is complete, Playwright generates an HTML report. This is one of its most powerful features. To view it, run:

```powershell
npx playwright show-report
```

This command will open a detailed, interactive report in your web browser. You can see:
- A summary of the test run (how many passed, failed, etc.).
- The results for each browser.
- A step-by-step log of the actions performed in each test.
- Screenshots, error messages, and traces for failed tests.

Spend some time exploring the report. It's an essential tool for debugging and understanding your test results.

---

## Summary

Congratulations! You have written and executed your first Playwright test. You learned the fundamental structure of a test file, how to run tests from the command line, and how to analyze the results using the HTML report. You are now equipped with the basic workflow for E2E testing in Playwright. In the next lesson, we will dive deeper into how to find and interact with elements on the page.