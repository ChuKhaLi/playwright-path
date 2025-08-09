# Lesson 12 Assessment: Advanced TypeScript Features for Testing

## Multiple Choice Questions

1.  **What is the primary benefit of using an `enum`?**
    a)  To create a variable that can hold multiple types.
    b)  To define a set of named constants, preventing the use of "magic strings" or numbers.
    c)  To create a reusable function that works with different types.
    d)  To define the shape of an object.

2.  **Which syntax correctly defines a variable that can hold either a `string` or a `boolean`?**
    a)  `let value: string & boolean;`
    b)  `let value: string, boolean;`
    c)  `let value: string | boolean;`
    d)  `let value: Generic<string, boolean>;`

3.  **What is a key characteristic of a `type` alias?**
    a)  It creates a brand new type that is incompatible with the original.
    b)  It can only be used for object types.
    c)  It gives an existing type a new name for readability and reusability.
    d)  It can only be used for union types.

4.  **In the context of Generics, what is `<T>` in the function signature `function doSomething<T>(arg: T): T`?**
    a)  A specific, built-in type called `T`.
    b)  A placeholder for a type that will be specified when the function is called.
    c)  A syntax error.
    d)  An alias for the `any` type.

5.  **You need to create a type-safe function `getElementText<T>(locator: string): Promise<T>` that can be used to get text from an element and parse it into either a `string` or a `number`. Which TypeScript feature makes this possible?**
    a)  Enums
    b)  Interfaces
    c)  Inheritance
    d)  Generics

## Practical Exercise

In this exercise, you will refactor a small piece of a test framework using the advanced types you've learned.

1.  **Create an Enum for User Roles:**
    -   Define an `enum` named `UserRole`.
    -   It should have three members: `Standard`, `Admin`, and `Guest`. You can let TypeScript assign them default numeric values.

2.  **Create a Type Alias for User Data:**
    -   Define an `interface` named `User` with properties: `id` (number), `username` (string), and `role` (`UserRole`).
    -   Create a `type` alias named `UserOrId` which is a union of `User` or `number`.

3.  **Create a Generic Utility Function:**
    -   Create a generic `async` function named `findItem`.
    -   It should take two arguments: `items` (an array of a generic type `T`) and `property` (a `keyof T`, which means a key of the object `T`).
    -   The third argument should be `value` (the value to search for).
    -   The function should return a `Promise` of type `T | undefined`.
    -   Inside the function, simulate a delay, then find and return the first item in the `items` array where the given `property` matches the `value`.

4.  **Put It All Together:**
    -   Create an array of `User` objects with different roles.
    -   Use your generic `findItem` function to find a user by their `id`.
    -   Use your generic `findItem` function again to find a user by their `username`.
    -   Log the results to the console.
    -   Create a function `logUserRole` that accepts a parameter of type `UserOrId`. Inside this function, use a type guard (`typeof` or `instanceof`) to check if the input is a `User` object or just a `number` and log an appropriate message. Call this function with both a `User` object and a user ID number.

## Answer Key

### Multiple Choice
1.  b) To define a set of named constants, preventing the use of "magic strings" or numbers.
2.  c) `let value: string | boolean;`
3.  c) It gives an existing type a new name for readability and reusability.
4.  b) A placeholder for a type that will be specified when the function is called.
5.  d) Generics

### Practical Exercise (Example Solution)
```typescript
// 1. Create an Enum
enum UserRole {
  Standard,
  Admin,
  Guest
}

// 2. Create a Type Alias
interface User {
  id: number;
  username: string;
  role: UserRole;
}

type UserOrId = User | number;

// 3. Create a Generic Utility Function
async function findItem<T>(items: T[], property: keyof T, value: any): Promise<T | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async
  return items.find(item => item[property] === value);
}

// 4. Put It All Together
async function runTest() {
  const users: User[] = [
    { id: 1, username: 'standard', role: UserRole.Standard },
    { id: 2, username: 'admin', role: UserRole.Admin },
    { id: 3, username: 'guest', role: UserRole.Guest }
  ];

  console.log("--- Finding Users ---");
  const userById = await findItem(users, 'id', 2);
  console.log(`Found by ID: ${userById?.username}`); // Found by ID: admin

  const userByUsername = await findItem(users, 'username', 'guest');
  console.log(`Found by Username: ${userByUsername?.username}`); // Found by Username: guest

  function logUserRole(identifier: UserOrId): void {
    if (typeof identifier === 'number') {
      console.log(`Logging role for user ID: ${identifier}`);
    } else {
      // It's a User object
      console.log(`Logging role for user: ${identifier.username}, Role: ${UserRole[identifier.role]}`);
    }
  }

  console.log("\n--- Logging Roles ---");
  if (userById) {
    logUserRole(userById); // Pass the User object
  }
  logUserRole(1); // Pass a number
}

runTest();