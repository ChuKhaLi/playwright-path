# Lesson 14: Generics Fundamentals

## Learning Objectives
- Understand what generics are and why they are useful.
- Learn how to create and use generic functions.
- Learn how to create and use generic interfaces and classes.
- Apply generics to create reusable and type-safe components in test automation.

## Introduction
Generics are one of the most powerful features of TypeScript. They allow you to write reusable code that can work over a variety of types rather than a single one. This enables you to create components that are both flexible and type-safe.

Think of generics as a way of passing a type as a parameter to another type, function, or class.

## The Problem Without Generics
Imagine you need a function that returns the first element of an array. You could write separate functions for each type:

```typescript
function getFirstString(arr: string[]): string {
  return arr[0];
}

function getFirstNumber(arr: number[]): number {
  return arr[0];
}
```
This is repetitive. You could use `any`, but then you lose type safety.

```typescript
function getFirstAny(arr: any[]): any {
  return arr[0];
}

const first = getFirstAny(["a", "b", "c"]); // 'first' is of type 'any'
// We lose all type information and editor autocompletion.
```

## Generic Functions
Generics solve this problem by introducing a **type variable**. By convention, this is often `T` (for Type), but it can be any valid name.

```typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// TypeScript can infer the type
const firstString = getFirst(["a", "b", "c"]); // Type of firstString is 'string'
const firstNumber = getFirst([1, 2, 3]);     // Type of firstNumber is 'number'

// You can also be explicit
const firstBoolean = getFirst<boolean>([true, false]); // Type of firstBoolean is 'boolean'
```
Now we have one function that is both reusable and completely type-safe.

## Generic Interfaces
You can also use generics with interfaces. This is extremely useful for defining flexible data structures.

A common use case in test automation is creating a generic API response structure.

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T; // The data payload can be of any type
  timestamp: number;
}

// Define the shape of a User
interface User {
  id: number;
  name: string;
}

// Define the shape of a Product
interface Product {
  sku: string;
  price: number;
}

// Create a typed API response for a user
const userResponse: ApiResponse<User> = {
  success: true,
  data: { id: 1, name: "John Doe" },
  timestamp: Date.now(),
};

// Create a typed API response for a list of products
const productListResponse: ApiResponse<Product[]> = {
  success: true,
  data: [
    { sku: "TS-01", price: 19.99 },
    { sku: "MUG-01", price: 9.99 },
  ],
  timestamp: Date.now(),
};
```

## Generic Classes
Classes can also be generic. This is powerful for creating reusable components like data repositories or factories.

Let's create a generic `DataStore` class that can manage a collection of any type of object, as long as that object has an `id`.

### Generic Constraints
Sometimes you need to ensure that the generic type `T` has certain properties. You can do this with the `extends` keyword. This is called a **generic constraint**.

```typescript
// We constrain T to be an object that has an id of type number
interface HasId {
  id: number;
}

class DataStore<T extends HasId> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    // We can access 'item.id' because of the generic constraint
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return this.items;
  }
}

// Define a User type that satisfies the HasId constraint
interface User {
  id: number;
  username: string;
}

// Create a DataStore specifically for Users
const userStore = new DataStore<User>();
userStore.add({ id: 1, username: "user1" });
userStore.add({ id: 2, username: "user2" });

const foundUser = userStore.findById(2); // 'foundUser' is of type User | undefined
console.log(foundUser);
```

## Summary
- **Generics** allow you to write reusable, type-safe code by using **type variables** (like `<T>`).
- **Generic functions** can operate on arguments of various types while preserving type information.
- **Generic interfaces** and **generic classes** are used to create flexible and reusable data structures and components.
- **Generic constraints** (`extends`) allow you to enforce that a generic type has a certain shape or properties.

Generics are a key concept for building advanced, scalable, and maintainable test automation frameworks. They allow you to write abstract, reusable logic (like an API client or a data factory) that can be applied to many different data types without sacrificing the benefits of TypeScript's static type checking.