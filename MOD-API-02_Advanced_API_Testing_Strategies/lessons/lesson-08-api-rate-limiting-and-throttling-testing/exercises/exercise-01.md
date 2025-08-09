# Exercise 1: Testing for Rate Limiting

## Objective

Write a test that intentionally exceeds the rate limit of an API to verify that it returns the correct error status code.

## Scenario

We will use a public API that is known to have rate limiting. A good example is the GitHub API, which has a low rate limit for unauthenticated requests (around 60 requests per hour). We will make repeated requests until we trigger the rate limit error.

## Instructions

1.  **Create a Test Spec File:** Create a file named `rate-limiting.spec.ts`.

2.  **Write the Test:**
    -   The test should be named `should trigger a 403 Forbidden error when rate limit is exceeded`.
    -   Use a `for` loop to make repeated `GET` requests to a GitHub API endpoint, for example, `https://api.github.com/users/microsoft`.
    -   Inside the loop, check the status of the response.
    -   If the response status is `403`, it means the rate limit has likely been hit. You should log a message and then `break` the loop.
    -   After the loop, assert that the final response status was indeed `403`.
    -   **Important:** This test can be slow and flaky depending on the network and the current state of the API's rate limit counter. Add a timeout override to the test to give it more time to run, e.g., `test.setTimeout(60000);` for 60 seconds.