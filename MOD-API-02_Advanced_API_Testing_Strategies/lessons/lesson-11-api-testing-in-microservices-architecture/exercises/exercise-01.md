# Exercise 1: Testing Inter-Service Communication

## Objective

Simulate and test the interaction between two microservices: an `Order Service` and a `User Service`.

## Scenario

-   The `Order Service` receives a request to create an order for a `userId`.
-   Before creating the order, the `Order Service` makes an internal API call to the `User Service` to verify that the user exists and is active.
-   We will write a test that acts as the `Order Service` and mocks the response from the `User Service`.

## Instructions

1.  **Create a Test Spec File:** Create a file named `microservices-comm.spec.ts`.

2.  **Write the Test:**
    -   The test should be named `Order Service should create an order for a valid user`.
    -   **Mock the User Service:**
        -   Use `page.route()` to intercept requests to the (fictional) `User Service` endpoint, e.g., `http://user-service/api/v1/users/123`.
        -   Fulfill the request with a `200 OK` status and a JSON body indicating the user is active: `{ "id": 123, "status": "active" }`.
    -   **Simulate the Order Service Logic:**
        -   In your test, first, make a call to the `User Service` endpoint using `page.request.get()`. This call will be intercepted by your mock.
        -   Get the response and assert that the user's status is `active`.
        -   If the user is active, simulate creating the order (e.g., by logging a message like "Order created for user 123").
    -   **Write a second test** for the failure case:
        -   Name it `Order Service should not create an order for an inactive user`.
        -   Mock the `User Service` to return `{ "id": 123, "status": "inactive" }`.
        -   Assert that the order is *not* created.