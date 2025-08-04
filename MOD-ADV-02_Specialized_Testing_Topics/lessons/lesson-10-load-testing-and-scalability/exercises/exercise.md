# Exercise: From E2E to Load Test Script

## Objective

To practice identifying the underlying API calls from a browser-based user journey, which is the first step in creating a protocol-level load test script.

## Scenario

Imagine you are testing an e-commerce website. You have the following Playwright test that simulates a user searching for a product and adding it to their cart.

```typescript
// This is our starting Playwright script
import { test, expect } from '@playwright/test';

test('should allow a user to search and add to cart', async ({ page }) => {
  // 1. Go to the homepage
  await page.goto('https://ecommerce-example.com');

  // 2. Search for a product
  await page.fill('input[name="search"]', 'Super Widget');
  await page.click('button[type="submit"]');
  
  // The search results page makes this API call:
  // GET /api/products?q=Super+Widget

  // 3. Click on the first product
  await page.locator('.product-link').first().click();

  // The product page makes this API call:
  // GET /api/products/SW123

  // 4. Add the product to the cart
  await page.click('button#add-to-cart');

  // The add to cart button makes this API call:
  // POST /api/cart
  // Body: { productId: 'SW123', quantity: 1 }
});
```

## Your Task

Based on the Playwright script and the comments describing the API calls, write a conceptual k6 script that replicates this user journey at the API level.

You do not need to run this script. The goal is to practice translating the user actions into a sequence of HTTP requests.

### Instructions

1.  Create a new file named `my-k6-script.js`.
2.  Import the `http` and `sleep` modules from `k6`.
3.  Write a `default function` that contains the logic.
4.  Inside the function, write the sequence of `http.get()` and `http.post()` requests that correspond to the user journey.
5.  Use `sleep()` between requests to simulate a user's "think time."

---

## Solution (for your reference)

```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  // 1. Search for a product
  // Note: We don't need to visit the homepage, we can go straight to the API call
  const searchRes = http.get('https://ecommerce-example.com/api/products?q=Super+Widget');
  sleep(1);

  // In a real script, you would parse the response to get the product ID
  const productId = 'SW123'; 

  // 2. View the product details
  const productRes = http.get(`https://ecommerce-example.com/api/products/${productId}`);
  sleep(2);

  // 3. Add the product to the cart
  const addToCartRes = http.post(
    'https://ecommerce-example.com/api/cart',
    JSON.stringify({ productId: productId, quantity: 1 }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  sleep(1);
}