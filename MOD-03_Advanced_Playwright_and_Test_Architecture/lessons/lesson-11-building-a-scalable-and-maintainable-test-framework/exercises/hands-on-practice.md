# Lesson 11: Hands-on Practice - Building the Framework Core

## Objective

To implement the core components of a scalable test framework, including a `BasePage`, custom fixtures, and an `ApiClient`.

## Scenario

You will refactor your existing framework, which you organized in the previous lesson, by adding a core layer to improve reusability and reduce boilerplate code in your tests.

## Instructions

### Part 1: Implement the `BasePage`

1.  **Create the file:** `tests/pages/base.page.ts`.
2.  **Define the `BasePage` class:**
    -   It should have a `constructor` that accepts the `page: Page`.
    -   It should have a `readonly page: Page` property.
    -   Add a `navigateTo(path: string)` method that calls `this.page.goto(path)`.
3.  **Refactor `LoginPage` and `ProductPage`:**
    -   Make both of these classes `extend BasePage`.
    -   Call `super(page)` in their constructors.
    -   Remove the `readonly page: Page` property and the `this.page = page` assignment from their constructors, as this is now handled by `BasePage`.
    -   If you have a `navigateTo` method in `LoginPage`, you can remove it if the `BasePage` version is sufficient.

### Part 2: Create Custom Fixtures

1.  **Create the fixture file:** `tests/fixtures/custom-fixtures.ts`.
2.  **Define the fixture types:**
    -   Import `test as base` from `@playwright/test`.
    -   Import `LoginPage` and `ProductPage`.
    -   Define a `MyFixtures` type that includes `loginPage: LoginPage` and `productPage: ProductPage`.
3.  **Extend the base test:**
    -   Export a new `test` constant by calling `base.extend<MyFixtures>({...})`.
4.  **Implement the fixtures:**
    -   Inside the `extend` block, create the `loginPage` fixture. It should initialize a `new LoginPage(page)` and pass it to the `use` function.
    -   Do the same for the `productPage` fixture.
5.  **Export `expect`:** Don't forget to `export { expect } from '@playwright/test';` from your fixture file so you can import it alongside your custom `test` object.

### Part 3: Refactor a UI Test to Use the Fixture

1.  **Open `tests/specs/ui/login.spec.ts` (or another UI test).**
2.  **Change the import:**
    -   Change `import { test, expect } from '@playwright/test';` to `import { test, expect } from '../../fixtures/custom-fixtures';`.
3.  **Update the test function:**
    -   Your test function signature will now include your fixture: `test('...', async ({ loginPage, page }) => { ... });`.
    -   Remove the line where you manually create the `LoginPage` instance (`const loginPage = new LoginPage(page);`). The fixture does this for you now.
    -   Run the test to ensure it still works.

### Part 4: Create the `ApiClient` Utility

1.  **Create the file:** `tests/utils/api-client.ts`.
2.  **Define the `ApiClient` class:**
    -   It should have a `constructor` that accepts `request: APIRequestContext`.
    -   It should have a private `request` property.
    -   Create methods for the JSONPlaceholder API:
        -   `getPost(id: number)`
        -   `getPosts()`
        -   `createPost(data: object)`
    -   These methods should encapsulate the `this.request.get()`, `this.request.post()`, etc., calls and return the response.

### Part 5: Refactor an API Test to Use the `ApiClient`

1.  **Open `tests/specs/api/posts.api.spec.ts`**.
2.  **Import the `ApiClient`**.
3.  **Update a test:**
    -   Inside one of the tests, create an instance of your client: `const apiClient = new ApiClient(request);`.
    -   Replace the direct `request.get()` or `request.post()` call with a call to your new client method (e.g., `await apiClient.getPost(1)`).
    -   Assert on the response from the client method.
    -   Run the test to ensure it still works.

## Bonus Challenge

-   Create a custom fixture for your `ApiClient` so you don't have to instantiate it in every API test.
-   Add it to your `custom-fixtures.ts` file and refactor your API test to use the new `apiClient` fixture directly in the test function signature.