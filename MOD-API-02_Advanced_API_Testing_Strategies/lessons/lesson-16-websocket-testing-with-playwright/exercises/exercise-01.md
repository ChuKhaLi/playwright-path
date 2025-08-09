# Exercise 1: Testing a Live WebSocket Echo Server

## Objective

Write a test that connects to a public WebSocket echo server, sends a message, and asserts that the same message is echoed back.

## Instructions

1.  **Target Server:** We will use a public WebSocket echo server: `wss://ws.postman-echo.com/raw`. This server will simply echo back any message it receives.

2.  **Create a Test Spec File:** Create a file named `websocket-echo.spec.ts`.

3.  **Write the Test:**
    -   The test should be named `should receive an echo from the WebSocket server`.
    -   Use `page.waitForEvent('websocket')` to capture the `WebSocket` object when the connection is made.
    -   Navigate to a blank page (`about:blank`). This is because we are not testing a UI, but we need a `page` context to initiate the WebSocket connection.
    -   Use `page.evaluate()` to create a new `WebSocket` connection from within the browser context.
        ```typescript
        page.evaluate(() => {
          new WebSocket('wss://ws.postman-echo.com/raw');
        });
        ```
    -   Once you have the `WebSocket` object, set up a listener for the next frame received using `webSocket.waitForEvent('framereceived')`.
    -   Define a test message, e.g., `Hello, Roo!`.
    -   Send your test message to the server using `webSocket.send()`.
    -   Wait for the received frame promise to resolve.
    -   Assert that the `payload` of the received frame is equal to your test message.