# Exercise: Write Your First E2E Tests

## 1. Objective

In this exercise, you will write your first E2E tests using the page objects you created in the previous exercise. This will solidify your understanding of how to integrate page objects into Playwright tests and how to write clean, readable assertions.

## 2. Instructions

### Step 1: Create the Test File

1.  In your `tests/` directory, create a new file named `ecommerce.spec.ts`.

### Step 2: Write the Test for Product Search

1.  **Import necessary modules:** Import `test` and `expect` from `@playwright/test`, and also import your `HomePage` class.
2.  **Create a `describe` block:** Group your tests under a `test.describe('E-commerce Site Functionality', ...)` block.
3.  **Instantiate Page Objects:** Inside the `describe` block, but before your tests, instantiate your `HomePage`. You can do this in a `beforeEach` hook or at the top of the `describe` block.
4.  **Write the test:** Create a test with the name `"should allow a user to search for a product"`.
    -   Inside the test, navigate to your fictional home page (e.g., `await homePage.navigateTo('https://fictional-ecommerce.com')`).
    -   Use the `searchForProduct` method from your `HomePage` object to search for a product (e.g., `"laptop"`).
    -   **Assertion:** After searching, you would typically be on a search results page. For this exercise, let's just assert that the URL has changed to include the search term. Use `await expect(page).toHaveURL(/search\?q=laptop/);`.

### Step 3: Write the Test for Navigating to the Account Page

1.  **Write a new test:** Inside the same `describe` block, create another test named `"should allow a user to navigate to the My Account page"`.
2.  **Instantiate Page Objects:** You'll need both `HomePage` and `AccountPage` for this test.
3.  **Navigate:** Go to the home page.
4.  **Action:** Use the `goToMyAccount` method from your `HomePage` object.
5.  **Assertion:** Use the `getPageTitle` method from your `AccountPage` object and assert that the title is "My Account".
    -   `await expect(accountPage.getPageTitle()).resolves.toBe('My Account');`

## 3. Completed Code (for reference)

Your final `ecommerce.spec.ts` file should look something like this:

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/home.page';
import { AccountPage } from '../src/pages/account.page';

test.describe('E-commerce Site Functionality', () => {
  let homePage: HomePage;
  let accountPage: AccountPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    accountPage = new AccountPage(page);
    await homePage.navigateTo('https://fictional-ecommerce.com');
  });

  test('should allow a user to search for a product', async ({ page }) => {
    await homePage.searchForProduct('laptop');
    await expect(page).toHaveURL(/search\?q=laptop/);
  });

  test('should allow a user to navigate to the My Account page', async () => {
    await homePage.goToMyAccount();
    await expect(accountPage.getPageTitle()).resolves.toBe('My Account');
  });
});
```

## 4. Career Development Reflection

-   Look at the two tests you wrote. How does the use of page objects make it clear what each test is trying to accomplish?
-   Imagine you have 100 tests that all involve searching for a product. If the search functionality changes, how does your POM structure save you time and effort?