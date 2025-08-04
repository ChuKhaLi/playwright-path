# Lesson 7: Assessment

## Knowledge Check

1.  **Question:** What is the main purpose of a "performance baseline" test?
    *   a) To find the absolute maximum number of users the system can handle.
    *   b) To establish a standard of performance against which future changes can be measured.
    *   c) To test the API's functional correctness.
    *   d) To check for memory leaks over a long period.

2.  **Question:** In Playwright, what is a simple way to execute multiple API requests in parallel to simulate concurrent users?
    *   a) Use a `for` loop with `await` inside.
    *   b) Use `page.route()` to duplicate requests.
    *   c) Use `Promise.all()` with an array of request promises.
    *   d) It's not possible to run requests in parallel with Playwright.

3.  **Question:** Which type of performance test is designed to find the breaking point of a system by overwhelming it with traffic?
    *   a) Load Test
    *   b) Soak Test
    *   c) Spike Test
    *   d) Stress Test

## Practical Exercise

### Objective

Write a basic load test to verify that an API endpoint can handle a small number of concurrent requests without failing.

### Scenario

You are testing a public API endpoint that returns a list of posts: `https://jsonplaceholder.typicode.com/posts`. You want to ensure it can handle 20 simultaneous requests.

### Requirements

1.  Create a new test file `load.spec.ts`.
2.  Set a constant for the number of concurrent users (e.g., `CONCURRENT_USERS = 20`).
3.  Write a test named "should handle 20 concurrent requests".
4.  Inside the test, create a loop that runs `CONCURRENT_USERS` times. In each iteration, create a promise for a `GET` request to the posts endpoint and add it to an array.
5.  Use `Promise.all()` to execute all the requests in the array concurrently.
6.  After `Promise.all()` resolves, loop through the array of responses.
7.  For each response, assert that its status was `200 OK`.
8.  Add a log message to confirm that all requests were handled successfully.

### Solution

```typescript
// tests/api/load.spec.ts
import { test, expect, APIResponse } from '@playwright/test';

const CONCURRENT_USERS = 20;

test.describe('API Load Testing', () => {
  test(`should handle ${CONCURRENT_USERS} concurrent requests`, async ({ request }) => {
    // Set a longer timeout for this test as it's doing more work
    test.setTimeout(30000); // 30 seconds

    const requestPromises: Promise<APIResponse>[] = [];

    // 1. Create an array of API request promises
    for (let i = 0; i < CONCURRENT_USERS; i++) {
      requestPromises.push(
        request.get('https://jsonplaceholder.typicode.com/posts')
      );
    }

    console.log(`Dispatching ${CONCURRENT_USERS} concurrent requests...`);

    // 2. Execute all requests in parallel
    const responses = await Promise.all(requestPromises);

    console.log('All requests have completed. Verifying responses...');

    // 3. Verify that every single request was successful
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      // Add a custom message to know which request failed if any
      expect(response.ok(), `Request #${i + 1} failed with status ${response.status()}`).toBe(true);
    }

    console.log(`Successfully verified ${responses.length} successful responses.`);
  });
});