import { test, expect } from '@playwright/test';

test('should display mocked fruit data on the page', async ({ page }) => {
  // The mock data we want to provide
  const mockFruitData = [
    { name: 'Dragonfruit', id: 1 },
    { name: 'Lychee', id: 2 },
    { name: 'Mangosteen', id: 3 },
  ];

  // Intercept the API request and provide the mock response
  await page.route('**/api/v1/fruits', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockFruitData),
    });
  });

  // Navigate to the page
  await page.goto('https://demo.playwright.dev/api-mocking');

  // Assert that our mocked data is visible
  await expect(page.getByText('Dragonfruit')).toBeVisible();
  await expect(page.getByText('Lychee')).toBeVisible();
  await expect(page.getByText('Mangosteen')).toBeVisible();
});