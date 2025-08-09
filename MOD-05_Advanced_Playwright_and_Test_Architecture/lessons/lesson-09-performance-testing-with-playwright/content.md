# Lesson 9: Performance Testing with Playwright

## 1. Introduction to Performance Testing with Playwright

Playwright is not a load testing tool like JMeter or k6. It won't simulate thousands of users. Instead, it excels at **front-end performance testing** or **Real User Monitoring (RUM)** simulation. It measures the performance experience of a *single user* under various conditions.

You can use it to answer questions like:
- How long does our page take to become interactive?
- Are we loading unnecessarily large images?
- Is a specific API call slowing down the entire page load?
- Did a recent change regress our page's performance?

## 2. Measuring Page Load Times

A simple way to get a performance baseline is to measure the time it takes for key page events to occur.

```typescript
import { test, expect } from '@playwright/test';

test('should load the homepage within performance budget', async ({ page }) => {
  const startTime = Date.now();
  
  // Navigate and wait for the page to be fully loaded
  await page.goto('/', { waitUntil: 'load' });
  
  const loadTime = Date.now() - startTime;
  console.log(`Page load time: ${loadTime}ms`);

  // Assert that the load time is within our budget (e.g., 2 seconds)
  expect(loadTime).toBeLessThan(2000);
});
```

## 3. Using the Browser's Performance API

Browsers have a built-in `window.performance` API that provides detailed performance metrics. You can access this API from your Playwright tests using `page.evaluate()`.

```typescript
test('should meet Core Web Vitals targets', async ({ page }) => {
  await page.goto('/');

  // Use page.evaluate to run code in the browser context
  const performanceTiming = await page.evaluate(() =>
    JSON.stringify(window.performance.timing)
  );
  const timing = JSON.parse(performanceTiming);

  // Time to First Byte (TTFB)
  const ttfb = timing.responseStart - timing.requestStart;
  console.log(`TTFB: ${ttfb}ms`);
  expect(ttfb).toBeLessThan(500); // Example budget: 500ms

  // DOMContentLoaded time
  const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;
  console.log(`DOMContentLoaded: ${domContentLoadedTime}ms`);
  expect(domContentLoadedTime).toBeLessThan(1500); // Example budget: 1.5s
});
```
You can also get modern metrics like Largest Contentful Paint (LCP) and First Input Delay (FID) this way, though it requires more complex `page.evaluate` scripts.

## 4. Analyzing Network Requests

`page.route()` is a powerful tool that allows you to intercept network requests. You can use it to monitor, block, or modify requests and responses. For performance, we can use it to listen to requests and measure their timings.

```typescript
test('should not have any large images on the homepage', async ({ page }) => {
  const imageRequests: any[] = [];

  // Listen to all network requests
  page.on('requestfinished', request => {
    if (request.resourceType() === 'image') {
      imageRequests.push(request);
    }
  });

  await page.goto('/');

  console.log(`Found ${imageRequests.length} image requests.`);

  for (const req of imageRequests) {
    const response = await req.response();
    const size = (await response.body()).length;
    
    console.log(`Image: ${req.url()}, Size: ${size} bytes`);
    
    // Assert that no single image is larger than 100KB
    expect(size).toBeLessThan(100 * 1024);
  }
});
```

You can also use `page.waitForResponse()` to wait for a specific API call and assert its timing.

```typescript
test('user data API should respond quickly', async ({ page }) => {
  await page.goto('/dashboard');

  const response = await page.waitForResponse('**/api/user-data');
  const timing = response.request().timing();

  // The time from when the request was sent to when the response headers were received
  const responseTime = timing.responseEnd - timing.requestStart;
  
  console.log(`User data API response time: ${responseTime}ms`);
  expect(responseTime).toBeLessThan(300); // Budget: 300ms
});
```

## 5. Performance Diagnostics with Tracing

Playwright Tracing, which we've seen before, is also an excellent performance tool. When you enable tracing, it captures a detailed performance timeline.

**Configuration in `playwright.config.ts`:**
```typescript
use: {
  trace: 'on', // or 'on-first-retry'
}
```

After a test run, open the HTML report and click the trace icon for a test.

```bash
npx playwright show-report
```

The trace viewer will show you:
- A filmstrip of the test execution.
- A detailed timeline with browser events, network requests, and console logs.
- A "Network" tab where you can inspect each request's headers, body, and timing waterfall.

This is invaluable for debugging performance bottlenecks visually. You can see exactly which request is holding up the page render.

## 6. Summary

While not a replacement for dedicated load testing tools, Playwright is an outstanding tool for integrating front-end performance checks into your E2E test suite. By measuring load times, analyzing network traffic, and using the built-in trace viewer, you can create performance assertions that prevent regressions and ensure your application remains fast and responsive for your users.