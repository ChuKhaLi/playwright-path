# Example 01: Complete Project Setup Walkthrough

## Overview

This example provides a complete, step-by-step walkthrough for setting up a BDD testing project from scratch. Follow these instructions to create a fully functional Cucumber + TypeScript + Playwright environment on Windows.

## Target Audience

**Beginner** - No prior experience with BDD setup required. Each step includes detailed explanations and validation procedures.

## Prerequisites

- Windows 10/11 operating system
- Node.js version 16 or higher installed
- PowerShell or Command Prompt access
- Visual Studio Code (recommended)
- Internet connection for package downloads

## Step-by-Step Setup

### Phase 1: Project Initialization

#### 1.1 Create Project Directory

```powershell
# Open PowerShell and navigate to your workspace
cd C:\Projects

# Create the main project directory
mkdir ecommerce-bdd-tests
cd ecommerce-bdd-tests

# Verify you're in the correct location
pwd
```

**Expected Output:**
```
C:\Projects\ecommerce-bdd-tests
```

#### 1.2 Initialize Node.js Project

```powershell
# Create package.json with interactive prompts
npm init

# Or create with defaults and edit later
npm init -y
```

**Sample package.json after initialization:**
```json
{
  "name": "ecommerce-bdd-tests",
  "version": "1.0.0",
  "description": "BDD tests for e-commerce application",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["bdd", "cucumber", "playwright", "typescript"],
  "author": "Your Name",
  "license": "MIT"
}
```

#### 1.3 Create Directory Structure

```powershell
# Create BDD-specific directories
mkdir features
mkdir features\step_definitions
mkdir features\support
mkdir reports
mkdir src
mkdir src\pages
mkdir src\utils

# Create configuration directory
mkdir config

# Verify directory structure
tree /F
```

**Expected Directory Structure:**
```
ecommerce-bdd-tests/
├── config/
├── features/
│   ├── step_definitions/
│   └── support/
├── reports/
├── src/
│   ├── pages/
│   └── utils/
└── package.json
```

### Phase 2: Dependency Installation

#### 2.1 Install Core BDD Dependencies

```powershell
# Install Cucumber.js framework
npm install --save-dev @cucumber/cucumber

# Verify installation
npx cucumber-js --version
```

**Expected Output:**
```
9.5.1 (or latest version)
```

#### 2.2 Install TypeScript Support

```powershell
# Install TypeScript and related packages
npm install --save-dev typescript ts-node @types/node

# Verify TypeScript installation
npx tsc --version
```

**Expected Output:**
```
Version 5.2.2 (or latest version)
```

#### 2.3 Install Playwright

```powershell
# Install Playwright with TypeScript support
npm install --save-dev @playwright/test

# Install browser binaries (this takes several minutes)
npx playwright install

# Verify Playwright installation
npx playwright --version
```

**Expected Output:**
```
Version 1.38.1 (or latest version)
```

#### 2.4 Install Optional Reporting Tools

```powershell
# Install HTML reporting capability
npm install --save-dev cucumber-html-reporter

# Install additional formatters
npm install --save-dev @cucumber/pretty-formatter
```

#### 2.5 Verify All Dependencies

```powershell
# Check installed packages
npm list --depth=0
```

**Expected Output (key packages):**
```
ecommerce-bdd-tests@1.0.0
├── @cucumber/cucumber@9.5.1
├── @playwright/test@1.38.1
├── @types/node@20.6.3
├── cucumber-html-reporter@5.5.0
├── ts-node@10.9.1
└── typescript@5.2.2
```

### Phase 3: Configuration Files

#### 3.1 Create TypeScript Configuration

Create `tsconfig.json`:

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
    "declaration": false,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "types": ["node", "@types/node"]
  },
  "include": [
    "features/**/*",
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "reports"
  ]
}
```

**Validation:**
```powershell
# Test TypeScript configuration
npx tsc --showConfig
```

#### 3.2 Create Cucumber Configuration

Create `cucumber.json`:

```json
{
  "default": {
    "require": [
      "features/step_definitions/**/*.ts",
      "features/support/**/*.ts"
    ],
    "requireModule": [
      "ts-node/register"
    ],
    "format": [
      "progress-bar",
      "json:reports/cucumber_report.json",
      "html:reports/cucumber_report.html"
    ],
    "formatOptions": {
      "snippetInterface": "async-await"
    },
    "publishQuiet": true
  }
}
```

#### 3.3 Create Playwright Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './features',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['json', { outputFile: 'reports/playwright-results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});
```

### Phase 4: Support Files Setup

#### 4.1 Create World Configuration

Create `features/support/world.ts`:

```typescript
import { Browser, BrowserContext, Page } from '@playwright/test';
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(): Promise<void> {
    // Browser initialization handled in hooks
  }
}

setWorldConstructor(CustomWorld);
```

#### 4.2 Create Hooks File

Create `features/support/hooks.ts`:

```typescript
import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, chromium } from '@playwright/test';
import { CustomWorld } from './world';

let browser: Browser;

BeforeAll(async function () {
  console.log('Starting browser for BDD tests...');
  browser = await chromium.launch({ 
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
  });
});

Before(async function (this: CustomWorld) {
  console.log(`Starting scenario: ${this.pickle.name}`);
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  console.log(`Finished scenario: ${this.pickle.name}`);
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
});

AfterAll(async function () {
  console.log('Closing browser after all tests...');
  if (browser) {
    await browser.close();
  }
});
```

### Phase 5: First Test Implementation

#### 5.1 Create Sample Feature File

Create `features/setup_validation.feature`:

```gherkin
Feature: BDD Environment Setup Validation
  As a QA automation engineer
  I want to verify that my BDD environment is properly configured
  So that I can confidently start writing automated tests

  Background:
    Given I have a properly configured BDD environment

  Scenario: Verify browser automation works
    Given I have access to a web browser
    When I navigate to the example website
    Then the page should load successfully
    And I should see the page title

  Scenario: Verify TypeScript compilation works
    Given I have TypeScript configured correctly
    When I use typed variables in my step definitions
    Then there should be no compilation errors
```

#### 5.2 Create Step Definitions

Create `features/step_definitions/setup_validation_steps.ts`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Background step
Given('I have a properly configured BDD environment', async function (this: CustomWorld) {
  // This step validates that our world and page are properly initialized
  expect(this.page).toBeDefined();
  console.log('✅ BDD environment is properly configured');
});

// Browser automation validation
Given('I have access to a web browser', async function (this: CustomWorld) {
  expect(this.page).toBeDefined();
  expect(this.context).toBeDefined();
  console.log('✅ Browser instance is available');
});

When('I navigate to the example website', async function (this: CustomWorld) {
  await this.page.goto('https://example.com');
  console.log('✅ Successfully navigated to example.com');
});

Then('the page should load successfully', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/example\.com/);
  console.log('✅ Page loaded with correct URL');
});

Then('I should see the page title', async function (this: CustomWorld) {
  await expect(this.page).toHaveTitle(/Example Domain/);
  const title = await this.page.title();
  console.log(`✅ Page title verified: "${title}"`);
});

// TypeScript validation
Given('I have TypeScript configured correctly', async function (this: CustomWorld) {
  // This step demonstrates TypeScript typing
  const testString: string = 'TypeScript is working';
  const testNumber: number = 42;
  const testBoolean: boolean = true;
  
  expect(typeof testString).toBe('string');
  expect(typeof testNumber).toBe('number');
  expect(typeof testBoolean).toBe('boolean');
  console.log('✅ TypeScript types are working correctly');
});

When('I use typed variables in my step definitions', async function (this: CustomWorld) {
  // Demonstrate proper TypeScript usage in BDD context
  interface TestData {
    name: string;
    value: number;
    active: boolean;
  }
  
  const testData: TestData = {
    name: 'BDD Test',
    value: 100,
    active: true
  };
  
  expect(testData.name).toBe('BDD Test');
  expect(testData.value).toBe(100);
  expect(testData.active).toBe(true);
  console.log('✅ Typed variables work correctly in step definitions');
});

Then('there should be no compilation errors', async function () {
  // If we reach this step, TypeScript compilation succeeded
  console.log('✅ No TypeScript compilation errors detected');
});
```

### Phase 6: NPM Scripts Configuration

#### 6.1 Update package.json Scripts

Update the `scripts` section in `package.json`:

```json
{
  "scripts": {
    "test:bdd": "cucumber-js",
    "test:bdd:headed": "HEADLESS=false cucumber-js",
    "test:bdd:slow": "HEADLESS=false SLOW_MO=1000 cucumber-js",
    "build": "tsc",
    "clean": "rimraf dist reports",
    "type-check": "tsc --noEmit",
    "lint": "echo \"Add linting later\"",
    "setup:validate": "npm run type-check && npm run test:bdd"
  }
}
```

### Phase 7: Environment Setup

#### 7.1 Create Environment File

Create `.env`:

```bash
# Base configuration
BASE_URL=https://example.com
BROWSER=chromium
HEADLESS=true
SLOW_MO=0
TIMEOUT=30000

# Debugging options
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
TRACE_ON_RETRY=true

# Reporting
GENERATE_HTML_REPORT=true
REPORT_PATH=./reports
```

#### 7.2 Install dotenv Support

```powershell
npm install --save-dev dotenv
```

Update `features/support/hooks.ts` to load environment variables:

```typescript
// Add at the top of hooks.ts
import * as dotenv from 'dotenv';
dotenv.config();

// ... rest of the hooks file
```

### Phase 8: Validation and Testing

#### 8.1 Type Check Validation

```powershell
# Verify TypeScript compilation
npm run type-check
```

**Expected Output:**
```
(No output means success - no TypeScript errors)
```

#### 8.2 Run First BDD Test

```powershell
# Run with visible browser for debugging
npm run test:bdd:headed
```

**Expected Output:**
```
Starting browser for BDD tests...

Feature: BDD Environment Setup Validation

  Background:
    ✓ Given I have a properly configured BDD environment

  Scenario: Verify browser automation works
    ✓ Given I have access to a web browser
    ✓ When I navigate to the example website
    ✓ Then the page should load successfully
    ✓ And I should see the page title

  Scenario: Verify TypeScript compilation works
    ✓ Given I have TypeScript configured correctly
    ✓ When I use typed variables in my step definitions
    ✓ Then there should be no compilation errors

2 scenarios (2 passed)
7 steps (7 passed)
0m03.456s
```

#### 8.3 Run Complete Validation

```powershell
# Run complete setup validation
npm run setup:validate
```

**Expected Result:** Both type checking and BDD tests should pass without errors.

### Phase 9: Project Structure Verification

#### 9.1 Final Directory Structure

Your completed project should look like this:

```
ecommerce-bdd-tests/
├── config/
├── features/
│   ├── step_definitions/
│   │   └── setup_validation_steps.ts
│   ├── support/
│   │   ├── hooks.ts
│   │   └── world.ts
│   └── setup_validation.feature
├── reports/
│   ├── cucumber_report.json
│   └── cucumber_report.html
├── src/
│   ├── pages/
│   └── utils/
├── .env
├── cucumber.json
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

#### 9.2 Validate File Contents

```powershell
# Check that all configuration files exist
dir *.json
dir *.ts
dir features\*.feature
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Cannot find module '@cucumber/cucumber'"
**Solution:**
```powershell
# Reinstall dependencies
rm -rf node_modules
npm install
```

#### Issue: "TypeScript compilation errors"
**Solution:**
```powershell
# Check configuration
npx tsc --showConfig
# Verify file paths in tsconfig.json
```

#### Issue: "Playwright browsers not found"
**Solution:**
```powershell
# Reinstall browsers
npx playwright install
```

#### Issue: "Step definitions not found"
**Solution:**
Verify the `require` paths in `cucumber.json` match your file structure.

## Success Validation Checklist

- ✅ All dependencies installed without errors
- ✅ TypeScript compilation passes (`npm run type-check`)
- ✅ BDD test execution succeeds (`npm run test:bdd`)
- ✅ Browser launches and navigates to test page
- ✅ HTML and JSON reports generated in reports directory
- ✅ Console output shows successful step execution

## Next Steps

With your environment successfully configured, you're ready to:

1. **Write more complex feature files** using advanced Gherkin syntax
2. **Implement comprehensive step definitions** for real application testing
3. **Integrate Page Object Model** patterns for maintainable test code
4. **Set up CI/CD pipelines** for automated test execution
5. **Generate living documentation** from your BDD scenarios

## Summary

You have successfully created a complete BDD testing environment with:
- **Cucumber.js** for BDD test execution
- **TypeScript** for type-safe test development
- **Playwright** for robust web automation
- **Proper project structure** following BDD best practices
- **Comprehensive configuration** for development and production
- **Validation tests** confirming everything works correctly

This foundation will support all advanced BDD practices covered in subsequent lessons.