# Lesson 4: Lighthouse Integration for Advanced Performance

## 1. What is Google Lighthouse?

Lighthouse is an automated tool that audits web pages across several key areas:

-   **Performance:** Measures how long it takes for a page to load and become interactive.
-   **Accessibility:** Checks for common issues that prevent users with disabilities from accessing content.
-   **Best Practices:** Looks for modern web development best practices.
-   **SEO:** Audits for technical SEO issues that could affect search engine ranking.
-   **Progressive Web App (PWA):** Validates the PWA configuration.

For each category, Lighthouse provides a score from 0 to 100 and a detailed report with actionable advice for improvement.

## 2. Setting Up Lighthouse with Playwright

To use Lighthouse in our Playwright tests, we need to install a community-developed package that bridges the two tools.

### Step 1: Install Dependencies

We will use the `playwright-lighthouse` package.

```bash
npm install -D playwright-lighthouse
```

You also need to have `lighthouse` installed.

```bash
npm install -D lighthouse
```

### Step 2: Create a Lighthouse Test File

Create a new test file, for example, `lighthouse.spec.ts`.

## 3. Running a Lighthouse Audit

The `playwright-lighthouse` package provides a function that we can call from our test to run the audit.

### Example: Basic Lighthouse Audit

```typescript
import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('Lighthouse Audits', () => {
  test('should run a Lighthouse audit on the homepage', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    await playAudit({
      page: page,
      port: 9222, // Port for Chrome DevTools Protocol
      thresholds: {
        performance: 50,
        accessibility: 90,
        'best-practices': 90,
        seo: 90,
      },
      reports: {
        formats: {
          html: true, // Generate an HTML report
        },
        name: `lighthouse-report-${new Date().toISOString()}`,
        directory: 'lighthouse-reports',
      },
    });
  });
});
```

### Understanding the Configuration

-   `page`: The Playwright page object.
-   `port`: A port number for the Chrome DevTools Protocol to connect to. This is required for Lighthouse to communicate with the browser instance controlled by Playwright.
-   `thresholds`: This is where you define your performance budget. If any of the scores fall below these thresholds, the test will fail.
-   `reports`: Configures the output. In this case, we are generating an HTML report in the `lighthouse-reports` directory.

## 4. Analyzing the Report

After running the test, you will find a detailed HTML report in the `lighthouse-reports` directory. This report is identical to the one you would get from running Lighthouse in Chrome DevTools.

The report will show you:
-   Your overall scores for each category.
-   Specific metrics like FCP, LCP, and Total Blocking Time (TBT).
-   A list of "Opportunities" to improve your scores.
-   A list of "Diagnostics" with more in-depth information.

## 5. Asserting on Scores

The `playAudit` function automatically asserts on the thresholds you provide. If a score is too low, the test will fail with a clear message.

This is incredibly powerful for preventing performance regressions. You can set a baseline for your scores and ensure that new code changes don't negatively impact them.

### Example: Failing Test

If you set a performance threshold of 95, the test might fail:

```
Error: Lighthouse score for performance is 85, which is below the threshold of 95.
```

This gives you immediate feedback in your CI/CD pipeline that a performance regression has occurred.

## 6. Use Cases in Testing

-   **Gating Deployments:** Fail a CI build if Lighthouse scores drop below a certain level.
-   **Tracking Performance Over Time:** Run audits nightly and store the results to track performance trends.
-   **Auditing User Journeys:** Run an audit not just on the homepage, but after a user has completed a key action, like adding an item to a cart. This requires navigating with Playwright first and then running the audit.