# Lesson 8: Assessment

## Knowledge Check

### Question 1
What is the primary goal of "shifting left" in Continuous Testing?

a) To move all testing to the end of the development cycle.
b) To find and fix bugs as early as possible in the development process.
c) To have developers write all the tests.
d) To run tests from left to right on the screen.

**Answer:** b) To find and fix bugs as early as possible in the development process.

---

### Question 2
What is an ephemeral or dynamic test environment in the context of CI/CD?

a) A permanent staging environment that is always running.
b) A developer's local machine.
c) A temporary, isolated environment that is automatically created for a specific pull request and destroyed after.
d) The production environment.

**Answer:** c) A temporary, isolated environment that is automatically created for a specific pull request and destroyed after.

---

### Question 3
What is the purpose of sharding tests in a CI/CD pipeline?

a) To run tests in a random order.
b) To split the test suite across multiple machines to run them in parallel and reduce overall execution time.
c) To combine all tests into a single file.
d) To delete tests that are no longer needed.

**Answer:** b) To split the test suite across multiple machines to run them in parallel and reduce overall execution time.

---

### Question 4
In a multi-stage pipeline, why is it a good practice to run fast tests (like linting and API tests) before slow tests (like E2E tests)?

a) To make the pipeline look busy.
b) To provide the fastest possible feedback. If a fast test fails, the pipeline stops immediately without wasting time on slow tests.
c) E2E tests depend on the results of API tests.
d) It is not a good practice; all tests should be run at the same time.

**Answer:** b) To provide the fastest possible feedback. If a fast test fails, the pipeline stops immediately without wasting time on slow tests.

---

### Question 5
What is the benefit of caching dependencies and Playwright browsers in a CI/CD pipeline?

a) It makes the tests less reliable.
b) It increases the security of the pipeline.
c) It significantly speeds up the pipeline by avoiding the need to download the same files on every run.
d) It allows you to run tests offline.

**Answer:** c) It significantly speeds up the pipeline by avoiding the need to download the same files on every run.