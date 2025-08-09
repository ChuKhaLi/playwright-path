/**
 * Solution: Basic Types
 *
 * This file contains the solution to the 'Basic Types' exercise.
 * Each variable is correctly annotated with its TypeScript type.
 */

// 1. 'testName' is a string, so it is annotated with 'string'.
let testName: string = "Sample Test Case";

// 2. 'numberOfTests' is a number, so it is annotated with 'number'.
let numberOfTests: number = 50;

// 3. 'isTestPassing' is a boolean, so it is annotated with 'boolean'.
let isTestPassing: boolean = true;

// 4. 'averageTime' is a number (floating-point), so it is annotated with 'number'.
let averageTime: number = 15.7;

// 5. 'testDescription' is a string, so it is annotated with 'string'.
let testDescription: string = `
  This test validates the login functionality
  with a valid username and password.
`;

/**
 * Verification
 *
 * The following lines demonstrate that assigning a value of the wrong type
 * will cause a TypeScript error. If you uncomment these lines in a TypeScript
 * environment, you will see the compiler errors.
 */

// testName = 123; // Error: Type 'number' is not assignable to type 'string'.
// numberOfTests = "fifty"; // Error: Type 'string' is not assignable to type 'number'.
// isTestPassing = "yes"; // Error: Type 'string' is not assignable to type 'boolean'.