import { test, expect } from '@playwright/test';

// Mock page setup
const mockPageURL = 'file://' + __dirname + '/../mock-page/exercise.html';

test.describe('Exercise: Advanced Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(mockPageURL);
  });

  test('should complete the interactive challenge', async ({ page }) => {
    // -- Part 1: Hover and Click --
    // Objective: Hover over the "Profile" button to reveal a "Settings" link, then click it.
    const profileButton = page.locator('#profile-button');
    const settingsLink = page.locator('#settings-link');

    // TODO: Add your code here to hover over the profile button.
    // await ...

    // TODO: Assert that the settings link is now visible.
    // await expect(...).toBeVisible();

    // TODO: Click the settings link.
    // await ...

    // This assertion verifies Part 1 is complete.
    await expect(page.locator('#challenge-status-1')).toHaveText('Part 1 Complete');


    // -- Part 2: Drag and Drop --
    // Objective: Drag the "Urgent Task" item into the "High Priority" container.
    const urgentTask = page.locator('#urgent-task');
    const highPriorityContainer = page.locator('#high-priority-container');

    // TODO: Add your code here to drag the task to the container.
    // await ...

    // This assertion verifies Part 2 is complete.
    await expect(highPriorityContainer.locator('#urgent-task')).toBeVisible();
    await expect(page.locator('#challenge-status-2')).toHaveText('Part 2 Complete');


    // -- Part 3: Custom Component Interaction --
    // Objective: Open the custom select menu and choose "Option C".
    const customSelectTrigger = page.locator('#custom-select-trigger');
    const selectOptions = page.locator('#custom-select-options');

    // TODO: Click the trigger to open the custom select.
    // await ...

    // TODO: Click the element representing "Option C".
    // await ...

    // This assertion verifies Part 3 is complete.
    await expect(page.locator('#challenge-status-3')).toHaveText('Part 3 Complete');


    // -- Final Verification --
    // If all parts are complete, a success message will appear.
    await expect(page.locator('#final-success-message')).toBeVisible();
  });
});