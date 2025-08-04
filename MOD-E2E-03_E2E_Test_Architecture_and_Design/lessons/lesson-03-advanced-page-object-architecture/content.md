# Lesson 3: Advanced Page Object Architecture

## 1. Beyond Basic POM

The basic Page Object Model is great for simple pages, but modern web applications are often built from reusable components (headers, footers, navigation bars, modals) that appear on multiple pages. A flat POM structure leads to code duplication and maintenance headaches. We need more advanced patterns.

## 2. Component-Based Page Objects

Instead of treating a whole page as one object, we can break it down into smaller, reusable component objects.

**Example:** A `HeaderComponent` that appears on every page.

**1. Create the Component (`components/HeaderComponent.ts`)**
```typescript
import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#header-search-input');
    this.searchButton = page.locator('#header-search-button');
    this.cartLink = page.locator('#header-cart-link');
  }

  async search(text: string) {
    await this.searchInput.fill(text);
    await this.searchButton.click();
  }
}
```

**2. Use the Component in a Page Object (`pages/HomePage.ts`)**
```typescript
import { Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export class HomePage {
  readonly page: Page;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page); // Compose the component
  }

  async navigate() {
    await this.page.goto('/');
  }
}
```

**3. Use in a Test**
```typescript
test('should search from the homepage', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  await homePage.header.search('Playwright'); // Access component methods
  // ... assertions
});
```
This approach is highly reusable and follows the Single Responsibility Principle.

## 3. Fluent Interfaces

A fluent interface (also known as method chaining) makes your tests more readable by returning an instance of a page object from a method.

**Example:** A login method that returns the `HomePage` object upon success.

```typescript
// In pages/LoginPage.ts
import { HomePage } from './HomePage';

export class LoginPage {
  // ... locators and constructor

  async login(username: string, password?: string): Promise<HomePage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return new HomePage(this.page); // Return the next page object
  }
}

// In a test file
test('should navigate to homepage after login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = await loginPage.login('user', 'pass'); // Fluent call
  await expect(homePage.header.cartLink).toBeVisible();
});
```
This creates a "flow" in your tests that mimics user navigation, making them highly readable.

## 4. Separating Actions and Assertions

A common debate is whether assertions belong in page objects. A scalable approach is to keep them separate.

- **Page Objects (Actions):** Should only contain methods that *interact* with the page (click, fill, navigate). They should return data (`string`, `boolean`) or other page objects.
- **Test Files (Assertions):** Should contain the `expect` calls. The test is responsible for *verifying* the state of the application.

This separation makes page objects more reusable. The same `login` method can be used in a test that expects success and a test that expects failure.

**A more advanced approach uses dedicated "Assertion Objects".**

**1. Create an Assertion Object (`pages/LoginPage.assertions.ts`)**
```typescript
import { expect, Page } from '@playwright/test';
import { LoginPage } from './LoginPage';

export class LoginPageAssertions {
  private loginPage: LoginPage;

  constructor(loginPage: LoginPage) {
    this.loginPage = loginPage;
  }

  async toHaveErrorMessage(message: string) {
    await expect(this.loginPage.errorMessage).toBeVisible();
    await expect(this.loginPage.errorMessage).toHaveText(message);
  }
}
```

**2. Add it to the Page Object**
```typescript
// In pages/LoginPage.ts
import { LoginPageAssertions } from './LoginPage.assertions';

export class LoginPage {
  // ...
  public readonly expect: LoginPageAssertions;

  constructor(page: Page) {
    // ...
    this.expect = new LoginPageAssertions(this);
  }
  // ...
}
```

**3. Use in a Test**
```typescript
test('should show error on failure', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('bad', 'creds');
  await loginPage.expect.toHaveErrorMessage('Invalid credentials');
});
```
This keeps assertions cleanly separated but still discoverable and linked to the page.

## 5. Using a `BasePage`

To avoid duplicating code like waiting for page loads or accessing the header, you can create a `BasePage` that all other pages inherit from.

```typescript
// pages/BasePage.ts
import { Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export abstract class BasePage {
  readonly page: Page;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }
}

// pages/HomePage.ts
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page); // Call the parent constructor
  }
  // ... HomePage specific methods
}
```
Now, every page object that extends `BasePage` will automatically have a `header` property and a `waitForPageLoad` method.