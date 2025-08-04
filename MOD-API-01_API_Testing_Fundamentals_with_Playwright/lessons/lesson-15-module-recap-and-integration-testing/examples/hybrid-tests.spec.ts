/**
 * @fileoverview This file contains examples of hybrid tests that use both
 * the `page` and `request` fixtures.
 */

import { test, expect } from '@playwright/test';

// For these examples, we'll use a public site that has both a UI and an API.
// We'll use https://www.automationexercise.com/
// Note: This site can be slow, so tests might need higher timeouts in a real project.

/**
 * Example 1: API for Setup, UI for Verification
 *
 * We will use the API to search for products and then verify that the
 * search results page in the UI displays the correct items.
 */
test.describe('API for Setup, UI for Verification', () => {
  test('should display search results from an API call', async ({ page, request }) => {
    // 1. Arrange (API): Search for a product using the API.
    // The website uses a POST request for searching.
    const response = await request.post('https://automationexercise.com/api/searchProduct', {
      form: {
        search_product: 'tshirt',
      },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const firstProduct = responseBody.products[0];

    // 2. Act (UI): Navigate to the search results page in the browser.
    // We construct the URL the user would land on after a UI search.
    await page.goto(`https://automationexercise.com/products?search=tshirt`);

    // 3. Assert (UI): Verify that the product found via the API is visible on the page.
    const productLocator = page.locator(`.single-products:has-text("${firstProduct.name}")`);
    await expect(productLocator).toBeVisible();
    await expect(productLocator.getByText(`Rs. ${firstProduct.price}`)).toBeVisible();
  });
});

/**
 * Example 2: UI for Action, API for Verification
 *
 * We will use the UI to sign up for a newsletter and then use an API
 * (a hypothetical one) to verify that the subscription was recorded in the backend.
 */
test.describe('UI for Action, API for Verification', () => {
  test('should subscribe a user to the newsletter and verify via API', async ({ page, request }) => {
    const testEmail = `test-${Date.now()}@example.com`;

    // 1. Act (UI): Perform the action in the browser.
    await page.goto('https://automationexercise.com/');
    await page.locator('#susbscribe_email').fill(testEmail);
    await page.locator('#subscribe').click();

    // 2. Assert (UI): Check for the success message on the page.
    await expect(page.locator('.alert-success')).toHaveText('You have been successfully subscribed!');

    // 3. Assert (API): Verify the result in the backend.
    // This is a conceptual example, as the site does not provide a public API for this.
    /*
    const subscriptionsResponse = await request.get('/api/newsletter/subscriptions', {
      headers: { 'Authorization': 'Bearer <admin_token>' }
    });
    const subscriptions = await subscriptionsResponse.json();
    const ourSubscription = subscriptions.find(sub => sub.email === testEmail);
    expect(ourSubscription).toBeDefined();
    expect(ourSubscription.status).toBe('subscribed');
    */
  });
});