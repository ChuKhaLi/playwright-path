/**
 * @fileoverview Hands-on exercises for Lesson 10.
 *
 * To run these tests, run `npx playwright test auth-practice.spec.ts`
 */

import { test, expect } from '@playwright/test';

// For a real project, these would come from environment variables.
const user = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

/**
 * Exercise 1: The Login Pattern
 *
 * Objective: Practice the full "Login -> Get Token -> Use Token" workflow.
 */
test.describe('Exercise 1: Full Authentication Workflow', () => {
  let authToken: string;

  /**
   * Task 1: Implement the `beforeAll` hook to log in and store the token.
   * 1. Make a POST request to `https://reqres.in/api/login`.
   * 2. Send the `user` object as the `data`.
   * 3. Assert that the login was successful (status 200).
   * 4. Parse the response body and store the `token` value in the `authToken` variable.
   */
  test.beforeAll(async ({ request }) => {
    // TODO: Implement the login logic here.
  });

  /**
   * Task 2: Write a test that uses the token.
   * This is a conceptual test, as reqres.in doesn't have a protected endpoint
   * that we can verify with the token. The goal is to practice the pattern.
   *
   * 1. Make a GET request to `https://reqres.in/api/users/2`.
   * 2. In the request options, add a `headers` object.
   * 3. In the `headers` object, add an `Authorization` property.
   * 4. The value should be `Bearer ${authToken}`.
   * 5. Assert that the request is successful (status 200).
   */
  test('should use a token to access a resource', async ({ request }) => {
    // TODO: Implement the test that uses the authToken.
  });
});

/**
 * Exercise 2: Testing Authentication Errors
 *
 * Objective: Practice testing how the API handles authentication failures.
 */
test.describe('Exercise 2: Authentication Error Handling', () => {
  /**
   * Task: Test a failed login attempt.
   * 1. The `/api/login` endpoint requires both email and password.
   * 2. Make a POST request to `https://reqres.in/api/login` but only send the email.
   * 3. Assert that the response status is 400.
   * 4. Assert that the response body contains an `error` property with the value "Missing password".
   */
  test('should fail to log in with a missing password', async ({ request }) => {
    // TODO: Implement the failing login test here.
  });

  /**
   * Task: Test accessing a protected resource without a token.
   * This is a conceptual test.
   *
   * 1. Make a GET request to a hypothetical protected endpoint, like `https://reqres.in/api/protected/resource`.
   * 2. Do NOT include an `Authorization` header.
   * 3. What status code would you expect the API to return? Write your answer in a comment.
   * 4. Assert that the response status matches your expectation.
   */
  test('should fail to access a protected resource without a token', async ({ request }) => {
    // TODO: Implement the test for accessing a protected resource.
    // Note: The endpoint `/api/protected/resource` doesn't exist on reqres.in,
    // so the request will return a 404. The goal here is to practice writing
    // the test structure and thinking about the expected outcome.
  });
});