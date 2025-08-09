# Hands-On Practice: Function Types and Signatures

## Overview

This hands-on practice session will help you master TypeScript function types through practical exercises focused on test automation scenarios. You'll create utility functions, implement common testing patterns, and build type-safe APIs.

**Duration**: 90-120 minutes  
**Prerequisites**: Completed Lessons 01-02  
**Tools Needed**: TypeScript compiler, VS Code or similar editor

## Setup Instructions

1. Create a new directory for this exercise:
   ```bash
   mkdir typescript-functions-practice
   cd typescript-functions-practice
   ```

2. Initialize a TypeScript project:
   ```bash
   npm init -y
   npm install -D typescript @types/node
   npx tsc --init
   ```

3. Create the following file structure:
   ```
   typescript-functions-practice/
   ├── src/
   │   ├── exercise-1.ts
   │   ├── exercise-2.ts
   │   ├── exercise-3.ts
   │   ├── exercise-4.ts
   │   └── exercise-5.ts
   ├── package.json
   └── tsconfig.json
   ```

## Exercise 1: Basic Function Types (20 minutes)

**Objective**: Create utility functions with proper type annotations for common testing operations.

### Task 1.1: Test Data Generators

Create functions that generate test data with proper typing:

```typescript
// File: src/exercise-1.ts

// TODO: Define an interface for a test user
interface TestUser {
  // Add properties: id (string), name (string), email (string), age (number)
}

// TODO: Create a function that generates a random test user
// Function signature: generateTestUser(): TestUser
function generateTestUser(): TestUser {
  // Implementation here
}

// TODO: Create a function that generates multiple users
// Function signature: generateTestUsers(count: number): TestUser[]
function generateTestUsers(count: number): TestUser[] {
  // Implementation here
}

// TODO: Create a function that validates an email format
// Function signature: isValidEmail(email: string): boolean
function isValidEmail(email: string): boolean {
  // Implementation here
}

// TODO: Create a function that logs test results
// Function signature: logTestResult(testName: string, passed: boolean, duration?: number): void
function logTestResult(testName: string, passed: boolean, duration?: number): void {
  // Implementation here
}
```

### Task 1.2: Testing the Functions

Add test code to verify your functions work correctly:

```typescript
// Test your implementations
console.log('=== Exercise 1 Tests ===');

// Test single user generation
const user = generateTestUser();
console.log('Generated user:', user);

// Test multiple users generation
const users = generateTestUsers(3);
console.log('Generated users:', users);

// Test email validation
console.log('Valid email test:', isValidEmail('test@example.com'));
console.log('Invalid email test:', isValidEmail('invalid-email'));

// Test logging
logTestResult('Login Test', true, 1500);
logTestResult('Navigation Test', false);
```

**Expected Output**: Your functions should generate realistic test data and properly validate inputs.

## Exercise 2: Optional and Default Parameters (25 minutes)

**Objective**: Create flexible utility functions using optional and default parameters.

### Task 2.1: Page Interaction Utilities

```typescript
// File: src/exercise-2.ts

// TODO: Define types for configuration options
interface WaitOptions {
  timeout?: number;
  visible?: boolean;
  enabled?: boolean;
}

interface ClickOptions extends WaitOptions {
  force?: boolean;
  button?: 'left' | 'right' | 'middle';
}

// TODO: Create a mock page object (simulate Playwright's page)
class MockPage {
  async waitForSelector(selector: string, options: any = {}): Promise<void> {
    console.log(`Waiting for selector: ${selector}`, options);
    // Simulate wait
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async click(selector: string, options: any = {}): Promise<void> {
    console.log(`Clicking: ${selector}`, options);
  }

  async fill(selector: string, value: string): Promise<void> {
    console.log(`Filling ${selector} with: ${value}`);
  }

  async isVisible(selector: string): Promise<boolean> {
    return Math.random() > 0.3; // Random for testing
  }
}

// TODO: Create a function that waits for an element with optional configuration
// Function signature: waitForElement(page: MockPage, selector: string, options?: WaitOptions): Promise<void>
async function waitForElement(
  page: MockPage, 
  selector: string, 
  options?: WaitOptions
): Promise<void> {
  // Implementation with default values
}

// TODO: Create a function that clicks an element with optional configuration
// Function signature: clickElement(page: MockPage, selector: string, options?: ClickOptions): Promise<void>
async function clickElement(
  page: MockPage, 
  selector: string, 
  options?: ClickOptions
): Promise<void> {
  // Implementation here
}

// TODO: Create a function that fills a form field with validation
// Function signature: fillField(page: MockPage, selector: string, value: string, validate?: boolean): Promise<void>
async function fillField(
  page: MockPage, 
  selector: string, 
  value: string, 
  validate: boolean = true
): Promise<void> {
  // Implementation here
}
```

### Task 2.2: API Request Utilities

```typescript
// TODO: Create a function for making API requests with default options
// Function signature: makeRequest(url: string, method?: string, headers?: Record<string, string>, timeout?: number): Promise<string>
async function makeRequest(
  url: string,
  method: string = 'GET',
  headers: Record<string, string> = {},
  timeout: number = 5000
): Promise<string> {
  // Mock implementation
  console.log(`Making ${method} request to ${url}`);
  console.log('Headers:', headers);
  console.log('Timeout:', timeout);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return JSON.stringify({ success: true, data: 'mock response' });
}
```

### Task 2.3: Testing the Functions

```typescript
// Test your implementations
console.log('=== Exercise 2 Tests ===');

async function testExercise2() {
  const page = new MockPage();

  // Test waiting with different options
  await waitForElement(page, '#submit-btn');
  await waitForElement(page, '#submit-btn', { timeout: 10000 });
  await waitForElement(page, '#submit-btn', { timeout: 3000, visible: true });

  // Test clicking with different options
  await clickElement(page, '#login-btn');
  await clickElement(page, '#context-menu', { button: 'right' });
  await clickElement(page, '#disabled-btn', { force: true });

  // Test form filling
  await fillField(page, '#email', 'test@example.com');
  await fillField(page, '#password', 'secret123', false);

  // Test API requests
  await makeRequest('/api/users');
  await makeRequest('/api/users', 'POST');
  await makeRequest('/api/users', 'GET', { 'Authorization': 'Bearer token' });
  await makeRequest('/api/users', 'PUT', {}, 10000);
}

testExercise2().catch(console.error);
```

## Exercise 3: Rest Parameters and Function Overloading (30 minutes)

**Objective**: Implement flexible functions using rest parameters and function overloading.

### Task 3.1: Test Step Logger

```typescript
// File: src/exercise-3.ts

// TODO: Create a function that logs test steps using rest parameters
// Function signature: logTestSteps(testName: string, ...steps: string[]): void
function logTestSteps(testName: string, ...steps: string[]): void {
  // Implementation here
}

// TODO: Create a function that combines multiple arrays using rest parameters
// Function signature: combineArrays<T>(...arrays: T[][]): T[]
function combineArrays<T>(...arrays: T[][]): T[] {
  // Implementation here
}

// TODO: Create a function that calculates statistics from numbers
// Function signature: calculateStats(...numbers: number[]): { sum: number; average: number; min: number; max: number }
function calculateStats(...numbers: number[]): { sum: number; average: number; min: number; max: number } {
  // Implementation here
}
```

### Task 3.2: Function Overloading for Element Selection

```typescript
// TODO: Create overloaded function signatures for element selection
// Overload 1: selectElement(selector: string): Promise<void>
// Overload 2: selectElement(selector: string, index: number): Promise<void>
// Overload 3: selectElement(selector: string, text: string): Promise<void>

function selectElement(selector: string): Promise<void>;
function selectElement(selector: string, index: number): Promise<void>;
function selectElement(selector: string, text: string): Promise<void>;
function selectElement(
  selector: string, 
  indexOrText?: number | string
): Promise<void> {
  // Implementation here
}

// TODO: Create overloaded function for test data creation
// Overload 1: createTestData(count: number): string[]
// Overload 2: createTestData(template: object): object[]
// Overload 3: createTestData(template: object, count: number): object[]

function createTestData(count: number): string[];
function createTestData(template: object): object[];
function createTestData(template: object, count: number): object[];
function createTestData(
  templateOrCount: object | number, 
  count?: number
): string[] | object[] {
  // Implementation here
}
```

### Task 3.3: Testing the Functions

```typescript
// Test your implementations
console.log('=== Exercise 3 Tests ===');

async function testExercise3() {
  // Test step logging
  logTestSteps(
    'User Registration Test',
    'Navigate to registration page',
    'Fill in user details',
    'Submit form',
    'Verify success message'
  );

  // Test array combination
  const combined = combineArrays([1, 2], [3, 4], [5, 6]);
  console.log('Combined arrays:', combined);

  // Test statistics calculation
  const stats = calculateStats(10, 20, 30, 40, 50);
  console.log('Statistics:', stats);

  // Test element selection overloads
  await selectElement('.button');
  await selectElement('.button', 2);
  await selectElement('.button', 'Submit');

  // Test data creation overloads
  const stringData = createTestData(5);
  const objectData = createTestData({ name: 'Test', type: 'user' });
  const multipleObjects = createTestData({ name: 'Test', type: 'user' }, 3);
  
  console.log('String data:', stringData);
  console.log('Object data:', objectData);
  console.log('Multiple objects:', multipleObjects);
}

testExercise3().catch(console.error);
```

## Exercise 4: Async Functions and Promises (25 minutes)

**Objective**: Master async function typing and Promise handling for test automation.

### Task 4.1: Async Utility Functions

```typescript
// File: src/exercise-4.ts

// TODO: Create an async function that waits for a condition
// Function signature: waitForCondition(condition: () => boolean, timeout?: number): Promise<boolean>
async function waitForCondition(
  condition: () => boolean,
  timeout: number = 5000
): Promise<boolean> {
  // Implementation here
}

// TODO: Create an async function that retries an operation
// Function signature: retryOperation<T>(operation: () => Promise<T>, maxRetries?: number, delay?: number): Promise<T>
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  // Implementation here
}

// TODO: Create an async function that runs operations in parallel
// Function signature: runInParallel<T>(operations: (() => Promise<T>)[]): Promise<T[]>
async function runInParallel<T>(
  operations: (() => Promise<T>)[]
): Promise<T[]> {
  // Implementation here
}

// TODO: Create an async function with timeout
// Function signature: withTimeout<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T>
async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  // Implementation here
}
```

### Task 4.2: API Testing Utilities

```typescript
// TODO: Define types for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// TODO: Create async functions for API testing
// Function signature: fetchUser(id: number): Promise<ApiResponse<User>>
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (id <= 0) {
    return { success: false, error: 'Invalid user ID' };
  }
  
  return {
    success: true,
    data: {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`
    }
  };
}

// TODO: Create a function that validates API responses
// Function signature: validateApiResponse<T>(response: ApiResponse<T>, validator: (data: T) => boolean): Promise<boolean>
async function validateApiResponse<T>(
  response: ApiResponse<T>,
  validator: (data: T) => boolean
): Promise<boolean> {
  // Implementation here
}
```

### Task 4.3: Testing the Functions

```typescript
// Test your implementations
console.log('=== Exercise 4 Tests ===');

async function testExercise4() {
  // Test condition waiting
  let counter = 0;
  const condition = () => ++counter > 3;
  const result = await waitForCondition(condition, 2000);
  console.log('Condition result:', result);

  // Test retry operation
  let attempts = 0;
  const flakyOperation = async () => {
    attempts++;
    if (attempts < 3) {
      throw new Error('Operation failed');
    }
    return 'Success!';
  };
  
  try {
    const retryResult = await retryOperation(flakyOperation);
    console.log('Retry result:', retryResult);
  } catch (error) {
    console.error('Retry failed:', error);
  }

  // Test parallel operations
  const operations = [
    () => Promise.resolve('Operation 1'),
    () => Promise.resolve('Operation 2'),
    () => Promise.resolve('Operation 3')
  ];
  
  const parallelResults = await runInParallel(operations);
  console.log('Parallel results:', parallelResults);

  // Test timeout
  const slowOperation = () => new Promise(resolve => setTimeout(() => resolve('Done'), 2000));
  
  try {
    const timeoutResult = await withTimeout(slowOperation, 1000);
    console.log('Timeout result:', timeoutResult);
  } catch (error) {
    console.error('Timeout error:', error);
  }

  // Test API functions
  const userResponse = await fetchUser(1);
  console.log('User response:', userResponse);
  
  const isValid = await validateApiResponse(
    userResponse,
    (user: User) => user.id > 0 && user.email.includes('@')
  );
  console.log('Validation result:', isValid);
}

testExercise4().catch(console.error);
```

## Exercise 5: Advanced Testing Patterns (20 minutes)

**Objective**: Implement advanced function patterns commonly used in test automation frameworks.

### Task 5.1: Test Framework Utilities

```typescript
// File: src/exercise-5.ts

// TODO: Define types for test framework
type TestFunction = () => Promise<void> | void;
type BeforeEachFunction = () => Promise<void> | void;
type AfterEachFunction = () => Promise<void> | void;

interface TestSuite {
  name: string;
  tests: TestCase[];
  beforeEach?: BeforeEachFunction;
  afterEach?: AfterEachFunction;
}

interface TestCase {
  name: string;
  fn: TestFunction;
  timeout?: number;
  skip?: boolean;
}

// TODO: Create a simple test runner
class SimpleTestRunner {
  private suites: TestSuite[] = [];

  // TODO: Method to describe a test suite
  // Method signature: describe(name: string, fn: () => void): void
  describe(name: string, fn: () => void): void {
    // Implementation here
  }

  // TODO: Method to define a test case
  // Method signature: it(name: string, fn: TestFunction, timeout?: number): void
  it(name: string, fn: TestFunction, timeout?: number): void {
    // Implementation here
  }

  // TODO: Method to set up before each test
  // Method signature: beforeEach(fn: BeforeEachFunction): void
  beforeEach(fn: BeforeEachFunction): void {
    // Implementation here
  }

  // TODO: Method to clean up after each test
  // Method signature: afterEach(fn: AfterEachFunction): void
  afterEach(fn: AfterEachFunction): void {
    // Implementation here
  }

  // TODO: Method to run all tests
  // Method signature: run(): Promise<void>
  async run(): Promise<void> {
    // Implementation here
  }
}
```

### Task 5.2: Custom Assertion Library

```typescript
// TODO: Create a custom assertion library
class Expect<T> {
  constructor(private actual: T) {}

  // TODO: Method to check equality
  // Method signature: toBe(expected: T): void
  toBe(expected: T): void {
    // Implementation here
  }

  // TODO: Method to check truthiness
  // Method signature: toBeTruthy(): void
  toBeTruthy(): void {
    // Implementation here
  }

  // TODO: Method to check if value is defined
  // Method signature: toBeDefined(): void
  toBeDefined(): void {
    // Implementation here
  }

  // TODO: Method to check array/string contains
  // Method signature: toContain(expected: any): void
  toContain(expected: any): void {
    // Implementation here
  }
}

// TODO: Create expect function
// Function signature: expect<T>(actual: T): Expect<T>
function expect<T>(actual: T): Expect<T> {
  return new Expect(actual);
}
```

### Task 5.3: Testing the Framework

```typescript
// Test your test framework implementation
console.log('=== Exercise 5 Tests ===');

const runner = new SimpleTestRunner();

// Example test suite
runner.describe('Math Operations', () => {
  let calculator: any;

  runner.beforeEach(() => {
    calculator = {
      add: (a: number, b: number) => a + b,
      multiply: (a: number, b: number) => a * b
    };
  });

  runner.it('should add two numbers', () => {
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });

  runner.it('should multiply two numbers', () => {
    const result = calculator.multiply(4, 5);
    expect(result).toBe(20);
  });

  runner.afterEach(() => {
    calculator = null;
  });
});

runner.describe('String Operations', () => {
  runner.it('should check string contains', () => {
    const text = 'Hello, World!';
    expect(text).toContain('World');
  });

  runner.it('should check truthiness', () => {
    expect('non-empty string').toBeTruthy();
    expect(42).toBeTruthy();
  });
});

// Run the tests
runner.run().catch(console.error);
```

## Validation and Testing

### Running Your Code

1. Compile and run each exercise:
   ```bash
   npx tsc src/exercise-1.ts --outDir dist
   node dist/exercise-1.js
   ```

2. Or compile all at once:
   ```bash
   npx tsc
   node dist/exercise-1.js
   node dist/exercise-2.js
   node dist/exercise-3.js
   node dist/exercise-4.js
   node dist/exercise-5.js
   ```

### Success Criteria

✅ **Exercise 1**: All functions compile without errors and produce expected output  
✅ **Exercise 2**: Functions handle optional parameters correctly and use appropriate defaults  
✅ **Exercise 3**: Rest parameters and function overloading work as expected  
✅ **Exercise 4**: Async functions handle Promises correctly and include proper error handling  
✅ **Exercise 5**: Test framework runs tests and assertions work correctly  

### Common Issues and Solutions

**Issue**: TypeScript compilation errors  
**Solution**: Check that all function signatures match the implementations and all types are properly defined

**Issue**: Runtime errors in async functions  
**Solution**: Ensure proper error handling with try-catch blocks and Promise rejection handling

**Issue**: Function overloading not working  
**Solution**: Make sure overload signatures are defined before the implementation and the implementation signature is compatible with all overloads

## Bonus Challenges

1. **Performance Testing**: Add timing measurements to your utility functions
2. **Error Handling**: Implement comprehensive error handling with custom error types
3. **Configuration**: Create a configuration system using function types for customizable behavior
4. **Mocking**: Build a simple mocking library using function types
5. **Validation**: Create a schema validation system using function composition

## Reflection Questions

1. How do function types improve code maintainability in test automation?
2. When would you choose function overloading over optional parameters?
3. How do async function types help with error handling in test scenarios?
4. What are the benefits of using rest parameters in testing utilities?
5. How can proper function typing help with team collaboration?

---

**Next**: Complete the [Assessment](../assessment.md) to test your understanding of function types and signatures.