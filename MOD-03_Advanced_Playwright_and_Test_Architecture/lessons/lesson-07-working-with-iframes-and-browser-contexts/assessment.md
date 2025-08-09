# Lesson 7: Assessment - iFrames and Browser Contexts

## Knowledge Check

### Question 1

What is the recommended Playwright method for interacting with elements inside an iFrame?

a) `page.locator()` with a special CSS selector.
b) `page.switchToFrame()` followed by `page.locator()`.
c) `page.frameLocator()` to create a locator for the frame, which can then be used to find elements within it.
d) `page.within()` to scope actions to the iFrame.

**Answer:** c

---

### Question 2

If you have a `frameLocator`, how do you find a button with the ID `#my-button` inside that frame?

a) `page.locator('#my-iframe #my-button')`
b) `frameLocator.locator('#my-button')`
c) `page.frameLocator('#my-button')`
d) `frameLocator.find('#my-button')`

**Answer:** b

---

### Question 3

In Playwright, what is the correct way to handle a new tab or window that is opened after clicking a link?

a) Use `browser.pages()` to get a list of all open pages and find the new one.
b) Wait for a fixed amount of time (e.g., `page.waitForTimeout(2000)`) and then assume the new tab is active.
c) Start waiting for the `'page'` event on the browser context *before* clicking the link, and then await the promise to get a reference to the new page.
d) You cannot test multiple tabs in Playwright; it's a limitation.

**Answer:** c

---

### Question 4

Which line of code correctly starts listening for a new page to be opened?

a) `const pagePromise = page.waitForEvent('newPage');`
b) `const pagePromise = page.context().waitForEvent('page');`
c) `const pagePromise = browser.waitForEvent('page');`
d) `const pagePromise = page.listen('page');`

**Answer:** b

---

### Question 5

After you get a reference to a new page object (`newPage`), how do you interact with elements on it?

a) You must use a special `newPage.run()` command.
b) You use it just like the original `page` object (e.g., `newPage.locator()`, `newPage.click()`).
c) You have to merge it with the original `page` object first.
d) All interactions must be prefixed with the context (e.g., `context.newPage.locator()`).

**Answer:** b