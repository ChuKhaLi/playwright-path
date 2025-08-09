/**
 * Exercise: Object Types and Annotations
 *
 * This exercise is designed to help you practice with object types and annotations in TypeScript.
 * Your goal is to correctly annotate the object below with the appropriate types.
 *
 * Follow the instructions in the comments for the object.
 */

// 1. Define the structure of a 'testResult' object. It should have the following properties:
//    - testName: a string
//    - duration: a number
//    - passed: a boolean
//    - details: an object with 'retries' (number) and 'browser' (string)
//
//    Add the correct type annotation directly to the 'testResult' object.

const testResult = {
  testName: "Login Page Validation",
  duration: 45.6,
  passed: true,
  details: {
    retries: 1,
    browser: "Chrome"
  }
};

// 2. After annotating 'testResult', try to perform the following actions and observe the errors:
//    - Assign a number to 'testResult.testName'.
//    - Assign a string to 'testResult.passed'.
//    - Access a non-existent property, like 'testResult.reporter'.

// 3. Create a function called 'printTestResult' that takes an object with the same structure
//    as 'testResult' as its parameter. The function should print the test name and whether it passed.
//    Add the correct type annotation for the parameter.

function printTestResult(result) {
  console.log(`Test: ${result.testName}, Passed: ${result.passed}`);
}

// 4. Call the 'printTestResult' function with the 'testResult' object.
printTestResult(testResult);