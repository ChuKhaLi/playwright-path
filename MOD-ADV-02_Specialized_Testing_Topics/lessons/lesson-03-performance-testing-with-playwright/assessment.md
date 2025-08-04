# Lesson 3: Assessment

## Knowledge Check

Test your understanding of performance testing with Playwright.

### Question 1

What is the primary benefit of using Playwright's Trace Viewer for performance analysis?

a) It automatically fixes performance bugs.
b) It provides a detailed timeline of network requests, rendering, and other browser activities.
c) It runs tests faster.
d) It only works for performance tests, not functional tests.

**Answer:** b) It provides a detailed timeline of network requests, rendering, and other browser activities.

### Question 2

Which of the following is a client-side performance metric that measures when the largest element in the viewport becomes visible?

a) Time to Interactive (TTI)
b) First Contentful Paint (FCP)
c) Page Load Time
d) Largest Contentful Paint (LCP)

**Answer:** d) Largest Contentful Paint (LCP)

### Question 3

How can you access browser-native performance metrics like LCP within a Playwright test?

a) By using `page.metrics()`.
b) By using `page.evaluate()` to execute code that accesses the browser's Performance API.
c) Playwright does not have access to these metrics.
d) By parsing the console logs.

**Answer:** b) By using `page.evaluate()` to execute code that accesses the browser's Performance API.

### Question 4

What is a practical way to integrate performance checks into your existing test suite without creating a separate performance suite?

a) Add `expect(loadTime).toBeLessThan(ms)` assertions to your functional tests.
b) Run a separate performance test for every functional test.
c) Only measure performance on the login page.
d) Performance checks cannot be integrated into functional tests.

**Answer:** a) Add `expect(loadTime).toBeLessThan(ms)` assertions to your functional tests.

### Question 5

Which `playwright.config.ts` setting is recommended for enabling tracing to debug and analyze performance of failed tests?

a) `trace: 'on'`
b) `trace: 'off'`
c) `trace: 'on-first-retry'`
d) `trace: 'always'`

**Answer:** c) `trace: 'on-first-retry'`