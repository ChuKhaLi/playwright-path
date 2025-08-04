/**
 * @fileoverview Hands-on exercises for Lesson 9.
 *
 * To run these tests, run `npx playwright test delete-request-practice.spec.ts`
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in';

/**
 * Exercise 1: Basic Deletion
 *
 * Objective: Practice sending a DELETE request and validating the response.
 */
test.describe('Exercise 1: Basic Deletion', () => {
  /**
   * Task:
   * 1. Make a DELETE request to remove the user with ID 5 (`/api/users/5`).
   * 2. Assert that the response status is 204.
   * 3. Assert that the response body is empty.
   */
  test('should delete a user and validate the response', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 2: The DELETE-Verify Pattern
 *
 * Objective: Write a robust test that confirms a resource is truly gone after deletion.
 */
test.describe('Exercise 2: DELETE-Verify Pattern', () => {
  /**
   * Task:
   * 1. Make a DELETE request to `/api/users/6`.
   * 2. Assert that the delete request was successful (status 204).
   * 3. Make a second request: a GET request to the same URL (`/api/users/6`).
   * 4. Assert that the GET request fails with a 404 status code.
   */
  test('should verify a resource is inaccessible after deletion', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 3: Test Data Cleanup
 *
 * Objective: Practice using a Playwright hook to clean up test data.
 */
test.describe('Exercise 3: Test Data Cleanup', () => {
  let resourceIdToCleanUp: string | null = null;

  /**
   * Task 1: Implement the `afterEach` hook.
   * Inside this hook, check if `resourceIdToCleanUp` has a value.
   * If it does, send a DELETE request to `/api/users/{resourceIdToCleanUp}`.
   * This will ensure any resource created in the tests below is removed.
   */
  test.afterEach(async ({ request }) => {
    // TODO: Implement the cleanup logic here.
  });

  /**
   * Task 2: Write a test that creates a resource.
   * This test should create a new user and store their ID in the
   * `resourceIdToCleanUp` variable so the hook can delete them.
   */
  test('should create a resource that will be cleaned up', async ({ request }) => {
    const newUser = { name: 'Test', job: 'Cleanup' };
    const response = await request.post(`${baseURL}/api/users`, { data: newUser });
    expect(response.status()).toBe(201);
    const body = await response.json();

    // TODO: Store the ID for cleanup.
    // resourceIdToCleanUp = ...
  });
});