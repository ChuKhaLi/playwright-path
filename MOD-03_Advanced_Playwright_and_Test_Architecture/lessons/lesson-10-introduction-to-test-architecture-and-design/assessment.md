# Lesson 10: Assessment - Test Architecture and Design

## Knowledge Check

### Question 1

What is the primary goal of a good test architecture?

a) To use the most advanced and complex programming techniques.
b) To create a test framework that is scalable, maintainable, and easy for the team to use.
c) To ensure that all tests run in under one second.
d) To write as few lines of code as possible.

**Answer:** b

---

### Question 2

In a layered test architecture, which layer is responsible for encapsulating UI interaction logic?

a) The Test Layer
b) The Page Object Layer
c) The Utilities Layer
d) The Configuration Layer

**Answer:** b

---

### Question 3

What does the DRY principle stand for in the context of test design?

a) Don't Run Yesterday's tests.
b) Don't Repeat Yourself.
c) Do Repeat Yourself.
d) Data-Rich Yields.

**Answer:** b

---

### Question 4

In the recommended folder structure, where should you store reusable helper functions, like a custom logger or an API client?

a) `tests/specs/`
b) `tests/pages/`
c) `tests/utils/`
d) `tests/data/`

**Answer:** c

---

### Question 5

According to the Single Responsibility Principle, what should a `ProductPage` class be responsible for?

a) Interacting with the product page, running tests on the product page, and writing reports.
b) Only the logic and locators related to the product page.
c) Managing all product data for the entire application.
d) Configuring the browser for product page tests.

**Answer:** b