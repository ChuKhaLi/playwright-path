# Hands-On Practice: HTTP Fundamentals for Testers

This exercise will help you practice analyzing HTTP requests and responses, which is a fundamental skill for API testing. You'll examine real HTTP traffic and identify key components that are important for testing.

## Exercise 1: Analyzing a Sample HTTP Response

Below is a raw HTTP response from an API. Your task is to analyze it and answer the questions that follow.

### Sample HTTP Response

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 245
Cache-Control: private, max-age=600
Date: Sun, 20 Jul 2025 16:40:00 GMT
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-Response-Time: 127ms
Server: nginx/1.18.0

{
  "id": 789,
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@company.com",
  "department": "Quality Assurance",
  "role": "Senior QA Engineer",
  "status": "active",
  "createdAt": "2025-01-10T09:15:00Z",
  "lastLoginAt": "2025-07-20T14:30:00Z",
  "permissions": ["read", "write", "test"]
}
```

### Questions

**Question 1: Status Code Analysis**
What is the HTTP status code in this response, and what does it indicate about the success or failure of the request?

**Question 2: Content Type Identification**
What is the value of the `Content-Type` header, and what does this tell you about the format of the response data?

**Question 3: Data Extraction**
From the JSON response body, what is the value of the `department` field?

**Question 4: Rate Limiting Information**
Based on the headers, how many API requests does this user have remaining before hitting the rate limit?

**Question 5: Performance Analysis**
What was the response time for this API call, and where can you find this information?

---

## Exercise 2: HTTP Method and Status Code Matching

Match each HTTP method with its most appropriate use case and expected success status code.

### HTTP Methods
A. GET  
B. POST  
C. PUT  
D. PATCH  
E. DELETE  

### Use Cases
1. Remove a user account from the system
2. Retrieve a list of all products
3. Create a new customer record
4. Update only the email address of an existing user
5. Replace all information for a specific product

### Expected Success Status Codes
- 200 OK
- 201 Created
- 204 No Content

**Your Task**: Match each method (A-E) with its use case (1-5) and expected status code.

---

## Exercise 3: Error Response Analysis

Below is an HTTP error response. Analyze it and answer the questions.

### Error Response

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json; charset=utf-8
Content-Length: 187
Date: Sun, 20 Jul 2025 16:45:00 GMT
X-Request-ID: req-abc123def456

{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The request data failed validation",
    "details": [
      {
        "field": "email",
        "message": "Email address is already in use"
      },
      {
        "field": "age",
        "message": "Age must be between 18 and 120"
      }
    ]
  }
}
```

### Questions

**Question 1: Error Category**
What category does the 422 status code belong to (2xx, 3xx, 4xx, or 5xx), and what does this category generally indicate?

**Question 2: Validation Issues**
How many validation errors are reported in this response, and what are the specific issues?

**Question 3: Debugging Information**
What header could help you trace this specific request for debugging purposes?

**Question 4: Testing Implications**
Based on this error response, what two test scenarios should you definitely include in your API test suite?

---

## Exercise 4: Request Header Analysis

You're writing an API test that needs to create a new user. Below is the HTTP request your test will send. Analyze the headers and identify any issues or improvements.

### Test Request

```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 156
User-Agent: MyTestSuite/1.0

{
  "firstName": "Test",
  "lastName": "User",
  "email": "test.user@example.com",
  "department": "Engineering"
}
```

### Questions

**Question 1: Missing Authentication**
What important header is missing from this request that would likely cause it to fail?

**Question 2: Content Length Verification**
Count the characters in the JSON body (including spaces and newlines). Does the `Content-Length` header value match?

**Question 3: Additional Headers**
What other headers might be useful to include for better testing and debugging?

---

## Exercise 5: API Testing Scenario Design

Based on your understanding of HTTP, design test scenarios for a simple user management API with these endpoints:

- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Your Task

For **each endpoint**, identify:
1. **One happy path test scenario** (expected to succeed)
2. **One error path test scenario** (expected to fail)
3. **The expected HTTP status code** for each scenario

**Example Format:**
```
Endpoint: GET /api/users/{id}
Happy Path: Request existing user with valid ID
Expected Status: 200 OK

Error Path: Request non-existent user ID
Expected Status: 404 Not Found
```

---

## Exercise 6: HTTP Response Validation Checklist

You're reviewing an API test that validates user creation. The test receives this response:

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/456
Content-Length: 198

{
  "id": 456,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "status": "active",
  "createdAt": "2025-07-20T16:50:00Z"
}
```

### Validation Checklist

Create a checklist of things your API test should validate in this response. Consider:
- Status code validation
- Header validation
- Response body validation
- Data type validation
- Business logic validation

**Your Task**: List at least 8 specific validations your test should perform on this response.

---

## Answer Key

### Exercise 1 Answers

**Answer 1**: The status code is 200 OK, which indicates the request was successful and the server returned the requested data.

**Answer 2**: The Content-Type is `application/json; charset=utf-8`, which tells us the response data is in JSON format with UTF-8 character encoding.

**Answer 3**: The value of the `department` field is "Quality Assurance".

**Answer 4**: The user has 847 requests remaining before hitting the rate limit (from the `X-RateLimit-Remaining: 847` header).

**Answer 5**: The response time was 127ms, found in the `X-Response-Time: 127ms` header.

### Exercise 2 Answers

- A. GET → 2. Retrieve a list of all products → 200 OK
- B. POST → 3. Create a new customer record → 201 Created
- C. PUT → 5. Replace all information for a specific product → 200 OK
- D. PATCH → 4. Update only the email address of an existing user → 200 OK
- E. DELETE → 1. Remove a user account from the system → 204 No Content

### Exercise 3 Answers

**Answer 1**: 422 belongs to the 4xx category, which indicates client errors (problems with the request sent by the client).

**Answer 2**: There are 2 validation errors: 
1. Email address is already in use
2. Age must be between 18 and 120

**Answer 3**: The `X-Request-ID: req-abc123def456` header can help trace this specific request for debugging.

**Answer 4**: Two essential test scenarios:
1. Test duplicate email validation (attempt to create user with existing email)
2. Test age boundary validation (test with ages below 18, above 120, and valid ages)

### Exercise 4 Answers

**Answer 1**: The `Authorization` header is missing. Most APIs require authentication tokens like `Authorization: Bearer <token>`.

**Answer 2**: Counting the JSON body characters (including formatting):
```
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test.user@example.com",
  "department": "Engineering"
}
```
This is approximately 156 characters, so the Content-Length appears correct.

**Answer 3**: Additional useful headers:
- `Authorization: Bearer <token>` - for authentication
- `X-Request-ID: <unique-id>` - for request tracing
- `Accept: application/json` - to specify expected response format

### Exercise 5 Sample Answers

**GET /api/users**
- Happy Path: Request user list with valid authentication → 200 OK
- Error Path: Request without authentication → 401 Unauthorized

**GET /api/users/{id}**
- Happy Path: Request existing user with valid ID → 200 OK
- Error Path: Request non-existent user ID → 404 Not Found

**POST /api/users**
- Happy Path: Create user with valid data → 201 Created
- Error Path: Create user with invalid email format → 400 Bad Request

**PUT /api/users/{id}**
- Happy Path: Update existing user with valid data → 200 OK
- Error Path: Update non-existent user → 404 Not Found

**DELETE /api/users/{id}**
- Happy Path: Delete existing user → 204 No Content
- Error Path: Delete non-existent user → 404 Not Found

### Exercise 6 Sample Validation Checklist

1. **Status Code**: Verify response status is 201 Created
2. **Content-Type**: Confirm Content-Type is application/json
3. **Location Header**: Verify Location header contains correct new resource URL
4. **Response Body Structure**: Ensure JSON response has expected fields
5. **ID Field**: Verify id field is present and is a number
6. **Data Preservation**: Confirm submitted data (firstName, lastName, email) is preserved
7. **Generated Fields**: Verify system-generated fields (id, status, createdAt) are present
8. **Data Types**: Validate field types (id as number, createdAt as ISO date string)
9. **Business Logic**: Confirm status is set to "active" by default
10. **Timestamp Format**: Verify createdAt follows ISO 8601 format
11. **Content-Length**: Verify Content-Length header matches actual response body size
12. **No Sensitive Data**: Ensure no sensitive information (like passwords) is returned

---

## Verification Steps

After completing these exercises:

1. **Review your answers** against the provided answer key
2. **Identify any gaps** in your understanding
3. **Re-read relevant sections** of the lesson content for any concepts you missed
4. **Practice with real APIs** using tools like browser DevTools or Postman
5. **Move on to the assessment** to test your overall understanding

Remember: Understanding HTTP is fundamental to API testing success. Take time to master these concepts before moving to more advanced topics.