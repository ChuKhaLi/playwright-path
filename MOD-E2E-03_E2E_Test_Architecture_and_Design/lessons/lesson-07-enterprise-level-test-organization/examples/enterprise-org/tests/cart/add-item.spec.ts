import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Tests @cart', () => {
  test('should allow adding an item to the cart @smoke @p1', async ({ page }) => {
    // This is a critical smoke test for the cart feature.
    await page.goto('/products/1');
    await page.locator('#add-to-cart').click();
    await expect(page.locator('.cart-badge')).toHaveText('1');
  });

  test('should be able to remove an item from the cart @regression @p2', async ({ page }) => {
    // Setup: add an item first
    await page.goto('/products/1');
    await page.locator('#add-to-cart').click();
    
    // Test removing it
    await page.goto('/cart');
    await page.locator('.remove-item-button').click();
    await expect(page.locator('.cart-empty-message')).toBeVisible();
  });
});