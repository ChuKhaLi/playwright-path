import { test, expect } from '@playwright/test';

test.describe('API Versioning', () => {
  test('should return the v1 user format', async ({ page }) => {
    // Mock the v1 endpoint
    await page.route('**/api/v1/user/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, name: 'John Doe' }),
      });
    });

    // Use page.request to make the API call
    const response = await page.request.get('/api/v1/user/1');
    const body = await response.json();

    expect(response.ok()).toBe(true);
    expect(body.name).toBe('John Doe');
    expect(body).not.toHaveProperty('firstName');
    expect(body).not.toHaveProperty('lastName');
  });

  test('should return the v2 user format', async ({ page }) => {
    // Mock the v2 endpoint
    await page.route('**/api/v2/user/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, firstName: 'Jane', lastName: 'Doe' }),
      });
    });

    // Use page.request to make the API call
    const response = await page.request.get('/api/v2/user/1');
    const body = await response.json();

    expect(response.ok()).toBe(true);
    expect(body.firstName).toBe('Jane');
    expect(body.lastName).toBe('Doe');
    expect(body).not.toHaveProperty('name');
  });
});