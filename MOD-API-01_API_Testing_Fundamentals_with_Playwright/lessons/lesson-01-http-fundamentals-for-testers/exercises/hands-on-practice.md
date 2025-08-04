# Hands-On Practice: HTTP Fundamentals for Testers

This exercise will help you practice analyzing and constructing HTTP requests and responses, which is a fundamental skill for API testing.

---

## Guide: Using Browser DevTools to See HTTP in Action

Before you start the exercises, let's see how you can observe real HTTP traffic yourself.

1.  **Open your browser** (Chrome, Firefox, or Edge).
2.  **Open Developer Tools**: Press `F12` or right-click on the page and select "Inspect".
3.  **Go to the "Network" tab**.
4.  **Visit a website** with APIs, like `https://reqres.in/` or `https://gorest.co.in/`.
5.  **Filter by "Fetch/XHR"**: This will show you just the API requests.
6.  **Click on any request** in the list. You can now inspect its **Headers**, **Payload** (request body), and **Response**.

This is an excellent way to see how real-world applications use HTTP.

---

## Exercise 1: Analyzing an HTTP Response

Below is a raw HTTP response from an API. Analyze it and answer the questions.

### Sample HTTP Response
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 245
Cache-Control: private, max-age=600
Date: Sun, 20 Jul 2025 16:40:00 GMT
X-RateLimit-Remaining: 847
Server: nginx/1.18.0

{
  "id": 789,
  "firstName": "Alice",
  "email": "alice.j@company.com",
  "role": "Senior QA Engineer",
  "permissions": ["read", "write", "test"]
}
```

### Questions
1.  **Status Code**: What is the HTTP status code, and what does it signify?
2.  **Content Type**: What format is the response data in?
3.  **Data Extraction**: What is the user's role?
4.  **Rate Limiting**: How many requests are left in the current window?
5.  **Caching**: How long (in seconds) can this response be cached?

---

## Exercise 2: Constructing an HTTP Request

Your task is to create a raw HTTP request to update a user's email address.

### Requirements
-   **Endpoint**: `/api/users/789`
-   **HTTP Method**: Use the appropriate method for a partial update.
-   **Host**: `api.example.com`
-   **Data**: The new email should be `alice.johnson@company.com`.
-   **Headers**: Include the necessary headers for sending JSON data and for authentication (use a placeholder token).

**Your Task**: Write out the complete HTTP request, including the request line, headers, and body.

---

## Exercise 3: Error Response Analysis

Analyze the error response below and answer the questions.

### Error Response
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8
Date: Sun, 20 Jul 2025 16:45:00 GMT
X-Request-ID: req-xyz789

{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You do not have permission to delete this resource."
  }
}
```

### Questions
1.  **Error Category**: Is this a client error or a server error? How do you know?
2.  **Authentication vs. Authorization**: Does this error mean the user isn't logged in, or that they lack permissions?
3.  **Testing Implication**: What kind of test scenario would you design to specifically trigger this response?

---

## Answer Key

### Exercise 1 Answers
1.  **Status Code**: `200 OK`. It signifies that the request was successful.
2.  **Content Type**: `application/json`. The data is in JSON format.
3.  **Data Extraction**: The user's role is "Senior QA Engineer".
4.  **Rate Limiting**: 847 requests are left (`X-RateLimit-Remaining`).
5.  **Caching**: It can be cached for 600 seconds (`max-age=600`).

### Exercise 2 Answer
```http
PATCH /api/users/789 HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <your-auth-token>
Content-Length: 45

{
  "email": "alice.johnson@company.com"
}
```
*(Note: `PATCH` is used for partial updates. `Content-Length` should match the body's size.)*

### Exercise 3 Answers
1.  **Error Category**: It's a `4xx` client error, indicated by the status code `403 Forbidden`.
2.  **Authentication vs. Authorization**: This is an **authorization** error. The user is authenticated (logged in), but their role does not grant them the permission to perform the delete action. A `401 Unauthorized` error would indicate they aren't logged in.
3.  **Testing Implication**: A role-based access control (RBAC) test. For example, log in as a user with a "viewer" role and attempt to send a `DELETE` request to an endpoint that requires an "admin" role. The test should assert that the response status is `403`.