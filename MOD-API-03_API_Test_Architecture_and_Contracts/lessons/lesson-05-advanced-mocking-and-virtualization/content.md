# Lesson 5: Advanced Mocking and Service Virtualization

## 1. The Challenge of Interconnected Services

In modern software development, especially with microservices architectures, applications are composed of many small, independent services that communicate with each other over the network.

While this has many benefits, it presents a significant challenge for testing:
-   **Dependency:** To test Service A, you might need Service B, C, and D to be running and available.
-   **Flakiness:** A failure in any downstream service can cause your test for the primary service to fail, leading to flaky and unreliable test runs.
-   **Environment Complexity:** Setting up a complete end-to-end test environment with all services can be complex, slow, and expensive.
-   **Difficult Scenarios:** How do you test what happens when a third-party payment gateway is slow or returns an error? Reproducing these scenarios with live services is difficult.

To solve these problems, we use **mocking** and **service virtualization** to isolate the service we are testing.

## 2. Defining the Terminology

The terms "mock," "stub," and "virtualization" are often used interchangeably, but they have distinct meanings.

-   **Stub:** A simple object that provides hardcoded responses to specific calls. It's used to make sure your test can run, but you typically don't make assertions against the stub itself.
-   **Mock:** A more sophisticated object that you can make assertions against. You can verify *how* your code interacted with the mock (e.g., "Was the `save` method called exactly once?").
-   **Service Virtualization:** This is a more advanced concept. It involves using a dedicated tool to simulate the behavior of a real downstream service. A virtualized service runs as its own process and can have complex logic, state, and performance characteristics. It's like a high-fidelity "stunt double" for your real service.

| Feature              | Stubbing / In-Process Mocking | Service Virtualization             |
| -------------------- | ----------------------------- | ---------------------------------- |
| **Scope**            | Within the test process       | Separate, out-of-process tool      |
| **Complexity**       | Simple, good for unit/component tests | Can simulate complex stateful behavior |
| **Use Case**         | Isolating a single class or function | Isolating an entire service        |
| **Performance**      | Very fast                     | Fast, but involves network calls (to `localhost`) |
| **Tooling Example**  | Playwright's `page.route()`   | WireMock, Mountebank               |

## 3. In-Process API Mocking with Playwright

Playwright provides powerful tools to intercept and mock network requests directly within your tests. This is perfect for testing a UI component in isolation from its backend.

The `page.route()` or `context.route()` method allows you to intercept network requests that match a certain pattern and decide how to respond.

**Example: Mocking an API for a UI Test**

Imagine you have a React component that fetches and displays a list of users. You can test this component without needing the real API.

```typescript
import { test, expect } from '@playwright/test';

test('should display a list of users from a mocked API', async ({ page }) => {
  // 1. Intercept requests to the users API
  await page.route('**/api/users', async (route) => {
    // 2. Define the mock response data
    const mockUsers = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    // 3. Fulfill the request with the mock data
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUsers),
    });
  });

  // 4. Navigate to the page that makes the API call
  await page.goto('/users');

  // 5. Assert that the UI has rendered the mock data
  await expect(page.getByText('Alice')).toBeVisible();
  await expect(page.getByText('Bob')).toBeVisible();
});
```

This approach is fast and effective for testing the front end, but for testing a backend service's interactions with *other* backend services, we need a more powerful solution.

## 4. Introduction to Service Virtualization

Service virtualization involves deploying a dedicated application that stands in for a real service. Your Service Under Test (SUT) makes real network calls to the virtualized service, thinking it's the real thing.

**Popular Tools:**
-   **WireMock:** A very popular and flexible tool, especially in the Java world, but usable with any language via its HTTP API.
-   **Mountebank:** A powerful open-source tool that supports multiple protocols (HTTP, TCP, SMTP) and has great JavaScript support.

### Why Use a Service Virtualization Tool?

-   **Realistic Simulation:** It can simulate network latency, connection issues, and other real-world problems.
-   **Stateful Scenarios:** It can be configured to change its responses based on previous requests, allowing you to test complex, stateful workflows.
-   **Team-Wide Sharing:** A virtualized service can be hosted and shared by the entire team (developers, QAs, frontend engineers).
-   **Protocol Support:** Tools like Mountebank can virtualize more than just REST APIs.

## 5. Deep Dive: Using WireMock for API Testing

Let's explore how to use WireMock to test a service in isolation. A common way to run WireMock is via Docker.

**Step 1: Run WireMock in Docker**

```bash
docker run -it --rm -p 8080:8080 wiremock/wiremock:latest
```

This starts WireMock, which is now listening for configuration commands on port `8080`.

**Step 2: Configure Stubs via API**

WireMock is configured by sending `POST` requests to its `/mappings` endpoint. This allows you to create "stubs" that define how it should respond to certain requests.

**Example Test Workflow:**

Imagine we are testing a `OrderService`. The `OrderService` needs to call a `PaymentService` to process a payment. We will virtualize the `PaymentService`.

```typescript
import { test, expect } from '@playwright/test';
import { WireMockClient } from './wiremock-client'; // A helper client for WireMock

const wiremock = new WireMockClient('http://localhost:8080');
const orderServiceUrl = 'http://localhost:3000'; // Our service under test

test.beforeEach(async () => {
  // Reset WireMock to a clean state before each test
  await wiremock.reset();
});

test('should place an order when payment service is successful', async ({ request }) => {
  // Arrange: Configure the virtualized PaymentService to succeed
  await wiremock.stubFor({
    request: {
      method: 'POST',
      url: '/payments/charge'
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: 'txn_12345', status: 'success' })
    }
  });

  // Act: Call our OrderService, which will internally call the virtualized PaymentService
  const orderResponse = await request.post(`${orderServiceUrl}/orders`, {
    data: { productId: 'prod_abc', amount: 100 }
  });

  // Assert
  expect(orderResponse.status()).toBe(201);
  const order = await orderResponse.json();
  expect(order.status).toBe('CONFIRMED');
  expect(order.paymentTransactionId).toBe('txn_12345');
});

test('should fail to place an order when payment service declines', async ({ request }) => {
  // Arrange: Configure the virtualized PaymentService to fail
  await wiremock.stubFor({
    request: {
      method: 'POST',
      url: '/payments/charge'
    },
    response: {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Insufficient funds' })
    }
  });

  // Act
  const orderResponse = await request.post(`${orderServiceUrl}/orders`, {
    data: { productId: 'prod_abc', amount: 100 }
  });

  // Assert
  expect(orderResponse.status()).toBe(400);
  const error = await orderResponse.json();
  expect(error.message).toBe('Payment declined');
});

test('should handle payment service latency', async ({ request }) => {
  // Arrange: Configure the virtualized PaymentService to be slow
  await wiremock.stubFor({
    request: {
      method: 'POST',
      url: '/payments/charge'
    },
    response: {
      status: 201,
      body: JSON.stringify({ transactionId: 'txn_slow', status: 'success' }),
      fixedDelayMilliseconds: 2000 // 2-second delay
    }
  });

  // Act
  const startTime = Date.now();
  const orderResponse = await request.post(`${orderServiceUrl}/orders`, {
    data: { productId: 'prod_abc', amount: 100 }
  });
  const endTime = Date.now();

  // Assert that our OrderService handles the delay correctly (e.g., maybe it has a 3-second timeout)
  expect(orderResponse.status()).toBe(201);
  expect(endTime - startTime).toBeGreaterThanOrEqual(2000);
});
```

## Summary

-   Mocking and service virtualization are essential techniques for testing modern, distributed applications by **isolating the service under test**.
-   **Playwright's `route.fulfill()`** is excellent for **in-process mocking** of APIs for UI-level component tests.
-   **Service virtualization tools** like **WireMock** provide a powerful, out-of-process solution for simulating downstream dependencies in backend testing.
-   Service virtualization allows you to create **stable, predictable, and fast** test environments and to easily simulate complex scenarios like **failures, latency, and specific data conditions**.