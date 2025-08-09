# Exercise 1: Handling JWT Authentication

## Objective

Write a test that authenticates with a test API using a JWT (JSON Web Token) to access a protected route.

## Instructions

1.  **Use a Test API:** We will use the [DummyJSON](https://dummyjson.com/docs/auth) API, which provides a simple way to get a JWT.
    -   The endpoint to get a token is `https://dummyjson.com/auth/login`.
    -   It requires a `POST` request with a `username` and `password`. You can use the credentials provided in their documentation (e.g., `kminchelle` / `0lelplR`).
    -   The response will contain a `token`.

2.  **Create a Test Spec File:** Create a file named `auth.spec.ts`.

3.  **Write the Test:**
    -   **Step 1: Login and Get Token.** In your test, first send a `POST` request to the login endpoint to get the JWT.
    -   **Step 2: Access Protected Route.** Use the obtained token to make an authenticated `GET` request to a protected endpoint, such as `https://dummyjson.com/auth/me`.
    -   You must include the token in the `Authorization` header as a Bearer token: `Authorization: 'Bearer <your_token_here>'`.
    -   **Step 3: Assert.** Assert that the request to the protected route is successful (`ok()`) and that the response body contains the user's data.