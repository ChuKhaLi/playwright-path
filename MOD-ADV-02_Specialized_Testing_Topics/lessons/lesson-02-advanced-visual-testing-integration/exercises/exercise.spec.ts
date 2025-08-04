import { test, expect } from '@playwright/test';

/**
 * Exercise: Advanced Visual Testing Practice
 *
 * Objective:
 * To apply advanced techniques like masking and multi-viewport testing.
 *
 * Instructions:
 * 1. Target URL: Use a news website like 'https://www.theverge.com/' which has dynamic content.
 * 2. Create a test that navigates to the homepage.
 * 3. Identify a section with dynamic content (e.g., the main story or a list of recent articles).
 * 4. Take a full-page screenshot, but **mask** the dynamic section you identified.
 *    Name the screenshot 'verge-homepage-masked.png'.
 * 5. Run the test with `--update-snapshots` to create the baseline.
 * 6. Run it again to confirm it passes.
 *
 * Bonus Challenge:
 * - Modify your `playwright.config.ts` to run this test on both 'Desktop Chrome' and 'iPhone 13'.
 * - Run the tests again. You will need to update snapshots for the new mobile configuration.
 * - Inspect the generated snapshot directory to see how Playwright stores the different files.
 */

test.describe('Advanced Visual Testing Exercises', () => {
  // Your test code goes here
  test('should mask the main content on The Verge homepage', async ({ page }) => {
    // 1. Navigate to the site
    await page.goto('https://www.theverge.com/');

    // 2. Identify the dynamic content area
    // This selector might need to be updated if the site structure changes.
    const dynamicContent = page.locator('.duet--content-cards--content-card-group');

    // 3. Assert a screenshot with the dynamic area masked
    await expect(page).toHaveScreenshot('verge-homepage-masked.png', {
      mask: [dynamicContent],
      fullPage: true,
    });
  });
});