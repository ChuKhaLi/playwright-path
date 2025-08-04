/**
 * @fileoverview This file contains examples of POST requests and data creation.
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in';

test.describe('POST Request Examples', () => {
  /**
   * Example 1: Basic resource creation
   * This test creates a new user and validates the successful response.
   */
  test('should create a new user', async ({ request }) => {
    const newUser = {
      name: 'morpheus',
      job: 'leader',
    };

    const response = await request.post(`${baseURL}/api/users`, {
      data: newUser,
    });

    // 1. Assert the status code is 201 Created
    expect(response.status()).toBe(201);

    // 2. Parse the response body
    const body = await response.json();

    // 3. Assert the response body contains the sent data
    expect(body.name).toBe(newUser.name);
    expect(body.job).toBe(newUser.job);

    // 4. Assert the presence of server-generated fields
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });

  /**
   * Example 2: Testing input validation
   * This test sends an incomplete payload to a registration endpoint
   * and validates the resulting error message.
   */
  test('should return a 400 error for missing password', async ({ request }) => {
    const registrationData = {
      email: 'sydney@fife',
    };

    const response = await request.post(`${baseURL}/api/register`, {
      data: registrationData,
    });

    // 1. Assert the status code is 400 Bad Request
    expect(response.status()).toBe(400);

    // 2. Assert the specific error message in the response body
    const body = await response.json();
    expect(body).toHaveProperty('error', 'Missing password');
  });

  /**
   * Example 3: Using dynamic data to avoid test conflicts
   * This test uses dynamic data to ensure each test run creates a unique user.
   */
  test('should create a user with dynamic data', async ({ request }) => {
    // Generate a unique name and job for each test run
    const dynamicUser = {
      name: `Test User ${Date.now()}`,
      job: 'Automation Tester',
    };

    const response = await request.post(`${baseURL}/api/users`, {
      data: dynamicUser,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe(dynamicUser.name);
  });
});