/**
 * Solution: Object Types and Annotations
 *
 * This file contains the solution to the 'Object Types and Annotations' exercise.
 */

// 1. The 'testResult' object is annotated with a detailed object type.
//    This ensures that the object always has the correct shape and property types.
const testResult: {
  testName: string;
  duration: number;
  passed: boolean;
  details: {
    retries: number;
    browser: string;
  };
} = {
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

// 3. The 'printTestResult' function's parameter is annotated with the same object type.
//    This ensures that any object passed to the function has the required properties.
function printTestResult(result: {
  testName: string;
  duration: number;
  passed: boolean;
  details: {
    retries: number;
    browser: string;
  };
}) {
  console.log(`Test: ${result.testName}, Passed: ${result.passed}`);
}

// 4. The function is called with the correctly typed 'testResult' object.
printTestResult(testResult);