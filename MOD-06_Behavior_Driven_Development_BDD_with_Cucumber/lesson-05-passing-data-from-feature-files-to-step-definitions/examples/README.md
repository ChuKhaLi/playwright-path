# Examples: Passing Data from Feature Files to Step Definitions

## Examples Overview

These progressive examples demonstrate the various mechanisms for passing data from Gherkin feature files to TypeScript step definitions. Each example builds upon the previous one, showing increasingly sophisticated data handling patterns while maintaining the business-readable nature of BDD scenarios.

### **Learning Progression**

| **Example** | **Focus Area** | **Complexity** | **Key Concepts** |
|-------------|----------------|----------------|------------------|
| **01 - Basic Parameter Extraction** | Simple parameter types | Beginner | String, number, boolean parameters |
| **02 - Data Tables and Structured Data** | Complex data structures | Intermediate | Data tables, type-safe processing |
| **03 - Doc Strings and Content Processing** | Multi-line content | Intermediate | JSON processing, template handling |
| **04 - Custom Parameters and External Data** | Advanced integration | Advanced | Custom types, external data sources |

### **Practical Applications**

**Real-world Scenarios Covered:**
- E-commerce product catalog management with detailed specifications
- User account creation with comprehensive profile data  
- API testing with structured JSON payloads and responses
- Email template processing with dynamic content substitution
- Financial transaction processing with complex calculation parameters
- Content management systems with rich text and media handling

**Professional Integration Patterns:**
- Type-safe data handling with TypeScript interfaces
- External data source integration (JSON files, databases)
- Error handling and validation strategies for robust testing
- Data isolation techniques for parallel test execution

---

## Example 01: Basic Parameter Extraction

**File**: [`01-basic-parameter-extraction.md`](./01-basic-parameter-extraction.md)

**Learning Objectives:**
- Master fundamental Cucumber parameter types (`{string}`, `{int}`, `{float}`)
- Implement optional parameters with default value handling
- Create basic custom parameter types for domain-specific data
- Apply proper TypeScript typing for parameter extraction

**Scenario Focus:**
Simple e-commerce user registration and product search scenarios demonstrating clean parameter extraction patterns.

**Key Techniques:**
- Cucumber expression syntax for parameter matching
- TypeScript type annotations for extracted parameters
- Optional parameter handling with fallback values
- Basic validation within step definitions

**Code Highlights:**
```typescript
// String parameter extraction
Given('I login with username {string}', async function (username: string) {
  await this.loginPage.login(username);
});

// Numeric parameter with validation
When('I add {int} items to cart', async function (quantity: number) {
  if (quantity <= 0) throw new Error('Quantity must be positive');
  await this.cartPage.addItems(quantity);
});

// Custom parameter type for user roles
defineParameterType({
  name: 'user_role',
  regexp: /admin|user|moderator|guest/,
  transformer: (role: string) => role as UserRole
});
```

---

## Example 02: Data Tables and Structured Data

**File**: [`02-data-tables-and-structured-data.md`](./02-data-tables-and-structured-data.md)

**Learning Objectives:**
- Process horizontal data tables with multiple rows of structured data
- Handle vertical data tables for key-value pair scenarios
- Implement type-safe data table transformations
- Apply dynamic data processing based on table headers

**Scenario Focus:**
Product catalog management scenarios with complex product specifications, user bulk import operations, and inventory management.

**Key Techniques:**
- `dataTable.hashes()` for object array transformation
- `dataTable.rowsHash()` for key-value pair processing
- `dataTable.raw()` for raw table access and custom processing
- Dynamic type conversion based on data content

**Code Highlights:**
```typescript
// Horizontal data table processing
Given('I have the following products:', async function (dataTable: DataTable) {
  const products: Product[] = dataTable.hashes().map(row => ({
    name: row.name,
    price: parseFloat(row.price),
    category: row.category,
    inStock: row.inStock === 'true'
  }));
  
  for (const product of products) {
    await this.productService.addProduct(product);
  }
});

// Vertical data table for detailed user profile
Given('I create a user with the following details:', async function (dataTable: DataTable) {
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

---

## Example 03: Doc Strings and Content Processing  

**File**: [`03-doc-strings-and-content-processing.md`](./03-doc-strings-and-content-processing.md)

**Learning Objectives:**
- Handle multi-line content through doc strings effectively
- Process JSON payloads within BDD scenarios
- Implement template processing with variable substitution
- Create robust content validation and error handling

**Scenario Focus:**
API testing scenarios with complex JSON payloads, email template processing systems, and content management workflows.

**Key Techniques:**
- Doc string processing for multi-line content
- JSON parsing and validation within step definitions
- Template variable extraction and substitution
- Content-type specific processing strategies

**Code Highlights:**
```typescript
// JSON payload processing from doc strings
When('I send a POST request with the following payload:', async function (jsonPayload: string) {
  try {
    const payload: UserPayload = JSON.parse(jsonPayload);
    const response = await this.apiService.post('/users', payload);
    this.lastApiResponse = response;
  } catch (error) {
    throw new Error(`Invalid JSON payload: ${error.message}`);
  }
});

// Template processing with variable substitution
Given('I prepare an email template with the following content:', async function (templateContent: string) {
  const variableMatches = templateContent.match(/\{\{(\w+)\}\}/g) || [];
  const variables = variableMatches.map(match => match.replace(/[{}]/g, ''));
  
  this.emailTemplate = {
    content: templateContent,
    variables: variables.reduce((acc, variable) => {
      acc[variable] = `{{${variable}}}`;
      return acc;
    }, {} as Record<string, string>)
  };
});
```

---

## Example 04: Custom Parameters and External Data

**File**: [`04-custom-parameters-and-external-data.md`](./04-custom-parameters-and-external-data.md)

**Learning Objectives:**
- Create sophisticated custom parameter types for complex data structures
- Integrate external data sources (JSON files, databases) with BDD scenarios
- Implement data isolation strategies for parallel test execution
- Apply configuration-driven data management approaches

**Scenario Focus:**
Enterprise-level scenarios involving financial transactions with currency handling, flexible date processing, database-driven user management, and environment-specific configuration.

**Key Techniques:**
- Advanced custom parameter types with complex transformation logic
- External JSON file integration for test data management
- Database connectivity for dynamic test data retrieval
- Environment-specific configuration and data handling

**Code Highlights:**
```typescript
// Complex custom parameter type for money amounts
defineParameterType({
  name: 'money',
  regexp: /\$(\d+(?:\.\d{2})?)\s*([A-Z]{3})?/,
  transformer: (match: string, amount: string, currency?: string): MoneyAmount => ({
    amount: parseFloat(amount),
    currency: currency || 'USD'
  })
});

// External data integration
class TestDataLoader {
  static getUser(userType: string): any {
    const users = this.loadUserData();
    if (!users[userType]) {
      throw new Error(`User type '${userType}' not found in test data`);
    }
    return users[userType];
  }
}

// Database-driven test data
Given('I login with a user who has {string} access level', async function (accessLevel: string) {
  const dbService = new DatabaseTestDataService();
  await dbService.connect();
  
  try {
    const user = await dbService.getTestUser({ access_level: accessLevel });
    await this.loginPage.login(user.username, user.password);
    this.currentUser = user;
  } finally {
    await dbService.cleanup();
  }
});
```

---

## Common Patterns and Best Practices

### **Type Safety Strategies**

**Interface Design:**
```typescript
// Well-defined interfaces for data structures
interface Product {
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  isActive: boolean;
}
```

**Parameter Validation:**
```typescript
// Comprehensive validation with clear error messages
class DataValidator {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      errors.push(`Invalid email format: ${email}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

### **Error Handling Approaches**

**Graceful Degradation:**
```typescript
// Batch processing with partial failure handling
Given('I process the following user data:', async function (dataTable: DataTable) {
  const users = dataTable.hashes();
  const results = { successful: 0, failed: 0, errors: [] as string[] };
  
  for (const [index, userData] of users.entries()) {
    try {
      await this.userService.createUser(userData);
      results.successful++;
    } catch (error) {
      results.failed++;
      results.errors.push(`Row ${index + 1}: ${error.message}`);
    }
  }
  
  this.batchProcessResults = results;
});
```

### **Performance Optimization**

**Data Isolation for Parallel Testing:**
```typescript
class IsolatedTestDataManager {
  private testId: string;
  private testData: Map<string, any> = new Map();
  
  constructor() {
    this.testId = randomUUID();
  }
  
  generateUniqueId(prefix: string = ''): string {
    return `${prefix}${this.testId}_${Date.now()}`;
  }
}
```

---

## Integration with Previous Lessons

### **Building on Step Definition Foundations**
These examples assume mastery of:
- Basic step definition creation from MOD-06 Lesson 04
- Async/await patterns and error handling
- Page Object Model integration concepts
- TypeScript typing and interface design

### **Preparing for Advanced Topics**
These patterns prepare you for:
- Cucumber hooks and tags (Lesson 06)
- Page Object Model integration (Lesson 07) 
- Living documentation generation (Lesson 08)
- Advanced Gherkin scenarios (Lesson 09)

---

## Quick Reference Guide

### **Parameter Types Summary**
```typescript
// Built-in types
{string}    // String parameters
{int}       // Integer numbers
{float}     // Floating point numbers
{word}      // Single word (no spaces)

// Custom types
{user_role}     // Domain-specific enums
{money}         // Complex structured data
{smart_date}    // Flexible date parsing
```

### **Data Table Methods**
```typescript
dataTable.raw()        // Raw 2D array access
dataTable.hashes()     // Array of objects (horizontal)
dataTable.rowsHash()   // Single object (vertical)
```

### **Common Validation Patterns**
```typescript
// Email validation
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phone number validation  
/^[\d\s\-()]{10,}$/

// Currency amount validation
/^\$(\d+(?:\.\d{2})?)$/
```

---

## Next Steps

After mastering these data passing examples:

1. **Complete the Exercises**: Work through the hands-on exercises to reinforce these concepts
2. **Explore Advanced Patterns**: Study the custom parameter type libraries and external integration approaches
3. **Apply to Real Projects**: Implement these patterns in your current test automation projects
4. **Prepare for Hooks**: Ready to learn Cucumber hooks and tags for advanced test management

These examples provide the foundation for sophisticated data-driven BDD testing, enabling you to create maintainable, scalable test automation solutions that handle complex real-world scenarios effectively.