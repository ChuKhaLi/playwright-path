# Lesson 8: Microservices Testing Strategies

## 1. The Testing Pyramid in a Microservices World

The traditional testing pyramid (lots of unit tests, fewer integration tests, and even fewer E2E tests) is still relevant for microservices, but with a twist. Each service should have its own pyramid.

-   **Unit Tests:** Test individual functions and components within a single service. These are fast and isolated.
-   **Integration Tests:** Test the interactions between components within a single service (e.g., does the service layer correctly call the database layer?).
-   **Contract Tests:** A crucial addition for microservices. These tests verify that two separate services can communicate with each other. One service (the "consumer") defines a contract for the data it expects from another service (the "provider"). The provider then runs tests to ensure it honors that contract. Tools like Pact are popular for this.
-   **End-to-End (E2E) Tests:** These tests simulate a full user journey through the UI, which may involve interactions with multiple microservices. This is where Playwright shines.

## 2. The Role of Playwright in Microservices Testing

Playwright is primarily used for E2E testing. In a microservices architecture, a single user action on the frontend can trigger a chain of requests across several backend services.

For example, clicking "Add to Cart" might:
1.  Call the **Cart Service** to add the item.
2.  The **Cart Service** might call the **Inventory Service** to check stock.
3.  The **Inventory Service** might call the **Product Service** to get item details.

An E2E test with Playwright verifies that this entire flow works correctly from the user's perspective, without needing to know the internal details of each service.

## 3. Mocking Services with Playwright

Running full E2E tests can be slow and brittle because they depend on every single microservice being available and working correctly. A failure in one service can cause a cascade of failures in the tests for other services.

To isolate the service you are testing, you can use Playwright's network mocking capabilities to intercept and mock API requests to other services.

### Using `page.route()` to Mock API Calls

The `page.route()` method allows you to intercept network requests and provide a custom response.

```typescript
import { test, expect } from '@playwright/test';

test('should display user data from a mocked API', async ({ page }) => {
  // Intercept requests to the user service API
  await page.route('**/api/users/*', (route) => {
    // Provide a mock JSON response
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 123,
        name: 'John Doe',
        email: 'john.doe@example.com',
      }),
    });
  });

  await page.goto('https://example.com/profile');

  // The frontend will now display the mocked data
  await expect(page.locator('h1')).toHaveText('John Doe');
  await expect(page.locator('.email')).toHaveText('john.doe@example.com');
});
```

### When to Mock

-   **Isolating the Frontend:** When you want to test the UI in complete isolation from the backend.
-   **Testing a Single Service:** When you are running E2E tests for a specific feature and want to mock its dependencies to ensure they don't cause failures.
-   **Simulating Edge Cases:** Mocking allows you to easily simulate error states (e.g., a 500 server error) or specific data scenarios that might be hard to set up in a real environment.

## 4. A Balanced Testing Strategy

A robust microservices testing strategy involves a mix of different testing types:

1.  **Each service has its own comprehensive suite** of unit and integration tests.
2.  **Contract tests** are in place for all critical consumer-provider interactions between services.
3.  **A small, targeted suite of E2E tests** (using Playwright) focuses on the most critical user journeys (the "happy path"). These tests verify that the services are integrated correctly in a deployed environment.
4.  **Use mocking strategically** in your Playwright tests to reduce flakiness and test specific scenarios, but don't mock everything. The goal of E2E tests is to ensure real integration.

This approach gives you fast feedback at the unit and contract level, while still providing confidence that the system as a whole works together.