/**
 * Solution: Function Types and Signatures
 *
 * This file contains the solution to the 'Function Types and Signatures' exercise.
 */

// 1. 'logTestName' takes a string and returns nothing, so its return type is 'void'.
function logTestName(testName: string): void {
  console.log(`Running test: ${testName}`);
}

// 2. 'getTestResult' takes a number and returns an object with a specific shape.
//    We define the return type as an object with 'id' (number) and 'status' (string).
function getTestResult(testId: number): { id: number; status: string } {
  // In a real scenario, this would fetch data from a database or API.
  return {
    id: testId,
    status: "Passed"
  };
}

// 3. 'isTestCritical' takes a string and returns a boolean.
function isTestCritical(testName: string): boolean {
  return testName.includes("Critical");
}

// 4. 'TestExecutor' is a type alias for a function. It defines the expected
//    parameters and their types, including the callback function's signature.
type TestExecutor = (testName: string, callback: () => void) => void;

// 'runTest' is an implementation of the 'TestExecutor' type.
// By assigning the type to the variable, TypeScript ensures it matches the signature.
const runTest: TestExecutor = (testName, callback) => {
  console.log(`Executing test: ${testName}`);
  callback();
};

// 5. Calling the functions with the correct arguments.
logTestName("Login Functionality");

const result = getTestResult(101);
console.log(`Test Result: ID=${result.id}, Status=${result.status}`);

const critical = isTestCritical("Critical: Checkout Flow");
console.log(`Is test critical? ${critical}`);

runTest("API Health Check", () => {
  console.log("Callback executed!");
});