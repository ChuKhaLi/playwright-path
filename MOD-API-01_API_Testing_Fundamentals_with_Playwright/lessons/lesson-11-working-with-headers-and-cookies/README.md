# Lesson 11: Working with Headers and Cookies

## 📚 Lesson Overview

Beyond the URL and the body, HTTP headers and cookies are critical components of API communication. Headers provide essential metadata for requests and responses, while cookies are used to maintain state. This lesson teaches you how to effectively work with both in your Playwright API tests, giving you finer control over your test scenarios.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Send** custom headers in an API request.
- **Read and assert** on headers in an API response.
- **Explain** the purpose of common HTTP headers like `Accept` and `User-Agent`.
- **Understand** how cookies are used for session management.
- **Read** cookies from an API response.
- **Send** cookies in an API request.

### 🔑 Key Focus Areas
- The `headers` option in Playwright requests
- Validating response headers
- The `cookies` option in Playwright requests
- Managing session state with cookies

### ⏱️ Duration
**1.5 hours** | **Type**: Core Skill

### 🔗 Prerequisites
- Completion of Lesson 10: Handling Authentication in API Tests.

---

## 📖 What You'll Learn

### Core Concepts
- The role of headers in providing context for a request (e.g., what format of data the client accepts).
- How response headers provide metadata about the response (e.g., rate limiting information).
- The difference between session cookies and persistent cookies.
- How APIs use the `Set-Cookie` header to manage sessions.

### Practical Application
- Writing a test that sends a custom `User-Agent` to simulate a specific client.
- Writing a test that validates a `Cache-Control` or `ETag` header in a response.
- Simulating a logged-in user by sending a session cookie with a request.
- Extracting a cookie from a login response to use in subsequent requests.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | A detailed guide to working with HTTP headers and cookies. |
| [`examples/headers-and-cookies.spec.ts`](./examples/headers-and-cookies.spec.ts) | Clear, commented examples of header and cookie manipulation. |
| [`exercises/headers-and-cookies-practice.spec.ts`](./exercises/headers-and-cookies-practice.spec.ts) | Hands-on exercises to master headers and cookies. |
| [`assessment.md`](./assessment.md) | A quiz to check your understanding of these concepts. |

---

## 🎯 Key Takeaways

After this lesson, you'll be able to:
- Simulate different types of clients and scenarios by manipulating headers.
- Validate important non-body parts of an API response.
- Test API functionality that relies on session state managed by cookies.

---

## 🔗 Next Steps

Understanding headers and cookies is crucial for testing how an API behaves under different conditions and for handling state. Next, we'll focus on another critical aspect of robust API testing:
- **Lesson 12**: API Error Handling and Status Codes