# Assessment: API Error Handling

This assessment tests your understanding of how to test for and validate common API errors.

---

## Question 1: Error Categories (Multiple Choice)

An HTTP status code of `403 Forbidden` is a...
A) Client Error
B) Server Error
C) Success Code
D) Redirection Code

---

## Question 2: `404 Not Found` (Multiple Choice)

Which of the following actions is most likely to produce a `404 Not Found` error?
A) Sending a `POST` request with a missing required field.
B) Making a request to a protected endpoint without an authentication token.
C) Making a `GET` request using an ID for a resource that does not exist.
D) Making a request that causes the server to have an unhandled exception.

---

## Question 3: `400 Bad Request` (Short Answer)

What is the primary purpose of testing for `400 Bad Request` errors?

---

## Question 4: `response.ok()` (Short Answer)

If `response.status()` returns `404`, what will `response.ok()` return?

---

## Question 5: Validating Error Messages (Code Snippet)

You have received a `400` error response and parsed its body into a variable named `body`. The expected error format is `{ "error": "Error message here" }`. Write an `expect` assertion to verify the error message.

```typescript
// Assume the expected message is "Invalid input."
expect(body).toHaveProperty('error', '____');
```

---

## Answer Key

### Question 1
**A) Client Error**. All `4xx` status codes indicate an error made by the client.

### Question 2
**C) Making a `GET` request using an ID for a resource that does not exist.**

### Question 3
To verify the API's **input validation**. It ensures the API correctly rejects invalid, malformed, or incomplete data.

### Question 4
It will return **`false`**. The `response.ok()` method only returns `true` for status codes in the 2xx range.

### Question 5
```typescript
expect(body).toHaveProperty('error', 'Invalid input.');