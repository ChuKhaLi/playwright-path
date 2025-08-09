# Lesson 12: Advanced Debugging and Troubleshooting

## 1. The Debugging Mindset

Effective debugging is a systematic process of elimination. When a test fails, don't just re-run it. Instead, use the tools available to understand *why* it failed. The goal is to find the root cause, not just to make the test pass.

Playwright's tools are designed to give you maximum visibility into your test execution.

## 2. Interactive Debugging with the Playwright Inspector

The Playwright Inspector is your most powerful tool for live, interactive debugging. To use it, run your test command with the `--debug` flag.

```bash
npx playwright test --debug
```

This command does several things:
1.  It runs the browser in headed mode (you can see the UI).
2.  It opens the **Playwright Inspector**, a dedicated debugging window.
3.  It sets the default timeout to 0, so tests won't time out while you are debugging.

### Using the Inspector
- **Step-by-step Execution:** Use the "Step Over" button in the Inspector to execute your test one line at a time.
- **Explore Locators:** Use the "Explore" button to hover over elements on the page. The Inspector will suggest robust locators for you. You can also type locators into the Inspector's text field to see them highlighted on the page.
- **Record:** You can even click the "Record" button to perform actions in the browser, and the Inspector will generate the corresponding Playwright code for you.

## 3. Post-Mortem Debugging with the Trace Viewer

The Trace Viewer is the best tool for figuring out why a test failed in a CI/CD environment or a headless run. It's a detailed, post-mortem report of your test execution.

**Step 1: Enable tracing in `playwright.config.ts`**

The `'on-first-retry'` setting is highly recommended for CI environments. It means a trace will only be generated if a test fails, saving a lot of disk space. For local debugging, you might set it to `'on'`.

```typescript
// playwright.config.ts
use: {
  trace: 'on-first-retry', // or 'on'
}
```

**Step 2: Run your tests**

When a test fails (and is retried), a `trace.zip` file will be generated and attached to the HTML report.

**Step 3: Analyze the trace**

Open the HTML report (`npx playwright show-report`) and click the trace icon next to the failed test.

The Trace Viewer gives you:
- **Actions:** A list of every Playwright action that was performed.
- **Snapshots:** Before and after DOM snapshots for each action. You can see exactly what the page looked like at every step.
- **Network:** A full log of all network requests.
- **Console:** All console messages from the browser.
- **Source:** The source code of your test.

This allows you to travel back in time and see the exact state of the page when your test failed, which is invaluable for debugging.

## 4. Pausing Execution with `page.pause()`

Sometimes, you just want to stop the test at a specific point and inspect the browser manually. The `page.pause()` command is perfect for this.

```typescript
test('should investigate the checkout form', async ({ page }) => {
  await page.goto('/checkout');
  await page.locator('#first-name').fill('John');
  
  // Pause the execution here
  await page.pause(); 
  
  // The test will stop. You can now open the browser's DevTools,
  // inspect elements, check network requests, and then resume
  // execution from the Playwright Inspector.
  
  await page.locator('#last-name').fill('Doe');
  await page.getByRole('button', { name: 'Continue' }).click();
});
```
When `page.pause()` is hit, the Playwright Inspector will open, and you'll have full control to resume, step through, or stop the test.

## 5. Strategies for Flaky Tests

Flaky tests are the bane of any test suite. A test is flaky if it passes sometimes and fails other times without any code changes.

### How to Debug Flakiness
1.  **Run in a Loop:** Try running the single flaky test in a loop to see if you can reproduce the failure consistently.
    ```bash
    npx playwright test my-flaky-test.spec.ts --repeat-each=10
    ```
2.  **Analyze Traces:** Enable tracing (`'on'`) and run the test until it fails. Compare the trace of the failed run with the trace of a successful run. Look for differences in timing, network responses, or rendering.
3.  **Add More Assertions:** Flakiness is often a sign of a race condition. The test is trying to interact with an element before it's ready. Add more assertions to wait for the application to be in the state you expect.
    ```typescript
    // Instead of just clicking...
    await page.getByRole('button', { name: 'Submit' }).click();

    // Wait for the button to be ready first.
    await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
    await page.getByRole('button', { name: 'Submit' }).click();
    ```
4.  **Check for Animations:** Use the `animations: 'disabled'` option in `toHaveScreenshot` or ensure you wait for animations to complete before interacting with elements.

## 6. Summary

Congratulations on completing the final lesson of this module! Debugging is as much an art as a science. Playwright provides a world-class set of tools—the Inspector for live debugging and the Trace Viewer for post-mortem analysis—that give you unprecedented visibility into your test execution. By mastering these tools and applying systematic troubleshooting strategies, you can efficiently maintain a robust and reliable test suite, no matter how complex your application becomes.