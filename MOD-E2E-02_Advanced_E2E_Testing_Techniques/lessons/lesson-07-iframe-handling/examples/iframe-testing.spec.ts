import { test, expect } from '@playwright/test';

const mockPageURL = 'file://' + __dirname + '/../mock-page/index.html';

test.describe('Iframe Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(mockPageURL);
  });

  test('should interact with elements inside a simple iframe', async ({ page }) => {
    // Use frameLocator to scope interactions
    const frameLocator = page.frameLocator('#simple-iframe');

    // Interact with elements within the iframe
    const input = frameLocator.locator('#iframe-input');
    await input.fill('Hello from the main page!');
    await frameLocator.getByRole('button', { name: 'Submit' }).click();

    // Assert a change within the iframe
    await expect(frameLocator.locator('#status-message')).toHaveText('Submitted: Hello from the main page!');
  });

  test('should find a frame by its URL and interact with it', async ({ page }) => {
    // Use page.frame() when you need to find a frame by its properties, like URL
    const frame = page.frame({ url: /.*iframe-content\.html/ });
    expect(frame).not.toBeNull();

    if (frame) {
      // Once you have the frame, you can use its locator method
      const heading = frame.locator('h1');
      await expect(heading).toHaveText('This is the Iframe Content');
    }
  });

  test('should handle nested iframes', async ({ page }) => {
    // Locate the parent iframe
    const parentFrame = page.frameLocator('#parent-iframe');

    // Locate the child iframe within the parent iframe
    const childFrame = parentFrame.frameLocator('#child-iframe');

    // Interact with an element in the deeply nested child iframe
    const nestedInput = childFrame.locator('#nested-input');
    await nestedInput.fill('Deeply nested interaction!');

    await expect(nestedInput).toHaveValue('Deeply nested interaction!');
  });

  test('should interact with the main page after interacting with an iframe', async ({ page }) => {
    const frameLocator = page.frameLocator('#simple-iframe');
    const mainPageButton = page.locator('#main-page-button');

    // Action inside the iframe
    await frameLocator.locator('#iframe-input').fill('Some text');

    // Action on the main page
    await mainPageButton.click();

    // Assert on the main page
    await expect(page.locator('#main-page-status')).toHaveText('Main button clicked!');
  });
});