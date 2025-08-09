/**
 * Exercise: Arrays and Tuples
 *
 * This exercise is designed to help you practice with arrays and tuples in TypeScript.
 * Your goal is to correctly annotate the variables below with the appropriate types.
 *
 * Follow the instructions in the comments for each variable.
 */

// 1. Declare an array named 'testScores' that can only hold numbers.
//    Add the correct type annotation and initialize it with a few scores.
const testScores = [85, 92, 78, 95];

// 2. Declare an array named 'browsers' that can only hold strings.
//    Add the correct type annotation and initialize it with a list of browser names.
const browsers = ["Chrome", "Firefox", "Safari", "Edge"];

// 3. Declare a tuple named 'testRun' that represents a single test execution.
//    It should have the following structure:
//    - A string for the test name.
//    - A number for the duration in milliseconds.
//    - A boolean indicating if the test passed.
//
//    Add the correct type annotation and initialize it with sample data.
const testRun = ["Login Test", 1200, true];

// 4. Create a function named 'getHighScores' that takes an array of numbers ('scores')
//    and a 'threshold' number as parameters. The function should return a new array
//    containing only the scores that are above the threshold.
//    Add the correct type annotations for the parameters and the return type.
function getHighScores(scores, threshold) {
  return scores.filter(score => score > threshold);
}

// 5. Create a function named 'formatTestRun' that takes a tuple with the same structure
//    as 'testRun' as its parameter. The function should return a formatted string.
//    For example: "Test: Login Test, Duration: 1200ms, Passed: true"
//    Add the correct type annotation for the parameter and the return type.
function formatTestRun(run) {
  const [name, duration, passed] = run;
  return `Test: ${name}, Duration: ${duration}ms, Passed: ${passed}`;
}

// 6. Call your functions with the variables you created and log the results.
console.log("High Scores:", getHighScores(testScores, 90));
console.log(formatTestRun(testRun));