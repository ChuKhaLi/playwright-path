# Exercise 1: Testing Different API Versions

## Objective

Write tests that target different versions of an API to ensure both are functioning as expected.

## Scenario

Imagine an API that has two versions: `v1` and `v2`.
-   `v1` of a `user` endpoint returns a user's full name in a single `name` field.
-   `v2` of the same endpoint returns the name split into `firstName` and `lastName` fields.

We will simulate this by using a mock API.

## Instructions

1.  **Create a Test Spec File:** Create a file named `api-versioning.spec.ts`.

2.  **Write the Tests:**
    -   **Test 1: V1 Endpoint**
        -   Use `page.route()` to intercept requests to `/api/v1/user/1`.
        -   Fulfill the request with a mock response for a v1 user:
            ```json
            { "id": 1, "name": "John Doe" }
            ```
        -   In your test, navigate to a blank page (`about:blank`) and then use `page.request` to fetch from `/api/v1/user/1`.
        -   Assert that the response contains the `name` field and not `firstName` or `lastName`.

    -   **Test 2: V2 Endpoint**
        -   Use `page.route()` to intercept requests to `/api/v2/user/1`.
        -   Fulfill the request with a mock response for a v2 user:
            ```json
            { "id": 1, "firstName": "Jane", "lastName": "Doe" }
            ```
        -   In your test, fetch from `/api/v2/user/1`.
        -   Assert that the response contains `firstName` and `lastName` fields and not a `name` field.