# Lesson 9: DELETE Requests and Cleanup

## The Final CRUD Operation: `DELETE`

You've learned to Create (`POST`), Read (`GET`), and Update (`PUT`/`PATCH`). The final core operation is **Delete (`DELETE`)**. The `DELETE` method is used to request the removal of a specific resource from the server.

Testing a `DELETE` endpoint is not just about sending the request; it's about verifying that the resource is *truly gone*.

## Making a `DELETE` Request

The `request.delete()` method is straightforward. You simply provide the URL of the resource you want to remove.

```typescript
import { test, expect } from '@playwright/test';

test('should delete a user', async ({ request }) => {
  // Act: Send the DELETE request to the specific resource URL.
  const response = await request.delete('/api/users/2');

  // Assert: Check the status code.
  expect(response.status()).toBe(204);
});
```

## The `204 No Content` Status Code

The most common and correct status code for a successful `DELETE` operation is **`204 No Content`**.

-   **Why `204`?** It signifies that the server successfully processed the request, but there is no content to send back in the response body. The resource is gone, so there's nothing to return.
-   **Testing Implication**: When you get a `204` status, you should not expect a response body. Trying to call `response.json()` on a `204` response will result in an error.

## How to *Really* Verify a Deletion

Getting a `204` status is a good sign, but it doesn't give you 100% confidence that the resource is gone. The only way to be sure is to try to access it again.

This leads to the **"DELETE-Verify"** pattern, which is often part of a larger test workflow.

### The "Create-Verify-Delete-Verify" Pattern

This is a comprehensive test pattern that covers the full lifecycle of a temporary resource.

1.  **Create (`POST`)**: Create a new resource specifically for this test.
2.  **Verify (`GET`)**: (Optional but good practice) Make a `GET` request to ensure the resource was created successfully.
3.  **Delete (`DELETE`)**: Send the `DELETE` request for the resource you just created. Assert the `204` status.
4.  **Verify (`GET` again)**: Make another `GET` request for the *same resource* and assert that you now get a **`404 Not Found`** status. This proves the deletion was successful.

```typescript
test('should create, then delete a user, then verify deletion', async ({ request }) => {
  // 1. Create the resource
  const newUser = { name: 'Test User', job: 'To be deleted' };
  const createResponse = await request.post('/api/users', { data: newUser });
  expect(createResponse.ok()).toBe(true);
  const createdUser = await createResponse.json();
  const userId = createdUser.id;

  // 3. Delete the resource
  const deleteResponse = await request.delete(`/api/users/${userId}`);
  expect(deleteResponse.status()).toBe(204);

  // 4. Verify the resource is gone
  const verifyResponse = await request.get(`/api/users/${userId}`);
  expect(verifyResponse.status()).toBe(404);
});
```

## Test Data Cleanup: Leaving a Clean Environment

Reliable automated tests should be **independent** and **repeatable**. They should not fail because of data left over from a previous test run. This is where **test data cleanup** comes in.

**Why is cleanup important?**
-   **Prevents Test Interference**: A test that creates a user with a unique email will fail if a previous run of the same test already created that user and didn't clean up.
-   **Maintains a Stable Test Environment**: It keeps your test database from filling up with junk data.
-   **Ensures Reliability**: Your tests will produce the same results every time they are run.

### Cleanup Strategies with Playwright Hooks

Playwright provides "hooks" that can run code before or after your tests. The `afterEach` hook is perfect for cleanup.

-   **`test.afterEach()`**: Runs after *every single test* in a file.
-   **`test.afterAll()`**: Runs once *after all tests* in a file have finished.

Here's how you can use `afterEach` to ensure any user created in a test is deleted afterward.

```typescript
test.describe('User Management with Cleanup', () => {
  const createdUserIds = [];

  // This hook will run after each test in this describe block.
  test.afterEach(async ({ request }) => {
    // Delete all users that were created during the test.
    for (const userId of createdUserIds) {
      await request.delete(`/api/users/${userId}`);
    }
    // Clear the array for the next test.
    createdUserIds.length = 0;
  });

  test('should create a user', async ({ request }) => {
    const newUser = { name: 'Temporary User', job: 'Tester' };
    const response = await request.post('/api/users', { data: newUser });
    const body = await response.json();

    // Store the ID of the created user so the afterEach hook can find it.
    createdUserIds.push(body.id);

    expect(response.status()).toBe(201);
  });

  test('should create another user', async ({ request }) => {
    const newUser = { name: 'Another Temp User', job: 'Developer' };
    const response = await request.post('/api/users', { data: newUser });
    const body = await response.json();

    createdUserIds.push(body.id);

    expect(response.status()).toBe(201);
  });
});
```
In this example, no matter which test creates a user, the `afterEach` hook guarantees it will be deleted, leaving the system clean for the next test run.

## Summary

-   Use `request.delete()` to remove a resource.
-   The expected status code for a successful deletion is **`24 No Content`**.
-   The most reliable way to test a deletion is to use the **DELETE-Verify** pattern: `DELETE` the resource, then `GET` it again and assert a `404` status.
-   **Test data cleanup** is essential for reliable automation.
-   Use Playwright hooks like **`test.afterEach()`** to automatically clean up any data your tests create.

## Next Steps

You have now mastered all four core CRUD operations! You are ready to move on to more advanced, real-world topics that build on this foundation.
-   **Lesson 10**: Handling Authentication in API Tests