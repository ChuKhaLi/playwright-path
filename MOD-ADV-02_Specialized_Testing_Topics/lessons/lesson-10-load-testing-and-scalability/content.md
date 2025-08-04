# Lesson 10: Load Testing and Scalability

## 1. Defining Performance Under Load

-   **Load Testing:** Simulates a specific, expected number of concurrent users to see how the system performs. The goal is to ensure the application can handle the expected daily traffic without degradation.
-   **Stress Testing:** Pushes the system beyond its limits to find the breaking point. The goal is to understand how the application fails and if it recovers gracefully.
-   **Scalability Testing:** Determines how well the application can scale up to handle an increase in user load. This often involves gradually increasing the number of users and measuring the impact on performance.

## 2. Why Playwright is Not a Load Testing Tool

Playwright is designed to simulate a *single user* with a real browser. This is resource-intensive. Each browser instance consumes a significant amount of CPU and memory.

Trying to launch hundreds or thousands of Playwright instances to generate load is inefficient and expensive. It would test the limits of your test runner machine, not your application server.

## 3. The Right Tools for the Job

Load testing is typically done at the protocol level (e.g., HTTP). Tools like [k6](https://k6.io/), [JMeter](https://jmeter.apache.org/), or [Gatling](https://gatling.io/) are designed to generate thousands of virtual users with very little overhead. They make direct HTTP requests to your server, bypassing the browser entirely.

### Key Metrics in Load Testing

When running a load test, you monitor:
-   **Throughput:** The number of requests your application can handle per second (RPS).
-   **Response Time:** The average, median, and 95th/99th percentile time it takes for the server to respond.
-   **Error Rate:** The percentage of requests that result in an error (e.g., 5xx status codes).
-   **Resource Utilization:** CPU, memory, and network usage on your application servers.

## 4. From Playwright Script to Load Test Script

While you can't use Playwright to *run* the load test, you can use it to *create* the load test script. The "record and playback" feature is perfect for this.

### The Workflow

1.  **Record a User Journey:** Use Playwright's codegen to record a critical user flow.
    ```bash
    npx playwright codegen https://example.com
    ```
    Perform actions like logging in, searching for a product, and adding it to the cart.

2.  **Analyze the Network Traffic:** As you record, pay close attention to the network requests being made in the DevTools panel. These are the API calls you need to replicate in your load test script.

3.  **Convert to a k6 Script:** Manually translate the recorded user flow into a script for your chosen load testing tool.

### Example: Playwright vs. k6

**Playwright E2E Test (simulating the browser):**
```typescript
import { test, expect } from '@playwright/test';

test('should add an item to the cart', async ({ page }) => {
  await page.goto('/products/456');
  await page.click('#add-to-cart-button');
  await expect(page.locator('.cart-count')).toHaveText('1');
});
```

**Equivalent k6 Script (simulating the API call):**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  // This is the API call that happens when the user clicks the button
  const res = http.post('https://api.example.com/cart', {
    productId: '456',
    quantity: 1,
  });

  // Check that the API call was successful
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
```

The k6 script is much simpler and more efficient. It only simulates the essential network request, which is all that's needed to put load on the server.

## 5. Integrating Load Testing into CI/CD

Load testing can be integrated into your CI/CD pipeline, but it's typically not run on every single commit like unit or E2E tests.

Common strategies include:
-   **Nightly Builds:** Run a suite of load tests every night against a dedicated performance environment.
-   **On-Demand:** Allow developers to trigger load tests manually on their feature branches.
-   **Pre-Release:** Run a comprehensive load test as a final gate before deploying to production.

The goal is to catch performance regressions before they impact real users.