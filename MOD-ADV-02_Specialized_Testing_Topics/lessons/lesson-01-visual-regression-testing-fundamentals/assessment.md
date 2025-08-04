# Lesson 1: Assessment

## Knowledge Check

Test your understanding of the fundamental concepts of Visual Regression Testing.

### Question 1

What is the primary purpose of Visual Regression Testing?

a) To verify that a feature's business logic is correct.
b) To ensure the application performs well under load.
c) To detect unintended visual changes in the UI.
d) To check for security vulnerabilities.

**Answer:** c) To detect unintended visual changes in the UI.

### Question 2

Which Playwright command is used to perform a visual comparison?

a) `await expect(page).toHaveText()`
b) `await expect(page).toBeVisible()`
c) `await expect(page).toHaveScreenshot()`
d) `await page.screenshot()`

**Answer:** c) `await expect(page).toHaveScreenshot()`

### Question 3

What happens the very first time you run a test with `toHaveScreenshot()`?

a) The test passes automatically.
b) The test fails because no baseline screenshot exists.
c) The test is skipped.
d) The test prompts you to manually approve the screenshot.

**Answer:** b) The test fails because no baseline screenshot exists.

### Question 4

How do you update the baseline screenshots in Playwright if a UI change is intentional?

a) Manually delete the old screenshots.
b) Run the test with the `--update-snapshots` flag.
c) Edit the screenshot image in a photo editor.
d) There is no way to update baselines.

**Answer:** b) Run the test with the `--update-snapshots` flag.

### Question 5

In `playwright.config.ts`, what does the `maxDiffPixels` option do?

a) It sets the maximum resolution for screenshots.
b) It defines the maximum number of screenshots to keep.
c) It specifies an acceptable threshold for pixel differences between screenshots.
d) It limits the file size of the screenshot.

**Answer:** c) It specifies an acceptable threshold for pixel differences between screenshots.