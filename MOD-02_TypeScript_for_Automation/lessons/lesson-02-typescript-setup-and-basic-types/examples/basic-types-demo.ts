/**
 * Basic Types Demo - TypeScript for Automation
 * This file demonstrates fundamental TypeScript types in testing contexts
 */

// ===== PRIMITIVE TYPES =====

// String types for test data
const testUsername: string = "automation_user";
const testEmail: string = "test@example.com";
const testDescription: string = "Should successfully login with valid credentials";

// Number types for test configuration
const timeoutMs: number = 5000;
const maxRetries: number = 3;
const expectedStatusCode: number = 200;
const responseTimeThreshold: number = 2.5; // seconds

// Boolean types for test flags
const runHeadless: boolean = true;
const enableScreenshots: boolean = false;
const shouldRetryOnFailure: boolean = true;

// ===== ARRAY TYPES =====

// Array of strings - test environments
const environments: string[] = ["development", "staging", "production"];

// Array of numbers - valid HTTP status codes
const successCodes: number[] = [200, 201, 202, 204];
const clientErrorCodes: number[] = [400, 401, 403, 404, 409];

// Array of booleans - test results
const testResults: boolean[] = [true, true, false, true, true];

// Generic array syntax
const browserNames: Array<string> = ["chromium", "firefox", "webkit"];
const ports: Array<number> = [3000, 8080, 9000];

// ===== TYPE INFERENCE EXAMPLES =====

// TypeScript infers these types automatically
const inferredString = "This is a string"; // string
const inferredNumber = 42; // number
const inferredBoolean = true; // boolean
const inferredArray = [1, 2, 3, 4, 5]; // number[]

// ===== PRACTICAL TESTING EXAMPLES =====

// Test user data with explicit types
const testUser: {
    id: number;
    username: string;
    email: string;
    isActive: boolean;
    roles: string[];
} = {
    id: 12345,
    username: "testuser",
    email: "testuser@example.com",
    isActive: true,
    roles: ["user", "tester"]
};

// API endpoint configuration
const apiEndpoints: string[] = [
    "/api/auth/login",
    "/api/users",
    "/api/products",
    "/api/orders"
];

// Test timing configurations
const timeouts: {
    short: number;
    medium: number;
    long: number;
} = {
    short: 1000,
    medium: 5000,
    long: 30000
};

// ===== UTILITY FUNCTIONS WITH TYPES =====

/**
 * Generates a random email for testing
 * @returns A unique email address
 */
function generateTestEmail(): string {
    const timestamp: number = Date.now();
    const randomNum: number = Math.floor(Math.random() * 1000);
    return `test${timestamp}${randomNum}@example.com`;
}

/**
 * Checks if a status code indicates success
 * @param statusCode - HTTP status code to check
 * @returns True if status code is successful
 */
function isSuccessStatusCode(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 300;
}

/**
 * Formats test results for display
 * @param testName - Name of the test
 * @param passed - Whether the test passed
 * @returns Formatted result string
 */
function formatTestResult(testName: string, passed: boolean): string {
    const status: string = passed ? "✅ PASSED" : "❌ FAILED";
    return `${testName}: ${status}`;
}

/**
 * Creates a delay for testing purposes
 * @param milliseconds - Number of milliseconds to wait
 * @returns Promise that resolves after the delay
 */
function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

// ===== DEMONSTRATION USAGE =====

// Using the utility functions
console.log("=== TypeScript Basic Types Demo ===");

// Generate test data
const generatedEmail: string = generateTestEmail();
console.log(`Generated email: ${generatedEmail}`);

// Check status codes
const testStatusCode: number = 201;
const isSuccess: boolean = isSuccessStatusCode(testStatusCode);
console.log(`Status ${testStatusCode} is success: ${isSuccess}`);

// Format test results
const testName: string = "User Login Test";
const testPassed: boolean = true;
const formattedResult: string = formatTestResult(testName, testPassed);
console.log(formattedResult);

// Working with arrays
console.log("\n=== Array Operations ===");
console.log(`Available environments: ${environments.join(", ")}`);
console.log(`Success codes: ${successCodes.join(", ")}`);
console.log(`Total browsers to test: ${browserNames.length}`);

// Type inference demonstration
console.log("\n=== Type Inference ===");
console.log(`Inferred string type: ${typeof inferredString}`);
console.log(`Inferred number type: ${typeof inferredNumber}`);
console.log(`Inferred boolean type: ${typeof inferredBoolean}`);

// ===== EXPORT FOR USE IN OTHER FILES =====

export {
    testUser,
    apiEndpoints,
    timeouts,
    generateTestEmail,
    isSuccessStatusCode,
    formatTestResult,
    delay
};