# Lesson 5: Introduction to Playwright's `request` Fixture

## 📚 Lesson Overview

This is where theory meets practice! This lesson introduces you to the `request` fixture, Playwright's powerful built-in tool for API testing. You'll learn how to make your first API requests, handle responses, and write meaningful assertions, all within the Playwright test environment.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Use** the `request` fixture to make basic `GET` and `POST` requests.
- **Explain** how the `request` fixture simplifies API testing.
- **Configure** a base URL for your API tests in `playwright.config.ts`.
- **Parse** a JSON response using the `.json()` method.
- **Write** basic assertions to validate response status and body content.

### 🔑 Key Focus Areas
- The `request` fixture
- Making `GET` and `POST` requests
- Basic response validation
- Configuration in `playwright.config.ts`

### ⏱️ Duration
**2 hours** | **Type**: Core Skill

### 🔗 Prerequisites
- Completion of Lessons 1-4 (HTTP, REST, JSON).
- A working Playwright setup.

---

## 📖 What You'll Learn

### Core Concepts
- The purpose and benefits of the `request` fixture.
- The lifecycle of an API test in Playwright.
- How to pass data in `POST` requests.
- How to read status codes and response bodies.

### Practical Application
- Writing your very first API test with Playwright.
- Setting up a clean and reusable configuration for your API tests.
- Debugging a simple API test failure.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | A step-by-step guide to using the `request` fixture. |
| [`examples/basic-requests.spec.ts`](./examples/basic-requests.spec.ts) | Clear, commented examples of `GET` and `POST` requests. |
| [`exercises/first-api-tests.spec.ts`](./exercises/first-api-tests.spec.ts) | Hands-on exercises to write your first API tests. |
| [`assessment.md`](./assessment.md) | A quiz to check your understanding of the `request` fixture. |

---

## 🎯 Key Takeaways

After this lesson, you'll be equipped to:
- Write and run basic API tests using Playwright.
- Understand the fundamental workflow of API testing in a real test script.
- Set up an efficient testing environment for the rest of the module.

---

## 🔗 Next Steps

With the ability to make basic requests, you're ready to explore the full range of API interactions:
- **Lesson 6**: Making GET Requests and Assertions
- **Lesson 7**: POST Requests and Data Creation
- **Lesson 8**: PUT and PATCH Requests for Data Updates