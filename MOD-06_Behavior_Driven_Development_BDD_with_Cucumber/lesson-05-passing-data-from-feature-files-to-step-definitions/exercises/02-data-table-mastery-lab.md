# Exercise 02: Data Table Mastery Lab

## Objective

Master advanced data table processing techniques in Cucumber by implementing comprehensive step definitions that handle horizontal tables (multiple rows), vertical tables (key-value pairs), and complex data transformations with robust validation and type safety. This lab focuses on building production-ready data processing capabilities for real-world testing scenarios.

### **Learning Goals**
- Process horizontal data tables with multiple rows and dynamic column handling
- Implement vertical data table processing for key-value pair scenarios
- Create type-safe data transformation utilities with comprehensive validation
- Develop error handling strategies for malformed or invalid table data
- Build reusable data processing patterns for enterprise testing environments
- Apply advanced data manipulation techniques for complex business scenarios

---

## Lab Scenario: E-commerce Order Management System

You're testing a comprehensive e-commerce platform that requires sophisticated data processing for bulk operations, inventory management, user account administration, and complex order processing workflows. The system must handle various data table formats with robust validation and error recovery.

---

## Part A: Horizontal Data Tables (Multiple Rows)

### **Feature File: Bulk Product Management**

Create comprehensive scenarios demonstrating horizontal data table processing:

```gherkin
# features/data-table-mastery.feature
Feature: Data Table Mastery Lab
  As a test automation engineer
  I want to master data table processing techniques
  So that I can handle complex data scenarios effectively in BDD testing

  Background:
    Given the e-commerce platform is running
    And I have administrative access to the system
    And the product management interface is available
    And the user account system is operational

  Scenario: Bulk Product Creation with Horizontal Data Tables
    Given I am on the bulk product creation page
    When I create multiple products with the following details:
      | name                    | category    | price  | stock | rating | brand      | featured |
      | Premium Wireless Mouse  | Electronics | 79.99  | 150   | 4.5    | TechCorp   | true     |
      | Gaming Mechanical Keyboard | Electronics | 129.99 | 75    | 4.8    | GamerPro   | true     |
      | USB-C Hub Multi-Port   | Accessories | 45.50  | 200   | 4.2    | ConnectMax | false    |
      | Wireless Charging Pad  | Electronics | 39.99  | 120   | 4.3    | PowerTech  | false    |
      | Bluetooth Headphones   | Audio       | 159.99 | 90    | 4.7    | SoundWave  | true     |
    Then all products should be created successfully
    And each product should have the correct attributes
    And the inventory should be updated appropriately
    And featured products should be marked correctly

  Scenario: User Account Bulk Registration with Data Validation
    Given I am on the user management admin panel
    When I register multiple users with the following information:
      | email                | firstName | lastName | age | country | membershipType | emailNotifications | smsAlerts |
      | alice.johnson@email.com | Alice     | Johnson  | 28  | USA     | Premium        | true              | false     |
      | bob.smith@email.com     | Bob       | Smith    | 35  | Canada  | Standard       | false             | true      |
      | carol.davis@email.com   | Carol     | Davis    | 42  | UK      | Premium        | true              | true      |
      | david.wilson@email.com  | David     | Wilson   | 29  | Australia | Gold         | true              | false     |
      | eva.brown@email.com     | Eva       | Brown    | 33  | Germany | Standard       | false             | false     |
    Then all user accounts should be created successfully
    And each user should have the correct profile information
    And membership types should be assigned appropriately
    And notification preferences should be saved correctly
    And welcome emails should be sent to users who opted in

  Scenario: Order Processing with Complex Product Collections
    Given I am processing bulk orders
    When I create orders with the following product combinations:
      | orderNumber | customerEmail           | productName                | quantity | unitPrice | discount | shippingMethod | priority |
      | ORD-2024-001 | alice.johnson@email.com | Premium Wireless Mouse     | 2        | 79.99     | 10%      | Express        | High     |
      | ORD-2024-001 | alice.johnson@email.com | Gaming Mechanical Keyboard | 1        | 129.99    | 15%      | Express        | High     |
      | ORD-2024-002 | bob.smith@email.com     | USB-C Hub Multi-Port       | 3        | 45.50     | 0%       | Standard       | Normal   |
      | ORD-2024-003 | carol.davis@email.com   | Bluetooth Headphones       | 1        | 159.99    | 20%      | Premium        | High     |
      | ORD-2024-003 | carol.davis@email.com   | Wireless Charging Pad      | 2        | 39.99     | 5%       | Premium        | High     |
    Then all orders should be processed correctly
    And order totals should be calculated with discounts applied
    And shipping methods should be assigned appropriately
    And inventory should be decremented correctly
    And order confirmations should be sent to customers
```

### **Task A1: Implement Horizontal Data Table Processing**

Create comprehensive step definitions for processing horizontal data tables:

```typescript
// support/step-definitions/data-table-mastery.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../world';

// Interfaces for type safety
interface ProductData {
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  brand: string;
  featured: boolean;
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  country: string;
  membershipType: string;
  emailNotifications: boolean;
  smsAlerts: boolean;
}

interface OrderItemData {
  orderNumber: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: string;
  shippingMethod: string;
  priority: string;
}

// Horizontal data table processing
When('I create multiple products with the following details:', 
  async function (this: CustomWorld, dataTable: DataTable) {
    // TODO: Implement bulk product creation
    // Requirements:
    // 1. Convert DataTable to array of ProductData objects
    // 2. Validate each product's data before processing
    // 3. Handle type conversions (string to number, string to boolean)
    // 4. Process products individually with error handling
    // 5. Store results for verification
    // 6. Update UI to reflect new products
    
    const products: ProductData[] = dataTable.hashes().map(row => ({
      name: this.sanitizeStringInput(row.name),
      category: this.sanitizeStringInput(row.category),
      price: parseFloat(row.price),
      stock: parseInt(row.stock, 10),
      rating: parseFloat(row.rating),
      brand: this.sanitizeStringInput(row.brand),
      featured: this.convertToBoolean(row.featured)
    }));
    
    // Validate products before processing
    for (const product of products) {
      this.validateProductData(product);
    }
    
    // Store for verification
    this.testData.createdProducts = products;
    
    console.log(`Processing ${products.length} products for bulk creation`);
    // TODO: Implement actual product creation logic
  }
);

When('I register multiple users with the following information:', 
  async function (this: CustomWorld, dataTable: DataTable) {
    // TODO: Implement bulk user registration
    // Requirements:
    // 1. Convert DataTable to UserData objects with validation
    // 2. Validate email formats and required fields
    // 3. Check for duplicate email addresses
    // 4. Process age and membership type validation
    // 5. Handle boolean conversion for notification preferences
    // 6. Store user data for verification
    
    const users: UserData[] = dataTable.hashes().map(row => ({
      email: this.validateEmailFormat(row.email),
      firstName: this.sanitizeStringInput(row.firstName),
      lastName: this.sanitizeStringInput(row.lastName),
      age: this.validateAndParseInteger(row.age, 'age'),
      country: this.sanitizeStringInput(row.country),
      membershipType: this.validateMembershipType(row.membershipType),
      emailNotifications: this.convertToBoolean(row.emailNotifications),
      smsAlerts: this.convertToBoolean(row.smsAlerts)
    }));
    
    // Validate for duplicates
    const emails = users.map(u => u.email);
    const duplicates = emails.filter((email, index) => emails.indexOf(email) !== index);
    if (duplicates.length > 0) {
      throw new Error(`Duplicate email addresses found: ${duplicates.join(', ')}`);
    }
    
    this.testData.registeredUsers = users;
    console.log(`Processing ${users.length} users for bulk registration`);
  }
);

When('I create orders with the following product combinations:', 
  async function (this: CustomWorld, dataTable: DataTable) {
    // TODO: Implement complex order processing
    // Requirements:
    // 1. Group order items by orderNumber
    // 2. Calculate totals with discount processing
    // 3. Validate shipping methods and priorities
    // 4. Process quantity and pricing validations
    // 5. Handle percentage discount conversion
    // 6. Store order data for verification
    
    const orderItems: OrderItemData[] = dataTable.hashes().map(row => ({
      orderNumber: this.sanitizeStringInput(row.orderNumber),
      customerEmail: this.validateEmailFormat(row.customerEmail),
      productName: this.sanitizeStringInput(row.productName),
      quantity: this.validateAndParseInteger(row.quantity, 'quantity'),
      unitPrice: parseFloat(row.unitPrice),
      discount: row.discount,
      shippingMethod: this.validateShippingMethod(row.shippingMethod),
      priority: this.validatePriority(row.priority)
    }));
    
    // Group by order number
    const orderGroups = this.groupOrderItemsByOrderNumber(orderItems);
    
    // Process each order
    this.testData.processedOrders = orderGroups;
    console.log(`Processing ${Object.keys(orderGroups).length} orders with ${orderItems.length} total items`);
  }
);
```

---

## Part B: Vertical Data Tables (Key-Value Pairs)

### **Feature File: Configuration and Profile Management**

```gherkin
  Scenario: User Profile Configuration with Vertical Data Tables
    Given I am creating a comprehensive user profile
    When I configure the user profile with the following settings:
      | Field                  | Value                    |
      | Email                  | premium.user@email.com   |
      | First Name             | Premium                  |
      | Last Name              | User                     |
      | Date of Birth          | 1985-06-15               |
      | Phone Number           | +1-555-0123              |
      | Address Line 1         | 123 Main Street          |
      | Address Line 2         | Apartment 4B             |
      | City                   | New York                 |
      | State                  | NY                       |
      | Zip Code               | 10001                    |
      | Country                | United States            |
      | Membership Type        | Premium                  |
      | Account Status         | Active                   |
      | Email Notifications    | Enabled                  |
      | SMS Alerts             | Disabled                 |
      | Marketing Emails       | Enabled                  |
      | Newsletter Subscription| Enabled                  |
      | Two-Factor Auth        | Enabled                  |
      | Privacy Level          | Standard                 |
      | Preferred Language     | English                  |
      | Timezone               | America/New_York         |
      | Currency Preference    | USD                      |
    Then the user profile should be created with all specified settings
    And all preferences should be saved correctly
    And the profile should be validated for completeness

  Scenario: Product Configuration with Complex Attributes
    Given I am configuring a new product listing
    When I set up the product with the following specifications:
      | Attribute              | Value                           |
      | Product Name           | Professional Gaming Monitor     |
      | SKU                    | MONITOR-GAME-PRO-001           |
      | Category               | Electronics > Monitors         |
      | Subcategory            | Gaming Monitors                 |
      | Brand                  | DisplayMaster                   |
      | Model Number           | DM-GAME-27-144                  |
      | Base Price             | 399.99                          |
      | Sale Price             | 349.99                          |
      | Cost                   | 200.00                          |
      | Weight                 | 8.5                             |
      | Dimensions             | 24.1 x 21.4 x 7.9 inches       |
      | Screen Size            | 27 inches                       |
      | Resolution             | 2560 x 1440                     |
      | Refresh Rate           | 144Hz                           |
      | Panel Type             | IPS                             |
      | Response Time          | 1ms                             |
      | Connectivity           | HDMI, DisplayPort, USB-C       |
      | Features               | G-Sync, HDR10, Blue Light Filter |
      | Warranty Period        | 3 years                         |
      | Stock Quantity         | 50                              |
      | Minimum Stock Level    | 10                              |
      | Supplier               | TechDistributor Inc             |
      | Lead Time              | 7 days                          |
      | Shipping Class         | Standard                        |
      | Tax Category           | Electronics                     |
      | Featured Product       | Yes                             |
      | Publish Status         | Active                          |
      | SEO Title              | Professional Gaming Monitor 27" 144Hz |
      | SEO Description        | High-performance gaming monitor with 144Hz refresh rate |
      | Tags                   | gaming, monitor, 27-inch, 144hz, ips |
    Then the product should be configured with all specifications
    And pricing information should be validated
    And inventory settings should be applied
    And SEO metadata should be set correctly
```

### **Task B1: Implement Vertical Data Table Processing**

Create step definitions for key-value pair data processing:

```typescript
// Interfaces for vertical data processing
interface ProfileConfiguration {
  [key: string]: string | number | boolean | Date;
}

interface ProductConfiguration {
  [key: string]: string | number | boolean | string[];
}

// Vertical data table processing
When('I configure the user profile with the following settings:', 
  async function (this: CustomWorld, dataTable: DataTable) {
    // TODO: Implement profile configuration from vertical data table
    // Requirements:
    // 1. Convert vertical DataTable to key-value object
    // 2. Apply field-specific validation and transformation
    // 3. Handle different data types (dates, booleans, numbers)
    // 4. Validate required fields and formats
    // 5. Store configuration for verification
    
    const profileData: ProfileConfiguration = {};
    const rows = dataTable.raw();
    
    for (const [field, value] of rows) {
      const normalizedField = this.normalizeFieldName(field);
      profileData[normalizedField] = this.convertProfileFieldValue(field, value);
    }
    
    // Validate profile completeness
    this.validateProfileConfiguration(profileData);
    
    this.testData.profileConfiguration = profileData;
    console.log(`Configured user profile with ${Object.keys(profileData).length} settings`);
  }
);

When('I set up the product with the following specifications:', 
  async function (this: CustomWorld, dataTable: DataTable) {
    // TODO: Implement product configuration from vertical data table
    // Requirements:
    // 1. Process complex product attributes with validation
    // 2. Handle nested categories and specifications
    // 3. Parse arrays from comma-separated values
    // 4. Validate pricing and inventory data
    // 5. Process SEO and metadata fields
    
    const productConfig: ProductConfiguration = {};
    const rows = dataTable.raw();
    
    for (const [attribute, value] of rows) {
      const normalizedAttribute = this.normalizeFieldName(attribute);
      productConfig[normalizedAttribute] = this.convertProductAttributeValue(attribute, value);
    }
    
    // Validate product configuration
    this.validateProductConfiguration(productConfig);
    
    this.testData.productConfiguration = productConfig;
    console.log(`Configured product with ${Object.keys(productConfig).length} specifications`);
  }
);
```

---

## Part C: Advanced Data Processing Utilities

### **Task C1: Implement Comprehensive Data Processing Utilities**

Create advanced helper methods for data table processing:

```typescript
// Add to CustomWorld class
declare module './world' {
  interface CustomWorld {
    validateProductData(product: ProductData): void;
    validateEmailFormat(email: string): string;
    validateMembershipType(type: string): string;
    validateShippingMethod(method: string): string;
    validatePriority(priority: string): string;
    groupOrderItemsByOrderNumber(items: OrderItemData[]): Record<string, OrderItemData[]>;
    normalizeFieldName(field: string): string;
    convertProfileFieldValue(field: string, value: string): any;
    convertProductAttributeValue(attribute: string, value: string): any;
    validateProfileConfiguration(config: ProfileConfiguration): void;
    validateProductConfiguration(config: ProductConfiguration): void;
    getNestedValue(obj: any, path: string): any;
  }
}

// Implementation of data processing utilities
CustomWorld.prototype.validateProductData = function(product: ProductData): void {
  // TODO: Implement product data validation
  // Requirements:
  // 1. Validate price is positive
  // 2. Check stock is non-negative integer
  // 3. Validate rating is between 0 and 5
  // 4. Check name and brand are not empty
  // 5. Validate category exists in system
  
  if (product.price <= 0) {
    throw new Error(`Product price must be positive. Got: ${product.price}`);
  }
  
  if (product.stock < 0) {
    throw new Error(`Product stock must be non-negative. Got: ${product.stock}`);
  }
  
  if (product.rating < 0 || product.rating > 5) {
    throw new Error(`Product rating must be between 0 and 5. Got: ${product.rating}`);
  }
  
  if (!product.name.trim()) {
    throw new Error('Product name cannot be empty');
  }
  
  if (!product.brand.trim()) {
    throw new Error('Product brand cannot be empty');
  }
};

CustomWorld.prototype.validateEmailFormat = function(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }
  
  return email.toLowerCase().trim();
};

CustomWorld.prototype.validateMembershipType = function(type: string): string {
  const validTypes = ['Standard', 'Premium', 'Gold', 'Platinum'];
  
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid membership type: ${type}. Valid types: ${validTypes.join(', ')}`);
  }
  
  return type;
};

CustomWorld.prototype.validateShippingMethod = function(method: string): string {
  const validMethods = ['Standard', 'Express', 'Premium', 'Overnight'];
  
  if (!validMethods.includes(method)) {
    throw new Error(`Invalid shipping method: ${method}. Valid methods: ${validMethods.join(', ')}`);
  }
  
  return method;
};

CustomWorld.prototype.validatePriority = function(priority: string): string {
  const validPriorities = ['Low', 'Normal', 'High', 'Urgent'];
  
  if (!validPriorities.includes(priority)) {
    throw new Error(`Invalid priority: ${priority}. Valid priorities: ${validPriorities.join(', ')}`);
  }
  
  return priority;
};

CustomWorld.prototype.groupOrderItemsByOrderNumber = function(items: OrderItemData[]): Record<string, OrderItemData[]> {
  return items.reduce((groups, item) => {
    if (!groups[item.orderNumber]) {
      groups[item.orderNumber] = [];
    }
    groups[item.orderNumber].push(item);
    return groups;
  }, {} as Record<string, OrderItemData[]>);
};

CustomWorld.prototype.normalizeFieldName = function(field: string): string {
  return field
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

CustomWorld.prototype.convertProfileFieldValue = function(field: string, value: string): any {
  // TODO: Implement field-specific value conversion
  // Requirements:
  // 1. Convert dates to Date objects
  // 2. Convert boolean text to boolean values
  // 3. Parse numeric values appropriately
  // 4. Handle special field types
  
  const lowerField = field.toLowerCase();
  
  if (lowerField.includes('date') || lowerField.includes('birth')) {
    return new Date(value);
  }
  
  if (lowerField.includes('age') || lowerField.includes('zip')) {
    return parseInt(value, 10);
  }
  
  if (lowerField.includes('notification') || lowerField.includes('alert') || 
      lowerField.includes('subscription') || lowerField.includes('auth')) {
    return this.convertToBoolean(value);
  }
  
  return this.sanitizeStringInput(value);
};

CustomWorld.prototype.convertProductAttributeValue = function(attribute: string, value: string): any {
  const lowerAttribute = attribute.toLowerCase();
  
  if (lowerAttribute.includes('price') || lowerAttribute.includes('cost') || lowerAttribute.includes('weight')) {
    return parseFloat(value);
  }
  
  if (lowerAttribute.includes('quantity') || lowerAttribute.includes('stock') || 
      lowerAttribute.includes('period') || lowerAttribute.includes('time')) {
    return parseInt(value, 10);
  }
  
  if (lowerAttribute.includes('featured') || lowerAttribute === 'publish status') {
    return this.convertToBoolean(value);
  }
  
  if (lowerAttribute.includes('tags') || lowerAttribute.includes('features') || 
      lowerAttribute.includes('connectivity')) {
    return value.split(',').map(item => item.trim());
  }
  
  return this.sanitizeStringInput(value);
};

CustomWorld.prototype.validateProfileConfiguration = function(config: ProfileConfiguration): void {
  const requiredFields = ['email', 'first_name', 'last_name', 'membership_type'];
  
  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Required profile field missing: ${field}`);
    }
  }
};

CustomWorld.prototype.validateProductConfiguration = function(config: ProductConfiguration): void {
  const requiredFields = ['product_name', 'sku', 'category', 'base_price'];
  
  for (const field of requiredFields) {
    if (config[field] === undefined || config[field] === null) {
      throw new Error(`Required product field missing: ${field}`);
    }
  }
};

CustomWorld.prototype.getNestedValue = function(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};
```

---

## Part D: Verification and Error Handling

### **Task D1: Implement Comprehensive Verification Steps**

Create detailed verification step definitions:

```typescript
// Verification step definitions for data tables
Then('all products should be created successfully', 
  async function (this: CustomWorld) {
    // TODO: Verify product creation success
    const products = this.testData.createdProducts;
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
    
    for (const product of products) {
      // Verify each product was processed correctly
      console.log(`✓ Product created: ${product.name} - $${product.price}`);
    }
  }
);

Then('each product should have the correct attributes', 
  async function (this: CustomWorld) {
    // TODO: Verify product attribute accuracy
    const products = this.testData.createdProducts;
    
    for (const product of products) {
      expect(product.name).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
      expect(typeof product.featured).toBe('boolean');
    }
    
    console.log('✓ All product attributes validated successfully');
  }
);

Then('all user accounts should be created successfully', 
  async function (this: CustomWorld) {
    // TODO: Verify user account creation
    const users = this.testData.registeredUsers;
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
    
    console.log(`✓ ${users.length} user accounts created successfully`);
  }
);

Then('all orders should be processed correctly', 
  async function (this: CustomWorld) {
    // TODO: Verify order processing
    const orders = this.testData.processedOrders;
    expect(orders).toBeDefined();
    expect(Object.keys(orders).length).toBeGreaterThan(0);
    
    console.log(`✓ ${Object.keys(orders).length} orders processed successfully`);
  }
);

Then('the user profile should be created with all specified settings', 
  async function (this: CustomWorld) {
    // TODO: Verify profile configuration
    const profile = this.testData.profileConfiguration;
    expect(profile).toBeDefined();
    expect(Object.keys(profile).length).toBeGreaterThan(0);
    
    console.log(`✓ User profile created with ${Object.keys(profile).length} settings`);
  }
);

Then('the product should be configured with all specifications', 
  async function (this: CustomWorld) {
    // TODO: Verify product configuration
    const productConfig = this.testData.productConfiguration;
    expect(productConfig).toBeDefined();
    expect(Object.keys(productConfig).length).toBeGreaterThan(0);
    
    console.log(`✓ Product configured with ${Object.keys(productConfig).length} specifications`);
  }
);
```

---

## Success Criteria

### **Completion Requirements**

To successfully complete this lab, your implementation must:

1. **Horizontal Data Table Processing**:
   - ✅ Convert DataTable.hashes() to strongly-typed objects
   - ✅ Handle bulk operations with proper validation
   - ✅ Process complex data transformations accurately
   - ✅ Implement error handling for invalid data

2. **Vertical Data Table Processing**:
   - ✅ Convert DataTable.raw() to key-value configurations
   - ✅ Apply field-specific validation and transformation
   - ✅ Handle different data types correctly
   - ✅ Process nested and complex attribute structures

3. **Data Validation and Type Safety**:
   - ✅ Implement comprehensive validation for all data types
   - ✅ Use TypeScript interfaces effectively
   - ✅ Handle edge cases and boundary conditions
   - ✅ Provide meaningful error messages

4. **Utility Functions**:
   - ✅ Create reusable data processing utilities
   - ✅ Implement field normalization and conversion
   - ✅ Handle different data formats consistently
   - ✅ Support extensible configuration processing

---

## Extension Challenges

### **Advanced Tasks** (Optional)

1. **Dynamic Schema Validation**: Create configurable validation rules for data tables
2. **Data Transformation Pipelines**: Implement chained data processing operations
3. **Batch Processing with Error Recovery**: Handle partial failures gracefully
4. **Data Export and Import**: Support bidirectional data table operations
5. **Performance Optimization**: Optimize for large data table processing

---

**Next Exercise**: [Content Processing Challenge](./03-content-processing-challenge.md) - Master doc strings and multi-line content handling.