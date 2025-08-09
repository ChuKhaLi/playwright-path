# Lesson 5: Objects and Interfaces for Test Data

## Learning Objectives
After completing this lesson, you will be able to:
- Create and use objects to group related data.
- Define custom object types using `interface`.
- Understand the benefits of using interfaces for test data and API responses.
- Implement functions that accept and return objects based on an interface.
- Use optional properties in interfaces.

## Introduction
In real-world test automation, we rarely work with simple, individual pieces of data. More often, we deal with structured data. For example, a "user" isn't just a username; it's a username, a password, an email address, a first name, and a last name, all grouped together.

Objects allow us to group this related data. Interfaces allow us to create a reusable "blueprint" for the structure of these objects, ensuring consistency and type safety. This is one of the most powerful concepts for organizing test automation projects.

## What are Objects?
An object is a collection of key-value pairs. Think of it as a container where you store related properties.

```typescript
const testUser = {
  username: "standard_user",
  password: "secret_sauce",
  firstName: "John",
  loginAttempts: 0,
  isLoggedIn: false
};

// Accessing properties of an object
console.log(testUser.username); // Output: standard_user
console.log(testUser.isLoggedIn); // Output: false

// Modifying properties of an object
testUser.loginAttempts = 1;
testUser.isLoggedIn = true;
```
This is much cleaner than having five separate variables (`testUserUsername`, `testUserPassword`, etc.).

## The Problem with Plain Objects
Objects are great, but in TypeScript, we can do better. What if you forget a property or misspell a key?

```typescript
const anotherUser = {
  userName: "problem_user", // Misspelled 'username'
  pass: "bad_password"      // Used 'pass' instead of 'password'
};
```
TypeScript won't complain about this on its own. This can lead to hard-to-find bugs in your tests when you try to access `anotherUser.username` and get `undefined`.

## Defining Object Structures with `interface`
An `interface` is a way to define a contract or a blueprint for an object's shape. It specifies what properties an object should have and what their types should be.

**Automation Analogy:** An interface is like a pre-flight checklist for a pilot. It ensures that every required item (property) is present and in the correct state (type) before you can "take off" (use the object).

Let's create an interface for our user object. By convention, interface names often start with a capital `I` or have a `PascalCase` name.

```typescript
interface User {
  username: string;
  password: string;
  firstName: string;
  loginAttempts: number;
  isLoggedIn: boolean;
}
```
Now, we can use this interface as a type for our user objects.

```typescript
// This object conforms to the User interface. It's valid.
const validUser: User = {
  username: "standard_user",
  password: "secret_sauce",
  firstName: "John",
  loginAttempts: 0,
  isLoggedIn: false
};

// This object does NOT conform. TypeScript will show an error.
const invalidUser: User = {
  username: "problem_user",
  // ERROR: Property 'password' is missing in type '{ username: string; }' but required in type 'User'.
};
```
The `invalidUser` object is immediately flagged with an error because it's missing the required properties defined in the `User` interface.

## Using Interfaces with Functions
The real power of interfaces shines when you use them with functions. You can create reusable helper functions that are guaranteed to receive and return data with the correct structure.

**Automation Example:** A function to log in a user.

```typescript
// Re-using our User interface
interface User {
  username: string;
  password: string;
  firstName: string;
  loginAttempts: number;
  isLoggedIn: boolean;
}

// This function only accepts objects that match the 'User' interface.
function login(user: User): void {
  console.log(`Attempting to log in user: ${user.username}`);
  // In a real test, you would have Playwright code here:
  // await page.fill('#user-name', user.username);
  // await page.fill('#password', user.password);
  // await page.click('#login-button');
  user.isLoggedIn = true; // We can modify the object
  user.loginAttempts++;
  console.log(`${user.firstName} is now logged in.`);
}

const testUser: User = {
  username: "performance_glitch_user",
  password: "secret_sauce",
  firstName: "Peter",
  loginAttempts: 0,
  isLoggedIn: false
};

login(testUser);
console.log(`Login attempts: ${testUser.loginAttempts}`); // Output: 1
```

## Optional Properties
Sometimes, an object might have properties that are not always required. You can mark these as optional in an interface by adding a `?` after the property name.

**Automation Example:** Test data for a product. The discount code might not always be present.

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  discountCode?: string; // This property is optional
}

const fullPriceItem: Product = {
  id: 101,
  name: "T-Shirt",
  price: 15.99
}; // This is valid because discountCode is optional.

const discountedItem: Product = {
  id: 202,
  name: "Backpack",
  price: 49.99,
  discountCode: "SAVE10"
}; // This is also valid.
```

## Summary
- **Objects** group related data together using key-value pairs.
- **Interfaces** define a "blueprint" or "contract" for the structure of an object.
- Using interfaces as types for your variables and function parameters enforces **type safety** for complex data structures.
- This is critical for managing **test data**, **API responses**, and the **Page Object Model** (which we'll cover later).
- Use a `?` to mark properties as **optional** in an interface.
- Mastering interfaces is a huge step towards writing clean, maintainable, and scalable automation frameworks.