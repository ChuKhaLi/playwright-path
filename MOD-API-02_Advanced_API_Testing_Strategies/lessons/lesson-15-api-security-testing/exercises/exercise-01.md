# Exercise 1: Testing for Broken Object Level Authorization (BOLA)

## Objective

Test for a common API security vulnerability, Broken Object Level Authorization (BOLA), where a user can access data belonging to another user.

## Scenario

We will simulate an API where:
-   User A is logged in.
-   User A tries to fetch data belonging to User B by guessing their resource ID.
-   A secure API should return a `403 Forbidden` or `404 Not Found` error. An insecure API will incorrectly return User B's data.

We will use the [DummyJSON API](https://dummyjson.com/docs/auth), which is secure, to demonstrate the *correct* behavior.

## Instructions

1.  **Create a Test Spec File:** Create a file named `security-bola.spec.ts`.

2.  **Use the Authenticated Fixture:** Reuse the `auth-helper.ts` fixture from the earlier lesson to get an authenticated API context.

3.  **Write the Test:**
    -   The test should be named `should not allow a user to access another user's cart`.
    -   The authenticated user is User #15 (`kminchelle`). Their cart is at `/auth/carts/1`.
    -   We will try to access the cart of User #1, which is at `/auth/carts/1`.
    -   **Step 1: Get Authenticated.** Use the `authenticatedApi` fixture.
    -   **Step 2: Try to Access Another User's Resource.** Make a `GET` request to `/auth/carts/1`.
    -   **Step 3: Assert.** The DummyJSON API correctly implements security. Assert that the response status is `403` (Forbidden). This proves the endpoint is secure against this BOLA attack.