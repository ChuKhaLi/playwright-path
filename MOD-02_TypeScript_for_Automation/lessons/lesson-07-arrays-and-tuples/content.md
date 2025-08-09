# Lesson 7: Arrays and Tuples in TypeScript

## Learning Objectives
- Define and use typed arrays in TypeScript.
- Understand and create tuples for fixed-length, fixed-type arrays.
- Apply arrays and tuples to practical test automation scenarios.
- Use common array methods in a type-safe way.

## Introduction
Arrays are one of the most common data structures in programming. In test automation, we use them constantly to manage lists of test data, web elements, or test results. TypeScript improves upon JavaScript arrays by allowing us to specify the type of data that an array can hold.

Tuples are a special, array-like structure provided by TypeScript for when you need an array with a fixed number of elements where the type of each element is known.

## Typed Arrays
A typed array is an array that is restricted to holding elements of a specific type.

### Defining Typed Arrays
There are two common syntaxes for defining a typed array:

```typescript
// Syntax 1: Using square brackets []
const userRoles: string[] = ["admin", "editor", "viewer"];
const responseTimes: number[] = [120, 250, 300];

// Syntax 2: Using the generic Array<T> syntax
const browsers: Array<string> = ["chrome", "firefox", "webkit"];
const statusCodes: Array<number> = [200, 404, 500];
```
Both syntaxes are equivalent, but the `[]` syntax is more common.

### Benefits in Test Automation
Using typed arrays prevents you from accidentally adding the wrong type of data to a list.

```typescript
const validStatusCodes: number[] = [200, 201, 204];

// validStatusCodes.push("200"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
validStatusCodes.push(400); // This is valid.
```
This is incredibly useful for maintaining clean and reliable test data.

## Tuples
A tuple is a fixed-length array where each element has a specific, predefined type.

### Defining a Tuple
You define a tuple by specifying the type of each element inside square brackets.

```typescript
// A tuple representing a user record: [ID, username, isActive]
let userRecord: [number, string, boolean];

// Assigning a value to the tuple
userRecord = [101, "testuser", true];

// Accessing elements
const userId = userRecord[0]; // Type is number
const username = userRecord[1]; // Type is string
const isActive = userRecord[2]; // Type is boolean

// Incorrect assignment
// userRecord = ["testuser", 101, true]; // Error: Type 'string' is not assignable to type 'number'.
// userRecord = [101, "testuser"]; // Error: Source has 2 element(s) but target requires 3.
```

### Use Case: Key-Value Pairs
Tuples are excellent for representing structured data without the overhead of creating an object, such as key-value pairs for setting headers in an API test.

```typescript
type HttpHeader = [string, string];

const authHeader: HttpHeader = ["Authorization", "Bearer my-secret-token"];
const contentTypeHeader: HttpHeader = ["Content-Type", "application/json"];

const requestHeaders: HttpHeader[] = [authHeader, contentTypeHeader];
```

## Readonly Arrays and Tuples
You can make an array or tuple immutable by using the `readonly` keyword. This prevents elements from being added, removed, or reassigned.

```typescript
// A readonly array of strings
const immutableBrowsers: readonly string[] = ["chrome", "firefox"];

// immutableBrowsers.push("edge"); // Error: Property 'push' does not exist on type 'readonly string[]'.

// A readonly tuple
const configuration: readonly [string, number] = ["https://api.example.com", 30000];

// configuration[0] = "new-url"; // Error: Cannot assign to '0' because it is a read-only property.
```
Using `readonly` is a good practice for test data that should not change during test execution.

## Working with Arrays: Common Methods
TypeScript understands the types used in common array methods, providing type safety for operations like `map`, `filter`, and `forEach`.

```typescript
const testScores: number[] = [88, 92, 75, 100, 64];

// .forEach()
testScores.forEach(score => {
  console.log(`Score is: ${score}`);
});

// .map() - creates a new array
// The 'results' array is automatically typed as string[]
const results = testScores.map(score => {
  return score >= 70 ? "Pass" : "Fail";
});
console.log(results); // ["Pass", "Pass", "Pass", "Pass", "Fail"]

// .filter() - creates a new array
// The 'passingScores' array is automatically typed as number[]
const passingScores = testScores.filter(score => {
  return score >= 90;
});
console.log(passingScores); // [92, 100]
```

## Summary
- **Typed arrays** enforce that all elements in the array are of the same type.
- **Tuples** are fixed-length arrays where each element has a known type.
- The `readonly` keyword can be used to create immutable arrays and tuples, which is great for constant test data.
- TypeScript provides type safety for all standard array methods, helping you write more reliable code.

Understanding the difference between arrays and tuples and when to use each is key to effectively structuring your test data and logic in TypeScript.