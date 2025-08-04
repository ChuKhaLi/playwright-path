/**
 * @fileoverview This file contains examples of tests that handle API errors.
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in';

test.describe('API Error Handling Examples', () => {
  /**
   * Example 1: Testing for 404 Not Found
   * This test deliberately requests a resource that does not exist.
   */
  test('should handle a 404 Not Found error for a single resource', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users/23`);

    // Assert that the status code is 404
    expect(response.status()).toBe(404);
    // Assert that the request was not "ok"
    expect(response.ok()).toBe(false);
  });

  /**
   * Example 2: Testing for 400 Bad Request (Input Validation)
   * This test sends an incomplete payload to an endpoint that requires more data.
   */
  test('should handle a 400 Bad Request for invalid input', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/login`, {
      data: {
        email: 'peter@klaven',
        // Password field is missing
      },
    });

    // Assert that the status code is 400
    expect(response.status()).toBe(400);

    // Assert the specific error message in the response body
    const body = await response.json();
    expect(body).toHaveProperty('error', 'Missing password');
  });

  /**
   * Example 3: Testing for 401 Unauthorized (Conceptual)
   * This test shows how you would test an endpoint that requires authentication
   * by not providing the necessary credentials.
   */
  test('should handle a 401 Unauthorized error', async ({ request }) => {
    // This is a conceptual test. Assume '/api/protected' requires a token.
    // We are not sending an Authorization header.
    const response = await request.get('https://httpbin.org/status/401');

    // Assert that the status code is 401
    expect(response.status()).toBe(401);
  });

  /**
   * Example 4: Testing for 403 Forbidden (Conceptual)
   * This test shows how you would test an endpoint that the user is not
   * authorized to access, even if they are authenticated.
   */
  test('should handle a 403 Forbidden error', async ({ request }) => {
    // This is a conceptual test. Assume we are logged in as a regular user
    // but trying to access an admin-only resource.
    const response = await request.get('https://httpbin.org/status/403');

    // Assert that the status code is 403
    expect(response.status()).toBe(403);
  });
});