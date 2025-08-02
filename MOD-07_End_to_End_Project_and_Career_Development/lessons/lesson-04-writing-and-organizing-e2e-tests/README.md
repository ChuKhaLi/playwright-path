# Lesson 04: Writing and Organizing E2E Tests

## Learning Objectives

By the end of this lesson, you will be able to:

- **Implement Page Objects**: Create comprehensive page objects using the base framework developed in previous lessons
- **Write Structured E2E Tests**: Develop well-organized test suites following industry best practices
- **Apply Test Organization Patterns**: Structure tests using appropriate grouping and naming conventions
- **Implement Data-Driven Testing**: Create tests that use external data sources for comprehensive coverage
- **Handle Complex User Journeys**: Build tests that simulate realistic user workflows across multiple pages
- **Apply Test Design Principles**: Follow SOLID principles and DRY concepts in test development
- **Implement Proper Error Handling**: Build robust tests with appropriate error handling and recovery
- **Create Maintainable Test Suites**: Develop tests that are easy to maintain and update over time

## Prerequisites

- Completed Lesson 03: Building the Test Framework Foundation
- Understanding of [`TypeScript`](../../MOD-02_TypeScript_for_Automation/README.md) fundamentals
- Basic knowledge of [`Playwright`](../../MOD-E2E-01_Playwright_E2E_Fundamentals/README.md) testing concepts
- Familiarity with [`Page Object Model`](../../MOD-03_Advanced_Playwright_and_Test_Architecture/lessons/lesson-02-page-object-model-pom-design-pattern/README.md) design pattern

## Introduction

With your test framework foundation in place, it's time to implement actual E2E tests that demonstrate professional-grade test development practices. This lesson focuses on creating well-structured, maintainable tests that effectively use the base classes and utilities you've built.

We'll implement a comprehensive e-commerce testing suite that covers user registration, product browsing, shopping cart functionality, and checkout processes. This real-world scenario will demonstrate how to handle complex user journeys while maintaining clean, organized test code.

## Part 1: Creating Page Objects for E-Commerce Application

### 1.1 Homepage Page Object Implementation

Let's start by creating a comprehensive homepage page object that extends our base framework.

**File: `src/pages/HomePage.ts`**

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../framework/base/BasePage';
import { Logger } from '../framework/utils/Logger';
import { WaitUtils } from '../framework/utils/WaitUtils';

export interface NavigationItem {
  name: string;
  selector: string;
  expectedUrl?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  displayName: string;
  imageSelector: string;
}

export class HomePage extends BasePage {
  // Header elements
  private readonly logo: Locator;
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly cartIcon: Locator;
  private readonly cartCount: Locator;
  private readonly accountMenu: Locator;
  private readonly loginLink: Locator;
  private readonly registerLink: Locator;

  // Navigation elements
  private readonly mainNavigation: Locator;
  private readonly categoryLinks: Locator;

  // Content elements
  private readonly heroSection: Locator;
  private readonly featuredProducts: Locator;
  private readonly productCards: Locator;
  private readonly newsletterSignup: Locator;

  // Footer elements
  private readonly footer: Locator;
  private readonly footerLinks: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize header locators
    this.logo = page.locator('[data-testid="site-logo"]');
    this.searchBox = page.locator('[data-testid="search-input"]');
    this.searchButton = page.locator('[data-testid="search-button"]');
    this.cartIcon = page.locator('[data-testid="cart-icon"]');
    this.cartCount = page.locator('[data-testid="cart-count"]');
    this.accountMenu = page.locator('[data-testid="account-menu"]');
    this.loginLink = page.locator('[data-testid="login-link"]');
    this.registerLink = page.locator('[data-testid="register-link"]');

    // Initialize navigation locators
    this.mainNavigation = page.locator('[data-testid="main-navigation"]');
    this.categoryLinks = page.locator('[data-testid="category-link"]');

    // Initialize content locators
    this.heroSection = page.locator('[data-testid="hero-section"]');
    this.featuredProducts = page.locator('[data-testid="featured-products"]');
    this.productCards = page.locator('[data-testid="product-card"]');
    this.newsletterSignup = page.locator('[data-testid="newsletter-signup"]');

    // Initialize footer locators
    this.footer = page.locator('[data-testid="footer"]');
    this.footerLinks = page.locator('[data-testid="footer-link"]');

    Logger.info('HomePage initialized');
  }

  /**
   * Navigate to the homepage
   */
  async navigateToHome(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
    Logger.info('Navigated to homepage');
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await Promise.all([
      this.logo.waitFor({ state: 'visible' }),
      this.mainNavigation.waitFor({ state: 'visible' }),
      this.heroSection.waitFor({ state: 'visible' })
    ]);
    
    await WaitUtils.waitForLoadingToComplete(this.page);
    Logger.info('Homepage fully loaded');
  }

  /**
   * Search for products
   * @param searchTerm The term to search for
   */
  async searchForProduct(searchTerm: string): Promise<void> {
    await this.searchBox.fill(searchTerm);
    await this.searchButton.click();
    await this.page.waitForURL('**/search?q=*');
    Logger.info(`Searched for product: ${searchTerm}`);
  }

  /**
   * Navigate to a specific product category
   * @param categoryName The name of the category to click
   */
  async navigateToCategory(categoryName: string): Promise<void> {
    const categoryLink = this.categoryLinks.filter({ hasText: categoryName });
    await categoryLink.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info(`Navigated to category: ${categoryName}`);
  }

  /**
   * Click on a featured product by index
   * @param index The index of the product (0-based)
   */
  async clickFeaturedProduct(index: number): Promise<void> {
    const productCard = this.productCards.nth(index);
    await productCard.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info(`Clicked featured product at index: ${index}`);
  }

  /**
   * Get the current cart count
   * @returns The number of items in the cart
   */
  async getCartCount(): Promise<number> {
    const countText = await this.cartCount.textContent();
    return countText ? parseInt(countText, 10) : 0;
  }

  /**
   * Click the cart icon to view cart
   */
  async goToCart(): Promise<void> {
    await this.cartIcon.click();
    await this.page.waitForURL('**/cart');
    Logger.info('Navigated to cart');
  }

  /**
   * Navigate to login page
   */
  async goToLogin(): Promise<void> {
    await this.loginLink.click();
    await this.page.waitForURL('**/login');
    Logger.info('Navigated to login page');
  }

  /**
   * Navigate to registration page
   */
  async goToRegister(): Promise<void> {
    await this.registerLink.click();
    await this.page.waitForURL('**/register');
    Logger.info('Navigated to registration page');
  }

  /**
   * Subscribe to newsletter
   * @param email Email address for subscription
   */
  async subscribeToNewsletter(email: string): Promise<void> {
    const emailInput = this.newsletterSignup.locator('input[type="email"]');
    const submitButton = this.newsletterSignup.locator('button[type="submit"]');
    
    await emailInput.fill(email);
    await submitButton.click();
    
    // Wait for success message
    const successMessage = this.page.locator('[data-testid="newsletter-success"]');
    await successMessage.waitFor({ state: 'visible' });
    
    Logger.info(`Subscribed to newsletter with email: ${email}`);
  }

  /**
   * Verify homepage elements are visible
   */
  async verifyPageElements(): Promise<void> {
    await expect(this.logo).toBeVisible();
    await expect(this.searchBox).toBeVisible();
    await expect(this.mainNavigation).toBeVisible();
    await expect(this.heroSection).toBeVisible();
    await expect(this.featuredProducts).toBeVisible();
    await expect(this.footer).toBeVisible();
    
    Logger.info('Homepage elements verified');
  }

  /**
   * Get available product categories
   * @returns Array of category information
   */
  async getAvailableCategories(): Promise<ProductCategory[]> {
    const categories: ProductCategory[] = [];
    const categoryElements = await this.categoryLinks.all();
    
    for (let i = 0; i < categoryElements.length; i++) {
      const element = categoryElements[i];
      const name = await element.textContent();
      const href = await element.getAttribute('href');
      
      if (name && href) {
        categories.push({
          id: href.split('/').pop() || '',
          name: href.split('/').pop() || '',
          displayName: name.trim(),
          imageSelector: `[data-testid="category-${href.split('/').pop()}-image"]`
        });
      }
    }
    
    Logger.info(`Found ${categories.length} product categories`);
    return categories;
  }

  /**
   * Verify featured products are displayed
   * @param expectedCount Expected number of featured products
   */
  async verifyFeaturedProducts(expectedCount?: number): Promise<void> {
    await expect(this.featuredProducts).toBeVisible();
    
    const productCount = await this.productCards.count();
    
    if (expectedCount) {
      expect(productCount).toBe(expectedCount);
      Logger.info(`Verified ${expectedCount} featured products displayed`);
    } else {
      expect(productCount).toBeGreaterThan(0);
      Logger.info(`Verified ${productCount} featured products displayed`);
    }
  }
}
```

### 1.2 Product Details Page Object

**File: `src/pages/ProductDetailsPage.ts`**

```typescript
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../framework/base/BasePage';
import { Logger } from '../framework/utils/Logger';

export interface ProductDetails {
  name: string;
  price: number;
  description: string;
  inStock: boolean;
  images: string[];
  variations?: ProductVariation[];
}

export interface ProductVariation {
  type: 'size' | 'color' | 'style';
  options: string[];
  selectedOption?: string;
}

export class ProductDetailsPage extends BasePage {
  // Product information elements
  private readonly productName: Locator;
  private readonly productPrice: Locator;
  private readonly productDescription: Locator;
  private readonly productImages: Locator;
  private readonly productThumbnails: Locator;
  private readonly stockStatus: Locator;

  // Product actions
  private readonly quantitySelector: Locator;
  private readonly addToCartButton: Locator;
  private readonly wishlistButton: Locator;
  private readonly shareButton: Locator;

  // Product variations
  private readonly sizeSelector: Locator;
  private readonly colorSelector: Locator;
  private readonly styleSelector: Locator;

  // Reviews section
  private readonly reviewsSection: Locator;
  private readonly reviewStars: Locator;
  private readonly reviewCount: Locator;
  private readonly writeReviewButton: Locator;

  // Related products
  private readonly relatedProducts: Locator;
  private readonly relatedProductCards: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize product information locators
    this.productName = page.locator('[data-testid="product-name"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.productDescription = page.locator('[data-testid="product-description"]');
    this.productImages = page.locator('[data-testid="product-image"]');
    this.productThumbnails = page.locator('[data-testid="product-thumbnail"]');
    this.stockStatus = page.locator('[data-testid="stock-status"]');

    // Initialize product action locators
    this.quantitySelector = page.locator('[data-testid="quantity-selector"]');
    this.addToCartButton = page.locator('[data-testid="add-to-cart"]');
    this.wishlistButton = page.locator('[data-testid="add-to-wishlist"]');
    this.shareButton = page.locator('[data-testid="share-product"]');

    // Initialize variation locators
    this.sizeSelector = page.locator('[data-testid="size-selector"]');
    this.colorSelector = page.locator('[data-testid="color-selector"]');
    this.styleSelector = page.locator('[data-testid="style-selector"]');

    // Initialize reviews locators
    this.reviewsSection = page.locator('[data-testid="reviews-section"]');
    this.reviewStars = page.locator('[data-testid="review-stars"]');
    this.reviewCount = page.locator('[data-testid="review-count"]');
    this.writeReviewButton = page.locator('[data-testid="write-review"]');

    // Initialize related products locators
    this.relatedProducts = page.locator('[data-testid="related-products"]');
    this.relatedProductCards = page.locator('[data-testid="related-product-card"]');

    Logger.info('ProductDetailsPage initialized');
  }

  /**
   * Wait for product details page to load
   */
  async waitForPageLoad(): Promise<void> {
    await Promise.all([
      this.productName.waitFor({ state: 'visible' }),
      this.productPrice.waitFor({ state: 'visible' }),
      this.productImages.first().waitFor({ state: 'visible' }),
      this.addToCartButton.waitFor({ state: 'visible' })
    ]);
    
    Logger.info('Product details page loaded');
  }

  /**
   * Get complete product details
   * @returns Product information object
   */
  async getProductDetails(): Promise<ProductDetails> {
    const name = await this.productName.textContent() || '';
    const priceText = await this.productPrice.textContent() || '0';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    const description = await this.productDescription.textContent() || '';
    const stockText = await this.stockStatus.textContent() || '';
    const inStock = !stockText.toLowerCase().includes('out of stock');
    
    const imageElements = await this.productImages.all();
    const images: string[] = [];
    for (const img of imageElements) {
      const src = await img.getAttribute('src');
      if (src) images.push(src);
    }

    const productDetails: ProductDetails = {
      name,
      price,
      description,
      inStock,
      images
    };

    Logger.info(`Retrieved product details for: ${name}`);
    return productDetails;
  }

  /**
   * Select product quantity
   * @param quantity Number of items to add
   */
  async selectQuantity(quantity: number): Promise<void> {
    await this.quantitySelector.selectOption(quantity.toString());
    Logger.info(`Selected quantity: ${quantity}`);
  }

  /**
   * Select product size
   * @param size Size option to select
   */
  async selectSize(size: string): Promise<void> {
    const sizeOption = this.sizeSelector.locator(`[data-value="${size}"]`);
    await sizeOption.click();
    Logger.info(`Selected size: ${size}`);
  }

  /**
   * Select product color
   * @param color Color option to select
   */
  async selectColor(color: string): Promise<void> {
    const colorOption = this.colorSelector.locator(`[data-value="${color}"]`);
    await colorOption.click();
    Logger.info(`Selected color: ${color}`);
  }

  /**
   * Add product to cart
   * @param quantity Optional quantity (defaults to current selection)
   */
  async addToCart(quantity?: number): Promise<void> {
    if (quantity) {
      await this.selectQuantity(quantity);
    }

    await this.addToCartButton.click();
    
    // Wait for success notification
    const successNotification = this.page.locator('[data-testid="add-to-cart-success"]');
    await successNotification.waitFor({ state: 'visible', timeout: 5000 });
    
    Logger.info('Product added to cart successfully');
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(): Promise<void> {
    await this.wishlistButton.click();
    
    // Wait for success notification
    const successNotification = this.page.locator('[data-testid="wishlist-success"]');
    await successNotification.waitFor({ state: 'visible', timeout: 5000 });
    
    Logger.info('Product added to wishlist');
  }

  /**
   * View product image by index
   * @param index Index of the image to view
   */
  async viewProductImage(index: number): Promise<void> {
    const thumbnail = this.productThumbnails.nth(index);
    await thumbnail.click();
    
    // Wait for main image to update
    await this.page.waitForTimeout(500);
    Logger.info(`Viewed product image at index: ${index}`);
  }

  /**
   * Verify product is in stock
   */
  async verifyProductInStock(): Promise<void> {
    await expect(this.stockStatus).not.toContainText('Out of Stock');
    await expect(this.addToCartButton).toBeEnabled();
    Logger.info('Verified product is in stock');
  }

  /**
   * Verify product is out of stock
   */
  async verifyProductOutOfStock(): Promise<void> {
    await expect(this.stockStatus).toContainText('Out of Stock');
    await expect(this.addToCartButton).toBeDisabled();
    Logger.info('Verified product is out of stock');
  }

  /**
   * Get available size options
   * @returns Array of available sizes
   */
  async getAvailableSizes(): Promise<string[]> {
    const sizeOptions = await this.sizeSelector.locator('[data-value]').all();
    const sizes: string[] = [];
    
    for (const option of sizeOptions) {
      const size = await option.getAttribute('data-value');
      if (size) sizes.push(size);
    }
    
    Logger.info(`Found ${sizes.length} available sizes`);
    return sizes;
  }

  /**
   * Get available color options
   * @returns Array of available colors
   */
  async getAvailableColors(): Promise<string[]> {
    const colorOptions = await this.colorSelector.locator('[data-value]').all();
    const colors: string[] = [];
    
    for (const option of colorOptions) {
      const color = await option.getAttribute('data-value');
      if (color) colors.push(color);
    }
    
    Logger.info(`Found ${colors.length} available colors`);
    return colors;
  }

  /**
   * Click on related product by index
   * @param index Index of the related product
   */
  async clickRelatedProduct(index: number): Promise<void> {
    const relatedProduct = this.relatedProductCards.nth(index);
    await relatedProduct.click();
    await this.waitForPageLoad();
    Logger.info(`Clicked related product at index: ${index}`);
  }

  /**
   * Verify all required product elements are visible
   */
  async verifyProductElements(): Promise<void> {
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productDescription).toBeVisible();
    await expect(this.productImages.first()).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.stockStatus).toBeVisible();
    
    Logger.info('Product elements verified');
  }
}
```

## Part 2: Implementing E2E Test Suites

### 2.1 User Registration and Authentication Tests

**File: `tests/e2e/authentication.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { RegistrationPage } from '../../src/pages/RegistrationPage';
import { LoginPage } from '../../src/pages/LoginPage';
import { DataGenerator } from '../../src/framework/utils/DataGenerator';
import { TestDataManager } from '../../src/framework/utils/TestDataManager';
import { Logger } from '../../src/framework/utils/Logger';

test.describe('User Authentication E2E Tests', () => {
  let homePage: HomePage;
  let registrationPage: RegistrationPage;
  let loginPage: LoginPage;
  let testDataManager: TestDataManager;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    homePage = new HomePage(page);
    registrationPage = new RegistrationPage(page);
    loginPage = new LoginPage(page);
    testDataManager = new TestDataManager();
    
    // Navigate to homepage
    await homePage.navigateToHome();
    await homePage.waitForPageLoad();
    
    Logger.info('Test setup completed - navigated to homepage');
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Clear any authentication state
    await page.context().clearCookies();
    await page.context().clearPermissions();
    Logger.info('Test cleanup completed');
  });

  test('should successfully register a new user with valid data', async () => {
    // Generate test user data
    const userData = {
      firstName: DataGenerator.generateFirstName(),
      lastName: DataGenerator.generateLastName(),
      email: DataGenerator.generateEmail(),
      password: DataGenerator.generatePassword(),
      phoneNumber: DataGenerator.generatePhoneNumber(),
      dateOfBirth: DataGenerator.generateDateOfBirth()
    };

    Logger.info(`Starting user registration test with email: ${userData.email}`);

    // Navigate to registration page
    await homePage.goToRegister();
    await registrationPage.waitForPageLoad();

    // Fill registration form
    await registrationPage.fillPersonalInformation(
      userData.firstName,
      userData.lastName,
      userData.email
    );
    
    await registrationPage.fillAccountDetails(
      userData.password,
      userData.password
    );
    
    await registrationPage.fillAdditionalInfo(
      userData.phoneNumber,
      userData.dateOfBirth
    );

    // Accept terms and submit
    await registrationPage.acceptTermsAndConditions();
    await registrationPage.submitRegistration();

    // Verify successful registration
    await registrationPage.verifyRegistrationSuccess();
    
    // Store user data for potential cleanup
    await testDataManager.storeUserData(userData);
    
    Logger.info('User registration completed successfully');
  });

  test('should show validation errors for invalid registration data', async () => {
    Logger.info('Starting registration validation test');

    // Navigate to registration page
    await homePage.goToRegister();
    await registrationPage.waitForPageLoad();

    // Test empty form submission
    await registrationPage.submitRegistration();
    await registrationPage.verifyValidationErrors([
      'First name is required',
      'Last name is required', 
      'Email is required',
      'Password is required'
    ]);

    // Test invalid email format
    await registrationPage.fillPersonalInformation(
      'John',
      'Doe',
      'invalid-email'
    );
    await registrationPage.submitRegistration();
    await registrationPage.verifyValidationError('Please enter a valid email address');

    // Test weak password
    await registrationPage.fillPersonalInformation(
      'John',
      'Doe',
      DataGenerator.generateEmail()
    );
    await registrationPage.fillAccountDetails('123', '123');
    await registrationPage.submitRegistration();
    await registrationPage.verifyValidationError('Password must be at least 8 characters long');

    // Test password mismatch
    await registrationPage.fillAccountDetails('Password123!', 'DifferentPassword');
    await registrationPage.submitRegistration();
    await registrationPage.verifyValidationError('Passwords do not match');

    Logger.info('Registration validation test completed');
  });

  test('should successfully login with valid credentials', async () => {
    // First, create a test user
    const userData = await testDataManager.getOrCreateTestUser();
    Logger.info(`Starting login test with user: ${userData.email}`);

    // Navigate to login page
    await homePage.goToLogin();
    await loginPage.waitForPageLoad();

    // Perform login
    await loginPage.login(userData.email, userData.password);
    await loginPage.verifyLoginSuccess();

    // Verify user is logged in on homepage
    await homePage.navigateToHome();
    await homePage.verifyUserLoggedIn(userData.firstName);

    Logger.info('User login completed successfully');
  });

  test('should show error for invalid login credentials', async () => {
    Logger.info('Starting invalid login test');

    // Navigate to login page
    await homePage.goToLogin();
    await loginPage.waitForPageLoad();

    // Test with invalid credentials
    await loginPage.login('invalid@email.com', 'wrongpassword');
    await loginPage.verifyLoginError('Invalid email or password');

    // Test with empty credentials
    await loginPage.login('', '');
    await loginPage.verifyValidationErrors([
      'Email is required',
      'Password is required'
    ]);

    Logger.info('Invalid login test completed');
  });
});
```

### 2.2 Shopping Cart Tests

**File: `tests/e2e/shopping-cart.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { ProductDetailsPage } from '../../src/pages/ProductDetailsPage';
import { ShoppingCartPage } from '../../src/pages/ShoppingCartPage';
import { ProductListPage } from '../../src/pages/ProductListPage';
import { TestDataManager } from '../../src/framework/utils/TestDataManager';
import { Logger } from '../../src/framework/utils/Logger';

test.describe('Shopping Cart E2E Tests', () => {
  let homePage: HomePage;
  let productDetailsPage: ProductDetailsPage;
  let shoppingCartPage: ShoppingCartPage;
  let productListPage: ProductListPage;
  let testDataManager: TestDataManager;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    homePage = new HomePage(page);
    productDetailsPage = new ProductDetailsPage(page);
    shoppingCartPage = new ShoppingCartPage(page);
    productListPage = new ProductListPage(page);
    testDataManager = new TestDataManager();
    
    // Navigate to homepage and ensure cart is empty
    await homePage.navigateToHome();
    await homePage.waitForPageLoad();
    await homePage.clearCart(); // Utility method to clear cart
    
    Logger.info('Shopping cart test setup completed');
  });

  test.afterEach(async ({ page }) => {
    // Clear cart after each test
    try {
      await homePage.clearCart();
    } catch (error) {
      Logger.warn('Failed to clear cart in cleanup:', error);
    }
  });

  test('should add single product to cart', async () => {
    Logger.info('Starting single product add to cart test');

    // Navigate to a product
    await homePage.navigateToCategory('Electronics');
    await productListPage.waitForPageLoad();
    await productListPage.clickProduct(0);
    await productDetailsPage.waitForPageLoad();

    // Get product details
    const productDetails = await productDetailsPage.getProductDetails();
    const initialCartCount = await homePage.getCartCount();

    // Add product to cart
    await productDetailsPage.addToCart(1);

    // Verify cart count increased
    const newCartCount = await homePage.getCartCount();
    expect(newCartCount).toBe(initialCartCount + 1);

    // Navigate to cart and verify product
    await homePage.goToCart();
    await shoppingCartPage.waitForPageLoad();

    await shoppingCartPage.verifyProductInCart(productDetails.name, 1, productDetails.price);

    Logger.info(`Single product add to cart test completed for: ${productDetails.name}`);
  });

  test('should add multiple quantities of same product', async () => {
    const quantity = 3;
    Logger.info(`Starting multiple quantity add to cart test with quantity: ${quantity}`);

    // Navigate to a product
    await homePage.navigateToCategory('Electronics');
    await productListPage.waitForPageLoad();
    await productListPage.clickProduct(0);
    await productDetailsPage.waitForPageLoad();

    const productDetails = await productDetailsPage.getProductDetails();
    const initialCartCount = await homePage.getCartCount();

    // Add multiple quantities to cart
    await productDetailsPage.addToCart(quantity);

    // Verify cart count
    const newCartCount = await homePage.getCartCount();
    expect(newCartCount).toBe(initialCartCount + quantity);

    // Verify in cart page
    await homePage.goToCart();
    await shoppingCartPage.waitForPageLoad();

    await shoppingCartPage.verifyProductInCart(
      productDetails.name, 
      quantity, 
      productDetails.price * quantity
    );

    Logger.info('Multiple quantity add to cart test completed');
  });

  test('should remove product from cart', async () => {
    Logger.info('Starting remove product from cart test');

    // Add multiple products to cart
    await homePage.navigateToCategory('Electronics');
    await productListPage.waitForPageLoad();
    
    // Add first product
    await productListPage.clickProduct(0);
    await productDetailsPage.waitForPageLoad();
    const product1Details = await productDetailsPage.getProductDetails();
    await productDetailsPage.addToCart(1);

    // Add second product
    await homePage.navigateToCategory('Electronics');
    await productListPage.waitForPageLoad();
    await productListPage.clickProduct(1);
    await productDetailsPage.waitForPageLoad();
    const product2Details = await productDetailsPage.getProductDetails();
    await productDetailsPage.addToCart(1);

    // Go to cart
    await homePage.goToCart();
    await shoppingCartPage.waitForPageLoad();

    // Verify both products are in cart
    await shoppingCartPage.verifyProductInCart(product1Details.name, 1, product1Details.price);
    await shoppingCartPage.verifyProductInCart(product2Details.name, 1, product2Details.price);

    // Remove first product
    await shoppingCartPage.removeProduct(product1Details.name);

    // Verify first product removed, second remains
    await shoppingCartPage.verifyProductNotInCart(product1Details.name);
    await shoppingCartPage.verifyProductInCart(product2Details.name, 1, product2Details.price);

    // Verify cart count updated
    const cartCount = await homePage.getCartCount();
    expect(cartCount).toBe(1);

    Logger.info('Remove product from cart test completed');
  });
});
```

## Part 3: Test Organization and Data Management

### 3.1 Test Data Factory

**File: `src/framework/data/TestDataFactory.ts`**

```typescript
import { DataGenerator } from '../utils/DataGenerator';

export interface UserTestData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: AddressData;
}

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ProductTestData {
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
  variations?: {
    sizes?: string[];
    colors?: string[];
  };
}

export class TestDataFactory {
  /**
   * Generate a complete user test data object
   */
  static generateUser(): UserTestData {
    return {
      firstName: DataGenerator.generateFirstName(),
      lastName: DataGenerator.generateLastName(),
      email: DataGenerator.generateEmail(),
      password: DataGenerator.generatePassword(),
      phoneNumber: DataGenerator.generatePhoneNumber(),
      dateOfBirth: DataGenerator.generateDateOfBirth(),
      address: this.generateAddress()
    };
  }

  /**
   * Generate address data
   */
  static generateAddress(): AddressData {
    return {
      street: DataGenerator.generateStreetAddress(),
      city: DataGenerator.generateCity(),
      state: DataGenerator.generateState(),
      zipCode: DataGenerator.generateZipCode(),
      country: 'United States'
    };
  }

  /**
   * Generate product test data
   */
  static generateProduct(category: string = 'Electronics'): ProductTestData {
    const productNames = {
      'Electronics': ['Laptop', 'Smartphone', 'Tablet', 'Headphones', 'Camera'],
      'Clothing': ['T-Shirt', 'Jeans', 'Jacket', 'Shoes', 'Hat'],
      'Books': ['Novel', 'Textbook', 'Biography', 'Cookbook', 'Guide']
    };

    const names = productNames[category] || productNames['Electronics'];
    const baseName = DataGenerator.getRandomElement(names);
    
    return {
      name: `${baseName} ${DataGenerator.generateString(6)}`,
      category,
      price: DataGenerator.generatePrice(10, 1000),
      description: `High-quality ${baseName.toLowerCase()} with excellent features.`,
      inStock: DataGenerator.generateBoolean(0.9), // 90% chance in stock
      variations: {
        sizes: category === 'Clothing' ? ['S', 'M', 'L', 'XL'] : undefined,
        colors: ['Black', 'White', 'Blue', 'Red']
      }
    };
  }

  /**
   * Generate test data for specific scenarios
   */
  static generateScenarioData(scenario: string): any {
    switch (scenario) {
      case 'new_user_registration':
        return {
          user: this.generateUser(),
          expectedResult: 'success'
        };

      case 'invalid_registration':
        return {
          user: {
            ...this.generateUser(),
            email: 'invalid-email', // Invalid email format
            password: '123' // Weak password
          },
          expectedResult: 'validation_error'
        };

      case 'bulk_cart_addition':
        return {
          products: Array.from({ length: 5 }, () => ({
            product: this.generateProduct(),
            quantity: DataGenerator.generateInteger(1, 3)
          }))
        };

      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }
  }

  /**
   * Load test data from external file
   */
  static async loadTestDataFromFile(filePath: string): Promise<any> {
    try {
      const fs = await import('fs/promises');
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load test data from ${filePath}: ${error}`);
    }
  }

  /**
   * Save test data to file for reuse
   */
  static async saveTestDataToFile(data: any, filePath: string): Promise<void> {
    try {
      const fs = await import('fs/promises');
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Failed to save test data to ${filePath}: ${error}`);
    }
  }
}
```

### 3.2 Data-Driven Testing Implementation

**File: `tests/e2e/data-driven/user-registration.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../../../src/pages/HomePage';
import { RegistrationPage } from '../../../src/pages/RegistrationPage';
import { TestDataFactory } from '../../../src/framework/data/TestDataFactory';
import { Logger } from '../../../src/framework/utils/Logger';

// Test data for different registration scenarios
const registrationTestData = [
  {
    scenario: 'valid_standard_user',
    userData: TestDataFactory.generateUser(),
    expectedResult: 'success'
  },
  {
    scenario: 'invalid_email_format',
    userData: {
      ...TestDataFactory.generateUser(),
      email: 'invalid.email.format'
    },
    expectedResult: 'validation_error',
    expectedErrors: ['Please enter a valid email address']
  },
  {
    scenario: 'weak_password',
    userData: {
      ...TestDataFactory.generateUser(),
      password: '123'
    },
    expectedResult: 'validation_error',
    expectedErrors: ['Password must be at least 8 characters long']
  }
];

test.describe('Data-Driven User Registration Tests', () => {
  let homePage: HomePage;
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registrationPage = new RegistrationPage(page);
    
    await homePage.navigateToHome();
    await homePage.waitForPageLoad();
    await homePage.goToRegister();
    await registrationPage.waitForPageLoad();
  });

  // Parameterized test for each registration scenario
  for (const testData of registrationTestData) {
    test(`should handle registration scenario: ${testData.scenario}`, async () => {
      Logger.info(`Starting registration test for scenario: ${testData.scenario}`);

      // Fill registration form
      await registrationPage.fillPersonalInformation(
        testData.userData.firstName,
        testData.userData.lastName,
        testData.userData.email
      );

      await registrationPage.fillAccountDetails(
        testData.userData.password,
        testData.userData.password
      );

      if (testData.userData.phoneNumber || testData.userData.dateOfBirth) {
        await registrationPage.fillAdditionalInfo(
          testData.userData.phoneNumber,
          testData.userData.dateOfBirth
        );
      }

      // Accept terms if valid scenario
      if (testData.expectedResult === 'success') {
        await registrationPage.acceptTermsAndConditions();
      }

      // Submit registration
      await registrationPage.submitRegistration();

      // Verify expected result
      if (testData.expectedResult === 'success') {
        await registrationPage.verifyRegistrationSuccess();
        Logger.info(`Registration successful for scenario: ${testData.scenario}`);
      } else if (testData.expectedResult === 'validation_error') {
        await registrationPage.verifyValidationErrors(testData.expectedErrors || []);
        Logger.info(`Validation errors verified for scenario: ${testData.scenario}`);
      }

      Logger.info(`Completed registration test for scenario: ${testData.scenario}`);
    });
  }
});
```

## Summary

In this lesson, you've learned how to implement comprehensive E2E tests using the framework foundation you built in the previous lesson. Key achievements include:

### **Technical Skills Developed:**
- **Page Object Implementation**: Created robust page objects that extend base framework classes
- **E2E Test Development**: Built comprehensive test suites covering authentication, browsing, and cart functionality
- **Data-Driven Testing**: Implemented parameterized tests using external data sources
- **Complex User Journeys**: Created end-to-end scenarios that simulate real user workflows
- **Test Organization**: Structured tests using appropriate grouping and naming conventions

### **Professional Practices Applied:**
- **Maintainable Code**: Used SOLID principles and DRY concepts in test development
- **Error Handling**: Implemented robust error handling and recovery mechanisms
- **Documentation**: Added comprehensive comments and logging throughout tests
- **Reusability**: Created reusable test utilities and data factories

### **Key Patterns Learned:**
- **Factory Pattern**: Used for generating test data consistently
- **Page Object Pattern**: Extended base classes for specific page functionality
- **Data Management**: Centralized test data creation and management
- **Configuration Management**: Implemented environment-specific test configurations

### **Next Steps:**
With your E2E tests implemented, you're ready to move on to **Lesson 05: Implementing Advanced Test Scenarios**, where you'll learn about cross-browser testing, API integration testing, visual regression testing, and performance testing techniques.

Your test suite now provides a solid foundation for comprehensive E2E testing that can be maintained and extended as your application grows. The patterns and practices learned here will serve you well in professional QA automation roles.

## Further Reading

- **Test Organization**: [Test Suite Architecture Best Practices](https://example.com/test-organization)
- **Data-Driven Testing**: [Parameterized Testing Patterns](https://example.com/data-driven-testing) 
- **E2E Testing**: [End-to-End Testing Strategies](https://example.com/e2e-strategies)
- **Page Object Model**: [Advanced POM Patterns](https://example.com/advanced-pom)

---

*Your E2E test implementation is now complete and ready for advanced scenarios. Proceed to implement cross-browser and performance testing in the next lesson!*
