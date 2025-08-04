/**
 * @fileoverview Hands-on exercises for Lesson 6.
 *
 * To run these tests, run `npx playwright test get-request-practice.spec.ts`
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in';

/**
 * Exercise 1: Get a Single Resource
 *
 * Objective: Fetch a single resource and perform detailed validation.
 */
test.describe('Exercise 1: Get a Single Resource', () => {
  /**
   * Task:
   * 1. Make a GET request to fetch the user with ID 3.
   * 2. Assert that the status code is 200.
   * 3. Assert that the `Content-Type` header includes `application/json`.
   * 4. Parse the response body.
   * 5. Assert that the `id` is 3 and the `first_name` is "Emma".
   * 6. Assert that the `avatar` property is a string that contains "reqres.in".
   */
  test('should get a single user and perform detailed validation', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 2: Work with Collections
 *
 * Objective: Fetch a list of resources and validate the collection.
 */
test.describe('Exercise 2: Work with Collections', () => {
  /**
   * Task:
   * 1. Make a GET request to fetch the list of "unknown" resources (`/api/unknown`).
   * 2. Assert that the status code is 200.
   * 3. Parse the response body.
   * 4. Assert that the `data` property is an array.
   * 5. Assert that the array has a specific length (check the `per_page` property).
   * 6. Assert that the array contains an object with the `name` "true red".
   */
  test('should get a list of resources and validate the collection', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 3: Test Query Parameters
 *
 * Objective: Verify that the API correctly handles query parameters.
 */
test.describe('Exercise 3: Test Query Parameters', () => {
  /**
   * Task:
   * 1. Make a GET request to `/api/users` with a `delay` query parameter of 3 seconds.
   *    (The API will wait 3 seconds before responding).
   * 2. Assert that the status code is 200.
   * 3. To verify the delay, you can measure the time it takes to get the response.
   *    - Record the time *before* making the request (`Date.now()`).
   *    - Record the time *after* the request is complete.
   *    - Assert that the difference is greater than 3000 milliseconds.
   */
  test('should handle a delay query parameter', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 4: Handle API Errors
 *
 * Objective: Write a test for a "sad path" to ensure the API fails correctly.
 */
test.describe('Exercise 4: Handle API Errors', () => {
  /**
   * Task:
   * 1. Make a GET request to an endpoint that doesn't exist, e.g., `/api/unknown/23`.
   * 2. Assert that the response status is 404.
   * 3. Assert that the `response.ok()` method returns `false`.
   */
  test('should receive a 404 for a non-existent resource', async ({ request }) => {
    // TODO: Implement the test here.
  });
});