/**
 * @fileoverview Hands-on exercises for Lesson 12.
 *
 * To run these tests, run `npx playwright test error-handling-practice.spec.ts`
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in';

/**
 * Exercise 1: Test for 404 Not Found
 *
 * Objective: Practice triggering and validating a 404 error.
 */
test.describe('Exercise 1: 404 Not Found', () => {
  /**
   * Task:
   * 1. Make a GET request to a resource that you know does not exist,
   *    e.g., `/api/unknown/99`.
   * 2. Assert that the response status is 404.
   * 3. Assert that `response.ok()` is false.
   */
  test('should return 404 for a non-existent resource', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 2: Test for 400 Bad Request
 *
 * Objective: Practice triggering and validating a 400 error for bad input.
 */
test.describe('Exercise 2: 400 Bad Request', () => {
  /**
   * Task:
   * 1. The `/api/register` endpoint requires an `email` and `password`.
   * 2. Make a POST request to `/api/register` with a payload that only contains an `email`.
   * 3. Assert that the response status is 400.
   * 4. Parse the response body.
   * 5. Assert that the response body has an `error` property with the value "Missing password".
   */
  test('should return 400 for an incomplete registration payload', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 3: Test a Different Input Validation Error
 *
 * Objective: Practice triggering another type of validation error.
 */
test.describe('Exercise 3: Another 400 Bad Request', () => {
  /**
   * Task:
   * 1. The `/api/login` endpoint requires both `email` and `password`.
   * 2. Make a POST request to `/api/login` with a payload that is missing the `email`.
   * 3. Assert that the response status is 400.
   * 4. Parse the response body.
   * 5. Based on the API's behavior, what is the error message? Assert that the `error`
   *    property in the response body matches this expected message.
   */
  test('should return 400 for a missing email on login', async ({ request }) => {
    // TODO: Implement the test here.
  });
});