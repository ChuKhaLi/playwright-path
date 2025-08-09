import { test, expect } from '@playwright/test';

// This test assumes a running backend API at `baseURL` from playwright.config.ts
// For example: baseURL: 'http://localhost:3000'

test.describe('Data and State Management', () => {
  let createdProductId: string;

  // Before each test, create a new product via API
  test.beforeEach(async ({ request }) => {
    const response = await request.post('/api/products', {
      data: {
        name: `Test Product ${Date.now()}`,
        price: 99.99,
      },
    });
    expect(response.status()).toBe(201);
    const product = await response.json();
    createdProductId = product.id;
  });

  // After each test, clean up the created product via API
  test.afterEach(async ({ request }) => {
    if (createdProductId) {
      const response = await request.delete(`/api/products/${createdProductId}`);
      expect(response.status()).toBe(204);
    }
  });

  test('should display the created product on the product page', async ({ page }) => {
    await page.goto(`/products/${createdProductId}`);
    
    const productName = await page.locator('h1').textContent();
    expect(productName).toContain('Test Product');
    
    const productPrice = await page.locator('.price').textContent();
    expect(productPrice).toBe('$99.99');
  });

  test('should inject localStorage state to show a promotional banner', async ({ page }) => {
    // Go to the page first to have a document context
    await page.goto('/products');

    // Inject state into localStorage to simulate a user who has seen a promo
    await page.evaluate(() => {
      localStorage.setItem('promoViewed', 'true');
    });

    // Reload the page for the app to read the new state
    await page.reload();

    // Assert that the special promotional banner is now visible
    await expect(page.locator('#promo-banner-special')).toBeVisible();
  });

  test('should combine API data and injected state', async ({ page }) => {
    // Inject state to enable a "quick edit" mode
    await page.goto(`/products/${createdProductId}`);
    await page.evaluate(() => {
      sessionStorage.setItem('quickEditMode', 'enabled');
    });
    await page.reload();

    // Because of the seeded data, we are on the correct product page.
    // Because of the injected state, the quick edit button should be visible.
    const quickEditButton = page.locator('button.quick-edit');
    await expect(quickEditButton).toBeVisible();

    // Interact with the feature enabled by the injected state
    await quickEditButton.click();
    await expect(page.locator('.inline-editor')).toBeVisible();
  });
});