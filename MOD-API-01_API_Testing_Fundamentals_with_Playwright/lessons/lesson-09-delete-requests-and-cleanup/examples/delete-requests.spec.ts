/**
 * @fileoverview This file contains examples of DELETE requests and cleanup patterns.
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in';

test.describe('DELETE Request Examples', () => {
  /**
   * Example 1: Basic DELETE request
   * This test sends a DELETE request and verifies the status code.
   */
  test('should delete a user and return 204 No Content', async ({ request }) => {
    // In a real scenario, you would first create a user to delete.
    // For this example, we'll just call the DELETE endpoint directly.
    const response = await request.delete(`${baseURL}/api/users/2`);

    // 1. Assert the status code is 204 No Content
    expect(response.status()).toBe(204);

    // 2. Assert that the response body is empty
    // Calling .text() on a response with no body will return an empty string.
    expect(await response.text()).toBe('');
  });

  /**
   * Example 2: The "DELETE-Verify" pattern
   * This test deletes a resource and then verifies it's gone by trying to GET it.
   */
  test('should verify a resource is gone after deletion', async ({ request }) => {
    const userIdToDelete = 2;

    // 1. Send the DELETE request
    const deleteResponse = await request.delete(`${baseURL}/api/users/${userIdToDelete}`);
    expect(deleteResponse.status()).toBe(204);

    // 2. Send a GET request to the same endpoint to verify deletion
    const getResponse = await request.get(`${baseURL}/api/users/${userIdToDelete}`);

    // 3. Assert that the resource is now Not Found
    expect(getResponse.status()).toBe(404);
  });

  /**
   * Example 3: Using afterEach for cleanup
   * This example shows how to create data in a test and ensure it gets cleaned up
   * automatically after the test runs, whether it passes or fails.
   */
  test.describe('Data Cleanup with afterEach', () => {
    let createdUserId: string;

    // This hook runs after each test in this 'describe' block.
    test.afterEach(async ({ request }) => {
      // If a user was created in the test, send a request to delete them.
      if (createdUserId) {
        console.log(`Cleaning up user with ID: ${createdUserId}`);
        const response = await request.delete(`${baseURL}/api/users/${createdUserId}`);
        // We can even assert that the cleanup was successful.
        expect(response.status()).toBe(204);
      }
    });

    test('should create a user that gets cleaned up automatically', async ({ request }) => {
      const newUser = { name: 'Cleanup Test', job: 'Temporary' };
      const response = await request.post(`${baseURL}/api/users`, {
        data: newUser,
      });

      expect(response.status()).toBe(201);
      const body = await response.json();

      // Store the ID so the afterEach hook can use it.
      createdUserId = body.id;
      console.log(`Created user with ID: ${createdUserId}`);

      // ... other assertions for the test would go here ...
      expect(body.name).toBe(newUser.name);
    });
  });
});