# Lesson 6: Making GET Requests and Assertions

## The Workhorse of API Testing: `GET`

The `GET` method is used to retrieve information from a server. It's the most common type of HTTP request, and it's fundamental to API testing. You'll use `GET` requests to:
-   Fetch a specific item (like a user profile).
-   Fetch a list of items (like all products in a category).
-   Verify that data was created or updated correctly by other tests.
-   Check that deleted data is truly gone.

## The Anatomy of a `GET` Test

A well-structured test follows the "Arrange-Act-Assert" pattern.

1.  **Arrange**: Set up any preconditions. For a simple `GET` test, this might just be defining the endpoint or expected data.
2.  **Act**: Perform the action you want to test. In this case, making the `GET` request using `request.get()`.
3.  **Assert**: Verify the outcome. This is the most critical part, where you check the response status, headers, and body to ensure the API behaved as expected.

```typescript
import { test, expect } from '@playwright/test';

test('should get user details', async ({ request }) => {
  // Arrange: Define the user ID we want to fetch.
  const userId = 2;

  // Act: Make the GET request.
  const response = await request.get(`/api/users/${userId}`);

  // Assert: Validate the response.
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.data.id).toBe(userId);
});
```

## Testing Single Resources

This is the simplest scenario: you request a single item, and you get a single object back.

### Key Assertions for Single Resources:
-   **Status Code**: Should be `200 OK`.
-   **Headers**: `Content-Type` should typically be `application/json`.
-   **Response Body**:
    -   The `id` should match the one you requested.
    -   All expected properties should be present (`toHaveProperty`).
    -   The data types of the properties should be correct (`typeof`).
    -   Specific values should match expected results.

```typescript
test('should validate a single user response thoroughly', async ({ request }) => {
  const response = await request.get('/api/users/2');

  // Assert Status
  expect(response.ok()).toBe(true); // .ok() checks for any 2xx status

  // Assert Headers
  expect(response.headers()['content-type']).toContain('application/json');

  // Assert Body
  const body = await response.json();
  expect(body.data).toHaveProperty('id', 2);
  expect(body.data).toHaveProperty('first_name', 'Janet');
  expect(typeof body.data.id).toBe('number');
  expect(typeof body.data.first_name).toBe('string');
});
```

## Testing Collections of Resources (Arrays)

Often, you'll test endpoints that return a list of items, which comes back as a JSON array.

### Key Assertions for Collections:
-   **Status Code**: Should be `200 OK`.
-   **Response Body**:
    -   The body itself should be an array (`Array.isArray()`).
    -   The array's length can be checked (`toHaveLength`).
    -   You can iterate over the array to check each object.
    -   You can check if the array contains an object with specific properties.

```typescript
test('should validate a list of users', async ({ request }) => {
  const response = await request.get('/api/users?page=2');

  expect(response.status()).toBe(200);
  const body = await response.json();

  // Assert that the main data property is an array
  expect(Array.isArray(body.data)).toBe(true);

  // Assert that we got the expected number of items
  expect(body.data).toHaveLength(6);

  // Assert that the array contains a specific user
  expect(body.data).toContainEqual(
    expect.objectContaining({
      id: 7,
      first_name: 'Michael',
    })
  );
});
```

## Using Query Parameters to Filter Data

Many `GET` endpoints accept **query parameters** to filter, sort, or paginate the results. You can pass these in Playwright using the `params` option.

```typescript
test('should fetch a filtered list of users', async ({ request }) => {
  // This will make a request to: /api/users?page=2
  const response = await request.get('/api/users', {
    params: {
      page: 2,
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();

  // Assert that the API respected our query parameter
  expect(body.page).toBe(2);
});
```

**Why this is important for testing**: You need to test that the API correctly filters and handles various combinations of query parameters.

## Handling Error Responses

A huge part of testing is making sure the API fails gracefully. For `GET` requests, the most common error is `404 Not Found`.

```typescript
test('should handle a 404 for a non-existent user', async ({ request }) => {
  // Act: Request a user ID that we know doesn't exist.
  const response = await request.get('/api/users/23');

  // Assert: Check for the 404 status code.
  expect(response.status()).toBe(404);

  // Optional: Some APIs return an error message in the body.
  // Note: reqres.in returns an empty body for a 404, so we can't test this here.
  // const body = await response.json();
  // expect(body.error).toBe('User not found');
});
```

## Summary

-   Structure your `GET` tests using the **Arrange-Act-Assert** pattern.
-   For **single resources**, validate the status, headers, and the properties of the returned object.
-   For **collections**, validate that the response is an array, check its length, and verify its contents.
-   Use the `params` option in `request.get()` to test **query parameters**.
-   Always test the "sad path" by checking for expected errors like **`404 Not Found`**.

Mastering `GET` request testing is the foundation for all other API testing. With these skills, you can validate the core data retrieval functionality of any API.

## Next Steps

Now that you can retrieve and validate data, it's time to learn how to create it.
-   **Lesson 7**: POST Requests and Data Creation