/**
 * @fileoverview Hands-on exercises for Lesson 7.
 *
 * To run these tests, run `npx playwright test post-request-practice.spec.ts`
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in';

/**
 * Exercise 1: Successful Creation (Happy Path)
 *
 * Objective: Practice creating a resource and validating the successful response.
 */
test.describe('Exercise 1: Successful Creation', () => {
  /**
   * Task:
   * 1. Define a `newJob` object with `name` and `job` properties.
   * 2. Make a POST request to `/api/users` with the `newJob` object.
   * 3. Assert that the response status is 201.
   * 4. Parse the response body.
   * 5. Assert that the `name` and `job` in the response match what you sent.
   * 6. Assert that the response contains a string `id` and a string `createdAt` timestamp.
   */
  test('should create a new job and validate the response', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 2: Testing Input Validation (Sad Path)
 *
 * Objective: Verify that the API correctly handles invalid input.
 */
test.describe('Exercise 2: Input Validation', () => {
  /**
   * Task:
   * 1. The `/api/login` endpoint requires both `email` and `password`.
   * 2. Make a POST request to `/api/login` with a payload that is missing the `password`.
   *    e.g., { email: 'peter@klaven' }
   * 3. Assert that the response status is 400.
   * 4. Parse the response body.
   * 5. Assert that the response body has an `error` property with the value "Missing password".
   */
  test('should return an error for missing password on login', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 3: Verifying Creation with a GET Request
 *
 * Objective: Combine POST and GET requests to verify that a resource was truly created.
 * Note: The public API `reqres.in` doesn't actually save the created user,
 * so this is a conceptual exercise. We will check that the POST is successful,
 * but a follow-up GET would fail in this specific case.
 */
test.describe('Exercise 3: Verifying Creation', () => {
  /**
   * Task:
   * 1. Create a `newUser` object with `name` and `job`.
   * 2. Make a POST request to `/api/users` to create the user.
   * 3. Assert that the POST request was successful (status 201).
   * 4. Extract the `id` from the response body of the creation request.
   * 5. Conceptually, what would the next step be to verify the user was saved?
   *    (Write your answer in a comment).
   */
  test('should create a user and then attempt to fetch them', async ({ request }) => {
    // TODO: Implement the test here.
  });
});