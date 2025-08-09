# Lesson 10: Debugging Tests

## 1. The Inevitability of Failing Tests

No matter how carefully you write your tests, they will sometimes fail. This is a normal part of the development process. The key is to have a good debugging strategy so you can quickly find and fix the problem.

## 2. Debugging Tools and Techniques

Playwright provides several powerful tools for debugging your tests.

### a. The Trace Viewer

As we saw in the last lesson, the Trace Viewer is your best friend for debugging. It gives you a complete, interactive record of your test run. Always start here when a test fails.

### b. The Playwright Inspector

The Playwright Inspector is a GUI tool that lets you step through your tests and see what's happening on the page.

You can open the Inspector by running your tests with the `--debug` flag:

```bash
npx playwright test --debug
```

This will open a browser window with your test paused on the first line. You can then step through the test, inspect locators, and see the state of the page at each step.

### c. `page.pause()`

You can also pause your test at any point by adding `await page.pause()` to your code.

```typescript
await page.getByRole('button', { name: 'Submit' }).click();

// Pause the test to inspect the page
await page.pause();

await expect(page).toHaveURL('my-app.com/dashboard');
```

This will open the Playwright Inspector, allowing you to debug from that specific point in your test.

### d. Console Logs

Don't forget the power of simple console logs! You can use `console.log()` to print out values and see what's happening in your test.

```typescript
const url = page.url();
console.log(`The current URL is: ${url}`);
```

## 3. Common Causes of Failures

-   **Timing Issues:** The test is trying to interact with an element before it's ready. (Playwright's auto-waiting usually prevents this, but it can still happen in complex scenarios).
-   **Incorrect Locators:** The locator you're using doesn't match any element on the page, or it matches more than one.
-   **Application Bugs:** The test is failing because there's a real bug in the application! This is a good thing—it means your test is doing its job.

## 4. A Debugging Workflow

1.  **Run the test and see it fail.**
2.  **Examine the error message.** Playwright's error messages are usually very helpful.
3.  **Open the Trace Viewer.** This is the most important step. Look at the screenshots and the action timeline to see what went wrong.
4.  **If you're still not sure, run the test in debug mode (`--debug`) or add a `page.pause()` to inspect the page state.**
5.  **Fix the problem and run the test again.**

By following this workflow, you'll be able to debug your tests quickly and efficiently.