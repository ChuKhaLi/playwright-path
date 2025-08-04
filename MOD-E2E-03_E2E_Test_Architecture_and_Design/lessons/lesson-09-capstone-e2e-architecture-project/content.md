# Lesson 9: Capstone E2E Architecture Project

## 1. Project Brief

Congratulations on reaching the final project! Your task is to act as the Lead QA Architect and design a complete E2E test automation framework for a realistic, full-featured e-commerce application: the [Sauce Demo](https://www.saucedemo.com/) website.

This project will be a comprehensive demonstration of your skills. You will need to make and justify architectural decisions, build a robust framework, and implement a selection of tests that prove your architecture is sound.

## 2. The Target Application

**URL:** `https://www.saucedemo.com/`

**Features to consider:**
-   User Authentication (valid, locked out, and problem users)
-   Product Inventory (viewing products)
-   Product Sorting
-   Shopping Cart (adding and removing items)
-   Full Checkout Flow (entering user information)
-   A "hidden" hamburger menu for navigation (logout, about, etc.)

## 3. Core Architectural Requirements

You must design and implement a framework that includes the following architectural elements, drawing from all the lessons in this module.

1.  **Scalable Directory Structure:** A logical and maintainable organization for all your framework files.
2.  **Advanced Page Object Model:**
    -   Use a `BasePage`.
    -   Implement a component-based approach for the header and inventory items.
    -   Use fluent interfaces for page transitions.
3.  **Test Data Management:**
    -   Use external JSON files for static data (like user credentials).
    -   Create a `ProductDataFactory` to generate dynamic product data (even though the site's data is static, you should demonstrate the factory pattern).
4.  **Cross-Platform Configuration:**
    -   Configure your `playwright.config.ts` to run on both `Desktop Chrome` and `iPhone 13`.
    -   Your framework must correctly handle any responsive UI differences.
5.  **Enterprise Organization:**
    -   Implement a tagging strategy for your tests (`@smoke`, `@regression`, `@p1`, etc.).
    -   Create a sample `CODEOWNERS` file.
6.  **CI/CD Pipeline:**
    -   Create a `ci.yml` workflow file that implements a multi-stage pipeline (lint, api-tests (mocked), e2e-smoke, e2e-regression).

## 4. Implementation Tasks

You do not need to test every single feature. Instead, implement the following key test scenarios to demonstrate that your architecture works.

1.  **A successful end-to-end checkout flow.** This should be your main `@smoke` test. It should log in, add a product, go through the entire checkout process, and verify the final "Thank you" message.
2.  **A data-driven login test.** This test should use a JSON data file to test the login functionality with `standard_user`, `locked_out_user`, and `problem_user`.
3.  **A cross-platform test.** A test that verifies the hamburger menu is visible and functional on mobile, but not on desktop.
4.  **An API-involved test (mocked).** Since the site has no public API, you will mock it. Write a test that uses `page.route()` to intercept a network call (e.g., to an image or CSS file) and asserts that the call was made. This demonstrates your ability to architect for API interactions.

## 5. Deliverables

Your submission should be a complete, runnable Playwright project in a Git repository. The repository should contain:

1.  **The complete framework code:** All directories, page objects, fixtures, tests, etc.
2.  **A `README.md` file in the root of your project.** This is the most important part. It should be your architectural design document. It must explain:
    -   An overview of your framework's architecture.
    -   Why you chose your specific directory structure.
    -   How you've implemented the advanced POM patterns.
    -   Your test data management strategy.
    -   Your tagging and test organization strategy.
    -   A guide on how to install and run the tests (e.g., `npm install`, `npx playwright test --grep @smoke`).
3.  **The `ci.yml` file** inside the `.github/workflows` directory.

This capstone project is your chance to build a portfolio piece that showcases your ability to think like a Test Architect. Good luck!