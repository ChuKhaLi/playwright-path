# Assessment: Handling Complex Authentication Flows

## Knowledge Check

### Question 1
What is the main benefit of using a global setup file and `storageState` for authentication in Playwright?
a) It makes tests run slower but more securely.
b) It allows you to log in once and reuse the session, speeding up the test suite.
c) It is the only way to test applications with a login form.
d) It automatically handles MFA without any extra code.

**Answer:** b) It allows you to log in once and reuse the session, speeding up the test suite.

---

### Question 2
In which file do you typically configure Playwright to use a global setup file?
a) `package.json`
b) `auth.setup.ts`
c) `playwright.config.ts`
d) The test file itself.

**Answer:** c) `playwright.config.ts`

---

### Question 3
What is a recommended strategy for handling TOTP-based MFA in a test environment?
a) Manually entering the code from your phone for each test run.
b) Disabling MFA for the test user account in the test environment.
c) Using a library like `otplib` to generate the code programmatically.
d) Both b and c are recommended strategies.

**Answer:** d) Both b and c are recommended strategies.

---

### Question 4
Why is it generally a bad idea to test a third-party OAuth login flow (e.g., "Login with Google") directly?
a) It is impossible to automate third-party websites.
b) The third party is responsible for testing their own login flow, and it can be unreliable to automate.
c) It violates the terms of service of the third-party provider.
d) Playwright does not support navigating to different domains.

**Answer:** b) The third party is responsible for testing their own login flow, and it can be unreliable to automate.

---

## Practical Application

### Scenario
You are tasked with setting up the test automation for a project. The application has a standard login form and a dashboard page that is only accessible after logging in.

### Task
1.  Create a global setup file named `auth.setup.ts`.
2.  In this file, write the logic to:
    -   Navigate to a login page (`/login`).
    -   Fill in a username (`testuser`) and password (`password123`).
    -   Click a "Log In" button.
    -   Wait for a `dashboard` element to be visible to confirm login.
    -   Save the authentication state to a file named `user.json`.
3.  Explain what changes you would need to make in `playwright.config.ts` to use this setup for your tests.
4.  Write a simple test file `dashboard.spec.ts` that navigates to the `/dashboard` page and asserts that a welcome message "Welcome, testuser!" is visible. This test should assume it's already authenticated.

Provide the code for `auth.setup.ts`, the explanation for the config changes, and the code for `dashboard.spec.ts`.