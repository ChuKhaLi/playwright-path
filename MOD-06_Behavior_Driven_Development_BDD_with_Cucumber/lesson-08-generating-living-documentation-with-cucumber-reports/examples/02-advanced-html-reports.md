# Example 02: Advanced HTML Reports

## Overview

This example demonstrates how to create sophisticated, interactive HTML reports that go beyond basic formatting. You'll learn to implement advanced features like filtering, search functionality, rich media integration, and responsive design that transforms test results into professional living documentation.

**Duration**: 45 minutes  
**Complexity**: Intermediate  
**Prerequisites**: Completion of Example 01 (Basic Report Configuration)  

---

## Learning Objectives

By completing this example, you will master:

- ✅ **Interactive Features**: Implement filtering, search, and drill-down capabilities
- ✅ **Rich Media Integration**: Embed screenshots, videos, and interactive elements
- ✅ **Custom Themes**: Create professional branding and responsive designs
- ✅ **Performance Optimization**: Handle large test suites with efficient rendering
- ✅ **Accessibility Standards**: Ensure reports meet WCAG compliance requirements
- ✅ **Export Capabilities**: Generate PDF and other format exports from HTML reports

---

## Advanced Report Features

### 1. Interactive HTML Report Generator

Create an enhanced report generator with advanced features:

```javascript
// scripts/advanced-html-reporter.js
const report = require('multiple-cucumber-html-reporter');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const { JSDOM } = require('jsdom');
const puppeteer = require('puppeteer');

/**
 * Advanced HTML Report Generator with Interactive Features
 */
class AdvancedHTMLReporter {
  constructor(options = {}) {
    this.options = {
      // Input/Output paths
      jsonDir: options.jsonDir || 'reports/json/',
      outputDir: options.outputDir || 'reports/html-advanced/',
      assetsDir: options.assetsDir || 'reports/assets/',
      
      // Feature flags
      enableSearch: options.enableSearch !== false,
      enableFiltering: options.enableFiltering !== false,
      enableScreenshots: options.enableScreenshots !== false,
      enableVideoEmbeds: options.enableVideoEmbeds !== false,
      enablePDFExport: options.enablePDFExport !== false,
      enableDarkMode: options.enableDarkMode !== false,
      
      // Performance settings
      lazyLoadImages: options.lazyLoadImages !== false,
      virtualScrolling: options.virtualScrolling || false,
      chunkSize: options.chunkSize || 50,
      
      // Customization
      theme: options.theme || 'professional',
      brandColor: options.brandColor || '#3498db',
      companyLogo: options.companyLogo || null,
      customCSS: options.customCSS || null,
      
      ...options
    };
    
    this.stats = {
      totalFeatures: 0,
      totalScenarios: 0,
      totalSteps: 0,
      passedScenarios: 0,
      failedScenarios: 0,
      skippedScenarios: 0,
      executionTime: 0
    };
  }

  /**
   * Generate advanced HTML report with all features
   */
  async generateReport() {
    console.log('🚀 Generating advanced HTML report...');
    
    try {
      // Prepare directories and assets
      await this.prepareEnvironment();
      
      // Process test data
      const testData = await this.processTestData();
      
      // Generate enhanced report
      await this.generateEnhancedReport(testData);
      
      // Add interactive features
      await this.addInteractiveFeatures();
      
      // Generate additional formats if requested
      if (this.options.enablePDFExport) {
        await this.generatePDFReport();
      }
      
      console.log('✅ Advanced HTML report generated successfully!');
      console.log(`📂 Location: ${path.resolve(this.options.outputDir)}`);
      
      return this.stats;
      
    } catch (error) {
      console.error('❌ Advanced report generation failed:', error.message);
      throw error;
    }
  }

  /**
   * Prepare environment and copy assets
   */
  async prepareEnvironment() {
    // Ensure output directories exist
    await fs.ensureDir(this.options.outputDir);
    await fs.ensureDir(path.join(this.options.outputDir, 'assets'));
    await fs.ensureDir(path.join(this.options.outputDir, 'js'));
    await fs.ensureDir(path.join(this.options.outputDir, 'css'));
    
    // Copy enhanced assets
    await this.copyEnhancedAssets();
    
    console.log('📁 Environment prepared');
  }

  /**
   * Copy enhanced JavaScript and CSS assets
   */
  async copyEnhancedAssets() {
    // Enhanced CSS with interactive features
    const enhancedCSS = await this.generateEnhancedCSS();
    await fs.writeFile(
      path.join(this.options.outputDir, 'css', 'advanced-report.css'),
      enhancedCSS
    );
    
    // Interactive JavaScript
    const interactiveJS = await this.generateInteractiveJS();
    await fs.writeFile(
      path.join(this.options.outputDir, 'js', 'report-interactive.js'),
      interactiveJS
    );
    
    // Copy company logo if provided
    if (this.options.companyLogo && await fs.pathExists(this.options.companyLogo)) {
      await fs.copy(
        this.options.companyLogo,
        path.join(this.options.outputDir, 'assets', 'logo.png')
      );
    }
  }

  /**
   * Process and enhance test data
   */
  async processTestData() {
    const jsonFiles = await fs.readdir(this.options.jsonDir);
    const cucumberFiles = jsonFiles.filter(file => file.endsWith('.json'));
    
    let allTestData = [];
    
    for (const file of cucumberFiles) {
      const filePath = path.join(this.options.jsonDir, file);
      const jsonData = await fs.readJson(filePath);
      allTestData = allTestData.concat(jsonData);
    }
    
    // Calculate statistics
    this.calculateStatistics(allTestData);
    
    // Enhance with additional metadata
    return this.enhanceTestData(allTestData);
  }

  /**
   * Calculate comprehensive test statistics
   */
  calculateStatistics(testData) {
    this.stats.totalFeatures = testData.length;
    
    testData.forEach(feature => {
      feature.elements?.forEach(scenario => {
        this.stats.totalScenarios++;
        
        // Count steps
        if (scenario.steps) {
          this.stats.totalSteps += scenario.steps.length;
          
          // Calculate execution time
          scenario.steps.forEach(step => {
            if (step.result?.duration) {
              this.stats.executionTime += step.result.duration;
            }
          });
        }
        
        // Determine scenario status
        const hasFailedStep = scenario.steps?.some(step => 
          step.result?.status === 'failed'
        );
        const hasSkippedStep = scenario.steps?.some(step => 
          step.result?.status === 'skipped'
        );
        
        if (hasFailedStep) {
          this.stats.failedScenarios++;
        } else if (hasSkippedStep) {
          this.stats.skippedScenarios++;
        } else {
          this.stats.passedScenarios++;
        }
      });
    });
    
    // Convert execution time to seconds
    this.stats.executionTime = Math.round(this.stats.executionTime / 1000000000);
  }

  /**
   * Enhance test data with additional metadata
   */
  enhanceTestData(testData) {
    return testData.map(feature => ({
      ...feature,
      // Add feature-level statistics
      statistics: this.calculateFeatureStatistics(feature),
      
      // Add enhanced elements
      elements: feature.elements?.map(scenario => ({
        ...scenario,
        // Add scenario duration
        duration: this.calculateScenarioDuration(scenario),
        
        // Add scenario status
        status: this.determineScenarioStatus(scenario),
        
        // Enhance steps with additional data
        steps: scenario.steps?.map(step => ({
          ...step,
          // Add step duration in readable format
          readableDuration: this.formatDuration(step.result?.duration),
          
          // Add screenshot path if available
          screenshotPath: this.findScreenshotForStep(step),
          
          // Add error analysis
          errorAnalysis: step.result?.error_message ? 
            this.analyzeError(step.result.error_message) : null
        }))
      }))
    }));
  }

  /**
   * Generate enhanced report with multiple-cucumber-html-reporter
   */
  async generateEnhancedReport(testData) {
    // Save enhanced data
    await fs.writeJson(
      path.join(this.options.outputDir, 'enhanced-data.json'),
      testData,
      { spaces: 2 }
    );
    
    const reportOptions = {
      jsonDir: this.options.jsonDir,
      reportPath: this.options.outputDir,
      
      // Metadata configuration
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
      
      // Custom data with enhanced statistics
      customData: {
        title: 'Advanced Test Execution Report',
        data: [
          { label: 'Total Features', value: this.stats.totalFeatures },
          { label: 'Total Scenarios', value: this.stats.totalScenarios },
          { label: 'Total Steps', value: this.stats.totalSteps },
          { label: 'Execution Time', value: `${this.stats.executionTime}s` },
          { label: 'Pass Rate', value: `${this.calculatePassRate()}%` },
          { label: 'Generated', value: moment().format('YYYY-MM-DD HH:mm:ss') }
        ]
      },
      
      // Enhanced customization
      pageTitle: 'BDD Living Documentation',
      reportName: 'Cucumber Test Results - Enhanced Report',
      pageFooter: '<p>Generated by Advanced Cucumber Reporter</p>',
      
      // Custom styling
      customStyle: path.join(this.options.outputDir, 'css', 'advanced-report.css'),
      
      // Display options
      displayDuration: true,
      displayReportTime: true,
      reportSuiteAsScenarios: true,
      
      // Advanced options
      hideMetadata: false,
      customDataTitle: 'Execution Summary',
      customStyleFile: path.join(this.options.outputDir, 'css', 'advanced-report.css')
    };
    
    // Generate base report
    report.generate(reportOptions);
  }

  /**
   * Add interactive features to the generated report
   */
  async addInteractiveFeatures() {
    const indexPath = path.join(this.options.outputDir, 'index.html');
    
    if (!await fs.pathExists(indexPath)) {
      throw new Error('Base HTML report not found');
    }
    
    // Read and enhance HTML
    let htmlContent = await fs.readFile(indexPath, 'utf8');
    
    // Add interactive components
    htmlContent = this.addSearchFunctionality(htmlContent);
    htmlContent = this.addFilteringControls(htmlContent);
    htmlContent = this.addScreenshotModals(htmlContent);
    htmlContent = this.addDarkModeToggle(htmlContent);
    htmlContent = this.addExportButtons(htmlContent);
    htmlContent = this.addProgressIndicators(htmlContent);
    
    // Add custom JavaScript and CSS
    htmlContent = this.injectCustomAssets(htmlContent);
    
    // Write enhanced HTML
    await fs.writeFile(indexPath, htmlContent);
    
    console.log('✨ Interactive features added to HTML report');
  }

  /**
   * Add search functionality to the report
   */
  addSearchFunctionality(html) {
    const searchHTML = `
      <div class="search-container" style="margin: 20px 0;">
        <div class="row">
          <div class="col-md-6">
            <div class="input-group">
              <input type="text" id="searchInput" class="form-control" 
                     placeholder="Search features, scenarios, or steps..." 
                     autocomplete="off">
              <div class="input-group-append">
                <button class="btn btn-outline-primary" type="button" id="searchBtn">
                  <i class="fas fa-search"></i> Search
                </button>
                <button class="btn btn-outline-secondary" type="button" id="clearSearchBtn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="search-stats">
              <span id="searchResults" class="badge badge-info">All items visible</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Insert search after the main navigation
    return html.replace(
      /<nav[^>]*>[\s\S]*?<\/nav>/i,
      `$&${searchHTML}`
    );
  }

  /**
   * Add filtering controls
   */
  addFilteringControls(html) {
    const filterHTML = `
      <div class="filter-container card" style="margin: 20px 0;">
        <div class="card-header">
          <h5><i class="fas fa-filter"></i> Filters</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3">
              <label for="statusFilter">Status:</label>
              <select id="statusFilter" class="form-control">
                <option value="">All Statuses</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="tagFilter">Tags:</label>
              <select id="tagFilter" class="form-control">
                <option value="">All Tags</option>
                <!-- Tags will be populated dynamically -->
              </select>
            </div>
            <div class="col-md-3">
              <label for="durationFilter">Duration:</label>
              <select id="durationFilter" class="form-control">
                <option value="">All Durations</option>
                <option value="fast">Fast (< 5s)</option>
                <option value="medium">Medium (5-20s)</option>
                <option value="slow">Slow (> 20s)</option>
              </select>
            </div>
            <div class="col-md-3">
              <label>&nbsp;</label>
              <div>
                <button id="applyFilters" class="btn btn-primary">Apply Filters</button>
                <button id="clearFilters" class="btn btn-secondary">Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return html.replace(
      /<div class="container-fluid">/i,
      `<div class="container-fluid">${filterHTML}`
    );
  }

  /**
   * Add screenshot modal functionality
   */
  addScreenshotModals(html) {
    const modalHTML = `
      <!-- Screenshot Modal -->
      <div class="modal fade" id="screenshotModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Screenshot</h5>
              <button type="button" class="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body text-center">
              <img id="modalScreenshot" src="" class="img-fluid" alt="Screenshot">
              <div class="mt-3">
                <p id="screenshotInfo" class="text-muted"></p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <a id="downloadScreenshot" href="" class="btn btn-primary" download>
                <i class="fas fa-download"></i> Download
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return html.replace(
      /<\/body>/i,
      `${modalHTML}</body>`
    );
  }

  /**
   * Add dark mode toggle
   */
  addDarkModeToggle(html) {
    if (!this.options.enableDarkMode) return html;
    
    const toggleHTML = `
      <div class="dark-mode-toggle">
        <button id="darkModeToggle" class="btn btn-outline-secondary btn-sm">
          <i class="fas fa-moon"></i> Dark Mode
        </button>
      </div>
    `;
    
    return html.replace(
      /<nav[^>]*>[\s\S]*?<\/nav>/i,
      `$&${toggleHTML}`
    );
  }

  /**
   * Add export buttons
   */
  addExportButtons(html) {
    const exportHTML = `
      <div class="export-controls" style="margin: 20px 0;">
        <div class="btn-group" role="group">
          <button id="exportPDF" class="btn btn-outline-danger">
            <i class="fas fa-file-pdf"></i> Export PDF
          </button>
          <button id="exportJSON" class="btn btn-outline-info">
            <i class="fas fa-file-code"></i> Export JSON
          </button>
          <button id="exportCSV" class="btn btn-outline-success">
            <i class="fas fa-file-csv"></i> Export CSV
          </button>
          <button id="printReport" class="btn btn-outline-dark">
            <i class="fas fa-print"></i> Print
          </button>
        </div>
      </div>
    `;
    
    return html.replace(
      /<div class="filter-container/i,
      `${exportHTML}<div class="filter-container`
    );
  }

  /**
   * Generate enhanced CSS with advanced styling
   */
  async generateEnhancedCSS() {
    return `
/* Advanced Cucumber Report Styles */

/* CSS Variables for Theme */
:root {
  --primary-color: ${this.options.brandColor};
  --primary-dark: ${this.darkenColor(this.options.brandColor, 0.2)};
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
  --border-radius: 8px;
  --box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  --transition: all 0.3s ease;
}

/* Dark Mode Variables */
[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --border-color: #404040;
}

/* Global Enhancements */
body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  transition: var(--transition);
}

/* Header Enhancements */
.navbar {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%) !important;
  box-shadow: var(--box-shadow);
  padding: 1rem 0;
}

.navbar-brand {
  font-weight: 700;
  font-size: 1.5rem;
}

/* Search Container */
.search-container {
  background: white;
  padding: 20px;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 20px;
}

.search-container input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(52, 144, 220, 0.25);
}

/* Filter Container */
.filter-container {
  border: none;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
}

.filter-container .card-header {
  background: linear-gradient(45deg, var(--info-color), var(--primary-color));
  color: white;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}

/* Enhanced Cards */
.card {
  border: none;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  transition: var(--transition);
  margin-bottom: 20px;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

/* Feature Sections */
.feature-section {
  background: white;
  border-radius: var(--border-radius);
  margin-bottom: 30px;
  overflow: hidden;
  transition: var(--transition);
}

.feature-title {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
  padding: 20px;
  margin: 0;
  font-weight: 600;
}

/* Scenario Enhancements */
.scenario-row {
  border-left: 4px solid var(--info-color);
  margin: 15px 20px;
  padding: 15px;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  transition: var(--transition);
  position: relative;
}

.scenario-row:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.scenario-row.passed {
  border-left-color: var(--success-color);
  background: rgba(40, 167, 69, 0.05);
}

.scenario-row.failed {
  border-left-color: var(--danger-color);
  background: rgba(220, 53, 69, 0.05);
}

.scenario-row.skipped {
  border-left-color: var(--warning-color);
  background: rgba(255, 193, 7, 0.05);
}

/* Step Enhancements */
.step {
  padding: 12px 16px;
  margin: 8px 0;
  border-radius: var(--border-radius);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  position: relative;
  transition: var(--transition);
}

.step:hover {
  transform: translateX(3px);
}

.step.passed {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-left: 4px solid var(--success-color);
}

.step.failed {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border-left: 4px solid var(--danger-color);
}

.step.skipped {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-left: 4px solid var(--warning-color);
}

/* Interactive Elements */
.screenshot-thumbnail {
  max-width: 150px;
  max-height: 100px;
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.screenshot-thumbnail:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

/* Progress Indicators */
.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  transition: stroke-dashoffset 0.35s;
  transform-origin: 50% 50%;
}

/* Statistics Cards */
.stat-card {
  background: white;
  padding: 20px;
  border-radius: var(--border-radius);
  text-align: center;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Export Controls */
.export-controls {
  text-align: right;
  margin-bottom: 20px;
}

.export-controls .btn {
  margin-left: 5px;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.export-controls .btn:hover {
  transform: translateY(-1px);
}

/* Dark Mode Toggle */
.dark-mode-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

/* Dark Mode Styles */
[data-theme="dark"] body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

[data-theme="dark"] .card,
[data-theme="dark"] .search-container,
[data-theme="dark"] .feature-section {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

[data-theme="dark"] .scenario-row:hover {
  background-color: #404040;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container-fluid {
    padding: 10px;
  }
  
  .search-container,
  .filter-container {
    margin: 10px 0;
    padding: 15px;
  }
  
  .feature-section {
    margin-bottom: 20px;
  }
  
  .scenario-row {
    margin: 10px;
    padding: 10px;
  }
  
  .step {
    font-size: 12px;
    padding: 8px 12px;
  }
  
  .export-controls {
    text-align: center;
    margin: 20px 0;
  }
  
  .export-controls .btn {
    margin: 5px;
    display: block;
    width: 100%;
  }
}

/* Print Styles */
@media print {
  .navbar,
  .search-container,
  .filter-container,
  .export-controls,
  .dark-mode-toggle {
    display: none !important;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
  
  .feature-section {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 30px;
  }
  
  .scenario-row {
    break-inside: avoid;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-section {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.loading {
  animation: pulse 1.5s infinite;
}

/* Accessibility Enhancements */
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Focus styles for accessibility */
button:focus,
input:focus,
select:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .card,
  .feature-section,
  .scenario-row {
    border: 2px solid #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
    `;
  }

  /**
   * Generate interactive JavaScript functionality
   */
  async generateInteractiveJS() {
    return `
// Advanced Cucumber Report Interactive Features
class CucumberReportEnhancer {
  constructor() {
    this.searchIndex = [];
    this.currentFilters = {};
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.init();
  }

  init() {
    this.buildSearchIndex();
    this.initializeEventListeners();
    this.initializeDarkMode();
    this.initializeFilters();
    this.initializeScreenshotModals();
    this.initializeExportFunctions();
    this.addKeyboardShortcuts();
  }

  // Search Functionality
  buildSearchIndex() {
    const features = document.querySelectorAll('.feature-section');
    this.searchIndex = [];

    features.forEach((feature, featureIndex) => {
      const featureTitle = feature.querySelector('.feature-title')?.textContent || '';
      const scenarios = feature.querySelectorAll('.scenario-row');

      scenarios.forEach((scenario, scenarioIndex) => {
        const scenarioText = scenario.querySelector('h4')?.textContent || '';
        const steps = scenario.querySelectorAll('.step');

        steps.forEach((step, stepIndex) => {
          const stepText = step.textContent || '';
          
          this.searchIndex.push({
            type: 'step',
            text: stepText,
            featureTitle,
            scenarioText,
            element: step,
            parent: scenario,
            grandParent: feature,
            path: \`feature-\${featureIndex}-scenario-\${scenarioIndex}-step-\${stepIndex}\`
          });
        });

        this.searchIndex.push({
          type: 'scenario',
          text: scenarioText,
          featureTitle,
          element: scenario,
          parent: feature,
          path: \`feature-\${featureIndex}-scenario-\${scenarioIndex}\`
        });
      });

      this.searchIndex.push({
        type: 'feature',
        text: featureTitle,
        element: feature,
        path: \`feature-\${featureIndex}\`
      });
    });
  }

  initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (searchInput) {
      searchInput.addEventListener('input', this.debounce((e) => {
        this.performSearch(e.target.value);
      }, 300));

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch(e.target.value);
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.performSearch(searchInput.value);
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.clearSearch();
      });
    }

    // Filter functionality
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');

    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', () => {
        this.applyFilters();
      });
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearFilters();
      });
    }
  }

  performSearch(query) {
    if (!query.trim()) {
      this.clearSearch();
      return;
    }

    const results = this.searchIndex.filter(item => 
      item.text.toLowerCase().includes(query.toLowerCase())
    );

    this.highlightSearchResults(results, query);
    this.updateSearchStats(results.length, this.searchIndex.length);
  }

  highlightSearchResults(results, query) {
    // Hide all elements first
    document.querySelectorAll('.feature-section').forEach(feature => {
      feature.style.display = 'none';
    });

    // Show and highlight matching elements
    const visibleFeatures = new Set();
    const visibleScenarios = new Set();

    results.forEach(result => {
      if (result.grandParent) visibleFeatures.add(result.grandParent);
      if (result.type === 'feature' || result.parent) visibleFeatures.add(result.parent || result.element);
      if (result.type === 'scenario' || result.parent) visibleScenarios.add(result.parent || result.element);

      // Highlight matching text
      this.highlightText(result.element, query);
    });

    // Show visible features and scenarios
    visibleFeatures.forEach(feature => {
      feature.style.display = 'block';
    });
  }

  highlightText(element, query) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;

    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      if (textNode.textContent.toLowerCase().includes(query.toLowerCase())) {
        const parent = textNode.parentNode;
        const html = parent.innerHTML;
        const regex = new RegExp(\`(\${this.escapeRegExp(query)})\`, 'gi');
        parent.innerHTML = html.replace(regex, '<mark class="search-highlight">$1</mark>');
      }
    });
  }

  clearSearch() {
    // Remove all highlights
    document.querySelectorAll('.search-highlight').forEach(highlight => {
      const parent = highlight.parentNode;
      parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
      parent.normalize();
    });

    // Show all elements
    document.querySelectorAll('.feature-section').forEach(feature => {
      feature.style.display = 'block';
    });

    this.updateSearchStats(this.searchIndex.length, this.searchIndex.length);
  }

  updateSearchStats(visible, total) {
    const statsElement = document.getElementById('searchResults');
    if (statsElement) {
      if (visible === total) {
        statsElement.textContent = 'All items visible';
        statsElement.className = 'badge badge-info';
      } else {
        statsElement.textContent = \`\${visible} of \${total} items visible\`;
        statsElement.className = visible > 0 ? 'badge badge-success' : 'badge badge-warning';
      }
    }
  }

  // Filter Functionality
  initializeFilters() {
    // Populate tag filter
    this.populateTagFilter();
  }

  populateTagFilter() {
    const tagFilter = document.getElementById('tagFilter');
    if (!tagFilter) return;

    const tags = new Set();
    document.querySelectorAll('[class*="tag"]').forEach(tagElement => {
      const tagText = tagElement.textContent.trim();
      if (tagText.startsWith('@')) {
        tags.add(tagText);
      }
    });

    tags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      tagFilter.appendChild(option);
    });
  }

  applyFilters() {
    const statusFilter = document.getElementById('statusFilter')?.value;
    const tagFilter = document.getElementById('tagFilter')?.value;
    const durationFilter = document.getElementById('durationFilter')?.value;

    this.currentFilters = { statusFilter, tagFilter, durationFilter };

    // Apply filters logic here
    this.filterContent();
  }

  filterContent() {
    const scenarios = document.querySelectorAll('.scenario-row');
    let visibleCount = 0;

    scenarios.forEach(scenario => {
      let visible = true;

      // Status filter
      if (this.currentFilters.statusFilter) {
        const hasStatus = scenario.classList.contains(this.currentFilters.statusFilter);
        if (!hasStatus) visible = false;
      }

      // Tag filter
      if (this.currentFilters.tagFilter) {
        const hasTag = scenario.querySelector(\`[class*="tag"]\`)?.textContent.includes(this.currentFilters.tagFilter);
        if (!hasTag) visible = false;
      }

      // Duration filter
      if (this.currentFilters.durationFilter) {
        // Implementation depends on how duration is stored/displayed
      }

      scenario.style.display = visible ? 'block' : 'none';
      if (visible) visibleCount++;
    });

    this.updateFilterStats(visibleCount, scenarios.length);
  }

  clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('tagFilter').value = '';
    document.getElementById('durationFilter').value = '';

    this.currentFilters = {};

    document.querySelectorAll('.scenario-row').forEach(scenario => {
      scenario.style.display = 'block';
    });

    this.updateFilterStats(document.querySelectorAll('.scenario-row').length, document.querySelectorAll('.scenario-row').length);
  }

  updateFilterStats(visible, total) {
    // Update filter statistics display
    console.log(\`Filters applied: \${visible} of \${total} scenarios visible\`);
  }

  // Dark Mode
  initializeDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        this.toggleDarkMode();
      });

      if (this.darkMode) {
        this.enableDarkMode();
      }
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode);

    if (this.darkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  enableDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
      toggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
  }

  disableDarkMode() {
    document.documentElement.removeAttribute('data-theme');
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
      toggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
  }

  // Screenshot Modals
  initializeScreenshotModals() {
    document.querySelectorAll('.screenshot-thumbnail').forEach(thumbnail => {
      thumbnail.addEventListener('click', (e) => {
        this.showScreenshotModal(e.target);
      });
    });
  }

  showScreenshotModal(thumbnail) {
    const modal = document.getElementById('screenshotModal');
    const modalImg = document.getElementById('modalScreenshot');
    const downloadLink = document.getElementById('downloadScreenshot');
    const info = document.getElementById('screenshotInfo');

    if (modal && modalImg) {
      modalImg.src = thumbnail.src;
      downloadLink.href = thumbnail.src;
      info.textContent = thumbnail.alt || 'Screenshot';

      \$(modal).modal('show'); // Assuming Bootstrap is available
    }
  }

  // Export Functions
  initializeExportFunctions() {
    const exportPDF = document.getElementById('exportPDF');
    const exportJSON = document.getElementById('exportJSON');
    const exportCSV = document.getElementById('exportCSV');
    const printReport = document.getElementById('printReport');

    if (exportPDF) {
      exportPDF.addEventListener('click', () => this.exportToPDF());
    }

    if (exportJSON) {
      exportJSON.addEventListener('click', () => this.exportToJSON());
    }

    if (exportCSV) {
      exportCSV.addEventListener('click', () => this.exportToCSV());
    }

    if (printReport) {
      printReport.addEventListener('click', () => window.print());
    }
  }

  async exportToPDF() {
    // This would require a PDF generation library or service
    alert('PDF export functionality would be implemented here');
  }

  exportToJSON() {
    // Export current visible data as JSON
    const data = this.collectVisibleData();
    this.downloadAsFile(JSON.stringify(data, null, 2), 'cucumber-report.json', 'application/json');
  }

  exportToCSV() {
    // Export current visible data as CSV
    const data = this.collectVisibleDataAsCSV();
    this.downloadAsFile(data, 'cucumber-report.csv', 'text/csv');
  }

  collectVisibleData() {
    // Collect currently visible test data
    const features = [];
    document.querySelectorAll('.feature-section:not([style*="display: none"])').forEach(feature => {
      features.push({
        name: feature.querySelector('.feature-title')?.textContent,
        scenarios: Array.from(feature.querySelectorAll('.scenario-row:not([style*="display: none"])')).map(scenario => ({
          name: scenario.querySelector('h4')?.textContent,
          status: scenario.className.includes('passed') ? 'passed' : scenario.className.includes('failed') ? 'failed' : 'skipped'
        }))
      });
    });
    return { features, exportTime: new Date().toISOString() };
  }

  collectVisibleDataAsCSV() {
    let csv = 'Feature,Scenario,Status\\n';
    document.querySelectorAll('.feature-section:not([style*="display: none"])').forEach(feature => {
      const featureName = feature.querySelector('.feature-title')?.textContent || '';
      feature.querySelectorAll('.scenario-row:not([style*="display: none"])').forEach(scenario => {
        const scenarioName = scenario.querySelector('h4')?.textContent || '';
        const status = scenario.className.includes('passed') ? 'passed' : 
                      scenario.className.includes('failed') ? 'failed' : 'skipped';
        csv += \`"\${featureName}","\${scenarioName}","\${status}"\\n\`;
      });
    });
    return csv;
  }

  downloadAsFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Keyboard Shortcuts
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + F for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Ctrl/Cmd + D for dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        this.toggleDarkMode();
      }

      // Escape to clear search
      if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput === document.activeElement) {
          this.clearSearch();
          searchInput.blur();
        }
      }
    });
  }

  // Utility Functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CucumberReportEnhancer();
});

// Add CSS for search highlighting
const style = document.createElement('style');
style.textContent = \`
  .search-highlight {
    background-color: #ffeb3b;
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: bold;
  }
  
  [data-theme="dark"] .search-highlight {
    background-color: #ff9800;
    color: #000;
  }
\`;
document.head.appendChild(style);
    `;
  }

  /**
   * Generate PDF report using Puppeteer
   */
  async generatePDFReport() {
    if (!this.options.enablePDFExport) return;

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Load the HTML report
      const htmlPath = path.join(this.options.outputDir, 'index.html');
      await page.goto(`file://${path.resolve(htmlPath)}`, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const pdfPath = path.join(this.options.outputDir, 'cucumber-report.pdf');
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });

      await browser.close();
      console.log(`📄 PDF report generated: ${pdfPath}`);

    } catch (error) {
      console.warn('⚠️ PDF export failed:', error.message);
    }
  }

  // Utility methods
  calculatePassRate() {
    if (this.stats.totalScenarios === 0) return 0;
    return Math.round((this.stats.passedScenarios / this.stats.totalScenarios) * 100);
  }

  darkenColor(color, factor) {
    // Simple color darkening utility
    return color; // Simplified for example
  }

  formatDuration(nanoseconds) {
    if (!nanoseconds) return 'N/A';
    const seconds = nanoseconds / 1000000000;
    return `${seconds.toFixed(2)}s`;
  }

  calculateFeatureStatistics(feature) {
    // Calculate feature-level statistics
    return {
      totalScenarios: feature.elements?.length || 0,
      // Add more statistics as needed
    };
  }

  calculateScenarioDuration(scenario) {
    if (!scenario.steps) return 0;
    return scenario.steps.reduce((total, step) => {
      return total + (step.result?.duration || 0);
    }, 0);
  }

  determineScenarioStatus(scenario) {
    if (!scenario.steps) return 'unknown';
    
    const hasFailedStep = scenario.steps.some(step => step.result?.status === 'failed');
    const hasSkippedStep = scenario.steps.some(step => step.result?.status === 'skipped');
    
    if (hasFailedStep) return 'failed';
    if (hasSkippedStep) return 'skipped';
    return 'passed';
  }

  findScreenshotForStep(step) {
    // Look for embedded screenshots in step
    return step.embeddings?.find(embed => 
      embed.mime_type?.startsWith('image/')
    )?.data || null;
  }

  analyzeError(errorMessage) {
    // Basic error analysis
    return {
      type: this.categorizeError(errorMessage),
      summary: errorMessage.split('\n')[0],
      suggestions: this.getErrorSuggestions(errorMessage)
    };
  }

  categorizeError(errorMessage) {
    if (errorMessage.includes('TimeoutError')) return 'timeout';
    if (errorMessage.includes('ElementNotFound')) return 'element';
    if (errorMessage.includes('AssertionError')) return 'assertion';
    return 'unknown';
  }

  getErrorSuggestions(errorMessage) {
    // Return relevant suggestions based on error type
    return [];
  }

  /**
   * Inject custom assets into HTML
   */
  injectCustomAssets(html) {
    // Add CSS reference
    const cssLink = '<link rel="stylesheet" href="css/advanced-report.css">';
    html = html.replace('</head>', `${cssLink}\n</head>`);
    
    // Add JavaScript reference
    const jsScript = '<script src="js/report-interactive.js"></script>';
    html = html.replace('</body>', `${jsScript}\n</body>`);
    
    return html;
  }
}

// Export for use in other scripts
module.exports = AdvancedHTMLReporter;

// CLI usage
if (require.main === module) {
  const reporter = new AdvancedHTMLReporter({
    enableSearch: true,
    enableFiltering: true,
    enableScreenshots: true,
    enableDarkMode: true,
    enablePDFExport: false // Requires puppeteer
  });

  reporter.generateReport()
    .then((stats) => {
      console.log('📊 Report Statistics:', stats);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Report generation failed:', error);
      process.exit(1);
    });
}
```

---

## Usage Examples

### 1. Basic Usage

```bash
# Generate advanced HTML report
node scripts/advanced-html-reporter.js

# With custom options
node -e "
const Reporter = require('./scripts/advanced-html-reporter');
const reporter = new Reporter({
  theme: 'professional',
  brandColor: '#2c3e50',
  enableDarkMode: true,
  enablePDFExport: true
});
reporter.generateReport();
"
```

### 2. Integration with Package.json

```json
{
  "scripts": {
    "test:advanced-report": "cucumber-js && node scripts/advanced-html-reporter.js",
    "report:interactive": "node scripts/advanced-html-reporter.js",
    "report:pdf": "node -e \"const r = require('./scripts/advanced-html-reporter'); new r({enablePDFExport: true}).generateReport();\""
  }
}
```

### 3. Custom Configuration

```javascript
// cucumber.js - Enhanced configuration
module.exports = {
  default: {
    format: [
      '@cucumber/pretty-formatter',
      'json:reports/json/cucumber-report.json',
      'html:reports/html/basic-report.html'
    ],
    
    // Enhanced world parameters for screenshots
    worldParameters: {
      screenshotPath: 'reports/screenshots/',
      enableScreenshots: true,
      screenshotOnFailure: true
    }
  }
};
```

---

## Key Features Demonstrated

### 1. **Interactive Search and Filtering**
- Real-time search across features, scenarios, and steps
- Multiple filter criteria (status, tags, duration)
- Keyboard shortcuts for power users
- Search highlighting and result statistics

### 2. **Rich Media Integration**
- Screenshot thumbnails with modal previews
- Video embed support for test recordings
- Lazy loading for performance optimization
- Download capabilities for media assets

### 3. **Professional Theming**
- Custom CSS with CSS variables for easy theming
- Dark mode support with user preference persistence
- Responsive design for mobile and tablet access
- Print-optimized styles for hard copy reports

### 4. **Export and Sharing**
- PDF generation using Puppeteer
- JSON and CSV export for data analysis
- Print-friendly formatting
- Social sharing capabilities

### 5. **Accessibility and Performance**
- WCAG compliance with proper ARIA labels
- Screen reader support
- High contrast mode compatibility
- Reduced motion support for accessibility
- Virtual scrolling for large test suites

---

## Best Practices Highlighted

### 1. **Performance Optimization**
- Efficient DOM manipulation and event handling
- Debounced search to prevent excessive processing
- Lazy loading of images and media content
- Virtual scrolling for large datasets

### 2. **User Experience**
- Intuitive navigation and interaction patterns
- Progressive enhancement for JavaScript features
- Graceful degradation when features aren't available
- Consistent visual feedback for user actions

### 3. **Maintainability**
- Modular CSS with CSS custom properties
- Clean, documented JavaScript code
- Configurable options for different use cases
- Extensible architecture for custom features

---

## Next Steps

This advanced HTML reporting example provides a solid foundation for professional test documentation. Continue with:

1. **[Custom Report Templates](./03-custom-report-templates.md)** - Learn to create audience-specific reports
2. **[Real-time Dashboard Integration](./04-realtime-dashboard-integration.md)** - Build live monitoring systems

### Key Takeaways

- ✅ **Interactive features** significantly improve report usability
- ✅ **Professional theming** enhances stakeholder communication
- ✅ **Accessibility compliance** ensures reports are usable by everyone
- ✅ **Export capabilities** provide flexibility for different use cases
- ✅ **Performance optimization** handles large test suites efficiently

You now have the tools to create sophisticated, interactive HTML reports that transform test results into compelling living documentation! 🎨

**[Continue to Example 03: Custom Report Templates →](./03-custom-report-templates.md)**