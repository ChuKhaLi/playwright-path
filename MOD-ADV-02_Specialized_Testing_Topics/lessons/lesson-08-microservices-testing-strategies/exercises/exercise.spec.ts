import { test, expect } from '@playwright/test';

/**
 * Exercise: Mock an API Response
 *
 * Objective:
 * To practice using `page.route()` to mock an API response and test
 * how the frontend handles it.
 *
 * Instructions:
 * 1. Target URL: We will use a public API for this exercise. Let's use the
 *    JSONPlaceholder API: 'https://jsonplaceholder.typicode.com/users/1'.
 * 2. Create a test that navigates to a page that would theoretically fetch this data.
 *    Since we don't have a frontend, we will navigate to 'https://example.com'
 *    and imagine it makes this API call.
 * 3. Use `page.route()` to intercept any request to 'https://jsonplaceholder.typicode.com/users/1'.
 * 4. In the route handler, provide a mock response with your own user data.
 *    For example: `{ id: 1, name: 'Test User', email: 'test@user.com' }`.
 * 5. After setting up the route, navigate to 'https://example.com'.
 * 6. To verify the mock worked, you can listen for the 'response' event and check
 *    that the response for your target URL was the one you mocked.
 *
 * Bonus Challenge:
 * - Create a second test where you mock a **failed** API response.
 * - Use `route.fulfill()` to return a `status: 500` error.
 * - How would you test that the frontend displays an appropriate error message
 *   in this scenario? (You can just write the assertion as a comment).
 */

test.describe('API Mocking Exercises', () => {
  test('should successfully mock a user API response', async ({ page }) => {
    // Your code goes here
    let mockedResponseReceived = false;

    await page.route('https://jsonplaceholder.typicode.com/users/1', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Test User',
          email: 'test@user.com',
        }),
      });
    });

    page.on('response', async (response) => {
      if (response.url() === 'https://jsonplaceholder.typicode.com/users/1') {
        const json = await response.json();
        expect(json.name).toBe('Test User');
        mockedResponseReceived = true;
      }
    });

    // We can't actually see the result on example.com, so we'll use fetch
    // to prove our mock is working.
    await page.goto('https://example.com');
    await page.evaluate(() =>
      fetch('https://jsonplaceholder.typicode.com/users/1')
    );

    expect(mockedResponseReceived).toBe(true);
  });
});