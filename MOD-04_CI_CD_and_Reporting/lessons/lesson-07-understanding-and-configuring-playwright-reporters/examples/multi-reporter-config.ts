/**
 * Multi-Reporter Configuration Example
 * Demonstrates how to configure multiple reporters for different stakeholders and environments
 */

import { defineConfig, devices } from '@playwright/test';

// Environment-specific reporter configuration
function getReporters() {
  const baseReporters = [
    // JSON reporter for data processing and metrics
    ['json', { 
      outputFile: 'reports/results.json',
      includeTimings: true,
      includeAttachments: true
    }]
  ];

  if (process.env.CI) {
    // CI/CD environment - focus on integration and automation
    return [
      ...baseReporters,
      
      // JUnit for CI/CD system integration
      ['junit', {
        outputFile: 'reports/junit-results.xml',
        includeProjectInTestName: true,
        testSuiteName: 'Playwright E2E Tests',
        includeSystemProperties: true,
        stripANSIControlSequences: true
      }],
      
      // GitHub Actions integration
      ['github'],
      
      // Line reporter for clean terminal output
      ['line'],
      
      // Custom CI reporter for deployment metrics
      ['./reporters/ci-metrics-reporter.ts', {
        endpoint: process.env.METRICS_ENDPOINT,
        apiKey: process.env.METRICS_API_KEY,
        environment: process.env.ENVIRONMENT || 'ci'
      }]
    ];
    
  } else if (process.env.NODE_ENV === 'development') {
    // Local development - focus on debugging and visibility
    return [
      ...baseReporters,
      
      // HTML reporter with full debugging features
      ['html', {
        outputFolder: 'reports/html',
        open: 'on-failure', // Open automatically on failures
        host: 'localhost',
        port: 9323,
        
        attachments: {
          mode: 'on-failure',
          screenshot: 'only-on-failure',
          video: 'retain-on-failure',
          trace: 'retain-on-failure'
        },
        
        // Development-friendly options
        showPassedTests: true,
        showSkippedTests: true,
        showSlowTests: true,
        slowTestThreshold: 10000
      }],
      
      // List reporter for detailed terminal output
      ['list'],
      
      // Custom developer reporter for local insights
      ['./reporters/dev-insights-reporter.ts']
    ];
    
  } else {
    // Production/staging - focus on monitoring and alerts
    return [
      ...baseReporters,
      
      // HTML reporter for post-execution analysis
      ['html', {
        outputFolder: 'reports/html',
        open: 'never',
        
        attachments: {
          mode: 'on-failure',
          screenshot: 'only-on-failure',
          video: 'retain-on-failure',
          trace: 'retain-on-failure'
        },
        
        // Production optimizations
        showPassedTests: false, // Hide passed tests to reduce size
        showSkippedTests: false,
        showSlowTests: true,
        slowTestThreshold: 5000
      }],
      
      // Dot reporter for minimal output
      ['dot'],
      
      // Monitoring and alerting reporters
      ['./reporters/monitoring-reporter.ts', {
        endpoint: process.env.MONITORING_ENDPOINT,
        apiKey: process.env.MONITORING_API_KEY,
        environment: process.env.ENVIRONMENT || 'production'
      }],
      
      ['./reporters/slack-reporter.ts', {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        onlyOnFailures: true,
        mentionOnFailures: ['@qa-team', '@oncall'],
        channel: '#alerts'
      }]
    ];
  }
}

export default defineConfig({
  testDir: './tests',
  
  // Use dynamic reporter configuration
  reporter: getReporters(),
  
  // Global test configuration
  timeout: 30000,
  expect: { timeout: 5000 },
  
  // Retry configuration
  retries: process.env.CI ? 2 : 0,
  
  // Worker configuration
  workers: process.env.CI ? 4 : 2,
  
  // Global test options
  use: {
    // Base URL configuration
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Browser configuration
    headless: process.env.CI ? true : false,
    
    // Media capture settings - optimized per environment
    screenshot: process.env.CI ? 'only-on-failure' : 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'retain-on-failure',
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    // Network configuration
    ignoreHTTPSErrors: true,
    
    // Viewport configuration
    viewport: { width: 1280, height: 720 },
  },

  // Project configuration for different browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chrome-specific reporter settings
        contextOptions: {
          recordVideo: {
            dir: 'reports/videos/chromium',
            size: { width: 1280, height: 720 }
          }
        }
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        contextOptions: {
          recordVideo: {
            dir: 'reports/videos/firefox',
            size: { width: 1280, height: 720 }
          }
        }
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        contextOptions: {
          recordVideo: {
            dir: 'reports/videos/webkit',
            size: { width: 1280, height: 720 }
          }
        }
      },
    },

    // Mobile testing projects
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        contextOptions: {
          recordVideo: {
            dir: 'reports/videos/mobile-chrome',
            size: { width: 393, height: 851 }
          }
        }
      },
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        contextOptions: {
          recordVideo: {
            dir: 'reports/videos/mobile-safari',
            size: { width: 390, height: 844 }
          }
        }
      },
    },
  ],

  // Output directory configuration
  outputDir: 'test-results/',
  
  // Global setup and teardown
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  
  // Web server configuration (if needed)
  webServer: process.env.CI ? undefined : {
    command: 'npm run start:test',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

/**
 * Usage Examples:
 * 
 * Development:
 * NODE_ENV=development npx playwright test
 * 
 * CI/CD:
 * CI=true ENVIRONMENT=staging npx playwright test
 * 
 * Production:
 * ENVIRONMENT=production MONITORING_ENDPOINT=https://metrics.company.com npx playwright test
 */