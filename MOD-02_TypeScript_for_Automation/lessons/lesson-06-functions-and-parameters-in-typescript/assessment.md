# Lesson 4 Assessment: Functions and Parameters in TypeScript

## Multiple Choice Questions

1.  **What is the correct syntax for specifying the type of a function parameter?**
    a)  `function myFunc(parameter type): string`
    b)  `function myFunc(type parameter): string`
    c)  `function myFunc(parameter: type): string`
    d)  `function myFunc(parameter): type string`

2.  **What does the `void` return type signify?**
    a)  The function returns a null or undefined value.
    b)  The function returns a value of any type.
    c)  The function performs an action but does not return any value.
    d)  The function has an error and returns nothing.

3.  **Why is it a best practice to always add an explicit return type to a function, even if TypeScript can infer it?**
    a)  The code will not compile without it.
    b)  It improves runtime performance.
    c)  It makes the function's purpose clearer and helps catch internal errors.
    d)  It is required for using `async/await`.

4.  **Which of the following function definitions contains an error?**
    a)  `function greet(name: string): void { console.log(name); }`
    b)  `function add(a: number, b: number): number { return a + b; }`
    c)  `function isPositive(num: number): boolean { return num > 0; }`
    d)  `function getStatus(): string { return true; }`

5.  **In test automation, what is a common use for a function that returns `void`?**
    a)  A function that gets the title of the current page.
    b)  A function that checks if an element is visible.
    c)  A function that clicks on a button.
    d)  A function that returns the number of items in a list.

## Practical Exercise

1.  **Create a Test Helper Function:**
    -   Write a function named `isTestPassed`.
    -   This function should accept one parameter: `testStatus`, which is a `string`.
    -   The function should return a `boolean` value.
    -   Inside the function, if `testStatus` is exactly equal to the string `"Passed"`, it should return `true`. Otherwise, it should return `false`.

2.  **Create a Logging Function:**
    -   Write a function named `printTestResult`.
    -   This function should accept two parameters:
        -   `testCaseName` (a `string`).
        -   `isPassed` (a `boolean`).
    -   This function should not return any value. Make sure to specify its return type correctly.
    -   Inside the function, use `console.log` to print a formatted message, for example: `Test Case 'Login Test': Passed` or `Test Case 'Login Test': Failed`.

3.  **Use the Functions:**
    -   Declare a variable `loginTestStatus` and assign it the value `"Passed"`.
    -   Call your `isTestPassed` function with this variable and store the boolean result in a new `const` named `didLoginPass`.
    -   Call your `printTestResult` function, passing it the string `"Login Test"` and the `didLoginPass` variable.
    -   Repeat the process for another test. Declare `checkoutTestStatus` with the value `"Failed"`, call `isTestPassed`, and then call `printTestResult` with the results for the `"Checkout Test"`.

## Answer Key

### Multiple Choice
1.  c) `function myFunc(parameter: type): string`
2.  c) The function performs an action but does not return any value.
3.  c) It makes the function's purpose clearer and helps catch internal errors.
4.  d) `function getStatus(): string { return true; }` (Error: Type `boolean` is not assignable to type `string`).
5.  c) A function that clicks on a button.

### Practical Exercise (Example Solution)
```typescript
// 1. Create a Test Helper Function
function isTestPassed(testStatus: string): boolean {
  return testStatus === "Passed";
}

// 2. Create a Logging Function
function printTestResult(testCaseName: string, isPassed: boolean): void {
  const resultMessage = isPassed ? "Passed" : "Failed";
  console.log(`Test Case '${testCaseName}': ${resultMessage}`);
}

// 3. Use the Functions

// First test case
const loginTestStatus: string = "Passed";
const didLoginPass: boolean = isTestPassed(loginTestStatus);
printTestResult("Login Test", didLoginPass);

// Second test case
const checkoutTestStatus: string = "Failed";
const didCheckoutPass: boolean = isTestPassed(checkoutTestStatus);
printTestResult("Checkout Test", didCheckoutPass);

// Expected Output:
// Test Case 'Login Test': Passed
// Test Case 'Checkout Test': Failed