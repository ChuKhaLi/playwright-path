# Exercise: Designing a Continuous Testing Pipeline

## Objective

To design a comprehensive, multi-stage CI/CD pipeline for a project using GitHub Actions, incorporating different testing strategies and optimization techniques.

## Scenario

You are the QA Architect for a project with the following test suites, categorized by tags:
-   `@api`: A large suite of fast API tests.
-   `@smoke`: A small suite of critical-path E2E tests.
-   `@regression`: The full suite of E2E tests.
-   `@visual`: A suite of visual regression tests that are slow and run on multiple browsers.

## Your Task

Design a GitHub Actions workflow file (`ci-pipeline.yml`) that implements the following logic. You don't need to write the full `steps` for each job, just the job definitions, `if` conditions, `needs` dependencies, and the final `run` command for the tests.

### Pipeline Requirements:

1.  **Trigger Conditions:**
    -   The pipeline should run on every `pull_request` to the `main` branch.
    -   The pipeline should run on every `push` to the `main` branch.
    -   The pipeline should also be runnable on a schedule (e.g., every night at midnight UTC) using `schedule` and `cron`.

2.  **Job 1: `lint-and-build`**
    -   This job should always run.
    -   It should have no dependencies.

3.  **Job 2: `api-tests`**
    -   This job should always run.
    -   It must wait for `lint-and-build` to complete successfully.
    -   It should run only the `@api` tests.

4.  **Job 3: `e2e-smoke-tests`**
    -   This job should **only** run on `pull_request` events.
    -   It must wait for `api-tests` to complete successfully.
    -   It should run only the `@smoke` tests.

5.  **Job 4: `e2e-regression-suite`**
    -   This job should **only** run on `push` events to the `main` branch.
    -   It must wait for `api-tests` to complete successfully.
    -   It should run the `@regression` tests.
    -   It must be **sharded across 5 parallel jobs**.

6.  **Job 5: `visual-regression-suite`**
    -   This job should **only** run on the nightly schedule.
    -   It must wait for `api-tests` to complete successfully.
    -   It should run the `@visual` tests.
    -   It should run on a matrix of 3 different browsers: `chromium`, `firefox`, and `webkit`.

7.  **Job 6: `notify-on-failure`**
    -   This job should **only** run if any of the previous jobs have failed.
    -   It should run on all event types.
    -   It should have a dependency on all the test jobs (`api-tests`, `e2e-smoke-tests`, `e2e-regression-suite`, `visual-regression-suite`).
    -   Use the appropriate `if` condition to check for failure.

## Submission

Submit a single `ci-pipeline.yml` file containing your solution. This exercise will test your ability to translate complex testing requirements into a logical and efficient CI/CD pipeline architecture.