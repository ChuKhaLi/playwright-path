import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Testing Exercises', () => {
  test('Exercise 1: Verify behavior across browsers', async ({ page, browserName }) => {
    await page.goto('https://whatismybrowser.com/');

    // This assertion should pass in all browsers, but the reported
    // browser name will be different.
    await expect(page.locator('#what-is-my-browser')).toContainText(browserName, { ignoreCase: true });
  });
});