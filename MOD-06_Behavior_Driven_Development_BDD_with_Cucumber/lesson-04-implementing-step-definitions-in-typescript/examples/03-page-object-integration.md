# Example 03: Page Object Integration

## Overview

This example demonstrates how to integrate step definitions with the Page Object Model (POM) pattern, creating maintainable and scalable test automation. You'll learn how to connect step definitions to page objects, manage shared state through the World object, and implement professional service layer patterns.

## Learning Objectives

- Integrate step definitions with Page Object Models
- Implement the World object for shared state management
- Use the Page Object Manager pattern for organization
- Create service layer abstractions for business logic
- Handle dependency injection in step definitions
- Implement cross-step data sharing and state management

## Page Object Model Foundation

### Basic Page Object Structure

```typescript
// page-objects/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.getByLabel('Email');
    this.passwordField = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.error-message');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.emailField).toBeVisible();
  }

  async enterCredentials(email: string, password: string): Promise<void> {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent() || '';
  }

  async login(email: string, password: string): Promise<void> {
    await this.enterCredentials(email, password);
    await this.clickLogin();
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
```

### Dashboard Page Object

```typescript
// page-objects/DashboardPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  private readonly page: Page;
  private readonly welcomeMessage: Locator;
  private readonly navigationMenu: Locator;
  private readonly profileLink: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('.welcome-message');
    this.navigationMenu = page.getByRole('navigation');
    this.profileLink = page.getByRole('link', { name: 'Profile' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async waitForLoad(): Promise<void> {
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.navigationMenu).toBeVisible();
  }

  async getWelcomeMessage(): Promise<string> {
    return await this.welcomeMessage.textContent() || '';
  }

  async navigateToProfile(): Promise<void> {
    await this.profileLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.welcomeMessage.isVisible();
  }
}
```

## World Object Implementation

### Custom World Interface

```typescript
// support/world.ts
import { World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { PageManager } from './page-manager';
import { ServiceManager } from './service-manager';

export interface CustomWorld extends World {
  // Browser instances
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  // Page management
  pageManager?: PageManager;
  serviceManager?: ServiceManager;

  // Test data
  testUser?: TestUser;
  testData?: Record<string, any>;
  
  // Session state
  currentSession?: UserSession;
  lastResponse?: any;
  errors?: Error[];
}

export interface TestUser {
  id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UserSession {
  userId: string;
  token?: string;
  loginTime: Date;
  isActive: boolean;
}

// World class implementation
export class CustomWorldImpl extends World implements CustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  pageManager?: PageManager;
  serviceManager?: ServiceManager;
  testUser?: TestUser;
  testData: Record<string, any> = {};
  currentSession?: UserSession;
  lastResponse?: any;
  errors: Error[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initializePage(page: Page): Promise<void> {
    this.page = page;
    this.pageManager = new PageManager(page);
    this.serviceManager = new ServiceManager(page);
  }

  async cleanup(): Promise<void> {
    this.errors = [];
    this.testData = {};
    this.lastResponse = undefined;
    // Keep browser instances for reuse
  }
}
```

### Page Manager Pattern

```typescript
// support/page-manager.ts
import { Page } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { DashboardPage } from '../page-objects/DashboardPage';
import { ProductCatalogPage } from '../page-objects/ProductCatalogPage';
import { CartPage } from '../page-objects/CartPage';
import { CheckoutPage } from '../page-objects/CheckoutPage';

export class PageManager {
  private readonly page: Page;
  private _loginPage?: LoginPage;
  private _dashboardPage?: DashboardPage;
  private _productCatalogPage?: ProductCatalogPage;
  private _cartPage?: CartPage;
  private _checkoutPage?: CheckoutPage;

  constructor(page: Page) {
    this.page = page;
  }

  get loginPage(): LoginPage {
    if (!this._loginPage) {
      this._loginPage = new LoginPage(this.page);
    }
    return this._loginPage;
  }

  get dashboardPage(): DashboardPage {
    if (!this._dashboardPage) {
      this._dashboardPage = new DashboardPage(this.page);
    }
    return this._dashboardPage;
  }

  get productCatalogPage(): ProductCatalogPage {
    if (!this._productCatalogPage) {
      this._productCatalogPage = new ProductCatalogPage(this.page);
    }
    return this._productCatalogPage;
  }

  get cartPage(): CartPage {
    if (!this._cartPage) {
      this._cartPage = new CartPage(this.page);
    }
    return this._cartPage;
  }

  get checkoutPage(): CheckoutPage {
    if (!this._checkoutPage) {
      this._checkoutPage = new CheckoutPage(this.page);
    }
    return this._checkoutPage;
  }

  async navigateToPage(pageName: string): Promise<void> {
    const pageNavigators: Record<string, () => Promise<void>> = {
      'login': () => this.loginPage.navigate(),
      'dashboard': () => this.page.goto('/dashboard'),
      'products': () => this.page.goto('/products'),
      'cart': () => this.page.goto('/cart'),
      'checkout': () => this.page.goto('/checkout')
    };

    const navigator = pageNavigators[pageName.toLowerCase()];
    if (!navigator) {
      throw new Error(`Unknown page: ${pageName}`);
    }

    await navigator();
  }
}
```

## Service Layer Implementation

### Service Manager Pattern

```typescript
// support/service-manager.ts
import { Page } from '@playwright/test';
import { AuthService } from '../services/auth-service';
import { UserService } from '../services/user-service';
import { ProductService } from '../services/product-service';
import { CartService } from '../services/cart-service';

export class ServiceManager {
  private readonly page: Page;
  private _authService?: AuthService;
  private _userService?: UserService;
  private _productService?: ProductService;
  private _cartService?: CartService;

  constructor(page: Page) {
    this.page = page;
  }

  get authService(): AuthService {
    if (!this._authService) {
      this._authService = new AuthService(this.page);
    }
    return this._authService;
  }

  get userService(): UserService {
    if (!this._userService) {
      this._userService = new UserService(this.page);
    }
    return this._userService;
  }

  get productService(): ProductService {
    if (!this._productService) {
      this._productService = new ProductService(this.page);
    }
    return this._productService;
  }

  get cartService(): CartService {
    if (!this._cartService) {
      this._cartService = new CartService(this.page);
    }
    return this._cartService;
  }
}
```

### Authentication Service

```typescript
// services/auth-service.ts
import { Page } from '@playwright/test';
import { TestUser, UserSession } from '../support/world';

export class AuthService {
  constructor(private page: Page) {}

  async loginUser(user: TestUser): Promise<UserSession> {
    // Navigate to login page
    await this.page.goto('/login');

    // Fill credentials
    await this.page.getByLabel('Email').fill(user.email);
    await this.page.getByLabel('Password').fill(user.password);

    // Click login
    await this.page.getByRole('button', { name: 'Login' }).click();

    // Wait for successful login
    await this.page.waitForURL('**/dashboard');

    // Create session object
    const session: UserSession = {
      userId: user.id || 'unknown',
      loginTime: new Date(),
      isActive: true
    };

    return session;
  }

  async loginAsRole(role: string): Promise<UserSession> {
    const userCredentials: Record<string, TestUser> = {
      'admin': {
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      'customer': {
        email: 'customer@example.com',
        password: 'customer123',
        firstName: 'John',
        lastName: 'Customer',
        role: 'customer'
      },
      'manager': {
        email: 'manager@example.com',
        password: 'manager123',
        firstName: 'Jane',
        lastName: 'Manager',
        role: 'manager'
      }
    };

    const user = userCredentials[role.toLowerCase()];
    if (!user) {
      throw new Error(`Unknown role: ${role}`);
    }

    return await this.loginUser(user);
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await this.page.waitForURL('**/login');
  }

  async isLoggedIn(): Promise<boolean> {
    const currentUrl = this.page.url();
    return !currentUrl.includes('/login') && !currentUrl.includes('/register');
  }
}
```

## Step Definitions with Page Object Integration

### Authentication Steps

```typescript
// step-definitions/auth.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the login page', async function (this: CustomWorld) {
  if (!this.pageManager) {
    throw new Error('Page manager not initialized');
  }
  
  await this.pageManager.loginPage.navigate();
  console.log('✅ Navigated to login page');
});

Given('I am logged in as a {string}', async function (this: CustomWorld, role: string) {
  if (!this.serviceManager) {
    throw new Error('Service manager not initialized');
  }

  // Use service layer for authentication
  this.currentSession = await this.serviceManager.authService.loginAsRole(role);
  
  // Verify login success
  expect(await this.serviceManager.authService.isLoggedIn()).toBeTruthy();
  
  console.log(`✅ Logged in as ${role}`);
});

When('I login with email {string} and password {string}', 
  async function (this: CustomWorld, email: string, password: string) {
    if (!this.pageManager) {
      throw new Error('Page manager not initialized');
    }

    // Use page object for UI interaction
    await this.pageManager.loginPage.login(email, password);
    
    // Store test user data
    this.testUser = {
      email,
      password,
      firstName: 'Test',
      lastName: 'User',
      role: 'customer'
    };
    
    console.log(`✅ Attempted login with ${email}`);
  }
);

Then('I should be logged in successfully', async function (this: CustomWorld) {
  if (!this.pageManager || !this.serviceManager) {
    throw new Error('Managers not initialized');
  }

  // Wait for dashboard to load
  await this.pageManager.dashboardPage.waitForLoad();
  
  // Verify login state
  expect(await this.serviceManager.authService.isLoggedIn()).toBeTruthy();
  
  // Create session record
  this.currentSession = {
    userId: this.testUser?.email || 'unknown',
    loginTime: new Date(),
    isActive: true
  };
  
  console.log('✅ Login successful - redirected to dashboard');
});

Then('I should see a login error', async function (this: CustomWorld) {
  if (!this.pageManager) {
    throw new Error('Page manager not initialized');
  }

  // Check for error using page object
  expect(await this.pageManager.loginPage.isErrorDisplayed()).toBeTruthy();
  
  const errorMessage = await this.pageManager.loginPage.getErrorMessage();
  expect(errorMessage).toContain('Invalid');
  
  console.log(`✅ Login error displayed: ${errorMessage}`);
});
```

### Product Management Steps

```typescript
// step-definitions/products.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the product catalog', async function (this: CustomWorld) {
  if (!this.pageManager) {
    throw new Error('Page manager not initialized');
  }

  await this.pageManager.navigateToPage('products');
  await this.pageManager.productCatalogPage.waitForLoad();
  
  console.log('✅ Navigated to product catalog');
});

When('I search for product {string}', async function (this: CustomWorld, productName: string) {
  if (!this.pageManager) {
    throw new Error('Page manager not initialized');
  }

  await this.pageManager.productCatalogPage.searchProduct(productName);
  
  // Store search term for later verification
  this.testData.lastSearch = productName;
  
  console.log(`✅ Searched for product: ${productName}`);
});

When('I add product {string} to cart', async function (this: CustomWorld, productName: string) {
  if (!this.pageManager || !this.serviceManager) {
    throw new Error('Managers not initialized');
  }

  // Find and add product using page object
  await this.pageManager.productCatalogPage.addProductToCart(productName);
  
  // Update cart state using service
  const cartItems = await this.serviceManager.cartService.getCartItems();
  this.testData.cartItems = cartItems;
  
  console.log(`✅ Added ${productName} to cart`);
});

Then('the product should be in my cart', async function (this: CustomWorld) {
  if (!this.pageManager || !this.serviceManager) {
    throw new Error('Managers not initialized');
  }

  // Navigate to cart
  await this.pageManager.navigateToPage('cart');
  
  // Verify cart contents
  const cartItems = await this.serviceManager.cartService.getCartItems();
  expect(cartItems.length).toBeGreaterThan(0);
  
  // Update stored cart data
  this.testData.cartItems = cartItems;
  
  console.log(`✅ Cart contains ${cartItems.length} items`);
});
```

### Complex Workflow Steps

```typescript
// step-definitions/checkout.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I proceed to checkout', async function (this: CustomWorld) {
  if (!this.pageManager || !this.serviceManager) {
    throw new Error('Managers not initialized');
  }

  // Get current cart state
  const cartItems = await this.serviceManager.cartService.getCartItems();
  if (cartItems.length === 0) {
    throw new Error('Cannot checkout with empty cart');
  }

  // Navigate to checkout
  await this.pageManager.navigateToPage('checkout');
  await this.pageManager.checkoutPage.waitForLoad();
  
  // Store checkout start time
  this.testData.checkoutStartTime = new Date();
  
  console.log('✅ Proceeded to checkout');
});

When('I fill in shipping information:', async function (this: CustomWorld, dataTable) {
  if (!this.pageManager) {
    throw new Error('Page manager not initialized');
  }

  const shippingData = dataTable.hashes()[0];
  
  // Use page object to fill shipping form
  await this.pageManager.checkoutPage.fillShippingInformation({
    firstName: shippingData.firstName,
    lastName: shippingData.lastName,
    address: shippingData.address,
    city: shippingData.city,
    zipCode: shippingData.zipCode
  });
  
  // Store shipping data for verification
  this.testData.shippingInfo = shippingData;
  
  console.log('✅ Filled shipping information');
});

When('I complete the payment', async function (this: CustomWorld) {
  if (!this.pageManager) {
    throw new Error('Page manager not initialized');
  }

  // Use page object for payment
  await this.pageManager.checkoutPage.completePayment();
  
  // Record completion time
  this.testData.checkoutCompleteTime = new Date();
  
  console.log('✅ Completed payment');
});

Then('I should see order confirmation', async function (this: CustomWorld) {
  if (!this.pageManager) {
    throw new Error('Page manager not initialized');
  }

  // Wait for confirmation page
  await this.page?.waitForURL('**/order-confirmation');
  
  // Verify confirmation elements
  const orderNumber = await this.pageManager.checkoutPage.getOrderNumber();
  expect(orderNumber).toMatch(/ORD-\d+/);
  
  // Store order information
  this.testData.orderNumber = orderNumber;
  
  console.log(`✅ Order confirmed: ${orderNumber}`);
});
```

## Advanced Integration Patterns

### Service Layer with API Integration

```typescript
// services/hybrid-service.ts
import { Page, APIRequestContext } from '@playwright/test';

export class HybridService {
  constructor(
    private page: Page, 
    private apiContext: APIRequestContext
  ) {}

  async createUserViaAPI(userData: any): Promise<any> {
    // Create user via API for faster setup
    const response = await this.apiContext.post('/api/users', {
      data: userData
    });
    
    return await response.json();
  }

  async loginViaUI(credentials: any): Promise<void> {
    // Use UI for login to maintain session
    await this.page.goto('/login');
    await this.page.getByLabel('Email').fill(credentials.email);
    await this.page.getByLabel('Password').fill(credentials.password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async verifyUserProfile(): Promise<boolean> {
    // Verify profile via both UI and API
    const uiProfile = await this.getUIProfile();
    const apiProfile = await this.getAPIProfile();
    
    return JSON.stringify(uiProfile) === JSON.stringify(apiProfile);
  }

  private async getUIProfile(): Promise<any> {
    await this.page.goto('/profile');
    return {
      name: await this.page.getByLabel('Name').inputValue(),
      email: await this.page.getByLabel('Email').inputValue()
    };
  }

  private async getAPIProfile(): Promise<any> {
    const response = await this.apiContext.get('/api/profile');
    return await response.json();
  }
}
```

### State Management Across Steps

```typescript
// Complex state management example
When('I perform a multi-step workflow', async function (this: CustomWorld) {
  if (!this.pageManager || !this.serviceManager) {
    throw new Error('Managers not initialized');
  }

  // Step 1: Login
  await this.serviceManager.authService.loginAsRole('customer');
  
  // Step 2: Browse products
  await this.pageManager.navigateToPage('products');
  const products = await this.pageManager.productCatalogPage.getAvailableProducts();
  
  // Step 3: Add multiple items
  const selectedProducts = products.slice(0, 3);
  for (const product of selectedProducts) {
    await this.pageManager.productCatalogPage.addProductToCart(product.name);
  }
  
  // Step 4: Update shared state
  this.testData.workflowState = {
    step: 'products-added',
    products: selectedProducts,
    timestamp: new Date(),
    userId: this.currentSession?.userId
  };
  
  console.log(`✅ Completed workflow step: ${selectedProducts.length} products added`);
});

Then('the workflow state should be preserved', async function (this: CustomWorld) {
  // Verify workflow state was maintained
  expect(this.testData.workflowState).toBeDefined();
  expect(this.testData.workflowState.step).toBe('products-added');
  expect(this.testData.workflowState.products).toHaveLength(3);
  
  // Verify UI state matches stored state
  await this.pageManager?.navigateToPage('cart');
  const cartItems = await this.serviceManager?.cartService.getCartItems();
  expect(cartItems).toHaveLength(this.testData.workflowState.products.length);
  
  console.log('✅ Workflow state preserved correctly');
});
```

## Error Handling and Recovery

### Robust Error Handling

```typescript
When('I attempt an operation that might fail', async function (this: CustomWorld) {
  try {
    // Attempt the operation
    await this.pageManager?.productCatalogPage.performComplexOperation();
    
  } catch (error) {
    // Store error for later analysis
    this.errors.push(error as Error);
    
    // Take screenshot for debugging
    await this.page?.screenshot({
      path: `screenshots/error-${Date.now()}.png`,
      fullPage: true
    });
    
    // Log detailed error information
    console.error('Operation failed:', {
      error: error.message,
      url: this.page?.url(),
      timestamp: new Date().toISOString()
    });
    
    // Perform recovery actions
    await this.recoverFromError();
    
    throw error; // Re-throw to fail the test if needed
  }
});

private async recoverFromError(this: CustomWorld): Promise<void> {
  // Attempt to recover to a known good state
  try {
    await this.page?.goto('/dashboard');
    await this.pageManager?.dashboardPage.waitForLoad();
    console.log('✅ Recovered to dashboard');
  } catch (recoveryError) {
    console.error('Recovery failed:', recoveryError);
  }
}
```

## Best Practices Summary

### **Page Object Integration**
- Use dependency injection for page objects
- Implement the manager pattern for organization
- Create service layers for business logic
- Maintain clear separation of concerns

### **State Management**
- Use the World object for shared state
- Store relevant test data for verification
- Implement cleanup strategies
- Handle session management properly

### **Error Handling**
- Implement comprehensive error recovery
- Store error information for debugging
- Use screenshots and logging for troubleshooting
- Provide meaningful error messages

### **Performance**
- Lazy-load page objects and services
- Reuse browser instances when possible
- Cache frequently used data
- Optimize wait strategies

---

*This integration pattern creates a robust foundation for enterprise-level BDD test automation, enabling teams to build maintainable and scalable test suites that can evolve with the application.*