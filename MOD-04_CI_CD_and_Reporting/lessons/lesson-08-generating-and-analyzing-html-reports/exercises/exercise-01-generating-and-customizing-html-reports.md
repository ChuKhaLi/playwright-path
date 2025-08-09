# Exercise 1: Generating and Customizing HTML Reports

## Objective
In this exercise, you will learn how to generate, customize, and analyze Playwright's HTML report.

## Instructions

### Step 1: Configure the HTML Reporter
1.  Open your `playwright.config.ts` file.
2.  Configure the `reporter` option to use the HTML reporter with a custom output folder.
3.  Set the `open` option to `on-failure`.
    ```typescript
    // playwright.config.ts
    import { defineConfig } from '@playwright/test';

    export default defineConfig({
      reporter: [['html', { outputFolder: 'my-report', open: 'on-failure' }]],
    });
    ```

### Step 2: Add a Failing Test
1.  To see the `on-failure` behavior, let's create a test that is designed to fail.
2.  In a test file (e.g., `tests/example.spec.ts`), add the following test case:
    ```typescript
    test('failing test', async ({ page }) => {
      await page.goto('https://playwright.dev/');
      // This assertion will fail
      await expect(page).toHaveTitle(/Google/);
    });
    ```

### Step 3: Run the Tests and View the Report
1.  Run your tests from the terminal:
    ```bash
    npx playwright test
    ```
2.  Since one test failed, the HTML report should automatically open in your browser.
3.  Explore the report:
    -   Look at the summary dashboard.
    -   Click on the failing test to see the error details and the screenshot.
    -   Find the trace file link and open it to debug the test.

### Step 4: Manually Open the Report
1.  If you close the report, you can always open it again manually with the following command:
    ```bash
    npx playwright show-report my-report
    ```
    (Replace `my-report` with your configured `outputFolder`.)

## Success Criteria
- You have successfully configured the HTML reporter with custom options.
- The report automatically opens when a test fails.
- You can navigate the report to find failure details, screenshots, and traces.
- You can manually open the report using the `show-report` command.