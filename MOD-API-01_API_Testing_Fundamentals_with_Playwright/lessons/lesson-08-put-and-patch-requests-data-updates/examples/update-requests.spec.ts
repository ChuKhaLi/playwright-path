/**
 * @fileoverview This file contains examples of PUT and PATCH requests.
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in';

test.describe('Update Request Examples', () => {
  /**
   * Example 1: Full update with PUT
   * This test completely replaces a user's data.
   */
  test('should fully update a user with PUT', async ({ request }) => {
    const fullUpdate = {
      name: 'morpheus',
      job: 'zion resident',
      email: 'morpheus.new@reqres.in', // Adding a new field
    };

    const response = await request.put(`${baseURL}/api/users/2`, {
      data: fullUpdate,
    });

    // 1. Assert the status code is 200 OK
    expect(response.status()).toBe(200);

    // 2. Assert the response body reflects the complete update
    const body = await response.json();
    expect(body.name).toBe(fullUpdate.name);
    expect(body.job).toBe(fullUpdate.job);
    expect(body.email).toBe(fullUpdate.email);

    // 3. Assert that an 'updatedAt' timestamp is present
    expect(body).toHaveProperty('updatedAt');
  });

  /**
   * Example 2: Partial update with PATCH
   * This test updates only one field of a user's data.
   */
  test('should partially update a user with PATCH', async ({ request }) => {
    const partialUpdate = {
      job: 'lead software engineer',
    };

    const response = await request.patch(`${baseURL}/api/users/2`, {
      data: partialUpdate,
    });

    // 1. Assert the status code is 200 OK
    expect(response.status()).toBe(200);

    // 2. Assert the response body shows the updated field
    const body = await response.json();
    expect(body.job).toBe(partialUpdate.job);

    // Note: A real API test would also verify that other fields (like 'name')
    // were NOT changed. This requires fetching the resource before the update.
  });

  /**
   * Example 3: The GET-UPDATE-GET pattern
   * This test demonstrates a robust way to verify an update.
   */
  test('should use GET-UPDATE-GET pattern to verify a PATCH update', async ({ request }) => {
    const userId = 2;

    // 1. GET: Fetch the original resource
    const getResponse1 = await request.get(`${baseURL}/api/users/${userId}`);
    const originalUser = (await getResponse1.json()).data;
    console.log('Original User:', originalUser);

    // 2. PATCH: Perform the partial update
    const updatePayload = { job: 'senior qa' };
    const patchResponse = await request.patch(`${baseURL}/api/users/${userId}`, {
      data: updatePayload,
    });
    expect(patchResponse.status()).toBe(200);
    const patchBody = await patchResponse.json();
    console.log('PATCH Response Body:', patchBody);

    // 3. GET: Fetch the resource again to confirm the change was persisted
    // Note: reqres.in doesn't persist changes, so this step is conceptual.
    // In a real test, the following would be the final validation.
    /*
    const getResponse2 = await request.get(`${baseURL}/api/users/${userId}`);
    const updatedUser = (await getResponse2.json()).data;
    console.log('Updated User:', updatedUser);

    // Assert that the job was updated
    expect(updatedUser.job).toBe(updatePayload.job);
    // Assert that the name was NOT changed
    expect(updatedUser.first_name).toBe(originalUser.first_name);
    */
  });
});