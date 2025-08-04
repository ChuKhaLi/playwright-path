# Lesson 8: PUT and PATCH Requests for Data Updates

## 📚 Lesson Overview

You've learned to read (`GET`) and create (`POST`) data. Now it's time to learn how to modify it. This lesson covers the two HTTP methods used for updating resources: `PUT` and `PATCH`. You'll learn the critical difference between them and how to write tests that verify data updates correctly.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Differentiate** between `PUT` and `PATCH` requests and their use cases.
- **Construct** a `PUT` request to completely replace a resource.
- **Construct** a `PATCH` request to partially update a resource.
- **Write** assertions to validate that a resource has been updated correctly.
- **Understand** the concept of idempotency and its relevance to `PUT` requests.

### 🔑 Key Focus Areas
- `request.put()` and `request.patch()` methods
- `PUT` vs. `PATCH`: The key differences
- Validating update responses
- Idempotency testing

### ⏱️ Duration
**2 hours** | **Type**: Core Skill

### 🔗 Prerequisites
- Completion of Lesson 7: POST Requests and Data Creation.

---

## 📖 What You'll Learn

### Core Concepts
- The semantic difference between replacing a resource (`PUT`) and modifying it (`PATCH`).
- Why `PUT` requests should be idempotent and how to test for it.
- How to structure a test for an update workflow (e.g., GET -> UPDATE -> GET).

### Practical Application
- Using `request.put()` to send a complete resource representation.
- Using `request.patch()` to send only the fields that need to be changed.
- Writing tests that verify that a `PATCH` request only modifies the specified fields and leaves others unchanged.
- Asserting on the `200 OK` status code for successful updates.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | A detailed guide to making and validating `PUT` and `PATCH` requests. |
| [`examples/update-requests.spec.ts`](./examples/update-requests.spec.ts) | Clear, commented examples of `PUT` and `PATCH` scenarios. |
| [`exercises/update-request-practice.spec.ts`](./exercises/update-request-practice.spec.ts) | Hands-on exercises to master data updates. |
| [`assessment.md`](./assessment.md) | A quiz to check your understanding of `PUT` and `PATCH`. |

---

## 🎯 Key Takeaways

After this lesson, you'll be able to:
- Choose the correct HTTP method for any data update scenario.
- Write robust tests that confirm data is being modified correctly.
- Understand and test for idempotency, a key concept in reliable API design.

---

## 🔗 Next Steps

You've almost mastered the core CRUD operations. The final piece is learning how to clean up the data you've created and modified.
- **Lesson 9**: DELETE Requests and Cleanup