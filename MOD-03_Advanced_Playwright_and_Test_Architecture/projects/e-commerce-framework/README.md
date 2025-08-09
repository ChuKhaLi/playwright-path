# Module 3 Project: E-Commerce Test Framework

## 1. Project Overview

This project is the culmination of everything you have learned in Module 3. You will build a complete, end-to-end test automation framework for a live e-commerce demo application. This project will require you to apply your knowledge of advanced Page Object Models, data-driven testing, API testing, and framework architecture.

**Application Under Test:** [Sauce Labs Demo Application](https://www.saucedemo.com/)

## 2. Project Objectives

-   **Build a Scalable Framework:** Create a well-structured framework using the architecture discussed in the module.
-   **Implement Robust Page Objects:** Create comprehensive Page Objects for all major pages and components of the application.
-   **Combine UI and API Testing:** Use API calls to set up state and verify outcomes.
-   **Implement Data-Driven Tests:** Use external data files to drive your tests.
-   **Handle Authentication Efficiently:** Use a global setup to handle login.
-   **Write Comprehensive Tests:** Create a suite of tests that cover the main user flows of the application.

## 3. Core User Flows to Automate

You should aim to create tests for the following user scenarios:

1.  **Successful Login and Logout:**
    -   A standard user can log in.
    -   A logged-in user can log out.

2.  **Product Catalog:**
    -   The product inventory is displayed correctly after login.
    -   Users can sort products by Name (A to Z), Name (Z to A), Price (low to high), and Price (high to low).

3.  **Shopping Cart:**
    -   A user can add a single item to the cart from the product page.
    -   A user can add multiple items to the cart.
    -   A user can remove an item from the cart.
    -   The cart badge updates correctly as items are added and removed.

4.  **Checkout Process:**
    -   A user can proceed to the checkout page from the cart.
    -   A user can fill out the checkout information form.
    -   A user can view the checkout overview and verify the total price.
    -   A user can complete the purchase and see the "Thank you" message.

## 4. Framework Requirements

Your framework must include:

-   **A logical folder structure** (`specs`, `pages`, `utils`, `data`, etc.).
-   **A `BasePage`** that other pages extend.
-   **Page Objects** for `LoginPage`, `ProductPage`, `CartPage`, and `CheckoutPage`.
-   **Component Objects** for the `Header` and `InventoryItem`.
-   **A `global.setup.ts`** for handling authentication.
-   **Custom fixtures** to provide Page Objects to your tests.
-   **Data-driven tests** for sorting or checkout, using a JSON file.
-   **At least one test that combines UI and API calls.** (Since the demo site has no public API, you can mock this by, for example, creating a test that adds an item to the cart and then *imagines* verifying the cart contents via an API call, using a dummy API client).

## 5. Getting Started

1.  **Set up your project** with the folder structure defined in the lessons.
2.  **Start with authentication:** Create your `global.setup.ts`.
3.  **Build your Page Objects:** Start with `LoginPage` and work your way through the application.
4.  **Write your tests:** As you build your Page Objects, write the corresponding tests to ensure they work correctly.
5.  **Refactor and improve:** As you build, look for opportunities to refactor and apply the advanced patterns you've learned.

This project is your chance to build a portfolio-worthy piece of work that demonstrates your skills as a test automation engineer. Good luck!