import { test, expect } from '@playwright/test';

/**
 * Exercise: Testing a To-Do List SPA
 *
 * You are testing a simple To-Do List SPA. The application fetches
 * initial to-do items from an API and allows users to add new ones.
 *
 * -- INSTRUCTIONS --
 *
 * 1.  **Mock the Initial Data:**
 *     - Intercept the GET request to `**/api/todos`.
 *     - Fulfill the request with a mock response containing one to-do item:
 *       `[{ "id": 1, "text": "Buy milk", "completed": false }]`
 *
 * 2.  **Test Initial State:**
 *     - Navigate to the application.
 *     - Assert that the mocked to-do item ("Buy milk") is visible in the list.
 *
 * 3.  **Test Adding a New Item:**
 *     - Mock the POST request to `**/api/todos`. When a new to-do is added,
 *       the app sends a POST request with the new item's text.
 *     - The mock response for the POST request should return the new to-do
 *       with an ID, e.g., `{ "id": 2, "text": "Walk the dog", "completed": false }`.
 *     - Fill the input field with "Walk the dog".
 *     - Click the "Add" button.
 *
 * 4.  **Assert the New State:**
 *     - Assert that the new to-do item ("Walk the dog") now appears in the list.
 *     - Assert that the list now contains exactly two to-do items.
 *
 */

const mockPageURL = 'file://' + __dirname + '/../mock-page/exercise.html';

test.describe('To-Do List SPA', () => {
  test('should load initial todos, add a new one, and update the list', async ({ page }) => {
    // TODO: Step 1 - Mock the GET request for initial to-dos.
    // await page.route(...);

    // TODO: Step 3 - Mock the POST request for adding a new to-do.
    // await page.route(...);

    // Navigate to the app
    await page.goto(mockPageURL);

    // TODO: Step 2 - Assert the initial state.
    // await expect(...).toBeVisible();

    // Find the input and add button
    const newTodoInput = page.getByPlaceholder('What needs to be done?');
    const addButton = page.getByRole('button', { name: 'Add' });

    // TODO: Step 3 - Fill the input and click the add button.
    // await newTodoInput.fill(...);
    // await addButton.click();

    // TODO: Step 4 - Assert the new state.
    // await expect(...).toBeVisible();
    // await expect(...).toHaveCount(2);
  });
});