# Lesson 10: Assessment - Cross-Browser and Device Testing

This assessment will test your understanding of cross-browser and device testing with Playwright.

## Questions

### Question 1:
**How do you configure Playwright to run tests on Firefox and WebKit in addition to the default Chromium?**
a) By passing a command-line flag: `npx playwright test --browser=firefox,webkit`
b) By adding projects for Firefox and WebKit to the `projects` array in `playwright.config.ts`.
c) By creating separate test files for each browser.
d) By using `browser.newContext({ browserName: 'firefox' })` in your tests.

**Answer:**
b) By adding projects for Firefox and WebKit to the `projects` array in `playwright.config.ts`. This is the standard and most powerful way to manage multi-browser configurations.

---

### Question 2:
**You want to emulate an iPhone 13 for a test run. How can you achieve this?**
a) `const context = await browser.newContext({ device: 'iPhone 13' });`
b) By setting `use: { ...devices['iPhone 13'] }` within a project in `playwright.config.ts`.
c) `await page.emulate('iPhone 13');`
d) You need to manually set the viewport, user agent, and other properties to match an iPhone 13.

**Answer:**
b) By setting `use: { ...devices['iPhone 13'] }` within a project in `playwright.config.ts`. Playwright's `devices` import provides a set of pre-configured descriptors for this purpose.

---

### Question 3:
**A test for a specific feature needs to be skipped on WebKit because the feature is not supported in Safari. How would you do this?**
a) `if (browserName === 'webkit') return;`
b) `test.skip(browserName === 'webkit', 'Feature not supported in Safari');`
c) `test.fail('webkit', 'Feature not supported in Safari');`
d) By adding a `skip: true` property to the WebKit project in the config.

**Answer:**
b) `test.skip(browserName === 'webkit', 'Feature not supported in Safari');`. This is the correct way to conditionally skip a test within the test function itself, providing a clear reason in the test report.

---

### Question 4:
**What is the primary benefit of using Playwright's device descriptors (e.g., `devices['Pixel 5']`) over manually setting the viewport?**
a) It's just shorter syntax for setting the viewport.
b) It's the only way to test on mobile.
c) It configures a whole range of properties to accurately emulate the device, including the viewport, user agent, device scale factor, `isMobile` flag, and touch support.
d) It automatically downloads a simulator for that device.

**Answer:**
c) It configures a whole range of properties to accurately emulate the device, including the viewport, user agent, device scale factor, `isMobile` flag, and touch support, providing a much more realistic testing environment.