import { test, expect } from '@playwright/test';

test.describe('Authentication Tests @auth', () => {
  test('should allow a user to log in with valid credentials @smoke @p1', async ({ page }) => {
    // This is a critical, high-priority smoke test for the auth feature.
    await page.goto('/login');
    // ... login logic
    await expect(page.locator('#logout-button')).toBeVisible();
  });

  test('should show error for invalid password @regression @p2', async ({ page }) => {
    // This is a less critical regression test.
    await page.goto('/login');
    // ... invalid login logic
    await expect(page.locator('.error-message')).toBeVisible();
  });
});