# Lesson 10: Customizing Reports for Stakeholders - Assessment

## Knowledge Check

### Question 1
When creating a report for executive leadership, which of the following metrics is most important?
- A) Detailed stack traces for every failed test.
- B) A list of all test files that were executed.
- C) High-level KPIs such as overall pass rate, critical bug trends, and release readiness.
- D) The execution time of each individual test.

**Answer: C**

### Question 2
What is the primary goal of a developer-focused test report?
- A) To provide a simple pass/fail summary.
- B) To provide detailed, actionable information for debugging and fixing issues quickly.
- C) To showcase the total number of tests run.
- D) To hide implementation details from the development team.

**Answer: B**

### Question 3
Why is it important to tailor reports to different stakeholders?
- A) It is a requirement of the Playwright framework.
- B) To ensure that each stakeholder group receives the information they need in a format they can understand and act upon.
- C) To make the reports look more complicated.
- D) To increase the number of reports generated.

**Answer: B**

## Practical Application

### Scenario
Your team needs two types of reports: a high-level summary for the product manager and a detailed report for the development team.

### Task
1.  **Create a Custom Reporter**:
    -   Develop a custom Playwright reporter that generates two separate files upon test completion:
        1.  `summary-report.txt`: A simple text file for the product manager.
        2.  `detailed-report.json`: A JSON file with detailed failure information for developers.

2.  **Summary Report Content**:
    -   The `summary-report.txt` should contain:
        -   Total tests run.
        -   Number of passed tests.
        -   Number of failed tests.
        -   Overall pass percentage.

3.  **Detailed Report Content**:
    -   The `detailed-report.json` should be an array of objects, where each object represents a failed test and includes:
        -   `title`: The full title of the test.
        -   `file`: The path to the test file.
        -   `error`: The error message from the failure.

Provide the complete code for your custom reporter.