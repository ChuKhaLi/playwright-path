import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Shopping Flow', () => {
  test('should allow a user to log in, add an item to the cart, and see it in the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate('/');

    // 1. Login using the fluent interface. This returns the InventoryPage.
    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
    await expect(inventoryPage.inventoryList).toBeVisible();

    // 2. On the InventoryPage, add a product to the cart.
    const productName = 'Sauce Labs Backpack';
    await inventoryPage.addProductToCart(productName);

    // 3. Use the header component (available via BasePage) to check the cart count.
    const cartCount = await inventoryPage.header.getCartCount();
    expect(cartCount).toBe(1);

    // 4. Navigate to the cart using the header component's fluent method.
    const cartPage = await inventoryPage.header.goToCart();

    // 5. On the CartPage, verify the correct item is present.
    const cartItem = await cartPage.getCartItem(productName);
    await expect(cartItem).toBeVisible();
    await expect(cartItem).toContainText(productName);
  });
});