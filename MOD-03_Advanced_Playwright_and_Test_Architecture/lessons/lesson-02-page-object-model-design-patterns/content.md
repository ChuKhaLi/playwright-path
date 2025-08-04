# Lesson 2: Page Object Model (POM) Design Patterns

## 1. What is the Page Object Model?

The Page Object Model (POM) is a design pattern that has become popular in test automation for enhancing test maintenance and reducing code duplication. The core idea is to create an object repository for the UI elements of the application.

In POM, each web page in the application is represented by a corresponding "Page Object" class. This class includes:
- **Locators:** The definitions of the UI elements on the page.
- **Methods:** The user interactions that can be performed on those elements.

This separation of concerns is the key benefit. Your test scripts use the methods of the Page Object class, which hides the underlying implementation details of the locators and interactions.

## 2. Advantages of Using POM

- **Maintainability:** If the UI changes, you only need to update the locator in one place—the Page Object class—instead of every test that uses it.
- **Reusability:** The same Page Object methods can be used across multiple test cases, reducing code duplication.
- **Readability:** Test scripts become cleaner and more readable because they are written in terms of user interactions, not low-level UI details. For example, `loginPage.login('user', 'pass')` is much clearer than a series of `fill` and `click` commands.

## 3. Creating a Basic Page Object

Let's create a Page Object for a simple login page.

**The Login Page (`https://example.com/login`)**
- Username input field
- Password input field
- Login button

### Step 1: Create the Project Structure

It's a best practice to keep your Page Objects in a dedicated directory.

```
project-root/
├── tests/
│   └── example.spec.ts
├── pages/
│   └── login-page.ts
└── playwright.config.ts
```

### Step 2: Define the Page Object Class

Create the `LoginPage` class in `pages/login-page.ts`.

```typescript
// pages/login-page.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  // Properties
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  // Constructor
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.errorMessage = page.getByText('Invalid username or password');
  }

  // Methods
  async goto() {
    await this.page.goto('https://example.com/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

**Explanation:**
- We import `Page` and `Locator` types from Playwright.
- The `LoginPage` class has a `page` property to hold the Playwright `Page` instance.
- In the `constructor`, we initialize the locators for the elements on the page. Using `readonly` ensures they are not accidentally reassigned.
- We create methods that represent user actions: `goto()` to navigate to the page and `login()` to perform the login action.

## 4. Using the Page Object in a Test

Now, let's refactor a test to use our new `LoginPage` object.

**Before POM (in `tests/example.spec.ts`):**

```typescript
import { test, expect } from '@playwright/test';

test('should show error on invalid login', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.getByLabel('Username').fill('wrong-user');
  await page.getByLabel('Password').fill('wrong-pass');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByText('Invalid username or password')).toBeVisible();
});
```

**After POM (in `tests/example.spec.ts`):**

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test('should show error on invalid login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('wrong-user', 'wrong-pass');

  await expect(loginPage.errorMessage).toBeVisible();
});
```

Notice how much cleaner the test is. The test script describes the *what* (go to the login page, attempt to log in, expect an error), while the Page Object handles the *how* (the specific locators and clicks).

## 5. Best Practices for POM

- **One Page Object per Page:** Each Page Object should correspond to a single page or a significant component of your application.
- **No Assertions in Page Objects:** Page Objects should not contain assertions (`expect`). Their job is to provide access to page elements and encapsulate interactions. Assertions belong in the test files.
- **Return Other Page Objects:** If an action on one page leads to another (e.g., a successful login navigates to the dashboard), the method can return a new Page Object for the destination page.
  ```typescript
  // In LoginPage
  async loginSuccessfully(user, pass): Promise<DashboardPage> {
    await this.login(user, pass);
    return new DashboardPage(this.page);
  }
  ```
- **Use descriptive method names:** `login()` is better than `fillFormAndClickSubmit()`.

## 6. Summary

The Page Object Model is a powerful pattern for building robust and maintainable test automation frameworks. By separating test logic from UI interaction logic, you create a codebase that is easier to read, update, and scale. In the next lessons, we will build upon this foundation to create even more sophisticated and scalable test architectures.