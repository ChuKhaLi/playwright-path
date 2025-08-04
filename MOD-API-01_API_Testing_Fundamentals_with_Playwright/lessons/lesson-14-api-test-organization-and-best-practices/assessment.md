# Assessment: API Test Organization and Best Practices

This assessment tests your understanding of how to structure and organize a maintainable API test suite.

---

## Question 1: Test Organization (Multiple Choice)

What is the most common and effective way to organize your API test files?
A) By HTTP method (e.g., `get-tests.spec.ts`, `post-tests.spec.ts`).
B) By API resource (e.g., `users.spec.ts`, `products.spec.ts`).
C) All in a single, large test file.
D) By the date they were created.

---

## Question 2: Grouping Tests (Multiple Choice)

Which Playwright feature is used to group related tests together within a single file for better organization and reporting?
A) `test.group()`
B) `test.suite()`
C) `test.describe()`
D) `test.section()`

---

## Question 3: Reusable Logic (Short Answer)

If you find yourself writing the exact same login logic in multiple test files, what should you do to avoid code duplication?

---

## Question 4: API Client Pattern (Short Answer)

What is the main benefit of using an "API Client" class in your test suite?

---

## Question 5: Naming Conventions (Fill in the Blank)

A good test name often follows the "should" convention. Fill in the blank to complete a descriptive test name.

`test('should ____ when a required field is missing')`

---

## Answer Key

### Question 1
**B) By API resource (e.g., `users.spec.ts`, `products.spec.ts`).** This keeps all tests related to a specific part of the API together.

### Question 2
**C) `test.describe()`**.

### Question 3
You should extract the login logic into a **reusable helper function** in a shared `utils` file.

### Question 4
It **abstracts away the implementation details** of making API calls (like URLs and headers), making the tests more readable and much easier to maintain if the API changes.

### Question 5
A good answer would be something like **"return a 400 Bad Request error"**.
`test('should return a 400 Bad Request error when a required field is missing')`