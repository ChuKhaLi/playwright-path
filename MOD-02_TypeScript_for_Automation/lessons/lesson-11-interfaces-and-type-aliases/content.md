# Lesson 11: Interfaces and Type Aliases

## Learning Objectives
- Understand and create `interface` types to define the shape of objects.
- Understand and create `type` aliases for custom type naming.
- Know the key differences between interfaces and type aliases and when to use each.
- Apply interfaces and type aliases to model complex test data and API structures.

## Introduction
Interfaces and type aliases are two powerful TypeScript features for defining the "shape" of a data structure. They allow you to create custom, reusable types that make your code more readable, maintainable, and robust. In test automation, they are fundamental for modeling things like page objects, API responses, and test data.

## Interfaces
An `interface` is a way to define a contract for an object's shape. It specifies the property names and their corresponding types.

```typescript
// Define an interface for a User object
interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  readonly registrationDate: Date; // A property that cannot be changed
  profileUrl?: string; // An optional property
}

// Create an object that adheres to the User interface
const testUser: User = {
  id: 1,
  username: "test-user",
  email: "test@example.com",
  isActive: true,
  registrationDate: new Date(),
};

// testUser.registrationDate = new Date(); // Error: Cannot assign to 'registrationDate' because it is a read-only property.
// const invalidUser: User = { id: 2, username: "bad" }; // Error: Property 'email' is missing.
```

### Extending Interfaces
Interfaces can inherit from other interfaces, allowing you to build more complex types from simpler ones.

```typescript
interface AdminUser extends User {
  permissions: string[];
}

const admin: AdminUser = {
  id: 99,
  username: "super-admin",
  email: "admin@example.com",
  isActive: true,
  registrationDate: new Date(),
  permissions: ["create-user", "delete-user", "publish-content"],
};
```

## Type Aliases
A `type` alias allows you to create a new name for any type, not just object types. This can be a primitive type, a union type, a tuple, or any other type.

```typescript
// Type alias for a primitive
type UserID = string;

// Type alias for a union type
type Status = "success" | "failure" | "pending";

// Type alias for an object type
type Point = {
  x: number;
  y: number;
};

// Type alias for a function signature
type Logger = (message: string) => void;
```

### Using Type Aliases for Objects
You can define object shapes with type aliases, similar to interfaces.

```typescript
type Product = {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
};

const product: Product = {
  id: "abc-123",
  name: "Test Product",
  price: 99.99,
  inStock: true,
};
```

## Interfaces vs. Type Aliases: Key Differences
While they often seem interchangeable for defining object shapes, there are two key differences.

### 1. Declaration Merging (Interfaces Only)
Interfaces can be defined multiple times, and TypeScript will merge their definitions into a single interface. This is called "declaration merging."

```typescript
// First declaration
interface Box {
  height: number;
  width: number;
}

// Second declaration (adds a new property)
interface Box {
  scale: number;
}

// The 'Box' interface now has height, width, and scale
const myBox: Box = { height: 10, width: 20, scale: 1 };
```
Type aliases cannot be merged in this way. If you define a type alias with the same name twice, TypeScript will throw an error.

### 2. Extensibility (Slightly Different Syntax)
Both can be extended, but the syntax differs.

- **Interfaces** use the `extends` keyword.
- **Type Aliases** use intersection types (`&`).

```typescript
// Interface extension
interface Animal { name: string; }
interface Bear extends Animal { honey: boolean; }

// Type alias extension
type Vehicle = { brand: string; };
type Car = Vehicle & { model: string; };
```

## When to Use Which?
The TypeScript team provides a simple guideline:
- **Prefer `interface`** for defining the shape of objects or class contracts. They are more idiomatic for this purpose, and their ability to be merged can be useful, especially when working with third-party libraries.
- **Use `type`** when you need to create an alias for a union type, a tuple, or a primitive type.

For test automation, you will use both extensively:
- **Interfaces** are perfect for defining the structure of Page Object Models (POMs) and complex API response objects.
- **Type aliases** are excellent for defining sets of allowed string values (e.g., browser names, environment names) or for creating simpler names for complex union or intersection types.

## Summary
- **`interface`** defines a contract for an object's shape and can be extended and merged.
- **`type`** creates a new name (alias) for any type, including primitives, unions, and objects.
- Prefer `interface` for object shapes and `type` for all other custom type definitions.
- Both are crucial tools for creating strongly-typed, self-documenting, and maintainable test automation frameworks.