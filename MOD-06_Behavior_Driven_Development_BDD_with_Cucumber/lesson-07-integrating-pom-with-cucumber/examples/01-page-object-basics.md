# Example 01: Page Object Basics

## Learning Objectives

By the end of this example, you will be able to:

- 🎯 **Understand POM Principles**: Explain the core concepts and benefits of the Page Object Model pattern
- 🏗️ **Implement Basic Page Objects**: Create well-structured page objects using TypeScript
- 🔍 **Design Locator Strategies**: Apply best practices for element identification and management
- ⚡ **Build Action Methods**: Implement intuitive methods for page interactions
- 🛡️ **Apply Type Safety**: Leverage TypeScript features for robust page object design

---

## Introduction

The Page Object Model (POM) is a fundamental design pattern in test automation that creates an abstraction layer between your tests and the web pages they interact with. This pattern promotes code reusability, maintainability, and reduces the impact of UI changes on your test suite.

### Why Page Object Model?

**Without POM (Problematic Approach):**
```typescript
// ❌ Direct element interactions scattered across tests
test('user login', async ({ page }) => {
  await page.locator('#email').fill('user@example.com');
  await page.locator('#password').fill('password123');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('.welcome-message')).toBeVisible();
});

test('invalid login', async ({ page }) => {
  await page.locator('#email').fill('invalid@example.com');
  await page.locator('#password').fill('wrongpassword');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('.error-message')).toBeVisible();
});
```

**Problems with this approach:**
- **Duplication**: Same selectors repeated across multiple tests
- **Maintenance Nightmare**: UI changes require updates in many places
- **Poor Readability**: Tests focus on implementation details rather than business logic
- **No Abstraction**: Tests are tightly coupled to UI structure

**With POM (Clean Approach):**
```typescript
// ✅ Page object encapsulates page interactions
class LoginPage {
  constructor(private page: Page) {}

  private readonly emailInput = this.page.locator('#email');
  private readonly passwordInput = this.page.locator('#password');
  private readonly loginButton = this.page.locator('button[type="submit"]');
  private readonly welcomeMessage = this.page.locator('.welcome-message');
  private readonly errorMessage = this.page.locator('.error-message');

  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isWelcomeMessageVisible(): Promise<boolean> {
    return await this.welcomeMessage.isVisible();
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}

// Clean, readable tests
test('user login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginWithCredentials('user@example.com', 'password123');
  expect(await loginPage.isWelcomeMessageVisible()).toBe(true);
});
```

---

## Core POM Principles

### 1. Encapsulation
Page objects should hide the implementation details of how elements are located and interacted with.

```typescript
export class ShoppingCartPage {
  constructor(private page: Page) {}

  // ✅ Private locators - implementation details hidden
  private readonly addToCartButton = this.page.locator('[data-testid="add-to-cart"]');
  private readonly cartItemsCounter = this.page.locator('.cart-count');
  private readonly cartItems = this.page.locator('.cart-item');

  // ✅ Public methods - expose business actions
  async addItemToCart(): Promise<void> {
    await this.addToCartButton.click();
    // Wait for cart to update
    await this.page.waitForTimeout(500);
  }

  async getCartItemCount(): Promise<number> {
    const countText = await this.cartItemsCounter.textContent();
    return parseInt(countText || '0', 10);
  }

  async getCartItems(): Promise<string[]> {
    const items = await this.cartItems.all();
    return Promise.all(items.map(item => item.textContent() || ''));
  }
}
```

### 2. Single Responsibility
Each page object should represent a single page or logical component.

```typescript
// ✅ Good: Each class has a single responsibility
export class LoginPage {
  // Handles login-specific functionality
}

export class NavigationHeader {
  // Handles navigation-specific functionality
}

export class ProductCatalog {
  // Handles catalog-specific functionality
}

// ❌ Avoid: Mixed responsibilities
export class LoginAndNavigationPage {
  // This class tries to do too much
}
```

### 3. Page Factory Pattern
Use consistent construction patterns for page objects.

```typescript
export abstract class BasePage {
  constructor(protected page: Page) {}

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Login-specific methods
  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }
}
```

---

## Complete Page Object Implementation

Let's build a comprehensive page object for an e-commerce product page:

### 1. Basic Structure with TypeScript Types

```typescript
// types/product.types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

export interface ProductReview {
  rating: number;
  comment: string;
  author: string;
  date: string;
}
```

### 2. Page Object Implementation

```typescript
// pages/ProductPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { Product, ProductReview } from '../types/product.types';

export class ProductPage {
  constructor(private page: Page) {}

  // Element Locators - Private and organized by functionality
  private readonly productContainer = this.page.locator('.product-container');
  
  // Product Information Elements
  private readonly productName = this.page.locator('[data-testid="product-name"]');
  private readonly productPrice = this.page.locator('[data-testid="product-price"]');
  private readonly productDescription = this.page.locator('[data-testid="product-description"]');
  private readonly productImage = this.page.locator('[data-testid="product-image"]');
  private readonly stockStatus = this.page.locator('[data-testid="stock-status"]');

  // Action Elements
  private readonly quantitySelector = this.page.locator('[data-testid="quantity-selector"]');
  private readonly addToCartButton = this.page.locator('[data-testid="add-to-cart"]');
  private readonly buyNowButton = this.page.locator('[data-testid="buy-now"]');
  private readonly wishlistButton = this.page.locator('[data-testid="add-to-wishlist"]');

  // Review Elements
  private readonly reviewsSection = this.page.locator('[data-testid="reviews-section"]');
  private readonly reviewItems = this.page.locator('.review-item');
  private readonly writeReviewButton = this.page.locator('[data-testid="write-review"]');

  // Navigation Methods
  async navigateToProduct(productId: string): Promise<void> {
    await this.page.goto(`/products/${productId}`);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.productContainer.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  // Information Retrieval Methods
  async getProductDetails(): Promise<Product> {
    await this.productContainer.waitFor({ state: 'visible' });

    const [name, priceText, description, inStockText] = await Promise.all([
      this.productName.textContent(),
      this.productPrice.textContent(),
      this.productDescription.textContent(),
      this.stockStatus.textContent()
    ]);

    // Extract numeric price from formatted string (e.g., "$29.99" -> 29.99)
    const price = parseFloat(priceText?.replace(/[^0-9.]/g, '') || '0');
    const inStock = inStockText?.toLowerCase().includes('in stock') || false;

    return {
      id: await this.page.url().split('/').pop() || '',
      name: name || '',
      price,
      description: description || '',
      inStock
    };
  }

  async getProductPrice(): Promise<number> {
    const priceText = await this.productPrice.textContent();
    return parseFloat(priceText?.replace(/[^0-9.]/g, '') || '0');
  }

  async isProductInStock(): Promise<boolean> {
    const stockText = await this.stockStatus.textContent();
    return stockText?.toLowerCase().includes('in stock') || false;
  }

  async getProductImageSrc(): Promise<string> {
    return await this.productImage.getAttribute('src') || '';
  }

  // Action Methods
  async selectQuantity(quantity: number): Promise<void> {
    await this.quantitySelector.selectOption(quantity.toString());
  }

  async addToCart(quantity: number = 1): Promise<void> {
    if (quantity > 1) {
      await this.selectQuantity(quantity);
    }
    
    await this.addToCartButton.click();
    
    // Wait for success feedback
    await this.page.waitForSelector('.cart-success-message', { 
      state: 'visible',
      timeout: 5000 
    });
  }

  async buyNow(): Promise<void> {
    await this.buyNowButton.click();
    // Wait for navigation to checkout
    await this.page.waitForURL(/.*\/checkout.*/);
  }

  async addToWishlist(): Promise<void> {
    const isInWishlist = await this.isInWishlist();
    await this.wishlistButton.click();
    
    // Wait for state change
    await this.page.waitForTimeout(1000);
    
    // Verify state changed
    const newState = await this.isInWishlist();
    expect(newState).toBe(!isInWishlist);
  }

  // Validation Methods
  async isAddToCartButtonEnabled(): Promise<boolean> {
    return await this.addToCartButton.isEnabled();
  }

  async isInWishlist(): Promise<boolean> {
    const buttonClass = await this.wishlistButton.getAttribute('class');
    return buttonClass?.includes('in-wishlist') || false;
  }

  async validateProductPageLoaded(): Promise<void> {
    await expect(this.productContainer).toBeVisible();
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
  }

  // Review Methods
  async getProductReviews(): Promise<ProductReview[]> {
    await this.reviewsSection.scrollIntoViewIfNeeded();
    const reviewElements = await this.reviewItems.all();
    
    const reviews: ProductReview[] = [];
    
    for (const review of reviewElements) {
      const rating = await review.locator('.rating-stars').getAttribute('data-rating');
      const comment = await review.locator('.review-comment').textContent();
      const author = await review.locator('.review-author').textContent();
      const date = await review.locator('.review-date').textContent();
      
      reviews.push({
        rating: parseInt(rating || '0'),
        comment: comment || '',
        author: author || '',
        date: date || ''
      });
    }
    
    return reviews;
  }

  async getAverageRating(): Promise<number> {
    const reviews = await this.getProductReviews();
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal
  }

  // Utility Methods
  async takeProductScreenshot(fileName: string): Promise<void> {
    await this.productContainer.screenshot({ 
      path: `screenshots/${fileName}.png`,
      fullPage: false 
    });
  }

  async scrollToReviews(): Promise<void> {
    await this.reviewsSection.scrollIntoViewIfNeeded();
  }

  async shareProduct(): Promise<string> {
    // Simulate getting shareable URL
    return await this.page.url();
  }
}
```

### 3. Advanced Locator Strategies

```typescript
export class ProductPage {
  constructor(private page: Page) {}

  // ✅ Preferred: Use data-testid attributes
  private readonly productName = this.page.locator('[data-testid="product-name"]');
  
  // ✅ Good: Use semantic selectors when data-testid unavailable
  private readonly productPrice = this.page.locator('h2:has-text("Price")').locator('+ span');
  
  // ✅ Acceptable: Use stable CSS classes
  private readonly addToCartButton = this.page.locator('.btn-add-to-cart');
  
  // ✅ Complex selectors for dynamic content
  private getReviewByAuthor(authorName: string): Locator {
    return this.page.locator('.review-item')
      .filter({ hasText: authorName });
  }
  
  private getProductByName(productName: string): Locator {
    return this.page.locator('.product-card')
      .filter({ hasText: productName });
  }

  // ✅ Parameterized locators for flexibility
  private getQuantityOption(quantity: number): Locator {
    return this.page.locator(`option[value="${quantity}"]`);
  }

  // ❌ Avoid: Fragile XPath and index-based selectors
  // private readonly productName = this.page.locator('xpath=//div[1]/h1[2]');
  // private readonly firstButton = this.page.locator('button').first();
}
```

---

## Integration with Test Framework

### 1. Using Page Objects in Tests

```typescript
// tests/product-page.spec.ts
import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

test.describe('Product Page Tests', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    await productPage.navigateToProduct('laptop-123');
  });

  test('should display product information correctly', async () => {
    // Verify page loaded
    await productPage.validateProductPageLoaded();

    // Get product details
    const product = await productPage.getProductDetails();
    
    // Assertions
    expect(product.name).toBeTruthy();
    expect(product.price).toBeGreaterThan(0);
    expect(product.description).toBeTruthy();
  });

  test('should add product to cart successfully', async () => {
    // Verify product is in stock
    const inStock = await productPage.isProductInStock();
    expect(inStock).toBe(true);

    // Add to cart
    await productPage.addToCart(2);

    // Verify button state changed
    // Additional verification would depend on your application's feedback
  });

  test('should handle out of stock products', async ({ page }) => {
    // Navigate to out-of-stock product
    await productPage.navigateToProduct('out-of-stock-item');

    // Verify add to cart is disabled
    const isEnabled = await productPage.isAddToCartButtonEnabled();
    expect(isEnabled).toBe(false);
  });

  test('should display product reviews', async () => {
    const reviews = await productPage.getProductReviews();
    expect(reviews.length).toBeGreaterThan(0);

    // Verify review structure
    const firstReview = reviews[0];
    expect(firstReview.rating).toBeGreaterThanOrEqual(1);
    expect(firstReview.rating).toBeLessThanOrEqual(5);
    expect(firstReview.comment).toBeTruthy();
    expect(firstReview.author).toBeTruthy();
  });
});
```

### 2. Page Object Factory Pattern

```typescript
// utils/PageFactory.ts
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

export class PageFactory {
  constructor(private page: Page) {}

  getLoginPage(): LoginPage {
    return new LoginPage(this.page);
  }

  getProductPage(): ProductPage {
    return new ProductPage(this.page);
  }

  getShoppingCartPage(): ShoppingCartPage {
    return new ShoppingCartPage(this.page);
  }

  getCheckoutPage(): CheckoutPage {
    return new CheckoutPage(this.page);
  }
}

// Usage in tests
test('complete purchase flow', async ({ page }) => {
  const pages = new PageFactory(page);
  
  // Login
  const loginPage = pages.getLoginPage();
  await loginPage.loginWithCredentials('user@example.com', 'password');
  
  // Add product to cart
  const productPage = pages.getProductPage();
  await productPage.navigateToProduct('laptop-123');
  await productPage.addToCart();
  
  // Checkout
  const cartPage = pages.getShoppingCartPage();
  await cartPage.proceedToCheckout();
  
  const checkoutPage = pages.getCheckoutPage();
  await checkoutPage.completePurchase();
});
```

---

## Best Practices and Common Patterns

### 1. Method Naming Conventions

```typescript
export class ProductPage {
  // ✅ Action methods: Use verbs, return void or next page object
  async addToCart(): Promise<void> { }
  async selectQuantity(qty: number): Promise<void> { }
  async navigateToProduct(id: string): Promise<void> { }

  // ✅ Query methods: Use get/is/has, return data
  async getProductName(): Promise<string> { }
  async isProductInStock(): Promise<boolean> { }
  async hasReviews(): Promise<boolean> { }

  // ✅ Validation methods: Use validate/verify, throw or return boolean
  async validateProductDisplayed(): Promise<void> { }
  async verifyPriceFormat(): Promise<boolean> { }

  // ❌ Avoid: Mixed concerns in method names
  // async addToCartAndVerifySuccess(): Promise<boolean> { }
}
```

### 2. Error Handling

```typescript
export class ProductPage {
  async addToCart(quantity: number = 1): Promise<void> {
    try {
      // Check if product is available
      const inStock = await this.isProductInStock();
      if (!inStock) {
        throw new Error('Cannot add out-of-stock product to cart');
      }

      // Set quantity if different from default
      if (quantity > 1) {
        await this.selectQuantity(quantity);
      }

      // Perform the action
      await this.addToCartButton.click();

      // Wait for confirmation
      await this.page.waitForSelector('.success-message', { timeout: 5000 });
      
    } catch (error) {
      // Log for debugging
      console.error(`Failed to add product to cart: ${error.message}`);
      
      // Take screenshot for analysis
      await this.page.screenshot({ 
        path: `debug/add-to-cart-error-${Date.now()}.png` 
      });
      
      // Re-throw for test handling
      throw error;
    }
  }
}
```

### 3. Waiting Strategies

```typescript
export class ProductPage {
  // ✅ Wait for specific conditions
  async waitForProductLoad(): Promise<void> {
    await Promise.all([
      this.productName.waitFor({ state: 'visible' }),
      this.productPrice.waitFor({ state: 'visible' }),
      this.addToCartButton.waitFor({ state: 'visible' })
    ]);
  }

  // ✅ Smart waiting based on element state
  async addToCart(): Promise<void> {
    // Wait for button to be enabled
    await this.addToCartButton.waitFor({ state: 'visible' });
    await expect(this.addToCartButton).toBeEnabled();
    
    await this.addToCartButton.click();
    
    // Wait for cart to update
    await this.page.waitForResponse(response => 
      response.url().includes('/api/cart') && response.status() === 200
    );
  }

  // ❌ Avoid: Fixed timeouts
  // await this.page.waitForTimeout(3000); // Brittle and slow
}
```

---

## Common Pitfalls and Solutions

### 1. **Pitfall**: Exposing Locators Publicly

```typescript
// ❌ Bad: Exposes implementation details
export class LoginPage {
  public emailInput = this.page.locator('#email');
  public passwordInput = this.page.locator('#password');
}

// ✅ Good: Encapsulates implementation
export class LoginPage {
  private readonly emailInput = this.page.locator('#email');
  private readonly passwordInput = this.page.locator('#password');

  async enterCredentials(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }
}
```

### 2. **Pitfall**: Methods That Do Too Much

```typescript
// ❌ Bad: Single method does everything
async loginAndNavigateToDashboard(email: string, password: string): Promise<void> {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
  await this.page.waitForURL('/dashboard');
  await expect(this.page.locator('.welcome')).toBeVisible();
}

// ✅ Good: Separate concerns
async login(email: string, password: string): Promise<void> {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}

async isLoginSuccessful(): Promise<boolean> {
  return await this.page.url().includes('/dashboard');
}
```

### 3. **Pitfall**: Not Handling Dynamic Content

```typescript
// ❌ Bad: Assumes content is always present
async getProductPrice(): Promise<number> {
  const priceText = await this.productPrice.textContent();
  return parseFloat(priceText.replace('$', ''));
}

// ✅ Good: Handles various scenarios
async getProductPrice(): Promise<number | null> {
  try {
    await this.productPrice.waitFor({ state: 'visible', timeout: 5000 });
    const priceText = await this.productPrice.textContent();
    
    if (!priceText) {
      return null;
    }
    
    const numericPrice = priceText.replace(/[^0-9.]/g, '');
    return numericPrice ? parseFloat(numericPrice) : null;
    
  } catch (error) {
    console.warn('Price element not found or not visible');
    return null;
  }
}
```

---

## Summary

This example covered the fundamental concepts of implementing Page Object Model with TypeScript:

### Key Takeaways

1. **Encapsulation**: Hide implementation details behind clean interfaces
2. **Single Responsibility**: Each page object represents one logical unit
3. **Type Safety**: Leverage TypeScript for robust, maintainable code
4. **Smart Locators**: Use stable, semantic element selection strategies
5. **Error Handling**: Implement proper error handling and debugging support
6. **Waiting Strategies**: Use intelligent waiting patterns for reliable tests

### Method Categories

- **Navigation Methods**: Handle page navigation and loading
- **Action Methods**: Perform user interactions (click, fill, select)
- **Query Methods**: Retrieve information from the page
- **Validation Methods**: Verify page state and element conditions

### Benefits Achieved

- ✅ **Maintainability**: Changes to UI require updates in only one place
- ✅ **Readability**: Tests express business intent rather than technical details
- ✅ **Reusability**: Page objects can be shared across multiple test suites
- ✅ **Type Safety**: TypeScript catches errors at compile time
- ✅ **Debugging**: Centralized error handling and logging

---

## Next Steps

Now that you understand page object basics:

1. **Practice**: Implement page objects for your own application pages
2. **Explore**: Continue to [Example 02: Cucumber Integration Patterns](02-cucumber-integration-patterns.md)
3. **Apply**: Use these patterns in real testing scenarios
4. **Refine**: Continuously improve your page object designs based on experience

Ready to see how these page objects integrate with Cucumber? Let's move to the next example! 🚀