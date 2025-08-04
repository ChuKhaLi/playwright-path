import { test, expect } from '@playwright/test';

/**
 * This example demonstrates basic performance testing with Playwright.
 */
test.describe('Performance Testing Examples', () => {
  /**
   * This test measures the page load time and asserts it's within a threshold.
   */
  test('should measure page load time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('https://www.google.com');
    const loadTime = Date.now() - startTime;

    console.log(`Google.com load time: ${loadTime} ms`);

    // Assert that the load time is less than 2 seconds (2000 ms)
    expect(loadTime).toBeLessThan(2000);
  });

  /**
   * This test uses the browser's Performance API to get the
   * First Contentful Paint (FCP) metric.
   */
  test('should measure First Contentful Paint (FCP)', async ({ page }) => {
    await page.goto('https://www.google.com');

    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntriesByName('first-contentful-paint');
          if (entries.length > 0) {
            resolve(entries[0].startTime);
          }
        }).observe({ type: 'paint', buffered: true });
      });
    });

    console.log(`First Contentful Paint: ${fcp} ms`);
    // A good FCP is generally under 1800 ms
    expect(fcp).toBeLessThan(1800);
  });
});