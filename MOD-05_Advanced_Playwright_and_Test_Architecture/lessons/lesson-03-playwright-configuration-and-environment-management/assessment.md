# Lesson 3: Assessment - Playwright Configuration

This assessment tests your knowledge of the `playwright.config.ts` file and environment management.

## Questions

### Question 1:
**What is the purpose of the `baseURL` property in the `use` object of `playwright.config.ts`?**
a) It sets the default URL for the Playwright test runner to download browsers from.
b) It specifies the base URL for all test files, so you can use relative paths like `/login` in `page.goto()`.
c) It defines the URL of the test reporting server.
d) It is a mandatory field for running any Playwright test.

**Answer:**
b) It specifies the base URL for all test files, so you can use relative paths like `/login` in `page.goto()`. This makes tests more portable across different environments.

---

### Question 2:
**How can you run your test suite exclusively on the Firefox browser, assuming you have a project named 'firefox' in your config?**
a) `npx playwright test --browser=firefox`
b) `npx playwright test --project=firefox`
c) `npx playwright test firefox`
d) You have to comment out the other projects in the `playwright.config.ts` file.

**Answer:**
b) `npx playwright test --project=firefox`. The `--project` flag allows you to target a specific project configuration.

---

### Question 3:
**What is the function of `globalSetup` in the Playwright configuration?**
a) It's a script that runs before each test file.
b) It's a script that runs once before all test files are executed, ideal for tasks like global authentication.
c) It's a script that sets up global variables for all tests.
d) It's a script that runs after all tests to clean up the environment.

**Answer:**
b) It's a script that runs once before all test files are executed, ideal for tasks like global authentication.

---

### Question 4:
**Why is it a good practice to use a `.env` file for managing environment-specific variables?**
a) It makes the `playwright.config.ts` file smaller.
b) It allows you to keep sensitive information (like API keys and passwords) and environment-specific URLs out of version control.
c) It automatically encrypts your configuration settings.
d) It is the only way to pass variables to Playwright tests.

**Answer:**
b) It allows you to keep sensitive information (like API keys and passwords) and environment-specific URLs out of version control, which is a critical security and maintenance practice.