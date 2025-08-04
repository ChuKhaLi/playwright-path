/**
 * @fileoverview This file contains examples of working with headers and cookies.
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://httpbin.org'; // httpbin is excellent for testing HTTP features

test.describe('Headers and Cookies Examples', () => {
  /**
   * Example 1: Sending custom request headers
   * This test sends custom headers to the server.
   */
  test('should send custom request headers', async ({ request }) => {
    // The /headers endpoint on httpbin echoes back the headers it receives.
    const response = await request.get(`${baseURL}/headers`, {
      headers: {
        'User-Agent': 'Playwright-Test-Runner/1.0',
        'X-Custom-Header': 'MyTestValue',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Assert that the server received the headers we sent.
    expect(body.headers['User-Agent']).toBe('Playwright-Test-Runner/1.0');
    expect(body.headers['X-Custom-Header']).toBe('MyTestValue');
  });

  /**
   * Example 2: Reading response headers
   * This test reads and validates headers from the server's response.
   */
  test('should read and validate response headers', async ({ request }) => {
    // The /response-headers endpoint allows us to ask for specific headers in the response.
    const response = await request.get(`${baseURL}/response-headers`, {
      params: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': 59,
      },
    });

    expect(response.status()).toBe(200);

    // 1. Get all headers as an object
    const headers = response.headers();
    expect(headers['content-type']).toBe('application/json');
    expect(headers['x-ratelimit-remaining']).toBe('59');

    // 2. Get a single header value
    const contentType = await response.headerValue('content-type');
    expect(contentType).toBe('application/json');
  });

  /**
   * Example 3: Reading a cookie set by the server
   * This test validates that the client can correctly parse a Set-Cookie header.
   */
  test('should read a cookie from the response', async ({ request }) => {
    // This endpoint sends a Set-Cookie header in its response.
    const response = await request.get(`${baseURL}/cookies/set/sessionToken/12345`);

    expect(response.status()).toBe(200);

    // The .cookies() method automatically parses the Set-Cookie header.
    const cookies = await response.cookies();
    expect(cookies).toHaveLength(1);
    expect(cookies[0].name).toBe('sessionToken');
    expect(cookies[0].value).toBe('12345');
  });

  /**
   * Example 4: Sending a cookie to the server
   * This test simulates a client that already has a cookie.
   */
  test('should send a cookie with the request', async ({ request }) => {
    // The /cookies endpoint echoes back any cookies it receives.
    const response = await request.get(`${baseURL}/cookies`, {
      headers: {
        // We manually construct the Cookie header.
        Cookie: 'user_preference=dark_mode; isLoggedIn=true',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Assert that the server received the cookies we sent.
    expect(body.cookies).toEqual({
      user_preference: 'dark_mode',
      isLoggedIn: 'true',
    });
  });
});