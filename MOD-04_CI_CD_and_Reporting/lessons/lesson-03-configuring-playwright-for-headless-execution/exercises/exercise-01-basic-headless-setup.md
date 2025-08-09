# Exercise 01: Basic Headless Configuration and Setup

## Overview

This exercise will guide you through setting up and configuring Playwright for headless execution. You'll learn to configure different headless modes, optimize browser settings, and handle common headless-specific challenges.

**Estimated Time:** 45 minutes  
**Difficulty Level:** Intermediate  
**Prerequisites:** Basic Playwright knowledge, understanding of browser automation

## Learning Objectives

By completing this exercise, you will be able to:
- Configure Playwright for optimal headless execution
- Implement different headless browser settings for various scenarios
- Handle headless-specific challenges like viewport management and resource optimization
- Set up proper error handling and logging for headless tests
- Optimize headless test performance

## Exercise Setup

### Step 1: Create Project Structure

Create a new directory for this exercise:

```powershell
# Create project directory
New-Item -ItemType Directory -Path "headless-config-exercise" -Force
Set-Location "headless-config-exercise"

# Initialize npm project
npm init -y

# Install Playwright
npm install -D @playwright/test
npx playwright install
```

### Step 2: Create Base Configuration Files

Create the following files in your project directory:

**playwright.config.ts**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium-headless',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

**tests/utils/headless-helper.ts**
```typescript
import { Page, Browser, BrowserContext } from '@playwright/test';

export class HeadlessHelper {
  // TODO: Implement logging utility
  
  // TODO: Implement screenshot utility
  
  // TODO: Implement viewport management
  
  // TODO: Implement performance monitoring
}
```

## Tasks

### Task 1: Basic Headless Configuration (10 minutes)

Configure Playwright for different headless scenarios. Update your `playwright.config.ts`:

**Requirements:**
1. Create three project configurations:
   - `production-headless`: Optimized for CI/CD environments
   - `development-headless`: Better for local debugging
   - `performance-headless`: Optimized for speed and resource usage

2. Each configuration should have appropriate:
   - Browser launch options
   - Viewport settings
   - Timeout configurations
   - Resource management settings

**Implementation Guidelines:**
```typescript
// Example structure for your projects array:
projects: [
  {
    name: 'production-headless',
    use: {
      ...devices['Desktop Chrome'],
      // TODO: Add production-optimized settings
      headless: true,
      // TODO: Configure appropriate launch options
      // TODO: Set viewport and timeouts
    },
  },
  // TODO: Add development-headless configuration
  // TODO: Add performance-headless configuration
],
```

**Acceptance Criteria:**
- [ ] Three distinct headless configurations created
- [ ] Each configuration has appropriate browser launch options
- [ ] Viewport and timeout settings are optimized for each use case
- [ ] Configuration includes proper resource management settings

### Task 2: Implement Headless Utility Functions (15 minutes)

Complete the `HeadlessHelper` class with essential utilities for headless testing:

**Requirements:**
1. **Logging Utility**: Implement comprehensive logging for headless tests
2. **Screenshot Utility**: Create smart screenshot functionality
3. **Viewport Management**: Handle dynamic viewport changes
4. **Performance Monitoring**: Track test performance metrics

**Implementation Template:**
```typescript
export class HeadlessHelper {
  static async setupLogging(page: Page): Promise<void> {
    // TODO: Implement console message capture
    // TODO: Implement error logging
    // TODO: Implement network request logging
  }
  
  static async takeSmartScreenshot(
    page: Page, 
    name: string, 
    options?: { fullPage?: boolean; highlight?: string[] }
  ): Promise<string> {
    // TODO: Implement intelligent screenshot functionality
    // TODO: Add element highlighting capability
    // TODO: Handle fullPage options
    // TODO: Return screenshot path
  }
  
  static async setOptimalViewport(
    page: Page, 
    scenario: 'mobile' | 'tablet' | 'desktop' | 'large-desktop'
  ): Promise<void> {
    // TODO: Implement viewport configuration for different scenarios
    // TODO: Handle device pixel ratio
    // TODO: Configure appropriate user agent
  }
  
  static async measurePerformance(
    page: Page, 
    action: () => Promise<void>
  ): Promise<{
    duration: number;
    memoryUsage: number;
    networkRequests: number;
  }> {
    // TODO: Implement performance measurement
    // TODO: Track memory usage
    // TODO: Count network requests
    // TODO: Measure action duration
  }
}
```

**Acceptance Criteria:**
- [ ] Logging utility captures all browser events
- [ ] Screenshot utility creates properly named and organized screenshots
- [ ] Viewport management handles different device scenarios
- [ ] Performance monitoring provides accurate metrics

### Task 3: Create Test Cases Using Headless Configuration (15 minutes)

Create comprehensive test cases that demonstrate headless capabilities:

**tests/headless-demo.spec.ts**
```typescript
import { test, expect } from '@playwright/test';
import { HeadlessHelper } from './utils/headless-helper';

test.describe('Headless Configuration Demo', () => {
  
  test('should handle different viewport scenarios', async ({ page }) => {
    // TODO: Navigate to a responsive website
    
    // TODO: Test mobile viewport
    await HeadlessHelper.setOptimalViewport(page, 'mobile');
    // TODO: Take screenshot and verify mobile layout
    
    // TODO: Test desktop viewport  
    await HeadlessHelper.setOptimalViewport(page, 'desktop');
    // TODO: Take screenshot and verify desktop layout
    
    // TODO: Verify responsive behavior
  });
  
  test('should capture performance metrics', async ({ page }) => {
    // TODO: Set up performance monitoring
    
    // TODO: Measure page load performance
    const metrics = await HeadlessHelper.measurePerformance(page, async () => {
      // TODO: Navigate to test page
      // TODO: Wait for critical elements
    });
    
    // TODO: Assert performance thresholds
    expect(metrics.duration).toBeLessThan(5000);
    // TODO: Add more performance assertions
  });
  
  test('should handle complex user interactions', async ({ page }) => {
    // TODO: Navigate to interactive page
    
    // TODO: Set up logging
    await HeadlessHelper.setupLogging(page);
    
    // TODO: Perform complex interaction sequence:
    // - Form filling
    // - File uploads
    // - Modal interactions
    // - Drag and drop
    
    // TODO: Take screenshots at key points
    
    // TODO: Verify interactions completed successfully
  });
  
  test('should manage resources efficiently', async ({ page }) => {
    // TODO: Configure resource blocking for faster execution
    
    // TODO: Navigate to resource-heavy page
    
    // TODO: Measure resource usage
    
    // TODO: Verify resource optimization is working
  });
});
```

**Acceptance Criteria:**
- [ ] Tests demonstrate viewport management capabilities
- [ ] Performance measurement tests provide meaningful metrics
- [ ] Complex interaction tests work reliably in headless mode
- [ ] Resource management tests show optimization benefits

### Task 4: Error Handling and Debugging Setup (5 minutes)

Implement robust error handling and debugging capabilities:

**tests/utils/error-handler.ts**
```typescript
import { Page } from '@playwright/test';
import { HeadlessHelper } from './headless-helper';

export class ErrorHandler {
  static async setupErrorCapture(page: Page): Promise<void> {
    // TODO: Set up global error handlers
    // TODO: Capture unhandled promise rejections
    // TODO: Log JavaScript errors
    // TODO: Capture network failures
  }
  
  static async handleTestFailure(
    page: Page, 
    testName: string, 
    error: Error
  ): Promise<void> {
    // TODO: Take failure screenshot
    // TODO: Capture page state
    // TODO: Log error details
    // TODO: Save debugging artifacts
  }
  
  static async createDebugReport(
    page: Page, 
    testName: string
  ): Promise<{
    screenshot: string;
    pageState: any;
    consoleErrors: string[];
    networkErrors: any[];
  }> {
    // TODO: Generate comprehensive debug report
  }
}
```

**Acceptance Criteria:**
- [ ] Error capture handles both JavaScript and network errors
- [ ] Test failure handler creates useful debugging artifacts
- [ ] Debug report provides comprehensive failure information

## Validation and Testing

### Step 1: Run Your Tests

Execute your headless tests with different configurations:

```powershell
# Run with production headless config
npx playwright test --project=production-headless

# Run with development headless config  
npx playwright test --project=development-headless

# Run with performance headless config
npx playwright test --project=performance-headless

# Run all configurations
npx playwright test
```

### Step 2: Verify Output

Check that your implementation produces:

1. **Screenshots**: Properly organized in test-results directory
2. **Logs**: Comprehensive logging output in console
3. **Performance Metrics**: Measurable performance data
4. **Error Handling**: Proper error capture and reporting

### Step 3: Performance Comparison

Compare the performance of your different configurations:

```powershell
# Measure execution time for each configuration
Measure-Command { npx playwright test --project=production-headless }
Measure-Command { npx playwright test --project=development-headless }  
Measure-Command { npx playwright test --project=performance-headless }
```

## Troubleshooting Common Issues

### Issue 1: Screenshots Not Saving

**Symptoms:**
- Screenshots not appearing in expected location
- Empty or corrupted screenshot files

**Solutions:**
```typescript
// Ensure directory exists before taking screenshot
import { mkdir } from 'fs/promises';

await mkdir('screenshots', { recursive: true });
await page.screenshot({ 
  path: `screenshots/${name}.png`,
  fullPage: true 
});
```

### Issue 2: Viewport Not Applying

**Symptoms:**
- Tests behaving as if viewport changes aren't taking effect
- Responsive layouts not switching properly

**Solutions:**
```typescript
// Set viewport and wait for layout changes
await page.setViewportSize({ width: 375, height: 667 });
await page.waitForTimeout(1000); // Allow layout to settle
await page.waitForLoadState('networkidle');
```

### Issue 3: Performance Measurements Inconsistent

**Symptoms:**
- Highly variable performance metrics
- Unrealistic measurement values

**Solutions:**
```typescript
// Warm up the page and take multiple measurements
await page.goto('about:blank'); // Reset page state
await page.goto(targetUrl);
await page.waitForLoadState('networkidle');

// Take measurement
const startTime = Date.now();
await action();
const duration = Date.now() - startTime;
```

## Submission Requirements

### Required Deliverables

1. **Complete playwright.config.ts** with three headless configurations
2. **Implemented HeadlessHelper class** with all required utilities
3. **Complete test suite** demonstrating headless capabilities
4. **Error handling implementation** with debugging capabilities
5. **README.md** documenting your configuration choices and setup instructions

### Documentation Requirements

Your README.md should include:

```markdown
# Headless Configuration Exercise

## Configuration Overview
- Description of each headless configuration
- Performance comparisons between configurations
- Recommended use cases for each setup

## Utility Functions
- Documentation of HeadlessHelper methods
- Usage examples for each utility function
- Performance characteristics of implemented solutions

## Test Results
- Screenshots of successful test runs
- Performance metrics from different configurations
- Any challenges encountered and solutions implemented

## Setup Instructions
- Steps to reproduce your implementation
- Dependencies and requirements
- Troubleshooting guide for common issues
```

### Evaluation Criteria

Your submission will be evaluated on:

- **Functionality** (40%): All configurations work correctly
- **Performance** (25%): Optimized settings show measurable improvements
- **Code Quality** (20%): Clean, well-structured, and commented code
- **Documentation** (15%): Clear documentation and setup instructions

## Bonus Challenges

### Challenge 1: Advanced Resource Management
Implement intelligent resource blocking that automatically detects and blocks unnecessary resources based on test requirements.

### Challenge 2: Dynamic Configuration
Create a system that automatically selects the optimal headless configuration based on test characteristics and environment.

### Challenge 3: Performance Regression Detection
Implement automated performance regression detection that compares current test runs with historical baselines.

## Next Steps

After completing this exercise:

1. **Review your implementation** against the acceptance criteria
2. **Test your configuration** in different environments (local vs CI)  
3. **Document lessons learned** and best practices discovered
4. **Prepare for Exercise 02** which will focus on advanced debugging techniques

This exercise provides practical experience with headless configuration that you'll use throughout your CI/CD testing career. The configurations and utilities you build here will serve as a foundation for more advanced headless testing scenarios.