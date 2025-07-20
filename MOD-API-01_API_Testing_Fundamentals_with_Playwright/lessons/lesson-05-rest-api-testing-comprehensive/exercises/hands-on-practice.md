# Lesson 05: REST API Testing Comprehensive - Hands-On Exercises

## 🎯 Exercise Overview

These hands-on exercises will solidify your understanding of comprehensive REST API testing patterns. Each exercise builds upon the previous one, creating a complete API testing framework suitable for enterprise environments.

## 🛠️ Prerequisites

### **Environment Setup**
```bash
# Install required dependencies
npm install @playwright/test @faker-js/faker dotenv
npm install --save-dev @types/node

# Create environment configuration
echo "API_BASE_URL=https://jsonplaceholder.typicode.com" > .env
echo "API_TOKEN=your-test-token-here" >> .env
```

### **Project Structure**
```
exercises/
├── tests/
│   ├── api/
│   │   ├── users.spec.ts
│   │   ├── posts.spec.ts
│   │   └── comments.spec.ts
│   └── utils/
│       ├── api-client.ts
│       ├── test-data.ts
│       └── validators.ts
├── playwright.config.ts
└── .env
```

## 🚀 Exercise 1: E-commerce API CRUD Suite

### **Objective**
Build a comprehensive test suite for an e-commerce API covering products, categories, and inventory management.

### **Scenario**
You're testing a product management system with the following endpoints:
- `GET /api/products` - List products with pagination and filtering
- `POST /api/products` - Create new product
- `GET /api/products/{id}` - Get product details
- `PUT /api/products/{id}` - Update product completely
- `PATCH /api/products/{id}` - Update product partially
- `DELETE /api/products/{id}` - Delete product

### **Implementation**

**Step 1: Create API Client Utility**

```typescript
// tests/utils/api-client.ts
import { APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async createProduct(productData?: Partial<Product>): Promise<Product> {
    const defaultProduct = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      inStock: faker.datatype.boolean(),
      quantity: faker.number.int({ min: 0, max: 100 })
    };

    const product = { ...defaultProduct, ...productData };

    const response = await this.request.post('/api/products', {
      data: product,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to create product: ${response.status()}`);
    }

    return await response.json();
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.request.get(`/api/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to get product: ${response.status()}`);
    }

    return await response.json();
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const response = await this.request.patch(`/api/products/${id}`, {
      data: updates,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to update product: ${response.status()}`);
    }

    return await response.json();
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await this.request.delete(`/api/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to delete product: ${response.status()}`);
    }
  }

  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `/api/products${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    const response = await this.request.get(url, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to get products: ${response.status()}`);
    }

    return await response.json();
  }
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  inStock: boolean;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Step 2: Create Comprehensive Test Suite**

```typescript
// tests/api/products.spec.ts
import { test, expect } from '@playwright/test';
import { ApiClient, Product } from '../utils/api-client';

test.describe('Product API - CRUD Operations', () => {
  let apiClient: ApiClient;
  let createdProducts: Product[] = [];

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test.afterEach(async () => {
    // Cleanup created products
    for (const product of createdProducts) {
      if (product.id) {
        try {
          await apiClient.deleteProduct(product.id);
        } catch (error) {
          console.warn(`Failed to cleanup product ${product.id}:`, error);
        }
      }
    }
    createdProducts = [];
  });

  test.describe('CREATE Operations', () => {
    test('should create product with valid data', async () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product for validation',
        price: 29.99,
        category: 'Electronics',
        sku: 'TEST001',
        inStock: true,
        quantity: 50
      };

      const createdProduct = await apiClient.createProduct(productData);
      createdProducts.push(createdProduct);

      expect(createdProduct).toHaveProperty('id');
      expect(createdProduct.name).toBe(productData.name);
      expect(createdProduct.price).toBe(productData.price);
      expect(createdProduct.sku).toBe(productData.sku);
      expect(createdProduct).toHaveProperty('createdAt');
      expect(createdProduct).toHaveProperty('updatedAt');
    });

    test('should validate required fields', async ({ request }) => {
      const invalidProduct = {
        description: 'Missing required fields'
      };

      const response = await request.post('/api/products', {
        data: invalidProduct,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      });

      expect(response.status()).toBe(400);
      
      const errorBody = await response.json();
      expect(errorBody).toHaveProperty('errors');
      expect(errorBody.errors).toContain('Name is required');
      expect(errorBody.errors).toContain('Price is required');
    });

    test('should prevent duplicate SKU creation', async ({ request }) => {
      const productData = {
        name: 'First Product',
        description: 'First product with unique SKU',
        price: 19.99,
        category: 'Test',
        sku: 'UNIQUE001',
        inStock: true,
        quantity: 10
      };

      // Create first product
      const firstProduct = await apiClient.createProduct(productData);
      createdProducts.push(firstProduct);

      // Attempt to create second product with same SKU
      const duplicateResponse = await request.post('/api/products', {
        data: {
          ...productData,
          name: 'Second Product'
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      });

      expect(duplicateResponse.status()).toBe(409);
      
      const errorBody = await duplicateResponse.json();
      expect(errorBody.message).toContain('SKU already exists');
    });
  });

  test.describe('READ Operations', () => {
    test('should retrieve product by ID', async () => {
      const createdProduct = await apiClient.createProduct();
      createdProducts.push(createdProduct);

      const retrievedProduct = await apiClient.getProduct(createdProduct.id!);

      expect(retrievedProduct.id).toBe(createdProduct.id);
      expect(retrievedProduct.name).toBe(createdProduct.name);
      expect(retrievedProduct.sku).toBe(createdProduct.sku);
    });

    test('should return 404 for non-existent product', async ({ request }) => {
      const response = await request.get('/api/products/non-existent-id', {
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      });

      expect(response.status()).toBe(404);
      
      const errorBody = await response.json();
      expect(errorBody.message).toContain('Product not found');
    });

    test('should retrieve paginated product list', async () => {
      // Create multiple products for pagination testing
      const products = await Promise.all([
        apiClient.createProduct({ name: 'Product 1', category: 'Electronics' }),
        apiClient.createProduct({ name: 'Product 2', category: 'Electronics' }),
        apiClient.createProduct({ name: 'Product 3', category: 'Books' })
      ]);
      createdProducts.push(...products);

      const response = await apiClient.getProducts({
        page: 1,
        limit: 2
      });

      expect(response.data).toHaveLength(2);
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.limit).toBe(2);
      expect(response.pagination.total).toBeGreaterThanOrEqual(3);
    });

    test('should filter products by category', async () => {
      const electronicsProduct = await apiClient.createProduct({ 
        name: 'Laptop', 
        category: 'Electronics' 
      });
      const bookProduct = await apiClient.createProduct({ 
        name: 'Novel', 
        category: 'Books' 
      });
      createdProducts.push(electronicsProduct, bookProduct);

      const response = await apiClient.getProducts({
        category: 'Electronics'
      });

      expect(response.data.length).toBeGreaterThanOrEqual(1);
      response.data.forEach(product => {
        expect(product.category).toBe('Electronics');
      });
    });

    test('should sort products by price', async () => {
      const products = await Promise.all([
        apiClient.createProduct({ name: 'Expensive Item', price: 100 }),
        apiClient.createProduct({ name: 'Cheap Item', price: 10 }),
        apiClient.createProduct({ name: 'Medium Item', price: 50 })
      ]);
      createdProducts.push(...products);

      const response = await apiClient.getProducts({
        sortBy: 'price',
        sortOrder: 'asc'
      });

      // Verify ascending price order
      for (let i = 1; i < response.data.length; i++) {
        expect(response.data[i].price).toBeGreaterThanOrEqual(response.data[i-1].price);
      }
    });
  });

  test.describe('UPDATE Operations', () => {
    test('should update product with PATCH', async () => {
      const createdProduct = await apiClient.createProduct({
        name: 'Original Name',
        price: 25.00
      });
      createdProducts.push(createdProduct);

      const updates = {
        name: 'Updated Name',
        price: 35.00
      };

      const updatedProduct = await apiClient.updateProduct(createdProduct.id!, updates);

      expect(updatedProduct.name).toBe(updates.name);
      expect(updatedProduct.price).toBe(updates.price);
      expect(updatedProduct.updatedAt).not.toBe(createdProduct.updatedAt);
      
      // Other fields should remain unchanged
      expect(updatedProduct.category).toBe(createdProduct.category);
      expect(updatedProduct.sku).toBe(createdProduct.sku);
    });

    test('should handle partial updates correctly', async () => {
      const createdProduct = await apiClient.createProduct({
        name: 'Test Product',
        price: 20.00,
        quantity: 100
      });
      createdProducts.push(createdProduct);

      // Update only quantity
      const updatedProduct = await apiClient.updateProduct(createdProduct.id!, {
        quantity: 75
      });

      expect(updatedProduct.quantity).toBe(75);
      expect(updatedProduct.name).toBe(createdProduct.name);
      expect(updatedProduct.price).toBe(createdProduct.price);
    });

    test('should validate update data', async ({ request }) => {
      const createdProduct = await apiClient.createProduct();
      createdProducts.push(createdProduct);

      const invalidUpdate = {
        price: -10 // Invalid negative price
      };

      const response = await request.patch(`/api/products/${createdProduct.id}`, {
        data: invalidUpdate,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      });

      expect(response.status()).toBe(400);
      
      const errorBody = await response.json();
      expect(errorBody.errors).toContain('Price must be positive');
    });
  });

  test.describe('DELETE Operations', () => {
    test('should delete product successfully', async () => {
      const createdProduct = await apiClient.createProduct();
      
      await apiClient.deleteProduct(createdProduct.id!);

      // Verify product is deleted
      const { request } = await test.info().project.use;
      const getResponse = await request.get(`/api/products/${createdProduct.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      });

      expect(getResponse.status()).toBe(404);
    });

    test('should handle deletion of non-existent product', async ({ request }) => {
      const response = await request.delete('/api/products/non-existent-id', {
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      });

      expect(response.status()).toBe(404);
    });

    test('should prevent deletion of product with active orders', async ({ request }) => {
      // This test assumes there's a product with ID 'protected-product' that has orders
      const response = await request.delete('/api/products/protected-product', {
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      });

      expect(response.status()).toBe(409);
      
      const errorBody = await response.json();
      expect(errorBody.message).toContain('Cannot delete product with active orders');
    });
  });
});
```

### **Step 3: Advanced Validation and Edge Cases**

```typescript
// tests/api/products-advanced.spec.ts
import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/api-client';

test.describe('Product API - Advanced Scenarios', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test.describe('Bulk Operations', () => {
    test('should handle bulk product creation', async ({ request }) => {
      const products = Array.from({ length: 5 }, (_, i) => ({
        name: `Bulk Product ${i + 1}`,
        description: `Description for product ${i + 1}`,
        price: (i + 1) * 10,
        category: 'Bulk Test',
        sku: `BULK00${i + 1}`,
        inStock: true,
        quantity: 50
      }));

      const response = await request.post('/api/products/bulk', {
        data: { products },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      });

      expect(response.status()).toBe(201);
      
      const result = await response.json();
      expect(result.created).toHaveLength(5);
      expect(result.failed).toHaveLength(0);
      
      // Cleanup
      for (const product of result.created) {
        await apiClient.deleteProduct(product.id);
      }
    });

    test('should handle partial bulk creation failures', async ({ request }) => {
      const products = [
        {
          name: 'Valid Product',
          description: 'Valid description',
          price: 25.00,
          category: 'Test',
          sku: 'VALID001',
          inStock: true,
          quantity: 10
        },
        {
          name: '', // Invalid - empty name
          description: 'Invalid product',
          price: 30.00,
          category: 'Test',
          sku: 'INVALID001',
          inStock: true,
          quantity: 10
        }
      ];

      const response = await request.post('/api/products/bulk', {
        data: { products },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
      });

      expect(response.status()).toBe(207); // Multi-status
      
      const result = await response.json();
      expect(result.created).toHaveLength(1);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0].errors).toContain('Name is required');
      
      // Cleanup successful creation
      if (result.created.length > 0) {
        await apiClient.deleteProduct(result.created[0].id);
      }
    });
  });

  test.describe('Concurrent Operations', () => {
    test('should handle concurrent product updates', async () => {
      const createdProduct = await apiClient.createProduct({
        name: 'Concurrent Test Product',
        quantity: 100
      });

      // Simulate concurrent updates
      const updates = [
        apiClient.updateProduct(createdProduct.id!, { quantity: 90 }),
        apiClient.updateProduct(createdProduct.id!, { quantity: 85 }),
        apiClient.updateProduct(createdProduct.id!, { quantity: 80 })
      ];

      const results = await Promise.allSettled(updates);
      
      // At least one update should succeed
      const successfulUpdates = results.filter(result => result.status === 'fulfilled');
      expect(successfulUpdates.length).toBeGreaterThan(0);
      
      // Verify final state
      const finalProduct = await apiClient.getProduct(createdProduct.id!);
      expect([80, 85, 90]).toContain(finalProduct.quantity);
      
      // Cleanup
      await apiClient.deleteProduct(createdProduct.id!);
    });
  });

  test.describe('Performance and Load Testing', () => {
    test('should handle multiple concurrent requests', async () => {
      const startTime = Date.now();
      
      // Create 10 concurrent requests
      const requests = Array.from({ length: 10 }, () => 
        apiClient.getProducts({ limit: 5 })
      );

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.data).toBeDefined();
        expect(Array.isArray(response.data)).toBe(true);
      });
      
      // Performance assertion (adjust based on your requirements)
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds
      
      console.log(`10 concurrent requests completed in ${totalTime}ms`);
    });
  });
});
```

## 🎯 Exercise Completion Checklist

### **Technical Implementation**
- [ ] API client utility with proper error handling
- [ ] Complete CRUD operations testing
- [ ] Validation and error scenario testing
- [ ] Bulk operations and edge cases
- [ ] Performance and concurrency testing

### **Code Quality**
- [ ] TypeScript interfaces and types
- [ ] Proper test organization and structure
- [ ] Comprehensive error handling
- [ ] Clean-up and resource management
- [ ] Clear and descriptive test names

### **Advanced Features**
- [ ] Pagination testing
- [ ] Filtering and sorting validation
- [ ] Concurrent operation handling
- [ ] Performance benchmarking
- [ ] Bulk operation testing

## 📊 Success Criteria

### **Completion Targets**
- **Test Coverage**: 95%+ of API endpoints tested
- **Error Scenarios**: 10+ different error conditions covered
- **Performance**: All tests complete within acceptable time limits
- **Reliability**: Tests pass consistently across multiple runs

### **Learning Validation**
- **CRUD Mastery**: Successfully implement all HTTP methods
- **Error Handling**: Proper validation and error response testing
- **Advanced Patterns**: Bulk operations and concurrent testing
- **Code Quality**: Clean, maintainable, and well-documented code

---

> 🎯 **Success Tip**: Focus on building reusable utilities and comprehensive test coverage. The patterns you develop here will serve as the foundation for all your future API testing projects.

> 💼 **Portfolio Value**: This exercise demonstrates professional-level API testing skills that are highly valued in the industry. Document your implementation for your portfolio!