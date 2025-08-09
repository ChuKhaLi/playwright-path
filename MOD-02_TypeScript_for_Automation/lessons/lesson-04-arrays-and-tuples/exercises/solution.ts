/**
 * Solution: Arrays and Tuples
 *
 * This file contains the solution to the 'Arrays and Tuples' exercise.
 */

// 1. 'testScores' is an array of numbers, so its type is 'number[]'.
const testScores: number[] = [85, 92, 78, 95];

// 2. 'browsers' is an array of strings, so its type is 'string[]'.
const browsers: string[] = ["Chrome", "Firefox", "Safari", "Edge"];

// 3. 'testRun' is a tuple with a fixed structure: a string, a number, and a boolean.
//    The type is defined as '[string, number, boolean]'.
const testRun: [string, number, boolean] = ["Login Test", 1200, true];

// 4. 'getHighScores' takes an array of numbers and a number, and returns an array of numbers.
function getHighScores(scores: number[], threshold: number): number[] {
  return scores.filter(score => score > threshold);
}

// 5. 'formatTestRun' takes a tuple with the defined structure and returns a string.
function formatTestRun(run: [string, number, boolean]): string {
  const [name, duration, passed] = run;
  return `Test: ${name}, Duration: ${duration}ms, Passed: ${passed}`;
}

// 6. Calling the functions with the correctly typed variables.
console.log("High Scores:", getHighScores(testScores, 90));
console.log(formatTestRun(testRun));

/**
 * Verification
 *
 * The following lines demonstrate the type safety of arrays and tuples.
 * Uncomment them to see the TypeScript compiler errors.
 */

// testScores.push("a"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
// const invalidRun: [string, number, boolean] = ["Test", 1500, "true"]; // Error: Type 'string' is not assignable to type 'boolean'.