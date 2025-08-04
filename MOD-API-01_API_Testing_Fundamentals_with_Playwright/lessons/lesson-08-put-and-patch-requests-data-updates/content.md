# Lesson 8: PUT and PATCH Requests for Data Updates

## Modifying Data: The Two Flavors of Update

When you need to change existing data, REST provides two different methods: `PUT` and `PATCH`. They might seem similar, but they have a critical difference in how they operate.

-   **`PUT`**: Replaces the **entire** resource with the new data you provide. If you omit a field in your request, the server will likely remove that field or set it to a default value.
-   **`PATCH`**: Applies a **partial** update to the resource. You only send the fields you want to change, and the server leaves the other fields as they are.

| Method | Action | Payload | Use Case |
|---|---|---|---|
| `PUT` | **Replace** | The complete resource object | Editing a user's entire profile at once. |
| `PATCH` | **Modify** | Only the fields to be changed | Changing just a user's email address. |

## Testing `PUT` Requests: Complete Replacement

When you test a `PUT` request, you are verifying that the resource is completely overwritten with the new data.

The typical status code for a successful `PUT` or `PATCH` is **`200 OK`**.

```typescript
import { test, expect } from '@playwright/test';

test('should completely update a user with PUT', async ({ request }) => {
  // Arrange: Define the complete new state for the user.
  const updatedUser = {
    name: 'morpheus',
    job: 'zion resident', // The job has changed
    // Note: We are providing all fields, even those that don't change.
  };

  // Act: Send the PUT request.
  const response = await request.put('/api/users/2', {
    data: updatedUser,
  });

  // Assert
  expect(response.status()).toBe(200);
  const body = await response.json();

  // Verify that the resource now matches our payload exactly.
  expect(body.name).toBe(updatedUser.name);
  expect(body.job).toBe(updatedUser.job);

  // Check the server-generated 'updatedAt' timestamp.
  expect(body).toHaveProperty('updatedAt');
});
```

### Idempotency and `PUT`

A key concept for `PUT` is **idempotency**. This means that making the same `PUT` request multiple times should have the same effect as making it once. The resource's state will be the same after the first call and after any subsequent calls.

**How to test for idempotency:**
1.  Send a `PUT` request.
2.  Assert it was successful.
3.  Send the *exact same* `PUT` request again.
4.  Assert that it was also successful and the resource state is unchanged.

## Testing `PATCH` Requests: Partial Updates

When testing a `PATCH` request, your main goal is to verify two things:
1.  The fields you sent were updated correctly.
2.  The fields you *didn't* send were left untouched.

```typescript
import { test, expect } from '@playwright/test';

test('should partially update a user with PATCH', async ({ request }) => {
  // Arrange: First, get the original user data to compare against later.
  const originalResponse = await request.get('/api/users/2');
  const originalUser = (await originalResponse.json()).data;

  // Define only the field we want to change.
  const patchData = {
    job: 'lead software engineer',
  };

  // Act: Send the PATCH request.
  const patchResponse = await request.patch('/api/users/2', {
    data: patchData,
  });

  // Assert
  expect(patchResponse.status()).toBe(200);
  const updatedUser = await patchResponse.json();

  // 1. Assert that the 'job' field was updated.
  expect(updatedUser.job).toBe(patchData.job);

  // 2. Assert that the 'name' field (which we didn't send) was NOT changed.
  // This is a critical part of a PATCH test!
  // Note: reqres.in doesn't return the full object, so we can't do this here.
  // In a real API, you would do this:
  // expect(updatedUser.name).toBe(originalUser.name);
});
```

## The Test Workflow for Updates

A robust test for an update operation often involves three steps:

1.  **`GET`**: Fetch the initial state of the resource.
2.  **`PUT` / `PATCH`**: Perform the update.
3.  **`GET`**: Fetch the resource again and assert that its state matches the expected updated state.

This "GET-UPDATE-GET" pattern provides the highest confidence that your update worked correctly and was persisted by the server.

## Summary

-   Use **`PUT`** to **replace** an entire resource. Your test should verify that the resource's new state exactly matches the payload you sent.
-   Use **`PATCH`** to **modify** parts of a resource. Your test must verify that the specified fields were changed and that other fields were **not** changed.
-   The expected success status code for updates is typically **`200 OK`**.
-   `PUT` requests should be **idempotent** (making the same call multiple times has the same result).
-   The **GET-UPDATE-GET** pattern is a reliable way to structure your update tests.

## Next Steps

You have now mastered the "U" (Update) in CRUD. The final core operation is "D" for Delete.
-   **Lesson 9**: DELETE Requests and Cleanup