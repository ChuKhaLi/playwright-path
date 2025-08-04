# Lesson 4: Functions and Parameters in TypeScript

## Learning Objectives
After completing this lesson, you will be able to:
- Write functions in TypeScript.
- Add type annotations to function parameters.
- Specify the return type of a function.
- Understand the `void` return type for functions that don't return a value.
- Create reusable helper functions for test automation.

## Introduction
Functions are the workhorses of any programming language. They allow us to group a set of statements together to perform a specific task. In test automation, we use functions constantly to create reusable "helper" methods, such as logging in a user, adding an item to a cart, or checking for a specific element on a page.

TypeScript enhances standard JavaScript functions by allowing us to add types to their inputs (parameters) and outputs (return values), making them much more predictable and easier to use.

## Anatomy of a TypeScript Function
Let's break down the structure of a typed function in TypeScript.

```typescript
function functionName(parameter1: type, parameter2: type): returnType {
  // Function body
  // ... logic ...
  return value; // The value must match the returnType
}
```
- **`functionName`**: The name of your function.
- **`parameter: type`**: The function's inputs. Each parameter is followed by a type annotation. This is mandatory in TypeScript for function parameters.
- **`: returnType`**: A type annotation after the parameter list that specifies the type of the value the function will return.
- **`return value`**: The output of the function.

## Typing Function Parameters
Typing parameters is one of the most beneficial features of TypeScript. It prevents a whole class of bugs where incorrect data is passed to a function.

**Automation Example:** Let's create a helper function to build a URL for a specific product page.

```typescript
// This function builds a URL for a product page given a product ID.
function getProductUrl(productId: number): string {
  const baseUrl = "https://ecommerce-site.com/products";
  return `${baseUrl}/${productId}`;
}

// --- Correct Usage ---
const productPageUrl = getProductUrl(12345);
console.log(productPageUrl); // Output: https://ecommerce-site.com/products/12345

// --- Incorrect Usage (Caught by TypeScript!) ---
// const wrongUrl = getProductUrl("product-abc"); // ERROR: Argument of type 'string' is not assignable to parameter of type 'number'.
```
By specifying `productId: number`, we guarantee that no one can accidentally call this function with a product name or some other non-numeric value.

## Specifying Return Types
Just as we type the inputs, we should also type the output. This tells anyone using our function exactly what to expect back from it.

**Automation Example:** Let's write a function that formats a price by adding a currency symbol.

```typescript
// This function takes a number and returns a formatted price string.
function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

const formatted = formatPrice(19.99);
console.log(formatted); // Output: $19.99

// The type annotation for the return value ensures we can't make a mistake inside the function.
function formatPriceWithError(price: number): string {
  // return price; // ERROR: Type 'number' is not assignable to type 'string'.
  return `$${price.toFixed(2)}`;
}
```
This is incredibly useful. If you refactor the function later and accidentally change it to return the wrong type, TypeScript will immediately alert you.

## The `void` Return Type
What about functions that don't return anything? In test automation, many of our actions fall into this category, like "click a button" or "type in a field".

For these functions, we use the special return type `void`. `void` means the function completes its task but does not return a value.

**Automation Example:** A function that logs a custom message to the console.

```typescript
// This function logs a message but doesn't return anything.
function logTestStep(stepDescription: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] - STEP: ${stepDescription}`);
}

logTestStep("Navigating to login page.");
logTestStep("Entering username and password.");
// const result = logTestStep("Clicking login button."); // ERROR: 'logTestStep' function lacks return statement and return type does not include 'undefined'.
```
Using `void` makes your intent clear. It tells other developers (and yourself) not to expect a value back from this function.

## Type Inference for Return Types
Just like with variables, TypeScript can often infer the return type of a function based on its `return` statements.

```typescript
// TypeScript infers the return type as 'number' because 'a + b' is a number.
function add(a: number, b: number) {
  return a + b;
}
```
**Best Practice:** While type inference for return types works, it is a widely-followed best practice to **always explicitly add the return type annotation** to your functions.
Why?
1.  **Clarity:** It makes the function's contract immediately obvious to anyone reading it.
2.  **Safety:** It ensures the function actually returns what you think it returns. If you make a mistake in the function body, TypeScript will catch it based on your explicit return type.

## Summary
- Functions are blocks of reusable code, essential for building a clean test framework.
- **Always type your function parameters.** This is a core strength of TypeScript.
- **Always explicitly type your function's return value.** This makes your code safer and easier to understand.
- Use the `void` return type for functions that perform an action but do not return a value.
- By creating strongly-typed helper functions, you can build a robust and reliable automation framework that is easy to maintain and debug.