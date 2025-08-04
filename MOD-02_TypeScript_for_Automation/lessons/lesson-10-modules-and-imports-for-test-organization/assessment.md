# Lesson 10 Assessment: Modules and Imports for Test Organization

## Multiple Choice Questions

1.  **In TypeScript, what is considered a module?**
    a)  Only files that contain the `export` keyword.
    b)  Only files that contain the `import` keyword.
    c)  Every `.ts` file.
    d)  Only class files.

2.  **How do you import a **named export** named `MyClass` from a file located at `../utils/helpers.ts`?**
    a)  `import MyClass from "../utils/helpers";`
    b)  `import { MyClass } from "../utils/helpers";`
    c)  `import * as MyClass from "../utils/helpers";`
    d)  `require { MyClass } from "../utils/helpers";`

3.  **How many **default exports** can a single module have?**
    a)  Unlimited
    b)  As many as you want, plus one default.
    c)  Exactly one.
    d)  None.

4.  **What is the primary benefit of organizing a test framework into modules?**
    a)  It makes the tests run faster.
    b)  It reduces the number of files in the project.
    c)  It improves organization, maintainability, and scalability by separating concerns.
    d)  It automatically type-checks all the code.

5.  **You see the following line of code: `import User, { UserRole } from './user-model';`. What does this line imply about the `user-model.ts` file?**
    a)  It has two named exports: `User` and `UserRole`.
    b)  It has two default exports: `User` and `UserRole`.
    c)  It has a default export (`User`) and a named export (`UserRole`).
    d)  It has a named export (`User`) and a default export (`UserRole`).

## Practical Exercise

This exercise will have you structure a small part of a test automation framework by separating concerns into different files (modules).

**Setup:**
Create the following file structure inside a `src` directory:
```
src/
├── pages/
│   └── inventory-page.ts
├── utils/
│   └── test-data.ts
└── tests/
    └── inventory-test.ts
```

1.  **Create Test Data (`test-data.ts`):**
    -   In `src/utils/test-data.ts`, define and export an `interface` named `UserCredentials`. It should have `username` and `password` properties, both of type `string`.
    -   Create and export a `const` named `standardUser` that conforms to the `UserCredentials` interface. Give it some sample data (e.g., `username: 'standard_user'`, `password: 'secret_sauce'`).
    -   Use **named exports** for both the interface and the constant.

2.  **Create a Page Object (`inventory-page.ts`):**
    -   In `src/pages/inventory-page.ts`, create a `class` named `InventoryPage`.
    -   The class should have a method `getInventoryItemNames()` which returns an array of strings (`string[]`). For this exercise, just have it return a hardcoded array like `['Sauce Labs Backpack', 'Sauce Labs Bike Light']`.
    -   Make the `InventoryPage` class the **default export** of this module.

3.  **Create the Test File (`inventory-test.ts`):**
    -   In `src/tests/inventory-test.ts`, you need to bring everything together.
    -   **Import** the `standardUser` object and the `UserCredentials` interface from `../utils/test-data.ts`.
    -   **Import** the `InventoryPage` class from `../pages/inventory-page.ts`.
    -   Inside this file, write a few lines of code to:
        -   Create a new instance of the `InventoryPage` class.
        -   Call the `getInventoryItemNames()` method and store the result in a variable.
        -   Log the `username` of the imported `standardUser` to the console.
        -   Log the array of item names you retrieved from the page object.

## Answer Key

### Multiple Choice
1.  c) Every `.ts` file.
2.  b) `import { MyClass } from "../utils/helpers";`
3.  c) Exactly one.
4.  c) It improves organization, maintainability, and scalability by separating concerns.
5.  c) It has a default export (`User`) and a named export (`UserRole`).

### Practical Exercise (Example Solution)

**`src/utils/test-data.ts`**
```typescript
export interface UserCredentials {
  username: string;
  password: string;
}

export const standardUser: UserCredentials = {
  username: 'standard_user',
  password: 'secret_sauce'
};
```

**`src/pages/inventory-page.ts`**
```typescript
export default class InventoryPage {
  getInventoryItemNames(): string[] {
    // In a real test, this would use Playwright to get element texts
    return ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
  }
}
```

**`src/tests/inventory-test.ts`**
```typescript
import { standardUser, UserCredentials } from '../utils/test-data';
import InventoryPage from '../pages/inventory-page';

console.log(`--- Starting Inventory Test ---`);
console.log(`Logging in with user: ${standardUser.username}`);

const inventoryPage = new InventoryPage();
const itemNames = inventoryPage.getInventoryItemNames();

console.log("Found the following items on the page:");
console.log(itemNames);