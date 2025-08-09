# Exercise 1: Creating a Simple Stakeholder Report

## Objective
In this exercise, you will create a basic custom reporter to generate a simple text-based summary report suitable for a non-technical stakeholder.

## Instructions

### Step 1: Create the Custom Reporter File
1.  Create a new directory named `reporters` in your project's root.
2.  Inside the `reporters` directory, create a file named `summary-reporter.ts`.

### Step 2: Implement the Custom Reporter
1.  Open `reporters/summary-reporter.ts` and add the following code. This reporter will collect basic statistics and write them to a file.

    ```typescript
    import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
    import * as fs from 'fs';

    class SummaryReporter implements Reporter {
      private passed = 0;
      private failed = 0;
      private total = 0;

      onTestEnd(test: TestCase, result: TestResult) {
        this.total++;
        if (result.status === 'passed') {
          this.passed++;
        } else if (result.status === 'failed') {
          this.failed++;
        }
      }

      onEnd(result: FullResult) {
        const summary = `
    Test Execution Summary
    ======================
    Total Tests: ${this.total}
    Passed: ${this.passed}
    Failed: ${this.failed}
    Pass Rate: ${((this.passed / this.total) * 100).toFixed(2)}%
    `;

        fs.writeFileSync('summary-report.txt', summary);
        console.log(summary);
      }
    }

    export default SummaryReporter;
    ```

### Step 3: Configure the Custom Reporter
1.  Open your `playwright.config.ts` file.
2.  Add your new custom reporter to the `reporter` array.

    ```typescript
    // playwright.config.ts
    import { defineConfig } from '@playwright/test';

    export default defineConfig({
      reporter: [
        ['list'], // You can keep other reporters
        ['./reporters/summary-reporter.ts'],
      ],
    });
    ```

### Step 4: Run Tests and Verify the Report
1.  Run your tests from the terminal:
    ```bash
    npx playwright test
    ```
2.  After the test run is complete, look for a new file named `summary-report.txt` in your project's root directory.
3.  Open the file and verify that it contains the correct summary of your test run.

## Success Criteria
- You have successfully created and configured a custom reporter.
- A `summary-report.txt` file is generated after the test run.
- The report contains the correct total, passed, failed, and pass rate metrics.