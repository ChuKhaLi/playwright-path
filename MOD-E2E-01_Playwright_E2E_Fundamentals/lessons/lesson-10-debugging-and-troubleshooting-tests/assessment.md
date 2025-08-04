# Lesson 10: Assessment

## Knowledge Check

### Question 1
Which command is used to launch the Playwright Inspector for live, step-by-step debugging?
a) `npx playwright trace`
b) `npx playwright test --debug`
c) `npx playwright inspect`
d) `npx playwright test --headed`

**Answer:** b) The `--debug` flag is the primary way to start the debugger and the Inspector.

---

### Question 2
What is the main advantage of using the Playwright Trace Viewer?
a) It allows you to edit your test code while the test is running.
b) It provides a detailed, post-mortem analysis of a test run, which is perfect for CI failures.
c) It automatically fixes failing tests.
d) It only works when tests are run in headed mode.

**Answer:** b) The Trace Viewer is an offline tool that lets you dissect every aspect of a past test run, making it invaluable for debugging CI/CD pipeline failures.

---

### Question 3
What does `await page.pause()` do when placed in a test?
a) It stops the test permanently.
b) It adds a 5-second delay to the test.
c) It prints the current page's HTML to the console.
d) It pauses test execution and opens the Playwright Inspector for interactive debugging.

**Answer:** d) `page.pause()` is a powerful way to stop your test at a specific point and inspect the state of the page.

---

## Practical Exercise

### Task
1.  Create a new test file named `debug-practice.spec.ts`.
2.  Write a test that intentionally fails. For example, navigate to `https://www.saucedemo.com/` and try to find an element that doesn't exist.
    ```typescript
    test('a deliberately failing test', async ({ page }) => {
      await page.goto('https://www.saucedemo.com/');
      // This locator will fail because the button does not exist
      await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    });
    ```
3.  **Debug with the Inspector:**
    - Run this single test file with the `--debug` flag.
    - Use the "Step Over" button to execute the `goto` action.
    - When the test is paused at the failing `expect` line, use the "Pick Locator" tool to find the correct locator for the "Login" button.
    - Observe how the Inspector helps you immediately identify the incorrect locator.
4.  **Debug with Trace Viewer:**
    - Make sure `trace: 'on'` or a similar setting is enabled in your `playwright.config.ts`.
    - Run the failing test normally (e.g., `npx playwright test tests/debug-practice.spec.ts`).
    - After it fails, open the generated HTML report (`npx playwright show-report`).
    - Find the "Traces" link/icon for the failed test and click it to open the Trace Viewer.
    - In the Trace Viewer, inspect the "Actions" log. Click on the failed `expect` action and look at the log details. You will see that the locator timed out waiting for the element to be visible.
    - Explore the "DOM" and "Network" tabs to see the state of the application during the test.

### Expected Outcome
By completing this exercise, you will have:
- Successfully used the Playwright Inspector to step through a test and identify a locator issue in real-time.
- Successfully generated and analyzed a trace file for a failed test, understanding how to use it to diagnose problems after the fact.

This practical experience with Playwright's core debugging tools is the final and most crucial skill for becoming a self-sufficient and effective automation engineer.