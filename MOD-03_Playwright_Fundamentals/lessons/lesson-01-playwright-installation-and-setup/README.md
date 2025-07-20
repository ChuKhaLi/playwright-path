# Lesson 01: Playwright Installation and Setup

## 🎯 Learning Objectives

By the end of this lesson, you will be able to:

- **LO-01**: Install Playwright and its dependencies on Windows systems
- **LO-02**: Set up a new Playwright project with TypeScript configuration
- **LO-03**: Understand the basic project structure and key files
- **LO-04**: Configure Playwright for different browsers and environments
- **LO-05**: Run your first Playwright test to verify installation
- **LO-06**: Troubleshoot common installation issues

## 📚 Lesson Overview

**Duration**: 1-2 hours  
**Type**: Foundation  
**Prerequisites**: MOD-01 (Web Foundations), MOD-02 (TypeScript Basics)

This lesson establishes the foundation for your Playwright automation journey. You'll learn how to properly install and configure Playwright with TypeScript, understand the project structure, and verify your setup by running a basic test.

## 🎭 What is Playwright?

Playwright is a modern end-to-end testing framework that enables reliable testing across all modern browsers. It also provides powerful API testing capabilities through its request fixture, making it an ideal choice for comprehensive test automation.

### **Key Features**
- **Cross-browser testing**: Chromium, Firefox, and WebKit support
- **Auto-wait**: Intelligent waiting for elements to be ready
- **API testing**: Built-in support for HTTP requests and API testing
- **TypeScript support**: First-class TypeScript integration
- **Debugging tools**: Powerful debugging and tracing capabilities
- **Parallel execution**: Fast test execution with built-in parallelization

## 🛠️ Prerequisites Check

Before starting, ensure you have:

- **Node.js**: Version 18 or higher
- **npm or yarn**: Package manager for Node.js
- **VS Code**: Recommended IDE with Playwright extension
- **Git**: For version control (optional but recommended)
- **Windows 10/11**: This guide focuses on Windows setup

### **Verify Node.js Installation**

Open PowerShell and run:

```powershell
node --version
npm --version
```

You should see version numbers. If not, download Node.js from [nodejs.org](https://nodejs.org/).

## 📁 Project Structure Overview

A typical Playwright project structure looks like this:

```
playwright-project/
├── tests/                    # Test files
│   ├── example.spec.ts      # Sample E2E test
│   └── api/                 # API tests folder
│       └── api-example.spec.ts
├── test-results/            # Test execution results
├── playwright-report/       # HTML test reports
├── playwright.config.ts     # Main configuration file
├── package.json            # Node.js project file
├── package-lock.json       # Dependency lock file
└── node_modules/           # Installed dependencies
```

## 🚀 Installation Steps

### **Step 1: Create Project Directory**

```powershell
# Create and navigate to project directory
mkdir playwright-automation
cd playwright-automation
```

### **Step 2: Initialize Node.js Project**

```powershell
# Initialize package.json
npm init -y
```

This creates a [`package.json`](package.json:1) file with default settings.

### **Step 3: Install Playwright**

```powershell
# Install Playwright with TypeScript support
npm init playwright@latest
```

This command will:
- Install Playwright and its dependencies
- Install TypeScript and related packages
- Create the basic project structure
- Download browser binaries
- Generate sample tests and configuration

### **Step 4: Manual Installation (Alternative)**

If you prefer manual setup:

```powershell
# Install Playwright
npm install -D @playwright/test

# Install TypeScript (if not already installed)
npm install -D typescript

# Install browsers
npx playwright install
```

### **Step 5: Verify Installation**

```powershell
# Check Playwright version
npx playwright --version

# List installed browsers
npx playwright install --dry-run
```

## ⚙️ Configuration Deep Dive

### **Understanding playwright.config.ts**

The [`playwright.config.ts`](playwright.config.ts:1) file is the heart of your Playwright setup:

```typescript
import { defineConfig, devices } from '@playwright/test';

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
  
  // Reporter to use
  reporter: 'html',
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like await page.goto('/')
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
  },

  // Configure projects for major browsers
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

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### **Key Configuration Options**

- **`testDir`**: Directory containing test files
- **`fullyParallel`**: Run tests in parallel for faster execution
- **`retries`**: Number of retry attempts for failed tests
- **`workers`**: Number of parallel worker processes
- **`reporter`**: Test result reporting format
- **`use.baseURL`**: Default base URL for navigation
- **`use.trace`**: When to collect execution traces
- **`projects`**: Browser configurations to test against

## 🧪 Your First Test

Let's create and run a simple test to verify everything works:

### **Create a Basic E2E Test**

Create [`tests/first-test.spec.ts`](tests/first-test.spec.ts:1):

```typescript
import { test, expect } from '@playwright/test';

test('basic navigation test', async ({ page }) => {
  // Navigate to a website
  await page.goto('https://playwright.dev/');
  
  // Verify the page title
  await expect(page).toHaveTitle(/Playwright/);
  
  // Check for a specific element
  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  
  // Take a screenshot
  await page.screenshot({ path: 'first-test-screenshot.png' });
});
```

### **Create a Basic API Test**

Create [`tests/api/first-api-test.spec.ts`](tests/api/first-api-test.spec.ts:1):

```typescript
import { test, expect } from '@playwright/test';

test('basic API test', async ({ request }) => {
  // Make a GET request
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  
  // Verify response status
  expect(response.status()).toBe(200);
  
  // Parse and verify response data
  const data = await response.json();
  expect(data).toHaveProperty('id', 1);
  expect(data).toHaveProperty('title');
  expect(typeof data.title).toBe('string');
});
```

### **Run Your Tests**

```powershell
# Run all tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run specific test file
npx playwright test first-test.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

## 📊 Understanding Test Results

After running tests, you'll see:

### **Console Output**
```
Running 2 tests using 1 worker

  ✓ first-test.spec.ts:3:1 › basic navigation test (2s)
  ✓ api/first-api-test.spec.ts:3:1 › basic API test (1s)

  2 passed (3s)
```

### **HTML Report**
```powershell
# Open HTML report
npx playwright show-report
```

The HTML report provides:
- Test execution summary
- Screenshots and videos of failures
- Detailed execution traces
- Performance metrics

## 🔧 Troubleshooting Common Issues

### **Issue 1: Browser Installation Failed**

**Problem**: Browsers not downloading properly

**Solution**:
```powershell
# Manually install browsers
npx playwright install

# Install specific browser
npx playwright install chromium

# Install with dependencies
npx playwright install-deps
```

### **Issue 2: TypeScript Compilation Errors**

**Problem**: TypeScript configuration issues

**Solution**: Create [`tsconfig.json`](tsconfig.json:1):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["tests/**/*"],
  "exclude": ["node_modules"]
}
```

### **Issue 3: Permission Errors on Windows**

**Problem**: PowerShell execution policy restrictions

**Solution**:
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Issue 4: Port Already in Use**

**Problem**: Web server port conflicts

**Solution**: Update [`playwright.config.ts`](playwright.config.ts:1):
```typescript
webServer: {
  command: 'npm run start',
  url: 'http://localhost:3001', // Change port
  reuseExistingServer: !process.env.CI,
}
```

## 🎯 Best Practices

### **Project Organization**
- Keep tests in the `tests/` directory
- Organize API tests in `tests/api/` subdirectory
- Use descriptive test file names with `.spec.ts` extension
- Group related tests in subdirectories

### **Configuration Management**
- Use environment variables for sensitive data
- Configure different settings for local vs CI environments
- Keep browser configurations consistent across team

### **Version Control**
Add to [`.gitignore`](.gitignore:1):
```
node_modules/
test-results/
playwright-report/
playwright/.cache/
*.png
*.webm
```

## 📚 Additional Resources

### **Official Documentation**
- [Playwright Getting Started](https://playwright.dev/docs/intro) ⭐⭐⭐⭐⭐
- [Playwright Configuration](https://playwright.dev/docs/test-configuration) ⭐⭐⭐⭐⭐
- [TypeScript with Playwright](https://playwright.dev/docs/test-typescript) ⭐⭐⭐⭐

### **Tools and Extensions**
- [Playwright VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) ⭐⭐⭐⭐⭐
- [Playwright Test Generator](https://playwright.dev/docs/codegen) ⭐⭐⭐⭐

### **Community Resources**
- [Playwright GitHub Repository](https://github.com/microsoft/playwright) ⭐⭐⭐⭐
- [Playwright Discord Community](https://discord.gg/playwright-807756831384403968) ⭐⭐⭐

## ✅ Lesson Completion Checklist

- [ ] Node.js and npm installed and verified
- [ ] Playwright project created and configured
- [ ] Browser binaries downloaded successfully
- [ ] First E2E test created and running
- [ ] First API test created and running
- [ ] HTML report generated and reviewed
- [ ] VS Code with Playwright extension installed
- [ ] Project added to version control

## 🚀 Next Steps

In **Lesson 02: Project Structure and Configuration**, you'll learn:
- Deep dive into project organization
- Advanced configuration options
- Environment-specific settings
- Test data management strategies

---

**🎭 Congratulations! You've successfully set up your Playwright automation environment. You're ready to dive deeper into project structure and configuration!**