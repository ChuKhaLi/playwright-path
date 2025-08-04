# Lesson 12: API Error Handling and Status Codes

## 📚 Lesson Overview

Happy path testing is important, but a truly robust API is defined by how well it handles errors. This lesson focuses on the "sad path": testing how an API behaves when things go wrong. You'll learn to intentionally trigger errors, validate the status codes, and assert on the error messages to ensure the API fails gracefully and securely.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Explain** the importance of testing error conditions.
- **Categorize** HTTP status codes (4xx for client errors, 5xx for server errors).
- **Write** tests that deliberately trigger `400 Bad Request` errors by sending invalid data.
- **Write** tests to trigger `404 Not Found` errors by requesting non-existent resources.
- **Write** tests to trigger `401 Unauthorized` and `403 Forbidden` errors.
- **Validate** the structure and content of an API's error responses.

### 🔑 Key Focus Areas
- The 4xx and 5xx status code families
- Testing for `400`, `401`, `403`, and `404` errors
- Validating error response payloads
- Designing "sad path" test cases

### ⏱️ Duration
**2 hours** | **Type**: Core Skill

### 🔗 Prerequisites
- Completion of all previous lessons (1-11).

---

## 📖 What You'll Learn

### Core Concepts
- The difference between client-side errors (your fault) and server-side errors (the API's fault).
- What constitutes a "good" error response: a clear status code and a helpful, non-sensitive error message.
- How to structure tests for predictable failures.

### Practical Application
- Triggering a `400 Bad Request` by sending a `POST` request with missing fields.
- Triggering a `404 Not Found` by trying to `GET` a resource that has been deleted.
- Triggering a `401 Unauthorized` by making a request to a protected endpoint without a token.
- Asserting that an error response body contains a specific error code or message.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | A detailed guide to testing common API error conditions. |
| [`examples/error-handling.spec.ts`](./examples/error-handling.spec.ts) | Clear, commented examples of tests that trigger and validate errors. |
| [`exercises/error-handling-practice.spec.ts`](./exercises/error-handling-practice.spec.ts) | Hands-on exercises to master error handling tests. |
| [`assessment.md`](./assessment.md) | A quiz to check your understanding of error handling. |

---

## 🎯 Key Takeaways

After this lesson, you'll be able to:
- Go beyond happy path testing to build truly comprehensive test suites.
- Write tests that ensure your API is resilient and provides good feedback when used incorrectly.
- Improve the overall quality and security of an API by testing its failure modes.

---

## 🔗 Next Steps

You've learned to test both success and failure. Now it's time to learn how to make your tests more powerful and efficient.
- **Lesson 13**: Data-Driven API Testing