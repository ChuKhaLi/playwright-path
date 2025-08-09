# Lesson 12: Advanced TypeScript Features for Testing

## Learning Objectives
After completing this lesson, you will be able to:
- Use `enum` to define a set of named constants.
- Use Union Types (`|`) to allow a variable or parameter to be one of several types.
- Use Type Aliases (`type`) to create custom names for types.
- Understand the basics of `Generics` to create reusable, type-safe components.

## Introduction
You now have a strong foundation in TypeScript. This lesson introduces a few more advanced features that, while not strictly necessary for every test, can significantly improve the quality, readability, and reusability of your test automation framework. Think of these as powerful tools to add to your TypeScript toolbox.

## Enums: A Set of Named Constants
An `enum` (short for enumeration) allows you to define a set of named constants. This is incredibly useful for preventing "magic strings" or "magic numbers" in your code.

**Automation Analogy:** Instead of remembering that `1` means "Passed", `2` means "Failed", and `3` means "Skipped", you can define an `enum` that gives these numbers meaningful names.

**Without an Enum (The "Magic String" Problem):**
```typescript
function setTestStatus(status: string) {
  // What are the valid strings? "pass"? "Passed"? "PASS"?
  // This is error-prone.
}
setTestStatus("passed"); // A typo could easily happen here.
```

**With an Enum:**
```typescript
export enum TestStatus {
  Passed = 'PASSED',
  Failed = 'FAILED',
  Skipped = 'SKIPPED',
  InProgress = 'IN_PROGRESS'
}

function setTestStatus(status: TestStatus): void {
  console.log(`Setting test status to: ${status}`);
}

// Now, you get autocompletion and type safety!
setTestStatus(TestStatus.Passed);
// setTestStatus("passed"); // ERROR: Argument of type '"passed"' is not assignable to parameter of type 'TestStatus'.
```
Enums are perfect for things like user roles (`UserRole.Admin`, `UserRole.Standard`), browser names, or environment names (`Environment.Staging`, `Environment.Production`).

## Union Types: One Thing OR Another
A union type allows a variable to be one of several types. You create a union type using the pipe character (`|`).

**Automation Example:** A function that can find a user by either their numeric ID or their email string.

```typescript
function findUser(identifier: number | string): void {
  if (typeof identifier === 'number') {
    console.log(`Finding user by ID: ${identifier}`);
  } else {
    // TypeScript is smart enough to know 'identifier' must be a string here.
    console.log(`Finding user by email: ${identifier.toUpperCase()}`);
  }
}

findUser(12345);
findUser("test@example.com");
```
This is more flexible than writing two separate functions (`findUserById` and `findUserByEmail`).

## Type Aliases
A type alias allows you to create a new name for a type. It doesn't create a new type; it just gives an existing type a different name. This is great for making complex types easier to read and reuse.

You create a type alias with the `type` keyword.

**Automation Example:** Let's simplify our union type from before.

```typescript
// Create an alias for the number | string union
type UserIdentifier = number | string;

// Create an alias for a complex object type
type UserProfile = {
  id: UserIdentifier;
  name: string;
  email: string;
};

function displayUserProfile(profile: UserProfile): void {
  console.log(`Displaying profile for ${profile.name} (ID: ${profile.id})`);
}

const user: UserProfile = { id: "user-abc", name: "Jane Doe", email: "jane@example.com" };
displayUserProfile(user);
```
`type` vs. `interface`: For defining object shapes, `type` and `interface` are often interchangeable. A common convention is to use `interface` for defining the shape of objects and classes, and `type` for creating aliases for unions or other more complex type combinations.

## Generics: Creating Reusable, Type-Safe Components
Generics are arguably the most advanced topic in this lesson, but the concept is powerful. **Generics allow you to write a function or class that can work over a variety of types rather than a single one.**

**The Problem:** Imagine you need a function that fetches data from an API. One endpoint returns a `User` object, and another returns a `Product` object. You could write two separate functions:

```typescript
// Assume User and Product interfaces exist
async function fetchUser(url: string): Promise<User> { /* ... */ }
async function fetchProduct(url: string): Promise<Product> { /* ... */ }
```
This is repetitive. The logic for making the API call is the same.

**The Solution with Generics:**
We can create a single, generic function. We use a **type parameter**, commonly written as `<T>`, to act as a placeholder for the actual type that will be provided later.

```typescript
// Assume User and Product interfaces exist
interface User { id: number; name: string; }
interface Product { sku: string; price: number; }

// <T> is the generic type parameter.
// We're saying this function takes a URL and will return a Promise of whatever type 'T' is.
async function fetchData<T>(url: string): Promise<T> {
  // In a real scenario, this would be a fetch() call.
  // We'll simulate it.
  let responseData: any;
  if (url.includes('users')) {
    responseData = { id: 1, name: 'Generic User' };
  } else {
    responseData = { sku: 'TS-123', price: 99.99 };
  }
  return responseData as T;
}

async function runGenericExample() {
  // Here, we specify that we expect a 'User' back.
  // TypeScript now knows 'user' will be of type User.
  const user = await fetchData<User>('/api/users/1');
  console.log(user.name); // Autocompletes .id and .name

  // Here, we specify that we expect a 'Product' back.
  const product = await fetchData<Product>('/api/products/ts-123');
  console.log(product.price); // Autocompletes .sku and .price
}

runGenericExample();
```
By using `<T>`, we created a single function that is still 100% type-safe for whatever type we use it with. This is an extremely powerful pattern for creating reusable API clients and other utilities in a test framework.

## Summary
-   **Enums** provide a type-safe way to work with sets of named constants, avoiding "magic strings/numbers".
-   **Union Types (`|`)** give you flexibility by allowing a variable to hold values of several different types.
-   **Type Aliases (`type`)** help you create clean, readable names for complex types like unions or object structures.
-   **Generics (`<T>`)** are a powerful tool for creating reusable functions and classes that can work with multiple types while preserving type safety.