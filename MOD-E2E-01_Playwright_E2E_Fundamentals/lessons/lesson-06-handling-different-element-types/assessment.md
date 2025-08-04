# Lesson 6: Assessment

## Knowledge Check

### Question 1
How do you handle a native browser alert that appears after a button click?
a) `await page.click('button'); await page.alert.accept();`
b) `page.on('dialog', dialog => dialog.accept()); await page.click('button');`
c) `await page.click('button', { handleDialog: true });`
d) `try { await page.click('button'); } catch (e) { /* handle alert */ }`

**Answer:** b) You must set up the event listener with `page.on('dialog', ...)` *before* the action that triggers the dialog.

---

### Question 2
What is the correct way to find and interact with an element inside an `iframe`?
a) `page.locator('#my-iframe button').click();`
b) `page.switchToFrame('#my-iframe'); page.locator('button').click();`
c) `page.frameLocator('#my-iframe').locator('button').click();`
d) `page.locator('button').inside('#my-iframe').click();`

**Answer:** c) `page.frameLocator()` creates a new scope for your locators, allowing you to cleanly interact with elements inside the `iframe`.

---

### Question 3
Which method is used to upload a file to an `<input type="file">` element?
a) `locator.uploadFile('path/to/file')`
b) `locator.fill('path/to/file')`
c) `locator.setInputFiles('path/to/file')`
d) `locator.attachFile('path/to/file')`

**Answer:** c) `locator.setInputFiles()` is the dedicated method for handling file inputs.

---

## Practical Exercise

### Task
1.  Go to the practice website `http://the-internet.herokuapp.com/`.
2.  Create a new test file named `advanced-interactions.spec.ts`.
3.  **Test 1: File Uploader**
    - Navigate to the "File Upload" page.
    - Create a dummy text file in your project (e.g., `test-data/upload-test.txt`) with some content.
    - Use `setInputFiles` to upload this file.
    - Click the "Upload" button.
    - **Assertion:** Verify that the name of your uploaded file is displayed on the subsequent page.
4.  **Test 2: JavaScript Alerts**
    - Navigate to the "JavaScript Alerts" page.
    - Set up a dialog handler to accept the alert and verify its text is "I am a JS Confirm".
    - Click the "Click for JS Confirm" button.
    - **Assertion:** Verify that the result text on the page says "You clicked: Ok".

### Expected Code
Your `advanced-interactions.spec.ts` file should look something like this:

```typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Create a dummy file for uploading
const testFilePath = path.join(__dirname, '..', 'test-data', 'upload-test.txt');
fs.mkdirSync(path.dirname(testFilePath), { recursive: true });
fs.writeFileSync(testFilePath, 'This is a test file.');

test.describe('Advanced Interactions', () => {

  test('should upload a file', async ({ page }) => {
    await page.goto('http://the-internet.herokuapp.com/upload');
    
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('#file-upload').setInputFiles(testFilePath);
    await page.locator('#file-submit').click();

    await expect(page.locator('#uploaded-files')).toHaveText('upload-test.txt');
  });

  test('should handle a JS confirm dialog', async ({ page }) => {
    await page.goto('http://the-internet.herokuapp.com/javascript_alerts');

    page.on('dialog', async dialog => {
      expect(dialog.type()).toContain('confirm');
      expect(dialog.message()).toContain('I am a JS Confirm');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();

    await expect(page.locator('#result')).toHaveText('You clicked: Ok');
  });

});
```

This exercise gives you hands-on practice with file uploads and dialog handling, two common and important scenarios in E2E testing.