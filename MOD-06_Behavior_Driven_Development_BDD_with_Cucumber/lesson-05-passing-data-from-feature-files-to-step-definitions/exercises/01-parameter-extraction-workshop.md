# Exercise 01: Parameter Extraction Workshop

## Objective

Master the fundamentals of parameter extraction in Cucumber by implementing comprehensive step definitions that handle string, numeric, boolean, and optional parameters with robust validation and error handling. This workshop focuses on building type-safe, production-ready parameter processing capabilities.

### **Learning Goals**
- Implement parameter extraction for all basic data types with validation
- Create robust error handling strategies for invalid parameters
- Develop optional parameter management with appropriate defaults
- Apply type-safe parameter processing using TypeScript
- Build reusable parameter validation and transformation utilities

---

## Workshop Scenario: E-commerce Product Management System

You're testing an e-commerce platform that requires comprehensive product management capabilities. The system needs to handle various parameter types for product searches, user account management, and order processing with robust validation and error handling.

---

## Part A: Basic Parameter Extraction

### **Feature File: Product Search and Management**

Create a feature file that demonstrates various parameter extraction scenarios:

```gherkin
# features/parameter-extraction.feature
Feature: Parameter Extraction Workshop
  As a test automation engineer
  I want to master parameter extraction techniques
  So that I can handle various data types effectively in BDD scenarios

  Background:
    Given the e-commerce platform is running
    And I have access to the product management system
    And the user authentication system is available

  Scenario: Product Search with String Parameters
    Given I am on the product search page
    When I search for products with name "Premium Wireless Headphones"
    And I filter by brand "TechCorp"
    And I filter by category "Electronics"
    Then I should see products matching the search criteria
    And the results should be filtered correctly
    And the search parameters should be preserved in the URL

  Scenario: Product Filtering with Numeric Parameters
    Given I am on the product catalog page
    When I set the minimum price to 50
    And I set the maximum price to 500
    And I set the minimum rating to 4.5
    And I limit results to 20 products per page
    Then the product list should be filtered by price range
    And only products with rating 4.5 or higher should be displayed
    And exactly 20 or fewer products should be shown per page

  Scenario: User Account Management with Boolean Parameters
    Given I am on the user account creation page
    When I create a user account with email notifications enabled
    And I set SMS notifications to false
    And I enable promotional emails
    And I disable marketing calls
    Then the user account should be created successfully
    And email notifications should be enabled
    And SMS notifications should be disabled
    And promotional preferences should be saved correctly

  Scenario: Advanced Product Configuration with Optional Parameters
    Given I am configuring a product listing
    When I set the product name to "Luxury Gaming Laptop"
    And I set the base price to 1299.99
    And I optionally set the discount percentage to 15
    And I optionally set the warranty period to 36 months
    And I leave the gift wrapping option unspecified
    Then the product should be configured with all specified values
    And optional parameters should use appropriate defaults
    And the configuration should be valid and complete

  Scenario: Error Handling for Invalid Parameters
    Given I am testing parameter validation
    When I attempt to set an invalid price of -50
    And I try to set a rating of 6 (exceeding maximum of 5)
    And I provide an invalid email format "invalid-email"
    And I set a negative quantity of -5 items
    Then appropriate error messages should be displayed
    And the system should prevent invalid data entry
    And helpful validation guidance should be provided

  Scenario: Complex Parameter Combinations
    Given I am creating a comprehensive product filter
    When I search for "Gaming" products
    And I set price range from 100 to 2000
    And I require rating above 4.0
    And I enable free shipping filter
    And I optionally set brand preference to "GamerPro"
    And I optionally limit to in-stock items only
    Then all parameters should be processed correctly
    And the filter should combine all criteria appropriately
    And results should match the complete parameter set
```

### **Task A1: Implement Basic String Parameter Extraction**

Create step definitions that handle string parameters with validation:

```typescript
// support/step-definitions/parameter-extraction.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../world';

// String parameter extraction with validation
When('I search for products with name {string}', 
  async function (this: CustomWorld, productName: string) {
    // TODO: Implement string parameter handling
    // Requirements:
    // 1. Validate productName is not empty or only whitespace
    // 2. Sanitize input for XSS prevention
    // 3. Handle special characters appropriately
    // 4. Store parameter for later verification
    // 5. Navigate to search page and enter the product name
    // 6. Trigger the search action
    
    console.log(`Searching for product: "${productName}"`);
  }
);

When('I filter by brand {string}', 
  async function (this: CustomWorld, brandName: string) {
    // TODO: Implement brand filtering
    // Requirements:
    // 1. Validate brandName format (letters, numbers, spaces, hyphens only)
    // 2. Check against known brand list if available
    // 3. Apply the brand filter to the current search
    // 4. Store filter for verification
    
    console.log(`Filtering by brand: "${brandName}"`);
  }
);

When('I filter by category {string}', 
  async function (this: CustomWorld, categoryName: string) {
    // TODO: Implement category filtering
    // Requirements:
    // 1. Validate category exists in the system
    // 2. Handle category hierarchy if applicable
    // 3. Apply the category filter
    // 4. Update UI to reflect the filter
    
    console.log(`Filtering by category: "${categoryName}"`);
  }
);
```

### **Task A2: Implement Numeric Parameter Extraction**

Create step definitions for numeric parameters with range validation:

```typescript
// Numeric parameter extraction with validation
When('I set the minimum price to {float}', 
  async function (this: CustomWorld, minPrice: number) {
    // TODO: Implement minimum price setting
    // Requirements:
    // 1. Validate minPrice is non-negative
    // 2. Check reasonable price range (e.g., 0-10000)
    // 3. Format price correctly for UI display
    // 4. Update price filter interface
    // 5. Store for later verification
    
    console.log(`Setting minimum price to: $${minPrice}`);
  }
);

When('I set the maximum price to {float}', 
  async function (this: CustomWorld, maxPrice: number) {
    // TODO: Implement maximum price setting
    // Requirements:
    // 1. Validate maxPrice is greater than stored minPrice
    // 2. Check reasonable upper limit
    // 3. Format and display correctly
    // 4. Update UI controls
    
    console.log(`Setting maximum price to: $${maxPrice}`);
  }
);

When('I set the minimum rating to {float}', 
  async function (this: CustomWorld, minRating: number) {
    // TODO: Implement rating filter
    // Requirements:
    // 1. Validate rating is between 0 and 5
    // 2. Handle decimal ratings appropriately
    // 3. Update rating filter UI
    // 4. Store for verification
    
    console.log(`Setting minimum rating to: ${minRating} stars`);
  }
);

When('I limit results to {int} products per page', 
  async function (this: CustomWorld, productsPerPage: number) {
    // TODO: Implement pagination setting
    // Requirements:
    // 1. Validate productsPerPage is positive integer
    // 2. Check against allowed page sizes (e.g., 10, 20, 50, 100)
    // 3. Update pagination controls
    // 4. Refresh results with new page size
    
    console.log(`Setting page size to: ${productsPerPage} products`);
  }
);
```

### **Task A3: Implement Boolean Parameter Extraction**

Create step definitions for boolean parameters:

```typescript
// Boolean parameter extraction with default handling
When('I create a user account with email notifications {word}', 
  async function (this: CustomWorld, emailNotificationsText: string) {
    // TODO: Implement boolean parameter conversion
    // Requirements:
    // 1. Convert string to boolean (enabled/disabled, true/false, yes/no, on/off)
    // 2. Handle case insensitivity
    // 3. Validate input format
    // 4. Set email notification preference
    // 5. Store preference for verification
    
    const emailNotifications = this.convertToBoolean(emailNotificationsText);
    console.log(`Email notifications: ${emailNotifications ? 'enabled' : 'disabled'}`);
  }
);

When('I set SMS notifications to {word}', 
  async function (this: CustomWorld, smsText: string) {
    // TODO: Implement SMS notification setting
    // Requirements:
    // 1. Convert text to boolean
    // 2. Update SMS preference
    // 3. Handle UI toggle appropriately
    
    const smsNotifications = this.convertToBoolean(smsText);
    console.log(`SMS notifications: ${smsNotifications ? 'enabled' : 'disabled'}`);
  }
);
```

---

## Part B: Optional Parameter Handling

### **Task B1: Implement Optional Parameter Management**

Create step definitions that handle optional parameters with appropriate defaults:

```typescript
// Optional parameter handling
When('I optionally set the discount percentage to {float}', 
  async function (this: CustomWorld, discountPercentage: number) {
    // TODO: Implement optional discount setting
    // Requirements:
    // 1. Validate discount is between 0 and 100
    // 2. Apply discount if provided
    // 3. Handle case where discount is not set
    // 4. Calculate and display discounted price
    // 5. Store for verification
    
    console.log(`Optional discount set to: ${discountPercentage}%`);
  }
);

When('I optionally set the warranty period to {int} months', 
  async function (this: CustomWorld, warrantyMonths: number) {
    // TODO: Implement optional warranty setting
    // Requirements:
    // 1. Validate warranty period is reasonable (1-120 months)
    // 2. Apply warranty if specified
    // 3. Use default warranty if not specified
    // 4. Update product configuration
    
    console.log(`Optional warranty period: ${warrantyMonths} months`);
  }
);

When('I leave the gift wrapping option unspecified', 
  async function (this: CustomWorld) {
    // TODO: Handle unspecified optional parameter
    // Requirements:
    // 1. Set gift wrapping to system default
    // 2. Document that parameter was left unspecified
    // 3. Ensure system handles missing optional parameters gracefully
    
    console.log('Gift wrapping option left unspecified (using default)');
  }
);
```

---

## Part C: Error Handling and Validation

### **Task C1: Implement Comprehensive Error Handling**

Create robust error handling for invalid parameters:

```typescript
// Error handling for invalid parameters
When('I attempt to set an invalid price of {float}', 
  async function (this: CustomWorld, invalidPrice: number) {
    // TODO: Implement error handling for invalid price
    // Requirements:
    // 1. Detect negative price
    // 2. Generate appropriate error message
    // 3. Prevent system from accepting invalid data
    // 4. Store error information for verification
    // 5. Ensure UI shows validation error
    
    try {
      if (invalidPrice < 0) {
        throw new Error(`Invalid price: ${invalidPrice}. Price must be non-negative.`);
      }
      // Continue with normal processing if valid
    } catch (error) {
      this.testData.lastError = error.message;
      console.log(`Error handled: ${error.message}`);
    }
  }
);

When('I try to set a rating of {float} \\\\(exceeding maximum of {int}\\\\)', 
  async function (this: CustomWorld, rating: number, maxRating: number) {
    // TODO: Implement rating validation error handling
    // Requirements:
    // 1. Validate rating is within allowed range
    // 2. Generate helpful error message
    // 3. Prevent invalid rating from being set
    // 4. Guide user on valid rating range
    
    try {
      if (rating > maxRating) {
        throw new Error(`Invalid rating: ${rating}. Rating must be between 0 and ${maxRating}.`);
      }
    } catch (error) {
      this.testData.ratingError = error.message;
      console.log(`Rating validation error: ${error.message}`);
    }
  }
);

When('I provide an invalid email format {string}', 
  async function (this: CustomWorld, invalidEmail: string) {
    // TODO: Implement email validation error handling
    // Requirements:
    // 1. Validate email format using regex
    // 2. Generate specific error message for invalid format
    // 3. Prevent form submission with invalid email
    // 4. Provide guidance on correct email format
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    try {
      if (!emailRegex.test(invalidEmail)) {
        throw new Error(`Invalid email format: "${invalidEmail}". Please provide a valid email address.`);
      }
    } catch (error) {
      this.testData.emailError = error.message;
      console.log(`Email validation error: ${error.message}`);
    }
  }
);
```

---

## Part D: Utility Functions and Helper Methods

### **Task D1: Create Parameter Processing Utilities**

Implement helper functions to support parameter processing:

```typescript
// Add to CustomWorld class
declare module './world' {
  interface CustomWorld {
    convertToBoolean(text: string): boolean;
    validateNumericRange(value: number, min: number, max: number, fieldName: string): void;
    sanitizeStringInput(input: string): string;
    formatCurrency(amount: number, currency?: string): string;
    validateAndParseInteger(value: any, fieldName: string): number;
  }
}

// Helper methods implementation
CustomWorld.prototype.convertToBoolean = function(text: string): boolean {
  // TODO: Implement robust boolean conversion
  // Requirements:
  // 1. Handle multiple formats: true/false, yes/no, enabled/disabled, on/off, 1/0
  // 2. Be case insensitive
  // 3. Throw error for unrecognized values
  // 4. Return boolean result
  
  const lowerText = text.toLowerCase().trim();
  const trueValues = ['true', 'yes', 'enabled', 'on', '1', 'active'];
  const falseValues = ['false', 'no', 'disabled', 'off', '0', 'inactive'];
  
  if (trueValues.includes(lowerText)) {
    return true;
  } else if (falseValues.includes(lowerText)) {
    return false;
  } else {
    throw new Error(`Cannot convert "${text}" to boolean. Valid values: ${[...trueValues, ...falseValues].join(', ')}`);
  }
};

CustomWorld.prototype.validateNumericRange = function(
  value: number, 
  min: number, 
  max: number, 
  fieldName: string
): void {
  // TODO: Implement numeric range validation
  // Requirements:
  // 1. Check if value is within specified range
  // 2. Provide clear error message with range information
  // 3. Include field name in error message
  // 4. Throw error if validation fails
  
  if (value < min || value > max) {
    throw new Error(`${fieldName} value ${value} is outside valid range (${min} - ${max})`);
  }
};

CustomWorld.prototype.sanitizeStringInput = function(input: string): string {
  // TODO: Implement string sanitization
  // Requirements:
  // 1. Trim whitespace
  // 2. Remove potentially dangerous characters
  // 3. Handle null/undefined input
  // 4. Preserve legitimate special characters
  
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>"']/g, '') // Remove basic XSS characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

CustomWorld.prototype.formatCurrency = function(amount: number, currency: string = 'USD'): string {
  // TODO: Implement currency formatting
  // Requirements:
  // 1. Format number as currency
  // 2. Handle different currency types
  // 3. Use appropriate decimal places
  // 4. Include currency symbol
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount);
};

CustomWorld.prototype.validateAndParseInteger = function(value: any, fieldName: string): number {
  // TODO: Implement integer parsing with validation
  // Requirements:
  // 1. Convert value to integer
  // 2. Validate result is a valid integer
  // 3. Provide helpful error message
  // 4. Include field name in error
  
  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid integer. Received: ${value}`);
  }
  
  return parsed;
};
```

---

## Part E: Verification Step Definitions

### **Task E1: Implement Verification Steps**

Create comprehensive verification step definitions:

```typescript
// Verification step definitions
Then('I should see products matching the search criteria', 
  async function (this: CustomWorld) {
    // TODO: Implement search results verification
    // Requirements:
    // 1. Verify search was executed
    // 2. Check that results contain search terms
    // 3. Validate result count is reasonable
    // 4. Ensure UI updates correctly
    
    // Verify search results are displayed
    await this.page.waitForSelector('[data-testid="product-results"]');
    
    const resultCount = await this.page.locator('[data-testid="result-count"]').textContent();
    expect(resultCount).toBeTruthy();
    
    console.log(`✓ Search results verified: ${resultCount} products found`);
  }
);

Then('the results should be filtered correctly', 
  async function (this: CustomWorld) {
    // TODO: Verify filter application
    // Requirements:
    // 1. Check that all displayed products match applied filters
    // 2. Verify filter UI shows active filters
    // 3. Validate filter parameters are preserved
    // 4. Ensure no products violate filter criteria
    
    const activeFilters = await this.page.locator('[data-testid="active-filter"]').count();
    expect(activeFilters).toBeGreaterThan(0);
    
    console.log(`✓ Filters applied correctly: ${activeFilters} active filters`);
  }
);

Then('appropriate error messages should be displayed', 
  async function (this: CustomWorld) {
    // TODO: Verify error message display
    // Requirements:
    // 1. Check that error messages are visible
    // 2. Verify error messages are helpful and specific
    // 3. Ensure errors prevent invalid data submission
    // 4. Validate error message content
    
    const errorMessages = [
      this.testData.lastError,
      this.testData.ratingError,
      this.testData.emailError
    ].filter(Boolean);
    
    expect(errorMessages.length).toBeGreaterThan(0);
    
    for (const error of errorMessages) {
      console.log(`✓ Error message verified: ${error}`);
    }
  }
);

Then('all parameters should be processed correctly', 
  async function (this: CustomWorld) {
    // TODO: Verify comprehensive parameter processing
    // Requirements:
    // 1. Check all parameters were extracted correctly
    // 2. Verify parameter values match expectations
    // 3. Ensure optional parameters have appropriate defaults
    // 4. Validate parameter combinations work together
    
    // Verify stored parameters
    const storedParameters = this.testData;
    expect(storedParameters).toBeDefined();
    
    console.log('✓ All parameters processed and verified successfully');
  }
);
```

---

## Success Criteria

### **Completion Requirements**

To successfully complete this workshop, your implementation must:

1. **Parameter Extraction**:
   - ✅ Handle string parameters with proper validation and sanitization
   - ✅ Process numeric parameters with range checking and type safety
   - ✅ Convert boolean parameters from various text formats
   - ✅ Manage optional parameters with appropriate defaults

2. **Error Handling**:
   - ✅ Validate all parameter types before processing
   - ✅ Provide helpful error messages for invalid inputs
   - ✅ Prevent system corruption from invalid parameters
   - ✅ Guide users toward correct parameter formats

3. **Code Quality**:
   - ✅ Use TypeScript types effectively throughout
   - ✅ Implement reusable utility functions
   - ✅ Follow consistent naming and documentation patterns
   - ✅ Handle edge cases and boundary conditions

4. **Testing Coverage**:
   - ✅ All feature scenarios execute successfully
   - ✅ Error conditions are properly tested
   - ✅ Verification steps confirm correct behavior
   - ✅ Parameter combinations work as expected

---

## Extension Challenges

### **Advanced Tasks** (Optional)

1. **Dynamic Parameter Types**: Create parameters that change behavior based on context
2. **Parameter History**: Implement parameter value tracking and rollback capabilities
3. **Batch Parameter Processing**: Handle multiple parameter sets simultaneously
4. **Parameter Validation Rules**: Create configurable validation rule systems
5. **Internationalization**: Support parameter processing in multiple languages

---

## Solution Patterns

Reference implementations are available after completion. Focus on understanding the patterns rather than copying code:

- Parameter extraction with comprehensive validation
- Type-safe parameter processing utilities
- Error handling strategies for robust systems
- Optional parameter management techniques
- Verification patterns for parameter correctness

**Next Exercise**: [Data Table Mastery Lab](./02-data-table-mastery-lab.md) - Build upon your parameter extraction skills with structured data processing.