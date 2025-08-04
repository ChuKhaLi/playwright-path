import { test, expect } from '@playwright/test';

/**
 * Exercise: Testing a Multi-Step User Action Flow
 *
 * You are testing a settings page where a user can perform several actions
 * that interact with advanced browser features.
 *
 * -- INSTRUCTIONS --
 *
 * 1.  **Handle a New Tab for "Help" Link:**
 *     - Navigate to the mock settings page.
 *     - The page has a "Help Center" link that opens in a new tab.
 *     - Start waiting for the new `page` event.
 *     - Click the "Help Center" link.
 *     - Wait for the new page and assert that its heading is "Help & Support".
 *     - Close the new help page.
 *
 * 2.  **Handle a "Reset Settings" Confirmation:**
 *     - Back on the main settings page, there is a "Reset All Settings" button.
 *     - Clicking this button triggers a `confirm` dialog with the message
 *       "Are you sure you want to reset everything?".
 *     - Set up a listener to automatically accept this confirmation dialog.
 *     - Click the button and then assert that the status message on the page
 *       updates to "Settings have been reset."
 *
 * 3.  **Test "Copy User ID" to Clipboard:**
 *     - The page displays a User ID. There is a "Copy ID" button next to it.
 *     - Grant clipboard permissions for this test.
 *     - Click the "Copy ID" button.
 *     - Read the text from the system clipboard.
 *     - Assert that the clipboard text matches the User ID displayed on the page.
 *
 */

const mockPageURL = 'file://' + __dirname + '/../mock-page/exercise.html';

test.describe('Settings Page Advanced Interactions', () => {
  test.use({ permissions: ['clipboard-read'] });
  test('should correctly handle help tab, reset confirmation, and clipboard', async ({ page, context }) => {
    await page.goto(mockPageURL);

    // TODO: Step 1 - Handle the "Help Center" new tab.
    // const pagePromise = context.waitForEvent(...);
    // await page.getByRole('link', { name: 'Help Center' }).click();
    // const newPage = await pagePromise;
    // await expect(newPage.locator('h1')).toHaveText(...);
    // await newPage.close();

    // TODO: Step 2 - Handle the "Reset Settings" confirmation dialog.
    // page.on('dialog', async dialog => {
    //   ...
    //   await dialog.accept();
    // });
    // await page.getByRole('button', { name: 'Reset All Settings' }).click();
    // await expect(page.locator('#reset-status')).toHaveText(...);

    // TODO: Step 3 - Test the "Copy User ID" functionality.
    // const userId = await page.locator('#user-id').textContent();
    // await page.getByRole('button', { name: 'Copy ID' }).click();
    // const clipboardText = await page.evaluate(...);
    // expect(clipboardText).toBe(userId);
  });
});