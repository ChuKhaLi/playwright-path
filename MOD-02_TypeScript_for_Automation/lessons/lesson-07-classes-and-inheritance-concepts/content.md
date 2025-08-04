# Lesson 7: Classes and Inheritance Concepts

## Learning Objectives
After completing this lesson, you will be able to:
- Understand the basic concepts of Object-Oriented Programming (OOP).
- Define a `class` in TypeScript.
- Create properties and methods within a class.
- Use the `constructor` to initialize class instances.
- Instantiate a class to create objects.
- Understand the concept of `inheritance` to create specialized classes.

## Introduction to Classes and OOP
Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects". A **class** is a blueprint for creating objects. It bundles together related data (properties) and functions that operate on that data (methods).

**Automation Analogy:** Think of a `class` as the architectural blueprint for a house. The blueprint defines that a house has properties (like `numberOfDoors`, `color`) and methods (like `openDoor()`, `turnOnLights()`). An **object** (or **instance**) is the actual house you build from that blueprint. You can build many houses (objects) from the same blueprint (class), and each can have different property values (e.g., one house is blue, another is red).

In test automation, classes are the foundation of the **Page Object Model (POM)**, a design pattern where each page of your application is represented by a class.

## Defining a Class
Let's create a simple class to represent a user in our application.

```typescript
class User {
  // 1. Properties: These are the variables that belong to the class.
  // We define their names and types here.
  username: string;
  firstName: string;
  isLoggedIn: boolean;

  // 2. Constructor: A special method for creating and initializing an object created from a class.
  // It runs once when you create a new instance of the class.
  constructor(username: string, firstName: string) {
    console.log("A new User object is being created!");
    this.username = username;
    this.firstName = firstName;
    this.isLoggedIn = false; // Default value
  }

  // 3. Methods: These are the functions that belong to the class.
  // They define the actions the object can perform.
  login(): void {
    console.log(`${this.firstName} (${this.username}) is logging in...`);
    this.isLoggedIn = true;
  }

  logout(): void {
    console.log(`${this.firstName} is logging out...`);
    this.isLoggedIn = false;
  }

  getStatus(): string {
    return `${this.firstName} is ${this.isLoggedIn ? 'Logged In' : 'Logged Out'}.`;
  }
}
```
**The `this` keyword:** Inside a class, the `this` keyword refers to the specific instance of the object being worked on. `this.username` means "the username of *this specific* user object".

## Creating an Instance of a Class (Instantiating)
Now that we have the `User` blueprint, we can create actual user objects from it using the `new` keyword.

```typescript
// Create two different user objects from the same User class
const userOne = new User("standard_user", "Alice");
const userTwo = new User("locked_out_user", "Bob");

// Now we can interact with each instance independently.
userOne.login();
console.log(userOne.getStatus()); // Output: Alice is Logged In.

console.log(userTwo.getStatus()); // Output: Bob is Logged Out.
userTwo.login();
userTwo.logout();
console.log(userTwo.getStatus()); // Output: Bob is Logged Out.
```

## Inheritance
Inheritance is a core OOP principle that allows a class to **inherit** properties and methods from another class. This is powerful for creating specialized versions of a base class.

- **Base Class (or Parent Class):** The class being inherited from.
- **Derived Class (or Child Class):** The class that inherits. It gets all the functionality of the base class and can add its own.

**Automation Analogy:** Imagine you have a base blueprint for a "Vehicle" (`Base Class`). It has properties like `speed` and methods like `accelerate()`. You can then create specialized blueprints (`Derived Classes`) like "Car" and "Motorcycle" that inherit from "Vehicle". A "Car" gets everything from "Vehicle" but can add its own properties (`numberOfDoors`) and methods (`openTrunk()`).

Let's create a specialized `AdminUser` that inherits from our `User` class.

```typescript
// This is our base class from before
class User {
  username: string;
  firstName: string;
  isLoggedIn: boolean;

  constructor(username: string, firstName: string) {
    this.username = username;
    this.firstName = firstName;
    this.isLoggedIn = false;
  }

  login(): void {
    this.isLoggedIn = true;
    console.log(`${this.firstName} logged in.`);
  }
  // ... other methods
}

// The 'extends' keyword is used for inheritance.
class AdminUser extends User {
  // 1. Add a new property specific to AdminUser
  accessLevel: number;

  constructor(username: string, firstName: string, accessLevel: number) {
    // 2. 'super()' calls the constructor of the parent class (User).
    // This is required and must be the first thing in the constructor.
    super(username, firstName);
    this.accessLevel = accessLevel;
  }

  // 3. Add a new method specific to AdminUser
  deleteUser(targetUsername: string): void {
    console.log(`${this.firstName} (Admin) is deleting user: ${targetUsername}.`);
  }
}

// Now let's create an AdminUser instance
const admin = new AdminUser("admin_user", "Carol", 5);

admin.login(); // This method is INHERITED from the User class!
admin.deleteUser("some_other_user"); // This is the AdminUser's own method.

console.log(admin.username); // Property inherited from User
console.log(admin.accessLevel); // Property specific to AdminUser
```

## Summary
- A **class** is a blueprint for creating objects.
- **Properties** are the data/variables of a class.
- **Methods** are the functions of a class.
- The **constructor** is a special method that initializes a new object instance.
- The `this` keyword refers to the current instance of the class.
- Use the `new` keyword to create an **instance** (object) of a class.
- **Inheritance** (`extends` keyword) allows you to create a specialized child class that gets all the properties and methods of a parent class, and can add its own.
- Classes are the fundamental building block for the **Page Object Model**, which you will learn to build in later modules.