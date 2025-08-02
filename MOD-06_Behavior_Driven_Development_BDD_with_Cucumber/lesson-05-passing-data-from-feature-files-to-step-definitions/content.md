# Passing Data from Feature Files to Step Definitions

## Introduction

One of the most powerful aspects of Behavior-Driven Development is the ability to express complex scenarios with rich data while maintaining readability for business stakeholders. This lesson explores the various mechanisms Cucumber provides for passing data from Gherkin feature files to TypeScript step definitions, enabling sophisticated test scenarios while preserving the business-readable nature of BDD.

### **Why Data Passing Matters**

**Business Value:**
- Enables comprehensive scenario coverage with varied test data
- Maintains scenario readability while supporting complex data structures
- Facilitates collaboration between technical and non-technical team members
- Supports data-driven testing approaches within BDD frameworks

**Technical Benefits:**
- Reduces code duplication through parameterized step definitions
- Enables type-safe data handling with TypeScript integration
- Supports complex data structures beyond simple string parameters
- Facilitates external data source integration for scalable testing

**Real-world Applications:**
- E-commerce product catalogs with detailed specifications
- Financial transaction processing with complex calculation parameters
- User management systems with comprehensive profile data
- API testing with structured request and response payloads

---

## Core Concepts: Parameter Extraction

### **Understanding Cucumber Expressions**

Cucumber expressions provide a powerful yet readable way to extract parameters from Gherkin steps. They offer a balance between the flexibility of regular expressions and the simplicity needed for business-readable scenarios.

#### **Basic Parameter Types**

**String Parameters (`{string}`):**
```typescript
// Gherkin step
Given I login with username "john.doe@example.com"

// Step definition
Given('I login with username {string}', async function (username: string) {
  console.log(`Username received: ${username}`); // "john.doe@example.com"
  await this.loginPage.login(username);
});
```

**Numeric Parameters (`{int}`, `{float}`):**
```typescript
// Gherkin steps
When I add 5 items to cart
And I apply a discount of 15.5 percent

// Step definitions
When('I add {int} items to cart', async function (quantity: number) {
  await this.cartPage.addItems(quantity);
});

When('I apply a discount of {float} percent', async function (discount: number) {
  await this.cartPage.applyDiscount(discount / 100);
});
```

**Boolean Parameters (custom):**
```typescript
// Gherkin step
Given the premium feature is enabled

// Custom parameter type
defineParameterType({
  name: 'enabled_disabled',
  regexp: /enabled|disabled/,
  transformer: (value: string) => value === 'enabled'
});

// Step definition
Given('the premium feature is {enabled_disabled}', async function (isEnabled: boolean) {
  await this.featureService.setPremiumStatus(isEnabled);
});
```

#### **Optional Parameters and Default Values**

**Handling Optional Data:**
```typescript
// Gherkin steps (both should work)
When I create a user account
When I create a user account with role "admin"

// Step definition with optional parameter
When('I create a user account( with role {string})', async function (role?: string) {
  const userRole = role || 'user'; // Default to 'user' if not provided
  await this.userService.createAccount({ role: userRole });
});
```

**Advanced Optional Patterns:**
```typescript
// Multiple optional parameters
Given('I set up a product( with price {float})( and category {string})', 
  async function (price?: number, category?: string) {
    const productData = {
      price: price || 0,
      category: category || 'general'
    };
    await this.productService.createProduct(productData);
  }
);
```

### **Regular Expression Patterns for Complex Parsing**

For scenarios requiring more sophisticated parameter extraction:

```typescript
// Complex email validation
Given('I register with email {string}', async function (email: string) {
  // Validate email format within step definition
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }
  await this.registrationPage.registerUser(email);
});

// Date parsing with flexible formats
defineParameterType({
  name: 'flexible_date',
  regexp: /\d{4}-\d{2}-\d{2}|today|tomorrow|yesterday/,
  transformer: (dateString: string) => {
    switch (dateString) {
      case 'today': return new Date();
      case 'tomorrow': 
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
      default: return new Date(dateString);
    }
  }
});
```

---

## Data Tables: Structured Data Handling

Data tables provide a powerful mechanism for passing structured data to step definitions, enabling complex scenarios while maintaining readability.

### **Raw Data Table Access**

**Basic Table Structure:**
```gherkin
Given I have the following products:
  | name        | price | category    | inStock |
  | Laptop      | 999   | Electronics | true    |
  | Coffee Mug  | 15    | Kitchen     | false   |
  | Smartphone  | 699   | Electronics | true    |
```

**Raw Table Processing:**
```typescript
import { DataTable } from '@cucumber/cucumber';

Given('I have the following products:', async function (dataTable: DataTable) {
  // Access raw table data
  const rawTable = dataTable.raw();
  console.log('Headers:', rawTable[0]); // ['name', 'price', 'category', 'inStock']
  console.log('First row:', rawTable[1]); // ['Laptop', '999', 'Electronics', 'true']
  
  // Process each row manually
  for (let i = 1; i < rawTable.length; i++) {
    const [name, price, category, inStock] = rawTable[i];
    await this.productService.addProduct({
      name,
      price: parseFloat(price),
      category,
      inStock: inStock === 'true'
    });
  }
});
```

### **Objects Array Transformation**

**Type-Safe Object Processing:**
```typescript
interface Product {
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

Given('I have the following products:', async function (dataTable: DataTable) {
  // Convert to array of objects with type safety
  const products: Product[] = dataTable.hashes().map(row => ({
    name: row.name,
    price: parseFloat(row.price),
    category: row.category,
    inStock: row.inStock === 'true'
  }));
  
  // Process with type safety
  for (const product of products) {
    await this.productService.addProduct(product);
    
    // TypeScript provides full intellisense here
    if (product.inStock && product.category === 'Electronics') {
      await this.inventoryService.reserveStock(product.name);
    }
  }
});
```

### **Advanced Data Table Patterns**

**Vertical Data Tables (Key-Value Pairs):**
```gherkin
Given I create a user with the following details:
  | Field      | Value                |
  | firstName  | John                 |
  | lastName   | Doe                  |
  | email      | john.doe@example.com |
  | age        | 30                   |
  | isActive   | true                 |
```

```typescript
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  isActive: boolean;
}

Given('I create a user with the following details:', async function (dataTable: DataTable) {
  // Convert vertical table to object
  const userData = dataTable.rowsHash();
  
  const userProfile: UserProfile = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    age: parseInt(userData.age),
    isActive: userData.isActive === 'true'
  };
  
  await this.userService.createUser(userProfile);
});
```

**Dynamic Data Table Processing:**
```typescript
Given('I bulk upload the following data:', async function (dataTable: DataTable) {
  const headers = dataTable.raw()[0];
  const rows = dataTable.raw().slice(1);
  
  // Dynamic processing based on headers
  const processedData = rows.map(row => {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      const value = row[index];
      
      // Dynamic type conversion based on content
      if (value === 'true' || value === 'false') {
        obj[header] = value === 'true';
      } else if (!isNaN(parseFloat(value)) && isFinite(parseFloat(value))) {
        obj[header] = parseFloat(value);
      } else {
        obj[header] = value;
      }
    });
    return obj;
  });
  
  // Process the dynamically typed data
  for (const item of processedData) {
    await this.dataService.processItem(item);
  }
});
```

---

## Doc Strings: Multi-line Content Handling

Doc strings enable passing multi-line content to step definitions, perfect for scenarios involving complex content like JSON payloads, HTML, or large text blocks.

### **Basic Doc String Usage**

**Simple Multi-line Content:**
```gherkin
Given I submit the following feedback:
  """
  This is a multi-line feedback message.
  
  It includes multiple paragraphs and can contain
  special characters like @, #, and $symbols.
  
  Line breaks are preserved exactly as written.
  """
```

```typescript
Given('I submit the following feedback:', async function (feedbackContent: string) {
  console.log('Feedback length:', feedbackContent.length);
  console.log('Line count:', feedbackContent.split('\n').length);
  
  await this.feedbackService.submitFeedback({
    content: feedbackContent,
    timestamp: new Date(),
    source: 'automated_test'
  });
});
```

### **JSON Content Processing**

**Structured Data via Doc Strings:**
```gherkin
When I send a POST request with the following payload:
  """
  {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "preferences": {
        "notifications": true,
        "theme": "dark"
      }
    },
    "action": "create_account"
  }
  """
```

```typescript
interface UserPayload {
  user: {
    name: string;
    email: string;
    preferences: {
      notifications: boolean;
      theme: string;
    };
  };
  action: string;
}

When('I send a POST request with the following payload:', async function (jsonPayload: string) {
  try {
    // Parse and validate JSON structure
    const payload: UserPayload = JSON.parse(jsonPayload);
    
    // Type-safe processing
    const response = await this.apiService.post('/users', payload);
    
    // Store response for later verification
    this.lastApiResponse = response;
    
  } catch (error) {
    throw new Error(`Invalid JSON payload: ${error.message}`);
  }
});
```

### **Template Processing and Variable Substitution**

**Dynamic Content with Placeholders:**
```gherkin
Given I prepare an email template with the following content:
  """
  Dear {{customerName}},
  
  Thank you for your order #{{orderNumber}}.
  Your total amount is ${{totalAmount}}.
  
  Expected delivery: {{deliveryDate}}
  
  Best regards,
  The {{companyName}} Team
  """
```

```typescript
interface EmailTemplate {
  content: string;
  variables: Record<string, string>;
}

Given('I prepare an email template with the following content:', async function (templateContent: string) {
  // Extract template variables
  const variableMatches = templateContent.match(/\{\{(\w+)\}\}/g) || [];
  const variables = variableMatches.map(match => match.replace(/[{}]/g, ''));
  
  // Store template for later processing
  this.emailTemplate = {
    content: templateContent,
    variables: variables.reduce((acc, variable) => {
      acc[variable] = `{{${variable}}}`; // Placeholder for now
      return acc;
    }, {} as Record<string, string>)
  };
  
  console.log('Template variables found:', variables);
});

// Later step to populate template
When('I populate the template with customer data:', async function (dataTable: DataTable) {
  const customerData = dataTable.rowsHash();
  
  let populatedContent = this.emailTemplate.content;
  
  // Replace template variables with actual data
  Object.entries(customerData).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    populatedContent = populatedContent.replace(new RegExp(placeholder, 'g'), value);
  });
  
  await this.emailService.sendEmail({
    content: populatedContent,
    recipient: customerData.customerEmail
  });
});
```

---

## Custom Parameter Types

Custom parameter types provide a powerful mechanism for creating domain-specific data extraction and validation patterns that can be reused across multiple step definitions.

### **Creating Basic Custom Types**

**User Role Parameter Type:**
```typescript
import { defineParameterType } from '@cucumber/cucumber';

// Define custom parameter type
defineParameterType({
  name: 'user_role',
  regexp: /admin|user|moderator|guest/,
  transformer: (role: string) => {
    // Validation and transformation logic
    const validRoles = ['admin', 'user', 'moderator', 'guest'];
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid user role: ${role}. Valid roles: ${validRoles.join(', ')}`);
    }
    return role as 'admin' | 'user' | 'moderator' | 'guest';
  }
});

// Usage in step definitions
Given('I login as a {user_role}', async function (role: 'admin' | 'user' | 'moderator' | 'guest') {
  const credentials = this.testData.getCredentialsForRole(role);
  await this.loginPage.login(credentials.username, credentials.password);
});
```

### **Complex Data Structure Parameter Types**

**Money Amount with Currency:**
```typescript
interface MoneyAmount {
  amount: number;
  currency: string;
}

defineParameterType({
  name: 'money',
  regexp: /\$(\d+(?:\.\d{2})?)\s*([A-Z]{3})?/,
  transformer: (match: string, amount: string, currency?: string): MoneyAmount => {
    return {
      amount: parseFloat(amount),
      currency: currency || 'USD'
    };
  }
});

// Usage examples:
// Given I have a balance of $100 USD
// When I transfer $50.25 EUR
// Then my account should show $25
Given('I have a balance of {money}', async function (balance: MoneyAmount) {
  await this.accountService.setBalance(balance.amount, balance.currency);
});
```

### **Date and Time Parameter Types**

**Flexible Date Handling:**
```typescript
defineParameterType({
  name: 'smart_date',
  regexp: /today|tomorrow|yesterday|\d{4}-\d{2}-\d{2}|in \d+ days?|next (week|month)/,
  transformer: (dateExpression: string): Date => {
    const now = new Date();
    
    switch (true) {
      case dateExpression === 'today':
        return now;
        
      case dateExpression === 'tomorrow':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
      case dateExpression === 'yesterday':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
      case /^\d{4}-\d{2}-\d{2}$/.test(dateExpression):
        return new Date(dateExpression);
        
      case /^in (\d+) days?$/.test(dateExpression):
        const daysMatch = dateExpression.match(/^in (\d+) days?$/);
        const days = parseInt(daysMatch![1]);
        return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        
      case dateExpression === 'next week':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
      case dateExpression === 'next month':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
        
      default:
        throw new Error(`Unsupported date expression: ${dateExpression}`);
    }
  }
});

// Usage in scenarios:
Given('I schedule a meeting for {smart_date}', async function (meetingDate: Date) {
  await this.calendarService.scheduleMeeting({
    date: meetingDate,
    title: 'Test Meeting'
  });
});
```

---

## External Data Integration

### **JSON File Data Loading**

**Configuration-based Test Data:**
```typescript
// test-data/users.json
{
  "admin_user": {
    "username": "admin@company.com",
    "password": "SecurePass123!",
    "role": "admin",
    "permissions": ["read", "write", "delete"]
  },
  "regular_user": {
    "username": "user@company.com", 
    "password": "UserPass456!",
    "role": "user",
    "permissions": ["read"]
  }
}
```

```typescript
import * as fs from 'fs';
import * as path from 'path';

// Data loading helper
class TestDataLoader {
  private static userData: any = null;
  
  static loadUserData(): any {
    if (!this.userData) {
      const dataPath = path.join(__dirname, '../test-data/users.json');
      this.userData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
    return this.userData;
  }
  
  static getUser(userType: string): any {
    const users = this.loadUserData();
    if (!users[userType]) {
      throw new Error(`User type '${userType}' not found in test data`);
    }
    return users[userType];
  }
}

// Step definition using external data
Given('I login as a {string} user', async function (userType: string) {
  const userData = TestDataLoader.getUser(userType);
  await this.loginPage.login(userData.username, userData.password);
  
  // Store user context for later steps
  this.currentUser = userData;
});
```

### **Database Integration for Dynamic Data**

**Database-driven Test Scenarios:**
```typescript
import { Client } from 'pg'; // PostgreSQL client example

class DatabaseTestDataService {
  private client: Client;
  
  constructor() {
    this.client = new Client({
      host: process.env.TEST_DB_HOST || 'localhost',
      database: process.env.TEST_DB_NAME || 'test_data',
      user: process.env.TEST_DB_USER || 'test',
      password: process.env.TEST_DB_PASSWORD || 'test'
    });
  }
  
  async connect(): Promise<void> {
    await this.client.connect();
  }
  
  async getTestUser(criteria: Record<string, any>): Promise<any> {
    const whereClause = Object.keys(criteria)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');
    
    const query = `SELECT * FROM test_users WHERE ${whereClause} LIMIT 1`;
    const values = Object.values(criteria);
    
    const result = await this.client.query(query, values);
    return result.rows[0];
  }
  
  async cleanup(): Promise<void> {
    await this.client.end();
  }
}

// Usage in step definitions
Given('I login with a user who has {string} access level', async function (accessLevel: string) {
  const dbService = new DatabaseTestDataService();
  await dbService.connect();
  
  try {
    const user = await dbService.getTestUser({ access_level: accessLevel });
    if (!user) {
      throw new Error(`No test user found with access level: ${accessLevel}`);
    }
    
    await this.loginPage.login(user.username, user.password);
    this.currentUser = user;
    
  } finally {
    await dbService.cleanup();
  }
});
```

---

## Error Handling and Validation

### **Data Validation Strategies**

**Comprehensive Parameter Validation:**
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class DataValidator {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      errors.push(`Invalid email format: ${email}`);
    }
    
    if (email.length > 254) {
      errors.push(`Email too long: ${email.length} characters (max 254)`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validatePhoneNumber(phone: string): ValidationResult {
    const errors: string[] = [];
    const phoneRegex = /^[\d\s\-()]{10,}$/;
    
    if (!phoneRegex.test(phone)) {
      errors.push(`Invalid phone number format: ${phone}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Step definition with validation
Given('I register with email {string} and phone {string}', async function (email: string, phone: string) {
  // Validate email
  const emailValidation = DataValidator.validateEmail(email);
  if (!emailValidation.isValid) {
    throw new Error(`Email validation failed: ${emailValidation.errors.join(', ')}`);
  }
  
  // Validate phone
  const phoneValidation = DataValidator.validatePhoneNumber(phone);
  if (!phoneValidation.isValid) {
    throw new Error(`Phone validation failed: ${phoneValidation.errors.join(', ')}`);
  }
  
  // Proceed with registration
  await this.registrationPage.register({ email, phone });
});
```

### **Graceful Error Recovery**

**Robust Data Processing:**
```typescript
Given('I process the following user data:', async function (dataTable: DataTable) {
  const users = dataTable.hashes();
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[]
  };
  
  for (const [index, userData] of users.entries()) {
    try {
      // Validate required fields
      const requiredFields = ['name', 'email'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Process user
      await this.userService.createUser(userData);
      results.successful++;
      
    } catch (error) {
      results.failed++;
      results.errors.push(`Row ${index + 1}: ${error.message}`);
      
      // Continue processing other rows instead of failing completely
      console.warn(`Failed to process user at row ${index + 1}:`, error.message);
    }
  }
  
  // Store results for verification in subsequent steps
  this.batchProcessResults = results;
  
  // Only fail if all rows failed
  if (results.successful === 0 && results.failed > 0) {
    throw new Error(`All user creation attempts failed:\n${results.errors.join('\n')}`);
  }
});

// Verification step
Then('the batch processing should have {int} successful and {int} failed operations', 
  function (expectedSuccessful: number, expectedFailed: number) {
    expect(this.batchProcessResults.successful).toBe(expectedSuccessful);
    expect(this.batchProcessResults.failed).toBe(expectedFailed);
  }
);
```

---

## Professional Integration Patterns

### **Data Isolation for Parallel Testing**

**Thread-safe Data Management:**
```typescript
import { randomUUID } from 'crypto';

class IsolatedTestDataManager {
  private testId: string;
  private testData: Map<string, any> = new Map();
  
  constructor() {
    this.testId = randomUUID();
  }
  
  generateUniqueId(prefix: string = ''): string {
    return `${prefix}${this.testId}_${Date.now()}`;
  }
  
  storeData(key: string, data: any): void {
    this.testData.set(`${this.testId}_${key}`, data);
  }
  
  getData(key: string): any {
    return this.testData.get(`${this.testId}_${key}`);
  }
  
  cleanup(): void {
    this.testData.clear();
  }
}

// Usage in World object
export class CustomWorld extends World {
  public dataManager: IsolatedTestDataManager;
  
  constructor(options: IWorldOptions) {
    super(options);
    this.dataManager = new IsolatedTestDataManager();
  }
}

// Step definition with isolation
Given('I create a unique user account', async function (this: CustomWorld) {
  const uniqueUsername = this.dataManager.generateUniqueId('user_');
  const userData = {
    username: uniqueUsername,
    email: `${uniqueUsername}@example.com`
  };
  
  await this.userService.createUser(userData);
  this.dataManager.storeData('created_user', userData);
});
```

### **Configuration-driven Data Management**

**Environment-specific Data Handling:**
```typescript
interface EnvironmentConfig {
  baseUrl: string;
  database: {
    host: string;
    name: string;
  };
  testData: {
    usersFile: string;
    productsFile: string;
  };
}

class ConfigurationManager {
  private static config: EnvironmentConfig;
  
  static getConfig(): EnvironmentConfig {
    if (!this.config) {
      const env = process.env.TEST_ENV || 'development';
      const configPath = path.join(__dirname, `../config/${env}.json`);
      this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return this.config;
  }
  
  static getTestDataPath(dataType: string): string {
    const config = this.getConfig();
    return path.join(__dirname, '../test-data', config.testData[`${dataType}File`]);
  }
}

// Environment-aware step definition
Given('I setup test environment with {string} configuration', async function (configType: string) {
  const config = ConfigurationManager.getConfig();
  
  // Load environment-specific test data
  const usersPath = ConfigurationManager.getTestDataPath('users');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  
  // Configure services based on environment
  this.apiService.setBaseUrl(config.baseUrl);
  this.testDataService.loadUsers(users);
  
  console.log(`Environment configured: ${process.env.TEST_ENV || 'development'}`);
});
```

---

## Summary

This lesson has covered the comprehensive approaches for passing data from Gherkin feature files to TypeScript step definitions. Key takeaways include:

**Core Skills Mastered:**
- Parameter extraction using Cucumber expressions for various data types
- Data table processing for structured information handling  
- Doc string utilization for multi-line content scenarios
- Custom parameter type creation for domain-specific validation

**Professional Techniques:**
- External data source integration (JSON, databases)
- Type-safe data handling with TypeScript interfaces
- Error handling and validation strategies for robust testing
- Data isolation patterns for parallel test execution

**Best Practices Applied:**
- Separation of test data from test logic
- Reusable parameter type libraries for consistency
- Environment-specific configuration management
- Comprehensive error handling and recovery mechanisms

These skills form the foundation for sophisticated data-driven BDD testing approaches, enabling maintainable and scalable test automation solutions that handle complex real-world scenarios effectively.

**Next Steps:**
With solid data passing capabilities established, the next lesson will explore Cucumber hooks and tags, providing powerful mechanisms for test setup, teardown, and selective test execution strategies.