# Lesson 3: Performance Testing with Playwright

## 1. Client-Side Performance Testing

Performance testing is often associated with server-side load testing, but client-side performance is equally important for user experience. A slow-rendering page can be just as frustrating as a slow API response.

With Playwright, we can measure how long it takes for a page to load, render, and become interactive from the user's perspective. This is often called "Real User Monitoring" (RUM) when done in production, but we can simulate it during testing.

### Key Client-Side Metrics

-   **Page Load Time:** The total time it takes for a page to load completely.
-   **First Contentful Paint (FCP):** The time when the first piece of content (text, image, etc.) is rendered on the screen.
-   **Largest Contentful Paint (LCP):** The time when the largest content element in the viewport becomes visible.
-   **Time to Interactive (TTI):** The time it takes for the page to become fully interactive (i.e., responsive to user input).

## 2. Using Playwright Tracing for Performance Analysis

Playwright's tracing is a powerful feature for debugging, but it's also an excellent tool for performance analysis. It captures a detailed timeline of all browser activities, including network requests and rendering events.

### How to Enable Tracing

You can enable tracing in your `playwright.config.ts`. The `on-first-retry` option is often a good choice, as it will only generate a trace for failed tests that are being retried.

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // ...
  use: {
    trace: 'on-first-retry',
  },
});
```

### Analyzing a Trace

After a test run, you can view the trace file with the following command:

```bash
npx playwright show-trace trace.zip
```

The trace viewer provides:
-   A filmstrip view of the test execution.
-   A timeline of actions and events.
-   A "Network" tab showing all resource requests, their timings, and sizes.
-   A "Performance" tab with FCP, LCP, and a detailed flame chart.

## 3. Measuring Performance Metrics Manually

While the trace viewer is great for deep analysis, you can also capture performance metrics directly in your tests.

### Measuring Page Load Time

You can measure the time it takes for a `page.goto()` operation to complete.

```typescript
import { test, expect } from '@playwright/test';

test('should load the page within an acceptable time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('https://playwright.dev');
  const loadTime = Date.now() - startTime;

  console.log(`Page load time: ${loadTime} ms`);

  // Assert that the load time is within a reasonable threshold
  expect(loadTime).toBeLessThan(3000); // e.g., 3 seconds
});
```

### Accessing Performance APIs

Playwright allows you to execute JavaScript in the browser context, so you can access the browser's built-in Performance API.

```typescript
import { test, expect } from '@playwright/test';

test('should get LCP using the Performance API', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  });

  console.log(`Largest Contentful Paint: ${lcp} ms`);
  expect(lcp).toBeLessThan(2500); // Google's recommended LCP
});
```

## 4. Integrating Performance Checks into Functional Tests

You don't need a separate performance test suite. You can add simple performance assertions to your existing functional tests. This is a great way to catch performance regressions early.

```typescript
import { test, expect } from '@playwright/test';

test('should log in and load the dashboard quickly', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('#username', 'user');
  await page.fill('#password', 'pass');
  
  const startTime = Date.now();
  await page.click('#login-button');
  await page.waitForURL('**/dashboard');
  const navigationTime = Date.now() - startTime;

  // Assert that the dashboard loads within 2 seconds after login
  expect(navigationTime).toBeLessThan(2000);

  // Continue with functional assertions
  await expect(page.locator('h1')).toHaveText('Dashboard');
});
```

This approach provides a baseline level of performance monitoring without the complexity of a full-blown performance testing framework.