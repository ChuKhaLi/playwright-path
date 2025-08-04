import { test, expect } from '@playwright/test';

/**
 * Exercise: Write Your First Visual Regression Test
 *
 * Objective:
 * To practice creating a baseline screenshot and running a visual comparison test.
 *
 * Instructions:
 * 1. Target URL: Use a website you are familiar with, for example, 'https://github.com'.
 * 2. Create a test that navigates to the homepage.
 * 3. Take a full-page screenshot and name it 'github-homepage.png'.
 * 4. Run the test with `--update-snapshots` to create the baseline.
 * 5. Run the test again to confirm it passes.
 *
 * Bonus Challenge:
 * - Write a second test that takes a screenshot of a specific element, like the sign-up form or the navigation bar.
 * - Experiment with the `threshold` option in `toHaveScreenshot` to see how it affects test outcomes.
 *   Example: `await expect(page).toHaveScreenshot('github-homepage.png', { threshold: 0.2 });`
 */

test.describe('Visual Testing Exercises', () => {
  // Your test code goes here
  test('should capture the homepage of GitHub', async ({ page }) => {
    // 1. Navigate to GitHub
    await page.goto('https://github.com');

    // 2. Assert a full-page screenshot
    await expect(page).toHaveScreenshot('github-homepage.png', {
      fullPage: true,
    });
  });

  // Bonus challenge solution
  test('should capture the GitHub sign-in button', async ({ page }) => {
    // 1. Navigate to GitHub
    await page.goto('https://github.com');

    // 2. Locate the sign-in button
    const signInButton = page.locator('a[href="/login"]');

    // 3. Assert a screenshot of the element
    await expect(signInButton).toHaveScreenshot('github-signin-button.png');
  });
});