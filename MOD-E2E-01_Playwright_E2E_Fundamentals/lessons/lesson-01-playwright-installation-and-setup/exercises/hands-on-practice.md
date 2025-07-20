# Lesson 01: Hands-On Practice Exercises

## 🎯 Exercise Overview

These hands-on exercises will help you practice the installation and setup concepts covered in this lesson. Complete each exercise in order, as they build upon each other.

## 📋 Prerequisites

- Windows 10/11 system
- Administrative access (for some installations)
- Internet connection for downloading packages
- Text editor or VS Code

## 🏋️ Exercise 1: Environment Setup and Verification

### **Objective**
Verify your development environment is properly configured for Playwright development.

### **Tasks**

#### **Task 1.1: System Requirements Check**
Create a PowerShell script to verify your system meets all requirements.

Create [`check-system.ps1`](check-system.ps1:1):
```powershell
# System Requirements Checker for Playwright
Write-Host "=== Playwright System Requirements Check ===" -ForegroundColor Green

# Check Node.js
Write-Host "`nChecking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
    
    # Check if version is 18+
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -ge 18) {
        Write-Host "✓ Node.js version is compatible (18+)" -ForegroundColor Green
    } else {
        Write-Host "✗ Node.js version is too old. Please upgrade to 18+" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
}

# Check npm
Write-Host "`nChecking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
}

# Check PowerShell execution policy
Write-Host "`nChecking PowerShell execution policy..." -ForegroundColor Yellow
$executionPolicy = Get-ExecutionPolicy
Write-Host "Current execution policy: $executionPolicy" -ForegroundColor Cyan

if ($executionPolicy -eq "Restricted") {
    Write-Host "⚠ Execution policy is restricted. You may need to change it." -ForegroundColor Yellow
    Write-Host "Run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Cyan
} else {
    Write-Host "✓ Execution policy allows script execution" -ForegroundColor Green
}

# Check Git (optional)
Write-Host "`nChecking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git version: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ Git not found (optional but recommended)" -ForegroundColor Yellow
}

# Check available disk space
Write-Host "`nChecking disk space..." -ForegroundColor Yellow
$disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
$freeSpaceGB = [math]::Round($disk.FreeSpace / 1GB, 2)
Write-Host "Available disk space: $freeSpaceGB GB" -ForegroundColor Cyan

if ($freeSpaceGB -gt 5) {
    Write-Host "✓ Sufficient disk space available" -ForegroundColor Green
} else {
    Write-Host "⚠ Low disk space. Playwright needs ~2GB for browsers" -ForegroundColor Yellow
}

Write-Host "`n=== System Check Complete ===" -ForegroundColor Green
```

**Run the script:**
```powershell
# Make script executable and run
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\check-system.ps1
```

#### **Task 1.2: Create Development Directory Structure**
Set up a organized directory structure for your Playwright projects.

```powershell
# Create main development directory
mkdir C:\Dev\Playwright-Projects
cd C:\Dev\Playwright-Projects

# Create subdirectories for different types of projects
mkdir Learning-Projects
mkdir Practice-Projects
mkdir Portfolio-Projects

# Navigate to learning projects
cd Learning-Projects

# Verify structure
tree /F
```

**Expected Output:**
```
C:\DEV\PLAYWRIGHT-PROJECTS
├───Learning-Projects
├───Practice-Projects
└───Portfolio-Projects
```

### **Deliverables**
- [ ] System requirements verification script created and executed
- [ ] Development directory structure created
- [ ] Screenshot of successful system check
- [ ] Documentation of any issues encountered and how they were resolved

---

## 🏋️ Exercise 2: Playwright Project Creation

### **Objective**
Create your first Playwright project using both automated and manual installation methods.

### **Tasks**

#### **Task 2.1: Quick Start Installation**
Use the automated installation method to create a project.

```powershell
# Navigate to learning projects directory
cd C:\Dev\Playwright-Projects\Learning-Projects

# Create first project using quick start
mkdir playwright-quickstart
cd playwright-quickstart

# Initialize Playwright project
npm init playwright@latest
```

**Interactive Setup Choices:**
- TypeScript or JavaScript? → **TypeScript**
- Where to put your end-to-end tests? → **tests**
- Add a GitHub Actions workflow? → **Yes**
- Install Playwright browsers? → **Yes**

#### **Task 2.2: Manual Installation Project**
Create a second project using manual installation for comparison.

```powershell
# Create second project
cd C:\Dev\Playwright-Projects\Learning-Projects
mkdir playwright-manual
cd playwright-manual

# Initialize Node.js project
npm init -y

# Install Playwright manually
npm install -D @playwright/test
npm install -D typescript @types/node

# Install browsers
npx playwright install
```

Create the configuration files manually:

**Create [`tsconfig.json`](tsconfig.json:1):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["tests/**/*", "playwright.config.ts"],
  "exclude": ["node_modules"]
}
```

**Create [`playwright.config.ts`](playwright.config.ts:1):**
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
    },
  ],
});
```

#### **Task 2.3: Project Structure Comparison**
Compare the structures of both projects and document the differences.

```powershell
# Compare project structures
cd C:\Dev\Playwright-Projects\Learning-Projects

# Quick start project structure
Write-Host "=== Quick Start Project Structure ===" -ForegroundColor Green
cd playwright-quickstart
tree /F

Write-Host "`n=== Manual Project Structure ===" -ForegroundColor Green
cd ..\playwright-manual
tree /F
```

### **Deliverables**
- [ ] Two Playwright projects created (quickstart and manual)
- [ ] Both projects have proper TypeScript configuration
- [ ] Browser binaries installed successfully
- [ ] Comparison document highlighting differences between installation methods
- [ ] Screenshots of successful installations

---

## 🏋️ Exercise 3: First Test Creation and Execution

### **Objective**
Create and run your first E2E and API tests to verify the installation.

### **Tasks**

#### **Task 3.1: Create Basic E2E Test**
Create a comprehensive E2E test that demonstrates various Playwright capabilities.

Create [`tests/e2e/installation-verification.spec.ts`](tests/e2e/installation-verification.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';

test.describe('Installation Verification - E2E Tests', () => {
  test('should verify Playwright website functionality', async ({ page }) => {
    // Navigate to Playwright website
    await page.goto('https://playwright.dev/');
    
    // Verify page loads correctly
    await expect(page).toHaveTitle(/Playwright/);
    
    // Check main heading
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
    
    // Verify navigation menu
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();
    
    // Check for key navigation links
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
    
    // Test search functionality
    const searchButton = page.getByRole('button', { name: /search/i });
    if (await searchButton.isVisible()) {
      await searchButton.click();
      
      // Wait for search modal/input
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toBeVisible();
      
      // Type search query
      await searchInput.fill('installation');
      await page.keyboard.press('Enter');
      
      // Verify search results appear
      await expect(page.getByText(/installation/i)).toBeVisible();
    }
    
    // Take screenshot for verification
    await page.screenshot({ 
      path: 'test-results/playwright-website-verification.png',
      fullPage: true 
    });
  });

  test('should test different browser capabilities', async ({ page, browserName }) => {
    await page.goto('https://whatsmybrowser.org/');
    
    // Verify page loads
    await expect(page).toHaveTitle(/What's My Browser/);
    
    // Check browser detection
    const browserInfo = page.locator('.detected-browser');
    await expect(browserInfo).toBeVisible();
    
    // Log browser information
    const browserText = await browserInfo.textContent();
    console.log(`Running on ${browserName}: ${browserText}`);
    
    // Take browser-specific screenshot
    await page.screenshot({ 
      path: `test-results/browser-${browserName}-verification.png` 
    });
  });

  test('should handle form interactions', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Verify form elements
    const usernameInput = page.getByLabel('Username');
    const passwordInput = page.getByLabel('Password');
    const loginButton = page.getByRole('button', { name: 'Login' });
    
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    // Test form interaction
    await usernameInput.fill('tomsmith');
    await passwordInput.fill('SuperSecretPassword!');
    await loginButton.click();
    
    // Verify successful login
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
    
    // Verify logout functionality
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByText('You logged out of the secure area!')).toBeVisible();
  });
});
```

#### **Task 3.2: Create Basic API Test**
Create API tests to verify the request fixture functionality.

Create [`tests/api/installation-verification.spec.ts`](tests/api/installation-verification.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';

test.describe('Installation Verification - API Tests', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('should verify GET request functionality', async ({ request }) => {
    // Test basic GET request
    const response = await request.get(`${baseURL}/posts/1`);
    
    // Verify response status
    expect(response.status()).toBe(200);
    
    // Verify response headers
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
    
    // Parse and verify response data
    const post = await response.json();
    expect(post).toHaveProperty('id', 1);
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('userId');
    
    // Log response for verification
    console.log('GET Response:', JSON.stringify(post, null, 2));
  });

  test('should verify POST request functionality', async ({ request }) => {
    // Prepare test data
    const newPost = {
      title: 'Installation Verification Post',
      body: 'This post verifies that POST requests work correctly.',
      userId: 1
    };

    // Make POST request
    const response = await request.post(`${baseURL}/posts`, {
      data: newPost,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Verify response status
    expect(response.status()).toBe(201);
    
    // Parse and verify response data
    const createdPost = await response.json();
    expect(createdPost).toHaveProperty('id');
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    
    // Log response for verification
    console.log('POST Response:', JSON.stringify(createdPost, null, 2));
  });

  test('should verify error handling', async ({ request }) => {
    // Test 404 error
    const response = await request.get(`${baseURL}/posts/999999`);
    expect(response.status()).toBe(404);
    
    // Test invalid endpoint
    const invalidResponse = await request.get(`${baseURL}/invalid-endpoint`);
    expect(invalidResponse.status()).toBe(404);
  });

  test('should verify request with query parameters', async ({ request }) => {
    // Test with query parameters
    const response = await request.get(`${baseURL}/posts`, {
      params: {
        userId: 1,
        _limit: 3
      }
    });
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeLessThanOrEqual(3);
    
    // Verify all posts belong to userId 1
    posts.forEach(post => {
      expect(post.userId).toBe(1);
    });
  });

  test('should verify different HTTP methods', async ({ request }) => {
    const postId = 1;
    
    // GET
    const getResponse = await request.get(`${baseURL}/posts/${postId}`);
    expect(getResponse.status()).toBe(200);
    
    // PUT
    const putData = {
      id: postId,
      title: 'Updated Title',
      body: 'Updated Body',
      userId: 1
    };
    const putResponse = await request.put(`${baseURL}/posts/${postId}`, {
      data: putData
    });
    expect(putResponse.status()).toBe(200);
    
    // PATCH
    const patchData = { title: 'Patched Title' };
    const patchResponse = await request.patch(`${baseURL}/posts/${postId}`, {
      data: patchData
    });
    expect(patchResponse.status()).toBe(200);
    
    // DELETE
    const deleteResponse = await request.delete(`${baseURL}/posts/${postId}`);
    expect(deleteResponse.status()).toBe(200);
  });
});
```

#### **Task 3.3: Run Tests and Analyze Results**
Execute the tests and analyze the results.

```powershell
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run only E2E tests
npx playwright test tests/e2e

# Run only API tests
npx playwright test tests/api

# Run tests in specific browser
npx playwright test --project=chromium

# Generate and view report
npx playwright show-report
```

#### **Task 3.4: Create Test Execution Script**
Create a PowerShell script to run different test scenarios.

Create [`run-tests.ps1`](run-tests.ps1:1):
```powershell
# Playwright Test Execution Script
param(
    [string]$TestType = "all",
    [string]$Browser = "all",
    [switch]$Headed = $false,
    [switch]$Debug = $false
)

Write-Host "=== Playwright Test Execution ===" -ForegroundColor Green
Write-Host "Test Type: $TestType" -ForegroundColor Cyan
Write-Host "Browser: $Browser" -ForegroundColor Cyan
Write-Host "Headed: $Headed" -ForegroundColor Cyan
Write-Host "Debug: $Debug" -ForegroundColor Cyan

# Build command
$command = "npx playwright test"

# Add test type filter
switch ($TestType) {
    "e2e" { $command += " tests/e2e" }
    "api" { $command += " tests/api" }
    "all" { }
    default { $command += " --grep `"$TestType`"" }
}

# Add browser filter
if ($Browser -ne "all") {
    $command += " --project=$Browser"
}

# Add execution options
if ($Headed) {
    $command += " --headed"
}

if ($Debug) {
    $command += " --debug"
}

# Execute command
Write-Host "`nExecuting: $command" -ForegroundColor Yellow
Invoke-Expression $command

# Show report if not in debug mode
if (-not $Debug) {
    Write-Host "`nOpening test report..." -ForegroundColor Green
    npx playwright show-report
}
```

**Usage examples:**
```powershell
# Run all tests
.\run-tests.ps1

# Run E2E tests in headed mode
.\run-tests.ps1 -TestType e2e -Headed

# Run API tests in Chrome
.\run-tests.ps1 -TestType api -Browser chromium

# Debug specific test
.\run-tests.ps1 -TestType "should verify GET request" -Debug
```

### **Deliverables**
- [ ] Comprehensive E2E test suite created and passing
- [ ] Complete API test suite created and passing
- [ ] Test execution script created and functional
- [ ] HTML test report generated and reviewed
- [ ] Screenshots and videos captured during test execution
- [ ] Documentation of test results and any issues encountered

---

## 🏋️ Exercise 4: Configuration Customization

### **Objective**
Customize Playwright configuration for different environments and use cases.

### **Tasks**

#### **Task 4.1: Environment-Specific Configuration**
Create different configuration files for various environments.

**Create [`playwright.config.local.ts`](playwright.config.local.ts:1):**
```typescript
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig(baseConfig, {
  // Local development overrides
  use: {
    ...baseConfig.use,
    headless: false,
    slowMo: 500,
    video: 'on',
    screenshot: 'on',
    trace: 'on',
  },
  
  // Single worker for debugging
  workers: 1,
  fullyParallel: false,
  
  // Extended timeouts for debugging
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  
  // Additional reporter for detailed output
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
});
```

**Create [`playwright.config.ci.ts`](playwright.config.ci.ts:1):**
```typescript
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig(baseConfig, {
  // CI-specific settings
  use: {
    ...baseConfig.use,
    headless: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  
  // Optimize for CI environment
  workers: 2,
  retries: 2,
  fullyParallel: true,
  
  // Shorter timeouts for CI
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  
  // CI-friendly reporters
  reporter: [
    ['github'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['html', { open: 'never' }]
  ],
});
```

#### **Task 4.2: Custom Test Utilities**
Create utility functions and custom fixtures.

**Create [`tests/utils/test-helpers.ts`](tests/utils/test-helpers.ts:1):**
```typescript
import { Page, expect, Locator } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded with all resources
   */
  async waitForFullPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForFunction(() => document.readyState === 'complete');
  }

  /**
   * Take a screenshot with custom naming
   */
  async takeScreenshot(name: string, options?: { fullPage?: boolean }): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: options?.fullPage ?? true
    });
  }

  /**
   * Verify element is ready for interaction
   */
  async verifyElementReady(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await expect(locator).toBeAttached();
  }

  /**
   * Fill form field with validation
   */
  async fillFieldWithValidation(locator: Locator, value: string): Promise<void> {
    await this.verifyElementReady(locator);
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }

  /**
   * Click element with retry logic
   */
  async clickWithRetry(locator: Locator, maxRetries: number = 3): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.verifyElementReady(locator);
        await locator.click();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Get current timestamp for test data
   */
  getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Generate test data
   */
  generateTestData() {
    const timestamp = Date.now();
    return {
      email: `test-${timestamp}@example.com`,
      username: `testuser${timestamp}`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      timestamp: this.getTimestamp()
    };
  }
}

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const retry = async <T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3, 
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay);
    }
  }
  throw new Error('Retry failed');
};
```

#### **Task 4.3: Environment Variables Setup**
Create environment configuration files.

**Create [`.env.example`](.env.example:1):**
```env
# Base URLs
BASE_URL=http://localhost:3000
API_BASE_URL=https://jsonplaceholder.typicode.com

# Test User Credentials
TEST_USERNAME=testuser@example.com
TEST_PASSWORD=testpassword123

# API Configuration
API_KEY=your-api-key-here
API_TIMEOUT=30000

# Test Configuration
HEADLESS=true
SLOW_MO=0
VIDEO_MODE=retain-on-failure
SCREENSHOT_MODE=only-on-failure

# Browser Configuration
DEFAULT_BROWSER=chromium
PARALLEL_WORKERS=4

# Debugging
DEBUG_MODE=false
TRACE_MODE=on-first-retry

# CI/CD Configuration
CI=false
RETRY_COUNT=0
```

**Create [`.env.local`](.env.local:1):**
```env
# Local development environment
BASE_URL=http://localhost:3000
API_BASE_URL=https://jsonplaceholder.typicode.com

# Local test credentials
TEST_USERNAME=admin@localhost
TEST_PASSWORD=admin123

# Local debugging settings
HEADLESS=false
SLOW_MO=500
VIDEO_MODE=on
SCREENSHOT_MODE=on
DEBUG_MODE=true
TRACE_MODE=on

# Local performance settings
PARALLEL_WORKERS=1
RETRY_COUNT=0
```

#### **Task 4.4: Test Configuration Validation**
Create tests to validate different configurations work correctly.

**Create [`tests/config/configuration-validation.spec.ts`](tests/config/configuration-validation.spec.ts:1):**
```typescript
import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Configuration Validation', () => {
  test('should validate browser configuration', async ({ page, browserName }) => {
    const helpers = new TestHelpers(page);
    
    // Test browser-specific functionality
    await page.goto('https://whatsmybrowser.org/');
    await helpers.waitForFullPageLoad();
    
    // Verify browser detection
    const browserInfo = page.locator('.detected-browser');
    await expect(browserInfo).toBeVisible();
    
    const detectedBrowser = await browserInfo.textContent();
    console.log(`Expected: ${browserName}, Detected: ${detectedBrowser}`);
    
    // Take browser-specific screenshot
    await helpers.takeScreenshot(`browser-${browserName}-config`);
  });

  test('should validate environment variables', async ({ page }) => {
    // Test environment variable usage
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    const apiBaseURL = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';
    
    console.log(`Base URL: ${baseURL}`);
    console.log(`API Base URL: ${apiBaseURL}`);
    
    // Validate URLs are accessible
    expect(baseURL).toBeTruthy();
    expect(apiBaseURL).toBeTruthy();
  });

  test('should validate test helpers functionality', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Test helper methods
    await helpers.waitForFullPageLoad();
    
    const usernameField = page.getByLabel('Username');
    await helpers.verifyElementReady(usernameField);
    
    const testData = helpers.generateTestData();
    await helpers.fillFieldWithValidation(usernameField, testData.username);
    
    await helpers.takeScreenshot('helpers-validation');
    
    // Verify test data generation
    expect(testData.email).toContain('@example.com');
    expect(testData.username).toContain('testuser');
    expect(testData.password).toBe('TestPassword123!');
  });

  test('should validate different configuration files', async ({ page }) => {
    // This test validates that configuration is loaded correctly
    const config = {
      timeout: test.info().timeout,
      project: test.info().project.name,
      title: test.info().title
    };
    
    console.log('Test Configuration:', JSON.stringify(config, null, 2));
    
    // Verify configuration values
    expect(config.timeout).toBeGreaterThan(0);
    expect(config.project).toBeTruthy();
    expect(config.title).toBeTruthy();
  });
});
```

### **Deliverables**
- [ ] Environment-specific configuration files created (local, CI)
- [ ] Custom test utilities and helpers implemented
- [ ] Environment variables properly configured
- [ ] Configuration validation tests created and passing
- [ ] Documentation of configuration options and their purposes

---

## 🎯 Exercise Completion Checklist

### **Overall Completion Requirements**
- [ ] All four exercises completed successfully
- [ ] System requirements verified and documented
- [ ] Two Playwright projects created (quickstart and manual)
- [ ] Comprehensive test suites created and passing
- [ ] Custom configurations implemented and tested
- [ ] All deliverables documented and organized

### **Technical Verification**
- [ ] Node.js 18+ installed and working
- [ ] Playwright installed with TypeScript support
- [ ] All browsers (Chromium, Firefox, WebKit) functional
- [ ] E2E tests passing in all browsers
- [ ] API tests passing with proper validation
- [ ] HTML reports generating correctly
- [ ] Screenshots and videos capturing properly

### **Documentation Requirements**
- [ ] Installation process documented with screenshots
- [ ] Configuration differences explained
- [ ] Test results analyzed and documented
- [ ] Troubleshooting notes for any issues encountered
- [ ] Best practices identified and documented

## 🚀 Next Steps

After completing these exercises, you should:

1. **Review your work** - Ensure all tests pass and configurations work
2. **Document lessons learned** - Note any challenges and solutions
3. **Prepare for Lesson 02** - Project Structure and Configuration
4. **Practice regularly** - Run tests daily to maintain familiarity

## 📚 Additional Practice Suggestions

### **Extended Practice**
- Create tests for your favorite websites
- Experiment with different browser configurations
- Try mobile device emulation
- Practice with different assertion types
- Explore the Playwright documentation

### **Community Engagement**
- Join the Playwright Discord community
- Share your test results and ask questions
- Contribute to open-source Playwright projects
- Follow Playwright updates and new features

---

**🎭 Excellent work! You've successfully completed the installation and setup exercises. You're now ready to dive deeper into Playwright project structure and advanced configuration in the next lesson!**