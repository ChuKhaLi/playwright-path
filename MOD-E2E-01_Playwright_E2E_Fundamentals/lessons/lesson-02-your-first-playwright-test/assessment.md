# Lesson 2: Assessment

## Knowledge Check

### Question 1
In a Playwright test, what does the `page` object represent?
a) The entire browser window.
b) A single tab or page within a browser.
c) The test configuration file.
d) The HTML report.

**Answer:** b) The `page` object is your main interface for interacting with a single web page.

---

### Question 2
Which command is used to run all Playwright tests in headless mode?
a) `npx playwright run`
b) `npx playwright test --headless`
c) `npx playwright test`
d) `npx playwright start`

**Answer:** c) `npx playwright test` runs tests in headless mode by default.

---

### Question 3
What is the purpose of the `expect` function in a Playwright test?
a) To navigate to a new page.
b) To define a new test case.
c) To make assertions and check if conditions are true.
d) To import necessary modules.

**Answer:** c) `expect` is used to create assertions that verify the state of your application, such as checking a page title or element visibility.

---

## Practical Exercise

### Task
1.  In your `tests` directory, create a new file named `google-search.spec.ts`.
2.  Write a new test suite named "Google Search Functionality".
3.  Inside the suite, create a test case named "should load the Google homepage and have the correct title".
4.  The test should perform the following actions:
    - Navigate to `https://www.google.com`.
    - Assert that the page title is "Google".
5.  Run only this new test file from your terminal.
6.  After the run, open the HTML report to verify the result.

### Expected Code
Your `google-search.spec.ts` file should look like this:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Google Search Functionality', () => {

  test('should load the Google homepage and have the correct title', async ({ page }) => {
    // Navigate to Google's homepage
    await page.goto('https://www.google.com');

    // Get the title and assert it's correct
    const pageTitle = await page.title();
    expect(pageTitle).toBe('Google');
  });

});
```

This exercise reinforces the core workflow of creating a new test file, writing a simple navigation and assertion test, and running it in isolation. It prepares you for more complex interactions in the upcoming lessons.