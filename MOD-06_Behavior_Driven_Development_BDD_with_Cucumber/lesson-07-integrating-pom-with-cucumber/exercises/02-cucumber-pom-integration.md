# Exercise 02: Cucumber-POM Integration

## Overview

This exercise focuses on integrating your Page Object Model implementation with Cucumber BDD testing. You'll create custom World objects, implement step definitions that use page objects, and design comprehensive BDD scenarios that leverage the page object pattern for maintainable and readable tests.

**Duration**: 60 minutes  
**Difficulty**: Intermediate  
**Prerequisites**: Exercise 01 completed, Cucumber fundamentals, BDD concepts  

## Learning Objectives

By completing this exercise, you will be able to:

- ✅ **Design World Objects**: Create custom World classes that manage page object lifecycle
- ✅ **Implement Step Definitions**: Write step definitions that cleanly integrate with page objects
- ✅ **Manage Page Context**: Handle page object initialization and state management
- ✅ **Handle Complex Scenarios**: Design BDD scenarios with multi-page workflows
- ✅ **Apply Hook Patterns**: Implement proper setup and teardown using Cucumber hooks

---

## Exercise Scenario

Building on the TechShop e-commerce application from Exercise 01, you'll create comprehensive BDD scenarios that cover complete user journeys. Your task is to integrate the page objects with Cucumber step definitions to create maintainable, readable test automation.

### BDD Scenarios to Implement

You'll be implementing these key user journeys:

1. **User Authentication Flow**
   - Login with valid/invalid credentials
   - Password reset functionality
   - Session management

2. **Product Discovery Journey**
   - Search and filter products
   - Browse categories
   - Compare products

3. **Shopping Cart Workflow**
   - Add/remove items
   - Update quantities
   - Checkout process

### Technical Integration Goals

- **World Object Pattern**: Custom World class managing page objects
- **Step Definition Library**: Reusable steps using page objects
- **Hook Integration**: Proper browser and page object lifecycle management
- **Context Sharing**: Data passing between steps and scenarios

---

## Setup Instructions

### 1. Project Structure

Extend your project structure from Exercise 01:

```
src/
├── pages/
│   ├── base/
│   │   └── BasePage.ts
│   ├── LoginPage.ts
│   ├── ProductCatalogPage.ts
│   └── ShoppingCartPage.ts
├── types/
│   └── page-types.ts
└── utils/
    └── test-helpers.ts

features/
├── step-definitions/
│   ├── authentication.steps.ts
│   ├── product-catalog.steps.ts
│   ├── shopping-cart.steps.ts
│   └── common.steps.ts
├── support/
│   ├── World.ts
│   ├── hooks.ts
│   └── cucumber.config.ts
└── *.feature

tests/
└── cucumber/
    └── integration.test.ts
```

### 2. Cucumber Configuration

First, create the Cucumber configuration:

```typescript
// features/support/cucumber.config.ts
import { setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber';
import { CustomWorld } from './World';

setDefaultTimeout(30000);
setWorldConstructor(CustomWorld);
```

### 3. Feature Files

Create these feature files to test against:

```gherkin
# features/authentication.feature
Feature: User Authentication
  As a customer
  I want to log into my account
  So that I can access personalized features

  Background:
    Given I am on the TechShop homepage

  Scenario: Successful login with valid credentials
    When I navigate to the login page
    And I enter valid login credentials
    Then I should be logged in successfully
    And I should see the user dashboard

  Scenario: Failed login with invalid credentials
    When I navigate to the login page
    And I enter invalid login credentials
    Then I should see an error message
    And I should remain on the login page

  Scenario: Password reset functionality
    Given I am on the login page
    When I click the "Forgot Password" link
    And I enter my email address
    Then I should see a password reset confirmation
```

```gherkin
# features/product-catalog.feature
Feature: Product Catalog
  As a customer
  I want to browse and search products
  So that I can find items I want to purchase

  Background:
    Given I am on the product catalog page

  Scenario: Search for products
    When I search for "laptop"
    Then I should see products related to "laptop"
    And the product count should be greater than 0

  Scenario: Filter products by category
    When I filter products by category "Electronics"
    And I filter by price range $100 to $1000
    Then I should see only products in the specified criteria
    And each product should be in the "Electronics" category

  Scenario: Add product to cart
    Given there are products displayed
    When I click "Add to Cart" on the first product
    Then the product should be added to my cart
    And the cart count should increase by 1
```

```gherkin
# features/shopping-cart.feature
Feature: Shopping Cart Management
  As a customer
  I want to manage items in my shopping cart
  So that I can control my purchases before checkout

  Background:
    Given I have items in my shopping cart

  Scenario: Update item quantity
    When I increase the quantity of the first item to 3
    Then the item quantity should be updated to 3
    And the total price should be recalculated correctly

  Scenario: Remove item from cart
    Given my cart contains 2 items
    When I remove the first item from the cart
    Then my cart should contain 1 item
    And the total should be updated accordingly

  Scenario: Proceed to checkout
    Given my cart has items and I am logged in
    When I click the checkout button
    Then I should be redirected to the checkout page
    And my cart items should be preserved
```

---

## Task 1: Create Custom World Object (15 minutes)

### Objective
Implement a custom World class that manages page object lifecycle and provides clean access to page objects within step definitions.

### Requirements

Create `features/support/World.ts` with the following functionality:

#### Core Features
- **Page Object Management**: Initialize and manage all page objects
- **Browser Context**: Handle browser and page lifecycle
- **State Management**: Share data between steps
- **Error Handling**: Comprehensive error management with debugging support

### Implementation Template

```typescript
// features/support/World.ts
import { World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductCatalogPage } from '../../src/pages/ProductCatalogPage';
import { ShoppingCartPage } from '../../src/pages/ShoppingCartPage';
import { LoginCredentials } from '../../src/types/page-types';

export interface TestContext {
  searchTerm?: string;
  selectedProducts?: string[];
  cartItemCount?: number;
  currentUser?: LoginCredentials;
  lastErrorMessage?: string;
}

export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  
  // Page Objects
  public loginPage!: LoginPage;
  public productCatalogPage!: ProductCatalogPage;
  public shoppingCartPage!: ShoppingCartPage;
  
  // Test Context
  public testContext: TestContext = {};
  
  // Configuration
  private readonly baseUrl: string = process.env.BASE_URL || 'http://localhost:3000';
  private readonly headless: boolean = process.env.HEADLESS !== 'false';

  constructor(options: IWorldOptions) {
    super(options);
  }

  // TODO: Implement these methods

  /**
   * Initialize browser and create new context
   */
  async initializeBrowser(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Initialize all page objects
   */
  async initializePageObjects(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Navigate to homepage
   */
  async navigateToHomepage(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Clean up browser resources
   */
  async cleanup(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get page object by name
   */
  getPageObject(pageName: 'login' | 'catalog' | 'cart'): LoginPage | ProductCatalogPage | ShoppingCartPage {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Set test context data
   */
  setContextData(key: keyof TestContext, value: any): void {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get test context data
   */
  getContextData(key: keyof TestContext): any {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Wait for page to be ready
   */
  async waitForPageReady(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }
}
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Browser Initialization:**
```typescript
async initializeBrowser(): Promise<void> {
  this.browser = await chromium.launch({ headless: this.headless });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
}
```

**Page Object Initialization:**
```typescript
async initializePageObjects(): Promise<void> {
  this.loginPage = new LoginPage(this.page, this.baseUrl);
  this.productCatalogPage = new ProductCatalogPage(this.page, this.baseUrl);
  this.shoppingCartPage = new ShoppingCartPage(this.page, this.baseUrl);
}
```

**Context Management:**
```typescript
setContextData(key: keyof TestContext, value: any): void {
  this.testContext[key] = value;
}

getContextData(key: keyof TestContext): any {
  return this.testContext[key];
}
```

</details>

### Validation Criteria

- [ ] **Browser lifecycle** properly managed
- [ ] **Page objects** initialized correctly
- [ ] **Context sharing** between steps functional
- [ ] **Error handling** includes debugging support
- [ ] **Resource cleanup** prevents memory leaks

---

## Task 2: Implement Cucumber Hooks (10 minutes)

### Objective
Create comprehensive hooks that manage test lifecycle, browser initialization, and cleanup operations.

### Requirements

Create `features/support/hooks.ts` with the following hooks:

#### Hook Types
- **BeforeAll**: Global setup operations
- **Before**: Individual scenario setup
- **After**: Individual scenario cleanup
- **AfterAll**: Global cleanup operations

### Implementation Template

```typescript
// features/support/hooks.ts
import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './World';

// Global setup before all scenarios
BeforeAll(async function () {
  // TODO: Implement global setup
  console.log('Starting Cucumber test suite...');
});

// Setup before each scenario
Before(async function (this: CustomWorld, scenario) {
  // TODO: Implement scenario setup
  console.log(`Starting scenario: ${scenario.pickle.name}`);
  
  // Your implementation here
  throw new Error('Hook not implemented');
});

// Cleanup after each scenario
After(async function (this: CustomWorld, scenario) {
  // TODO: Implement scenario cleanup
  
  if (scenario.result?.status === Status.FAILED) {
    // Handle failed scenarios
    // Your implementation here
  }
  
  console.log(`Completed scenario: ${scenario.pickle.name}`);
  
  // Your implementation here
  throw new Error('Hook not implemented');
});

// Global cleanup after all scenarios
AfterAll(async function () {
  // TODO: Implement global cleanup
  console.log('Cucumber test suite completed.');
});

// Hook for specific tags
Before({ tags: '@authentication' }, async function (this: CustomWorld) {
  // Special setup for authentication tests
  console.log('Setting up authentication test...');
});

Before({ tags: '@cart' }, async function (this: CustomWorld) {
  // Special setup for cart tests  
  console.log('Setting up cart test...');
});
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Before Hook:**
```typescript
Before(async function (this: CustomWorld, scenario) {
  await this.initializeBrowser();
  await this.initializePageObjects();
  
  // Set scenario context
  this.setContextData('currentScenario', scenario.pickle.name);
});
```

**After Hook with Error Handling:**
```typescript
After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    await this.takeScreenshot(`failed-${scenario.pickle.name}-${Date.now()}`);
    
    // Log additional debugging info
    const url = await this.page.url();
    console.log(`Failure occurred on page: ${url}`);
  }
  
  await this.cleanup();
});
```

</details>

### Validation Criteria

- [ ] **Before hooks** initialize browser and page objects
- [ ] **After hooks** handle failures with screenshots
- [ ] **Cleanup operations** prevent resource leaks
- [ ] **Tag-specific hooks** provide specialized setup
- [ ] **Error logging** aids in debugging

---

## Task 3: Create Authentication Step Definitions (15 minutes)

### Objective
Implement step definitions for user authentication scenarios using your page objects.

### Requirements

Create `features/step-definitions/authentication.steps.ts` with comprehensive authentication steps.

### Implementation Template

```typescript
// features/step-definitions/authentication.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/World';

// Background steps
Given('I am on the TechShop homepage', async function (this: CustomWorld) {
  // TODO: Navigate to homepage
  throw new Error('Step not implemented');
});

// Navigation steps
When('I navigate to the login page', async function (this: CustomWorld) {
  // TODO: Navigate to login page
  throw new Error('Step not implemented');
});

Given('I am on the login page', async function (this: CustomWorld) {
  // TODO: Navigate directly to login page
  throw new Error('Step not implemented');
});

// Credential input steps
When('I enter valid login credentials', async function (this: CustomWorld) {
  // TODO: Use valid test credentials
  const validCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  // Your implementation here
  throw new Error('Step not implemented');
});

When('I enter invalid login credentials', async function (this: CustomWorld) {
  // TODO: Use invalid test credentials
  const invalidCredentials = {
    email: 'invalid@example.com', 
    password: 'wrongpassword'
  };
  
  // Your implementation here
  throw new Error('Step not implemented');
});

// Password reset steps
When('I click the {string} link', async function (this: CustomWorld, linkText: string) {
  // TODO: Click the specified link
  throw new Error('Step not implemented');
});

When('I enter my email address', async function (this: CustomWorld) {
  // TODO: Enter email for password reset
  throw new Error('Step not implemented');
});

// Assertion steps
Then('I should be logged in successfully', async function (this: CustomWorld) {
  // TODO: Verify successful login
  throw new Error('Step not implemented');
});

Then('I should see the user dashboard', async function (this: CustomWorld) {
  // TODO: Verify dashboard is displayed
  throw new Error('Step not implemented');
});

Then('I should see an error message', async function (this: CustomWorld) {
  // TODO: Verify error message is displayed
  throw new Error('Step not implemented');
});

Then('I should remain on the login page', async function (this: CustomWorld) {
  // TODO: Verify still on login page
  throw new Error('Step not implemented');
});

Then('I should see a password reset confirmation', async function (this: CustomWorld) {
  // TODO: Verify password reset confirmation
  throw new Error('Step not implemented');
});
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Valid Login Step:**
```typescript
When('I enter valid login credentials', async function (this: CustomWorld) {
  const validCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  await this.loginPage.login(validCredentials);
  this.setContextData('currentUser', validCredentials);
});
```

**Error Message Verification:**
```typescript
Then('I should see an error message', async function (this: CustomWorld) {
  const isErrorVisible = await this.loginPage.isErrorMessageVisible();
  expect(isErrorVisible).toBe(true);
  
  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage).toBeTruthy();
  this.setContextData('lastErrorMessage', errorMessage);
});
```

</details>

### Validation Criteria

- [ ] **All steps** use page objects correctly
- [ ] **Context data** is properly managed
- [ ] **Assertions** are meaningful and comprehensive
- [ ] **Error handling** provides useful feedback
- [ ] **Step reusability** follows DRY principles

---

## Task 4: Create Product Catalog Step Definitions (10 minutes)

### Objective
Implement step definitions for product catalog scenarios including search, filtering, and cart operations.

### Requirements

Create `features/step-definitions/product-catalog.steps.ts` with comprehensive product management steps.

### Implementation Template

```typescript
// features/step-definitions/product-catalog.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/World';

// Navigation and setup
Given('I am on the product catalog page', async function (this: CustomWorld) {
  // TODO: Navigate to product catalog
  throw new Error('Step not implemented');
});

Given('there are products displayed', async function (this: CustomWorld) {
  // TODO: Verify products are visible
  throw new Error('Step not implemented');
});

// Search functionality
When('I search for {string}', async function (this: CustomWorld, searchTerm: string) {
  // TODO: Perform product search
  throw new Error('Step not implemented');
});

// Filtering functionality  
When('I filter products by category {string}', async function (this: CustomWorld, category: string) {
  // TODO: Apply category filter
  throw new Error('Step not implemented');
});

When('I filter by price range ${int} to ${int}', async function (this: CustomWorld, minPrice: number, maxPrice: number) {
  // TODO: Apply price range filter
  throw new Error('Step not implemented');
});

// Cart operations
When('I click {string} on the first product', async function (this: CustomWorld, buttonText: string) {
  // TODO: Click specified button on first product
  throw new Error('Step not implemented');
});

// Assertions
Then('I should see products related to {string}', async function (this: CustomWorld, searchTerm: string) {
  // TODO: Verify search results are relevant
  throw new Error('Step not implemented');
});

Then('the product count should be greater than {int}', async function (this: CustomWorld, expectedCount: number) {
  // TODO: Verify product count
  throw new Error('Step not implemented');
});

Then('I should see only products in the specified criteria', async function (this: CustomWorld) {
  // TODO: Verify filtering worked correctly
  throw new Error('Step not implemented');
});

Then('each product should be in the {string} category', async function (this: CustomWorld, category: string) {
  // TODO: Verify all products match category
  throw new Error('Step not implemented');
});

Then('the product should be added to my cart', async function (this: CustomWorld) {
  // TODO: Verify product was added to cart
  throw new Error('Step not implemented');
});

Then('the cart count should increase by {int}', async function (this: CustomWorld, increment: number) {
  // TODO: Verify cart count increased
  throw new Error('Step not implemented');
});
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Search Implementation:**
```typescript
When('I search for {string}', async function (this: CustomWorld, searchTerm: string) {
  await this.productCatalogPage.searchProducts(searchTerm);
  this.setContextData('searchTerm', searchTerm);
  
  // Wait for search results to load
  await this.waitForPageReady();
});
```

**Filter Verification:**
```typescript
Then('I should see only products in the specified criteria', async function (this: CustomWorld) {
  const productCount = await this.productCatalogPage.getProductCount();
  expect(productCount).toBeGreaterThan(0);
  
  // Verify at least some products are shown
  for (let i = 0; i < Math.min(5, productCount); i++) {
    const productInfo = await this.productCatalogPage.getProductInfo(i);
    expect(productInfo.name).toBeTruthy();
    expect(productInfo.price).toBeGreaterThan(0);
  }
});
```

</details>

### Validation Criteria

- [ ] **Search functionality** properly tested
- [ ] **Filtering logic** validates correctly
- [ ] **Cart operations** update state appropriately
- [ ] **Product data** validation is thorough
- [ ] **Context management** tracks search and filter state

---

## Task 5: Create Shopping Cart Step Definitions (10 minutes)

### Objective
Implement step definitions for shopping cart management scenarios including quantity updates, item removal, and checkout flow.

### Requirements

Create `features/step-definitions/shopping-cart.steps.ts` with comprehensive cart management steps.

### Implementation Template

```typescript
// features/step-definitions/shopping-cart.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/World';

// Setup steps
Given('I have items in my shopping cart', async function (this: CustomWorld) {
  // TODO: Ensure cart has items (add if necessary)
  throw new Error('Step not implemented');
});

Given('my cart contains {int} items', async function (this: CustomWorld, itemCount: number) {
  // TODO: Ensure cart has specific number of items
  throw new Error('Step not implemented');
});

Given('my cart has items and I am logged in', async function (this: CustomWorld) {
  // TODO: Ensure cart has items and user is authenticated
  throw new Error('Step not implemented');
});

// Cart operations
When('I increase the quantity of the first item to {int}', async function (this: CustomWorld, newQuantity: number) {
  // TODO: Update first item quantity
  throw new Error('Step not implemented');
});

When('I remove the first item from the cart', async function (this: CustomWorld) {
  // TODO: Remove first item from cart
  throw new Error('Step not implemented');
});

When('I click the checkout button', async function (this: CustomWorld) {
  // TODO: Click checkout button
  throw new Error('Step not implemented');
});

// Assertions
Then('the item quantity should be updated to {int}', async function (this: CustomWorld, expectedQuantity: number) {
  // TODO: Verify quantity was updated
  throw new Error('Step not implemented');
});

Then('the total price should be recalculated correctly', async function (this: CustomWorld) {
  // TODO: Verify total price is correct
  throw new Error('Step not implemented');
});

Then('my cart should contain {int} item(s)', async function (this: CustomWorld, expectedCount: number) {
  // TODO: Verify cart item count
  throw new Error('Step not implemented');
});

Then('the total should be updated accordingly', async function (this: CustomWorld) {
  // TODO: Verify total reflects changes
  throw new Error('Step not implemented');
});

Then('I should be redirected to the checkout page', async function (this: CustomWorld) {
  // TODO: Verify navigation to checkout
  throw new Error('Step not implemented');
});

Then('my cart items should be preserved', async function (this: CustomWorld) {
  // TODO: Verify cart items are maintained
  throw new Error('Step not implemented');
});
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Cart Setup:**
```typescript
Given('I have items in my shopping cart', async function (this: CustomWorld) {
  await this.shoppingCartPage.navigateToPage();
  
  const isEmpty = await this.shoppingCartPage.isCartEmpty();
  if (isEmpty) {
    // Add items to cart first
    await this.productCatalogPage.navigateToPage();
    await this.productCatalogPage.addProductToCart(0);
    await this.shoppingCartPage.navigateToPage();
  }
  
  const itemCount = await this.shoppingCartPage.getItemCount();
  this.setContextData('cartItemCount', itemCount);
});
```

**Quantity Update:**
```typescript
When('I increase the quantity of the first item to {int}', async function (this: CustomWorld, newQuantity: number) {
  const originalTotal = await this.shoppingCartPage.getTotal();
  this.setContextData('originalTotal', originalTotal);
  
  await this.shoppingCartPage.updateItemQuantity(0, newQuantity);
  
  // Wait for cart to update
  await this.page.waitForTimeout(1000);
});
```

</details>

### Validation Criteria

- [ ] **Cart state management** handles various scenarios
- [ ] **Quantity updates** properly validated
- [ ] **Price calculations** are accurate
- [ ] **Navigation flows** work correctly
- [ ] **Item preservation** verified across pages

---

## Task 6: Create Common Step Definitions (10 minutes)

### Objective
Implement reusable step definitions that can be shared across multiple scenarios.

### Requirements

Create `features/step-definitions/common.steps.ts` with utility and shared steps.

### Implementation Template

```typescript
// features/step-definitions/common.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/World';

// Navigation steps
Given('I am on the homepage', async function (this: CustomWorld) {
  await this.navigateToHomepage();
});

When('I navigate to the {string} page', async function (this: CustomWorld, pageName: string) {
  // TODO: Generic page navigation
  throw new Error('Step not implemented');
});

// Element interaction steps
When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
  // TODO: Generic button click
  throw new Error('Step not implemented');
});

When('I enter {string} in the {string} field', async function (this: CustomWorld, value: string, fieldName: string) {
  // TODO: Generic form field input
  throw new Error('Step not implemented');
});

// Validation steps
Then('I should see the text {string}', async function (this: CustomWorld, expectedText: string) {
  // TODO: Verify text is visible on page
  throw new Error('Step not implemented');
});

Then('I should be on the {string} page', async function (this: CustomWorld, pageName: string) {
  // TODO: Verify current page
  throw new Error('Step not implemented');
});

Then('the page title should contain {string}', async function (this: CustomWorld, titleText: string) {
  // TODO: Verify page title
  throw new Error('Step not implemented');
});

// Wait steps
When('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
  await this.page.waitForTimeout(seconds * 1000);
});

Then('I should see the {string} element', async function (this: CustomWorld, elementName: string) {
  // TODO: Verify element visibility
  throw new Error('Step not implemented');
});

// Debug steps
When('I take a screenshot named {string}', async function (this: CustomWorld, screenshotName: string) {
  await this.takeScreenshot(screenshotName);
});
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Generic Navigation:**
```typescript
When('I navigate to the {string} page', async function (this: CustomWorld, pageName: string) {
  const pageMap = {
    'login': this.loginPage,
    'catalog': this.productCatalogPage,
    'cart': this.shoppingCartPage
  };
  
  const page = pageMap[pageName.toLowerCase()];
  if (!page) {
    throw new Error(`Unknown page: ${pageName}`);
  }
  
  await page.navigateToPage();
});
```

**Generic Element Visibility:**
```typescript
Then('I should see the {string} element', async function (this: CustomWorld, elementName: string) {
  const elementMap = {
    'login form': '[data-testid="login-form"]',
    'product grid': '[data-testid="product-grid"]',
    'cart container': '[data-testid="cart-container"]'
  };
  
  const selector = elementMap[elementName.toLowerCase()];
  if (!selector) {
    throw new Error(`Unknown element: ${elementName}`);
  }
  
  await expect(this.page.locator(selector)).toBeVisible();
});
```

</details>

### Validation Criteria

- [ ] **Reusable steps** work across scenarios
- [ ] **Generic navigation** handles all pages
- [ ] **Element mapping** is comprehensive
- [ ] **Error handling** provides clear feedback
- [ ] **Debug utilities** aid in troubleshooting

---

## Testing Your Implementation

### Create Integration Test

Create `tests/cucumber/integration.test.ts`:

```typescript
import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';

test.describe('Cucumber-POM Integration', () => {
  test('should run authentication scenarios', async () => {
    const result = execSync(
      'npx cucumber-js features/authentication.feature --require features/step-definitions/**/*.js --require features/support/**/*.js',
      { cwd: process.cwd(), encoding: 'utf8' }
    );
    
    expect(result).toContain('scenarios (');
    expect(result).not.toContain('failed');
  });

  test('should run product catalog scenarios', async () => {
    const result = execSync(
      'npx cucumber-js features/product-catalog.feature --require features/step-definitions/**/*.js --require features/support/**/*.js',
      { cwd: process.cwd(), encoding: 'utf8' }
    );
    
    expect(result).toContain('scenarios (');
    expect(result).not.toContain('failed');
  });

  test('should run shopping cart scenarios', async () => {
    const result = execSync(
      'npx cucumber-js features/shopping-cart.feature --require features/step-definitions/**/*.js --require features/support/**/*.js',
      { cwd: process.cwd(), encoding: 'utf8' }
    );
    
    expect(result).toContain('scenarios (');
    expect(result).not.toContain('failed');
  });
});
```

### Run Your Tests

```bash
# Compile TypeScript
npx tsc

# Run specific feature
npx cucumber-js features/authentication.feature

# Run all features
npx cucumber-js features/

# Run with specific tags
npx cucumber-js --tags "@authentication"

# Generate report
npx cucumber-js --format html:reports/cucumber-report.html
```

---

## Success Criteria Checklist

### Implementation Requirements

- [ ] **Custom World Object**
  - [ ] Browser lifecycle management
  - [ ] Page object initialization
  - [ ] Context sharing between steps
  - [ ] Error handling and debugging

- [ ] **Cucumber Hooks**
  - [ ] Proper setup and teardown
  - [ ] Screenshot on failure
  - [ ] Resource cleanup
  - [ ] Tag-specific hooks

- [ ] **Step Definitions**
  - [ ] Authentication scenarios complete
  - [ ] Product catalog scenarios complete
  - [ ] Shopping cart scenarios complete
  - [ ] Common utility steps functional

- [ ] **Integration Quality**
  - [ ] Page objects used correctly in steps
  - [ ] Context data managed properly
  - [ ] Error scenarios handled gracefully
  - [ ] All feature files execute successfully

### Code Quality Standards

- [ ] **TypeScript Integration**
  - [ ] Proper typing in World object
  - [ ] Step definitions use correct types
  - [ ] No `any` types used
  - [ ] Interface compliance

- [ ] **Step Definition Patterns**
  - [ ] Descriptive step names
  - [ ] Single responsibility
  - [ ] Reusable across scenarios
  - [ ] Clear parameter handling

- [ ] **Error Handling**
  - [ ] Meaningful error messages
  - [ ] Screenshot capture on failures
  - [ ] Debug information logged
  - [ ] Graceful failure handling

---

## Common Issues and Solutions

### Issue 1: World Object Not Initialized
**Problem**: Page objects are undefined in step definitions.

**Solution**:
```typescript
// Ensure hooks initialize the World properly
Before(async function (this: CustomWorld) {
  await this.initializeBrowser();
  await this.initializePageObjects();
});
```

### Issue 2: Context Data Not Shared
**Problem**: Data set in one step is not available in another.

**Solution**:
```typescript
// Use the World instance to share data
this.setContextData('searchTerm', searchTerm);
const previousSearch = this.getContextData('searchTerm');
```

### Issue 3: Browser Not Cleaned Up
**Problem**: Multiple browser instances remain open.

**Solution**:
```typescript
// Ensure cleanup in After hook
After(async function (this: CustomWorld) {
  await this.cleanup();
});
```

### Issue 4: Step Definition Ambiguity
**Problem**: Multiple step definitions match the same step text.

**Solution**:
```typescript
// Make step definitions more specific
Given('I am logged in as a customer', async function() { });
Given('I am logged in as an admin', async function() { });
```

---

## Next Steps

After completing this exercise:

1. **Run All Scenarios**: Ensure all feature files execute successfully
2. **Review Integration**: Check how cleanly page objects integrate with steps
3. **Optimize Performance**: Look for opportunities to improve test execution speed
4. **Enhance Error Handling**: Add more robust error scenarios
5. **Prepare**: Get ready for [Exercise 03: Advanced Architecture Design](03-advanced-architecture-design.md)

---

## Additional Resources

- 📖 **Cucumber.js Documentation**: [https://cucumber.io/docs/cucumber/](https://cucumber.io/docs/cucumber/)
- 🔧 **World Objects Guide**: [https://cucumber.io/docs/cucumber/state/](https://cucumber.io/docs/cucumber/state/)
- 📚 **Step Definition Patterns**: [https://cucumber.io/docs/cucumber/step-definitions/](https://cucumber.io/docs/cucumber/step-definitions/)

---

**Duration Check**: This exercise should take approximately 60 minutes. Focus on getting the core integration working first, then refine the implementation for better maintainability.

Ready to create seamless integration between your page objects and Cucumber BDD scenarios? Let's build maintainable, readable test automation! 🚀