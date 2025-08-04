# Exercise: Creating a Custom Fixture

## Objective

To get hands-on practice with creating and using custom test fixtures to reduce code duplication and make tests more maintainable.

## Scenario

You are testing an e-commerce application. A common setup for many of your tests is to:
1.  Navigate to the home page.
2.  Search for a specific product (e.g., "Laptop").
3.  Add the product to the shopping cart.

You want to create a fixture that provides a `page` object where these steps have already been completed.

## Your Task

1.  **Define Page Objects:**
    -   Create a simple `HomePage.ts` with a method `searchForProduct(productName: string)`.
    -   Create a simple `SearchResultsPage.ts` with a method `addToCart(productName: string)`.

2.  **Create the Custom Fixture:**
    -   Create a new fixture file, e.g., `fixtures/cart.fixtures.ts`.
    -   Extend the base `test` from Playwright.
    -   Create a new fixture named `pageWithProductInCart`.
    -   Inside this fixture, implement the logic to navigate, search, and add the product to the cart using your page objects.
    -   The fixture should `use` the `page` object after these steps are complete.

3.  **Write a Test Using the Fixture:**
    -   Create a new test file, e.g., `tests/e2e/cart.spec.ts`.
    -   Import the custom `test` object from your new fixture file.
    -   Write a test that uses the `pageWithProductInCart` fixture.
    -   Inside the test, add an assertion to verify that the cart now contains one item. (e.g., `expect(page.locator('.cart-item-count')).toHaveText('1');`).

## Submission

Submit the following files:
-   `pages/HomePage.ts`
-   `pages/SearchResultsPage.ts`
-   `fixtures/cart.fixtures.ts`
-   `tests/e2e/cart.spec.ts`

This exercise will demonstrate your ability to encapsulate complex setup logic into a reusable fixture, a key skill for building scalable test frameworks.