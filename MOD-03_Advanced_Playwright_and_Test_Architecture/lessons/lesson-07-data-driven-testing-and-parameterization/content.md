# Lesson 7: Data-Driven Testing and Parameterization

## 1. Why Use Data-Driven Testing?

Imagine you need to test a search feature. You want to verify that it works for various inputs:
- A simple search term ("laptop")
- A multi-word term ("gaming mouse")
- A term with special characters ("!@#$%^")
- A term that yields no results ("asdfghjkl")
- A very long search term

Writing a separate test for each of these cases would lead to a lot of duplicated code. Data-driven testing solves this by separating the test logic from the test data. You write the test logic once and then run it with multiple sets of data.

**Benefits:**
- **Reduces Code Duplication:** Write one test, run it many times.
- **Improves Test Coverage:** Easily test a wide range of inputs and edge cases.
- **Better Maintainability:** Test data is kept separate from the test logic, often in external files (JSON, CSV), making it easier for non-developers to contribute test cases.

## 2. Simple Parameterization with a Loop

The most straightforward way to run a test with different data is to use a simple `for` loop.

```typescript
import { test, expect } from '@playwright/test';

const searchTerms = [
  'Playwright',
  'Cypress',
  'Selenium',
  'WebDriverIO'
];

for (const term of searchTerms) {
  test(`should find search results for "${term}"`, async ({ page }) => {
    await page.goto('https://www.google.com');
    await page.getByRole('combobox', { name: 'Search' }).fill(term);
    await page.keyboard.press('Enter');
    
    // Wait for navigation and check for a plausible result
    await page.waitForURL(`**\/search**`);
    await expect(page.locator('#search')).toContainText(term, { ignoreCase: true });
  });
}
```

In this example, Playwright will generate a separate test for each item in the `searchTerms` array. The test title is created dynamically, so in your test report, you'll see individual results for each term.

## 3. Using External Data Files (JSON)

For more complex data, it's best to store it in an external file. JSON is a popular choice.

**Step 1: Create a data file**

Create a file named `test-data/users.json`.

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
    "shouldSucceed": false,
    "errorMessage": "Sorry, this user has been locked out."
  },
  {
    "username": "problem_user",
    "password": "wrong_password",
    "shouldSucceed": false,
    "errorMessage": "Username and password do not match"
  }
]
```

**Step 2: Import the data and generate tests**

Now, import this JSON file into your test script and loop over it.

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page'; // Assuming you have a LoginPage POM
import users from '../test-data/users.json'; // Import the data

test.describe('Login Functionality', () => {
  for (const user of users) {
    test(`should handle login for user: ${user.username}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(user.username, user.password);

      if (user.shouldSucceed) {
        // Assert successful login
        await expect(page).toHaveURL(/.*inventory.html/);
      } else {
        // Assert failed login
        await expect(loginPage.errorMessage).toContainText(user.errorMessage!);
      }
    });
  }
});
```

This approach is highly scalable. You can add dozens of user scenarios to your `users.json` file without touching the test logic.

## 4. Best Practices for Managing Test Data

- **Keep Data Separate:** Store your test data in a dedicated directory (e.g., `test-data/` or `fixtures/`).
- **Use Descriptive Data:** Make your data objects readable. Instead of `data.isValid`, use a more descriptive property like `data.shouldSucceed`.
- **Consider Data Generation:** For large-scale data needs, consider using libraries like `faker-js` to generate realistic but fake data on the fly. This can be done within a fixture.
- **Don't Store Sensitive Data in Git:** For production-like test data with sensitive information, use environment variables or a secure vault system, loaded at runtime.

## 5. Combining with Fixtures

You can even create a fixture that provides test data, though the loop-based approach is often simpler and more explicit for data-driven tests.

```typescript
// This is a more advanced pattern, often not necessary
// but shows the power of fixtures.

// my-fixtures.ts
export const test = base.extend({
  user: [async ({}, use, testInfo) => {
    // This is complex: you'd need a way to know which user to load.
    // The loop approach is generally preferred for this reason.
    const user = loadUserBasedOnTestTitle(testInfo.title);
    await use(user);
  }, { scope: 'test' }],
});
```
For most data-driven scenarios, dynamically generating tests with a `for` loop before any tests run is the most effective and readable pattern in Playwright.

## 6. Summary

Data-driven testing is a fundamental technique for creating comprehensive and efficient test suites. By parameterizing your tests and separating data from logic, you can easily cover numerous scenarios, edge cases, and user types with minimal code. This approach not only improves your test coverage but also makes your test suite more maintainable and scalable in the long run.