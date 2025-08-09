# Exercise 1: Adding Custom Headers for Observability

## Objective

Use request interception to add custom headers to an API request for tracing and observability purposes.

## Scenario

Modern applications often use unique IDs to trace a single user action as it flows through multiple microservices. A common pattern is to generate a `X-Request-ID` or `X-Correlation-ID` at the edge (the first service that receives the request) and pass it along in subsequent internal API calls.

We will write a test that simulates this by adding a custom correlation ID to an outgoing API request.

## Instructions

1.  **Create a Test Spec File:** Create a file named `observability.spec.ts`.

2.  **Write the Test:**
    -   The test should be named `should add a correlation ID to an outgoing request`.
    -   Inside the test, generate a unique ID. A simple way is to use `Date.now()` or a library like `uuid`.
    -   Use `page.route()` to intercept a specific API call (e.g., `https://jsonplaceholder.typicode.com/posts/1`).
    -   Inside the route handler:
        -   Get the original request's headers using `route.request().headers()`.
        -   Create a new headers object by spreading the original headers and adding your custom header, e.g., `'X-Correlation-ID': yourGeneratedId`.
        -   Continue the request with the new headers using `route.continue({ headers })`.
    -   After setting up the route, make the API call using `page.request.get()`.
    -   **Verification:** Since we can't check the server's logs, we can add a second interception to *verify* that the header was added. You can listen on the `request` event of the page (`page.on('request', ...)`), check if the URL matches, and then assert that `request.headers()['x-correlation-id']` equals your generated ID.