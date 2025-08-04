# Lesson 3 Assessment: Variables, Types, and Type Annotations

## Multiple Choice Questions

1.  **When should you use `let` to declare a variable instead of `const`?**
    a)  Always; `let` is the modern standard.
    b)  When the variable's value will not change.
    c)  When the variable's value might need to be reassigned later.
    d)  Only for `string` type variables.

2.  **Which of the following is a valid TypeScript type annotation for a variable holding the number of test retries?**
    a)  `let retryCount: 3;`
    b)  `let retryCount = number;`
    c)  `let retryCount: number;`
    d)  `let retryCount is number;`

3.  **What is type inference in TypeScript?**
    a)  A feature that automatically converts types, like a string to a number.
    b)  The process of explicitly writing type annotations for every variable.
    c)  When the TypeScript compiler automatically determines a variable's type based on its initial value.
    d)  An error that occurs when a type is not defined.

4.  **Which of the following variable declarations would cause a TypeScript error?**
    a)  `const appUrl: string = "http://myapp.com";`
    b)  `let timeout: number = 5000; timeout = 10000;`
    c)  `const isLoggedIn: boolean = false; isLoggedIn = true;`
    d)  `let username: string; username = "testuser";`

5.  **In which scenario is it **mandatory** to use a type annotation?**
    a)  When declaring a `const` variable with an initial value.
    b)  When declaring a `let` variable with an initial value.
    c)  When declaring a variable without an initial value.
    d)  It is never mandatory; it is always optional.

## Practical Exercise

1.  **Declare Test Configuration Variables:**
    -   In a new `.ts` file, declare the following variables for a test configuration. Choose `let` or `const` appropriately.
    -   A variable named `baseURL` for the application's main URL: `"https://automation-practice.com"`.
    -   A variable named `testBrowser` for the browser being tested: `"Firefox"`.
    -   A variable named `maxLoginAttempts` with a value of `3`.
    -   A variable named `isHeadless` to determine if the browser runs in headless mode, set to `true`.
    -   A variable named `currentLoginAttempt`, initialized to `1`. This variable will be incremented during a test.

2.  **Apply Type Annotations:**
    -   Add explicit type annotations to all the variables you declared in step 1.

3.  **Simulate a Test Scenario:**
    -   Reassign the `testBrowser` variable to `"Edge"`. (If you chose `const` initially, this will cause an error. Think about whether `let` or `const` was the right choice and correct it if necessary).
    -   Reassign the `currentLoginAttempt` variable to `2`.
    -   Try to reassign `maxLoginAttempts` to `5`. Observe the error TypeScript gives you if you declared it correctly as a `const`.
    -   Create a new variable `loginStatusMessage` without an initial value. Give it an explicit type annotation of `string`. Later, assign it the value `"Login successful on attempt 2"`.

4.  **Log the final state:**
    -   Use `console.log()` to print the final values of `baseURL`, `testBrowser`, `maxLoginAttempts`, `isHeadless`, and `loginStatusMessage`.

## Answer Key

### Multiple Choice
1.  c) When the variable's value might need to be reassigned later.
2.  c) `let retryCount: number;`
3.  c) When the TypeScript compiler automatically determines a variable's type based on its initial value.
4.  c) `const isLoggedIn: boolean = false; isLoggedIn = true;` (Cannot reassign a `const`).
5.  c) When declaring a variable without an initial value.

### Practical Exercise (Example Solution)
```typescript
// 1. & 2. Declare and annotate variables
const baseURL: string = "https://automation-practice.com";
let testBrowser: string = "Firefox"; // Use let because it might change
const maxLoginAttempts: number = 3;
const isHeadless: boolean = true;
let currentLoginAttempt: number = 1; // Use let because it will be incremented

// 3. Simulate a test scenario
testBrowser = "Edge"; // This is valid because testBrowser is a 'let'
currentLoginAttempt = 2; // This is also valid

// The following line would cause an error, which is correct!
// maxLoginAttempts = 5; // Error: Cannot assign to 'maxLoginAttempts' because it is a constant.

let loginStatusMessage: string;
loginStatusMessage = `Login successful on attempt ${currentLoginAttempt}`;

// 4. Log the final state
console.log(`Base URL: ${baseURL}`);
console.log(`Test Browser: ${testBrowser}`);
console.log(`Max Login Attempts: ${maxLoginAttempts}`);
console.log(`Run in Headless: ${isHeadless}`);
console.log(`Status: ${loginStatusMessage}`);