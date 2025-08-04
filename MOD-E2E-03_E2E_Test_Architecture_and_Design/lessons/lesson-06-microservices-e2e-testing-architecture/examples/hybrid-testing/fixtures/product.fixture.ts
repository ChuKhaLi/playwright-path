import { test as base } from '@playwright/test';
import { ProductsAPIService, Product } from '../services/ProductsAPIService';

type ProductFixtures = {
  productService: ProductsAPIService;
  product: Product;
};

export const test = base.extend<ProductFixtures>({
  productService: async ({ request }, use) => {
    await use(new ProductsAPIService(request));
  },

  // This fixture creates a product via API before the test
  // and automatically cleans it up afterward.
  product: async ({ productService }, use) => {
    let createdProduct: Product | null = null;

    try {
      // SETUP: Create a product before the test runs.
      createdProduct = await productService.createProduct({
        name: 'Fixture Product',
        description: 'A product created by a test fixture',
        price: 99.99,
      });
      
      // Provide the created product to the test.
      await use(createdProduct);
    } finally {
      // TEARDOWN: Delete the product after the test has finished.
      if (createdProduct) {
        await productService.deleteProduct(createdProduct.id);
      }
    }
  },
});

export { expect } from '@playwright/test';