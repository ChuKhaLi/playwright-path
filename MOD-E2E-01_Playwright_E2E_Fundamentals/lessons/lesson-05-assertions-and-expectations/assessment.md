# Lesson 5: Assessment

## Knowledge Check

### Question 1
What is the key benefit of Playwright's "web-first" assertions?
a) They run faster than other assertion libraries.
b) They automatically wait for the expected condition to be true before failing.
c) They can only be used with the `page` object.
d) They generate more detailed error messages.

**Answer:** b) Auto-waiting is the core feature that makes Playwright assertions so robust and reliable, eliminating test flakiness caused by timing issues.

---

### Question 2
You want to check if a button is currently unclickable. Which assertion would you use?
a) `await expect(button).not.toBeVisible()`
b) `await expect(button).toBeDisabled()`
c) `await expect(button).not.toBeChecked()`
d) `await expect(button).toBeHidden()`

**Answer:** b) `.toBeDisabled()` is the correct assertion for checking if a form element like a button is in a disabled state.

---

### Question 3
What is the difference between `.toHaveText()` and `.toContainText()`?
a) There is no difference; they are aliases.
b) `.toHaveText()` checks for an exact match, while `.toContainText()` checks for a substring.
c) `.toContainText()` is case-sensitive, while `.toHaveText()` is not.
d) `.toHaveText()` works on any element, while `.toContainText()` only works on `<div>` elements.

**Answer:** b) `.toHaveText()` is for exact string matching, and `.toContainText()` is for partial matching, which gives you flexibility in your assertions.

---

## Practical Exercise

### Task
1.  Go to the practice website `http://the-internet.herokuapp.com/challenging_dom`. This page has buttons that change their text and IDs on every page load, making it a good challenge.
2.  Create a new test file named `dom-challenge.spec.ts`.
3.  Write a test that performs the following:
    - Navigate to the page.
    - Find the blue button. Since its ID changes, you'll need a more stable selector. A CSS selector like `.button` or `a.button` would work.
    - **Assert** that the blue button is visible.
    - Click the blue button.
4.  Write a second test that interacts with the table on the same page.
    - Find the table element.
    - **Assert** that the table contains 11 rows (1 header row + 10 data rows). (Hint: Use `locator.count()`).
    - Find the cell that contains the text "Phaedrum4".
    - **Assert** that this cell is visible.

### Expected Code
Your `dom-challenge.spec.ts` file should look something like this:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Challenging DOM page', () => {

  test('should find and click the blue button', async ({ page }) => {
    await page.goto('http://the-internet.herokuapp.com/challenging_dom');

    // The blue button is the first one with the class 'button'
    const blueButton = page.locator('a.button').first();
    
    await expect(blueButton).toBeVisible();
    await blueButton.click();
  });

  test('should verify table content', async ({ page }) => {
    await page.goto('http://the-internet.herokuapp.com/challenging_dom');

    // Find all rows in the table body
    const tableRows = page.locator('//table/tbody/tr');
    
    // Assert the number of rows
    await expect(tableRows).toHaveCount(10);

    // Find a specific cell by its text
    const specificCell = page.getByRole('cell', { name: 'Phaedrum4' });

    // Assert that the cell is visible
    await expect(specificCell).toBeVisible();
  });

});
```

This exercise pushes you to use assertions to verify the state of the page both before and after an action. It also introduces `.toHaveCount()` for checking the number of elements returned by a locator.