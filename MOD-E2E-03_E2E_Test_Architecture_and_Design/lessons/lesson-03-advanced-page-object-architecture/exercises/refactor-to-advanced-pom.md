# Exercise: Refactor to an Advanced POM

## Objective

To refactor a basic test into a more robust, maintainable, and scalable structure using the advanced Page Object patterns learned in this lesson.

## Scenario

You have a simple test script that performs a checkout flow. The script is functional but lacks good structure, making it hard to maintain.

**Initial (bad) test script:**
```typescript
import { test, expect } from '@playwright/test';

test('should complete checkout', async ({ page }) => {
  // Login
  await page.goto('/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Add to cart
  await page.locator('.inventory_item', { hasText: 'Sauce Labs Fleece Jacket' }).locator('button').click();

  // Go to cart
  await page.locator('a.shopping_cart_link').click();

  // Checkout
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('Test');
  await page.locator('[data-test="lastName"]').fill('User');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  // Finish
  await page.locator('[data-test="finish"]').click();

  // Assert
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});
```

## Your Task

Refactor the test script above by implementing the following advanced POM patterns:

1.  **BasePage:** Create a `BasePage.ts` that includes the `HeaderComponent`.
2.  **Component-Based POM:** Use the `HeaderComponent` in your page objects.
3.  **Page Objects:** Create the following page objects, all extending `BasePage`:
    -   `LoginPage.ts`
    -   `InventoryPage.ts`
    -   `CartPage.ts`
    -   `CheckoutPage.ts`
    -   `CheckoutCompletePage.ts`
4.  **Fluent Interfaces:** Your page object methods should return the next logical page object.
    -   `login()` should return an `InventoryPage`.
    -   `goToCart()` should return a `CartPage`.
    -   `checkout()` should return a `CheckoutPage`.
    -   `fillShippingInfo()` should return a `CheckoutCompletePage`.
    -   `finishCheckout()` should return a `CheckoutCompletePage`.
5.  **Separation of Concerns:** Keep assertions in the test file. Page object methods should only perform actions.

## Submission

Submit a pull request with the following new/modified files:
-   `pages/BasePage.ts`
-   `components/HeaderComponent.ts`
-   `pages/LoginPage.ts`
-   `pages/InventoryPage.ts`
-   `pages/CartPage.ts`
-   `pages/CheckoutPage.ts`
-   `pages/CheckoutCompletePage.ts`
-   `tests/e2e/refactored-checkout.spec.ts` (the new, clean test file)

Your final test should be much more readable and look something like this:

```typescript
test('should complete checkout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate('/');

  const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCart('Sauce Labs Fleece Jacket');

  const cartPage = await inventoryPage.header.goToCart();
  const checkoutPage = await cartPage.checkout();

  const checkoutCompletePage = await checkoutPage.fillShippingInfo({
    firstName: 'Test',
    lastName: 'User',
    postalCode: '12345',
  });

  await checkoutCompletePage.finishCheckout();
  await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
});