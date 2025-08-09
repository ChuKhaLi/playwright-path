/**
 * @fileoverview This file contains generic helper functions for API testing.
 */

import { APIRequestContext, expect } from '@playwright/test';

/**
 * A helper function to log in and retrieve an authentication token.
 * This abstracts the login logic so it can be reused across multiple test suites.
 * @param request The Playwright APIRequestContext object.
 * @returns A promise that resolves to the authentication token string.
 */
export async function getAuthToken(request: APIRequestContext): Promise<string> {
  // Best Practice: Use environment variables for sensitive data.
  const loginPayload = {
    email: process.env.REQRES_EMAIL || 'eve.holt@reqres.in',
    password: process.env.REQRES_PASSWORD || 'cityslicka',
  };

  const response = await request.post('https://reqres.in/api/login', {
    data: loginPayload,
  });

  // It's crucial to validate that the helper function itself is working correctly.
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('token');

  return body.token;
}