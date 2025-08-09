# Lesson 3: Building the Test Framework Foundation

## 1. Introduction

With our project environment set up, it's time to build the core components of our test automation framework. This lesson focuses on the Page Object Model (POM), a design pattern that is fundamental to creating scalable and maintainable UI test automation.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

-   **Understand the Page Object Model:** Explain the principles of POM and its benefits.
-   **Create a Base Page:** Implement a `BasePage` class to hold common functionality shared across all page objects.
-   **Implement a Page Object:** Build your first page object for a specific page of the application under test.
-   **Use Locators Effectively:** Understand how to store and manage UI element locators within a page object.
-   **Career Context:** Articulate the value of design patterns like POM in building professional-grade test automation.

## 3. The Page Object Model (POM)

The Page Object Model is a design pattern that encourages us to create an object for each page (or major component) of our web application. This object, or "page object," contains all the locators and methods needed to interact with that specific page.

### Why Use POM?

-   **Separation of Concerns:** It separates the test logic (what to test) from the page interaction logic (how to interact with the page).
-   **Readability:** Tests become cleaner and easier to read because the implementation details are hidden away in the page objects.
-   **Maintainability:** If the UI changes, you only need to update the locator in one place (the page object) instead of in every test that uses it.
-   **Reusability:** Page objects and their methods can be reused across multiple tests.

## 4. Step 1: Creating a `BasePage`

Most pages in a web application share common elements, like a navigation bar or a footer. A `BasePage` is a great place to store locators and methods for these shared components.

Let's create our `BasePage` in `src/pages/base.page.ts`:

```typescript
import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
```

-   **`protected readonly page: Page`**: We store a reference to the Playwright `Page` object. It's `protected` so that child classes can access it.
-   **`constructor`**: The constructor takes the `Page` object as an argument.
-   **`navigateTo`**: A simple helper method to navigate to a given URL.

## 5. Step 2: Creating Your First Page Object

Let's assume our e-commerce site has a login page. We'll create a `LoginPage` object in `src/pages/login.page.ts`.

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page); // Call the BasePage constructor

    // Initialize locators
    this.usernameInput = this.page.locator('#username');
    this.passwordInput = this.page.locator('#password');
    this.loginButton = this.page.locator('button[type="submit"]');
  }

  // Methods
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}
```

-   **`extends BasePage`**: Our `LoginPage` inherits from `BasePage`, so it gets the `navigateTo` method for free.
-   **Locators:** We define our locators as `private readonly` properties. This encapsulates them within the page object.
-   **Methods:** We create methods that describe user actions (`enterUsername`, `clickLoginButton`). This makes our tests more readable.
-   **`login` method:** A higher-level method that combines several actions into a single, reusable workflow.

## 6. Career Development: Talking About Design Patterns

Being able to discuss design patterns like POM is a key differentiator in job interviews.

-   **Demonstrates Experience:** It shows you've moved beyond simple scripting and can think about building robust, long-term solutions.
-   **Problem-Solving:** Explaining *why* you chose a particular pattern demonstrates your problem-solving skills.
-   **Team Player:** Using established patterns makes your code easier for others to understand, which is crucial for teamwork.

## 7. Next Steps

With our first page object created, we're now ready to write our first E2E test that uses it. In the next lesson, we'll see how POM makes our tests clean, readable, and easy to maintain.