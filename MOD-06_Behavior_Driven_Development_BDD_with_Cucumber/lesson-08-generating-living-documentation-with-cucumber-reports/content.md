# Lesson 8: Generating Living Documentation with Cucumber Reports

## 1. Introduction

Welcome to Lesson 8! One of the most significant advantages of BDD is the ability to create "living documentation"—reports that are automatically generated from your feature files and test results. This documentation is always up-to-date and serves as a single source of truth for both technical and non-technical stakeholders.

In this lesson, we'll learn how to generate beautiful, informative HTML reports from our Cucumber tests.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

- Understand the concept of living documentation.
- Configure Cucumber to generate JSON reports.
- Use a third-party tool to convert JSON reports into HTML.
- Customize the HTML report with metadata (e.g., browser, environment).
- Embed screenshots in the report for failed scenarios.
- Share and interpret the generated reports.

## 3. The Power of Living Documentation

Living documentation bridges the gap between development and business. Because it's generated from the same feature files that drive the tests, it provides an accurate, real-time view of the application's behavior.

### Benefits:

- **Single Source of Truth:** Eliminates discrepancies between documentation and actual application behavior.
- **Improved Collaboration:** Business analysts, developers, and testers can all refer to the same document.
- **Increased Transparency:** Provides clear visibility into the testing process and results.
- **Always Current:** The documentation is updated automatically every time the tests are run.

## 4. Generating a JSON Report

The first step to creating an HTML report is to configure Cucumber to output a JSON file containing the test results.

We can do this by adding the `--format json:path/to/report.json` option to our `cucumber-js` command in `package.json`.

```json
// package.json
"scripts": {
  "test": "cucumber-js --format json:reports/cucumber-report.json"
}
```

Now, when you run `npm test`, a `cucumber-report.json` file will be created in the `reports` directory.

## 5. Creating an HTML Report

The JSON report is not very human-readable. To convert it into a user-friendly HTML report, we'll use a popular open-source tool called `cucumber-html-reporter`.

### Installation:

```bash
npm install cucumber-html-reporter --save-dev
```

### Configuration:

Create a new file, `src/support/reporter.ts`, to configure the HTML reporter.

```typescript
// src/support/reporter.ts
import * as reporter from "cucumber-html-reporter";
import * as path from "path";

const options: reporter.Options = {
  theme: "bootstrap",
  jsonFile: path.join(__dirname, "../../reports/cucumber-report.json"),
  output: path.join(__dirname, "../../reports/cucumber-report.html"),
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "STAGING",
    Browser: "Chrome  108.0.5359.95",
    Platform: "Windows 10",
  },
};

reporter.generate(options);
```

We can then run this script after our tests have finished using an `&&` operator in our `package.json`.

```json
// package.json
"scripts": {
  "pretest": "rimraf reports",
  "test": "cucumber-js --format json:reports/cucumber-report.json",
  "posttest": "ts-node src/support/reporter.ts"
}
```

Now, after running `npm test`, an HTML report will be automatically generated and opened in your browser.

## 6. Adding Screenshots on Failure

One of the most useful features of these reports is the ability to automatically attach a screenshot of the application when a test fails.

We can achieve this using an `After` hook.

```typescript
// src/support/hooks.ts
import { After, ITestCaseHookParameter, Status } from "@cucumber/cucumber";
import { CustomWorld } from "./world";

After(async function (this: CustomWorld, { result }: ITestCaseHookParameter) {
  if (result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ path: `reports/screenshots/${pickle.name}.png`, fullPage: true });
    this.attach(screenshot, "image/png");
  }
});
```

The `cucumber-html-reporter` will automatically detect the attached screenshot and embed it in the report for the failed scenario.

## 7. Conclusion

Living documentation is a cornerstone of BDD. By generating rich, interactive HTML reports, we can provide valuable insights to the entire team and ensure that our documentation always reflects the reality of our application.

In the next lesson, we'll dive into some advanced Gherkin techniques for handling more complex scenarios.