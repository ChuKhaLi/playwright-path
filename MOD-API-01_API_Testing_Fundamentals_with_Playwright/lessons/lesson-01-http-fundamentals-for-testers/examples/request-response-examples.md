# HTTP Request and Response Examples

This file contains raw HTTP request and response examples that demonstrate the concepts covered in the lesson. For each example, we've added commentary on how you would approach testing it with Playwright.

---

## Example 1: GET Request - Retrieve User Data

### Request
```http
GET /api/users/123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User-Agent: Playwright-API-Test/1.0
```

### Response
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 187
Date: Sun, 20 Jul 2025 16:30:00 GMT

{
  "id": 123,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "status": "active"
}
```

### Playwright Testing Focus
```typescript
// How to test this response in Playwright:
test('should retrieve user data', async ({ request }) => {
  const response = await request.get('/api/users/123');

  // 1. Verify the status code is 200
  expect(response.status()).toBe(200);

  // 2. Verify the Content-Type header
  expect(response.headers()['content-type']).toContain('application/json');

  // 3. Parse the response body and validate its content
  const body = await response.json();
  expect(body.id).toBe(123);
  expect(body.firstName).toBe('John');
  expect(body.status).toBe('active');
});
```

---

## Example 2: POST Request - Create New User

### Request
```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com"
}
```

### Response
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: /api/users/456
Date: Sun, 20 Jul 2025 16:31:00 GMT

{
  "id": 456,
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "status": "pending_activation"
}
```

### Playwright Testing Focus
```typescript
// How to test this response in Playwright:
test('should create a new user', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com'
    }
  });

  // 1. Verify the status code is 201
  expect(response.status()).toBe(201);

  // 2. Verify the Location header
  expect(response.headers()['location']).toBe('/api/users/456');

  // 3. Validate the response body
  const body = await response.json();
  expect(body.id).toBe(456);
  expect(body.firstName).toBe('Jane');
  // Check default values set by the server
  expect(body.status).toBe('pending_activation');
});
```

---

## Example 3: DELETE Request - Remove User

### Request
```http
DELETE /api/users/456 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response
```http
HTTP/1.1 204 No Content
Date: Sun, 20 Jul 2025 16:34:00 GMT
```

### Playwright Testing Focus
```typescript
// How to test this response in Playwright:
test('should delete a user', async ({ request }) => {
  // First, create a user to delete
  // ...

  const deleteResponse = await request.delete('/api/users/456');

  // 1. Verify the status code is 204
  expect(deleteResponse.status()).toBe(204);

  // 2. Verify the resource is actually gone
  const getResponse = await request.get('/api/users/456');
  expect(getResponse.status()).toBe(404);
});
```

---

## Example 4: Error Response - Validation Failure

### Request (Invalid Data)
```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "firstName": "",
  "email": "invalid-email"
}
```

### Response (Error)
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Date: Sun, 20 Jul 2025 16:35:00 GMT

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "firstName",
        "message": "First name cannot be empty"
      },
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Playwright Testing Focus
```typescript
// How to test this response in Playwright:
test('should return validation errors for bad data', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: {
      firstName: '',
      email: 'invalid-email'
    }
  });

  // 1. Verify the status code is 400
  expect(response.status()).toBe(400);

  // 2. Validate the error response structure and content
  const body = await response.json();
  expect(body.error.code).toBe('VALIDATION_ERROR');
  expect(body.error.details).toHaveLength(2);
  expect(body.error.details[0].field).toBe('firstName');
  expect(body.error.details[1].message).toBe('Invalid email format');
});
```

---

## Example 5: Error Response - Resource Not Found

### Request
```http
GET /api/users/999999 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response
```http
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Date: Sun, 20 Jul 2025 16:36:00 GMT

{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with ID 999999 not found"
  }
}
```

### Playwright Testing Focus
```typescript
// How to test this response in Playwright:
test('should return 404 for a non-existent user', async ({ request }) => {
  const response = await request.get('/api/users/999999');

  // 1. Verify the status code is 404
  expect(response.status()).toBe(404);

  // 2. Validate the error message
  const body = await response.json();
  expect(body.error.code).toBe('RESOURCE_NOT_FOUND');
  expect(body.error.message).toContain('User with ID 999999 not found');
});