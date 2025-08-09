import { test, expect } from '@playwright/test';

test('should display mocked product data', async ({ page }) => {
  const mockProducts = [
    { id: 1, title: 'Mock Product A', description: 'First mock item' },
    { id: 2, title: 'Mock Product B', description: 'Second mock item' },
  ];

  // Mock the API endpoint
  await page.route('**/products', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ products: mockProducts, total: 2, skip: 0, limit: 2 }),
    });
  });

  // Create a simple HTML page to display the products
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Product List</title>
    </head>
    <body>
      <h1>Products</h1>
      <ul id="product-list"></ul>
      <script>
        fetch('https://dummyjson.com/products')
          .then(res => res.json())
          .then(data => {
            const list = document.getElementById('product-list');
            data.products.forEach(product => {
              const item = document.createElement('li');
              item.textContent = product.title;
              list.appendChild(item);
            });
          });
      </script>
    </body>
    </html>
  `);

  // Assert that the mocked product titles are visible
  await expect(page.getByText('Mock Product A')).toBeVisible();
  await expect(page.getByText('Mock Product B')).toBeVisible();
});