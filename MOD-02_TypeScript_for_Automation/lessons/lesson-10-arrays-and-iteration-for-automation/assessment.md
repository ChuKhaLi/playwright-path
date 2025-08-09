# Lesson 6 Assessment: Arrays and Iteration for Automation

## Multiple Choice Questions

1.  **What is the correct syntax for declaring an array of numbers in TypeScript?**
    a)  `const list: array<number> = [1, 2, 3];`
    b)  `const list: number<> = [1, 2, 3];`
    c)  `const list: [number] = [1, 2, 3];`
    d)  `const list: number[] = [1, 2, 3];`

2.  **If you have an array `const pages = ["Home", "About", "Contact"];`, how would you access the value "About"?**
    a)  `pages[0]`
    b)  `pages[1]`
    c)  `pages[2]`
    d)  `pages.get("About")`

3.  **What is the primary purpose of the `.map()` array method?**
    a)  To iterate over each element in an array to perform an action.
    b)  To check if an array contains a specific element.
    c)  To create a new array by applying a function to every element of the original array.
    d)  To add a new element to the end of an array.

4.  **Which of the following code snippets would result in a TypeScript error?**
    a)  `const data: string[] = ["a", "b"]; data.push("c");`
    b)  `const data: number[] = [1, 2]; data[0] = 5;`
    c)  `const data: boolean[] = [true]; console.log(data.length);`
    d)  `const data: string[] = ["a"]; data.push(123);`

5.  **You have an array of product objects and you want to get a new array containing only the names of the products. Which method is best suited for this?**
    a)  `.forEach()`
    b)  `.map()`
    c)  `for...of`
    d)  `.push()`

## Practical Exercise

1.  **Define an Interface and Create Test Data:**
    -   Define an `interface` named `TestCase`.
    -   It should have two properties: `id` (a `number`) and `name` (a `string`).
    -   Create an array named `testSuite` that holds objects conforming to the `TestCase` interface.
    -   Add at least three test case objects to the array, for example: `{ id: 1, name: "User Login" }`, `{ id: 2, name: "Add Item to Cart" }`, `{ id: 3, name: "Complete Checkout" }`.

2.  **Iterate and Log Test Cases:**
    -   Using a `for...of` loop, iterate over the `testSuite` array.
    -   Inside the loop, log a message for each test case, like: `"Executing Test Case #1: User Login"`.

3.  **Transform Data with `.map()`:**
    -   You need a simple list of just the test case names for a report.
    -   Use the `.map()` method on the `testSuite` array to create a new array of strings named `testCaseNames`. This new array should contain only the `name` of each test case.
    -   Log the `testCaseNames` array to the console.

4.  **Create a Filtering Function:**
    -   Write a function named `getTestCaseById`.
    -   It should accept two parameters: `suite` (an array of `TestCase` objects) and `id` (a `number`).
    -   It should return a single `TestCase` object or `undefined` if not found.
    -   Inside the function, iterate through the `suite` array. If you find a test case whose `id` matches the `id` parameter, return that test case object.
    -   If the loop finishes and no match is found, return `undefined`.
    -   Call this function to find the test case with `id: 2` and log its name to the console.

## Answer Key

### Multiple Choice
1.  d) `const list: number[] = [1, 2, 3];`
2.  b) `pages[1]`
3.  c) To create a new array by applying a function to every element of the original array.
4.  d) `const data: string[] = ["a"]; data.push(123);` (Error: Argument of type 'number' is not assignable to parameter of type 'string').
5.  b) `.map()`

### Practical Exercise (Example Solution)
```typescript
// 1. Define Interface and Create Data
interface TestCase {
  id: number;
  name: string;
}

const testSuite: TestCase[] = [
  { id: 1, name: "User Login" },
  { id: 2, name: "Add Item to Cart" },
  { id: 3, name: "Complete Checkout" }
];

// 2. Iterate and Log
console.log("--- Running Test Suite ---");
for (const test of testSuite) {
  console.log(`Executing Test Case #${test.id}: ${test.name}`);
}

// 3. Transform Data
const testCaseNames: string[] = testSuite.map(test => test.name);
console.log("\n--- Test Case Report ---");
console.log(testCaseNames);

// 4. Create a Filtering Function
function getTestCaseById(suite: TestCase[], id: number): TestCase | undefined {
  for (const test of suite) {
    if (test.id === id) {
      return test;
    }
  }
  return undefined;
}

const foundTest = getTestCaseById(testSuite, 2);
console.log("\n--- Finding a specific test ---");
if (foundTest) {
  console.log(`Found test with ID 2: ${foundTest.name}`);
}