# Example 01: Basic Parameter Extraction

## Overview

This example demonstrates fundamental parameter extraction techniques using Cucumber expressions. You'll learn to extract various data types from Gherkin steps and handle them with proper TypeScript typing, laying the foundation for more sophisticated data passing patterns.

### **Learning Focus**
- Master built-in Cucumber parameter types (`{string}`, `{int}`, `{float}`)  
- Implement optional parameters with default value handling
- Create basic custom parameter types for domain-specific validation
- Apply proper error handling for parameter validation

---

## Scenario: E-commerce User and Product Management

### **Feature File: Basic Parameter Handling**

```gherkin
# features/basic-parameter-extraction.feature
Feature: Basic Parameter Extraction
  As a test automation engineer
  I want to extract parameters from Gherkin steps effectively
  So that I can create maintainable and readable BDD tests

  Background:
    Given the e-commerce application is running
    And I have a clean test environment

  Scenario: User Registration with Basic Parameters
    Given I navigate to the registration page
    When I register with username "john.doe@example.com"
    And I set my password to "SecurePass123!"
    And I select the "premium" subscription plan
    Then I should see a successful registration message
    And my account should be created with premium status

  Scenario: Product Search with Numeric Parameters
    Given I am on the product catalog page
    When I search for products in category "Electronics" 
    And I set the minimum price to 100
    And I set the maximum price to 999.99
    And I filter by rating of at least 4.5 stars
    Then I should see 15 products in the results
    And all products should be priced between 100 and 999.99

  Scenario: User Login with Role-based Access
    Given I am on the login page
    When I login as an "admin" user
    Then I should have access to the admin dashboard
    And I should see admin-specific navigation options

  Scenario Outline: User Registration with Different Plans
    Given I navigate to the registration page
    When I register with username "<email>"
    And I select the "<plan>" subscription plan
    Then my account should be created with <plan> status
    And I should receive <notifications> welcome notifications

    Examples:
      | email                | plan     | notifications |
      | basic@example.com    | basic    | 1            |
      | premium@example.com  | premium  | 3            |
      | enterprise@test.com  | enterprise| 5            |

  Scenario: Optional Parameter Handling
    Given I create a new product listing
    When I set the product name to "Wireless Headphones"
    # Price is optional - will use default if not provided
    And I publish the product
    Then the product should be listed with default price 0
    
    Given I create another product listing  
    When I set the product name to "Gaming Mouse"
    And I set the product price to 89.99
    And I publish the product
    Then the product should be listed with price 89.99
```

---

## Step Definitions: TypeScript Implementation

### **Basic String Parameter Extraction**

```typescript
// support/step-definitions/basic-parameters.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world';

// String parameter extraction with validation
Given('I register with username {string}', async function (this: CustomWorld, username: string) {
  // Input validation
  if (!username || username.trim().length === 0) {
    throw new Error('Username cannot be empty');
  }
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    throw new Error(`Invalid email format: ${username}`);
  }
  
  // Store for later use
  this.testData.username = username;
  
  // Interact with the page
  await this.page!.fill('[data-testid="username-input"]', username);
  
  console.log(`✓ Username set: ${username}`);
});

// Password handling with security considerations
When('I set my password to {string}', async function (this: CustomWorld, password: string) {
  // Password strength validation
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  // Store hashed version for verification (never store plain passwords)
  this.testData.passwordLength = password.length;
  
  await this.page!.fill('[data-testid="password-input"]', password);
  
  console.log(`✓ Password set (length: ${password.length} characters)`);
});

// Category filtering
When('I search for products in category {string}', async function (this: CustomWorld, category: string) {
  // Validate category exists
  const validCategories = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports'];
  if (!validCategories.includes(category)) {
    throw new Error(`Invalid category: ${category}. Valid categories: ${validCategories.join(', ')}`);
  }
  
  await this.page!.selectOption('[data-testid="category-filter"]', category);
  this.testData.selectedCategory = category;
  
  console.log(`✓ Category filter applied: ${category}`);
});
```

### **Numeric Parameter Handling**

```typescript
// Integer parameter extraction
When('I set the minimum price to {int}', async function (this: CustomWorld, minPrice: number) {
  // Validation for reasonable price range
  if (minPrice < 0) {
    throw new Error('Minimum price cannot be negative');
  }
  
  if (minPrice > 10000) {
    throw new Error('Minimum price seems unreasonably high');
  }
  
  this.testData.minPrice = minPrice;
  
  await this.page!.fill('[data-testid="min-price-input"]', minPrice.toString());
  
  console.log(`✓ Minimum price set: $${minPrice}`);
});

// Float parameter extraction with precision handling
When('I set the maximum price to {float}', async function (this: CustomWorld, maxPrice: number) {
  // Validation
  if (maxPrice <= 0) {
    throw new Error('Maximum price must be greater than 0');
  }
  
  // Check logical consistency with minimum price
  if (this.testData.minPrice && maxPrice <= this.testData.minPrice) {
    throw new Error(`Maximum price (${maxPrice}) must be greater than minimum price (${this.testData.minPrice})`);
  }
  
  // Round to 2 decimal places for currency
  const roundedPrice = Math.round(maxPrice * 100) / 100;
  this.testData.maxPrice = roundedPrice;
  
  await this.page!.fill('[data-testid="max-price-input"]', roundedPrice.toString());
  
  console.log(`✓ Maximum price set: $${roundedPrice}`);
});

// Rating with decimal precision
When('I filter by rating of at least {float} stars', async function (this: CustomWorld, rating: number) {
  // Validate rating range
  if (rating < 0 || rating > 5) {
    throw new Error('Rating must be between 0 and 5 stars');
  }
  
  // Round to 1 decimal place for ratings
  const roundedRating = Math.round(rating * 10) / 10;
  this.testData.minRating = roundedRating;
  
  await this.page!.fill('[data-testid="rating-filter"]', roundedRating.toString());
  
  console.log(`✓ Minimum rating filter set: ${roundedRating} stars`);
});

// Result count verification
Then('I should see {int} products in the results', async function (this: CustomWorld, expectedCount: number) {
  // Wait for results to load
  await this.page!.waitForSelector('[data-testid="product-results"]');
  
  // Count actual results
  const actualCount = await this.page!.locator('[data-testid="product-item"]').count();
  
  // Verify count matches expectation
  expect(actualCount).toBe(expectedCount);
  
  console.log(`✓ Found expected ${expectedCount} products`);
});
```

### **Custom Parameter Types**

```typescript
// support/parameter-types.ts
import { defineParameterType } from '@cucumber/cucumber';

// User role enumeration
type UserRole = 'admin' | 'user' | 'moderator' | 'guest';

defineParameterType({
  name: 'user_role',
  regexp: /admin|user|moderator|guest/,
  transformer: (role: string): UserRole => {
    const validRoles: UserRole[] = ['admin', 'user', 'moderator', 'guest'];
    if (!validRoles.includes(role as UserRole)) {
      throw new Error(`Invalid user role: ${role}. Valid roles: ${validRoles.join(', ')}`);
    }
    return role as UserRole;
  }
});

// Subscription plan enumeration
type SubscriptionPlan = 'basic' | 'premium' | 'enterprise';

defineParameterType({
  name: 'subscription_plan',
  regexp: /basic|premium|enterprise/,
  transformer: (plan: string): SubscriptionPlan => {
    const validPlans: SubscriptionPlan[] = ['basic', 'premium', 'enterprise'];
    if (!validPlans.includes(plan as SubscriptionPlan)) {
      throw new Error(`Invalid subscription plan: ${plan}. Valid plans: ${validPlans.join(', ')}`);
    }
    return plan as SubscriptionPlan;
  }
});

// Product status enumeration  
type ProductStatus = 'active' | 'inactive' | 'draft' | 'archived';

defineParameterType({
  name: 'product_status',
  regexp: /active|inactive|draft|archived/,
  transformer: (status: string): ProductStatus => {
    return status as ProductStatus;
  }
});
```

### **Using Custom Parameter Types**

```typescript
// Role-based authentication
When('I login as an {user_role} user', async function (this: CustomWorld, role: UserRole) {
  // Get test credentials based on role
  const credentials = this.testDataService.getCredentialsForRole(role);
  
  if (!credentials) {
    throw new Error(`No test credentials available for role: ${role}`);
  }
  
  // Perform login
  await this.page!.fill('[data-testid="username"]', credentials.username);
  await this.page!.fill('[data-testid="password"]', credentials.password);
  await this.page!.click('[data-testid="login-button"]');
  
  // Wait for navigation and store user context
  await this.page!.waitForURL(/\/dashboard/);
  this.currentUser = { role, ...credentials };
  
  console.log(`✓ Logged in as ${role} user: ${credentials.username}`);
});

// Subscription plan selection
When('I select the {subscription_plan} subscription plan', async function (this: CustomWorld, plan: SubscriptionPlan) {
  // Click on the appropriate plan selector
  await this.page!.click(`[data-testid="plan-${plan}"]`);
  
  // Verify selection is active
  await expect(this.page!.locator(`[data-testid="plan-${plan}"]`)).toHaveClass(/selected/);
  
  this.testData.selectedPlan = plan;
  
  console.log(`✓ Selected ${plan} subscription plan`);
});

// Status-based verification
Then('my account should be created with {subscription_plan} status', async function (this: CustomWorld, expectedPlan: SubscriptionPlan) {
  // Wait for account creation confirmation
  await this.page!.waitForSelector('[data-testid="account-created"]');
  
  // Verify plan status in UI
  const displayedPlan = await this.page!.locator('[data-testid="current-plan"]').textContent();
  expect(displayedPlan?.toLowerCase()).toBe(expectedPlan);
  
  // Verify stored test data consistency
  expect(this.testData.selectedPlan).toBe(expectedPlan);
  
  console.log(`✓ Account created successfully with ${expectedPlan} plan`);
});
```

### **Optional Parameter Handling**

```typescript
// Optional parameter with parentheses syntax
When('I set the product name to {string}( and price to {float})', 
  async function (this: CustomWorld, productName: string, price?: number) {
    // Validate product name
    if (!productName || productName.trim().length === 0) {
      throw new Error('Product name is required');
    }
    
    // Set product name
    await this.page!.fill('[data-testid="product-name"]', productName);
    this.testData.productName = productName;
    
    // Handle optional price
    if (price !== undefined) {
      if (price < 0) {
        throw new Error('Product price cannot be negative');
      }
      
      const roundedPrice = Math.round(price * 100) / 100;
      await this.page!.fill('[data-testid="product-price"]', roundedPrice.toString());
      this.testData.productPrice = roundedPrice;
      
      console.log(`✓ Product created: ${productName} - $${roundedPrice}`);
    } else {
      // Use default price of 0
      this.testData.productPrice = 0;
      await this.page!.fill('[data-testid="product-price"]', '0');
      
      console.log(`✓ Product created: ${productName} - Using default price $0`);
    }
  }
);

// Alternative approach with separate steps
When('I set the product name to {string}', async function (this: CustomWorld, productName: string) {
  if (!productName || productName.trim().length === 0) {
    throw new Error('Product name is required');
  }
  
  await this.page!.fill('[data-testid="product-name"]', productName);
  this.testData.productName = productName;
  
  console.log(`✓ Product name set: ${productName}`);
});

When('I set the product price to {float}', async function (this: CustomWorld, price: number) {
  if (price < 0) {
    throw new Error('Product price cannot be negative');
  }
  
  const roundedPrice = Math.round(price * 100) / 100;
  await this.page!.fill('[data-testid="product-price"]', roundedPrice.toString());
  this.testData.productPrice = roundedPrice;
  
  console.log(`✓ Product price set: $${roundedPrice}`);
});

When('I publish the product', async function (this: CustomWorld) {
  // Ensure required fields are set
  if (!this.testData.productName) {
    throw new Error('Product name must be set before publishing');
  }
  
  // Set default price if not provided
  if (this.testData.productPrice === undefined) {
    this.testData.productPrice = 0;
    await this.page!.fill('[data-testid="product-price"]', '0');
  }
  
  // Publish the product
  await this.page!.click('[data-testid="publish-button"]');
  
  // Wait for confirmation
  await this.page!.waitForSelector('[data-testid="product-published"]');
  
  console.log(`✓ Product published: ${this.testData.productName} - $${this.testData.productPrice}`);
});
```

---

## Advanced Parameter Validation

### **Input Sanitization and Security**

```typescript
// Secure parameter handling
class ParameterValidator {
  static sanitizeString(input: string): string {
    // Remove potential XSS characters
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }
  
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }
  
  static validatePrice(price: number): { isValid: boolean; message?: string } {
    if (price < 0) {
      return { isValid: false, message: 'Price cannot be negative' };
    }
    
    if (price > 999999.99) {
      return { isValid: false, message: 'Price exceeds maximum allowed value' };
    }
    
    // Check for reasonable decimal places
    const decimalPlaces = (price.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      return { isValid: false, message: 'Price can have at most 2 decimal places' };
    }
    
    return { isValid: true };
  }
}

// Enhanced step with validation
Given('I register with username {string}', async function (this: CustomWorld, username: string) {
  // Sanitize input
  const sanitizedUsername = ParameterValidator.sanitizeString(username);
  
  // Validate email format
  if (!ParameterValidator.validateEmail(sanitizedUsername)) {
    throw new Error(`Invalid email format: ${sanitizedUsername}`);
  }
  
  this.testData.username = sanitizedUsername;
  await this.page!.fill('[data-testid="username-input"]', sanitizedUsername);
  
  console.log(`✓ Username set (sanitized): ${sanitizedUsername}`);
});
```

### **Context-aware Parameter Processing**

```typescript
// Context-sensitive parameter handling
When('I set the {string} field to {string}', async function (this: CustomWorld, fieldName: string, value: string) {
  const sanitizedValue = ParameterValidator.sanitizeString(value);
  
  // Handle different field types with appropriate validation
  switch (fieldName.toLowerCase()) {
    case 'email':
    case 'username':
      if (!ParameterValidator.validateEmail(sanitizedValue)) {
        throw new Error(`Invalid email format for ${fieldName}: ${sanitizedValue}`);
      }
      break;
      
    case 'phone':
      const phoneRegex = /^[\d\s\-()]{10,}$/;
      if (!phoneRegex.test(sanitizedValue)) {
        throw new Error(`Invalid phone number format: ${sanitizedValue}`);
      }
      break;
      
    case 'url':
      try {
        new URL(sanitizedValue);
      } catch {
        throw new Error(`Invalid URL format: ${sanitizedValue}`);
      }
      break;
  }
  
  // Find and fill the appropriate field
  const selector = `[data-testid="${fieldName.toLowerCase()}-input"]`;
  await this.page!.fill(selector, sanitizedValue);
  
  // Store in test data for later verification
  this.testData[fieldName] = sanitizedValue;
  
  console.log(`✓ ${fieldName} field set: ${sanitizedValue}`);
});
```

---

## Error Handling and Debugging

### **Comprehensive Error Messages**

```typescript
// Error handling with context
When('I apply discount of {float} percent', async function (this: CustomWorld, discountPercent: number) {
  try {
    // Validate discount range
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error(`Discount percentage must be between 0 and 100, got: ${discountPercent}`);
    }
    
    // Apply discount
    const discountDecimal = discountPercent / 100;
    await this.page!.fill('[data-testid="discount-input"]', discountPercent.toString());
    
    this.testData.appliedDiscount = discountDecimal;
    
    console.log(`✓ Discount applied: ${discountPercent}% (${discountDecimal})`);
    
  } catch (error) {
    // Enhanced error context
    const errorMessage = `Failed to apply discount: ${error.message}\n` +
                        `  - Current step: Apply discount of ${discountPercent}%\n` +
                        `  - Test data state: ${JSON.stringify(this.testData, null, 2)}`;
    
    throw new Error(errorMessage);
  }
});
```

### **Debug Information Collection**

```typescript
// Debug-friendly parameter extraction
Given('I set search criteria with minimum price {int} and maximum price {float}', 
  async function (this: CustomWorld, minPrice: number, maxPrice: number) {
    const debugInfo = {
      step: 'Set search criteria',
      parameters: { minPrice, maxPrice },
      timestamp: new Date().toISOString(),
      currentUrl: await this.page!.url()
    };
    
    try {
      // Validation with detailed error info
      if (minPrice < 0) {
        throw new Error(`Minimum price cannot be negative: ${minPrice}`);
      }
      
      if (maxPrice <= minPrice) {
        throw new Error(`Maximum price (${maxPrice}) must be greater than minimum price (${minPrice})`);
      }
      
      // Apply filters
      await this.page!.fill('[data-testid="min-price"]', minPrice.toString());
      await this.page!.fill('[data-testid="max-price"]', maxPrice.toString());
      await this.page!.click('[data-testid="apply-filters"]');
      
      // Store debug info for potential troubleshooting
      this.debugInfo = debugInfo;
      this.testData.searchCriteria = { minPrice, maxPrice };
      
      console.log(`✓ Search criteria set: $${minPrice} - $${maxPrice}`);
      
    } catch (error) {
      // Include debug info in error
      debugInfo['error'] = error.message;
      console.error('Debug info:', debugInfo);
      throw error;
    }
  }
);
```

---

## Summary

This example demonstrates the foundational skills for parameter extraction in BDD scenarios:

**Key Techniques Mastered:**
- **Built-in Parameter Types**: String, integer, and float parameter extraction with proper validation
- **Custom Parameter Types**: Domain-specific enumerations for user roles and subscription plans
- **Optional Parameters**: Flexible step definitions that handle optional data gracefully
- **Input Validation**: Comprehensive validation strategies for security and data integrity
- **Error Handling**: Context-aware error messages and debugging information

**Professional Patterns Applied:**
- Type-safe parameter handling with TypeScript interfaces
- Input sanitization for security considerations  
- Context-sensitive validation based on field types
- Debug-friendly error messages with detailed context
- Consistent data storage patterns for multi-step scenarios

**Real-world Applications:**
- User registration and authentication workflows
- Product catalog management with price and rating filters
- Role-based access control testing
- E-commerce search and filtering scenarios

These fundamental parameter extraction patterns provide the building blocks for more complex data passing scenarios covered in subsequent examples, ensuring your BDD tests are both readable for business stakeholders and robust for automated execution.

**Next Example**: [Data Tables and Structured Data](./02-data-tables-and-structured-data.md) - Learn to handle complex structured data through Cucumber data tables.