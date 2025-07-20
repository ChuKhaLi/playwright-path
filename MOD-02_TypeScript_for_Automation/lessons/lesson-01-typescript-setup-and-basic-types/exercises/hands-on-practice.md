# Lesson 01: Hands-on Practice Exercises

## 🎯 Exercise Overview

These exercises will help you practice the fundamental TypeScript concepts covered in this lesson. Complete each exercise in order, as they build upon each other.

## 📋 Prerequisites

- TypeScript development environment set up
- Basic understanding of JavaScript
- Completed the lesson content

## 🔧 Setup Instructions

1. Create a new directory for your exercises:
```bash
mkdir lesson-01-exercises
cd lesson-01-exercises
npm init -y
npm install --save-dev typescript @types/node
npx tsc --init
```

2. Create a `src` directory for your TypeScript files:
```bash
mkdir src
```

3. Update your `tsconfig.json` to include the src directory:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

## 🏋️ Exercise 1: Basic Type Annotations (15 minutes)

**Objective**: Practice using basic TypeScript types with explicit annotations.

Create a file `src/exercise1.ts` and complete the following:

```typescript
// TODO: Create variables with explicit type annotations for a test automation scenario

// 1. Test Environment Configuration
// Create a variable for the test environment (development, staging, production)
let testEnvironment: string = /* YOUR CODE HERE */;

// 2. Timeout Settings
// Create a variable for maximum wait time in milliseconds
let maxWaitTimeMs: number = /* YOUR CODE HERE */;

// 3. Test Execution Flags
// Create a variable indicating if tests should run in headless mode
let runHeadless: boolean = /* YOUR CODE HERE */;

// 4. Browser Configuration
// Create an array of browser names to test against
let targetBrowsers: string[] = /* YOUR CODE HERE */;

// 5. HTTP Status Codes
// Create an array of status codes that indicate successful API responses
let successStatusCodes: number[] = /* YOUR CODE HERE */;

// 6. Test Results
// Create an array of boolean values representing test outcomes
let testOutcomes: boolean[] = /* YOUR CODE HERE */;

// 7. Retry Configuration
// Create a variable for the number of retry attempts
let maxRetries: number = /* YOUR CODE HERE */;

// 8. Screenshot Settings
// Create a variable indicating if screenshots should be taken on failure
let screenshotOnFailure: boolean = /* YOUR CODE HERE */;

// TODO: Print all variables to verify your types
console.log("=== Exercise 1 Results ===");
console.log(`Test Environment: ${testEnvironment} (type: ${typeof testEnvironment})`);
console.log(`Max Wait Time: ${maxWaitTimeMs}ms (type: ${typeof maxWaitTimeMs})`);
console.log(`Run Headless: ${runHeadless} (type: ${typeof runHeadless})`);
console.log(`Target Browsers: ${targetBrowsers.join(", ")}`);
console.log(`Success Status Codes: ${successStatusCodes.join(", ")}`);
console.log(`Test Outcomes: ${testOutcomes.join(", ")}`);
console.log(`Max Retries: ${maxRetries} (type: ${typeof maxRetries})`);
console.log(`Screenshot on Failure: ${screenshotOnFailure} (type: ${typeof screenshotOnFailure})`);
```

**Expected Output**: Your console should display all variables with their values and types.

**Validation**: Compile with `npx tsc` - there should be no TypeScript errors.

## 🏋️ Exercise 2: Test Data Structures (20 minutes)

**Objective**: Create complex data structures with proper typing for test scenarios.

Create a file `src/exercise2.ts`:

```typescript
// TODO: Create typed test data structures

// 1. User Test Data
// Create a test user object with proper typing
// Include: id (number), username (string), email (string), isActive (boolean), roles (string array)
let testUser = /* YOUR CODE HERE */;

// 2. API Endpoint Configuration
// Create an object containing different API endpoints
// Include: baseUrl (string), endpoints (object with login, users, products as string properties)
let apiConfig = /* YOUR CODE HERE */;

// 3. Test Credentials
// Create an array of credential objects for testing
// Each credential should have: username (string), password (string), isValid (boolean)
let testCredentials = /* YOUR CODE HERE */;

// 4. Browser Configuration
// Create an object for browser settings
// Include: name (string), headless (boolean), viewport (object with width and height as numbers)
let browserConfig = /* YOUR CODE HERE */;

// 5. Test Timeouts
// Create an object with different timeout values
// Include: short (number), medium (number), long (number), all in milliseconds
let timeoutConfig = /* YOUR CODE HERE */;

// TODO: Demonstrate accessing nested properties
console.log("=== Exercise 2 Results ===");
console.log(`Test User: ${testUser.username} (${testUser.email})`);
console.log(`API Base URL: ${apiConfig.baseUrl}`);
console.log(`Login Endpoint: ${apiConfig.endpoints.login}`);
console.log(`First Test Credential: ${testCredentials[0].username}`);
console.log(`Browser: ${browserConfig.name}, Headless: ${browserConfig.headless}`);
console.log(`Viewport: ${browserConfig.viewport.width}x${browserConfig.viewport.height}`);
console.log(`Timeouts - Short: ${timeoutConfig.short}ms, Medium: ${timeoutConfig.medium}ms`);
```

**Challenge**: Try to access a property that doesn't exist and see what TypeScript error you get.

## 🏋️ Exercise 3: Utility Functions (25 minutes)

**Objective**: Create typed utility functions for test automation.

Create a file `src/exercise3.ts`:

```typescript
// TODO: Create utility functions with proper type annotations

// 1. Random Data Generator
// Create a function that generates a random email address
// Parameters: prefix (string), domain (string, optional, default: "example.com")
// Returns: string
function generateRandomEmail(/* YOUR PARAMETERS HERE */): /* RETURN TYPE */ {
    /* YOUR CODE HERE */
}

// 2. Status Code Validator
// Create a function that checks if a status code indicates success (200-299)
// Parameters: statusCode (number)
// Returns: boolean
function isSuccessStatusCode(/* YOUR PARAMETERS HERE */): /* RETURN TYPE */ {
    /* YOUR CODE HERE */
}

// 3. Test Result Formatter
// Create a function that formats test results for display
// Parameters: testName (string), passed (boolean), duration (number, optional)
// Returns: string
function formatTestResult(/* YOUR PARAMETERS HERE */): /* RETURN TYPE */ {
    /* YOUR CODE HERE */
}

// 4. Array Utility
// Create a function that finds the maximum value in an array of numbers
// Parameters: numbers (number array)
// Returns: number
function findMaxValue(/* YOUR PARAMETERS HERE */): /* RETURN TYPE */ {
    /* YOUR CODE HERE */
}

// 5. String Utility
// Create a function that capitalizes the first letter of each word
// Parameters: text (string)
// Returns: string
function capitalizeWords(/* YOUR PARAMETERS HERE */): /* RETURN TYPE */ {
    /* YOUR CODE HERE */
}

// 6. Async Utility
// Create an async function that creates a delay
// Parameters: milliseconds (number)
// Returns: Promise<void>
async function createDelay(/* YOUR PARAMETERS HERE */): /* RETURN TYPE */ {
    /* YOUR CODE HERE */
}

// TODO: Test your functions
console.log("=== Exercise 3 Results ===");

// Test generateRandomEmail
const email1: string = generateRandomEmail("test");
const email2: string = generateRandomEmail("user", "testdomain.com");
console.log(`Generated emails: ${email1}, ${email2}`);

// Test isSuccessStatusCode
const codes: number[] = [200, 404, 201, 500, 302];
codes.forEach((code: number) => {
    const isSuccess: boolean = isSuccessStatusCode(code);
    console.log(`Status ${code}: ${isSuccess ? "Success" : "Not Success"}`);
});

// Test formatTestResult
const result1: string = formatTestResult("Login Test", true);
const result2: string = formatTestResult("API Test", false, 1500);
console.log(result1);
console.log(result2);

// Test findMaxValue
const numbers: number[] = [10, 5, 8, 20, 3];
const maxValue: number = findMaxValue(numbers);
console.log(`Max value in [${numbers.join(", ")}]: ${maxValue}`);

// Test capitalizeWords
const text: string = "hello world typescript";
const capitalized: string = capitalizeWords(text);
console.log(`Capitalized: "${capitalized}"`);

// Test createDelay (async)
async function testDelay(): Promise<void> {
    console.log("Starting delay...");
    await createDelay(1000);
    console.log("Delay completed!");
}

testDelay();
```

## 🏋️ Exercise 4: Configuration System (20 minutes)

**Objective**: Build a comprehensive configuration system with proper typing.

Create a file `src/exercise4.ts`:

```typescript
// TODO: Create a comprehensive test configuration system

// 1. Define Test Configuration Structure
// Create a configuration object that includes:
// - environment: string
// - baseUrl: string  
// - timeout: number
// - retries: number
// - browsers: string array
// - headless: boolean
// - screenshots: object with enabled (boolean) and path (string)
// - reporting: object with format (string) and outputDir (string)
let testConfig = /* YOUR CODE HERE */;

// 2. Environment-Specific Configurations
// Create configurations for different environments
let developmentConfig = /* YOUR CODE HERE */;
let stagingConfig = /* YOUR CODE HERE */;
let productionConfig = /* YOUR CODE HERE */;

// 3. Configuration Validation Function
// Create a function that validates a configuration object
// Parameters: config (any type to simulate unknown input)
// Returns: boolean
function validateConfiguration(config: any): boolean {
    /* YOUR CODE HERE */
    // Check that all required properties exist and have correct types
    // Return true if valid, false otherwise
}

// 4. Configuration Merger Function
// Create a function that merges a base config with overrides
// Parameters: baseConfig (object), overrides (object)
// Returns: merged configuration object
function mergeConfigurations(baseConfig: any, overrides: any): any {
    /* YOUR CODE HERE */
    // Merge overrides into baseConfig and return the result
}

// 5. Environment Selector Function
// Create a function that returns the appropriate config for an environment
// Parameters: environment (string)
// Returns: configuration object or null if environment not found
function getConfigForEnvironment(environment: string): any {
    /* YOUR CODE HERE */
}

// TODO: Test your configuration system
console.log("=== Exercise 4 Results ===");

// Test configuration validation
console.log(`Main config valid: ${validateConfiguration(testConfig)}`);
console.log(`Development config valid: ${validateConfiguration(developmentConfig)}`);

// Test configuration merging
const customConfig = mergeConfigurations(testConfig, { timeout: 10000, headless: false });
console.log(`Custom config timeout: ${customConfig.timeout}`);
console.log(`Custom config headless: ${customConfig.headless}`);

// Test environment selection
const devConfig = getConfigForEnvironment("development");
const prodConfig = getConfigForEnvironment("production");
const invalidConfig = getConfigForEnvironment("invalid");

console.log(`Dev config base URL: ${devConfig?.baseUrl || "Not found"}`);
console.log(`Prod config base URL: ${prodConfig?.baseUrl || "Not found"}`);
console.log(`Invalid config: ${invalidConfig || "Not found"}`);
```

## 🎯 Bonus Challenge: Advanced Type Usage (15 minutes)

**Objective**: Explore more advanced type concepts as a preview of future lessons.

Create a file `src/bonus-challenge.ts`:

```typescript
// BONUS: Preview of advanced concepts (don't worry if this is challenging!)

// 1. Union Types (Preview of Lesson 5)
// Create a variable that can be either a string or number
let testId: string | number = /* YOUR CODE HERE */;

// 2. Function Overloading Preview
// Try to create a function that can accept different parameter types
function processTestData(data: string): string;
function processTestData(data: number): number;
function processTestData(data: string | number): string | number {
    if (typeof data === "string") {
        return data.toUpperCase();
    } else {
        return data * 2;
    }
}

// 3. Generic Function Preview (Lesson 8 concept)
// Don't worry about understanding this fully - just observe the syntax
function createArray<T>(item: T, count: number): T[] {
    const result: T[] = [];
    for (let i = 0; i < count; i++) {
        result.push(item);
    }
    return result;
}

// Test the bonus concepts
console.log("=== Bonus Challenge Results ===");

testId = "TEST123";
console.log(`Test ID as string: ${testId}`);
testId = 12345;
console.log(`Test ID as number: ${testId}`);

console.log(`Process string: ${processTestData("hello")}`);
console.log(`Process number: ${processTestData(5)}`);

const stringArray: string[] = createArray("test", 3);
const numberArray: number[] = createArray(42, 4);
console.log(`String array: ${stringArray.join(", ")}`);
console.log(`Number array: ${numberArray.join(", ")}`);
```

## ✅ Exercise Solutions

### Exercise 1 Solution
```typescript
let testEnvironment: string = "development";
let maxWaitTimeMs: number = 30000;
let runHeadless: boolean = true;
let targetBrowsers: string[] = ["chromium", "firefox", "webkit"];
let successStatusCodes: number[] = [200, 201, 202, 204];
let testOutcomes: boolean[] = [true, true, false, true];
let maxRetries: number = 3;
let screenshotOnFailure: boolean = true;
```

### Exercise 2 Solution
```typescript
let testUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    isActive: true,
    roles: ["user", "tester"]
};

let apiConfig = {
    baseUrl: "https://api.example.com",
    endpoints: {
        login: "/auth/login",
        users: "/users",
        products: "/products"
    }
};

let testCredentials = [
    { username: "validuser", password: "validpass", isValid: true },
    { username: "invaliduser", password: "wrongpass", isValid: false }
];

let browserConfig = {
    name: "chromium",
    headless: true,
    viewport: {
        width: 1920,
        height: 1080
    }
};

let timeoutConfig = {
    short: 1000,
    medium: 5000,
    long: 30000
};
```

## 🔍 Common Issues and Solutions

### Issue 1: TypeScript Compilation Errors
**Problem**: `tsc` command shows errors
**Solution**: Check that all variables have proper type annotations and values match their types

### Issue 2: Cannot Find Module Errors
**Problem**: Import/export statements cause errors
**Solution**: Ensure `tsconfig.json` is properly configured and files are in the correct directories

### Issue 3: Type Mismatch Errors
**Problem**: Assigning wrong type to variable
**Solution**: Check the error message carefully - TypeScript tells you exactly what types are expected vs. provided

## 📊 Self-Assessment Checklist

After completing the exercises, check that you can:

- [ ] Create variables with explicit type annotations
- [ ] Use basic TypeScript types (string, number, boolean, arrays)
- [ ] Understand the difference between type inference and explicit typing
- [ ] Create simple object structures with proper typing
- [ ] Write functions with typed parameters and return values
- [ ] Compile TypeScript code without errors
- [ ] Apply TypeScript concepts to testing scenarios

## 🎓 Next Steps

Once you've completed these exercises:

1. **Review your solutions** with the provided answers
2. **Experiment** with the TypeScript Playground
3. **Practice** converting existing JavaScript code to TypeScript
4. **Prepare** for Lesson 02: Object Types and Annotations

---

**Navigation**:
- [← Lesson Content](../content.md)
- [Assessment →](../assessment.md)
- [Next Lesson →](../../lesson-02-object-types-and-annotations/README.md)