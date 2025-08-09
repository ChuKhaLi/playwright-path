# Exercise 1: Testing an Asynchronous Process with Polling

## Objective

Test an asynchronous API process by initiating a task and then polling a status endpoint until the task is complete.

## Scenario

Imagine an API that processes videos.
1.  You send a `POST` request to `/api/process-video` with a video ID.
2.  The API immediately responds with a `202 Accepted` status and a `taskId`.
3.  The video processing happens in the background.
4.  You must poll a status endpoint, `/api/process-video/status/{taskId}`, until the status is `COMPLETED`.

We will simulate this entire flow using `page.route()` to mock the API behavior.

## Instructions

1.  **Create a Test Spec File:** Create a file named `async-polling.spec.ts`.

2.  **Write the Test:**
    -   **Mock the Initial Request:**
        -   Use `page.route()` to intercept `POST` requests to `/api/process-video`.
        -   Fulfill the request with a `202` status and a JSON body like `{ "taskId": "task-123" }`.
    -   **Mock the Polling Endpoint:**
        -   Use `page.route()` to intercept `GET` requests to `/api/process-video/status/task-123`.
        -   This mock needs to be stateful. It should return a `PROCESSING` status the first few times it's called, and then a `COMPLETED` status.
        -   A simple way to do this is with a counter variable outside the test.
    -   **Implement the Polling Logic:**
        -   In your test, first call the endpoint to start the process and get the `taskId`.
        -   Then, create a polling loop (e.g., a `for` loop with a delay).
        -   Inside the loop, call the status endpoint.
        -   If the status is `COMPLETED`, break the loop.
        -   Use a library like `async-retry` or a simple `await new Promise(r => setTimeout(r, 1000))` for delays.
    -   **Assert:** After the loop, assert that the final status was indeed `COMPLETED`.