import { test, expect } from '@playwright/test';

/**
 * This example demonstrates a basic visual regression test.
 * It navigates to the Playwright website and takes a screenshot of the landing page.
 *
 * How to run:
 * 1. Run `npx playwright test --update-snapshots` to create the baseline screenshot.
 * 2. Run `npx playwright test` to compare against the baseline.
 */
test.describe('Visual Regression Testing', () => {
  test('should match the landing page screenshot', async ({ page }) => {
    // Navigate to the target page
    await page.goto('https://playwright.dev');

    // Assert that the page matches the saved screenshot.
    // A new screenshot is created if none exists.
    await expect(page).toHaveScreenshot('playwright-landing-page.png', {
      fullPage: true, // Ensure the entire page is captured
    });
  });

  test('should match a specific element screenshot', async ({ page }) => {
    // Navigate to the target page
    await page.goto('https://playwright.dev/docs/intro');

    // Locate a specific element to capture
    const header = page.locator('.DocSearch');

    // Assert that the element matches the saved screenshot.
    await expect(header).toHaveScreenshot('docs-header.png');
  });
});