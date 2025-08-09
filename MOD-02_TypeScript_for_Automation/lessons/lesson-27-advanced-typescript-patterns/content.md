# Lesson 27: Advanced TypeScript Patterns for Automation

## Learning Objectives
- Learn and apply the Builder pattern for complex test data creation.
- Understand and implement the Factory pattern for creating different types of page objects or drivers.
- Explore the Singleton pattern for managing shared resources like a test configuration or a database connection.
- Combine these patterns to build a robust, scalable, and maintainable test automation framework.

## Introduction
Design patterns are reusable solutions to commonly occurring problems within a given context. In test automation, applying design patterns helps create frameworks that are more organized, flexible, and easier to maintain. In this lesson, we'll explore three powerful patterns—Builder, Factory, and Singleton—and see how to implement them effectively using TypeScript.

## The Builder Pattern
The Builder pattern is used to construct complex objects step by step. It's particularly useful for creating test data where you need to set many optional parameters and want to improve readability.

### Problem
Imagine creating a user object with many optional fields. The constructor would become huge and hard to use.

```typescript
// Hard to read and easy to make mistakes
const user = new User(1, "test", "test@test.com", "pass", true, false, "en", "US", undefined, "some bio...");
```

### Solution with the Builder Pattern
The Builder pattern separates the construction of an object from its representation.

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
  isVerified?: boolean;
}

class UserBuilder {
  private user: Partial<User> = {};

  withId(id: number): this {
    this.user.id = id;
    return this;
  }

  withUsername(username: string): this {
    this.user.username = username;
    return this;
  }

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  asAdmin(isAdmin: boolean): this {
    this.user.isAdmin = isAdmin;
    return this;
  }
  
  build(): User {
    // You can set default values here
    const defaultUser: Partial<User> = { isAdmin: false, isVerified: true };
    return { ...defaultUser, ...this.user } as User;
  }
}

// Now, creating a user is much more readable
const adminUser = new UserBuilder()
  .withId(101)
  .withUsername("admin-user")
  .withEmail("admin@example.com")
  .asAdmin(true)
  .build();
```

## The Factory Pattern
The Factory pattern provides an interface for creating objects in a superclass but lets subclasses alter the type of objects that will be created. It's perfect for situations where you need to create different but related objects based on some condition.

### Use Case: Creating Page Objects
In a test framework, you might have different page objects for different versions of your application (e.g., desktop vs. mobile).

```typescript
import { Page } from 'playwright';

interface ILoginPage {
  login(user: string, pass: string): Promise<void>;
}

class DesktopLoginPage implements ILoginPage {
  constructor(private page: Page) {}
  async login(user: string, pass: string) { /* ... desktop implementation ... */ }
}

class MobileLoginPage implements ILoginPage {
  constructor(private page: Page) {}
  async login(user: string, pass: string) { /* ... mobile implementation ... */ }
}

// The Factory
class PageFactory {
  static getLoginPage(page: Page, deviceType: 'desktop' | 'mobile'): ILoginPage {
    if (deviceType === 'mobile') {
      return new MobileLoginPage(page);
    }
    return new DesktopLoginPage(page);
  }
}

// Usage in a test
const device: 'desktop' | 'mobile' = process.env.IS_MOBILE ? 'mobile' : 'desktop';
const loginPage = PageFactory.getLoginPage(page, device);
await loginPage.login("user", "pass");
```

## The Singleton Pattern
The Singleton pattern ensures that a class has only one instance and provides a global point of access to it. This is useful for managing shared resources that should not be created more than once, such as a test configuration object or a database connection pool.

### Implementation
```typescript
class TestConfig {
  private static instance: TestConfig;
  public readonly baseUrl: string;
  public readonly timeout: number;

  // The constructor is private to prevent direct instantiation
  private constructor() {
    // In a real scenario, you would load this from a file or environment variables
    this.baseUrl = process.env.BASE_URL || "https://default.example.com";
    this.timeout = Number(process.env.TIMEOUT) || 30000;
  }

  // The static method that controls access to the singleton instance
  public static getInstance(): TestConfig {
    if (!TestConfig.instance) {
      TestConfig.instance = new TestConfig();
    }
    return TestConfig.instance;
  }
}

// Usage
// No matter how many times you call getInstance(), you get the same object.
const config1 = TestConfig.getInstance();
const config2 = TestConfig.getInstance();

console.log(config1 === config2); // true
console.log(config1.baseUrl);
```

## Summary
- The **Builder pattern** is excellent for creating complex objects, especially test data, in a readable and maintainable way.
- The **Factory pattern** is used to create objects without specifying the exact class of object that will be created, which is great for handling variations like different page objects.
- The **Singleton pattern** ensures a class has only one instance, which is ideal for managing shared resources like configuration.

By combining these patterns, you can build a test automation framework that is not only powerful and reliable but also highly scalable and easy for other engineers to understand and contribute to.