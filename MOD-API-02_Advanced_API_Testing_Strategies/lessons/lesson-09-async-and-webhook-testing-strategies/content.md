# Lesson 9: Async and Webhook Testing Strategies

## 1. The Asynchronous World

In a synchronous API call, you send a request and wait for the complete response. But what if the task takes a long time, like generating a large report or processing a video? Making the client wait would be inefficient and lead to timeouts.

This is where asynchronous processing comes in. The typical flow is:
1.  **Request:** The client sends a request to start a job (e.g., `POST /api/reports`).
2.  **Acknowledge:** The server immediately responds with `202 Accepted` and a job ID (e.g., `{ "jobId": "job-123" }`). The actual work has not been done yet.
3.  **Process:** The server performs the long-running task in the background, often using a message queue and worker processes.
4.  **Notify:** Once the job is complete, the server notifies the client. This notification can happen in two main ways:
    *   The client can **poll** a status endpoint (`GET /api/reports/job-123/status`).
    *   The server can send a **webhook** to a URL provided by the client.

Testing these flows requires a different approach than standard request-response testing.

## 2. Testing by Polling a Status Endpoint

This is the more straightforward asynchronous pattern to test.

### Test Strategy
1.  **Initiate the Job:** Make the initial `POST` request to start the process. Assert that you get a `202 Accepted` status and a `jobId`.
2.  **Poll for Completion:** Create a loop that repeatedly calls the status endpoint (`GET /api/reports/{jobId}/status`).
    -   Inside the loop, check the status. If it's `pending` or `processing`, wait for a short interval (e.g., 1-2 seconds) and then continue the loop.
    -   If the status is `completed`, exit the loop.
    -   If the status is `failed`, exit the loop and fail the test.
3.  **Add a Timeout:** To prevent infinite loops, the polling mechanism must have a timeout. If the job doesn't complete within a reasonable time (e.g., 30 seconds), the test should fail.
4.  **Assert the Final Result:** Once the job is complete, you can make a final request to get the result (e.g., `GET /api/reports/{jobId}/result`) and assert its correctness.

Playwright's `test.step` and `expect.poll` are perfect for this.

### Example: Using `expect.poll`

`expect.poll` repeatedly executes a function until its return value matches the expectation. It's designed for exactly this kind of scenario.

```typescript
import { test, expect } from '@playwright/test';

test('should process a report and return the correct result', async ({ request }) => {
  test.setTimeout(60000); // Set a long timeout for the whole test

  // 1. Start the report generation job
  const startResponse = await request.post('/api/reports', { data: { type: 'sales' } });
  expect(startResponse.status()).toBe(202);
  const { jobId } = await startResponse.json();
  expect(jobId).toBeDefined();

  // 2. Poll the status endpoint until the job is complete
  await expect.poll(async () => {
    const statusResponse = await request.get(`/api/reports/${jobId}/status`);
    return await statusResponse.json();
  }, {
    message: `Report job ${jobId} did not complete in time.`,
    timeout: 45000, // 45 seconds polling timeout
    intervals: [2000, 5000], // Check every 2s, then every 5s
  }).toHaveProperty('status', 'completed');

  // 3. Fetch the final report and assert its content
  const reportResponse = await request.get(`/api/reports/${jobId}/result`);
  expect(reportResponse.ok()).toBe(true);
  const report = await reportResponse.json();
  expect(report.title).toBe('Sales Report');
});
```

## 3. Testing Webhooks

A webhook is an HTTP callback. It's a `POST` request that the server sends to a URL specified by the client. This is an "event-driven" way to notify the client.

The challenge in testing is: how do we receive this `POST` request in our test environment? We need a publicly accessible URL that can capture the webhook and let our test inspect it.

### Tools for Capturing Webhooks
-   **[webhook.site](https://webhook.site/):** A free online service that gives you a unique, random URL. Any HTTP request sent to this URL is captured and displayed.
-   **[ngrok](https://ngrok.com/):** A tool that creates a secure tunnel from a public URL to a service running on your local machine. You can run a simple Express.js server locally to act as your webhook receiver, and ngrok will expose it to the internet.

### Test Strategy using webhook.site

1.  **Get a Webhook URL:** In your test's `beforeAll` hook, programmatically request a new URL from the webhook.site API.
2.  **Initiate the Process:** Make the API call that will eventually trigger the webhook. In this call, you must provide the unique webhook URL you just generated as the callback destination.
3.  **Poll the Webhook Site API:** Wait for the webhook to be delivered by polling the webhook.site API for requests sent to your unique URL.
4.  **Inspect the Webhook:** Once a request is found, inspect its headers and body to assert that the webhook was sent correctly and contained the right data.

This approach fully tests the webhook delivery mechanism from end to end.

## 4. Summary

-   Testing **asynchronous APIs** requires a shift from the simple request-response mindset.
-   For systems that use a **status polling** mechanism, use Playwright's `expect.poll` to write clean, robust tests that wait for a background job to complete.
-   For **webhook**-based systems, you need a way to receive the callback.
    -   Use a service like **webhook.site** or **ngrok** to create a publicly accessible endpoint for your tests.
    -   The test flow becomes: 1) Start the job with the callback URL, 2) Wait for the webhook to arrive at your endpoint, 3) Assert the webhook's content.
-   Always use **timeouts** in your polling logic to prevent tests from running forever.
