# File Upload and Download Testing

Many web applications require users to upload or download files. Testing these features is crucial for ensuring a good user experience. Playwright provides straightforward APIs for handling both scenarios.

## 1. Automating File Uploads

There are two common types of file upload interfaces: the standard `<input type="file">` element and modern drag-and-drop components.

### Using `setInputFiles` for Standard Inputs

The most common method for file uploads is a file input element. Playwright's `locator.setInputFiles()` method makes testing this simple.

```typescript
import { test, expect } from '@playwright/test';
import *_ from 'path';

test('should upload a profile picture', async ({ page }) => {
  await page.goto('/profile/edit');

  // Find the file input element
  const fileInput = page.locator('input[type="file"]');

  // Provide the path to the test file
  const filePath = path.join(__dirname, 'test-files', 'avatar.png');
  await fileInput.setInputFiles(filePath);

  // The application might show a preview or the filename
  await expect(page.locator('.file-name-display')).toHaveText('avatar.png');

  // Click the final upload button
  await page.getByRole('button', { name: 'Save Profile' }).click();

  // Assert that the upload was successful
  await expect(page.locator('.profile-picture')).toHaveAttribute('src', /.*avatar.png/);
});
```
You can also pass a buffer to `setInputFiles` to create a file dynamically in your test.

### Testing Drag-and-Drop Uploads

Drag-and-drop uploaders don't have a file input element. To test these, you need to simulate the drag-and-drop action with a file payload. This is done by dispatching a `drop` event on the drop area.

```typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('should upload a file via drag and drop', async ({ page }) => {
  await page.goto('/file-drop-uploader');

  const dropZone = page.locator('#drop-zone');
  const filePath = path.join(__dirname, 'test-files', 'document.pdf');

  // Read the file into a buffer
  const buffer = fs.readFileSync(filePath);
  
  // Create the DataTransfer object
  const dataTransfer = await page.evaluateHandle((data) => {
    const dt = new DataTransfer();
    const file = new File([data.buffer], data.fileName, { type: data.mimeType });
    dt.items.add(file);
    return dt;
  }, { buffer, fileName: 'document.pdf', mimeType: 'application/pdf' });

  // Dispatch the drop event
  await dropZone.dispatchEvent('drop', { dataTransfer });

  // Assert that the UI has updated to show the uploaded file
  await expect(page.locator('.uploaded-file-name')).toHaveText('document.pdf');
});
```

## 2. Handling File Downloads

Testing file downloads involves two steps:
1.  Triggering the download action (e.g., clicking a "Download" button).
2.  Capturing the download event and inspecting the downloaded file.

You must start listening for the `download` event *before* you click the button that triggers it.

### Example: Downloading a Report

```typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('should download a generated report', async ({ page }) => {
  await page.goto('/reports');

  // Start waiting for the download before clicking
  const downloadPromise = page.waitForEvent('download');
  
  // Perform the action that initiates the download
  await page.getByRole('button', { name: 'Download Report' }).click();

  // Wait for the download to complete
  const download = await downloadPromise;

  // --- Assertions on the Download Object ---

  // Assert the suggested filename
  expect(download.suggestedFilename()).toBe('report-2023.pdf');

  // Save the downloaded file to a temporary path
  const tempPath = `temp-downloads/${download.suggestedFilename()}`;
  await download.saveAs(tempPath);

  // Assert the file exists at the new path
  expect(fs.existsSync(tempPath)).toBeTruthy();

  // Optional: Assert the file content or size
  const fileBuffer = fs.readFileSync(tempPath);
  expect(fileBuffer.length).toBeGreaterThan(1000); // Check if file is not empty
  
  // Clean up the downloaded file
  fs.unlinkSync(tempPath);
});
```

## 3. Best Practices

-   **Test Files:** Keep a dedicated directory (e.g., `tests/fixtures/files`) for your test upload files.
-   **Dynamic Files:** For uploads, you can create files on the fly using Node.js `fs` module if you need unique content for each test.
-   **Cleanup:** Always clean up downloaded files to avoid cluttering your test environment. Use a temporary directory that can be cleared after the test run.
-   **Focus on What Matters:** For downloads, you don't need to assert the entire file content every time. Often, checking the filename, MIME type, and that the file is not empty is sufficient.

## Summary

Playwright provides robust and intuitive APIs for handling both file uploads and downloads. By using `setInputFiles` for standard inputs and the `DataTransfer` object for drag-and-drop, you can cover all upload scenarios. For downloads, the `page.waitForEvent('download')` pattern allows you to capture the downloaded file and perform detailed assertions on its properties and content, ensuring these critical features work as expected.