# Lesson 7: Hands-on Practice - iFrames and New Contexts

## Objective

To gain practical experience interacting with iFrames and handling new browser tabs.

## Scenario

You will be working with two different demo pages for this exercise:
1.  **For iFrames:** [https://the-internet.herokuapp.com/iframe](https://the-internet.herokuapp.com/iframe)
2.  **For New Tabs:** [https://the-internet.herokuapp.com/windows](https://the-internet.herokuapp.com/windows)

## Instructions

### Part 1: Interacting with an iFrame

1.  **Create a new test file:** `tests/specs/iframe.spec.ts`.

2.  **Write the test:**
    -   Create a test titled `'should type text into the iFrame editor'`.
    -   Navigate to `https://the-internet.herokuapp.com/iframe`.

3.  **Locate the iFrame:**
    -   Use the browser dev tools to inspect the rich text editor. You'll find it's inside an `<iframe>`.
    -   Create a `frameLocator` for the iFrame. A good selector is `'iframe[title="Rich Text Area"]'`.

4.  **Interact with the iFrame's content:**
    -   The text area inside the iFrame is the `<body>` element with an ID of `tinymce`.
    -   Use your `frameLocator` to get a locator for this element: `frameLocator.locator('#tinymce')`.
    -   First, clear the existing text in the editor.
    -   Then, type a new sentence, for example, `"Hello, iFrame!"`.

5.  **Add an Assertion:**
    -   Assert that the text you typed is now present in the editor.
        -   *Hint:* `await expect(editor).toHaveText('Hello, iFrame!');`

### Part 2: Handling a New Tab

1.  **Create another new test file:** `tests/specs/windows.spec.ts`.

2.  **Write the test:**
    -   Create a test titled `'should handle a new tab and verify its content'`.
    -   Navigate to `https://the-internet.herokuapp.com/windows`.

3.  **Implement the new tab logic:**
    -   Start waiting for the `'page'` event *before* you click the link that opens the new tab.
        -   `const pagePromise = page.context().waitForEvent('page');`
    -   Click the link with the text "Click Here".
    -   `await` the `pagePromise` to get the `newPage` object.

4.  **Interact with and Verify the New Tab:**
    -   Wait for the new page to fully load: `await newPage.waitForLoadState();`.
    -   On the new page, there is an `<h3>` element with the text "New Window". Assert that this element is visible and contains the correct text.
    -   Close the new tab using `newPage.close()`.

5.  **Verify You're Back on the Original Tab:**
    -   After closing the new tab, the context should switch back to the original page.
    -   Assert that an element on the original page is still visible, for example, the `<h3>` with the text "Opening a new window".

## Bonus Challenge

-   On the iFrame exercise, try to interact with the "Format" menu in the iFrame's toolbar.
-   Can you create a Page Object for the iFrame's content? How would you structure that?
-   On the new tab exercise, what happens if you don't `await` the `pagePromise`? Add a log to see what `newPage` is before and after the `await`.