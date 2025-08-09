# Lesson 9: Integrating with Third-Party Reporting Tools - Assessment

## Knowledge Check

### Question 1
What is the main benefit of using a tool like Allure for test reporting?
- A) It runs tests faster than the default Playwright reporter.
- B) It provides a rich, interactive report with features like trends, history, and detailed annotations.
- C) It is the only way to see test results in a CI/CD environment.
- D) It automatically fixes failing tests.

**Answer: B**

### Question 2
How do you typically associate a Playwright test with a TestRail case when using a custom reporter?
- A) By using a special function call inside the test.
- B) By including the TestRail case ID (e.g., `C12345`) in the test title.
- C) By configuring it in the `playwright.config.ts` file.
- D) It is not possible to link Playwright tests to TestRail.

**Answer: B**

### Question 3
In a CI/CD pipeline with multiple test jobs (e.g., for different OSs), what is the correct approach to generate a single, unified Allure report?
- A) Run the `allure generate` command in each job.
- B) Upload the `allure-results` from each job as artifacts, then download them all into a single directory in a final job and run `allure generate`.
- C) Allure automatically merges reports from different jobs.
- D) It is not possible to merge reports from different jobs.

**Answer: B**

## Practical Application

### Scenario
You need to integrate your Playwright test suite with the Allure framework to provide more detailed reports for your team.

### Task
1.  **Install and Configure Allure**:
    -   Add the `allure-playwright` dependency to your project.
    -   Configure the `allure-playwright` reporter in your `playwright.config.ts`.

2.  **Annotate a Test**:
    -   Choose one of your existing tests.
    -   Add the following Allure annotations to it:
        -   A description.
        -   A severity level of `critical`.
        -   At least two tags.
        -   A feature and a story.
        -   At least two steps (`allure.step`).

3.  **Generate the Report**:
    -   Provide the sequence of commands required to run the tests, generate the Allure report, and open it.

Provide the updated `playwright.config.ts` configuration, the annotated test code, and the list of commands.