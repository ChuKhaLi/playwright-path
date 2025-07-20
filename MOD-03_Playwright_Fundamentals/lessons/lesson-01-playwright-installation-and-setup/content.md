# Lesson 01: Playwright Installation and Setup - Detailed Content

## 🎯 Learning Path Overview

This lesson provides comprehensive coverage of Playwright installation and setup, establishing the foundation for both E2E and API testing approaches that will be developed throughout this module.

## 📋 Prerequisites Verification

### **System Requirements Check**

Before beginning, let's verify your system meets all requirements:

#### **Node.js Version Check**
```powershell
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check if yarn is available (optional)
yarn --version
```

**Expected Output:**
```
v18.17.0  # or higher
9.6.7     # or compatible version
1.22.19   # if yarn is installed
```

#### **PowerShell Execution Policy**
```powershell
# Check current execution policy
Get-ExecutionPolicy

# If restricted, set for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **Git Configuration (Recommended)**
```powershell
# Check Git installation
git --version

# Configure Git if not already done
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 🚀 Step-by-Step Installation Guide

### **Method 1: Quick Start with npm init playwright**

This is the recommended approach for beginners:

#### **Step 1: Create Project Directory**
```powershell
# Create project directory
mkdir my-playwright-project
cd my-playwright-project

# Verify current directory
pwd
```

#### **Step 2: Initialize Playwright Project**
```powershell
# Initialize Playwright with interactive setup
npm init playwright@latest
```

**Interactive Prompts and Recommended Answers:**
```
? Do you want to use TypeScript or JavaScript? › TypeScript
? Where to put your end-to-end tests? › tests
? Add a GitHub Actions workflow? › true
? Install Playwright browsers (can be done manually via 'npx playwright install')? › true
```

#### **Step 3: Verify Installation**
```powershell
# Check installed packages
npm list --depth=0

# Verify Playwright installation
npx playwright --version

# Check installed browsers
npx playwright install --dry-run
```

### **Method 2: Manual Installation (Advanced)**

For more control over the installation process:

#### **Step 1: Initialize Node.js Project**
```powershell
# Create package.json
npm init -y

# Install Playwright Test
npm install -D @playwright/test

# Install TypeScript and related packages
npm install -D typescript @types/node

# Install browsers
npx playwright install
```

#### **Step 2: Create TypeScript Configuration**

Create [`tsconfig.json`](tsconfig.json:1):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": [
    "tests/**/*",
    "playwright.config.ts"
  ],
  "exclude": [
    "node_modules",
    "test-results",
    "playwright-report"
  ]
}
```

#### **Step 3: Create Playwright Configuration**

Create [`playwright.config.ts`](playwright.config.ts:1):
```typescript
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like await page.goto('/')
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Global test timeout
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Additional Chromium-specific settings
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
        }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Firefox-specific settings
        launchOptions: {
          firefoxUserPrefs: {
            'media.navigator.streams.fake': true,
            'media.navigator.permission.disabled': true,
          }
        }
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // WebKit-specific settings
      },
    },

    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // API testing project
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        // API tests don't need a browser
        baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## 📁 Project Structure Deep Dive

### **Complete Project Structure**
```
my-playwright-project/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI/CD
├── tests/
│   ├── api/                        # API tests
│   │   ├── auth.spec.ts           # Authentication API tests
│   │   ├── users.spec.ts          # User management API tests
│   │   └── products.spec.ts       # Product API tests
│   ├── e2e/                       # End-to-end tests
│   │   ├── login.spec.ts          # Login flow tests
│   │   ├── checkout.spec.ts       # Checkout process tests
│   │   └── navigation.spec.ts     # Navigation tests
│   ├── fixtures/                  # Test fixtures and utilities
│   │   ├── test-data.ts           # Test data management
│   │   └── custom-fixtures.ts     # Custom test fixtures
│   └── utils/                     # Utility functions
│       ├── helpers.ts             # Common helper functions
│       └── constants.ts           # Test constants
├── test-results/                  # Test execution results
├── playwright-report/             # HTML test reports
├── screenshots/                   # Test screenshots
├── videos/                        # Test execution videos
├── .env                          # Environment variables
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Node.js project configuration
├── package-lock.json            # Dependency lock file
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

### **Key Files Explained**

#### **package.json Configuration**
```json
{
  "name": "my-playwright-project",
  "version": "1.0.0",
  "description": "Playwright automation project with E2E and API testing",
  "main": "index.js",
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "test:ui": "npx playwright test --ui",
    "test:api": "npx playwright test --project=api",
    "test:e2e": "npx playwright test tests/e2e",
    "test:chromium": "npx playwright test --project=chromium",
    "test:firefox": "npx playwright test --project=firefox",
    "test:webkit": "npx playwright test --project=webkit",
    "report": "npx playwright show-report",
    "install:browsers": "npx playwright install",
    "codegen": "npx playwright codegen"
  },
  "keywords": ["playwright", "testing", "automation", "e2e", "api"],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.8.0",
    "typescript": "^5.2.0"
  }
}
```

#### **.gitignore Configuration**
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Test results
test-results/
playwright-report/
playwright/.cache/

# Screenshots and videos
screenshots/
videos/
*.png
*.webm
*.mp4

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

#### **Environment Variables Setup**

Create [`.env.example`](.env.example:1):
```env
# Base URLs
BASE_URL=http://localhost:3000
API_BASE_URL=https://api.example.com

# Authentication
TEST_USERNAME=testuser@example.com
TEST_PASSWORD=testpassword123
API_KEY=your-api-key-here

# Test Configuration
HEADLESS=true
SLOW_MO=0
TIMEOUT=30000

# CI/CD Configuration
CI=false
PARALLEL_WORKERS=4
```

Create [`.env`](.env:1) (copy from .env.example and customize):
```env
# Your actual environment variables
BASE_URL=http://localhost:3000
API_BASE_URL=https://jsonplaceholder.typicode.com
TEST_USERNAME=admin@example.com
TEST_PASSWORD=admin123
HEADLESS=false
```

## 🧪 Creating Your First Tests

### **E2E Test Example**

Create [`tests/e2e/first-e2e-test.spec.ts`](tests/e2e/first-e2e-test.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';

test.describe('First E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should display the homepage correctly', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Playwright/);
    
    // Check for main navigation
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();
    
    // Verify key elements are present
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });

  test('should navigate to documentation', async ({ page }) => {
    // Click on documentation link
    await page.getByRole('link', { name: 'Docs' }).click();
    
    // Verify navigation occurred
    await expect(page).toHaveURL(/.*docs.*/);
    
    // Check for documentation content
    await expect(page.getByRole('heading', { name: /Getting started/ })).toBeVisible();
  });

  test('should handle search functionality', async ({ page }) => {
    // Find and interact with search
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.fill('installation');
    await searchInput.press('Enter');
    
    // Verify search results
    await expect(page.getByText('Search results')).toBeVisible();
    await expect(page.getByText('installation')).toBeVisible();
  });
});
```

### **API Test Example**

Create [`tests/api/first-api-test.spec.ts`](tests/api/first-api-test.spec.ts:1):
```typescript
import { test, expect } from '@playwright/test';

test.describe('First API Tests', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('should fetch a single post', async ({ request }) => {
    // Make GET request
    const response = await request.get(`${baseURL}/posts/1`);
    
    // Verify response status
    expect(response.status()).toBe(200);
    
    // Verify response headers
    expect(response.headers()['content-type']).toContain('application/json');
    
    // Parse and verify response data
    const post = await response.json();
    expect(post).toHaveProperty('id', 1);
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('userId');
    
    // Verify data types
    expect(typeof post.id).toBe('number');
    expect(typeof post.title).toBe('string');
    expect(typeof post.body).toBe('string');
    expect(typeof post.userId).toBe('number');
  });

  test('should create a new post', async ({ request }) => {
    // Prepare test data
    const newPost = {
      title: 'Test Post Title',
      body: 'This is a test post body content.',
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
  });

  test('should handle API errors gracefully', async ({ request }) => {
    // Request non-existent resource
    const response = await request.get(`${baseURL}/posts/999999`);
    
    // Verify error response
    expect(response.status()).toBe(404);
    
    // Verify error response structure
    const errorData = await response.json();
    expect(errorData).toEqual({});
  });

  test('should fetch multiple posts with pagination', async ({ request }) => {
    // Request posts with query parameters
    const response = await request.get(`${baseURL}/posts`, {
      params: {
        _page: 1,
        _limit: 5
      }
    });
    
    // Verify response
    expect(response.status()).toBe(200);
    
    // Parse and verify data
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBe(5);
    
    // Verify each post structure
    posts.forEach(post => {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
      expect(post).toHaveProperty('userId');
    });
  });
});
```

## 🏃‍♂️ Running Your Tests

### **Basic Test Execution**
```powershell
# Run all tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests with UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test first-e2e-test.spec.ts

# Run tests matching pattern
npx playwright test --grep "should display"
```

### **Browser-Specific Testing**
```powershell
# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run API tests only
npx playwright test --project=api

# Run E2E tests only
npx playwright test tests/e2e
```

### **Advanced Test Execution**
```powershell
# Run tests in debug mode
npx playwright test --debug

# Run tests with custom timeout
npx playwright test --timeout=60000

# Run tests with specific number of workers
npx playwright test --workers=2

# Run tests and generate report
npx playwright test --reporter=html
```

## 📊 Understanding Test Results

### **Console Output Interpretation**
```
Running 6 tests using 4 workers

  ✓ tests/e2e/first-e2e-test.spec.ts:8:3 › First E2E Tests › should display the homepage correctly (2.1s)
  ✓ tests/e2e/first-e2e-test.spec.ts:19:3 › First E2E Tests › should navigate to documentation (1.8s)
  ✓ tests/e2e/first-e2e-test.spec.ts:28:3 › First E2E Tests › should handle search functionality (2.3s)
  ✓ tests/api/first-api-test.spec.ts:6:3 › First API Tests › should fetch a single post (0.5s)
  ✓ tests/api/first-api-test.spec.ts:25:3 › First API Tests › should create a new post (0.7s)
  ✓ tests/api/first-api-test.spec.ts:45:3 › First API Tests › should handle API errors gracefully (0.3s)

  6 passed (7.7s)
```

### **HTML Report Features**
```powershell
# Generate and open HTML report
npx playwright show-report
```

The HTML report includes:
- **Test Summary**: Pass/fail statistics
- **Test Details**: Individual test results with timing
- **Screenshots**: Visual evidence of test execution
- **Videos**: Recordings of failed tests
- **Traces**: Detailed execution traces for debugging
- **Console Logs**: Browser console output during tests

### **Test Artifacts**
After test execution, you'll find:
- **Screenshots**: `test-results/` directory
- **Videos**: `test-results/` directory  
- **Traces**: `test-results/` directory
- **Reports**: `playwright-report/` directory

## 🔧 Advanced Configuration

### **Environment-Specific Configuration**

Create [`playwright.config.local.ts`](playwright.config.local.ts:1):
```typescript
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig(baseConfig, {
  // Local development overrides
  use: {
    ...baseConfig.use,
    headless: false,
    slowMo: 1000,
    video: 'on',
    screenshot: 'on',
  },
  
  // Disable parallel execution for debugging
  fullyParallel: false,
  workers: 1,
  
  // Increase timeouts for debugging
  timeout: 60000,
});
```

### **Custom Test Utilities**

Create [`tests/utils/helpers.ts`](tests/utils/helpers.ts:1):
```typescript
import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Take a screenshot with timestamp
   */
  async takeTimestampedScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Verify element is visible and enabled
   */
  async verifyElementReady(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible();
    await expect(element).toBeEnabled();
  }

  /**
   * Fill form field with validation
   */
  async fillAndValidate(selector: string, value: string): Promise<void> {
    const field = this.page.locator(selector);
    await field.fill(value);
    await expect(field).toHaveValue(value);
  }
}

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const generateTestData = () => ({
  email: `test-${Date.now()}@example.com`,
  username: `testuser${Date.now()}`,
  password: 'TestPassword123!',
  timestamp: new Date().toISOString()
});
```

## 🚨 Troubleshooting Guide

### **Common Installation Issues**

#### **Issue: Browser Download Fails**
```powershell
# Solution 1: Manual browser installation
npx playwright install

# Solution 2: Install specific browser
npx playwright install chromium

# Solution 3: Install with system dependencies
npx playwright install-deps
```

#### **Issue: TypeScript Compilation Errors**
```powershell
# Check TypeScript configuration
npx tsc --noEmit

# Install missing type definitions
npm install -D @types/node

# Verify tsconfig.json is correct
```

#### **Issue: Permission Denied on Windows**
```powershell
# Check PowerShell execution policy
Get-ExecutionPolicy

# Set execution policy if needed
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run as administrator if necessary
```

#### **Issue: Port Already in Use**
```typescript
// Update playwright.config.ts
webServer: {
  command: 'npm run start',
  url: 'http://localhost:3001', // Change port
  reuseExistingServer: !process.env.CI,
}
```

### **Performance Optimization**

#### **Parallel Execution Tuning**
```typescript
// playwright.config.ts
export default defineConfig({
  // Optimize worker count based on system
  workers: process.env.CI ? 2 : Math.min(4, require('os').cpus().length),
  
  // Enable full parallelization
  fullyParallel: true,
  
  // Optimize timeouts
  use: {
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
});
```

#### **Resource Management**
```typescript
// Custom fixture for resource cleanup
import { test as base } from '@playwright/test';

export const test = base.extend({
  // Auto-cleanup after each test
  page: async ({ page }, use) => {
    await use(page);
    // Cleanup logic here
    await page.close();
  },
});
```

## ✅ Installation Verification Checklist

### **System Verification**
- [ ] Node.js 18+ installed and accessible
- [ ] npm/yarn package manager working
- [ ] PowerShell execution policy configured
- [ ] Git installed and configured (optional)

### **Project Setup Verification**
- [ ] Playwright project initialized successfully
- [ ] TypeScript configuration created
- [ ] Browser binaries downloaded
- [ ] Test directories created
- [ ] Configuration files in place

### **Test Execution Verification**
- [ ] Sample E2E test runs successfully
- [ ] Sample API test runs successfully
- [ ] HTML report generates correctly
- [ ] Screenshots and videos captured
- [ ] All browsers (Chromium, Firefox, WebKit) working

### **Development Environment**
- [ ] VS Code with Playwright extension installed
- [ ] Project opened in VS Code
- [ ] IntelliSense working for Playwright APIs
- [ ] Debugging configuration working

## 🎯 Next Steps

You're now ready to move on to **Lesson 02: Project Structure and Configuration**, where you'll learn:

- Advanced project organization strategies
- Environment-specific configuration management
- Test data and fixture management
- Custom utilities and helper functions
- CI/CD integration preparation

---

**🎭 Excellent work! Your Playwright environment is now fully configured and ready for comprehensive E2E and API testing. Let's continue building your automation expertise!**