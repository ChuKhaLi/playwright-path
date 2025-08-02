# Exercise 01: Basic Step Definition Workshop

## Overview

This hands-on workshop introduces you to the fundamentals of implementing step definitions in TypeScript. You'll create your first step definitions, learn proper TypeScript patterns, and integrate with Playwright for browser automation. This exercise establishes the foundation for all advanced BDD automation techniques.

## Learning Objectives

By completing this exercise, you will be able to:

### **Primary Objectives**
- Implement basic Given/When/Then step definitions in TypeScript
- Use proper async/await patterns with Playwright
- Create meaningful assertions using Playwright's expect API
- Handle simple parameter extraction from Gherkin steps
- Structure step definition files for maintainability

### **Secondary Objectives**
- Set up a complete Cucumber project with TypeScript
- Configure World object for shared state
- Implement basic error handling in step definitions
- Use console logging for debugging and verification
- Follow TypeScript best practices in BDD context

## Exercise Scenario

**Context**: You're building automated tests for a simple task management application. Users can create accounts, log in, manage tasks, and track their productivity. This exercise focuses on implementing the authentication and basic navigation functionality.

**Business Value**: Ensuring users can reliably access their personal task management system builds trust and user satisfaction.

**Your Role**: QA Automation Engineer implementing BDD step definitions for the core authentication features.

## Prerequisites

### **Technical Requirements**
- Node.js 18+ installed
- Basic TypeScript knowledge
- Understanding of async/await concepts
- Completed previous lessons (01-03)

### **Environment Setup**
```bash
# Install dependencies
npm install @cucumber/cucumber @playwright/test typescript ts-node

# Initialize Playwright
npx playwright install chromium
```

## Task 1: Project Structure Setup (15 minutes)

### **Objective**: Create a properly organized Cucumber TypeScript project

### **Implementation Steps**

1. **Create the directory structure**:
```
01-basic-step-definition-workshop/
├── features/
│   └── authentication.feature
├── step-definitions/
│   └── auth.steps.ts
├── support/
│   ├── world.ts
│   └── hooks.ts
├── cucumber.config.js
├── tsconfig.json
├── playwright.config.ts
└── package.json
```

2. **Configure TypeScript** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./",
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
    "**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

3. **Configure Cucumber** (`cucumber.config.js`):
```javascript
module.exports = {
  default: {
    require: [
      'step-definitions/**/*.ts',
      'support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    parallel: 1,
    retry: 1
  }
};
```

4. **Configure Playwright** (`playwright.config.ts`):
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './features',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
```

### **Validation Criteria**
- ✅ All configuration files are properly created
- ✅ TypeScript compiles without errors
- ✅ Directory structure follows best practices
- ✅ Dependencies are correctly installed

## Task 2: World Object Implementation (10 minutes)

### **Objective**: Set up shared state management for step definitions

### **Implementation**: Create `support/world.ts`

```typescript
import { World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';

export interface CustomWorld extends World {
  // Browser instances
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  
  // Test data
  testUser?: TestUser;
  lastError?: Error;
  
  // Session state
  isLoggedIn?: boolean;
  currentUrl?: string;
}

export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class CustomWorldImpl extends World implements CustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  testUser?: TestUser;
  lastError?: Error;
  isLoggedIn?: boolean;
  currentUrl?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async cleanup(): Promise<void> {
    this.lastError = undefined;
    this.isLoggedIn = false;
    this.currentUrl = undefined;
    // Keep browser instances for reuse
  }
}
```

### **Implementation**: Create `support/hooks.ts`

```typescript
import { Before, After, BeforeAll, AfterAll, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, chromium, Page } from '@playwright/test';
import { CustomWorldImpl, CustomWorld } from './world';

// Set the custom World constructor
setWorldConstructor(CustomWorldImpl);

let browser: Browser;

BeforeAll(async function () {
  // Launch browser once for all scenarios
  browser = await chromium.launch({ 
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
  });
  console.log('🚀 Browser launched');
});

Before(async function (this: CustomWorld) {
  // Create new context and page for each scenario
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  
  // Optional: Set up console logging
  this.page.on('console', msg => {
    if (process.env.LOG_CONSOLE === 'true') {
      console.log(`📄 Console ${msg.type()}: ${msg.text()}`);
    }
  });
  
  console.log('✅ New browser context created');
});

After(async function (this: CustomWorld) {
  // Take screenshot on failure
  if (this.result?.status === 'FAILED' && this.page) {
    const screenshot = await this.page.screenshot({ 
      path: `screenshots/failed-${Date.now()}.png`,
      fullPage: true 
    });
    this.attach(screenshot, 'image/png');
  }
  
  // Cleanup context
  if (this.context) {
    await this.context.close();
    console.log('🧹 Browser context closed');
  }
  
  // Clean up test data
  await this.cleanup();
});

AfterAll(async function () {
  // Close browser after all scenarios
  if (browser) {
    await browser.close();
    console.log('🛑 Browser closed');
  }
});
```

### **Validation Criteria**
- ✅ World object is properly typed with TypeScript interfaces
- ✅ Browser lifecycle is managed correctly
- ✅ Screenshots are captured on test failures
- ✅ Console logging is configurable

## Task 3: Feature File Creation (10 minutes)

### **Objective**: Create a comprehensive feature file for authentication

### **Implementation**: Create `features/authentication.feature`

```gherkin
Feature: User Authentication
  As a task management user
  I want to log into my account
  So that I can access my personal tasks and productivity data

  Background:
    Given the task management application is running
    And I am on the login page

  Scenario: Successful login with valid credentials
    When I enter "john.doe@example.com" in the email field
    And I enter "securePassword123" in the password field
    And I click the "Login" button
    Then I should be redirected to the dashboard
    And I should see "Welcome back, John!"
    And I should see the main navigation menu

  Scenario: Failed login with invalid email
    When I enter "invalid.email@example.com" in the email field
    And I enter "somePassword123" in the password field
    And I click the "Login" button
    Then I should remain on the login page
    And I should see "Invalid email or password"
    And I should not see the main navigation menu

  Scenario: Failed login with invalid password
    When I enter "john.doe@example.com" in the email field
    And I enter "wrongPassword" in the password field
    And I click the "Login" button
    Then I should remain on the login page
    And I should see "Invalid email or password"

  Scenario: Empty form submission
    When I click the "Login" button
    Then I should remain on the login page
    And I should see "Email is required"
    And I should see "Password is required"

  Scenario: Logout functionality
    Given I am logged in as "john.doe@example.com"
    When I click the "Logout" button
    Then I should be redirected to the login page
    And I should not see the main navigation menu
    And I should see the login form
```

### **Validation Criteria**
- ✅ Feature file follows proper Gherkin syntax
- ✅ Scenarios cover positive and negative test cases
- ✅ Background is used to reduce duplication
- ✅ Steps are written in business language
- ✅ Parameters are properly quoted for extraction

## Task 4: Step Definition Implementation (15 minutes)

### **Objective**: Implement TypeScript step definitions for all scenarios

### **Implementation**: Create `step-definitions/auth.steps.ts`

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld, TestUser } from '../support/world';

// Background steps
Given('the task management application is running', async function (this: CustomWorld) {
  // Verify application accessibility
  const response = await this.page!.goto('http://localhost:3000');
  expect(response?.status()).toBe(200);
  
  console.log('✅ Application is running and accessible');
});

Given('I am on the login page', async function (this: CustomWorld) {
  // Navigate to login page
  await this.page!.goto('/login');
  
  // Store current URL
  this.currentUrl = this.page!.url();
  
  // Verify we're on the correct page
  expect(this.currentUrl).toContain('/login');
  
  // Verify login form elements are present
  await expect(this.page!.getByLabel('Email')).toBeVisible();
  await expect(this.page!.getByLabel('Password')).toBeVisible();
  await expect(this.page!.getByRole('button', { name: 'Login' })).toBeVisible();
  
  console.log('✅ Successfully navigated to login page');
});

// Action steps (When)
When('I enter {string} in the email field', async function (this: CustomWorld, email: string) {
  // Find and fill email field
  const emailField = this.page!.getByLabel('Email');
  await emailField.clear();
  await emailField.fill(email);
  
  // Verify the value was entered
  expect(await emailField.inputValue()).toBe(email);
  
  console.log(`✅ Entered email: ${email}`);
});

When('I enter {string} in the password field', async function (this: CustomWorld, password: string) {
  // Find and fill password field
  const passwordField = this.page!.getByLabel('Password');
  await passwordField.clear();
  await passwordField.fill(password);
  
  // Note: We don't log the actual password for security
  console.log('✅ Password entered successfully');
});

When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
  // Find button by text and click
  const button = this.page!.getByRole('button', { name: buttonText });
  
  // Verify button is visible and enabled
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
  
  // Click the button
  await button.click();
  
  console.log(`✅ Clicked ${buttonText} button`);
});

// Verification steps (Then)
Then('I should be redirected to the dashboard', async function (this: CustomWorld) {
  // Wait for navigation to dashboard
  await this.page!.waitForURL('**/dashboard', { timeout: 5000 });
  
  // Verify URL contains dashboard
  this.currentUrl = this.page!.url();
  expect(this.currentUrl).toContain('/dashboard');
  
  // Update login state
  this.isLoggedIn = true;
  
  console.log('✅ Successfully redirected to dashboard');
});

Then('I should see {string}', async function (this: CustomWorld, expectedText: string) {
  // Look for text on the page
  const textElement = this.page!.getByText(expectedText);
  await expect(textElement).toBeVisible();
  
  console.log(`✅ Found expected text: "${expectedText}"`);
});

Then('I should see the main navigation menu', async function (this: CustomWorld) {
  // Verify navigation menu is present
  const navMenu = this.page!.getByRole('navigation');
  await expect(navMenu).toBeVisible();
  
  // Verify it contains expected navigation items
  await expect(this.page!.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  await expect(this.page!.getByRole('link', { name: 'Tasks' })).toBeVisible();
  await expect(this.page!.getByRole('link', { name: 'Profile' })).toBeVisible();
  
  console.log('✅ Main navigation menu is visible');
});

Then('I should remain on the login page', async function (this: CustomWorld) {
  // Verify we're still on login page
  this.currentUrl = this.page!.url();
  expect(this.currentUrl).toContain('/login');
  
  // Verify login form is still visible
  await expect(this.page!.getByLabel('Email')).toBeVisible();
  await expect(this.page!.getByLabel('Password')).toBeVisible();
  
  // Update login state
  this.isLoggedIn = false;
  
  console.log('✅ Remained on login page as expected');
});

Then('I should not see the main navigation menu', async function (this: CustomWorld) {
  // Verify navigation menu is not present
  const navMenu = this.page!.getByRole('navigation');
  await expect(navMenu).not.toBeVisible();
  
  console.log('✅ Main navigation menu is not visible');
});

Then('I should see the login form', async function (this: CustomWorld) {
  // Verify login form elements are visible
  await expect(this.page!.getByLabel('Email')).toBeVisible();
  await expect(this.page!.getByLabel('Password')).toBeVisible();
  await expect(this.page!.getByRole('button', { name: 'Login' })).toBeVisible();
  
  console.log('✅ Login form is visible');
});

// Complex setup step
Given('I am logged in as {string}', async function (this: CustomWorld, email: string) {
  // Create test user data
  this.testUser = {
    email,
    password: 'validPassword123',
    firstName: 'John',
    lastName: 'Doe'
  };
  
  // Navigate to login page
  await this.page!.goto('/login');
  
  // Perform login
  await this.page!.getByLabel('Email').fill(this.testUser.email);
  await this.page!.getByLabel('Password').fill(this.testUser.password);
  await this.page!.getByRole('button', { name: 'Login' }).click();
  
  // Wait for successful login
  await this.page!.waitForURL('**/dashboard');
  
  // Update state
  this.isLoggedIn = true;
  this.currentUrl = this.page!.url();
  
  console.log(`✅ Successfully logged in as ${email}`);
});
```

### **Validation Criteria**
- ✅ All step definitions use proper TypeScript typing
- ✅ Async/await is used correctly throughout
- ✅ Parameters are extracted and typed correctly
- ✅ Assertions use Playwright's expect API
- ✅ Console logging provides useful feedback
- ✅ Error handling is implemented where appropriate

## Task 5: Error Handling Enhancement (5 minutes)

### **Objective**: Add robust error handling to step definitions

### **Implementation**: Enhance error handling in key steps

```typescript
// Enhanced step with error handling
When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
  try {
    const button = this.page!.getByRole('button', { name: buttonText });
    
    // Wait for button to be available
    await expect(button).toBeVisible({ timeout: 5000 });
    await expect(button).toBeEnabled({ timeout: 5000 });
    
    // Click with retry logic
    await button.click();
    
    console.log(`✅ Clicked ${buttonText} button`);
    
  } catch (error) {
    // Enhanced error logging
    console.error(`❌ Failed to click ${buttonText} button:`, error.message);
    
    // Take screenshot for debugging
    await this.page!.screenshot({
      path: `screenshots/button-click-error-${Date.now()}.png`,
      fullPage: true
    });
    
    // Store error for potential recovery
    this.lastError = error as Error;
    
    // Re-throw to fail the test
    throw new Error(`Button click failed: ${buttonText}. ${error.message}`);
  }
});

// Enhanced navigation verification
Then('I should be redirected to the dashboard', async function (this: CustomWorld) {
  try {
    // Wait for navigation with extended timeout
    await this.page!.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Verify URL and update state
    this.currentUrl = this.page!.url();
    expect(this.currentUrl).toContain('/dashboard');
    this.isLoggedIn = true;
    
    console.log('✅ Successfully redirected to dashboard');
    
  } catch (error) {
    // Log current state for debugging
    const currentUrl = this.page!.url();
    console.error(`❌ Dashboard redirection failed. Current URL: ${currentUrl}`);
    
    // Check for error messages on page
    const errorMessage = await this.page!.locator('.error-message').textContent();
    if (errorMessage) {
      console.error(`Page error message: ${errorMessage}`);
    }
    
    // Take diagnostic screenshot
    await this.page!.screenshot({
      path: `screenshots/navigation-error-${Date.now()}.png`,
      fullPage: true
    });
    
    throw new Error(`Navigation to dashboard failed. Current URL: ${currentUrl}`);
  }
});
```

### **Validation Criteria**
- ✅ Try-catch blocks are properly implemented
- ✅ Error messages are informative and actionable
- ✅ Screenshots are captured on failures
- ✅ Errors are logged with sufficient context

## Extension Challenges

### **Challenge 1: Custom Assertions** (Optional - 10 minutes)
Create custom assertion functions for common verification patterns:

```typescript
// support/custom-assertions.ts
import { expect } from '@playwright/test';
import { Page } from '@playwright/test';

export async function expectUserIsLoggedIn(page: Page): Promise<void> {
  // Check multiple indicators of logged-in state
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.locator('.user-profile')).toBeVisible();
  expect(page.url()).not.toContain('/login');
}

export async function expectUserIsLoggedOut(page: Page): Promise<void> {
  // Check multiple indicators of logged-out state
  await expect(page.getByRole('navigation')).not.toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  expect(page.url()).toContain('/login');
}
```

### **Challenge 2: Parameterized Tests** (Optional - 15 minutes)
Enhance the feature file with scenario outlines:

```gherkin
Scenario Outline: Login with various invalid credentials
  When I enter "<email>" in the email field
  And I enter "<password>" in the password field
  And I click the "Login" button
  Then I should remain on the login page
  And I should see "<error_message>"

  Examples:
    | email                    | password      | error_message           |
    | invalid@example.com      | wrongpass     | Invalid email or password |
    | john.doe@example.com     | shortpw       | Invalid email or password |
    | not-an-email             | validPass123  | Invalid email format      |
    | valid@example.com        |               | Password is required      |
    |                          | validPass123  | Email is required         |
```

### **Challenge 3: Performance Monitoring** (Optional - 10 minutes)
Add performance monitoring to step definitions:

```typescript
When('I perform a timed login', async function (this: CustomWorld) {
  const startTime = Date.now();
  
  // Perform login actions
  await this.page!.getByLabel('Email').fill('john.doe@example.com');
  await this.page!.getByLabel('Password').fill('validPassword123');
  await this.page!.getByRole('button', { name: 'Login' }).click();
  
  // Wait for completion
  await this.page!.waitForURL('**/dashboard');
  
  const duration = Date.now() - startTime;
  console.log(`⏱️ Login completed in ${duration}ms`);
  
  // Assert performance requirements
  expect(duration).toBeLessThan(5000); // Login should complete in under 5 seconds
});
```

## Success Validation

### **Completion Checklist**
- [ ] All configuration files are created and working
- [ ] World object is properly implemented with TypeScript
- [ ] Feature file covers all authentication scenarios
- [ ] All step definitions are implemented with proper types
- [ ] Error handling is comprehensive and informative
- [ ] Tests run successfully with `npx cucumber-js`
- [ ] Console output provides clear feedback
- [ ] Screenshots are captured on failures

### **Quality Assessment**
- [ ] Code follows TypeScript best practices
- [ ] Step definitions are reusable and maintainable
- [ ] Error messages are clear and actionable
- [ ] Logging provides sufficient debugging information
- [ ] World object state is managed correctly
- [ ] Assertions are specific and meaningful

### **Performance Validation**
- [ ] Tests complete within reasonable time (< 30 seconds total)
- [ ] No unnecessary waits or delays
- [ ] Browser resources are properly managed
- [ ] Memory usage remains stable across scenarios

## Running Your Implementation

### **Execute Tests**
```bash
# Run all scenarios
npx cucumber-js

# Run with specific tags
npx cucumber-js --tags "@login"

# Run with verbose output
npx cucumber-js --format progress-bar

# Run in debug mode
DEBUG=true npx cucumber-js
```

### **View Results**
- Check console output for step execution logs
- Review `reports/cucumber-report.html` for detailed results
- Examine `screenshots/` directory for failure captures
- Analyze timing information for performance insights

---

## Summary

This exercise has provided you with:

- ✅ **Solid Foundation**: Complete Cucumber TypeScript project setup
- ✅ **Step Definition Mastery**: Basic to intermediate implementation patterns
- ✅ **TypeScript Integration**: Proper typing and async/await usage
- ✅ **Error Handling**: Robust error management and debugging
- ✅ **Best Practices**: Professional code organization and logging

You're now ready to tackle more complex step definition patterns and advanced BDD automation techniques in the next exercises.

*Time to complete: 45-60 minutes*  
*Difficulty: Beginner to Intermediate*  
*Skills gained: TypeScript step definitions, Playwright integration, error handling*