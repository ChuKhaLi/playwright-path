# Lesson 11: Troubleshooting CI/CD Failures - Assessment

## Knowledge Check

### Question 1
What is a common cause of an infrastructure-related CI/CD failure?
- A) A syntax error in a test script.
- B) A legitimate bug in the application code.
- C) Resource exhaustion (e.g., out of memory) on the CI runner.
- D) An incorrect assertion in a test case.

**Answer: C**

### Question 2
What is the primary purpose of a "circuit breaker" pattern in a CI/CD pipeline?
- A) To stop the pipeline if any test fails.
- B) To prevent repeated calls to a service that is known to be failing, avoiding further system strain.
- C) To enforce security policies.
- D) To speed up the test execution.

**Answer: B**

### Question 3
When troubleshooting a flaky test, which of the following is a good first step?
- A) Deleting the test immediately.
- B) Analyzing the test's execution history to identify patterns or correlations with specific environments.
- C) Rewriting the entire test from scratch.
- D) Ignoring the test until it fails consistently.

**Answer: B**

## Practical Application

### Scenario
You are responsible for maintaining a CI/CD pipeline that occasionally fails due to transient network issues when downloading dependencies. You need to make the pipeline more resilient to these temporary problems.

### Task
1.  **Identify the Problem**:
    -   You've noticed that the `npm install` step sometimes fails with an `ECONNRESET` error.

2.  **Implement a Retry Mechanism**:
    -   In your GitHub Actions workflow, modify the dependency installation step to automatically retry on failure.
    -   The step should be retried up to 3 times with a delay of 10 seconds between retries.

3.  **Provide the Solution**:
    -   Write the YAML code for the modified GitHub Actions step that implements this retry logic. You can use a shell command or a community action to achieve this.

Provide the YAML snippet for the resilient `npm install` step.