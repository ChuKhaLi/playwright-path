# Lesson 8: Assessment

## Knowledge Check

Test your understanding of microservices testing strategies.

### Question 1

In a microservices architecture, what is the primary role of Playwright?

a) To run unit tests for each individual service.
b) To perform contract testing between services.
c) To conduct end-to-end (E2E) tests that simulate user journeys across multiple services.
d) To deploy the microservices to a testing environment.

**Answer:** c) To conduct end-to-end (E2E) tests that simulate user journeys across multiple services.

### Question 2

What type of test verifies that two separate microservices can communicate correctly by checking that one service provides the data the other expects?

a) Unit Test
b) Integration Test
c) Contract Test
d) E2E Test

**Answer:** c) Contract Test

### Question 3

Which Playwright method is used to intercept and mock network requests, which is useful for isolating services?

a) `page.mock()`
b) `page.intercept()`
c) `page.route()`
d) `page.fulfill()`

**Answer:** c) `page.route()`

### Question 4

What is a major benefit of mocking API requests in your E2E tests?

a) It makes the tests run slower but more thoroughly.
b) It allows you to test the frontend UI in isolation and simulate specific backend states (like errors).
c) It eliminates the need for unit tests.
d) It is the only way to test microservices.

**Answer:** b) It allows you to test the frontend UI in isolation and simulate specific backend states (like errors).

### Question 5

What does a "balanced" microservices testing strategy typically look like?

a) Mostly E2E tests, with very few unit tests.
b) Only contract tests and unit tests.
c) A large number of fast unit and contract tests, with a small, targeted suite of E2E tests for critical user journeys.
d) An equal number of unit, integration, contract, and E2E tests.

**Answer:** c) A large number of fast unit and contract tests, with a small, targeted suite of E2E tests for critical user journeys.