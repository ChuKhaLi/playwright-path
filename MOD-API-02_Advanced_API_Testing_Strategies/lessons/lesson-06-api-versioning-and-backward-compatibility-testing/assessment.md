# Lesson 6: Assessment

## Knowledge Check

1.  **Question:** Which of the following is considered a "breaking change" that would require a new major API version?
    *   a) Adding a new, optional field to a response.
    *   b) Renaming an existing field in a response.
    *   c) Adding a new endpoint to the API.
    *   d) Improving the performance of an existing endpoint.

2.  **Question:** What is the primary goal of backward compatibility testing?
    *   a) To ensure that the newest version of the API works correctly.
    *   b) To test if the API server can handle multiple versions at once.
    *   c) To verify that deploying a new API version does not break existing clients that use an older version.
    *   d) To force all clients to upgrade to the new version.

3.  **Question:** Which versioning strategy involves putting the version number in the URL path, like `/v1/users`?
    *   a) Header Versioning
    *   b) Query Parameter Versioning
    *   c) Semantic Versioning
    *   d) URI Versioning

## Practical Exercise

### Objective

Write a test that checks for backward compatibility between two versions of an API.

### Scenario

You have an API for user profiles.
-   **v1** (`/api/v1/users/1`) returns a user object with `id`, `name`, and `email`.
-   A new **v2** (`/api/v2/users/1`) is being introduced. It's a non-breaking change that adds a new field, `isActive: boolean`.

Your task is to write a test that confirms the v1 endpoint still works as expected on a server that supports both v1 and v2.

### Requirements

1.  Create a new test file `versions.spec.ts`.
2.  Define a Zod schema for the `v1` user response (`userV1Schema`). It should only contain `id`, `name`, and `email`.
3.  Write a test named "v1 user endpoint should remain backward compatible".
4.  In the test, make a `GET` request to `/api/v1/users/1`.
5.  Assert that the response is successful (`200 OK`).
6.  Parse the JSON response.
7.  Use your `userV1Schema` to validate the response. The key is that even if the server *sends* the new `isActive` field (which it might), your v1 schema should correctly parse and validate the fields it knows about, ignoring the extra one. Zod does this by default.
8.  Assert that the schema validation is successful.

### Solution

**1. Schema Definition**

```typescript
// schemas/user.v1.schema.ts
import { z } from 'zod';

export const userV1Schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});
```

**2. Test File**

```typescript
// tests/api/versions.spec.ts
import { test, expect } from '@playwright/test';
import { userV1Schema } from '../../schemas/user.v1.schema';

// This is a mock of the server's response for a v1 request.
// In a real test, the server would handle this routing.
// Notice it includes the new 'isActive' field that v1 clients don't know about.
const mockV1ApiResponse = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  isActive: true, // The new field from v2
};

test.describe('API Versioning', () => {
  test('v1 user endpoint should remain backward compatible', async ({ page }) => {
    // We use page.route to simulate the server response for this exercise.
    await page.route('**/api/v1/users/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockV1ApiResponse),
      });
    });

    // We need to use page.request, as the regular request fixture doesn't share routes.
    const response = await page.request.get('/api/v1/users/1');
    expect(response.ok()).toBe(true);

    const userData = await response.json();

    // Validate the response against the V1 schema.
    // Zod will ignore the extra 'isActive' field by default, which is what we want to test.
    const validationResult = userV1Schema.safeParse(userData);

    expect(validationResult.success, 'V1 schema validation failed').toBe(true);
  });
});