import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Exercise: Testing an Invoice Processing System
 *
 * You are testing a system that allows users to upload an invoice image (`.png`)
 * and then download a processed data file (`.json`).
 *
 * -- INSTRUCTIONS --
 *
 * 1.  **Navigate and Prepare:**
 *     - Navigate to the mock invoice processing page.
 *     - Define a path to a test image file (`invoice.png`). You can assume
 *       this file exists in a `test-files` directory next to your test.
 *
 * 2.  **Test File Upload:**
 *     - Locate the file input for the invoice upload.
 *     - Use `setInputFiles()` to select the `invoice.png`.
 *     - After selecting, a "Process Invoice" button should appear. Click it.
 *
 * 3.  **Handle the Download:**
 *     - After processing, a link to download "invoice-data.json" will appear.
 *     - Start waiting for the `download` event *before* clicking the download link.
 *     - Click the download link.
 *     - Await the download promise to get the `Download` object.
 *
 * 4.  **Assert the Downloaded File:**
 *     - Assert that the `suggestedFilename()` is "invoice-data.json".
 *     - Save the downloaded file to a temporary path.
 *     - Read the content of the saved JSON file.
 *     - Parse the JSON and assert that it contains an `invoiceId` property.
 *     - Clean up the saved file.
 *
 */

const mockPageURL = 'file://' + __dirname + '/../mock-page/exercise.html';
const uploadFilePath = path.join(__dirname, '../mock-page/invoice.png');
const tempDownloadPath = path.join(__dirname, '../mock-page/downloads/invoice-data.json');

test.describe('Invoice Processing', () => {
  test('should upload an image and download the processed JSON data', async ({ page }) => {
    await page.goto(mockPageURL);

    // TODO: Step 2 - Upload the invoice image.
    // const fileInput = page.locator(...);
    // await fileInput.setInputFiles(...);
    // await page.getByRole('button', { name: 'Process Invoice' }).click();

    // TODO: Step 3 - Prepare for and trigger the download.
    // const downloadPromise = page.waitForEvent(...);
    // await page.getByRole('link', { name: 'Download Processed Data' }).click();
    // const download = await downloadPromise;

    // TODO: Step 4 - Assert the downloaded file.
    // expect(download.suggestedFilename()).toBe(...);
    // await download.saveAs(...);
    // const fileContent = fs.readFileSync(..., 'utf-8');
    // const jsonData = JSON.parse(fileContent);
    // expect(jsonData.invoiceId).toBeDefined();
    // fs.unlinkSync(...);
  });
});