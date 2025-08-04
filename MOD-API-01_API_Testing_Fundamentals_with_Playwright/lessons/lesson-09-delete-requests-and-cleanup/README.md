# Lesson 9: DELETE Requests and Cleanup

## 📚 Lesson Overview

You've learned to create, read, and update resources. The final piece of the puzzle is learning how to delete them. This lesson focuses on the `DELETE` method, which is used to remove resources from a server. We'll also discuss the critical concept of test data cleanup and why it's essential for maintaining a stable testing environment.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Construct** and send a `DELETE` request using `request.delete()`.
- **Explain** the significance of the `204 No Content` status code.
- **Write** tests to verify that a resource has been successfully deleted.
- **Understand** the importance of test data setup and teardown.
- **Implement** a basic cleanup strategy using `test.afterEach()` or `test.afterAll()`.

### 🔑 Key Focus Areas
- `request.delete()` method
- Validating `204 No Content` responses
- The "Create-Verify-Delete-Verify" test pattern
- Test data cleanup strategies

### ⏱️ Duration
**1.5 hours** | **Type**: Core Skill

### 🔗 Prerequisites
- Completion of Lesson 8: PUT and PATCH Requests for Data Updates.

---

## 📖 What You'll Learn

### Core Concepts
- The role of the `DELETE` method in a RESTful API.
- Why a successful `DELETE` request often returns an empty body.
- How to confirm a deletion by making a subsequent `GET` request.
- The concept of a "test data lifecycle" and the need for cleanup.

### Practical Application
- Writing a test that creates a resource and then deletes it.
- Verifying that a deleted resource can no longer be accessed.
- Using Playwright's `afterEach` hook to automatically clean up data created during a test.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | A detailed guide to making `DELETE` requests and managing test data. |
| [`examples/delete-requests.spec.ts`](./examples/delete-requests.spec.ts) | Clear, commented examples of `DELETE` and cleanup patterns. |
| [`exercises/delete-request-practice.spec.ts`](./exercises/delete-request-practice.spec.ts) | Hands-on exercises to master resource deletion and cleanup. |
| [`assessment.md`](./assessment.md) | A quiz to check your understanding of `DELETE` requests. |

---

## 🎯 Key Takeaways

After this lesson, you'll be able to:
- Write tests for all four core CRUD (Create, Read, Update, Delete) operations.
- Understand how to write self-contained tests that clean up after themselves.
- Build more reliable and maintainable API test suites.

---

## 🔗 Next Steps

You have now mastered the fundamental CRUD operations! The next lessons will build on this foundation by tackling more advanced and real-world topics.
- **Lesson 10**: Handling Authentication in API Tests