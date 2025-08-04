import { test, expect } from '@playwright/test';

test('example test with logging', async ({ page }) => {
  console.log('Starting the test...');
  await page.goto('https://playwright.dev/');
  console.log('Navigated to the page.');
  await expect(page).toHaveTitle(/Playwright/);
  console.log('Test finished.');
});