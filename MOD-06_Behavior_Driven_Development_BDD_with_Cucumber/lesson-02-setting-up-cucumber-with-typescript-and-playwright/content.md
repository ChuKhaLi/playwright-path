# Setting up Cucumber with TypeScript and Playwright

## Introduction

Setting up a BDD environment requires careful orchestration of multiple technologies working together. This lesson provides a comprehensive guide to creating a robust, maintainable BDD testing environment using Cucumber.js, TypeScript, and Playwright on Windows systems.

By the end of this lesson, you'll have a fully functional BDD testing environment that follows industry best practices for project organization, configuration management, and tool integration.

## Understanding the Technology Stack

Before diving into implementation, let's understand how these technologies complement each other:

### Cucumber.js - The BDD Framework
- **Purpose:** Executes Gherkin feature files and connects them to step definitions
- **Role:** Provides the BDD testing lifecycle and collaboration features
- **Key Features:** Living documentation, scenario execution, reporting

### TypeScript - Type-Safe Development
- **Purpose:** Adds static typing and modern JavaScript features
- **Role:** Ensures code quality and better development experience
- **Key Features:** Type checking, IntelliSense, compile-time error detection

### Playwright - Web Automation Engine
- **Purpose:** Provides browser automation capabilities
- **Role:** Executes actual web interactions defined in BDD scenarios
- **Key Features:** Cross-browser testing, auto-wait, network interception

## Prerequisites and System Requirements

### Required Software
```powershell
# Verify Node.js installation (version 16 or higher recommended)
node --version

# Verify npm availability
npm --version

# Verify PowerShell (Windows built-in)
$PSVersionTable.PSVersion
```

### Development Environment
- **IDE:** Visual Studio Code (recommended) with TypeScript support
- **Terminal:** Windows PowerShell or PowerShell Core
- **Git:** For version control (optional but recommended)

## Step 1: Project Initialization

### Creating the Project Structure

Start by creating a new project directory with the proper BDD structure:

```powershell
# Create main project directory
mkdir cucumber-bdd-project
cd cucumber-bdd-project

# Create BDD-specific directories
mkdir features
mkdir features\step_definitions
mkdir features\support
mkdir reports
mkdir src
mkdir src\pages
mkdir src\utils
```

### Initialize Node.js Project

```powershell
# Initialize package.json with defaults
npm init -y

# Update package.json name and description
# Edit the generated package.json file
```

The resulting directory structure should look like:
```
cucumber-bdd-project/
├── features/
│   ├── step_definitions/
│   └── support/
├── reports/
├── src/
│   ├── pages/
│   └── utils/
├── package.json
└── (configuration files will be added)
```

## Step 2: Installing Dependencies

### Core BDD Dependencies

Install the essential Cucumber.js packages:

```powershell
# Install Cucumber.js framework
npm install --save-dev @cucumber/cucumber

# Install TypeScript support
npm install --save-dev typescript ts-node

# Install TypeScript type definitions
npm install --save-dev @types/node
```

### Playwright Integration

Add Playwright for web automation:

```powershell
# Install Playwright with TypeScript support
npm install --save-dev @playwright/test

# Install Playwright browsers (this may take a few minutes)
npx playwright install
```

### Optional Reporting Dependencies

For enhanced reporting capabilities:

```powershell
# Install HTML reporting (optional)
npm install --save-dev cucumber-html-reporter

# Install JSON formatter support
npm install --save-dev @cucumber/pretty-formatter
```

### Verify Installation

Check that all dependencies are properly installed:

```powershell
# View installed packages
npm list --depth=0

# Verify TypeScript compilation
npx tsc --version

# Verify Cucumber CLI
npx cucumber-js --version
```

## Step 3: TypeScript Configuration

### Creating tsconfig.json

Create a TypeScript configuration file optimized for BDD testing:

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

### TypeScript Configuration Explanation

Key configuration choices explained:

- **target: "ES2020"** - Uses modern JavaScript features supported by Node.js
- **strict: true** - Enables all strict type checking options
- **esModuleInterop: true** - Allows importing CommonJS modules in TypeScript
- **types: ["node"]** - Includes Node.js type definitions
- **include/exclude** - Specifies which files TypeScript should process

## Step 4: Cucumber Configuration

### Creating cucumber.json

Configure Cucumber execution settings:

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

### Configuration Breakdown

Understanding each configuration option:

- **require** - Specifies where to find step definitions and support files
- **requireModule** - Enables TypeScript compilation via ts-node
- **format** - Defines output formats (progress, JSON, HTML)
- **snippetInterface** - Uses modern async/await for generated step definitions
- **publishQuiet** - Prevents publishing results to Cucumber Cloud

## Step 5: Playwright Configuration

### Creating playwright.config.ts

Configure Playwright for BDD integration:

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
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
  ]
});
```

## Step 6: Support Files Setup

### Creating World Configuration

Create `features/support/world.ts` for shared context:

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
    // Browser initialization will be handled in hooks
  }
}

setWorldConstructor(CustomWorld);
```

### Creating Hooks File

Create `features/support/hooks.ts` for setup and teardown:

```typescript
import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, chromium } from '@playwright/test';
import { CustomWorld } from './world';

let browser: Browser;

BeforeAll(async function () {
  browser = await chromium.launch({ 
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
  });
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  if (this.page) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});
```

## Step 7: Package.json Scripts Configuration

### Adding NPM Scripts

Update your `package.json` to include helpful scripts:

```json
{
  "scripts": {
    "test:bdd": "cucumber-js",
    "test:bdd:parallel": "cucumber-js --parallel 2",
    "test:bdd:headless": "HEADLESS=true cucumber-js",
    "test:bdd:headed": "HEADLESS=false cucumber-js",
    "test:bdd:slow": "HEADLESS=false SLOW_MO=1000 cucumber-js",
    "build": "tsc",
    "clean": "rimraf dist reports",
    "lint": "eslint features src --ext .ts",
    "type-check": "tsc --noEmit"
  }
}
```

### Script Explanations

Understanding each script's purpose:

- **test:bdd** - Standard BDD test execution
- **test:bdd:parallel** - Parallel execution for faster runs
- **test:bdd:headless** - Run tests without browser UI (CI/CD)
- **test:bdd:headed** - Run tests with visible browser (debugging)
- **test:bdd:slow** - Slow motion execution for demonstration

## Step 8: Environment Variables Setup

### Creating .env File

Create environment-specific configurations:

```bash
# .env file
BASE_URL=http://localhost:3000
BROWSER=chromium
HEADLESS=true
SLOW_MO=0
TIMEOUT=30000
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
```

### Environment Variable Loading

Install and configure dotenv for environment management:

```powershell
npm install --save-dev dotenv
```

Update hooks to load environment variables:

```typescript
// Add to features/support/hooks.ts
import * as dotenv from 'dotenv';
dotenv.config();
```

## Step 9: Creating Your First Test

### Simple Feature File

Create `features/sample.feature`:

```gherkin
Feature: Environment Setup Validation
  As a QA automation engineer
  I want to verify my BDD environment is properly configured
  So that I can start writing automated tests

  Scenario: Verify browser launches successfully
    Given I have a browser instance
    When I navigate to a test page
    Then the page should load successfully
```

### Basic Step Definitions

Create `features/step_definitions/sample_steps.ts`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I have a browser instance', async function (this: CustomWorld) {
  expect(this.page).toBeDefined();
});

When('I navigate to a test page', async function (this: CustomWorld) {
  await this.page.goto('https://example.com');
});

Then('the page should load successfully', async function (this: CustomWorld) {
  await expect(this.page).toHaveTitle(/Example Domain/);
});
```

## Step 10: Validation and Testing

### Running Your First Test

Execute the setup validation:

```powershell
# Run the basic test
npm run test:bdd

# Run with visible browser
npm run test:bdd:headed

# Check TypeScript compilation
npm run type-check
```

### Troubleshooting Common Issues

#### Issue: "Cannot find module '@cucumber/cucumber'"
**Solution:** Ensure all dependencies are installed:
```powershell
npm install
```

#### Issue: "TypeScript compilation errors"
**Solution:** Check tsconfig.json configuration and file paths:
```powershell
npx tsc --showConfig
```

#### Issue: "Playwright browser not found"
**Solution:** Install Playwright browsers:
```powershell
npx playwright install
```

#### Issue: "Step definitions not found"
**Solution:** Verify cucumber.json require paths match your file structure.

## Best Practices and Recommendations

### Project Organization
- Keep feature files focused and readable
- Group related step definitions in logical files
- Use meaningful names for configuration files
- Maintain consistent directory structure

### Configuration Management
- Use environment variables for deployment-specific settings
- Keep sensitive data out of configuration files
- Document configuration choices in comments
- Version control all configuration files (except .env)

### Development Workflow
- Start with simple scenarios to validate setup
- Use TypeScript strict mode for better code quality
- Implement proper error handling in step definitions
- Write reusable support functions for common operations

## Summary

You have successfully set up a complete BDD testing environment with:

✅ **Cucumber.js** configured for BDD test execution  
✅ **TypeScript** providing type safety and modern JavaScript features  
✅ **Playwright** enabling robust web automation  
✅ **Proper project structure** following BDD best practices  
✅ **Configuration files** optimized for development and CI/CD  
✅ **Support files** providing shared context and lifecycle management  
✅ **Validation test** confirming everything works together  

This foundation prepares you for writing comprehensive BDD scenarios, implementing step definitions, and building maintainable automated test suites. The configuration supports both development and production environments while maintaining flexibility for different testing needs.

## Next Steps

With your environment configured, you're ready to:
- Write comprehensive feature files using Gherkin syntax
- Implement detailed step definitions with TypeScript
- Integrate with Page Object Model patterns
- Generate living documentation from your tests
- Scale your BDD implementation across larger projects

The solid foundation you've built will support all advanced BDD practices covered in subsequent lessons.