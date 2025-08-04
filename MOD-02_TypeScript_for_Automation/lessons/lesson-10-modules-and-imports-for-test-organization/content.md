# Lesson 10: Modules and Imports for Test Organization

## Learning Objectives
After completing this lesson, you will be able to:
- Explain what a module is in TypeScript.
- Use the `export` keyword to make code available to other files.
- Use the `import` keyword to use code from other modules.
- Differentiate between named exports and default exports.
- Structure a test project by separating concerns into different modules.

## Introduction
As your test suite grows, putting all your code into a single file becomes unmanageable. Imagine having all your page objects, helper functions, test data, and actual tests in one giant file! It would be impossible to navigate and maintain.

**Modules** solve this problem. A module is simply a file. In TypeScript, every file is a module. By default, the code inside a module is private to that module. To make it available to other parts of your program, you must explicitly **export** it. To use it in another file, you must **import** it.

This is the key to creating a well-organized, scalable test automation framework.

## The `export` Keyword
The `export` keyword marks a variable, function, class, or interface as "public," meaning it can be used by other modules.

### Named Exports
This is the most common approach. You can have many named exports from a single file.

**Automation Example:** Let's create a file for utility functions.

**File: `src/utils/string-helpers.ts`**
```typescript
// Exporting a function
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

// Exporting a constant
export const PI = 3.14159;

// Exporting an interface
export interface StringValidator {
  isValid(s: string): boolean;
}
```
Here, we have exported three things from this module: `toUpperCase`, `PI`, and `StringValidator`.

## The `import` Keyword
The `import` keyword is used to bring exported code from another module into the current module.

**File: `src/tests/my-first-test.ts`**
```typescript
// Use curly braces {} for named imports
// The path must be a relative path to the other file.
import { toUpperCase, PI, StringValidator } from "../utils/string-helpers";

// Now we can use the imported code
const greeting = "hello world";
const upperGreeting = toUpperCase(greeting);
console.log(upperGreeting); // Output: HELLO WORLD

console.log(`The value of PI is approximately ${PI}`);

// We can use the imported interface
class EmailValidator implements StringValidator {
  isValid(s: string): boolean {
    return s.includes("@");
  }
}
```

## Default Exports
A module can also have one (and only one) **default export**. This is often used when a file's primary purpose is to export a single class or function.

**Automation Example:** Creating a `LoginPage` class in its own file.

**File: `src/pages/login-page.ts`**
```typescript
// This class is the main thing this file provides, so we make it the default export.
export default class LoginPage {
  login(): void {
    console.log("Logging in...");
  }
}

// You can still have named exports alongside a default export
export const loginPageUrl = "/login";
```

### Importing a Default Export
When importing a default export, you don't use curly braces. You can also give it any name you want during the import, though it's best practice to use a name that reflects what it is.

**File: `src/tests/login-test.ts`**
```typescript
// Import the default export and give it the name 'MyLoginPage'
// Also import a named export from the same file
import MyLoginPage, { loginPageUrl } from "../pages/login-page";

const loginPage = new MyLoginPage();
loginPage.login(); // Output: Logging in...

console.log(`Navigating to: ${loginPageUrl}`); // Output: Navigating to: /login
```

## Structuring a Test Automation Project
Modules are the foundation of project structure. A typical Playwright project might be organized like this:

```
my-playwright-project/
├── src/
│   ├── pages/                # Each file is a Page Object class
│   │   ├── login-page.ts
│   │   └── home-page.ts
│   ├── tests/                # The actual test files
│   │   ├── login.spec.ts
│   │   └── search.spec.ts
│   └── utils/                # Reusable helper functions
│       ├── api-helpers.ts
│       └── test-data.ts
└── package.json
└── tsconfig.json
```
-   `login.spec.ts` would `import` the `LoginPage` class from `pages/login-page.ts`.
-   Both test files might `import` helper functions from `utils/api-helpers.ts`.
-   This separation of concerns makes the project easy to understand, maintain, and scale.

## Summary
-   In TypeScript, every file is a **module**.
-   Use the `export` keyword to make code from one module available to others.
-   Use the `import` keyword to consume exported code in another module.
-   **Named exports** (`export const x`) are imported with curly braces (`import { x }`). You can have many.
-   A **default export** (`export default class Y`) is imported without curly braces (`import Y`). You can only have one per module.
-   A modular approach is **essential** for building a clean, scalable, and maintainable test automation framework. It allows you to separate your page objects, tests, and utilities into logical files.