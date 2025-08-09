# Exercise: Build Your First Page Objects

## 1. Objective

This exercise will give you hands-on practice implementing the Page Object Model (POM). You will create a `BasePage` and two new page objects for a fictional e-commerce application.

## 2. The Application Under Test (Fictional)

Imagine we are testing an e-commerce site with the following pages:

-   **Home Page:**
    -   Has a search bar (`#search-input`).
    -   Has a search button (`#search-button`).
    -   Has a link to the "My Account" page (`a[href="/account"]`).
-   **My Account Page:**
    -   Has a heading that says "My Account" (`h1`).
    -   Has a "Logout" button (`#logout-button`).

## 3. Instructions

### Step 1: Create the `BasePage`

1.  In your `src/pages/` directory, open the `base.page.ts` file.
2.  Implement the `BasePage` class exactly as shown in the lesson. It should include the `page` property, a `constructor`, and the `navigateTo` method.

### Step 2: Create the `HomePage` Object

1.  Create a new file in `src/pages/` named `home.page.ts`.
2.  Inside this file, create a `HomePage` class that `extends BasePage`.
3.  **Locators:**
    -   Add `private readonly` locators for the search bar, search button, and "My Account" link.
4.  **Methods:**
    -   Create a method `async searchForProduct(productName: string)` that types into the search bar and clicks the search button.
    -   Create a method `async goToMyAccount()` that clicks the "My Account" link.

### Step 3: Create the `AccountPage` Object

1.  Create a new file in `src/pages/` named `account.page.ts`.
2.  Inside this file, create an `AccountPage` class that `extends BasePage`.
3.  **Locators:**
    -   Add a `private readonly` locator for the "My Account" heading.
    -   Add a `private readonly` locator for the "Logout" button.
4.  **Methods:**
    -   Create a method `async getPageTitle()` that returns the text content of the heading.
    -   Create a method `async clickLogout()` that clicks the logout button.

## 4. Verification

-   Ensure all your files are in the correct directories.
-   Your `HomePage` and `AccountPage` classes should correctly extend `BasePage`.
-   All locators should be `private` and `readonly`.
-   Your methods should be `async` and correctly use the `await` keyword when interacting with Playwright locators.

## 5. Career Development Reflection

-   Consider the `searchForProduct` method you wrote. How does this method make a test case more readable compared to putting the `fill` and `click` actions directly in the test?
-   If the locator for the search button changed, how many places in your code would you need to update with this new structure? What if you weren't using POM?