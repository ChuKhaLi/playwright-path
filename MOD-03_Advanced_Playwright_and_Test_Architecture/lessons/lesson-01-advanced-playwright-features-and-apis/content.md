# Lesson 01: Advanced Playwright Features and APIs

## Learning Objectives

By the end of this lesson, you will be able to:

- **LO-01**: Apply advanced Playwright [`fixtures`](../../examples/custom-fixtures.ts:15) for custom test setup and teardown procedures
- **LO-02**: Configure advanced [`browser contexts`](../../examples/advanced-contexts.ts:25) with custom settings and permissions  
- **LO-03**: Implement [`test.beforeAll()`](../../examples/test-orchestration.ts:35) and [`test.afterAll()`](../../examples/test-orchestration.ts:45) for complex test orchestration
- **LO-04**: Utilize [`test.step()`](../../examples/granular-reporting.ts:15) for granular test reporting and debugging
- **LO-05**: Configure advanced [`playwright.config.ts`](../../examples/enterprise-config.ts:1) settings for enterprise environments

## Introduction

As you advance in your Playwright testing journey, you'll encounter scenarios that require more sophisticated approaches than basic page interactions. Enterprise applications demand robust test automation strategies that handle complex setups, manage multiple environments, and provide detailed insights into test execution.

This lesson introduces you to Playwright's advanced features and APIs that transform your tests from simple scripts into professional-grade automation solutions. You'll learn to create custom fixtures, configure complex browser contexts, orchestrate test execution, and implement granular reporting—all essential skills for senior QA automation engineers.

### Why Advanced Playwright Features Matter

In professional environments, test automation goes beyond verifying that buttons click and forms submit. You need to:

- **Manage Complex Setup/Teardown**: Database connections, API authentication, test data preparation
- **Handle Multiple Environments**: Development, staging, production-like configurations
- **Provide Detailed Reporting**: Granular insights for debugging and stakeholder communication
- **Ensure Test Isolation**: Reliable execution regardless of test order or parallel execution
- **Scale for Enterprise**: Configuration patterns that support large teams and complex applications

## 1. Advanced Fixtures in Playwright

### Understanding Playwright Fixtures

Fixtures in Playwright are powerful dependency injection mechanisms that provide setup and teardown functionality for your tests. While basic fixtures like `page` and `browser` are provided by default, advanced testing scenarios require custom fixtures tailored to your application's needs.

Think of fixtures as **smart test helpers** that automatically prepare everything your tests need and clean up afterward, regardless of whether tests pass or fail.

### Basic vs. Advanced Fixture Usage

**Basic Fixture Usage** (What you've learned so far):
```typescript
import { test, expect } from '@playwright/test';

test('basic fixture usage', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('h1')).toBeVisible();
});
```

**Advanced Fixture Usage** (What we'll learn now):
```typescript
import { test as base, expect } from '@playwright/test';

// Custom fixture with complex setup
const test = base.extend({
  authenticatedPage: async ({ page, browser }, use) => {
    // Complex authentication setup
    const context = await browser.newContext({
      storageState: 'auth-state.json',
      extraHTTPHeaders: {
        'Authorization': 'Bearer test-token'
      }
    });
    const authPage = await context.newPage();
    await authPage.goto('/dashboard');
    
    await use(authPage);
    
    // Automatic cleanup
    await context.close();
  }
});

test('advanced fixture usage', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.locator('[data-testid="user-menu"]')).toBeVisible();
});
```

### Creating Custom Fixtures

Custom fixtures solve common testing challenges by encapsulating complex setup logic. Here are practical patterns for enterprise testing:

#### 1. Database Fixture for Test Data Management

```typescript
import { test as base } from '@playwright/test';
import { DatabaseHelper } from '../utils/database-helper';

type TestFixtures = {
  database: DatabaseHelper;
  testUser: {
    id: string;
    email: string;
    password: string;
  };
};

const test = base.extend<TestFixtures>({
  database: async ({}, use) => {
    const db = new DatabaseHelper();
    await db.connect();
    
    await use(db);
    
    // Cleanup test data after each test
    await db.cleanup();
    await db.disconnect();
  },

  testUser: async ({ database }, use) => {
    // Create a unique test user for this test
    const user = await database.createUser({
      email: `test-user-${Date.now()}@example.com`,
      password: 'secure-test-password',
      role: 'standard'
    });
    
    await use(user);
    
    // User cleanup is handled by database fixture
  }
});

export { test };
```

**Why This Pattern Works:**
- **Isolation**: Each test gets a fresh user, preventing test interdependence
- **Cleanup**: Automatic cleanup prevents database pollution  
- **Reusability**: Any test can access a ready-to-use test user
- **Reliability**: Setup failures are caught early, not during test execution

#### 2. API Client Fixture for Service Integration

```typescript
import { test as base } from '@playwright/test';
import { APIClient } from '../utils/api-client';

type APIFixtures = {
  apiClient: APIClient;
  apiTestData: {
    products: any[];
    orders: any[];
  };
};

const test = base.extend<APIFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new APIClient(request);
    
    // Authenticate the API client
    await client.authenticate({
      username: process.env.API_USERNAME!,
      password: process.env.API_PASSWORD!
    });
    
    await use(client);
    
    // No cleanup needed - client is stateless
  },

  apiTestData: async ({ apiClient }, use) => {
    // Prepare test data via API
    const products = await apiClient.createTestProducts([
      { name: 'Test Product 1', price: 29.99 },
      { name: 'Test Product 2', price: 39.99 }
    ]);
    
    const orders = await apiClient.createTestOrders(products);
    
    await use({ products, orders });
    
    // Cleanup test data
    await apiClient.deleteTestData([...products, ...orders]);
  }
});

export { test };
```

**Enterprise Benefits:**
- **API Integration**: Tests can verify UI behavior against known API state
- **Data Consistency**: UI tests work with predictable, controlled data
- **Hybrid Testing**: Combines API setup with UI verification
- **Speed**: API setup is typically faster than UI-based data preparation

### Fixture Scope and Dependencies

Understanding fixture scope is crucial for performance and reliability:

#### Worker-Scoped Fixtures (Expensive Setup)

```typescript
import { test as base } from '@playwright/test';

type WorkerFixtures = {
  workerStorageState: string;
};

const test = base.extend<{}, WorkerFixtures>({
  // Worker-scoped: runs once per worker process
  workerStorageState: [async ({ browser }, use) => {
    // Expensive authentication setup
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Perform complex authentication flow
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@example.com');
    await page.fill('[data-testid="password"]', 'admin-password');
    await page.click('[data-testid="login-button"]');
    
    // Wait for authentication to complete
    await page.waitForURL('/dashboard');
    
    // Save authentication state
    const storageState = await context.storageState();
    const statePath = 'test-results\\auth-state.json';
    await require('fs').promises.writeFile(statePath, JSON.stringify(storageState));
    
    await context.close();
    
    await use(statePath);
    
    // Cleanup
    await require('fs').promises.unlink(statePath);
  }, { scope: 'worker' }]
});

export { test };
```

**When to Use Worker-Scoped Fixtures:**
- Expensive setup operations (authentication, data seeding)
- Shared resources across multiple tests
- Configuration that doesn't change between tests
- Performance optimization for test suites

## 2. Advanced Browser Context Configuration

### Understanding Browser Contexts

Browser contexts in Playwright are isolated browser sessions that allow you to:
- Simulate different users or devices
- Manage permissions and settings independently
- Handle multiple authentication states
- Control network conditions and capabilities

### Context Configuration Patterns

#### 1. Role-Based Testing with Context Profiles

```typescript
import { test, expect, BrowserContext } from '@playwright/test';

class ContextProfiles {
  static async createAdminContext(browser: any): Promise<BrowserContext> {
    return await browser.newContext({
      storageState: {
        cookies: [],
        origins: [{
          origin: 'https://app.example.com',
          localStorage: [{
            name: 'userRole',
            value: 'admin'
          }, {
            name: 'permissions',
            value: JSON.stringify(['read', 'write', 'delete', 'manage'])
          }]
        }]
      },
      extraHTTPHeaders: {
        'X-User-Role': 'admin',
        'X-Test-Environment': 'automation'
      },
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Playwright/Admin'
    });
  }

  static async createStandardUserContext(browser: any): Promise<BrowserContext> {
    return await browser.newContext({
      storageState: {
        cookies: [],
        origins: [{
          origin: 'https://app.example.com',
          localStorage: [{
            name: 'userRole',
            value: 'user'
          }, {
            name: 'permissions',
            value: JSON.stringify(['read'])
          }]
        }]
      },
      extraHTTPHeaders: {
        'X-User-Role': 'user',
        'X-Test-Environment': 'automation'
      },
      viewport: { width: 1366, height: 768 }, // Different viewport for variety
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Playwright/User'
    });
  }
}

// Usage in tests
test.describe('Role-based feature access', () => {
  test('admin can access management features', async ({ browser }) => {
    const adminContext = await ContextProfiles.createAdminContext(browser);
    const page = await adminContext.newPage();
    
    await page.goto('/dashboard');
    
    // Admin-specific assertions
    await expect(page.locator('[data-testid="admin-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-management"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-settings"]')).toBeVisible();
    
    await adminContext.close();
  });

  test('standard user has limited access', async ({ browser }) => {
    const userContext = await ContextProfiles.createStandardUserContext(browser);
    const page = await userContext.newPage();
    
    await page.goto('/dashboard');
    
    // User-specific assertions
    await expect(page.locator('[data-testid="user-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="admin-panel"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="profile-settings"]')).toBeVisible();
    
    await userContext.close();
  });
});
```

#### 2. Device and Network Simulation

```typescript
import { test, devices } from '@playwright/test';

test.describe('Cross-device compatibility', () => {
  test('mobile experience optimization', async ({ browser }) => {
    const mobileContext = await browser.newContext({
      ...devices['iPhone 13'],
      // Override specific mobile settings
      isMobile: true,
      hasTouch: true,
      // Custom mobile headers
      extraHTTPHeaders: {
        'X-Device-Type': 'mobile',
        'X-Network-Type': '4g'
      }
    });

    const page = await mobileContext.newPage();
    
    // Simulate mobile network conditions
    await page.route('**/*', async (route) => {
      // Add artificial delay for mobile simulation
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });

    await page.goto('/mobile-app');
    
    // Mobile-specific tests
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="desktop-sidebar"]')).not.toBeVisible();
    
    await mobileContext.close();
  });
});
```

## 3. Test Orchestration with Hooks

### Understanding Test Hooks

Test hooks in Playwright provide precise control over test execution flow:
- **`test.beforeAll()`**: Runs once before all tests in a group
- **`test.afterAll()`**: Runs once after all tests in a group  
- **`test.beforeEach()`**: Runs before each individual test
- **`test.afterEach()`**: Runs after each individual test

### Advanced Hook Patterns

#### 1. Shared Resource Management

```typescript
import { test, expect } from '@playwright/test';
import { TestEnvironment } from '../utils/test-environment';

test.describe('Order processing workflow', () => {
  let testEnvironment: TestEnvironment;
  let sharedTestData: {
    products: any[];
    customer: any;
    paymentMethod: any;
  };

  test.beforeAll(async ({ browser }) => {
    // Expensive setup that benefits from sharing
    testEnvironment = new TestEnvironment();
    await testEnvironment.initialize();
    
    // Create shared test data
    sharedTestData = {
      products: await testEnvironment.createProducts([
        { name: 'Test Product A', price: 29.99, inventory: 100 },
        { name: 'Test Product B', price: 39.99, inventory: 50 }
      ]),
      customer: await testEnvironment.createCustomer({
        email: 'test-customer@example.com',
        name: 'Test Customer',
        address: '123 Test Street, Test City'
      }),
      paymentMethod: await testEnvironment.createPaymentMethod({
        type: 'credit_card',
        token: 'test-payment-token'
      })
    };

    console.log('✅ Test environment initialized with shared data');
  });

  test.afterAll(async () => {
    // Cleanup shared resources
    if (testEnvironment) {
      await testEnvironment.cleanup();
      console.log('✅ Test environment cleaned up');
    }
  });

  test.beforeEach(async ({ page }) => {
    // Reset any test-specific state
    await page.goto('/');
    await page.evaluate(() => {
      // Clear any client-side state
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('create order with single product', async ({ page }) => {
    // Test uses shared data but maintains isolation
    const product = sharedTestData.products[0];
    
    await page.goto(`/products/${product.id}`);
    await page.click('[data-testid="add-to-cart"]');
    await page.goto('/checkout');
    
    // Verify product in cart
    await expect(page.locator('[data-testid="cart-item"]')).toContainText(product.name);
    
    // Complete checkout
    await page.fill('[data-testid="customer-email"]', sharedTestData.customer.email);
    await page.click('[data-testid="complete-order"]');
    
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
  });
});
```

## 4. Granular Test Reporting with test.step()

### Understanding test.step()

The [`test.step()`](https://playwright.dev/docs/api/class-test#test-step) function allows you to organize test actions into logical steps, providing:
- **Hierarchical reporting**: Break complex tests into understandable phases
- **Granular debugging**: Pinpoint exactly where failures occur
- **Better documentation**: Self-documenting test structure
- **Stakeholder communication**: Clear test progress for non-technical stakeholders

### Basic Step Usage

```typescript
import { test, expect } from '@playwright/test';

test('user registration workflow', async ({ page }) => {
  await test.step('Navigate to registration page', async () => {
    await page.goto('/register');
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  await test.step('Fill registration form', async () => {
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="email"]', 'john.doe@example.com');
    await page.fill('[data-testid="password"]', 'SecurePassword123!');
    await page.fill('[data-testid="confirm-password"]', 'SecurePassword123!');
  });

  await test.step('Submit registration', async () => {
    await page.click('[data-testid="register-button"]');
    await expect(page.locator('[data-testid="registration-success"]')).toBeVisible();
  });

  await test.step('Verify welcome email sent', async () => {
    // This step would fail independently if email service is down
    await expect(page.locator('[data-testid="email-confirmation"]')).toContainText(
      'Check your email for confirmation'
    );
  });
});
```

### Advanced Step Patterns

#### 1. Reusable Step Functions

```typescript
import { test, expect, Page } from '@playwright/test';

class CheckoutSteps {
  constructor(private page: Page) {}

  async addProductToCart(productName: string, quantity: number = 1) {
    await test.step(`Add ${quantity}x ${productName} to cart`, async () => {
      await this.page.goto(`/products/${productName.toLowerCase().replace(/\s+/g, '-')}`);
      
      if (quantity > 1) {
        await this.page.fill('[data-testid="quantity-input"]', quantity.toString());
      }
      
      await this.page.click('[data-testid="add-to-cart"]');
      await expect(this.page.locator('[data-testid="cart-count"]')).toContainText(quantity.toString());
    });
  }

  async proceedToCheckout() {
    await test.step('Proceed to checkout', async () => {
      await this.page.click('[data-testid="cart-icon"]');
      await this.page.click('[data-testid="checkout-button"]');
      await expect(this.page.locator('h1')).toContainText('Checkout');
    });
  }
}

// Usage in tests
test('complete checkout flow with multiple items', async ({ page }) => {
  const checkout = new CheckoutSteps(page);

  // Each method contains its own step, creating a hierarchy
  await checkout.addProductToCart('Premium Headphones', 1);
  await checkout.addProductToCart('Wireless Mouse', 2);
  await checkout.proceedToCheckout();
});
```

## 5. Enterprise Configuration Patterns

### Advanced playwright.config.ts Configuration

Your Playwright configuration file is the control center for your test automation strategy. Enterprise configurations handle multiple environments, complex reporting, and team collaboration requirements.

#### 1. Multi-Environment Configuration

```typescript
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

// Environment-specific settings
const environments = {
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 30000,
    retries: 1,
    workers: 4
  },
  staging: {
    baseURL: 'https://staging.example.com',
    timeout: 60000,
    retries: 2,
    workers: 2
  },
  production: {
    baseURL: 'https://example.com',
    timeout: 90000,
    retries: 3,
    workers: 1 // Conservative for production testing
  }
};

const currentEnv = process.env.TEST_ENV || 'development';
const envConfig = environments[currentEnv as keyof typeof environments];

export default defineConfig({
  // Test discovery
  testDir: './tests',
  testMatch: '**/*.test.ts',
  testIgnore: [
    '**/node_modules/**',
    '**/test-results/**',
    '**/playwright-report/**'
  ],

  // Execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // Prevent .only() in CI
  retries: envConfig.retries,
  workers: process.env.CI ? 2 : envConfig.workers,
  
  // Global settings
  timeout: envConfig.timeout,
  globalTimeout: 15 * 60 * 1000, // 15 minutes
  expect: {
    timeout: 10000,
    toHaveScreenshot: { threshold: 0.2, mode: 'pixel' },
    toMatchSnapshot: { threshold: 0.3 }
  },

  // Base URL configuration
  use: {
    baseURL: envConfig.baseURL,
    
    // Browser settings
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: currentEnv !== 'production',
    
    // Media settings
    video: process.env.CI ? 'retain-on-failure' : 'off',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    
    // Network settings
    extraHTTPHeaders: {
      'X-Test-Environment': currentEnv,
      'X-Automation': 'playwright'
    }
  },

  // Projects for different browsers and scenarios
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testDir: './tests/e2e'
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testDir: './tests/e2e'
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testDir: './tests/e2e'
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testDir: './tests/mobile'
    },
    {
      name: 'api-tests',
      use: { headless: true },
      testDir: './tests/api',
      dependencies: [] // API tests can run independently
    }
  ],

  // Output directories (Windows-compatible paths)
  outputDir: path.join('test-results', 'artifacts'),
  reporter: [
    ['html', { outputFolder: path.join('test-results', 'html-report') }],
    ['json', { outputFile: path.join('test-results', 'results.json') }],
    ['junit', { outputFile: path.join('test-results', 'junit.xml') }],
    ...(process.env.CI ? [['github']] : [['line']])
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./tests/setup/global-setup.ts'),
  globalTeardown: require.resolve('./tests/setup/global-teardown.ts'),
  
  // Web server configuration
  webServer: currentEnv === 'development' ? {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  } : undefined
});
```

#### 2. Advanced Reporting Configuration

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    // HTML Report with custom styling
    ['html', {
      outputFolder: 'test-results\\html-report',
      open: process.env.CI ? 'never' : 'on-failure',
      host: 'localhost',
      port: 9323
    }],
    
    // Custom reporter for team notifications
    ['./tests/reporters/slack-reporter.ts'],
    
    // Allure integration for advanced reporting
    ['allure-playwright', {
      outputFolder: 'test-results\\allure-results',
      suiteTitle: 'E2E Test Suite'
    }],
    
    // JUnit for CI integration
    ['junit', {
      outputFile: 'test-results\\junit-results.xml',
      mergeReports: true,
      embedAnnotations: true
    }],
    
    // JSON for custom processing
    ['json', {
      outputFile: 'test-results\\test-results.json'
    }]
  ]
});
```

### Environment-Specific Configuration Files

#### Development Configuration

```typescript
// playwright.dev.config.ts
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  
  // Development-specific overrides
  use: {
    ...baseConfig.use,
    headless: false, // Show browser for debugging
    video: 'on', // Record all videos
    trace: 'on', // Full tracing
    slowMo: 1000 // Slow down for observation
  },
  
  workers: 1, // Sequential execution for debugging
  retries: 0, // No retries to catch issues immediately
  
  // Enable debugging tools
  reporter: [
    ['line'],
    ['html', { open: 'on-failure' }]
  ]
});
```

#### CI/CD Configuration

```typescript
// playwright.ci.config.ts
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  
  // CI-specific optimizations
  forbidOnly: true, // Prevent .only() in CI
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  retries: 3, // More retries for flaky CI environments
  
  use: {
    ...baseConfig.use,
    headless: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  
  // Comprehensive reporting for CI
  reporter: [
    ['github'], // GitHub Actions integration
    ['junit', { outputFile: 'test-results\\junit.xml' }],
    ['json', { outputFile: 'test-results\\results.json' }],
    ['html', { outputFolder: 'test-results\\html-report', open: 'never' }]
  ],
  
  // Timeout settings for CI
  timeout: 45000,
  globalTimeout: 30 * 60 * 1000, // 30 minutes
  expect: {
    timeout: 15000 // Longer waits for CI
  }
});
```

## Practical Applications

### Real-World Scenario: E-commerce Testing Suite

Let's combine all the advanced features we've learned into a comprehensive testing solution for an e-commerce application:

```typescript
// tests/fixtures/e-commerce-fixtures.ts
import { test as base } from '@playwright/test';
import { DatabaseHelper } from '../utils/database-helper';
import { APIClient } from '../utils/api-client';

type ECommerceFixtures = {
  database: DatabaseHelper;
  apiClient: APIClient;
  testStore: {
    products: any[];
    categories: any[];
    testUser: any;
  };
  authenticatedPage: any;
};

const test = base.extend<ECommerceFixtures>({
  database: async ({}, use) => {
    const db = new DatabaseHelper();
    await db.connect();
    await use(db);
    await db.cleanup();
    await db.disconnect();
  },

  apiClient: async ({ request }, use) => {
    const client = new APIClient(request);
    await client.authenticate({
      apiKey: process.env.API_KEY!,
      secret: process.env.API_SECRET!
    });
    await use(client);
  },

  testStore: async ({ database, apiClient }, use) => {
    await test.step('Setup test store data', async () => {
      const categories = await apiClient.createCategories([
        { name: 'Electronics', slug: 'electronics' },
        { name: 'Clothing', slug: 'clothing' }
      ]);

      const products = await apiClient.createProducts([
        {
          name: 'Laptop Pro 15',
          price: 1299.99,
          category: categories[0].id,
          inventory: 50
        },
        {
          name: 'Wireless Headphones',
          price: 199.99,
          category: categories[0].id,
          inventory: 100
        }
      ]);

      const testUser = await database.createUser({
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'customer'
      });

      await use({ products, categories, testUser });
    });
  },

  authenticatedPage: async ({ browser, testStore }, use) => {
    await test.step('Create authenticated user session', async () => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Perform login
      await page.goto('/login');
      await page.fill('[data-testid="email"]', testStore.testUser.email);
      await page.fill('[data-testid="password"]', 'TestPassword123!');
      await page.click('[data-testid="login-button"]');
      
      // Wait for authentication
      await page.waitForURL('/dashboard');
      
      await use(page);
      
      await context.close();
    });
  }
});

export { test };
```

### Complete Test Implementation

```typescript
// tests/e2e/complete-purchase-flow.test.ts
import { expect } from '@playwright/test';
import { test } from '../fixtures/e-commerce-fixtures';

test.describe('Complete Purchase Flow', () => {
  test('user can complete full purchase journey', async ({ 
    authenticatedPage, 
    testStore 
  }) => {
    const product = testStore.products[0];
    
    await test.step('Browse and select product', async () => {
      await authenticatedPage.goto('/products');
      await authenticatedPage.click(`[data-testid="product-${product.id}"]`);
      
      await expect(authenticatedPage.locator('h1')).toContainText(product.name);
      await expect(authenticatedPage.locator('[data-testid="price"]')).toContainText('$1,299.99');
    });
    
    await test.step('Add product to cart', async () => {
      await authenticatedPage.fill('[data-testid="quantity"]', '2');
      await authenticatedPage.click('[data-testid="add-to-cart"]');
      
      await expect(authenticatedPage.locator('[data-testid="cart-notification"]')).toBeVisible();
      await expect(authenticatedPage.locator('[data-testid="cart-count"]')).toContainText('2');
    });
    
    await test.step('Proceed through checkout', async () => {
      await authenticatedPage.click('[data-testid="cart-icon"]');
      await authenticatedPage.click('[data-testid="checkout-button"]');
      
      // Verify cart contents
      await expect(authenticatedPage.locator('[data-testid="checkout-item"]')).toContainText(product.name);
      await expect(authenticatedPage.locator('[data-testid="checkout-total"]')).toContainText('$2,599.98');
    });
    
    await test.step('Complete payment', async () => {
      // Fill payment information
      await authenticatedPage.fill('[data-testid="card-number"]', '4111111111111111');
      await authenticatedPage.fill('[data-testid="card-expiry"]', '12/25');
      await authenticatedPage.fill('[data-testid="card-cvv"]', '123');
      
      await authenticatedPage.click('[data-testid="complete-purchase"]');
      
      // Verify order confirmation
      await expect(authenticatedPage.locator('[data-testid="order-success"]')).toBeVisible();
      
      const orderNumber = await authenticatedPage.locator('[data-testid="order-number"]').textContent();
      expect(orderNumber).toMatch(/^ORDER-\d{8}$/);
    });
  });
});
```

## Summary

In this lesson, you've learned the advanced Playwright features that distinguish professional test automation from basic scripting:

### Key Takeaways

1. **Custom Fixtures**: Create reusable, maintainable test setup patterns that handle complex scenarios automatically
2. **Browser Context Management**: Configure sophisticated testing environments that simulate real user conditions
3. **Test Orchestration**: Use hooks effectively to manage shared resources and test dependencies
4. **Granular Reporting**: Implement detailed test reporting that aids debugging and stakeholder communication
5. **Enterprise Configuration**: Build scalable configuration patterns that support team collaboration and multiple environments

### Professional Applications

These advanced features enable you to:
- **Scale Test Suites**: Handle enterprise-level applications with complex setup requirements
- **Improve Reliability**: Reduce flaky tests through proper isolation and resource management
- **Enhance Debugging**: Pinpoint failures quickly with detailed reporting and tracing
- **Support Teams**: Create frameworks that multiple developers can use effectively
- **Meet Enterprise Standards**: Implement patterns that satisfy corporate quality and compliance requirements

### Next Steps

In the next lesson, we'll explore the Page Object Model (POM) design pattern, which builds upon these advanced features to create maintainable and scalable test architectures. The fixtures, contexts, and configuration patterns you've learned here will form the foundation for sophisticated POM implementations.

### Further Reading

For additional depth on these topics, explore:
- [Playwright Fixtures Documentation](https://playwright.dev/docs/test-fixtures)
- [Browser Context API Reference](https://playwright.dev/docs/api/class-browsercontext)
- [Test Configuration Guide](https://playwright.dev/docs/test-configuration)
- [Advanced Test Patterns](https://playwright.dev/docs/test-advanced)

**Remember**: Advanced features should solve real problems, not add complexity. Always choose the simplest solution that meets your requirements while maintaining maintainability and reliability.