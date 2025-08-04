# Lesson 2: Advanced Visual Testing Integration

## 1. Handling Dynamic Data

One of the biggest challenges in visual regression testing is dealing with dynamic content, such as dates, times, or user-specific information. This content can cause tests to fail even when there are no real visual bugs.

Playwright provides a `mask` option to handle this. You can provide a locator for the dynamic element, and Playwright will cover it with a pink box before taking the screenshot.

### Example: Masking a Dynamic Element

```typescript
import { test, expect } from '@playwright/test';

test('should mask dynamic content', async ({ page }) => {
  await page.goto('https://example.com/dashboard');

  // Assume '.user-last-login' contains a dynamic date/time
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [page.locator('.user-last-login')],
  });
});
```

This ensures that the test focuses only on the static parts of the UI that should not change.

## 2. Testing Across Multiple Browsers and Viewports

Visual bugs often appear only in specific browsers or at certain screen sizes. Playwright's project configuration makes it easy to run your visual tests across different environments.

### Step 1: Configure Projects in `playwright.config.ts`

Define different projects for each browser and viewport combination you want to test.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ... other configurations
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

### Step 2: How Playwright Manages Screenshots

When you run your tests, Playwright will now generate separate screenshots for each project. The file structure will look like this:

```
tests/my-test.spec.ts-snapshots/
├── my-screenshot-chromium-desktop.png
├── my-screenshot-firefox-desktop.png
└── my-screenshot-webkit-mobile.png
```

This allows you to maintain a separate baseline for each environment, ensuring pixel-perfect rendering across all supported platforms.

## 3. Organizing Your Visual Test Suite

As your test suite grows, organization becomes key. Here are some best practices:

-   **Descriptive Screenshot Names:** Use clear and descriptive names for your screenshots. Instead of `screenshot-1.png`, use `user-profile-page-logged-in.png`.
-   **Component-Based Tests:** Create separate test files for different UI components or pages. This makes tests easier to maintain and debug.
-   **Use `test.describe()`:** Group related visual tests together using `test.describe()` blocks for better organization and reporting.

## 4. Integrating Visual Tests into CI/CD

The ultimate goal is to automate visual testing within your CI/CD pipeline.

### Step 1: Run Tests in CI

Configure your CI pipeline (e.g., GitHub Actions) to run Playwright tests.

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
```

### Step 2: Handling Failures

When a visual test fails in CI, Playwright will save the actual, expected, and diff images as test artifacts. You can configure your CI job to upload these artifacts, so you can download and inspect them.

Add this step to your GitHub Actions workflow:

```yaml
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Step 3: Updating Baselines in CI

Updating baselines should be a deliberate, manual process. It is **not recommended** to run `--update-snapshots` automatically in CI.

The recommended workflow is:
1.  A visual test fails in a pull request.
2.  A developer reviews the diff artifact.
3.  If the change is intentional, they run `npx playwright test --update-snapshots` on their local machine.
4.  They commit the updated baseline screenshots to the pull request.
5.  The CI tests run again and pass.