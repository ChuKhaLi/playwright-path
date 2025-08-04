import { test, expect } from '@playwright/test';

/**
 * This example demonstrates advanced visual regression testing techniques.
 */
test.describe('Advanced Visual Testing', () => {
  /**
   * This test shows how to mask dynamic content.
   * We will use a news website where the headlines change frequently.
   */
  test('should mask dynamic news headlines', async ({ page }) => {
    await page.goto('https://www.bbc.com/news');

    // We want to test the layout of the homepage, but the headlines are dynamic.
    // We can mask the container that holds the headlines.
    const headlinesContainer = page.locator('#main-content');

    // The `mask` option will cover the specified element(s) in pink.
    await expect(page).toHaveScreenshot('bbc-homepage-masked.png', {
      mask: [headlinesContainer],
      fullPage: true,
    });
  });

  /**
   * This test demonstrates how to handle animations or elements that
   * take time to stabilize by setting `animations: 'disabled'`.
   */
  test('should handle animations gracefully', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // By disabling animations, we ensure a stable state before the screenshot.
    await expect(page).toHaveScreenshot('playwright-stable.png', {
      animations: 'disabled',
      fullPage: true,
    });
  });
});