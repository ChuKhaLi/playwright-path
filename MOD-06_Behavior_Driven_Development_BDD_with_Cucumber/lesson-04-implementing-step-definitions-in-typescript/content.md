# Implementing Step Definitions in TypeScript

## Introduction

Step definitions are the bridge between your human-readable Gherkin scenarios and executable TypeScript code. They tell Cucumber how to execute each step in your feature files, transforming business requirements into automated tests. This lesson covers professional TypeScript implementation patterns that create maintainable, scalable, and robust test automation.

## Step Definition Fundamentals

### What Are Step Definitions?

Step definitions are TypeScript functions that Cucumber calls when it encounters matching steps in your feature files. Each step definition:

- **Matches** a specific step pattern using expressions
- **Extracts** parameters from the step text
- **Executes** the corresponding test logic
- **Reports** success or failure back to Cucumber

### Basic Step Definition Structure

```typescript
import { Given, When, Then } from '@cucumber/cucumber';

// Basic step definition structure
Given('I am on the login page', async function () {
  // Step implementation goes here
});

When('I enter my username {string}', async function (username: string) {
  // Parameter handling and implementation
});

Then('I should see the dashboard', async function () {
  // Assertion implementation
});
```

### Step Definition Types

#### **Given Steps** - Setup and Context
```typescript
Given('I am a registered user', async function () {
  // Setup user data in database
  this.testUser = await this.dataManager.createTestUser();
});

Given('I am on the {string} page', async function (pageName: string) {
  // Navigate to specific page
  await this.pageManager.navigateToPage(pageName);
});
```

#### **When Steps** - Actions and Interactions
```typescript
When('I click the {string} button', async function (buttonText: string) {
  // Perform user action
  await this.page.getByRole('button', { name: buttonText }).click();
});

When('I fill in the form with:', async function (dataTable) {
  // Handle complex data input
  const formData = dataTable.hashes()[0];
  await this.formManager.fillForm(formData);
});
```

#### **Then Steps** - Assertions and Verification
```typescript
Then('I should see {string}', async function (expectedText: string) {
  // Verify expected outcome
  await expect(this.page.getByText(expectedText)).toBeVisible();
});

Then('the page should contain {int} items', async function (expectedCount: number) {
  // Verify counts and quantities
  const actualCount = await this.page.locator('.item').count();
  expect(actualCount).toBe(expectedCount);
});
```

## Cucumber Expressions vs Regular Expressions

### Cucumber Expressions (Recommended)

Cucumber expressions provide a simple, readable way to match steps and extract parameters:

```typescript
// Cucumber expressions with parameter types
Given('I have {int} items in my cart', async function (itemCount: number) {
  // itemCount is automatically converted to number
});

When('I search for {string}', async function (searchTerm: string) {
  // searchTerm is automatically extracted as string
});

Then('the price should be {float}', async function (price: number) {
  // price is automatically converted to number with decimals
});
```

#### **Built-in Parameter Types**
- `{int}` - Integer numbers
- `{float}` - Decimal numbers  
- `{string}` - Quoted strings
- `{word}` - Single words without quotes

#### **Optional Parameters**
```typescript
Given('I have an optional {string}', async function (param?: string) {
  // Handle optional parameters
  if (param) {
    // Use parameter
  } else {
    // Default behavior
  }
});
```

### Regular Expressions (Advanced Cases)

For complex pattern matching, you can use regular expressions:

```typescript
Given(/^I have (\d+) (?:item|items) in my (?:cart|basket)$/, async function (count: string) {
  const itemCount = parseInt(count);
  // Handle singular/plural variations
});

When(/^I (?:click|press|tap) (?:the )?(.+) (?:button|link)$/, async function (elementName: string) {
  // Flexible element interaction patterns
});
```

## Parameter Handling and Type Safety

### Basic Parameter Extraction

```typescript
// String parameters
When('I enter {string} in the username field', async function (username: string) {
  await this.page.getByLabel('Username').fill(username);
});

// Numeric parameters
Given('I have {int} products in my cart', async function (productCount: number) {
  // TypeScript knows productCount is a number
  for (let i = 0; i < productCount; i++) {
    await this.cartManager.addRandomProduct();
  }
});

// Multiple parameters
When('I create a user with email {string} and age {int}', 
  async function (email: string, age: number) {
    await this.userManager.createUser({ email, age });
  }
);
```

### Data Tables

Handle complex data structures using Cucumber data tables:

```typescript
When('I fill out the registration form:', async function (dataTable) {
  // Extract data table as key-value pairs
  const userData = dataTable.hashes()[0];
  
  // Type-safe approach with interface
  interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    age: string;
  }
  
  const typedUserData = userData as UserData;
  
  await this.page.getByLabel('First Name').fill(typedUserData.firstName);
  await this.page.getByLabel('Last Name').fill(typedUserData.lastName);
  await this.page.getByLabel('Email').fill(typedUserData.email);
  await this.page.getByLabel('Age').fill(typedUserData.age);
});
```

### Doc Strings

Handle multi-line text content:

```typescript
When('I enter the following description:', async function (docString: string) {
  await this.page.getByLabel('Description').fill(docString);
});
```

## TypeScript Best Practices

### Interfaces and Types

Define clear interfaces for complex data:

```typescript
// Define interfaces for better type safety
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Use interfaces in step definitions
When('I add the following product to cart:', async function (dataTable) {
  const productData = dataTable.hashes()[0] as Product;
  await this.cartManager.addProduct(productData);
});
```

### World Object and Shared State

Use the World object to share state between steps:

```typescript
// world.ts - Define your World interface
export interface CustomWorld extends World {
  page: Page;
  testUser?: User;
  cartItems: CartItem[];
  lastResponse?: APIResponse;
}

// Step definitions using World
Given('I am logged in as a customer', async function (this: CustomWorld) {
  this.testUser = await this.userManager.createCustomer();
  await this.authManager.loginUser(this.testUser);
});

When('I add a product to my cart', async function (this: CustomWorld) {
  const product = await this.productManager.getRandomProduct();
  await this.cartManager.addProduct(product);
  this.cartItems.push({ product, quantity: 1 });
});
```

### Error Handling

Implement comprehensive error handling:

```typescript
When('I attempt to purchase the item', async function () {
  try {
    await this.page.getByRole('button', { name: 'Purchase' }).click();
    
    // Wait for either success or error state
    await Promise.race([
      this.page.waitForURL('**/success'),
      this.page.waitForSelector('.error-message')
    ]);
    
  } catch (error) {
    // Log detailed error information
    console.error('Purchase attempt failed:', error);
    
    // Take screenshot for debugging
    await this.page.screenshot({ 
      path: `screenshots/purchase-error-${Date.now()}.png` 
    });
    
    throw new Error(`Purchase failed: ${error.message}`);
  }
});
```

## Page Object Integration

### Connecting Step Definitions to Page Objects

```typescript
// page-objects/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async enterCredentials(username: string, password: string) {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
  }

  async clickLoginButton() {
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.page.locator('.error-message').textContent() || '';
  }
}

// Step definitions using Page Objects
When('I log in with username {string} and password {string}', 
  async function (username: string, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.enterCredentials(username, password);
    await loginPage.clickLoginButton();
  }
);
```

### Page Object Manager Pattern

```typescript
// PageManager.ts
export class PageManager {
  constructor(private page: Page) {}

  get loginPage() {
    return new LoginPage(this.page);
  }

  get dashboardPage() {
    return new DashboardPage(this.page);
  }

  get cartPage() {
    return new CartPage(this.page);
  }
}

// Use in World object
export interface CustomWorld extends World {
  page: Page;
  pageManager: PageManager;
}

// Step definitions with Page Manager
Given('I am on the login page', async function (this: CustomWorld) {
  await this.pageManager.loginPage.navigate();
});
```

## Async/Await Patterns

### Proper Promise Handling

```typescript
// Correct async/await usage
When('I perform multiple actions', async function () {
  // Sequential actions
  await this.page.getByLabel('Name').fill('John');
  await this.page.getByLabel('Email').fill('john@example.com');
  await this.page.getByRole('button', { name: 'Submit' }).click();
  
  // Wait for result
  await this.page.waitForURL('**/success');
});

// Parallel actions when appropriate
When('I load multiple pages simultaneously', async function () {
  const [response1, response2] = await Promise.all([
    this.page.goto('/page1'),
    this.page.goto('/page2')
  ]);
  
  expect(response1.ok()).toBeTruthy();
  expect(response2.ok()).toBeTruthy();
});
```

### Timeout Handling

```typescript
When('I wait for the slow operation to complete', async function () {
  // Custom timeout for slow operations
  await expect(this.page.getByText('Operation Complete')).toBeVisible({
    timeout: 30000
  });
});

When('I handle network delays gracefully', async function () {
  try {
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  } catch (error) {
    console.warn('Network did not become idle within timeout, continuing...');
  }
});
```

## Step Definition Organization

### File Structure

Organize step definitions by feature or domain:

```
step-definitions/
├── auth/
│   ├── login.steps.ts
│   └── registration.steps.ts
├── ecommerce/
│   ├── cart.steps.ts
│   ├── checkout.steps.ts
│   └── product.steps.ts
├── common/
│   ├── navigation.steps.ts
│   └── assertion.steps.ts
└── index.ts
```

### Shared Step Definitions

Create reusable steps for common actions:

```typescript
// common/navigation.steps.ts
Given('I am on the {string} page', async function (pageName: string) {
  const urlMap: Record<string, string> = {
    'home': '/',
    'login': '/login',
    'dashboard': '/dashboard',
    'cart': '/cart'
  };
  
  const url = urlMap[pageName.toLowerCase()];
  if (!url) {
    throw new Error(`Unknown page: ${pageName}`);
  }
  
  await this.page.goto(url);
});

// common/assertion.steps.ts
Then('I should see {string}', async function (expectedText: string) {
  await expect(this.page.getByText(expectedText)).toBeVisible();
});

Then('I should not see {string}', async function (unexpectedText: string) {
  await expect(this.page.getByText(unexpectedText)).not.toBeVisible();
});
```

## Advanced Patterns

### Custom Parameter Types

Define custom parameter types for domain-specific data:

```typescript
// support/parameter-types.ts
import { defineParameterType } from '@cucumber/cucumber';

defineParameterType({
  name: 'user_role',
  regexp: /admin|customer|guest/,
  transformer: (role: string) => role,
});

// Use in step definitions
Given('I am logged in as a {user_role}', async function (role: string) {
  await this.authManager.loginAsRole(role);
});
```

### Step Definition Helpers

Create helper functions for complex operations:

```typescript
// helpers/form-helpers.ts
export async function fillFormFromTable(page: Page, dataTable: any) {
  const formData = dataTable.hashes()[0];
  
  for (const [field, value] of Object.entries(formData)) {
    const label = field.replace(/([A-Z])/g, ' $1').trim();
    await page.getByLabel(new RegExp(label, 'i')).fill(value as string);
  }
}

// Use in step definitions
When('I fill out the form:', async function (dataTable) {
  await fillFormFromTable(this.page, dataTable);
});
```

### Conditional Step Execution

Handle conditional logic in step definitions:

```typescript
When('I perform action based on user type', async function () {
  if (this.testUser?.role === 'admin') {
    await this.page.getByRole('button', { name: 'Admin Actions' }).click();
  } else {
    await this.page.getByRole('button', { name: 'User Actions' }).click();
  }
});
```

## Debugging and Troubleshooting

### Common Issues and Solutions

#### **Step Not Found**
```typescript
// Problem: Step not matching
// Solution: Check step definition pattern

// Feature file step:
// When I click the "Submit" button

// Working step definition:
When('I click the {string} button', async function (buttonText: string) {
  await this.page.getByRole('button', { name: buttonText }).click();
});
```

#### **Parameter Type Mismatch**
```typescript
// Problem: TypeError on parameter usage
// Solution: Ensure proper type handling

// Correct implementation:
When('I wait {int} seconds', async function (seconds: number) {
  // TypeScript knows seconds is a number
  await this.page.waitForTimeout(seconds * 1000);
});
```

#### **Async/Await Issues**
```typescript
// Problem: Promise not awaited
// Solution: Always await async operations

// Incorrect:
When('I click button', function () {
  this.page.click('button'); // Missing await
});

// Correct:
When('I click button', async function () {
  await this.page.click('button'); // Properly awaited
});
```

### Debugging Techniques

```typescript
When('I debug the current state', async function () {
  // Log current page state
  console.log('Current URL:', this.page.url());
  console.log('Page title:', await this.page.title());
  
  // Take screenshot for visual debugging
  await this.page.screenshot({ 
    path: `debug-${Date.now()}.png`,
    fullPage: true 
  });
  
  // Wait for manual inspection in headed mode
  if (process.env.DEBUG === 'true') {
    await this.page.pause();
  }
});
```

## Best Practices Summary

### **Code Quality**
- Use TypeScript interfaces for type safety
- Implement comprehensive error handling
- Follow consistent naming conventions
- Add meaningful comments for complex logic

### **Maintainability**
- Keep step definitions focused and single-purpose
- Use Page Object pattern for UI interactions
- Create reusable helper functions
- Organize files by feature or domain

### **Performance**
- Avoid unnecessary waits and timeouts
- Use efficient locator strategies
- Implement parallel execution where appropriate
- Clean up resources in hooks

### **Debugging**
- Add detailed logging for troubleshooting
- Use screenshots for visual verification
- Implement conditional debugging features
- Provide clear error messages

---

*Step definitions are the foundation of your BDD test automation. Well-implemented step definitions create maintainable, reliable, and scalable test suites that serve your team for years to come.*