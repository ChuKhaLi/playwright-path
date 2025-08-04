# Lesson 6: Assessment - Playwright Test Fixtures and Hooks

This assessment will test your understanding of Playwright's fixtures and hooks.

## Questions

### Question 1:
**What is the main difference between a `beforeEach` hook and a test-scoped fixture?**
a) `beforeEach` runs before the test, while a fixture runs after.
b) Fixtures can provide data and objects to a test, while `beforeEach` cannot directly pass data to the test function's arguments.
c) `beforeEach` can be async, but fixtures cannot.
d) There is no functional difference; they are two ways to do the same thing.

**Answer:**
b) Fixtures can provide data and objects to a test (e.g., `async ({ myFixture }) => { ... }`), while `beforeEach` performs actions but doesn't pass values into the test arguments. This makes fixtures better for encapsulating dependencies.

---

### Question 2:
**You want to create a fixture for your `LoginPage` Page Object so you don't have to instantiate it in every test. How do you define this custom fixture?**
a) `test.addFixture('loginPage', ({ page }) => new LoginPage(page));`
b) `test.extend({ loginPage: async ({ page }, use) => { await use(new LoginPage(page)); } });`
c) `test.beforeEach(({ page }) => { const loginPage = new LoginPage(page); });`
d) `test.new('loginPage', ({ page }) => new LoginPage(page));`

**Answer:**
b) `test.extend({ loginPage: async ({ page }, use) => { await use(new LoginPage(page)); } });`. The `test.extend()` method is used to create new fixtures.

---

### Question 3:
**When would you choose a 'worker'-scoped fixture over the default 'test'-scoped fixture?**
a) When you need to share state between two different tests.
b) For a resource that is expensive to set up and can be shared by all tests running in the same worker process (e.g., a database connection).
c) When the fixture needs access to the `page` object.
d) Worker-scoped fixtures are deprecated and should not be used.

**Answer:**
b) For a resource that is expensive to set up and can be shared by all tests running in the same worker process (e.g., a database connection). This optimizes performance by avoiding redundant setup.

---

### Question 4:
**Which hook would you use to take a screenshot automatically, but *only* if a test fails?**
a) `beforeEach`
b) `afterAll`
c) `beforeAll`
d) `afterEach`

**Answer:**
d) `afterEach`. The `afterEach` hook receives a `TestInfo` object as its second argument, which contains the status of the test that just ran (`testInfo.status`). This allows you to conditionally perform actions based on the test outcome.