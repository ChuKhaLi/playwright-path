/**
 * Solution: Object Types and Annotations
 *
 * This file contains the solution to the 'Object Types and Annotations' exercise.
 */

// 1. A type alias is created for the test result object for reusability and cleaner code.
type TestResult = {
 testName: string;
 duration: number;
 passed: boolean;
 details: {
   retries: number;
   browser: string;
 };
};

const testResult: TestResult = {
  testName: "Login Page Validation",
  duration: 45.6,
  passed: true,
  details: {
    retries: 1,
    browser: "Chrome"
  }
};

// 2. The following lines demonstrate the type safety of the annotated object.
//    Uncomment them to see the TypeScript compiler errors.

// testResult.testName = 123; // Error: Type 'number' is not assignable to type 'string'.
// testResult.passed = "yes"; // Error: Type 'string' is not assignable to type 'boolean'.
// console.log(testResult.reporter); // Error: Property 'reporter' does not exist on type '{...}'.

// 3. The 'printTestResult' function's parameter is annotated with the 'TestResult' type alias.
//    This makes the function signature cleaner and more readable.
function printTestResult(result: TestResult) {
  console.log(`Test: ${result.testName}, Passed: ${result.passed}`);
}

// 4. The function is called with the correctly typed 'testResult' object.
printTestResult(testResult);