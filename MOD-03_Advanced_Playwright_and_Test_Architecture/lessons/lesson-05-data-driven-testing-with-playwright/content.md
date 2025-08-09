# Lesson 5: Data-Driven Testing with Playwright

## 1. Introduction

Welcome to the lesson on Data-Driven Testing (DDT). So far, we've been hardcoding our test data (like usernames and passwords) directly into our tests. This is fine for simple examples, but in a real-world testing scenario, you need to test with a wide variety of data inputs to ensure your application is robust.

Data-Driven Testing is a methodology where you separate your test logic from your test data. You store the data in an external source (like an array, a JSON file, or a CSV file) and write a single test script that can execute multiple times with different data inputs.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

-   **Understand the principles of Data-Driven Testing.**
-   **Implement DDT using a simple array of data.**
-   **Parameterize Playwright tests to run with different data sets.**
-   **Externalize test data into a JSON file.**
-   **Read and parse JSON data for use in your tests.**
-   **Appreciate the benefits of separating test logic from test data.**

## 3. Why Use Data-Driven Testing?

-   **Increased Test Coverage:** Easily test a wide range of scenarios (e.g., valid, invalid, edge-case data) without writing new tests.
-   **Improved Maintainability:** Test data is managed in one place, separate from the test logic. Need to add a new test case? Just add a new row of data.
-   **Reusability:** The same test script can be used for hundreds of different data combinations.
-   **Clearer Tests:** Your test scripts focus on the *actions*, not the *data*, making them cleaner and easier to read.

## 4. Simple Data-Driven Testing with an Array

The easiest way to get started with DDT in Playwright is by using a simple array of data and a `for` loop.

Let's imagine we want to test the login functionality with multiple user credentials.

### Example:

```typescript
// tests/specs/login-data-driven.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

const users = [
    { username: 'standard_user', password: 'secret_sauce', shouldSucceed: true },
    { username: 'locked_out_user', password: 'secret_sauce', shouldSucceed: false },
    { username: 'problem_user', password: 'secret_sauce', shouldSucceed: true },
    { username: 'performance_glitch_user', password: 'secret_sauce', shouldSucceed: true },
    { username: 'invalid_user', password: 'invalid_password', shouldSucceed: false },
];

test.describe('Data-Driven Login', () => {
    for (const user of users) {
        test(`should handle login for user: ${user.username}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.navigateTo();
            await loginPage.login(user.username, user.password);

            if (user.shouldSucceed) {
                await expect(page).toHaveURL(/.*inventory.html/);
            } else {
                const errorMessage = page.locator('[data-test="error"]');
                await expect(errorMessage).toBeVisible();
                await expect(errorMessage).toContainText('Epic sadface:');
            }
        });
    }
});
```

In this example, Playwright will generate a separate test for each user in the `users` array. The test title is dynamically generated to make the report clear.

## 5. Externalizing Test Data with JSON

While arrays are great, for larger data sets or more complex data structures, it's best to move the data out of your test file and into a dedicated data file, like JSON.

**Step 1: Create the JSON Data File**

Create a new directory, e.g., `tests/data`, and add a file named `users.json`.

`tests/data/users.json`

```json
[
    {
        "username": "standard_user",
        "password": "secret_sauce",
        "shouldSucceed": true
    },
    {
        "username": "locked_out_user",
        "password": "secret_sauce",
        "shouldSucceed": false
    },
    {
        "username": "problem_user",
        "password": "secret_sauce",
        "shouldSucceed": true
    },
    {
        "username": "performance_glitch_user",
        "password": "secret_sauce",
        "shouldSucceed": true
    },
    {
        "username": "invalid_user",
        "password": "invalid_password",
        "shouldSucceed": false
    }
]
```

**Step 2: Import and Use the JSON Data in Your Test**

Now, you can import this JSON file directly into your test script.

```typescript
// tests/specs/login-data-driven-json.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import users from '../data/users.json'; // Import the data

test.describe('Data-Driven Login with JSON', () => {
    for (const user of users) {
        test(`should handle login for user: ${user.username}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.navigateTo();
            await loginPage.login(user.username, user.password);

            if (user.shouldSucceed) {
                await expect(page).toHaveURL(/.*inventory.html/);
            } else {
                const errorMessage = page.locator('[data-test="error"]');
                await expect(errorMessage).toBeVisible();
            }
        });
    }
});
```

This approach is much cleaner and separates concerns perfectly. Your test logic is in the `.spec.ts` file, and your test data is in the `.json` file.

## 6. Conclusion

Data-Driven Testing is a fundamental technique for creating a scalable and effective test automation suite. By separating your data from your test logic, you can easily expand your test coverage, improve maintainability, and write cleaner, more focused tests.

In the upcoming lessons, we'll continue to build on these concepts as we construct a full-fledged test architecture.