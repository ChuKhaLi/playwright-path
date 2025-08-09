# Lesson 18: Modules and Namespaces

## Learning Objectives
- Understand the importance of modules for organizing code in a large project.
- Learn how to use ES Modules (`import`/`export`) to share code between files.
- Understand the concept of namespaces and when they might be used.
- Apply modular patterns to structure a test automation project effectively.

## Introduction
As a test automation suite grows, keeping all your code in a few large files becomes unmanageable. Modules and namespaces are TypeScript's primary tools for organizing and structuring your code into logical, maintainable pieces. For modern development, ES Modules are the standard and preferred approach.

## ES Modules (`import`/`export`)
A module is just a file. TypeScript, like modern JavaScript, uses the ES Module standard, where each file is its own module. You can explicitly mark what code is available to other files (`export`) and which code you want to use from other files (`import`).

### Exporting from a Module
You can export any declaration (variable, function, class, interface, etc.) by adding the `export` keyword.

**`src/utils/string-helpers.ts`**
```typescript
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export const PI = 3.14159;

export interface StringValidator {
  isValid(s: string): boolean;
}
```

You can also have a single **default export** per file.

**`src/utils/logger.ts`**
```typescript
export default class Logger {
  log(message: string) {
    console.log(message);
  }
}
```

### Importing into a Module
You use the `import` keyword to consume exported code.

**`tests/my-test.ts`**
```typescript
// Importing named exports
import { toUpperCase, StringValidator } from '../utils/string-helpers';

// Importing a default export (you can name it anything, 'MyLogger' here)
import MyLogger from '../utils/logger';

const logger = new MyLogger();

const greeting = "hello world";
logger.log(toUpperCase(greeting)); // HELLO WORLD

class EmailValidator implements StringValidator {
  isValid(s: string): boolean {
    return s.includes('@');
  }
}
```

### Structuring a Test Automation Project
Modules are the key to organizing a test framework. A typical structure might look like this:

```
/
├── tests/
│   ├── login.spec.ts       (Imports LoginPage and test data)
│   └── dashboard.spec.ts
├── page-objects/
│   ├── base-page.ts        (Exports a BasePage class)
│   ├── login-page.ts       (Exports a LoginPage class, imports BasePage)
│   └── dashboard-page.ts
├── utils/
│   ├── api-client.ts       (Exports functions for making API calls)
│   └── test-data-factory.ts(Exports functions for creating test data)
└── tsconfig.json
```
This modular approach makes the code easier to find, reuse, and maintain.

## Namespaces
Before ES Modules became the standard, TypeScript used **namespaces** to organize code and avoid naming conflicts in the global scope. A namespace is a way to group related code under a single object name.

```typescript
namespace MyMath {
  export function add(x: number, y: number): number {
    return x + y;
  }
  export const E = 2.71828;
}

// To use code from a namespace, you prefix it with the namespace name.
console.log(MyMath.add(5, 3)); // 8
console.log(MyMath.E);
```

### Namespaces vs. Modules: Which to Use?
**For all modern projects, you should use ES Modules (`import`/`export`).**

- **Modules** are file-based and are the standard in the JavaScript ecosystem. They encourage a clear separation of concerns and have better support from tooling (like bundlers and tree-shakers).
- **Namespaces** are a TypeScript-specific feature that is now largely considered a legacy approach for organizing code. They can still be useful in some specific scenarios, like organizing types in a declaration file (`.d.ts`) for a library that wasn't written with modules in mind, but for application code, modules are the way to go.

The official TypeScript documentation states: **"We recommend using modules for all new projects."**

## Summary
- **Modules** are the modern, standard way to organize TypeScript code. Each file is a module.
- Use `export` to make code available to other files and `import` to consume it.
- A well-structured test automation framework relies heavily on a modular architecture (e.g., separating page objects, utilities, and tests into different files/directories).
- **Namespaces** are a legacy TypeScript feature for grouping code. While you may encounter them in older codebases or declaration files, you should **prefer modules for all new development**.