# Lesson 11: Assessment

## Knowledge Check

1.  **Question:** In a microservices testing strategy, which type of test is run most frequently and forms the largest part of the testing pyramid?
    *   a) End-to-End Tests
    *   b) Integration Tests
    *   c) Unit Tests
    *   d) Manual Tests

2.  **Question:** What is the primary goal of a "component test" in a microservices context?
    *   a) To test the entire user journey across all services.
    *   b) To test a single service in isolation, with all its external dependencies (like other services and databases) mocked.
    *   c) To test the integration and communication between two specific services.
    *   d) To test the frontend UI.

3.  **Question:** Why are end-to-end tests used sparingly in a robust microservices testing strategy?
    *   a) Because they are too fast to provide useful information.
    *   b) Because they can't test user interfaces.
    *   c) Because they are slow, expensive to run, and can be brittle (flaky).
    *   d) Because they don't require a deployed environment.

## Practical Exercise

### Objective

Design a component test for a single microservice, mocking its dependency.

### Scenario

You are testing an `Order Service`. When you call `POST /orders`, the `Order Service` needs to call a `Product Service` at `GET /products/{id}` to check the product's price before creating the order.

Your task is to write a component test for the `Order Service`. You will mock the `Product Service` dependency.

### Requirements

1.  Create a new test file `component.spec.ts`.
2.  Write a test named "should create an order using the price from the mocked Product Service".
3.  Use `page.route()` to mock the `Product Service` endpoint (`GET /products/prod-456`).
    *   When this endpoint is called, it should return a `200 OK` response with the body `{ "id": "prod-456", "name": "Super Widget", "price": 99.99 }`.
4.  Make a `POST` request to the (real) `Order Service` at `/orders` with a payload like `{ "productId": "prod-456", "quantity": 2 }`.
5.  The `Order Service` will internally call the mocked product endpoint. Assume the `Order Service` calculates the total price (`price * quantity`) and includes it in its response.
6.  Assert that the response from the `Order Service` is `201 Created`.
7.  Assert that the response body from the `Order Service` contains the correct total price, which should be `199.98` (99.99 * 2).

### Solution

```typescript
// tests/api/component.spec.ts
import { test, expect } from '@playwright/test';

const PRODUCT_ID = 'prod-456';
const MOCKED_PRICE = 99.99;
const QUANTITY = 2;
const EXPECTED_TOTAL = MOCKED_PRICE * QUANTITY;

test.describe('Order Service Component Test', () => {
  test('should create an order using the price from the mocked Product Service', async ({ page }) => {
    // 1. Mock the dependency (Product Service)
    await page.route(`**/products/${PRODUCT_ID}`, async (route) => {
      console.log(`Mocking request to: ${route.request().url()}`);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          id: PRODUCT_ID, 
          name: 'Super Widget', 
          price: MOCKED_PRICE 
        }),
      });
    });

    // 2. Make a request to the service under test (Order Service)
    // We use page.request so it uses the same context as page.route
    const response = await page.request.post('/orders', {
      data: {
        productId: PRODUCT_ID,
        quantity: QUANTITY,
      },
    });

    // 3. Assert the response from the Order Service
    expect(response.status()).toBe(201);
    const order = await response.json();

    // The Order Service should have used the mocked price to calculate the total
    expect(order.totalPrice).toBe(EXPECTED_TOTAL);
    expect(order.productId).toBe(PRODUCT_ID);
  });
});