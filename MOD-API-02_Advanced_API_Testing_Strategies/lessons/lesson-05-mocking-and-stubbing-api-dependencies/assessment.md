# Lesson 5: Assessment

## Knowledge Check

1.  **Question:** What is the primary reason for using a mock or a stub in a test?
    *   a) To make the real service run faster.
    *   b) To isolate the service under test from its dependencies, making tests more reliable and independent.
    *   c) To avoid writing assertions.
    *   d) To make API calls to the real service.

2.  **Question:** In Playwright, which method is primarily used to implement network-level mocking for a UI test?
    *   a) `page.click()`
    *   b) `expect()`
    *   c) `page.route()`
    *   d) `request.post()`

3.  **Question:** You want to test how your web application's UI behaves when an API call is very slow. Which `page.route()` technique would you use?
    *   a) Fulfill the request immediately with an error status.
    *   b) Abort the request.
    *   c) Add a delay (e.g., using `setTimeout`) before fulfilling the request.
    *   d) Continue the request to the real server.

## Practical Exercise

### Objective

Create a UI test that uses mocking to verify two different states of a component: a success state and an empty state.

### Scenario

You are testing a "My Tasks" page at `/tasks`. This page fetches a list of tasks from the API endpoint `/api/tasks`. You need to test two scenarios:
1.  When the API returns a list of tasks, they are displayed correctly.
2.  When the API returns an empty array `[]`, a "No tasks found." message is displayed.

### Requirements

1.  Create a new test file `tasks.spec.ts`.
2.  Write a test named "should display tasks when the API returns data".
    *   Use `page.route()` to intercept `/api/tasks`.
    *   Fulfill the request with a `200 OK` status and a JSON body containing an array of at least two task objects (e.g., `[{ id: 1, title: 'Task 1' }, { id: 2, title: 'Task 2' }]`).
    *   Navigate to `/tasks`.
    *   Assert that the titles of both tasks are visible.
    *   Assert that the "No tasks found." message is **not** visible.
3.  Write a second test named "should display an empty message when the API returns no data".
    *   Use `page.route()` to intercept `/api/tasks`.
    *   Fulfill the request with a `200 OK` status and a JSON body containing an empty array `[]`.
    *   Navigate to `/tasks`.
    *   Assert that the "No tasks found." message is visible.

### Solution

```typescript
// tests/e2e/tasks.spec.ts
import { test, expect } from '@playwright/test';

test.describe('My Tasks Page', () => {
  test('should display tasks when the API returns data', async ({ page }) => {
    // Mock the API to return a list of tasks
    await page.route('**/api/tasks', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, title: 'Complete the Playwright module' },
          { id: 2, title: 'Write a new test case' },
        ]),
      });
    });

    await page.goto('/tasks');

    // Assert that task titles are visible
    await expect(page.getByText('Complete the Playwright module')).toBeVisible();
    await expect(page.getByText('Write a new test case')).toBeVisible();

    // Assert that the empty message is not present
    await expect(page.getByText('No tasks found.')).not.toBeVisible();
  });

  test('should display an empty message when the API returns no data', async ({ page }) => {
    // Mock the API to return an empty array
    await page.route('**/api/tasks', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]), // Empty list
      });
    });

    await page.goto('/tasks');

    // Assert that the empty message is visible
    await expect(page.getByText('No tasks found.')).toBeVisible();
  });
});