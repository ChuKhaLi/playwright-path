# Lesson 5: Function Types and Signatures

## Learning Objectives
- Understand how to define types for function parameters and return values.
- Learn to write and use function signatures.
- Explore optional and default parameters in TypeScript functions.
- Understand `void` and `never` return types.

## Introduction
Functions are the building blocks of any application, and in test automation, they are essential for creating reusable, maintainable, and readable test logic. TypeScript enhances standard JavaScript functions by allowing us to add types to the inputs and outputs, making them more predictable and robust.

## Function Parameter and Return Types
In TypeScript, you can explicitly set the types for a function's parameters and its return value.

```typescript
// A simple function with typed parameters and a typed return value
function add(a: number, b: number): number {
  return a + b;
}

// This function is now type-safe.
let result = add(5, 10); // Correct: result is 15
// let error = add(5, "10"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

### Test Automation Example
Let's create a utility function for our test suite.

```typescript
/**
 * Creates a full name from a first and last name.
 * @param firstName The user's first name.
 * @param lastName The user's last name.
 * @returns The full name as a single string.
 */
function formatUserName(firstName: string, lastName: string): string {
  return `${lastName}, ${firstName}`;
}

const userName = formatUserName("John", "Doe");
console.log(userName); // "Doe, John"
```

## Function Signatures
A function signature is a way to define the shape of a function, including its parameters and return type, without providing the implementation. This is useful when you want to describe a function type that can be used for callbacks or passed as a parameter.

```typescript
// Define a function signature
type MathOperation = (x: number, y: number) => number;

// Now, we can create functions that match this signature
const subtract: MathOperation = (x, y) => {
  return x - y;
};

const multiply: MathOperation = (x, y) => {
  return x * y;
};

// This function would not match the signature
// const wrong: MathOperation = (x, y) => {
//   return `The result is ${x + y}`; // Error: Type 'string' is not assignable to type 'number'.
// };
```

## Optional and Default Parameters

### Optional Parameters
You can mark a parameter as optional by adding a `?` after its name.

```typescript
function greet(name: string, greeting?: string): string {
  if (greeting) {
    return `${greeting}, ${name}!`;
  } else {
    return `Hello, ${name}!`;
  }
}

console.log(greet("Alice")); // "Hello, Alice!"
console.log(greet("Bob", "Good morning")); // "Good morning, Bob!"
```
**Note:** Optional parameters must come after required parameters.

### Default Parameters
You can also provide a default value for a parameter. If a value is not provided for that parameter when the function is called, the default value is used.

```typescript
function createTestUser(username: string, role: string = "viewer"): { username: string; role: string } {
  return { username, role };
}

const adminUser = createTestUser("admin123", "admin");
const defaultUser = createTestUser("guestUser");

console.log(adminUser); // { username: 'admin123', role: 'admin' }
console.log(defaultUser); // { username: 'guestUser', role: 'viewer' }
```

## Special Return Types: `void` and `never`

### `void`
The `void` type is used when a function does not return a value.

```typescript
// This function logs to the console but doesn't return anything.
function logMessage(message: string): void {
  console.log(message);
}
```
In test automation, this is common for functions that perform an action but don't need to return a result, like a `setup` or `teardown` function.

### `never`
The `never` type represents a value that never occurs. It's used for functions that:
1.  Always throw an exception.
2.  Have an infinite loop and never return.

```typescript
// This function always throws an error, so it never returns a value.
function throwError(message: string): never {
  throw new Error(message);
}

// This function has an infinite loop.
function infiniteLoop(): never {
  while (true) {
    // ...
  }
}
```
This is useful for ensuring that certain code paths are never reached.

## Summary
- TypeScript allows you to add explicit types to function **parameters** and **return values**.
- A **function signature** defines the shape of a function without an implementation.
- Parameters can be made **optional** with `?` or given **default values**.
- The `void` type is for functions that don't return a value.
- The `never` type is for functions that never return.

Mastering function types is a critical step in writing clean, reliable, and maintainable test automation code.