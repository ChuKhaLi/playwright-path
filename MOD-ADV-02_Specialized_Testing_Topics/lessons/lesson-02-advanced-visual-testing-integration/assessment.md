# Lesson 2: Assessment

## Knowledge Check

Test your understanding of advanced visual testing techniques.

### Question 1

How can you prevent a visual test from failing due to dynamic content like a timestamp?

a) By deleting the dynamic element from the DOM before taking a screenshot.
b) By using the `mask` option in `toHaveScreenshot()` to cover the element.
c) By setting a high `maxDiffPixels` threshold to ignore the changes.
d) By running the test only when the dynamic content is not present.

**Answer:** b) By using the `mask` option in `toHaveScreenshot()` to cover the element.

### Question 2

How does Playwright handle screenshots when you have multiple projects defined in `playwright.config.ts` (e.g., for different browsers)?

a) It saves all screenshots in a single file, overwriting them for each project.
b) It generates separate, uniquely named screenshot files for each project.
c) It prompts you to choose which project's screenshot to save.
d) It does not support visual testing with multiple projects.

**Answer:** b) It generates separate, uniquely named screenshot files for each project.

### Question 3

What is the recommended workflow for updating baseline screenshots in a CI/CD environment?

a) Automatically run `npx playwright test --update-snapshots` in the CI pipeline.
b) Manually download the failed diff, approve it, and upload it back to CI.
c) Review the failure in CI, then run `--update-snapshots` locally and commit the new baselines.
d) Disable visual tests in CI and only run them locally.

**Answer:** c) Review the failure in CI, then run `--update-snapshots` locally and commit the new baselines.

### Question 4

Which of the following is a best practice for organizing a large visual test suite?

a) Using generic screenshot names like `image1.png`, `image2.png`.
b) Putting all visual tests into a single, large test file.
c) Grouping related tests with `test.describe()` and using descriptive screenshot names.
d) Avoiding component-based tests to keep the suite simple.

**Answer:** c) Grouping related tests with `test.describe()` and using descriptive screenshot names.

### Question 5

How can you access the results of a failed visual test in a CI environment like GitHub Actions?

a) The results are automatically posted as a comment on the pull request.
b) You have to SSH into the CI runner to view the files.
c) By configuring the CI job to upload the `playwright-report` directory as a build artifact.
d) The results are only available in the CI logs.

**Answer:** c) By configuring the CI job to upload the `playwright-report` directory as a build artifact.