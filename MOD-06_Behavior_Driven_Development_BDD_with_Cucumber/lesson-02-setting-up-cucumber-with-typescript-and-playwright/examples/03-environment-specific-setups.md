# Example 03: Environment-Specific Setups

## Overview

This example demonstrates how to configure BDD testing environments for different stages of the software development lifecycle: development, testing, staging, and production monitoring. Each environment has unique requirements and constraints.

## Target Audience

**Intermediate** - Assumes understanding of basic BDD setup. Focuses on environment management strategies and deployment considerations.

## Environment Setup Strategies

### 1. Development Environment

#### Purpose
Local development with maximum debugging capabilities and developer convenience.

#### Configuration Characteristics
- **Visible browser execution** for debugging
- **Slow motion** for step-by-step observation
- **Detailed logging** for troubleshooting
- **Hot reload** capabilities for rapid iteration
- **Local services** integration

#### Implementation

**Development .env file (`.env.development`)**
```bash
# Development Environment Configuration
NODE_ENV=development

# Application URLs (local development server)
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3001/api
ADMIN_URL=http://localhost:3000/admin

# Browser Configuration (development-friendly)
BROWSER=chromium
HEADLESS=false                    # Visible browser for debugging
SLOW_MO=1000                      # 1 second delay between actions
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Debugging Features
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
TRACE_ON_RETRY=true
DEBUG_MODE=true
CONSOLE_LOGS=true

# Test Execution (slower for observation)
TIMEOUT=60000                     # Longer timeout for debugging
EXPECT_TIMEOUT=10000
RETRY_COUNT=0                     # No retries in development
PARALLEL_WORKERS=1                # Sequential execution

# Development Database
DATABASE_URL=postgresql://localhost:5432/app_development
REDIS_URL=redis://localhost:6379/0

# Test Data (development-specific)
TEST_USER_EMAIL=dev@example.com
TEST_USER_PASSWORD=DevPassword123
ADMIN_EMAIL=admin@localhost.dev
ADMIN_PASSWORD=AdminDev123

# Feature Flags (enable all features for testing)
ENABLE_NEW_CHECKOUT=true
ENABLE_RECOMMENDATIONS=true
ENABLE_ANALYTICS=true
```

**Development Cucumber Configuration (`cucumber.development.json`)**
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

**Development NPM Scripts**
```json
{
  "scripts": {
    "dev:test": "NODE_ENV=development cucumber-js --config cucumber.development.json",
    "dev:test:debug": "NODE_ENV=development SLOW_MO=2000 cucumber-js --config cucumber.development.json",
    "dev:test:headed": "NODE_ENV=development HEADLESS=false cucumber-js --config cucumber.development.json",
    "dev:server": "concurrently \"npm run start:dev\" \"wait-on http://localhost:3000 && npm run dev:test\"",
    "dev:watch": "nodemon --watch features --ext ts,feature --exec \"npm run dev:test\""
  }
}
```

### 2. Testing Environment

#### Purpose
Dedicated testing environment with production-like data and realistic performance characteristics.

#### Configuration Characteristics
- **Headless execution** for speed
- **Realistic test data** volumes
- **Performance monitoring** enabled
- **Integration testing** with external services
- **Automated cleanup** procedures

#### Implementation

**Testing .env file (`.env.testing`)**
```bash
# Testing Environment Configuration
NODE_ENV=testing

# Application URLs (dedicated test environment)
BASE_URL=https://test.example.com
API_BASE_URL=https://test-api.example.com/api
ADMIN_URL=https://test.example.com/admin

# Browser Configuration (optimized for speed)
BROWSER=chromium
HEADLESS=true
SLOW_MO=0
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Test Execution (balanced speed and reliability)
TIMEOUT=30000
EXPECT_TIMEOUT=5000
RETRY_COUNT=1
PARALLEL_WORKERS=2

# Debugging (limited for performance)
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=false
TRACE_ON_RETRY=true
DEBUG_MODE=false

# Test Database (dedicated test instance)
DATABASE_URL=postgresql://test-db.example.com:5432/app_testing
REDIS_URL=redis://test-cache.example.com:6379/0

# Test Data (realistic volumes)
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestEnv123
ADMIN_EMAIL=admin@test.example.com
ADMIN_PASSWORD=AdminTest123

# External Services (test endpoints)
PAYMENT_SERVICE_URL=https://test-payments.example.com
NOTIFICATION_SERVICE_URL=https://test-notifications.example.com
ANALYTICS_URL=https://test-analytics.example.com

# Feature Flags (testing-specific)
ENABLE_NEW_CHECKOUT=true
ENABLE_RECOMMENDATIONS=false
ENABLE_ANALYTICS=true
```

**Testing Cucumber Configuration (`cucumber.testing.json`)**
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

### 3. CI/CD Environment

#### Purpose
Continuous integration pipeline execution with fast feedback and comprehensive reporting.

#### Configuration Characteristics
- **Maximum parallelization** for speed
- **Comprehensive reporting** for analysis
- **Failure retry logic** for flaky tests
- **Artifact generation** for debugging
- **Integration with CI tools**

#### Implementation

**CI/CD .env file (`.env.ci`)**
```bash
# CI/CD Environment Configuration
NODE_ENV=ci
CI=true

# Application URLs (staging environment)
BASE_URL=https://staging.example.com
API_BASE_URL=https://staging-api.example.com/api

# Browser Configuration (optimized for CI)
BROWSER=chromium
HEADLESS=true
SLOW_MO=0

# Test Execution (maximum parallelization)
TIMEOUT=20000                     # Stricter timeout for CI
EXPECT_TIMEOUT=3000
RETRY_COUNT=2                     # Retry flaky tests
PARALLEL_WORKERS=4                # Maximum parallelization

# CI-specific debugging
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
TRACE_ON_RETRY=true
DEBUG_MODE=false

# Reporting (comprehensive for CI)
GENERATE_HTML_REPORT=true
GENERATE_JSON_REPORT=true
GENERATE_JUNIT_REPORT=true
GENERATE_ALLURE_REPORT=true

# CI Metadata
BUILD_NUMBER=${BUILD_NUMBER}
BRANCH_NAME=${BRANCH_NAME}
COMMIT_SHA=${COMMIT_SHA}
PR_NUMBER=${PR_NUMBER}

# Test Data (CI-specific accounts)
TEST_USER_EMAIL=ci-test@example.com
TEST_USER_PASSWORD=${CI_TEST_PASSWORD}
```

**CI/CD Cucumber Configuration (`cucumber.ci.json`)**
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

**GitHub Actions Workflow (`.github/workflows/bdd-tests.yml`)**
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

### 4. Production Monitoring Environment

#### Purpose
Production environment monitoring with synthetic transactions and health checks.

#### Configuration Characteristics
- **Minimal test footprint** to avoid user impact
- **Health check scenarios** only
- **Real production data** (read-only)
- **Alerting integration** for failures
- **Compliance monitoring**

#### Implementation

**Production Monitoring .env file (`.env.production`)**
```bash
# Production Monitoring Configuration
NODE_ENV=production

# Production URLs
BASE_URL=https://app.example.com
API_BASE_URL=https://api.example.com/api
HEALTH_CHECK_URL=https://app.example.com/health

# Browser Configuration (minimal impact)
BROWSER=chromium
HEADLESS=true
SLOW_MO=0

# Execution (conservative settings)
TIMEOUT=15000                     # Fast timeout for health checks
EXPECT_TIMEOUT=2000
RETRY_COUNT=0                     # No retries in production
PARALLEL_WORKERS=1                # Sequential to minimize load

# Monitoring-specific
HEALTH_CHECK_ONLY=true
READ_ONLY_MODE=true
SYNTHETIC_USER_MODE=true

# Alerting
ALERT_ON_FAILURE=true
SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}
PAGERDUTY_API_KEY=${PAGERDUTY_API_KEY}

# Compliance
GDPR_COMPLIANT=true
AUDIT_LOGGING=true
```

**Production Monitoring Cucumber Configuration (`cucumber.production.json`)**
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
      "json:reports/production-health.json"
    ],
    "parallel": 1,
    "retry": 0,
    "tags": "@health-check or @production-monitoring",
    "publishQuiet": true
  }
}
```

## Environment Management Strategies

### 1. Configuration File Strategy

#### Approach: Multiple Configuration Files
```
project/
├── config/
│   ├── cucumber.development.json
│   ├── cucumber.testing.json
│   ├── cucumber.ci.json
│   └── cucumber.production.json
├── .env.development
├── .env.testing
├── .env.ci
└── .env.production
```

#### Environment Loading Script
```typescript
// src/utils/environment-loader.ts
import * as dotenv from 'dotenv';
import * as path from 'path';

export function loadEnvironment(): void {
  const environment = process.env.NODE_ENV || 'development';
  const envFile = `.env.${environment}`;
  
  // Load environment-specific file
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  
  // Load default environment file as fallback
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  
  console.log(`🌍 Environment loaded: ${environment}`);
  console.log(`📁 Config file: ${envFile}`);
}

// Load environment at startup
loadEnvironment();
```

### 2. Dynamic Configuration Strategy

#### Approach: Single Configuration with Environment Detection
```typescript
// cucumber.config.ts
interface EnvironmentConfig {
  parallel: number;
  retry: number;
  format: string[];
  tags: string;
  timeout: number;
}

function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.NODE_ENV || 'development';
  
  const configs: Record<string, EnvironmentConfig> = {
    development: {
      parallel: 1,
      retry: 0,
      format: ['progress-bar', '@cucumber/pretty-formatter'],
      tags: 'not @production-only',
      timeout: 60000
    },
    testing: {
      parallel: 2,
      retry: 1,
      format: ['progress-bar', 'json:reports/results.json'],
      tags: 'not @development-only and not @production-only',
      timeout: 30000
    },
    ci: {
      parallel: 4,
      retry: 2,
      format: ['json:reports/ci-results.json', 'junit:reports/junit.xml'],
      tags: 'not @manual and not @development-only',
      timeout: 20000
    },
    production: {
      parallel: 1,
      retry: 0,
      format: ['json:reports/production-health.json'],
      tags: '@health-check or @production-monitoring',
      timeout: 15000
    }
  };
  
  return configs[env] || configs.development;
}

export default getEnvironmentConfig();
```

### 3. Container-Based Strategy

#### Docker Compose for Multiple Environments
```yaml
# docker-compose.test.yml
version: '3.8'

services:
  bdd-tests-dev:
    build: .
    environment:
      - NODE_ENV=development
      - HEADLESS=false
    volumes:
      - ./features:/app/features
      - ./reports:/app/reports
    depends_on:
      - app-dev
  
  bdd-tests-ci:
    build: .
    environment:
      - NODE_ENV=ci
      - HEADLESS=true
      - PARALLEL_WORKERS=4
    volumes:
      - ./reports:/app/reports
    depends_on:
      - app-staging
  
  app-dev:
    image: app:dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
  
  app-staging:
    image: app:staging
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=staging
```

## Environment-Specific Features

### 1. Development Environment Enhancements

#### Live Reload for Feature Files
```typescript
// scripts/dev-watch.ts
import { watch } from 'chokidar';
import { exec } from 'child_process';

const watcher = watch(['features/**/*.feature', 'features/**/*.ts'], {
  persistent: true
});

watcher.on('change', (path) => {
  console.log(`🔄 File changed: ${path}`);
  console.log('🧪 Running affected tests...');
  
  exec('npm run dev:test', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Test execution failed: ${error}`);
      return;
    }
    console.log(stdout);
  });
});

console.log('👀 Watching for changes in features directory...');
```

#### Development Debug Utilities
```typescript
// src/utils/dev-helpers.ts
export class DevHelpers {
  static async pauseForInspection(page: Page, duration: number = 5000): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏸️  Pausing for ${duration}ms for inspection...`);
      await page.waitForTimeout(duration);
    }
  }
  
  static async logPageInfo(page: Page): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      const url = page.url();
      const title = await page.title();
      console.log(`📄 Page Info: ${title} - ${url}`);
    }
  }
  
  static logStepExecution(stepName: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🦶 Executing step: ${stepName}`);
    }
  }
}
```

### 2. CI/CD Environment Optimizations

#### Parallel Test Execution
```typescript
// features/support/ci-optimizations.ts
import { BeforeAll, AfterAll } from '@cucumber/cucumber';

BeforeAll(async function() {
  if (process.env.CI === 'true') {
    // Pre-warm browser instances for faster startup
    console.log('🚀 Pre-warming browser instances for CI...');
    
    // Set aggressive timeouts for CI
    this.defaultTimeout = 20000;
    
    // Configure CI-specific browser options
    this.browserOptions = {
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security'
      ]
    };
  }
});

AfterAll(async function() {
  if (process.env.CI === 'true') {
    // Cleanup CI artifacts
    console.log('🧹 Cleaning up CI artifacts...');
  }
});
```

#### CI Reporting Integration
```typescript
// src/utils/ci-reporter.ts
export class CIReporter {
  static generateTestReport(): void {
    if (process.env.CI === 'true') {
      const results = {
        buildNumber: process.env.BUILD_NUMBER,
        branch: process.env.BRANCH_NAME,
        commit: process.env.COMMIT_SHA,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      };
      
      // Generate CI-specific reports
      console.log('📊 Generating CI test report...');
      // Implementation for CI reporting
    }
  }
}
```

### 3. Production Monitoring Features

#### Health Check Scenarios
```gherkin
# features/health-checks.feature
@health-check @production-monitoring
Feature: Production Health Monitoring
  As a system administrator
  I want to monitor production application health
  So that I can detect issues before they impact users

  @critical
  Scenario: Application responds to health check
    Given the production application is running
    When I check the health endpoint
    Then the application should respond within 2 seconds
    And the health status should be "healthy"

  @critical
  Scenario: User login functionality works
    Given I have valid production credentials
    When I attempt to log in through the UI
    Then the login should succeed within 5 seconds
    And I should be redirected to the dashboard
```

#### Production Alerting
```typescript
// src/utils/production-alerting.ts
export class ProductionAlerting {
  static async notifyFailure(scenario: string, error: Error): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      // Send Slack notification
      await this.sendSlackAlert(scenario, error);
      
      // Trigger PagerDuty alert for critical failures
      if (scenario.includes('@critical')) {
        await this.triggerPagerDutyAlert(scenario, error);
      }
    }
  }
  
  private static async sendSlackAlert(scenario: string, error: Error): Promise<void> {
    // Slack webhook implementation
  }
  
  private static async triggerPagerDutyAlert(scenario: string, error: Error): Promise<void> {
    // PagerDuty API implementation
  }
}
```

## Environment Switching Scripts

### Automated Environment Setup
```powershell
# scripts/setup-environment.ps1
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("development", "testing", "ci", "production")]
    [string]$Environment
)

Write-Host "🔧 Setting up $Environment environment..." -ForegroundColor Green

# Copy environment-specific files
Copy-Item ".env.$Environment" ".env" -Force
Copy-Item "cucumber.$Environment.json" "cucumber.json" -Force

# Install environment-specific dependencies
if ($Environment -eq "development") {
    npm install
    npx playwright install
} elseif ($Environment -eq "ci") {
    npm ci
    npx playwright install --with-deps
}

# Validate environment setup
npm run config:validate

Write-Host "✅ $Environment environment setup complete!" -ForegroundColor Green
```

### Cross-Platform Environment Manager
```typescript
// scripts/environment-manager.ts
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

interface EnvironmentSetup {
  envFile: string;
  configFile: string;
  dependencies: string[];
  validationCommand: string;
}

const environments: Record<string, EnvironmentSetup> = {
  development: {
    envFile: '.env.development',
    configFile: 'cucumber.development.json',
    dependencies: ['npm install', 'npx playwright install'],
    validationCommand: 'npm run dev:test -- --dry-run'
  },
  testing: {
    envFile: '.env.testing',
    configFile: 'cucumber.testing.json',
    dependencies: ['npm ci'],
    validationCommand: 'npm run test:validate'
  },
  ci: {
    envFile: '.env.ci',
    configFile: 'cucumber.ci.json',
    dependencies: ['npm ci', 'npx playwright install --with-deps'],
    validationCommand: 'npm run ci:validate'
  }
};

export async function setupEnvironment(env: string): Promise<void> {
  const setup = environments[env];
  if (!setup) {
    throw new Error(`Unknown environment: ${env}`);
  }
  
  console.log(`🔧 Setting up ${env} environment...`);
  
  // Copy configuration files
  fs.copyFileSync(setup.envFile, '.env');
  fs.copyFileSync(setup.configFile, 'cucumber.json');
  
  // Install dependencies
  for (const dep of setup.dependencies) {
    await executeCommand(dep);
  }
  
  // Validate setup
  await executeCommand(setup.validationCommand);
  
  console.log(`✅ ${env} environment ready!`);
}

function executeCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}
```

## Best Practices Summary

### 1. Environment Isolation
- **Separate configurations** for each environment
- **Independent test data** to avoid conflicts
- **Environment-specific feature flags** for controlled testing

### 2. Configuration Management
- **Version control** all configuration files
- **Environment variables** for sensitive data
- **Validation scripts** to ensure proper setup

### 3. Performance Optimization
- **Parallel execution** in CI/CD environments
- **Headless mode** for faster execution
- **Selective test execution** based on environment

### 4. Monitoring and Alerting
- **Health checks** in production
- **Failure notifications** for critical issues
- **Performance metrics** collection

### 5. Security Considerations
- **Secure credential management** for each environment
- **Network isolation** where appropriate
- **Audit logging** for compliance requirements

## Summary

Environment-specific BDD setups enable:

- **Optimized development experience** with debugging features
- **Reliable testing** with production-like conditions
- **Fast CI/CD pipelines** with parallel execution
- **Production monitoring** with minimal impact
- **Flexible deployment** across different stages

Understanding these patterns helps create robust, scalable BDD testing strategies that adapt to different requirements and constraints across the software development lifecycle.