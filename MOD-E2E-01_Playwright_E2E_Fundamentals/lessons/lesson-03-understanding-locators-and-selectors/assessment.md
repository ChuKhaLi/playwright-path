# Lesson 3: Assessment

## Knowledge Check

### Question 1
What is the primary advantage of using Playwright's locators over traditional DOM queries like `document.querySelector`?
a) Locators are faster.
b) Locators are re-evaluated on each action, making them resilient to timing issues.
c) Locators can only be used with CSS selectors.
d) Locators do not require the `await` keyword.

**Answer:** b) Locators are dynamic and re-evaluated, which, combined with auto-waiting, makes tests far more reliable.

---

### Question 2
Which locator is considered the best practice for finding elements, as it aligns with how users and assistive technologies interact with the page?
a) `page.locator()`
b) `page.getByText()`
c) `page.getByRole()`
d) `page.getByTestId()`

**Answer:** c) `page.getByRole()` is the most robust locator because it's based on the element's semantic meaning, not its implementation details.

---

### Question 3
Which command do you use to launch the Playwright Inspector for debugging?
a) `npx playwright inspect`
b) `npx playwright test --inspector`
c) `npx playwright test --debug`
d) `npx playwright debug-test`

**Answer:** c) `npx playwright test --debug` starts the test runner in debug mode, which launches the Inspector.

---

## Practical Exercise

### Task
1.  Navigate to a practice website like `https://www.saucedemo.com/`.
2.  Use the Playwright Inspector (`npx playwright open https://www.saucedemo.com/`) or your browser's developer tools to find the best locators for the following elements:
    - The username input field.
    - The password input field.
    - The "Login" button.
3.  Create a new test file named `saucedemo-login.spec.ts`.
4.  Write a test that uses the locators you found to perform a login.
    - Use `getByLabel` or `getByPlaceholder` for the input fields.
    - Use `getByRole` for the login button.
    - Fill the username with "standard_user".
    - Fill the password with "secret_sauce".
    - Click the login button.
5.  After logging in, assert that the page URL has changed to `https://www.saucedemo.com/inventory.html`.

### Expected Code
Your `saucedemo-login.spec.ts` file should contain a test similar to this:

```typescript
import { test, expect } from '@playwright/test';

test('should log in to Sauce Labs demo', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Use recommended locators to find and fill the form
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  
  // Use getByRole for the button
  await page.getByRole('button', { name: 'Login' }).click();

  // Assert that the URL is the expected one after login
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});
```

This exercise challenges you to use the Inspector to find robust, user-facing locators and apply them in a realistic login scenario, reinforcing the core concepts of this lesson.