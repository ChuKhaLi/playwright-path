/**
 * @fileoverview Hands-on exercises for Lesson 14.
 *
 * To run these tests, run `npx playwright test refactoring-practice.spec.ts`
 */

import { test, expect } from '@playwright/test';

/**
 * The "Before" State: A Messy Test File
 *
 * This test file works, but it has several problems:
 * - It tests multiple resources (users and posts) in the same file.
 * - It has a lot of duplicated code (e.g., the baseURL).
 * - The test names are not very descriptive.
 * - It's hard to read and understand what's being tested.
 *
 * Your task is to refactor this file into a well-structured suite.
 */
test.describe('Original Messy Tests', () => {
  test('first test', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users');
    expect(response.status()).toBe(200);
  });

  test('second test', async ({ request }) => {
    const response = await request.post('https://reqres.in/api/users', {
      data: { name: 'test', job: 'test' },
    });
    expect(response.status()).toBe(201);
  });

  test('third test', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/posts/1');
    expect(response.status()).toBe(200);
  });
});

/**
 * Exercise: Refactor the Messy Tests
 *
 * Objective: Apply the best practices from the lesson to clean up the tests above.
 *
 * Task:
 * 1. Create two new `test.describe` blocks: one for "Users Resource" and one for "Posts Resource".
 * 2. Move the user-related tests into the "Users Resource" block.
 * 3. Move the post-related test into the "Posts Resource" block.
 * 4. Give each test a descriptive name using the "should" convention.
 *    - e.g., 'should get a list of users'
 *    - e.g., 'should create a new user'
 *    - e.g., 'should get a single post'
 * 5. (Bonus) Create a simple helper function or API client to make the tests even cleaner.
 *
 * You can write your refactored code below this comment.
 */

// TODO: Write your refactored tests here.