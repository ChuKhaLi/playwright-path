# Lesson 9 Assessment: Error Handling and Debugging

## Multiple Choice Questions

1.  **A type error, like assigning a `number` to a `string` variable, is an example of what kind of error?**
    a)  A runtime error
    b)  A compile-time error
    c)  A logical error
    d)  A user error

2.  **What is the purpose of the `catch` block in a `try...catch` statement?**
    a)  It contains the code that is likely to cause an error.
    b)  It is executed only if the code in the `try` block succeeds.
    c)  It is always executed, regardless of whether an error occurs.
    d)  It contains the code that is executed if an error occurs in the `try` block.

3.  **Which keyword is used to manually generate an error in your code?**
    a)  `error`
    b)  `catch`
    c)  `throw`
    d)  `fail`

4.  **What is the simplest and most common technique for debugging code and inspecting variable values at different points?**
    a)  Using a professional debugger.
    b)  Writing comments in the code.
    c)  Using `console.log()` to print values.
    d)  Using `try...catch` blocks.

5.  **When does the optional `finally` block of a `try...catch...finally` statement execute?**
    a)  Only when an error is caught.
    b)  Only when no error occurs.
    c)  It never executes automatically.
    d)  Always, regardless of whether an error occurred or not.

## Practical Exercise

You are writing a test for a "divide" function from a calculator API. You need to handle potential errors, like dividing by zero.

1.  **Create a Risky Function:**
    -   Create a function named `divide`.
    -   It should accept two parameters: `numerator` (a `number`) and `denominator` (a `number`).
    -   It should return a `number`.
    -   Inside the function, check if the `denominator` is `0`. If it is, `throw` a new `Error` with the message "Cannot divide by zero.".
    -   If the denominator is not zero, return the result of `numerator / denominator`.

2.  **Create a Test Wrapper Function:**
    -   Create an `async` function named `runDivideTest`.
    -   It should accept two parameters: `num` (a `number`) and `den` (a `number`). It should return `Promise<void>`.
    -   Inside this function, use a `try...catch` block.
    -   In the `try` block:
        -   Log a message like `"Attempting to divide ${num} by ${den}..."`.
        -   Call the `divide` function with the provided arguments and store the result in a variable.
        -   Log the result: `"Success! Result: ${result}"`.
    -   In the `catch (error)` block:
        -   Log an error message: `"Test failed with an error."`.
        -   Log the specific error message from the caught error object (e.g., `error.message`).

3.  **Execute the Tests:**
    -   Call `runDivideTest` with valid inputs, like `10` and `2`.
    -   Call `runDivideTest` with inputs that will cause an error, like `5` and `0`.
    -   Observe the console output to see how the `try...catch` block handles both the success and failure cases gracefully.

## Answer Key

### Multiple Choice
1.  b) A compile-time error
2.  d) It contains the code that is executed if an error occurs in the `try` block.
3.  c) `throw`
4.  c) Using `console.log()` to print values.
5.  d) Always, regardless of whether an error occurred or not.

### Practical Exercise (Example Solution)
```typescript
// 1. Create a Risky Function
function divide(numerator: number, denominator: number): number {
  if (denominator === 0) {
    throw new Error("Cannot divide by zero.");
  }
  return numerator / denominator;
}

// 2. Create a Test Wrapper Function
async function runDivideTest(num: number, den: number): Promise<void> {
  try {
    console.log(`Attempting to divide ${num} by ${den}...`);
    const result = divide(num, den);
    console.log(`Success! Result: ${result}`);
  } catch (error) {
    console.error("Test failed with an error.");
    // We check if error is an instance of Error to safely access .message
    if (error instanceof Error) {
      console.error(`Details: ${error.message}`);
    } else {
      console.error("An unknown error occurred.");
    }
  }
  console.log("--- Test finished ---");
}

// 3. Execute the Tests
async function runAll() {
  await runDivideTest(10, 2);
  await runDivideTest(5, 0);
}

runAll();

// Expected Output:
// Attempting to divide 10 by 2...
// Success! Result: 5
// --- Test finished ---
// Attempting to divide 5 by 0...
// Test failed with an error.
// Details: Cannot divide by zero.
// --- Test finished ---