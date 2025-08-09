# Lesson 20: HTTP Protocol Fundamentals - Assessment

## Multiple Choice Questions

1.  **Which HTTP method is both "safe" and "idempotent", meaning it doesn't alter the server's state and returns the same result every time?**
    a.  `POST`
    b.  `PUT`
    c.  `GET`
    d.  `PATCH`

2.  **You have just successfully created a new user via an API call. Which HTTP status code would be the most appropriate for the server to return?**
    a.  `200 OK`
    b.  `201 Created`
    c.  `204 No Content`
    d.  `302 Found`

3.  **A user tries to access a page they do not have permission to view. Which `4xx` status code should the server return?**
    a.  `400 Bad Request`
    b.  `401 Unauthorized`
    c.  `403 Forbidden`
    d.  `404 Not Found`

4.  **What is the purpose of the `Content-Type` header in an HTTP request?**
    a.  To tell the server what type of response the client can accept.
    b.  To specify the length of the request body.
    c.  To provide authentication credentials.
    d.  To tell the server what format the data in the request body is in (e.g., `application/json`).

5.  **Which of the following best describes a `500 Internal Server Error`?**
    a.  The client sent an invalid request.
    b.  The requested resource could not be found.
    c.  The server encountered an unexpected condition that prevented it from fulfilling the request.
    d.  The client needs to authenticate to get the requested response.

## Short Answer Questions

1.  **Explain the difference between the `PUT` and `PATCH` HTTP methods.**
2.  **What does it mean for a protocol to be "stateless"? Why is this a key characteristic of HTTP?**
3.  **You are testing a form submission. In the Network tab of your DevTools, what are the three key pieces of information you would check in the request details to ensure the form is working correctly?**

## Practical Application

**Scenario:** You are using an API testing tool to interact with a user management API at the endpoint `/api/users`.

1.  **Task:** You want to retrieve a list of all users. Write down the first line (the "request line") of the HTTP request you would send.
2.  **Task:** The server responds to your request from Task 1 with a `401 Unauthorized` status code. What does this mean, and what request header are you likely missing?
3.  **Task:** You want to create a new user with the name "Test User". You send a `POST` request with the body `{"name": "Test User"}`. The server responds with a `400 Bad Request` and a JSON body of `{"error": "Email is required"}`. What does this tell you about the API's requirements for creating a user?