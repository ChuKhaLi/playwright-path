# Project 1: E2E Test Automation Framework

## 1. Overview

This project is a complete, end-to-end test automation framework for a fictional e-commerce website. It is built using Playwright and TypeScript, following industry best practices to create a solution that is scalable, maintainable, and robust.

## 2. Features

-   **Page Object Model (POM):** Clean separation of test logic from page interactions.
-   **TypeScript:** Strong typing for improved code quality and maintainability.
-   **GitHub Actions Integration:** Automated test execution on every push and pull request.
-   **HTML Reporting:** Detailed, interactive reports for easy analysis of test results.
-   **Data-Driven Testing:** Examples of running tests with multiple data sets.
-   **Authentication Handling:** Efficiently manages login state using `storageState`.

## 3. Tech Stack

-   **Test Runner:** [Playwright](https://playwright.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **CI/CD:** [GitHub Actions](https://github.com/features/actions)
-   **Package Manager:** [npm](https://www.npmjs.com/)

## 4. Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (version 16 or higher)
-   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd project-01-e2e-framework
    ```

2.  **Install dependencies:**
    ```bash
    npm ci
    ```

3.  **Install Playwright browsers:**
    ```bash
    npx playwright install --with-deps
    ```

## 5. Running the Tests

-   **Run all tests headlessly (default):**
    ```bash
    npx playwright test
    ```

-   **Run tests in headed mode:**
    ```bash
    npx playwright test --headed
    ```

-   **Run a specific test file:**
    ```bash
    npx playwright test tests/login.spec.ts
    ```

## 6. Reporting

After running the tests, an HTML report will be generated in the `playwright-report` directory.

To view the report, open it in your browser:

```bash
npx playwright show-report