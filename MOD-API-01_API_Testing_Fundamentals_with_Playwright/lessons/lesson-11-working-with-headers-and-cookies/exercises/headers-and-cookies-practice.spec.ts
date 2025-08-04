/**
 * @fileoverview Hands-on exercises for Lesson 11.
 *
 * To run these tests, run `npx playwright test headers-and-cookies-practice.spec.ts`
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://httpbin.org';

/**
 * Exercise 1: Sending Custom Headers
 *
 * Objective: Practice sending custom headers with a request.
 */
test.describe('Exercise 1: Sending Custom Headers', () => {
  /**
   * Task:
   * 1. Make a GET request to `/headers`.
   * 2. In the request, include a custom header `X-Test-Environment` with the value `Practice`.
   * 3. Assert that the response status is 200.
   * 4. Parse the response body.
   * 5. Assert that the `headers` object in the response contains your custom header with the correct value.
   */
  test('should send and verify a custom header', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 2: Validating Response Headers
 *
 * Objective: Practice reading and asserting on headers from an API response.
 */
test.describe('Exercise 2: Validating Response Headers', () => {
  /**
   * Task:
   * 1. Make a GET request to `/`.
   * 2. Assert that the response status is 200.
   * 3. Get all the response headers using `response.headers()`.
   * 4. Assert that the `Content-Type` header exists and its value includes `text/html`.
   * 5. Assert that the `Server` header exists.
   */
  test('should validate standard response headers', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 3: Setting and Reading Cookies
 *
 * Objective: Practice the full cookie workflow: setting a cookie and then reading it back.
 */
test.describe('Exercise 3: Setting and Reading Cookies', () => {
  /**
   * Task:
   * 1. Make a GET request to the endpoint `/cookies/set?user_id=99&role=tester`.
   *    This will ask the server to set two cookies.
   * 2. Assert that the response status is 200.
   * 3. Get the cookies from the response using `response.cookies()`.
   * 4. Assert that you received exactly two cookies.
   * 5. Assert that one cookie has the name `user_id` and the value `99`.
   * 6. Assert that the other cookie has the name `role` and the value `tester`.
   */
  test('should receive and validate multiple cookies', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 4: Sending Cookies
 *
 * Objective: Practice sending cookies to simulate a client with an existing session.
 */
test.describe('Exercise 4: Sending Cookies', () => {
  /**
   * Task:
   * 1. Make a GET request to `/cookies`.
   * 2. In the `headers`, manually add a `Cookie` header.
   * 3. The value of the header should be a string like `'my_cookie=hello_world; another_cookie=123'`.
   * 4. Assert that the response status is 200.
   * 5. Parse the response body.
   * 6. Assert that the `cookies` object in the response contains the two cookies you sent.
   */
  test('should send multiple cookies in a request', async ({ request }) => {
    // TODO: Implement the test here.
  });
});