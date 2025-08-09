# Project 1: Comprehensive CI/CD Pipeline

## Objective
Build a full-featured CI/CD pipeline for a sample web application using GitHub Actions. This project will integrate many of the concepts learned throughout Module 4.

## Requirements

### 1. Source Code
-   A sample web application will be provided. Your task is to build the pipeline for it.

### 2. Pipeline Features
-   **Trigger**: The pipeline should run on `push` events to the `main` branch and on `pull_request` events targeting `main`.
-   **Linting and Static Analysis**: Include a job to run a linter (e.g., ESLint) to check code quality.
-   **Testing**:
    -   Run tests in parallel across multiple browsers (Chromium, Firefox) and operating systems (Ubuntu, Windows).
    -   Use a matrix strategy to manage the combinations.
    -   Implement sharding to split the test suite and run it faster.
-   **Caching**: Cache `node_modules` to speed up dependency installation.
-   **Reporting**:
    -   Integrate the Allure reporter.
    -   Generate the Allure report and upload it as an artifact.
    -   Merge reports from all test jobs into a single, unified report.
-   **Notifications**: Send a notification to a Slack channel with the build status (success or failure).
-   **Deployment**:
    -   Include a job to deploy the application to a staging environment.
    -   This job should only run if all previous jobs (linting, testing) are successful and the event is a `push` to the `main` branch.

## Getting Started
1.  Fork the provided sample application repository.
2.  Create a new GitHub Actions workflow file in `.github/workflows/`.
3.  Implement the pipeline according to the requirements.
4.  You will need to create a Slack webhook URL and add it as a secret to your repository.

## Success Criteria
-   A complete, functioning CI/CD pipeline that meets all the specified requirements.
-   The pipeline is efficient, resilient, and provides clear reporting.
-   All jobs run as expected, and artifacts are correctly generated and stored.