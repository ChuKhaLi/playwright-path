# Lesson 14: Assessment

## Knowledge Check

1.  **Question:** In a microservices architecture, what is the primary function of an API Gateway?
    *   a) To store user data.
    *   b) To act as a single entry point for all client requests, handling concerns like routing, authentication, and rate limiting.
    *   c) To run business logic for all services.
    *   d) To replace the need for individual microservices.

2.  **Question:** What is the purpose of testing a "circuit breaker" pattern?
    *   a) To ensure a service can handle a massive, sudden spike in traffic.
    *   b) To verify that a service stops sending requests to a dependency that it knows is failing, thus preventing cascading failures.
    *   c) To check that a service can retry a failed request automatically.
    *   d) To test the main electrical circuits in the data center.

3.  **Question:** What is a "saga" in the context of event-driven microservices?
    *   a) A very long and detailed log file.
    *   b) A way to manage a distributed transaction across multiple services using a sequence of local transactions and compensating actions.
    *   c) A type of API contract.
    *   d) A performance testing pattern.

## Practical Exercise

### Objective

Design a test for an API Gateway's routing logic.

### Scenario

You have an API Gateway that should route requests based on the URL path:
-   Requests to `/api/users/{...}` should be routed to the `User Service`.
-   Requests to `/api/products/{...}` should be routed to the `Product Service`.

Your task is to write a test that verifies a request to the gateway is correctly routed to the `Product Service`.

### Requirements

1.  Create a new test file `gateway.spec.ts`.
2.  Write a test named "should route product requests to the Product Service".
3.  In the test, you need to mock the downstream services. Use `page.route()` for this.
    *   Mock the `User Service` (`/internal/users/123`) to return a specific response, e.g., `{ "source": "user-service" }`.
    *   Mock the `Product Service` (`/internal/products/abc`) to return a different response, e.g., `{ "source": "product-service" }`.
4.  Make a `GET` request to the **public API Gateway** at `/api/products/abc`.
5.  Assert that the response body you receive is the one from the `Product Service` mock (`{ "source": "product-service" }`), confirming the gateway routed the request correctly.
6.  (Optional) You can also add an assertion to ensure the `User Service` mock was *not* called.

### Solution

```typescript
// tests/api/gateway.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Gateway Routing', () => {
  test('should route product requests to the Product Service', async ({ page }) => {
    let userServiceCalled = false;
    let productServiceCalled = false;

    // Mock the User Service (downstream)
    await page.route('**/internal/users/**', async (route) => {
      userServiceCalled = true;
      await route.fulfill({ status: 200, json: { source: 'user-service' } });
    });

    // Mock the Product Service (downstream)
    await page.route('**/internal/products/abc', async (route) => {
      productServiceCalled = true;
      await route.fulfill({ status: 200, json: { source: 'product-service' } });
    });

    // Act: Make a request to the public-facing API Gateway
    const response = await page.request.get('/api/products/abc');
    
    // Assert the response came from the correct downstream service
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.source).toBe('product-service');

    // Assert that the correct mock was called
    expect(productServiceCalled).toBe(true);
    // And that the incorrect mock was NOT called
    expect(userServiceCalled).toBe(false);
  });
});