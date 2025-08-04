import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const testFilePath = path.join(__dirname, '../test-files/sample.txt');
const tempDownloadPath = path.join(__dirname, '../test-files/downloads/downloaded_sample.txt');

test.describe('File Handling', () => {
  test.beforeAll(() => {
    // Ensure the test file exists
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, 'This is a test file for Playwright.');
    }
    // Ensure download directory exists
    if (!fs.existsSync(path.dirname(tempDownloadPath))) {
      fs.mkdirSync(path.dirname(tempDownloadPath), { recursive: true });
    }
  });

  test('should upload a file using setInputFiles', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');

    // Set the file to upload
    await page.locator('input[type="file"]').setInputFiles(testFilePath);

    // Submit the form
    await page.getByRole('button', { name: 'Upload' }).click();

    // Assert the success message
    await expect(page.locator('h3')).toHaveText('File Uploaded!');
    await expect(page.locator('#uploaded-files')).toHaveText('sample.txt');
  });

  test('should upload a file created from a buffer', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');

    // Upload a file created dynamically
    await page.locator('input[type="file"]').setInputFiles({
      name: 'dynamic.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This file was created in the test.'),
    });

    await page.getByRole('button', { name: 'Upload' }).click();

    await expect(page.locator('#uploaded-files')).toHaveText('dynamic.txt');
  });

  test('should download a file', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/download');

    // Start waiting for the download before clicking
    const downloadPromise = page.waitForEvent('download');

    // Click the link that triggers the download
    await page.getByRole('link', { name: 'some-file.txt' }).click();

    const download = await downloadPromise;

    // Assert the filename
    expect(download.suggestedFilename()).toBe('some-file.txt');

    // Save the file
    await download.saveAs(tempDownloadPath);

    // Assert the file was saved and has content
    expect(fs.existsSync(tempDownloadPath)).toBe(true);
    const content = fs.readFileSync(tempDownloadPath, 'utf-8');
    expect(content).toContain('Lorem ipsum');

    // Clean up
    fs.unlinkSync(tempDownloadPath);
  });
});