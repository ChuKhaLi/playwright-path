// MOD-04 Lesson 09: Advanced Allure Framework Integration
// Example: Complete Allure integration with rich metadata and custom reporting

import { test, expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import * as fs from 'fs/promises';
import * as path from 'path';

// Custom test metadata interface
interface TestMetadata {
  epic: string;
  feature: string;
  story: string;
  severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';
  tags: string[];
  owner: string;
  testId?: string;
  requirements?: string[];
}

/**
 * Advanced Allure Test Helper
 * Provides comprehensive test reporting with rich metadata
 */
class AllureTestHelper {
  /**
   * Setup test with comprehensive metadata
   */
  static async setupTest(metadata: TestMetadata): Promise<void> {
    await allure.epic(metadata.epic);
    await allure.feature(metadata.feature);
    await allure.story(metadata.story);
    await allure.severity(metadata.severity);
    await allure.owner(metadata.owner);
    
    // Add tags
    for (const tag of metadata.tags) {
      await allure.tag(tag);
    }
    
    // Add test ID if provided
    if (metadata.testId) {
      await allure.label('testId', metadata.testId);
    }
    
    // Add requirement links
    if (metadata.requirements) {
      for (const req of metadata.requirements) {
        await allure.link(req, `Requirements: ${req}`, 'requirement');
      }
    }
    
    // Add environment context
    await this.addEnvironmentContext();
  }
  
  /**
   * Add comprehensive environment information
   */
  private static async addEnvironmentContext(): Promise<void> {
    const viewport = await page.viewportSize();
    
    await allure.parameter('Environment', process.env.NODE_ENV || 'test');
    await allure.parameter('Browser', page.context().browser()?.browserType().name() || 'unknown');
    await allure.parameter('Viewport', `${viewport?.width}x${viewport?.height}`);
    await allure.parameter('User Agent', await page.evaluate(() => navigator.userAgent));
    await allure.parameter('Timestamp', new Date().toISOString());
    await allure.parameter('Build Number', process.env.BUILD_NUMBER || 'local');
    await allure.parameter('Git Branch', process.env.GIT_BRANCH || 'main');
  }
  
  /**
   * Execute step with automatic error handling and screenshot capture
   */
  static async executeStep<T>(
    stepName: string,
    action: () => Promise<T>,
    captureScreenshot: boolean = false
  ): Promise<T> {
    return await allure.step(stepName, async () => {
      try {
        const result = await action();
        
        if (captureScreenshot) {
          await this.captureScreenshot(`${stepName} - Success`);
        }
        
        return result;
      } catch (error) {
        // Always capture screenshot on failure
        await this.captureScreenshot(`${stepName} - Failure`);
        
        // Attach additional debugging information
        await this.attachDebugInfo(error);
        
        throw error;
      }
    });
  }
  
  /**
   * Capture and attach screenshot with metadata
   */
  static async captureScreenshot(description: string): Promise<void> {
    try {
      const screenshot = await page.screenshot({
        fullPage: true,
        type: 'png'
      });
      
      await allure.attachment(description, screenshot, 'image/png');
    } catch (error) {
      console.warn('Failed to capture screenshot:', error);
    }
  }
  
  /**
   * Attach comprehensive debugging information
   */
  static async attachDebugInfo(error: any): Promise<void> {
    // Attach error details
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: page.url(),
      title: await page.title().catch(() => 'Unknown')
    };
    
    await allure.attachment(
      'Error Details',
      JSON.stringify(errorInfo, null, 2),
      'application/json'
    );
    
    // Attach page source
    try {
      const pageSource = await page.content();
      await allure.attachment('Page Source', pageSource, 'text/html');
    } catch (sourceError) {
      console.warn('Failed to capture page source:', sourceError);
    }
    
    // Attach console logs if available
    await this.attachConsoleLogs();
    
    // Attach network information
    await this.attachNetworkInfo();
  }
  
  /**
   * Attach console logs from browser
   */
  private static async attachConsoleLogs(): Promise<void> {
    try {
      const logs = await page.evaluate(() => {
        // Get console logs if they were captured
        return (window as any).__consoleLogs || [];
      });
      
      if (logs.length > 0) {
        await allure.attachment(
          'Console Logs',
          JSON.stringify(logs, null, 2),
          'application/json'
        );
      }
    } catch (error) {
      console.warn('Failed to capture console logs:', error);
    }
  }
  
  /**
   * Attach network request information
   */
  private static async attachNetworkInfo(): Promise<void> {
    try {
      const networkRequests = await page.evaluate(() => {
        // Get network requests if they were captured
        return (window as any).__networkRequests || [];
      });
      
      if (networkRequests.length > 0) {
        await allure.attachment(
          'Network Requests',
          JSON.stringify(networkRequests, null, 2),
          'application/json'
        );
      }
    } catch (error) {
      console.warn('Failed to capture network info:', error);
    }
  }
  
  /**
   * Add custom issue link
   */
  static async addIssueLink(issueId: string, issueUrl?: string): Promise<void> {
    const url = issueUrl || `${process.env.JIRA_BASE_URL}/browse/${issueId}`;
    await allure.issue(issueId, url);
  }
  
  /**
   * Add test management system link
   */
  static async addTestCaseLink(testCaseId: string, systemUrl?: string): Promise<void> {
    const url = systemUrl || `${process.env.TMS_BASE_URL}/testcase/${testCaseId}`;
    await allure.tms(testCaseId, url);
  }
}

// Example test suite with comprehensive Allure integration
test.describe('E-commerce Advanced Testing Suite', () => {
  let page: Page;
  
  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Setup request/response interception for network monitoring
    await page.route('**/*', async (route) => {
      const request = route.request();
      await route.continue();
      
      // Store network request information
      await page.evaluate((reqData) => {
        (window as any).__networkRequests = (window as any).__networkRequests || [];
        (window as any).__networkRequests.push(reqData);
      }, {
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        timestamp: new Date().toISOString()
      });
    });
    
    // Setup console log capturing
    page.on('console', (msg) => {
      page.evaluate((logData) => {
        (window as any).__consoleLogs = (window as any).__consoleLogs || [];
        (window as any).__consoleLogs.push(logData);
      }, {
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    });
  });
  
  test('Complete user registration and profile setup', async () => {
    // Setup comprehensive test metadata
    await AllureTestHelper.setupTest({
      epic: 'User Management',
      feature: 'Registration',
      story: 'New User Onboarding',
      severity: 'critical',
      tags: ['smoke', 'registration', 'user-flow', 'critical-path'],
      owner: 'qa-team@company.com',
      testId: 'TC-001',
      requirements: ['REQ-101', 'REQ-102', 'REQ-103']
    });
    
    // Add issue and test case links
    await AllureTestHelper.addIssueLink('JIRA-123');
    await AllureTestHelper.addTestCaseLink('TC-001');
    
    // Execute test steps with comprehensive reporting
    await AllureTestHelper.executeStep(
      'Navigate to registration page',
      async () => {
        await page.goto('/register');
        await expect(page.locator('h1')).toContainText('Create Account');
      },
      true // Capture screenshot
    );
    
    await AllureTestHelper.executeStep(
      'Fill registration form with valid data',
      async () => {
        await page.fill('[data-testid="email"]', 'user@example.com');
        await page.fill('[data-testid="password"]', 'SecurePass123!');
        await page.fill('[data-testid="confirm-password"]', 'SecurePass123!');
        await page.fill('[data-testid="first-name"]', 'John');
        await page.fill('[data-testid="last-name"]', 'Doe');
        await page.check('[data-testid="terms-checkbox"]');
      }
    );
    
    await AllureTestHelper.executeStep(
      'Submit registration form',
      async () => {
        await page.click('[data-testid="register-button"]');
        await expect(page.locator('[data-testid="success-message"]'))
          .toContainText('Registration successful');
      },
      true
    );
    
    await AllureTestHelper.executeStep(
      'Verify email confirmation page',
      async () => {
        await expect(page.locator('h2'))
          .toContainText('Check Your Email');
        await expect(page.locator('[data-testid="confirmation-message"]'))
          .toContainText('verification link has been sent');
      }
    );
    
    await AllureTestHelper.executeStep(
      'Navigate to profile setup',
      async () => {
        // Simulate email verification (in real test, you'd handle email)
        await page.goto('/profile/setup?verified=true');
        await expect(page.locator('h1')).toContainText('Complete Your Profile');
      }
    );
    
    await AllureTestHelper.executeStep(
      'Complete profile information',
      async () => {
        await page.fill('[data-testid="phone"]', '+1234567890');
        await page.selectOption('[data-testid="country"]', 'US');
        await page.fill('[data-testid="address"]', '123 Main St');
        await page.fill('[data-testid="city"]', 'New York');
        await page.selectOption('[data-testid="state"]', 'NY');
        await page.fill('[data-testid="zipcode"]', '10001');
      }
    );
    
    await AllureTestHelper.executeStep(
      'Upload profile picture',
      async () => {
        // Create a test image file
        const testImagePath = path.join(__dirname, 'test-assets', 'profile.png');
        await page.setInputFiles('[data-testid="profile-picture"]', testImagePath);
        
        await expect(page.locator('[data-testid="upload-preview"]'))
          .toBeVisible();
      }
    );
    
    await AllureTestHelper.executeStep(
      'Save profile and verify completion',
      async () => {
        await page.click('[data-testid="save-profile-button"]');
        
        await expect(page.locator('[data-testid="profile-complete-message"]'))
          .toContainText('Profile setup complete');
        
        // Verify user is redirected to dashboard
        await expect(page).toHaveURL(/.*\/dashboard/);
        await expect(page.locator('[data-testid="welcome-message"]'))
          .toContainText('Welcome, John!');
      },
      true
    );
    
    // Add final success screenshot and summary
    await AllureTestHelper.captureScreenshot('Registration Flow - Complete');
    
    // Add custom attachment with test summary
    const testSummary = {
      testName: 'Complete user registration and profile setup',
      duration: Date.now() - test.info().startTime,
      steps: 7,
      outcome: 'passed',
      userEmail: 'user@example.com',
      profileComplete: true
    };
    
    await allure.attachment(
      'Test Summary',
      JSON.stringify(testSummary, null, 2),
      'application/json'
    );
  });
  
  test('Shopping cart functionality with payment integration', async () => {
    await AllureTestHelper.setupTest({
      epic: 'E-commerce',
      feature: 'Shopping Cart',
      story: 'Complete Purchase Flow',
      severity: 'critical',
      tags: ['checkout', 'payment', 'cart', 'integration'],
      owner: 'qa-team@company.com',
      testId: 'TC-002',
      requirements: ['REQ-201', 'REQ-202', 'REQ-203']
    });
    
    // Login first
    await AllureTestHelper.executeStep(
      'Login with existing user',
      async () => {
        await page.goto('/login');
        await page.fill('[data-testid="email"]', 'user@example.com');
        await page.fill('[data-testid="password"]', 'SecurePass123!');
        await page.click('[data-testid="login-button"]');
        
        await expect(page).toHaveURL(/.*\/dashboard/);
      }
    );
    
    await AllureTestHelper.executeStep(
      'Browse and add products to cart',
      async () => {
        await page.goto('/products');
        
        // Add first product
        await page.click('[data-testid="product-1"] [data-testid="add-to-cart"]');
        await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
        
        // Add second product with quantity
        await page.click('[data-testid="product-2"]');
        await page.fill('[data-testid="quantity"]', '2');
        await page.click('[data-testid="add-to-cart"]');
        
        // Verify cart count
        await expect(page.locator('[data-testid="cart-count"]')).toHaveText('3');
      },
      true
    );
    
    await AllureTestHelper.executeStep(
      'Review cart contents',
      async () => {
        await page.click('[data-testid="cart-icon"]');
        
        await expect(page.locator('[data-testid="cart-item-1"]')).toBeVisible();
        await expect(page.locator('[data-testid="cart-item-2"]')).toBeVisible();
        await expect(page.locator('[data-testid="cart-total"]'))
          .toContainText('$');
      }
    );
    
    await AllureTestHelper.executeStep(
      'Proceed to checkout',
      async () => {
        await page.click('[data-testid="checkout-button"]');
        await expect(page.locator('h1')).toContainText('Checkout');
        
        // Verify order summary
        await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
      }
    );
    
    await AllureTestHelper.executeStep(
      'Fill shipping information',
      async () => {
        await page.fill('[data-testid="shipping-address"]', '456 Oak Ave');
        await page.fill('[data-testid="shipping-city"]', 'Boston');
        await page.selectOption('[data-testid="shipping-state"]', 'MA');
        await page.fill('[data-testid="shipping-zipcode"]', '02101');
        
        await page.selectOption('[data-testid="shipping-method"]', 'standard');
      }
    );
    
    await AllureTestHelper.executeStep(
      'Complete payment information',
      async () => {
        await page.fill('[data-testid="card-number"]', '4111111111111111');
        await page.fill('[data-testid="card-expiry"]', '12/25');
        await page.fill('[data-testid="card-cvv"]', '123');
        await page.fill('[data-testid="card-name"]', 'John Doe');
        
        // Verify payment form validation
        await expect(page.locator('[data-testid="payment-form"]')).toHaveClass(/valid/);
      }
    );
    
    await AllureTestHelper.executeStep(
      'Submit order and verify confirmation',
      async () => {
        await page.click('[data-testid="place-order-button"]');
        
        // Wait for order processing
        await expect(page.locator('[data-testid="processing-indicator"]'))
          .toBeVisible();
        
        // Verify order confirmation
        await expect(page.locator('[data-testid="order-confirmation"]'))
          .toBeVisible({ timeout: 10000 });
        
        const orderNumber = await page.locator('[data-testid="order-number"]').textContent();
        await allure.parameter('Order Number', orderNumber || 'N/A');
        
        await expect(page.locator('[data-testid="success-message"]'))
          .toContainText('Order placed successfully');
      },
      true
    );
    
    // Add comprehensive test completion data
    const orderSummary = {
      testName: 'Shopping cart functionality with payment integration',
      itemsInCart: 3,
      paymentMethod: 'Credit Card',
      orderCompleted: true,
      timestamp: new Date().toISOString()
    };
    
    await allure.attachment(
      'Order Summary',
      JSON.stringify(orderSummary, null, 2),
      'application/json'
    );
  });
});

/**
 * Allure Environment Configuration
 * Call this in your test setup to generate environment.properties
 */
export async function generateAllureEnvironment(): Promise<void> {
  const environmentData = {
    'Test Framework': 'Playwright',
    'Language': 'TypeScript',
    'Node Version': process.version,
    'OS': process.platform,
    'Browser': 'chromium', // This could be dynamic
    'Environment': process.env.NODE_ENV || 'test',
    'Build Number': process.env.BUILD_NUMBER || 'local',
    'Git Branch': process.env.GIT_BRANCH || 'main',
    'Git Commit': process.env.GIT_COMMIT || 'unknown',
    'Test Execution Date': new Date().toISOString(),
    'Base URL': process.env.BASE_URL || 'http://localhost:3000'
  };
  
  const environmentContent = Object.entries(environmentData)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  await fs.writeFile(
    path.join(process.cwd(), 'allure-results', 'environment.properties'),
    environmentContent
  );
}

/**
 * Custom Allure Categories Configuration
 */
export const allureCategories = [
  {
    name: 'Critical Test Failures',
    matchedStatuses: ['failed'],
    traceRegex: '.*critical.*'
  },
  {
    name: 'Authentication Issues',
    matchedStatuses: ['failed'],
    traceRegex: '.*(login|auth|credential).*'
  },
  {
    name: 'Payment Processing Failures',
    matchedStatuses: ['failed'],
    traceRegex: '.*(payment|checkout|cart).*'
  },
  {
    name: 'Network Related Issues',
    matchedStatuses: ['failed'],
    traceRegex: '.*(timeout|network|connection).*'
  },
  {
    name: 'UI Element Not Found',
    matchedStatuses: ['failed'],
    traceRegex: '.*(locator|element|selector).*'
  }
];