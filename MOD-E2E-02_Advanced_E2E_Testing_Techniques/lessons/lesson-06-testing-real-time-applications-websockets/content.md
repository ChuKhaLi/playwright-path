# Testing Real-time Applications (WebSockets)

Real-time applications, such as chat apps, live dashboards, and collaborative editing tools, rely on persistent, bidirectional communication between the client and server. WebSockets are the primary technology for this. Testing these applications requires a focus on the flow of real-time data and the corresponding UI updates.

## 1. Understanding WebSockets

Unlike the request-response model of HTTP, a WebSocket connection remains open, allowing the server to push data to the client at any time without the client having to ask for it.

**Key Concepts:**
-   **Connection:** A persistent, two-way communication channel.
-   **Frames:** Messages sent back and forth over the connection. These can be text or binary.

## 2. Listening to WebSocket Events in Playwright

Playwright allows you to listen to WebSocket events directly, giving you access to the raw data being transmitted. This is incredibly powerful for testing.

The primary events are:
-   `'websocket'`: Fired when a new WebSocket connection is established.
-   `'framereceived'`: Fired when a message (frame) is received from the server.
-   `'framesent'`: Fired when a message is sent from the client.

### Example: Capturing WebSocket Messages

```typescript
import { test, expect } from '@playwright/test';

test('should receive messages from a chat server', async ({ page }) => {
  // Start listening for WebSocket events *before* navigating
  const webSocketPromise = page.waitForEvent('websocket');
  
  await page.goto('https://your-chat-app.com');

  const webSocket = await webSocketPromise;

  // Store received messages
  const receivedMessages: string[] = [];
  webSocket.on('framereceived', event => {
    console.log('Received message:', event.payload);
    receivedMessages.push(event.payload.toString());
  });

  // Perform an action that triggers a WebSocket message from the server
  await page.getByRole('button', { name: 'Join Chat' }).click();

  // Wait for a specific message or a certain number of messages
  await expect.poll(() => receivedMessages.length).toBeGreaterThan(0);

  // Assert the content of the received message
  expect(receivedMessages[0]).toContain('Welcome to the chat!');
});
```

## 3. Testing Real-time UI Updates

While inspecting WebSocket frames is useful for debugging, E2E tests should primarily focus on the end-user experience: **Did the UI update correctly in response to the real-time data?**

This approach makes your tests less brittle, as they don't depend on the exact format of the WebSocket messages, which might change.

### Example: Testing a Live Notification Feed

```typescript
import { test, expect } from '@playwright/test';

test('should display new notifications in real-time', async ({ page }) => {
  await page.goto('https://your-app.com/dashboard');

  // The notification list is initially empty
  const notificationList = page.locator('#notification-list');
  await expect(notificationList.locator('li')).toHaveCount(0);

  // --- In a real test, you would trigger a server-side event here ---
  // For this example, we'll simulate it by clicking a debug button
  // that sends a WebSocket message from the server.
  // In a real scenario, this could be an API call:
  // await request.post('/api/send-notification', { data: { userId: '123', message: 'New Update!' } });
  await page.locator('#debug-send-notification').click();
  
  // Use a web-first assertion to wait for the UI to update
  const newNotification = notificationList.locator('li').first();
  await expect(newNotification).toBeVisible({ timeout: 10000 });
  await expect(newNotification).toHaveText('New Update!');

  // Verify the list now has one item
  await expect(notificationList.locator('li')).toHaveCount(1);
});
```
In this example, we don't interact with the WebSocket directly in the test. We trust that if the UI updates correctly, the underlying WebSocket communication is working.

## 4. Sending WebSocket Messages from the Client

You can also test the client's ability to send messages and verify that the server receives them (by checking for a UI update or a response message).

### Example: Sending a Chat Message

```typescript
import { test, expect } from '@playwright/test';

test('should send a chat message and see it appear in the chat window', async ({ page }) => {
  await page.goto('https://your-chat-app.com');
  await page.getByRole('button', { name: 'Join Chat' }).click();

  const chatInput = page.getByPlaceholder('Type a message...');
  const chatWindow = page.locator('#chat-window');

  // Type and send a message
  await chatInput.fill('Hello, world!');
  await page.keyboard.press('Enter');

  // The application sends a WebSocket frame. The server echoes it back.
  // The application then renders the echoed message in the UI.
  
  // Assert that our message appears in the chat window
  await expect(chatWindow.locator('p').last()).toHaveText('You: Hello, world!');
});
```

## Summary

Testing real-time applications requires focusing on the asynchronous nature of WebSockets. Playwright provides the tools to both inspect the low-level WebSocket traffic and, more importantly, test the resulting UI changes from a user's perspective. By prioritizing assertions on the final UI state, you can create robust and meaningful tests for even the most dynamic real-time applications.