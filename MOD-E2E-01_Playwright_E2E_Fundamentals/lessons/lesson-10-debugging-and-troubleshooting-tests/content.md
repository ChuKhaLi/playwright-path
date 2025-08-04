# Lesson 10: Debugging and Troubleshooting Tests

## Learning Objectives
After completing this lesson, you will be able to:
- Use the Playwright Inspector (Debug Mode) to step through tests.
- Analyze Playwright Trace Viewer files to understand test failures.
- Add pauses and `console.log` statements for quick debugging.
- Understand common sources of test flakiness and how to mitigate them.
- Leverage the VS Code extension for an integrated debugging experience.

---

## 1. The Debugging Mindset

When a test fails, it's not a problem; it's an opportunity. A failing test means you've either found a bug in your application or an issue in your test script. The goal of debugging is to efficiently determine which it is.

Common reasons for test failures:
- **Invalid Locator:** The selector you're using doesn't find the element (or finds the wrong one).
- **Timing Issues:** The application is slower than your test expects (though Playwright's auto-waiting solves most of this).
- **Application Bug:** The application is not behaving as expected. This is a successful test run!
- **Flakiness:** The test passes sometimes and fails other times. This is the hardest problem to solve.

## 2. The Playwright Inspector (Debug Mode)

You were introduced to the Inspector for finding locators, but it's also a full-featured debugger.

To start in debug mode, use the `--debug` flag:
```powershell
npx playwright test tests/my-failing-test.spec.ts --debug
```

This opens the Inspector and a browser window, paused on the first line of your test.

**Key Features:**
- **Step Over:** Executes the current line and pauses on the next one.
- **Resume:** Continues running the test until the next breakpoint or the end.
- **Pick Locator:** Interactively find locators on the live page.
- **Explore:** See the locator, before, and after states for each action in the log.

The Inspector is your go-to tool for understanding why a specific step in your test is failing.

## 3. The Playwright Trace Viewer

The Trace Viewer is one of Playwright's most powerful features. It's a post-mortem tool that lets you explore a detailed trace of a failed test run.

To enable it, you need to configure it in your `playwright.config.ts`:
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // 'on-first-retry' is a great setting. It doesn't create traces
    // for the first run, but if that run fails and Playwright retries it,
    // it will record a trace for that first failed attempt.
    trace: 'on-first-retry',
  },
});
```

When a test fails with this setting, the test report will contain a link to the trace file. You can also open it manually:
```powershell
npx playwright show-trace path/to/trace.zip
```

**Inside the Trace Viewer, you can:**
- See a full DOM snapshot for every action.
- View network requests and responses.
- See console logs from the browser.
- "Time travel" through the test execution, seeing what the page looked like at every step.

The Trace Viewer is the best tool for debugging failures that happen in a CI/CD environment where you can't run in headed or debug mode.

## 4. Quick and Dirty Debugging

Sometimes you just need a quick way to inspect something.

### Pausing the Test: `page.pause()`
You can insert `await page.pause()` anywhere in your test. When the test reaches this line, it will pause execution and open the Playwright Inspector, allowing you to explore the page state at that exact moment.

```typescript
await page.getByLabel('Username').fill('my-user');
await page.getByLabel('Password').fill('my-pass');

// Pause the test right before clicking login
await page.pause();

await page.getByRole('button', { name: 'Login' }).click();
```

### Logging to the Console: `console.log()`
You can use standard `console.log` statements in your test file to print values to the terminal during the test run.

```typescript
const heading = page.getByRole('heading');
const headingText = await heading.textContent();

console.log(`The heading text is: ${headingText}`);

await expect(heading).toHaveText('Welcome');
```

## 5. The VS Code Extension

If you use Visual Studio Code, the official [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension provides an amazing, integrated debugging experience.

**With the extension, you can:**
- Run tests with a single click next to the test definition.
- Set breakpoints directly in your code, just like debugging regular application code.
- See test results and error messages directly in the editor.
- Record new tests without using the command line.

This is often the most efficient way to write and debug tests.

---

## Summary

Congratulations on completing the Playwright E2E Fundamentals module! In this final lesson, you've acquired the essential skills to debug and troubleshoot your tests. You know how to use the Inspector for live debugging, the Trace Viewer for post-mortem analysis, and quick techniques like `page.pause()` for rapid inspection.

You are now fully equipped to write, run, and maintain a robust suite of E2E tests with Playwright. The next step in your journey is MOD-03, where you will learn advanced concepts like the Page Object Model, building a scalable test architecture, and more.