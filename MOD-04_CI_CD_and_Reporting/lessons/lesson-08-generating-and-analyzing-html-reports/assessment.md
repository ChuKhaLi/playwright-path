# Lesson 8: Generating and Analyzing HTML Reports - Assessment

## Knowledge Check

### Question 1
How do you configure Playwright to always open the HTML report after a test run?
- A) By setting `open: 'always'` in the HTML reporter options in `playwright.config.ts`.
- B) By running `npx playwright show-report` after every test execution.
- C) By adding a special comment to your test files.
- D) This feature is not available in Playwright.

**Answer: A**

### Question 2
What is the purpose of the `trace: 'on-first-retry'` option in `playwright.config.ts`?
- A) It records a trace for every test run.
- B) It records a trace only for tests that fail and are retried.
- C) It disables tracing for all tests.
- D) It only records traces for tests that pass.

**Answer: B**

### Question 3
Which of the following is a key benefit of using a custom-themed HTML report?
- A) It makes the tests run faster.
- B) It allows you to align the report's appearance with your company's branding and improve readability for stakeholders.
- C) It is the only way to see test results.
- D) It automatically fixes failing tests.

**Answer: B**

## Practical Application

### Scenario
You are working on a project and need to enhance the test reporting to provide more value to your team. You want to customize the HTML report and automatically analyze the results.

### Task
1.  **Customize the HTML Reporter:**
    -   Modify your `playwright.config.ts` to configure the HTML reporter.
    -   Set the `outputFolder` to a custom directory, e.g., `playwright-report/`.
    -   Ensure the report is only opened automatically when a test fails (`on-failure`).
    -   Include screenshots and videos only for failing tests.

2.  **Analyze the Report:**
    -   After running your tests, you find the `test-results.json` file inside the report's `data` directory.
    -   Write a short Node.js script that reads this JSON file and prints the following summary to the console:
        -   Total number of tests.
        -   Number of passed tests.
        -   Number of failed tests.
        -   A list of the titles of all failed tests.

Provide the updated `playwright.config.ts` configuration for the reporter and the Node.js script for analyzing the results.