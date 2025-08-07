# Assessment: Function Types and Signatures

## Overview

This assessment evaluates your understanding of TypeScript function types and signatures in the context of test automation. The assessment consists of multiple-choice questions, practical coding challenges, and scenario-based problems.

**Duration**: 45-60 minutes  
**Passing Score**: 75% (18/24 points)  
**Format**: Mixed (Multiple choice, code analysis, practical implementation)

## Part A: Knowledge Check (12 points)

### Question 1 (2 points)
Which of the following is the correct way to define a function type with optional parameters?

A) `function processData(data: string, options: object?): void`
B) `function processData(data: string, options?: object): void`
C) `function processData(data: string, ?options: object): void`
D) `function processData(data: string, options: object | undefined): void`

**Answer**: B
**Explanation**: Optional parameters in TypeScript are denoted with a `?` after the parameter name, before the colon.

### Question 2 (2 points)
What is the return type of this async function?

```typescript
async function fetchUserData(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

A) `User`
B) `Promise<User>`
C) `Promise<Promise<User>>`
D) `any`

**Answer**: B
**Explanation**: Async functions always return a Promise, so the return type is `Promise<User>` even though the function body returns `User`.

### Question 3 (2 points)
Which function signature correctly implements function overloading for element selection?

A)
```typescript
function selectElement(selector: string): void;
function selectElement(selector: string, index: number): void;
function selectElement(selector: string, indexOrText?: number | string): void {
  // implementation
}
```

B)
```typescript
function selectElement(selector: string, indexOrText?: number | string): void {
  // implementation
}
function selectElement(selector: string): void;
function selectElement(selector: string, index: number): void;
```

C)
```typescript
function selectElement(selector: string): void;
function selectElement(selector: string, index: number): void;
function selectElement(selector: string, indexOrText?: number | string): void {
  // implementation
}
```

D) Both A and C are correct

**Answer**: C
**Explanation**: Overload signatures must come before the implementation signature, and the implementation signature must be compatible with all overloads.

### Question 4 (2 points)
What is the purpose of rest parameters in function signatures?

A) To make all parameters optional
B) To allow a function to accept a variable number of arguments
C) To provide default values for parameters
D) To enable function overloading

**Answer**: B
**Explanation**: Rest parameters (`...args`) allow functions to accept any number of arguments of the specified type.

### Question 5 (2 points)
Which of the following is the best practice for typing utility functions in test automation?

A) Always use `any` type for flexibility
B) Use explicit return types for public APIs
C) Avoid optional parameters to reduce complexity
D) Never use generic types

**Answer**: B
**Explanation**: Explicit return types make the function contract clear and help catch errors early, especially important for utility functions used across the codebase.

### Question 6 (2 points)
What is the difference between these two function types?

```typescript
type AsyncFunction1 = () => Promise<void>;
type AsyncFunction2 = () => void;
```

A) No difference, both represent async functions
B) AsyncFunction1 is for async functions, AsyncFunction2 is for sync functions
C) AsyncFunction1 returns a Promise, AsyncFunction2 returns nothing
D) Both B and C are correct

**Answer**: D
**Explanation**: AsyncFunction1 represents functions that return Promises (typically async functions), while AsyncFunction2 represents synchronous functions that return nothing.

## Part B: Code Analysis (6 points)

### Question 7 (3 points)
Analyze the following code and identify the issues:

```typescript
function waitForElement(selector, timeout = 5000, visible) {
  return new Promise((resolve, reject) => {
    // implementation
  });
}

const result = waitForElement('#button', true);
```

**Issues to identify**:
1. Missing type annotations for parameters
2. Incorrect parameter order (optional parameters should come last)
3. Missing return type annotation
4. Incorrect usage (passing boolean for timeout)

**Corrected version**:
```typescript
function waitForElement(
  selector: string, 
  timeout: number = 5000, 
  visible?: boolean
): Promise<void> {
  return new Promise((resolve, reject) => {
    // implementation
  });
}

const result = waitForElement('#button', 5000, true);
```

### Question 8 (3 points)
What will be the inferred types for the following function and its usage?

```typescript
function createTestData(template, count = 1) {
  return Array.from({ length: count }, () => ({ ...template, id: Math.random() }));
}

const users = createTestData({ name: 'John', email: 'john@test.com' }, 3);
const products = createTestData({ title: 'Product', price: 100 });
```

**Answer**:
- `template` parameter: `any`
- `count` parameter: `number`
- Return type: `any[]`
- `users` type: `any[]`
- `products` type: `any[]`

**Better typed version**:
```typescript
function createTestData<T>(template: T, count: number = 1): (T & { id: number })[] {
  return Array.from({ length: count }, () => ({ ...template, id: Math.random() }));
}
```

## Part C: Practical Implementation (6 points)

### Question 9 (6 points)
Implement a comprehensive test utility function with the following requirements:

1. **Function Name**: `executeTestStep`
2. **Parameters**:
   - `stepName`: string (required)
   - `action`: async function that returns void (required)
   - `options`: object with optional properties:
     - `timeout`: number (default: 30000)
     - `retries`: number (default: 0)
     - `skipOnFailure`: boolean (default: false)
3. **Return Type**: Promise that resolves to a test result object
4. **Features**:
   - Execute the action with timeout
   - Retry on failure if retries > 0
   - Log step execution details
   - Handle errors gracefully
   - Return execution results

**Expected Implementation**:

```typescript
interface TestStepOptions {
  timeout?: number;
  retries?: number;
  skipOnFailure?: boolean;
}

interface TestStepResult {
  stepName: string;
  success: boolean;
  duration: number;
  error?: string;
  attempts: number;
}

async function executeTestStep(
  stepName: string,
  action: () => Promise<void>,
  options: TestStepOptions = {}
): Promise<TestStepResult> {
  const { timeout = 30000, retries = 0, skipOnFailure = false } = options;
  const startTime = Date.now();
  let attempts = 0;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    attempts++;
    try {
      console.log(`Executing step: ${stepName} (attempt ${attempts})`);
      
      // Execute with timeout
      await Promise.race([
        action(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
        )
      ]);
      
      const duration = Date.now() - startTime;
      console.log(`Step completed: ${stepName} (${duration}ms)`);
      
      return {
        stepName,
        success: true,
        duration,
        attempts
      };
    } catch (error) {
      lastError = error as Error;
      console.log(`Step failed: ${stepName} - ${lastError.message}`);
      
      if (attempt < retries) {
        console.log(`Retrying step: ${stepName} (${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
      }
    }
  }

  const duration = Date.now() - startTime;
  const result: TestStepResult = {
    stepName,
    success: false,
    duration,
    error: lastError?.message || 'Unknown error',
    attempts
  };

  if (!skipOnFailure) {
    throw new Error(`Test step failed: ${stepName} - ${result.error}`);
  }

  return result;
}
```

**Usage Example**:
```typescript
// Test the implementation
async function testExecuteTestStep() {
  // Successful step
  const result1 = await executeTestStep(
    'Click login button',
    async () => {
      console.log('Clicking login button...');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  );
  console.log('Result 1:', result1);

  // Step with retry
  let attemptCount = 0;
  const result2 = await executeTestStep(
    'Flaky operation',
    async () => {
      attemptCount++;
      if (attemptCount < 3) {
        throw new Error('Simulated failure');
      }
      console.log('Operation succeeded on attempt', attemptCount);
    },
    { retries: 3 }
  );
  console.log('Result 2:', result2);

  // Step that skips on failure
  const result3 = await executeTestStep(
    'Optional step',
    async () => {
      throw new Error('This step always fails');
    },
    { skipOnFailure: true }
  );
  console.log('Result 3:', result3);
}

testExecuteTestStep().catch(console.error);
```

**Grading Criteria**:
- **2 points**: Correct function signature with proper types
- **2 points**: Proper implementation of timeout and retry logic
- **1 point**: Correct error handling and result object structure
- **1 point**: Code quality and best practices

## Answer Key

### Part A: Knowledge Check
1. B - Optional parameters use `?` after parameter name
2. B - Async functions return Promise<T>
3. C - Overload signatures before implementation
4. B - Rest parameters accept variable arguments
5. B - Explicit return types for clarity
6. D - Different function types for async/sync

### Part B: Code Analysis
7. **Issues**: Missing types, wrong parameter order, missing return type, incorrect usage
8. **Types**: All inferred as `any` due to lack of type annotations

### Part C: Practical Implementation
9. **Full implementation** as shown above with proper typing, error handling, and retry logic

## Scoring Guide

**Excellent (22-24 points)**:
- Demonstrates mastery of function types and signatures
- Correctly implements complex async patterns
- Shows understanding of TypeScript best practices
- Code is clean, well-typed, and follows conventions

**Good (18-21 points)**:
- Shows solid understanding of function types
- Minor issues with implementation or typing
- Generally follows best practices
- Code works correctly with small improvements needed

**Satisfactory (15-17 points)**:
- Basic understanding of function types
- Some implementation issues or missing features
- Inconsistent application of TypeScript principles
- Code needs significant improvements

**Needs Improvement (< 15 points)**:
- Limited understanding of function types
- Major implementation issues
- Poor or missing type annotations
- Code doesn't meet requirements

## Remediation Resources

If you scored below 75%, review these topics:

1. **Function Type Annotations**: Review basic function typing syntax
2. **Optional and Default Parameters**: Practice parameter patterns
3. **Async Function Types**: Study Promise typing and async/await
4. **Function Overloading**: Understand overload signatures
5. **Best Practices**: Review TypeScript coding conventions

**Recommended Practice**:
- Complete additional exercises from the hands-on practice
- Review the lesson content focusing on weak areas
- Practice implementing utility functions with proper typing
- Study real-world test automation code examples

---

**Next Steps**: After passing this assessment, proceed to [Lesson 04: Arrays and Tuples](../lesson-04-arrays-and-tuples/README.md)