# Example 02: Data Tables and Structured Data

## Overview

This example demonstrates how to handle complex structured data using Cucumber data tables. You'll learn to process both horizontal and vertical data tables, implement type-safe transformations, and handle dynamic data processing for sophisticated BDD scenarios.

### **Learning Focus**
- Process horizontal data tables with multiple rows of structured data
- Handle vertical data tables for key-value pair scenarios  
- Implement type-safe data table transformations with TypeScript
- Apply dynamic data processing based on table headers
- Create robust validation and error handling for complex data structures

---

## Scenario: Product Catalog and User Management

### **Feature File: Data Table Processing**

```gherkin
# features/data-tables-structured-data.feature
Feature: Data Tables and Structured Data Processing
  As a test automation engineer
  I want to handle complex structured data through data tables
  So that I can test scenarios with rich data sets while maintaining readability

  Background:
    Given the e-commerce application is running
    And I have administrative access
    And the product catalog is empty
    And the user database is clean

  Scenario: Product Catalog Bulk Import
    Given I am on the product management page
    When I bulk import the following products:
      | name           | price  | category    | inStock | rating | tags              | description                    |
      | Laptop Pro     | 1299   | Electronics | true    | 4.5    | portable,business | High-performance business laptop |
      | Wireless Mouse | 49.99  | Electronics | true    | 4.2    | wireless,ergonomic| Ergonomic wireless mouse        |
      | Coffee Mug     | 15.95  | Kitchen     | false   | 4.8    | ceramic,gift      | Premium ceramic coffee mug      |
      | Yoga Mat       | 89.00  | Sports      | true    | 4.7    | fitness,portable  | Professional yoga mat           |
      | Smartphone     | 899.99 | Electronics | true    | 4.3    | mobile,5g         | Latest 5G smartphone            |
    Then I should see 5 products in the catalog
    And all products should be properly categorized
    And the average product rating should be calculated correctly

  Scenario: User Profile Creation with Detailed Information
    Given I am on the user management page
    When I create a user profile with the following details:
      | Field            | Value                    |
      | firstName        | John                     |
      | lastName         | Doe                      |
      | email            | john.doe@example.com     |
      | age              | 30                       |
      | isActive         | true                     |
      | membershipLevel  | premium                  |
      | joinDate         | 2024-01-15               |
      | preferences      | {"theme": "dark", "notifications": true} |
      | address          | 123 Main St, City, State|
      | phoneNumber      | +1-555-123-4567          |
    Then I should see the user profile created successfully
    And the user should have premium membership status
    And all profile fields should be correctly populated

  Scenario: Order Processing with Multiple Items
    Given I am on the order management page
    When I process an order with the following items:
      | productName    | quantity | unitPrice | discount | taxRate | specialInstructions    |
      | Laptop Pro     | 2        | 1299.00   | 10.0     | 8.25    | Gift wrap requested    |
      | Wireless Mouse | 3        | 49.99     | 5.0      | 8.25    | Express shipping       |
      | Coffee Mug     | 1        | 15.95     | 0.0      | 8.25    | Handle with care       |
    Then the order total should be calculated correctly
    And tax should be applied to each item
    And discounts should be properly reflected
    And special instructions should be preserved

  Scenario: Dynamic Configuration Updates
    Given I am on the system configuration page
    When I update the following configuration settings:
      | settingName          | settingValue | settingType | requiresRestart |
      | maxUploadSize        | 50MB         | string      | false          |
      | sessionTimeout       | 3600         | number      | true           |
      | enableDebugMode      | false        | boolean     | true           |
      | supportedLanguages   | en,es,fr,de  | array       | false          |
      | maintenanceWindow    | 02:00-04:00  | string      | false          |
    Then all configuration settings should be updated
    And settings requiring restart should be flagged
    And the system should validate setting types correctly

  Scenario: User Permissions Matrix
    Given I am configuring user permissions
    When I set up the following permission matrix:
      | userRole  | canRead | canWrite | canDelete | canAdmin | modules                    |
      | admin     | true    | true     | true      | true     | users,products,orders,config |
      | manager   | true    | true     | false     | false    | products,orders             |
      | employee  | true    | false    | false     | false    | products                    |
      | customer  | true    | false    | false     | false    | profile                     |
    Then the permission matrix should be applied correctly
    And role-based access should be enforced
    And each user role should have appropriate module access

  Scenario: Performance Metrics Validation
    Given I am monitoring system performance
    When I record the following performance metrics:
      | metric        | value | unit  | threshold | status | timestamp           |
      | responseTime  | 150   | ms    | 200       | good   | 2024-01-15T10:30:00Z |
      | cpuUsage      | 65    | %     | 80        | good   | 2024-01-15T10:30:00Z |
      | memoryUsage   | 85    | %     | 90        | warning| 2024-01-15T10:30:00Z |
      | diskUsage     | 45    | %     | 80        | good   | 2024-01-15T10:30:00Z |
      | networkLatency| 25    | ms    | 50        | good   | 2024-01-15T10:30:00Z |
    Then all metrics should be recorded in the monitoring system
    And alerts should be triggered for metrics exceeding thresholds
    And performance trends should be calculated
```

---

## Step Definitions: Type-Safe Data Processing

### **Product Catalog Management**

```typescript
// support/step-definitions/data-tables.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../world';

// Product interface for type safety
interface Product {
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  rating: number;
  tags: string[];
  description: string;
}

// Horizontal data table processing
When('I bulk import the following products:', async function (this: CustomWorld, dataTable: DataTable) {
  // Convert data table to typed objects
  const productRows = dataTable.hashes();
  const products: Product[] = [];
  
  for (const row of productRows) {
    try {
      // Type-safe conversion with validation
      const product: Product = {
        name: row.name?.trim() || '',
        price: parseFloat(row.price || '0'),
        category: row.category?.trim() || '',
        inStock: row.inStock === 'true',
        rating: parseFloat(row.rating || '0'),
        tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
        description: row.description?.trim() || ''
      };
      
      // Validate required fields
      if (!product.name) {
        throw new Error('Product name is required');
      }
      
      if (product.price < 0) {
        throw new Error(`Product price cannot be negative: ${product.price}`);
      }
      
      if (product.rating < 0 || product.rating > 5) {
        throw new Error(`Product rating must be between 0 and 5: ${product.rating}`);
      }
      
      products.push(product);
      
    } catch (error) {
      throw new Error(`Error processing product "${row.name}": ${error.message}`);
    }
  }
  
  // Store products for verification
  this.testData.importedProducts = products;
  
  // Simulate bulk import process
  for (const product of products) {
    await this.productService.createProduct(product);
    
    // Add visual feedback during import
    console.log(`✓ Imported product: ${product.name} - $${product.price} (${product.category})`);
  }
  
  console.log(`✓ Successfully imported ${products.length} products`);
});

// Verification of imported products
Then('I should see {int} products in the catalog', async function (this: CustomWorld, expectedCount: number) {
  // Wait for products to be loaded
  await this.page!.waitForSelector('[data-testid="product-catalog"]');
  
  // Count visible products
  const actualCount = await this.page!.locator('[data-testid="product-item"]').count();
  expect(actualCount).toBe(expectedCount);
  
  // Verify against stored test data
  expect(this.testData.importedProducts?.length).toBe(expectedCount);
  
  console.log(`✓ Verified ${expectedCount} products in catalog`);
});

Then('all products should be properly categorized', async function (this: CustomWorld) {
  const products = this.testData.importedProducts as Product[];
  
  // Group products by category for verification
  const categoryGroups = products.reduce((groups, product) => {
    if (!groups[product.category]) {
      groups[product.category] = [];
    }
    groups[product.category].push(product);
    return groups;
  }, {} as Record<string, Product[]>);
  
  // Verify each category in the UI
  for (const [category, categoryProducts] of Object.entries(categoryGroups)) {
    await this.page!.click(`[data-testid="category-${category.toLowerCase()}"]`);
    
    const visibleProducts = await this.page!.locator('[data-testid="product-item"]').count();
    expect(visibleProducts).toBe(categoryProducts.length);
    
    console.log(`✓ Category "${category}" contains ${categoryProducts.length} products`);
  }
});

Then('the average product rating should be calculated correctly', async function (this: CustomWorld) {
  const products = this.testData.importedProducts as Product[];
  
  // Calculate expected average rating
  const totalRating = products.reduce((sum, product) => sum + product.rating, 0);
  const expectedAverage = Math.round((totalRating / products.length) * 10) / 10;
  
  // Verify displayed average in UI
  const displayedAverage = await this.page!.locator('[data-testid="average-rating"]').textContent();
  const actualAverage = parseFloat(displayedAverage || '0');
  
  expect(actualAverage).toBe(expectedAverage);
  
  console.log(`✓ Average rating calculated correctly: ${expectedAverage}`);
});
```

### **Vertical Data Table Processing**

```typescript
// User profile interface
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  isActive: boolean;
  membershipLevel: 'basic' | 'premium' | 'enterprise';
  joinDate: Date;
  preferences: Record<string, any>;
  address: string;
  phoneNumber: string;
}

// Vertical data table (key-value pairs)
When('I create a user profile with the following details:', async function (this: CustomWorld, dataTable: DataTable) {
  // Convert vertical table to object
  const userData = dataTable.rowsHash();
  
  try {
    // Type-safe conversion with comprehensive validation
    const userProfile: UserProfile = {
      firstName: userData.firstName?.trim() || '',
      lastName: userData.lastName?.trim() || '',
      email: userData.email?.trim() || '',
      age: parseInt(userData.age || '0'),
      isActive: userData.isActive === 'true',
      membershipLevel: userData.membershipLevel as 'basic' | 'premium' | 'enterprise',
      joinDate: new Date(userData.joinDate || Date.now()),
      preferences: userData.preferences ? JSON.parse(userData.preferences) : {},
      address: userData.address?.trim() || '',
      phoneNumber: userData.phoneNumber?.trim() || ''
    };
    
    // Comprehensive validation
    const validationErrors: string[] = [];
    
    if (!userProfile.firstName) {
      validationErrors.push('First name is required');
    }
    
    if (!userProfile.lastName) {
      validationErrors.push('Last name is required');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userProfile.email)) {
      validationErrors.push(`Invalid email format: ${userProfile.email}`);
    }
    
    // Age validation
    if (userProfile.age < 0 || userProfile.age > 150) {
      validationErrors.push(`Invalid age: ${userProfile.age}`);
    }
    
    // Membership level validation
    const validLevels = ['basic', 'premium', 'enterprise'];
    if (!validLevels.includes(userProfile.membershipLevel)) {
      validationErrors.push(`Invalid membership level: ${userProfile.membershipLevel}`);
    }
    
    // Phone number validation
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(userProfile.phoneNumber)) {
      validationErrors.push(`Invalid phone number format: ${userProfile.phoneNumber}`);
    }
    
    if (validationErrors.length > 0) {
      throw new Error(`User profile validation failed:\n${validationErrors.join('\n')}`);
    }
    
    // Store for later verification
    this.testData.createdUserProfile = userProfile;
    
    // Fill form fields
    await this.page!.fill('[data-testid="first-name"]', userProfile.firstName);
    await this.page!.fill('[data-testid="last-name"]', userProfile.lastName);
    await this.page!.fill('[data-testid="email"]', userProfile.email);
    await this.page!.fill('[data-testid="age"]', userProfile.age.toString());
    await this.page!.selectOption('[data-testid="membership-level"]', userProfile.membershipLevel);
    await this.page!.fill('[data-testid="address"]', userProfile.address);
    await this.page!.fill('[data-testid="phone"]', userProfile.phoneNumber);
    
    // Handle preferences (JSON data)
    if (Object.keys(userProfile.preferences).length > 0) {
      for (const [key, value] of Object.entries(userProfile.preferences)) {
        await this.page!.locator(`[data-testid="pref-${key}"]`).fill(String(value));
      }
    }
    
    // Set active status
    if (userProfile.isActive) {
      await this.page!.check('[data-testid="is-active"]');
    } else {
      await this.page!.uncheck('[data-testid="is-active"]');
    }
    
    // Submit form
    await this.page!.click('[data-testid="create-user"]');
    
    console.log(`✓ User profile created: ${userProfile.firstName} ${userProfile.lastName} (${userProfile.email})`);
    
  } catch (error) {
    throw new Error(`Failed to create user profile: ${error.message}`);
  }
});

// Profile verification
Then('I should see the user profile created successfully', async function (this: CustomWorld) {
  // Wait for success message
  await this.page!.waitForSelector('[data-testid="user-created-success"]');
  
  const userProfile = this.testData.createdUserProfile as UserProfile;
  
  // Verify profile data in UI
  const displayedName = await this.page!.locator('[data-testid="user-full-name"]').textContent();
  expect(displayedName).toBe(`${userProfile.firstName} ${userProfile.lastName}`);
  
  const displayedEmail = await this.page!.locator('[data-testid="user-email"]').textContent();
  expect(displayedEmail).toBe(userProfile.email);
  
  console.log(`✓ User profile verified: ${displayedName}`);
});

Then('the user should have {string} membership status', async function (this: CustomWorld, expectedLevel: string) {
  const displayedLevel = await this.page!.locator('[data-testid="membership-level"]').textContent();
  expect(displayedLevel?.toLowerCase()).toBe(expectedLevel.toLowerCase());
  
  // Verify against stored data
  const userProfile = this.testData.createdUserProfile as UserProfile;
  expect(userProfile.membershipLevel).toBe(expectedLevel);
  
  console.log(`✓ Membership level verified: ${expectedLevel}`);
});
```

### **Dynamic Data Processing**

```typescript
// Configuration interface for dynamic processing
interface ConfigSetting {
  settingName: string;
  settingValue: string;
  settingType: 'string' | 'number' | 'boolean' | 'array';
  requiresRestart: boolean;
}

// Dynamic configuration processing
When('I update the following configuration settings:', async function (this: CustomWorld, dataTable: DataTable) {
  const settingRows = dataTable.hashes();
  const configSettings: ConfigSetting[] = [];
  
  for (const row of settingRows) {
    const setting: ConfigSetting = {
      settingName: row.settingName,
      settingValue: row.settingValue,
      settingType: row.settingType as 'string' | 'number' | 'boolean' | 'array',
      requiresRestart: row.requiresRestart === 'true'
    };
    
    // Type validation and conversion
    let processedValue: any = setting.settingValue;
    
    switch (setting.settingType) {
      case 'number':
        processedValue = parseFloat(setting.settingValue);
        if (isNaN(processedValue)) {
          throw new Error(`Invalid number value for ${setting.settingName}: ${setting.settingValue}`);
        }
        break;
        
      case 'boolean':
        processedValue = setting.settingValue.toLowerCase() === 'true';
        break;
        
      case 'array':
        processedValue = setting.settingValue.split(',').map(item => item.trim());
        break;
        
      case 'string':
      default:
        processedValue = setting.settingValue;
        break;
    }
    
    // Apply configuration setting
    await this.configService.updateSetting(setting.settingName, processedValue);
    
    configSettings.push(setting);
    
    console.log(`✓ Updated setting: ${setting.settingName} = ${processedValue} (${setting.settingType})`);
  }
  
  this.testData.configSettings = configSettings;
});

// Configuration verification
Then('all configuration settings should be updated', async function (this: CustomWorld) {
  const settings = this.testData.configSettings as ConfigSetting[];
  
  for (const setting of settings) {
    // Verify setting in the configuration interface
    const settingRow = this.page!.locator(`[data-testid="setting-${setting.settingName}"]`);
    await expect(settingRow).toBeVisible();
    
    const displayedValue = await settingRow.locator('[data-testid="setting-value"]').textContent();
    expect(displayedValue).toBe(setting.settingValue);
    
    console.log(`✓ Verified setting: ${setting.settingName} = ${displayedValue}`);
  }
});

Then('settings requiring restart should be flagged', async function (this: CustomWorld) {
  const settings = this.testData.configSettings as ConfigSetting[];
  const restartRequiredSettings = settings.filter(s => s.requiresRestart);
  
  if (restartRequiredSettings.length > 0) {
    // Verify restart notification is shown
    await expect(this.page!.locator('[data-testid="restart-required-notification"]')).toBeVisible();
    
    // Verify specific settings are flagged
    for (const setting of restartRequiredSettings) {
      const settingRow = this.page!.locator(`[data-testid="setting-${setting.settingName}"]`);
      await expect(settingRow.locator('[data-testid="restart-flag"]')).toBeVisible();
    }
    
    console.log(`✓ ${restartRequiredSettings.length} settings flagged for restart`);
  }
});
```

### **Complex Order Processing**

```typescript
// Order item interface
interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  specialInstructions: string;
  lineTotal: number;
  discountAmount: number;
  taxAmount: number;
  finalTotal: number;
}

// Order processing with calculations
When('I process an order with the following items:', async function (this: CustomWorld, dataTable: DataTable) {
  const itemRows = dataTable.hashes();
  const orderItems: OrderItem[] = [];
  let orderTotal = 0;
  
  for (const row of itemRows) {
    const item: OrderItem = {
      productName: row.productName,
      quantity: parseInt(row.quantity),
      unitPrice: parseFloat(row.unitPrice),
      discount: parseFloat(row.discount || '0'),
      taxRate: parseFloat(row.taxRate) / 100, // Convert percentage to decimal
      specialInstructions: row.specialInstructions || '',
      lineTotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      finalTotal: 0
    };
    
    // Calculate line totals
    item.lineTotal = item.quantity * item.unitPrice;
    item.discountAmount = item.lineTotal * (item.discount / 100);
    const afterDiscount = item.lineTotal - item.discountAmount;
    item.taxAmount = afterDiscount * item.taxRate;
    item.finalTotal = afterDiscount + item.taxAmount;
    
    orderTotal += item.finalTotal;
    orderItems.push(item);
    
    // Add item to order in UI
    await this.page!.click('[data-testid="add-order-item"]');
    await this.page!.fill('[data-testid="product-name"]', item.productName);
    await this.page!.fill('[data-testid="quantity"]', item.quantity.toString());
    await this.page!.fill('[data-testid="unit-price"]', item.unitPrice.toString());
    
    if (item.discount > 0) {
      await this.page!.fill('[data-testid="discount"]', item.discount.toString());
    }
    
    if (item.specialInstructions) {
      await this.page!.fill('[data-testid="special-instructions"]', item.specialInstructions);
    }
    
    await this.page!.click('[data-testid="confirm-item"]');
    
    console.log(`✓ Added item: ${item.productName} (${item.quantity} × $${item.unitPrice}) = $${item.finalTotal.toFixed(2)}`);
  }
  
  // Store order data for verification
  this.testData.orderItems = orderItems;
  this.testData.calculatedOrderTotal = orderTotal;
  
  // Process the order
  await this.page!.click('[data-testid="process-order"]');
  
  console.log(`✓ Order processed with ${orderItems.length} items, total: $${orderTotal.toFixed(2)}`);
});

// Order total verification
Then('the order total should be calculated correctly', async function (this: CustomWorld) {
  const expectedTotal = this.testData.calculatedOrderTotal as number;
  
  // Wait for order total to be calculated and displayed
  await this.page!.waitForSelector('[data-testid="order-total"]');
  
  const displayedTotal = await this.page!.locator('[data-testid="order-total"]').textContent();
  const actualTotal = parseFloat(displayedTotal?.replace(/[$,]/g, '') || '0');
  
  // Allow for small rounding differences
  const tolerance = 0.01;
  expect(Math.abs(actualTotal - expectedTotal)).toBeLessThan(tolerance);
  
  console.log(`✓ Order total verified: $${actualTotal.toFixed(2)} (expected: $${expectedTotal.toFixed(2)})`);
});

Then('tax should be applied to each item', async function (this: CustomWorld) {
  const orderItems = this.testData.orderItems as OrderItem[];
  
  for (const item of orderItems) {
    // Verify tax calculation is shown for each item
    const itemRow = this.page!.locator(`[data-testid="item-${item.productName.replace(/\s+/g, '-').toLowerCase()}"]`);
    
    const displayedTax = await itemRow.locator('[data-testid="tax-amount"]').textContent();
    const actualTax = parseFloat(displayedTax?.replace(/[$,]/g, '') || '0');
    
    expect(Math.abs(actualTax - item.taxAmount)).toBeLessThan(0.01);
    
    console.log(`✓ Tax verified for ${item.productName}: $${actualTax.toFixed(2)}`);
  }
});

Then('special instructions should be preserved', async function (this: CustomWorld) {
  const orderItems = this.testData.orderItems as OrderItem[];
  
  for (const item of orderItems) {
    if (item.specialInstructions) {
      const itemRow = this.page!.locator(`[data-testid="item-${item.productName.replace(/\s+/g, '-').toLowerCase()}"]`);
      const displayedInstructions = await itemRow.locator('[data-testid="special-instructions"]').textContent();
      
      expect(displayedInstructions).toBe(item.specialInstructions);
      
      console.log(`✓ Special instructions preserved for ${item.productName}: ${item.specialInstructions}`);
    }
  }
});
```

---

## Advanced Data Table Patterns

### **Permission Matrix Processing**

```typescript
// Permission interface
interface UserPermission {
  userRole: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canAdmin: boolean;
  modules: string[];
}

// Permission matrix processing
When('I set up the following permission matrix:', async function (this: CustomWorld, dataTable: DataTable) {
  const permissionRows = dataTable.hashes();
  const permissions: UserPermission[] = [];
  
  for (const row of permissionRows) {
    const permission: UserPermission = {
      userRole: row.userRole,
      canRead: row.canRead === 'true',
      canWrite: row.canWrite === 'true',
      canDelete: row.canDelete === 'true',
      canAdmin: row.canAdmin === 'true',
      modules: row.modules ? row.modules.split(',').map(m => m.trim()) : []
    };
    
    // Apply permissions in the system
    await this.permissionService.setRolePermissions(permission.userRole, {
      read: permission.canRead,
      write: permission.canWrite,
      delete: permission.canDelete,
      admin: permission.canAdmin,
      modules: permission.modules
    });
    
    permissions.push(permission);
    
    console.log(`✓ Configured permissions for role: ${permission.userRole}`);
  }
  
  this.testData.configuredPermissions = permissions;
});

// Permission verification
Then('the permission matrix should be applied correctly', async function (this: CustomWorld) {
  const permissions = this.testData.configuredPermissions as UserPermission[];
  
  for (const permission of permissions) {
    // Navigate to role configuration
    await this.page!.click(`[data-testid="role-${permission.userRole}"]`);
    
    // Verify each permission setting
    const readCheckbox = this.page!.locator('[data-testid="can-read"]');
    const writeCheckbox = this.page!.locator('[data-testid="can-write"]');
    const deleteCheckbox = this.page!.locator('[data-testid="can-delete"]');
    const adminCheckbox = this.page!.locator('[data-testid="can-admin"]');
    
    if (permission.canRead) {
      await expect(readCheckbox).toBeChecked();
    } else {
      await expect(readCheckbox).not.toBeChecked();
    }
    
    if (permission.canWrite) {
      await expect(writeCheckbox).toBeChecked();
    } else {
      await expect(writeCheckbox).not.toBeChecked();
    }
    
    if (permission.canDelete) {
      await expect(deleteCheckbox).toBeChecked();
    } else {
      await expect(deleteCheckbox).not.toBeChecked();
    }
    
    if (permission.canAdmin) {
      await expect(adminCheckbox).toBeChecked();
    } else {
      await expect(adminCheckbox).not.toBeChecked();
    }
    
    console.log(`✓ Permissions verified for role: ${permission.userRole}`);
  }
});
```

### **Performance Metrics Processing**

```typescript
// Performance metric interface
interface PerformanceMetric {
  metric: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  timestamp: Date;
  isExceedingThreshold: boolean;
}

// Metrics data processing
When('I record the following performance metrics:', async function (this: CustomWorld, dataTable: DataTable) {
  const metricRows = dataTable.hashes();
  const metrics: PerformanceMetric[] = [];
  
  for (const row of metricRows) {
    const metric: PerformanceMetric = {
      metric: row.metric,
      value: parseFloat(row.value),
      unit: row.unit,
      threshold: parseFloat(row.threshold),
      status: row.status as 'good' | 'warning' | 'critical',
      timestamp: new Date(row.timestamp),
      isExceedingThreshold: false
    };
    
    // Determine if threshold is exceeded
    metric.isExceedingThreshold = metric.value >= metric.threshold;
    
    // Record metric in monitoring system
    await this.monitoringService.recordMetric(metric);
    
    metrics.push(metric);
    
    console.log(`✓ Recorded metric: ${metric.metric} = ${metric.value}${metric.unit} (threshold: ${metric.threshold}${metric.unit})`);
  }
  
  this.testData.recordedMetrics = metrics;
});

// Metrics verification
Then('all metrics should be recorded in the monitoring system', async function (this: CustomWorld) {
  const metrics = this.testData.recordedMetrics as PerformanceMetric[];
  
  // Navigate to monitoring dashboard
  await this.page!.goto('/monitoring');
  
  for (const metric of metrics) {
    // Verify metric appears in dashboard
    const metricElement = this.page!.locator(`[data-testid="metric-${metric.metric}"]`);
    await expect(metricElement).toBeVisible();
    
    // Verify displayed value
    const displayedValue = await metricElement.locator('[data-testid="metric-value"]').textContent();
    expect(displayedValue).toBe(`${metric.value}${metric.unit}`);
    
    // Verify status indicator
    const statusElement = metricElement.locator('[data-testid="metric-status"]');
    await expect(statusElement).toHaveClass(new RegExp(metric.status));
    
    console.log(`✓ Metric verified in dashboard: ${metric.metric}`);
  }
});

Then('alerts should be triggered for metrics exceeding thresholds', async function (this: CustomWorld) {
  const metrics = this.testData.recordedMetrics as PerformanceMetric[];
  const exceedingMetrics = metrics.filter(m => m.isExceedingThreshold);
  
  if (exceedingMetrics.length > 0) {
    // Verify alert notifications
    await expect(this.page!.locator('[data-testid="alert-notifications"]')).toBeVisible();
    
    for (const metric of exceedingMetrics) {
      const alertElement = this.page!.locator(`[data-testid="alert-${metric.metric}"]`);
      await expect(alertElement).toBeVisible();
      
      console.log(`✓ Alert triggered for ${metric.metric}: ${metric.value}${metric.unit} > ${metric.threshold}${metric.unit}`);
    }
  } else {
    // Verify no alerts if no thresholds exceeded
    await expect(this.page!.locator('[data-testid="no-alerts"]')).toBeVisible();
    console.log('✓ No alerts triggered - all metrics within thresholds');
  }
});
```

---

## Error Handling and Data Validation

### **Robust Data Processing with Error Recovery**

```typescript
// Batch processing with error handling
When('I process the following data with error recovery:', async function (this: CustomWorld, dataTable: DataTable) {
  const dataRows = dataTable.hashes();
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[],
    processedItems: [] as any[]
  };
  
  for (const [index, row] of dataRows.entries()) {
    try {
      // Validate required fields
      const requiredFields = ['name', 'email'];
      const missingFields = requiredFields.filter(field => !row[field] || row[field].trim() === '');
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Process the data item
      const processedItem = await this.dataService.processItem(row);
      results.processedItems.push(processedItem);
      results.successful++;
      
      console.log(`✓ Processed item ${index + 1}: ${row.name}`);
      
    } catch (error) {
      results.failed++;
      const errorMessage = `Row ${index + 1} (${row.name || 'unnamed'}): ${error.message}`;
      results.errors.push(errorMessage);
      
      console.warn(`✗ Failed to process item ${index + 1}: ${error.message}`);
      
      // Continue processing other items instead of failing completely
      continue;
    }
  }
  
  // Store results for verification
  this.testData.batchProcessResults = results;
  
  // Log summary
  console.log(`\n📊 Batch Processing Summary:`);
  console.log(`   ✓ Successful: ${results.successful}`);
  console.log(`   ✗ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log(`   📋 Errors:`);
    results.errors.forEach(error => console.log(`      - ${error}`));
  }
  
  // Only fail if all items failed
  if (results.successful === 0 && results.failed > 0) {
    throw new Error(`All ${results.failed} items failed to process:\n${results.errors.join('\n')}`);
  }
});

// Results verification
Then('the batch processing should have {int} successful and {int} failed operations', 
  function (this: CustomWorld, expectedSuccessful: number, expectedFailed: number) {
    const results = this.testData.batchProcessResults;
    
    expect(results.successful).toBe(expectedSuccessful);
    expect(results.failed).toBe(expectedFailed);
    
    console.log(`✓ Batch results verified: ${results.successful} successful, ${results.failed} failed`);
  }
);
```

---

## Summary

This example demonstrates sophisticated data table processing techniques for complex BDD scenarios:

**Key Techniques Mastered:**
- **Horizontal Data Tables**: Processing multiple rows of structured data with type safety
- **Vertical Data Tables**: Handling key-value pair scenarios for detailed object creation
- **Dynamic Processing**: Adapting to different data types and structures at runtime
- **Complex Calculations**: Implementing business logic with financial calculations and validations
- **Permission Matrices**: Managing complex authorization and access control scenarios

**Professional Patterns Applied:**
- Type-safe data transformations with comprehensive validation
- Error handling with graceful degradation and detailed reporting
- Batch processing with partial failure recovery
- Business logic implementation within step definitions
- Complex data structure handling with nested objects and arrays

**Real-world Applications:**
- Product catalog management with rich metadata
- User profile creation with comprehensive details
- Order processing with complex calculations
- System configuration management
- Performance monitoring and alerting systems
- Permission and access control management

These data table processing patterns enable sophisticated test scenarios while maintaining the business-readable nature of BDD, providing the foundation for enterprise-level test automation solutions.

**Next Example**: [Doc Strings and Content Processing](./03-doc-strings-and-content-processing.md) - Learn to handle multi-line content and JSON processing through doc strings.