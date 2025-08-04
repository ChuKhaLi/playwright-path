/**
 * @fileoverview This file contains examples of handling authentication in API tests.
 */

import { test, expect } from '@playwright/test';

// For a real project, these would come from environment variables (process.env)
const GOREST_API_TOKEN = 'your_gorest_api_token_here'; // Replace with a real token from gorest.co.in
const REQRES_USER_EMAIL = 'eve.holt@reqres.in';
const REQRES_USER_PASSWORD = 'cityslicka'; // Note: This is a dummy password from the public API

/**
 * Example 1: Bearer Token Authentication
 *
 * This test demonstrates how to send a Bearer Token in the Authorization header.
 * We are using GoRest API (gorest.co.in) which requires this type of authentication.
 */
test.describe('Bearer Token Authentication', () => {
  test('should get a list of users with a bearer token', async ({ request }) => {
    // Skip this test if the token is not provided, to avoid CI failures.
    test.skip(!GOREST_API_TOKEN || GOREST_API_TOKEN === 'your_gorest_api_token_here', 'GoRest API token not provided.');

    const response = await request.get('https://gorest.co.in/public/v2/users', {
      headers: {
        // The standard format is "Bearer <YourToken>"
        Authorization: `Bearer ${GOREST_API_TOKEN}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});

/**
 * Example 2: The "Login -> Get Token -> Use Token" Pattern
 *
 * This is the most common authentication workflow. We will use a public API
 * (reqres.in) that simulates this pattern.
 */
test.describe('Login and Use Token Pattern', () => {
  let authToken: string;

  // We log in once before all the tests in this suite run.
  test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post('https://reqres.in/api/login', {
      data: {
        email: REQRES_USER_EMAIL,
        password: REQRES_USER_PASSWORD,
      },
    });

    // It's crucial to verify that the login was successful before proceeding.
    expect(loginResponse.ok()).toBe(true);
    const body = await loginResponse.json();
    authToken = body.token;

    // The token should be a non-empty string.
    expect(typeof authToken).toBe('string');
    expect(authToken.length).toBeGreaterThan(0);
  });

  /**
   * This test uses the token obtained in the `beforeAll` hook to access a protected resource.
   */
  test('should use the auth token to access a protected resource', async ({ request }) => {
    // This is a conceptual example. reqres.in doesn't have a protected resource
    // that we can test with the token, but this is how you would structure the call.
    const response = await request.get('https://reqres.in/api/users/2', {
      // headers: {
      //   Authorization: `Bearer ${authToken}`,
      // },
    });

    // In a real test, you would now be able to access the resource.
    expect(response.ok()).toBe(true);
  });

  /**
   * This test demonstrates how you would reuse the same token for another test.
   */
  test('should reuse the auth token for another request', async ({ request }) => {
    // Again, a conceptual example of reusing the token.
    const response = await request.get('https://reqres.in/api/users', {
      // headers: {
      //   Authorization: `Bearer ${authToken}`,
      // },
    });
    expect(response.ok()).toBe(true);
  });
});