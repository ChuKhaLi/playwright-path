# Lesson 7.5: Implementing Advanced Test Scenarios

## Learning Objectives

By the end of this lesson, you will be able to:

- **Implement cross-browser testing** strategies for comprehensive compatibility coverage
- **Integrate API testing** with E2E workflows for full-stack validation
- **Set up visual regression testing** to catch UI inconsistencies automatically
- **Implement performance testing** and monitoring within your test suite
- **Apply advanced assertion patterns** for robust test validation
- **Reduce test flakiness** through reliability engineering techniques
- **Create comprehensive test scenarios** that mirror real-world usage patterns
- **Optimize test execution** for faster feedback cycles

## Prerequisites

- Completed Lesson 7.4 (Writing and Organizing E2E Tests)
- Understanding of TypeScript interfaces and async/await patterns
- Basic knowledge of HTTP/REST APIs
- Familiarity with browser developer tools

## Estimated Duration

**3-4 hours** (including exercises and implementation)

---

## Introduction

Advanced test scenarios go beyond basic user flows to provide comprehensive quality assurance that mirrors real-world conditions. In this lesson, you'll implement sophisticated testing strategies that professional QA engineers use to ensure applications work reliably across different environments, browsers, and usage patterns.

These advanced techniques will elevate your test automation from functional verification to comprehensive quality engineering, making you a more valuable QA professional.

---

## Section 1: Cross-Browser Testing Implementation

### Understanding Cross-Browser Testing

Cross-browser testing ensures your application works consistently across different browsers, versions, and operating systems.

### 1.1 Multi-Browser Configuration

Update your [`playwright.config.ts`](../../config/playwright.config.ts) to support multiple browsers:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://demo.playwright.dev/todomvc',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] },
    }
  ]
});
```

### 1.2 Browser-Specific Page Objects

Create a browser-aware base page object:

```typescript
// src/pages/BasePage.ts
import { Page, Browser, BrowserContext } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected context: BrowserContext;
  protected browserName: string;

  constructor(page: Page) {
    this.page = page;
    this.context = page.context();
    this.browserName = page.context().browser()?.browserType().name() || 'unknown';
  }

  /**
   * Get browser-specific timeout based on browser performance characteristics
   */
  protected getBrowserTimeout(): number {
    switch (this.browserName) {
      case 'webkit':
        return 10000; // Safari needs more time
      case 'firefox':
        return 8000;  // Firefox moderate timeout
      default:
        return 5000;  // Chrome/Chromium default
    }
  }

  /**
   * Browser-specific wait strategies
   */
  protected async waitForStableLoad(): Promise<void> {
    if (this.browserName === 'webkit') {
      // Safari needs additional stability checks
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);
    } else {
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  /**
   * Cross-browser element interaction with fallbacks
   */
  protected async safeClick(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    
    try {
      await element.click({ timeout: this.getBrowserTimeout() });
    } catch (error) {
      // Fallback for problematic browsers
      if (this.browserName === 'webkit') {
        await element.focus();
        await this.page.keyboard.press('Enter');
      } else {
        throw error;
      }
    }
  }
}
```

### 1.3 Cross-Browser Test Implementation

```typescript
// tests/cross-browser/shopping-cart.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { ProductPage } from '../../src/pages/ProductPage';
import { CartPage } from '../../src/pages/CartPage';

test.describe('Shopping Cart - Cross Browser', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page, browserName }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);

    console.log(`Running on: ${browserName}`);
    await homePage.navigate();
  });

  test('should add products to cart across browsers', async ({ page, browserName }) => {
    // Browser-specific test adaptations
    if (browserName === 'webkit') {
      // Safari-specific setup
      await page.setViewportSize({ width: 1200, height: 800 });
    }

    await homePage.searchForProduct('laptop');
    await productPage.selectFirstProduct();
    await productPage.addToCart();

    // Browser-specific assertions
    const cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBe(1);

    // Additional verification for mobile browsers
    if (browserName.includes('mobile')) {
      await homePage.openMobileMenu();
      await expect(homePage.cartIcon).toBeVisible();
    }
  });

  test('should handle browser-specific form interactions', async ({ browserName }) => {
    await homePage.openAccountMenu();
    
    if (browserName === 'firefox') {
      // Firefox has specific autofill behavior
      await homePage.fillLoginForm('test@example.com', 'password');
      await page.waitForTimeout(500); // Allow Firefox autofill
    } else {
      await homePage.fillLoginForm('test@example.com', 'password');
    }

    await homePage.submitLogin();
    await expect(homePage.userProfile).toBeVisible();
  });
});
```

---

## Section 2: API Integration Testing

### 2.1 API Client for E2E Integration

Create an API client that integrates with your E2E tests:

```typescript
// src/api/ApiClient.ts
import { request, APIRequestContext } from '@playwright/test';

export class ApiClient {
  private apiContext: APIRequestContext;
  private baseURL: string;
  private authToken?: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async initialize(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
      }
    });
  }

  async authenticate(email: string, password: string): Promise<void> {
    const response = await this.apiContext.post('/api/auth/login', {
      data: { email, password }
    });

    expect(response.ok()).toBeTruthy();
    const authData = await response.json();
    this.authToken = authData.token;

    // Update headers with auth token
    await this.apiContext.dispose();
    await this.initialize();
  }

  async createTestData(): Promise<any> {
    const response = await this.apiContext.post('/api/test-data', {
      data: {
        products: [
          { name: 'Test Product 1', price: 29.99, stock: 10 },
          { name: 'Test Product 2', price: 49.99, stock: 5 }
        ]
      }
    });

    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  async getOrderStatus(orderId: string): Promise<any> {
    const response = await this.apiContext.get(`/api/orders/${orderId}`);
    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  async cleanup(): Promise<void> {
    await this.apiContext.delete('/api/test-data');
    await this.apiContext.dispose();
  }
}
```

### 2.2 Hybrid E2E + API Testing

```typescript
// tests/hybrid/order-flow.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { ApiClient } from '../../src/api/ApiClient';

test.describe('Order Flow - Hybrid Testing', () => {
  let homePage: HomePage;
  let checkoutPage: CheckoutPage;
  let apiClient: ApiClient;

  test.beforeEach(async ({ page, request }) => {
    homePage = new HomePage(page);
    checkoutPage = new CheckoutPage(page);
    apiClient = new ApiClient('https://api.ecommerce-demo.com');
    
    await apiClient.initialize();
    await apiClient.authenticate('test@example.com', 'password');
    
    // Create test data via API
    await apiClient.createTestData();
  });

  test.afterEach(async () => {
    await apiClient.cleanup();
  });

  test('should complete order with API validation', async ({ page }) => {
    // UI interaction to place order
    await homePage.navigate();
    await homePage.addProductToCart('Test Product 1');
    await homePage.proceedToCheckout();
    
    await checkoutPage.fillShippingInfo({
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Test St',
      city: 'Test City',
      zipCode: '12345'
    });
    
    const orderConfirmation = await checkoutPage.submitOrder();
    const orderId = orderConfirmation.orderId;

    // API validation
    const orderStatus = await apiClient.getOrderStatus(orderId);
    expect(orderStatus.status).toBe('confirmed');
    expect(orderStatus.items).toHaveLength(1);
    expect(orderStatus.total).toBeGreaterThan(0);

    // UI validation
    await expect(checkoutPage.confirmationMessage).toContainText(orderId);
  });
});
```

---

## Section 3: Visual Regression Testing

### 3.1 Visual Testing Setup

```typescript
// src/utils/VisualTesting.ts
import { Page, expect } from '@playwright/test';

export class VisualTesting {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async captureFullPageScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}-full.png`,
      fullPage: true
    });
  }

  async compareElementScreenshot(selector: string, name: string): Promise<void> {
    const element = this.page.locator(selector);
    await expect(element).toHaveScreenshot(`${name}.png`);
  }

  async comparePageScreenshot(name: string, options?: {
    mask?: string[];
    threshold?: number;
  }): Promise<void> {
    const maskSelectors = options?.mask || [];
    const threshold = options?.threshold || 0.2;

    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      mask: maskSelectors.map(selector => this.page.locator(selector)),
      threshold
    });
  }

  async waitForStableVisuals(): Promise<void> {
    // Wait for animations and transitions to complete
    await this.page.waitForTimeout(1000);
    await this.page.waitForFunction(() => {
      const animations = document.getAnimations();
      return animations.length === 0;
    });
  }
}
```

### 3.2 Visual Regression Tests

```typescript
// tests/visual/ui-components.spec.ts
import { test } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { VisualTesting } from '../../src/utils/VisualTesting';

test.describe('Visual Regression Testing', () => {
  let homePage: HomePage;
  let visualTesting: VisualTesting;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    visualTesting = new VisualTesting(page);
    await homePage.navigate();
  });

  test('should match homepage layout', async ({ page }) => {
    await visualTesting.waitForStableVisuals();
    await visualTesting.comparePageScreenshot('homepage', {
      mask: ['.dynamic-banner', '.current-time'], // Mask dynamic content
      threshold: 0.1
    });
  });

  test('should match product grid layout', async ({ page }) => {
    await homePage.loadProductGrid();
    await visualTesting.waitForStableVisuals();
    
    await visualTesting.compareElementScreenshot(
      '.product-grid',
      'product-grid'
    );
  });

  test('should match modal dialogs', async ({ page }) => {
    await homePage.openLoginModal();
    await visualTesting.waitForStableVisuals();
    
    await visualTesting.compareElementScreenshot(
      '.modal-dialog',
      'login-modal'
    );
  });

  test('should handle responsive layouts', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await visualTesting.comparePageScreenshot('homepage-desktop');

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await visualTesting.comparePageScreenshot('homepage-tablet');

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await visualTesting.comparePageScreenshot('homepage-mobile');
  });
});
```

---

## Section 4: Performance Testing Integration

### 4.1 Performance Monitoring Utilities

```typescript
// src/utils/PerformanceMonitor.ts
import { Page } from '@playwright/test';

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  totalBlockingTime: number;
}

export class PerformanceMonitor {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async collectMetrics(): Promise<PerformanceMetrics> {
    const metrics = await this.page.evaluate(() => {
      return new Promise<PerformanceMetrics>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          resolve({
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            firstContentfulPaint: this.getMetricValue('first-contentful-paint'),
            largestContentfulPaint: this.getMetricValue('largest-contentful-paint'),
            cumulativeLayoutShift: this.getMetricValue('cumulative-layout-shift'),
            firstInputDelay: this.getMetricValue('first-input-delay'),
            totalBlockingTime: this.getMetricValue('total-blocking-time')
          });
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
      });
    });

    return metrics;
  }

  private getMetricValue(metricName: string): number {
    const entry = performance.getEntriesByName(metricName)[0];
    return entry ? entry.startTime : 0;
  }

  async assertPerformanceThresholds(metrics: PerformanceMetrics): Promise<void> {
    const thresholds = {
      loadTime: 3000,
      firstContentfulPaint: 1500,
      largestContentfulPaint: 2500,
      cumulativeLayoutShift: 0.1,
      totalBlockingTime: 300
    };

    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const value = metrics[metric as keyof PerformanceMetrics];
      if (value > threshold) {
        throw new Error(`Performance threshold exceeded: ${metric} (${value}) > ${threshold}`);
      }
    });
  }
}
```

### 4.2 Performance Testing Implementation

```typescript
// tests/performance/load-performance.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { PerformanceMonitor } from '../../src/utils/PerformanceMonitor';

test.describe('Performance Testing', () => {
  let homePage: HomePage;
  let performanceMonitor: PerformanceMonitor;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    performanceMonitor = new PerformanceMonitor(page);
  });

  test('should meet homepage performance thresholds', async ({ page }) => {
    await homePage.navigate();
    await page.waitForLoadState('networkidle');

    const metrics = await performanceMonitor.collectMetrics();
    console.log('Performance Metrics:', metrics);

    await performanceMonitor.assertPerformanceThresholds(metrics);
  });

  test('should handle search performance', async ({ page }) => {
    await homePage.navigate();
    
    const startTime = Date.now();
    await homePage.searchForProduct('laptop');
    await page.waitForSelector('.search-results');
    const searchTime = Date.now() - startTime;

    expect(searchTime).toBeLessThan(2000); // Search should complete within 2 seconds
  });

  test('should monitor memory usage', async ({ page }) => {
    await homePage.navigate();

    // Simulate heavy usage
    for (let i = 0; i < 10; i++) {
      await homePage.searchForProduct(`product-${i}`);
      await page.goBack();
    }

    const memoryInfo = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });

    if (memoryInfo) {
      const memoryUsagePercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
      expect(memoryUsagePercent).toBeLessThan(50); // Memory usage should be under 50%
    }
  });
});
```

---

## Section 5: Advanced Assertion Patterns

### 5.1 Custom Assertion Utilities

```typescript
// src/utils/CustomAssertions.ts
import { Page, Locator, expect } from '@playwright/test';

export class CustomAssertions {
  static async waitForElementToDisappear(locator: Locator, timeout: number = 5000): Promise<void> {
    await expect(locator).toBeHidden({ timeout });
  }

  static async assertTextContainsAny(locator: Locator, expectedTexts: string[]): Promise<void> {
    const actualText = await locator.textContent();
    const containsAny = expectedTexts.some(text => actualText?.includes(text));
    expect(containsAny).toBeTruthy(`Text "${actualText}" does not contain any of: ${expectedTexts.join(', ')}`);
  }

  static async assertElementCount(page: Page, selector: string, expectedCount: number): Promise<void> {
    await expect(page.locator(selector)).toHaveCount(expectedCount);
  }

  static async assertElementsInOrder(page: Page, selectors: string[]): Promise<void> {
    const elements = await page.locator(selectors.join(', ')).all();
    
    for (let i = 0; i < selectors.length; i++) {
      const element = elements[i];
      const matches = await element.evaluate((el, selector) => {
        return el.matches(selector);
      }, selectors[i]);
      
      expect(matches).toBeTruthy(`Element at position ${i} does not match selector ${selectors[i]}`);
    }
  }

  static async assertUrlContains(page: Page, expectedFragment: string): Promise<void> {
    await expect(page).toHaveURL(new RegExp(`.*${expectedFragment}.*`));
  }

  static async assertFormValidation(page: Page, formSelector: string, expectedErrors: string[]): Promise<void> {
    const form = page.locator(formSelector);
    await form.locator('button[type="submit"]').click();

    for (const errorText of expectedErrors) {
      await expect(form.locator('.error-message')).toContainText(errorText);
    }
  }
}
```

### 5.2 Soft Assertions for Comprehensive Validation

```typescript
// tests/advanced/comprehensive-validation.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { CustomAssertions } from '../../src/utils/CustomAssertions';

test.describe('Comprehensive Validation', () => {
  test('should validate entire page state with soft assertions', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();

    // Use soft assertions to continue testing even if some assertions fail
    await test.step('Header validation', async () => {
      await expect.soft(homePage.logo).toBeVisible();
      await expect.soft(homePage.searchBox).toBeVisible();
      await expect.soft(homePage.cartIcon).toBeVisible();
      await expect.soft(homePage.userMenu).toBeVisible();
    });

    await test.step('Navigation validation', async () => {
      await expect.soft(homePage.homeLink).toBeVisible();
      await expect.soft(homePage.productsLink).toBeVisible();
      await expect.soft(homePage.aboutLink).toBeVisible();
      await expect.soft(homePage.contactLink).toBeVisible();
    });

    await test.step('Content validation', async () => {
      await CustomAssertions.assertElementCount(page, '.product-card', 12);
      await CustomAssertions.assertTextContainsAny(homePage.mainHeading, ['Welcome', 'Shop', 'Store']);
    });

    await test.step('Footer validation', async () => {
      await expect.soft(homePage.footer).toBeVisible();
      await expect.soft(homePage.privacyLink).toBeVisible();
      await expect.soft(homePage.termsLink).toBeVisible();
    });
  });
});
```

---

## Section 6: Test Reliability and Flakiness Reduction

### 6.1 Reliable Wait Strategies

```typescript
// src/utils/ReliableWaits.ts
import { Page, Locator } from '@playwright/test';

export class ReliableWaits {
  static async waitForElement(page: Page, selector: string, options?: {
    timeout?: number;
    state?: 'visible' | 'hidden' | 'attached' | 'detached';
  }): Promise<Locator> {
    const timeout = options?.timeout || 10000;
    const state = options?.state || 'visible';
    
    const locator = page.locator(selector);
    await locator.waitFor({ state, timeout });
    return locator;
  }

  static async waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async waitForAnimation(page: Page, selector: string): Promise<void> {
    const element = page.locator(selector);
    await element.waitFor({ state: 'visible' });
    
    // Wait for animations to complete
    await page.waitForFunction((sel) => {
      const el = document.querySelector(sel);
      if (!el) return true;
      
      const animations = el.getAnimations();
      return animations.length === 0 || animations.every(anim => anim.playState === 'finished');
    }, selector);
  }

  static async retryAction<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }
}
```

### 6.2 Implementing Retry Logic

```typescript
// tests/reliability/flaky-scenarios.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { ReliableWaits } from '../../src/utils/ReliableWaits';

test.describe('Reliability Testing', () => {
  test('should handle intermittent network issues', async ({ page }) => {
    const homePage = new HomePage(page);

    await ReliableWaits.retryAction(async () => {
      await homePage.navigate();
      await ReliableWaits.waitForNetworkIdle(page);
      await expect(homePage.logo).toBeVisible();
    }, 3, 2000);
  });

  test('should wait for dynamic content loading', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();

    // Wait for dynamic product loading
    await ReliableWaits.waitForElement(page, '.product-card:nth-child(10)');
    
    const productCount = await page.locator('.product-card').count();
    expect(productCount).toBeGreaterThanOrEqual(10);
  });

  test('should handle modal interactions reliably', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();

    await homePage.openLoginModal();
    await ReliableWaits.waitForAnimation(page, '.modal-dialog');
    
    await expect(page.locator('.modal-dialog')).toBeVisible();
    await expect(page.locator('.modal-backdrop')).toBeVisible();
  });
});
```

---

## Section 7: Comprehensive Test Scenarios

### 7.1 End-to-End User Journey

```typescript
// tests/scenarios/complete-user-journey.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { ProductPage } from '../../src/pages/ProductPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { AccountPage } from '../../src/pages/AccountPage';

test.describe('Complete User Journey', () => {
  test('should complete full e-commerce journey', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const accountPage = new AccountPage(page);

    // Step 1: Browse and search
    await test.step('User browses homepage', async () => {
      await homePage.navigate();
      await expect(homePage.featuredProducts).toBeVisible();
    });

    await test.step('User searches for products', async () => {
      await homePage.searchForProduct('wireless headphones');
      await expect(homePage.searchResults).toContainText('headphones');
    });

    // Step 2: Product selection
    await test.step('User views product details', async () => {
      await productPage.selectFirstProduct();
      await expect(productPage.productTitle).toBeVisible();
      await expect(productPage.productPrice).toBeVisible();
      await expect(productPage.addToCartButton).toBeEnabled();
    });

    await test.step('User adds multiple products', async () => {
      await productPage.addToCart();
      await productPage.navigateToCategory('Electronics');
      await productPage.selectProductByName('Gaming Mouse');
      await productPage.addToCart();
    });

    // Step 3: Cart management
    await test.step('User manages cart', async () => {
      await cartPage.navigate();
      await expect(cartPage.cartItems).toHaveCount(2);
      
      await cartPage.updateQuantity(1, 2);
      await cartPage.removeItem(2);
      await expect(cartPage.cartItems).toHaveCount(1);
    });

    // Step 4: Account creation and checkout
    await test.step('User creates account', async () => {
      await homePage.openAccountMenu();
      await homePage.clickRegister();
      
      await accountPage.createAccount({
        firstName: 'Test',
        lastName: 'User',
        email: `test.user.${Date.now()}@example.com`,
        password: 'SecurePassword123!'
      });
      
      await expect(accountPage.welcomeMessage).toBeVisible();
    });

    await test.step('User completes checkout', async () => {
      await cartPage.proceedToCheckout();
      
      await checkoutPage.fillShippingInfo({
        address: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'United States'
      });
      
      await checkoutPage.selectShippingMethod('standard');
      await checkoutPage.addPaymentMethod({
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'Test User'
      });
      
      const orderConfirmation = await checkoutPage.submitOrder();
      await expect(checkoutPage.orderConfirmation).toContainText(orderConfirmation.orderId);
    });

    // Step 5: Post-purchase verification
    await test.step('User verifies order in account', async () => {
      await accountPage.navigate();
      await accountPage.viewOrderHistory();
      
      const recentOrder = accountPage.getRecentOrder();
      await expect(recentOrder).toBeVisible();
      await expect(recentOrder.locator('.order-status')).toContainText('Processing');
    });
  });
});
```

---

## Exercises

### Exercise 1: Cross-Browser Compatibility Matrix

Create a comprehensive test that validates your application across different browser and device combinations:

1. Set up testing for Chrome, Firefox, Safari, and Edge
2. Include mobile device testing for iOS and Android
3. Create browser-specific workarounds for known issues
4. Generate a compatibility report

### Exercise 2: API-UI Integration Testing

Implement hybrid testing that combines API and UI interactions:

1. Set up API test data creation
2. Perform UI actions that trigger API calls
3. Validate both UI state and backend data
4. Implement cleanup procedures

### Exercise 3: Visual Regression Suite

Build a comprehensive visual testing suite:

1. Create baseline screenshots for major UI components
2. Implement responsive design testing
3. Add dynamic content masking
4. Set up automated visual comparison reports

### Exercise 4: Performance Monitoring

Implement performance testing within your E2E suite:

1. Monitor Core Web Vitals metrics
2. Set performance thresholds for different pages
3. Create performance regression alerts
4. Generate performance reports

---

## Advanced Concepts

### Test Orchestration

```typescript
// src/utils/TestOrchestrator.ts
export class TestOrchestrator {
  async runTestSuite(suiteName: string, options: {
    browsers?: string[];
    parallel?: boolean;
    retries?: number;
    timeout?: number;
  }): Promise<void> {
    // Implementation for coordinating complex test execution
  }
}
```

### Environment-Specific Testing

```typescript
// src/config/EnvironmentConfig.ts
export class EnvironmentConfig {
  static getConfig(environment: string) {
    const configs = {
      development: { timeout: 30000, retries: 1 },
      staging: { timeout: 20000, retries: 2 },
      production: { timeout: 10000, retries: 3 }
    };
    return configs[environment] || configs.development;
  }
}
```

---

## Summary

In this lesson, you've implemented advanced testing scenarios that elevate your QA automation from basic functional testing to comprehensive quality engineering:

### Key Accomplishments

1. **Cross-Browser Testing**: Implemented multi-browser support with device-specific adaptations
2. **API Integration**: Created hybrid testing combining UI interactions with API validation
3. **Visual Regression**: Built automated visual comparison testing with responsive design coverage
4. **Performance Testing**: Integrated performance monitoring with Core Web Vitals tracking
5. **Advanced Assertions**: Implemented custom assertion patterns and soft assertion strategies
6. **Test Reliability**: Applied techniques to reduce flakiness and improve test stability
7. **Comprehensive Scenarios**: Created end-to-end user journeys that mirror real-world usage

### Professional Skills Developed

- **Quality Engineering**: Advanced beyond basic testing to comprehensive quality assurance
- **Test Strategy**: Implemented multi-layered testing approaches for thorough coverage
- **Performance Engineering**: Integrated performance considerations into the testing process
- **Reliability Engineering**: Applied techniques to build stable, maintainable test suites
- **Cross-Platform Testing**: Ensured application compatibility across browsers and devices

### Next Steps

With your advanced testing scenarios implemented, you're ready to integrate CI/CD pipelines and implement comprehensive reporting in the next lesson.

---

## Additional Resources

- **Cross-Browser Testing**: [Playwright Browser Support Guide](https://playwright.dev/docs/browsers)
- **API Testing**: [REST API Testing Best Practices](https://example.com/api-testing)
- **Visual Testing**: [Visual Regression Testing Guide](https://example.com/visual-testing)
- **Performance Testing**: [Web Performance Testing](https://example.com/performance-testing)

---

*Your advanced testing implementation provides enterprise-grade quality assurance capabilities. Continue to CI/CD integration in the next lesson!*
