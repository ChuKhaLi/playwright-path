# Lesson 12: Assessment

## Knowledge Check

1.  **Question:** What is the main difference between monitoring and observability?
    *   a) They are the same thing.
    *   b) Monitoring is for production, while observability is for testing environments.
    *   c) Monitoring tracks known issues with predefined dashboards, while observability allows you to investigate unknown issues by exploring rich telemetry data.
    *   d) Monitoring is about logs, while observability is about metrics.

2.  **Question:** What are the "three pillars" of observability?
    *   a) Testing, Deployment, and Rollback.
    *   b) Logs, Metrics, and Traces.
    *   c) CPU, Memory, and Disk Space.
    *   d) Requests, Responses, and Status Codes.

3.  **Question:** In a microservices architecture, what is the primary benefit of distributed tracing?
    *   a) It makes the API faster.
    *   b) It provides a way to see the entire journey of a single request as it passes through multiple services.
    *   c) It automatically fixes bugs.
    *   d) It replaces the need for logging.

## Practical Exercise

### Objective

Write a test that validates the structured logging of an API endpoint.

### Scenario

You are testing a `POST /login` endpoint. The development team has instrumented it to produce a structured JSON log for every login attempt. You need to verify that a failed login attempt generates a log with the correct information.

### Requirements

1.  Create a new test file `logging.spec.ts`.
2.  Write a test named "should produce a structured log for a failed login".
3.  In the test, make a `POST` request to `/login` with invalid credentials.
4.  Assert that the API response is `401 Unauthorized`.
5.  **Simulate a query to your logging system.** For this exercise, we will mock this part. Assume you have a function `getLogsForRequest(requestId)` that returns an array of log entries. You can use `page.route()` to mock a call to your logging system's API or just have a hardcoded log object.
6.  The test should "fetch" the logs and find the one related to the failed login.
7.  Assert the following about the structured log entry:
    *   `level` should be `"WARN"` or `"WARNING"`.
    *   `message` should be `"Failed login attempt"`.
    *   `username` should match the username you sent.
    *   It should **not** contain the `password`.
    *   `outcome` should be `"failure"`.

### Solution

```typescript
// tests/api/logging.spec.ts
import { test, expect } from '@playwright/test';

// This is a mock of a log entry that would be stored in a real logging system.
const MOCKED_LOG_ENTRY = {
  timestamp: '2023-10-27T11:30:00Z',
  level: 'WARN',
  message: 'Failed login attempt',
  username: 'invalid-user',
  outcome: 'failure',
  requestId: 'req-abc-123',
};

// This function simulates querying our logging backend.
async function getLogsByRequestId(requestId: string): Promise<any[]> {
  if (requestId === 'req-abc-123') {
    return [MOCKED_LOG_ENTRY];
  }
  return [];
}

test.describe('Structured Logging', () => {
  test('should produce a structured log for a failed login', async ({ request }) => {
    const requestId = 'req-abc-123';
    const username = 'invalid-user';

    // 1. Make the failed API call
    const response = await request.post('/login', {
      headers: { 'X-Request-ID': requestId }, // Send a unique ID to find the logs
      data: {
        username: username,
        password: 'wrong-password',
      },
      failOnStatusCode: false, // Don't fail the test on a 401
    });

    // 2. Assert the API response
    expect(response.status()).toBe(401);

    // 3. Fetch and assert the logs
    const logs = await getLogsByRequestId(requestId);
    
    expect(logs.length).toBe(1);
    const logEntry = logs[0];

    expect(logEntry.level).toBe('WARN');
    expect(logEntry.message).toBe('Failed login attempt');
    expect(logEntry.username).toBe(username);
    expect(logEntry.outcome).toBe('failure');
    // A critical security check: ensure passwords are never logged.
    expect(logEntry).not.toHaveProperty('password');
  });
});