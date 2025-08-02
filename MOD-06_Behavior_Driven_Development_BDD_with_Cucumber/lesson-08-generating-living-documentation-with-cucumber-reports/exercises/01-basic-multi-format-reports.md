# Exercise 01: Basic Multi-Format Reports

## 🎯 Objectives

By completing this exercise, you will:
- ✅ Configure Cucumber.js to generate multiple report formats simultaneously
- ✅ Create HTML, JSON, and JUnit XML reports from test execution
- ✅ Implement basic report customization and branding
- ✅ Set up automated report generation in CI/CD pipelines
- ✅ Apply proper file organization and cleanup strategies

**Estimated Time**: 45-60 minutes  
**Difficulty**: ⭐⭐☆☆☆ (Beginner-Intermediate)

---

## 📋 Prerequisites

### Required Knowledge
- ✅ Cucumber.js fundamentals (Lessons 01-04)
- ✅ Basic JavaScript/TypeScript understanding
- ✅ Familiarity with npm scripts and CLI tools
- ✅ Understanding of JSON data structures

### Technical Setup
```bash
# Ensure you have the required dependencies
npm install --save-dev @cucumber/cucumber @playwright/test
npm install --save-dev multiple-cucumber-html-reporter
npm install --save-dev typescript ts-node
```

### Project Structure
```
your-project/
├── features/
│   ├── login.feature
│   └── navigation.feature
├── step-definitions/
│   ├── login.steps.ts
│   └── navigation.steps.ts
├── reports/
│   ├── json/
│   ├── html/
│   └── junit/
├── scripts/
└── package.json
```

---

## 🛠️ Implementation Tasks

### Task 1: Multi-Reporter Configuration (15 minutes)

Create a comprehensive Cucumber configuration that generates multiple report formats.

**Step 1.1**: Create `cucumber.js` configuration file

```javascript
// cucumber.js
const path = require('path');

module.exports = {
  default: {
    // Feature file paths
    paths: ['features/**/*.feature'],
    
    // Step definition paths  
    require: [
      'step-definitions/**/*.ts',
      'support/**/*.ts'
    ],
    
    // TypeScript support
    requireModule: ['ts-node/register'],
    
    // Multiple format outputs
    format: [
      // Pretty console output for development
      '@cucumber/pretty-formatter',
      
      // JSON output for custom report generation
      'json:reports/json/cucumber-report.json',
      
      // HTML output for quick viewing
      'html:reports/html/cucumber-basic.html',
      
      // JUnit XML for CI/CD integration
      'junit:reports/junit/cucumber-junit.xml'
    ],
    
    // Additional options
    publishQuiet: true,
    dryRun: false,
    failFast: false,
    
    // World parameters for report customization
    worldParameters: {
      reportPath: 'reports/',
      screenshotPath: 'reports/screenshots/',
      enableScreenshots: true
    }
  },
  
  // CI-specific configuration
  ci: {
    paths: ['features/**/*.feature'],
    require: [
      'step-definitions/**/*.ts',
      'support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'json:reports/json/cucumber-report.json',
      'junit:reports/junit/cucumber-junit.xml',
      'progress'
    ],
    publishQuiet: true,
    parallel: 2
  }
};
```

**Step 1.2**: Update `package.json` scripts

```json
{
  "scripts": {
    "test:cucumber": "cucumber-js",
    "test:cucumber:ci": "cucumber-js --profile ci",
    "test:reports": "npm run test:cucumber && npm run generate:reports",
    "generate:reports": "node scripts/generate-reports.js",
    "clean:reports": "node scripts/clean-reports.js",
    "serve:reports": "http-server reports/html -p 8080 -o"
  },
  "devDependencies": {
    "@cucumber/cucumber": "^9.0.0",
    "@playwright/test": "^1.30.0",
    "multiple-cucumber-html-reporter": "^3.5.0",
    "http-server": "^14.1.1",
    "rimraf": "^4.4.0"
  }
}
```

**🔍 Validation**: Run `npm run test:cucumber` and verify that files are created in:
- `reports/json/cucumber-report.json`
- `reports/html/cucumber-basic.html`  
- `reports/junit/cucumber-junit.xml`

### Task 2: Advanced HTML Report Generation (20 minutes)

Create an enhanced HTML report generator using `multiple-cucumber-html-reporter`.

**Step 2.1**: Create the report generation script

```javascript
// scripts/generate-reports.js
const report = require('multiple-cucumber-html-reporter');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

/**
 * Advanced HTML Report Generator
 */
class ReportGenerator {
  constructor() {
    this.reportsDir = 'reports';
    this.jsonDir = path.join(this.reportsDir, 'json');
    this.htmlDir = path.join(this.reportsDir, 'html');
    this.screenshotsDir = path.join(this.reportsDir, 'screenshots');
  }

  /**
   * Generate comprehensive HTML reports
   */
  async generateReports() {
    console.log('🚀 Generating HTML reports...');
    
    try {
      // Ensure output directories exist
      await this.ensureDirectories();
      
      // Generate main HTML report
      await this.generateMainReport();
      
      // Generate CI-friendly report
      await this.generateCIReport();
      
      // Create index page
      await this.createIndexPage();
      
      console.log('✅ Reports generated successfully!');
      console.log(`📂 View reports at: ${path.resolve(this.htmlDir)}/index.html`);
      
    } catch (error) {
      console.error('❌ Report generation failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Ensure all required directories exist
   */
  async ensureDirectories() {
    const dirs = [this.htmlDir, this.jsonDir, this.screenshotsDir];
    
    for (const dir of dirs) {
      await fs.ensureDir(dir);
    }
  }

  /**
   * Generate main detailed HTML report
   */
  async generateMainReport() {
    const reportOptions = {
      jsonDir: this.jsonDir,
      reportPath: this.htmlDir,
      
      // Report metadata
      metadata: {
        browser: {
          name: 'chrome',
          version: '120.0'
        },
        device: 'Local Development',
        platform: {
          name: process.platform,
          version: require('os').release()
        }
      },
      
      // Custom data
      customData: {
        title: 'Cucumber Test Execution Report',
        data: [
          { label: 'Project', value: 'QA Automation Learning' },
          { label: 'Release', value: '1.0.0' },
          { label: 'Cycle', value: 'Smoke Tests' },
          { label: 'Environment', value: 'Development' },
          { label: 'Executed', value: moment().format('YYYY-MM-DD HH:mm:ss') }
        ]
      },
      
      // Display options
      pageTitle: 'Cucumber Test Results',
      reportName: 'Automated Test Execution Report',
      pageFooter: '<div style="text-align:center;"><p>Generated by QA Automation Framework</p></div>',
      displayDuration: true,
      displayReportTime: true,
      hideMetadata: false,
      
      // Customization
      customStyle: path.join(__dirname, '..', 'assets', 'custom-report.css'),
      customMetadata: true,
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: false
    };

    // Generate the main report
    report.generate(reportOptions);
    
    console.log('📊 Main HTML report generated');
  }

  /**
   * Generate CI-friendly compact report
   */
  async generateCIReport() {
    const ciReportOptions = {
      jsonDir: this.jsonDir,
      reportPath: path.join(this.htmlDir, 'ci'),
      
      // Minimal metadata for CI
      metadata: {
        platform: { name: process.platform }
      },
      
      // Custom CI data
      customData: {
        title: 'CI Test Results',
        data: [
          { label: 'Build', value: process.env.BUILD_NUMBER || 'local' },
          { label: 'Branch', value: process.env.GIT_BRANCH || 'main' },
          { label: 'Commit', value: process.env.GIT_COMMIT?.substring(0, 7) || 'local' }
        ]
      },
      
      // CI-optimized settings
      pageTitle: 'CI Test Results',
      reportName: 'Continuous Integration Report',
      hideMetadata: true,
      displayDuration: true,
      customStyle: null, // Minimal styling for faster loading
      launchReport: false
    };

    report.generate(ciReportOptions);
    
    console.log('🔧 CI report generated');
  }

  /**
   * Create main index page linking to all reports
   */
  async createIndexPage() {
    const indexHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Reports Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; }
        .report-card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .report-card:hover { transform: translateY(-5px); }
        .icon-large { font-size: 3rem; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container mt-5">
        <div class="row">
            <div class="col-12 text-center mb-5">
                <h1><i class="fas fa-chart-line text-primary"></i> Test Reports Dashboard</h1>
                <p class="lead text-muted">Generated on ${moment().format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
        </div>
        
        <div class="row">
            <!-- Main Report -->
            <div class="col-md-4 mb-4">
                <div class="card report-card h-100">
                    <div class="card-body text-center">
                        <i class="fas fa-file-alt text-primary icon-large"></i>
                        <h5 class="card-title">Detailed Report</h5>
                        <p class="card-text">Comprehensive test results with full details, screenshots, and metadata.</p>
                        <a href="index.html" class="btn btn-primary">
                            <i class="fas fa-eye"></i> View Report
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- CI Report -->
            <div class="col-md-4 mb-4">
                <div class="card report-card h-100">
                    <div class="card-body text-center">
                        <i class="fas fa-cogs text-success icon-large"></i>
                        <h5 class="card-title">CI Report</h5>
                        <p class="card-text">Optimized report for continuous integration with build information.</p>
                        <a href="ci/index.html" class="btn btn-success">
                            <i class="fas fa-tools"></i> View CI Report
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Raw Data -->
            <div class="col-md-4 mb-4">
                <div class="card report-card h-100">
                    <div class="card-body text-center">
                        <i class="fas fa-database text-info icon-large"></i>
                        <h5 class="card-title">Raw Data</h5>
                        <p class="card-text">JSON and XML data files for custom processing and integration.</p>
                        <div class="btn-group" role="group">
                            <a href="../json/cucumber-report.json" class="btn btn-info btn-sm">
                                <i class="fas fa-code"></i> JSON
                            </a>
                            <a href="../junit/cucumber-junit.xml" class="btn btn-info btn-sm">
                                <i class="fas fa-file-code"></i> XML
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Statistics Row -->
        <div class="row mt-5">
            <div class="col-12">
                <div class="card report-card">
                    <div class="card-header">
                        <h5><i class="fas fa-chart-bar"></i> Quick Statistics</h5>
                    </div>
                    <div class="card-body" id="statistics">
                        <div class="row text-center">
                            <div class="col-md-3">
                                <h3 class="text-primary" id="totalFeatures">-</h3>
                                <p class="text-muted">Features</p>
                            </div>
                            <div class="col-md-3">
                                <h3 class="text-info" id="totalScenarios">-</h3>
                                <p class="text-muted">Scenarios</p>
                            </div>
                            <div class="col-md-3">
                                <h3 class="text-success" id="passedScenarios">-</h3>
                                <p class="text-muted">Passed</p>
                            </div>
                            <div class="col-md-3">
                                <h3 class="text-danger" id="failedScenarios">-</h3>
                                <p class="text-muted">Failed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Load and display statistics from JSON report
        fetch('../json/cucumber-report.json')
            .then(response => response.json())
            .then(data => {
                let totalFeatures = data.length;
                let totalScenarios = 0;
                let passedScenarios = 0;
                let failedScenarios = 0;
                
                data.forEach(feature => {
                    if (feature.elements) {
                        feature.elements.forEach(scenario => {
                            totalScenarios++;
                            
                            const hasFailedStep = scenario.steps?.some(step => 
                                step.result?.status === 'failed'
                            );
                            
                            if (hasFailedStep) {
                                failedScenarios++;
                            } else {
                                passedScenarios++;
                            }
                        });
                    }
                });
                
                // Update statistics display
                document.getElementById('totalFeatures').textContent = totalFeatures;
                document.getElementById('totalScenarios').textContent = totalScenarios;
                document.getElementById('passedScenarios').textContent = passedScenarios;
                document.getElementById('failedScenarios').textContent = failedScenarios;
            })
            .catch(error => {
                console.error('Error loading statistics:', error);
            });
    </script>
</body>
</html>
    `;

    await fs.writeFile(path.join(this.htmlDir, 'dashboard.html'), indexHTML);
    
    console.log('📋 Index dashboard created');
  }
}

// Execute report generation
if (require.main === module) {
  const generator = new ReportGenerator();
  generator.generateReports();
}

module.exports = ReportGenerator;
```

**Step 2.2**: Create custom CSS for report styling

```css
/* assets/custom-report.css */
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --light-bg: #f8f9fa;
}

/* Global Enhancements */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  background-color: var(--light-bg);
}

/* Header Styling */
.navbar {
  background: linear-gradient(135deg, var(--primary-color) 0%, #0056b3 100%);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Feature Cards */
.feature {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-2px);
}

.feature-title {
  background: linear-gradient(45deg, var(--primary-color), #0056b3);
  color: white;
  padding: 15px 20px;
  font-weight: 600;
}

/* Scenario Styling */
.scenario {
  border-left: 4px solid var(--primary-color);
  margin: 15px 20px;
  padding: 15px;
  border-radius: 5px;
  background: #f8f9fa;
}

.scenario.passed {
  border-left-color: var(--success-color);
  background: rgba(40, 167, 69, 0.05);
}

.scenario.failed {
  border-left-color: var(--danger-color);
  background: rgba(220, 53, 69, 0.05);
}

/* Step Styling */
.step {
  padding: 8px 12px;
  margin: 5px 0;
  border-radius: 5px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
}

.step.passed {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-left: 3px solid var(--success-color);
}

.step.failed {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border-left: 3px solid var(--danger-color);
}

.step.skipped {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-left: 3px solid var(--warning-color);
}

/* Statistics Cards */
.stats-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.stats-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.stats-label {
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .feature {
    margin: 10px;
  }
  
  .scenario {
    margin: 10px;
    padding: 10px;
  }
  
  .step {
    font-size: 12px;
    padding: 6px 10px;
  }
}
```

**🔍 Validation**: Run `npm run generate:reports` and verify:
- HTML reports are generated with custom styling
- Dashboard page shows statistics correctly
- All links work properly

### Task 3: CI/CD Integration Setup (10 minutes)

Create scripts for automated report generation in CI/CD pipelines.

**Step 3.1**: Create cleanup script

```javascript
// scripts/clean-reports.js
const fs = require('fs-extra');
const path = require('path');

/**
 * Clean old reports and prepare for new test run
 */
class ReportCleaner {
  constructor() {
    this.reportsDir = 'reports';
  }

  async clean() {
    console.log('🧹 Cleaning old reports...');
    
    try {
      // Remove old report files but keep directory structure
      await this.cleanDirectory(path.join(this.reportsDir, 'json'));
      await this.cleanDirectory(path.join(this.reportsDir, 'html'));
      await this.cleanDirectory(path.join(this.reportsDir, 'junit'));
      await this.cleanDirectory(path.join(this.reportsDir, 'screenshots'));
      
      console.log('✅ Reports cleaned successfully');
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      process.exit(1);
    }
  }

  async cleanDirectory(dirPath) {
    if (await fs.pathExists(dirPath)) {
      await fs.emptyDir(dirPath);
      console.log(`📂 Cleaned: ${dirPath}`);
    } else {
      await fs.ensureDir(dirPath);
      console.log(`📂 Created: ${dirPath}`);
    }
  }
}

// Execute cleanup
if (require.main === module) {
  const cleaner = new ReportCleaner();
  cleaner.clean();
}

module.exports = ReportCleaner;
```

**Step 3.2**: Create GitHub Actions workflow

```yaml
# .github/workflows/test-reports.yml
name: Test Execution with Reports

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-report:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Clean previous reports
      run: npm run clean:reports

    - name: Install Playwright browsers
      run: npx playwright install --with-deps chromium

    - name: Run Cucumber tests
      run: npm run test:cucumber
      continue-on-error: true

    - name: Generate HTML reports
      run: npm run generate:reports
      if: always()

    - name: Upload test reports
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-reports
        path: |
          reports/html/
          reports/json/
          reports/junit/

    - name: Publish test results
      uses: dorny/test-reporter@v1
      if: always()
      with:
        name: Cucumber Tests
        path: reports/junit/*.xml
        reporter: java-junit

    - name: Deploy reports to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./reports/html
```

**🔍 Validation**: 
- Test the cleanup script: `npm run clean:reports`
- Verify all directories are recreated
- Commit the workflow file to test CI integration

---

## ✅ Validation Criteria

### Core Requirements

1. **Multi-Format Generation** ✅
   - JSON report contains complete test data
   - HTML report displays properly formatted results
   - JUnit XML is valid and contains test information
   - All files are generated in correct directories

2. **Report Customization** ✅
   - Custom CSS styling is applied correctly
   - Branding elements appear in reports
   - Statistics are calculated and displayed accurately
   - Navigation between reports works smoothly

3. **Automation Integration** ✅
   - npm scripts execute without errors
   - CI/CD workflow can run tests and generate reports
   - Cleanup script removes old files and creates directories
   - Reports are uploaded as artifacts successfully

### Success Indicators

**Visual Verification:**
- [ ] HTML reports open without styling issues
- [ ] Statistics dashboard shows correct numbers
- [ ] All links and navigation work properly
- [ ] Reports display correctly on mobile devices

**Functional Testing:**
- [ ] `npm run test:reports` completes successfully
- [ ] All three report formats are generated
- [ ] CI workflow runs without failures
- [ ] Reports are accessible after generation

**File Structure Validation:**
```
reports/
├── html/
│   ├── index.html (main report)
│   ├── dashboard.html (overview)
│   └── ci/index.html (CI report)
├── json/
│   └── cucumber-report.json
├── junit/
│   └── cucumber-junit.xml
└── screenshots/ (if enabled)
```

---

## 🎉 Bonus Challenges

### Challenge 1: Enhanced Statistics (Beginner)
Add more detailed statistics to the dashboard:
- Average test duration per feature
- Most frequently failing scenarios
- Test execution trends over time

### Challenge 2: Screenshot Integration (Intermediate)
Integrate screenshot capture on test failures:
- Capture screenshots in step definitions
- Embed screenshots in HTML reports
- Create thumbnail gallery view

### Challenge 3: Email Report Distribution (Advanced)
Create an email distribution system:
- Generate PDF version of reports
- Send reports to stakeholder email lists
- Include summary metrics in email body

### Challenge 4: Report Archiving (Advanced)
Implement historical report archiving:
- Store reports with timestamps
- Create comparison views between runs
- Implement retention policy for old reports

---

## 🔍 Self-Assessment Questions

### Technical Understanding
1. **Configuration Knowledge**
   - Can you explain the difference between the different Cucumber formatters?
   - How would you add a new output format to the configuration?
   - What are the benefits of generating multiple report formats?

2. **Customization Skills**
   - How would you modify the CSS to match your company's branding?
   - What data would you add to make reports more useful for stakeholders?
   - How would you optimize report generation for large test suites?

### Practical Application
3. **Integration Scenarios**
   - How would you integrate these reports with your existing CI/CD pipeline?
   - What modifications would be needed for different environments (dev, staging, prod)?
   - How would you handle report generation failures in production?

4. **Stakeholder Value**
   - Which report format would be most useful for different team members?
   - How would you present these reports to non-technical stakeholders?
   - What metrics would be most important for management dashboards?

---

## 🚀 Next Steps

Upon successful completion of this exercise:

1. **Practice Integration**
   - Integrate report generation into your existing test suite
   - Customize styling to match your organization's branding
   - Set up automated report distribution

2. **Explore Advanced Features**
   - Experiment with different chart libraries for visualizations
   - Add interactive filtering and search capabilities
   - Implement report comparison features

3. **Prepare for Next Exercise**
   - Review the generated reports for areas of improvement
   - Think about what interactive features would be most valuable
   - Consider different user personas who would consume these reports

**Ready for more advanced features? Continue with [Exercise 02: Interactive Report Enhancement →](./02-interactive-report-enhancement.md)**

---

**🎯 Success Metrics:**
- ✅ All report formats generate successfully
- ✅ Custom styling displays correctly
- ✅ CI/CD integration works smoothly
- ✅ Reports provide clear, actionable information
- ✅ Stakeholders can easily navigate and understand results

*Congratulations! You've built a solid foundation for multi-format test reporting that will serve as the basis for more advanced features in subsequent exercises.* 🏆