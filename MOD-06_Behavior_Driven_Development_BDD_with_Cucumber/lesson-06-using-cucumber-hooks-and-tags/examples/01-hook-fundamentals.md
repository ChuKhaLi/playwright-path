# Example 01: Hook Fundamentals

## 🎯 Example Overview

This foundational example demonstrates the essential concepts of Cucumber hooks, providing a solid understanding of hook types, execution order, and basic implementation patterns with TypeScript and Playwright integration.

**Focus Areas**: Hook lifecycle, execution order, basic browser management, simple logging and cleanup patterns

## 📚 Learning Objectives

By studying this example, you will understand:

1. **LO1**: Different types of Cucumber hooks and their specific purposes
2. **LO2**: Hook execution order and lifecycle management
3. **LO3**: Basic browser setup and teardown patterns with Playwright
4. **LO4**: Simple logging and debugging techniques in hooks
5. **LO5**: Error handling and cleanup best practices

## 🔧 Project Structure

```
hook-fundamentals/
├── features/
│   ├── basic-navigation.feature
│   └── user-login.feature
├── step-definitions/
│   └── common-steps.ts
├── hooks/
│   └── basic-hooks.ts
├── support/
│   └── world.ts
├── package.json
├── cucumber.json
└── README.md
```

## 📝 Implementation

### **1. Basic Hook Types and Execution Order**

Understanding the fundamental hook types and their execution sequence is crucial for effective test management.

**File**: `hooks/basic-hooks.ts`

```typescript
// hooks/basic-hooks.ts
import { Before, After, BeforeAll, AfterAll, BeforeStep, AfterStep, Status } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';

// Global variables to store browser instances
let browser: Browser;
let context: BrowserContext;
let page: Page;

/**
 * BeforeAll Hook - Executed once before all scenarios
 * Purpose: Initialize global resources, browser setup, logging configuration
 */
BeforeAll(async function () {
    console.log('🚀 BeforeAll: Starting test suite execution');
    
    try {
        // Launch browser with basic configuration
        browser = await chromium.launch({
            headless: process.env.HEADLESS !== 'false', // Allow visual debugging
            slowMo: 50 // Slow down operations for better observation
        });
        
        console.log('✅ BeforeAll: Browser launched successfully');
        
        // Log test suite information
        console.log('📊 Test Suite Info:', {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            headless: process.env.HEADLESS !== 'false'
        });
        
    } catch (error) {
        console.error('❌ BeforeAll: Failed to launch browser', error);
        throw error; // Fail fast if browser setup fails
    }
});

/**
 * Before Hook - Executed before each scenario
 * Purpose: Create fresh browser context, initialize page, scenario-specific setup
 */
Before(async function (scenario: ITestCaseHookParameter) {
    console.log(`🎬 Before: Starting scenario "${scenario.pickle.name}"`);
    
    try {
        // Create a new browser context for each scenario (isolation)
        context = await browser.newContext({
            viewport: { width: 1280, height: 720 }, // Standard viewport
            ignoreHTTPSErrors: true, // Handle self-signed certificates
            recordVideo: {
                dir: './videos/', // Record videos for debugging
                size: { width: 1280, height: 720 }
            }
        });
        
        // Create a new page
        page = await context.newPage();
        
        // Enable request/response logging for debugging
        page.on('request', request => {
            console.log(`📤 Request: ${request.method()} ${request.url()}`);
        });
        
        page.on('response', response => {
            console.log(`📥 Response: ${response.status()} ${response.url()}`);
        });
        
        // Handle console messages from the browser
        page.on('console', message => {
            console.log(`🖥️ Browser Console: ${message.type()} - ${message.text()}`);
        });
        
        // Handle page errors
        page.on('pageerror', error => {
            console.error('🚨 Page Error:', error.message);
        });
        
        // Store page in the world context for step definitions
        this.page = page;
        this.context = context;
        
        console.log(`✅ Before: Scenario "${scenario.pickle.name}" setup completed`);
        
    } catch (error) {
        console.error(`❌ Before: Failed to setup scenario "${scenario.pickle.name}"`, error);
        throw error;
    }
});

/**
 * BeforeStep Hook - Executed before each step
 * Purpose: Step-level preparation, logging, state validation
 */
BeforeStep(async function (step) {
    console.log(`📝 BeforeStep: Executing "${step.pickleStep.text}"`);
    
    // Log current page URL for context
    if (page) {
        const currentUrl = page.url();
        console.log(`🌐 Current URL: ${currentUrl}`);
    }
    
    // Optional: Take screenshot before each step for debugging
    if (process.env.SCREENSHOT_STEPS === 'true' && page) {
        const stepScreenshotPath = `./screenshots/step-${Date.now()}.png`;
        await page.screenshot({ path: stepScreenshotPath });
        console.log(`📸 Step screenshot saved: ${stepScreenshotPath}`);
    }
});

/**
 * AfterStep Hook - Executed after each step
 * Purpose: Step-level cleanup, validation, debugging information
 */
AfterStep(async function (step) {
    console.log(`✅ AfterStep: Completed "${step.pickleStep.text}"`);
    
    // Log step execution time (if available)
    const duration = step.result?.duration;
    if (duration) {
        console.log(`⏱️ Step Duration: ${duration.seconds}s ${duration.nanos}ns`);
    }
    
    // Check for step failure and log additional debug info
    if (step.result?.status === Status.FAILED) {
        console.error(`❌ Step Failed: "${step.pickleStep.text}"`);
        
        if (page) {
            // Take screenshot on step failure
            const failureScreenshotPath = `./screenshots/failure-${Date.now()}.png`;
            await page.screenshot({ path: failureScreenshotPath, fullPage: true });
            console.log(`📸 Failure screenshot saved: ${failureScreenshotPath}`);
            
            // Log current page title and URL
            const title = await page.title();
            const url = page.url();
            console.log(`📋 Page Info: Title="${title}", URL="${url}"`);
        }
    }
});

/**
 * After Hook - Executed after each scenario
 * Purpose: Scenario cleanup, result processing, resource cleanup
 */
After(async function (scenario: ITestCaseHookParameter) {
    console.log(`🏁 After: Finishing scenario "${scenario.pickle.name}"`);
    
    try {
        const scenarioStatus = scenario.result?.status || Status.UNKNOWN;
        console.log(`📊 Scenario Result: ${scenarioStatus}`);
        
        // Handle scenario failure
        if (scenarioStatus === Status.FAILED) {
            console.error(`❌ Scenario Failed: "${scenario.pickle.name}"`);
            
            if (page) {
                // Take final screenshot for failed scenarios
                const scenarioScreenshotPath = `./screenshots/scenario-failure-${Date.now()}.png`;
                await page.screenshot({ 
                    path: scenarioScreenshotPath, 
                    fullPage: true 
                });
                console.log(`📸 Final failure screenshot: ${scenarioScreenshotPath}`);
                
                // Capture page source for debugging
                const pageSource = await page.content();
                const sourceFilePath = `./debug/page-source-${Date.now()}.html`;
                require('fs').writeFileSync(sourceFilePath, pageSource);
                console.log(`📄 Page source saved: ${sourceFilePath}`);
            }
            
            // Log error details if available
            if (scenario.result?.exception) {
                console.error('🐛 Exception Details:', scenario.result.exception.message);
            }
        } else if (scenarioStatus === Status.PASSED) {
            console.log(`✅ Scenario Passed: "${scenario.pickle.name}"`);
        }
        
        // Always cleanup browser context after scenario
        if (context) {
            await context.close();
            console.log('🧹 Browser context closed');
        }
        
    } catch (error) {
        console.error(`❌ After: Error during scenario cleanup "${scenario.pickle.name}"`, error);
        // Don't throw here to avoid masking the original test failure
    }
});

/**
 * AfterAll Hook - Executed once after all scenarios
 * Purpose: Global cleanup, final reporting, resource cleanup
 */
AfterAll(async function () {
    console.log('🏁 AfterAll: Completing test suite execution');
    
    try {
        // Close browser
        if (browser) {
            await browser.close();
            console.log('✅ AfterAll: Browser closed successfully');
        }
        
        // Log final test suite statistics
        console.log('📊 Test Suite Completed:', {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });
        
        // Optional: Cleanup temporary files, send notifications, etc.
        console.log('🧹 AfterAll: Cleanup completed');
        
    } catch (error) {
        console.error('❌ AfterAll: Error during test suite cleanup', error);
        // Log but don't fail the entire suite for cleanup errors
    }
});
```

### **2. World Context for Sharing State**

The World object provides a way to share state between hooks and step definitions.

**File**: `support/world.ts`

```typescript
// support/world.ts
import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';

/**
 * Custom World class to maintain test state
 * Provides shared context between hooks and step definitions
 */
export class CustomWorld extends World {
    public browser!: Browser;
    public context!: BrowserContext;
    public page!: Page;
    public scenarioName!: string;
    public startTime!: Date;
    
    // Test data storage
    public testData: { [key: string]: any } = {};
    
    // Configuration
    public config = {
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        timeout: parseInt(process.env.TIMEOUT || '30000'),
        headless: process.env.HEADLESS !== 'false'
    };

    constructor(options: IWorldOptions) {
        super(options);
        this.startTime = new Date();
    }

    /**
     * Navigate to a relative URL
     */
    async navigateTo(path: string): Promise<void> {
        const fullUrl = `${this.config.baseUrl}${path}`;
        console.log(`🌐 Navigating to: ${fullUrl}`);
        await this.page.goto(fullUrl, { waitUntil: 'networkidle' });
    }

    /**
     * Wait for element with improved error handling
     */
    async waitForElement(selector: string, timeout: number = this.config.timeout): Promise<void> {
        console.log(`⏳ Waiting for element: ${selector}`);
        try {
            await this.page.waitForSelector(selector, { timeout });
            console.log(`✅ Element found: ${selector}`);
        } catch (error) {
            console.error(`❌ Element not found: ${selector}`, error);
            throw new Error(`Element '${selector}' not found within ${timeout}ms`);
        }
    }

    /**
     * Take screenshot with automatic naming
     */
    async takeScreenshot(name?: string): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotName = name || `screenshot-${timestamp}`;
        const path = `./screenshots/${screenshotName}.png`;
        
        await this.page.screenshot({ path, fullPage: true });
        console.log(`📸 Screenshot saved: ${path}`);
        return path;
    }

    /**
     * Store test data for later use
     */
    setTestData(key: string, value: any): void {
        this.testData[key] = value;
        console.log(`💾 Stored test data: ${key} = ${JSON.stringify(value)}`);
    }

    /**
     * Retrieve stored test data
     */
    getTestData(key: string): any {
        const value = this.testData[key];
        console.log(`📖 Retrieved test data: ${key} = ${JSON.stringify(value)}`);
        return value;
    }
}

// Set the custom world constructor
setWorldConstructor(CustomWorld);
```

### **3. Basic Step Definitions**

Simple step definitions that work with the hook system.

**File**: `step-definitions/common-steps.ts`

```typescript
// step-definitions/common-steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the homepage', async function (this: CustomWorld) {
    console.log('📍 Step: Navigating to homepage');
    await this.navigateTo('/');
    
    // Verify we're on the correct page
    const title = await this.page.title();
    console.log(`📄 Page title: ${title}`);
});

Given('I am on the {string} page', async function (this: CustomWorld, pagePath: string) {
    console.log(`📍 Step: Navigating to ${pagePath} page`);
    await this.navigateTo(pagePath);
    
    // Wait for page to load
    await this.page.waitForLoadState('networkidle');
    console.log(`✅ Successfully navigated to ${pagePath}`);
});

When('I click on {string}', async function (this: CustomWorld, elementText: string) {
    console.log(`🖱️ Step: Clicking on "${elementText}"`);
    
    // Find element by text and click
    const element = this.page.locator(`text=${elementText}`).first();
    await element.waitFor({ state: 'visible' });
    await element.click();
    
    console.log(`✅ Successfully clicked on "${elementText}"`);
});

When('I fill {string} with {string}', async function (this: CustomWorld, fieldName: string, value: string) {
    console.log(`✍️ Step: Filling "${fieldName}" with "${value}"`);
    
    // Find input field and fill it
    const field = this.page.locator(`[name="${fieldName}"], [id="${fieldName}"], [placeholder*="${fieldName}"]`).first();
    await field.waitFor({ state: 'visible' });
    await field.fill(value);
    
    // Store the value for later verification
    this.setTestData(fieldName, value);
    
    console.log(`✅ Successfully filled "${fieldName}"`);
});

Then('I should see {string}', async function (this: CustomWorld, expectedText: string) {
    console.log(`👀 Step: Verifying text "${expectedText}" is visible`);
    
    // Check if text is visible on the page
    const element = this.page.locator(`text=${expectedText}`).first();
    await expect(element).toBeVisible({ timeout: this.config.timeout });
    
    console.log(`✅ Successfully verified text "${expectedText}" is visible`);
});

Then('the page title should be {string}', async function (this: CustomWorld, expectedTitle: string) {
    console.log(`📋 Step: Verifying page title is "${expectedTitle}"`);
    
    const actualTitle = await this.page.title();
    expect(actualTitle).toBe(expectedTitle);
    
    console.log(`✅ Page title verified: "${actualTitle}"`);
});

Then('I should be on {string} page', async function (this: CustomWorld, expectedPath: string) {
    console.log(`🌐 Step: Verifying current URL contains "${expectedPath}"`);
    
    const currentUrl = this.page.url();
    expect(currentUrl).toContain(expectedPath);
    
    console.log(`✅ URL verification passed: ${currentUrl}`);
});
```

### **4. Sample Feature Files**

**File**: `features/basic-navigation.feature`

```gherkin
Feature: Basic Navigation
  As a user
  I want to navigate through the website
  So that I can access different sections

  Background:
    Given I am on the homepage

  @smoke @navigation
  Scenario: Navigate to About page
    When I click on "About"
    Then I should be on "/about" page
    And the page title should be "About Us"

  @smoke @navigation
  Scenario: Navigate to Contact page
    When I click on "Contact"
    Then I should be on "/contact" page
    And I should see "Contact Information"

  @regression @navigation
  Scenario: Verify homepage elements
    Then I should see "Welcome"
    And I should see "Get Started"
    And the page title should be "Home - My Website"
```

**File**: `features/user-login.feature`

```gherkin
Feature: User Login
  As a registered user
  I want to log into my account
  So that I can access personalized features

  Background:
    Given I am on the "/login" page

  @smoke @authentication
  Scenario: Successful login with valid credentials
    When I fill "username" with "testuser@example.com"
    And I fill "password" with "validpassword123"
    And I click on "Sign In"
    Then I should see "Welcome back"
    And I should be on "/dashboard" page

  @negative @authentication
  Scenario: Failed login with invalid credentials
    When I fill "username" with "invalid@example.com"
    And I fill "password" with "wrongpassword"
    And I click on "Sign In"
    Then I should see "Invalid credentials"
    And I should be on "/login" page

  @edge-case @authentication
  Scenario: Login with empty credentials
    When I click on "Sign In"
    Then I should see "Please fill in all fields"
    And I should be on "/login" page
```

## 🔍 Hook Execution Flow

Understanding the execution order is crucial for effective hook usage:

```
Test Suite Execution Flow:
┌─────────────────────────────────────────────────────────────────┐
│ 1. BeforeAll Hook (once per test suite)                        │
│    ├── Launch browser                                          │
│    ├── Initialize global configuration                         │
│    └── Setup logging                                           │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│ For Each Scenario:                                              │
│                                                                 │
│ 2. Before Hook (once per scenario)                             │
│    ├── Create browser context                                  │
│    ├── Create new page                                         │
│    ├── Setup event listeners                                   │
│    └── Initialize scenario state                               │
│                                ↓                               │
│ For Each Step in Scenario:                                     │
│                                                                 │
│ 3. BeforeStep Hook (before each step)                          │
│    ├── Log step information                                    │
│    ├── Optional screenshot                                     │
│    └── Validate page state                                     │
│                                ↓                               │
│ 4. Step Definition Execution                                   │
│                                ↓                               │
│ 5. AfterStep Hook (after each step)                            │
│    ├── Log step completion                                     │
│    ├── Handle step failures                                    │
│    └── Capture debug information                               │
│                                ↓                               │
│ (Repeat for all steps)                                         │
│                                ↓                               │
│ 6. After Hook (once per scenario)                              │
│    ├── Handle scenario results                                 │
│    ├── Capture failure screenshots                             │
│    ├── Save debug information                                  │
│    └── Cleanup browser context                                 │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. AfterAll Hook (once per test suite)                         │
│    ├── Close browser                                           │
│    ├── Generate final reports                                  │
│    ├── Cleanup resources                                       │
│    └── Log completion statistics                               │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Configuration and Setup

### **Package Configuration**

**File**: `package.json`

```json
{
  "name": "hook-fundamentals-example",
  "version": "1.0.0",
  "description": "Basic Cucumber hooks example with TypeScript and Playwright",
  "scripts": {
    "test": "cucumber-js",
    "test:debug": "HEADLESS=false cucumber-js",
    "test:smoke": "cucumber-js --tags '@smoke'",
    "test:verbose": "cucumber-js --format progress --format json:reports/results.json"
  },
  "devDependencies": {
    "@cucumber/cucumber": "^10.0.0",
    "@playwright/test": "^1.40.0",
    "playwright": "^1.40.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}
```

### **Cucumber Configuration**

**File**: `cucumber.json`

```json
{
  "default": {
    "require": [
      "hooks/**/*.ts",
      "step-definitions/**/*.ts",
      "support/**/*.ts"
    ],
    "requireModule": ["ts-node/register"],
    "format": [
      "progress",
      "json:reports/cucumber-report.json",
      "html:reports/cucumber-report.html"
    ],
    "parallel": 1,
    "retry": 0,
    "tags": "not @skip"
  }
}
```

## 🧪 Running the Examples

### **Basic Execution**
```bash
# Run all tests
npm run test

# Run with browser visible (debug mode)
npm run test:debug

# Run only smoke tests
npm run test:smoke

# Run with verbose output
npm run test:verbose
```

### **Environment Variables**
```bash
# Control browser visibility
HEADLESS=false npm run test

# Set base URL
BASE_URL=https://staging.example.com npm run test

# Enable step screenshots
SCREENSHOT_STEPS=true npm run test

# Set custom timeout
TIMEOUT=60000 npm run test
```

## 🎯 Key Learning Points

### **1. Hook Purposes**
- **BeforeAll/AfterAll**: Global setup and cleanup
- **Before/After**: Scenario-level isolation and cleanup
- **BeforeStep/AfterStep**: Step-level debugging and monitoring

### **2. Best Practices**
- Always clean up resources in After hooks
- Use try-catch blocks for error handling
- Log important information for debugging
- Maintain scenario isolation with fresh browser contexts

### **3. Common Patterns**
- Browser lifecycle management
- Screenshot capture on failures
- Debug information collection
- State sharing through World object

### **4. Error Handling**
- Fail fast for critical setup failures
- Graceful cleanup even when tests fail
- Comprehensive logging for debugging

## 🔗 Next Steps

After mastering these fundamentals:

1. **Explore Advanced Patterns**: Move to [Example 02: Tag Strategy and Organization](./02-tag-strategy-and-organization.md)
2. **Conditional Execution**: Learn about [Example 03: Conditional Execution Patterns](./03-conditional-execution-patterns.md)
3. **Production Integration**: Study [Example 04: Playwright Integration with Hooks and Tags](./04-playwright-integration-with-hooks-and-tags.md)

---

**Difficulty Level**: Beginner  
**Estimated Study Time**: 30 minutes  
**Key Concepts**: Hook lifecycle, browser management, basic logging, error handling