# Lesson 2: Assessment - Page Object Model (POM)

This assessment will test your understanding of the Page Object Model design pattern.

## Questions

### Question 1:
**What is the primary purpose of the Page Object Model?**
a) To make tests run faster.
b) To replace the need for assertions in tests.
c) To separate UI interaction logic from test case logic, improving maintainability and readability.
d) To automatically generate test data.

**Answer:**
c) To separate UI interaction logic from test case logic, improving maintainability and readability.

---

### Question 2:
**In a Page Object class, where should assertions (`expect` statements) be placed?**
a) Inside the constructor of the Page Object.
b) Inside the methods of the Page Object that perform actions.
c) Assertions should not be placed in Page Object classes; they belong in the test files.
d) In a separate `assertions.ts` file that is imported by the Page Object.

**Answer:**
c) Assertions should not be placed in Page Object classes; they belong in the test files. The role of the Page Object is to model the page and its interactions, not to verify outcomes.

---

### Question 3:
**Consider the following `LoginPage` class. What is missing from the `login` method?**

```typescript
// pages/login-page.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    // What's missing here?
  }
}
```
a) `await this.page.waitForLoadState('networkidle');`
b) `return new DashboardPage(this.page);`
c) `await this.loginButton.click();`
d) `await expect(this.loginButton).toBeEnabled();`

**Answer:**
c) `await this.loginButton.click();`. The method is intended to perform a full login, which includes clicking the login button after filling the credentials.

---

### Question 4:
**What is a key benefit of having a method in a Page Object return another Page Object? For example: `loginPage.loginSuccessfully(...)` returns a `DashboardPage` instance.**
a) It makes the code more complex but more complete.
b) It allows for chaining of page interactions in a fluent, readable way, modeling the user's journey through the application.
c) It is the only way to pass the `page` fixture between classes.
d) It reduces the number of locators you need to define.

**Answer:**
b) It allows for chaining of page interactions in a fluent, readable way, modeling the user's journey through the application. This creates a "fluent API" for your tests.