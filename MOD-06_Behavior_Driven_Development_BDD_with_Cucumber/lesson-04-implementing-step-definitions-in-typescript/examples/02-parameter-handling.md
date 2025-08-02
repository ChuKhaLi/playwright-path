# Example 02: Parameter Handling and Type Safety

## Overview

This example focuses on extracting and processing parameters from Gherkin steps with proper TypeScript type safety. You'll learn how to handle different parameter types, work with data tables and doc strings, and implement robust parameter validation and conversion.

## Learning Objectives

- Master Cucumber expression parameter types
- Implement type-safe parameter handling in TypeScript
- Work with data tables and doc strings
- Create custom parameter transformations
- Handle optional and variable parameters
- Implement parameter validation and error handling

## Parameter Types in Cucumber Expressions

### Built-in Parameter Types

Cucumber provides several built-in parameter types that automatically handle type conversion:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// String parameters - automatically extracted from quotes
When('I search for {string}', async function (searchTerm: string) {
  // searchTerm is automatically a string
  await this.page.getByPlaceholder('Search').fill(searchTerm);
  console.log(`Searching for: "${searchTerm}"`);
});

// Integer parameters - automatically converted to numbers
Given('I have {int} items in my cart', async function (itemCount: number) {
  // itemCount is automatically a number
  expect(typeof itemCount).toBe('number');
  
  for (let i = 0; i < itemCount; i++) {
    await this.cartManager.addRandomItem();
  }
  console.log(`Added ${itemCount} items to cart`);
});

// Float parameters - handles decimal numbers
Then('the total should be {float}', async function (expectedTotal: number) {
  // expectedTotal is a number with decimal precision
  const actualTotal = await this.cartManager.getTotal();
  expect(actualTotal).toBeCloseTo(expectedTotal, 2);
  console.log(`Total verified: $${expectedTotal.toFixed(2)}`);
});

// Word parameters - single words without quotes
When('I select {word} as my preferred language', async function (language: string) {
  // language is a single word string
  await this.page.selectOption('select[name="language"]', language);
  console.log(`Selected language: ${language}`);
});
```

### Multiple Parameters

Handle multiple parameters of different types:

```typescript
When('I create a user with name {string}, age {int}, and email {string}', 
  async function (name: string, age: number, email: string) {
    // TypeScript knows the exact type of each parameter
    const userData = {
      name,
      age,
      email,
      createdAt: new Date().toISOString()
    };
    
    // Validate parameter types
    expect(typeof name).toBe('string');
    expect(typeof age).toBe('number');
    expect(typeof email).toBe('string');
    
    await this.userManager.createUser(userData);
    console.log(`Created user: ${name} (${age} years old) - ${email}`);
  }
);

When('I set price to {float} and quantity to {int}', 
  async function (price: number, quantity: number) {
    // Both parameters are properly typed
    const totalValue = price * quantity;
    
    await this.page.getByLabel('Price').fill(price.toString());
    await this.page.getByLabel('Quantity').fill(quantity.toString());
    
    console.log(`Set price: $${price}, quantity: ${quantity}, total: $${totalValue}`);
  }
);
```

## Advanced Parameter Handling

### Optional Parameters

Handle optional parameters with default values:

```typescript
When('I login with username {string} and optional password {string}', 
  async function (username: string, password?: string) {
    // Handle optional password parameter
    const actualPassword = password || 'defaultPassword123';
    
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(actualPassword);
    
    if (password) {
      console.log(`Login with username: ${username} and provided password`);
    } else {
      console.log(`Login with username: ${username} and default password`);
    }
  }
);

// Alternative pattern with conditional logic
When('I may enter {string} in the optional field', 
  async function (value: string) {
    // Handle empty string as "no value"
    if (value && value.toLowerCase() !== 'nothing' && value !== '') {
      await this.page.getByLabel('Optional Field').fill(value);
      console.log(`Entered optional value: ${value}`);
    } else {
      console.log('Skipped optional field');
    }
  }
);
```

### Regular Expression Parameters

For complex parameter patterns:

```typescript
// Using regex for flexible matching
When(/^I (?:enter|type|input) "([^"]*)" (?:in|into) the (\w+) field$/, 
  async function (value: string, fieldName: string) {
    // Flexible step matching with regex groups
    const formattedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    
    await this.page.getByLabel(formattedFieldName).fill(value);
    console.log(`Entered "${value}" in ${formattedFieldName} field`);
  }
);

// Handling variations in step language
When(/^I (?:click|press|tap) (?:the )?(.+) (?:button|btn|link)$/, 
  async function (elementName: string) {
    // Handle various ways to express clicking
    const button = this.page.getByRole('button', { name: new RegExp(elementName, 'i') })
      .or(this.page.getByRole('link', { name: new RegExp(elementName, 'i') }));
    
    await button.click();
    console.log(`Clicked: ${elementName}`);
  }
);
```

## Data Tables

### Basic Data Table Handling

```typescript
// Feature file example:
// When I create users with the following data:
//   | name    | email              | age |
//   | Alice   | alice@example.com  | 25  |
//   | Bob     | bob@example.com    | 30  |
//   | Charlie | charlie@example.com| 28  |

When('I create users with the following data:', async function (dataTable) {
  // Extract data as array of objects
  const users = dataTable.hashes();
  
  for (const userData of users) {
    // Each row becomes an object with column headers as keys
    const user = {
      name: userData.name,
      email: userData.email,
      age: parseInt(userData.age) // Convert string to number
    };
    
    await this.userManager.createUser(user);
    console.log(`Created user: ${user.name} (${user.age}) - ${user.email}`);
  }
});
```

### Type-Safe Data Table Processing

```typescript
// Define interface for type safety
interface UserData {
  name: string;
  email: string;
  age: string; // Note: DataTable values are always strings initially
  role?: string;
}

When('I register multiple users:', async function (dataTable) {
  const userData = dataTable.hashes() as UserData[];
  
  for (const user of userData) {
    // Type conversion with validation
    const processedUser = {
      name: user.name.trim(),
      email: user.email.toLowerCase(),
      age: parseInt(user.age),
      role: user.role || 'user'
    };
    
    // Validate required fields
    if (!processedUser.name || !processedUser.email) {
      throw new Error(`Invalid user data: name and email are required`);
    }
    
    if (isNaN(processedUser.age) || processedUser.age < 0) {
      throw new Error(`Invalid age: ${user.age}`);
    }
    
    await this.userManager.createUser(processedUser);
    console.log(`✅ Registered: ${processedUser.name}`);
  }
});
```

### Key-Value Data Tables

```typescript
// Feature file example:
// When I configure the application with:
//   | setting     | value          |
//   | theme       | dark           |
//   | language    | en             |
//   | timeout     | 30             |
//   | autoSave    | true           |

When('I configure the application with:', async function (dataTable) {
  // Convert to key-value pairs
  const settings = dataTable.rowsHash();
  
  // Process each setting with type conversion
  for (const [setting, value] of Object.entries(settings)) {
    let processedValue: any = value;
    
    // Type conversion based on setting name or value format
    if (value === 'true' || value === 'false') {
      processedValue = value === 'true';
    } else if (!isNaN(Number(value))) {
      processedValue = Number(value);
    }
    
    await this.configManager.setSetting(setting, processedValue);
    console.log(`Set ${setting}: ${processedValue} (${typeof processedValue})`);
  }
});
```

### Complex Data Structures

```typescript
// Handling nested data in tables
When('I create a product with specifications:', async function (dataTable) {
  const productData = dataTable.hashes()[0];
  
  // Parse complex fields
  const product = {
    name: productData.name,
    price: parseFloat(productData.price),
    category: productData.category,
    tags: productData.tags ? productData.tags.split(',').map(tag => tag.trim()) : [],
    specifications: productData.specifications ? 
      JSON.parse(productData.specifications) : {},
    availability: {
      inStock: productData.inStock === 'true',
      quantity: parseInt(productData.quantity) || 0
    }
  };
  
  await this.productManager.createProduct(product);
  console.log(`Created product: ${product.name} with ${product.tags.length} tags`);
});
```

## Doc Strings

Handle multi-line text content:

```typescript
// Feature file example:
// When I enter the following description:
//   """
//   This is a multi-line description
//   that spans several lines
//   and contains detailed information.
//   """

When('I enter the following description:', async function (docString: string) {
  // docString contains the complete multi-line text
  await this.page.getByLabel('Description').fill(docString);
  
  // Log first line for confirmation
  const firstLine = docString.split('\n')[0];
  console.log(`Entered description starting with: "${firstLine}..."`);
});

When('I submit a comment with content:', async function (docString: string) {
  // Process and clean the doc string
  const cleanedContent = docString
    .trim()
    .replace(/\n\s+/g, '\n') // Remove extra indentation
    .replace(/\n{3,}/g, '\n\n'); // Normalize line breaks
  
  await this.page.getByRole('textbox', { name: 'Comment' }).fill(cleanedContent);
  await this.page.getByRole('button', { name: 'Submit Comment' }).click();
  
  console.log(`Submitted comment (${cleanedContent.length} characters)`);
});
```

## Custom Parameter Types

Define custom parameter types for domain-specific data:

```typescript
// support/parameter-types.ts
import { defineParameterType } from '@cucumber/cucumber';

// Custom user role parameter type
defineParameterType({
  name: 'user_role',
  regexp: /admin|manager|employee|customer|guest/,
  transformer: (role: string) => role.toLowerCase(),
});

// Custom date parameter type
defineParameterType({
  name: 'date',
  regexp: /\d{4}-\d{2}-\d{2}/,
  transformer: (dateString: string) => new Date(dateString),
});

// Custom currency parameter type
defineParameterType({
  name: 'currency',
  regexp: /\$\d+(?:\.\d{2})?/,
  transformer: (currencyString: string) => parseFloat(currencyString.replace('$', '')),
});

// Usage in step definitions:
Given('I am logged in as a {user_role}', async function (role: string) {
  await this.authManager.loginAsRole(role);
  console.log(`Logged in as: ${role}`);
});

When('I set the event date to {date}', async function (eventDate: Date) {
  const formattedDate = eventDate.toISOString().split('T')[0];
  await this.page.getByLabel('Event Date').fill(formattedDate);
  console.log(`Set event date: ${formattedDate}`);
});

Then('the price should be {currency}', async function (expectedPrice: number) {
  const actualPrice = await this.cartManager.getTotal();
  expect(actualPrice).toBeCloseTo(expectedPrice, 2);
  console.log(`Price verified: $${expectedPrice}`);
});
```

## Parameter Validation and Error Handling

### Input Validation

```typescript
When('I enter age {int} for the user', async function (age: number) {
  // Validate age parameter
  if (age < 0 || age > 150) {
    throw new Error(`Invalid age: ${age}. Age must be between 0 and 150.`);
  }
  
  await this.page.getByLabel('Age').fill(age.toString());
  console.log(`Entered valid age: ${age}`);
});

When('I enter email {string} in the registration form', async function (email: string) {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }
  
  await this.page.getByLabel('Email').fill(email);
  console.log(`Entered valid email: ${email}`);
});
```

### Parameter Transformation with Validation

```typescript
When('I set the discount to {string}', async function (discountValue: string) {
  let discount: number;
  
  // Handle percentage or fixed amount
  if (discountValue.endsWith('%')) {
    discount = parseFloat(discountValue.replace('%', ''));
    if (discount < 0 || discount > 100) {
      throw new Error(`Invalid percentage: ${discountValue}. Must be 0-100%`);
    }
    await this.discountManager.setPercentageDiscount(discount);
  } else if (discountValue.startsWith('$')) {
    discount = parseFloat(discountValue.replace('$', ''));
    if (discount < 0) {
      throw new Error(`Invalid amount: ${discountValue}. Must be positive`);
    }
    await this.discountManager.setFixedDiscount(discount);
  } else {
    throw new Error(`Invalid discount format: ${discountValue}. Use $X.XX or X%`);
  }
  
  console.log(`Set discount: ${discountValue}`);
});
```

## Advanced Patterns

### Dynamic Parameter Handling

```typescript
When('I fill the form with {string} set to {string}', 
  async function (fieldName: string, value: string) {
    // Dynamic form field handling
    const fieldMappings: Record<string, string> = {
      'first name': 'First Name',
      'last name': 'Last Name',
      'phone': 'Phone Number',
      'address': 'Street Address'
    };
    
    const labelText = fieldMappings[fieldName.toLowerCase()] || fieldName;
    const field = this.page.getByLabel(labelText);
    
    await expect(field).toBeVisible();
    await field.fill(value);
    
    console.log(`Set ${fieldName} to: ${value}`);
  }
);
```

### Conditional Parameter Processing

```typescript
When('I may add {string} to my preferences', async function (preference: string) {
  // Handle conditional parameters
  const validPreferences = ['newsletter', 'notifications', 'marketing', 'none'];
  
  if (preference.toLowerCase() === 'none' || preference === '') {
    console.log('No preferences added');
    return;
  }
  
  if (!validPreferences.includes(preference.toLowerCase())) {
    throw new Error(`Invalid preference: ${preference}. Valid options: ${validPreferences.join(', ')}`);
  }
  
  await this.page.getByLabel(preference).check();
  console.log(`Added preference: ${preference}`);
});
```

## Best Practices Summary

### **Type Safety**
- Always specify parameter types in function signatures
- Use interfaces for complex data structures
- Validate parameter values before processing
- Handle type conversion explicitly and safely

### **Error Handling**
- Validate parameters at the start of step functions
- Provide clear, specific error messages
- Handle edge cases and invalid inputs gracefully
- Log parameter values for debugging

### **Code Organization**
- Group related parameter types in separate modules
- Create reusable transformation functions
- Use consistent naming conventions
- Document complex parameter handling logic

### **Performance**
- Cache compiled regular expressions
- Avoid unnecessary type conversions
- Process data tables efficiently
- Use appropriate data structures for lookups

---

*Mastering parameter handling enables you to create flexible, type-safe step definitions that can handle complex data scenarios while maintaining code quality and reliability.*