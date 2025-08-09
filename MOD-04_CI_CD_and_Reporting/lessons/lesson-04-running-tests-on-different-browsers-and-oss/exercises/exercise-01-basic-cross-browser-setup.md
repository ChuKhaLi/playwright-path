# Exercise 1: Basic Cross-Browser Setup

## Objective
In this exercise, you will configure a Playwright project to run a simple test across Chromium, Firefox, and WebKit. This will help you understand the fundamentals of multi-browser testing.

## Instructions

### Step 1: Set Up Your Project
1.  If you don't have a Playwright project, create a new one:
    ```bash
    npm init playwright@latest my-cross-browser-tests
    cd my-cross-browser-tests
    ```
2.  Open the `playwright.config.ts` file.

### Step 2: Configure Multiple Browsers
1.  Locate the `projects` array in your `playwright.config.ts`.
2.  Ensure you have configurations for `chromium`, `firefox`, and `webkit`. If not, add them. Your `projects` array should look similar to this:
    ```typescript
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
    ],
    ```

### Step 3: Create a Simple Test
1.  Create a new test file `tests/example.spec.ts`.
2.  Add the following test code, which navigates to a page and checks its title:
    ```typescript
    import { test, expect } from '@playwright/test';

    test('has title', async ({ page }) => {
      await page.goto('https://playwright.dev/');
      await expect(page).toHaveTitle(/Playwright/);
    });
    ```

### Step 4: Run the Tests
1.  Run the tests across all configured browsers using the following command:
    ```bash
    npx playwright test
    ```
2.  Observe the output in your terminal. You should see the test running and passing on all three browser engines.

### Step 5: Run on a Specific Browser
1.  To run the test only on Firefox, use the `--project` flag:
    ```bash
    npx playwright test --project firefox
    ```
2.  Verify that the test runs only on the specified browser.

## Success Criteria
- You have successfully configured `playwright.config.ts` for multi-browser testing.
- Your test passes when run on all three browsers.
- You are able to execute the test on a single, specific browser.