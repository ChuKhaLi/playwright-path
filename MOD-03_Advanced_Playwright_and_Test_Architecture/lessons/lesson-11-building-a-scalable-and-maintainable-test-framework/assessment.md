# Lesson 11: Assessment - Building a Scalable Framework

## Knowledge Check

### Question 1

What is the primary purpose of a `BasePage` class in a test framework?

a) To contain all the test logic for the entire application.
b) To act as a parent class for all other Page Objects, sharing common functionality (like header/footer interactions) and reducing code duplication.
c) To run all the tests from a single file.
d) To store all the test data for the application.

**Answer:** b

---

### Question 2

How do you make a `LoginPage` class inherit from a `BasePage` class in TypeScript?

a) `class LoginPage implements BasePage`
b) `class LoginPage extends BasePage`
c) `class LoginPage inherits BasePage`
d) `class LoginPage uses BasePage`

**Answer:** b

---

### Question 3

What is a custom Playwright fixture?

a) A special type of test that only runs on certain browsers.
b) A way to define and provide reusable resources (like an initialized Page Object or an API client) directly to your tests.
c) A configuration file for setting up test data.
d) A plugin for generating custom test reports.

**Answer:** b

---

### Question 4

If you create a custom fixture file (`custom-fixtures.ts`), what do you need to change in your test files to use it?

a) You need to add a special comment at the top of the test file.
b) You don't need to change anything; Playwright finds it automatically.
c) You need to import `test` and `expect` from your custom fixture file instead of from `@playwright/test`.
d) You need to pass the fixture name as a command-line argument.

**Answer:** c

---

### Question 5

What is the main benefit of creating an `ApiClient` utility class?

a) It makes your API requests run faster.
b) It's the only way to make API requests in Playwright.
c) It encapsulates API request logic, making it reusable and keeping your API tests clean and maintainable.
d) It automatically generates documentation for your API.

**Answer:** c