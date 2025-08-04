# Lesson 13: Assessment

## Knowledge Check

1.  **Question:** What is the key difference between a component test and an integration test for an API?
    *   a) Component tests use Playwright, while integration tests do not.
    *   b) Component tests mock all external dependencies, while integration tests connect to one or more real, live dependencies.
    *   c) Integration tests are faster than component tests.
    *   d) Component tests check the database, while integration tests do not.

2.  **Question:** When writing a database integration test for an API endpoint that creates a resource, what is the most crucial assertion?
    *   a) Asserting that the API returned a `201 Created` status.
    *   b) Asserting that the API response body contains the new resource's ID.
    *   c) Asserting that the correct data was actually written to the database by querying the database directly.
    *   d) Asserting that the database server is online.

3.  **Question:** What is the recommended strategy for testing your service's integration with a third-party API like Stripe in a CI/CD environment?
    *   a) Make test calls to Stripe's live production API.
    *   b) Mock the Stripe API completely so no network calls are made.
    *   c) Use the sandbox/test environment provided by the third party (Stripe).
    *   d) Avoid testing third-party integrations.

## Practical Exercise

### Objective

Write a database integration test to verify that deleting a resource via an API call correctly removes it from the database.

### Scenario

You are testing a `DELETE /api/products/{id}` endpoint. This endpoint should delete the specified product from the `products` table in the database.

### Requirements

1.  Create a new test file `db-delete.spec.ts`.
2.  Use a `beforeEach` hook to seed the database with a test product. Store the ID of this new product.
3.  Use an `afterEach` hook to ensure the test product is deleted if the test fails for some reason.
4.  Write a test named "should delete a product from the database".
5.  In the test, make a `DELETE` request to `/api/products/{id}` using the ID of the product you created.
6.  Assert that the API response is `204 No Content`.
7.  **Connect to the database** and query the `products` table for the ID of the deleted product.
8.  Assert that the query returns **zero rows**, confirming the product was successfully deleted.

### Solution

```typescript
// tests/api/db-delete.spec.ts
import { test, expect } from '@playwright/test';
import { dbClient } from '../utils/database-client'; // A helper to connect to your DB

test.describe('Product API Database Integration', () => {
  let testProductId: string;

  // Seed the database with a product before each test
  test.beforeEach(async () => {
    const result = await dbClient.query(
      "INSERT INTO products (name, price) VALUES ('Test Product', 19.99) RETURNING id"
    );
    testProductId = result.rows[0].id;
  });

  // Clean up the product after each test to ensure isolation
  test.afterEach(async () => {
    if (testProductId) {
      await dbClient.query('DELETE FROM products WHERE id = $1', [testProductId]);
    }
  });

  test('DELETE /api/products/{id} should remove the record from the database', async ({ request }) => {
    // Act: Make the API call to delete the product
    const response = await request.delete(`/api/products/${testProductId}`);
    
    // Assert: Check the API response
    expect(response.status()).toBe(204);

    // Assert: Query the database directly to confirm deletion
    const result = await dbClient.query('SELECT * FROM products WHERE id = $1', [testProductId]);
    
    // The most important check: the record should be gone.
    expect(result.rowCount).toBe(0);
  });
});