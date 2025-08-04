# Lesson 9: Assessment - Performance Testing

This assessment will test your understanding of front-end performance testing using Playwright.

## Questions

### Question 1:
**What kind of performance testing is Playwright best suited for?**
a) Load testing with thousands of virtual users.
b) Back-end API stress testing.
c) Front-end performance testing from a single-user perspective.
d) Database performance profiling.

**Answer:**
c) Front-end performance testing from a single-user perspective. It measures the experience of one user to catch regressions in page load times, resource sizes, etc.

---

### Question 2:
**How can you access detailed browser performance metrics like `DOMContentLoaded` time within a Playwright test?**
a) `await page.getPerformanceMetrics()`
b) By reading the performance data from the HTML report.
c) `await page.evaluate(() => window.performance.timing)`
d) `await page.context().getTimings()`

**Answer:**
c) `await page.evaluate(() => window.performance.timing)`. The `page.evaluate()` method allows you to execute JavaScript in the browser and access browser-level APIs like `window.performance`.

---

### Question 3:
**You want to ensure that a critical API call (`/api/v1/data`) responds in under 500ms. What is the best way to test this?**
a) `await page.waitForTimeout(500);`
b) `await page.waitForResponse('**/api/v1/data')` and then check the timing of the response object.
c) Use a `while` loop to check if the response has arrived.
d) This cannot be tested with Playwright.

**Answer:**
b) `await page.waitForResponse('**/api/v1/data')` and then check the timing of the response object. This method is designed specifically for waiting for network responses and allows you to inspect their properties, including timing.

---

### Question 4:
**Which Playwright feature provides a visual timeline of network requests, console logs, and page events, making it an excellent tool for debugging performance issues?**
a) The `page.screenshot()` method.
b) The `debug` mode in the config.
c) The Playwright Test HTML Report.
d) The Playwright Trace Viewer.

**Answer:**
d) The Playwright Trace Viewer. When tracing is enabled, it generates a detailed trace file that can be opened in the Trace Viewer (`npx playwright show-trace ...`) for in-depth performance analysis.