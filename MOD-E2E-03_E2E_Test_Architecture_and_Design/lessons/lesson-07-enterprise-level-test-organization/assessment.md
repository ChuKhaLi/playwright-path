# Lesson 7: Assessment

## Knowledge Check

### Question 1
What is the primary purpose of using tags like `@smoke` or `@regression` in your tests?

a) To make the test titles look more organized.
b) To categorize tests so you can run specific subsets of them using the `--grep` flag.
c) To assign a priority score to each test.
d) To link tests to Jira tickets.

**Answer:** b) To categorize tests so you can run specific subsets of them using the `--grep` flag.

---

### Question 2
What is the function of a `CODEOWNERS` file in a Git repository?

a) It lists everyone who has ever contributed to the codebase.
b) It automatically assigns reviewers to pull requests based on which files were changed.
c) It prevents anyone except the owners from modifying the files.
d) It's a documentation file explaining who owns which feature.

**Answer:** b) It automatically assigns reviewers to pull requests based on which files were changed.

---

### Question 3
Which command would you use to run all tests that are tagged with `@smoke` but NOT tagged with `@wip`?

a) `npx playwright test --grep @smoke --grep-invert @wip`
b) `npx playwright test --grep "@smoke and not @wip"`
c) `npx playwright test --skip @wip --run @smoke`
d) `npx playwright test --grep @smoke-@wip`

**Answer:** a) `npx playwright test --grep @smoke --grep-invert @wip`

---

### Question 4
What is a major advantage of using a monorepo for your application and test code?

a) It keeps the repositories small and focused.
b) It prevents developers from seeing the test code.
c) It makes it easy to keep tests in sync with application code, as they can be updated in the same pull request.
d) It requires simpler CI/CD configuration than a multi-repo setup.

**Answer:** c) It makes it easy to keep tests in sync with application code, as they can be updated in the same pull request.

---

### Question 5
In an enterprise setting with multiple teams, what is the primary benefit of organizing your `tests` directory by team name (e.g., `tests/auth-team/`, `tests/cart-team/`)?

a) It's the only structure Playwright supports.
b) It makes it very clear who owns which tests, which helps with maintenance and responsibility.
c) It allows teams to use different programming languages.
d) It makes the test suite run faster.

**Answer:** b) It makes it very clear who owns which tests, which helps with maintenance and responsibility.