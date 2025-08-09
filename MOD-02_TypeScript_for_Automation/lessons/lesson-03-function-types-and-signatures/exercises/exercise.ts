/**
 * Exercise: Function Types and Signatures
 *
 * This exercise is designed to help you practice with function types and signatures in TypeScript.
 * Your goal is to correctly annotate the functions below with the appropriate types.
 *
 * Follow the instructions in the comments for each function.
 */

// 1. Create a function named 'logTestName' that takes a 'testName' (string) as a parameter.
//    The function should not return any value.
//    Add the correct type annotations for the parameter and the return type.
function logTestName(testName) {
  console.log(`Running test: ${testName}`);
}

// 2. Create a function named 'getTestResult' that takes a 'testId' (number) as a parameter.
//    The function should return an object with 'id' (number) and 'status' (string).
//    Add the correct type annotations for the parameter and the return type.
function getTestResult(testId) {
  // In a real scenario, this would fetch data from a database or API.
  return {
    id: testId,
    status: "Passed"
  };
}

// 3. Create a function named 'isTestCritical' that takes a 'testName' (string) as a parameter.
//    The function should return a boolean value.
//    Add the correct type annotations for the parameter and the return type.
function isTestCritical(testName) {
  return testName.includes("Critical");
}

// 4. Define a function type alias named 'TestExecutor' for a function that takes a 'testName' (string)
//    and a 'callback' function as parameters. The callback function should take no arguments and
//    return void. The 'TestExecutor' function itself should not return any value.
//
//    Then, create a function named 'runTest' that implements the 'TestExecutor' type.
//    The function should log the test name and then execute the callback.

// Define the type alias here

// Implement the 'runTest' function here
const runTest = (testName, callback) => {
  console.log(`Executing test: ${testName}`);
  callback();
};

// 5. Call your functions with appropriate arguments to see them in action.
logTestName("Login Functionality");
const result = getTestResult(101);
console.log(`Test Result: ID=${result.id}, Status=${result.status}`);
const critical = isTestCritical("Critical: Checkout Flow");
console.log(`Is test critical? ${critical}`);
runTest("API Health Check", () => {
  console.log("Callback executed!");
});