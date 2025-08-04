import { test, expect, Browser, chromium } from '@playwright/test';

const mockPageURL = 'file://' + __dirname + '/../mock-page/index.html';

test.describe('Advanced Browser Scenarios', () => {
  test('should handle a new page/tab', async ({ page, context }) => {
    await page.goto(mockPageURL);

    // Start waiting for new page before clicking the link
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Open New Tab' }).click();
    const newPage = await pagePromise;

    // Work with the new page
    await newPage.waitForLoadState();
    await expect(newPage.locator('h1')).toHaveText('This is the new tab!');
    await newPage.close();

    // Continue working with the original page
    await expect(page.locator('h1')).toHaveText('Main Page');
  });

  test('should handle a confirm dialog', async ({ page }) => {
    await page.goto(mockPageURL);

    // Set up listener for the dialog
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Are you sure?');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Trigger Confirm' }).click();
    await expect(page.locator('#dialog-status')).toHaveText('Confirm accepted!');
  });

  test('should handle a prompt dialog', async ({ page }) => {
    await page.goto(mockPageURL);

    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('Playwright is awesome!');
    });

    await page.getByRole('button', { name: 'Trigger Prompt' }).click();
    await expect(page.locator('#dialog-status')).toHaveText('Prompt response: Playwright is awesome!');
  });

  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });
  test('should interact with the clipboard', async ({ page }) => {
    await page.goto(mockPageURL);

    // Test writing to clipboard
    await page.getByRole('button', { name: 'Copy to Clipboard' }).click();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('Text to be copied');

    // Test reading from clipboard (e.g., for a paste button)
    await page.evaluate(() => navigator.clipboard.writeText('Pasted from test'));
    await page.getByRole('button', { name: 'Paste from Clipboard' }).click();
    await expect(page.locator('#paste-area')).toHaveText('Pasted from test');
  });
});

test.describe('Custom Browser Context', () => {
  let browser: Browser;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test('should use a custom locale and timezone', async () => {
    const context = await browser.newContext({
      locale: 'fr-FR',
      timezoneId: 'Europe/Paris',
    });
    const page = await context.newPage();
    await page.goto(mockPageURL);

    const locale = await page.evaluate(() => navigator.language);
    expect(locale).toBe('fr-FR');

    const time = await page.evaluate(() => new Date(1672531200000).toLocaleString());
    // This will be formatted according to fr-FR locale in the Europe/Paris timezone
    expect(time).toBe('1/1/2023, 01:00:00');
    
    await context.close();
  });
});