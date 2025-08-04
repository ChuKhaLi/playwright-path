# Lesson 5: Assessment

## Knowledge Check

### Question 1
How do you configure Playwright to run tests on different browsers like Chrome, Firefox, and Safari?

a) By writing separate test scripts for each browser.
b) By using the `--browser` flag for each test run.
c) By defining different "projects" in the `playwright.config.ts` file, each with a specific browser configuration.
d) It's not possible; Playwright only supports Chrome.

**Answer:** c) By defining different "projects" in the `playwright.config.ts` file, each with a specific browser configuration.

---

### Question 2
What is the purpose of using `test.skip(isMobile, 'Reason')` in a test?

a) To permanently disable the test.
b) To mark the test as "flaky".
c) To conditionally skip the test on certain platforms (e.g., skip a mobile-only test when running on desktop).
d) To make the test run faster.

**Answer:** c) To conditionally skip the test on certain platforms (e.g., skip a mobile-only test when running on desktop).

---

### Question 3
When testing a responsive design, why is it better to use a `data-testid` attribute for a locator instead of a CSS class like `.mobile-only`?

a) `data-testid` is shorter and easier to type.
b) CSS classes are not supported by Playwright locators.
c) `data-testid` is a semantic attribute that is less likely to change than a stylistic CSS class, making the locator more resilient across different viewports.
d) `data-testid` locators are faster to execute.

**Answer:** c) `data-testid` is a semantic attribute that is less likely to change than a stylistic CSS class, making the locator more resilient across different viewports.

---

### Question 4
What is a recommended strategy for running a large test suite in a CI/CD pipeline to balance speed and coverage?

a) Run all tests on all platforms for every single code change.
b) Run a small set of smoke tests on all platforms for every change, and run the full suite on all platforms nightly.
c) Only run tests on one browser, like Chrome, and ignore the others.
d) Run tests manually before every release.

**Answer:** b) Run a small set of smoke tests on all platforms for every change, and run the full suite on all platforms nightly.

---

### Question 5
What is the primary purpose of the Strategy Pattern (using an interface and platform-specific classes) in cross-platform test architecture?

a) To reduce the number of test files.
b) To handle significant differences in page structure or behavior between platforms (e.g., desktop vs. mobile) in a clean, organized way.
c) To force all platforms to behave identically.
d) To combine all page objects into one large class.

**Answer:** b) To handle significant differences in page structure or behavior between platforms (e.g., desktop vs. mobile) in a clean, organized way.