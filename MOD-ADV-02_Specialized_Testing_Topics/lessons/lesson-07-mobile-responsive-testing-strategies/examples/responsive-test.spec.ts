import { test, expect } from '@playwright/test';

/**
 * This example demonstrates how to write a test that adapts to different viewports.
 *
 * To run this effectively, you should have projects configured in your playwright.config.ts:
 *
 * projects: [
 *   { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
 *   { name: 'mobile', use: { ...devices['iPhone 13'] } }
 * ]
 *
 * Run with `npx playwright test --project=mobile` or `npx playwright test --project=desktop`.
 */
test.describe('Responsive Design Example', () => {
  test('should display the correct navigation for the viewport', async ({
    page,
    isMobile,
  }) => {
    await page.goto('https://www.astronomy.com/');

    if (isMobile) {
      // On mobile, we expect a hamburger menu button
      const hamburgerMenu = page.locator('#td-mobile-nav-toggle');
      await expect(hamburgerMenu).toBeVisible();

      // The main navigation menu should be hidden initially
      const mainMenu = page.locator('#td-header-menu');
      await expect(mainMenu).not.toBeVisible();
    } else {
      // On desktop, the main navigation should be visible
      const mainMenu = page.locator('#td-header-menu');
      await expect(mainMenu).toBeVisible();

      // The hamburger menu button should not exist or be hidden
      const hamburgerMenu = page.locator('#td-mobile-nav-toggle');
      await expect(hamburgerMenu).not.toBeVisible();
    }
  });
});