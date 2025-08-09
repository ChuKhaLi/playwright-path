# Lesson 14: TypeScript Automation Project Setup

## Learning Objectives
After completing this lesson, you will be able to:
-   Structure a test automation project with a logical folder hierarchy.
-   Configure `tsconfig.json` and `playwright.config.ts` for a custom project structure.
-   Implement a simple Page Object Model using TypeScript classes.
-   Create a clean, readable test that utilizes page objects and helper modules.
-   Tie together all the concepts learned throughout this module into a cohesive project.

## Introduction
Congratulations on making it to the final lesson of this module! You've learned about TypeScript fundamentals, types, functions, classes, async programming, and best practices. Now it's time to put it all together.

This lesson is a capstone project. We will walk through setting up a new Playwright project from scratch, but this time, we will implement a professional, scalable structure that uses all the concepts you've learned.

## Step 1: Project Initialization
Let's start by creating a new project.

1.  Create a new project directory and `cd` into it.
    ```bash
    mkdir professional-playwright-project
    cd professional-playwright-project
    ```
2.  Initialize Playwright with TypeScript.
    ```bash
    npm init playwright@latest
    ```
    (Choose TypeScript, default tests folder, no GitHub Actions).

## Step 2: Defining the Project Structure
A well-organized folder structure is critical for maintainability. Let's create a structure that separates our concerns.

Delete the default `tests` and `tests-examples` folders. Then, create the following structure inside your project root:

```
professional-playwright-project/
├── src/
│   ├── pages/          // For our Page Object Model classes
│   ├── tests/          // For our test files (.spec.ts)
│   └── utils/          // For reusable helpers and test data
└── package.json
└── playwright.config.ts
└── tsconfig.json
```
You can create these folders manually or from the command line.

## Step 3: Configuring the Project
Our code now lives in `src/`, but by default, Playwright looks for tests in a root-level `tests/` folder. We need to tell Playwright and TypeScript about our new structure.

### `playwright.config.ts`
Open `playwright.config.ts` and find the `testDir` property. Change it to point to our new tests folder.

```typescript
// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Change this line
  testDir: './src/tests',
  
  // ... rest of the config
});
```

### `tsconfig.json`
Open `tsconfig.json`. We want to tell the TypeScript compiler that our source code is in the `src` directory and that it should understand the Playwright types.

Make sure your `compilerOptions` include the following:
```json
{
  "compilerOptions": {
    "target": "es2021",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    // Add or modify these options
    "baseUrl": ".", // This allows for cleaner imports
    "paths": {
      "@pages/*": ["src/pages/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  // Add this line to include all files in src
  "include": ["src"]
}
```
The `baseUrl` and `paths` options are for creating "path aliases". This lets us write `import ... from '@pages/login-page'` instead of `import ... from '../../pages/login-page'`, which is much cleaner.

## Step 4: Creating a Page Object
Let's create a simple Page Object for the Sauce Demo login page.

**File: `src/pages/login-page.ts`**
```typescript
import { Page, Locator, expect } from '@playwright/test';

// A class for the login page
export class LoginPage {
  // It's good practice to make properties readonly if they won't be reassigned
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}
```

## Step 5: Creating Test Data
Let's create a file for our test data constants.

**File: `src/utils/test-data.ts`**
```typescript
export const TestUsers = {
  Standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  LockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
};

export const ErrorMessages = {
  LockedOutUser: 'Sorry, this user has been locked out.',
};
```

## Step 6: Writing the Test
Now, let's write a clean test that uses our Page Object and test data.

**File: `src/tests/login.spec.ts`**
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page'; // Using our path alias!
import { TestUsers, ErrorMessages } from '@utils/test-data';

test.describe('Login Functionality', () => {
  
  test('should allow a standard user to log in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.login(TestUsers.Standard.username, TestUsers.Standard.password);

    // Assert that the login was successful
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('should show an error for a locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(TestUsers.LockedOut.username, TestUsers.LockedOut.password);

    // Assert that the correct error message is shown
    await loginPage.assertErrorMessage(ErrorMessages.LockedOutUser);
  });
});
```

## Step 7: Running the Project
You're all set! From the root of your project, run the tests.

```bash
npx playwright test
```
Playwright will find and run the tests in `src/tests`, and everything should work perfectly. You have successfully built a small but professional test automation project structure.

## Module Recap
In this module, you have learned:
-   Why TypeScript is a great choice for test automation.
-   The fundamentals of TypeScript: variables, types, functions, and arrays.
-   How to structure data with objects and enforce that structure with interfaces.
-   How to use classes and inheritance, the building blocks of the Page Object Model.
-   How to handle asynchronous code with `async/await`, which is essential for Playwright.
-   How to handle errors and debug your code.
-   How to organize your code into modules for a scalable framework.
-   Best practices for writing clean, high-quality test code.

You are now fully prepared to tackle more advanced Playwright concepts and build robust, enterprise-grade test automation frameworks.