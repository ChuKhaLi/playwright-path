/**
 * @fileoverview This file contains examples of data-driven API tests.
 */

import { test, expect } from '@playwright/test';
// We'll use the 'fs' and 'path' modules from Node.js to read our external data file.
import fs from 'fs';
import path from 'path';

const baseURL = 'https://reqres.in';

/**
 * Example 1: Basic data-driven test using an inline array
 *
 * This test validates multiple user IDs with a single test block.
 */
test.describe('Basic Data-Driven Test', () => {
  const userIds = [1, 2, 3, 4];

  // Loop through the array of user IDs
  for (const id of userIds) {
    // Create a dynamic test name for clear reporting
    test(`should get data for user with ID: ${id}`, async ({ request }) => {
      const response = await request.get(`${baseURL}/api/users/${id}`);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.id).toBe(id);
    });
  }
});

/**
 * Example 2: Data-driven test with complex objects
 *
 * This test uses an array of objects to test multiple failure scenarios
 * for a login endpoint.
 */
test.describe('Data-Driven Test with Complex Objects', () => {
  const testCases = [
    {
      description: 'should fail with missing password',
      payload: { email: 'eve.holt@reqres.in' },
      expectedError: 'Missing password',
    },
    {
      description: 'should fail with missing email',
      payload: { password: process.env.DUMMY_PASSWORD || 'somepassword' },
      expectedError: 'Missing email or username',
    },
  ];

  for (const tc of testCases) {
    test(tc.description, async ({ request }) => {
      const response = await request.post(`${baseURL}/api/login`, {
        data: tc.payload,
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.error).toBe(tc.expectedError);
    });
  }
});

/**
 * Example 3: Reading test data from an external JSON file
 *
 * This is a more advanced and maintainable pattern.
 */
test.describe('Data-Driven Test with External JSON File', () => {
  // Read the JSON file and parse it.
  // `path.join` creates a correct file path regardless of the operating system.
  // `__dirname` is a Node.js variable that gives you the directory of the current file.
  const usersToTest = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
  );

  for (const user of usersToTest) {
    test(`should validate user from file: ${user.name}`, async ({ request }) => {
      const response = await request.get(`${baseURL}/api/users/${user.id}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      // Validate that the first name from the API matches the name in our data file.
      expect(body.data.first_name).toBe(user.name);
    });
  }
});