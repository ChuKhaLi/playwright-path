# Lesson 3: Implementing a Basic Page Object Model (POM) in Playwright

## 1. Introduction

Welcome to the first hands-on implementation of the Page Object Model (POM) in Playwright. In this lesson, we'll take the theory from the previous lesson and apply it to a real-world scenario. You'll learn how to structure your code to create reusable, maintainable, and readable tests.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

-   **Create a basic Page Object class:** Define a class that represents a page or a component on a page.
-   **Add locators to the class:** Store UI element locators as properties of the class.
-   **Implement action methods:** Write methods that encapsulate user interactions with the page.
-   **Use the Page Object in a test:** Instantiate and use the Page Object to write a clean and concise test script.
-   **Understand the benefits of POM:** See firsthand how POM improves code organization and reduces duplication.

## 3. What is a Page Object?

A Page Object is a class that encapsulates the logic for interacting with a specific page or component of your web application. Instead of scattering your locators and interaction logic throughout your test files, you centralize them in one place.

### Key Components of a Page Object:

-   **`page` instance:** A reference to the Playwright `Page` object.
-   **Locators:** Properties that hold the locators for the elements on the page.
-   **Action Methods:** Methods that perform actions on the page, such as `login()`, `search()`, or `navigateTo()`.

## 4. Creating Your First Page Object

Let's imagine we're testing a simple login page. The page has a username field, a password field, and a login button.

### Step 1: Create the Page Object File

First, create a new file to house your Page Object. A good practice is to have a `pages` directory in your project.

`tests/pages/login-page.ts`

### Step 2: Define the Class

Inside `login-page.ts`, define a class. It's a convention to name the class after the page it represents, followed by `Page`.

```typescript
// tests/pages/login-page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
    // Class properties will go here
}
```

### Step 3: Add the `page` Instance and Locators

The class needs access to the Playwright `page` object to interact with the browser. We'll pass it in through the constructor. We'll also define our locators as class properties.

```typescript
// tests/pages/login-page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
    }
}
```

**Best Practice:** Use `readonly` for locators to prevent them from being accidentally reassigned.

### Step 4: Implement Action Methods

Now, let's add methods that perform actions on the page. These methods will use the locators we just defined.

```typescript
// tests/pages/login-page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
    }

    async navigateTo() {
        await this.page.goto('/login');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
```

## 5. Using the Page Object in a Test

With our `LoginPage` class ready, we can now use it in a test file. This is where the benefits of POM become clear.

### Step 1: Create a Test File

`tests/specs/login.spec.ts`

### Step 2: Write the Test

Import the `LoginPage` class and use it to write your test.

```typescript
// tests/specs/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Login Functionality', () => {
    test('should allow a user to log in successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // Navigate to the login page
        await loginPage.navigateTo();

        // Perform the login
        await loginPage.login('testuser', 'password123');

        // Add an assertion to verify the login was successful
        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('h1')).toHaveText('Welcome, testuser!');
    });
});
```

### Why is this better?

-   **Readability:** The test is clean and easy to understand. It describes *what* is being tested, not *how*.
-   **Maintainability:** If a locator changes, you only need to update it in one place: the `LoginPage` class.
-   **Reusability:** The `login` method can be reused across multiple tests.

## 6. Conclusion

You've successfully implemented your first Page Object in Playwright! This pattern is the foundation of a scalable and maintainable test automation framework. As your application grows, so will your collection of Page Objects, creating a robust library for your tests.

In the next lesson, we'll explore advanced POM strategies to handle more complex scenarios.