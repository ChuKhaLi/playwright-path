import { test, expect } from '@playwright/test';

test.describe('Parallelism Exercises', () => {
  test('Exercise 1: Run tests in parallel', async ({ page }) => {
    // This is a placeholder test.
    // In a real scenario, you would have multiple test files.
    // To see parallelism in action, create several test files
    // and run them with `npx playwright test`.
    await page.goto('https://playwright.dev/');
    const title = page.locator('.navbar__inner .navbar__title');
    await expect(title).toHaveText('Playwright');
  });
});