# Lesson 01: TypeScript Setup and Basic Types - Content

## 🚀 Introduction

Welcome to your TypeScript journey! TypeScript is a powerful superset of JavaScript that adds static typing to help you write more reliable and maintainable code. In the context of test automation, TypeScript provides significant benefits that will make your testing code more robust and easier to maintain.

### Why TypeScript for Test Automation?

Before diving into the technical details, let's understand why TypeScript is particularly valuable for test automation:

**1. Early Error Detection**
```typescript
// TypeScript catches this error at compile time
function login(email: string, password: string) {
    // Implementation
}

// This will cause a TypeScript error
login("user@example.com", 123); // Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

**2. Better IDE Support**
- Enhanced autocomplete and IntelliSense
- Refactoring tools that understand your code structure
- Immediate feedback on potential issues

**3. Self-Documenting Code**
```typescript
// The function signature tells you exactly what it expects
function validateApiResponse(
    response: { status: number; data: any; headers: Record<string, string> }
): boolean {
    return response.status >= 200 && response.status < 300;
}
```

**4. Safer Refactoring**
When you change a function signature or interface, TypeScript will show you all the places that need to be updated.

## 🛠️ Part 1: Environment Setup (30 minutes)

### Step 1: Install Node.js and npm

First, ensure you have Node.js installed. TypeScript requires Node.js to run.

```powershell
# Check if Node.js is installed
node --version
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/) and install the LTS version.

### Step 2: Install TypeScript

You can install TypeScript globally or locally in your project. For learning purposes, we'll install it globally first:

```powershell
# Install TypeScript globally
npm install -g typescript

# Verify installation
tsc --version
```

### Step 3: Create Your First TypeScript Project

Let's create a new project directory and initialize it:

```powershell
# Create project directory
New-Item -ItemType Directory -Name "typescript-automation-basics"
Set-Location -Path "typescript-automation-basics"

# Initialize npm project
npm init -y

# Install TypeScript locally (recommended for projects)
npm install --save-dev typescript

# Install Node.js types for better development experience
npm install --save-dev @types/node
```

### Step 4: Create TypeScript Configuration

Create a `tsconfig.json` file to configure the TypeScript compiler:

```powershell
# Generate default tsconfig.json
npx tsc --init
```

Let's customize the configuration for our testing needs:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### Step 5: Set Up Project Structure

Create the basic project structure:

```powershell
New-Item -ItemType Directory -Name "src"
New-Item -ItemType Directory -Name "src/utils"
New-Item -ItemType Directory -Name "src/types"
New-Item -ItemType Directory -Name "tests"
```

Your project structure should look like this:
```
typescript-automation-basics/
├── src/
│   ├── utils/
│   └── types/
├── tests/
├── package.json
└── tsconfig.json
```

## 📝 Part 2: Basic Types and Annotations (45 minutes)

### Understanding TypeScript's Type System

TypeScript's type system is designed to be gradual - you can add types incrementally to existing JavaScript code. Let's explore the basic types:

### Primitive Types

#### String Type
```typescript
// Explicit type annotation
let username: string = "testuser";
let email: string = "test@example.com";

// Type inference (TypeScript automatically detects the type)
let password = "secretpassword"; // TypeScript infers this as string

// Template literals work the same way
let welcomeMessage: string = `Welcome, ${username}!`;

// Testing context example
let testDescription: string = "Should login with valid credentials";
```

#### Number Type
```typescript
// All numbers in TypeScript are floating point
let userId: number = 12345;
let responseTime: number = 1.5; // seconds
let statusCode: number = 200;

// Testing context examples
let timeout: number = 5000; // milliseconds
let retryCount: number = 3;
let expectedCount: number = 10;
```

#### Boolean Type
```typescript
let isLoggedIn: boolean = false;
let testPassed: boolean = true;
let isVisible: boolean = false;

// Testing context examples
let shouldRetry: boolean = true;
let isApiHealthy: boolean = false;
let hasPermission: boolean = true;
```

#### Null and Undefined
```typescript
let data: null = null;
let result: undefined = undefined;

// More commonly used in union types (we'll cover this in Lesson 5)
let optionalValue: string | null = null;
let maybeNumber: number | undefined = undefined;
```

### Array Types

TypeScript provides two ways to define array types:

#### Array Type Syntax
```typescript
// Array of strings
let usernames: string[] = ["admin", "user1", "testuser"];
let testCases: string[] = ["login", "logout", "register"];

// Array of numbers
let statusCodes: number[] = [200, 201, 400, 404, 500];
let responseTimesMs: number[] = [120, 250, 180, 95];

// Array of booleans
let testResults: boolean[] = [true, false, true, true];
```

#### Generic Array Syntax
```typescript
// Alternative syntax using Array<T>
let emails: Array<string> = ["test1@example.com", "test2@example.com"];
let ports: Array<number> = [3000, 8080, 9000];
let flags: Array<boolean> = [true, false, true];
```

#### Mixed Arrays (using union types - preview)
```typescript
// We'll cover union types in detail in Lesson 5
let mixedData: (string | number)[] = ["test", 123, "data", 456];
```

### Type Annotations vs Type Inference

TypeScript can often infer types automatically, but explicit annotations provide clarity and catch errors:

#### Type Inference
```typescript
// TypeScript infers these types automatically
let inferredString = "Hello"; // string
let inferredNumber = 42; // number
let inferredBoolean = true; // boolean
let inferredArray = [1, 2, 3]; // number[]
```

#### Explicit Type Annotations
```typescript
// Explicit annotations for clarity
let explicitString: string = "Hello";
let explicitNumber: number = 42;
let explicitBoolean: boolean = true;
let explicitArray: number[] = [1, 2, 3];
```

#### When to Use Each Approach

**Use Type Inference When:**
- The type is obvious from the value
- You're initializing variables immediately
- The code is simple and clear

**Use Explicit Annotations When:**
- You want to be explicit about your intentions
- The variable will be assigned later
- You're defining function parameters and return types
- You're working with complex types

### Practical Examples for Testing

Let's create some practical examples that you might use in test automation:

#### Test Data with Types
```typescript
// Create a new file: src/types/testData.ts

// User test data
let testUser: {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
} = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    isActive: true
};

// API endpoint configurations
let apiEndpoints: string[] = [
    "/api/users",
    "/api/auth/login",
    "/api/products",
    "/api/orders"
];

// Expected status codes for different scenarios
let successCodes: number[] = [200, 201, 202];
let clientErrorCodes: number[] = [400, 401, 403, 404];
let serverErrorCodes: number[] = [500, 502, 503, 504];
```

#### Test Utility Functions
```typescript
// Create a new file: src/utils/testHelpers.ts

// Function to generate random test data
function generateRandomEmail(): string {
    const timestamp: number = Date.now();
    return `test${timestamp}@example.com`;
}

// Function to validate status codes
function isSuccessStatusCode(code: number): boolean {
    return code >= 200 && code < 300;
}

// Function to create test delays
function delay(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// Function to format test results
function formatTestResult(testName: string, passed: boolean): string {
    const status: string = passed ? "PASSED" : "FAILED";
    return `${testName}: ${status}`;
}
```

## 🔧 Part 3: Practical Application (30 minutes)

### Building Your First TypeScript Testing Utilities

Let's create a practical example that demonstrates TypeScript's benefits in a testing context:

#### Create a Test Configuration System

```typescript
// Create file: src/types/config.ts

// Define configuration structure with types
interface TestConfig {
    baseUrl: string;
    timeout: number;
    retries: number;
    headless: boolean;
    browsers: string[];
}

// Create typed configuration
const testConfig: TestConfig = {
    baseUrl: "https://example.com",
    timeout: 30000,
    retries: 3,
    headless: true,
    browsers: ["chromium", "firefox", "webkit"]
};

// Export for use in other files
export { TestConfig, testConfig };
```

#### Create a Simple Test Data Factory

```typescript
// Create file: src/utils/dataFactory.ts

// Define user data structure
interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    isActive: boolean;
}

// Create a factory function to generate test users
function createTestUser(overrides: Partial<User> = {}): User {
    const defaultUser: User = {
        id: Math.floor(Math.random() * 10000),
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: "TestPassword123!",
        isActive: true
    };

    // Merge default values with any overrides
    return { ...defaultUser, ...overrides };
}

// Create multiple test users
function createTestUsers(count: number): User[] {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
        users.push(createTestUser({ id: i + 1 }));
    }
    return users;
}

export { User, createTestUser, createTestUsers };
```

#### Create a Basic API Response Handler

```typescript
// Create file: src/utils/apiHelpers.ts

// Define API response structure
interface ApiResponse {
    status: number;
    data: any;
    message: string;
    timestamp: number;
}

// Function to validate API responses
function validateApiResponse(response: ApiResponse): boolean {
    const hasValidStatus: boolean = response.status >= 200 && response.status < 300;
    const hasData: boolean = response.data !== null && response.data !== undefined;
    const hasTimestamp: boolean = response.timestamp > 0;
    
    return hasValidStatus && hasData && hasTimestamp;
}

// Function to extract data from API response
function extractResponseData<T>(response: ApiResponse): T {
    if (!validateApiResponse(response)) {
        throw new Error(`Invalid API response: ${response.message}`);
    }
    return response.data as T;
}

export { ApiResponse, validateApiResponse, extractResponseData };
```

### Compiling and Running Your TypeScript Code

Now let's compile and test our TypeScript code:

```powershell
# Compile TypeScript to JavaScript
npx tsc

# The compiled JavaScript will be in the dist/ directory
# You can run it with Node.js
node dist/utils/testHelpers.js
```

### Setting Up Build Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "clean": "if (Test-Path -Path dist) { Remove-Item -Recurse -Force dist }",
    "dev": "tsc --watch"
  }
}
```

Now you can use:
```powershell
npm run build        # Compile once
npm run build:watch  # Compile and watch for changes
npm run clean        # Remove compiled files
```

## 🎯 Part 4: Hands-on Exercise (15 minutes)

### Exercise 1: Basic Type Practice

Create a file `src/exercises/basicTypes.ts` and complete the following:

```typescript
// TODO: Create variables with explicit type annotations
// 1. A string variable for storing test environment (e.g., "development", "staging", "production")
let testEnvironment: string = /* YOUR CODE HERE */;

// 2. A number variable for maximum wait time in seconds
let maxWaitTime: number = /* YOUR CODE HERE */;

// 3. A boolean variable indicating if tests should run in parallel
let runInParallel: boolean = /* YOUR CODE HERE */;

// 4. An array of browser names to test against
let browsers: string[] = /* YOUR CODE HERE */;

// 5. An array of HTTP status codes that indicate success
let successStatusCodes: number[] = /* YOUR CODE HERE */;
```

### Exercise 2: Test Data Creation

Create a file `src/exercises/testData.ts`:

```typescript
// TODO: Create a test user object with proper typing
// The user should have: id (number), name (string), email (string), isVerified (boolean)
let testUser = /* YOUR CODE HERE */;

// TODO: Create an array of test passwords with different complexity levels
let testPasswords: string[] = /* YOUR CODE HERE */;

// TODO: Create a function that returns a random number between min and max
function getRandomNumber(min: number, max: number): number {
    /* YOUR CODE HERE */
}

// TODO: Create a function that generates a unique email address
function generateUniqueEmail(prefix: string): string {
    /* YOUR CODE HERE */
}
```

### Exercise 3: Configuration Object

Create a file `src/exercises/config.ts`:

```typescript
// TODO: Create a configuration object for your test suite
// Include: baseUrl (string), timeout (number), retries (number), 
//          headless (boolean), screenshotOnFailure (boolean)
let testConfiguration = /* YOUR CODE HERE */;

// TODO: Create a function that validates the configuration
function validateConfig(config: any): boolean {
    /* YOUR CODE HERE */
}
```

## 🔍 Common Mistakes and How to Avoid Them

### 1. Using `any` Type Too Often
```typescript
// ❌ Avoid this - defeats the purpose of TypeScript
let data: any = "some data";

// ✅ Be specific with types
let data: string = "some data";
```

### 2. Not Using Type Annotations for Function Parameters
```typescript
// ❌ Missing type annotations
function processUser(user) {
    return user.name.toUpperCase();
}

// ✅ Always type function parameters
function processUser(user: { name: string }): string {
    return user.name.toUpperCase();
}
```

### 3. Ignoring TypeScript Errors
```typescript
// ❌ Don't ignore TypeScript errors with @ts-ignore
// @ts-ignore
let result = someFunction(wrongParameter);

// ✅ Fix the underlying issue
let result = someFunction(correctParameter);
```

## 📚 Key Takeaways

1. **TypeScript adds static typing to JavaScript**, helping catch errors early
2. **Basic types include string, number, boolean, and arrays**
3. **Type annotations can be explicit or inferred**
4. **TypeScript is particularly valuable for test automation** due to better IDE support and error detection
5. **Always configure TypeScript properly** with tsconfig.json for your project needs

## 🔗 What's Next?

In the next lesson, we'll dive deeper into **Object Types and Annotations**, where you'll learn to:
- Create complex object types
- Use optional properties
- Work with nested objects
- Apply object typing to test scenarios

## 💡 Additional Practice

1. **Experiment with TypeScript Playground**: Visit [typescriptlang.org/play](https://www.typescriptlang.org/play) to practice concepts
2. **Convert JavaScript to TypeScript**: Take existing JavaScript test code and add types
3. **Explore VS Code Features**: Use IntelliSense and error detection with your typed code
4. **Read TypeScript Errors**: Practice understanding and fixing TypeScript compiler errors

---

**Navigation**:
- [← Lesson Overview](README.md)
- [Examples →](examples/)
- [Exercises →](exercises/)
- [Assessment →](assessment.md)