/**
 * @fileoverview Hands-on exercises for Lesson 5.
 *
 * Before you begin, make sure you have a Playwright project set up.
 * If you don't, run `npm init playwright@latest` in your terminal.
 *
 * To run these tests, open your terminal and run the command:
 * `npx playwright test`
 *
 * To focus on just this test file, you can run:
 * `npx playwright test first-api-tests.spec.ts`
 */

import { test, expect } from '@playwright/test';

// We will use https://reqres.in/ for our exercises.
// It's a great public API for practicing.
const baseURL = 'https://reqres.in';

/**
 * Exercise 1: Your First GET Request
 *
 * Objective: Make a simple GET request and validate the response.
 */
test.describe('Exercise 1: GET Requests', () => {
  /**
   * Task:
   * 1. Make a GET request to `/api/users/2`.
   * 2. Assert that the response status is 200.
   * 3. Parse the response body as JSON.
   * 4. Assert that the user's ID is 2.
   * 5. Assert that the user's email is 'janet.weaver@reqres.in'.
   */
  test('should get a single user and validate their data', async ({ request }) => {
    // TODO: Implement the test here.
    // Refer to the examples if you get stuck!
  });
});

/**
 * Exercise 2: Your First POST Request
 *
 * Objective: Create a new resource using a POST request and validate the server's response.
 */
test.describe('Exercise 2: POST Requests', () => {
  /**
   * Task:
   * 1. Define a `newUser` object with `name` and `job` properties.
   *    - e.g., { name: 'Your Name', job: 'QA Engineer' }
   * 2. Make a POST request to `/api/users`, sending the `newUser` object as the payload.
   * 3. Assert that the response status is 201.
   * 4. Parse the response body as JSON.
   * 5. Assert that the `name` and `job` in the response body match what you sent.
   * 6. Assert that the response body has an `id` property.
   */
  test('should create a new user and validate the response', async ({ request }) => {
    // TODO: Implement the test here.
  });
});

/**
 * Exercise 3: Debugging a Failing Test
 *
 * Objective: Learn to debug a common API testing failure.
 *
 * The test below is designed to fail. Your task is to fix it.
 */
test.describe('Exercise 3: Debugging', () => {
  /**
   * The Problem: This test is trying to get a user with ID 23, which doesn't exist.
   * The API correctly returns a 404 Not Found status, but the test is expecting a 200.
   *
   * Task:
   * 1. Run the test and observe the failure message in your terminal.
   * 2. Change the assertion to correctly expect the 404 status code.
   * 3. Run the test again to confirm it passes.
   */
  test('should correctly handle a 404 Not Found error', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/users/23`);

    // This assertion is incorrect. Fix it!
    expect(response.status()).toBe(200);
  });
});

/**
 * Bonus Exercise: Using `playwright.config.ts`
 *
 * Objective: Clean up your tests by using a `baseURL`.
 *
 * Task:
 * 1. Open your `playwright.config.ts` file.
 * 2. Add a `use` section and set the `baseURL` to 'https://reqres.in'.
 *    ```
 *    use: {
 *      baseURL: 'https://reqres.in',
 *    },
 *    ```
 * 3. Come back to this file and remove the `baseURL` constant from the top.
 * 4. Update all your requests to use relative paths (e.g., `/api/users/2`).
 * 5. Run your tests again to ensure they still pass.
 */