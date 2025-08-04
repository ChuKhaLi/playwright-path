import { test, expect } from '@playwright/test';

test.describe('Advanced Network Mocking', () => {
  test('should modify a request to add a query parameter', async ({ page }) => {
    await page.route('**/api/search*', async route => {
      const url = new URL(route.request().url());
      // Add a new query parameter to the request
      url.searchParams.set('sort', 'price_asc');
      // Continue with the modified URL
      await route.continue({ url: url.toString() });
    });

    await page.goto('/search?q=playwright');

    // The UI should now be sorted by price, ascending.
    const firstItemPrice = page.locator('.product-item .price').first();
    await expect(firstItemPrice).toHaveText('$10.00');
  });

  test('should modify a response to change product data', async ({ page }) => {
    await page.route('**/api/products/1', async route => {
      const response = await route.fetch();
      const json = await response.json();
      // Change the name of the product in the response
      json.name = 'The Ultimate Playwright Guide';
      await route.fulfill({ response, json });
    });

    await page.goto('/products/1');

    await expect(page.getByRole('heading', { name: 'The Ultimate Playwright Guide' })).toBeVisible();
  });

  test('should simulate a server error and show a fallback UI', async ({ page }) => {
    await page.route('**/api/user/profile', async route => {
      await route.fulfill({
        status: 503,
        json: { error: 'Service Unavailable' },
      });
    });

    await page.goto('/profile');

    await expect(page.locator('#error-container')).toBeVisible();
    await expect(page.locator('#error-container')).toContainText('Could not load profile. Please try again later.');
  });

  test('should abort non-essential tracking scripts', async ({ page }) => {
    let trackingRequestAborted = false;

    await page.route('**/google-analytics.js', async route => {
      trackingRequestAborted = true;
      await route.abort();
    });

    await page.goto('/');

    // The page should load normally, but the tracking script was blocked.
    expect(trackingRequestAborted).toBe(true);
    
    // You could also assert that no window._ga object was created.
    const gaObject = await page.evaluate(() => (window as any)._ga);
    expect(gaObject).toBeUndefined();
  });

  // A helper function for more complex, reusable mocks
  const mockAdminUser = async (page) => {
    await page.route('**/api/auth/user', route => {
      route.fulfill({
        json: { id: 'admin01', name: 'Admin User', role: 'admin' },
      });
    });
  };

  test('should show admin controls when user is mocked as an admin', async ({ page }) => {
    await mockAdminUser(page);
    await page.goto('/dashboard');
    await expect(page.getByRole('link', { name: 'Admin Settings' })).toBeVisible();
  });
});