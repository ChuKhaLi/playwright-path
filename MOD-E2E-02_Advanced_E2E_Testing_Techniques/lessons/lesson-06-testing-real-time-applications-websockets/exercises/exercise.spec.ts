import { test, expect } from '@playwright/test';

/**
 * Exercise: Testing a Real-Time Poll
 *
 * You are testing a live polling application. When a user votes,
 * a WebSocket message is sent to the server. The server then broadcasts
 * the updated vote counts to all connected clients, and the UI updates.
 *
 * -- INSTRUCTIONS --
 *
 * 1.  **Listen for the WebSocket:**
 *     - Before navigating, start waiting for the `websocket` event.
 *     - Navigate to the mock poll page.
 *     - Await the WebSocket promise to ensure the connection is established.
 *
 * 2.  **Capture the "Vote" Message:**
 *     - Attach a listener to the `framesent` event on the WebSocket.
 *     - This listener should capture outgoing messages.
 *
 * 3.  **Perform a Vote:**
 *     - Click the "Vote for Option A" button.
 *
 * 4.  **Assert the Sent Message:**
 *     - Use `expect.poll` to wait for a message to be sent.
 *     - Parse the sent message and assert that it contains
 *       `{ "vote": "A" }`.
 *
 * 5.  **Assert the Real-time UI Update:**
 *     - The mock server will automatically send back an "update" message
 *       after a vote. The UI should update in response.
 *     - The vote count for Option A (element with id `option-a-votes`)
 *       should update from "0" to "1".
 *     - Use a web-first assertion to wait for this text change.
 *
 */

const mockPageURL = 'file://' + __dirname + '/../mock-page/exercise.html';

test.describe('Live Poll Application', () => {
  test('should send a vote and update the UI in real-time', async ({ page }) => {
    // TODO: Step 1 - Start listening for the websocket event.
    // const wsPromise = ...

    await page.goto(mockPageURL);

    // TODO: Step 1 - Await the websocket promise.
    // const ws = ...

    // TODO: Step 2 - Set up a listener for sent frames.
    // const sentFrames: any[] = [];
    // ws.on('framesent', ...);

    // Initial state check
    const optionAVotes = page.locator('#option-a-votes');
    await expect(optionAVotes).toHaveText('0');

    // TODO: Step 3 - Click the vote button.
    // await page.getByRole('button', { name: 'Vote for Option A' }).click();

    // TODO: Step 4 - Assert the sent message.
    // await expect.poll(...).toBe(1);
    // const sentMessage = JSON.parse(sentFrames[0]);
    // expect(sentMessage.vote).toBe('A');

    // TODO: Step 5 - Assert the UI update.
    // await expect(optionAVotes).toHaveText('1');
  });
});