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
  // In a real application, you would use process.env to get credentials
  const loginPayload = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka',
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