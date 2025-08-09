/**
 * @fileoverview Hands-on exercises for Lesson 15.
 *
 * To run these tests, run `npx playwright test hybrid-practice.spec.ts`
 */

import { test, expect } from '@playwright/test';

/**
 * Exercise: API for Setup, UI for Verification
 *
 * Objective: Practice using an API call to set up a state that you then verify in the UI.
 */
test.describe('Exercise: Hybrid Testing', () => {
  /**
   * Scenario:
   * A user wants to log in. Instead of creating a user through the UI, we will
   * create them via an API call first, and then use the UI to log in and verify
   * that the login is successful.
   *
   * Task:
   * 1. Inside the test, make a POST request to `https://reqres.in/api/register`.
   * 2. The payload should be `{ email: 'eve.holt@reqres.in', password: process.env.DUMMY_PASSWORD || 'a-good-password' }`.
   *    (Note: The password can be anything for this public API).
   * 3. Assert that the API call is successful (status 200) and that it returns a token.
   * 4. Now, use the `page` fixture to navigate to a login page. We will use
   *    `https://www.automationexercise.com/login` for this.
   * 5. Fill in the login form using the same email and password from the API call.
   * 6. Click the login button.
   * 7. Assert that the user is successfully logged in by checking that the "Logged in as"
   *    text is visible on the page.
   */
  test('should register a user via API and then log in via UI', async ({ request, page }) => {
    // TODO: Implement the API setup step here.

    // TODO: Implement the UI action and verification steps here.
  });
});