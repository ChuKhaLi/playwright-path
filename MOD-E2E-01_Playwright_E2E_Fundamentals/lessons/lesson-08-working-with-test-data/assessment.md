# Lesson 8: Assessment

## Knowledge Check

### Question 1
What is the primary benefit of storing test data in an external file (like JSON) instead of hardcoding it?
a) It makes the tests run faster.
b) It's the only way to use data in Playwright.
c) It improves maintainability, reusability, and readability.
d) It automatically encrypts your test data.

**Answer:** c) Separating data makes tests easier to manage, update, and adapt for different scenarios.

---

### Question 2
How do you import a JSON file into a TypeScript test file?
a) `const data = require('path/to/data.json');`
b) `import * as data from 'path/to/data.json';`
c) `const data = fs.readFileSync('path/to/data.json');`
d) `import data from 'path/to/data.json';`

**Answer:** d) `import data from ...` is the standard ES module syntax for importing the default export of a module, which in the case of a JSON file, is the parsed data.

---

### Question 3
What is a "data-driven test"?
a) A test that only checks data and doesn't interact with the UI.
b) A test that is written inside a JSON file.
c) A single test block that is executed multiple times with different sets of data.
d) A test that connects to a live database.

**Answer:** c) Data-driven testing is a technique where you loop through a data set to run the same test logic for multiple inputs and expected outcomes.

---

## Practical Exercise

### Task
1.  Create a new folder in your project root named `test-data`.
2.  Inside this folder, create a file named `products.json`.
3.  Populate `products.json` with data for at least three products from `https://www.saucedemo.com/inventory.html`. Each product should have a `name` and a `price`.
    ```json
    [
      {
        "name": "Sauce Labs Backpack",
        "price": "$29.99"
      },
      {
        "name": "Sauce Labs Bike Light",
        "price": "$9.99"
      }
    ]
    ```
4.  Create a new test file named `product-validation.spec.ts`.
5.  Write a data-driven test that iterates through your `products.json` data.
6.  For each product in the JSON file, the test should:
    - Log in as the "standard_user".
    - Find the product on the inventory page by its name.
    - **Assertion:** Inside the product's card, find the element that displays the price and assert that it has the correct text from your JSON file.

### Expected Code
Your `product-validation.spec.ts` file should look something like this:

```typescript
import { test, expect } from '@playwright/test';
import products from '../../test-data/products.json';
import users from '../../test-data/users.json';

test.describe('Product Price Validation', () => {
  // Log in once before all tests in this suite
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const standardUser = users.find(user => user.username === 'standard_user');
    if (!standardUser) throw new Error('Standard user not found');
    
    await page.getByPlaceholder('Username').fill(standardUser.username);
    await page.getByPlaceholder('Password').fill(standardUser.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  // Data-driven test
  for (const product of products) {
    test(`should validate the price for ${product.name}`, async ({ page }) => {
      // Find the inventory item card that contains the product name
      const productCard = page.locator('.inventory_item', { hasText: product.name });
      
      // Within that card, find the price element and assert its text
      const priceElement = productCard.locator('.inventory_item_price');
      await expect(priceElement).toHaveText(product.price);
    });
  }
});
```

This exercise gives you practical experience in creating data fixtures, importing them, and using them to drive a test that validates multiple pieces of data on a page. It also introduces the `test.beforeEach` hook for setup code.