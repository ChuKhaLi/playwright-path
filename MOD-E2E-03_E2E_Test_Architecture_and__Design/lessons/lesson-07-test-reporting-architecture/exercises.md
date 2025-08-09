# Exercises: Test Reporting Architecture

## Exercise 1: Configure the HTML Reporter

**Objective:** Configure the Playwright HTML reporter to meet your team's needs.

**Instructions:**
1. Open your `playwright.config.ts` file.
2. Configure the `html` reporter to:
   - Always be generated (don't open it automatically).
   - Be placed in a directory called `test-reports/html`.

## Exercise 2: Integrate with Allure

**Objective:** Integrate your project with the Allure reporting framework.

**Instructions:**
1. Install the `allure-playwright` adapter.
2. Configure your `playwright.config.ts` to use the Allure reporter.
3. Run your tests.
4. Generate and open the Allure report.
5. Explore the features of the Allure report.

## Exercise 3: Add Custom Metadata to Your Report

**Objective:** Add custom annotations to your tests that will appear in the report.

**Instructions:**
1. Choose a test in your suite.
2. Add the following annotations to it:
   - A link to a (fake) JIRA ticket.
   - The owner of the test.
   - The severity of the test (e.g., 'critical').
3. Run your tests and verify that this metadata appears in your Allure report.