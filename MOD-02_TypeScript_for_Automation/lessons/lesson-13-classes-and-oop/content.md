# Lesson 13: Classes and Object-Oriented Programming (OOP)

## Learning Objectives
- Understand the basic principles of Object-Oriented Programming (OOP): encapsulation, inheritance, and polymorphism.
- Learn how to define and instantiate classes in TypeScript.
- Use constructors, properties, and methods.
- Implement inheritance to create specialized classes.
- Understand access modifiers: `public`, `private`, and `protected`.

## Introduction
Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects," which can contain data (in the form of fields, often known as attributes or properties) and code (in the form of procedures, often known as methods).

In test automation, OOP is the foundation of the **Page Object Model (POM)**, a design pattern that creates a more maintainable and scalable test suite.

## Core OOP Principles
- **Encapsulation:** Bundling data (properties) and the methods that operate on that data into a single unit (a class). This hides the internal state of an object from the outside.
- **Inheritance:** Allowing a new class (subclass or derived class) to inherit properties and methods from an existing class (superclass or base class).
- **Polymorphism:** Allowing objects of different classes to be treated as objects of a common superclass. It means "many forms."

## Classes in TypeScript
A class is a blueprint for creating objects.

### Defining a Class
Here's a simple class to represent a user.

```typescript
class User {
  // Properties (attributes of the object)
  id: number;
  username: string;
  private email: string; // This property is not accessible from outside the class

  // The constructor is a special method for creating and initializing an object
  constructor(id: number, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  // A method (a function that belongs to the class)
  getProfileSummary(): string {
    return `User: ${this.username} (ID: ${this.id})`;
  }
}

// Instantiating (creating an instance of) the class
const user1 = new User(101, "johndoe", "john.doe@example.com");
console.log(user1.getProfileSummary()); // "User: johndoe (ID: 101)"
console.log(user1.username); // "johndoe"
// console.log(user1.email); // Error: Property 'email' is private and only accessible within class 'User'.
```

### Access Modifiers
TypeScript provides keywords to control the visibility of class members.
- **`public`:** (Default) The member can be accessed from anywhere.
- **`private`:** The member can only be accessed from within the class itself.
- **`protected`:** The member can be accessed from within the class and by any subclasses.

This is encapsulation in action. By making `email` private, we protect it from being accessed or modified directly from outside the `User` class.

## Inheritance
Inheritance allows us to create a new class that reuses, extends, and modifies the behavior of another class.

Let's create a `BasePage` class for a website, which will be the foundation for all other page objects.

```typescript
import { Page } from 'playwright'; // Assuming you have Playwright types

class BasePage {
  protected readonly page: Page; // Accessible by this class and subclasses
  public readonly url: string;

  constructor(page: Page, url: string) {
    this.page = page;
    this.url = url;
  }

  async navigate() {
    await this.page.goto(this.url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}
```

Now, we can create a specific `LoginPage` that **inherits** from `BasePage`.

```typescript
class LoginPage extends BasePage {
  // Private locators for the login page elements
  private readonly usernameInput = '#username';
  private readonly passwordInput = '#password';
  private readonly loginButton = '#login-button';

  // The constructor calls the parent constructor using super()
  constructor(page: Page) {
    super(page, "/login"); // Pass the required arguments to the BasePage constructor
  }

  // A method specific to the LoginPage
  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
}
```
The `LoginPage` automatically gets the `navigate` and `getTitle` methods from `BasePage` without having to redefine them. This is code reuse in action.

## Polymorphism
Polymorphism allows us to treat objects of different classes in a similar way. For example, if we had a `HomePage` and a `DashboardPage` that both extend `BasePage`, we could have an array of `BasePage` objects and call `navigate` on each one, regardless of their specific type.

```typescript
// Assume we have instances of LoginPage, HomePage, etc.
const pages: BasePage[] = [new LoginPage(page), new HomePage(page)];

// We can iterate and call the common method
pages.forEach(p => {
  p.navigate(); // This works because all objects in the array are guaranteed to have a navigate method.
});
```

## Summary
- **Classes** are blueprints for creating objects, bundling data (properties) and behavior (methods).
- **OOP principles** like encapsulation, inheritance, and polymorphism help create organized, maintainable, and scalable code.
- **Access modifiers** (`public`, `private`, `protected`) control the visibility of class members, enforcing encapsulation.
- **Inheritance** (`extends` keyword) is a powerful tool for code reuse, forming the basis of patterns like the Page Object Model.
- The **`super()`** keyword is used in a subclass's constructor to call the constructor of its parent class.

Classes are the cornerstone of building a robust test automation framework. Understanding them thoroughly is essential for your journey into advanced test architecture.