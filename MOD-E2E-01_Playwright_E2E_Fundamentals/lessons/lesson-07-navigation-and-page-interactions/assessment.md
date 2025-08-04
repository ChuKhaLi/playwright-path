# Lesson 7: Assessment

## Knowledge Check

### Question 1
What is the correct pattern for handling a new tab that opens after a click?
a) `await page.click('a'); const newPage = await page.context().newPage();`
b) `const newPage = await page.click('a');`
c) `const pagePromise = page.waitForEvent('popup'); await page.click('a'); const newPage = await pagePromise;`
d) `await page.click('a'); const newPage = page.context().pages()[1];`

**Answer:** c) You must start waiting for the `popup` event *before* the click action and then `await` the promise it returns.

---

### Question 2
What is a "Browser Context" in Playwright?
a) The main browser window.
b) An isolated, "incognito-like" session within a browser instance.
c) A collection of all open tabs.
d) The configuration for a specific browser like Chrome or Firefox.

**Answer:** b) A browser context provides isolation for tests, ensuring they don't share cookies, storage, or sessions.

---

### Question 3
Which method would you use to navigate to the previously visited page?
a) `page.goBack()`
b) `page.history.back()`
c) `page.navigate('back')`
d) `page.go(-1)`

**Answer:** a) `page.goBack()` is the correct method for navigating back in the browser's history.

---

## Practical Exercise

### Task
1.  Go to the practice website `https://demoqa.com/browser-windows`.
2.  Create a new test file named `window-management.spec.ts`.
3.  **Test 1: New Tab**
    - Click the "New Tab" button.
    - Use `waitForEvent('popup')` to capture the new page.
    - **Assertion:** On the new page, assert that the heading element with the text "This is a sample page" is visible.
    - Close the new tab.
    - **Assertion:** Back on the original page, assert that the "New Tab" button is still visible.
4.  **Test 2: New Window**
    - This works similarly to a new tab.
    - Click the "New Window" button.
    - Capture the new page.
    - **Assertion:** On the new page, assert that the heading "This is a sample page" is visible.
    - Close the new window.

### Expected Code
Your `window-management.spec.ts` file should look something like this:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Window and Tab Management', () => {

  test('should handle a new tab', async ({ page }) => {
    await page.goto('https://demoqa.com/browser-windows');

    const newTabPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'New Tab' }).click();
    const newTab = await newTabPromise;

    await expect(newTab.locator('#sampleHeading')).toHaveText('This is a sample page');
    await newTab.close();

    await expect(page.getByRole('button', { name: 'New Tab' })).toBeVisible();
  });

  test('should handle a new window', async ({ page }) => {
    await page.goto('https://demoqa.com/browser-windows');

    const newWindowPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'New Window' }).click();
    const newWindow = await newWindowPromise;

    await expect(newWindow.locator('#sampleHeading')).toHaveText('This is a sample page');
    await newWindow.close();
  });

});
```

This exercise provides practical experience with the most common multi-page scenario: opening and interacting with new tabs/windows, then returning control to the original page.