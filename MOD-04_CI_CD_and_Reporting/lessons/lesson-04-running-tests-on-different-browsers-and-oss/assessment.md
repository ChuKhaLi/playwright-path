# Lesson 4: Running Tests on Different Browsers and OSs - Assessment

## Knowledge Check

### Question 1
What is the primary purpose of using a matrix strategy in a CI/CD pipeline for testing?
- A) To run tests faster by using multiple machines.
- B) To run tests across various combinations of browsers, operating systems, and other configurations simultaneously.
- C) To simplify the CI/CD configuration file.
- D) To ensure all tests are run on a single, standardized environment.

**Answer: B**

### Question 2
In Playwright, how do you configure tests to run on Chromium, Firefox, and WebKit?
- A) By passing a command-line flag for each browser.
- B) By creating separate test files for each browser.
- C) By defining different projects in the `playwright.config.ts` file, each targeting a specific browser.
- D) By using a special `runOnAllBrowsers()` function in the test file.

**Answer: C**

### Question 3
Which of the following is a common challenge specific to testing on different operating systems?
- A) The test code syntax needs to be changed for each OS.
- B) File path formats (e.g., `\` vs. `/`) and font rendering can differ.
- C) Playwright does not support running on Linux.
- D) All browsers behave identically regardless of the OS.

**Answer: B**

## Practical Application

### Scenario
You are tasked with setting up a CI/CD pipeline for a new project. The project must support the latest versions of Chrome and Firefox on both Ubuntu and Windows.

### Task
Create a GitHub Actions workflow file (`.github/workflows/ci.yml`) that implements a matrix to test the required combinations. The workflow should:
1.  Run on `push` events to the `main` branch.
2.  Use a matrix to define the operating systems (`ubuntu-latest`, `windows-latest`) and browsers (`chromium`, `firefox`).
3.  Install Node.js and the project dependencies.
4.  Install the specified Playwright browsers.
5.  Run the Playwright tests for the corresponding browser project.
6.  Upload the test results as an artifact.

Provide the complete YAML configuration for this workflow.