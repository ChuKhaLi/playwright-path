# Lesson 4: Hands-on Practice - Advanced POM Strategies

## Objective

Refactor and enhance your existing Page Objects using advanced patterns like component objects and method chaining.

## Scenario

You will continue working with the Sauce Labs Demo Application. The goal is to refactor your `ProductPage` and create a new `HeaderComponent` to better structure your code.

## Instructions

### Part 1: Create a `HeaderComponent`

The header/navigation bar is a reusable component on the Sauce Labs site. Let's extract it into its own component object.

1.  **Create the file:** Create a new directory `tests/pages/components` and add a file named `header-component.ts`.

2.  **Define the class:**
    -   Create and export a class named `HeaderComponent`.
    -   It should have a constructor that accepts the `page` object.

3.  **Add Locators and Methods:**
    -   Add a locator for the shopping cart link (`.shopping_cart_link`).
    -   Add a locator for the shopping cart badge (the red number, `.shopping_cart_badge`).
    -   Add an `async` method `getCartCount()` that returns the text of the cart badge.
    -   Add an `async` method `goToCart()` that clicks the shopping cart link. This method should return a new instance of the `CartPage` (you'll need to create a basic `CartPage` object for this to work).

### Part 2: Create a Basic `CartPage`

For the `goToCart()` method to work cleanly, you need a `CartPage` object to return.

1.  **Create the file:** In `tests/pages`, create `cart-page.ts`.
2.  **Define the class:** Create a simple `CartPage` class with a constructor. For this exercise, it doesn't need any methods or locators yet.

### Part 3: Refactor `ProductPage`

Now, let's refactor the `ProductPage` to use the new `HeaderComponent` and implement method chaining.

1.  **Open `product-page.ts`**.

2.  **Compose the `HeaderComponent`:**
    -   Import `HeaderComponent`.
    -   In the `ProductPage` class, add a `readonly` property `header` of type `HeaderComponent`.
    -   In the constructor, instantiate `HeaderComponent` and assign it to `this.header`.

3.  **Remove Redundant Code:**
    -   The `ProductPage` no longer needs its own `shopping_cart_link` locator or `goToCart()` method. Remove them, as this logic now lives in `HeaderComponent`.

4.  **Implement Method Chaining:**
    -   Modify the `addProductToCart()` method so that it returns `this` to allow for method chaining.

### Part 4: Update the Test

Finally, update your `product.spec.ts` to use the new, refactored Page Objects.

1.  **Open `product.spec.ts`**.

2.  **Update the test logic:**
    -   The test flow should remain the same, but how you call the methods will change.
    -   After logging in and creating a `ProductPage` instance, use the new `header` component to interact with the cart.
    -   Your test should now look something like this:

    ```typescript
    // ... (imports and setup)

    const productPage = new ProductPage(page);
    await productPage.addProductToCart();

    // Get the cart count via the header component
    const cartCount = await productPage.header.getCartCount();
    expect(cartCount).toBe('1');

    // Go to the cart via the header component
    const cartPage = await productPage.header.goToCart();

    // Assert you are on the cart page
    await expect(page).toHaveURL(/.*cart.html/);
    ```

## Bonus Challenge

-   Implement a `SideBarComponent` to handle the "All Items", "About", "Logout", and "Reset App State" links.
-   Compose the `SideBarComponent` into your `ProductPage`.
-   Write a new test to verify that the "Logout" functionality works correctly by using your new component.