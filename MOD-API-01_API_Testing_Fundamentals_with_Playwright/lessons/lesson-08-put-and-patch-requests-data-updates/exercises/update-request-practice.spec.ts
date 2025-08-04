/**
 * @fileoverview Hands-on exercises for Lesson 8.
 *
 * To run these tests, run `npx playwright test update-request-practice.spec.ts`
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in';

/**
 * Exercise 1: Full Update with PUT
 *
 * Objective: Practice replacing a resource completely using PUT.
 */
test.describe('Exercise 1: Full Update with PUT', () => {
  /**
   * Task:
   * 1. Define a `fullUpdatePayload` object with `name` and `job` properties.
   * 2. Make a PUT request to `/api/users/3`.
   * 3. Assert that the response status is 200.
   * 4. Parse the response body.
   * 5. Assert that the `name` and `job` in the response match your payload.
   * 6. Assert that the response contains an `updatedAt` property.
   */
  test('should replace a user resource using PUT', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 2: Partial Update with PATCH
 *
 * Objective: Practice modifying a single field of a resource using PATCH.
 */
test.describe('Exercise 2: Partial Update with PATCH', () => {
  /**
   * Task:
   * 1. Define a `partialUpdatePayload` object with only a `job` property.
   * 2. Make a PATCH request to `/api/users/4`.
   * 3. Assert that the response status is 200.
   * 4. Parse the response body.
   * 5. Assert that the `job` property in the response matches what you sent.
   */
  test('should modify a user resource using PATCH', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 3: The GET-UPDATE-GET Pattern
 *
 * Objective: Implement a robust test to verify a partial update.
 */
test.describe('Exercise 3: GET-UPDATE-GET Pattern', () => {
  /**
   * Task:
   * 1. Make a GET request to `/api/users/5` to get the original user data.
   *    Store the user's `first_name`.
   * 2. Define a `patchPayload` with a new `job` title.
   * 3. Make a PATCH request to `/api/users/5` with the `patchPayload`.
   * 4. Assert that the PATCH request was successful (status 200).
   * 5. In a real-world scenario with a persistent database, you would make another
   *    GET request here to verify the changes. For this exercise, just validate
   *    the response from the PATCH request.
   * 6. Assert that the `job` in the PATCH response is correct.
   * 7. Conceptually, what would you assert about the `first_name` if you could
   *    fetch the user again? Write your answer in a comment.
   */
  test('should verify a partial update', async ({ request }) => {
    // TODO: Implement the test here.
  });
});