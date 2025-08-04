import { test, expect } from '@playwright/test';

/**
 * This example demonstrates how to mock an API request to test the frontend
 * in isolation.
 */
test.describe('API Mocking Example', () => {
  test('should display product details from a mocked API response', async ({
    page,
  }) => {
    // The URL of the API endpoint we want to mock
    const productApiUrl = '**/api/products/123';

    // Intercept the network request and provide a mock response
    await page.route(productApiUrl, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '123',
          name: 'Super Widget',
          price: 99.99,
          description: 'A widget that is super.',
        }),
      });
    });

    // Navigate to the product page. The frontend will make a real request,
    // but Playwright will intercept it and return our mock data instead.
    await page.goto('/products/123');

    // Assert that the frontend correctly displays the mocked data
    await expect(page.locator('h1')).toHaveText('Super Widget');
    await expect(page.locator('.price')).toHaveText('$99.99');
    await expect(page.locator('.description')).toHaveText(
      'A widget that is super.'
    );
  });
});