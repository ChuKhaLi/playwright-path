# Lesson 2: Assessment

## Knowledge Check

### Question 1
In a scalable directory structure, where should you typically store Page Object classes?

a) `/tests/`
b) `/data/`
c) `/pages/`
d) `/utils/`

**Answer:** c) `/pages/`

---

### Question 2
What is the primary purpose of using "projects" in `playwright.config.ts`?

a) To organize tests into different folders.
b) To define different test environments (e.g., staging, production) and browser configurations.
c) To list the project dependencies.
d) To write documentation for the test framework.

**Answer:** b) To define different test environments (e.g., staging, production) and browser configurations.

---

### Question 3
What is the main advantage of using test fixtures for authentication?

a) It makes the tests run faster.
b) It eliminates the need for a password.
c) It centralizes the login logic, reducing code duplication and improving maintainability.
d) It allows you to test multiple users at the same time.

**Answer:** c) It centralizes the login logic, reducing code duplication and improving maintainability.

---

### Question 4
Which command would you use to run tests specifically for the "firefox-prod" project defined in the `playwright.config.ts`?

a) `npx playwright test`
b) `npx playwright test --browser=firefox`
c) `npx playwright test --project=firefox-prod`
d) `npx playwright test --env=prod`

**Answer:** c) `npx playwright test --project=firefox-prod`

---

### Question 5
Why is a consistent directory structure important for scalability?

a) It is a strict requirement by Playwright.
b) It makes the framework easier for team members to navigate, understand, and contribute to.
c) It improves the performance of test execution.
d) It automatically generates reports.

**Answer:** b) It makes the framework easier for team members to navigate, understand, and contribute to.