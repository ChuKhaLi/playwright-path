# Lesson 6: Making GET Requests and Assertions

## 📚 Lesson Overview

The `GET` request is the cornerstone of API testing. It's used to retrieve data from an API, and it's often the first type of request you'll write for any new endpoint. This lesson provides a deep dive into making `GET` requests with Playwright, handling various response types, and writing powerful, precise assertions to validate the data you get back.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Perform** `GET` requests for both single resources and collections.
- **Pass** query parameters to filter and sort API responses.
- **Write** detailed assertions for status codes, headers, and response bodies.
- **Validate** the structure and data types of a JSON response.
- **Handle** and assert on API error responses, such as `404 Not Found`.

### 🔑 Key Focus Areas
- `request.get()` method
- Handling query parameters
- Asserting on status, headers, and body
- Validating collections (arrays) of data
- Error handling for `GET` requests

### ⏱️ Duration
**2 hours** | **Type**: Core Skill

### 🔗 Prerequisites
- Completion of Lesson 5: Introduction to Playwright's `request` Fixture.

---

## 📖 What You'll Learn

### Core Concepts
- The anatomy of a `GET` test: Arrange, Act, Assert.
- How to use the `params` option to send query parameters.
- Techniques for validating nested objects and arrays in a response.
- Best practices for writing readable and maintainable assertions.

### Practical Application
- Testing an endpoint that returns a single JSON object.
- Testing an endpoint that returns an array of JSON objects.
- How to test filtering and pagination.
- Writing tests for "sad path" scenarios, like requesting a resource that doesn't exist.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | A detailed guide to making and validating `GET` requests. |
| [`examples/get-requests.spec.ts`](./examples/get-requests.spec.ts) | Clear, commented examples of various `GET` request scenarios. |
| [`exercises/get-request-practice.spec.ts`](./exercises/get-request-practice.spec.ts) | Hands-on exercises to master `GET` requests and assertions. |
| [`assessment.md`](./assessment.md) | A quiz to check your understanding of testing `GET` endpoints. |

---

## 🎯 Key Takeaways

After this lesson, you'll be able to:
- Confidently test any `GET` endpoint.
- Write robust assertions that validate every aspect of an API response.
- Understand how to test complex data retrieval scenarios, including filtering and error handling.

---

## 🔗 Next Steps

Once you've mastered retrieving data, the next logical step is to learn how to create it:
- **Lesson 7**: POST Requests and Data Creation