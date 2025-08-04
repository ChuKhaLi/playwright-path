# Assessment: File Upload and Download Testing

## Knowledge Check

### Question 1
Which Playwright method is used to select a file for an `<input type="file">` element?
a) `locator.fill()`
b) `locator.selectFile()`
c) `locator.setInputFiles()`
d) `locator.upload()`

**Answer:** c) `locator.setInputFiles()`

---

### Question 2
When testing a file download, why is it important to call `page.waitForEvent('download')` *before* clicking the download link?
a) To make the test run faster.
b) To ensure Playwright starts listening for the event before it occurs, avoiding a race condition.
c) It is not important; the order does not matter.
d) This is the only way to make the download button clickable.

**Answer:** b) To ensure Playwright starts listening for the event before it occurs, avoiding a race condition.

---

### Question 3
How can you test a drag-and-drop file upload component?
a) It cannot be tested with Playwright.
b) By using `locator.dragTo()` with a file path.
c) By creating a `DataTransfer` object with the file data and dispatching a `drop` event on the drop zone.
d) By using `locator.setInputFiles()` on the drop zone element.

**Answer:** c) By creating a `DataTransfer` object with the file data and dispatching a `drop` event on the drop zone.

---

### Question 4
After capturing a `Download` object, what method do you use to save the file to your local disk for inspection?
a) `download.save()`
b) `download.saveAs()`
c) `download.writeToDisk()`
d) `download.persist()`

**Answer:** b) `download.saveAs()`

---

## Practical Application

### Scenario
You are testing a document management system. The system allows users to upload a `.txt` file and then download it as a `.pdf`.

### Task
Write a single Playwright test that performs the following end-to-end flow:
1.  **Navigate:** Go to the document converter page.
2.  **Upload:**
    -   Locate the file input element.
    -   Create a test file `test-doc.txt` on the fly in your test code (e.g., using a buffer) with the content "Hello, Playwright!".
    -   Use `setInputFiles()` to upload this dynamically created file.
3.  **Trigger Conversion & Download:**
    -   After the upload, a "Convert to PDF" button becomes enabled. Click it.
    -   This action will trigger a download of the converted `test-doc.pdf` file.
4.  **Handle Download:**
    -   Start listening for the `download` event before clicking the convert button.
    -   Wait for the download to complete.
5.  **Assert Download:**
    -   Assert that the `suggestedFilename()` of the downloaded file is `test-doc.pdf`.
    -   Save the file to a temporary location.
    -   Assert that the saved file exists and is not empty.
    -   (Bonus) If you have a library to read PDFs, you could assert that it contains the text "Hello, Playwright!". For this assessment, just checking for existence and size is sufficient.
    -   Clean up the downloaded file.

Provide the complete TypeScript code for this test.