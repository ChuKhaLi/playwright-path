# Lesson 8: Assessment - Visual Regression Testing

This assessment will test your understanding of visual regression testing with Playwright.

## Questions

### Question 1:
**What happens the very first time you run a test with `await expect(page).toHaveScreenshot('home.png');`?**
a) The test fails because the snapshot `home.png` does not exist.
b) The test takes a screenshot, saves it as the "golden" snapshot `home.png`, and passes.
c) The test passes without doing anything.
d) The test throws an error asking you to create the snapshot manually.

**Answer:**
b) The test takes a screenshot, saves it as the "golden" snapshot `home.png`, and passes. This initial snapshot becomes the baseline for future comparisons.

---

### Question 2:
**An intentional UI redesign has caused many of your visual tests to fail. What is the correct command to update the golden snapshots?**
a) `npx playwright test --save-snapshots`
b) `npx playwright test --update-snapshots`
c) `npx playwright test --new-snapshots`
d) `npx playwright test --ignore-snapshots`

**Answer:**
b) `npx playwright test --update-snapshots`. This tells Playwright to replace the existing baseline images with the new ones from this test run.

---

### Question 3:
**Your dashboard page has a live-updating clock that makes your full-page screenshot test flaky. How should you handle this?**
a) Increase the `threshold` option to allow for large differences.
b) Take a screenshot of the `<body>` element instead of the `page`.
c) Use the `mask` option to "black out" the clock element during comparison.
d) Add a `page.waitForTimeout(5000)` before taking the screenshot.

**Answer:**
c) Use the `mask` option to "black out" the clock element during comparison. `await expect(page).toHaveScreenshot({ mask: [page.locator('#clock')] });` is the correct way to ignore dynamic parts of a page.

---

### Question 4:
**Why is it generally better to take screenshots of individual components/locators rather than the full page?**
a) It's faster to take smaller screenshots.
b) Full page screenshots are not supported on all browsers.
c) Component screenshots are more stable and less likely to fail from unrelated changes elsewhere on the page, making tests more focused and easier to maintain.
d) It uses less disk space.

**Answer:**
c) Component screenshots are more stable and less likely to fail from unrelated changes elsewhere on thepage, making tests more focused and easier to maintain. This isolates the visual test to a specific unit of the UI.