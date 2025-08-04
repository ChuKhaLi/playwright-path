import { test, expect } from '@playwright/test';

// For this example, we'll use a public WebSocket echo server.
// It sends back any message it receives.
const webSocketURL = 'wss://websockets.chilkat.io/wsChilkatEcho.ashx';

test.describe('WebSocket Communication', () => {
  test('should establish a connection and exchange messages', async ({ page }) => {
    // 1. Start listening for the websocket event before it might happen.
    const wsPromise = page.waitForEvent('websocket');

    // 2. Navigate to a page or perform an action that creates the WebSocket.
    // For this example, we'll create it manually.
    await page.evaluate(url => new WebSocket(url), webSocketURL);

    // 3. Await the promise to get the WebSocket object.
    const ws = await wsPromise;
    expect(ws.url()).toBe(webSocketURL);

    // 4. Listen for received messages (frames).
    const receivedFrames: any[] = [];
    ws.on('framereceived', frame => receivedFrames.push(JSON.parse(frame.payload.toString())));

    // 5. Listen for sent messages.
    const sentFrames: any[] = [];
    ws.on('framesent', frame => sentFrames.push(JSON.parse(frame.payload.toString())));

    // 6. Trigger the client to send a message.
    const messageToSend = { type: 'greeting', content: 'Hello, WebSocket!' };
    await page.evaluate(msg => {
      (window as any).ws.send(JSON.stringify(msg));
    }, messageToSend);

    // 7. Assert that the message was sent.
    await expect.poll(() => sentFrames.length).toBe(1);
    expect(sentFrames[0].content).toBe('Hello, WebSocket!');

    // 8. Since it's an echo server, assert that the message was received back.
    await expect.poll(() => receivedFrames.length).toBe(1);
    expect(receivedFrames[0].content).toBe('Hello, WebSocket!');

    // 9. Close the connection.
    await ws.close();
    expect(ws.isClosed()).toBe(true);
  });

  test('should update the UI based on a received WebSocket message', async ({ page }) => {
    // This test focuses on the UI result, not the WebSocket traffic itself.
    await page.goto('file://' + __dirname + '/../mock-page/index.html');

    // Initial state
    const status = page.locator('#status');
    await expect(status).toHaveText('Connecting...');

    // The mock page will connect and receive a message automatically.
    // We just need to wait for the UI to reflect the change.
    await expect(status).toHaveText('Connected!', { timeout: 10000 });

    // Now, simulate the server pushing an update.
    // In a real app, this would be a server-side action. Here, we use a debug button.
    await page.locator('#send-update-button').click();

    const messageDisplay = page.locator('#message');
    await expect(messageDisplay).toHaveText('New data received: 42');
  });
});