# Lesson 7: POST Requests and Data Creation

## 📚 Lesson Overview

After learning how to retrieve data, the next step is to learn how to create it. This lesson focuses on the `POST` request, the HTTP method used for creating new resources. You'll learn how to construct a `POST` request with a data payload, send it using Playwright, and perform detailed validations to ensure the resource was created correctly.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Construct** a `POST` request with a JSON payload using the `data` option.
- **Explain** the significance of the `201 Created` status code.
- **Validate** the response body of a successful creation request.
- **Assert** on server-generated values like IDs and timestamps.
- **Write** tests for common data validation scenarios (e.g., missing required fields).

### 🔑 Key Focus Areas
- `request.post()` method
- The `data` option for payloads
- Validating `201 Created` responses
- Asserting on server-generated data
- Testing input validation

### ⏱️ Duration
**2 hours** | **Type**: Core Skill

### 🔗 Prerequisites
- Completion of Lesson 6: Making GET Requests and Assertions.

---

## 📖 What You'll Learn

### Core Concepts
- The role of `POST` in RESTful APIs.
- How to structure a test for a data creation workflow.
- The importance of the `Location` header in `201 Created` responses.
- Strategies for testing how an API validates incoming data.

### Practical Application
- Creating a new user with a `POST` request.
- Validating that the created user's data matches the sent data.
- Writing a "sad path" test that sends invalid data and expects a `400 Bad Request` response.
- How to use dynamic data to ensure your creation tests are independent.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | A detailed guide to making and validating `POST` requests. |
| [`examples/post-requests.spec.ts`](./examples/post-requests.spec.ts) | Clear, commented examples of various `POST` request scenarios. |
| [`exercises/post-request-practice.spec.ts`](./exercises/post-request-practice.spec.ts) | Hands-on exercises to master `POST` requests and data validation. |
| [`assessment.md`](./assessment.md) | A quiz to check your understanding of testing `POST` endpoints. |

---

## 🎯 Key Takeaways

After this lesson, you'll be able to:
- Write robust tests for any API endpoint that creates data.
- Understand the complete lifecycle of a created resource, from request to response validation.
- Test an API's input validation to ensure data integrity.

---

## 🔗 Next Steps

With the ability to create and read data, you're ready to learn how to modify it:
- **Lesson 8**: PUT and PATCH Requests for Data Updates