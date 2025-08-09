# Exercise 1: Refactoring Authentication with a Fixture

## Objective

Refactor the JWT authentication logic from the previous lesson into a reusable Playwright test fixture.

## Instructions

1.  **Create a Helper File:** Create a file named `auth-helper.ts`.

2.  **Define an Authenticated API Fixture:**
    -   Extend the base `test` fixture.
    -   Create a new fixture named `authenticatedApi`. This fixture will depend on the built-in `request` fixture.
    -   Inside the `authenticatedApi` fixture:
        -   Perform the login request to `https://dummyjson.com/auth/login` to get the JWT.
        -   Create a *new* `APIRequestContext` using `playwright.request.newContext()`.
        -   Configure this new context with:
            -   `baseURL`: `https://dummyjson.com`
            -   `extraHTTPHeaders`: An `Authorization` header containing the Bearer token.
        -   Provide the new authenticated context to the test.
        -   Remember to `dispose()` the context after the test is done.

3.  **Update the Test Spec:**
    -   Create a new test file `refactored-auth.spec.ts`.
    -   Import your custom `test` object from `auth-helper.ts`.
    -   Write a test that uses the `authenticatedApi` fixture.
    -   The test should make a `GET` request to the protected route `/auth/me`. Notice you can now use a relative path.
    -   Assert that the response is successful and contains the correct user data.