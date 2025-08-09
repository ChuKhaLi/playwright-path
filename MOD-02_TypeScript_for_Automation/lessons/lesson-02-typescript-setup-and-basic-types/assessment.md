# Lesson 01: Assessment - TypeScript Setup and Basic Types

## 📋 Assessment Overview

This assessment evaluates your understanding of TypeScript fundamentals and their application to test automation scenarios. Complete all sections to demonstrate mastery of the lesson objectives.

**Time Allocation**: 45 minutes total
- Knowledge Check: 15 minutes
- Practical Assessment: 20 minutes
- Code Review: 10 minutes

## 🧠 Part 1: Knowledge Check (15 minutes)

### Multiple Choice Questions (10 points each)

**Question 1**: What is the primary benefit of using TypeScript in test automation?
a) Faster execution speed
b) Early error detection through static typing
c) Smaller file sizes
d) Better browser compatibility

**Question 2**: Which of the following is the correct way to declare a string array in TypeScript?
a) `let arr: string = ["a", "b", "c"];`
b) `let arr: string[] = ["a", "b", "c"];`
c) `let arr: Array = ["a", "b", "c"];`
d) `let arr: [string] = ["a", "b", "c"];`

**Question 3**: What will TypeScript infer as the type for this variable: `let count = 42;`?
a) any
b) string
c) number
d) object

**Question 4**: Which TypeScript compiler option specifies the output directory for compiled JavaScript?
a) `rootDir`
b) `outDir`
c) `target`
d) `module`

**Question 5**: What is the correct type annotation for a function parameter that accepts either a string or number?
a) `param: string | number`
b) `param: string & number`
c) `param: string, number`
d) `param: any`

### True/False Questions (5 points each)

**Question 6**: TypeScript code can run directly in the browser without compilation.
- [ ] True
- [ ] False

**Question 7**: Type inference means TypeScript automatically determines types when not explicitly specified.
- [ ] True
- [ ] False

**Question 8**: The `any` type should be used frequently to make TypeScript more flexible.
- [ ] True
- [ ] False

**Question 9**: TypeScript provides better IDE support compared to plain JavaScript.
- [ ] True
- [ ] False

**Question 10**: All JavaScript code is valid TypeScript code.
- [ ] True
- [ ] False

### Short Answer Questions (10 points each)

**Question 11**: Explain the difference between type inference and explicit type annotations. When would you use each approach?

**Answer**: _______________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

**Question 12**: List three specific benefits of using TypeScript in test automation projects.

**Answer**: 
1. _______________________________________________________________
2. _______________________________________________________________
3. _______________________________________________________________

**Question 13**: What is the purpose of the `tsconfig.json` file and name three important configuration options?

**Answer**: _______________________________________________________________
_____________________________________________________________________
Configuration options:
1. _______________________________________________________________
2. _______________________________________________________________
3. _______________________________________________________________

## 💻 Part 2: Practical Assessment (20 minutes)

### Coding Challenge 1: Test Data Setup (10 points)

Create a TypeScript file that defines test data for an e-commerce application. Your solution should include:

```typescript
// TODO: Complete this code with proper TypeScript types

// 1. Define a test user with proper typing
let testUser = {
    // Include: id, firstName, lastName, email, isActive, registrationDate
};

// 2. Define product test data
let testProducts = [
    // Array of products with: id, name, price, category, inStock
];

// 3. Define test configuration
let testConfig = {
    // Include: environment, baseUrl, timeout, retries, browsers
};

// 4. Create utility functions with proper typing
function generateTestEmail(prefix) {
    // Generate unique email with timestamp
}

function isValidPrice(price) {
    // Check if price is positive number
}

function formatCurrency(amount, currency) {
    // Format number as currency string
}
```

### Coding Challenge 2: API Response Handler (15 points)

Create a TypeScript module for handling API responses in tests:

```typescript
// TODO: Complete this API response handler

// 1. Define API response structure
interface ApiResponse {
    // Define proper structure for API responses
}

// 2. Define error response structure  
interface ErrorResponse {
    // Define structure for error responses
}

// 3. Create response validation function
function validateResponse(response) {
    // Validate response structure and status
}

// 4. Create data extraction function
function extractData(response) {
    // Extract data from valid response
}

// 5. Create error handler function
function handleError(error) {
    // Handle and format error responses
}

// 6. Export all functions and interfaces
```

### Requirements:
- Use proper TypeScript type annotations
- Include appropriate return types for all functions
- Handle both success and error scenarios
- Code should compile without TypeScript errors

## 🔍 Part 3: Code Review (10 minutes)

### Code Analysis Challenge

Review the following TypeScript code and identify issues:

```typescript
// Code Sample for Review
let user = {
    name: "John",
    age: "25",
    email: "john@example.com",
    isActive: true
};

function processUser(userData) {
    if (userData.age > 18) {
        return userData.name.toUpperCase();
    }
    return null;
}

let result = processUser(user);
console.log(result.length);

let numbers = [1, 2, "3", 4, 5];
let sum = 0;
for (let num of numbers) {
    sum += num;
}
```

### Questions:

**1. Identify Type Issues (10 points)**
List all type-related problems in the code above:
- Issue 1: _______________________________________________________________
- Issue 2: _______________________________________________________________
- Issue 3: _______________________________________________________________
- Issue 4: _______________________________________________________________

**2. Provide Corrected Code (15 points)**
Rewrite the code with proper TypeScript types:

```typescript
// Your corrected code here
```

**3. Explain Improvements (10 points)**
Explain how your corrections improve the code:
___________________________________________________________________
___________________________________________________________________
___________________________________________________________________

## ✅ Assessment Solutions

### Part 1: Knowledge Check Answers

1. **b)** Early error detection through static typing
2. **b)** `let arr: string[] = ["a", "b", "c"];`
3. **c)** number
4. **b)** `outDir`
5. **a)** `param: string | number`
6. **False** - TypeScript must be compiled to JavaScript
7. **True** - TypeScript infers types when not explicitly provided
8. **False** - `any` defeats the purpose of TypeScript's type safety
9. **True** - TypeScript provides enhanced IDE features
10. **True** - JavaScript is a subset of TypeScript

### Short Answer Sample Answers:

**Question 11**: Type inference allows TypeScript to automatically determine types based on assigned values, making code cleaner. Explicit annotations provide clarity and catch errors early, especially for function parameters and complex structures.

**Question 12**: 
1. Early error detection during development
2. Better IDE support with autocomplete and refactoring
3. Self-documenting code through type definitions

**Question 13**: `tsconfig.json` configures the TypeScript compiler behavior. Important options include: `target` (JavaScript version), `outDir` (output directory), and `strict` (strict type checking).

### Part 2: Sample Solutions

**Coding Challenge 1**:
```typescript
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    registrationDate: Date;
}

let testUser: User = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    isActive: true,
    registrationDate: new Date()
};

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}

let testProducts: Product[] = [
    {
        id: 1,
        name: "Laptop",
        price: 999.99,
        category: "Electronics",
        inStock: true
    }
];

interface TestConfig {
    environment: string;
    baseUrl: string;
    timeout: number;
    retries: number;
    browsers: string[];
}

let testConfig: TestConfig = {
    environment: "staging",
    baseUrl: "https://api.example.com",
    timeout: 30000,
    retries: 3,
    browsers: ["chromium", "firefox"]
};

function generateTestEmail(prefix: string): string {
    return `${prefix}${Date.now()}@example.com`;
}

function isValidPrice(price: number): boolean {
    return price > 0;
}

function formatCurrency(amount: number, currency: string = "USD"): string {
    return `${currency} ${amount.toFixed(2)}`;
}
```

### Part 3: Code Review Issues

**Issues Identified**:
1. `age` should be number, not string
2. `processUser` function lacks parameter and return type annotations
3. Potential null reference error when calling `.length` on result
4. Mixed array types (numbers and strings) without proper typing

**Corrected Code**:
```typescript
interface User {
    name: string;
    age: number;
    email: string;
    isActive: boolean;
}

let user: User = {
    name: "John",
    age: 25,
    email: "john@example.com",
    isActive: true
};

function processUser(userData: User): string | null {
    if (userData.age > 18) {
        return userData.name.toUpperCase();
    }
    return null;
}

let result: string | null = processUser(user);
if (result) {
    console.log(result.length);
}

let numbers: number[] = [1, 2, 3, 4, 5];
let sum: number = 0;
for (let num of numbers) {
    sum += num;
}
```

## 📊 Grading Rubric

| Component | Excellent (90-100%) | Good (80-89%) | Satisfactory (70-79%) | Needs Improvement (<70%) |
|-----------|-------------------|---------------|---------------------|------------------------|
| **Knowledge Check** | All answers correct with clear understanding | Most answers correct with good understanding | Some answers correct with basic understanding | Many incorrect answers |
| **Practical Coding** | Perfect TypeScript syntax, all requirements met | Good TypeScript usage, most requirements met | Basic TypeScript usage, some requirements met | Poor TypeScript usage, few requirements met |
| **Code Review** | All issues identified and correctly fixed | Most issues identified and fixed | Some issues identified and fixed | Few issues identified or fixed |
| **Type Safety** | Excellent use of TypeScript features | Good use of type annotations | Basic type usage | Minimal or incorrect type usage |

## 🎯 Success Criteria

To pass this assessment, you must:
- [ ] Score at least 70% on the knowledge check
- [ ] Complete both practical coding challenges with working TypeScript code
- [ ] Identify at least 3 issues in the code review section
- [ ] Demonstrate understanding of basic TypeScript concepts
- [ ] Show ability to apply TypeScript to testing scenarios

## 📝 Feedback and Next Steps

### Areas for Improvement
Based on your assessment results, focus on:
- [ ] Type annotation syntax and usage
- [ ] Understanding TypeScript compiler configuration
- [ ] Applying types to real-world testing scenarios
- [ ] Debugging TypeScript compilation errors

### Preparation for Next Lesson
Before proceeding to Lesson 02 (Object Types and Annotations):
- [ ] Review any incorrect answers from this assessment
- [ ] Practice with TypeScript Playground
- [ ] Ensure comfortable with basic type syntax
- [ ] Complete any missed exercises from the hands-on practice

---

**Navigation**:
- [← Lesson Content](content.md)
- [← Exercises](exercises/hands-on-practice.md)
- [Next Lesson: Object Types →](../lesson-02-object-types-and-annotations/README.md)