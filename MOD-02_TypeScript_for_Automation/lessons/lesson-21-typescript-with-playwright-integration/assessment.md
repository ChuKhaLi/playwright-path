# Lesson 11 Assessment: TypeScript with Playwright Integration

## Multiple Choice Questions

1.  **What is the command to initialize a new Playwright project with TypeScript?**
    a)  `npm install playwright`
    b)  `npm init playwright@latest`
    c)  `npx playwright install`
    d)  `npm start playwright`

2.  **In a Playwright test file, what is the primary role of the `page` object?**
    a)  To define a new test case.
    b)  To make assertions about the state of the page.
    c)  To serve as the main interface for interacting with the browser page.
    d)  To import other modules.

3.  **What is the purpose of `expect` in the line `await expect(page).toHaveTitle('My App');`?**
    a)  It is a function for making assertions or checks.
    b)  It is an object representing the browser page.
    c)  It is a function that defines a test.
    d)  It is a typo and should be `export`.

4.  **Why is the `async` keyword required on the test function, e.g., `test('my test', async ({ page }) => { ... })`?**
    a)  Because all test functions must be named `async`.
    b)  To allow the use of the `await` keyword for Playwright's asynchronous actions.
    c)  It's optional and doesn't change the function's behavior.
    d)  To make the test run faster.

5.  **What command do you run in the terminal to execute your Playwright tests?**
    a)  `npm run test`
    b)  `node tests/example.spec.ts`
    c)  `npx playwright test`
    d)  `tsc && node tests/example.spec.js`

## Practical Exercise

For this exercise, you will write a new Playwright test for the Sauce Demo application.

**Setup:**
- Ensure you have a Playwright project initialized (you can use the one from the lesson or create a new one).
- Create a new test file named `tests/cart.spec.ts`.

**Test Scenario:**
You will write a test to verify that a user can add an item to the shopping cart and that the cart icon updates correctly.

1.  **Structure the Test File:**
    -   In `tests/cart.spec.ts`, import `test` and `expect` from `@playwright/test`.
    -   Create a `test.describe()` block named "Shopping Cart Functionality".

2.  **Log In Before the Test:**
    -   Inside the `describe` block, use a `test.beforeEach` hook to perform the login action before your test runs. This avoids repeating login code.
    -   In the hook, navigate to `https://www.saucedemo.com/`.
    -   Fill the username with `standard_user` and the password with `secret_sauce`.
    -   Click the login button.
    -   Add an assertion to ensure the navigation to the inventory page was successful (`await expect(page).toHaveURL(...)`).

3.  **Write the Main Test:**
    -   Create a `test` block named "should add an item to the cart".
    -   Inside the test:
        -   First, assert that the shopping cart is initially empty. The cart badge (`.shopping_cart_badge`) should **not** be visible. (Hint: use `.not.toBeVisible()`).
        -   Find the "Add to cart" button for a specific item, for example, the "Sauce Labs Backpack". A good locator would be `[data-test="add-to-cart-sauce-labs-backpack"]`.
        -   Click this button.
        -   Now, assert that the shopping cart badge is visible.
        -   Assert that the text content of the shopping cart badge is "1".

4.  **Run Your Test:**
    -   Execute the tests from your terminal using the appropriate command.
    -   Ensure your new test passes.

## Answer Key

### Multiple Choice
1.  b) `npm init playwright@latest`
2.  c) To serve as the main interface for interacting with the browser page.
3.  a) It is a function for making assertions or checks.
4.  b) To allow the use of the `await` keyword for Playwright's asynchronous actions.
5.  c) `npx playwright test`

### Practical Exercise (Example Solution)

**`tests/cart.spec.ts`**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  
  // Run this before each test in the describe block
  test.beforeEach(async ({ page }) => {
    // Navigate and log in
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Wait for and verify navigation
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('should add an item to the cart', async ({ page }) => {
    const cartBadge = page.locator('.shopping_cart_badge');
    const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');

    // 1. Assert cart is initially empty
    await expect(cartBadge).not.toBeVisible();

    // 2. Click the "Add to cart" button
    await addToCartButton.click();

    // 3. Assert cart badge now shows "1"
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });
});