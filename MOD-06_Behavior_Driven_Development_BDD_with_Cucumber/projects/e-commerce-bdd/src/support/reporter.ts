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
    Browser: "Chrome",
    Platform: "Windows 10",
  },
};

reporter.generate(options);