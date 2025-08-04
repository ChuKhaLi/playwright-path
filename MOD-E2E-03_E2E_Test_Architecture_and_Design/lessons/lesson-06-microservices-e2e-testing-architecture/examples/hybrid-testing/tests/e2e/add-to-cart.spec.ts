import { test, expect } from '../../fixtures/product.fixture';
import { ProductPage } from '../../pages/ProductPage';

test.describe('Add to Cart - E2E Journey', () => {
  // This test uses the 'product' fixture, which creates a product via API
  // before the test runs. This isolates the test from the product creation process.
  test('should be able to add a product to the cart from the product page', async ({ page, product }) => {
    // The 'product' object is the product that was created in our fixture.
    const productPage = new ProductPage(page);
    
    // 1. Navigate directly to the product's page.
    // We don't need to test searching or browsing for the product in this test.
    await productPage.navigate(product.id);

    // 2. Perform the UI action we are interested in: adding to cart.
    await productPage.addToCart();

    // 3. Assert that the UI has updated correctly.
    await expect(productPage.header.cartCount).toHaveText('1');

    // 4. (Optional but recommended) Verify the state via API.
    // This confirms the backend state matches the frontend state.
    const cartResponse = await page.request.get('/api/cart');
    const cartData = await cartResponse.json();
    
    expect(cartData.items).toHaveLength(1);
    expect(cartData.items[0].productId).toBe(product.id);
  });
});