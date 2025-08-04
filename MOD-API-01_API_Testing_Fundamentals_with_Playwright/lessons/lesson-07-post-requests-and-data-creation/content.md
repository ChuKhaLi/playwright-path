# Lesson 7: POST Requests and Data Creation

## Creating New Things with `POST`

While `GET` requests are for reading data, `POST` requests are for **creating** new resources. When you test a `POST` endpoint, you are verifying the API's ability to correctly receive data, create a new entity in the system, and report back that the creation was successful.

This involves a few key steps:
1.  **Preparing** the data (the request payload) you want to send.
2.  **Sending** the `POST` request with the payload.
3.  **Validating** the response to confirm successful creation.

## Making a `POST` Request in Playwright

To send a `POST` request, you use the `request.post()` method. The most important option you'll use is `data`, which is where you provide the JSON payload.

```typescript
import { test, expect } from '@playwright/test';

test('should create a new user', async ({ request }) => {
  // Arrange: Prepare the data for the new user.
  const newUser = {
    name: 'morpheus',
    job: 'leader',
  };

  // Act: Send the POST request.
  const response = await request.post('/api/users', {
    data: newUser,
  });

  // Assert: Validate the response.
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.name).toBe(newUser.name);
});
```

When you use the `data` option with a JavaScript object, Playwright is smart enough to automatically:
1.  **Serialize** the object into a JSON string.
2.  Set the `Content-Type` header to `application/json`.

## Validating a Successful Creation

A successful `POST` request is more than just a `200 OK`. The standard and most correct status code for a successful creation is **`201 Created`**.

### Key Assertions for `POST` Responses:

1.  **Status Code**: Always check for `201 Created`. This is a more specific and meaningful success code than a generic `200`.
2.  **Response Body Content**: The response body should ideally contain the newly created resource, including any server-generated values.
3.  **Server-Generated Values**: Check for properties that the server adds, such as an `id` and a `createdAt` timestamp. This is strong evidence that the resource was actually persisted.
4.  **`Location` Header**: A well-designed API will include a `Location` header in the `201` response, which contains the URL of the newly created resource.

### A More Thorough Validation Example:

```typescript
test('should thoroughly validate a user creation response', async ({ request }) => {
  const newUser = { name: 'morpheus', job: 'leader' };

  const response = await request.post('/api/users', {
    data: newUser,
  });

  // 1. Assert the status code is 201
  expect(response.status()).toBe(201);

  // 2. Assert the Location header (if the API provides it)
  // Note: reqres.in does not provide a Location header, but many APIs do.
  // if (response.headers()['location']) {
  //   expect(response.headers()['location']).toContain('/api/users/');
  // }

  const body = await response.json();

  // 3. Assert that the response reflects the sent data
  expect(body.name).toBe(newUser.name);
  expect(body.job).toBe(newUser.job);

  // 4. Assert on server-generated values
  expect(body).toHaveProperty('id');
  expect(typeof body.id).toBe('string'); // reqres.in returns a string ID

  expect(body).toHaveProperty('createdAt');
  expect(typeof body.createdAt).toBe('string');
  // A regex can validate the timestamp format
  expect(body.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
});
```

## Testing Input Validation

Just as important as testing the "happy path" is testing that the API correctly **rejects** bad data. This is how you test the API's input validation rules.

For invalid input, you should typically expect a **`400 Bad Request`** status code.

```typescript
test('should return an error if required fields are missing', async ({ request }) => {
  // Arrange: Create a payload that is missing the 'password' field.
  const incompleteUser = {
    email: 'sydney@fife',
  };

  // Act: Send the invalid payload.
  const response = await request.post('/api/register', {
    data: incompleteUser,
  });

  // Assert: Check for the error response.
  expect(response.status()).toBe(400);

  const body = await response.json();

  // Assert on the specific error message.
  expect(body).toHaveProperty('error', 'Missing password');
});
```

### Common Input Validation Scenarios to Test:
-   Missing required fields.
-   Fields with incorrect data types (e.g., a string where a number is expected).
-   Fields with invalid formats (e.g., a malformed email address).
-   Fields that violate business rules (e.g., a username that is already taken).

## Summary

-   Use `request.post()` with the `data` option to create new resources.
-   The expected status code for a successful creation is **`201 Created`**.
-   When validating a `POST` response, check the status, the data you sent, and **server-generated values** like `id` and `createdAt`.
-   A critical part of testing `POST` endpoints is to verify **input validation** by sending invalid data and asserting that the API returns a `400 Bad Request` with a helpful error message.

## Next Steps

You can now read and create data. The next logical step is to learn how to modify the data you've created.
-   **Lesson 8**: PUT and PATCH Requests for Data Updates