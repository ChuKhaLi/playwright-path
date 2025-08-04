# Lesson 11: Assessment - Test Architecture and Scalability

This assessment will test your understanding of high-level test architecture patterns.

## Questions

### Question 1:
**What is the primary benefit of using a "Service/API Layer" to set up test state?**
a) It makes the test reports look more technical.
b) It's the only way to test the back-end.
c) It makes tests significantly faster and more reliable by bypassing slow and potentially flaky UI interactions for setup.
d) It reduces the number of Page Objects you need to create.

**Answer:**
c) It makes tests significantly faster and more reliable by bypassing slow and potentially flaky UI interactions for setup. This is a key strategy for building a scalable test suite.

---

### Question 2:
**What is the main principle behind a scalable test architecture?**
a) Writing all test logic in a single, large file.
b) Using `test.only` to run tests one by one.
c) Separation of concerns: keeping test logic, UI interactions, API clients, and data in distinct, well-defined layers.
d) Avoiding the use of any external libraries.

**Answer:**
c) Separation of concerns: keeping test logic, UI interactions, API clients, and data in distinct, well-defined layers. This makes the framework modular, maintainable, and easier to understand.

---

### Question 3:
**What is the role of an "Action/Workflow Layer" in a test framework?**
a) To define locators for web pages.
b) To compose lower-level Page Object methods into high-level, reusable user journeys (e.g., a complete purchase workflow).
c) To make direct database connections.
d) To replace the need for Playwright fixtures.

**Answer:**
b) To compose lower-level Page Object methods into high-level, reusable user journeys (e.g., a complete purchase workflow). This makes the tests themselves more readable and focused on business outcomes.

---

### Question 4:
**What is the most critical rule to follow when designing tests to run in parallel?**
a) All tests must use the same browser.
b) Tests must be completely independent and isolated; they cannot share state.
c) All tests must be in the same test file.
d) You must use worker-scoped fixtures for everything.

**Answer:**
b) Tests must be completely independent and isolated; they cannot share state. If one test's execution can affect another's outcome, you will have flaky and unpredictable results in a parallel environment.