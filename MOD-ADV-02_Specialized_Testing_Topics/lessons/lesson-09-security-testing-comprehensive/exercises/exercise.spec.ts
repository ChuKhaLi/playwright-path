import { test, expect } from '@playwright/test';

/**
 * Exercise: Test for Broken Access Control
 *
 * Objective:
 * To practice writing a test that checks for a common authorization vulnerability.
 *
 * Scenario:
 * Imagine a simple blog application with two user roles: 'editor' and 'viewer'.
 * - Viewers can read posts.
 * - Editors can read and write posts.
 * The page to create a new post is at the URL '/posts/new'.
 *
 * Instructions:
 * 1. We will simulate the login process by setting a cookie or local storage item.
 * 2. Create a test for the 'viewer' role.
 *    - Before the test, set a local storage item to simulate being logged in as a 'viewer'.
 *      `await page.evaluate(() => window.localStorage.setItem('userRole', 'viewer'));`
 *    - Navigate directly to the '/posts/new' URL.
 *    - Assert that the page redirects the user or shows an "Access Denied" message.
 *      (For this exercise, we'll assert the URL is not '/posts/new').
 * 3. Create a second test for the 'editor' role.
 *    - Simulate being logged in as an 'editor'.
 *    - Navigate to '/posts/new'.
 *    - Assert that the page loads correctly (e.g., by checking for a title like "New Post").
 *
 * Note: Since we don't have a real application, we will use a dummy site and
 * mock the server's response to the navigation.
 */

test.describe('Access Control Exercises', () => {
  test('a viewer should not be able to access the new post page', async ({
    page,
  }) => {
    // Your code goes here
    await page.goto('https://example.com'); // Start on a neutral page
    await page.evaluate(() => window.localStorage.setItem('userRole', 'viewer'));

    // Mock the server response for the protected route
    await page.route('**/posts/new', (route) => {
      // A real app would redirect, but we'll simulate an "Access Denied" response
      route.fulfill({
        status: 403,
        body: 'Access Denied',
      });
    });

    const response = await page.goto('https://example.com/posts/new');
    expect(response?.status()).toBe(403);
  });

  test('an editor should be able to access the new post page', async ({
    page,
  }) => {
    // Your code goes here
    await page.goto('https://example.com');
    await page.evaluate(() => window.localStorage.setItem('userRole', 'editor'));

    await page.route('**/posts/new', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<h1>Create New Post</h1>',
      });
    });

    await page.goto('https://example.com/posts/new');
    await expect(page.locator('h1')).toHaveText('Create New Post');
  });
});