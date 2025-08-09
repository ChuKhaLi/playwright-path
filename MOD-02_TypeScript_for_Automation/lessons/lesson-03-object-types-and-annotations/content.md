# Object Types and Annotations

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Define Complex Object Types**: Create detailed object type annotations for test automation scenarios
2. **Use Optional Properties**: Apply optional properties (`?`) for flexible object structures
3. **Implement Readonly Properties**: Use `readonly` modifier for immutable test data
4. **Apply Index Signatures**: Handle dynamic properties in API responses and configuration objects
5. **Create Nested Objects**: Build complex hierarchical structures for page objects and test data
6. **Design Automation-Specific Types**: Create object types tailored for testing scenarios

## Introduction to Object Types

Object types are the foundation of TypeScript's type system and are essential for test automation. They allow you to define the shape and structure of complex data, ensuring type safety when working with page objects, test data, API responses, and configuration files.

### Why Object Types Matter in Testing

In test automation, you frequently work with:
- **Page Objects**: Representing web page elements and their interactions
- **Test Data**: User information, form data, and test scenarios
- **API Responses**: Server responses with complex nested structures
- **Configuration Objects**: Test settings, environment configurations, and browser options

Object types ensure that these structures are consistent, predictable, and error-free.

## Basic Object Type Syntax

### Inline Object Types

The simplest way to define an object type is inline:

```typescript
// Inline object type for user data
function createUser(user: { name: string; email: string; age: number }) {
  console.log(`Creating user: ${user.name} (${user.email})`);
}

// Usage
createUser({
  name: "John Doe",
  email: "john@example.com",
  age: 30
});
```

### Type Aliases for Reusability

For complex objects used multiple times, create type aliases:

```typescript
// Define a reusable User type
type User = {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
};

// Use the type alias
function validateUser(user: User): boolean {
  return user.email.includes('@') && user.age >= 18;
}

function updateUser(user: User): User {
  return { ...user, isActive: true };
}
```

### Interface Declarations

Interfaces provide another way to define object types, especially useful for extensibility:

```typescript
// Interface for test configuration
interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
}

// Usage in test setup
function setupTest(config: TestConfig) {
  console.log(`Setting up test with base URL: ${config.baseUrl}`);
  console.log(`Timeout: ${config.timeout}ms, Retries: ${config.retries}`);
}
```

## Optional Properties

Optional properties allow objects to have flexible structures, essential for handling varying test scenarios and API responses.

### Basic Optional Properties

Use the `?` operator to make properties optional:

```typescript
// User type with optional properties
type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;        // Optional
  address?: string;      // Optional
  preferences?: {        // Optional nested object
    newsletter: boolean;
    theme: 'light' | 'dark';
  };
};

// Valid usage - required properties only
const basicUser: User = {
  id: "user-123",
  name: "Jane Smith",
  email: "jane@example.com"
};

// Valid usage - with optional properties
const detailedUser: User = {
  id: "user-456",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1-555-0123",
  address: "123 Main St",
  preferences: {
    newsletter: true,
    theme: 'dark'
  }
};
```

### Optional Properties in Test Data

Optional properties are particularly useful for test data variations:

```typescript
// Test data type for form testing
type FormData = {
  // Required fields
  firstName: string;
  lastName: string;
  email: string;
  
  // Optional fields for different test scenarios
  middleName?: string;
  phone?: string;
  company?: string;
  newsletter?: boolean;
};

// Test scenarios with different data completeness
const minimalFormData: FormData = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com"
};

const completeFormData: FormData = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  middleName: "Michael",
  phone: "+1-555-0123",
  company: "Acme Corp",
  newsletter: true
};
```

## Readonly Properties

Readonly properties prevent accidental modification of important data, ensuring test data integrity and configuration immutability.

### Basic Readonly Usage

```typescript
// Configuration type with readonly properties
type TestEnvironment = {
  readonly name: string;
  readonly baseUrl: string;
  readonly apiKey: string;
  timeout: number;        // Mutable
  retries: number;        // Mutable
};

const prodEnvironment: TestEnvironment = {
  name: "production",
  baseUrl: "https://api.example.com",
  apiKey: "prod-key-123",
  timeout: 30000,
  retries: 3
};

// This is allowed - modifying mutable properties
prodEnvironment.timeout = 60000;
prodEnvironment.retries = 5;

// This would cause TypeScript errors - readonly properties
// prodEnvironment.name = "staging";        // Error!
// prodEnvironment.baseUrl = "other-url";   // Error!
```

### Readonly for Test Data Protection

```typescript
// Test user data that shouldn't be modified during tests
type TestUser = {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  // Mutable properties for test state
  isLoggedIn: boolean;
  lastLoginDate?: Date;
};

const testUser: TestUser = {
  id: "test-user-001",
  username: "testuser",
  email: "test@example.com",
  isLoggedIn: false
};

// Safe to modify test state
testUser.isLoggedIn = true;
testUser.lastLoginDate = new Date();

// Protected from accidental modification
// testUser.id = "different-id";  // Error!
```

## Index Signatures

Index signatures allow objects to have dynamic properties, essential for handling API responses with unknown property names or configuration objects with flexible keys.

### Basic Index Signatures

```typescript
// API response with dynamic properties
type ApiResponse = {
  status: number;
  message: string;
  // Index signature for additional dynamic properties
  [key: string]: any;
};

// Usage with dynamic properties
const response: ApiResponse = {
  status: 200,
  message: "Success",
  data: { users: [] },           // Dynamic property
  timestamp: "2024-01-01",       // Dynamic property
  requestId: "req-123"           // Dynamic property
};
```

### Typed Index Signatures

For better type safety, specify the value type in index signatures:

```typescript
// Configuration object with string values
type Config = {
  // Known properties
  environment: string;
  debug: boolean;
  // Dynamic string properties
  [key: string]: string | boolean | number;
};

// Test data with dynamic properties
type TestData = {
  testName: string;
  // Dynamic test parameters
  [parameter: string]: string | number | boolean;
};

const loginTest: TestData = {
  testName: "User Login Test",
  username: "testuser",
  password: "password123",
  rememberMe: true,
  timeout: 5000
};
```

### API Response Handling

Index signatures are particularly useful for API responses:

```typescript
// Generic API response structure
type ApiResponse<T = any> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  // Additional metadata with flexible structure
  [metadata: string]: any;
};

// Specific user API response
type UserApiResponse = ApiResponse<{
  id: string;
  name: string;
  email: string;
}>;

// Usage in test
function handleApiResponse(response: UserApiResponse) {
  if (response.success && response.data) {
    console.log(`User: ${response.data.name} (${response.data.email})`);
  }
  
  // Access dynamic metadata
  if (response.requestId) {
    console.log(`Request ID: ${response.requestId}`);
  }
}
```

## Nested Object Types

Complex applications require nested object structures for representing hierarchical data like page objects, user profiles, and configuration settings.

### Basic Nested Objects

```typescript
// User profile with nested address and preferences
type UserProfile = {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      profileVisible: boolean;
      shareData: boolean;
    };
  };
};

// Usage
const userProfile: UserProfile = {
  id: "user-789",
  personalInfo: {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "+1-555-0199"
  },
  address: {
    street: "456 Oak Avenue",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    country: "USA"
  },
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      profileVisible: true,
      shareData: false
    }
  }
};
```

### Page Object Model Types

Nested objects are perfect for page object models:

```typescript
// Page object type for a login page
type LoginPage = {
  url: string;
  elements: {
    form: {
      container: string;
      usernameInput: string;
      passwordInput: string;
      rememberMeCheckbox: string;
      submitButton: string;
      forgotPasswordLink: string;
    };
    messages: {
      errorContainer: string;
      successContainer: string;
    };
  };
  actions: {
    login: (username: string, password: string) => Promise<void>;
    forgotPassword: () => Promise<void>;
    toggleRememberMe: () => Promise<void>;
  };
};

// Implementation would use this type structure
const loginPage: LoginPage = {
  url: "/login",
  elements: {
    form: {
      container: "[data-testid='login-form']",
      usernameInput: "[data-testid='username']",
      passwordInput: "[data-testid='password']",
      rememberMeCheckbox: "[data-testid='remember-me']",
      submitButton: "[data-testid='submit']",
      forgotPasswordLink: "[data-testid='forgot-password']"
    },
    messages: {
      errorContainer: "[data-testid='error-message']",
      successContainer: "[data-testid='success-message']"
    }
  },
  actions: {
    login: async (username: string, password: string) => {
      // Implementation would go here
    },
    forgotPassword: async () => {
      // Implementation would go here
    },
    toggleRememberMe: async () => {
      // Implementation would go here
    }
  }
};
```

## Automation-Specific Object Types

### Test Case Structure

```typescript
// Comprehensive test case type
type TestCase = {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  preconditions?: string[];
  steps: {
    stepNumber: number;
    action: string;
    expectedResult: string;
    data?: Record<string, any>;
  }[];
  testData: {
    valid: Record<string, any>;
    invalid?: Record<string, any>;
    edge?: Record<string, any>;
  };
  environment: {
    browser?: string[];
    device?: string[];
    os?: string[];
  };
};

// Example test case
const userRegistrationTest: TestCase = {
  id: "TC-001",
  name: "User Registration - Happy Path",
  description: "Test successful user registration with valid data",
  priority: "high",
  tags: ["registration", "user-management", "smoke"],
  preconditions: [
    "Application is accessible",
    "Database is clean"
  ],
  steps: [
    {
      stepNumber: 1,
      action: "Navigate to registration page",
      expectedResult: "Registration form is displayed"
    },
    {
      stepNumber: 2,
      action: "Fill registration form with valid data",
      expectedResult: "Form accepts all input",
      data: { formData: "valid" }
    },
    {
      stepNumber: 3,
      action: "Submit registration form",
      expectedResult: "User is registered and redirected to dashboard"
    }
  ],
  testData: {
    valid: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!"
    },
    invalid: {
      email: "invalid-email",
      password: "weak"
    }
  },
  environment: {
    browser: ["chrome", "firefox", "safari"],
    device: ["desktop", "tablet"],
    os: ["windows", "macos", "linux"]
  }
};
```

### Browser Configuration Types

```typescript
// Browser configuration for test execution
type BrowserConfig = {
  name: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
  permissions?: string[];
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  locale?: string;
  timezoneId?: string;
  extraHTTPHeaders?: Record<string, string>;
};

// Test environment configuration
type TestEnvironment = {
  name: string;
  baseUrl: string;
  apiBaseUrl: string;
  database: {
    host: string;
    port: number;
    name: string;
    credentials: {
      readonly username: string;
      readonly password: string;
    };
  };
  browsers: BrowserConfig[];
  timeouts: {
    default: number;
    navigation: number;
    assertion: number;
  };
  retries: {
    test: number;
    assertion: number;
  };
  reporting: {
    enabled: boolean;
    formats: ('html' | 'json' | 'junit')[];
    outputDir: string;
  };
};
```

## Best Practices for Object Types

### 1. Use Descriptive Property Names

```typescript
// ✅ Good - descriptive and clear
type UserAccount = {
  accountId: string;
  displayName: string;
  emailAddress: string;
  isEmailVerified: boolean;
  accountCreatedDate: Date;
  lastLoginTimestamp?: Date;
};

// ❌ Avoid - unclear abbreviations
type UserAccount = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  created: Date;
  login?: Date;
};
```

### 2. Group Related Properties

```typescript
// ✅ Good - logical grouping
type TestConfiguration = {
  execution: {
    parallel: boolean;
    workers: number;
    timeout: number;
    retries: number;
  };
  reporting: {
    enabled: boolean;
    format: string;
    outputPath: string;
  };
  browser: {
    name: string;
    headless: boolean;
    viewport: { width: number; height: number };
  };
};
```

### 3. Use Union Types for Constrained Values

```typescript
// ✅ Good - constrained values
type TestResult = {
  status: 'passed' | 'failed' | 'skipped' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'critical';
  environment: 'development' | 'staging' | 'production';
};
```

## Summary

Object types are fundamental to TypeScript and essential for test automation. Key concepts include:

1. **Basic Syntax**: Inline types, type aliases, and interfaces for defining object shapes
2. **Optional Properties**: Using `?` for flexible object structures in test scenarios
3. **Readonly Properties**: Protecting important data from accidental modification
4. **Index Signatures**: Handling dynamic properties in API responses and configurations
5. **Nested Objects**: Creating complex hierarchical structures for page objects and test data
6. **Automation Applications**: Designing types specifically for testing scenarios

By mastering object types, you'll create more reliable, maintainable, and type-safe test automation code that catches errors early and provides excellent developer experience.

## Next Steps

In the next lesson, **Function Types and Signatures**, you'll learn how to type functions, methods, and callbacks - essential skills for creating typed page object methods, test utilities, and API interaction functions.