# Lesson 3: Introduction to REST APIs

## 📚 Lesson Overview

While "API" is a general term, most modern web APIs are built following a specific architectural style called **REST (REpresentational State Transfer)**. Understanding the principles of REST is essential for testing APIs effectively, as it dictates how they are structured and how they behave. This lesson demystifies REST and explains its core constraints from a tester's perspective.

### 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- **Define** what a RESTful API is.
- **Identify** the six guiding constraints of REST architecture.
- **Explain** how REST leverages standard HTTP methods for resource manipulation.
- **Recognize** the characteristics of a well-designed RESTful endpoint.
- **Apply** knowledge of REST principles to anticipate API behavior and design better tests.

### 🔑 Key Focus Areas
- The Six Constraints of REST
- Resources and Representations
- How REST uses HTTP Semantics
- What "Stateless" Means in Practice
- Richardson Maturity Model (as a concept)

### ⏱️ Duration
**1.5 hours** | **Type**: API Foundation

### 🔗 Prerequisites
- Completion of Lesson 1: HTTP Fundamentals for Testers
- Completion of Lesson 2: API Testing Concepts and Terminology

---

## 📖 What You'll Learn

### Core Concepts
- The client-server model in REST.
- The principle of statelessness and its impact on testing.
- Caching constraints and how they affect API performance.
- The concept of a uniform interface and why it's the central feature of REST.
- How resources are identified and manipulated through representations (like JSON).

### Practical Application
- How to analyze an API's design to see if it is "RESTful."
- How understanding REST helps you predict API behavior without even reading the documentation.
- How to structure your tests to align with RESTful principles.

---

## 📁 Lesson Structure

| File | Description |
|------|-------------|
| [`content.md`](./content.md) | Comprehensive lesson content explaining the principles of REST. |
| [`examples/rest-api-design.md`](./examples/rest-api-design.md) | Examples of well-designed RESTful APIs vs. non-RESTful APIs. |
| [`exercises/identifying-rest-principles.md`](./exercises/identifying-rest-principles.md) | Exercises to help you identify REST principles in action. |
| [`assessment.md`](./assessment.md) | Quiz to validate your understanding of REST architecture. |

---

## 🎯 Key Takeaways

After completing this lesson, you'll be able to:
- Look at an API endpoint and evaluate how "RESTful" it is.
- Understand the "why" behind the structure of modern web APIs.
- Use your knowledge of REST to write more intuitive and effective API tests.
- Differentiate between a true REST API and an API that just uses HTTP (often called an "HTTP-based API").

---

## 🔗 Next Steps

Understanding REST architecture is the final piece of foundational theory before we start diving deep into practical testing with Playwright:
- **Lesson 4**: JSON Data Handling and Validation
- **Lesson 5**: Introduction to Playwright's `request` Fixture
- **Lesson 6**: Making GET Requests and Assertions