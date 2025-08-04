# Lesson 15: Module Recap and Integration Testing

## 📚 Lesson Overview

Congratulations on reaching the final lesson of the API Testing Fundamentals module! In this capstone lesson, we will recap the essential skills you've learned and introduce a powerful, advanced concept: **integration testing**, where you combine API and E2E tests to create incredibly efficient and robust testing scenarios.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Summarize** the core concepts of API testing covered in this module.
- **Explain** the benefits of combining API and E2E tests.
- **Implement** a test that uses an API call to set up a state and then verifies the result in the UI.
- **Implement** a test that performs an action in the UI and then uses an API call to verify the result.
- **Identify** scenarios where a hybrid API/E2E testing approach is most effective.

### 🔑 Key Focus Areas
- Module knowledge consolidation
- Hybrid testing patterns (API -> UI and UI -> API)
- Using the `request` and `page` fixtures in the same test
- Practical integration scenarios

### ⏱️ Duration
**2 hours** | **Type**: Capstone

### 🔗 Prerequisites
- Completion of all previous lessons (1-14).

---

## 📖 What You'll Learn

### Core Concepts
- A comprehensive review of the API testing lifecycle, from HTTP fundamentals to test organization.
- The "Arrange with API, Act on UI, Assert on API/UI" pattern.
- How hybrid tests can dramatically speed up your E2E suite by bypassing slow UI actions for setup and verification.

### Practical Application
- **Seeding Data**: Writing a test that creates a user via an API call and then logs in as that user through the UI.
- **Verifying Backend State**: Writing a test that submits a form in the UI and then makes an API call to the database to verify the data was saved correctly, bypassing the need for further UI navigation.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | A recap of the module and a guide to hybrid testing patterns. |
| [`examples/hybrid-tests.spec.ts`](./examples/hybrid-tests.spec.ts) | Clear, commented examples of combining API and E2E tests. |
| [`exercises/hybrid-practice.spec.ts`](./exercises/hybrid-practice.spec.ts) | A hands-on exercise to build your own hybrid test. |
| [`assessment.md`](./assessment.md) | A final quiz covering the entire module. |

---

## 🎯 Key Takeaways

After this lesson, you'll be able to:
- Confidently apply all the API testing skills learned in this module.
- Write highly efficient tests that leverage the strengths of both API and E2E testing.
- Think strategically about how to design the fastest and most reliable tests for any given scenario.

---

## 🔗 Next Steps

You have now completed the API Testing Fundamentals module! You are well-equipped to write, organize, and maintain a professional API test suite. From here, you can explore more advanced topics like:
- API Performance and Load Testing
- API Security Testing
- Contract Testing