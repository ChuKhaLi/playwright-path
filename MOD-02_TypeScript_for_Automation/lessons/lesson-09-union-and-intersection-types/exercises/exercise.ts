/**
 * Exercise: Union and Intersection Types
 *
 * This exercise is designed to help you practice with union and intersection types in TypeScript.
 * Your goal is to correctly use these types to create flexible and composite data structures.
 *
 * Follow the instructions in the comments for each section.
 */

// 1. Union Types:
//    - Define a type alias named 'TestResultStatus' that can be one of the following strings:
//      'Passed', 'Failed', 'Skipped', or 'Pending'.
//    - Declare a variable named 'currentStatus' and annotate it with 'TestResultStatus'.
//    - Create a function named 'logStatus' that takes a 'status' of type 'TestResultStatus'
//      and prints it to the console.

// Define the type alias here

// Declare the variable here

// Implement the function here

// 2. Intersection Types:
//    - Define two type aliases:
//      - 'TimingInfo': An object with 'startTime' (number) and 'endTime' (number).
//      - 'TestDetails': An object with 'testName' (string) and 'browser' (string).
//    - Create a new type alias named 'FullTestReport' by intersecting 'TimingInfo' and 'TestDetails'.
//    - Declare a variable named 'testReport' and annotate it with 'FullTestReport'.
//      Initialize it with appropriate data.

// Define 'TimingInfo' here

// Define 'TestDetails' here

// Define 'FullTestReport' here

// Declare and initialize 'testReport' here

// 3. Function with Union and Intersection Types:
//    - Create a function named 'processReport' that takes a 'report' of type 'FullTestReport'
//      and a 'status' of type 'TestResultStatus'.
//    - The function should return a formatted string summarizing the report.
//      For example: "Test 'Login Test' on 'Chrome' finished in 500ms with status: Passed"
//    - Calculate the duration inside the function (endTime - startTime).

// Implement the function here

// 4. Call your functions and log the results to verify your work.
// logStatus(currentStatus);
// const summary = processReport(testReport, 'Passed');
// console.log(summary);