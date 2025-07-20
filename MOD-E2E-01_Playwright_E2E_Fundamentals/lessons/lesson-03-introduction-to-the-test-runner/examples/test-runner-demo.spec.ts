import { test, expect, describe, beforeEach, afterEach, beforeAll, afterAll } from '@playwright/test';

describe('Test Runner Demonstration', () => {
  // beforeAll hook - runs once before all tests in this describe block
  beforeAll(async () => {
    console.log('🚀 beforeAll: Setting up test suite - this runs ONCE at the start');
  });

  // beforeEach hook - runs before each individual test
  beforeEach(async ({ page }) => {
    console.log('🔧 beforeEach: Setting up for individual test - this runs BEFORE each test');
    // Navigate to a test page before each test
    await page.goto('https://example.com');
  });

  // afterEach hook - runs after each individual test
  afterEach(async ({ page }) => {
    console.log('🧹 afterEach: Cleaning up after individual test - this runs AFTER each test');
    // You could add cleanup logic here, like clearing cookies or local storage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  // afterAll hook - runs once after all tests in this describe block
  afterAll(async () => {
    console.log('🏁 afterAll: Tearing down test suite - this runs ONCE at the end');
  });

  // First test - demonstrates basic test structure
  test('should demonstrate basic test structure', async ({ page }) => {
    console.log('✅ Test 1: Running first test');
    
    // Verify the page loaded correctly
    await expect(page).toHaveTitle('Example Domain');
    
    // Check that the main heading is visible
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Example Domain');
  });

  // Second test - demonstrates test independence
  test('should demonstrate test independence', async ({ page }) => {
    console.log('✅ Test 2: Running second test');
    
    // This test starts fresh thanks to beforeEach hook
    // Each test gets a clean page state
    await expect(page).toHaveURL('https://example.com/');
    
    // Verify page content
    const paragraph = page.locator('p');
    await expect(paragraph).toBeVisible();
  });

  // Third test - demonstrates async/await usage
  test('should demonstrate async/await patterns', async ({ page }) => {
    console.log('✅ Test 3: Running third test with async operations');
    
    // Multiple async operations in sequence
    await expect(page).toHaveTitle('Example Domain');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('p')).toContainText('This domain is for use in illustrative examples');
    
    // You can also use Promise.all for parallel operations
    await Promise.all([
      expect(page.locator('h1')).toBeVisible(),
      expect(page.locator('p')).toBeVisible()
    ]);
  });
});

// Nested describe blocks for better organization
describe('Advanced Test Organization', () => {
  describe('User Authentication Flow', () => {
    beforeEach(async ({ page }) => {
      console.log('🔐 Setting up authentication test environment');
      await page.goto('https://example.com');
    });

    test('should handle login scenario', async ({ page }) => {
      console.log('✅ Testing login functionality');
      // In a real application, you would test actual login functionality
      await expect(page).toHaveTitle('Example Domain');
    });

    test('should handle logout scenario', async ({ page }) => {
      console.log('✅ Testing logout functionality');
      // In a real application, you would test actual logout functionality
      await expect(page).toHaveTitle('Example Domain');
    });
  });

  describe('Data Management', () => {
    beforeEach(async ({ page }) => {
      console.log('📊 Setting up data management test environment');
      await page.goto('https://example.com');
    });

    test('should create new data', async ({ page }) => {
      console.log('✅ Testing data creation');
      await expect(page).toHaveTitle('Example Domain');
    });

    test('should update existing data', async ({ page }) => {
      console.log('✅ Testing data updates');
      await expect(page).toHaveTitle('Example Domain');
    });
  });
});

// Demonstration of test modifiers
describe('Test Modifiers Demo', () => {
  // Regular test that will run
  test('should run normally', async ({ page }) => {
    console.log('✅ This test runs normally');
    await page.goto('https://example.com');
    await expect(page).toHaveTitle('Example Domain');
  });

  // Skipped test - will not run
  test.skip('should be skipped during execution', async ({ page }) => {
    console.log('❌ This test is skipped and will not run');
    // This code won't execute because of .skip
    await page.goto('https://example.com');
  });

  // Only test - if uncommented, only this test would run
  // test.only('should run exclusively when .only is used', async ({ page }) => {
  //   console.log('🎯 This test runs exclusively when .only is used');
  //   await page.goto('https://example.com');
  //   await expect(page).toHaveTitle('Example Domain');
  // });

  test('should also run normally', async ({ page }) => {
    console.log('✅ This test also runs normally');
    await page.goto('https://example.com');
    await expect(page).toHaveTitle('Example Domain');
  });
});

// Example showing execution order with console logs
describe('Execution Order Visualization', () => {
  beforeAll(() => {
    console.log('📋 EXECUTION ORDER: 1. beforeAll - runs once at start');
  });

  beforeEach(() => {
    console.log('📋 EXECUTION ORDER: 2. beforeEach - runs before each test');
  });

  afterEach(() => {
    console.log('📋 EXECUTION ORDER: 4. afterEach - runs after each test');
  });

  afterAll(() => {
    console.log('📋 EXECUTION ORDER: 5. afterAll - runs once at end');
  });

  test('first execution order test', async ({ page }) => {
    console.log('📋 EXECUTION ORDER: 3a. First test executing');
    await page.goto('https://example.com');
    await expect(page).toHaveTitle('Example Domain');
  });

  test('second execution order test', async ({ page }) => {
    console.log('📋 EXECUTION ORDER: 3b. Second test executing');
    await page.goto('https://example.com');
    await expect(page).toHaveTitle('Example Domain');
  });
});