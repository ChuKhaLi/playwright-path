# Example 02: Cucumber Integration Patterns

## Learning Objectives

By the end of this example, you will be able to:

- 🔄 **Connect POM to Cucumber**: Seamlessly integrate page objects with Cucumber step definitions
- 🌍 **Implement World Objects**: Use Cucumber's World pattern for sharing page object instances
- 🎣 **Leverage Hooks Integration**: Properly initialize and manage page objects within Cucumber lifecycle
- 🔗 **Design Step Definitions**: Create clean, maintainable step definitions using page objects
- 📋 **Manage Context**: Handle complex scenarios with multiple page objects and shared state

---

## Introduction

While page objects provide excellent abstraction for UI interactions, the real power emerges when they're properly integrated with Cucumber's BDD framework. This integration allows us to write expressive, maintainable tests that clearly separate business logic from technical implementation.

### Integration Benefits

**Without Proper Integration:**
```typescript
// ❌ Direct page manipulation in step definitions
Given('I am on the login page', async function() {
  await this.page.goto('/login');
  await this.page.locator('#email').waitFor();
});

When('I enter email {string} and password {string}', async function(email: string, password: string) {
  await this.page.locator('#email').fill(email);
  await this.page.locator('#password').fill(password);
  await this.page.locator('button[type="submit"]').click();
});
```

**With Proper Integration:**
```typescript
// ✅ Clean separation using page objects
Given('I am on the login page', async function() {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLogin();
});

When('I enter email {string} and password {string}', async function(email: string, password: string) {
  await this.loginPage.loginWithCredentials(email, password);
});
```

---

## World Object Pattern

The World object is Cucumber's mechanism for sharing state between step definitions. It's the perfect place to manage page object instances and shared test data.

### 1. Basic World Object Implementation

```typescript
// support/world.ts
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, ChromiumBrowser } from '@playwright/test';
import { chromium } from 'playwright';

// Import your page objects
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

export interface CustomWorldOptions extends IWorldOptions {
  // Add any custom options here
}

export class CustomWorld extends World {
  // Browser management
  public browser!: ChromiumBrowser;
  public context!: BrowserContext;
  public page!: Page;

  // Page object instances
  public loginPage!: LoginPage;
  public productPage!: ProductPage;
  public shoppingCartPage!: ShoppingCartPage;
  public checkoutPage!: CheckoutPage;

  // Shared test data
  public testData: Record<string, any> = {};
  public currentUser: any = null;
  public currentProduct: any = null;

  constructor(options: CustomWorldOptions) {
    super(options);
  }

  // Browser lifecycle methods
  async initializeBrowser(): Promise<void> {
    this.browser = await chromium.launch({ 
      headless: process.env.HEADLESS !== 'false',
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: process.env.RECORD_VIDEO ? { dir: 'test-results/videos' } : undefined
    });
    
    this.page = await this.context.newPage();
    
    // Initialize all page objects
    this.initializePageObjects();
  }

  async closeBrowser(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  private initializePageObjects(): void {
    this.loginPage = new LoginPage(this.page);
    this.productPage = new ProductPage(this.page);
    this.shoppingCartPage = new ShoppingCartPage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
  }

  // Helper methods for test data management
  setTestData(key: string, value: any): void {
    this.testData[key] = value;
  }

  getTestData(key: string): any {
    return this.testData[key];
  }

  setCurrentUser(user: any): void {
    this.currentUser = user;
  }

  setCurrentProduct(product: any): void {
    this.currentProduct = product;
  }

  // Screenshot and debugging helpers
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  async logCurrentUrl(): Promise<void> {
    console.log(`Current URL: ${this.page.url()}`);
  }
}

// Register the custom world
setWorldConstructor(CustomWorld);
```

### 2. Enhanced World with Page Factory

```typescript
// support/world-with-factory.ts
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { PageFactory } from '../utils/PageFactory';

export class EnhancedWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public pageFactory!: PageFactory;

  // Cache for page objects to avoid recreating them
  private pageObjectCache: Map<string, any> = new Map();

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initializeBrowser(): Promise<void> {
    // Browser initialization code...
    this.pageFactory = new PageFactory(this.page);
  }

  // Lazy loading of page objects with caching
  getLoginPage(): LoginPage {
    if (!this.pageObjectCache.has('LoginPage')) {
      this.pageObjectCache.set('LoginPage', this.pageFactory.getLoginPage());
    }
    return this.pageObjectCache.get('LoginPage');
  }

  getProductPage(): ProductPage {
    if (!this.pageObjectCache.has('ProductPage')) {
      this.pageObjectCache.set('ProductPage', this.pageFactory.getProductPage());
    }
    return this.pageObjectCache.get('ProductPage');
  }

  // Clear cache when needed (e.g., between scenarios)
  clearPageObjectCache(): void {
    this.pageObjectCache.clear();
  }
}

setWorldConstructor(EnhancedWorld);
```

---

## Hook Integration

Hooks are essential for proper page object lifecycle management in Cucumber tests.

### 1. Basic Hook Setup

```typescript
// support/hooks.ts
import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { CustomWorld } from './world';

BeforeAll(async function() {
  console.log('Starting test suite...');
});

Before(async function(this: CustomWorld) {
  // Initialize browser and page objects for each scenario
  await this.initializeBrowser();
  console.log(`Starting scenario: ${this.pickle.name}`);
});

After(async function(this: CustomWorld) {
  // Take screenshot on failure
  if (this.result?.status === 'FAILED') {
    await this.takeScreenshot(`failed-${this.pickle.name.replace(/\s+/g, '-')}`);
  }

  // Clean up browser resources
  await this.closeBrowser();
  console.log(`Completed scenario: ${this.pickle.name}`);
});

AfterAll(async function() {
  console.log('Test suite completed.');
});
```

### 2. Advanced Hook Patterns

```typescript
// support/advanced-hooks.ts
import { Before, After, BeforeStep, AfterStep } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// Tagged hooks for specific scenarios
Before({ tags: '@requiresLogin' }, async function(this: CustomWorld) {
  // Automatically log in for scenarios tagged with @requiresLogin
  await this.initializeBrowser();
  const testUser = {
    email: 'test.user@example.com',
    password: 'TestPassword123!'
  };
  
  await this.loginPage.navigateToLogin();
  await this.loginPage.loginWithCredentials(testUser.email, testUser.password);
  this.setCurrentUser(testUser);
});

Before({ tags: '@api' }, async function(this: CustomWorld) {
  // Set up API client for API testing scenarios
  console.log('Setting up API client...');
  // API setup code here
});

// Performance monitoring hooks
BeforeStep(async function(this: CustomWorld) {
  this.setTestData('stepStartTime', Date.now());
});

AfterStep(async function(this: CustomWorld) {
  const startTime = this.getTestData('stepStartTime');
  const duration = Date.now() - startTime;
  
  if (duration > 5000) { // Log slow steps
    console.warn(`Slow step detected: ${duration}ms`);
  }
});

// Database cleanup hooks
After({ tags: '@cleanupDatabase' }, async function(this: CustomWorld) {
  // Clean up test data from database
  console.log('Cleaning up database...');
  // Database cleanup code here
});

// Screenshot hooks for specific tags
After({ tags: '@alwaysScreenshot' }, async function(this: CustomWorld) {
  await this.takeScreenshot(`scenario-${this.pickle.name.replace(/\s+/g, '-')}`);
});
```

---

## Step Definition Patterns

Well-designed step definitions are the bridge between readable Gherkin and robust page object implementations.

### 1. Basic Step Definition Structure

```typescript
// step-definitions/authentication.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Navigation steps
Given('I am on the login page', async function(this: CustomWorld) {
  await this.loginPage.navigateToLogin();
});

Given('I am on the product page for {string}', async function(this: CustomWorld, productId: string) {
  await this.productPage.navigateToProduct(productId);
  this.setTestData('currentProductId', productId);
});

// Action steps
When('I login with email {string} and password {string}', async function(
  this: CustomWorld, 
  email: string, 
  password: string
) {
  await this.loginPage.loginWithCredentials(email, password);
  this.setCurrentUser({ email, password });
});

When('I add {int} items to cart', async function(this: CustomWorld, quantity: number) {
  await this.productPage.addToCart(quantity);
  this.setTestData('addedQuantity', quantity);
});

// Validation steps
Then('I should be redirected to the dashboard', async function(this: CustomWorld) {
  const currentUrl = this.page.url();
  expect(currentUrl).toContain('/dashboard');
});

Then('the cart should contain {int} items', async function(this: CustomWorld, expectedCount: number) {
  const cartCount = await this.shoppingCartPage.getItemCount();
  expect(cartCount).toBe(expectedCount);
});

Then('I should see a login error message', async function(this: CustomWorld) {
  const hasError = await this.loginPage.hasErrorMessage();
  expect(hasError).toBe(true);

  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage).toBeTruthy();
});
```

### 2. Data Table Integration

```typescript
// step-definitions/data-table.steps.ts
import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I fill the registration form:', async function(this: CustomWorld, dataTable: DataTable) {
  const userData = dataTable.rowsHash();
  
  await this.registrationPage.fillPersonalInfo({
    firstName: userData['First Name'],
    lastName: userData['Last Name'],
    email: userData['Email'],
    phone: userData['Phone']
  });
  
  this.setCurrentUser(userData);
});

When('I add the following products to cart:', async function(this: CustomWorld, dataTable: DataTable) {
  const products = dataTable.hashes();
  
  for (const product of products) {
    await this.productPage.navigateToProduct(product.productId);
    await this.productPage.addToCart(parseInt(product.quantity));
  }
  
  this.setTestData('addedProducts', products);
});

Then('the checkout summary should show:', async function(this: CustomWorld, dataTable: DataTable) {
  const expectedItems = dataTable.hashes();
  const actualItems = await this.checkoutPage.getOrderSummary();
  
  for (const expectedItem of expectedItems) {
    const actualItem = actualItems.find(item => item.name === expectedItem.Product);
    expect(actualItem).toBeDefined();
    expect(actualItem.quantity.toString()).toBe(expectedItem.Quantity);
    expect(actualItem.price.toString()).toBe(expectedItem.Price);
  }
});
```

### 3. Parameterized Steps with Examples

```typescript
// step-definitions/parameterized.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Handle multiple user types
Given('I am logged in as a {string}', async function(this: CustomWorld, userType: string) {
  const users = {
    'standard user': { email: 'user@example.com', password: 'password123' },
    'premium user': { email: 'premium@example.com', password: 'premium123' },
    'admin user': { email: 'admin@example.com', password: 'admin123' }
  };
  
  const user = users[userType.toLowerCase()];
  if (!user) {
    throw new Error(`Unknown user type: ${userType}`);
  }
  
  await this.loginPage.navigateToLogin();
  await this.loginPage.loginWithCredentials(user.email, user.password);
  this.setCurrentUser({ ...user, type: userType });
});

// Handle different product categories
When('I browse {string} products', async function(this: CustomWorld, category: string) {
  await this.catalogPage.navigateToCategory(category);
  this.setTestData('currentCategory', category);
});

// Flexible assertion patterns
Then('I should see {int} {string} in the results', async function(
  this: CustomWorld, 
  count: number, 
  itemType: string
) {
  let actualCount: number;
  
  switch (itemType.toLowerCase()) {
    case 'products':
    case 'items':
      actualCount = await this.catalogPage.getProductCount();
      break;
    case 'search results':
      actualCount = await this.searchPage.getResultCount();
      break;
    default:
      throw new Error(`Unknown item type: ${itemType}`);
  }
  
  expect(actualCount).toBe(count);
});
```

---

## Complex Scenario Management

Managing complex scenarios that span multiple pages and require shared state.

### 1. Shopping Flow Integration

```typescript
// step-definitions/shopping-flow.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Gherkin scenario:
// Given I have selected products for purchase
// When I proceed through the checkout process
// Then I should complete the purchase successfully

Given('I have selected products for purchase', async function(this: CustomWorld) {
  // Add multiple products to create a realistic shopping scenario
  const products = [
    { id: 'laptop-123', quantity: 1 },
    { id: 'mouse-456', quantity: 2 },
    { id: 'keyboard-789', quantity: 1 }
  ];
  
  for (const product of products) {
    await this.productPage.navigateToProduct(product.id);
    await this.productPage.addToCart(product.quantity);
  }
  
  this.setTestData('selectedProducts', products);
});

When('I proceed through the checkout process', async function(this: CustomWorld) {
  // Navigate to cart
  await this.shoppingCartPage.navigateToCart();
  
  // Verify cart contents
  const cartItems = await this.shoppingCartPage.getCartItems();
  const selectedProducts = this.getTestData('selectedProducts');
  expect(cartItems.length).toBe(selectedProducts.length);
  
  // Proceed to checkout
  await this.shoppingCartPage.proceedToCheckout();
  
  // Fill checkout form
  await this.checkoutPage.fillShippingAddress({
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Test Street',
    city: 'Test City',
    zipCode: '12345',
    country: 'US'
  });
  
  await this.checkoutPage.selectShippingMethod('standard');
  await this.checkoutPage.fillPaymentInfo({
    cardNumber: '4111111111111111',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123'
  });
});

Then('I should complete the purchase successfully', async function(this: CustomWorld) {
  await this.checkoutPage.submitOrder();
  
  // Wait for confirmation page
  await this.orderConfirmationPage.waitForConfirmation();
  
  // Verify order details
  const orderNumber = await this.orderConfirmationPage.getOrderNumber();
  expect(orderNumber).toBeTruthy();
  
  const orderItems = await this.orderConfirmationPage.getOrderItems();
  const selectedProducts = this.getTestData('selectedProducts');
  expect(orderItems.length).toBe(selectedProducts.length);
  
  this.setTestData('completedOrderNumber', orderNumber);
});
```

### 2. Error Handling and Recovery

```typescript
// step-definitions/error-handling.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I attempt to checkout with invalid payment information', async function(this: CustomWorld) {
  try {
    await this.checkoutPage.fillPaymentInfo({
      cardNumber: '1234567890123456', // Invalid card
      expiryMonth: '01',
      expiryYear: '2020', // Expired
      cvv: '000'
    });
    
    await this.checkoutPage.submitOrder();
    
  } catch (error) {
    // Log error for debugging but don't fail the test
    console.warn('Expected error during invalid payment:', error.message);
    this.setTestData('checkoutError', error.message);
  }
});

Then('I should see payment validation errors', async function(this: CustomWorld) {
  const hasPaymentError = await this.checkoutPage.hasPaymentError();
  expect(hasPaymentError).toBe(true);
  
  const errorMessages = await this.checkoutPage.getPaymentErrorMessages();
  expect(errorMessages.length).toBeGreaterThan(0);
  
  // Verify specific error types
  const errorText = errorMessages.join(' ').toLowerCase();
  expect(errorText).toMatch(/(invalid|expired|card)/);
});

When('I retry with valid payment information', async function(this: CustomWorld) {
  // Clear previous errors
  await this.checkoutPage.clearPaymentForm();
  
  // Enter valid payment info
  await this.checkoutPage.fillPaymentInfo({
    cardNumber: '4111111111111111',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123'
  });
  
  await this.checkoutPage.submitOrder();
});
```

---

## Advanced Integration Patterns

### 1. Page Object Composition

```typescript
// step-definitions/composition.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Combining multiple page objects for complex workflows
When('I perform a complete product search and purchase', async function(this: CustomWorld) {
  // Search phase
  await this.headerComponent.openSearchDialog();
  await this.searchPage.searchForProduct('gaming laptop');
  await this.searchPage.applyFilters({
    priceRange: '1000-2000',
    brand: 'TechBrand',
    rating: '4+'
  });
  
  // Selection phase
  const searchResults = await this.searchPage.getSearchResults();
  const selectedProduct = searchResults[0];
  await this.searchPage.selectProduct(selectedProduct.id);
  
  // Product details phase
  await this.productPage.verifyProductDetails();
  await this.productPage.selectProductOptions({
    color: 'Black',
    storage: '512GB',
    warranty: '2-year'
  });
  
  // Cart phase
  await this.productPage.addToCart(1);
  await this.shoppingCartPage.navigateToCart();
  await this.shoppingCartPage.verifyCartContents();
  
  // Store product info for later verification
  this.setCurrentProduct(selectedProduct);
});
```

### 2. Context Sharing Between Steps

```typescript
// support/context-manager.ts
export class ContextManager {
  private static contexts: Map<string, any> = new Map();
  
  static setContext(key: string, value: any): void {
    this.contexts.set(key, value);
  }
  
  static getContext(key: string): any {
    return this.contexts.get(key);
  }
  
  static clearContext(): void {
    this.contexts.clear();
  }
  
  static hasContext(key: string): boolean {
    return this.contexts.has(key);
  }
}

// step-definitions/context-sharing.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { ContextManager } from '../support/context-manager';
import { CustomWorld } from '../support/world';

Given('I have saved a product for later', async function(this: CustomWorld) {
  await this.productPage.navigateToProduct('special-offer-123');
  const productDetails = await this.productPage.getProductDetails();
  
  // Save to wishlist
  await this.productPage.addToWishlist();
  
  // Store in shared context for other steps
  ContextManager.setContext('savedProduct', productDetails);
});

When('I return to the saved product', async function(this: CustomWorld) {
  const savedProduct = ContextManager.getContext('savedProduct');
  expect(savedProduct).toBeDefined();
  
  await this.wishlistPage.navigateToWishlist();
  await this.wishlistPage.selectProduct(savedProduct.id);
});

Then('the product details should be preserved', async function(this: CustomWorld) {
  const savedProduct = ContextManager.getContext('savedProduct');
  const currentProduct = await this.productPage.getProductDetails();
  
  expect(currentProduct.id).toBe(savedProduct.id);
  expect(currentProduct.name).toBe(savedProduct.name);
  expect(currentProduct.price).toBe(savedProduct.price);
});
```

---

## Best Practices Summary

### 1. World Object Design

```typescript
// ✅ Good: Clean, focused world object
export class CustomWorld extends World {
  // Core dependencies
  public page!: Page;
  
  // Page objects (lazily initialized)
  private _loginPage?: LoginPage;
  private _productPage?: ProductPage;
  
  // Getters for lazy initialization
  get loginPage(): LoginPage {
    if (!this._loginPage) {
      this._loginPage = new LoginPage(this.page);
    }
    return this._loginPage;
  }
  
  // Shared state
  public testData: Map<string, any> = new Map();
}

// ❌ Avoid: Overly complex world object
export class BadWorld extends World {
  // Too many responsibilities
  public database: DatabaseConnection;
  public apiClient: ApiClient;
  public emailService: EmailService;
  // ... many more dependencies
}
```

### 2. Step Definition Design

```typescript
// ✅ Good: Focused, reusable steps
Given('I am on the {string} page', async function(this: CustomWorld, pageName: string) {
  const pageMap = {
    'login': () => this.loginPage.navigateToLogin(),
    'product catalog': () => this.catalogPage.navigateToCatalog(),
    'shopping cart': () => this.shoppingCartPage.navigateToCart()
  };
  
  const navigateAction = pageMap[pageName.toLowerCase()];
  if (!navigateAction) {
    throw new Error(`Unknown page: ${pageName}`);
  }
  
  await navigateAction();
});

// ❌ Avoid: Overly specific steps
Given('I am on the login page with blue theme and large fonts', async function() {
  // Too specific - creates maintenance burden
});
```

### 3. Error Handling

```typescript
// ✅ Good: Proper error handling in steps
When('I submit the form', async function(this: CustomWorld) {
  try {
    await this.formPage.submitForm();
  } catch (error) {
    // Log for debugging
    console.error('Form submission failed:', error.message);
    
    // Take screenshot for analysis
    await this.takeScreenshot('form-submission-error');
    
    // Re-throw for proper test failure
    throw new Error(`Form submission failed: ${error.message}`);
  }
});
```

---

## Summary

This example demonstrated comprehensive Cucumber integration patterns:

### Key Integration Points

1. **World Object**: Central hub for page object management and shared state
2. **Hook Integration**: Proper lifecycle management with Before/After hooks
3. **Step Definitions**: Clean separation between Gherkin and implementation
4. **Context Management**: Sharing data between steps and scenarios
5. **Error Handling**: Robust error management and debugging support

### Benefits Achieved

- ✅ **Clean Separation**: Business logic separated from technical implementation
- ✅ **Reusability**: Page objects shared across multiple scenarios
- ✅ **Maintainability**: Changes isolated to appropriate layers
- ✅ **Readability**: Tests express clear business intent
- ✅ **Debugging**: Comprehensive error handling and logging

### Pattern Categories

- **Initialization Patterns**: Browser and page object setup
- **Navigation Patterns**: Moving between pages and components
- **Action Patterns**: Performing user interactions
- **Validation Patterns**: Verifying expected outcomes
- **Data Patterns**: Managing test data and context

---

## Next Steps

You've mastered basic Cucumber integration! Continue with:

1. **Practice**: Implement these patterns in your own Cucumber tests
2. **Explore**: Move to [Example 03: Advanced POM Architecture](03-advanced-pom-architecture.md)
3. **Experiment**: Try different World object designs for your use cases
4. **Optimize**: Refine your integration patterns based on team needs

Ready to explore advanced page object architectures? Let's continue! 🚀