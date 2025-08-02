# Example 01: Basic Report Configuration

## Overview

This example demonstrates how to configure multiple Cucumber reporters to generate comprehensive test documentation in various formats. You'll learn to set up HTML, JSON, and JUnit XML reports that form the foundation of living documentation systems.

**Duration**: 30 minutes  
**Complexity**: Beginner  
**Prerequisites**: Basic Cucumber.js setup with at least 5 test scenarios  

---

## Learning Objectives

By completing this example, you will understand:

- ✅ **Multi-Reporter Configuration**: Set up multiple Cucumber reporters simultaneously
- ✅ **Report Format Understanding**: Learn the structure and purpose of different report formats
- ✅ **Basic Customization**: Configure reporter options for enhanced output
- ✅ **CI/CD Integration**: Prepare reports for continuous integration pipeline usage
- ✅ **File Organization**: Establish proper directory structure for report management

---

## Project Setup

### 1. Install Required Dependencies

First, install the necessary reporting packages:

```bash
# Core reporting dependencies
npm install --save-dev cucumber-html-reporter
npm install --save-dev multiple-cucumber-html-reporter
npm install --save-dev cucumber-junit-reporter
npm install --save-dev cucumber-pretty-reporter

# Additional utilities
npm install --save-dev fs-extra
npm install --save-dev moment
npm install --save-dev rimraf
```

### 2. Project Structure

Organize your project with proper report directory structure:

```
project-root/
├── features/
│   ├── authentication.feature
│   ├── product-catalog.feature
│   └── checkout.feature
├── src/
│   ├── steps/
│   └── support/
├── reports/                    # New reporting directory
│   ├── html/                  # HTML reports
│   ├── json/                  # JSON data files
│   ├── junit/                 # JUnit XML reports
│   ├── archive/               # Historical reports
│   └── assets/                # Stylesheets, images, etc.
├── scripts/
│   └── generate-reports.js    # Report generation script
├── cucumber.js                # Cucumber configuration
└── package.json
```

---

## Configuration Examples

### 1. Basic Cucumber Configuration

Update your [`cucumber.js`](../../../lesson-02-setting-up-cucumber-with-typescript-and-playwright/examples/01-cucumber-typescript-setup.md:15) configuration:

```javascript
// cucumber.js
const { setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(30000);

module.exports = {
  default: {
    // Feature file locations
    paths: ['features/**/*.feature'],
    
    // Step definition locations
    require: [
      'src/steps/**/*.ts',
      'src/support/**/*.ts'
    ],
    
    // Multiple reporter configuration
    format: [
      // Built-in pretty formatter for console output
      '@cucumber/pretty-formatter',
      
      // JSON output for custom report generation
      'json:reports/json/cucumber-report.json',
      
      // JUnit XML for CI/CD integration
      'junit:reports/junit/cucumber-results.xml',
      
      // HTML formatter (if using cucumber-html-formatter)
      'html:reports/html/cucumber-report.html'
    ],
    
    // Additional options
    formatOptions: {
      snippetInterface: 'async-await',
      snippetSyntax: 'typescript'
    },
    
    // Require modules (for TypeScript support)
    requireModule: ['ts-node/register'],
    
    // World parameters
    worldParameters: {
      reportPath: 'reports/'
    }
  }
};
```

### 2. Enhanced HTML Report Generation

Create a custom report generation script:

```javascript
// scripts/generate-reports.js
const report = require('multiple-cucumber-html-reporter');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

/**
 * Generate enhanced HTML reports with custom branding and metadata
 */
async function generateHTMLReports() {
  // Ensure report directories exist
  await fs.ensureDir('reports/html');
  await fs.ensureDir('reports/archive');
  
  // Get build information
  const buildInfo = {
    number: process.env.BUILD_NUMBER || 'local',
    url: process.env.BUILD_URL || 'N/A',
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    environment: process.env.NODE_ENV || 'development',
    branch: process.env.GIT_BRANCH || 'unknown'
  };

  // Report configuration
  const reportOptions = {
    // Input JSON file
    jsonDir: 'reports/json/',
    
    // Output directory
    reportPath: 'reports/html/',
    
    // Report metadata
    metadata: {
      browser: {
        name: 'chrome',
        version: '120.0'
      },
      device: 'Desktop',
      platform: {
        name: process.platform,
        version: require('os').release()
      }
    },
    
    // Custom data
    customData: {
      title: 'E-commerce Test Automation Report',
      data: [
        { label: 'Project', value: 'TechShop E-commerce Platform' },
        { label: 'Release', value: 'v2.1.0' },
        { label: 'Execution Start Time', value: buildInfo.timestamp },
        { label: 'Environment', value: buildInfo.environment.toUpperCase() },
        { label: 'Build Number', value: buildInfo.number },
        { label: 'Branch', value: buildInfo.branch }
      ]
    },
    
    // Report customization
    customStyle: 'reports/assets/custom-report-style.css',
    reportSuiteAsScenarios: true,
    launchReport: process.env.LAUNCH_REPORT === 'true',
    
    // Page title
    pageTitle: 'BDD Test Execution Report',
    reportName: 'Cucumber Test Results',
    
    // Display options
    displayDuration: true,
    displayReportTime: true,
    
    // Custom footer
    customDataTitle: 'Execution Information',
    
    // Hide elements (optional)
    hideMetadata: false
  };

  try {
    // Generate the report
    console.log('📊 Generating HTML reports...');
    report.generate(reportOptions);
    
    // Archive the report
    await archiveReport();
    
    console.log('✅ HTML report generated successfully!');
    console.log(`📂 Location: ${path.resolve('reports/html/index.html')}`);
    
  } catch (error) {
    console.error('❌ Report generation failed:', error.message);
    throw error;
  }
}

/**
 * Archive current report for historical tracking
 */
async function archiveReport() {
  const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
  const archivePath = `reports/archive/report_${timestamp}`;
  
  try {
    // Copy current report to archive
    await fs.copy('reports/html', archivePath);
    console.log(`📦 Report archived to: ${archivePath}`);
    
    // Cleanup old archives (keep last 10)
    await cleanupOldArchives();
    
  } catch (error) {
    console.warn('⚠️ Failed to archive report:', error.message);
  }
}

/**
 * Remove old archived reports to manage disk space
 */
async function cleanupOldArchives() {
  try {
    const archiveDir = 'reports/archive';
    const archives = await fs.readdir(archiveDir);
    
    // Sort by modification time (newest first)
    const archiveStats = await Promise.all(
      archives.map(async (archive) => {
        const stats = await fs.stat(path.join(archiveDir, archive));
        return { name: archive, mtime: stats.mtime };
      })
    );
    
    archiveStats.sort((a, b) => b.mtime - a.mtime);
    
    // Remove archives beyond the retention limit
    const retentionLimit = 10;
    if (archiveStats.length > retentionLimit) {
      const toRemove = archiveStats.slice(retentionLimit);
      
      for (const archive of toRemove) {
        await fs.remove(path.join(archiveDir, archive.name));
        console.log(`🗑️ Removed old archive: ${archive.name}`);
      }
    }
    
  } catch (error) {
    console.warn('⚠️ Archive cleanup failed:', error.message);
  }
}

// Export for use in other scripts
module.exports = { generateHTMLReports };

// Run if called directly
if (require.main === module) {
  generateHTMLReports()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
```

### 3. JUnit XML Configuration

For CI/CD integration, configure JUnit XML reporting:

```javascript
// src/support/junit-reporter.js
const { BeforeAll, AfterAll, After } = require('@cucumber/cucumber');
const fs = require('fs-extra');

/**
 * JUnit reporter configuration and utilities
 */
class JUnitReporter {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
  }

  /**
   * Initialize JUnit reporting
   */
  static async initialize() {
    console.log('🔧 Initializing JUnit reporter...');
    
    // Ensure JUnit directory exists
    await fs.ensureDir('reports/junit');
    
    // Set environment variables for JUnit format
    process.env.CUCUMBER_JUNIT_REPORTER_OUTPUTDIR = 'reports/junit/';
    process.env.CUCUMBER_JUNIT_REPORTER_SUITENAME = 'BDD Test Suite';
    process.env.CUCUMBER_JUNIT_REPORTER_CLASSNAME = '{{feature.name}}';
    
    console.log('✅ JUnit reporter initialized');
  }

  /**
   * Process test results for enhanced JUnit output
   */
  static async processResults() {
    try {
      const junitFile = 'reports/junit/cucumber-results.xml';
      
      if (await fs.pathExists(junitFile)) {
        // Read and enhance JUnit XML if needed
        let xmlContent = await fs.readFile(junitFile, 'utf8');
        
        // Add custom properties
        const customProperties = `
          <properties>
            <property name="environment" value="${process.env.NODE_ENV || 'development'}" />
            <property name="browser" value="chrome" />
            <property name="platform" value="${process.platform}" />
            <property name="timestamp" value="${new Date().toISOString()}" />
          </properties>
        `;
        
        // Insert properties after <testsuite> opening tag
        xmlContent = xmlContent.replace(
          /<testsuite([^>]*)>/,
          `<testsuite$1>${customProperties}`
        );
        
        // Write enhanced XML
        await fs.writeFile(junitFile, xmlContent);
        console.log('📄 JUnit XML report enhanced with custom properties');
      }
      
    } catch (error) {
      console.warn('⚠️ JUnit post-processing failed:', error.message);
    }
  }
}

// Hook setup
BeforeAll(async function() {
  await JUnitReporter.initialize();
});

AfterAll(async function() {
  await JUnitReporter.processResults();
});

module.exports = JUnitReporter;
```

### 4. Custom CSS Styling

Create custom styling for HTML reports:

```css
/* reports/assets/custom-report-style.css */

/* Global styles */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
}

/* Header customization */
.navbar-brand {
  font-weight: bold;
  color: #2c3e50 !important;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border-bottom: 3px solid #5a6cb8;
}

/* Report summary cards */
.card {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border: none;
}

.card-header {
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: white;
  font-weight: bold;
  border-radius: 10px 10px 0 0 !important;
}

/* Status indicators */
.badge-success {
  background: linear-gradient(45deg, #27ae60, #2ecc71) !important;
  color: white;
}

.badge-danger {
  background: linear-gradient(45deg, #e74c3c, #c0392b) !important;
  color: white;
}

.badge-warning {
  background: linear-gradient(45deg, #f39c12, #e67e22) !important;
  color: white;
}

/* Feature sections */
.feature-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.feature-title {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

/* Scenario styling */
.scenario-row {
  border-left: 4px solid #3498db;
  padding-left: 15px;
  margin-bottom: 15px;
}

.scenario-row.passed {
  border-left-color: #27ae60;
  background-color: #f8fff8;
}

.scenario-row.failed {
  border-left-color: #e74c3c;
  background-color: #fff8f8;
}

.scenario-row.skipped {
  border-left-color: #f39c12;
  background-color: #fffbf0;
}

/* Step styling */
.step {
  padding: 8px 12px;
  margin: 5px 0;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
}

.step.passed {
  background-color: #d5f4e6;
  border-left: 3px solid #27ae60;
}

.step.failed {
  background-color: #fdeaea;
  border-left: 3px solid #e74c3c;
}

.step.skipped {
  background-color: #fef9e7;
  border-left: 3px solid #f39c12;
}

/* Error messages */
.error-message {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 15px;
  border-radius: 5px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  margin-top: 10px;
  border-left: 4px solid #e74c3c;
}

/* Screenshots */
.screenshot {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 10px 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.screenshot:hover {
  transform: scale(1.02);
}

/* Duration indicators */
.duration {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: normal;
}

/* Responsive design */
@media (max-width: 768px) {
  .container-fluid {
    padding: 10px;
  }
  
  .card {
    margin-bottom: 15px;
  }
  
  .feature-section {
    padding: 15px;
  }
  
  .step {
    font-size: 12px;
    padding: 6px 10px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #e0e0e0;
  }
  
  .feature-section {
    background: #2d2d2d;
    color: #e0e0e0;
  }
  
  .card {
    background: #2d2d2d;
  }
}

/* Print styles */
@media print {
  .navbar,
  .btn,
  .filter-section {
    display: none !important;
  }
  
  .feature-section {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.feature-section {
  animation: fadeIn 0.5s ease-out;
}

/* Loading states */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## Package.json Scripts

Add convenient npm scripts for report generation:

```json
{
  "scripts": {
    "test": "cucumber-js",
    "test:with-reports": "cucumber-js && npm run generate-reports",
    "generate-reports": "node scripts/generate-reports.js",
    "reports:html": "node scripts/generate-reports.js",
    "reports:open": "node -e \"require('open')('reports/html/index.html')\"",
    "reports:clean": "rimraf reports/*",
    "reports:archive": "node -e \"require('./scripts/generate-reports').archiveReport()\"",
    "test:ci": "cucumber-js --format json:reports/json/cucumber-report.json --format junit:reports/junit/cucumber-results.xml"
  }
}
```

---

## Running the Examples

### 1. Generate Basic Reports

Run your tests with multiple report formats:

```bash
# Run tests and generate JSON + JUnit reports
npm run test

# Generate HTML reports from JSON data
npm run generate-reports

# Run tests and generate all reports
npm run test:with-reports
```

### 2. View Generated Reports

```bash
# Open HTML report in browser
npm run reports:open

# Or manually navigate to:
# file://path/to/your/project/reports/html/index.html
```

### 3. CI/CD Integration

For continuous integration pipelines:

```bash
# Generate reports suitable for CI/CD
npm run test:ci

# Check exit codes
echo $?  # 0 for success, non-zero for failures
```

---

## Understanding Report Formats

### JSON Report Structure

The JSON report contains comprehensive test execution data:

```json
{
  "features": [
    {
      "description": "User authentication functionality",
      "elements": [
        {
          "description": "User logs in with valid credentials",
          "id": "user-authentication;user-logs-in-with-valid-credentials",
          "keyword": "Scenario",
          "line": 6,
          "name": "User logs in with valid credentials",
          "steps": [
            {
              "keyword": "Given ",
              "line": 7,
              "name": "I am on the login page",
              "match": {
                "location": "src/steps/authentication.steps.ts:15"
              },
              "result": {
                "status": "passed",
                "duration": 1500000000
              }
            }
          ],
          "tags": [
            {
              "line": 5,
              "name": "@authentication"
            }
          ],
          "type": "scenario"
        }
      ],
      "id": "user-authentication",
      "line": 1,
      "name": "User Authentication",
      "tags": [],
      "uri": "features/authentication.feature"
    }
  ]
}
```

### JUnit XML Structure

JUnit XML format for CI/CD tools:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="BDD Test Suite" tests="15" failures="2" skipped="1" time="45.123">
  <properties>
    <property name="environment" value="staging" />
    <property name="browser" value="chrome" />
    <property name="platform" value="linux" />
    <property name="timestamp" value="2024-01-15T10:30:00.000Z" />
  </properties>
  <testcase classname="User Authentication" name="User logs in with valid credentials" time="1.5">
  </testcase>
  <testcase classname="User Authentication" name="User login fails with invalid credentials" time="2.1">
    <failure message="Expected login to fail but it succeeded">
      Error: Expected login to fail but it succeeded
      at LoginPage.validateLoginFailure (src/pages/LoginPage.ts:45)
    </failure>
  </testcase>
</testsuite>
```

---

## Best Practices Demonstrated

### 1. **Report Organization**
- Separate directories for different report formats
- Timestamp-based archiving for historical tracking
- Automated cleanup to manage disk usage

### 2. **Configuration Management**
- Environment-specific report settings
- Centralized configuration in cucumber.js
- Build information integration

### 3. **CI/CD Integration**
- Standard format outputs (JUnit XML)
- Exit code handling for pipeline decisions
- Metadata enrichment for better context

### 4. **Performance Optimization**
- Conditional report generation (only when needed)
- Parallel format generation
- Resource cleanup and management

---

## Troubleshooting Common Issues

### Issue 1: Report Generation Fails

**Problem**: Reports not generating or empty reports
```bash
Error: ENOENT: no such file or directory, open 'reports/json/cucumber-report.json'
```

**Solution**:
```bash
# Ensure directories exist before running tests
mkdir -p reports/{html,json,junit,archive,assets}

# Verify Cucumber generates JSON output
npx cucumber-js --format json:test.json features/

# Check file permissions
ls -la reports/
```

### Issue 2: HTML Report Styling Issues

**Problem**: Custom CSS not applied or report looks broken

**Solution**:
```javascript
// Verify CSS file path in report options
customStyle: path.resolve('reports/assets/custom-report-style.css')

// Check CSS file exists
if (!fs.existsSync('reports/assets/custom-report-style.css')) {
  console.warn('CSS file not found, using default styling');
}
```

### Issue 3: JUnit XML Format Problems

**Problem**: CI/CD tools can't parse JUnit XML

**Solution**:
```bash
# Validate XML structure
xmllint --noout reports/junit/cucumber-results.xml

# Check encoding and special characters
file reports/junit/cucumber-results.xml

# Use standard JUnit reporter
npm install --save-dev cucumber-junit-reporter
```

---

## Next Steps

This example established the foundation for Cucumber reporting. Next, you'll learn:

1. **[Advanced HTML Reports](./02-advanced-html-reports.md)** - Interactive features and rich media integration
2. **[Custom Report Templates](./03-custom-report-templates.md)** - Building audience-specific reports
3. **[Real-time Dashboards](./04-realtime-dashboard-integration.md)** - Live monitoring and alerting systems

### Key Takeaways

- ✅ **Multi-format reporting** provides flexibility for different stakeholders
- ✅ **Proper configuration** enables seamless CI/CD integration
- ✅ **Custom styling** improves report readability and branding
- ✅ **Archive management** maintains historical reporting data
- ✅ **Error handling** ensures robust report generation

You now have a solid foundation for generating comprehensive test reports that serve as living documentation for your BDD test suite! 🎉

**[Continue to Example 02: Advanced HTML Reports →](./02-advanced-html-reports.md)**