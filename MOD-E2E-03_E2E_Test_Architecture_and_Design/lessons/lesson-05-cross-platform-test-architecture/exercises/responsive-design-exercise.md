# Exercise: Testing a Responsive Design

## Objective

To practice writing tests that can handle responsive UI changes and run correctly on both desktop and mobile viewports.

## Scenario

You are testing a product details page.
-   **On Desktop:** The page displays a large product image, a "Buy Now" button, and a "Reviews" tab.
-   **On Mobile:** The "Buy Now" button is smaller and has different styling. The "Reviews" are not in a tab but are in an expandable "accordion" section below the product details to save space.

## Your Task

1.  **Configure Projects:**
    -   In your `playwright.config.ts`, ensure you have at least two projects: one for a desktop browser (e.g., `Desktop Chrome`) and one for a mobile viewport (e.g., `iPhone 13`).

2.  **Create a Page Object:**
    -   Create a `ProductPage.ts` page object.
    -   The constructor should accept the `isMobile` boolean from a fixture.
    -   Add locators for:
        -   The "Buy Now" button. Use a `data-testid` that is consistent across both platforms.
        -   The "Reviews" tab (for desktop).
        -   The "Reviews" accordion header (for mobile).
        -   The reviews content area.

3.  **Implement Platform-Specific Methods:**
    -   Create a method called `showReviews()`.
    -   Inside this method, use an `if (this.isMobile)` block.
        -   If `isMobile` is true, it should click the accordion header.
        -   If `isMobile` is false, it should click the "Reviews" tab.
    -   Create a method called `getBuyNowButtonText()`. This method will simply return the text content of the button.

4.  **Create a Fixture:**
    -   Create a fixture that provides an instance of your `ProductPage`.

5.  **Write the Test Script:**
    -   Create a `tests/e2e/product-page.spec.ts` file.
    -   Write a test named `should display reviews correctly on all platforms`. This test should:
        -   Navigate to the product page.
        -   Call your `showReviews()` method.
        -   Assert that the reviews content is now visible.
    -   Write a test named `should have the correct text on the buy button`. This test should:
        -   Navigate to the product page.
        -   Get the text from the "Buy Now" button.
        -   Assert that the text is "Buy Now" on desktop and "Buy" on mobile. Use an `if (isMobile)` block for the assertion.

## Submission

Submit the following files:
-   `playwright.config.ts`
-   `pages/ProductPage.ts`
-   `fixtures/product.fixture.ts`
-   `tests/e2e/product-page.spec.ts`

This exercise will demonstrate your ability to create a single, clean test script that can validate functionality on multiple platforms, even when the UI implementation differs.