# Lesson 5: Mocking and Stubbing API Dependencies

## 1. The Challenge of Interconnected Services

Modern applications are rarely monolithic. They are ecosystems of services that call each other. For example, an `Order Service` might call a `Payment Service` to process a payment and a `Notification Service` to send an email.

When you test the `Order Service`, do you want to make real calls to the other services?
- **No**, because a failure in the `Payment Service` would cause your `Order Service` test to fail, even if the `Order Service` itself is working correctly.
- **No**, because you want to test how the `Order Service` behaves when the `Payment Service` is slow or returns an error, which is hard to do with a live dependency.
- **No**, because real downstream calls can be slow and costly (e.g., processing a real payment).

This is where **mocking** and **stubbing** come in. These techniques involve creating "test doubles"—objects or services that stand in for real dependencies.

## 2. Mocks vs. Stubs

While often used interchangeably, there's a subtle difference:
-   **Stub:** A simple test double that returns hardcoded data. It's all about providing state. You use a stub to make your test run; you don't assert against the stub itself.
-   **Mock:** A "smarter" test double. You can set expectations on a mock, such as "I expect this mock to be called exactly once with these specific parameters." It's about verifying behavior.

In Playwright, `page.route()` is our primary tool for creating both stubs and mocks for network requests.

## 3. Mocking for E2E/UI Tests with `page.route()`

We've already seen how to use `page.route()` to provide mock responses (`route.fulfill()`). This is the primary way to isolate your frontend application from backend dependencies during UI testing.

### Advanced Mocking Scenarios

**Simulating Network Delays:** Test how your application's UI behaves on a slow network. Does it show a loading spinner?

```typescript
test('should show a loading indicator while waiting for data', async ({ page }) => {
  await page.route('**/api/data', async (route) => {
    // Wait for 3 seconds before providing the response
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Data loaded' }),
    });
  });

  await page.goto('/my-page');
  
  // Assert that the loading spinner is visible immediately
  await expect(page.getByTestId('loading-spinner')).toBeVisible();
  
  // Assert that the data is visible after the delay
  await expect(page.getByText('Data loaded')).toBeVisible({ timeout: 5000 });
});
```

**Simulating Network Errors:** Test your app's error handling.

```typescript
test('should show an error message if the network fails', async ({ page }) => {
  // Abort the request to simulate a network-level failure
  await page.route('**/api/data', route => route.abort());

  await page.goto('/my-page');
  
  await expect(page.getByText('Oops! Something went wrong.')).toBeVisible();
});
```

## 4. Mocking Dependencies for API Tests

Mocking for pure API tests (where you are testing a backend service) is more complex because there's no "page" to intercept requests from. The service under test makes its own HTTP calls to its dependencies.

Here are a few common strategies:

### Strategy 1: Environment-Based Mocking

In your test environment, you can configure your service to point to a mock server instead of the real dependency.

-   **Service Under Test:** `Order Service`
-   **Dependency:** `Payment Service`
-   **Configuration:** In the test environment, the `Order Service` has an environment variable `PAYMENT_SERVICE_URL=http://mock-payment-service:8080`.
-   **Mock Server:** You run a simple mock server (like [WireMock](https://wiremock.org/) or a custom Express.js app) that listens on that URL and returns predefined responses.

Your Playwright API test would look like this:
1.  (In a `beforeAll` hook) Configure and start the mock payment service with the responses needed for the test.
2.  Make a request to your real `Order Service`.
3.  The `Order Service` will, in turn, call the mock payment service.
4.  Assert the response from the `Order Service`.
5.  (Optional) Query the mock server to verify that it received the expected request from the `Order Service`.

### Strategy 2: Using a Service Mesh for Traffic Control (Advanced)

In a sophisticated microservices architecture using a service mesh (like Istio or Linkerd), you can configure the mesh's control plane to redirect traffic during tests. For example, you can create a rule that says "any traffic from the `Order Service` going to the `Payment Service` should instead be routed to the `mock-payment-service`." This is powerful but requires significant infrastructure setup.

## 5. Service Virtualization

Service virtualization is the practice of creating a virtual, simulated environment that mimics the behavior of real components. The mock servers we discussed are a form of service virtualization. Tools like WireMock, MockServer, and commercial products like Mountebank are designed for this purpose. They allow you to create sophisticated stubs for entire APIs.

## 6. Summary

-   Testing in isolation is key to fast and reliable tests.
-   **Stubs** provide state, while **Mocks** verify behavior.
-   For UI tests, `page.route()` is the perfect tool for mocking backend API dependencies. It allows you to simulate success, errors, delays, and any other scenario.
-   For API tests, you need a strategy to intercept calls from your service under test to its dependencies. This often involves running a **mock server** and configuring your service to point to it in the test environment.
-   **Service Virtualization** is the broader concept of simulating dependencies, which is a cornerstone of modern testing in microservice architectures.