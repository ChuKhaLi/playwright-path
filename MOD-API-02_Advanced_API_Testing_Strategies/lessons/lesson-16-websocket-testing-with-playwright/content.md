# Lesson 16: WebSocket Testing with Playwright

## 1. Introduction to WebSockets

WebSockets provide a full-duplex communication channel over a single, long-lived TCP connection. Unlike the request-response model of HTTP, WebSockets allow the server to push data to the client in real-time, making them ideal for applications like chat, live notifications, and online gaming.

**Key Characteristics:**
- **Persistent Connection:** The connection remains open, reducing latency for frequent data exchange.
- **Bidirectional:** Both the client and server can send messages to each other at any time.
- **Stateful:** The server is aware of each connected client.

## 2. Testing WebSockets with Playwright

Playwright provides powerful, first-class support for testing WebSockets. You can listen for WebSocket connections, interact with them, and assert on the messages exchanged.

The core components are:
- `page.on('websocket', handler)`: An event listener that triggers when a new WebSocket connection is initiated by the page.
- `WebSocket` object: Represents the connection and has methods like `waitForEvent('framereceived')` to listen for incoming messages and `send()` to send messages.

### Example: Testing a Simple Chat Application

Let's imagine a simple chat application where users can send and receive messages.

```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test('should send and receive a chat message via WebSocket', async ({ page }) => {
  // Promise to capture the WebSocket object when it's created
  const webSocketPromise = page.waitForEvent('websocket');

  await page.goto('/chat');
  
  const webSocket = await webSocketPromise;

  // Wait for the connection to be established and receive a welcome message
  const welcomeMessage = await webSocket.waitForEvent('framereceived');
  const welcomePayload = JSON.parse(welcomeMessage.payload.toString());
  expect(welcomePayload.type).toBe('system');
  expect(welcomePayload.message).toContain('Welcome to the chat!');

  // Listen for the next message from the server
  const incomingMessagePromise = webSocket.waitForEvent('framereceived');

  // The user sends a message through the UI
  const testMessage = 'Hello, WebSocket!';
  await page.getByPlaceholder('Enter message...').fill(testMessage);
  await page.getByRole('button', { name: 'Send' }).click();

  // The server should echo the message back to the client
  const incomingMessage = await incomingMessagePromise;
  const receivedPayload = JSON.parse(incomingMessage.payload.toString());

  // Assert on the received message
  expect(receivedPayload.type).toBe('user-message');
  expect(receivedPayload.sender).toBe('me');
  expect(receivedPayload.text).toBe(testMessage);

  // Also assert that the message appears in the UI
  await expect(page.getByText(testMessage)).toBeVisible();
});
```

## 3. A Deeper Look at the `WebSocket` API

The `WebSocket` object in Playwright gives you fine-grained control:

- **`webSocket.url()`**: Gets the URL of the WebSocket.
- **`webSocket.waitForEvent(event, options)`**: Waits for a specific event on the socket. Common events are:
    - `framereceived`: A data frame (message) is received from the server.
    - `framesent`: A data frame is sent from the client.
    - `close`: The WebSocket connection is closed.
    - `error`: A socket error occurs.
- **`webSocket.isClosed()`**: Returns `true` if the socket is closed.

## 4. Mocking WebSocket Communication

Just as we can mock REST APIs, we can also intercept and mock WebSocket traffic. This is extremely useful for isolating your frontend from a live WebSocket backend, allowing you to test various real-time scenarios reliably.

However, Playwright's `page.route()` does **not** intercept WebSocket handshakes directly. The standard approach is to mock the client-side code that initiates the WebSocket connection or to use a library that can create a mock WebSocket server.

For advanced mocking, tools like `mock-socket` can be integrated into your testing environment.

## 5. Common WebSocket Testing Scenarios

- **Connection Lifecycle:** Test that the connection is established successfully and closed gracefully.
- **Message Validation:** Verify the format and content of messages sent from the server.
- **Authentication:** Ensure that only authenticated users can connect to the WebSocket. This often involves passing a token during the initial HTTP handshake.
- **Error Handling:** Test how the application behaves when the WebSocket connection drops unexpectedly or when malformed messages are received.
- **Concurrency:** Test how the system handles multiple clients connected and interacting simultaneously.

## 6. Summary

- WebSockets enable real-time, bidirectional communication.
- Playwright provides robust tools for testing WebSockets via the `page.on('websocket')` event and the `WebSocket` object.
- You can listen for messages, send messages, and assert on the entire communication flow.
- Key testing scenarios include connection management, message validation, and error handling.
- While direct mocking is complex, you can test the client's reaction to WebSocket events by controlling the messages it receives.