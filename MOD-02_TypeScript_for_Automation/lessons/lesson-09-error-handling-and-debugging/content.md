# Lesson 9: Error Handling and Debugging

## Learning Objectives
After completing this lesson, you will be able to:
- Understand the difference between compile-time and runtime errors.
- Use `try...catch` blocks to handle runtime errors gracefully.
- Use the `throw` keyword to create custom errors.
- Apply basic debugging techniques using `console.log`.
- Understand the concept of using a debugger for more advanced troubleshooting.

## Introduction
No one writes perfect code. Errors are a normal and expected part of software development. As a QA automation engineer, your job is not just to find bugs in the application, but also to write robust test code that can handle unexpected situations and is easy to debug when it fails.

This lesson introduces two key skills: **error handling** (how your code responds to errors) and **debugging** (how you find and fix errors).

## Compile-Time vs. Runtime Errors

### Compile-Time Errors
These are the errors that TypeScript finds for you *before* the code is ever run. We've seen these already! They are your first line of defense.
-   **Syntax Errors:** A typo in your code, like a missing bracket.
-   **Type Errors:** Trying to assign a `string` to a `number` variable, or passing the wrong type of argument to a function.

```typescript
let x: number = "hello"; // A type error caught by the compiler
```
The TypeScript compiler (`tsc`) will refuse to create the JavaScript file until you fix these errors.

### Runtime Errors
These errors happen *while* your JavaScript code is running. The compiler can't predict these.
-   Trying to access a property of an `undefined` object.
-   An API call failing due to a network issue.
-   A Playwright test failing because an element it's looking for doesn't exist on the page.

Our goal is to write code that can anticipate and manage these runtime errors without crashing the entire test suite.

## Handling Runtime Errors with `try...catch`
The `try...catch` statement allows you to "try" a block of code that might fail. If an error occurs within the `try` block, the code inside the `catch` block is executed.

**Automation Analogy:** A `try...catch` block is like having a spotter when you're lifting weights. You "try" to lift the weight. If you succeed, great. If you fail, the spotter "catches" it, preventing a disaster.

```typescript
async function checkElement(): Promise<void> {
  try {
    // --- Code that might fail goes in here ---
    console.log("Trying to find the #logout-button...");
    // In a real test, this Playwright command would throw an error if the button isn't found.
    // For now, we'll simulate an error.
    throw new Error("Element #logout-button not found on the page.");
    
    console.log("Element found and clicked!"); // This line will be skipped if an error is thrown.

  } catch (error) {
    // --- Code to run ONLY if an error occurs ---
    console.error("An error occurred during the test step!");
    console.error(`Details: ${error.message}`);
    // In a real test, you might take a screenshot here before failing the test.
  } finally {
    // --- (Optional) Code that runs regardless of success or failure ---
    console.log("Finished the 'checkElement' step.");
  }
}

checkElement();
```
**Output:**
```
Trying to find the #logout-button...
An error occurred during the test step!
Details: Element #logout-button not found on the page.
Finished the 'checkElement' step.
```
Without `try...catch`, the `throw new Error` line would have crashed our program. With it, we were able to catch the error, log a helpful message, and continue.

## Creating Your Own Errors with `throw`
Sometimes, you want to create your own error conditions. For example, if an API response doesn't contain the data you expect, you might want to `throw` an error to deliberately fail a test.

```typescript
function verifyApiResponse(response: { status: number, data: any }): void {
  if (response.status !== 200) {
    // We are creating and throwing a new Error object.
    throw new Error(`API request failed with status ${response.status}`);
  }
  if (!response.data) {
    throw new Error("API response did not contain any data.");
  }
  console.log("API response verified successfully.");
}

try {
  verifyApiResponse({ status: 404, data: null });
} catch (error) {
  console.error(`Caught a custom error: ${error.message}`);
}
```

## Basic Debugging with `console.log`
The simplest but most effective debugging tool is `console.log`. When your test isn't behaving as you expect, strategically placing `console.log` statements can help you understand the flow of your code and the state of your variables at different points.

**Automation Example:** A test is failing, and you don't know why.

```typescript
async function calculateCartTotal(items: { name: string, price: number }[]): Promise<number> {
  let total = 0;
  console.log("--- Starting Cart Calculation ---");
  console.log("Initial total:", total);
  console.log("Items received:", items); // Log the input data

  for (const item of items) {
    console.log(`Processing item: ${item.name} with price ${item.price}`);
    total += item.price;
    console.log(`Current total after adding ${item.name}:`, total); // Log the state inside the loop
  }

  console.log("Final calculated total:", total);
  console.log("--- Finished Cart Calculation ---");
  return total;
}

const myCart = [ { name: "Shirt", price: 20 }, { name: "Hat", price: 15 } ];
calculateCartTotal(myCart);
```
By "instrumenting" your code with logs, you can trace its execution and spot where the logic goes wrong.

## Advanced Debugging
While `console.log` is great, professional developers use a **debugger**. A debugger is a tool that lets you pause your code's execution at specific points (called **breakpoints**), inspect the values of all variables at that moment, and then step through your code line by line.

VS Code has a fantastic built-in debugger for Node.js and TypeScript. Setting it up is a topic for a more advanced lesson, but it's important to know that these powerful tools exist for when `console.log` isn't enough.

## Summary
- **Compile-time errors** are caught by TypeScript before you run your code.
- **Runtime errors** happen while the code is executing.
- Use `try...catch` to handle potential runtime errors gracefully without crashing your program.
- Use `throw` to create your own custom error conditions.
- **`console.log` is your best friend for debugging.** Use it to trace your code's execution and inspect variable states.
- For complex issues, a **debugger** allows you to pause and step through your code line by line.