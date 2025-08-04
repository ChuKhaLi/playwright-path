import { test, expect } from '@playwright/test';

/**
 * Exercise: Basic Performance Measurement
 *
 * Objective:
 * To practice measuring and asserting on client-side performance metrics.
 *
 * Instructions:
 * 1. Target URL: Use a content-heavy website, for example, 'https://www.nationalgeographic.com/'.
 * 2. Create a test that measures the total page load time using `Date.now()`.
 * 3. Log the load time to the console.
 * 4. Add an assertion to check if the load time is below a reasonable threshold (e.g., 5000 ms).
 *
 * Bonus Challenge:
 * - In the same test, use `page.evaluate()` to get the Largest Contentful Paint (LCP) time.
 * - Log the LCP time and assert that it is below 4000 ms.
 * - Hint: You'll need to use the PerformanceObserver API as shown in the lesson content.
 */

test.describe('Performance Testing Exercises', () => {
  test('should measure load time and LCP for National Geographic', async ({
    page,
  }) => {
    // Your code for the main exercise goes here
    const startTime = Date.now();
    await page.goto('https://www.nationalgeographic.com/');
    const loadTime = Date.now() - startTime;

    console.log(`National Geographic load time: ${loadTime} ms`);
    expect(loadTime).toBeLessThan(5000);

    // Your code for the bonus challenge goes here
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const lcpEntry = entries[entries.length - 1];
            resolve(lcpEntry.startTime);
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      });
    });

    console.log(`Largest Contentful Paint: ${lcp} ms`);
    expect(lcp).toBeLessThan(4000);
  });
});