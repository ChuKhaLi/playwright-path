# Lesson 7: Integrating the Page Object Model (POM) with Cucumber

## 1. Introduction

Welcome to Lesson 7! Now that we have a good understanding of Cucumber, it's time to introduce a design pattern that will make our test automation framework more robust, maintainable, and scalable: the **Page Object Model (POM)**.

In this lesson, we'll learn how to combine the power of BDD with Cucumber and the structure of POM to create a clean and efficient testing architecture.

## 2. Learning Objectives

By the end of this lesson, you will be able to:

- Understand the principles and benefits of the Page Object Model.
- Structure a Playwright project using the POM pattern.
- Create Page Objects for different pages of a web application.
- Integrate Page Objects into your Cucumber step definitions.
- Refactor existing step definitions to use Page Objects.
- Appreciate how POM improves code reusability and maintainability.

## 3. What is the Page Object Model?

The Page Object Model is a design pattern that encourages us to create an object for each page (or major component) of our web application. This object, or "Page Object," encapsulates all the interactions and elements of that page.

### Key Principles of POM:

- **Separation of Concerns:** Test scripts are separated from the page-specific code. Tests define *what* to do, while Page Objects define *how* to do it.
- **Encapsulation:** The internal structure of a page (locators, elements) is hidden from the tests.
- **Reusability:** Page Objects can be reused across multiple tests.
- **Maintainability:** If the UI changes, you only need to update the corresponding Page Object, not every test that interacts with that page.

### A Typical POM Structure:

```
- features/
  - login.feature
- src/
  - pages/
    - LoginPage.ts
    - HomePage.ts
  - step-definitions/
    - loginSteps.ts
- support/
  - hooks.ts
```

## 4. Creating a Page Object

Let's create a simple `LoginPage` object.

```typescript
// src/pages/LoginPage.ts
import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#user-name");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.errorMessage = page.locator(".error-message-container");
  }

  async navigate() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }
}
```

## 5. Integrating POM with Step Definitions

Now, let's refactor our step definitions to use the `LoginPage` object.

### World Context

First, we need to make our Page Objects available in the `World` context so they can be accessed from step definitions.

```typescript
// src/support/world.ts
import { setWorldConstructor, World } from "@cucumber/cucumber";
import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

export class CustomWorld extends World {
  page!: Page;
  loginPage!: LoginPage;
  homePage!: HomePage;

  constructor(options: any) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
```

And update our hooks to initialize the pages:

```typescript
// src/support/hooks.ts
import { Before } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

Before(async function (this: CustomWorld) {
  this.loginPage = new LoginPage(this.page);
  this.homePage = new HomePage(this.page);
});
```

### Refactored Step Definitions

Now our step definitions become much cleaner and more readable.

```typescript
// src/step-definitions/loginSteps.ts
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

Given("I am on the login page", async function (this: CustomWorld) {
  await this.loginPage.navigate();
});

When("I enter username {string} and password {string}", async function (this: CustomWorld, username, password) {
  await this.loginPage.login(username, password);
});

Then("I should be on the home page", async function (this: CustomWorld) {
  await expect(this.homePage.title).toBeVisible();
});

Then("I should see an error message", async function (this: CustomWorld) {
  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage).toContain("Epic sadface:");
});
```

## 6. Conclusion

By integrating the Page Object Model with Cucumber, we create a powerful and scalable test automation framework. This separation of concerns makes our tests easier to read, write, and maintain.

In the next lesson, we'll explore how to generate living documentation and reports from our Cucumber tests.