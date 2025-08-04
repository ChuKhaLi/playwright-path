# Lesson 8: Assessment

## Knowledge Check

1.  **Question:** What is the primary purpose of creating custom Playwright fixtures in an API testing framework?
    -   a) To make the tests run faster.
    -   b) To reduce boilerplate code in tests by encapsulating the setup and teardown of complex objects like API clients and repositories.
    -   c) To replace the need for a `playwright.config.ts` file.
    -   d) To automatically generate test reports.

2.  **Question:** In the proposed framework structure, what is the key difference between the `api/clients` directory and the `api/repositories` directory?
    -   a) There is no difference; they do the same thing.
    -   b) `clients` handle raw HTTP requests and model the API endpoints, while `repositories` provide a higher-level, data-centric abstraction over the clients.
    -   c) `repositories` are for read operations (`GET`), while `clients` are for write operations (`POST`, `PUT`).
    -   d) `clients` are used for functional tests, while `repositories` are used for contract tests.

3.  **Question:** What is the most reliable strategy for managing test data for a complex integration test that needs a specific user and a specific product to exist?
    -   a) Using a static JSON file with the user and product data.
    -   b) Using a test data factory to generate the data on the fly.
    -   c) Manually creating the data in the database before running the test suite.
    -   d) Using the API itself to create the required user and product at the beginning of the test (or suite) and cleaning it up afterwards.

4.  **Question:** How does a well-structured framework make it easier to test against different environments (e.g., `development`, `staging`, `production`)?
    -   a) By having separate test files for each environment.
    -   b) By using `if/else` statements inside the tests to check the current environment.
    -   c) By centralizing environment-specific settings (like `baseUrl`) in configuration files and loading the correct one at runtime.
    -   d) It doesn't; you have to manually change the URLs in every test file.

## Practical Exercise

### Objective

Design and implement a custom Playwright fixture for a `ProductRepository` and use it in a test. This will demonstrate your ability to apply the framework patterns discussed in the lesson to create clean, maintainable tests.

### Scenario

You are building on the e-commerce test framework from the previous lesson's exercise. You already have a `ProductsApiClient` and a `ProductRepository`. Now, you need to create a Playwright fixture to make this repository easily available to your tests.

### Your Task

1.  **Create the Custom Fixture File:**
    -   Create a new file: `src/fixtures/ecommerce.fixtures.ts`.
    -   Import the base `test` from `@playwright/test`.
    -   Import your `ProductsApiClient` and `ProductRepository`.
    -   Import your `config` object.

2.  **Define the Fixtures:**
    -   Extend the base test to create a new `test` object.
    -   Create a fixture named `productsApiClient`. This fixture should initialize your `ProductsApiClient` using the `baseUrl` from your configuration.
    -   Create a second fixture named `productRepository`. This fixture should **depend on the `productsApiClient` fixture**. It will use the initialized client to create an instance of your `ProductRepository`.

3.  **Create a Test Data Factory:**
    -   If you haven't already, create a `ProductFactory` in `src/test-data/factories/`.
    -   It should have a `create()` method that returns a valid `CreateProductRequest` object with realistic fake data.

4.  **Write a Test Using the Fixture:**
    -   Create a new test file: `tests/api/functional/products.spec.ts`.
    -   **Important:** Import `test` and `expect` from your new custom fixture file (`src/fixtures/ecommerce.fixtures.ts`), not from `@playwright/test`.
    -   Write a test named `should allow creating and retrieving a product via the repository fixture`.
    -   The test function should accept `{ productRepository }` as its argument.
    -   Inside the test:
        -   Use your `ProductFactory` to generate data for a new product.
        -   Use the `productRepository` fixture to call its `create()` method with the factory-generated data.
        -   Assert that the created product has a valid ID.
        -   Use the `productRepository` to call its `findById()` method to fetch the product you just created.
        -   Assert that the fetched product's name matches the name from the data you created with the factory.

### Expected Outcome

A test that is clean, readable, and completely free of setup boilerplate. The test should demonstrate a clear separation of concerns:
-   The **fixture** handles the setup of the repository and its dependencies.
-   The **factory** handles the creation of test data.
-   The **test** itself focuses purely on the actions (create, find) and assertions, making it easy to understand the business logic being tested.