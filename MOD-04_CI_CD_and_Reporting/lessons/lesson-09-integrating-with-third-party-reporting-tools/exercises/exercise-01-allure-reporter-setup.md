# Exercise 1: Allure Reporter Setup

## Objective
In this exercise, you will integrate the Allure framework with your Playwright project to generate detailed and interactive test reports.

## Instructions

### Step 1: Install Allure
1.  Add the `allure-playwright` dependency to your project:
    ```bash
    npm install -D allure-playwright
    ```

### Step 2: Configure the Allure Reporter
1.  Open your `playwright.config.ts` file.
2.  Add `allure-playwright` to your list of reporters.
    ```typescript
    // playwright.config.ts
    import { defineConfig } from '@playwright/test';

    export default defineConfig({
      reporter: [
        ['list'], // Keep the default list reporter
        ['allure-playwright', {
          detail: true,
          outputFolder: 'my-allure-results',
          suiteTitle: false
        }]
      ],
    });
    ```

### Step 3: Annotate a Test
1.  Open an existing test file.
2.  Import the `allure` object from `allure-playwright`.
3.  Add annotations to a test case as shown in the example below.

    ```typescript
    import { test, expect } from '@playwright/test';
    import { allure } from 'allure-playwright';

    test('should display the correct title', async ({ page }) => {
      await allure.description('This test navigates to the Playwright website and verifies the page title.');
      await allure.severity('normal');
      await allure.tags('website', 'smoke');
      await allure.feature('Homepage');
      await allure.story('Title Verification');

      await allure.step('Navigate to the website', async () => {
        await page.goto('https://playwright.dev/');
      });

      await allure.step('Check the title', async () => {
        await expect(page).toHaveTitle(/Playwright/);
      });
    });
    ```

### Step 4: Generate and View the Report
1.  Run your tests. This will create the `my-allure-results` directory with the raw report data.
    ```bash
    npx playwright test
    ```
2.  Generate the HTML report from the results:
    ```bash
    npx allure generate my-allure-results --clean -o allure-report
    ```
3.  Open the generated report in your browser:
    ```bash
    npx allure open allure-report
    ```

## Success Criteria
- You have successfully installed and configured the Allure reporter.
- Your test report includes the custom annotations (description, severity, tags, etc.).
- You can generate and view the Allure HTML report.