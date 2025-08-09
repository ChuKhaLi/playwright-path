# Lesson 3: Hands-on Practice - Implementing a Basic POM

## Objective

Apply your understanding of the Page Object Model (POM) by creating a Page Object for a demo e-commerce site and using it in a test.

## Scenario

You will be working with the Sauce Labs Demo Application: [https://www.saucedemo.com/](https://www.saucedemo.com/)

Your task is to create a `ProductPage` Page Object that represents the main inventory page after a user logs in.

## Instructions

### Part 1: Create the `ProductPage` Object

1.  **Create a new file:** In your `tests/pages` directory, create a file named `product-page.ts`.

2.  **Define the `ProductPage` class:**
    -   Import `Page` and `Locator` from `@playwright/test`.
    -   Create and export a class named `ProductPage`.
    -   Add a constructor that accepts the `page` object.

3.  **Add Locators:**
    -   Add a `readonly` locator for the shopping cart icon/link.
        -   *Hint:* The selector could be `.shopping_cart_link`.
    -   Add a `readonly` locator for the "Add to Cart" button for the "Sauce Labs Backpack".
        -   *Hint:* The selector could be `[data-test="add-to-cart-sauce-labs-backpack"]`.
    -   Add a `readonly` locator for the page title element.
        -   *Hint:* The selector could be `.title`.

4.  **Implement Action Methods:**
    -   Create an `async` method named `addProductToCart()` that clicks the "Add to Cart" button for the backpack.
    -   Create an `async` method named `goToCart()` that clicks the shopping cart link.

5.  **Implement a Getter for Verification:**
    -   Create an `async` getter method named `getPageTitle()` that returns the text content of the page title element. This is useful for assertions.

### Part 2: Write the Test

1.  **Create a new test file:** In your `tests/specs` directory, create a file named `product.spec.ts`.

2.  **Write the test script:**
    -   Import `test` and `expect` from `@playwright/test`.
    -   Import your new `ProductPage` class.
    -   Import the `LoginPage` class you created in the lesson.

3.  **Structure the test:**
    -   Create a `test.describe()` block for "Product Page Functionality".
    -   Inside, create a `test()` block named "should allow a user to add a product to the cart".

4.  **Implement the test steps:**
    -   Inside the test, create instances of both `LoginPage` and `ProductPage`.
    -   First, perform a login using the `LoginPage` object.
        -   *Note:* You'll need to navigate and log in first to get to the product page. Use the credentials `standard_user` and `secret_sauce`.
    -   Verify that you are on the product page by asserting that the page title is "Products". Use the `getPageTitle()` method you created.
    -   Use the `addProductToCart()` method from your `ProductPage` object.
    -   Use the `goToCart()` method.
    -   Finally, add an assertion to verify that you are on the cart page.
        -   *Hint:* `await expect(page).toHaveURL(/.*cart.html/);`

## Solution

A possible solution will be provided in the `solution` folder within this directory. Try to complete the exercise on your own before looking at the answer!