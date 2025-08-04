# Lesson 13 Assessment: Best Practices and Code Quality

## Multiple Choice Questions

1.  **Which naming convention is recommended for classes and interfaces in TypeScript?**
    a)  `camelCase`
    b)  `PascalCase`
    c)  `snake_case`
    d)  `kebab-case`

2.  **The DRY principle stands for "Don't Repeat Yourself." What is the most common way to apply this principle in test automation?**
    a)  By using `console.log` for debugging.
    b)  By writing all code in a single file.
    c)  By copy-pasting code blocks for each test.
    d)  By creating reusable functions or methods for common actions.

3.  **What is the purpose of a "linter" like ESLint?**
    a)  To automatically format code by fixing indentation and spacing.
    b)  To analyze code for potential errors, bugs, and stylistic issues.
    c)  To run the tests in a browser.
    d)  To compile TypeScript into JavaScript.

4.  **Which of the following is an example of a GOOD comment?**
    a)  `// This is a variable`
    b)  `// Increment the counter`
    c)  `// This test needs to run against v2 of the API due to a legacy endpoint.`
    d)  `// This function returns a string`

5.  **Why is it important to treat test code as "real code"?**
    a)  Because it makes the test suite larger.
    b)  Because it ensures the test framework is maintainable, reliable, and scalable over time.
    c)  Because it is a requirement for the TypeScript compiler.
    d)  Because it makes the tests run more slowly but more accurately.

## Practical Exercise

You have been given a "wet" (not DRY) and poorly styled test file. Your task is to refactor it according to the best practices learned in this lesson.

**Original Bad Code (`bad-test.spec.ts`):**
```typescript
import { test, expect } from '@playwright/test';

// test for the cart
test('cart test', async ({ page }) => {
  // go to the site
  await page.goto('https://www.saucedemo.com/');

  // login
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // add item
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  // check badge
  const BADGE = page.locator('.shopping_cart_badge');
  await expect(BADGE).toHaveText('1');

  // go to cart
  await BADGE.click();
  await expect(page).toHaveURL(/cart.html/);
});

// another test for checkout
test('checkout test', async ({ page }) => {
  // go to the site
  await page.goto('https://www.saucedemo.com/');

  // login
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // add item
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // go to cart
  await page.locator('.shopping_cart_badge').click();
  await expect(page).toHaveURL(/cart.html/);

  // checkout
  await page.locator('#checkout').click();
  await expect(page).toHaveURL(/checkout-step-one.html/);
});
```

**Your Task:**

1.  **Create a New File Structure:**
    -   Create a `helpers` folder.
    -   Inside `helpers`, create a file named `auth-helpers.ts`.

2.  **Refactor with the DRY Principle:**
    -   Identify the repeated login logic in both tests.
    -   Create a reusable `async` function named `loginAsStandardUser` inside `auth-helpers.ts`. This function should accept the `page` object as an argument.
    -   Export this function.

3.  **Clean Up the Test File:**
    -   Create a new test file named `refactored-test.spec.ts`.
    -   Import the `loginAsStandardUser` function.
    -   Use a `test.describe()` block to group the tests.
    -   Use a `test.beforeEach()` hook to call `loginAsStandardUser` before each test runs. This makes the tests even cleaner.
    -   Copy the core logic of the two original tests into new `test()` blocks.
    -   Apply proper naming conventions (`camelCase` for variables, descriptive test names).
    -   Add a JSDoc comment to your `loginAsStandardUser` function explaining what it does.

## Answer Key

### Multiple Choice
1.  b) `PascalCase`
2.  d) By creating reusable functions or methods for common actions.
3.  b) To analyze code for potential errors, bugs, and stylistic issues.
4.  c) `// This test needs to run against v2 of the API due to a legacy endpoint.`
5.  b) Because it ensures the test framework is maintainable, reliable, and scalable over time.

### Practical Exercise (Example Solution)

**`helpers/auth-helpers.ts`**
```typescript
import { Page, expect } from '@playwright/test';

/**
 * Logs in as the standard user and verifies successful navigation to the inventory page.
 * @param page The Playwright page object.
 */
export async function loginAsStandardUser(page: Page): Promise<void> {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
}
```

**`refactored-test.spec.ts`**
```typescript
import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from './helpers/auth-helpers';

test.describe('Shopping and Checkout Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // This hook runs before each test, applying the DRY principle perfectly.
    await loginAsStandardUser(page);
  });

  test('should add an item to the cart successfully', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    await cartBadge.click();
    await expect(page).toHaveURL(/cart.html/);
  });

  test('should proceed to the checkout page', async ({ page }) => {
    // For this test, we need an item in the cart first.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_badge').click();
    
    await page.locator('#checkout').click();
    await expect(page).toHaveURL(/checkout-step-one.html/);
  });
});