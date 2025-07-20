# HTTP Request and Response Examples

This file contains raw HTTP request and response examples that demonstrate the concepts covered in the lesson. These examples show exactly what HTTP traffic looks like when testing APIs.

## Example 1: GET Request - Retrieve User Data

### Request
```http
GET /api/users/123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
User-Agent: Playwright-API-Test/1.0
X-Request-ID: test-get-user-123
```

### Response
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 187
Cache-Control: private, max-age=300
Date: Sun, 20 Jul 2025 16:30:00 GMT
X-RateLimit-Remaining: 99
X-Response-Time: 45ms

{
  "id": 123,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "status": "active",
  "createdAt": "2025-01-15T10:30:00Z",
  "lastLoginAt": "2025-07-20T14:22:00Z"
}
```

**Key Points for Testing:**
- Status code 200 indicates successful retrieval
- Content-Type confirms JSON response format
- Response body contains all expected user fields
- Cache-Control header indicates caching behavior
- X-RateLimit-Remaining shows API rate limiting

---

## Example 2: POST Request - Create New User

### Request
```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
Content-Length: 98
User-Agent: Playwright-API-Test/1.0
X-Request-ID: test-create-user-456

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "department": "Engineering"
}
```

### Response
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Content-Length: 203
Location: /api/users/456
Date: Sun, 20 Jul 2025 16:31:00 GMT
X-RateLimit-Remaining: 98
X-Response-Time: 127ms

{
  "id": 456,
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "department": "Engineering",
  "status": "active",
  "createdAt": "2025-07-20T16:31:00Z",
  "lastLoginAt": null
}
```

**Key Points for Testing:**
- Status code 201 indicates successful creation
- Location header provides URL of newly created resource
- Response includes generated fields (id, createdAt, status)
- All submitted data is preserved in the response
- Response time indicates API performance

---

## Example 3: PUT Request - Update User (Complete Replacement)

### Request
```http
PUT /api/users/456 HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
Content-Length: 156
User-Agent: Playwright-API-Test/1.0
X-Request-ID: test-update-user-456

{
  "id": 456,
  "firstName": "Jane",
  "lastName": "Smith-Johnson",
  "email": "jane.smith-johnson@example.com",
  "department": "Product Management",
  "status": "active"
}
```

### Response
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 219
Date: Sun, 20 Jul 2025 16:32:00 GMT
X-RateLimit-Remaining: 97
X-Response-Time: 89ms

{
  "id": 456,
  "firstName": "Jane",
  "lastName": "Smith-Johnson",
  "email": "jane.smith-johnson@example.com",
  "department": "Product Management",
  "status": "active",
  "createdAt": "2025-07-20T16:31:00Z",
  "updatedAt": "2025-07-20T16:32:00Z",
  "lastLoginAt": null
}
```

**Key Points for Testing:**
- Status code 200 indicates successful update
- All provided fields are updated in the response
- updatedAt timestamp shows when the change occurred
- createdAt timestamp remains unchanged
- Complete resource representation returned

---

## Example 4: PATCH Request - Partial Update

### Request
```http
PATCH /api/users/456 HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
Content-Length: 47
User-Agent: Playwright-API-Test/1.0
X-Request-ID: test-patch-user-456

{
  "department": "Senior Product Management",
  "status": "inactive"
}
```

### Response
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 226
Date: Sun, 20 Jul 2025 16:33:00 GMT
X-RateLimit-Remaining: 96
X-Response-Time: 67ms

{
  "id": 456,
  "firstName": "Jane",
  "lastName": "Smith-Johnson",
  "email": "jane.smith-johnson@example.com",
  "department": "Senior Product Management",
  "status": "inactive",
  "createdAt": "2025-07-20T16:31:00Z",
  "updatedAt": "2025-07-20T16:33:00Z",
  "lastLoginAt": null
}
```

**Key Points for Testing:**
- Only specified fields (department, status) were updated
- Other fields (firstName, lastName, email) remained unchanged
- updatedAt timestamp reflects the partial update
- Response includes complete resource representation

---

## Example 5: DELETE Request - Remove User

### Request
```http
DELETE /api/users/456 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
User-Agent: Playwright-API-Test/1.0
X-Request-ID: test-delete-user-456
```

### Response
```http
HTTP/1.1 204 No Content
Date: Sun, 20 Jul 2025 16:34:00 GMT
X-RateLimit-Remaining: 95
X-Response-Time: 34ms
```

**Key Points for Testing:**
- Status code 204 indicates successful deletion with no content
- No response body (Content-Length: 0 implied)
- Subsequent GET to /api/users/456 should return 404
- Fast response time for deletion operation

---

## Example 6: Error Response - Validation Failure

### Request (Invalid Data)
```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
Content-Length: 67
User-Agent: Playwright-API-Test/1.0
X-Request-ID: test-create-invalid-user

{
  "firstName": "",
  "lastName": "Test",
  "email": "invalid-email-format"
}
```

### Response (Error)
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 298
Date: Sun, 20 Jul 2025 16:35:00 GMT
X-RateLimit-Remaining: 94
X-Response-Time: 23ms

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "timestamp": "2025-07-20T16:35:00Z",
    "requestId": "test-create-invalid-user",
    "details": [
      {
        "field": "firstName",
        "message": "First name cannot be empty",
        "code": "REQUIRED_FIELD"
      },
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "INVALID_FORMAT"
      }
    ]
  }
}
```

**Key Points for Testing:**
- Status code 400 indicates client error (bad request)
- Error response has consistent structure
- Specific validation errors are clearly identified
- Request ID helps with debugging and tracing
- Fast response time for validation errors

---

## Example 7: Error Response - Resource Not Found

### Request
```http
GET /api/users/999999 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
User-Agent: Playwright-API-Test/1.0
X-Request-ID: test-get-nonexistent-user
```

### Response
```http
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 156
Date: Sun, 20 Jul 2025 16:36:00 GMT
X-RateLimit-Remaining: 93
X-Response-Time: 12ms

{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with ID 999999 not found",
    "timestamp": "2025-07-20T16:36:00Z",
    "requestId": "test-get-nonexistent-user"
  }
}
```

**Key Points for Testing:**
- Status code 404 indicates resource not found
- Error message is specific and helpful
- Consistent error response structure
- Very fast response time for non-existent resources

---

## Example 8: Authentication Error

### Request (Invalid Token)
```http
GET /api/users/123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer invalid-token-here
User-Agent: Playwright-API-Test/1.0
X-Request-ID: test-invalid-auth
```

### Response
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8
Content-Length: 134
WWW-Authenticate: Bearer realm="API"
Date: Sun, 20 Jul 2025 16:37:00 GMT
X-Response-Time: 8ms

{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The provided authentication token is invalid or expired",
    "timestamp": "2025-07-20T16:37:00Z"
  }
}
```

**Key Points for Testing:**
- Status code 401 indicates authentication failure
- WWW-Authenticate header specifies authentication method
- Error message doesn't reveal sensitive information
- Very fast response for authentication errors

---

## Testing Insights from These Examples

### Status Code Patterns
- **2xx codes**: Operation successful, validate response data
- **4xx codes**: Client error, validate error messages and structure
- **5xx codes**: Server error, may indicate bugs or infrastructure issues

### Header Analysis
- **Content-Type**: Always verify expected format (application/json)
- **Content-Length**: Should match actual response body size
- **Authorization**: Required for protected endpoints
- **Rate Limiting**: X-RateLimit headers help test API limits
- **Performance**: X-Response-Time helps identify slow endpoints

### Response Body Validation
- **Success responses**: Verify all expected fields are present and correct
- **Error responses**: Check for consistent error structure and helpful messages
- **Data types**: Ensure fields have correct types (string, number, boolean)
- **Timestamps**: Verify ISO 8601 format and logical values

### Testing Strategy
1. **Test happy paths** with valid data and authentication
2. **Test error paths** with invalid data, missing auth, non-existent resources
3. **Validate response structure** for both success and error cases
4. **Check HTTP semantics** - correct methods, status codes, headers
5. **Performance testing** - monitor response times and rate limits

These examples provide the foundation for understanding what your API tests will be validating when using Playwright or other testing tools.