# Lesson 5: Assessment - Data-Driven Testing

## Knowledge Check

### Question 1

What is the core principle of Data-Driven Testing (DDT)?

a) To drive the tests using a graphical user interface.
b) To separate the test script logic from the test data.
c) To ensure all test data is stored in the same file as the test logic.
d) To write a separate test for every single data input.

**Answer:** b

---

### Question 2

Which of the following is a primary benefit of DDT?

a) It makes tests run faster.
b) It reduces the need for Page Objects.
c) It allows you to easily increase test coverage by adding new data, without changing the test logic.
d) It automatically generates reports.

**Answer:** c

---

### Question 3

In Playwright, if you loop through an array of data to create tests, what does Playwright do?

a) It runs all the data in a single test, reporting it as one result.
b) It generates a separate, independent test for each item in the data array.
c) It requires a special "data-driven" command to be enabled.
d) It only runs the test with the first item in the array.

**Answer:** b

---

### Question 4

Why is it often better to store test data in an external file (like JSON) instead of an array inside the test file?

a) Because JavaScript arrays have a limit of 10 items.
b) For better organization, maintainability, and separation of concerns, especially with large data sets.
c) Because JSON files are executed more quickly by the test runner.
d) Because you cannot use complex objects in an inline array.

**Answer:** b

---

### Question 5

How can you use data from a `users.json` file in your Playwright test?

a) `const users = require('users.json');`
b) `const users = readFileSync('users.json');`
c) `import users from '../data/users.json';`
d) You cannot directly import JSON; you must use a special data reader library.

**Answer:** c