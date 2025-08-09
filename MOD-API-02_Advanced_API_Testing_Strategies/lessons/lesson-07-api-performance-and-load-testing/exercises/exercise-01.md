# Exercise 1: Basic Performance and Load Testing

## Objective

Write two tests: one to measure the response time of a single API request and another to simulate a small load of concurrent requests.

## Instructions

1.  **Target API:** Use the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/), specifically the `/posts` endpoint.

2.  **Create a Test Spec File:** Create a file named `performance.spec.ts`.

3.  **Test 1: Response Time Baseline**
    -   Write a test named `should respond within a performance budget`.
    -   Record the time *before* you send a `GET` request to `/posts`.
    -   Record the time *after* the request completes.
    -   Calculate the duration.
    -   Log the duration to the console.
    -   Assert that the duration is less than a reasonable budget (e.g., 1000ms).

4.  **Test 2: Concurrent Load Test**
    -   Write a test named `should handle concurrent requests`.
    -   Define a constant for the number of concurrent users (e.g., `15`).
    -   Create an empty array to hold your request promises.
    -   Loop from 0 to the number of users, and in each iteration, push a `request.get('/posts')` promise into the array.
    -   Use `Promise.all()` to execute all the requests in parallel.
    -   After `Promise.all()` resolves, loop through the array of responses and assert that every single response was `ok()`.