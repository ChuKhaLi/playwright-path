# Lesson 8: Assessment

## Knowledge Check

1.  **Question:** What HTTP status code should an API return when a client has exceeded its rate limit?
    *   a) `401 Unauthorized`
    *   b) `403 Forbidden`
    *   c) `429 Too Many Requests`
    *   d) `503 Service Unavailable`

2.  **Question:** Which HTTP response header typically tells you how many requests you have left in the current time window?
    *   a) `X-RateLimit-Limit`
    *   b) `X-RateLimit-Reset`
    *   c) `X-RateLimit-Remaining`
    *   d) `X-RateLimit-Window`

3.  **Question:** What is the most robust strategy for preventing your functional test suite from failing due to rate limits?
    *   a) Adding a 5-second delay between every test.
    *   b) Running all tests in parallel to finish before the limit is hit.
    *   c) Using a special configuration for your test environment where rate limits are disabled or significantly increased.
    *   d) Retrying failed tests until they pass.

## Practical Exercise

### Objective

Write a test to verify the behavior of a rate-limited endpoint, specifically focusing on the `X-RateLimit-Remaining` header.

### Scenario

You are testing an API endpoint `/api/search` which has a rate limit of 5 requests per second. You want to write a fast test that confirms the `X-RateLimit-Remaining` header decreases as expected, without waiting for the full reset period.

### Requirements

1.  Create a new test file `ratelimit.spec.ts`.
2.  Write a test named "should decrement the rate limit remaining header on each request".
3.  Set a constant for the number of requests to make, e.g., `REQUEST_COUNT = 3`.
4.  Write a loop that makes `REQUEST_COUNT` requests to `/api/search`.
5.  For each request, you need to:
    *   Assert the response is `200 OK`.
    *   Read the `x-ratelimit-limit` and `x-ratelimit-remaining` headers.
    *   Assert that the `x-ratelimit-remaining` value is one less than it was on the previous request. (For the first request, it should be one less than the `x-ratelimit-limit`).

### Solution

```typescript
// tests/api/ratelimit.spec.ts
import { test, expect } from '@playwright/test';

const REQUEST_COUNT = 3;
const MOCK_RATE_LIMIT = 5; // The total limit for our mock server

test.describe('Rate Limit Header Validation', () => {
  let remaining = MOCK_RATE_LIMIT;

  // We use page.route to simulate a server with rate limiting headers.
  // This makes the test fast and predictable.
  test.beforeEach(async ({ page }) => {
    remaining = MOCK_RATE_LIMIT; // Reset for each test
    await page.route('**/api/search', async (route) => {
      remaining--;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ results: [] }),
        headers: {
          'X-RateLimit-Limit': MOCK_RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
        },
      });
    });
  });

  test('should decrement the rate limit remaining header on each request', async ({ page }) => {
    let expectedRemaining = MOCK_RATE_LIMIT;

    for (let i = 0; i < REQUEST_COUNT; i++) {
      const response = await page.request.get('/api/search');
      expect(response.ok(), `Request #${i + 1} should be successful`).toBe(true);

      const limit = parseInt(response.headers()['x-ratelimit-limit']);
      const remaining = parseInt(response.headers()['x-ratelimit-remaining']);
      
      expectedRemaining--;

      expect(limit).toBe(MOCK_RATE_LIMIT);
      expect(remaining, `Remaining count for request #${i + 1} should be correct`).toBe(expectedRemaining);
    }
  });
});