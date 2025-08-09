# Lesson 2: Cross-Browser Testing

Ensuring your web application works consistently across different browsers is crucial for a good user experience. Playwright makes cross-browser testing simple and efficient.

## 1. What is Cross-Browser Testing?

Cross-browser testing is the practice of verifying that your website or web application functions correctly on different web browsers, such as Chrome, Firefox, and Safari (WebKit).

## 2. Configuring Cross-Browser Tests

Playwright's configuration file, `playwright.config.ts`, is where you define the browsers you want to test against.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Test against desktop browsers
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
});
```

When you run `npx playwright test`, Playwright will execute your entire test suite against each of the configured projects in parallel.

## 3. Browser-Specific Logic

Sometimes, you may need to write tests that are specific to a particular browser. You can use the `test.skip` or `test.fixme` annotations to control which tests run on which browsers.

```typescript
import { test, expect } from '@playwright/test';

test('should only run on Chrome', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'This feature is Chrome-only');

  await page.goto('https://my-chrome-feature.com');
  // ... test logic
});
```

## 4. Best Practices

- **Focus on Rendering Engines:** The most important browsers to test are those with different rendering engines: Chromium (Chrome, Edge), Gecko (Firefox), and WebKit (Safari).
- **Use CI/CD:** Integrate your cross-browser tests into your CI/CD pipeline to catch regressions early.
- **Visual Regression Testing:** For complex UIs, consider using visual regression testing to catch subtle rendering differences between browsers.