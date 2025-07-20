import { defineConfig, devices } from '@playwright/test';

/**
 * Basic Playwright Configuration Example
 * This configuration demonstrates essential settings for a Playwright project
 * with both E2E and API testing capabilities.
 */
export default defineConfig({
  // Test directory - where your test files are located
  testDir: './tests',
  
  // Run tests in files in parallel for faster execution
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI for stability
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration - generates HTML reports by default
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  // Global test timeout (30 seconds)
  timeout: 30000,
  
  // Expect timeout for assertions (5 seconds)
  expect: {
    timeout: 5000
  },
  
  // Shared settings for all projects
  use: {
    // Base URL for navigation actions like await page.goto('/')
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying failed tests
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Global action timeout (10 seconds)
    actionTimeout: 10000,
    
    // Global navigation timeout (30 seconds)
    navigationTimeout: 30000,
  },

  // Configure projects for different browsers and test types
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chrome-specific launch options
        launchOptions: {
          args: ['--disable-web-security']
        }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Firefox-specific preferences
        launchOptions: {
          firefoxUserPrefs: {
            'media.navigator.streams.fake': true
          }
        }
      },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
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

    // API testing project (no browser needed)
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        // API tests don't need a browser
        baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      },
    },
  ],

  // Web server configuration for local development
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },
});