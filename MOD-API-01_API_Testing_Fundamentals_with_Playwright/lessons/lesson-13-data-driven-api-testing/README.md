# Lesson 13: Data-Driven API Testing

## 📚 Lesson Overview

So far, we've been hardcoding our test data directly into our test files. This is fine for simple cases, but what if you need to test an endpoint with dozens of different inputs? Creating a separate test for each one would be incredibly inefficient. This lesson introduces **Data-Driven Testing**, a powerful technique where you separate your test logic from your test data, allowing you to run a single test with multiple data sets.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Explain** the concept and benefits of data-driven testing.
- **Implement** a data-driven test in Playwright by looping over an array of data.
- **Structure** test data in a clean and maintainable way.
- **Create** dynamic test titles that reflect the data being used.
- **Read** test data from an external source, such as a CSV or JSON file.

### 🔑 Key Focus Areas
- Separating test logic from test data
- Looping over data sets within a test file
- Dynamic test naming
- Reading external data files

### ⏱️ Duration
**2 hours** | **Type**: Advanced Technique

### 🔗 Prerequisites
- Completion of all previous lessons (1-12).

---

## 📖 What You'll Learn

### Core Concepts
- The "Don't Repeat Yourself" (DRY) principle in testing.
- How data-driven testing improves test coverage and maintainability.
- Different strategies for storing and accessing test data.

### Practical Application
- Refactoring a simple test into a data-driven one.
- Using a `for` loop to run multiple test cases within a single `test()` block.
- Creating descriptive test names like `test('should fail with invalid email: {email}')`.
- Using Node.js's `fs` module to load test data from a JSON file.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | A detailed guide to the principles and patterns of data-driven testing. |
| [`examples/data-driven.spec.ts`](./examples/data-driven.spec.ts) | Clear, commented examples of data-driven tests. |
| [`data/users.json`](./data/users.json) | An example external data file to be used in tests. |
| [`exercises/data-driven-practice.spec.ts`](./exercises/data-driven-practice.spec.ts) | Hands-on exercises to build your own data-driven tests. |
| [`assessment.md`](./assessment.md) | A quiz to check your understanding of data-driven concepts. |

---

## 🎯 Key Takeaways

After this lesson, you'll be able to:
- Write much more efficient and scalable tests.
- Easily expand your test coverage by simply adding new data, without changing test logic.
- Keep your test data separate from your test code, making both easier to manage.

---

## 🔗 Next Steps

With data-driven testing in your toolkit, you're ready to think about the bigger picture of how to structure your entire test suite for long-term success.
- **Lesson 14**: API Test Organization and Best Practices