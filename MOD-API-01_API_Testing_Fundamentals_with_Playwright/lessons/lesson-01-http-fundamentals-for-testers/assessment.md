# Assessment: HTTP Fundamentals for Testers

This assessment tests your understanding of the core HTTP concepts essential for API testing with Playwright.

---

## Question 1: HTTP Methods (Multiple Choice)

Which HTTP method is the most appropriate for creating a new resource on the server?
A) GET
B) POST
C) PUT
D) DELETE

---

## Question 2: Status Code Categories (Multiple Choice)

Your API test receives a `404 Not Found` status code. What category of error is this?
A) 1xx Informational
B) 2xx Success
C) 4xx Client Error
D) 5xx Server Error

---

## Question 3: Request/Response Cycle (Short Answer)

Briefly describe the four main steps of the HTTP request/response cycle from the perspective of a Playwright test.

---

## Question 4: Status Code Meanings (Matching)

Match each HTTP status code with its correct meaning:

| Status Code | Meaning |
|---|---|
| 1. 201 | A) Bad Request |
| 2. 204 | B) Unauthorized |
| 3. 400 | C) Created |
| 4. 401 | D) Not Found |
| 5. 404 | E) No Content |

---

## Question 5: Idempotency in Testing (Multiple Choice)

Which of the following HTTP methods is generally **NOT** idempotent, meaning calling it multiple times will create multiple resources?
A) GET
B) POST
C) PUT
D) DELETE

---

## Question 6: HTTP Headers (Short Answer)

Your API test needs to send a JSON payload to create a new user. List two essential headers your request must include and briefly explain their purpose.

---

## Question 7: Error Response Evaluation (Analysis)

Analyze this error response and answer the questions below:

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "email", "message": "Email format is invalid" }
    ]
  }
}
```

A) Is this a client or server error?
B) What specific test scenario would likely produce this response?

---

## Question 8: Playwright Assertion (Code Analysis)

What is the purpose of the `expect(response.ok()).toBe(true);` assertion in a Playwright API test?

---

## Answer Key

### Question 1
**B) POST**. It is used to submit an entity to the specified resource, often causing a change in state or creation of a new resource on the server.

### Question 2
**C) 4xx Client Error**. This category of status code indicates that the client seems to have erred.

### Question 3
1.  **Request**: The Playwright test sends an HTTP request to an API endpoint.
2.  **Processing**: The server processes the request.
3.  **Response**: The server sends back an HTTP response.
4.  **Validation**: The Playwright test asserts the response's status code, headers, and body.

### Question 4
1.  → C (Created)
2.  → E (No Content)
3.  → A (Bad Request)
4.  → B (Unauthorized)
5.  → D (Not Found)

### Question 5
**B) POST**. `POST` requests are typically not idempotent. For example, submitting the same `POST` request twice to create a user would result in two users being created.

### Question 6
1.  **`Content-Type: application/json`**: Tells the server that the request body is formatted as JSON.
2.  **`Authorization: Bearer <token>`**: Provides the authentication credentials needed to access the protected API endpoint.

### Question 7
A) It is a **client error** (`4xx` range).
B) A test scenario where a `POST` or `PUT` request is sent with an email address that does not conform to the expected format (e.g., "test@invalid").

### Question 8
The `expect(response.ok()).toBe(true);` assertion verifies that the HTTP response status code is in the successful range (200-299). It's a convenient way to check for a successful response without checking for a specific status code like 200 or 201.