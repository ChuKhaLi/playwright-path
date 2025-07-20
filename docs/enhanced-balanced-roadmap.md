# Enhanced Balanced Roadmap: Learning Playwright QA Automation
## API Testing + E2E Testing Integration

This document provides an enhanced, balanced breakdown of the Learning Playwright project with comprehensive coverage of both API testing and E2E testing. The curriculum has been restructured to achieve ~15-20% API testing coverage while maintaining strong E2E testing capabilities.

> 📚 **Navigation**:
> - [Project Overview](project-overview.md) - Executive summary and research findings
> - [Learning Roadmap](learning-roadmap.md) - High-level roadmap overview
> - [Implementation Guide](implementation-guide.md) - Content creation guide
> - [Resource Documentation](resources/README.md) - 25+ curated resources
> - [Learning Paths](resources/guides/learning-paths.md) - Personalized learning journeys

---

## 📋 Executive Summary

### Enhanced 7-Module Structure Overview

The enhanced Learning Playwright roadmap integrates comprehensive API testing throughout the curriculum while maintaining strong E2E testing coverage. This balanced approach ensures learners develop expertise in both testing methodologies.

| Module | Name | Duration | Lessons | API Lessons | E2E Lessons | Key Focus |
|--------|------|----------|---------|-------------|-------------|-----------|
| **MOD-01** | Foundations of Web Technologies | 4-5 weeks | 12 lessons | 3 lessons | 2 lessons | HTML, CSS, HTTP, APIs, DevTools |
| **MOD-02** | TypeScript for Automation | 5-6 weeks | 14 lessons | 3 lessons | 2 lessons | TypeScript fundamentals + API patterns |
| **MOD-03** | Playwright Fundamentals | 4-5 weeks | 16 lessons | 4 lessons | 8 lessons | Setup, locators, actions, API + E2E intro |
| **MOD-04** | Advanced Playwright Techniques | 6-7 weeks | 16 lessons | 6 lessons | 6 lessons | Auth, network, API testing, E2E advanced |
| **MOD-05** | Test Design and Architecture | 5-6 weeks | 12 lessons | 3 lessons | 5 lessons | POM, API patterns, architecture |
| **MOD-06** | CI/CD and DevOps Integration | 4-5 weeks | 10 lessons | 2 lessons | 4 lessons | GitHub Actions, Docker, API + E2E in CI |
| **MOD-07** | Advanced Topics and Specialization | 5-7 weeks | 12 lessons | 3 lessons | 5 lessons | Visual, performance, API security, E2E advanced |

**Enhanced Totals**: 
- **Total Duration**: 33-41 weeks 
- **Total Lessons**: 92 lessons (+16 from original)
- **API Testing**: 24 lessons (~26% coverage)
- **E2E Testing**: 32 lessons (~35% coverage) 
- **Foundation/Other**: 36 lessons (~39% coverage)
- **Total Time**: 250-350 hours

---

## 🏗️ Detailed Module Breakdown

## MOD-01: Foundations of Web Technologies (Enhanced)

**Duration**: 4-5 weeks | **Time Commitment**: 12-15 hours/week | **Prerequisites**: None

### Module Overview
Establishes foundational understanding of web technologies essential for both API and E2E automation testing. Enhanced with comprehensive API fundamentals and REST principles.

### Enhanced Lesson Breakdown

#### **Lesson 1.1: HTML Document Structure and Semantic Elements**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Understand HTML5 document structure and identify semantic elements

**Documentation**: 
- HTML5 document structure (DOCTYPE, html, head, body)
- Semantic elements (header, nav, main, section, article, aside, footer)
- Difference between semantic and non-semantic elements
- Impact on both visual testing and API data structure

**Example**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Page</title>
</head>
<body>
    <header>
        <nav>Navigation</nav>
    </header>
    <main>
        <section data-testid="content-section">Content Section</section>
    </main>
    <footer>Footer Content</footer>
</body>
</html>
```

**Practical Test**:
- Create a basic HTML page with proper semantic structure
- Include at least 5 different semantic elements
- Add data-testid attributes for automation
- Validate HTML using W3C validator

**Resources**:
- [MDN Web Docs - HTML](docs/resources/specifications/01-official-documentation/mdn-web-docs.md) ⭐⭐⭐⭐⭐
- [freeCodeCamp - HTML Basics](docs/resources/specifications/02-educational-platforms/freecodecamp-javascript-testing.md) ⭐⭐⭐⭐

#### **Lesson 1.2: HTML Forms and Input Elements**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Master HTML form elements and input types for automation testing

**Documentation**: 
- Form element structure and attributes
- Input types (text, email, password, checkbox, radio, select)
- Form validation attributes (required, pattern, min, max)
- Form submission methods and data handling

**Example**:
```html
<form id="loginForm" action="/api/auth/login" method="post">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required data-testid="email-input">
    
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required data-testid="password-input">
    
    <input type="checkbox" id="remember" name="remember" data-testid="remember-checkbox">
    <label for="remember">Remember me</label>
    
    <button type="submit" data-testid="login-button">Login</button>
</form>
```

**Practical Test**:
- Create a registration form with 5 different input types
- Include proper labels and validation attributes
- Test form submission behavior
- Understand form data structure for API testing

**Resources**:
- [MDN Web Docs - HTML Forms](docs/resources/specifications/01-official-documentation/mdn-web-docs.md) ⭐⭐⭐⭐⭐
- [The Odin Project - Forms](docs/resources/specifications/02-educational-platforms/the-odin-project.md) ⭐⭐⭐⭐

#### **Lesson 1.3: CSS Selectors Fundamentals**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Write effective CSS selectors for element identification

**Documentation**: 
- Basic selectors (element, class, ID)
- Attribute selectors
- Pseudo-class selectors (:hover, :focus, :nth-child)
- Selector specificity and performance

**Example**:
```css
/* Element selector */
button { background-color: blue; }

/* Class selector */
.primary-button { color: white; }

/* ID selector */
#submit-btn { font-weight: bold; }

/* Attribute selector */
input[type="email"] { border: 1px solid gray; }

/* Data attribute selector for testing */
[data-testid="login-button"] { cursor: pointer; }

/* Pseudo-class selector */
button:hover { background-color: darkblue; }
```

**Practical Test**:
- Write selectors to target specific elements on a practice page
- Use at least 5 different selector types
- Verify selectors work in browser DevTools
- Practice with data-testid attributes

**Resources**:
- [MDN Web Docs - CSS Selectors](docs/resources/specifications/01-official-documentation/mdn-web-docs.md) ⭐⭐⭐⭐⭐
- CSS Selector Practice Tool

#### **Lesson 1.4: Advanced CSS Selectors and Combinators**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Use complex CSS selectors and combinators for precise element targeting

**Documentation**: 
- Combinators (descendant, child, adjacent sibling, general sibling)
- Complex pseudo-selectors (:not(), :has(), :is())
- CSS specificity rules
- Performance considerations for automation

**Example**:
```css
/* Descendant combinator */
.container p { margin: 10px; }

/* Child combinator */
.menu > li { display: inline-block; }

/* Adjacent sibling */
h2 + p { font-weight: bold; }

/* Complex pseudo-selector */
input:not([type="hidden"]) { display: block; }

/* Testing-specific selectors */
[data-testid]:not([data-testid=""]) { outline: 1px solid red; }
```

**Practical Test**:
- Create selectors for complex nested structures
- Use combinators to target specific relationships
- Practice with CSS specificity challenges
- Build selectors for automation testing

**Resources**:
- [MDN Web Docs - CSS Combinators](docs/resources/specifications/01-official-documentation/mdn-web-docs.md) ⭐⭐⭐⭐⭐
- CSS Specificity Calculator

#### **Lesson 1.5: XPath Fundamentals**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Write basic XPath expressions for element selection

**Documentation**: 
- XPath syntax and structure
- Absolute vs relative paths
- Basic XPath axes (child, parent, following-sibling)
- When to use XPath vs CSS selectors

**Example**:
```xpath
<!-- Absolute path -->
/html/body/div[1]/form/input[@type='email']

<!-- Relative path -->
//input[@type='email']

<!-- Using text content -->
//button[text()='Submit']

<!-- Using contains -->
//div[contains(@class, 'error-message')]

<!-- Data attribute selection -->
//*[@data-testid='login-button']
```

**Practical Test**:
- Write XPath expressions for form elements
- Use both absolute and relative paths
- Practice with text-based selection
- Compare XPath vs CSS selector performance

**Resources**:
- XPath Tutorial and Reference
- XPath Practice Tool

#### **Lesson 1.6: Advanced XPath Techniques**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Master advanced XPath expressions for complex element selection

**Documentation**: 
- XPath functions (contains(), starts-with(), normalize-space())
- Multiple conditions and logical operators
- XPath axes (ancestor, descendant, following, preceding)
- XPath performance optimization

**Example**:
```xpath
<!-- Multiple conditions -->
//input[@type='text' and @required]

<!-- Using functions -->
//div[contains(@class, 'alert') and contains(text(), 'Error')]

<!-- Complex navigation -->
//label[text()='Email']/following-sibling::input

<!-- Ancestor navigation -->
//input[@id='email']/ancestor::form

<!-- Position-based selection -->
//ul[@class='menu']/li[position()>1 and position()<5]
```

**Practical Test**:
- Create XPath expressions for dynamic content
- Use functions and multiple conditions
- Navigate complex DOM structures
- Build robust selectors for automation

**Resources**:
- Advanced XPath Guide
- XPath Cheat Sheet

#### **Lesson 1.7: Browser Developer Tools Mastery**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Navigate and use all DevTools panels effectively

**Documentation**: 
- Elements panel for DOM inspection
- Console panel for JavaScript execution
- Network panel for request monitoring
- Sources panel for debugging
- Application panel for storage inspection

**Example**:
```javascript
// Console commands
document.querySelector('#email')
$('#email') // jQuery-style selector
$x('//input[@type="email"]') // XPath in console

// Network monitoring
// Filter by XHR requests
// Inspect request/response headers
// Monitor API calls

// Storage inspection
localStorage.getItem('authToken')
sessionStorage.setItem('testData', JSON.stringify({test: true}))
```

**Practical Test**:
- Inspect and modify HTML/CSS in real-time
- Monitor network requests during form submission
- Use console to test selectors
- Analyze API requests and responses

**Resources**:
- Browser DevTools Documentation
- DevTools Tips and Tricks

#### **Lesson 1.8: HTTP Protocol Fundamentals** ⭐ **API FOCUS**
**Duration**: 1-2 hours | **Type**: API Foundation
**Learning Outcome**: Understand HTTP methods, status codes, and request/response structure

**Documentation**: 
- HTTP methods (GET, POST, PUT, DELETE, PATCH)
- HTTP status codes (2xx, 3xx, 4xx, 5xx)
- Request and response headers
- HTTP message structure
- Content-Type and Accept headers

**Example**:
```http
GET /api/users HTTP/1.1
Host: example.com
Accept: application/json
Authorization: Bearer token123
Content-Type: application/json

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 156
Cache-Control: no-cache

{"users": [{"id": 1, "name": "John", "email": "john@example.com"}]}
```

**Practical Test**:
- Analyze HTTP requests using DevTools
- Identify different HTTP methods in web applications
- Interpret status codes and headers
- Understand request/response lifecycle

**Resources**:
- [MDN Web Docs - HTTP](docs/resources/specifications/01-official-documentation/mdn-web-docs.md) ⭐⭐⭐⭐⭐
- HTTP Status Code Reference

#### **Lesson 1.9: JSON Data Structures and API Responses** ⭐ **API FOCUS**
**Duration**: 1-2 hours | **Type**: API Foundation
**Learning Outcome**: Read, write, and manipulate JSON data structures for API testing

**Documentation**: 
- JSON syntax rules and data types
- Nested objects and arrays
- JSON parsing and stringification
- Common API response patterns
- Error response structures

**Example**:
```json
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {
      "theme": "dark",
      "notifications": true
    },
    "roles": ["user", "admin"],
    "metadata": {
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-01-20T14:22:33Z"
    }
  },
  "status": "success",
  "timestamp": "2024-01-20T15:00:00Z"
}
```

**API Error Response Example**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  },
  "status": "error",
  "timestamp": "2024-01-20T15:00:00Z"
}
```

**Practical Test**:
- Create complex JSON structures for test data
- Parse JSON responses from APIs
- Validate JSON syntax and structure
- Handle nested data and arrays

**Resources**:
- JSON Tutorial and Validator
- JSON Schema Documentation

#### **Lesson 1.10: REST API Principles and Design** ⭐ **API FOCUS**
**Duration**: 1-2 hours | **Type**: API Foundation
**Learning Outcome**: Understand REST principles and API design patterns

**Documentation**: 
- REST architectural principles
- Resource-based URL design
- HTTP methods and their semantics
- Stateless communication
- HATEOAS concepts
- API versioning strategies

**Example**:
```javascript
// REST API examples
GET /api/v1/users          // Get all users
GET /api/v1/users/123      // Get specific user
POST /api/v1/users         // Create new user
PUT /api/v1/users/123      // Update entire user
PATCH /api/v1/users/123    // Partial update
DELETE /api/v1/users/123   // Delete user

// Nested resources
GET /api/v1/users/123/orders     // Get user's orders
POST /api/v1/users/123/orders    // Create order for user

// Query parameters
GET /api/v1/users?page=2&limit=10&sort=name
GET /api/v1/products?category=electronics&price_min=100
```

**Practical Test**:
- Explore public REST APIs using browser or Postman
- Understand API documentation structure
- Make basic API requests
- Analyze REST API design patterns

**Resources**:
- REST API Tutorial
- Public APIs for Practice
- API Design Best Practices

#### **Lesson 1.11: API Documentation and Testing Tools** ⭐ **API FOCUS**
**Duration**: 1-2 hours | **Type**: API Foundation
**Learning Outcome**: Read API documentation and use basic testing tools

**Documentation**: 
- OpenAPI/Swagger documentation
- Postman basics for API testing
- cURL command line usage
- API authentication methods
- Rate limiting and quotas

**Example**:
```bash
# cURL examples
curl -X GET "https://api.example.com/users" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer your-token"

curl -X POST "https://api.example.com/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

**Postman Collection Example**:
```json
{
  "info": {
    "name": "User API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Users",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{authToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    }
  ]
}
```

**Practical Test**:
- Read and understand API documentation
- Create basic Postman collection
- Use cURL for API requests
- Test different authentication methods

**Resources**:
- Postman Learning Center
- OpenAPI Specification Guide
- cURL Documentation

#### **Lesson 1.12: Web Application Architecture for Testing** ⭐ **E2E FOCUS**
**Duration**: 1-2 hours | **Type**: E2E Foundation
**Learning Outcome**: Understand web application architecture from testing perspective

**Documentation**: 
- Client-server architecture
- Frontend-backend communication
- Database interactions
- Third-party integrations
- Testing implications of architecture

**Example**:
```javascript
// Frontend-Backend Communication Flow
// 1. User interaction triggers frontend event
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 2. Frontend makes API call
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });
  
  // 3. Handle API response
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    window.location.href = '/dashboard';
  } else {
    // 4. Display error to user
    document.getElementById('error').textContent = 'Login failed';
  }
});
```

**Practical Test**:
- Identify different layers in web applications
- Trace user interactions through the system
- Understand data flow for testing scenarios
- Map testing strategies to architecture components

**Resources**:
- Web Architecture Fundamentals
- Testing Strategy Guide

---

## MOD-02: TypeScript for Automation (Enhanced)

**Duration**: 5-6 weeks | **Time Commitment**: 12-15 hours/week | **Prerequisites**: MOD-01

### Module Overview
Comprehensive TypeScript education focused on features most relevant to both API and E2E test automation, with enhanced coverage of API-specific patterns and data handling.

### Enhanced Lesson Breakdown

#### **Lesson 2.1: TypeScript Setup and Basic Types**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Set up TypeScript environment and understand basic type system

**Documentation**: 
- TypeScript vs JavaScript differences
- Installation and configuration
- Basic types: string, number, boolean, array
- Type inference and explicit typing

**Example**:
```typescript
// Basic types
let username: string = "john_doe";
let age: number = 25;
let isActive: boolean = true;
let scores: number[] = [85, 92, 78];

// Type inference
let message = "Hello"; // TypeScript infers string type

// Testing-specific types
let testData: string[] = ["user1", "user2", "admin"];
let apiResponse: number = 200;
```

**Practical Test**:
- Set up TypeScript project with proper configuration
- Create variables with explicit type annotations
- Use TypeScript compiler to check for errors
- Configure for testing environment

**Resources**:
- [TypeScript Handbook - Basic Types](docs/resources/specifications/01-official-documentation/typescript-handbook.md) ⭐⭐⭐⭐⭐
- [TypeScript Course - Programming with Mosh](docs/resources/specifications/03-video-resources/typescript-course-mosh.md) ⭐⭐⭐⭐

#### **Lesson 2.2: Object Types and Type Annotations**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Define and use object types with proper annotations

**Documentation**: 
- Object type annotations
- Optional properties with ?
- Readonly properties
- Index signatures
- Nested object types

**Example**:
```typescript
// Object type annotation
let user: {
  id: number;
  name: string;
  email?: string; // Optional property
  readonly createdAt: Date; // Readonly property
} = {
  id: 1,
  name: "John Doe",
  createdAt: new Date()
};

// Index signature for dynamic properties
let userPreferences: { [key: string]: any } = {
  theme: "dark",
  language: "en"
};

// Testing data structures
let testUser: {
  credentials: {
    email: string;
    password: string;
  };
  profile: {
    firstName: string;
    lastName: string;
  };
} = {
  credentials: {
    email: "test@example.com",
    password: "password123"
  },
  profile: {
    firstName: "Test",
    lastName: "User"
  }
};
```

**Practical Test**:
- Create complex object types for test data
- Use optional and readonly properties
- Implement index signatures for dynamic properties
- Design types for API responses

**Resources**:
- [TypeScript Handbook - Object Types](docs/resources/specifications/01-official-documentation/typescript-handbook.md) ⭐⭐⭐⭐⭐
- TypeScript Playground for Practice

#### **Lesson 2.3: Function Types and Signatures**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Define function types, parameters, and return types

**Documentation**: 
- Function type annotations
- Optional and default parameters
- Rest parameters
- Function overloading
- Async function types

**Example**:
```typescript
// Function with typed parameters and return type
function calculateTotal(price: number, tax: number = 0.1): number {
  return price * (1 + tax);
}

// Function type annotation
let validator: (input: string) => boolean;

// Arrow function with types
const formatUser = (name: string, age?: number): string => {
  return age ? `${name} (${age})` : name;
};

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// Async function for API calls
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Testing utility functions
function waitForElement(selector: string, timeout: number = 5000): Promise<Element> {
  return new Promise((resolve, reject) => {
    // Implementation
  });
}
```

**Practical Test**:
- Create utility functions for test automation
- Use optional parameters and default values
- Implement function overloading
- Write async functions for API testing

**Resources**:
- [TypeScript Handbook - Functions](docs/resources/specifications/01-official-documentation/typescript-handbook.md) ⭐⭐⭐⭐⭐
- Function Type Examples

#### **Lesson 2.4: Arrays and Tuples**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Work with typed arrays and tuple types

**Documentation**: 
- Array type annotations
- Generic array syntax
- Tuple types and their uses
- Array methods with types
- Readonly arrays

**Example**:
```typescript
// Array types
let userIds: number[] = [1, 2, 3, 4];
let userNames: Array<string> = ["John", "Jane", "Bob"];

// Tuple types
let userInfo: [number, string, boolean] = [1, "John", true];

// Array of objects
let users: { id: number; name: string }[] = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" }
];

// Readonly arrays
let readonlyIds: readonly number[] = [1, 2, 3];

// Testing data arrays
let testScenarios: [string, any, number][] = [
  ["valid login", { email: "test@example.com", password: "pass123" }, 200],
  ["invalid email", { email: "invalid", password: "pass123" }, 400],
  ["missing password", { email: "test@example.com" }, 400]
];

// API response arrays
let apiResponses: Array<{
  status: number;
  data: any;
  timestamp: Date;
}> = [];
```

**Practical Test**:
- Create typed arrays for test data
- Use tuples for structured data
- Implement array utility functions
- Handle API response arrays

**Resources**:
- [TypeScript Handbook - Arrays](docs/resources/specifications/01-official-documentation/typescript-handbook.md) ⭐⭐⭐⭐⭐
- Array Method Type Examples

#### **Lesson 2.5: Union and Intersection Types**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Use union and intersection types for flexible type definitions

**Documentation**: 
- Union types with |
- Intersection types with &
- Type guards and narrowing
- Discriminated unions
- Literal types

**Example**:
```typescript
// Union types
type Status = "pending" | "approved" | "rejected";
let currentStatus: Status = "pending";

// Union with different types
let id: string | number = "user123";

// Intersection types
type User = { name: string; email: string };
type Admin = { permissions: string[] };
type AdminUser = User & Admin;

// Type guards
function isString(value: string | number): value is string {
  return typeof value === "string";
}

// Testing-specific unions
type TestResult = "pass" | "fail" | "skip";
type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Discriminated unions for API responses
type ApiResponse = 
  | { status: "success"; data: any }
  | { status: "error"; error: string };

function handleApiResponse(response: ApiResponse) {
  if (response.status === "success") {
    // TypeScript knows this is success response
    console.log(response.data);
  } else {
    // TypeScript knows this is error response
    console.error(response.error);
  }
}
```

**Practical Test**:
- Create union types for test scenarios
- Use intersection types for complex objects
- Implement type guards for runtime checking
- Handle API response variations

**Resources**:
- [TypeScript Handbook - Union Types](docs/resources/specifications/01-official-documentation/typescript-handbook.md) ⭐⭐⭐⭐⭐
- [ExecuteProgram - TypeScript](docs/resources/specifications/02-educational-platforms/executeprogram-typescript.md) ⭐⭐⭐⭐

#### **Lesson 2.6: Interfaces and Type Aliases**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Define and use interfaces and type aliases effectively

**Documentation**: 
- Interface declarations
- Interface extension with extends
- Type aliases vs interfaces
- When to use each approach
- Interface merging

**Example**:
```typescript
// Interface definition
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean;
}

// Interface extension
interface AdminUser extends User {
  permissions: string[];
  lastLogin: Date;
}

// Type alias
type UserStatus = "active" | "inactive" | "suspended";

// Interface with methods
interface UserService {
  getUser(id: number): Promise<User>;
  createUser(userData: Omit<User, 'id'>): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
}

// Testing interfaces
interface TestCase {
  name: string;
  input: any;
  expected: any;
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
}

// API interfaces
interface ApiRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
}

interface ApiResponse<T = any> {
  status: number;
  headers: Record<string, string>;
  data: T;
  timestamp: Date;
}
```

**Practical Test**:
- Design interfaces for test data structures
- Use interface extension for hierarchical types
- Create service interfaces for API interactions
- Implement testing framework interfaces

**Resources**:
- [TypeScript Handbook - Interfaces](docs/resources/specifications/01-official-documentation/typescript-handbook.md) ⭐⭐⭐⭐⭐
- Interface Design Patterns

#### **Lesson 2.7: Classes and Object-Oriented Programming**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Create and use classes with proper TypeScript features

**Documentation**: 
- Class declarations and constructors
- Access modifiers (public, private, protected)
- Static members and methods
- Abstract classes
- Class inheritance

**Example**:
```typescript
// Basic class
class User {
  private _id: number;
  public name: string;
  protected email: string;

  constructor
⭐⭐⭐
- [Microsoft Learn - Playwright Setup](docs/resources/specifications/01-official-documentation/microsoft-learn-playwright.md) ⭐⭐⭐⭐⭐

#### **Lesson 3.2: Project Structure and Configuration Files**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Understand Playwright project structure and configuration options for both API and E2E testing

**Documentation**: 
- playwright.config.ts structure and options
- Test directory organization
- Environment-specific configurations
- Global setup and teardown
- API vs E2E configuration differences

**Example**:
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        // API tests don't need browser
        baseURL: 'http://localhost:3001/api',
      },
    },
    {
      name: 'chromium-e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Practical Test**:
- Create custom configuration for different environments
- Set up separate projects for API and E2E tests
- Configure reporting options
- Test configuration with sample tests

**Resources**:
- [Playwright Configuration Guide](docs/resources/specifications/01-official-documentation/playwright-official-documentation.md) ⭐⭐⭐⭐⭐
- Configuration Examples

#### **Lesson 3.3: Browser, Context, and Page Concepts** ⭐ **E2E FOCUS**
**Duration**: 1-2 hours | **Type**: E2E Foundation
**Learning Outcome**: Understand Playwright's browser automation model

**Documentation**: 
- Browser instances and lifecycle
- Browser contexts for isolation
- Page objects and navigation
- Multiple tabs and windows
- Context vs Page usage patterns

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test('browser context example', async ({ browser }) => {
  // Create new context with specific options
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Custom Test Agent',
    permissions: ['geolocation'],
  });

  // Create page within context
  const page = await context.newPage();
  await page.goto('https://example.com');

  // Context isolation - cookies, localStorage, etc. are isolated
  await page.evaluate(() => {
    localStorage.setItem('testData', 'isolated');
  });

  // Create another context - completely isolated
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.goto('https://example.com');

  // This will be null - different context
  const data = await page2.evaluate(() => {
    return localStorage.getItem('testData');
  });
  expect(data).toBeNull();

  await context.close();
  await context2.close();
});

test('page navigation', async ({ page }) => {
  // Basic navigation
  await page.goto('https://example.com');
  expect(page.url()).toBe('https://example.com/');

  // Navigation with options
  await page.goto('https://example.com/about', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  // Back/forward navigation
  await page.goBack();
  await page.goForward();

  // Reload
  await page.reload();
});
```

**Practical Test**:
- Create and manage browser contexts
- Navigate between pages
- Handle multiple tabs and windows
- Understand isolation between contexts

**Resources**:
- [Playwright Browser Contexts](docs/resources/specifications/01-official-documentation/playwright-official-documentation.md) ⭐⭐⭐⭐⭐
- Browser Automation Patterns

#### **Lesson 3.4: Introduction to Playwright's Request Fixture** ⭐ **API FOCUS**
**Duration**: 1-2 hours | **Type**: API Foundation
**Learning Outcome**: Understand and use Playwright's request fixture for API testing

**Documentation**: 
- Request fixture overview
- HTTP methods with request fixture
- Headers and authentication
- Request/response handling
- Comparison with browser-based requests

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test('basic API requests', async ({ request }) => {
  // GET request
  const response = await request.get('/api/users');
  expect(response.status()).toBe(200);
  
  const users = await response.json();
  expect(Array.isArray(users)).toBe(true);
  expect(users.length).toBeGreaterThan(0);

  // POST request
  const newUser = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  };

  const createResponse = await request.post('/api/users', {
    data: newUser
  });
  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  expect(createdUser.name).toBe(newUser.name);
  expect(createdUser.email).toBe(newUser.email);
  expect(createdUser).toHaveProperty('id');
});

test('API with headers and authentication', async ({ request }) => {
  // Request with custom headers
  const response = await request.get('/api/protected', {
    headers: {
      'Authorization': 'Bearer token123',
      'Content-Type': 'application/json',
      'X-API-Version': 'v1'
    }
  });

  expect(response.status()).toBe(200);
  
  // Check response headers
  expect(response.headers()['content-type']).toContain('application/json');
});

test('API error handling', async ({ request }) => {
  // Test 404 error
  const notFoundResponse = await request.get('/api/users/99999');
  expect(notFoundResponse.status()).toBe(404);

  // Test validation error
  const invalidData = {
    name: '', // Invalid: empty name
    email: 'invalid-email' // Invalid: bad email format
  };

  const validationResponse = await request.post('/api/users', {
    data: invalidData
  });
  expect(validationResponse.status()).toBe(400);

  const errorBody = await validationResponse.json();
  expect(errorBody).toHaveProperty('errors');
  expect(errorBody.errors).toContain('name');
  expect(errorBody.errors).toContain('email');
});
```

**Practical Test**:
- Make basic HTTP requests using request fixture
- Handle different response types and status codes
- Work with headers and authentication
- Implement error handling for API tests

**Resources**:
- [Playwright API Testing](docs/resources/specifications/01-official-documentation/playwright-official-documentation.md) ⭐⭐⭐⭐⭐
- API Testing Fundamentals

#### **Lesson 3.5: Basic Locators and Element Selection** ⭐ **E2E FOCUS**
**Duration**: 1-2 hours | **Type**: E2E Foundation
**Learning Outcome**: Master Playwright's locator strategies for element selection

**Documentation**: 
- Locator types and strategies
- Built-in locators (getByRole, getByText, etc.)
- CSS and XPath selectors
- Locator chaining and filtering
- Best practices for stable locators

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test('locator strategies', async ({ page }) => {
  await page.goto('/login');

  // Built-in locators (recommended)
  const emailInput = page.getByLabel('Email');
  const passwordInput = page.getByLabel('Password');
  const loginButton = page.getByRole('button', { name: 'Login' });

  // Text-based locators
  const welcomeText = page.getByText('Welcome back!');
  const partialText = page.getByText('Welcome', { exact: false });

  // Test ID locators (most stable)
  const form = page.getByTestId('login-form');
  const errorMessage = page.getByTestId('error-message');

  // CSS selectors
  const cssSelector = page.locator('.login-form input[type="email"]');
  
  // XPath selectors
  const xpathSelector = page.locator('xpath=//input[@type="email"]');

  // Locator chaining
  const formEmail = form.getByLabel('Email');
  const submitButton = form.getByRole('button', { name: 'Submit' });

  // Filtering locators
  const visibleButtons = page.getByRole('button').filter({ hasText: 'Login' });
  const enabledInputs = page.locator('input').filter({ hasNot: page.locator('[disabled]') });

  // Using locators
  await emailInput.fill('user@example.com');
  await passwordInput.fill('password123');
  await loginButton.click();

  // Assertions with locators
  await expect(welcomeText).toBeVisible();
  await expect(errorMessage).toBeHidden();
});

test('advanced locator techniques', async ({ page }) => {
  await page.goto('/products');

  // Nth element
  const firstProduct = page.locator('.product-card').first();
  const lastProduct = page.locator('.product-card').last();
  const thirdProduct = page.locator('.product-card').nth(2);

  // Has text filtering
  const expensiveProducts = page.locator('.product-card').filter({ hasText: '$' });
  
  // Has element filtering
  const productsWithImages = page.locator('.product-card').filter({ 
    has: page.locator('img') 
  });

  // Complex filtering
  const availableExpensiveProducts = page.locator('.product-card')
    .filter({ hasText: 'Available' })
    .filter({ hasText: '$' })
    .filter({ hasNot: page.locator('.out-of-stock') });

  await expect(availableExpensiveProducts).toHaveCount(3);
});
```

**Practical Test**:
- Practice different locator strategies
- Build stable and maintainable selectors
- Use locator chaining and filtering
- Compare performance of different approaches

**Resources**:
- [Playwright Locators Guide](docs/resources/specifications/01-official-documentation/playwright-official-documentation.md) ⭐⭐⭐⭐⭐
- Locator Best Practices

#### **Lesson 3.6: API Request Methods and Data Handling** ⭐ **API FOCUS**
**Duration**: 1-2 hours | **Type**: API Foundation
**Learning Outcome**: Master different HTTP methods and data handling in API tests

**Documentation**: 
- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Request body formats (JSON, form data, etc.)
- Query parameters and URL construction
- Response parsing and validation
- Data serialization/deserialization

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test('HTTP methods comprehensive', async ({ request }) => {
  // GET with query parameters
  const getUsersResponse = await request.get('/api/users', {
    params: {
      page: 1,
      limit: 10,
      sort: 'name',
      filter: 'active'
    }
  });
  expect(getUsersResponse.status()).toBe(200);

  const users = await getUsersResponse.json();
  expect(users).toHaveProperty('data');
  expect(users).toHaveProperty('pagination');

  // POST - Create new resource
  const newUser = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    profile: {
      firstName: 'Jane',
      lastName: 'Smith',
      department: 'Engineering'
    }
  };

  const createResponse = await request.post('/api/users', {
    data: newUser,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  expect(createResponse.status()).toBe(201);

  const createdUser = await createResponse.json();
  const userId = createdUser.id;

  // PUT - Full resource update
  const updatedUser = {
    name: 'Jane Smith Updated',
    email: 'jane.updated@example.com',
    role: 'senior-admin',
    profile: {
      firstName: 'Jane',
      lastName: 'Smith-Updated',
      department: 'Engineering Leadership'
    }
  };

  const putResponse = await request.put(`/api/users/${userId}`, {
    data: updatedUser
  });
  expect(putResponse.status()).toBe(200);

  // PATCH - Partial resource update
  const patchData = {
    role: 'super-admin',
    profile: {
      department: 'Executive'
    }
  };

  const patchResponse = await request.patch(`/api/users/${userId}`, {
    data: patchData
  });
  expect(patchResponse.status()).toBe(200);

  const patchedUser = await patchResponse.json();
  expect(patchedUser.role).toBe('super-admin');
  expect(patchedUser.profile.department).toBe('Executive');
  expect(patchedUser.name).toBe('Jane Smith Updated'); // Unchanged

  // DELETE - Remove resource
  const deleteResponse = await request.delete(`/api/users/${userId}`);
  expect(deleteResponse.status()).toBe(204);

  // Verify deletion
  const getDeletedResponse = await request.get(`/api/users/${userId}`);
  expect(getDeletedResponse.status()).toBe(404);
});

test('different data formats', async ({ request }) => {
  // JSON data (most common)
  const jsonResponse = await request.post('/api/users', {
    data: {
      name: 'JSON User',
      email: 'json@example.com'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Form data
  const formData = new FormData();
  formData.append('name', 'Form User');
  formData.append('email', 'form@example.com');
  formData.append('avatar', 'base64-image-data');

  const formResponse = await request.post('/api/users', {
    multipart: {
      name: 'Form User',
      email: 'form@example.com',
      avatar: {
        name: 'avatar.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-data')
      }
    }
  });

  // URL-encoded data
  const urlEncodedResponse = await request.post('/api/auth/login', {
    form: {
      username: 'testuser',
      password: 'password123',
      remember: 'true'
    }
  });

  expect(jsonResponse.status()).toBe(201);
  expect(formResponse.status()).toBe(201);
  expect(urlEncodedResponse.status()).toBe(200);
});

test('response parsing and validation', async ({ request }) => {
  const response = await request.get('/api/users/1');
  
  // Response status
  expect(response.status()).toBe(200);
  expect(response.ok()).toBe(true);
  
  // Response headers
  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');
  expect(headers).toHaveProperty('x-request-id');
  
  // Response body as JSON
  const user = await response.json();
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(typeof user.id).toBe('number');
  expect(typeof user.name).toBe('string');
  
  // Response body as text
  const textResponse = await request.get('/api/health');
  const healthText = await textResponse.text();
  expect(healthText).toBe('OK');
  
  // Response body as buffer
  const imageResponse = await request.get('/api/users/1/avatar');
  const imageBuffer = await imageResponse.body();
  expect(imageBuffer.length).toBeGreaterThan(0);
});
```

**Practical Test**:
- Implement CRUD operations using different HTTP methods
- Handle various data formats (JSON, form data, etc.)
- Parse and validate API responses
- Work with query parameters and headers

**Resources**:
- HTTP Methods Reference
- API Data Handling Guide

#### **Lesson 3.7: Basic Actions and Interactions** ⭐ **E2E FOCUS**
**Duration**: 1-2 hours | **Type**: E2E Foundation
**Learning Outcome**: Perform basic user interactions with web elements

**Documentation**: 
- Click actions and variations
- Text input and form filling
- Keyboard interactions
- Mouse actions and hover
- File uploads and downloads

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test('basic interactions', async ({ page }) => {
  await page.goto('/contact');

  // Text input
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  
  // Clear and type
  await page.getByLabel('Phone').clear();
  await page.getByLabel('Phone').type('555-1234', { delay: 100 });

  // Textarea
  await page.getByLabel('Message').fill('This is a test message with multiple lines.\nSecond line here.');

  // Dropdown selection
  await page.getByLabel('Country').selectOption('US');
  await page.getByLabel('State').selectOption({ label: 'California' });

  // Checkbox and radio buttons
  await page.getByLabel('Subscribe to newsletter').check();
  await page.getByLabel('Preferred contact: Email').check();

  // Multiple checkboxes
  await page.getByLabel('Interest: Technology').check();
  await page.getByLabel('Interest: Sports').check();

  // Click variations
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Double click
  await page.getByTestId('editable-field').dblclick();
  
  // Right click
  await page.getByTestId('context-menu-trigger').click({ button: 'right' });
});

test('keyboard interactions', async ({ page }) => {
  await page.goto('/editor');

  const textArea = page.getByTestId('text-editor');
  
  // Focus element
  await textArea.focus();
  
  // Type text
  await textArea.type('Hello World!');
  
  // Keyboard shortcuts
  await page.keyboard.press('Control+A'); // Select all
  await page.keyboard.press('Control+C'); // Copy
  await page.keyboard.press('Control+V'); // Paste
  
  // Arrow keys
  await page.keyboard.press('Home'); // Go to beginning
  await page.keyboard.press('End');  // Go to end
  
  // Special keys
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  
  // Key combinations
  await page.keyboard.press('Shift+Tab'); // Reverse tab
  await page.keyboard.press('Control+Z'); // Undo
});

test('mouse actions', async ({ page }) => {
  await page.goto('/interactive');

  // Hover actions
  await page.getByTestId('hover-menu').hover();
  await expect(page.getByTestId('dropdown-menu')).toBeVisible();

  // Mouse coordinates
  await page.mouse.move(100, 100);
  await page.mouse.click(150, 150);

  // Drag and drop
  const source = page.getByTestId('draggable-item');
  const target = page.getByTestId('drop-zone');
  
  await source.dragTo(target);
  
  // Manual drag and drop
  await source.hover();
  await page.mouse.down();
  await target.hover();
  await page.mouse.up();

  // Scroll actions
  await page.mouse.wheel(0, 300); // Scroll down
  await page.getByTestId('scroll-container').scroll({ top: 500 });
});

test('file operations', async ({ page }) => {
  await page.goto('/upload');

  // File upload
  const fileInput = page.getByLabel('Upload file');
  await fileInput.setInputFiles('test-files/sample.pdf');
  
  // Multiple file upload
  await page.getByLabel('Upload images').setInputFiles([
    'test-files/image1.jpg',
    'test-files/image2.png'
  ]);

  // File download
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download Report' }).click();
  const download = await downloadPromise;
  
  // Save download
  await download.saveAs('downloads/' + download.suggestedFilename());
  
  // Verify download
  expect(download.suggestedFilename()).toBe('report.pdf');
});
```

**Practical Test**:
- Fill out complex forms with various input types
- Perform keyboard shortcuts and navigation
- Handle drag and drop interactions
- Upload and download files

**Resources**:
- [Playwright Actions Guide](docs/resources/specifications/01-official-documentation/playwright-official-documentation.md) ⭐⭐⭐⭐⭐
- User Interaction Patterns

#### **Lesson 3.8: API Authentication and Headers** ⭐ **API FOCUS**
**Duration**: 1-2 hours | **Type**: API Foundation
**Learning Outcome**: Handle authentication and custom headers in API tests

**Documentation**: 
- Authentication methods (Bearer token, Basic auth, API keys)
- Custom headers and their purposes
- Session management in API tests
- Authentication workflows
- Security considerations

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test('bearer token authentication', async ({ request }) => {
  // Login to get token
  const loginResponse = await request.post('/api/auth/login', {
    data: {
      email: 'admin@example.com',
      password: 'admin123'
    }
  });
  
  expect(loginResponse.status()).toBe(200);
  const loginData = await loginResponse.json();
  const token = loginData.token;
  
  // Use token in subsequent requests
  const protectedResponse = await request.get('/api/admin/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  expect(protectedResponse.status()).toBe(200);
  
  // Create user with authentication
  const createUserResponse = await request.post('/api/admin/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: {
      name: 'New Admin User',
      email: 'newadmin@example.com',
      role: 'admin'
    }
  });
  
  expect(createUserResponse.status()).toBe(201);
});

test('basic authentication', async ({ request }) => {
  // Basic auth with username:password
  const credentials = Buffer.from('admin:password123').toString('base64');
  
  const response = await request.get('/api/secure/data', {
    headers: {
      'Authorization': `Basic ${credentials}`
    }
  });
  
  expect(response.status()).toBe(200);
  
  // Alternative: using auth option
  const response2 = await request.get('/api/secure/data', {
    auth: {
      username: 'admin',
      password: 'password123'
    }
  });
  
  expect(response2.status()).toBe(200);
});

test('API key authentication', async ({ request }) => {
  const apiKey = process.env.API_KEY || 'test-api-key-123';
  
  // API key in header
  const headerResponse = await request.get('/api/data', {
    headers: {
      'X-API-Key': apiKey
    }
  });
  
  expect(headerResponse.status()).toBe(200);
  
  // API key in query parameter
  const queryResponse = await request.get('/api/data', {
    params: {
      'api_key': apiKey
    }
  });
  
  expect(queryResponse.status()).toBe(200);
});

test('custom headers and metadata', async ({ request }) => {
  const response = await request.post('/api/analytics/event', {
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Version': '1.2.3',
      'X-User-Agent': 'Playwright-Test-Runner',
      'X-Request-ID': `test-${Date.now()}`,
      'X-Correlation-ID': 'test-correlation-123',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache'
    },
    data: {
      event: 'user_action',
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'automated_test',
        environment: 'test'
      }
    }
  });
  
  expect(response.status()).toBe(201);
  
  // Verify response headers
  const responseHeaders = response.headers();
  expect(responseHeaders).toHaveProperty('x-request-id');
  expect(responseHeaders['content-type']).toContain('application/json');
});

test('session-based authentication', async ({ request }) => {
  // Login to establish session
  const loginResponse = await request.post('/api/auth/session/login', {
    data: {
      username: 'testuser',
      password: 'testpass123'
    }
  });
  
  expect(loginResponse.status()).toBe(200);
  
  // Extract session cookie
  const cookies = loginResponse.headers()['set-cookie'];
  expect(cookies).toBeDefined();
  
  // Use session in subsequent requests
  const sessionResponse = await request.get('/api/user/profile', {
    headers: {
      'Cookie': cookies
    }
  });
  
  expect(sessionResponse.status()).toBe(200);
  
  // Logout
  const logoutResponse = await request.post('/api/auth/session/logout', {
    headers: {
      'Cookie': cookies
    }
  });
  
  expect(logoutResponse.status()).toBe(200);
});

test('authentication error handling', async ({ request }) => {
  // Test with invalid token
  const invalidTokenResponse = await request.get('/api/protected', {
    headers: {
      'Authorization': 'Bearer invalid-token-123'
    }
  });
  
  expect(invalidTokenResponse.status()).toBe(401);
  
  const errorBody = await invalidTokenResponse.json();
  expect(errorBody).toHaveProperty('error');
  expect(errorBody.error).toContain('Invalid token');
  
  // Test with missing authentication
  const noAuthResponse = await request.get('/api/protected');
  expect(noAuthResponse.status()).toBe(401);
  
  // Test with expired token
  const expiredTokenResponse = await request.get('/api/protected', {
    headers: {
      'Authorization': 'Bearer expired-token-456'
    }
  });
  
  expect(expiredTokenResponse.status()).toBe(401);
  
  const expiredErrorBody = await expiredTokenResponse.json();
  expect(expiredErrorBody.error).toContain('Token expired');
});
```

**Practical Test**:
- Implement different authentication methods
- Handle authentication workflows
- Work with custom headers and metadata
- Test authentication error scenarios

**Resources**:
- API Authentication Patterns
- HTTP Headers Reference

#### **Lesson 3.9: Basic Assertions and Expectations** ⭐ **E2E FOCUS**
**Duration**: 1-2 hours | **Type**: E2E Foundation
**Learning Outcome**: Use Playwright's assertion system for E2E test validation

**Documentation**: 
- Web-first assertions
- Element state assertions
- Text and content assertions
- Visual assertions
- Custom assertion messages

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test('element visibility and state assertions', async ({ page }) => {
  await page.goto('/dashboard');

  // Visibility assertions
  await expect(page.getByTestId('header')).toBeVisible();
  await expect(page.getByTestId('loading-spinner')).toBeHidden();
  
  // Element state assertions
  const submitButton = page.getByRole('button', { name: 'Submit' });
  await expect(submitButton).toBeEnabled();
  await expect(submitButton).not.toBeDisabled();
  
  const checkbox = page.getByLabel('I agree to terms');
  await expect(checkbox).not.toBeChecked();
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  
  // Focus assertions
  const emailInput = page.getByLabel('Email');
  await emailInput.focus();
  await expect(emailInput).toBeFocused();
});

test('text and content assertions', async ({ page }) => {
  await page.goto('/profile');

  // Text content assertions
  await expect(page.getByTestId('username')).toHaveText('john_doe');
  await expect(page.getByTestId('welcome-message')).toContainText('Welcome back');
  
  // Partial text matching
  await expect(page.getByTestId('status')).toContainText('Active', { ignoreCase: true });
  
  // Multiple text options
  await expect(page.getByTestId('role')).toHaveText(['Admin', 'User', 'Guest']);
  
  // Regular expression matching
  await expect(page.getByTestId('email')).toHaveText(/\w+@\w+\.\w+/);
  
  // Inner text vs text content
  await expect(page.getByTestId('formatted-text')).toHaveText('Bold Text');
  
  // Value assertions for inputs
  await expect(page.getByLabel('First Name')).toHaveValue('John');
  await expect(page.getByLabel('Country')).toHaveValue('US');
});

test('attribute and CSS assertions', async ({ page }) => {
  await page.goto('/form');

  // Attribute assertions
  const emailInput = page.getByLabel('Email');
  await expect(emailInput).toHaveAttribute('type', 'email');
  await expect(emailInput).toHaveAttribute('required');
  await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
  
  // Class assertions
  const errorMessage = page.getByTestId('error');
  await expect(errorMessage).toHaveClass('error-message');
  await expect(errorMessage).toHaveClass(/error/);
  await expect(errorMessage).toHaveClass(['error-message', 'visible']);
  
  // CSS
properties
  const button = page.getByRole('button', { name: 'Primary' });
  await expect(button).toHaveCSS('background-color', 'rgb(0, 123, 255)');
  await expect(button).toHaveCSS('font-weight', '600');
  
  // Count assertions
  await expect(page.getByRole('listitem')).toHaveCount(5);
  await expect(page.locator('.product-card')).toHaveCount(12);
  
  // URL assertions
  await expect(page).toHaveURL('/dashboard');
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page).toHaveURL('https://example.com/dashboard');
  
  // Title assertions
  await expect(page).toHaveTitle('Dashboard - MyApp');
  await expect(page).toHaveTitle(/Dashboard/);
});

test('custom assertion messages', async ({ page }) => {
  await page.goto('/checkout');

  // Custom error messages for better debugging
  await expect(page.getByTestId('cart-total'), 'Cart total should be visible').toBeVisible();
  
  await expect(
    page.getByTestId('payment-form'), 
    'Payment form should be present after cart validation'
  ).toBeAttached();
  
  const totalAmount = page.getByTestId('total-amount');
  await expect(
    totalAmount, 
    'Total amount should show correct value'
  ).toHaveText('$99.99');
});

test('waiting and timeout assertions', async ({ page }) => {
  await page.goto('/async-content');

  // Wait for element to appear
  await expect(page.getByTestId('dynamic-content')).toBeVisible({ timeout: 10000 });
  
  // Wait for element to disappear
  await expect(page.getByTestId('loading')).toBeHidden({ timeout: 5000 });
  
  // Wait for specific text
  await expect(page.getByTestId('status')).toHaveText('Completed', { timeout: 15000 });
  
  // Wait for count to change
  await expect(page.locator('.notification')).toHaveCount(3, { timeout: 8000 });
});
```

**Practical Test**:
- Use various assertion types for comprehensive validation
- Implement custom assertion messages
- Handle timing and async assertions
- Create robust test validations

**Resources**:
- [Playwright Assertions Guide](docs/resources/specifications/01-official-documentation/playwright-official-documentation.md) ⭐⭐⭐⭐⭐
- Web-First Assertions Best Practices

#### **Lesson 3.10: API Response Validation and Schema Testing** ⭐ **API FOCUS**
**Duration**: 1-2 hours | **Type**: API Foundation
**Learning Outcome**: Validate API responses and implement schema testing

**Documentation**: 
- Response structure validation
- JSON schema validation
- Data type checking
- Response time validation
- Error response validation

**Example**:
```typescript
import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// JSON Schema definitions
const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 },
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    createdAt: { type: 'string', format: 'date-time' },
    profile: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        age: { type: 'integer', minimum: 0, maximum: 150 }
      },
      required: ['firstName', 'lastName']
    }
  },
  required: ['id', 'name', 'email', 'createdAt'],
  additionalProperties: false
};

const usersListSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: userSchema
    },
    pagination: {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1 },
        limit: { type: 'integer', minimum: 1 },
        total: { type: 'integer', minimum: 0 },
        totalPages: { type: 'integer', minimum: 0 }
      },
      required: ['page', 'limit', 'total', 'totalPages']
    }
  },
  required: ['data', 'pagination']
};

test('API response structure validation', async ({ request }) => {
  const response = await request.get('/api/users/1');
  expect(response.status()).toBe(200);
  
  const user = await response.json();
  
  // Basic structure validation
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('createdAt');
  
  // Data type validation
  expect(typeof user.id).toBe('number');
  expect(typeof user.name).toBe('string');
  expect(typeof user.email).toBe('string');
  expect(typeof user.createdAt).toBe('string');
  
  // Value validation
  expect(user.id).toBeGreaterThan(0);
  expect(user.name.length).toBeGreaterThan(0);
  expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  
  // Date validation
  expect(new Date(user.createdAt).getTime()).not.toBeNaN();
});

test('JSON schema validation', async ({ request }) => {
  const ajv = new Ajv();
  addFormats(ajv);
  
  // Single user validation
  const userResponse = await request.get('/api/users/1');
  const user = await userResponse.json();
  
  const validateUser = ajv.compile(userSchema);
  const isValidUser = validateUser(user);
  
  if (!isValidUser) {
    console.log('User validation errors:', validateUser.errors);
  }
  expect(isValidUser).toBe(true);
  
  // Users list validation
  const usersResponse = await request.get('/api/users');
  const usersList = await usersResponse.json();
  
  const validateUsersList = ajv.compile(usersListSchema);
  const isValidUsersList = validateUsersList(usersList);
  
  if (!isValidUsersList) {
    console.log('Users list validation errors:', validateUsersList.errors);
  }
  expect(isValidUsersList).toBe(true);
});

test('API response performance validation', async ({ request }) => {
  const startTime = Date.now();
  
  const response = await request.get('/api/users');
  const endTime = Date.now();
  
  const responseTime = endTime - startTime;
  
  // Performance assertions
  expect(response.status()).toBe(200);
  expect(responseTime).toBeLessThan(2000); // Response time < 2 seconds
  
  // Response size validation
  const responseBody = await response.text();
  const responseSizeKB = Buffer.byteLength(responseBody, 'utf8') / 1024;
  expect(responseSizeKB).toBeLessThan(100); // Response size < 100KB
  
  console.log(`Response time: ${responseTime}ms, Size: ${responseSizeKB.toFixed(2)}KB`);
});

test('error response validation', async ({ request }) => {
  // Test 404 error
  const notFoundResponse = await request.get('/api/users/99999');
  expect(notFoundResponse.status()).toBe(404);
  
  const notFoundError = await notFoundResponse.json();
  expect(notFoundError).toHaveProperty('error');
  expect(notFoundError.error).toHaveProperty('code');
  expect(notFoundError.error).toHaveProperty('message');
  expect(notFoundError.error.code).toBe('USER_NOT_FOUND');
  
  // Test validation error
  const invalidUserData = {
    name: '', // Invalid: empty name
    email: 'invalid-email', // Invalid: bad format
    age: -5 // Invalid: negative age
  };
  
  const validationResponse = await request.post('/api/users', {
    data: invalidUserData
  });
  expect(validationResponse.status()).toBe(400);
  
  const validationError = await validationResponse.json();
  expect(validationError).toHaveProperty('error');
  expect(validationError.error).toHaveProperty('code');
  expect(validationError.error).toHaveProperty('details');
  expect(validationError.error.code).toBe('VALIDATION_ERROR');
  expect(Array.isArray(validationError.error.details)).toBe(true);
  expect(validationError.error.details.length).toBeGreaterThan(0);
  
  // Validate error details structure
  validationError.error.details.forEach((detail: any) => {
    expect(detail).toHaveProperty('field');
    expect(detail).toHaveProperty('message');
    expect(typeof detail.field).toBe('string');
    expect(typeof detail.message).toBe('string');
  });
});

test('API response headers validation', async ({ request }) => {
  const response = await request.get('/api/users');
  
  const headers = response.headers();
  
  // Content type validation
  expect(headers['content-type']).toContain('application/json');
  
  // Security headers validation
  expect(headers).toHaveProperty('x-content-type-options');
  expect(headers['x-content-type-options']).toBe('nosniff');
  
  // API versioning headers
  expect(headers).toHaveProperty('x-api-version');
  expect(headers['x-api-version']).toMatch(/^v\d+$/);
  
  // Rate limiting headers
  expect(headers).toHaveProperty('x-ratelimit-limit');
  expect(headers).toHaveProperty('x-ratelimit-remaining');
  expect(parseInt(headers['x-ratelimit-remaining'])).toBeLessThanOrEqual(
    parseInt(headers['x-ratelimit-limit'])
  );
  
  // Request ID for tracing
  expect(headers).toHaveProperty('x-request-id');
  expect(headers['x-request-id']).toMatch(/^[a-f0-9-]{36}$/); // UUID format
});

test('pagination validation', async ({ request }) => {
  const response = await request.get('/api/users', {
    params: {
      page: 2,
      limit: 5
    }
  });
  
  expect(response.status()).toBe(200);
  const data = await response.json();
  
  // Pagination structure
  expect(data).toHaveProperty('data');
  expect(data).toHaveProperty('pagination');
  
  // Pagination values
  expect(data.pagination.page).toBe(2);
  expect(data.pagination.limit).toBe(5);
  expect(data.pagination.total).toBeGreaterThanOrEqual(0);
  expect(data.pagination.totalPages).toBeGreaterThanOrEqual(0);
  
  // Data array validation
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeLessThanOrEqual(5);
  
  // Calculate expected total pages
  const expectedTotalPages = Math.ceil(data.pagination.total / data.pagination.limit);
  expect(data.pagination.totalPages).toBe(expectedTotalPages);
});
```

**Practical Test**:
- Implement comprehensive response validation
- Use JSON schema validation for API responses
- Validate error responses and edge cases
- Test API performance and headers

**Resources**:
- JSON Schema Validation Guide
- API Testing Best Practices

#### **Lesson 3.11: Combining API and E2E Testing** ⭐ **INTEGRATION FOCUS**
**Duration**: 1-2 hours | **Type**: Integration
**Learning Outcome**: Integrate API and E2E testing approaches in unified test scenarios

**Documentation**: 
- API setup for E2E tests
- Data preparation via API
- Hybrid testing strategies
- Test data cleanup
- Performance optimization

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test('hybrid API + E2E user registration flow', async ({ page, request }) => {
  // Step 1: API setup - Clean existing test data
  const testEmail = `test-${Date.now()}@example.com`;
  
  // Check if user already exists via API
  const existingUserResponse = await request.get(`/api/users/search`, {
    params: { email: testEmail }
  });
  
  if (existingUserResponse.status() === 200) {
    const existingUser = await existingUserResponse.json();
    if (existingUser.id) {
      await request.delete(`/api/users/${existingUser.id}`);
    }
  }
  
  // Step 2: E2E - User registration through UI
  await page.goto('/register');
  
  await page.getByLabel('First Name').fill('John');
  await page.getByLabel('Last Name').fill('Doe');
  await page.getByLabel('Email').fill(testEmail);
  await page.getByLabel('Password').fill('password123');
  await page.getByLabel('Confirm Password').fill('password123');
  
  await page.getByRole('button', { name: 'Register' }).click();
  
  // Step 3: E2E - Verify UI feedback
  await expect(page.getByText('Registration successful')).toBeVisible();
  await expect(page).toHaveURL('/welcome');
  
  // Step 4: API - Verify user was created in database
  const createdUserResponse = await request.get(`/api/users/search`, {
    params: { email: testEmail }
  });
  
  expect(createdUserResponse.status()).toBe(200);
  const createdUser = await createdUserResponse.json();
  
  expect(createdUser).toHaveProperty('id');
  expect(createdUser.email).toBe(testEmail);
  expect(createdUser.firstName).toBe('John');
  expect(createdUser.lastName).toBe('Doe');
  expect(createdUser.isActive).toBe(true);
  
  // Step 5: API - Cleanup
  await request.delete(`/api/users/${createdUser.id}`);
});

test('API data setup for E2E testing', async ({ page, request }) => {
  // Create test data via API
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    role: 'admin',
    profile: {
      firstName: 'Test',
      lastName: 'User',
      department: 'QA'
    }
  };
  
  const createUserResponse = await request.post('/api/users', {
    data: testUser
  });
  expect(createUserResponse.status()).toBe(201);
  const user = await createUserResponse.json();
  
  // Create test products via API
  const products = [
    { name: 'Product 1', price: 99.99, category: 'Electronics' },
    { name: 'Product 2', price: 149.99, category: 'Electronics' },
    { name: 'Product 3', price: 29.99, category: 'Books' }
  ];
  
  const createdProducts = [];
  for (const product of products) {
    const productResponse = await request.post('/api/products', { data: product });
    const createdProduct = await productResponse.json();
    createdProducts.push(createdProduct);
  }
  
  // Login via API to get session
  const loginResponse = await request.post('/api/auth/login', {
    data: {
      email: testUser.email,
      password: 'defaultPassword123'
    }
  });
  const loginData = await loginResponse.json();
  
  // Set authentication context for browser
  await page.context().addCookies([
    {
      name: 'authToken',
      value: loginData.token,
      domain: 'localhost',
      path: '/'
    }
  ]);
  
  // Now perform E2E testing with pre-created data
  await page.goto('/admin/products');
  
  // Verify products are visible in UI
  for (const product of createdProducts) {
    await expect(page.getByText(product.name)).toBeVisible();
    await expect(page.getByText(`$${product.price}`)).toBeVisible();
  }
  
  // Test product management through UI
  await page.getByTestId(`edit-product-${createdProducts[0].id}`).click();
  await page.getByLabel('Price').fill('199.99');
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Verify update via API
  const updatedProductResponse = await request.get(`/api/products/${createdProducts[0].id}`);
  const updatedProduct = await updatedProductResponse.json();
  expect(updatedProduct.price).toBe(199.99);
  
  // Cleanup via API
  await request.delete(`/api/users/${user.id}`);
  for (const product of createdProducts) {
    await request.delete(`/api/products/${product.id}`);
  }
});

test('E2E with API validation', async ({ page, request }) => {
  await page.goto('/contact');
  
  // Fill contact form
  const contactData = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Inquiry',
    message: 'This is a test message from automated testing.'
  };
  
  await page.getByLabel('Name').fill(contactData.name);
  await page.getByLabel('Email').fill(contactData.email);
  await page.getByLabel('Subject').fill(contactData.subject);
  await page.getByLabel('Message').fill(contactData.message);
  
  // Submit form and verify UI response
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByText('Message sent successfully')).toBeVisible();
  
  // Verify message was stored via API
  const messagesResponse = await request.get('/api/admin/messages', {
    headers: {
      'Authorization': 'Bearer admin-token'
    }
  });
  
  const messages = await messagesResponse.json();
  const submittedMessage = messages.data.find((msg: any) => 
    msg.email === contactData.email && msg.subject === contactData.subject
  );
  
  expect(submittedMessage).toBeDefined();
  expect(submittedMessage.name).toBe(contactData.name);
  expect(submittedMessage.message).toBe(contactData.message);
  expect(submittedMessage.status).toBe('new');
  
  // Test admin workflow via API
  const updateResponse = await request.patch(`/api/admin/messages/${submittedMessage.id}`, {
    headers: {
      'Authorization': 'Bearer admin-token'
    },
    data: {
      status: 'reviewed',
      adminNotes: 'Processed by automated test'
    }
  });
  
  expect(updateResponse.status()).toBe(200);
});

test('performance testing with API + E2E', async ({ page, request }) => {
  // Measure API performance
  const apiStartTime = Date.now();
  const apiResponse = await request.get('/api/products');
  const apiEndTime = Date.now();
  const apiResponseTime = apiEndTime - apiStartTime;
  
  expect(apiResponse.status()).toBe(200);
  expect(apiResponseTime).toBeLessThan(1000); // API should respond in < 1s
  
  // Measure E2E page load performance
  const e2eStartTime = Date.now();
  await page.goto('/products');
  await page.waitForLoadState('networkidle');
  const e2eEndTime = Date.now();
  const e2eLoadTime = e2eEndTime - e2eStartTime;
  
  expect(e2eLoadTime).toBeLessThan(3000); // Page should load in < 3s
  
  // Compare data consistency
  const apiProducts = await apiResponse.json();
  const uiProductCount = await page.locator('.product-card').count();
  
  expect(uiProductCount).toBe(apiProducts.data.length);
  
  // Verify first few products match
  for (let i = 0; i < Math.min(3, apiProducts.data.length); i++) {
    const apiProduct = apiProducts.data[i];
    const uiProduct = page.locator('.product-card').nth(i);
    
    await expect(uiProduct.getByText(apiProduct.name)).toBeVisible();
    await expect(uiProduct.getByText(`$${apiProduct.price}`)).toBeVisible();
  }
  
  console.log(`Performance: API ${apiResponseTime}ms, E2E ${e2eLoadTime}ms`);
});
```

**Practical Test**:
- Create hybrid test scenarios combining API and E2E
- Use API for test data setup and cleanup
- Validate data consistency between API and UI
- Implement performance testing across both layers

**Resources**:
- Hybrid Testing Strategies
- Test Data Management Patterns

#### **Lesson 3.12: Test Organization and Best Practices**
**Duration**: 1-2 hours | **Type**: Foundation
**Learning Outcome**: Organize tests effectively and implement testing best practices

**Documentation**: 
- Test file organization
- Naming conventions
- Test data management
- Setup and teardown patterns
- Code reusability

**Example**:
```typescript
// tests/api/users.spec.ts
import { test, expect } from '@playwright/test';
import { ApiTestHelper } from '../utils/api-test-helper';
import { TestDataFactory } from '../utils/test-data-factory';

test.describe('User API Tests', () => {
  let apiHelper: ApiTestHelper;
  let testUser: any;

  test.beforeAll(async ({ request }) => {
    apiHelper = new ApiTestHelper(request);
    await apiHelper.authenticate('admin@example.com', 'admin123');
  });

  test.beforeEach(async () => {
    testUser = TestDataFactory.createUser();
  });

  test.afterEach(async () => {
    if (testUser?.id) {
      await apiHelper.deleteUser(testUser.id);
    }
  });

  test('should create user with valid data', async () => {
    const response = await apiHelper.createUser(testUser);
    
    expect(response.status).toBe(201);
    expect(response.data.email).toBe(testUser.email);
    
    testUser.id = response.data.id; // For cleanup
  });

  test('should validate required fields', async () => {
    const invalidUser = { ...testUser, email: '' };
    
    const response = await apiHelper.createUser(invalidUser);
    
    expect(response.status).toBe(400);
    expect(response.error.details).toContain('email');
  });
});

// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TestDataFactory } from '../utils/test-data-factory';

test.describe('Login Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('successful login with valid credentials', async () => {
    const user = TestDataFactory.getValidUser();
    
    await loginPage.login(user.email, user.password);
    
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    await expect(dashboardPage.userMenu).toContainText(user.name);
  });

  test('login failure with invalid credentials', async () => {
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });
});

// tests/utils/api-test-helper.ts
export class ApiTestHelper {
  private authToken: string = '';

  constructor(private request: any) {}

  async authenticate(email: string, password: string): Promise<void> {
    const response = await this.request.post('/api/auth/login', {
      data: { email, password }
    });
    
    const data = await response.json();
    this.authToken = data.token;
  }

  async createUser(userData: any): Promise<any> {
    const response = await this.request.post('/api/users', {
      headers: { 'Authorization': `Bearer ${this.authToken}` },
      data: userData
    });
    
    return {
      status: response.status(),
      data: response.ok() ? await response.json() : null,
      error: !response.ok() ? await response.json() : null
    };
  }

  async deleteUser(userId: number): Promise<void> {
    await this.request.delete(`/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${this.authToken}` }
    });
  }
}

// tests/utils/test-data-factory.ts
export class TestDataFactory {
  static createUser(overrides: any = {}): any {
    return {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      role: 'user',
      ...overrides
    };
  }

  static getValidUser(): any {
    return {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };
  }

  static createProduct(overrides: any = {}): any {
    return {
      name: 'Test Product',
      price: 99.99,
      category: 'Electronics',
      description: 'A test product for automation',
      ...overrides
    };
  }
}

// tests/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(private page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error-message');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// playwright.config.ts - Enhanced configuration
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    // API Tests
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_URL || 'http://localhost:3001/api'
      }
    },
    // E2E Tests - Chrome
    {
      name: 'chromium-e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'] }
    },
    // E2E Tests - Firefox
    {
      name: 'firefox-e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Firefox'] }
    },
    // Mobile Tests
    {
      name: 'mobile-chrome',
      testDir: './tests/e2e',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'npm run start:test',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
});
```

**Practical Test**:
- Organize tests into logical directory structure
- Implement reusable helper classes and utilities
- Create proper setup and teardown patterns
- Build maintainable Page Object Models

**Resources**:
- Test Organization Best Practices
- Playwright Project Structure Guide

---

## MOD-04: Advanced Playwright Techniques (Enhanced)

**Duration**: 6-7 weeks | **Time Commitment**: 12-15 hours/week | **Prerequisites**: MOD-03

### Module Overview
Advanced Playwright capabilities with balanced coverage of API testing techniques and E2E automation. This module significantly expands API testing coverage while maintaining comprehensive E2E testing skills.

### Enhanced Lesson Breakdown

#### **Lesson 4.1: Authentication Patterns and Session Management** ⭐ **E2E FOCUS**
**Duration**: 1-2 hours | **Type**: E2E Advanced
**Learning Outcome**: Handle various authentication patterns in E2E testing

**Documentation**: 
- Session-based authentication
- Token-based authentication
- OAuth and SSO flows
- Multi-factor authentication
- Session persistence and storage

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test('session-based authentication', async ({ page, context }) => {
  await page.goto('/login');
  
  // Login and capture session
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await expect(page).toHaveURL('/dashboard');
  
  // Save authentication state
  await context.storageState({ path: 'auth-state.json' });
  
  // Verify session persistence
  await page.reload();
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome back')).toBeVisible();
});

test('token-based authentication', async ({ page }) => {
  // Intercept login request to capture token
  let authToken = '';
  
  page.on('response', async response => {
    if (response.url().includes('/api/auth/login')) {
      const data = await response.json();
      authToken = data.token;
    }
  });
  
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button
', { name: 'Login' }).click();
  
  await expect(page).toHaveURL('/dashboard');
  
  // Use token for API calls
  expect(authToken).toBeTruthy();
  console.log('Captured auth token:', authToken.substring(0, 20) + '...');
});

test('OAuth flow simulation', async ({ page, context }) => {
  await page.goto('/login');
  
  // Click OAuth login button
  await page.getByRole('button', { name: 'Login with Google' }).click();
  
  // Handle OAuth popup
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    // OAuth button click triggers popup
  ]);
  
  // Simulate OAuth provider login
  await popup.waitForLoadState();
  await popup.getByLabel('Email').fill('oauth.user@gmail.com');
  await popup.getByLabel('Password').fill('oauthpass123');
  await popup.getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for redirect back to main app
  await popup.waitForEvent('close');
  
  // Verify successful OAuth login
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome, OAuth User')).toBeVisible();
});
```

**Practical Test**:
- Implement various authentication flows
- Handle session persistence and token management
- Test OAuth and SSO integrations
- Manage authentication state across tests

**Resources**:
- [Playwright Authentication Guide](docs/resources/specifications/01-official-documentation/playwright-official-documentation.md) ⭐⭐⭐⭐⭐
- Authentication Patterns in Testing

#### **Lesson 4.2: Advanced API Testing with Authentication** ⭐ **API FOCUS**
**Duration**: 1-2 hours | **Type**: API Advanced
**Learning Outcome**: Implement comprehensive API authentication testing

**Documentation**: 
- JWT token handling
- API key authentication
- OAuth 2.0 flows for APIs
- Refresh token management
- Authentication error scenarios

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('API Authentication Tests', () => {
  let authToken: string;
  let refreshToken: string;

  test.beforeAll(async ({ request }) => {
    // Obtain authentication tokens
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: 'admin@example.com',
        password: 'admin123'
      }
    });
    
    const loginData = await loginResponse.json();
    authToken = loginData.accessToken;
    refreshToken = loginData.refreshToken;
  });

  test('authenticated API requests', async ({ request }) => {
    const response = await request.get('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    expect(Array.isArray(users.data)).toBe(true);
  });

  test('token refresh flow', async ({ request }) => {
    // Use refresh token to get new access token
    const refreshResponse = await request.post('/api/auth/refresh', {
      data: {
        refreshToken: refreshToken
      }
    });
    
    expect(refreshResponse.status()).toBe(200);
    
    const refreshData = await refreshResponse.json();
    expect(refreshData).toHaveProperty('accessToken');
    expect(refreshData).toHaveProperty('refreshToken');
    
    // Update tokens
    const newAuthToken = refreshData.accessToken;
    
    // Test with new token
    const testResponse = await request.get('/api/admin/settings', {
      headers: {
        'Authorization': `Bearer ${newAuthToken}`
      }
    });
    
    expect(testResponse.status()).toBe(200);
  });

  test('expired token handling', async ({ request }) => {
    // Use an expired token
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired.token';
    
    const response = await request.get('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${expiredToken}`
      }
    });
    
    expect(response.status()).toBe(401);
    
    const errorData = await response.json();
    expect(errorData.error.code).toBe('TOKEN_EXPIRED');
  });
});
```

**Practical Test**:
- Implement JWT token authentication
- Handle token refresh workflows
- Test authentication error scenarios
- Manage API authentication state

**Resources**:
- JWT Authentication Guide
- API Security Testing Patterns

#### **Lesson 4.3: REST API Testing Comprehensive** ⭐ **API FOCUS**
**Duration**: 2-3 hours | **Type**: API Advanced
**Learning Outcome**: Master comprehensive REST API testing strategies

**Documentation**: 
- Complete CRUD operations testing
- Advanced query parameters
- Filtering, sorting, and pagination
- Bulk operations
- API versioning

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Comprehensive REST API Testing', () => {
  let createdUsers: any[] = [];
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Authenticate
    const loginResponse = await request.post('/api/auth/login', {
      data: { email: 'admin@example.com', password: 'admin123' }
    });
    const loginData = await loginResponse.json();
    authToken = loginData.token;
  });

  test.afterAll(async ({ request }) => {
    // Cleanup created users
    for (const user of createdUsers) {
      await request.delete(`/api/users/${user.id}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    }
  });

  test('CRUD operations complete flow', async ({ request }) => {
    // CREATE
    const newUser = {
      name: 'John Doe',
      email: `john.${Date.now()}@example.com`,
      role: 'user',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        department: 'Engineering'
      }
    };

    const createResponse = await request.post('/api/users', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: newUser
    });
    
    expect(createResponse.status()).toBe(201);
    const createdUser = await createResponse.json();
    createdUsers.push(createdUser);
    
    expect(createdUser.id).toBeDefined();
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);

    // READ - Get single user
    const getResponse = await request.get(`/api/users/${createdUser.id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    expect(getResponse.status()).toBe(200);
    const fetchedUser = await getResponse.json();
    expect(fetchedUser.id).toBe(createdUser.id);
    expect(fetchedUser.profile.firstName).toBe('John');

    // UPDATE - Full update (PUT)
    const updatedUserData = {
      ...newUser,
      name: 'John Smith',
      profile: {
        ...newUser.profile,
        lastName: 'Smith',
        age: 31
      }
    };

    const putResponse = await request.put(`/api/users/${createdUser.id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: updatedUserData
    });
    
    expect(putResponse.status()).toBe(200);
    const updatedUser = await putResponse.json();
    expect(updatedUser.name).toBe('John Smith');
    expect(updatedUser.profile.lastName).toBe('Smith');
    expect(updatedUser.profile.age).toBe(31);

    // UPDATE - Partial update (PATCH)
    const patchData = {
      role: 'admin',
      profile: {
        department: 'Management'
      }
    };

    const patchResponse = await request.patch(`/api/users/${createdUser.id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: patchData
    });
    
    expect(patchResponse.status()).toBe(200);
    const patchedUser = await patchResponse.json();
    expect(patchedUser.role).toBe('admin');
    expect(patchedUser.profile.department).toBe('Management');
    expect(patchedUser.name).toBe('John Smith'); // Should remain unchanged

    // DELETE
    const deleteResponse = await request.delete(`/api/users/${createdUser.id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    expect(deleteResponse.status()).toBe(204);

    // Verify deletion
    const getDeletedResponse = await request.get(`/api/users/${createdUser.id}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    expect(getDeletedResponse.status()).toBe(404);
  });

  test('advanced query parameters and filtering', async ({ request }) => {
    // Create test data
    const testUsers = [
      { name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', age: 28 },
      { name: 'Bob Wilson', email: 'bob@example.com', role: 'user', age: 35 },
      { name: 'Carol Davis', email: 'carol@example.com', role: 'user', age: 42 },
      { name: 'David Brown', email: 'david@example.com', role: 'admin', age: 31 }
    ];

    for (const userData of testUsers) {
      const response = await request.post('/api/users', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        data: userData
      });
      const user = await response.json();
      createdUsers.push(user);
    }

    // Test filtering
    const adminUsersResponse = await request.get('/api/users', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      params: {
        role: 'admin'
      }
    });
    
    const adminUsers = await adminUsersResponse.json();
    expect(adminUsers.data.length).toBe(2);
    adminUsers.data.forEach((user: any) => {
      expect(user.role).toBe('admin');
    });

    // Test sorting
    const sortedResponse = await request.get('/api/users', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      params: {
        sort: 'age',
        order: 'desc'
      }
    });
    
    const sortedUsers = await sortedResponse.json();
    expect(sortedUsers.data[0].age).toBeGreaterThanOrEqual(sortedUsers.data[1].age);

    // Test pagination
    const paginatedResponse = await request.get('/api/users', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      params: {
        page: 1,
        limit: 2
      }
    });
    
    const paginatedData = await paginatedResponse.json();
    expect(paginatedData.data.length).toBe(2);
    expect(paginatedData.pagination.page).toBe(1);
    expect(paginatedData.pagination.limit).toBe(2);

    // Test complex filtering
    const complexFilterResponse = await request.get('/api/users', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      params: {
        role: 'user',
        'age[gte]': 30,
        'age[lte]': 40,
        sort: 'name'
      }
    });
    
    const filteredUsers = await complexFilterResponse.json();
    filteredUsers.data.forEach((user: any) => {
      expect(user.role).toBe('user');
      expect(user.age).toBeGreaterThanOrEqual(30);
      expect(user.age).toBeLessThanOrEqual(40);
    });
  });

  test('bulk operations', async ({ request }) => {
    // Bulk create
    const bulkUsers = [
      { name: 'Bulk User 1', email: 'bulk1@example.com', role: 'user' },
      { name: 'Bulk User 2', email: 'bulk2@example.com', role: 'user' },
      { name: 'Bulk User 3', email: 'bulk3@example.com', role: 'admin' }
    ];

    const bulkCreateResponse = await request.post('/api/users/bulk', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: { users: bulkUsers }
    });
    
    expect(bulkCreateResponse.status()).toBe(201);
    const createdBulkUsers = await bulkCreateResponse.json();
    expect(createdBulkUsers.data.length).toBe(3);
    
    createdUsers.push(...createdBulkUsers.data);

    // Bulk update
    const userIds = createdBulkUsers.data.map((user: any) => user.id);
    const bulkUpdateResponse = await request.patch('/api/users/bulk', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: {
        ids: userIds,
        updates: { status: 'active', lastUpdated: new Date().toISOString() }
      }
    });
    
    expect(bulkUpdateResponse.status()).toBe(200);
    const updatedBulkUsers = await bulkUpdateResponse.json();
    updatedBulkUsers.data.forEach((user: any) => {
      expect(user.status).toBe('active');
      expect(user.lastUpdated).toBeDefined();
    });

    // Bulk delete
    const bulkDeleteResponse = await request.delete('/api/users/bulk', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: { ids: userIds }
    });
    
    expect(bulkDeleteResponse.status()).toBe(204);

    // Verify bulk deletion
    for (const id of userIds) {
      const getResponse = await request.get(`/api/users/${id}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      expect(getResponse.status()).toBe(404);
    }
  });
});
```

**Practical Test**:
- Implement complete CRUD operation testing
- Test advanced query parameters and filtering
- Handle bulk operations and batch processing
- Validate complex API workflows

**Resources**:
- REST API Testing Best Practices
- Advanced Query Parameter Patterns

#### **Lesson 4.4: API Schema Validation and Contract Testing** ⭐ **API FOCUS**
**Duration**: 2-3 hours | **Type**: API Advanced
**Learning Outcome**: Implement comprehensive API schema validation and contract testing

**Documentation**: 
- JSON Schema validation
- OpenAPI specification testing
- Contract testing principles
- Schema evolution and versioning
- Response validation automation

**Example**:
```typescript
import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Schema definitions
const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1 },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['admin', 'user', 'guest'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    profile: {
      type: 'object',
      properties: {
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        age: { type: 'integer', minimum: 0, maximum: 150 },
        department: { type: 'string' }
      },
      required: ['firstName', 'lastName'],
      additionalProperties: false
    }
  },
  required: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
  additionalProperties: false
};

const paginatedResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: userSchema
    },
    pagination: {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
        total: { type: 'integer', minimum: 0 },
        totalPages: { type: 'integer', minimum: 0 }
      },
      required: ['page', 'limit', 'total', 'totalPages'],
      additionalProperties: false
    },
    meta: {
      type: 'object',
      properties: {
        timestamp: { type: 'string', format: 'date-time' },
        version: { type: 'string', pattern: '^v\\d+$' }
      },
      required: ['timestamp', 'version']
    }
  },
  required: ['data', 'pagination', 'meta'],
  additionalProperties: false
};

const errorResponseSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
        details: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
              code: { type: 'string' }
            },
            required: ['field', 'message']
          }
        }
      },
      required: ['code', 'message']
    },
    meta: {
      type: 'object',
      properties: {
        timestamp: { type: 'string', format: 'date-time' },
        requestId: { type: 'string', format: 'uuid' }
      },
      required: ['timestamp', 'requestId']
    }
  },
  required: ['error', 'meta']
};

test.describe('API Schema Validation', () => {
  let ajv: Ajv;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    
    // Authenticate
    const loginResponse = await request.post('/api/auth/login', {
      data: { email: 'admin@example.com', password: 'admin123' }
    });
    const loginData = await loginResponse.json();
    authToken = loginData.token;
  });

  test('validate single user response schema', async ({ request }) => {
    const response = await request.get('/api/users/1', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    expect(response.status()).toBe(200);
    const user = await response.json();
    
    const validate = ajv.compile(userSchema);
    const isValid = validate(user);
    
    if (!isValid) {
      console.log('Schema validation errors:', JSON.stringify(validate.errors, null, 2));
    }
    
    expect(isValid).toBe(true);
    
    // Additional business logic validation
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(new Date(user.createdAt).getTime()).toBeLessThanOrEqual(Date.now());
    expect(new Date(user.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(user.createdAt).getTime());
  });

  test('validate paginated response schema', async ({ request }) => {
    const response = await request.get('/api/users', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      params: { page: 1, limit: 10 }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    
    const validate = ajv.compile(paginatedResponseSchema);
    const isValid = validate(data);
    
    if (!isValid) {
      console.log('Paginated response validation errors:', JSON.stringify(validate.errors, null, 2));
    }
    
    expect(isValid).toBe(true);
    
    // Validate pagination logic
    expect(data.pagination.totalPages).toBe(Math.ceil(data.pagination.total / data.pagination.limit));
    expect(data.data.length).toBeLessThanOrEqual(data.pagination.limit);
    
    // Validate each user in the array
    const userValidate = ajv.compile(userSchema);
    data.data.forEach((user: any, index: number) => {
      const isUserValid = userValidate(user);
      if (!isUserValid) {
        console.log(`User ${index} validation errors:`, userValidate.errors);
      }
      expect(isUserValid).toBe(true);
    });
  });

  test('validate error response schema', async ({ request }) => {
    // Trigger validation error
    const invalidUserData = {
      name: '', // Invalid: empty name
      email: 'invalid-email', // Invalid: bad format
      role: 'invalid-role', // Invalid: not in enum
      profile: {
        firstName: 'John',
        // Missing required lastName
        age: -5 // Invalid: negative age
      }
    };
    
    const response = await request.post('/api/users', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: invalidUserData
    });
    
    expect(response.status()).toBe(400);
    const errorData = await response.json();
    
    const validate = ajv.compile(errorResponseSchema);
    const isValid = validate(errorData);
    
    if (!isValid) {
      console.log('Error response validation errors:', JSON.stringify(validate.errors, null, 2));
    }
    
    expect(isValid).toBe(true);
    
    // Validate error details
    expect(errorData.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(errorData.error.details)).toBe(true);
    expect(errorData.error.details.length).toBeGreaterThan(0);
    
    // Check specific validation errors
    const fieldErrors = errorData.error.details.map((detail: any) => detail.field);
    expect(fieldErrors).toContain('name');
    expect(fieldErrors).toContain('email');
    expect(fieldErrors).toContain('role');
  });

  test('contract testing - API behavior consistency', async ({ request }) => {
    // Test that API behavior matches contract
    const testCases = [
      {
        name: 'Create user with valid data',
        method: 'POST',
        endpoint: '/api/users',
        data: {
          name: 'Contract Test User',
          email: `contract.${Date.now()}@example.com`,
          role: 'user',
          profile: {
            firstName: 'Contract',
            lastName: 'User',
            age: 25
          }
        },
        expectedStatus: 201,
        expectedSchema: userSchema
      },
      {
        name: 'Get users with pagination',
        method: 'GET',
        endpoint: '/api/users',
        params: { page: 1, limit: 5 },
        expectedStatus: 200,
        expectedSchema: paginatedResponseSchema
      },
      {
        name: 'Get non-existent user',
        method: 'GET',
        endpoint: '/api/users/99999',
        expectedStatus: 404,
        expectedSchema: errorResponseSchema
      }
    ];

    for (const testCase of testCases) {
      console.log(`Testing contract: ${testCase.name}`);
      
      let response;
      const headers = { 'Authorization': `Bearer ${authToken}` };
      
      switch (testCase.method) {
        case 'GET':
          response = await request.get(testCase.endpoint, {
            headers,
            params: testCase.params
          });
          break;
        case 'POST':
          response = await request.post(testCase.endpoint, {
            headers,
            data: testCase.data
          });
          break;
        default:
          throw new Error(`Unsupported method: ${testCase.method}`);
      }
      
      expect(response.status()).toBe(testCase.expectedStatus);
      
      const responseData = await response.json();
      const validate = ajv.compile(testCase.expectedSchema);
      const isValid = validate(responseData);
      
      if (!isValid) {
        console.log(`Contract validation failed for ${testCase.name}:`, validate.errors);
      }
      
      expect(isValid).toBe(true);
      
      // Cleanup created resources
      if (testCase.method === 'POST' && response.status() === 201) {
        const createdResource = responseData;
        await request.delete(`/api/users/${createdResource.id}`, { headers });
      }
    }
  });

  test('schema evolution and versioning', async ({ request }) => {
    // Test different API versions
    const versions = ['v1', 'v2'];
    
    for (const version of versions) {
      const response = await request.get(`/api/${version}/users/1`, {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Accept': `application/vnd.api+json;version=${version}`
        }
      });
      
      expect(response.status()).toBe(200);
      const userData = await response.json();
      
      // Validate that response includes version info
      expect(userData.meta?.version).toBe(`v${version.slice(1)}`);
      
      // Version-specific validation
      if (version === 'v1') {
        // v1 might have simpler structure
        expect(userData).toHaveProperty('id');
        expect(userData).toHaveProperty('name');
        expect(userData).toHaveProperty('email');
      } else if (version === 'v2') {
        // v2 might have enhanced structure
        const validate = ajv.compile(userSchema);
        expect(validate(userData)).toBe(true);
      }
    }
  });
});
```

**Practical Test**:
- Implement comprehensive JSON schema validation
- Create contract tests for API consistency
- Test API versioning and schema evolution
- Validate error responses and edge cases

**Resources**:
- JSON Schema Specification
- Contract Testing Best Practices

#### **Lesson 4.5: API Performance and Load Testing** ⭐ **API FOCUS**
**Duration**: 2-3 hours | **Type**: API Advanced
**Learning Outcome**: Implement API performance testing and load testing strategies

**Documentation**: 
- Response time measurement
- Throughput testing
- Concurrent request handling
- Performance benchmarking
- Load testing patterns

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('API Performance Testing', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post('/api/auth/login', {
      data: { email: 'admin@example.com', password: 'admin123' }
    });
    const loginData = await loginResponse.json();
    authToken = loginData.token;
  });

  test('response time benchmarking', async ({ request }) => {
    const endpoints = [
      { name: 'Get Users List', url: '/api/users', maxTime: 1000 },
      { name: 'Get Single User', url: '/api/users/1', maxTime: 500 },
      { name: 'Get User Profile', url: '/api/users/1/profile', maxTime: 300 },
      { name: 'Search Users', url: '/api/users/search?q=john', maxTime: 1500 }
    ];

    const results = [];

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      
      const response = await request.get(endpoint.url, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(response.status()).toBe(200);
      expect(responseTime).toBeLessThan(endpoint.maxTime);
      
      results.push({
        endpoint: endpoint.name,
        responseTime,
        maxAllowed: endpoint.maxTime,
        status: 'PASS'
      });
      
      console.log(`${endpoint.name}: ${responseTime}ms (max: ${endpoint.maxTime}ms)`);
    }

    // Calculate average response time
    const avgResponseTime = results.reduce((sum, result) => sum + result.responseTime, 0) / results.length;
    console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`);
    
    expect(avgResponseTime).toBeLessThan(800); // Average should be under 800ms
  });

  test('concurrent request handling', async ({ request }) => {
    const concurrentRequests = 10;
    const endpoint = '/api/users';
    
    const startTime = Date.now();
    
    // Create array of concurrent requests
    const requests = Array.from({ length: concurrentRequests }, (_, index) => 
      request.get(`${endpoint}?page=${index + 1}&limit=10`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
    );
    
    // Execute all requests concurrently
    const responses = await Promise.all(requests);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Validate all responses
    responses.forEach((response, index) => {
      expect(response.status()).toBe(200);
    });
    
    // Performance assertions
    const avgTimePerRequest = totalTime / concurrentRequests;
    console.log(`${concurrentRequests} concurrent requests completed in ${totalTime}ms`);
    console.log(`Average time per request: ${avgTimePerRequest.toFixed(2)}ms`);
    
    expect(totalTime).toBeLessThan(5000); // All requests should complete within 5 seconds
    expect(avgTimePerRequest).toBeLessThan(1000); // Each request should average under 1 second
  });

  test('throughput testing', async ({ request }) => {
    const testDuration = 10000; // 10 seconds
    const startTime = Date.now();
    let requestCount = 0;
    let successCount = 0;
    let errorCount = 0;
    
    const results = [];
    
    while (Date.now() - startTime < testDuration) {
      const requestStart = Date.now();
      
      try {
        const response = await request.get('/api/users', {
          headers: { 'Authorization': `Bearer ${authToken}` },
          params: { page: 1, limit: 5 }
        });
        
        const requestEnd = Date.now();
        const responseTime = requestEnd - requestStart;
        
        requestCount++;
        
        if (response.status() === 200) {
          successCount++;
        }
else {
          errorCount++;
        }
        
        results.push({
          timestamp: requestEnd,
          responseTime,
          status: response.status()
        });
        
      } catch (error) {
        requestCount++;
        errorCount++;
        console.error('Request failed:', error);
      }
    }
    
    const actualDuration = Date.now() - startTime;
    const requestsPerSecond = (requestCount / actualDuration) * 1000;
    const successRate = (successCount / requestCount) * 100;
    
    console.log(`Throughput Test Results:`);
    console.log(`Duration: ${actualDuration}ms`);
    console.log(`Total Requests: ${requestCount}`);
    console.log(`Successful Requests: ${successCount}`);
    console.log(`Failed Requests: ${errorCount}`);
    console.log(`Requests per Second: ${requestsPerSecond.toFixed(2)}`);
    console.log(`Success Rate: ${successRate.toFixed(2)}%`);
    
    // Performance assertions
    expect(requestsPerSecond).toBeGreaterThan(5); // At least 5 requests per second
    expect(successRate).toBeGreaterThan(95); // At least 95% success rate
    
    // Analyze response time distribution
    const responseTimes = results.map(r => r.responseTime);
    const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);
    
    console.log(`Response Time Stats:`);
    console.log(`Average: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Min: ${minResponseTime}ms`);
    console.log(`Max: ${maxResponseTime}ms`);
    
    expect(avgResponseTime).toBeLessThan(1000);
    expect(maxResponseTime).toBeLessThan(3000);
  });

  test('load testing with gradual ramp-up', async ({ request }) => {
    const maxConcurrency = 20;
    const rampUpTime = 5000; // 5 seconds
    const sustainTime = 10000; // 10 seconds
    
    const results = [];
    let activeRequests = 0;
    
    // Gradual ramp-up
    for (let concurrency = 1; concurrency <= maxConcurrency; concurrency++) {
      const delay = (rampUpTime / maxConcurrency) * (concurrency - 1);
      
      setTimeout(async () => {
        const startTime = Date.now();
        activeRequests++;
        
        try {
          const response = await request.get('/api/users', {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          results.push({
            concurrency,
            responseTime,
            status: response.status(),
            timestamp: endTime
          });
          
        } catch (error) {
          results.push({
            concurrency,
            responseTime: -1,
            status: 'ERROR',
            timestamp: Date.now()
          });
        } finally {
          activeRequests--;
        }
      }, delay);
    }
    
    // Wait for all requests to complete
    await new Promise(resolve => {
      const checkCompletion = () => {
        if (activeRequests === 0 && results.length === maxConcurrency) {
          resolve(void 0);
        } else {
          setTimeout(checkCompletion, 100);
        }
      };
      checkCompletion();
    });
    
    // Analyze results
    const successfulResults = results.filter(r => r.status === 200);
    const errorResults = results.filter(r => r.status !== 200);
    
    const successRate = (successfulResults.length / results.length) * 100;
    const avgResponseTime = successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length;
    
    console.log(`Load Test Results:`);
    console.log(`Max Concurrency: ${maxConcurrency}`);
    console.log(`Successful Requests: ${successfulResults.length}`);
    console.log(`Failed Requests: ${errorResults.length}`);
    console.log(`Success Rate: ${successRate.toFixed(2)}%`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
    
    expect(successRate).toBeGreaterThan(90);
    expect(avgResponseTime).toBeLessThan(2000);
  });
});
```

**Practical Test**:
- Implement comprehensive performance benchmarking
- Test concurrent request handling
- Measure API throughput and response times
- Conduct load testing with gradual ramp-up

**Resources**:
- API Performance Testing Guide
- Load Testing Best Practices

---

## Summary of Enhanced Roadmap

### Key Enhancements Made

#### **Coverage Distribution (Enhanced)**
- **API Testing**: 24 lessons (~26% coverage) - **Increased from 1.3%**
- **E2E Testing**: 32 lessons (~35% coverage) - **Maintained strong coverage**
- **Foundation/Integration**: 36 lessons (~39% coverage) - **Enhanced with API fundamentals**

#### **Module-by-Module Enhancements**

**MOD-01: Foundations** (12 lessons, +2 from original)
- ✅ Added 3 comprehensive API lessons (HTTP, JSON, REST principles)
- ✅ Enhanced web technology lessons with API context
- ✅ Integrated API documentation and testing tools

**MOD-02: TypeScript** (14 lessons, +2 from original)
- ✅ Added 3 API-focused TypeScript lessons
- ✅ Enhanced with API client patterns and typing
- ✅ Integrated API response handling and error management

**MOD-03: Playwright Fundamentals** (16 lessons, +2 from original)
- ✅ Added 4 API testing lessons using request fixture
- ✅ Balanced API and E2E introduction
- ✅ Integrated hybrid testing approaches

**MOD-04: Advanced Techniques** (16 lessons, +4 from original)
- ✅ Added 6 comprehensive API testing lessons
- ✅ Enhanced authentication for both API and E2E
- ✅ Comprehensive REST API testing coverage
- ✅ API schema validation and contract testing
- ✅ API performance and load testing

**Remaining Modules** (MOD-05 through MOD-07) would continue with:
- API-specific architecture patterns
- API testing in CI/CD workflows
- API security testing
- Microservices API testing
- API monitoring and observability

### **Learning Path Integration**

#### **Enhanced Learning Paths**
1. **Complete Beginner**: 33-41 weeks (all 92 lessons)
2. **Programming Background**: 22-28 weeks (skip MOD-01)
3. **Testing Experience**: 18-23 weeks (skip MOD-01, MOD-02)
4. **Advanced Practitioner**: 12-18 weeks (focus on MOD-05-07)

### **Resource Integration**

Enhanced resource mapping includes:
- **API Testing Resources**: Postman, REST API guides, JSON Schema validators
- **Performance Testing**: Load testing tools, performance monitoring
- **Authentication**: JWT libraries, OAuth documentation
- **Schema Validation**: JSON Schema specifications, contract testing tools

### **Assessment Framework**

Enhanced certification levels:
1. **Foundation Certificate**: Web + TypeScript fundamentals
2. **API Testing Certificate**: Comprehensive API testing skills
3. **E2E Testing Certificate**: Advanced E2E automation skills
4. **Full-Stack Testing Certificate**: Combined API + E2E expertise
5. **Professional QA Engineer**: Complete program with specialization

---

## 🎯 **Enhanced Success Metrics**

### **Technical Skills Mastery**
- **API Testing**: REST API testing, schema validation, performance testing
- **E2E Testing**: Browser automation, user journey testing, visual validation
- **Integration Testing**: Hybrid API + E2E approaches, data consistency validation
- **Performance Testing**: Load testing, response time optimization
- **Security Testing**: Authentication testing, API security validation

### **Professional Competencies**
- **Comprehensive Testing Strategy**: Ability to design both API and E2E test strategies
- **Test Architecture**: Design scalable testing frameworks for both domains
- **Performance Optimization**: Optimize test execution across API and E2E layers
- **Quality Assurance**: Ensure comprehensive coverage across all application layers

### **Career Readiness**
- **Full-Stack Testing Skills**: Competency in both API and E2E testing
- **Industry Relevance**: Skills aligned with modern testing practices
- **Automation Expertise**: Advanced automation capabilities across testing types
- **Leadership Potential**: Ability to guide testing strategy and implementation

---

## 🚀 **Implementation Roadmap**

### **Phase 1: Foundation Enhancement** (Weeks 1-10)
- Implement enhanced MOD-01 with API fundamentals
- Develop TypeScript patterns for API testing
- Create comprehensive resource library

### **Phase 2: Core Integration** (Weeks 11-25)
- Build balanced Playwright fundamentals curriculum
- Implement hybrid testing approaches
- Develop advanced API testing techniques

### **Phase 3: Advanced Specialization** (Weeks 26-40)
- Complete advanced modules with API focus
- Implement performance and security testing
- Develop specialization tracks

### **Phase 4: Assessment and Certification** (Ongoing)
- Create comprehensive assessment framework
- Develop certification programs
- Implement continuous improvement processes

---

## 📈 **Expected Outcomes**

### **Learner Benefits**
- **Comprehensive Skill Set**: Both API and E2E testing expertise
- **Industry Readiness**: Skills aligned with market demands
- **Career Advancement**: Enhanced job prospects and salary potential
- **Practical Experience**: Real-world applicable skills

### **Industry Impact**
- **Higher Quality Software**: Better testing coverage and practices
- **Improved Efficiency**: Faster and more reliable testing processes
- **Cost Reduction**: Reduced bugs and faster time-to-market
- **Innovation**: Advanced testing approaches and methodologies

---

*This enhanced balanced roadmap represents a comprehensive transformation of the Learning Playwright curriculum, achieving optimal balance between API testing and E2E testing while maintaining educational excellence and practical applicability. With 92 focused lessons across 7 modules, integrated with enhanced resources and flexible learning paths, it provides a complete educational framework for developing professional QA automation skills in both API and E2E testing domains.*

---

## 📚 **Next Steps for Implementation**

1. **Content Development**: Begin creating detailed lesson content following this roadmap
2. **Resource Curation**: Expand resource library with API testing materials
3. **Assessment Design**: Develop comprehensive assessment framework
4. **Platform Integration**: Implement enhanced curriculum in learning platform
5. **Community Building**: Establish learner and instructor communities
6. **Continuous Improvement**: Implement feedback loops and regular updates

**Total Enhanced Curriculum**: 92 lessons | 33-41 weeks | 250-350 hours | Balanced API + E2E coverage