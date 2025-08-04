# Assessment: Data-Driven API Testing

This assessment tests your understanding of data-driven testing principles and their implementation.

---

## Question 1: Core Concept (Multiple Choice)

What is the primary benefit of data-driven testing?
A) It makes tests run faster.
B) It separates test logic from test data, reducing code duplication.
C) It automatically generates test data for you.
D) It only works for `GET` requests.

---

## Question 2: Implementation (Multiple Choice)

What is the most common way to implement a data-driven test in Playwright?
A) Using a `while` loop inside a single `test()` block.
B) Creating a separate test file for each piece of data.
C) Using a `for...of` loop to iterate over an array of test cases and creating a `test()` block for each one.
D) Using `test.describe.each()`.

---

## Question 3: Dynamic Test Names (Short Answer)

Why is it important to create dynamic test names in a data-driven test?

---

## Question 4: External Data (Short Answer)

Besides keeping test files cleaner, what is another major advantage of storing test data in an external file (like JSON or CSV)?

---

## Question 5: Code Snippet (Fill in the Blank)

Fill in the blank to correctly create a dynamic test title.

```typescript
const users = [{ id: 1, name: 'George' }, { id: 2, name: 'Janet' }];

for (const user of users) {
  test(`____`, async ({ request }) => {
    // ... test logic
  });
}
```

---

## Answer Key

### Question 1
**B) It separates test logic from test data, reducing code duplication.**

### Question 2
**C) Using a `for...of` loop to iterate over an array of test cases and creating a `test()` block for each one.**

### Question 3
To make the test report **clear and easy to read**. Each test run will have a descriptive title, making it easy to see which specific data set passed or failed.

### Question 4
It allows **non-technical stakeholders** (like BAs or manual QAs) to contribute to test coverage by adding new data to the file without having to touch the test code.

### Question 5
```typescript
test(`should get user: ${user.name}`, async ({ request }) => {
  // ... test logic
});