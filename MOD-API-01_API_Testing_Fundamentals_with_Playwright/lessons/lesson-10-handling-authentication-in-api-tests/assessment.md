# Assessment: Handling Authentication

This assessment tests your understanding of common API authentication patterns.

---

## Question 1: Authentication vs. Authorization (Multiple Choice)

Which of the following best describes **authentication**?
A) Determining if a user has permission to access a specific resource.
B) Verifying a user's identity, typically with a username and password.
C) Encrypting the data sent between the client and the server.
D) The process of creating a new user account.

---

## Question 2: Bearer Token (Multiple Choice)

How should a Bearer Token be sent in an HTTP request?
A) As a query parameter in the URL.
B) In the request body.
C) In the `Authorization` header, prefixed with "Bearer ".
D) In a custom `X-Auth-Token` header.

---

## Question 3: The Login Pattern (Short Answer)

Describe the three main steps of the "Login -> Get Token -> Use Token" authentication pattern.

---

## Question 4: Playwright Hooks (Short Answer)

Which Playwright hook is most efficient for logging in once and reusing the token for all tests within a single test file?

---

## Question 5: Securely Storing Credentials (Multiple Choice)

What is the best practice for managing sensitive credentials like API keys and passwords in a test project?
A) Hardcode them directly in the test files for simplicity.
B) Store them in a JSON file and read from it in the tests.
C) Store them in environment variables using a `.env` file that is not committed to version control.
D) Encrypt them and store the encrypted string in the code.

---

## Answer Key

### Question 1
**B) Verifying a user's identity, typically with a username and password.**

### Question 2
**C) In the `Authorization` header, prefixed with "Bearer ".**

### Question 3
1.  **Login**: Send a `POST` request with user credentials to a login endpoint.
2.  **Get Token**: Receive a token in the response from the successful login.
3.  **Use Token**: Include the token in the `Authorization` header for all subsequent requests to protected endpoints.

### Question 4
The **`test.beforeAll()`** hook.

### Question 5
**C) Store them in environment variables using a `.env` file that is not committed to version control.** This keeps secrets out of your codebase.