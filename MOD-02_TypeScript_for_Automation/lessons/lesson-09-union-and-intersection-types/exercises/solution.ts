/**
 * Solution: Union and Intersection Types
 *
 * This file contains the solution to the 'Union and Intersection Types' exercise.
 */

// 1. Union Types:
//    'TestResultStatus' is a union type that restricts the variable to a specific set of strings.
type TestResultStatus = 'Passed' | 'Failed' | 'Skipped' | 'Pending';

// 'currentStatus' is annotated with the union type, ensuring it can only be one of the allowed values.
const currentStatus: TestResultStatus = 'Passed';

// The function 'logStatus' accepts only arguments of type 'TestResultStatus'.
function logStatus(status: TestResultStatus): void {
  console.log(`Current test status: ${status}`);
}

// 2. Intersection Types:
//    'TimingInfo' and 'TestDetails' define two separate object structures.
type TimingInfo = {
  startTime: number; // Typically a timestamp, e.g., Date.now()
  endTime: number;
};

type TestDetails = {
  testName: string;
  browser: string;
};

// 'FullTestReport' is an intersection type that combines all properties from
// 'TimingInfo' and 'TestDetails' into a single, composite type.
type FullTestReport = TimingInfo & TestDetails;

// 'testReport' must include all properties from both intersected types.
const testReport: FullTestReport = {
  startTime: Date.now() - 500,
  endTime: Date.now(),
  testName: "Login Test",
  browser: "Chrome"
};

// 3. Function with Union and Intersection Types:
//    'processReport' takes the composite 'FullTestReport' and the union 'TestResultStatus'.
function processReport(report: FullTestReport, status: TestResultStatus): string {
  const duration = report.endTime - report.startTime;
  return `Test '${report.testName}' on '${report.browser}' finished in ${duration}ms with status: ${status}`;
}

// 4. Calling the functions to verify the implementation.
logStatus(currentStatus);
const summary = processReport(testReport, 'Passed');
console.log(summary);

// Verification:
// The following lines would cause TypeScript errors if uncommented.
// const invalidStatus: TestResultStatus = 'Error'; // Error: Type '"Error"' is not assignable to type 'TestResultStatus'.
// const incompleteReport: FullTestReport = { startTime: 0, testName: "Test" }; // Error: Property 'endTime' and 'browser' are missing.