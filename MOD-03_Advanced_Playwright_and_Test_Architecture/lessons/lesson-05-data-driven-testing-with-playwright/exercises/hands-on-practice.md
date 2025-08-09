# Lesson 5: Hands-on Practice - Data-Driven Testing

## Objective

To practice data-driven testing by creating a test that adds different products to the shopping cart and verifies they were added successfully.

## Scenario

You will continue to work with the Sauce Labs Demo Application. Your task is to create a data-driven test that iterates through a list of products, adds each one to the cart, and verifies the cart count increases accordingly.

## Instructions

### Part 1: Create the Test Data

1.  **Create a JSON data file:** In your `tests/data` directory, create a new file named `products.json`.

2.  **Add product data:** Populate the file with an array of product objects. Each object should have a `name` and a `locatorId`. The `locatorId` will be used to dynamically build the "Add to Cart" button selector.

    ```json
    [
        {
            "name": "Sauce Labs Backpack",
            "locatorId": "sauce-labs-backpack"
        },
        {
            "name": "Sauce Labs Bike Light",
            "locatorId": "sauce-labs-bike-light"
        },
        {
            "name": "Sauce Labs Bolt T-Shirt",
            "locatorId": "sauce-labs-bolt-t-shirt"
        }
    ]
    ```

### Part 2: Enhance the `ProductPage` Page Object

Your `ProductPage` needs to be able to click on *any* "Add to Cart" button, not just the one for the backpack.

1.  **Open `product-page.ts`**.

2.  **Create a dynamic method:** Instead of a hardcoded `addProductToCart()` method, create a new, more flexible method: `async addProductToCartById(productId: string)`.
    -   This method should accept a `productId` string (which will be the `locatorId` from your JSON file).
    -   Inside the method, construct the locator dynamically.
        -   *Hint:* Use a template literal: `` `[data-test="add-to-cart-${productId}"]` ``.
    -   Click the dynamically located button.
    -   Make the method chainable by returning `this`.

3.  **Remove the old method:** You can now delete the old `addProductToCart()` method.

### Part 3: Create the Data-Driven Test

1.  **Create a new test file:** In `tests/specs`, create `cart-data-driven.spec.ts`.

2.  **Write the test script:**
    -   Import `test`, `expect`, `LoginPage`, `ProductPage`, and your new `products.json` data.
    -   Use a `test.beforeEach` hook to handle the login. This avoids repeating the login steps for every single test iteration. Inside the hook, create a `LoginPage` instance and log in with the `standard_user`.

3.  **Create the loop:**
    -   Use a `for...of` loop to iterate over the `products` data.
    -   Create a dynamic test title for each product, e.g., `test('should add ${product.name} to the cart', ...)`

4.  **Implement the test logic:**
    -   Inside the test, create an instance of `ProductPage`.
    -   Call your new `addProductToCartById()` method, passing in the `product.locatorId`.
    -   Use the `header` component on the `ProductPage` to get the cart count.
    -   Assert that the cart count is `'1'`.
    -   **Important:** Since each test is independent, the cart will be empty at the start of each one. We are only verifying that one item at a time can be added.

## Bonus Challenge

-   Modify the test to add *all* the products from the JSON file to the cart in a single test run.
-   After the loop, assert that the final cart count matches the total number of products in your JSON file.
-   This will require you to rethink the test structure slightly. You won't be creating a new test for each product, but rather looping *inside* a single test.