# Lesson 15: Module Recap and Integration Testing

## You've Come a Long Way!

Congratulations! You have journeyed from the fundamentals of HTTP to building a well-structured, data-driven API test suite. Let's quickly recap the core skills you've acquired:

-   **HTTP & REST**: You understand the language and the architecture of modern web APIs.
-   **JSON**: You can read, write, and validate the primary data format of the web.
-   **Playwright `request` Fixture**: You can use Playwright to make any kind of HTTP request.
-   **CRUD Operations**: You can test the full lifecycle of a resource: Create (`POST`), Read (`GET`), Update (`PUT`/`PATCH`), and Delete (`DELETE`).
-   **Authentication**: You can test secure endpoints using common authentication patterns.
-   **Error Handling**: You can write tests for "sad paths" to ensure the API is robust.
-   **Best Practices**: You know how to organize your tests to be maintainable and scalable.

Now, let's combine these skills with your E2E testing knowledge to unlock a new level of testing efficiency.

## The Power of Hybrid Testing

**Hybrid testing** (or integration testing) is the practice of using both the API (`request`) and the UI (`page`) fixtures within the same test. This allows you to use the best tool for each part of the test, leading to tests that are both fast and realistic.

**Why do this?**
-   **Speed**: UI interactions are slow. Setting up test data or state through the UI (e.g., filling out a long form) can take seconds. An API call can do the same thing in milliseconds.
-   **Stability**: API calls are not affected by UI changes, making your tests more reliable.
-   **Focus**: It allows you to focus your E2E test on the specific UI interaction you care about, while handling setup and verification through the much faster API layer.

## Pattern 1: API for Setup, UI for Action

This is the most common hybrid pattern. You use API calls to get the application into the state you need *before* you start interacting with the UI.

**Scenario**: You want to test the "My Profile" page for a newly created user.

**The Slow E2E Way:**
1.  Navigate to the registration page.
2.  Fill out the registration form.
3.  Submit the form.
4.  Navigate to the login page.
5.  Fill out the login form.
6.  Navigate to the "My Profile" page.
7.  Assert that the user's details are correct.

**The Fast Hybrid Way:**
1.  **Arrange (API)**: Make a `POST` request to `/api/users` to create a new user instantly.
2.  **Arrange (API)**: Make a `POST` request to `/api/login` to get an auth token/cookie.
3.  **Arrange (Browser)**: Add the auth cookie to the browser context.
4.  **Act (UI)**: Navigate *directly* to the "My Profile" page.
5.  **Assert (UI)**: Assert that the user's details are correct on the page.

```typescript
import { test, expect } from '@playwright/test';

test('should display profile information for a user created via API', async ({ page, request }) => {
  // 1. Arrange (API): Create the user
  const newUser = { name: 'Hybrid Test User', job: 'Tester' };
  const createResponse = await request.post('/api/users', { data: newUser });
  expect(createResponse.ok()).toBe(true);
  const user = await createResponse.json();

  // In a real app, you would now log in via API and set cookies.
  // For this example, we'll just navigate to a page that shows user data.

  // 2. Act (UI): Navigate to the page that would display the user's info
  await page.goto(`/users/${user.id}`); // This is a hypothetical page

  // 3. Assert (UI): Check that the UI correctly displays the data
  // await expect(page.getByRole('heading')).toHaveText(user.name);
  // await expect(page.getByText(user.job)).toBeVisible();
});
```

## Pattern 2: UI for Action, API for Verification

This pattern is useful when you want to test a UI action but verify its effect directly in the backend, bypassing further slow UI navigation.

**Scenario**: You want to test that submitting a "Contact Us" form correctly saves the data to the database.

**The Slow E2E Way:**
1.  Navigate to the "Contact Us" page.
2.  Fill out the form.
3.  Submit the form.
4.  Navigate to the admin panel.
5.  Log in as an admin.
6.  Navigate to the "Form Submissions" page.
7.  Find the submission in the table and verify its contents.

**The Fast Hybrid Way:**
1.  **Arrange (UI)**: Navigate to the "Contact Us" page.
2.  **Act (UI)**: Fill out and submit the form.
3.  **Assert (API)**: Make a `GET` request to `/api/submissions` (a hypothetical admin endpoint) and assert that the new submission exists and its data is correct.

```typescript
import { test, expect } from '@playwright/test';

test('should save form data correctly after UI submission', async ({ page, request }) => {
  // 1. Act (UI): Perform the user action
  await page.goto('/contact-us'); // Hypothetical page
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john.doe@example.com');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Thank you!')).toBeVisible();

  // 2. Assert (API): Verify the result directly in the backend
  const submissionsResponse = await request.get('/api/submissions');
  const submissions = await submissionsResponse.json();

  // Find the submission we just created
  const ourSubmission = submissions.find(s => s.email === 'john.doe@example.com');
  expect(ourSubmission).toBeDefined();
  expect(ourSubmission.name).toBe('John Doe');
});
```

## Summary

-   You have completed the API Testing Fundamentals module and are now equipped with a powerful set of skills.
-   **Hybrid testing** combines the speed and stability of API tests with the user-centric validation of E2E tests.
-   Use **APIs for setup** to bypass slow and irrelevant UI steps.
-   Use **APIs for verification** to directly and quickly check the backend state after a UI action.
-   By using the `page` and `request` fixtures together, you can create tests that are faster, more reliable, and more focused.

Thank you for completing this module. You are now ready to build professional, robust, and efficient automated test suites for any application. Happy testing!