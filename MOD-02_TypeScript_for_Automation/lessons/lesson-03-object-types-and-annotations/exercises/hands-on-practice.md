# Hands-On Practice: Object Types and Annotations

## Overview

This hands-on exercise will give you practical experience with TypeScript object types and annotations specifically for test automation scenarios. You'll work with page objects, test data, API responses, and configuration objects to build real-world typing skills.

**Estimated Time**: 90-120 minutes  
**Difficulty**: Beginner to Intermediate  
**Prerequisites**: Completed Lesson 01 (TypeScript Setup and Basic Types)

## Setup Instructions

Before starting the exercises, ensure you have:

1. **TypeScript Environment**: Working TypeScript setup from Lesson 01
2. **Code Editor**: VS Code or similar with TypeScript support
3. **Practice File**: Create a new file called `object-types-practice.ts`

## Exercise 1: Basic Object Types for Test Data (20 minutes)

### Objective
Create object types for common test automation data structures.

### Instructions

1. **Define User Types**
   Create object types for different user scenarios in your tests.

2. **Create Test Data Objects**
   Implement actual test data using your defined types.

3. **Build Utility Functions**
   Create functions that work with your typed objects.

### Tasks to Complete

**Task 1.1**: Create a `TestUser` type with the following properties:
- `id` (string, required)
- `username` (string, required)
- `email` (string, required)
- `password` (string, required)
- `firstName` (string, required)
- `lastName` (string, required)
- `isActive` (boolean, required)

**Task 1.2**: Create three test user objects using your `TestUser` type:
- `adminUser` - An active admin user
- `regularUser` - An active regular user
- `inactiveUser` - An inactive user

**Task 1.3**: Create a function called `validateTestUser` that:
- Takes a `TestUser` parameter
- Returns `boolean`
- Validates that email contains '@' and password is at least 8 characters

### Verification Steps

- [ ] `TestUser` type is properly defined with all required properties
- [ ] Three test user objects are created with correct typing
- [ ] `validateTestUser` function works correctly with type checking
- [ ] TypeScript compiler shows no errors

## Exercise 2: Optional Properties and Flexible Structures (25 minutes)

### Objective
Master optional properties for handling different test scenarios and data variations.

### Instructions

1. **Create Flexible Form Data Types**
   Design types that can handle both minimal and complete form submissions.

2. **Handle Different Test Scenarios**
   Create objects representing various test cases with different data completeness.

3. **Build Processing Functions**
   Create functions that handle optional properties gracefully.

### Tasks to Complete

**Task 2.1**: Create a `RegistrationFormData` type with:
- Required: `email`, `password`, `confirmPassword`
- Optional: `firstName`, `lastName`, `phoneNumber`, `dateOfBirth`, `marketingConsent`

**Task 2.2**: Create a `UserProfile` type with nested optional objects:
- Required: `userId`, `email`
- Optional: `personalInfo` object with `firstName`, `lastName`, `bio`
- Optional: `preferences` object with `theme`, `language`, `notifications`
- Optional: `address` object with `street`, `city`, `country`, `postalCode`

**Task 2.3**: Create test data objects:
- `minimalRegistration` - Only required fields
- `completeRegistration` - All fields including optional ones
- `partialProfile` - Some optional fields filled

**Task 2.4**: Create a function `processRegistration` that:
- Takes `RegistrationFormData` parameter
- Returns a formatted string describing the registration
- Handles optional fields gracefully (checks if they exist before using)

### Verification Steps

- [ ] Optional properties are correctly defined with `?` operator
- [ ] Nested optional objects work properly
- [ ] Test data objects demonstrate different levels of completeness
- [ ] Processing function handles optional properties without errors

## Exercise 3: Readonly Properties and Configuration (20 minutes)

### Objective
Use readonly properties to protect important configuration data and constants.

### Instructions

1. **Create Test Environment Configuration**
   Design configuration objects with readonly properties for sensitive data.

2. **Build Mutable Runtime Settings**
   Combine readonly configuration with mutable runtime properties.

3. **Implement Configuration Management**
   Create functions that work with readonly configurations safely.

### Tasks to Complete

**Task 3.1**: Create a `TestEnvironmentConfig` type with:
- Readonly: `environmentName`, `baseUrl`, `apiKey`, `databaseConnectionString`
- Mutable: `timeout`, `retries`, `parallelTests`, `headlessBrowser`

**Task 3.2**: Create configuration objects:
- `developmentConfig` - Development environment settings
- `stagingConfig` - Staging environment settings
- `productionConfig` - Production environment settings

**Task 3.3**: Create a function `updateRuntimeSettings` that:
- Takes a `TestEnvironmentConfig` parameter
- Takes an object with new runtime settings
- Updates only the mutable properties
- Returns the updated configuration

**Task 3.4**: Try to modify readonly properties and observe TypeScript errors.

### Verification Steps

- [ ] Readonly properties are properly protected from modification
- [ ] Mutable properties can be updated successfully
- [ ] Configuration objects represent different environments
- [ ] Runtime settings function works correctly

## Exercise 4: Index Signatures and Dynamic Properties (25 minutes)

### Objective
Handle dynamic properties in API responses and flexible configuration objects.

### Instructions

1. **Create API Response Types**
   Design types that can handle both known and unknown properties.

2. **Build Configuration Objects**
   Create flexible configuration types with index signatures.

3. **Implement Response Handlers**
   Create functions that work with dynamic properties safely.

### Tasks to Complete

**Task 4.1**: Create an `ApiResponse<T>` generic type with:
- Required: `success` (boolean), `statusCode` (number), `message` (string)
- Optional: `data` (generic type T)
- Index signature: `[key: string]: any` for additional properties

**Task 4.2**: Create specific API response types:
- `UserApiResponse` - Uses `ApiResponse<User>` where User has `id`, `name`, `email`
- `ErrorApiResponse` - Uses `ApiResponse<null>` for error responses

**Task 4.3**: Create a `TestConfiguration` type with:
- Required: `testSuite` (string), `environment` (string)
- Index signature: `[setting: string]: string | number | boolean` for additional settings

**Task 4.4**: Create sample objects:
- `successfulUserResponse` - Successful API response with user data and extra properties
- `errorResponse` - Error response with error code and details
- `testConfig` - Configuration with various dynamic settings

**Task 4.5**: Create a function `handleApiResponse` that:
- Takes an `ApiResponse<any>` parameter
- Logs the basic response information
- Checks for and logs any additional properties

### Verification Steps

- [ ] Generic API response type works with different data types
- [ ] Index signatures allow dynamic properties
- [ ] Sample objects demonstrate flexible structure usage
- [ ] Handler function processes both known and unknown properties

## Exercise 5: Complex Nested Objects for Page Objects (30 minutes)

### Objective
Create complex nested object structures for page object models and test case definitions.

### Instructions

1. **Design Page Object Structure**
   Create comprehensive page object types with nested element and action definitions.

2. **Build Test Case Types**
   Design complex test case structures with multiple nested levels.

3. **Implement Page Object Instances**
   Create actual page object implementations using your types.

### Tasks to Complete

**Task 5.1**: Create a `PageObject` type with nested structure:
- `pageName` (string)
- `url` (string)
- `elements` object containing:
  - `navigation` object with selectors for nav elements
  - `forms` object with form-related selectors
  - `buttons` object with button selectors
  - `messages` object with message container selectors
- `testData` object containing:
  - `valid` object with valid test data
  - `invalid` object with invalid test data
  - `boundary` object with boundary test data

**Task 5.2**: Create a `TestCase` type with:
- Basic info: `id`, `name`, `description`, `priority`
- `steps` array of objects with `stepNumber`, `action`, `expectedResult`
- `testData` with multiple data sets
- `environment` object with `browsers`, `devices`, `operatingSystems` arrays
- `assertions` array of expected outcomes

**Task 5.3**: Implement page objects:
- `loginPageObject` - Complete login page with all nested properties
- `registrationPageObject` - Registration page with form elements and validation data

**Task 5.4**: Create test cases:
- `loginTestCase` - Complete test case for user login
- `registrationTestCase` - Test case for user registration with multiple steps

**Task 5.5**: Create utility functions:
- `validatePageObject` - Checks if a page object has all required properties
- `executeTestCase` - Simulates test case execution (just logs the steps)

### Verification Steps

- [ ] Nested object types are properly structured and typed
- [ ] Page object implementations match the type definitions
- [ ] Test case objects contain all required nested data
- [ ] Utility functions work correctly with the complex types

## Challenge Exercise: Advanced Object Type Patterns (15 minutes)

### Objective
Combine all learned concepts to create a comprehensive test automation type system.

### Instructions

Create an advanced type system that demonstrates mastery of all object typing concepts.

### Challenge Task

**Create a Complete Test Suite Type System** that includes:

1. **`TestSuite` type** with:
   - Suite metadata (name, description, version)
   - Configuration with readonly and mutable properties
   - Array of test cases with complex nested structure
   - Reporting configuration with optional properties
   - Dynamic metadata using index signatures

2. **`TestExecution` type** with:
   - Execution metadata (start time, end time, duration)
   - Results with nested success/failure details
   - Environment information
   - Performance metrics with optional properties

3. **Implementation objects**:
   - Complete test suite instance with multiple test cases
   - Test execution results showing different outcomes

4. **Utility functions**:
   - `validateTestSuite` - Comprehensive validation
   - `generateExecutionReport` - Creates execution summary
   - `mergeTestResults` - Combines multiple execution results

### Success Criteria

- [ ] All object typing concepts are demonstrated (basic, optional, readonly, index signatures, nested)
- [ ] Types are practical and relevant to test automation
- [ ] Implementation objects are realistic and complete
- [ ] Utility functions demonstrate type safety and proper handling
- [ ] Code is well-organized and follows TypeScript best practices

## Troubleshooting Guide

### Common Issues and Solutions

**Issue 1: Optional Property Access Errors**
```typescript
// Problem: Accessing optional property without checking
function processUser(user: { name?: string }) {
  return user.name.toUpperCase(); // Error: Object is possibly 'undefined'
}

// Solution: Check for existence first
function processUser(user: { name?: string }) {
  return user.name ? user.name.toUpperCase() : 'No name';
}
```

**Issue 2: Readonly Property Modification**
```typescript
// Problem: Trying to modify readonly property
type Config = { readonly apiKey: string; timeout: number };
const config: Config = { apiKey: 'key123', timeout: 5000 };
config.apiKey = 'newkey'; // Error: Cannot assign to 'apiKey'

// Solution: Only modify mutable properties
config.timeout = 10000; // This works
```

**Issue 3: Index Signature Type Conflicts**
```typescript
// Problem: Index signature conflicts with specific properties
type BadConfig = {
  name: string;
  [key: string]: number; // Error: 'name' conflicts with index signature
};

// Solution: Make index signature compatible
type GoodConfig = {
  name: string;
  [key: string]: string | number;
};
```

## Submission Guidelines

### What to Submit

1. **Practice File**: Your completed `object-types-practice.ts` file
2. **Documentation**: Comments explaining your type design decisions
3. **Test Results**: Screenshots or output showing your code working

### Evaluation Criteria

- **Type Correctness**: All types are properly defined and used
- **Practical Application**: Types are relevant to test automation scenarios
- **Best Practices**: Following TypeScript and testing best practices
- **Completeness**: All exercises completed with proper verification

### Next Steps

After completing these exercises, you'll be ready to:
- Move on to **Lesson 03: Function Types and Signatures**
- Apply object types in real test automation projects
- Create comprehensive page object models with proper typing
- Design type-safe test data management systems

## Additional Resources

- [TypeScript Handbook - Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Handbook - Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)
- [TypeScript Handbook - Readonly Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)
- [TypeScript Handbook - Index Signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)

---

**Remember**: Object types are the foundation of TypeScript's type system. Focus on creating types that accurately represent your test automation data structures and provide meaningful type safety for your testing code!