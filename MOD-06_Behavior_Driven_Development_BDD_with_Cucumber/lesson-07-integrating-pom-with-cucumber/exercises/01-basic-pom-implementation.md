# Exercise 01: Basic POM Implementation

## Overview

This exercise focuses on implementing fundamental Page Object Model patterns using TypeScript and Playwright. You'll create well-structured page objects that encapsulate page interactions, provide stable locator strategies, and integrate cleanly with TypeScript's type system.

**Duration**: 45 minutes  
**Difficulty**: Beginner  
**Prerequisites**: TypeScript basics, Playwright fundamentals  

## Learning Objectives

By completing this exercise, you will be able to:

- ✅ **Design Page Objects**: Create clean, maintainable page object classes
- ✅ **Implement Locator Strategies**: Use stable, reliable element selectors
- ✅ **Apply TypeScript Best Practices**: Leverage strong typing and interfaces
- ✅ **Handle Basic Errors**: Implement fundamental error handling patterns
- ✅ **Create Validation Methods**: Build comprehensive page state validations

---

## Exercise Scenario

You're working on test automation for an e-commerce application called "TechShop". Your task is to create page objects for the core user journey: login, product browsing, and shopping cart management.

### Application Overview

**TechShop** is a modern e-commerce platform with these key pages:
- **Login Page**: User authentication with email/password
- **Product Catalog**: Product listing with search and filtering
- **Shopping Cart**: Cart management with quantity controls

### Technical Requirements

- **Framework**: Playwright with TypeScript
- **Pattern**: Page Object Model with strong typing
- **Error Handling**: Basic validation and error reporting
- **Locator Strategy**: Prefer `data-testid` attributes, fallback to stable CSS selectors

---

## Setup Instructions

### 1. Project Structure

Create the following directory structure:

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
```

### 2. Initial Setup Code

First, create the base interfaces and types:

```typescript
// src/types/page-types.ts
export interface PageMetadata {
  url: string;
  title: string;
  expectedElements: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ProductFilter {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
```

---

## Task 1: Create Base Page Class (15 minutes)

### Objective
Implement a base page class that provides common functionality for all page objects.

### Requirements

Create `src/pages/base/BasePage.ts` with the following functionality:

#### Core Features
- **Page Management**: Store and manage Playwright Page instance
- **Navigation**: Basic navigation methods
- **Wait Strategies**: Common waiting utilities
- **Error Handling**: Basic error reporting
- **Validation**: Common validation patterns

### Implementation Template

```typescript
// src/pages/base/BasePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { PageMetadata } from '../../types/page-types';

export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page, baseUrl: string = 'http://localhost:3000') {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  // Abstract methods - must be implemented by subclasses
  abstract getPageMetadata(): PageMetadata;
  abstract waitForPageLoad(): Promise<void>;
  abstract isPageLoaded(): Promise<boolean>;

  // TODO: Implement these methods
  
  /**
   * Navigate to the page
   */
  async navigateToPage(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get the current page URL
   */
  async getCurrentUrl(): Promise<string> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(locator: Locator, timeout: number = 5000): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Click an element with error handling
   */
  async clickElement(locator: Locator): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Fill input field with validation
   */
  async fillInput(locator: Locator, value: string): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get text content of an element
   */
  async getElementText(locator: Locator): Promise<string> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
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
}
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Navigation Method:**
```typescript
async navigateToPage(): Promise<void> {
  const metadata = this.getPageMetadata();
  await this.page.goto(`${this.baseUrl}${metadata.url}`);
  await this.waitForPageLoad();
}
```

**Wait Strategy:**
```typescript
async waitForElement(locator: Locator, timeout: number = 5000): Promise<void> {
  await expect(locator).toBeVisible({ timeout });
}
```

**Error Handling Pattern:**
```typescript
async clickElement(locator: Locator): Promise<void> {
  try {
    await this.waitForElement(locator);
    await locator.click();
  } catch (error) {
    await this.takeScreenshot(`click-error-${Date.now()}`);
    throw new Error(`Failed to click element: ${error.message}`);
  }
}
```

</details>

### Validation Criteria

- [ ] **Abstract methods** properly defined
- [ ] **Navigation** works with relative URLs
- [ ] **Error handling** includes screenshots
- [ ] **Wait strategies** use appropriate timeouts
- [ ] **TypeScript types** are properly applied

---

## Task 2: Implement Login Page Object (10 minutes)

### Objective
Create a comprehensive login page object with proper authentication handling.

### Requirements

Create `src/pages/LoginPage.ts` with these features:

#### Page Elements
- Email input field
- Password input field  
- Login button
- Error message display
- "Remember me" checkbox
- "Forgot password" link

#### Methods
- Login with credentials
- Validate error messages
- Check login form state
- Clear login form

### Implementation Template

```typescript
// src/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { PageMetadata, LoginCredentials } from '../types/page-types';

export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly forgotPasswordLink: Locator;

  constructor(page: Page, baseUrl?: string) {
    super(page, baseUrl);
    
    // TODO: Initialize locators using data-testid or stable selectors
    this.emailInput = this.page.locator('[data-testid="email-input"]');
    // Initialize other locators...
  }

  // Page metadata
  getPageMetadata(): PageMetadata {
    return {
      url: '/login',
      title: 'Login - TechShop',
      expectedElements: [
        '[data-testid="email-input"]',
        '[data-testid="password-input"]',  
        '[data-testid="login-button"]'
      ]
    };
  }

  // TODO: Implement these methods

  /**
   * Wait for the login page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Check if the login page is loaded
   */
  async isPageLoaded(): Promise<boolean> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Perform login with provided credentials
   */
  async login(credentials: LoginCredentials): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Clear all form fields
   */
  async clearLoginForm(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageVisible(): Promise<boolean> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Toggle remember me checkbox
   */
  async toggleRememberMe(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Validate login form is ready for input
   */
  async isLoginFormReady(): Promise<boolean> {
    // Your implementation here
    throw new Error('Method not implemented');
  }
}
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Login Method:**
```typescript
async login(credentials: LoginCredentials): Promise<void> {
  await this.fillInput(this.emailInput, credentials.email);
  await this.fillInput(this.passwordInput, credentials.password);
  await this.clickElement(this.loginButton);
}
```

**Page Load Validation:**
```typescript
async waitForPageLoad(): Promise<void> {
  const metadata = this.getPageMetadata();
  await Promise.all(
    metadata.expectedElements.map(selector => 
      this.page.waitForSelector(selector, { state: 'visible' })
    )
  );
}
```

</details>

### Validation Criteria

- [ ] **All locators** use stable selectors
- [ ] **Login method** handles TypeScript types correctly
- [ ] **Error handling** provides meaningful messages
- [ ] **Form validation** checks all required elements
- [ ] **Methods return** appropriate types

---

## Task 3: Implement Product Catalog Page Object (15 minutes)

### Objective
Create a product catalog page object that handles product browsing, search, and filtering.

### Requirements

Create `src/pages/ProductCatalogPage.ts` with these features:

#### Page Elements
- Search input and button
- Category filters
- Price range sliders
- Product grid/list
- Sort dropdown
- Pagination controls

#### Methods
- Search for products
- Apply filters
- Get product information
- Add products to cart
- Navigate through pages

### Implementation Template

```typescript
// src/pages/ProductCatalogPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { PageMetadata, ProductFilter } from '../types/page-types';

export class ProductCatalogPage extends BasePage {
  // Search and filter locators
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly categoryFilters: Locator;
  private readonly priceRangeMin: Locator;
  private readonly priceRangeMax: Locator;
  private readonly sortDropdown: Locator;

  // Product grid locators
  private readonly productGrid: Locator;
  private readonly productCards: Locator;
  private readonly addToCartButtons: Locator;

  // Pagination locators
  private readonly paginationControls: Locator;
  private readonly nextPageButton: Locator;
  private readonly previousPageButton: Locator;

  constructor(page: Page, baseUrl?: string) {
    super(page, baseUrl);
    
    // TODO: Initialize all locators
    this.searchInput = this.page.locator('[data-testid="search-input"]');
    // Initialize other locators...
  }

  getPageMetadata(): PageMetadata {
    return {
      url: '/products',
      title: 'Products - TechShop',
      expectedElements: [
        '[data-testid="search-input"]',
        '[data-testid="product-grid"]',
        '[data-testid="category-filters"]'
      ]
    };
  }

  // TODO: Implement these methods

  /**
   * Wait for product catalog to load
   */
  async waitForPageLoad(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Check if product catalog is loaded
   */
  async isPageLoaded(): Promise<boolean> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Search for products by term
   */
  async searchProducts(searchTerm: string): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Apply product filters
   */
  async applyFilters(filters: ProductFilter): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get product count on current page
   */
  async getProductCount(): Promise<number> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get product information by index
   */
  async getProductInfo(index: number): Promise<{ name: string; price: number; }> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Add product to cart by index
   */
  async addProductToCart(index: number): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Change sort order
   */
  async sortProducts(sortBy: 'price-low' | 'price-high' | 'name' | 'popularity'): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Navigate to next page
   */
  async goToNextPage(): Promise<boolean> {
    // Your implementation here - return false if already on last page
    throw new Error('Method not implemented');
  }

  /**
   * Navigate to previous page
   */
  async goToPreviousPage(): Promise<boolean> {
    // Your implementation here - return false if already on first page
    throw new Error('Method not implemented');
  }

  /**
   * Clear all applied filters
   */
  async clearAllFilters(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }
}
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Search Implementation:**
```typescript
async searchProducts(searchTerm: string): Promise<void> {
  await this.fillInput(this.searchInput, searchTerm);
  await this.clickElement(this.searchButton);
  await this.page.waitForSelector('[data-testid="product-grid"]');
}
```

**Product Count:**
```typescript
async getProductCount(): Promise<number> {
  const products = await this.productCards.count();
  return products;
}
```

**Filter Application:**
```typescript
async applyFilters(filters: ProductFilter): Promise<void> {
  if (filters.category) {
    await this.page.selectOption('[data-testid="category-filter"]', filters.category);
  }
  
  if (filters.priceRange) {
    await this.priceRangeMin.fill(filters.priceRange.min.toString());
    await this.priceRangeMax.fill(filters.priceRange.max.toString());
  }
  
  // Wait for filter application
  await this.page.waitForTimeout(1000);
}
```

</details>

### Validation Criteria

- [ ] **Search functionality** works with various terms
- [ ] **Filtering methods** handle all filter types
- [ ] **Product information** extraction is accurate
- [ ] **Pagination logic** prevents invalid navigation
- [ ] **Sort functionality** updates product order

---

## Task 4: Implement Shopping Cart Page Object (15 minutes)

### Objective
Create a shopping cart page object that manages cart items, quantities, and checkout processes.

### Requirements

Create `src/pages/ShoppingCartPage.ts` with these features:

#### Page Elements
- Cart items list
- Quantity controls (increase/decrease)
- Remove item buttons
- Subtotal and total displays
- Checkout button
- Continue shopping link

#### Methods
- Get cart items and details
- Update item quantities
- Remove items from cart
- Calculate totals
- Proceed to checkout

### Implementation Template

```typescript
// src/pages/ShoppingCartPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { PageMetadata, CartItem } from '../types/page-types';

export class ShoppingCartPage extends BasePage {
  // Cart container locators
  private readonly cartContainer: Locator;
  private readonly cartItems: Locator;
  private readonly emptyCartMessage: Locator;

  // Item control locators
  private readonly quantityInputs: Locator;
  private readonly increaseQuantityButtons: Locator;
  private readonly decreaseQuantityButtons: Locator;
  private readonly removeItemButtons: Locator;

  // Total and checkout locators
  private readonly subtotalDisplay: Locator;
  private readonly totalDisplay: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingLink: Locator;

  constructor(page: Page, baseUrl?: string) {
    super(page, baseUrl);
    
    // TODO: Initialize all locators
    this.cartContainer = this.page.locator('[data-testid="cart-container"]');
    // Initialize other locators...
  }

  getPageMetadata(): PageMetadata {
    return {
      url: '/cart',
      title: 'Shopping Cart - TechShop',
      expectedElements: [
        '[data-testid="cart-container"]',
        '[data-testid="checkout-button"]'
      ]
    };
  }

  // TODO: Implement these methods

  /**
   * Wait for cart page to load
   */
  async waitForPageLoad(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Check if cart page is loaded
   */
  async isPageLoaded(): Promise<boolean> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get all items in the cart
   */
  async getCartItems(): Promise<CartItem[]> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get total number of items in cart
   */
  async getItemCount(): Promise<number> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Update quantity for a specific item
   */
  async updateItemQuantity(itemIndex: number, newQuantity: number): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Increase quantity for an item
   */
  async increaseItemQuantity(itemIndex: number): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Decrease quantity for an item
   */
  async decreaseItemQuantity(itemIndex: number): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemIndex: number): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get cart subtotal
   */
  async getSubtotal(): Promise<number> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Get cart total (including taxes, shipping, etc.)
   */
  async getTotal(): Promise<number> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Continue shopping (go back to products)
   */
  async continueShopping(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    // Your implementation here
    throw new Error('Method not implemented');
  }
}
```

### Implementation Hints

<details>
<summary>💡 Click for implementation hints</summary>

**Cart Items Extraction:**
```typescript
async getCartItems(): Promise<CartItem[]> {
  const items: CartItem[] = [];
  const itemCount = await this.cartItems.count();
  
  for (let i = 0; i < itemCount; i++) {
    const item = this.cartItems.nth(i);
    const name = await item.locator('[data-testid="item-name"]').textContent();
    const priceText = await item.locator('[data-testid="item-price"]').textContent();
    const quantityText = await item.locator('[data-testid="item-quantity"]').inputValue();
    
    items.push({
      productId: await item.getAttribute('data-product-id') || '',
      name: name || '',
      price: parseFloat(priceText?.replace('$', '') || '0'),
      quantity: parseInt(quantityText || '0')
    });
  }
  
  return items;
}
```

**Quantity Update:**
```typescript
async updateItemQuantity(itemIndex: number, newQuantity: number): Promise<void> {
  const quantityInput = this.quantityInputs.nth(itemIndex);
  await quantityInput.fill(newQuantity.toString());
  await quantityInput.press('Enter');
  
  // Wait for cart to update
  await this.page.waitForTimeout(1000);
}
```

</details>

### Validation Criteria

- [ ] **Cart item extraction** handles all item properties
- [ ] **Quantity updates** properly modify cart totals
- [ ] **Item removal** updates cart state correctly
- [ ] **Empty cart state** is properly detected
- [ ] **Total calculations** are accurate

---

## Testing Your Implementation

### Create Test File

Create `tests/page-objects.test.ts` to validate your implementation:

```typescript
import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductCatalogPage } from '../src/pages/ProductCatalogPage';
import { ShoppingCartPage } from '../src/pages/ShoppingCartPage';

test.describe('Page Object Implementation Tests', () => {
  let page: Page;
  let loginPage: LoginPage;
  let catalogPage: ProductCatalogPage;
  let cartPage: ShoppingCartPage;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    loginPage = new LoginPage(page);
    catalogPage = new ProductCatalogPage(page);
    cartPage = new ShoppingCartPage(page);
  });

  test('Login Page - should handle valid login', async () => {
    await loginPage.navigateToPage();
    await expect(await loginPage.isPageLoaded()).toBe(true);
    
    await loginPage.login({
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Add assertions based on your app behavior
  });

  test('Product Catalog - should search and filter products', async () => {
    await catalogPage.navigateToPage();
    await catalogPage.searchProducts('laptop');
    
    const productCount = await catalogPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    await catalogPage.applyFilters({
      category: 'electronics',
      priceRange: { min: 100, max: 1000 }
    });
  });

  test('Shopping Cart - should manage cart items', async () => {
    await cartPage.navigateToPage();
    
    if (await cartPage.isCartEmpty()) {
      // Add some items first
      await catalogPage.navigateToPage();
      await catalogPage.addProductToCart(0);
    }
    
    await cartPage.navigateToPage();
    const items = await cartPage.getCartItems();
    expect(items.length).toBeGreaterThan(0);
    
    await cartPage.updateItemQuantity(0, 2);
    const updatedTotal = await cartPage.getTotal();
    expect(updatedTotal).toBeGreaterThan(0);
  });
});
```

### Run Your Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/page-objects.test.ts

# Run with debug mode
npx playwright test tests/page-objects.test.ts --debug
```

---

## Success Criteria Checklist

### Implementation Requirements

- [ ] **Base Page Class**
  - [ ] Abstract methods properly defined
  - [ ] Common utilities implemented
  - [ ] Error handling with screenshots
  - [ ] TypeScript types correctly applied

- [ ] **Login Page Object**
  - [ ] All form elements properly located
  - [ ] Login method handles credentials correctly
  - [ ] Error message validation works
  - [ ] Form state validation is comprehensive

- [ ] **Product Catalog Page Object**
  - [ ] Search functionality implemented
  - [ ] Filter application works correctly
  - [ ] Product information extraction accurate
  - [ ] Pagination logic prevents errors

- [ ] **Shopping Cart Page Object**
  - [ ] Cart item management functional
  - [ ] Quantity updates work properly
  - [ ] Total calculations are accurate
  - [ ] Empty cart state handled correctly

### Code Quality Standards

- [ ] **TypeScript Usage**
  - [ ] Strong typing throughout (no `any` types)
  - [ ] Interfaces properly defined and used
  - [ ] Return types explicitly declared
  - [ ] Generic types used where appropriate

- [ ] **Locator Strategy**
  - [ ] Prefer `data-testid` attributes
  - [ ] Stable CSS selectors as fallback
  - [ ] No XPath unless absolutely necessary
  - [ ] Locators are descriptive and maintainable

- [ ] **Error Handling**
  - [ ] Try-catch blocks in critical methods
  - [ ] Meaningful error messages
  - [ ] Screenshots on failures
  - [ ] Proper error propagation

- [ ] **Method Design**
  - [ ] Single responsibility principle
  - [ ] Descriptive method names
  - [ ] Appropriate return types
  - [ ] Consistent parameter patterns

### Testing Validation

- [ ] **Test Coverage**
  - [ ] All page objects have basic tests
  - [ ] Happy path scenarios covered
  - [ ] Error scenarios tested
  - [ ] Edge cases considered

- [ ] **Test Quality**
  - [ ] Tests are independent
  - [ ] Proper setup and teardown
  - [ ] Meaningful assertions
  - [ ] Clear test descriptions

---

## Common Issues and Solutions

### Issue 1: Element Not Found
**Problem**: `TimeoutError: Timeout 5000ms exceeded` when locating elements.

**Solution**:
```typescript
// Add proper wait strategies
await this.page.waitForSelector('[data-testid="element"]', { state: 'visible' });
await expect(this.page.locator('[data-testid="element"]')).toBeVisible();
```

### Issue 2: Type Errors
**Problem**: TypeScript compilation errors with page object methods.

**Solution**:
```typescript
// Define proper interfaces and use them consistently
interface LoginResult {
  success: boolean;
  redirectUrl?: string;
  errorMessage?: string;
}

async login(credentials: LoginCredentials): Promise<LoginResult> {
  // Implementation with proper return type
}
```

### Issue 3: Flaky Tests
**Problem**: Tests pass sometimes but fail intermittently.

**Solution**:
```typescript
// Use proper waiting and stabilization
await this.page.waitForLoadState('networkidle');
await expect(element).toBeVisible();
await element.click();
```

### Issue 4: Performance Issues
**Problem**: Page objects are slow and tests take too long.

**Solution**:
```typescript
// Use parallel operations where possible
const [title, url, elementCount] = await Promise.all([
  this.page.title(),
  this.page.url(),
  this.productCards.count()
]);
```

---

## Next Steps

After completing this exercise:

1. **Review Your Code**: Check against the success criteria
2. **Run All Tests**: Ensure everything passes consistently
3. **Refactor**: Improve code based on lessons learned
4. **Document**: Add JSDoc comments to your methods
5. **Prepare**: Get ready for [Exercise 02: Cucumber-POM Integration](02-cucumber-pom-integration.md)

---

## Additional Resources

- 📖 **Playwright Page Object Guide**: [https://playwright.dev/docs/pom](https://playwright.dev/docs/pom)
- 🔧 **TypeScript Best Practices**: [https://www.typescriptlang.org/docs/handbook/2/basic-types.html](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- 📚 **Locator Strategies**: [https://playwright.dev/docs/locators](https://playwright.dev/docs/locators)

---

**Duration Check**: This exercise should take approximately 45 minutes. If you're spending significantly more time, focus on getting the core functionality working first, then refine your implementation.

Ready to build solid page object foundations? Let's implement clean, maintainable page objects that will serve as the backbone for your Cucumber integration! 🚀