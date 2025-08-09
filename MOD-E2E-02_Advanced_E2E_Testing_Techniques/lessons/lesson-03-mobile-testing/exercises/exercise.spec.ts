import { test, expect, devices } from '@playwright/test';

test.describe('Mobile and Responsive Testing Exercises', () => {
  test('Exercise 1: Verify mobile layout', async ({ page }) => {
    // This test is configured to run on a mobile device
    // in playwright.config.ts.
    await page.goto('https://playwright.dev/');

    // The navigation bar should be collapsed into a single button
    // on mobile.
    const hamburgerButton = page.locator('.navbar__toggle');
    await expect(hamburgerButton).toBeVisible();
  });
});