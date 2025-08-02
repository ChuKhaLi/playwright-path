# Exercise 03: Multi-Environment Setup 🟡

## 🎯 Objective

Implement comprehensive environment management for development, testing, and CI/CD. This exercise teaches production-ready configuration patterns and automated environment switching.

## 📋 Prerequisites

- **Completed Exercise 01 & 02** successfully
- **Working BDD project** with TypeScript configuration
- **Understanding of environment variables** and configuration management
- **Basic knowledge of CI/CD concepts**

## 📝 Tasks

### Task 1: Environment Configuration Structure (20 minutes)

#### 1.1 Create Environment-Specific Files

```powershell
# Create environment configuration directory
New-Item -ItemType Directory -Force -Path "config"
New-Item -ItemType Directory -Force -Path "config/environments"
```

Create `.env.development`:
```bash
# Development Environment
NODE_ENV=development
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3001/api

# Browser Configuration
BROWSER=chromium
HEADLESS=false
SLOW_MO=1000
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Debugging
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
TRACE_ON_RETRY=true
DEBUG_MODE=true

# Timeouts (generous for debugging)
TIMEOUT=60000
EXPECT_TIMEOUT=10000
RETRY_COUNT=0
PARALLEL_WORKERS=1

# Test Data
TEST_USER_EMAIL=dev@example.com
TEST_USER_PASSWORD=DevPassword123
```

Create `.env.testing`:
```bash
# Testing Environment
NODE_ENV=testing
BASE_URL=https://test.example.com
API_BASE_URL=https://test-api.example.com/api

# Browser Configuration
BROWSER=chromium
HEADLESS=true
SLOW_MO=0
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Testing Optimizations
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=false
TRACE_ON_RETRY=true
DEBUG_MODE=false

# Timeouts (balanced)
TIMEOUT=30000
EXPECT_TIMEOUT=5000
RETRY_COUNT=1
PARALLEL_WORKERS=2

# Test Data
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestEnv123
```

Create `.env.ci`:
```bash
# CI/CD Environment
NODE_ENV=ci
CI=true
BASE_URL=https://staging.example.com
API_BASE_URL=https://staging-api.example.com/api

# Browser Configuration (CI optimized)
BROWSER=chromium
HEADLESS=true
SLOW_MO=0

# CI Optimizations
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
TRACE_ON_RETRY=true
DEBUG_MODE=false

# Timeouts (strict)
TIMEOUT=20000
EXPECT_TIMEOUT=3000
RETRY_COUNT=2
PARALLEL_WORKERS=4

# Reporting
GENERATE_HTML_REPORT=true
GENERATE_JSON_REPORT=true
GENERATE_JUNIT_REPORT=true

# CI Metadata
BUILD_NUMBER=${BUILD_NUMBER}
BRANCH_NAME=${BRANCH_NAME}
COMMIT_SHA=${COMMIT_SHA}
```

#### 1.2 Environment-Specific Cucumber Configurations

Create `config/cucumber.development.json`:
```json
{
  "default": {
    "require": [
      "features/step_definitions/**/*.ts",
      "features/support/**/*.ts"
    ],
    "requireModule": ["ts-node/register"],
    "format": [
      "progress-bar",
      "@cucumber/pretty-formatter"
    ],
    "formatOptions": {
      "snippetInterface": "async-await",
      "colorsEnabled": true
    },
    "parallel": 1,
    "retry": 0,
    "tags": "not @production-only",
    "publishQuiet": true
  }
}
```

Create `config/cucumber.testing.json`:
```json
{
  "default": {
    "require": [
      "features/step_definitions/**/*.ts",
      "features/support/**/*.ts"
    ],
    "requireModule": ["ts-node/register"],
    "format": [
      "progress-bar",
      "json:reports/testing-results.json",
      "html:reports/testing-report.html"
    ],
    "parallel": 2,
    "retry": 1,
    "retryTagFilter": "@flaky",
    "tags": "not @development-only and not @production-only",
    "publishQuiet": true
  }
}
```

Create `config/cucumber.ci.json`:
```json
{
  "default": {
    "require": [
      "features/step_definitions/**/*.ts",
      "features/support/**/*.ts"
    ],
    "requireModule": ["ts-node/register"],
    "format": [
      "progress-bar",
      "json:reports/ci-results.json",
      "html:reports/ci-report.html",
      "junit:reports/junit.xml"
    ],
    "parallel": 4,
    "retry": 2,
    "retryTagFilter": "@flaky or @unstable",
    "tags": "not @manual and not @development-only",
    "publishQuiet": true
  }
}
```

### Task 2: Environment Loading System (25 minutes)

#### 2.1 Environment Loader Utility

Create `src/utils/environment-loader.ts`:
```typescript
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

export type Environment = 'development' | 'testing' | 'ci' | 'production';

export interface EnvironmentConfig {
  name: Environment;
  baseUrl: string;
  apiUrl: string;
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  debug: boolean;
  timeouts: {
    default: number;
    expect: number;
  };
  parallel: number;
  retry: number;
}

export class EnvironmentLoader {
  private static instance: EnvironmentLoader;
  private config: EnvironmentConfig;
  
  private constructor() {
    this.loadEnvironment();
    this.config = this.parseConfig();
  }
  
  static getInstance(): EnvironmentLoader {
    if (!EnvironmentLoader.instance) {
      EnvironmentLoader.instance = new EnvironmentLoader();
    }
    return EnvironmentLoader.instance;
  }
  
  private loadEnvironment(): void {
    const environment = process.env.NODE_ENV || 'development';
    const envFile = `.env.${environment}`;
    const envPath = path.resolve(process.cwd(), envFile);
    
    // Load environment-specific file
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      console.log(`🌍 Environment loaded: ${environment} (${envFile})`);
    } else {
      console.warn(`⚠️  Environment file not found: ${envFile}`);
    }
    
    // Load default .env as fallback
    const defaultEnvPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(defaultEnvPath)) {
      dotenv.config({ path: defaultEnvPath });
    }
  }
  
  private parseConfig(): EnvironmentConfig {
    const env = (process.env.NODE_ENV as Environment) || 'development';
    
    return {
      name: env,
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      apiUrl: process.env.API_BASE_URL || 'http://localhost:3001/api',
      browser: (process.env.BROWSER as any) || 'chromium',
      headless: process.env.HEADLESS === 'true',
      debug: process.env.DEBUG_MODE === 'true',
      timeouts: {
        default: parseInt(process.env.TIMEOUT || '30000'),
        expect: parseInt(process.env.EXPECT_TIMEOUT || '10000')
      },
      parallel: parseInt(process.env.PARALLEL_WORKERS || '1'),
      retry: parseInt(process.env.RETRY_COUNT || '0')
    };
  }
  
  getConfig(): EnvironmentConfig {
    return this.config;
  }
  
  validateEnvironment(): void {
    const required = ['BASE_URL', 'BROWSER'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
  
  getTestData(): Record<string, string> {
    return {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password123'
    };
  }
}

// Initialize environment loading
EnvironmentLoader.getInstance();
```

#### 2.2 Environment-Aware World Class

Update `features/support/world.ts`:
```typescript
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { EnvironmentLoader } from '@src/utils/environment-loader';

export class EnvironmentAwareWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public testData: Record<string, any> = {};
  private envLoader: EnvironmentLoader;
  
  constructor(options: IWorldOptions) {
    super(options);
    this.envLoader = EnvironmentLoader.getInstance();
  }
  
  async init(): Promise<void> {
    const config = this.envLoader.getConfig();
    
    // Launch browser based on environment
    const launchOptions = {
      headless: config.headless,
      slowMo: config.debug ? 1000 : 0
    };
    
    switch (config.browser) {
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(launchOptions);
        break;
      default:
        this.browser = await chromium.launch(launchOptions);
    }
    
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(config.timeouts.default);
    
    // Load test data from environment
    this.testData = { ...this.testData, ...this.envLoader.getTestData() };
  }
  
  async cleanup(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
  
  getEnvironmentConfig() {
    return this.envLoader.getConfig();
  }
}

setWorldConstructor(EnvironmentAwareWorld);
```

### Task 3: Environment Switching Scripts (20 minutes)

#### 3.1 PowerShell Environment Manager

Create `scripts/setup-environment.ps1`:
```powershell
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("development", "testing", "ci", "production")]
    [string]$Environment
)

Write-Host "🔧 Setting up $Environment environment..." -ForegroundColor Green

# Copy environment-specific files
$envFile = ".env.$Environment"
$cucumberConfig = "config/cucumber.$Environment.json"

if (Test-Path $envFile) {
    Copy-Item $envFile ".env" -Force
    Write-Host "✅ Environment file copied: $envFile" -ForegroundColor Green
} else {
    Write-Host "❌ Environment file not found: $envFile" -ForegroundColor Red
    exit 1
}

if (Test-Path $cucumberConfig) {
    Copy-Item $cucumberConfig "cucumber.json" -Force
    Write-Host "✅ Cucumber config copied: $cucumberConfig" -ForegroundColor Green
} else {
    Write-Host "❌ Cucumber config not found: $cucumberConfig" -ForegroundColor Red
    exit 1
}

# Environment-specific setup
switch ($Environment) {
    "development" {
        Write-Host "🛠️  Setting up development environment..." -ForegroundColor Yellow
        npm install
        npx playwright install
    }
    "testing" {
        Write-Host "🧪 Setting up testing environment..." -ForegroundColor Yellow
        npm ci
    }
    "ci" {
        Write-Host "🚀 Setting up CI environment..." -ForegroundColor Yellow
        npm ci
        npx playwright install --with-deps
    }
}

# Validate setup
Write-Host "🔍 Validating environment setup..." -ForegroundColor Yellow
npm run typecheck

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ $Environment environment setup complete!" -ForegroundColor Green
} else {
    Write-Host "❌ Environment setup failed!" -ForegroundColor Red
    exit 1
}
```

#### 3.2 Environment Validation Script

Create `scripts/validate-environment.ts`:
```typescript
import { EnvironmentLoader } from '../src/utils/environment-loader';
import * as fs from 'fs';

interface ValidationResult {
  category: string;
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

class EnvironmentValidator {
  private results: ValidationResult[] = [];
  
  async validate(): Promise<void> {
    console.log('🔍 Validating BDD environment...\n');
    
    this.checkEnvironmentFiles();
    this.checkEnvironmentVariables();
    this.checkConfiguration();
    await this.checkBrowsers();
    
    this.printResults();
  }
  
  private checkEnvironmentFiles(): void {
    const env = process.env.NODE_ENV || 'development';
    const requiredFiles = [
      `.env.${env}`,
      `config/cucumber.${env}.json`,
      'cucumber.json',
      '.env'
    ];
    
    requiredFiles.forEach(file => {
      const exists = fs.existsSync(file);
      this.results.push({
        category: 'Files',
        check: file,
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Found' : 'Missing'
      });
    });
  }
  
  private checkEnvironmentVariables(): void {
    const required = ['BASE_URL', 'BROWSER', 'NODE_ENV'];
    
    required.forEach(envVar => {
      const value = process.env[envVar];
      this.results.push({
        category: 'Environment Variables',
        check: envVar,
        status: value ? 'pass' : 'fail',
        message: value ? `Set to: ${value}` : 'Not set'
      });
    });
  }
  
  private checkConfiguration(): void {
    try {
      const envLoader = EnvironmentLoader.getInstance();
      envLoader.validateEnvironment();
      
      this.results.push({
        category: 'Configuration',
        check: 'Environment validation',
        status: 'pass',
        message: 'All required variables present'
      });
    } catch (error) {
      this.results.push({
        category: 'Configuration',
        check: 'Environment validation',
        status: 'fail',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  private async checkBrowsers(): Promise<void> {
    try {
      const { chromium } = await import('playwright');
      const browser = await chromium.launch({ headless: true });
      await browser.close();
      
      this.results.push({
        category: 'Browsers',
        check: 'Chromium',
        status: 'pass',
        message: 'Available and functional'
      });
    } catch (error) {
      this.results.push({
        category: 'Browsers',
        check: 'Chromium',
        status: 'fail',
        message: 'Not available or non-functional'
      });
    }
  }
  
  private printResults(): void {
    const categories = [...new Set(this.results.map(r => r.category))];
    
    categories.forEach(category => {
      console.log(`📋 ${category}:`);
      const categoryResults = this.results.filter(r => r.category === category);
      
      categoryResults.forEach(result => {
        const icon = result.status === 'pass' ? '✅' : 
                   result.status === 'fail' ? '❌' : '⚠️';
        console.log(`   ${icon} ${result.check}: ${result.message}`);
      });
      
      console.log('');
    });
    
    const summary = {
      pass: this.results.filter(r => r.status === 'pass').length,
      fail: this.results.filter(r => r.status === 'fail').length,
      warning: this.results.filter(r => r.status === 'warning').length
    };
    
    console.log(`📊 Summary: ${summary.pass} passed, ${summary.fail} failed, ${summary.warning} warnings`);
    
    if (summary.fail > 0) {
      process.exit(1);
    }
  }
}

// Run validation
const validator = new EnvironmentValidator();
validator.validate().catch(console.error);
```

### Task 4: CI/CD Integration (25 minutes)

#### 4.1 GitHub Actions Workflow

Create `.github/workflows/bdd-tests.yml`:
```yaml
name: BDD Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  bdd-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
        
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps ${{ matrix.browser }}
    
    - name: Setup CI environment
      run: |
        npm run env:setup ci
        npm run env:validate
    
    - name: Run BDD tests
      env:
        BROWSER: ${{ matrix.browser }}
        BUILD_NUMBER: ${{ github.run_number }}
        BRANCH_NAME: ${{ github.ref_name }}
        COMMIT_SHA: ${{ github.sha }}
        PR_NUMBER: ${{ github.event.number }}
      run: npm run test:ci
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: bdd-results-${{ matrix.browser }}
        path: |
          reports/
          screenshots/
          videos/
    
    - name: Publish test results
      uses: dorny/test-reporter@v1
      if: always()
      with:
        name: BDD Tests (${{ matrix.browser }})
        path: reports/junit.xml
        reporter: java-junit
```

#### 4.2 Enhanced Package Scripts

Update `package.json`:
```json
{
  "scripts": {
    "test": "cucumber-js",
    "test:dev": "npm run env:setup development && npm run test",
    "test:testing": "npm run env:setup testing && cucumber-js",
    "test:ci": "npm run env:setup ci && cucumber-js",
    "env:setup": "node -r ts-node/register scripts/setup-environment.ts",
    "env:validate": "node -r ts-node/register scripts/validate-environment.ts",
    "env:dev": "powershell -ExecutionPolicy Bypass -File scripts/setup-environment.ps1 -Environment development",
    "env:test": "powershell -ExecutionPolicy Bypass -File scripts/setup-environment.ps1 -Environment testing",
    "env:ci": "powershell -ExecutionPolicy Bypass -File scripts/setup-environment.ps1 -Environment ci",
    "typecheck": "tsc --noEmit",
    "clean": "rimraf dist reports screenshots videos"
  }
}
```

### Task 5: Environment-Specific Features (20 minutes)

#### 5.1 Tagged Scenarios for Different Environments

Update `features/sample.feature`:
```gherkin
Feature: Environment-Aware Testing
  As a QA engineer
  I want to run different tests in different environments
  So that I can validate environment-specific functionality

  Background:
    Given the application is running in the current environment

  @development-only
  Scenario: Development debugging features
    Given I am on the homepage
    When I enable debug mode
    Then I should see debug information
    And the page should load slowly for observation

  @smoke @all-environments
  Scenario: Basic functionality works
    Given I am on the homepage
    When the page loads
    Then I should see the main content
    And the page should be responsive

  @regression @testing @ci
  Scenario: Complete user workflow
    Given I am on the login page
    When I log in with valid credentials
    Then I should be redirected to the dashboard
    And I should see user-specific content

  @performance @ci
  Scenario: Page load performance
    Given I am on the homepage
    When I measure page load time
    Then the page should load within acceptable limits
    And all resources should be optimized

  @flaky @ci
  Scenario: Potentially unstable test
    Given I am testing a feature that might be flaky
    When I perform complex interactions
    Then the system should eventually respond correctly
```

#### 5.2 Environment-Specific Step Definitions

Create `features/step_definitions/environment.steps.ts`:
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { EnvironmentAwareWorld } from '@support/world';

Given('the application is running in the current environment', async function (this: EnvironmentAwareWorld) {
  const config = this.getEnvironmentConfig();
  console.log(`🌍 Running in ${config.name} environment`);
  console.log(`🔗 Base URL: ${config.baseUrl}`);
});

When('I enable debug mode', async function (this: EnvironmentAwareWorld) {
  const config = this.getEnvironmentConfig();
  if (!config.debug) {
    console.log('⚠️  Debug mode not available in this environment');
    return 'pending';
  }
  
  // Debug mode specific actions
  console.log('🐛 Debug mode enabled');
});

Then('I should see debug information', async function (this: EnvironmentAwareWorld) {
  const config = this.getEnvironmentConfig();
  if (config.debug) {
    // Check for debug elements
    console.log('✅ Debug information visible');
  }
});

When('I log in with valid credentials', async function (this: EnvironmentAwareWorld) {
  const testData = this.testData;
  await this.page.goto(`${this.getEnvironmentConfig().baseUrl}/login`);
  
  await this.page.fill('[data-testid="email"]', testData.email);
  await this.page.fill('[data-testid="password"]', testData.password);
  await this.page.click('[data-testid="login-button"]');
});

When('I measure page load time', async function (this: EnvironmentAwareWorld) {
  const startTime = Date.now();
  
  await this.page.goto(this.getEnvironmentConfig().baseUrl);
  await this.page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  this.testData.pageLoadTime = loadTime;
  
  console.log(`⏱️  Page load time: ${loadTime}ms`);
});

Then('the page should load within acceptable limits', async function (this: EnvironmentAwareWorld) {
  const config = this.getEnvironmentConfig();
  const loadTime = this.testData.pageLoadTime;
  
  // Different limits for different environments
  const limits: Record<string, number> = {
    development: 10000, // 10 seconds (generous for local dev)
    testing: 5000,      // 5 seconds
    ci: 3000,           // 3 seconds (fast CI environment)
    production: 2000    // 2 seconds (production should be fastest)
  };
  
  const limit = limits[config.name] || 5000;
  expect(loadTime).toBeLessThan(limit);
});
```

## ✅ Validation

### Environment Setup Checklist

- [ ] **Environment Files**: All .env files created for each environment
- [ ] **Cucumber Configs**: Environment-specific cucumber configurations
- [ ] **Environment Loader**: Dynamic environment loading system
- [ ] **World Class**: Environment-aware world implementation
- [ ] **Scripts**: Automated environment switching scripts
- [ ] **CI/CD Integration**: GitHub Actions workflow configured
- [ ] **Tagged Scenarios**: Environment-specific feature tags
- [ ] **Validation**: Environment validation system working

### Test All Environments

```powershell
# Test development environment
npm run env:dev
npm run env:validate
npm run test:dev

# Test testing environment
npm run env:test
npm run env:validate
npm run test:testing

# Test CI environment (locally)
npm run env:ci
npm run env:validate
npm run test:ci
```

## 🔧 Troubleshooting

### Common Issues

**Issue: Environment not switching properly**
```powershell
# Force clean environment setup
npm run clean
Remove-Item .env -ErrorAction SilentlyContinue
Remove-Item cucumber.json -ErrorAction SilentlyContinue
npm run env:setup development
```

**Issue: CI tests failing**
- Check that all required environment variables are set
- Verify browser installation in CI environment
- Ensure proper permissions for file operations

**Issue: Environment validation fails**
- Check file paths in validation script
- Verify all required files exist
- Test environment loader manually

## 🎓 Learning Points

### Environment Management Concepts

1. **Configuration as Code**: Environment settings in version control
2. **Environment Isolation**: Separate configurations prevent conflicts
3. **Dynamic Loading**: Runtime environment detection and configuration
4. **Validation Systems**: Automated environment health checks
5. **CI/CD Integration**: Seamless pipeline environment management
6. **Tagged Testing**: Environment-specific test execution
7. **Performance Optimization**: Environment-tuned settings

### Professional Practices

- **Infrastructure as Code**: Automated environment setup
- **Validation First**: Verify environment before testing
- **Flexible Configuration**: Support multiple deployment targets
- **Monitoring Integration**: Environment-aware reporting
- **Team Collaboration**: Consistent environments across team

## 📊 Self-Assessment

Rate your understanding (1-5 scale):

- [ ] Environment configuration management
- [ ] Dynamic environment loading
- [ ] CI/CD pipeline integration
- [ ] Environment-specific testing strategies
- [ ] Automated environment switching
- [ ] Environment validation systems
- [ ] Performance optimization per environment
- [ ] Tagged scenario management

**Minimum Score for Progression**: 28/40 (70%)

Your multi-environment setup now provides:
- **Environment Isolation**: Clean separation between dev/test/prod
- **Automated Switching**: Scripts for easy environment changes
- **CI/CD Ready**: Production-ready pipeline integration
- **Validation Systems**: Automated environment health checks
- **Performance Optimization**: Environment-tuned configurations
- **Team Consistency**: Standardized environment management

Congratulations on mastering multi-environment BDD setup! 🎉