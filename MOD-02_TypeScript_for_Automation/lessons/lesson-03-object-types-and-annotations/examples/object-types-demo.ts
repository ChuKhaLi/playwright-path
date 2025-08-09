/**
 * Object Types and Annotations - Comprehensive Examples
 * 
 * This file demonstrates various object typing patterns specifically
 * tailored for test automation scenarios including page objects,
 * test data, API responses, and configuration management.
 */

// =============================================================================
// BASIC OBJECT TYPES
// =============================================================================

// Simple object type for user data
type User = {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
};

// Function using the User type
function createUser(userData: User): User {
  console.log(`Creating user: ${userData.name} (${userData.email})`);
  return { ...userData, isActive: true };
}

// Usage example
const newUser: User = {
  id: "user-001",
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  isActive: false
};

const activeUser = createUser(newUser);
console.log(`User ${activeUser.name} is now active: ${activeUser.isActive}`);

// =============================================================================
// OPTIONAL PROPERTIES
// =============================================================================

// Test data type with optional properties for flexible test scenarios
type TestFormData = {
  // Required fields
  firstName: string;
  lastName: string;
  email: string;
  
  // Optional fields for different test scenarios
  middleName?: string;
  phone?: string;
  company?: string;
  newsletter?: boolean;
  preferences?: {
    theme: 'light' | 'dark';
    language: string;
  };
};

// Test scenarios with different data completeness
const minimalTestData: TestFormData = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com"
};

const completeTestData: TestFormData = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  middleName: "Marie",
  phone: "+1-555-0123",
  company: "Tech Corp",
  newsletter: true,
  preferences: {
    theme: 'dark',
    language: 'en-US'
  }
};

// Function that handles optional properties
function processFormData(data: TestFormData): string {
  let result = `Processing form for ${data.firstName} ${data.lastName}`;
  
  if (data.middleName) {
    result += ` ${data.middleName}`;
  }
  
  if (data.company) {
    result += ` from ${data.company}`;
  }
  
  if (data.preferences) {
    result += ` (Theme: ${data.preferences.theme})`;
  }
  
  return result;
}

console.log(processFormData(minimalTestData));
console.log(processFormData(completeTestData));

// =============================================================================
// READONLY PROPERTIES
// =============================================================================

// Test environment configuration with readonly properties
type TestEnvironment = {
  readonly name: string;
  readonly baseUrl: string;
  readonly apiKey: string;
  readonly databaseUrl: string;
  
  // Mutable runtime properties
  timeout: number;
  retries: number;
  parallelTests: number;
};

const productionEnv: TestEnvironment = {
  name: "production",
  baseUrl: "https://api.example.com",
  // In a real application, this should be loaded from a secure source like environment variables
  apiKey: "YOUR_API_KEY_PLACEHOLDER",
  databaseUrl: "postgres://prod-db:5432/app",
  timeout: 30000,
  retries: 3,
  parallelTests: 4
};

// These modifications are allowed
productionEnv.timeout = 60000;
productionEnv.retries = 5;

// These would cause TypeScript errors (readonly properties)
// productionEnv.name = "staging";        // Error!
// productionEnv.baseUrl = "other-url";   // Error!

console.log(`Environment: ${productionEnv.name} - Timeout: ${productionEnv.timeout}ms`);

// =============================================================================
// INDEX SIGNATURES
// =============================================================================

// API response type with dynamic properties
type ApiResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  // Index signature for additional dynamic properties
  [key: string]: any;
};

// Example API responses with dynamic properties
const userApiResponse: ApiResponse = {
  success: true,
  statusCode: 200,
  message: "User retrieved successfully",
  timestamp: "2024-01-15T10:30:00Z",
  data: {
    id: "user-123",
    name: "Alice Johnson",
    email: "alice@example.com"
  },
  requestId: "req-abc-123",
  executionTime: 45
};

const errorApiResponse: ApiResponse = {
  success: false,
  statusCode: 404,
  message: "User not found",
  timestamp: "2024-01-15T10:31:00Z",
  errorCode: "USER_NOT_FOUND",
  details: "No user found with the provided ID"
};

// Function to handle API responses with dynamic properties
function handleApiResponse(response: ApiResponse): void {
  console.log(`API Response: ${response.message} (${response.statusCode})`);
  
  if (response.success && response.data) {
    console.log(`Data received:`, response.data);
  }
  
  if (response.requestId) {
    console.log(`Request ID: ${response.requestId}`);
  }
  
  if (response.errorCode) {
    console.log(`Error Code: ${response.errorCode}`);
  }
}

handleApiResponse(userApiResponse);
handleApiResponse(errorApiResponse);

// Configuration object with typed index signature
type TestConfig = {
  environment: string;
  debug: boolean;
  // Typed index signature for additional configuration
  [configKey: string]: string | boolean | number;
};

const testConfig: TestConfig = {
  environment: "staging",
  debug: true,
  maxRetries: 3,
  timeout: 5000,
  headless: false,
  screenshotOnFailure: true,
  videoRecording: false
};

// Function to process configuration
function applyTestConfig(config: TestConfig): void {
  console.log(`Applying configuration for ${config.environment} environment`);
  
  Object.entries(config).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
}

applyTestConfig(testConfig);

// =============================================================================
// NESTED OBJECT TYPES
// =============================================================================

// Complex page object model type
type LoginPageObject = {
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
      loadingSpinner: string;
    };
    navigation: {
      homeLink: string;
      signupLink: string;
      helpLink: string;
    };
  };
  testData: {
    validCredentials: {
      username: string;
      password: string;
    };
    invalidCredentials: {
      username: string;
      password: string;
    };
  };
};

// Implementation of the login page object
const loginPage: LoginPageObject = {
  url: "/login",
  elements: {
    form: {
      container: "[data-testid='login-form']",
      usernameInput: "[data-testid='username-input']",
      passwordInput: "[data-testid='password-input']",
      rememberMeCheckbox: "[data-testid='remember-me']",
      submitButton: "[data-testid='submit-button']",
      forgotPasswordLink: "[data-testid='forgot-password']"
    },
    messages: {
      errorContainer: "[data-testid='error-message']",
      successContainer: "[data-testid='success-message']",
      loadingSpinner: "[data-testid='loading-spinner']"
    },
    navigation: {
      homeLink: "[data-testid='home-link']",
      signupLink: "[data-testid='signup-link']",
      helpLink: "[data-testid='help-link']"
    }
  },
  testData: {
    validCredentials: {
      username: "testuser@example.com",
      // Passwords should never be hardcoded. Use environment variables or a secret manager.
      password: "VALID_PASSWORD_PLACEHOLDER"
    },
    invalidCredentials: {
      username: "invalid@example.com",
      password: "INVALID_PASSWORD_PLACEHOLDER"
    }
  }
};

// Function to demonstrate page object usage
function demonstratePageObject(pageObject: LoginPageObject): void {
  console.log(`Page Object for: ${pageObject.url}`);
  console.log(`Username input selector: ${pageObject.elements.form.usernameInput}`);
  console.log(`Valid test username: ${pageObject.testData.validCredentials.username}`);
}

demonstratePageObject(loginPage);

// =============================================================================
// COMPLEX TEST CASE STRUCTURE
// =============================================================================

// Comprehensive test case type
type TestCase = {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  preconditions?: string[];
  steps: Array<{
    stepNumber: number;
    action: string;
    expectedResult: string;
    data?: Record<string, any>;
  }>;
  testData: {
    valid: Record<string, any>;
    invalid?: Record<string, any>;
    boundary?: Record<string, any>;
  };
  environment: {
    browsers: string[];
    devices?: string[];
    operatingSystems?: string[];
  };
  expectedDuration: number; // in milliseconds
};

// Example test case implementation
const userRegistrationTestCase: TestCase = {
  id: "TC-REG-001",
  name: "User Registration - Happy Path",
  description: "Verify that a new user can successfully register with valid information",
  priority: "high",
  tags: ["registration", "user-management", "smoke-test", "critical-path"],
  preconditions: [
    "Application is accessible",
    "Database is in clean state",
    "Email service is available"
  ],
  steps: [
    {
      stepNumber: 1,
      action: "Navigate to registration page",
      expectedResult: "Registration form is displayed with all required fields"
    },
    {
      stepNumber: 2,
      action: "Fill registration form with valid data",
      expectedResult: "All form fields accept input without validation errors",
      data: { source: "valid" }
    },
    {
      stepNumber: 3,
      action: "Submit registration form",
      expectedResult: "User is registered successfully and redirected to welcome page"
    },
    {
      stepNumber: 4,
      action: "Verify welcome message and user session",
      expectedResult: "Welcome message displays user name and session is established"
    }
  ],
  testData: {
    valid: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe.test@example.com",
      // Test data with sensitive information should be handled securely
      password: "VALID_PASSWORD_PLACEHOLDER",
      confirmPassword: "VALID_PASSWORD_PLACEHOLDER",
      agreeToTerms: true
    },
    invalid: {
      firstName: "",
      lastName: "D",
      email: "invalid-email",
      password: "INVALID_PASSWORD_PLACEHOLDER",
      confirmPassword: "DIFFERENT_PASSWORD_PLACEHOLDER",
      agreeToTerms: false
    },
    boundary: {
      firstName: "A".repeat(50), // Maximum length
      lastName: "B".repeat(50),
      email: "very.long.email.address.for.boundary.testing@example.com",
      password: "LONG_COMPLEX_PASSWORD_PLACEHOLDER"
    }
  },
  environment: {
    browsers: ["chrome", "firefox", "safari", "edge"],
    devices: ["desktop", "tablet", "mobile"],
    operatingSystems: ["windows", "macos", "linux", "ios", "android"]
  },
  expectedDuration: 45000 // 45 seconds
};

// Function to process and validate test case
function processTestCase(testCase: TestCase): void {
  console.log(`\n=== Test Case: ${testCase.id} ===`);
  console.log(`Name: ${testCase.name}`);
  console.log(`Priority: ${testCase.priority.toUpperCase()}`);
  console.log(`Tags: ${testCase.tags.join(', ')}`);
  console.log(`Steps: ${testCase.steps.length}`);
  console.log(`Expected Duration: ${testCase.expectedDuration / 1000}s`);
  
  if (testCase.preconditions) {
    console.log(`Preconditions: ${testCase.preconditions.length}`);
  }
  
  console.log(`Test Data Sets: Valid=${Object.keys(testCase.testData.valid).length}`);
  if (testCase.testData.invalid) {
    console.log(`                Invalid=${Object.keys(testCase.testData.invalid).length}`);
  }
  if (testCase.testData.boundary) {
    console.log(`                Boundary=${Object.keys(testCase.testData.boundary).length}`);
  }
  
  console.log(`Target Browsers: ${testCase.environment.browsers.join(', ')}`);
}

processTestCase(userRegistrationTestCase);

// =============================================================================
// UTILITY FUNCTIONS FOR OBJECT TYPE VALIDATION
// =============================================================================

// Type guard function to check if an object is a valid User
function isValidUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.age === 'number' &&
    typeof obj.isActive === 'boolean'
  );
}

// Function to safely process unknown data
function processUnknownUserData(data: unknown): User | null {
  if (isValidUser(data)) {
    console.log(`Processing valid user: ${data.name}`);
    return data;
  } else {
    console.log('Invalid user data received');
    return null;
  }
}

// Test the type guard
const validUserData = {
  id: "user-002",
  name: "Jane Smith",
  email: "jane@example.com",
  age: 28,
  isActive: true
};

const invalidUserData = {
  id: "user-003",
  name: "Bob",
  // Missing required fields
};

console.log('\n=== Type Guard Testing ===');
processUnknownUserData(validUserData);
processUnknownUserData(invalidUserData);

/**
 * Summary of Object Type Patterns Demonstrated:
 * 
 * 1. Basic Object Types:
 *    - Simple type definitions with required properties
 *    - Type aliases for reusability
 * 
 * 2. Optional Properties:
 *    - Flexible object structures with ? operator
 *    - Handling different test data scenarios
 * 
 * 3. Readonly Properties:
 *    - Immutable configuration data
 *    - Protection against accidental modification
 * 
 * 4. Index Signatures:
 *    - Dynamic properties in API responses
 *    - Flexible configuration objects
 * 
 * 5. Nested Objects:
 *    - Complex hierarchical structures
 *    - Page object models and test cases
 * 
 * 6. Type Guards:
 *    - Runtime type validation
 *    - Safe handling of unknown data
 * 
 * Key Benefits for Test Automation:
 * - Type safety prevents runtime errors
 * - Better IDE support with autocomplete
 * - Self-documenting code structure
 * - Easier refactoring and maintenance
 * - Consistent data structures across tests
 */