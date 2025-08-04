# Lesson 3: Variables, Types, and Type Annotations

## Learning Objectives
After completing this lesson, you will be able to:
- Declare variables using `let` and `const`.
- Understand the difference between `let` and `const`.
- Identify and use basic TypeScript types: `string`, `number`, and `boolean`.
- Apply type annotations to variables to enforce type safety.
- Understand type inference and when to use it.

## Introduction
Variables are the fundamental containers for storing data in any programming language. In TypeScript, we get the added benefit of associating a "type" with our variables. This is the core concept that gives TypeScript its power. In this lesson, we'll explore how to create variables and how to use types to make our test automation code more robust.

## Declaring Variables: `let` and `const`
In modern JavaScript and TypeScript, we use two keywords to declare variables: `let` and `const`.

### `let`
Use `let` when you need a variable whose value might change later.

**Automation Analogy:** Think of the current status of a test case. It might start as "Not Started", change to "In Progress", and finally become "Passed" or "Failed". This is a perfect use case for `let`.

```typescript
let testStatus: string = "In Progress";
console.log(`The test status is: ${testStatus}`);

testStatus = "Passed"; // This is allowed
console.log(`The test status is now: ${testStatus}`);
```

### `const`
Use `const` (short for "constant") when you have a variable whose value will *not* change after it's first assigned.

**Automation Analogy:** The URL for your application's login page or a specific user's email address that you use for testing are unlikely to change during a test run. These should be constants.

```typescript
const loginUrl: string = "https://example.com/login";
const testUsername: string = "tester@example.com";

// If you try to change a const, TypeScript will give you an error.
// loginUrl = "https://example.com/home"; // ERROR: Cannot assign to 'loginUrl' because it is a constant.
```
**Best Practice:** Always prefer `const` over `let`. Only use `let` if you know the variable's value needs to change. This makes your code safer and easier to reason about.

## Basic Types in TypeScript
TypeScript has several built-in types. For now, we'll focus on the three most common primitive types that you'll use constantly in test automation.

### `string`
Used for text data, like URLs, names, messages, or locators. You can use single quotes (`'`) or double quotes (`"`).

```typescript
const pageTitle: string = "My Awesome App";
const errorMessage: string = 'Invalid username or password.';
```

### `number`
Used for all kinds of numbers, including integers and decimals.

```typescript
const numberOfItemsInCart: number = 5;
const productPrice: number = 29.99;
const timeoutInMs: number = 30000;
```

### `boolean`
Used for true/false values. This is essential for checks and assertions in your tests.

```typescript
const isLoginSuccessful: boolean = true;
const isShoppingCartEmpty: boolean = false;
```

## Type Annotations
A type annotation is where you explicitly tell TypeScript the type of a variable. You do this with a colon (`:`) followed by the type name.

```typescript
let variableName: type = value;
```
This is the syntax we've been using in the examples above.

**Why is this important?**
By adding a type annotation, you are telling the TypeScript compiler to enforce that type.

```typescript
let testRetryCount: number = 3;

// Later in the code, someone makes a mistake...
// testRetryCount = "five"; // ERROR! Type 'string' is not assignable to type 'number'.
```
Without the type annotation, this error would only be found at runtime, potentially causing your test to behave unpredictably. With TypeScript, the error is caught in your editor instantly.

## Type Inference
TypeScript is smart! If you declare and initialize a variable in the same line, TypeScript can often figure out the type on its own. This is called **type inference**.

```typescript
let browserName = "Chrome"; // TypeScript infers this is a string
let testDuration = 120.5;   // TypeScript infers this is a number
let isTestPassed = true;    // TypeScript infers this is a boolean
```
In these cases, you don't *need* to add a type annotation. The following code is functionally identical to the code above:

```typescript
let browserName: string = "Chrome";
let testDuration: number = 120.5;
let isTestPassed: boolean = true;
```

**So, when should you use type annotations?**
1.  **When you declare a variable but don't initialize it right away.** TypeScript won't know what type it should be.
    ```typescript
    let finalTestResult: string; // We must add the annotation here

    // ... some logic ...

    finalTestResult = "Passed";
    ```
2.  **For function parameters and return types.** (We'll cover this in the next lesson).
3.  **For object structures.** (We'll cover this in a future lesson).
4.  **For clarity.** Sometimes, even when TypeScript can infer the type, you might add an annotation to make the code's intent clearer to human readers.

## Summary
- Use `let` for variables that will change and `const` for variables that won't. Prefer `const`.
- The three most common basic types are `string`, `number`, and `boolean`.
- **Type annotations** (`: type`) explicitly tell TypeScript the type of a variable, enabling the compiler to catch errors for you.
- **Type inference** is when TypeScript automatically figures out the type of a variable based on its initial value.
- Mastering variables and types is the first and most crucial step to writing clean, bug-free automation scripts.