# Lesson 10: Handling Authentication in API Tests

## 📚 Lesson Overview

Most real-world APIs are not open to the public; they require **authentication** to verify your identity before you can access their resources. This lesson is one of the most important in the module, as it teaches you how to handle common authentication patterns in your Playwright API tests, allowing you to test secure endpoints.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Explain** why authentication is necessary for APIs.
- **Differentiate** between authentication and authorization.
- **Implement** tests for endpoints secured with API Keys.
- **Implement** tests for endpoints secured with Bearer Tokens (JWT).
- **Manage** authentication credentials securely within your test framework.
- **Automate** the process of logging in to get a token for use in subsequent tests.

### 🔑 Key Focus Areas
- API Keys (in headers and query params)
- Bearer Token (JWT) authentication
- The "Login -> Get Token -> Use Token" pattern
- Storing and reusing authentication state

### ⏱️ Duration
**2.5 hours** | **Type**: Core Skill

### 🔗 Prerequisites
- Completion of all previous lessons (1-9).

---

## 📖 What You'll Learn

### Core Concepts
- The difference between who you are (Authentication) and what you're allowed to do (Authorization).
- Common authentication schemes used in REST APIs.
- How to pass credentials in HTTP headers, specifically the `Authorization` header.
- The lifecycle of a session token.

### Practical Application
- Writing a test that uses a static API key.
- Creating a reusable "login" function that retrieves an authentication token.
- Passing a dynamic token to subsequent API requests.
- Using Playwright's configuration to manage sensitive credentials instead of hardcoding them.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | A detailed guide to common API authentication methods. |
| [`examples/auth-requests.spec.ts`](./examples/auth-requests.spec.ts) | Clear, commented examples for API Key and Bearer Token auth. |
| [`exercises/auth-practice.spec.ts`](./exercises/auth-practice.spec.ts) | Hands-on exercises to master authentication workflows. |
| [`assessment.md`](./assessment.md) | A quiz to check your understanding of authentication concepts. |

---

## 🎯 Key Takeaways

After this lesson, you'll be able to:
- Test the vast majority of secure REST APIs.
- Write clean, maintainable tests that handle login and session management gracefully.
- Understand how to protect sensitive credentials in your test suite.

---

## 🔗 Next Steps

Once you can authenticate, you can interact with almost any part of an API. The next lessons will focus on more advanced interactions.
- **Lesson 11**: Working with Headers and Cookies
- **Lesson 12**: API Error Handling and Status Codes