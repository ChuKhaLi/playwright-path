import { test, expect } from '../helpers/auth-helper';
import { productSchema, productsSchema } from '../schemas/product-schema';

test.describe('Product API', () => {
  test('should get a single product and validate its schema', async ({ request }) => {
    const response = await request.get('/products/1');
    expect(response.ok()).toBe(true);
    const product = await response.json();
    
    // Validate schema
    productSchema.parse(product);
    
    expect(product.id).toBe(1);
  });

  test('should get all products and validate the schema of the list', async ({ request }) => {
    const response = await request.get('/products');
    expect(response.ok()).toBe(true);
    const productsData = await response.json();
    
    // The API returns an object with a 'products' array
    productsSchema.parse(productsData.products);
    
    expect(productsData.total).toBeGreaterThan(0);
  });

  test('should create a new product', async ({ authenticatedApi }) => {
    const newProduct = {
      title: 'Roo\'s Awesome Gadget',
      description: 'The best gadget you have ever seen.',
      price: 199.99,
    };

    const response = await authenticatedApi.post('/products/add', {
      data: newProduct,
    });

    expect(response.ok()).toBe(true);
    const createdProduct = await response.json();
    
    // The API returns the created object with a new ID
    expect(createdProduct.id).toBeDefined();
    expect(createdProduct.title).toBe(newProduct.title);
  });

  test('should update a product', async ({ authenticatedApi }) => {
    const updatedData = {
      title: 'Roo\'s Even Better Gadget',
      price: 249.99,
    };

    const response = await authenticatedApi.put('/products/1', {
      data: updatedData,
    });

    expect(response.ok()).toBe(true);
    const updatedProduct = await response.json();
    
    expect(updatedProduct.id).toBe(1);
    expect(updatedProduct.title).toBe(updatedData.title);
    expect(updatedProduct.price).toBe(updatedData.price);
  });
});