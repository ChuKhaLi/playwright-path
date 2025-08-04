# Lesson 15: Assessment

## Knowledge Check

1.  **Question:** What is the most common and critical API security vulnerability, according to the OWASP API Security Top 10?
    *   a) Injection Flaws
    *   b) Broken Object Level Authorization (BOLA)
    *   c) Security Misconfiguration
    *   d) Insufficient Logging & Monitoring

2.  **Question:** You are testing an API where a regular user can access the profile of an admin user by guessing their ID in the URL. What type of vulnerability is this?
    *   a) Broken Function Level Authorization
    *   b) Broken Object Property Level Authorization
    *   c) Broken Object Level Authorization (BOLA)
    *   d) SQL Injection

3.  **Question:** When testing for injection vulnerabilities, what is a key indicator that you may have found a flaw?
    *   a) The API returns a `200 OK` status.
    *   b) The API returns a `400 Bad Request` status, rejecting your malicious input.
    *   c) The API returns a `500 Internal Server Error`, suggesting your input caused an unhandled exception.
    *   d) The API returns a `429 Too Many Requests` status.

## Practical Exercise

### Objective

Write a security test to check for a Broken Object Level Authorization (BOLA) vulnerability.

### Scenario

You are testing a multi-user blogging platform. The API has an endpoint to delete a blog post: `DELETE /api/posts/{postId}`. This action should only be possible for the user who authored the post.

You have two test users:
-   `User A` (owns `post-abc`)
-   `User B` (owns `post-xyz`)

### Requirements

1.  Create a new test file `security.spec.ts`.
2.  Write a test named "a user should not be able to delete another user's post".
3.  In the test:
    *   First, log in as `User A` to get an authentication token.
    *   Using `User A`'s token, send a `DELETE` request to `/api/posts/post-xyz` (the post belonging to `User B`).
    *   Assert that the response status is `403 Forbidden` (or `404 Not Found`, as the system might hide the existence of the resource). A `204 No Content` would indicate a critical vulnerability.
4.  (Optional) Add a positive test case to ensure a user *can* delete their own post.

### Solution

```typescript
// tests/api/security.spec.ts
import { test, expect } from '@playwright/test';

// Assume these helper functions exist for getting tokens for specific test users.
async function loginAs(user: 'userA' | 'userB'): Promise<string> {
  return `fake-jwt-for-${user}`;
}

const USER_A_POST_ID = 'post-abc';
const USER_B_POST_ID = 'post-xyz';

test.describe('API Security: BOLA', () => {
  test('a user should not be able to delete another user\'s post', async ({ request }) => {
    // 1. Log in as User A
    const userAToken = await loginAs('userA');

    // 2. Attempt to delete User B's post
    const response = await request.delete(`/api/posts/${USER_B_POST_ID}`, {
      headers: {
        'Authorization': `Bearer ${userAToken}`,
      },
      failOnStatusCode: false, // Prevent Playwright from throwing on a 4xx/5xx status
    });

    // 3. Assert that the action was forbidden
    // A 403 is the most appropriate response. 404 is also acceptable.
    // A 204 would be a critical failure.
    expect(response.status()).toBe(403);
  });

  test('a user should be able to delete their own post', async ({ request }) => {
    // This positive test ensures the endpoint works for authorized users.
    const userAToken = await loginAs('userA');

    const response = await request.delete(`/api/posts/${USER_A_POST_ID}`, {
      headers: {
        'Authorization': `Bearer ${userAToken}`,
      },
    });

    // We expect a successful deletion response
    expect(response.status()).toBe(204);
  });
});