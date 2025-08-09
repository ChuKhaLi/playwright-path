# Exercise 1: Configuring a Reusable API Context

## Objective

Create a custom Playwright test fixture that provides a pre-configured `APIRequestContext` for interacting with a public API.

## Instructions

1.  **Choose a Public API:** Select a free public API to work with. A good choice is the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/), which requires no authentication.

2.  **Create a Helper File:** In your project, create a new file named `api-helper.ts`.

3.  **Define a Custom Test Fixture:**
    -   Import `test as base` from `@playwright/test`.
    -   Use `base.extend` to create a new test fixture.
    -   The fixture should provide a property named `api` of type `APIRequestContext`.
    -   Inside the fixture, create a new request context using `playwright.request.newContext()`.
    -   Configure the context with the `baseURL` of your chosen public API (e.g., `https://jsonplaceholder.typicode.com`).
    -   Add a common header, such as `'Accept': 'application/json'`.
    -   Use the context in the test and then `dispose()` of it afterward.

4.  **Create a Test Spec File:**
    -   Create a new test file named `posts.spec.ts`.
    -   Import your custom `test` object from `api-helper.ts`.
    -   Write a test that uses the `api` fixture to send a `GET` request to an endpoint (e.g., `/posts/1`).
    -   Assert that the response is `ok()`.
    -   Assert that the `id` in the response body matches the one you requested.