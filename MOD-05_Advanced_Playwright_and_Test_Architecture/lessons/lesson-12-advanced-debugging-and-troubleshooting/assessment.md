# Lesson 12: Assessment - Advanced Debugging

This assessment will test your knowledge of Playwright's advanced debugging and troubleshooting tools.

## Questions

### Question 1:
**Which command do you use to launch the Playwright Inspector for interactive, step-by-step debugging?**
a) `npx playwright test --inspect`
b) `npx playwright test --headed`
c) `npx playwright test --debug`
d) `npx playwright test --inspector`

**Answer:**
c) `npx playwright test --debug`. This command is the primary way to open the Inspector and enter interactive debugging mode.

---

### Question 2:
**What is the main advantage of using the Playwright Trace Viewer over the Inspector?**
a) The Trace Viewer can fix tests automatically.
b) The Trace Viewer is used for live debugging, while the Inspector is for after-the-fact analysis.
c) The Trace Viewer is used for post-mortem analysis of a test run (especially headless/CI runs), allowing you to "travel back in time" to see exactly what happened.
d) The Trace Viewer can only be used for performance testing.

**Answer:**
c) The Trace Viewer is used for post-mortem analysis of a test run (especially headless/CI runs), allowing you to "travel back in time" to see exactly what happened. The Inspector is for live, interactive debugging.

---

### Question 3:
**You want to pause your test execution at a specific line to manually inspect the browser's state and DevTools. Which command should you add to your test script?**
a) `await page.stop()`
b) `await page.debug()`
c) `await page.inspect()`
d) `await page.pause()`

**Answer:**
d) `await page.pause()`. This command specifically halts the test execution and brings up the Playwright Inspector, allowing you to take over.

---

### Question 4:
**A test is "flaky," meaning it sometimes passes and sometimes fails. What is the most likely cause?**
a) A bug in the Playwright framework.
b) The test is too long.
c) A race condition, where the test tries to interact with the page before the application is in the expected state.
d) The computer running the test is too slow.

**Answer:**
c) A race condition, where the test tries to interact with the page before the application is in the expected state. This is the most common cause of flakiness, and it's usually solved by adding more specific assertions to wait for elements to be ready.