/**
 * @fileoverview Hands-on exercises for Lesson 13.
 *
 * To run these tests, run `npx playwright test data-driven-practice.spec.ts`
 */

import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in';

/**
 * Exercise 1: Data-Driven Test for Single Users
 *
 * Objective: Convert a simple test into a data-driven one using an inline array.
 */
test.describe('Exercise 1: Data-Driven GET Requests', () => {
  /**
   * Task:
   * 1. Create a `testData` array containing the numbers 1, 2, 3, 4, 5, and 6.
   * 2. Use a `for...of` loop to iterate over the `testData` array.
   * 3. Inside the loop, create a test with a dynamic name, e.g., `should get user with ID: {id}`.
   * 4. In the test, make a GET request to `/api/users/{id}` using the current ID from the loop.
   * 5. Assert that the response status is 200.
   * 6. Assert that the `id` in the response body matches the ID from the loop.
   */
  // TODO: Implement the data-driven test here.
});

/**
 * Exercise 2: Data-Driven Test for Error Cases
 *
 * Objective: Use a data-driven approach to test multiple invalid inputs.
 */
test.describe('Exercise 2: Data-Driven Error Handling', () => {
  /**
   * Task:
   * 1. Create a `testCases` array of objects. Each object should have:
   *    - A `description` (e.g., 'should fail with an invalid email format').
   *    - A `payload` object for the request body.
   *    - An `expectedError` string.
   * 2. Create at least two test cases:
   *    - One for a successful login (use 'eve.holt@reqres.in' and a dummy password).
   *      - For the successful case, the `expectedError` can be `null`.
   *    - One for an unsuccessful login (use 'peter@klaven' and a dummy password).
   *      - The expected error for this user is 'user not found'.
   * 3. Loop over your `testCases` array and create a dynamic test for each.
   * 4. In each test, make a POST request to `/api/login`.
   * 5. If `expectedError` is not null, assert the status is 400 and the error message matches.
   * 6. If `expectedError` is null, assert the status is 200 and the response has a `token`.
   */
  // TODO: Implement the data-driven test for login scenarios here.
});

/**
 * Exercise 3: Reading from an External File
 *
 * Objective: Practice reading test data from an external JSON file.
 *
 * Task:
 * 1. In the `data` directory for this lesson, you'll find a `users.json` file.
 * 2. Import that file into this test spec.
 * 3. Loop over the imported data.
 * 4. For each user in the data file, write a test that:
 *    - Has a dynamic name, e.g., `should get user from file: {user.name}`.
 *    - Makes a GET request to `/api/users/{user.id}`.
 *    - Asserts that the `first_name` in the response body matches the `name` from the file.
 */
// TODO: Implement the test that reads from the external users.json file.