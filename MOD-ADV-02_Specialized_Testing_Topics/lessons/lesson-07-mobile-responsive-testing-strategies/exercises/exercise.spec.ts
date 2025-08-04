import { test, expect } from '@playwright/test';

/**
 * Exercise: Test a Responsive Website
 *
 * Objective:
 * To practice writing a test that verifies the responsive behavior of a website.
 *
 * Instructions:
 * 1. Target URL: Use a well-known responsive site, like 'https://www.smashingmagazine.com/'.
 * 2. Configure your `playwright.config.ts` to have at least one desktop project and one mobile project.
 *    (e.g., 'Desktop Chrome' and 'Pixel 5').
 * 3. Write a single test that uses the `isMobile` fixture.
 * 4. If `isMobile` is true, assert that the "hamburger" menu button is visible and the main navigation is not.
 * 5. If `isMobile` is false, assert the opposite: the main navigation is visible, and the hamburger button is not.
 * 6. Run your test against both your desktop and mobile projects to confirm it works correctly in both viewports.
 *
 * Bonus Challenge:
 * - Add a visual regression check (`toHaveScreenshot`) to the test.
 * - Run the test for both desktop and mobile to generate two different baseline screenshots.
 * - Inspect the screenshots to see the differences in the responsive layout.
 */

test.describe('Responsive Testing Exercises', () => {
  test('should display the correct navigation for smashing magazine', async ({
    page,
    isMobile,
  }) => {
    // Your code goes here
    await page.goto('https://www.smashingmagazine.com/');

    if (isMobile) {
      const hamburgerButton = page.locator('.hamburger-menu-button');
      await expect(hamburgerButton).toBeVisible();

      const navMenu = page.locator('#main-nav');
      await expect(navMenu).not.toBeVisible();
    } else {
      const hamburgerButton = page.locator('.hamburger-menu-button');
      await expect(hamburgerButton).not.toBeVisible();

      const navMenu = page.locator('#main-nav');
      await expect(navMenu).toBeVisible();
    }

    // Bonus Challenge
    await expect(page).toHaveScreenshot('smashing-magazine-layout.png', {
      fullPage: true,
    });
  });
});