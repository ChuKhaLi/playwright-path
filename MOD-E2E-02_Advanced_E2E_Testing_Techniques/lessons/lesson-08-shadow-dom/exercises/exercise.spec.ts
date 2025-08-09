import { test, expect } from '@playwright/test';

test.describe('Shadow DOM Exercises', () => {
  test('Exercise 1: Interact with an element in a shadow root', async ({ page }) => {
    // This is a placeholder for a site that uses Shadow DOM.
    // You can find examples at https://www.virustotal.com/gui/home/upload
    // or other sites that use web components.
    await page.goto('https://www.virustotal.com/gui/home/upload');

    // The file upload input is inside a shadow root.
    // Playwright can pierce it automatically.
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
  });
});