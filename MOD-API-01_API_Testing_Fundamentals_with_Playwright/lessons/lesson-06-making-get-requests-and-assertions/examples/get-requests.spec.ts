/**
 * @fileoverview This file contains examples of GET requests and assertions.
 */

import { test, expect } from '@playwright/test';

// We will use a public API for these examples.
const baseURL = 'https://reqres.in';

test.describe('GET Request Examples', () => {
  /**
   * Example 1: Get a single resource
   * This test fetches a single user and validates the response.
   */
  test('should get a single user and validate the response', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users/2`);

    // 1. Assert the status code
    expect(response.status()).toBe(200);

    // 2. Assert response headers
    expect(response.headers()['content-type']).toContain('application/json');

    // 3. Assert the response body
    const body = await response.json();
    expect(body.data).toHaveProperty('id', 2);
    expect(body.data).toHaveProperty('email', 'janet.weaver@reqres.in');
    expect(typeof body.data.first_name).toBe('string');
  });

  /**
   * Example 2: Get a collection of resources
   * This test fetches a list of users and validates the collection.
   */
  test('should get a list of users and validate the collection', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users?page=2`);

    // 1. Assert the status code
    expect(response.status()).toBe(200);

    // 2. Assert the response body structure
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('page', 2);

    // 3. Assert that a specific item exists in the collection
    const userExists = body.data.some(user => user.id === 10);
    expect(userExists).toBe(true);
  });

  /**
   * Example 3: Using query parameters
   * This test demonstrates how to filter results using query parameters.
   */
  test('should use query parameters to filter results', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users`, {
      params: {
        page: 2,
        per_page: 3,
      },
    });

    // 1. Assert the status code
    expect(response.status()).toBe(200);

    // 2. Assert that the query parameters were applied
    const body = await response.json();
    expect(body.page).toBe(2);
    expect(body.per_page).toBe(3);
    expect(body.data).toHaveLength(3);
  });

  /**
   * Example 4: Handling a 404 Not Found error
   * This test demonstrates how to correctly handle and assert an error response.
   */
  test('should handle a 404 Not Found error', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users/23`);

    // 1. Assert the status code is 404
    expect(response.status()).toBe(404);

    // 2. Assert that the response is not `ok`
    expect(response.ok()).toBe(false);
  });
});