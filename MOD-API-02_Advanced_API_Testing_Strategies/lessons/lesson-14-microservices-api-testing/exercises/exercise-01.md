# Exercise 1: Consumer-Driven Contract Test

## Objective

Write a "consumer-side" contract test. This involves the consumer (in our case, a test) defining the exact response structure it expects from a provider (an API) and testing against a mock that returns this structure.

## Scenario

We are the consumer of the `User Service` from a previous exercise. We have a contract with the `User Service` that says when we ask for a user, we expect a specific JSON structure. We will write a test to enforce this contract.

## Instructions

1.  **Create a Test Spec File:** Create a file named `consumer-contract.spec.ts`.

2.  **Define the Contract:**
    -   At the top of your file, define a constant object that represents the "contract" or the expected response body. It should look like this:
        ```typescript
        const userContract = {
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.stringMatching(/@/), // email should contain '@'
          status: expect.stringMatching(/^(active|inactive)$/) // status is 'active' or 'inactive'
        };
        ```

3.  **Write the Test:**
    -   The test should be named `User Service should adhere to the consumer contract`.
    -   **Mock the Provider:** Use `page.route()` to intercept requests to `http://user-service/api/v1/users/1`.
    -   Fulfill the request with a mock response that *matches* the contract you defined.
    -   **Make the Request:** Use `page.request.get()` to call the mocked endpoint.
    -   **Assert the Contract:** Use `expect(responseBody).toMatchObject(userContract)` to validate that the structure and types of the response body match the contract you defined.