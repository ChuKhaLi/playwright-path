# Assessment: Advanced Browser Automation Scenarios

## Knowledge Check

### Question 1
When testing a feature that opens a new browser tab, which Playwright event should you wait for?
a) `context.waitForEvent('tab')`
b) `page.waitForEvent('new_window')`
c) `context.waitForEvent('page')`
d) `page.waitForEvent('popup')`

**Answer:** c) `context.waitForEvent('page')`

---

### Question 2
How do you programmatically accept a native browser `confirm` dialog?
a) By clicking the "OK" button with a locator.
b) By listening for the `dialog` event and calling `dialog.accept()`.
c) By sending an "Enter" key press.
d) It cannot be automated.

**Answer:** b) By listening for the `dialog` event and calling `dialog.accept()`.

---

### Question 3
What is required in your test configuration to read from or write to the system clipboard?
a) Running the test in headed mode.
b) Granting `'clipboard-read'` and `'clipboard-write'` permissions in the browser context.
c) Using a special browser that has clipboard access enabled by default.
d) Nothing, it works by default.

**Answer:** b) Granting `'clipboard-read'` and `'clipboard-write'` permissions in the browser context.

---

### Question 4
How can you test an application's behavior for a user in a different geographical location or with a different language preference?
a) By using a VPN on the test machine.
b) By creating a new `BrowserContext` with specific `locale`, `timezoneId`, or `geolocation` options.
c) By passing query parameters in the URL.
d) By mocking the API response to contain localized strings.

**Answer:** b) By creating a new `BrowserContext` with specific `locale`, `timezoneId`, or `geolocation` options.

---

## Practical Application

### Scenario
You are testing a collaborative document editor. The application has a "Share" button that opens a new tab with a read-only version of the document. On the main editor page, there is a "Delete" button that shows a `prompt` dialog asking the user to type the document's name to confirm deletion.

### Task
Write a Playwright test script that performs the following actions:
1.  **Navigate:** Go to the document editor page for a document named "My Test Document".
2.  **Test New Tab:**
    -   Start waiting for the `page` event on the browser context.
    -   Click the "Share" button.
    -   Wait for the new page to be created.
    -   Assert that the title of the new page is "My Test Document (Read-Only)".
    -   Close the new page.
3.  **Test Prompt Dialog for Deletion:**
    -   On the original page, set up a listener for the `dialog` event.
    -   The listener should check that the dialog is a `prompt` and has the message "Type 'My Test Document' to confirm deletion."
    -   The listener should then accept the prompt with the correct document name.
    -   Click the "Delete" button.
    -   After the dialog is handled, assert that the page now shows a "Document deleted" message.

Provide the complete TypeScript code for this test.