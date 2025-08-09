# Exercise 1: API Response Schema Validation with Zod

## Objective

Validate the schema of an API response using the `zod` library to ensure it matches the expected contract.

## Instructions

1.  **Install Zod:** If you don't have it in your project, install `zod` by running:
    ```bash
    npm install zod
    ```

2.  **Create a Schema Definition File:** Create a file named `schemas.ts`.
    -   Import `z` from `zod`.
    -   Define a Zod schema for a user object from the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/users/1). The user object should have at least the following fields with the correct types:
        -   `id` (number)
        -   `name` (string)
        -   `username` (string)
        -   `email` (string, and it should be a valid email format)
        -   `address` (an object containing `street`, `suite`, `city`, `zipcode`)

3.  **Create a Test Spec File:** Create a file named `schema-validation.spec.ts`.

4.  **Write the Test:**
    -   Import your `userSchema` from `schemas.ts`.
    -   In a test, send a `GET` request to `https://jsonplaceholder.typicode.com/users/1`.
    -   Get the JSON response body.
    -   Use `userSchema.parse()` to validate the response body. If the schema does not match, `parse()` will throw an error and fail the test, which is the desired behavior.
    -   Add an assertion to confirm the test passes if no error is thrown, for example `expect(true).toBe(true)`.