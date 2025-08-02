# Exercise 04: Advanced Troubleshooting Lab 🔴

## 🎯 Objective

Master expert-level troubleshooting techniques for complex BDD environment issues. This lab simulates real-world problems and teaches systematic diagnostic approaches.

## 📋 Prerequisites

- **Completed Exercises 01-03** successfully
- **Working multi-environment BDD setup**
- **Advanced understanding of TypeScript, Playwright, and Cucumber**
- **Experience with debugging tools and techniques**

## 🔬 Lab Scenarios

### Scenario 1: Intermittent Test Failures (Expert Level)

#### Problem Description
Your BDD tests pass locally but fail intermittently in CI with cryptic errors:
```
TypeError: Cannot read property 'click' of null
Error: Page closed during navigation
TimeoutError: Timeout 30000ms exceeded
```

#### Setup the Problem
Create `features/flaky-test.feature`:
```gherkin
Feature: Flaky Test Simulation
  Scenario: Intermittent failure simulation
    Given I navigate to a dynamic page
    When I interact with loading elements
    Then the operation should complete successfully
```

Create problematic step definitions in `features/step_definitions/flaky.steps.ts`:
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { EnvironmentAwareWorld } from '@support/world';

Given('I navigate to a dynamic page', async function (this: EnvironmentAwareWorld) {
  await this.page.goto(this.getEnvironmentConfig().baseUrl);
  // Problematic: No wait for page readiness
});

When('I interact with loading elements', async function (this: EnvironmentAwareWorld) {
  // Problematic: Race condition with dynamic content
  const button = this.page.locator('#dynamic-button');
  await button.click(); // May fail if element not ready
});

Then('the operation should complete successfully', async function (this: EnvironmentAwareWorld) {
  // Problematic: No proper wait conditions
  const result = this.page.locator('#result');
  expect(await result.textContent()).toBe('Success');
});
```

#### Diagnostic Tasks

**Task 1.1: Root Cause Analysis (20 minutes)**

Create diagnostic script `scripts/diagnose-flaky-tests.ts`:
```typescript
import { chromium, Browser, Page } from 'playwright';

interface DiagnosticResult {
  scenario: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  solution: string;
  codeExample?: string;
}

class FlakyTestDiagnostic {
  private results: DiagnosticResult[] = [];
  
  async diagnose(): Promise<DiagnosticResult[]> {
    console.log('🔍 Starting flaky test diagnostic...\n');
    
    await this.checkTimingIssues();
    await this.checkRaceConditions();
    await this.checkNetworkStability();
    await this.checkElementStability();
    
    return this.results;
  }
  
  private async checkTimingIssues(): Promise<void> {
    console.log('⏱️  Checking timing issues...');
    
    // Simulate timing diagnostic
    this.results.push({
      scenario: 'Page Navigation',
      issue: 'Navigation without proper wait conditions',
      severity: 'high',
      solution: 'Implement proper wait strategies',
      codeExample: `
// ❌ Problematic
await this.page.goto(url);

// ✅ Fixed
await this.page.goto(url, { waitUntil: 'networkidle' });
await this.page.waitForLoadState('domcontentloaded');`
    });
  }
  
  private async checkRaceConditions(): Promise<void> {
    console.log('🏃 Checking race conditions...');
    
    this.results.push({
      scenario: 'Dynamic Element Interaction',
      issue: 'Clicking elements before they are interactive',
      severity: 'high',
      solution: 'Use web-first assertions and proper waits',
      codeExample: `
// ❌ Problematic
const button = this.page.locator('#dynamic-button');
await button.click();

// ✅ Fixed
const button = this.page.locator('#dynamic-button');
await button.waitFor({ state: 'visible' });
await expect(button).toBeEnabled();
await button.click();`
    });
  }
  
  private async checkNetworkStability(): Promise<void> {
    console.log('🌐 Checking network stability...');
    
    this.results.push({
      scenario: 'API Dependencies',
      issue: 'Tests failing due to network latency or API unavailability',
      severity: 'medium',
      solution: 'Implement network resilience patterns',
      codeExample: `
// ✅ Network resilience
await this.page.route('**/api/**', async (route) => {
  const response = await route.fetch();
  if (!response.ok()) {
    // Retry logic or fallback
    await new Promise(resolve => setTimeout(resolve, 1000));
    await route.continue();
  } else {
    await route.fulfill({ response });
  }
});`
    });
  }
  
  private async checkElementStability(): Promise<void> {
    console.log('🎯 Checking element stability...');
    
    this.results.push({
      scenario: 'Element State Verification',
      issue: 'Assertions on elements that may not be stable',
      severity: 'medium',
      solution: 'Use retry-enabled assertions and proper locator strategies',
      codeExample: `
// ❌ Problematic
const result = this.page.locator('#result');
expect(await result.textContent()).toBe('Success');

// ✅ Fixed
const result = this.page.locator('#result');
await expect(result).toHaveText('Success', { timeout: 10000 });`
    });
  }
}

// Enhanced diagnostic runner
async function runDiagnostic(): Promise<void> {
  const diagnostic = new FlakyTestDiagnostic();
  const results = await diagnostic.diagnose();
  
  console.log('\n📋 Diagnostic Results:\n');
  
  results.forEach((result, index) => {
    const severityIcon = result.severity === 'high' ? '🔴' : 
                        result.severity === 'medium' ? '🟡' : '🟢';
    
    console.log(`${severityIcon} Issue ${index + 1}: ${result.scenario}`);
    console.log(`   Problem: ${result.issue}`);
    console.log(`   Solution: ${result.solution}`);
    
    if (result.codeExample) {
      console.log(`   Code Example:${result.codeExample}`);
    }
    
    console.log('');
  });
  
  console.log('🎯 Recommendation: Address high-severity issues first');
}

runDiagnostic().catch(console.error);
```

**Task 1.2: Implement Robust Solutions (25 minutes)**

Create fixed step definitions in `features/step_definitions/robust.steps.ts`:
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { EnvironmentAwareWorld } from '@support/world';

// Robust navigation with comprehensive waits
Given('I navigate to a dynamic page', async function (this: EnvironmentAwareWorld) {
  const config = this.getEnvironmentConfig();
  
  // Multiple wait strategies for robustness
  await this.page.goto(config.baseUrl, { 
    waitUntil: 'networkidle',
    timeout: config.timeouts.default 
  });
  
  // Wait for critical elements to be present
  await this.page.waitForSelector('body', { state: 'visible' });
  
  // Optional: Wait for custom app readiness indicator
  try {
    await this.page.waitForFunction(() => {
      return (window as any).appReady === true;
    }, { timeout: 5000 });
  } catch {
    console.log('⚠️  App readiness indicator not found, proceeding');
  }
});

// Robust element interaction with multiple safeguards
When('I interact with loading elements', async function (this: EnvironmentAwareWorld) {
  const button = this.page.locator('#dynamic-button');
  
  // Comprehensive element readiness check
  await expect(button).toBeVisible({ timeout: 10000 });
  await expect(button).toBeEnabled({ timeout: 5000 });
  
  // Scroll element into view if needed
  await button.scrollIntoViewIfNeeded();
  
  // Wait for any animations to complete
  await this.page.waitForTimeout(500);
  
  // Retry clicking with exponential backoff
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      await button.click({ timeout: 5000 });
      break;
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error(`Failed to click button after ${maxAttempts} attempts: ${error}`);
      }
      
      console.log(`Click attempt ${attempts} failed, retrying...`);
      await this.page.waitForTimeout(1000 * attempts); // Exponential backoff
    }
  }
});

// Robust result verification with retry logic
Then('the operation should complete successfully', async function (this: EnvironmentAwareWorld) {
  const result = this.page.locator('#result');
  
  // Use web-first assertion with extended timeout
  await expect(result).toBeVisible({ timeout: 10000 });
  await expect(result).toHaveText('Success', { timeout: 15000 });
  
  // Additional verification: Check for error states
  const errorIndicator = this.page.locator('.error, .failure, [data-testid="error"]');
  await expect(errorIndicator).toHaveCount(0);
  
  // Performance check: Ensure operation completed within reasonable time
  const operationTime = Date.now() - (this.testData.startTime || Date.now());
  expect(operationTime).toBeLessThan(30000); // 30 second max
});
```

### Scenario 2: Configuration Conflicts (Expert Level)

#### Problem Description
Multiple configuration files are conflicting, causing inconsistent behavior across environments.

**Task 2.1: Configuration Validation System (20 minutes)**

Create `scripts/validate-configuration.ts`:
```typescript
import * as fs from 'fs';
import * as path from 'path';

interface ConfigValidation {
  file: string;
  issues: string[];
  suggestions: string[];
}

class ConfigurationValidator {
  private validations: ConfigValidation[] = [];
  
  async validateAll(): Promise<void> {
    console.log('🔧 Validating configuration files...\n');
    
    await this.validateTsConfig();
    await this.validateCucumberConfigs();
    await this.validateEnvironmentFiles();
    await this.validatePackageJson();
    
    this.reportResults();
  }
  
  private async validateTsConfig(): Promise<void> {
    const tsConfigPath = 'tsconfig.json';
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!fs.existsSync(tsConfigPath)) {
      issues.push('tsconfig.json missing');
      suggestions.push('Create tsconfig.json with BDD-specific configuration');
      return;
    }
    
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    
    // Check essential compiler options
    const requiredOptions = {
      'target': 'ES2020',
      'module': 'commonjs',
      'esModuleInterop': true,
      'allowSyntheticDefaultImports': true,
      'strict': true
    };
    
    Object.entries(requiredOptions).forEach(([key, expectedValue]) => {
      const actualValue = tsConfig.compilerOptions?.[key];
      if (actualValue !== expectedValue) {
        issues.push(`${key} should be "${expectedValue}", got "${actualValue}"`);
        suggestions.push(`Set "compilerOptions.${key}": "${expectedValue}"`);
      }
    });
    
    // Check path mapping
    if (!tsConfig.compilerOptions?.paths?.['@*']) {
      issues.push('Path mapping not configured for clean imports');
      suggestions.push('Add path mapping: "@*": ["src/*"]');
    }
    
    this.validations.push({
      file: tsConfigPath,
      issues,
      suggestions
    });
  }
  
  private async validateCucumberConfigs(): Promise<void> {
    const environments = ['development', 'testing', 'ci'];
    
    environments.forEach(env => {
      const configPath = `config/cucumber.${env}.json`;
      const issues: string[] = [];
      const suggestions: string[] = [];
      
      if (!fs.existsSync(configPath)) {
        issues.push(`Cucumber config missing for ${env} environment`);
        suggestions.push(`Create ${configPath} with environment-specific settings`);
        return;
      }
      
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      // Validate required sections
      if (!config.default) {
        issues.push('Missing default configuration section');
        suggestions.push('Add "default" configuration section');
      }
      
      // Check parallel settings
      const parallel = config.default?.parallel;
      if (env === 'ci' && (!parallel || parallel < 2)) {
        issues.push('CI should use parallel execution for performance');
        suggestions.push('Set "parallel": 4 for CI environment');
      }
      
      // Check retry settings
      const retry = config.default?.retry;
      if (env === 'development' && retry > 0) {
        issues.push('Development environment should not retry failed tests');
        suggestions.push('Set "retry": 0 for development');
      }
      
      this.validations.push({
        file: configPath,
        issues,
        suggestions
      });
    });
  }
  
  private async validateEnvironmentFiles(): Promise<void> {
    const environments = ['development', 'testing', 'ci'];
    const requiredVars = ['BASE_URL', 'BROWSER', 'TIMEOUT'];
    
    environments.forEach(env => {
      const envPath = `.env.${env}`;
      const issues: string[] = [];
      const suggestions: string[] = [];
      
      if (!fs.existsSync(envPath)) {
        issues.push(`Environment file missing for ${env}`);
        suggestions.push(`Create ${envPath} with required variables`);
        return;
      }
      
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      requiredVars.forEach(varName => {
        if (!envContent.includes(`${varName}=`)) {
          issues.push(`Missing required variable: ${varName}`);
          suggestions.push(`Add ${varName}=<value> to ${envPath}`);
        }
      });
      
      this.validations.push({
        file: envPath,
        issues,
        suggestions
      });
    });
  }
  
  private async validatePackageJson(): Promise<void> {
    const packagePath = 'package.json';
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!fs.existsSync(packagePath)) {
      issues.push('package.json missing');
      return;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check essential scripts
    const requiredScripts = [
      'test',
      'test:dev',
      'test:ci',
      'env:validate',
      'typecheck'
    ];
    
    requiredScripts.forEach(script => {
      if (!packageJson.scripts?.[script]) {
        issues.push(`Missing script: ${script}`);
        suggestions.push(`Add "${script}" script to package.json`);
      }
    });
    
    this.validations.push({
      file: packagePath,
      issues,
      suggestions
    });
  }
  
  private reportResults(): void {
    console.log('📋 Configuration Validation Results:\n');
    
    let totalIssues = 0;
    
    this.validations.forEach(validation => {
      const status = validation.issues.length === 0 ? '✅' : '❌';
      console.log(`${status} ${validation.file}`);
      
      if (validation.issues.length > 0) {
        totalIssues += validation.issues.length;
        validation.issues.forEach(issue => {
          console.log(`   🔸 ${issue}`);
        });
        
        validation.suggestions.forEach(suggestion => {
          console.log(`   💡 ${suggestion}`);
        });
        
        console.log('');
      }
    });
    
    console.log(`\n📊 Total issues found: ${totalIssues}`);
    
    if (totalIssues === 0) {
      console.log('🎉 All configurations are valid!');
    } else {
      console.log('⚠️  Please fix the issues above before proceeding');
      process.exit(1);
    }
  }
}

const validator = new ConfigurationValidator();
validator.validateAll().catch(console.error);
```

### Scenario 3: Memory and Performance Issues (Expert Level)

#### Problem Description
Tests are consuming excessive memory and failing with "out of memory" errors in CI.

**Task 3.1: Memory Diagnostic Tool (25 minutes)**

Create `scripts/memory-diagnostics.ts`:
```typescript
import { chromium, Browser, BrowserContext, Page } from 'playwright';

interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
}

class MemoryDiagnostic {
  private snapshots: MemorySnapshot[] = [];
  private browser?: Browser;
  private contexts: BrowserContext[] = [];
  private pages: Page[] = [];
  
  async diagnose(): Promise<void> {
    console.log('🧠 Starting memory diagnostic...\n');
    
    await this.baselineMemory();
    await this.testBrowserMemory();
    await this.testContextMemory();
    await this.testPageMemory();
    await this.generateReport();
  }
  
  private takeSnapshot(label: string): void {
    const usage = process.memoryUsage();
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      arrayBuffers: usage.arrayBuffers
    };
    
    this.snapshots.push(snapshot);
    console.log(`📸 ${label}: ${this.formatBytes(snapshot.heapUsed)} heap`);
  }
  
  private async baselineMemory(): Promise<void> {
    this.takeSnapshot('Baseline (before browser launch)');
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      this.takeSnapshot('After garbage collection');
    }
  }
  
  private async testBrowserMemory(): Promise<void> {
    console.log('\n🌐 Testing browser memory usage...');
    
    this.browser = await chromium.launch({ headless: true });
    this.takeSnapshot('After browser launch');
    
    // Test multiple browser instances (memory leak simulation)
    const browsers: Browser[] = [];
    for (let i = 0; i < 3; i++) {
      browsers.push(await chromium.launch({ headless: true }));
      this.takeSnapshot(`After launching browser ${i + 2}`);
    }
    
    // Clean up browsers
    for (const browser of browsers) {
      await browser.close();
    }
    this.takeSnapshot('After closing extra browsers');
  }
  
  private async testContextMemory(): Promise<void> {
    console.log('\n🏠 Testing context memory usage...');
    
    if (!this.browser) return;
    
    // Create multiple contexts
    for (let i = 0; i < 5; i++) {
      const context = await this.browser.newContext();
      this.contexts.push(context);
      this.takeSnapshot(`After creating context ${i + 1}`);
    }
    
    // Clean up contexts
    for (const context of this.contexts) {
      await context.close();
    }
    this.contexts = [];
    this.takeSnapshot('After closing all contexts');
  }
  
  private async testPageMemory(): Promise<void> {
    console.log('\n📄 Testing page memory usage...');
    
    if (!this.browser) return;
    
    const context = await this.browser.newContext();
    
    // Create multiple pages
    for (let i = 0; i < 10; i++) {
      const page = await context.newPage();
      this.pages.push(page);
      
      // Navigate to a heavy page
      await page.goto('data:text/html,<html><body><script>const arr = new Array(1000000).fill("memory test");</script></body></html>');
      
      this.takeSnapshot(`After creating page ${i + 1}`);
    }
    
    // Clean up pages
    for (const page of this.pages) {
      await page.close();
    }
    this.pages = [];
    await context.close();
    
    this.takeSnapshot('After closing all pages');
  }
  
  private async generateReport(): Promise<void> {
    console.log('\n📊 Memory Usage Report:\n');
    
    const baseline = this.snapshots[0];
    const peak = this.snapshots.reduce((max, snap) => 
      snap.heapUsed > max.heapUsed ? snap : max
    );
    
    console.log(`📈 Peak memory usage: ${this.formatBytes(peak.heapUsed)}`);
    console.log(`📊 Memory increase: ${this.formatBytes(peak.heapUsed - baseline.heapUsed)}`);
    console.log(`📉 Final memory: ${this.formatBytes(this.snapshots[this.snapshots.length - 1].heapUsed)}`);
    
    // Identify memory leaks
    const finalMemory = this.snapshots[this.snapshots.length - 1].heapUsed;
    const memoryLeak = finalMemory > baseline.heapUsed * 1.5;
    
    if (memoryLeak) {
      console.log('\n⚠️  Potential memory leak detected!');
      console.log('💡 Recommendations:');
      console.log('   - Ensure all browsers, contexts, and pages are properly closed');
      console.log('   - Use beforeEach/afterEach hooks for cleanup');
      console.log('   - Implement resource pooling for heavy operations');
      console.log('   - Consider running tests in smaller batches');
    } else {
      console.log('\n✅ Memory usage appears normal');
    }
    
    // Cleanup
    if (this.browser) {
      await this.browser.close();
    }
  }
  
  private formatBytes(bytes: number): string {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  }
}

// Memory-efficient test example
console.log('🔧 Memory-Efficient Test Pattern Example:\n');
console.log(`
// ❌ Memory-inefficient pattern
let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await chromium.launch();
  page = await browser.newPage(); // Shared page causes issues
});

// ✅ Memory-efficient pattern
let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch();
});

beforeEach(async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  // Attach to test context
});

afterEach(async () => {
  // Close page and context after each test
  await context.close();
});

afterAll(async () => {
  await browser.close();
});
`);

const diagnostic = new MemoryDiagnostic();
diagnostic.diagnose().catch(console.error);
```

### Scenario 4: Complex Debugging Challenge (Expert Level)

#### Problem Description
A complex test scenario with multiple interacting systems is failing unpredictably.

**Task 4.1: Advanced Debugging Setup (30 minutes)**

Create `features/support/debug-hooks.ts`:
```typescript
import { Before, After, Status } from '@cucumber/cucumber';
import { EnvironmentAwareWorld } from './world';
import * as fs from 'fs';
import * as path from 'path';

// Enhanced debugging hooks
Before({ tags: '@debug' }, async function (this: EnvironmentAwareWorld) {
  console.log(`🐛 Debug mode enabled for: ${this.pickle?.name}`);
  
  // Enable detailed logging
  this.page.on('console', msg => {
    console.log(`🖥️  Console ${msg.type()}: ${msg.text()}`);
  });
  
  this.page.on('pageerror', error => {
    console.error(`💥 Page error: ${error.message}`);
  });
  
  this.page.on('requestfailed', request => {
    console.error(`🌐 Request failed: ${request.url()} - ${request.failure()?.errorText}`);
  });
  
  // Start tracing for debugging
  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
  });
});

After({ tags: '@debug' }, async function (this: EnvironmentAwareWorld, scenario) {
  const scenarioName = scenario.pickle?.name?.replace(/\s+/g, '-') || 'unknown';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const debugDir = `debug-output/${timestamp}-${scenarioName}`;
  
  // Ensure debug directory exists
  fs.mkdirSync(debugDir, { recursive: true });
  
  // Stop tracing and save
  await this.context.tracing.stop({ 
    path: path.join(debugDir, 'trace.zip') 
  });
  
  // Take final screenshot
  await this.page.screenshot({ 
    path: path.join(debugDir, 'final-state.png'),
    fullPage: true 
  });
  
  // Save page HTML
  const html = await this.page.content();
  fs.writeFileSync(path.join(debugDir, 'page-source.html'), html);
  
  // Save network logs if available
  const networkLogs = this.testData.networkRequests || [];
  fs.writeFileSync(
    path.join(debugDir, 'network-logs.json'), 
    JSON.stringify(networkLogs, null, 2)
  );
  
  console.log(`🗂️  Debug artifacts saved to: ${debugDir}`);
});

// Network request tracking
Before(async function (this: EnvironmentAwareWorld) {
  this.testData.networkRequests = [];
  
  this.page.on('request', request => {
    this.testData.networkRequests.push({
      url: request.url(),
      method: request.method(),
      timestamp: Date.now(),
      headers: request.headers()
    });
  });
  
  this.page.on('response', response => {
    const requests = this.testData.networkRequests;
    const matchingRequest = requests.find(req => req.url === response.url());
    
    if (matchingRequest) {
      matchingRequest.status = response.status();
      matchingRequest.responseTime = Date.now() - matchingRequest.timestamp;
    }
  });
});
```

Create `features/complex-debug.feature`:
```gherkin
@debug
Feature: Complex System Integration
  As a QA engineer
  I need to debug complex multi-system interactions
  So that I can identify root causes of failures

  Background:
    Given the system is in a known state
    And all external dependencies are available

  @flaky @debug
  Scenario: Multi-step user workflow with API interactions
    Given I am logged in as a premium user
    When I initiate a complex business process
    And the system processes multiple API calls
    And I interact with dynamic UI elements
    Then the workflow should complete successfully
    And all systems should be in consistent state
    And the user should receive appropriate feedback

  @performance @debug
  Scenario: System performance under load
    Given the system is handling background processes
    When I perform resource-intensive operations
    Then the system should remain responsive
    And performance metrics should be within limits
```

## ✅ Validation

### Complete Diagnostic Checklist

- [ ] **Flaky Test Analysis**: Root cause identified and robust solutions implemented
- [ ] **Configuration Validation**: All config conflicts resolved
- [ ] **Memory Diagnostics**: Memory usage patterns analyzed and optimized
- [ ] **Advanced Debugging**: Comprehensive debugging setup functional
- [ ] **Network Monitoring**: Request/response tracking working
- [ ] **Error Handling**: Proper error capture and reporting
- [ ] **Performance Monitoring**: Resource usage tracking implemented
- [ ] **Artifact Generation**: Debug artifacts properly saved

### Run Complete Diagnostic Suite

```powershell
# Memory diagnostic
npm run diagnostic:memory

# Configuration validation
npm run diagnostic:config

# Flaky test analysis
npm run diagnostic:flaky

# Run debug test
npm test -- --tags "@debug"

# Validate all fixes
npm run test:validate-fixes
```

## 🔧 Troubleshooting Solutions

### Advanced Patterns

**Pattern 1: Retry with Exponential Backoff**
```typescript
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('This should never be reached');
}
```

**Pattern 2: Circuit Breaker**
```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure(): void {
    this.failures++;
    this.lastFailTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}
```

## 🎓 Expert Learning Points

### Systematic Troubleshooting Approach

1. **Symptom Collection**: Gather all error messages, logs, and failure patterns
2. **Environment Analysis**: Check differences between working and failing environments
3. **Timing Analysis**: Identify race conditions and timing-dependent failures
4. **Resource Monitoring**: Track memory, CPU, and network resource usage
5. **Dependency Mapping**: Understand all system dependencies and interaction points
6. **Isolation Testing**: Test components in isolation to narrow down issues
7. **Historical Analysis**: Look for patterns in failure history

### Professional Debugging Techniques

- **Structured Logging**: Implement comprehensive logging with correlation IDs
- **Distributed Tracing**: Track requests across multiple systems
- **Health Checks**: Implement proper health monitoring for all dependencies
- **Graceful Degradation**: Design systems to fail gracefully
- **Observability**: Build in metrics, logging, and tracing from the start

## 📊 Expert Assessment

Rate your troubleshooting expertise (1-5 scale):

- [ ] Systematic diagnostic approach
- [ ] Advanced debugging tool usage
- [ ] Memory and performance optimization
- [ ] Complex system integration debugging
- [ ] Proactive monitoring implementation
- [ ] Root cause analysis skills
- [ ] Solution architecture for reliability
- [ ] Team knowledge sharing

**Expert Level Threshold**: 32/40 (80%)

## 🏆 Mastery Achieved

Upon completing this advanced troubleshooting lab, you have demonstrated:

- **Expert Diagnostic Skills**: Ability to systematically diagnose complex issues
- **Advanced Tool Usage**: Proficiency with debugging and monitoring tools
- **Architectural Thinking**: Understanding of system reliability patterns
- **Proactive Problem Solving**: Implementing preventive measures
- **Professional Practices**: Following industry-standard troubleshooting approaches

You are now equipped to handle the most challenging BDD environment issues in production systems! 🎉