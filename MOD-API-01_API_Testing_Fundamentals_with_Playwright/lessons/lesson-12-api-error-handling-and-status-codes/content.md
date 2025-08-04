# Lesson 12: API Error Handling and Status Codes

## The Importance of "Sad Path" Testing

So far, we've mostly focused on the "happy path"—testing that the API works correctly when we use it as intended. But what happens when things go wrong? A robust application must handle errors gracefully, and a robust test suite must verify this behavior.

Testing for errors, often called "sad path" testing, is critical for:
-   **Security**: Ensuring that error messages don't leak sensitive information.
-   **Stability**: Confirming that invalid input doesn't crash the server.
-   **User Experience**: Making sure the API provides helpful feedback so developers can fix their client-side code.

## Understanding Error Status Codes

As we learned in Lesson 1, HTTP status codes are grouped into categories. For error handling, we are primarily interested in two groups:

-   **`4xx` Client Errors**: The request sent by the client was bad in some way. It's the *client's fault*.
-   **`5xx` Server Errors**: The server failed to fulfill a valid request. It's the *server's fault*.

As a tester, you will spend most of your time deliberately triggering and validating `4xx` errors.

## Testing for `400 Bad Request`

This is the classic error for **input validation**. You trigger it by sending a request that violates the API's rules.

**Common Scenarios:**
-   Sending a `POST` request with missing required fields.
-   Sending data with the wrong data type (e.g., a string for a field that expects a number).
-   Sending data in an invalid format (e.g., a malformed email address).

```typescript
import { test, expect } from '@playwright/test';

test('should return 400 for missing password on login', async ({ request }) => {
  // Arrange: The payload is missing the required 'password' field.
  const invalidPayload = {
    email: 'peter@klaven',
  };

  // Act: Send the invalid request.
  const response = await request.post('https://reqres.in/api/login', {
    data: invalidPayload,
  });

  // Assert: Check for the 400 status and the error message.
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body).toHaveProperty('error', 'Missing password');
});
```

## Testing for `404 Not Found`

This error means the specific resource you asked for doesn't exist.

**Common Scenarios:**
-   Making a `GET`, `PUT`, `PATCH`, or `DELETE` request with an ID that is not in the database.
-   Making a request to an endpoint that doesn't exist.

```typescript
test('should return 404 for a non-existent user', async ({ request }) => {
  // Act: Request a user ID that is highly unlikely to exist.
  const response = await request.get('/api/users/999999');

  // Assert: Check for the 404 status.
  expect(response.status()).toBe(404);
});
```

## Testing for Authentication and Authorization Errors

These are critical security tests.

-   **`401 Unauthorized`**: The client has not provided any authentication credentials, or the credentials provided are invalid.
-   **`403 Forbidden`**: The client is authenticated (the server knows who they are), but they do not have permission to access the requested resource.

### Testing for `401 Unauthorized`

```typescript
test('should return 401 when accessing a protected resource without a token', async ({ request }) => {
  // This is a conceptual test. Assume '/api/protected-data' requires a token.
  // Act: Make a request without an 'Authorization' header.
  const response = await request.get('/api/protected-data');

  // Assert: Expect a 401 status.
  expect(response.status()).toBe(401);
});
```

### Testing for `403 Forbidden`

```typescript
test('should return 403 when a user tries to access admin resources', async ({ request }) => {
  // This is a conceptual test.
  // 1. First, log in as a regular user and get a token.
  const userToken = await loginAsUser(request); // Assume this helper function exists

  // 2. Act: Use the regular user's token to try to access an admin-only endpoint.
  const response = await request.get('/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  // 3. Assert: Expect a 403 status.
  expect(response.status()).toBe(403);
});
```

## Validating Error Response Bodies

A good API doesn't just send an error status code; it also sends a helpful error message in the response body. Your tests should validate this.

**What makes a good error response?**
-   It has a consistent, predictable structure.
-   It includes a machine-readable error code (e.g., `VALIDATION_ERROR`).
-   It includes a human-readable message.
-   For validation errors, it specifies which fields were wrong and why.
-   It **does not** include sensitive information like stack traces or database details.

```typescript
test('should return a detailed validation error message', async ({ request }) => {
  const invalidPayload = { name: 'morpheus' }; // Missing 'job' field

  const response = await request.post('https://reqres.in/api/users', {
    data: invalidPayload,
  });

  // Note: reqres.in doesn't actually enforce this, but a real API would.
  // Let's pretend it returns a 400 with a detailed body.
  /*
  expect(response.status()).toBe(400);
  const body = await response.json();

  expect(body.errorCode).toBe('VALIDATION_FAILED');
  expect(body.errors).toHaveLength(1);
  expect(body.errors[0].field).toBe('job');
  expect(body.errors[0].message).toBe('Job is a required field.');
  */
});
```

## Summary

-   Testing for errors (the "sad path") is just as important as testing for success.
-   Use your knowledge of the API to intentionally trigger specific `4xx` errors.
-   **`400 Bad Request`**: Test by sending invalid or incomplete data.
-   **`404 Not Found`**: Test by requesting a resource that doesn't exist.
-   **`401 Unauthorized`**: Test by making requests without valid credentials.
-   **`403 Forbidden`**: Test by using valid credentials that lack the necessary permissions.
-   Always validate the **structure and content** of the error response body to ensure it's helpful and secure.

## Next Steps

You now have a comprehensive understanding of how to test an API's core functionality, including its error handling. Next, we'll explore how to make your tests more powerful and efficient by running them with multiple sets of data.
-   **Lesson 13**: Data-Driven API Testing