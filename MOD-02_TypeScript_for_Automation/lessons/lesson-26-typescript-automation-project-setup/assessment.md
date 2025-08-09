# Lesson 14 Assessment: TypeScript Automation Project Setup

## Multiple Choice Questions

1.  **In a structured Playwright project, what is the primary purpose of the `pages` directory?**
    a)  To store the actual test files (`.spec.ts`).
    b)  To store reusable helper functions and test data.
    c)  To store Page Object Model (POM) classes.
    d)  To store project configuration files like `playwright.config.ts`.

2.  **Which property in `playwright.config.ts` must be updated to tell Playwright where to find test files in a non-default location?**
    a)  `testMatch`
    b)  `rootDir`
    c)  `testDir`
    d)  `include`

3.  **What is the benefit of setting up `baseUrl` and `paths` in `tsconfig.json`?**
    a)  It makes the tests run faster.
    b)  It allows for cleaner, non-relative import paths (e.g., `import ... from '@pages/...'`).
    c)  It is required for Playwright to find the browser executables.
    d)  It automatically creates the folder structure for you.

4.  **In a Page Object class, why is it a good practice to pass the `page` object in the `constructor`?**
    a)  To ensure each instance of the Page Object is tied to the specific `page` context of a single test.
    b)  Because the `constructor` is the only place you can use the `page` object.
    c)  To change the title of the page.
    d)  It is not a good practice; the `page` object should be global.

5.  **What is the main advantage of separating test data (like usernames and passwords) into its own module?**
    a)  It makes the test files smaller.
    b)  It allows the same data to be easily reused across multiple tests and makes it easier to update.
    c)  It is required by the `import` syntax.
    d)  It encrypts the test data.

## Practical Exercise

This is a capstone exercise that requires you to extend the project built in the lesson.

**Scenario:**
You need to add a new Page Object for the "Inventory" page and write a test to verify its functionality.

1.  **Create the Inventory Page Object:**
    -   Create a new file: `src/pages/inventory-page.ts`.
    -   Inside this file, create and export a class named `InventoryPage`.
    -   The constructor should accept the `page` object.
    -   Add a `readonly` property named `shoppingCartLink` which is a `Locator` for the shopping cart icon (`.shopping_cart_link`).
    -   Add a method `getInventoryItemNames()` that returns a `Promise<string[]>`. This method should find all elements with the class `.inventory_item_name` and return their text content. (Hint: use `page.locator('.inventory_item_name').allTextContents()`).
    -   Add a method `addItemToCartByName(itemName: string)` that takes a product name and clicks the corresponding "Add to cart" button. The locator for this is tricky; a good approach is `page.locator('.inventory_item').filter({ hasText: itemName }).getByRole('button', { name: 'Add to cart' })`.

2.  **Create a New Test File:**
    -   Create a new test file: `src/tests/inventory.spec.ts`.
    -   Import `test`, `expect`, `LoginPage` from your pages module, and `TestUsers` from your test data module. Also import your new `InventoryPage`.

3.  **Write the Test:**
    -   Create a `test.describe()` block for "Inventory Page".
    -   Use a `test.beforeEach` hook to perform a login using your `LoginPage` class and the `standardUser` credentials. This will ensure each test starts on the inventory page.
    -   Write a test named "should display the correct products". Inside this test:
        -   Create an instance of `InventoryPage`.
        -   Call `getInventoryItemNames()` and store the result.
        -   Assert that the number of items is greater than 0.
        -   Assert that the array of names includes "Sauce Labs Backpack".
    -   Write a second test named "should be able to add an item to the cart". Inside this test:
        -   Create an instance of `InventoryPage`.
        -   Call `addItemToCartByName()` with "Sauce Labs Bike Light".
        -   Assert that the `shoppingCartLink` locator now has the text "1".

4.  **Run the Tests:**
    -   Run all your tests using `npx playwright test`.
    -   Verify that both your new tests and the original login tests pass.

## Answer Key

### Multiple Choice
1.  c) To store Page Object Model (POM) classes.
2.  c) `testDir`
3.  b) It allows for cleaner, non-relative import paths (e.g., `import ... from '@pages/...'`).
4.  a) To ensure each instance of the Page Object is tied to the specific `page` context of a single test.
5.  b) It allows the same data to be easily reused across multiple tests and makes it easier to update.

### Practical Exercise (Example Solution)

**`src/pages/inventory-page.ts`**
```typescript
import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly shoppingCartLink: Locator;
  readonly inventoryList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.inventoryList = page.locator('.inventory_list');
  }

  async getInventoryItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async addItemToCartByName(itemName: string): Promise<void> {
    const itemContainer = this.inventoryList.locator('.inventory_item', { hasText: itemName });
    await itemContainer.getByRole('button', { name: 'Add to cart' }).click();
  }
}
```

**`src/tests/inventory.spec.ts`**
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { InventoryPage } from '@pages/inventory-page';
import { TestUsers } from '@utils/test-data';

test.describe('Inventory Page', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(TestUsers.Standard.username, TestUsers.Standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('should display the correct products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const itemNames = await inventoryPage.getInventoryItemNames();
    
    expect(itemNames.length).toBeGreaterThan(0);
    expect(itemNames).toContain('Sauce Labs Backpack');
  });

  test('should be able to add an item to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    
    await expect(inventoryPage.shoppingCartLink).toHaveText('1');
  });
});