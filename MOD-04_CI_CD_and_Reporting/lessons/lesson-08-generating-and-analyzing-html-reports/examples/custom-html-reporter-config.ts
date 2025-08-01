// custom-html-reporter-config.ts
/**
 * Advanced HTML Reporter Configuration Example
 * 
 * This example demonstrates comprehensive HTML reporter setup with:
 * - Environment-aware configuration
 * - Custom branding and themes
 * - Performance optimization
 * - Multi-environment support
 */

import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

// Environment configuration
const environment = process.env.NODE_ENV || 'development';
const isCI = !!process.env.CI;
const buildNumber = process.env.BUILD_NUMBER || 'local';
const gitCommit = process.env.GIT_COMMIT?.substring(0, 7) || 'unknown';

export default defineConfig({
  testDir: './tests',
  
  // Global test configuration
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  
  // Enhanced HTML reporter configuration
  reporter: [
    // Console reporter for real-time feedback
    ['list'],
    
    // Advanced HTML reporter with custom configuration
    ['html', {
      // Output configuration
      outputFolder: `./test-results/html-report-${environment}`,
      open: isCI ? 'never' : 'on-failure',
      
      // Server configuration for report viewing
      host: isCI ? '0.0.0.0' : 'localhost',
      port: parseInt(process.env.HTML_REPORT_PORT || '9323'),
      
      // Asset management
      attachmentsBaseURL: process.env.ATTACHMENTS_BASE_URL || undefined,
      
      // Custom report metadata
      reportTitle: `QA Automation Results - ${environment.toUpperCase()}`,
      
      // Enhanced attachment handling
      attachmentsDir: './test-results/attachments',
      
      // Performance optimizations
      maxAttachmentSize: 50 * 1024 * 1024, // 50MB limit
      
      // Custom options for theme and branding
      customOptions: {
        environment,
        buildNumber,
        gitCommit,
        projectName: 'E-Commerce Platform',
        teamName: 'QA Automation Team',
        reportUrl: process.env.REPORT_URL,
        
        // Theme configuration
        theme: {
          primaryColor: '#1a365d',
          secondaryColor: '#2d3748',
          successColor: '#38a169',
          warningColor: '#d69e2e',
          errorColor: '#e53e3e',
          backgroundColor: '#f7fafc'
        },
        
        // Logo configuration
        branding: {
          logoUrl: './assets/company-logo.svg',
          companyName: 'TechCorp Solutions',
          reportFooter: `Generated on ${new Date().toISOString()}`
        },
        
        // Integration settings
        integrations: {
          jira: {
            enabled: !!process.env.JIRA_BASE_URL,
            baseUrl: process.env.JIRA_BASE_URL,
            projectKey: process.env.JIRA_PROJECT_KEY
          },
          slack: {
            enabled: !!process.env.SLACK_WEBHOOK_URL,
            webhookUrl: process.env.SLACK_WEBHOOK_URL,
            channel: process.env.SLACK_CHANNEL || '#qa-automation'
          },
          testRail: {
            enabled: !!process.env.TESTRAIL_URL,
            baseUrl: process.env.TESTRAIL_URL,
            projectId: process.env.TESTRAIL_PROJECT_ID
          }
        }
      }
    }],
    
    // JUnit reporter for CI/CD integration
    ['junit', { 
      outputFile: `./test-results/junit-${environment}.xml` 
    }],
    
    // JSON reporter for data analysis
    ['json', { 
      outputFile: `./test-results/results-${environment}.json` 
    }]
  ],

  // Enhanced test configuration for better reporting
  use: {
    // Screenshot configuration
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    
    // Video recording
    video: {
      mode: isCI ? 'retain-on-failure' : 'off',
      size: { width: 1280, height: 720 }
    },
    
    // Trace collection for debugging
    trace: {
      mode: isCI ? 'retain-on-failure' : 'on-first-retry',
      screenshots: true,
      snapshots: true,
      sources: true
    },
    
    // Enhanced context options
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Improved error handling
    actionTimeout: 30000,
    navigationTimeout: 30000,
    
    // Custom user agent for tracking
    userAgent: `PlaywrightTests/${buildNumber} (${environment})`
  },

  // Multi-browser testing projects
  projects: [
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit-desktop',  
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'chrome-mobile',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'safari-mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web server for local development
  webServer: isCI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // Global setup and teardown
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
});

/**
 * Post-processing function to enhance HTML report
 * Call this after test execution to add custom enhancements
 */
export async function enhanceHTMLReport(): Promise<void> {
  const reportPath = `./test-results/html-report-${environment}`;
  
  try {
    // Copy custom assets
    await copyCustomAssets(reportPath);
    
    // Inject custom CSS and JavaScript
    await injectCustomizations(reportPath);
    
    // Generate summary analytics
    await generateAnalytics(reportPath);
    
    console.log('✅ HTML report enhanced successfully');
  } catch (error) {
    console.error('❌ Failed to enhance HTML report:', error);
  }
}

async function copyCustomAssets(reportPath: string): Promise<void> {
  const fs = require('fs').promises;
  const assetsDir = path.join(reportPath, 'assets');
  
  // Ensure assets directory exists
  await fs.mkdir(assetsDir, { recursive: true });
  
  // Copy custom theme files
  const customThemePath = './test-config/html-report-theme.css';
  const customScriptPath = './test-config/html-report-enhancements.js';
  const logoPath = './assets/company-logo.svg';
  
  try {
    await fs.copyFile(customThemePath, path.join(assetsDir, 'custom-theme.css'));
    await fs.copyFile(customScriptPath, path.join(assetsDir, 'custom-enhancements.js'));
    await fs.copyFile(logoPath, path.join(assetsDir, 'company-logo.svg'));
  } catch (error) {
    console.warn('Some custom assets could not be copied:', error.message);
  }
}

async function injectCustomizations(reportPath: string): Promise<void> {
  const fs = require('fs').promises;
  const indexPath = path.join(reportPath, 'index.html');
  
  try {
    let htmlContent = await fs.readFile(indexPath, 'utf-8');
    
    // Inject custom CSS
    const customCSS = `
      <link rel="stylesheet" href="assets/custom-theme.css">
      <style>
        .report-header {
          background: linear-gradient(135deg, #1a365d, #2d3748);
          color: white;
          padding: 1rem 2rem;
          margin-bottom: 2rem;
        }
        
        .build-info {
          font-size: 0.9em;
          opacity: 0.9;
        }
        
        .environment-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8em;
          font-weight: bold;
          margin-left: 1rem;
        }
        
        .environment-production { background: #e53e3e; color: white; }
        .environment-staging { background: #d69e2e; color: white; }
        .environment-development { background: #38a169; color: white; }
      </style>
    `;
    
    // Inject custom JavaScript
    const customJS = `
      <script src="assets/custom-enhancements.js"></script>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          // Add environment badge
          const header = document.querySelector('h1');
          if (header) {
            const badge = document.createElement('span');
            badge.className = 'environment-badge environment-${environment}';
            badge.textContent = '${environment.toUpperCase()}';
            header.appendChild(badge);
          }
          
          // Add build information
          const buildInfo = document.createElement('div');
          buildInfo.className = 'build-info';
          buildInfo.innerHTML = \`
            <strong>Build:</strong> ${buildNumber} | 
            <strong>Commit:</strong> ${gitCommit} | 
            <strong>Generated:</strong> \${new Date().toLocaleString()}
          \`;
          
          const container = document.querySelector('.container') || document.body;
          container.insertBefore(buildInfo, container.firstChild);
        });
      </script>
    `;
    
    // Insert customizations before closing head tag
    htmlContent = htmlContent.replace('</head>', customCSS + customJS + '</head>');
    
    await fs.writeFile(indexPath, htmlContent);
  } catch (error) {
    console.warn('Could not inject customizations:', error.message);
  }
}

async function generateAnalytics(reportPath: string): Promise<void> {
  // This would integrate with the HTMLReportAnalyzer from the content
  console.log('📊 Generating analytics for report at:', reportPath);
  
  // Implementation would use the HTMLReportAnalyzer class
  // to generate insights and trends
}