# Comprehensive E2E Architecture Project

## Objective

The goal of this project is to apply the principles and patterns learned in this module to build a well-structured, scalable, and maintainable E2E test framework for a sample e-commerce application.

## Application Under Test

We will be using the [Sauce Demo](https://www.saucedemo.com/) application. It's a simple e-commerce site with a login page, a product inventory page, a shopping cart, and a checkout flow.

## Project Structure

You will build a framework with the following structure:

```
comprehensive-e2e-project/
├── data/
│   └── users.json
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── auth.spec.ts
│   └── shopping-flow.spec.ts
├── fixtures/
│   └── auth.fixture.ts
├── playwright.config.ts
└── package.json
```

## Requirements

### 1. Test Framework Architecture
- Implement a layered architecture (Tests, Pages, Fixtures, Data).

### 2. Scalable Test Design
- All tests must be independent and atomic.
- Use `test.beforeEach` and `test.afterEach` where appropriate.

### 3. Test Organization
- Organize tests by feature (`auth`, `shopping-flow`).
- Use tags (`@smoke`, `@regression`) to create logical test suites.

### 4. Fixture Management
- Create a custom fixture to handle user authentication.
- Create fixtures to provide instances of your page objects.

### 5. Test Configuration
- Create separate projects in your `playwright.config.ts` for local development and CI.
- Use environment variables to manage your application's base URL.

### 6. Test Reporting
- Configure the HTML and Allure reporters.
- Add custom annotations (e.g., owner, severity) to your tests.

### 7. Test Maintenance
- Use robust, user-facing locators.
- Use web-first assertions.

## Steps to Complete the Project

1.  **Set up the project:**
    - Initialize a new Node.js project (`npm init -y`).
    - Install Playwright (`npm init playwright@latest`).
    - Create the directory structure.
2.  **Create the Page Objects:**
    - Implement the `LoginPage`, `InventoryPage`, `CartPage`, and `CheckoutPage` classes.
3.  **Create the Fixtures:**
    - Implement the authentication fixture.
    - Implement the page object fixtures.
4.  **Write the Tests:**
    - Write the tests for the authentication flow (`auth.spec.ts`).
    - Write the tests for the end-to-end shopping flow (`shopping-flow.spec.ts`).
5.  **Configure `playwright.config.ts`:**
    - Set up your `local` and `ci` projects.
    - Configure your reporters.
6.  **Run and Debug:**
    - Run your tests locally.
    - Use the trace viewer to debug any failures.
7.  **(Bonus) CI/CD Integration:**
    - Create a GitHub Actions workflow to run your tests automatically.

## Conclusion

By completing this project, you will have hands-on experience in building a professional-grade E2E test framework. This project will be a valuable addition to your portfolio and will demonstrate your expertise in test architecture and design.