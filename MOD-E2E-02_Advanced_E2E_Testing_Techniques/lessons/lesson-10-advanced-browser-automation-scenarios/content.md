# Advanced Browser Automation Scenarios

Modern web applications often interact with the browser in more complex ways than just rendering content in a single tab. They might open new windows, trigger browser dialogs, or interact with the clipboard. Playwright provides comprehensive tools to handle these advanced scenarios.

## 1. Working with Multiple Tabs and Windows

Many applications open links to external sites or supplementary information in a new browser tab (`target="_blank"`). Playwright can seamlessly handle these multi-page workflows.

### Example: Handling a New Tab

```typescript
import { test, expect } from '@playwright/test';

test('should handle a new tab opened from a link', async ({ page, context }) => {
  await page.goto('/some-page-with-external-links');

  // Start waiting for the new page before clicking the link
  const pagePromise = context.waitForEvent('page');
  
  // This link opens in a new tab
  await page.getByRole('link', { name: 'Read Our Documentation' }).click();

  // Wait for the new page to be created and get a handle on it
  const newPage = await pagePromise;

  // Wait for the new page to load
  await newPage.waitForLoadState();

  // Assert content on the new page
  await expect(newPage).toHaveTitle(/Playwright Documentation/);
  await expect(newPage.getByRole('heading', { name: 'Welcome' })).toBeVisible();

  // You can now work with both pages
  await expect(page.getByRole('heading', { name: 'Main Page' })).toBeVisible();

  // Close the new page when you're done with it
  await newPage.close();
});
```
The `context` object represents the browser profile, which manages all pages (tabs) within it.

## 2. Handling Browser Dialogs

Native browser dialogs (`alert`, `confirm`, `prompt`) can block test execution if not handled. Playwright allows you to listen for these dialogs and interact with them programmatically.

You must set up the listener *before* the action that triggers the dialog.

### Example: Accepting a Confirmation Dialog

```typescript
import { test, expect } from '@playwright/test';

test('should accept a confirmation dialog', async ({ page }) => {
  // Set up a listener for the 'dialog' event
  page.on('dialog', async dialog => {
    // Assert the dialog's message
    expect(dialog.message()).toBe('Are you sure you want to delete this item?');
    
    // Accept the dialog
    await dialog.accept();
  });

  await page.goto('/items/123');
  
  // This action triggers the confirm dialog
  await page.getByRole('button', { name: 'Delete Item' }).click();

  // Assert the result of accepting the dialog
  await expect(page.locator('#status-message')).toHaveText('Item deleted successfully.');
});
```

To dismiss a dialog, use `await dialog.dismiss()`. For `prompt` dialogs, you can pass a string to `dialog.accept('some text')`.

## 3. Interacting with the Clipboard

Testing "copy to clipboard" functionality is a common requirement. Playwright provides access to the system clipboard.

**Note:** Clipboard permissions must be granted in the browser context.

### Example: Testing a "Copy" Button

```typescript
import { test, expect } from '@playwright/test';

test.use({
  // Grant clipboard permissions for this test file
  permissions: ['clipboard-read', 'clipboard-write'],
});

test('should copy text to the clipboard', async ({ page }) => {
  await page.goto('/share-link-page');

  const shareLink = page.locator('#share-link');
  const copyButton = page.getByRole('button', { name: 'Copy Link' });

  // Get the expected text from the element
  const expectedLink = await shareLink.inputValue();

  // Click the button that copies the text
  await copyButton.click();

  // Read the content from the clipboard
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

  // Assert that the clipboard content is correct
  expect(clipboardText).toBe(expectedLink);
});
```

You can also write to the clipboard using `page.evaluate(() => navigator.clipboard.writeText('...'))`.

## 4. Using Custom Browser Contexts

Sometimes you need to test how your application behaves under specific browser conditions, such as different languages, timezones, or with geolocation data. You can configure this by creating a custom `BrowserContext`.

### Example: Testing a Localized Page

```typescript
import { test, expect, devices } from '@playwright/test';

test.describe('Localization', () => {
  // Create a new browser context with German locale and timezone
  const germanContext = await browser.newContext({
    ...devices['Desktop Chrome'],
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
  });
  const page = await germanContext.newPage();

  test('should display the page in German', async () => {
    await page.goto('/home');

    // The application should detect the browser's locale and show German text
    await expect(page.getByRole('heading', { name: 'Willkommen' })).toBeVisible();
    
    // Dates and times should be in the German format
    await expect(page.locator('.date-display')).toHaveText(/.*\. Januar 2023/);
  });
});
```

## Summary

Playwright's capabilities extend far beyond single-page interactions. By mastering the APIs for handling multiple pages, dialogs, the clipboard, and custom browser contexts, you can automate even the most complex user workflows. These tools allow you to write comprehensive E2E tests that truly simulate a user's interaction with the entire browser, not just the webpage.