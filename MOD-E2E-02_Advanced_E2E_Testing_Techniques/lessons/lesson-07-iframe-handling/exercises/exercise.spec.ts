import { test, expect } from '@playwright/test';

/**
 * Exercise: Interacting with a Customer Support Chat Widget
 *
 * You are testing a page that includes a customer support chat widget.
 * The widget is loaded inside an iframe with the id `support-widget-frame`.
 *
 * -- INSTRUCTIONS --
 *
 * 1.  **Navigate and Locate:**
 *     - Navigate to the mock page.
 *     - Create a frame locator for the support widget iframe.
 *
 * 2.  **Start a Chat:**
 *     - Inside the iframe, there is a "Start Chat" button. Click it.
 *
 * 3.  **Send a Message:**
 *     - After starting the chat, a text input with the placeholder "Type your message"
 *       and a "Send" button will appear inside the iframe.
 *     - Fill the text input with "Hello, I need help with my order."
 *     - Click the "Send" button.
 *
 * 4.  **Assert the Conversation:**
 *     - After sending, the message should appear in the chat log, which is
 *       a `div` with the id `chat-log` (also inside the iframe).
 *     - Assert that the chat log now contains the text "You: Hello, I need help with my order."
 *
 * 5.  **Interact with the Main Page:**
 *     - After interacting with the chat, click the "Close Widget" button
 *       which is on the *main page*, not inside the iframe.
 *     - Assert that the iframe is no longer visible.
 *
 */

const mockPageURL = 'file://' + __dirname + '/../mock-page/exercise.html';

test.describe('Support Chat Widget', () => {
  test('should allow a user to send a message through the iframe widget', async ({ page }) => {
    await page.goto(mockPageURL);

    // TODO: Step 1 - Create a frame locator for the iframe.
    // const chatFrame = page.frameLocator(...);

    // TODO: Step 2 - Click the "Start Chat" button inside the iframe.
    // await chatFrame.getByRole('button', { name: 'Start Chat' }).click();

    // TODO: Step 3 - Fill the input and click "Send".
    // const messageInput = chatFrame.getByPlaceholder(...);
    // await messageInput.fill(...);
    // await chatFrame.getByRole('button', { name: 'Send' }).click();

    // TODO: Step 4 - Assert the message appears in the chat log.
    // const chatLog = chatFrame.locator(...);
    // await expect(chatLog).toContainText(...);

    // TODO: Step 5 - Close the widget and assert it's hidden.
    // await page.getByRole('button', { name: 'Close Widget' }).click();
    // await expect(page.locator('#support-widget-frame')).not.toBeVisible();
  });
});