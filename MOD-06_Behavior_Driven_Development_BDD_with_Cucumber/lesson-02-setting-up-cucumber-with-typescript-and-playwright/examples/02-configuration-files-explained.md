# Example 02: Configuration Files Explained

## Overview

This example provides detailed explanations of each configuration file in a BDD project setup. Understanding these configurations is crucial for customizing your environment and troubleshooting issues.

## Target Audience

**Intermediate** - Assumes basic understanding of BDD setup. Focuses on configuration nuances and customization options.

## Configuration Files Deep Dive

### 1. package.json - Project Metadata and Dependencies

#### Purpose
Defines project metadata, dependencies, and npm scripts for the BDD project.

#### Key Sections Explained

```json
{
  "name": "ecommerce-bdd-tests",
  "version": "1.0.0",
  "description": "BDD automation tests for e-commerce platform",
  "main": "index.js",
  "scripts": {
    "test:bdd": "cucumber-js",
    "test:bdd:parallel": "cucumber-js --parallel 2",
    "test:bdd:headed": "HEADLESS=false cucumber-js",
    "test:bdd:tags": "cucumber-js --tags",
    "test:bdd:format": "cucumber-js --format json:reports/results.json",
    "build": "tsc",
    "clean": "rimraf dist reports",
    "type-check": "tsc --noEmit",
    "lint": "eslint features src --ext .ts",
    "format": "prettier --write features src",
    "setup:install": "npm install && npx playwright install",
    "setup:validate": "npm run type-check && npm run test:bdd"
  },
  "devDependencies": {
    "@cucumber/cucumber": "^9.5.1",
    "@playwright/test": "^1.38.1",
    "@types/node": "^20.6.3",
    "cucumber-html-reporter": "^5.5.0",
    "dotenv": "^16.3.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2"
  },
  "keywords": ["bdd", "cucumber", "playwright", "typescript", "automation"],
  "author": "QA Team",
  "license": "MIT"
}
```

#### Script Explanations

| Script | Purpose | Use Case |
|--------|---------|----------|
| `test:bdd` | Standard BDD test execution | Daily development testing |
| `test:bdd:parallel` | Parallel test execution | Faster test runs |
| `test:bdd:headed` | Run with visible browser | Debugging and demonstrations |
| `test:bdd:tags` | Tag-based test execution | Running specific test subsets |
| `test:bdd:format` | Custom output formatting | CI/CD integration |
| `build` | TypeScript compilation | Build verification |
| `type-check` | Type checking without compilation | Quick validation |
| `setup:validate` | Complete environment validation | Initial setup verification |

### 2. tsconfig.json - TypeScript Configuration

#### Purpose
Configures TypeScript compiler options for optimal BDD development experience.

#### Complete Configuration with Explanations

```json
{
  "compilerOptions": {
    // ECMAScript target version
    "target": "ES2020",                           // Modern JS features for Node.js 16+
    
    // Module system
    "module": "commonjs",                         // Node.js compatible modules
    "moduleResolution": "node",                   // Node.js module resolution
    
    // Library definitions
    "lib": ["ES2020", "DOM"],                     // ES2020 + DOM types for web testing
    "types": ["node", "@types/node"],             // Include Node.js types
    
    // Output configuration
    "outDir": "./dist",                           // Compiled output directory
    "rootDir": "./",                              // Source root directory
    "declaration": false,                         // Don't generate .d.ts files
    "removeComments": true,                       // Remove comments from output
    
    // Type checking strictness
    "strict": true,                               // Enable all strict checks
    "noImplicitAny": true,                        // Error on 'any' type
    "strictNullChecks": true,                     // Strict null checking
    "strictFunctionTypes": true,                  // Strict function type checking
    "noImplicitReturns": true,                    // Error on missing return statements
    "noFallthroughCasesInSwitch": true,          // Error on switch fallthrough
    
    // Module handling
    "esModuleInterop": true,                      // CommonJS/ES module interop
    "allowSyntheticDefaultImports": true,         // Allow default imports
    "resolveJsonModule": true,                    // Import JSON files
    
    // Advanced options
    "skipLibCheck": true,                         // Skip type checking of declaration files
    "forceConsistentCasingInFileNames": true,     // Enforce consistent casing
    "experimentalDecorators": true,               // Enable decorators
    "emitDecoratorMetadata": true                 // Emit decorator metadata
  },
  
  // File inclusion/exclusion
  "include": [
    "features/**/*",                              // Include all feature files
    "src/**/*"                                    // Include all source files
  ],
  "exclude": [
    "node_modules",                               // Exclude dependencies
    "dist",                                       // Exclude compiled output
    "reports"                                     // Exclude test reports
  ]
}
```

#### Configuration Impact on BDD Development

| Setting | BDD Impact | Benefit |
|---------|------------|---------|
| `strict: true` | Catches type errors in step definitions | Higher code quality |
| `target: "ES2020"` | Modern async/await support | Better async handling |
| `types: ["node"]` | Node.js API access | File system, process operations |
| `experimentalDecorators` | Cucumber decorator support | Cleaner step definition syntax |

### 3. cucumber.json - Cucumber Configuration

#### Purpose
Configures Cucumber.js behavior, step definition loading, and output formatting.

#### Detailed Configuration

```json
{
  "default": {
    // Step definition and support file loading
    "require": [
      "features/step_definitions/**/*.ts",        // Load all step definition files
      "features/support/**/*.ts"                  // Load all support files (hooks, world)
    ],
    
    // Module loading for TypeScript
    "requireModule": [
      "ts-node/register"                          // Enable TypeScript compilation
    ],
    
    // Output formatting options
    "format": [
      "progress-bar",                             // Console progress indicator
      "json:reports/cucumber_report.json",       // JSON report for processing
      "html:reports/cucumber_report.html",       // HTML report for viewing
      "@cucumber/pretty-formatter"               // Pretty console output
    ],
    
    // Formatter-specific options
    "formatOptions": {
      "snippetInterface": "async-await",          // Generate async step definitions
      "snippetSyntax": "typescript"               // Generate TypeScript snippets
    },
    
    // Execution options
    "parallel": 1,                                // Number of parallel workers
    "retry": 0,                                   // Retry failed scenarios
    "retryTagFilter": "@flaky",                   // Only retry scenarios with @flaky tag
    
    // Publishing options
    "publish": false,                             // Don't publish to Cucumber Cloud
    "publishQuiet": true,                         // Suppress publishing messages
    
    // World parameters (accessible in step definitions)
    "worldParameters": {
      "browser": "chromium",
      "headless": true,
      "baseUrl": "http://localhost:3000"
    }
  },
  
  // Environment-specific configurations
  "development": {
    "format": ["progress-bar"],
    "parallel": 1,
    "retry": 0
  },
  
  "ci": {
    "format": [
      "json:reports/cucumber_report.json",
      "junit:reports/junit.xml"
    ],
    "parallel": 2,
    "retry": 2,
    "retryTagFilter": "@flaky or @unstable"
  }
}
```

#### Format Options Explained

| Format | Output | Use Case |
|--------|--------|----------|
| `progress-bar` | Console progress indicator | Development feedback |
| `json:path` | JSON report file | CI/CD integration, processing |
| `html:path` | HTML report file | Human-readable reports |
| `junit:path` | JUnit XML format | CI/CD test reporting |
| `@cucumber/pretty-formatter` | Colorized console output | Development readability |

### 4. playwright.config.ts - Playwright Configuration

#### Purpose
Configures Playwright browser automation settings for BDD integration.

#### Comprehensive Configuration

```typescript
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  // Test discovery
  testDir: './features',                          // Feature files location
  testMatch: '**/*.feature',                      // Feature file pattern
  
  // Execution timeouts
  timeout: 30000,                                 // Overall test timeout
  expect: {
    timeout: 5000                                 // Assertion timeout
  },
  
  // Execution behavior
  fullyParallel: false,                           // BDD scenarios run sequentially
  forbidOnly: !!process.env.CI,                  // Prevent .only in CI
  retries: process.env.CI ? 2 : 0,                // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined,       // Parallel workers
  
  // Reporting
  reporter: [
    ['html', { 
      outputFolder: 'reports/playwright-report',
      open: process.env.CI ? 'never' : 'on-failure'
    }],
    ['json', { 
      outputFile: 'reports/playwright-results.json' 
    }],
    ['junit', { 
      outputFile: 'reports/junit-results.xml' 
    }]
  ],
  
  // Global test configuration
  use: {
    // Base URL for navigation
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Tracing and debugging
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Network and performance
    launchOptions: {
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
    }
  },
  
  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'                         // Use stable Chrome
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'] 
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'] 
      },
    },
    
    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'] 
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'] 
      },
    }
  ],
  
  // Development server
  webServer: process.env.START_SERVER ? {
    command: 'npm run start:test-server',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  } : undefined
});
```

#### Browser Configuration Impact

| Configuration | Impact | Best Practice |
|---------------|--------|---------------|
| `fullyParallel: false` | Sequential BDD execution | Prevents test interference |
| `trace: 'on-first-retry'` | Debug info on failures | Debugging support |
| `screenshot: 'only-on-failure'` | Visual failure evidence | Efficient storage usage |
| `slowMo: 0` | Normal execution speed | Use slowMo for debugging |

### 5. .env - Environment Variables

#### Purpose
Centralizes environment-specific configuration without hardcoding values.

#### Complete Environment Configuration

```bash
# Application URLs
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3001/api
ADMIN_URL=http://localhost:3000/admin

# Browser Configuration
BROWSER=chromium
HEADLESS=true
SLOW_MO=0
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Test Execution
TIMEOUT=30000
EXPECT_TIMEOUT=5000
RETRY_COUNT=0
PARALLEL_WORKERS=1

# Debugging and Tracing
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
TRACE_ON_RETRY=true
DEBUG_MODE=false

# Reporting
GENERATE_HTML_REPORT=true
GENERATE_JSON_REPORT=true
GENERATE_JUNIT_REPORT=false
REPORT_PATH=./reports

# Test Data
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPassword123

# External Services (for integration tests)
DATABASE_URL=postgresql://localhost:5432/test_db
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200

# CI/CD Specific
CI=false
BUILD_NUMBER=local-dev
BRANCH_NAME=main
```

#### Environment Variable Categories

| Category | Variables | Purpose |
|----------|-----------|---------|
| **Application** | BASE_URL, API_BASE_URL | Target application configuration |
| **Browser** | BROWSER, HEADLESS, SLOW_MO | Browser behavior control |
| **Execution** | TIMEOUT, RETRY_COUNT | Test execution parameters |
| **Debugging** | SCREENSHOT_ON_FAILURE, TRACE_ON_RETRY | Debugging assistance |
| **Reporting** | GENERATE_*_REPORT | Report generation control |
| **Test Data** | TEST_USER_*, ADMIN_* | Test credentials and data |

### 6. Additional Configuration Files

#### 6.1 .gitignore - Version Control Exclusions

```gitignore
# Dependencies
node_modules/

# Compiled output
dist/
build/

# Test reports and artifacts
reports/
test-results/
playwright-report/
screenshots/
videos/
traces/

# Environment variables
.env
.env.local
.env.*.local

# IDE files
.vscode/settings.json
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage reports
coverage/
.nyc_output/
```

#### 6.2 .nvmrc - Node.js Version

```
16.20.0
```

#### 6.3 eslint.config.js - Code Quality (Optional)

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  env: {
    node: true,
    es6: true,
  },
  ignorePatterns: ['dist/', 'reports/', 'node_modules/'],
};
```

## Configuration Best Practices

### 1. Environment-Specific Configurations

**Problem:** Different settings needed for development, testing, and production.

**Solution:** Use environment variables and configuration profiles.

```json
// cucumber.json
{
  "default": {
    "format": ["progress-bar"]
  },
  "ci": {
    "format": ["json:reports/results.json", "junit:reports/junit.xml"],
    "parallel": 2,
    "retry": 2
  }
}
```

### 2. Sensitive Data Management

**Problem:** Credentials and secrets in configuration files.

**Solution:** Use environment variables and .env files (excluded from version control).

```typescript
// features/support/config.ts
export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  username: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'defaultpassword'
};
```

### 3. Configuration Validation

**Problem:** Invalid configurations causing runtime errors.

**Solution:** Create configuration validation utilities.

```typescript
// src/utils/config-validator.ts
export function validateConfig(): void {
  const required = ['BASE_URL', 'BROWSER'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### 4. Dynamic Configuration Loading

**Problem:** Static configurations don't adapt to runtime conditions.

**Solution:** Load configurations dynamically based on environment.

```typescript
// features/support/dynamic-config.ts
function loadConfig() {
  const environment = process.env.NODE_ENV || 'development';
  
  switch (environment) {
    case 'development':
      return {
        headless: false,
        slowMo: 1000,
        timeout: 60000
      };
    case 'ci':
      return {
        headless: true,
        slowMo: 0,
        timeout: 30000
      };
    default:
      return {
        headless: true,
        slowMo: 0,
        timeout: 30000
      };
  }
}
```

## Troubleshooting Configuration Issues

### Common Problems and Solutions

#### 1. TypeScript Compilation Errors

**Error:** "Cannot find module" or "Type errors"

**Diagnostic Commands:**
```powershell
npx tsc --showConfig          # Show effective configuration
npx tsc --listFiles          # Show files being compiled
npx tsc --noEmit --verbose   # Detailed compilation info
```

**Common Fixes:**
- Verify `include` and `exclude` paths in `tsconfig.json`
- Check `types` array includes necessary type packages
- Ensure `ts-node/register` is in `cucumber.json` requireModule

#### 2. Cucumber Step Definition Loading

**Error:** "Step definition not found" or "Undefined steps"

**Diagnostic Commands:**
```powershell
npx cucumber-js --dry-run    # Show matched steps
npx cucumber-js --help       # Show configuration options
```

**Common Fixes:**
- Verify `require` paths in `cucumber.json`
- Check file naming conventions (*.ts extension)
- Ensure step definition functions are properly exported

#### 3. Playwright Browser Issues

**Error:** "Browser not found" or "Launch failed"

**Diagnostic Commands:**
```powershell
npx playwright install       # Reinstall browsers
npx playwright --version     # Check version
```

**Common Fixes:**
- Run `npx playwright install` to install browsers
- Check `launchOptions` in `playwright.config.ts`
- Verify system requirements for browser execution

#### 4. Environment Variable Loading

**Error:** Variables not accessible or undefined

**Diagnostic Commands:**
```powershell
echo $env:BASE_URL           # Check if variable is set (PowerShell)
node -e "console.log(process.env.BASE_URL)"  # Check from Node.js
```

**Common Fixes:**
- Verify `.env` file exists and contains variables
- Ensure `dotenv.config()` is called before using variables
- Check variable naming and syntax in `.env` file

## Configuration Testing

### Validation Script

Create a configuration validation script:

```typescript
// scripts/validate-config.ts
import * as fs from 'fs';
import * as path from 'path';

function validateConfigFiles(): void {
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'cucumber.json',
    'playwright.config.ts'
  ];
  
  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(process.cwd(), file))
  );
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing configuration files:', missingFiles);
    process.exit(1);
  }
  
  console.log('✅ All configuration files present');
}

validateConfigFiles();
```

### Automated Configuration Testing

Add to `package.json`:

```json
{
  "scripts": {
    "config:validate": "ts-node scripts/validate-config.ts",
    "config:test": "npm run config:validate && npm run type-check"
  }
}
```

## Summary

Understanding configuration files is crucial for:

- **Customizing behavior** for different environments
- **Troubleshooting issues** when setup fails
- **Optimizing performance** through proper settings
- **Maintaining consistency** across team members
- **Scaling projects** with proper configuration management

Each configuration file serves a specific purpose in the BDD testing ecosystem, and understanding their interactions helps create robust, maintainable test automation projects.

## Next Steps

With configuration mastery, you can:
1. **Create environment-specific setups** for different deployment stages
2. **Optimize performance** through targeted configuration changes
3. **Implement advanced features** like parallel execution and custom reporting
4. **Troubleshoot complex issues** by understanding configuration interactions
5. **Scale your BDD implementation** across larger, more complex projects