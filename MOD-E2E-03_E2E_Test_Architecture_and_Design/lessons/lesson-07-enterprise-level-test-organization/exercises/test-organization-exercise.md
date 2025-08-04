# Exercise: Organizing an Enterprise Test Suite

## Objective

To practice designing an organizational structure for a large test suite, including tagging, directory structure, and code ownership.

## Scenario

You are the lead QA Architect for a large financial application. The application has three main domains, each managed by a different team:
-   **Accounts Team:** Manages user accounts, balances, and statements.
-   **Transfers Team:** Manages internal and external money transfers.
-   **Investments Team:** Manages stock and bond trading features.

You have been tasked with designing the structure for the E2E test suite.

## Your Task

### 1. Design the Directory Structure

-   Create a markdown tree structure for the `tests/` and `pages/` directories.
-   The structure should be organized by team.
-   Each team's directory should have subdirectories for `api/` and `e2e/` tests.

### 2. Create a Tagging Strategy

-   Define a tagging strategy for the test suite. Your strategy should include tags for:
    -   Test Type (e.g., smoke, regression)
    -   Priority (e.g., p1, p2)
    -   Feature/Team (e.g., auth, transfers)
-   Provide an example of a test title for each of the following scenarios, including all appropriate tags:
    -   A critical smoke test for viewing an account balance.
    -   A medium-priority regression test for a failed transfer.
    -   A high-priority E2E test for buying a stock.

### 3. Create a `CODEOWNERS` File

-   Write the contents of a `.github/CODEOWNERS` file.
-   The file should assign ownership for each team's `tests/` and `pages/` directories.
-   Assume the following team names in GitHub: `@MyFinApp/accounts-team`, `@MyFinApp/transfers-team`, `@MyFinApp/investments-team`.
-   Also, assign ownership of a shared `/framework/` directory to a central `@MyFinApp/qa-platform-team`.

### 4. Define Test Execution Commands

-   Write the `npx playwright test` command (including `--grep` and/or `--grep-invert` flags) for each of the following test runs:
    -   Run all `@smoke` tests for the **Transfers Team**.
    -   Run all `@p1` regression tests across all teams.
    -   Run all tests **except** those belonging to the **Investments Team**.
    -   Run all `@smoke` tests that are also marked as `@p1`.

## Submission

Submit a single markdown file containing your answers to all four parts of the task. This exercise will demonstrate your ability to think strategically about how to manage a large and complex test suite in a collaborative, enterprise environment.