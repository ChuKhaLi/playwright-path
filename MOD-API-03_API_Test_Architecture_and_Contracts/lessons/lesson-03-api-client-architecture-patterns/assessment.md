# Lesson 3: Assessment

## Knowledge Check

1.  **Question:** What is the primary benefit of using the **Repository Pattern** in an API testing framework?
    -   a) It makes the HTTP requests run faster.
    -   b) It bundles all API clients into a single class.
    -   c) It decouples test logic from the specifics of the API client, allowing tests to be more readable and easier to mock.
    -   d) It automatically generates test data.

2.  **Question:** You need to create test data for a `Product` object. The object has many properties, but for most tests, you only care about overriding the `price` and `category`. Which design pattern is most suitable for this task?
    -   a) The Builder Pattern.
    -   b) The Singleton Pattern.
    -   c) The **Factory Pattern**, to generate product objects with default values that can be easily overridden.
    -   d) The Strategy Pattern.

3.  **Question:** You are writing a test that requires searching for users with a complex combination of optional criteria (e.g., role, status, creation date). Which pattern would provide the most readable and fluent way to construct the search query parameters?
    -   a) The **Builder Pattern**.
    -   b) The Repository Pattern.
    -   c) The Factory Pattern.
    -   d) The Abstract Client Pattern.

4.  **Question:** In a layered architecture, which layer is responsible for abstracting the data source and providing a collection-like interface for domain objects?
    -   a) The Test Layer.
    -   b) The API Client Layer.
    -   c) The **Repository Layer**.
    -   d) The Framework Core Layer.

## Practical Exercise

### Objective

Refactor an existing API test to use the Repository, Factory, and Builder patterns. This will demonstrate how these patterns work together to create a clean, scalable, and maintainable test architecture.

### Scenario

You are working on the test suite for an e-commerce application. You have an existing `ProductsApiClient`. Your task is to introduce a `ProductRepository`, a `ProductFactory` for creating test data, and a `ProductSearchBuilder` for constructing search queries.

### Provided Code (Conceptual)

Assume you have the following `ProductsApiClient`:

```typescript
// src/api/clients/ProductsApiClient.ts
export class ProductsApiClient extends BaseApiClient {
  async getProductById(id: string): Promise<Product> { /* ... */ }
  async createProduct(data: CreateProductRequest): Promise<Product> { /* ... */ }
  async searchProducts(params: any): Promise<PaginatedResponse<Product>> { /* ... */ }
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
}
```

And a test that looks like this:

```typescript
// tests/products.spec.ts (Before refactoring)
test('should find a newly created expensive product', async ({ productsApiClient }) => {
  // Manually create test data
  const productData = {
    name: 'Laptop Pro',
    price: 2500,
    category: 'Electronics'
  };
  const newProduct = await productsApiClient.createProduct(productData);

  // Manually create search params
  const searchParams = {
    category: 'Electronics',
    minPrice: 2000
  };
  const searchResult = await productsApiClient.searchProducts(searchParams);

  const found = searchResult.items.find(p => p.id === newProduct.id);
  expect(found).toBeDefined();
});
```

### Your Task

1.  **Create a `ProductFactory`:**
    -   Location: `src/test-data/factories/ProductFactory.ts`
    -   It should have a `create(overrides: Partial<CreateProductRequest>)` method.
    -   Use a library like `faker-js` to generate default values for `name`, `price`, and `category`.

2.  **Create a `ProductSearchBuilder`:**
    -   Location: `src/api/builders/ProductSearchBuilder.ts`
    -   It should have methods like `inCategory(category: string)`, `priceAbove(min: number)`, `priceBelow(max: number)`, and `inStock(status: boolean)`.
    -   It must have a `build()` method that returns the final parameters object.

3.  **Create a `ProductRepository`:**
    -   Location: `src/api/repositories/ProductRepository.ts`
    -   It should implement an `IProductRepository` interface.
    -   The repository will take the `ProductsApiClient` in its constructor.
    -   It should have methods like `add(data: CreateProductRequest)`, `findById(id: string)`, and `search(params: any)`. These methods will call the corresponding methods on the `ProductsApiClient`.

4.  **Refactor the Test:**
    -   Rewrite the original test in `tests/products.spec.ts`.
    -   Use the `ProductFactory` to create the `productData`.
    -   Use the `ProductSearchBuilder` to construct the `searchParams`.
    -   Use the `ProductRepository` to perform the `add` and `search` operations.

### Expected Outcome

Your refactored test should be much more readable and expressive. It should clearly separate the concerns of test data creation, query construction, and interaction with the API.

**Refactored Test (Example Structure):**

```typescript
// tests/products.spec.ts (After refactoring)
test('should find a newly created expensive product', async ({ productRepository }) => {
  // Arrange
  const productData = ProductFactory.create({ price: 2500 });
  const newProduct = await productRepository.add(productData);

  const searchParams = new ProductSearchBuilder()
    .inCategory(productData.category)
    .priceAbove(2000)
    .build();

  // Act
  const searchResult = await productRepository.search(searchParams);

  // Assert
  const found = searchResult.items.find(p => p.id === newProduct.id);
  expect(found).toBeDefined();
});