# Lesson 5: Handling Complex UI Interactions

## 1. Drag and Drop

Playwright provides a simple `dragTo()` method to simulate dragging an element and dropping it onto another.

```typescript
import { test, expect } from '@playwright/test';

test('should drag and drop an item', async ({ page }) => {
  await page.goto('https://example.com/drag-and-drop');

  const sourceElement = page.locator('#item-to-drag');
  const targetElement = page.locator('#drop-zone');

  // Perform the drag-and-drop action
  await sourceElement.dragTo(targetElement);

  // Assert that the drop was successful
  await expect(targetElement.locator('#item-to-drag')).toBeVisible();
});
```
For more complex scenarios, you can also perform the action manually using `mouse.down()`, `mouse.move()`, and `mouse.up()`.

## 2. File Uploads

Automating file uploads is straightforward with `setInputFiles()`. You can upload one or more files.

### Uploading a Single File
You provide the path to the file you want to upload.

```typescript
test('should upload a profile picture', async ({ page }) => {
  await page.goto('/profile-settings');

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('input[type="file"]').click();
  const fileChooser = await fileChooserPromise;
  
  // Set the file to upload
  await fileChooser.setFiles('path/to/your/image.jpg');

  // An alternative, more direct way:
  // await page.locator('input[type="file"]').setInputFiles('path/to/your/image.jpg');

  await expect(page.getByText('image.jpg')).toBeVisible();
});
```

### Uploading Multiple Files
If the file input accepts multiple files, you can pass an array of paths.

```typescript
await page.locator('input[type="file"]').setInputFiles([
  'path/to/file1.pdf',
  'path/to/file2.docx'
]);
```

## 3. File Downloads

Playwright can also handle file downloads triggered by a click. You need to wait for the `download` event.

```typescript
test('should download an invoice', async ({ page }) => {
  await page.goto('/invoices/123');

  // Start waiting for the download before clicking
  const downloadPromise = page.waitForEvent('download');
  
  // This action triggers the download
  await page.getByRole('link', { name: 'Download PDF' }).click();
  
  const download = await downloadPromise;

  // Assert the suggested filename
  expect(download.suggestedFilename()).toBe('invoice-123.pdf');

  // Save the downloaded file to a temporary path
  const filePath = `downloads/${download.suggestedFilename()}`;
  await download.saveAs(filePath);

  // You can now perform assertions on the file content if needed
  // (e.g., read the PDF and check for specific text)
});
```

## 4. Hovering Over Elements

Some UI elements, like dropdown menus or tooltips, only appear when the mouse hovers over them. Use the `hover()` method for this.

```typescript
test('should display a tooltip on hover', async ({ page }) => {
  await page.goto('/dashboard');

  const helpIcon = page.locator('#help-icon');
  const tooltip = page.locator('.tooltip-content');

  // Hover over the icon
  await helpIcon.hover();

  // Assert that the tooltip is now visible
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toContainText('Click here for more information');
});
```

## 5. Working with Iframes

Iframes embed another HTML document within the current one. To interact with elements inside an iframe, you must first get a locator for the frame itself using `frameLocator()`.

```html
<!-- Main Page -->
<iframe id="settings-frame" src="/settings.html"></iframe>

<!-- Inside settings.html -->
<html>
  <body>
    <button>Save Settings</button>
  </body>
</html>
```

```typescript
test('should interact with an element inside an iframe', async ({ page }) => {
  await page.goto('/main-page');

  // Get a locator for the iframe
  const frame = page.frameLocator('#settings-frame');

  // Now, use this frame locator to find elements within the iframe
  const saveButton = frame.getByRole('button', { name: 'Save Settings' });

  await saveButton.click();

  await expect(frame.getByText('Settings saved!')).toBeVisible();
});
```

## 6. Advanced Keyboard and Mouse Actions

Beyond simple clicks, Playwright provides fine-grained control over the mouse and keyboard.

### Keyboard Actions
The `keyboard` object can be used to simulate complex key presses.

```typescript
test('should use keyboard shortcuts', async ({ page }) => {
  await page.goto('/editor');
  const editor = page.locator('.text-editor');

  await editor.focus();
  
  // Type text
  await page.keyboard.type('Hello World!');
  
  // Select all text (Ctrl+A or Command+A)
  await page.keyboard.press('Control+A');
  
  // Make it bold (Ctrl+B)
  await page.keyboard.press('Control+B');
});
```

### Mouse Actions
The `mouse` object can simulate double clicks, middle clicks, and precise movements.

```typescript
test('should handle double click to edit', async ({ page }) => {
  await page.goto('/items');
  const item = page.locator('.item-name');

  // Double click to enter edit mode
  await item.dblclick();

  const editInput = page.locator('.item-edit-input');
  await expect(editInput).toBeVisible();
  await editInput.fill('Updated Item Name');
  await editInput.press('Enter');
});
```

## 7. Summary

Automating modern web applications requires a toolset that can handle a wide variety of user interactions. Playwright's comprehensive APIs for drag-and-drop, file handling, iframes, and advanced input controls empower you to test even the most complex and dynamic user interfaces with confidence and precision.