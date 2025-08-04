# Lesson 9: Assessment

## Knowledge Check

1.  **Question:** In an asynchronous API flow, what does an initial `202 Accepted` response status typically indicate?
    *   a) The job has been completed successfully.
    *   b) The server has received and acknowledged the request, but the processing has not yet finished.
    *   c) The request was invalid and rejected.
    *   d) The server is ready to receive a webhook.

2.  **Question:** What is the primary purpose of a webhook?
    *   a) For a client to request data from a server.
    *   b) For a server to send a real-time, unsolicited notification to a client when an event occurs.
    *   c) To check the status of a long-running job.
    *   d) To secure communication between client and server.

3.  **Question:** In Playwright, what is the `expect.poll` function specifically designed for?
    *   a) Making a single API request.
    *   b) Running multiple API requests in parallel.
    *   c) Repeatedly executing a function and checking its result against an expectation until it passes or times out.
    *   d) Capturing webhook requests.

## Practical Exercise

### Objective

Write a test for an asynchronous API that uses a polling mechanism to check for job completion.

### Scenario

You are testing an API that converts a piece of text to uppercase. This is a simulated long-running process.
1.  You `POST` to `/api/text-transform` with `{ "text": "hello world" }`.
2.  The server immediately responds with `202 Accepted` and a `jobId`.
3.  You can then poll `GET /api/text-transform/{jobId}`.
    *   Initially, it returns `{ "status": "processing" }`.
    *   After a few seconds, it returns `{ "status": "completed", "result": "HELLO WORLD" }`.

### Requirements

1.  Create a new test file `async.spec.ts`.
2.  Write a test named "should handle async text transformation".
3.  Use `page.route()` to mock the two endpoints to simulate the async behavior.
    *   The `POST` endpoint should return a `202` with a hardcoded `jobId`.
    *   The `GET` endpoint should initially return the "processing" status, and after a few calls, return the "completed" status.
4.  The test should first make the `POST` request.
5.  Then, use `expect.poll` to check the `GET` endpoint until the `status` is `completed`.
6.  Finally, assert that the `result` in the final polled response is `"HELLO WORLD"`.

### Solution

```typescript
// tests/api/async.spec.ts
import { test, expect } from '@playwright/test';

const JOB_ID = 'mock-job-123';
const ORIGINAL_TEXT = 'hello world';
const TRANSFORMED_TEXT = 'HELLO WORLD';

test.describe('Async Text Transformation', () => {
  let getRequestCount = 0;

  test.beforeEach(async ({ page }) => {
    getRequestCount = 0;
    // Mock the API endpoints
    await page.route('**/api/text-transform', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 202, contentType: 'application/json', body: JSON.stringify({ jobId: JOB_ID }) });
      }
    });

    await page.route(`**/${JOB_ID}`, async (route) => {
        getRequestCount++;
        if (getRequestCount < 3) {
          // Return "processing" for the first 2 calls
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'processing' }) });
        } else {
          // Return "completed" on the 3rd call
          await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'completed', result: TRANSFORMED_TEXT }) });
        }
    });
  });

  test('should handle async text transformation', async ({ page }) => {
    // 1. Initiate the job
    const startResponse = await page.request.post('/api/text-transform', {
      data: { text: ORIGINAL_TEXT },
    });
    expect(startResponse.status()).toBe(202);
    const { jobId } = await startResponse.json();
    expect(jobId).toBe(JOB_ID);

    // 2. Poll for completion
    const finalState = await expect.poll(async () => {
      const statusResponse = await page.request.get(`/api/text-transform/${jobId}`);
      return await statusResponse.json();
    }, {
      timeout: 10000,
    }).toMatchObject({ status: 'completed' });

    // 3. Assert the final result
    expect(finalState.result).toBe(TRANSFORMED_TEXT);
  });
});