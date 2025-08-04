# Lesson 7: API Performance and Load Testing

## 1. Why Performance Matters for APIs

Functional correctness is only half the battle. An API that is correct but slow can be just as bad as a broken one. API performance testing focuses on measuring and validating the speed, scalability, and stability of your API under various conditions.

**Key Performance Indicators (KPIs) for APIs:**
-   **Response Time (Latency):** How long it takes for a request to be processed and a response to be returned. Often measured in percentiles (p95, p99).
-   **Throughput:** How many requests the API can handle per unit of time (e.g., requests per second).
-   **Error Rate:** The percentage of requests that result in errors, especially under load.
-   **Resource Utilization:** How much CPU, memory, and network bandwidth the API server uses.

## 2. Simple Performance Measurement in Playwright

While Playwright is not a dedicated load testing tool like k6 or JMeter, it's excellent for basic performance checks and for integrating performance measurements into your functional tests.

You can easily measure the duration of an API call.

```typescript
test('API response time should be within acceptable limits', async ({ request }) => {
  const startTime = Date.now();
  
  const response = await request.get('/api/critical-endpoint');
  
  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log(`Request duration: ${duration}ms`);
  
  expect(response.ok()).toBe(true);
  // Set a performance budget for this endpoint
  expect(duration).toBeLessThan(500); // Expect response within 500ms
});
```
This simple test establishes a **performance baseline**. If a future code change causes the duration to exceed 500ms, the test will fail, alerting you to a performance regression.

## 3. Simulating Concurrent Users (Load Testing)

A primary goal of load testing is to see how the API behaves when multiple users access it simultaneously. We can simulate this in Playwright using `Promise.all()`.

`Promise.all()` takes an array of promises (like API requests) and runs them in parallel. It resolves when all of them are complete.

### Example: Testing with Concurrent Requests

Let's simulate 10 users hitting an endpoint at the same time.

```typescript
import { test, expect } from '@playwright/test';

const CONCURRENT_USERS = 10;

test('should handle concurrent requests without errors', async ({ request }) => {
  const requests: Promise<any>[] = [];

  // Create an array of 10 API request promises
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    requests.push(request.get('/api/products'));
  }

  // Execute all requests in parallel
  const responses = await Promise.all(requests);

  // Check that all responses were successful
  for (const response of responses) {
    expect(response.ok()).toBe(true);
  }
  
  console.log(`Successfully handled ${responses.length} concurrent requests.`);
});
```

This pattern is great for:
-   **Load Testing:** Does the API slow down or return errors under load?
-   **Stress Testing:** Increase `CONCURRENT_USERS` until the API starts to fail. This helps you find its breaking point.
-   **Race Condition Testing:** Uncovering bugs that only happen when multiple requests try to modify the same resource at the same time.

## 4. Types of Performance Tests

-   **Load Test:** Simulates expected production load to verify baseline performance. (e.g., 100 concurrent users).
-   **Stress Test:** Pushes the system beyond its limits to see how and when it fails. (e.g., finding the maximum number of users before the error rate exceeds 2%).
-   **Spike Test:** Simulates a sudden, massive increase in traffic to see how the system handles it and, more importantly, how it recovers.
-   **Endurance Test (Soak Test):** A long-running test with a moderate load to check for issues like memory leaks or performance degradation over time.

While complex endurance and spike tests are better suited for dedicated tools, basic load and stress tests are achievable and valuable within your Playwright suite.

## 5. Integrating with a Dedicated Load Testing Tool

For serious performance engineering, you'll want to use a specialized tool. A common workflow is:
1.  **Write Functional Tests in Playwright:** Create tests that cover the user scenarios you want to load test.
2.  **Record the Scenario:** Use a tool like the Playwright Test recorder or a proxy to capture the HTTP requests made during your functional test.
3.  **Import into a Load Testing Tool:** Import the recorded script into a tool like k6, JMeter, or Gatling.
4.  **Configure the Load Profile:** In the load testing tool, configure the number of virtual users, test duration, and ramp-up patterns.
5.  **Run and Analyze:** Execute the load test and analyze the detailed performance metrics provided by the tool.

Tools like k6 even have converters that can help turn your Playwright scripts into k6 scripts (`playwright-to-k6`).

## 6. Summary

-   API performance is critical for user experience and system stability.
-   Playwright is excellent for **performance baseline testing** by measuring the duration of individual API calls within your functional tests.
-   You can simulate **concurrent users** and perform basic **load testing** using `Promise.all()` to run requests in parallel.
-   This helps you find performance regressions, identify breaking points, and uncover race conditions.
-   For advanced load testing, integrate your Playwright workflow with a dedicated tool like **k6** or **JMeter**.