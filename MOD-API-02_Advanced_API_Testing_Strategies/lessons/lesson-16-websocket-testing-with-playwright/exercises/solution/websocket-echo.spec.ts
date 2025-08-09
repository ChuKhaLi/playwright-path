import { test, expect } from '@playwright/test';

test('should receive an echo from the WebSocket server', async ({ page }) => {
  const testMessage = `Hello from Roo at ${new Date().toISOString()}`;
  
  // Listen for the WebSocket connection
  const socketPromise = page.waitForEvent('websocket');

  // This code runs in the browser context to initiate the connection
  await page.evaluate(() => {
    new WebSocket('wss://ws.postman-echo.com/raw');
  });

  const webSocket = await socketPromise;

  // Wait for the connection to be open
  await webSocket.waitForEvent('open');
  console.log('WebSocket connection established.');

  // Set up a listener for the next message from the server
  const receivedPromise = webSocket.waitForEvent('framereceived');
  
  // Send the message
  console.log(`Sending message: "${testMessage}"`);
  await webSocket.send(testMessage);

  // Wait for the server's response
  const receivedFrame = await receivedPromise;
  const receivedMessage = receivedFrame.payload.toString();
  console.log(`Received message: "${receivedMessage}"`);

  // Assert that the echoed message is correct
  expect(receivedMessage).toBe(testMessage);

  // Close the socket
  await webSocket.close();
  console.log('WebSocket connection closed.');
});