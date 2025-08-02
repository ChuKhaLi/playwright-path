# Example 03: Custom Report Templates

## Overview

This example demonstrates how to create custom report templates tailored for different audiences and use cases. You'll learn to build flexible templating systems that generate specialized reports for developers, managers, QA teams, and stakeholders, each with relevant information and appropriate presentation styles.

**Duration**: 50 minutes  
**Complexity**: Advanced  
**Prerequisites**: Completion of Examples 01-02 (Basic and Advanced HTML Reports)  

---

## Learning Objectives

By completing this example, you will master:

- ✅ **Template Engine Integration**: Implement Handlebars, Mustache, and custom templating
- ✅ **Audience-Specific Reports**: Create targeted reports for different stakeholders
- ✅ **Dynamic Content Generation**: Build adaptive reports based on test results
- ✅ **Multi-Format Output**: Generate HTML, Markdown, and JSON reports from templates
- ✅ **Brand Integration**: Incorporate company branding and style guidelines
- ✅ **Internationalization**: Support multiple languages and locales

---

## Custom Template System Architecture

### 1. Template Engine Factory

Create a flexible template system supporting multiple engines:

```javascript
// src/reporting/template-engine-factory.js
const Handlebars = require('handlebars');
const Mustache = require('mustache');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

/**
 * Template Engine Factory - Supports multiple templating systems
 */
class TemplateEngineFactory {
  constructor() {
    this.engines = new Map();
    this.helpers = new Map();
    this.partials = new Map();
    
    this.initializeEngines();
    this.registerDefaultHelpers();
  }

  /**
   * Initialize all supported template engines
   */
  initializeEngines() {
    // Handlebars engine
    this.engines.set('handlebars', {
      compile: (template) => Handlebars.compile(template),
      render: (compiled, data) => compiled(data),
      extension: '.hbs'
    });

    // Mustache engine
    this.engines.set('mustache', {
      compile: (template) => template, // Mustache doesn't pre-compile
      render: (template, data) => Mustache.render(template, data),
      extension: '.mustache'
    });

    // Simple custom engine for basic templating
    this.engines.set('simple', {
      compile: (template) => template,
      render: (template, data) => this.simpleTemplateRender(template, data),
      extension: '.tpl'
    });
  }

  /**
   * Register default template helpers
   */
  registerDefaultHelpers() {
    // Date formatting helper
    this.registerHelper('formatDate', (date, format = 'YYYY-MM-DD HH:mm:ss') => {
      return moment(date).format(format);
    });

    // Duration formatting helper
    this.registerHelper('formatDuration', (nanoseconds) => {
      if (!nanoseconds) return '0ms';
      const milliseconds = nanoseconds / 1000000;
      if (milliseconds < 1000) return `${Math.round(milliseconds)}ms`;
      const seconds = milliseconds / 1000;
      if (seconds < 60) return `${seconds.toFixed(2)}s`;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
    });

    // Percentage helper
    this.registerHelper('percentage', (value, total) => {
      if (total === 0) return '0%';
      return `${Math.round((value / total) * 100)}%`;
    });

    // Status badge helper
    this.registerHelper('statusBadge', (status) => {
      const badges = {
        passed: '<span class="badge badge-success">✓ Passed</span>',
        failed: '<span class="badge badge-danger">✗ Failed</span>',
        skipped: '<span class="badge badge-warning">⚠ Skipped</span>',
        pending: '<span class="badge badge-info">⏸ Pending</span>'
      };
      return badges[status] || `<span class="badge badge-secondary">${status}</span>`;
    });

    // Conditional helper
    this.registerHelper('if_eq', (a, b, options) => {
      return a === b ? options.fn(this) : options.inverse(this);
    });

    // Math helpers
    this.registerHelper('add', (a, b) => a + b);
    this.registerHelper('subtract', (a, b) => a - b);
    this.registerHelper('multiply', (a, b) => a * b);
    this.registerHelper('divide', (a, b) => b !== 0 ? a / b : 0);

    // Array helpers
    this.registerHelper('length', (array) => Array.isArray(array) ? array.length : 0);
    this.registerHelper('first', (array) => Array.isArray(array) && array.length > 0 ? array[0] : null);
    this.registerHelper('last', (array) => Array.isArray(array) && array.length > 0 ? array[array.length - 1] : null);
  }

  /**
   * Register a custom helper function
   */
  registerHelper(name, fn) {
    this.helpers.set(name, fn);
    
    // Register with Handlebars
    Handlebars.registerHelper(name, fn);
  }

  /**
   * Register a partial template
   */
  registerPartial(name, template) {
    this.partials.set(name, template);
    
    // Register with Handlebars
    Handlebars.registerPartial(name, template);
  }

  /**
   * Get template engine by name
   */
  getEngine(engineName) {
    const engine = this.engines.get(engineName);
    if (!engine) {
      throw new Error(`Template engine '${engineName}' not found`);
    }
    return engine;
  }

  /**
   * Simple template rendering for basic use cases
   */
  simpleTemplateRender(template, data) {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const keys = key.trim().split('.');
      let value = data;
      
      for (const k of keys) {
        value = value && value[k];
      }
      
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Load template from file
   */
  async loadTemplate(templatePath) {
    const exists = await fs.pathExists(templatePath);
    if (!exists) {
      throw new Error(`Template file not found: ${templatePath}`);
    }
    
    return await fs.readFile(templatePath, 'utf8');
  }

  /**
   * Render template with data
   */
  renderTemplate(engineName, template, data) {
    const engine = this.getEngine(engineName);
    const compiled = engine.compile(template);
    return engine.render(compiled, data);
  }
}

module.exports = TemplateEngineFactory;
```

### 2. Custom Report Generator

Build a comprehensive report generator supporting multiple templates:

```javascript
// src/reporting/custom-report-generator.js
const TemplateEngineFactory = require('./template-engine-factory');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const showdown = require('showdown'); // For Markdown to HTML conversion

/**
 * Custom Report Generator with Template Support
 */
class CustomReportGenerator {
  constructor(options = {}) {
    this.options = {
      // Input/Output paths
      jsonDir: options.jsonDir || 'reports/json/',
      templatesDir: options.templatesDir || 'templates/',
      outputDir: options.outputDir || 'reports/custom/',
      assetsDir: options.assetsDir || 'assets/',
      
      // Template engine settings
      defaultEngine: options.defaultEngine || 'handlebars',
      
      // Report configuration
      includeScreenshots: options.includeScreenshots !== false,
      includeTimestamps: options.includeTimestamps !== false,
      includeStatistics: options.includeStatistics !== false,
      
      // Localization
      locale: options.locale || 'en',
      timezone: options.timezone || 'UTC',
      
      // Branding
      brandName: options.brandName || 'Test Report',
      brandLogo: options.brandLogo || null,
      brandColors: options.brandColors || {
        primary: '#007bff',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107'
      },
      
      ...options
    };

    this.templateEngine = new TemplateEngineFactory();
    this.markdownConverter = new showdown.Converter({
      tables: true,
      strikethrough: true,
      tasklists: true
    });
    
    this.testData = null;
    this.statistics = {};
  }

  /**
   * Generate custom reports from templates
   */
  async generateReports(templateConfigs) {
    console.log('🎨 Generating custom reports from templates...');
    
    try {
      // Load and process test data
      await this.loadTestData();
      
      // Calculate statistics
      this.calculateStatistics();
      
      // Prepare output directory
      await this.prepareOutputDirectory();
      
      // Generate each configured report
      const results = [];
      for (const config of templateConfigs) {
        const result = await this.generateSingleReport(config);
        results.push(result);
      }
      
      console.log(`✅ Generated ${results.length} custom reports successfully!`);
      return results;
      
    } catch (error) {
      console.error('❌ Custom report generation failed:', error.message);
      throw error;
    }
  }

  /**
   * Load and process test data from JSON files
   */
  async loadTestData() {
    const jsonFiles = await fs.readdir(this.options.jsonDir);
    const cucumberFiles = jsonFiles.filter(file => file.endsWith('.json'));
    
    this.testData = [];
    
    for (const file of cucumberFiles) {
      const filePath = path.join(this.options.jsonDir, file);
      const jsonData = await fs.readJson(filePath);
      this.testData = this.testData.concat(jsonData);
    }
    
    // Enhance test data with additional information
    this.testData = this.enhanceTestData(this.testData);
    
    console.log(`📊 Loaded ${this.testData.length} features from ${cucumberFiles.length} files`);
  }

  /**
   * Enhance test data with computed properties
   */
  enhanceTestData(features) {
    return features.map(feature => ({
      ...feature,
      
      // Add feature-level statistics
      featureStats: this.calculateFeatureStats(feature),
      
      // Add enhanced elements (scenarios)
      elements: feature.elements?.map(scenario => ({
        ...scenario,
        
        // Add scenario duration and status
        duration: this.calculateScenarioDuration(scenario),
        status: this.determineScenarioStatus(scenario),
        
        // Add enhanced steps
        steps: scenario.steps?.map(step => ({
          ...step,
          
          // Add readable duration
          readableDuration: this.formatDuration(step.result?.duration),
          
          // Add step number for easier reference
          stepNumber: scenario.steps.indexOf(step) + 1,
          
          // Add error analysis for failed steps
          errorAnalysis: step.result?.error_message ? 
            this.analyzeError(step.result.error_message) : null
        }))
      }))
    }));
  }

  /**
   * Calculate comprehensive statistics
   */
  calculateStatistics() {
    this.statistics = {
      // Basic counts
      totalFeatures: this.testData.length,
      totalScenarios: 0,
      totalSteps: 0,
      
      // Status counts
      passedScenarios: 0,
      failedScenarios: 0,
      skippedScenarios: 0,
      pendingScenarios: 0,
      
      passedSteps: 0,
      failedSteps: 0,
      skippedSteps: 0,
      pendingSteps: 0,
      
      // Timing
      totalDuration: 0,
      averageScenarioDuration: 0,
      
      // Success rates
      featurePassRate: 0,
      scenarioPassRate: 0,
      stepPassRate: 0,
      
      // Additional metrics
      topFailedScenarios: [],
      slowestScenarios: [],
      errorCategories: {},
      
      // Execution metadata
      executionStart: null,
      executionEnd: null,
      environment: {
        platform: process.platform,
        nodeVersion: process.version,
        cucumberVersion: this.getCucumberVersion()
      }
    };

    // Calculate basic statistics
    this.testData.forEach(feature => {
      feature.elements?.forEach(scenario => {
        this.statistics.totalScenarios++;
        
        // Calculate scenario duration and status
        const scenarioDuration = this.calculateScenarioDuration(scenario);
        const scenarioStatus = this.determineScenarioStatus(scenario);
        
        this.statistics.totalDuration += scenarioDuration;
        
        // Count scenario statuses
        this.statistics[`${scenarioStatus}Scenarios`]++;
        
        // Track slow and failed scenarios
        if (scenarioStatus === 'failed') {
          this.statistics.topFailedScenarios.push({
            feature: feature.name,
            scenario: scenario.name,
            duration: scenarioDuration
          });
        }
        
        if (scenarioDuration > 10000000000) { // > 10 seconds
          this.statistics.slowestScenarios.push({
            feature: feature.name,
            scenario: scenario.name,
            duration: scenarioDuration
          });
        }
        
        // Step-level statistics
        scenario.steps?.forEach(step => {
          this.statistics.totalSteps++;
          const stepStatus = step.result?.status || 'pending';
          this.statistics[`${stepStatus}Steps`]++;
          
          // Analyze errors
          if (stepStatus === 'failed' && step.result?.error_message) {
            const errorCategory = this.categorizeError(step.result.error_message);
            this.statistics.errorCategories[errorCategory] = 
              (this.statistics.errorCategories[errorCategory] || 0) + 1;
          }
        });
      });
    });
    
    // Calculate derived metrics
    this.statistics.averageScenarioDuration = 
      this.statistics.totalScenarios > 0 ? 
        this.statistics.totalDuration / this.statistics.totalScenarios : 0;
    
    this.statistics.scenarioPassRate = 
      this.statistics.totalScenarios > 0 ? 
        (this.statistics.passedScenarios / this.statistics.totalScenarios) * 100 : 0;
    
    this.statistics.stepPassRate = 
      this.statistics.totalSteps > 0 ? 
        (this.statistics.passedSteps / this.statistics.totalSteps) * 100 : 0;
    
    // Sort and limit top lists
    this.statistics.topFailedScenarios = this.statistics.topFailedScenarios
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
    
    this.statistics.slowestScenarios = this.statistics.slowestScenarios
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
  }

  /**
   * Generate a single report from template configuration
   */
  async generateSingleReport(config) {
    console.log(`📝 Generating report: ${config.name}`);
    
    // Load template
    const templatePath = path.join(this.options.templatesDir, config.template);
    const template = await this.templateEngine.loadTemplate(templatePath);
    
    // Prepare template data
    const templateData = this.prepareTemplateData(config);
    
    // Render template
    const engine = config.engine || this.options.defaultEngine;
    const rendered = this.templateEngine.renderTemplate(engine, template, templateData);
    
    // Process output based on format
    let finalOutput = rendered;
    if (config.format === 'html' && config.markdownToHtml) {
      finalOutput = this.markdownConverter.makeHtml(rendered);
    }
    
    // Write output file
    const outputPath = path.join(this.options.outputDir, config.output);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, finalOutput, 'utf8');
    
    // Copy associated assets if specified
    if (config.assets) {
      await this.copyTemplateAssets(config.assets, config.name);
    }
    
    console.log(`✓ Generated: ${outputPath}`);
    
    return {
      name: config.name,
      template: config.template,
      output: outputPath,
      size: finalOutput.length,
      format: config.format
    };
  }

  /**
   * Prepare data for template rendering
   */
  prepareTemplateData(config) {
    const now = moment();
    
    // Base template data
    const templateData = {
      // Report metadata
      report: {
        title: config.title || this.options.brandName,
        subtitle: config.subtitle || 'Automated Test Results',
        generated: now.format('YYYY-MM-DD HH:mm:ss'),
        generatedISO: now.toISOString(),
        audience: config.audience || 'general',
        format: config.format || 'html',
        version: this.getReportVersion()
      },
      
      // Branding
      brand: {
        name: this.options.brandName,
        logo: this.options.brandLogo,
        colors: this.options.brandColors
      },
      
      // Test data and statistics
      features: this.testData,
      statistics: this.statistics,
      
      // Filtered/processed data based on config
      ...(await this.applyDataFilters(config))
    };
    
    // Add audience-specific customizations
    return this.customizeForAudience(templateData, config.audience);
  }

  /**
   * Apply data filters based on template configuration
   */
  async applyDataFilters(config) {
    const filtered = {};
    
    // Filter by tags if specified
    if (config.filters?.tags) {
      filtered.filteredFeatures = this.filterFeaturesByTags(
        this.testData, 
        config.filters.tags
      );
    }
    
    // Filter by status if specified
    if (config.filters?.status) {
      filtered.filteredScenarios = this.filterScenariosByStatus(
        this.testData, 
        config.filters.status
      );
    }
    
    // Include only specific statistics if configured
    if (config.filters?.statistics) {
      filtered.filteredStatistics = this.filterStatistics(
        this.statistics, 
        config.filters.statistics
      );
    }
    
    return filtered;
  }

  /**
   * Customize template data for specific audiences
   */
  customizeForAudience(templateData, audience) {
    switch (audience) {
      case 'executive':
        return {
          ...templateData,
          // Executive summary focus
          showDetailedSteps: false,
          showTechnicalDetails: false,
          emphasizeMetrics: true,
          includeRecommendations: true,
          summaryMetrics: this.generateExecutiveSummary()
        };
        
      case 'developer':
        return {
          ...templateData,
          // Developer focus
          showDetailedSteps: true,
          showTechnicalDetails: true,
          showStackTraces: true,
          includeCodeSnippets: true,
          debugInfo: this.generateDebugInfo()
        };
        
      case 'qa':
        return {
          ...templateData,
          // QA team focus
          showTestCoverage: true,
          showDetailedResults: true,
          includeScreenshots: true,
          testMetrics: this.generateQAMetrics()
        };
        
      case 'manager':
        return {
          ...templateData,
          // Manager focus
          showTrends: true,
          showResourceUsage: true,
          includeTimelines: true,
          managementSummary: this.generateManagementSummary()
        };
        
      default:
        return templateData;
    }
  }

  /**
   * Copy template-specific assets
   */
  async copyTemplateAssets(assets, templateName) {
    for (const asset of assets) {
      const sourcePath = path.join(this.options.templatesDir, asset.source);
      const destPath = path.join(this.options.outputDir, asset.destination);
      
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(sourcePath, destPath);
    }
  }

  /**
   * Prepare output directory structure
   */
  async prepareOutputDirectory() {
    await fs.ensureDir(this.options.outputDir);
    await fs.ensureDir(path.join(this.options.outputDir, 'assets'));
    await fs.ensureDir(path.join(this.options.outputDir, 'css'));
    await fs.ensureDir(path.join(this.options.outputDir, 'js'));
    await fs.ensureDir(path.join(this.options.outputDir, 'images'));
  }

  // Utility methods
  calculateFeatureStats(feature) {
    // Implementation for feature statistics
    return {
      scenarioCount: feature.elements?.length || 0,
      // Add more feature-specific stats
    };
  }

  calculateScenarioDuration(scenario) {
    if (!scenario.steps) return 0;
    return scenario.steps.reduce((total, step) => {
      return total + (step.result?.duration || 0);
    }, 0);
  }

  determineScenarioStatus(scenario) {
    if (!scenario.steps || scenario.steps.length === 0) return 'pending';
    
    const hasFailedStep = scenario.steps.some(step => step.result?.status === 'failed');
    const hasSkippedStep = scenario.steps.some(step => step.result?.status === 'skipped');
    const hasPendingStep = scenario.steps.some(step => !step.result || step.result.status === 'pending');
    
    if (hasFailedStep) return 'failed';
    if (hasPendingStep) return 'pending';
    if (hasSkippedStep) return 'skipped';
    return 'passed';
  }

  formatDuration(nanoseconds) {
    if (!nanoseconds) return '0ms';
    const milliseconds = nanoseconds / 1000000;
    if (milliseconds < 1000) return `${Math.round(milliseconds)}ms`;
    const seconds = milliseconds / 1000;
    return `${seconds.toFixed(2)}s`;
  }

  analyzeError(errorMessage) {
    return {
      category: this.categorizeError(errorMessage),
      summary: errorMessage.split('\n')[0],
      stackTrace: errorMessage
    };
  }

  categorizeError(errorMessage) {
    if (errorMessage.includes('TimeoutError')) return 'timeout';
    if (errorMessage.includes('ElementNotFound')) return 'element';
    if (errorMessage.includes('AssertionError')) return 'assertion';
    if (errorMessage.includes('NetworkError')) return 'network';
    return 'unknown';
  }

  // Filter methods
  filterFeaturesByTags(features, tags) {
    return features.filter(feature => 
      feature.tags?.some(tag => tags.includes(tag.name))
    );
  }

  filterScenariosByStatus(features, statuses) {
    const scenarios = [];
    features.forEach(feature => {
      feature.elements?.forEach(scenario => {
        const status = this.determineScenarioStatus(scenario);
        if (statuses.includes(status)) {
          scenarios.push({
            ...scenario,
            featureName: feature.name,
            status
          });
        }
      });
    });
    return scenarios;
  }

  filterStatistics(statistics, fields) {
    const filtered = {};
    fields.forEach(field => {
      if (statistics.hasOwnProperty(field)) {
        filtered[field] = statistics[field];
      }
    });
    return filtered;
  }

  // Summary generation methods
  generateExecutiveSummary() {
    return {
      overallHealth: this.statistics.scenarioPassRate > 90 ? 'Excellent' : 
                    this.statistics.scenarioPassRate > 75 ? 'Good' : 
                    this.statistics.scenarioPassRate > 50 ? 'Fair' : 'Poor',
      keyMetrics: {
        totalTests: this.statistics.totalScenarios,
        passRate: Math.round(this.statistics.scenarioPassRate),
        executionTime: this.formatDuration(this.statistics.totalDuration)
      },
      recommendations: this.generateRecommendations()
    };
  }

  generateDebugInfo() {
    return {
      failedTests: this.statistics.topFailedScenarios,
      errorBreakdown: this.statistics.errorCategories,
      slowTests: this.statistics.slowestScenarios
    };
  }

  generateQAMetrics() {
    return {
      testCoverage: {
        // Calculate based on available data
        featuresExecuted: this.statistics.totalFeatures,
        scenariosExecuted: this.statistics.totalScenarios
      },
      qualityMetrics: {
        defectDetectionRate: this.calculateDefectDetectionRate(),
        testEffectiveness: this.calculateTestEffectiveness()
      }
    };
  }

  generateManagementSummary() {
    return {
      timeline: this.generateExecutionTimeline(),
      resourceUsage: this.generateResourceUsage(),
      trends: this.generateTrends()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.statistics.scenarioPassRate < 80) {
      recommendations.push('Consider reviewing failing test scenarios and underlying functionality');
    }
    
    if (this.statistics.slowestScenarios.length > 0) {
      recommendations.push('Optimize slow-running test scenarios to improve feedback time');
    }
    
    if (Object.keys(this.statistics.errorCategories).length > 0) {
      recommendations.push('Address common error patterns to improve test reliability');
    }
    
    return recommendations;
  }

  // Additional utility methods
  getCucumberVersion() {
    try {
      const pkg = require('@cucumber/cucumber/package.json');
      return pkg.version;
    } catch {
      return 'unknown';
    }
  }

  getReportVersion() {
    return '1.0.0'; // Version of your report generator
  }

  calculateDefectDetectionRate() {
    // Implement based on your specific metrics
    return Math.round(this.statistics.scenarioPassRate);
  }

  calculateTestEffectiveness() {
    // Implement based on your specific metrics
    return Math.round((this.statistics.passedSteps / this.statistics.totalSteps) * 100);
  }

  generateExecutionTimeline() {
    // Generate timeline data
    return {
      start: moment().subtract(this.statistics.totalDuration / 1000000000, 'seconds').format(),
      end: moment().format(),
      duration: this.formatDuration(this.statistics.totalDuration)
    };
  }

  generateResourceUsage() {
    // Generate resource usage data
    return {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };
  }

  generateTrends() {
    // Generate trend data (would typically compare with historical data)
    return {
      passRateTrend: 'stable',
      executionTimeTrend: 'improving',
      testCountTrend: 'increasing'
    };
  }
}

module.exports = CustomReportGenerator;
```

---

## Template Examples

### 1. Executive Summary Template

```handlebars
<!-- templates/executive-summary.hbs -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{report.title}} - Executive Summary</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --primary-color: {{brand.colors.primary}};
            --success-color: {{brand.colors.success}};
            --danger-color: {{brand.colors.danger}};
            --warning-color: {{brand.colors.warning}};
        }
        
        .executive-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, #4a90e2 100%);
            color: white;
            padding: 2rem 0;
        }
        
        .metric-card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-5px);
        }
        
        .metric-number {
            font-size: 3rem;
            font-weight: 700;
        }
        
        .health-indicator {
            padding: 1rem;
            border-radius: 10px;
            text-align: center;
            font-weight: 600;
            font-size: 1.2rem;
        }
        
        .health-excellent { background: #d4edda; color: #155724; }
        .health-good { background: #cce5ff; color: #004085; }
        .health-fair { background: #fff3cd; color: #856404; }
        .health-poor { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <!-- Executive Header -->
    <div class="executive-header">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h1><i class="fas fa-chart-line"></i> {{report.title}}</h1>
                    <p class="lead mb-0">{{report.subtitle}} • {{report.generated}}</p>
                </div>
                <div class="col-md-4 text-end">
                    {{#if brand.logo}}
                    <img src="{{brand.logo}}" alt="{{brand.name}}" height="60">
                    {{/if}}
                </div>
            </div>
        </div>
    </div>

    <div class="container my-5">
        <!-- Overall Health Status -->
        <div class="row mb-5">
            <div class="col-12">
                <div class="card metric-card">
                    <div class="card-body text-center">
                        <h2 class="card-title">Overall System Health</h2>
                        <div class="health-indicator health-{{toLowerCase summaryMetrics.overallHealth}}">
                            {{summaryMetrics.overallHealth}}
                        </div>
                        <p class="mt-3 text-muted">Based on {{summaryMetrics.keyMetrics.totalTests}} automated tests</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Key Metrics -->
        <div class="row mb-5">
            <div class="col-md-4 mb-4">
                <div class="card metric-card h-100">
                    <div class="card-body text-center">
                        <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
                        <div class="metric-number text-success">{{summaryMetrics.keyMetrics.passRate}}%</div>
                        <h5>Success Rate</h5>
                        <p class="text-muted">Tests passing successfully</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card metric-card h-100">
                    <div class="card-body text-center">
                        <i class="fas fa-stopwatch fa-3x text-primary mb-3"></i>
                        <div class="metric-number text-primary">{{summaryMetrics.keyMetrics.executionTime}}</div>
                        <h5>Execution Time</h5>
                        <p class="text-muted">Total test suite duration</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card metric-card h-100">
                    <div class="card-body text-center">
                        <i class="fas fa-vial fa-3x text-info mb-3"></i>
                        <div class="metric-number text-info">{{summaryMetrics.keyMetrics.totalTests}}</div>
                        <h5>Total Tests</h5>
                        <p class="text-muted">Automated test scenarios</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detailed Statistics -->
        <div class="row mb-5">
            <div class="col-12">
                <div class="card metric-card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-bar"></i> Detailed Metrics</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h5>Test Execution Breakdown</h5>
                                <div class="progress mb-2" style="height: 30px;">
                                    <div class="progress-bar bg-success" style="width: {{percentage statistics.passedScenarios statistics.totalScenarios}}">
                                        {{statistics.passedScenarios}} Passed
                                    </div>
                                    <div class="progress-bar bg-danger" style="width: {{percentage statistics.failedScenarios statistics.totalScenarios}}">
                                        {{statistics.failedScenarios}} Failed
                                    </div>
                                    <div class="progress-bar bg-warning" style="width: {{percentage statistics.skippedScenarios statistics.totalScenarios}}">
                                        {{statistics.skippedScenarios}} Skipped
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h5>Coverage Overview</h5>
                                <table class="table table-sm">
                                    <tr>
                                        <td>Features Tested:</td>
                                        <td><strong>{{statistics.totalFeatures}}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Test Scenarios:</td>
                                        <td><strong>{{statistics.totalScenarios}}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Test Steps:</td>
                                        <td><strong>{{statistics.totalSteps}}</strong></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recommendations -->
        {{#if summaryMetrics.recommendations}}
        <div class="row mb-5">
            <div class="col-12">
                <div class="card metric-card">
                    <div class="card-header">
                        <h3><i class="fas fa-lightbulb"></i> Recommendations</h3>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            {{#each summaryMetrics.recommendations}}
                            <li class="list-group-item">
                                <i class="fas fa-arrow-right text-primary me-2"></i>
                                {{this}}
                            </li>
                            {{/each}}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        {{/if}}

        <!-- Footer -->
        <div class="row">
            <div class="col-12 text-center text-muted">
                <hr>
                <p>Report generated on {{report.generated}} | {{brand.name}} Quality Assurance</p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### 2. Developer Detail Template

```handlebars
<!-- templates/developer-detail.hbs -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{report.title}} - Developer Details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css" rel="stylesheet">
    <style>
        .feature-card {
            border-left: 4px solid #007bff;
            margin-bottom: 20px;
        }
        
        .scenario-failed {
            border-left-color: #dc3545;
            background-color: rgba(220, 53, 69, 0.05);
        }
        
        .scenario-passed {
            border-left-color: #28a745;
            background-color: rgba(40, 167, 69, 0.05);
        }
        
        .step-detail {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 14px;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin: 5px 0;
        }
        
        .error-detail {
            background: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
        }
        
        .stack-trace {
            font-family: monospace;
            font-size: 12px;
            white-space: pre-wrap;
            background: #1a1a1a;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 5px;
            max-height: 300px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container-fluid py-4">
        <!-- Header -->
        <div class="row mb-4">
            <div class="col-12">
                <h1><i class="fas fa-code"></i> {{report.title}} - Developer Details</h1>
                <p class="text-muted">Generated: {{report.generated}} | Environment: {{statistics.environment.platform}} | Node: {{statistics.environment.nodeVersion}}</p>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-danger">{{statistics.failedScenarios}}</h3>
                        <p class="card-text">Failed Scenarios</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-warning">{{length debugInfo.slowTests}}</h3>
                        <p class="card-text">Slow Tests</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-info">{{length debugInfo.errorBreakdown}}</h3>
                        <p class="card-text">Error Types</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-success">{{statistics.passedScenarios}}</h3>
                        <p class="card-text">Passed Scenarios</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error Breakdown -->
        {{#if debugInfo.errorBreakdown}}
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-bug"></i> Error Analysis</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            {{#each debugInfo.errorBreakdown}}
                            <div class="col-md-3 mb-3">
                                <div class="card bg-light">
                                    <div class="card-body text-center">
                                        <h4 class="text-danger">{{this}}</h4>
                                        <p class="card-text">{{@key}} errors</p>
                                    </div>
                                </div>
                            </div>
                            {{/each}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {{/if}}

        <!-- Failed Tests Detail -->
        {{#if debugInfo.failedTests}}
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-exclamation-triangle"></i> Failed Test Details</h3>
                    </div>
                    <div class="card-body">
                        {{#each debugInfo.failedTests}}
                        <div class="card scenario-failed mb-3">
                            <div class="card-header">
                                <h5>{{this.feature}} → {{this.scenario}}</h5>
                                <small class="text-muted">Duration: {{formatDuration this.duration}}</small>
                            </div>
                        </div>
                        {{/each}}
                    </div>
                </div>
            </div>
        </div>
        {{/if}}

        <!-- Detailed Feature Results -->
        <div class="row">
            <div class="col-12">
                <h2><i class="fas fa-list-alt"></i> Detailed Test Results</h2>
                
                {{#each features}}
                <div class="card feature-card mb-4">
                    <div class="card-header">
                        <h3>{{this.name}}</h3>
                        {{#if this.description}}
                        <p class="text-muted mb-0">{{this.description}}</p>
                        {{/if}}
                    </div>
                    <div class="card-body">
                        {{#each this.elements}}
                        <div class="card scenario-{{this.status}} mb-3">
                            <div class="card-header">
                                <h5>{{this.name}}</h5>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="badge badge-{{this.status}}">{{this.status}}</span>
                                    <small class="text-muted">{{this.readableDuration}}</small>
                                </div>
                            </div>
                            
                            {{#if showDetailedSteps}}
                            <div class="card-body">
                                {{#each this.steps}}
                                <div class="step-detail step-{{this.result.status}}">
                                    <strong>{{this.keyword}}</strong> {{this.name}}
                                    <div class="d-flex justify-content-between">
                                        <span class="badge badge-{{this.result.status}}">{{this.result.status}}</span>
                                        <small>{{this.readableDuration}}</small>
                                    </div>
                                    
                                    {{#if this.errorAnalysis}}
                                    <div class="error-detail mt-2">
                                        <h6 class="text-danger">Error Details:</h6>
                                        <p><strong>Type:</strong> {{this.errorAnalysis.category}}</p>
                                        <p><strong>Summary:</strong> {{this.errorAnalysis.summary}}</p>
                                        
                                        {{#if showStackTraces}}
                                        <details>
                                            <summary>Stack Trace</summary>
                                            <div class="stack-trace">{{this.errorAnalysis.stackTrace}}</div>
                                        </details>
                                        {{/if}}
                                    </div>
                                    {{/if}}
                                </div>
                                {{/each}}
                            </div>
                            {{/if}}
                        </div>
                        {{/each}}
                    </div>
                </div>
                {{/each}}
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js"></script>
</body>
</html>
```

---

## Report Configuration Examples

### 1. Multiple Report Generation

```javascript
// scripts/generate-custom-reports.js
const CustomReportGenerator = require('../src/reporting/custom-report-generator');

const generator = new CustomReportGenerator({
  jsonDir: 'reports/json/',
  templatesDir: 'templates/',
  outputDir: 'reports/custom/',
  brandName: 'AcmeCorp Testing',
  brandLogo: 'assets/logo.png',
  brandColors: {
    primary: '#2c3e50',
    success: '#27ae60',
    danger: '#e74c3c',
    warning: '#f39c12'
  }
});

const reportConfigs = [
  {
    name: 'Executive Summary',
    template: 'executive-summary.hbs',
    output: 'executive-summary.html',
    format: 'html',
    engine: 'handlebars',
    audience: 'executive',
    title: 'Quality Assurance Executive Report',
    subtitle: 'High-level overview of system quality'
  },
  
  {
    name: 'Developer Details',
    template: 'developer-detail.hbs',
    output: 'developer-details.html',
    format: 'html',
    engine: 'handlebars',
    audience: 'developer',
    title: 'Detailed Test Results for Developers',
    subtitle: 'Technical details and debugging information'
  },
  
  {
    name: 'QA Dashboard',
    template: 'qa-dashboard.hbs',
    output: 'qa-dashboard.html',
    format: 'html',
    engine: 'handlebars',
    audience: 'qa',
    title: 'QA Team Dashboard',
    subtitle: 'Test coverage and quality metrics'
  },
  
  {
    name: 'Management Report',
    template: 'management-report.hbs',
    output: 'management-report.html',
    format: 'html',
    engine: 'handlebars',
    audience: 'manager',
    title: 'Test Management Overview',
    subtitle: 'Resource utilization and trends'
  },
  
  {
    name: 'Simple Text Summary',
    template: 'simple-summary.tpl',
    output: 'summary.txt',
    format: 'text',
    engine: 'simple',
    title: 'Test Execution Summary'
  }
];

// Generate all reports
generator.generateReports(reportConfigs)
  .then(results => {
    console.log('Generated reports:');
    results.forEach(result => {
      console.log(`- ${result.name}: ${result.output}`);
    });
  })
  .catch(error => {
    console.error('Report generation failed:', error);
    process.exit(1);
  });
```

### 2. Package.json Integration

```json
{
  "scripts": {
    "test:reports": "cucumber-js && npm run generate:reports",
    "generate:reports": "node scripts/generate-custom-reports.js",
    "report:executive": "node -e \"const g=require('./src/reporting/custom-report-generator'); new g().generateReports([{name:'exec',template:'executive-summary.hbs',output:'exec.html',audience:'executive'}]);\"",
    "report:dev": "node -e \"const g=require('./src/reporting/custom-report-generator'); new g().generateReports([{name:'dev',template:'developer-detail.hbs',output:'dev.html',audience:'developer'}]);\""
  }
}
```

---

## Key Benefits Demonstrated

### 1. **Audience-Specific Reporting**
- Executive summaries focus on high-level metrics and health indicators
- Developer reports include detailed error analysis and stack traces
- QA reports emphasize test coverage and quality metrics
- Management reports highlight trends and resource utilization

### 2. **Flexible Template System**
- Support for multiple template engines (Handlebars, Mustache, Simple)
- Reusable template components and partials
- Custom helper functions for data formatting
- Dynamic content generation based on test results

### 3. **Professional Branding**
- Corporate branding integration with logos and colors
- Consistent styling across all report formats
- Professional presentation suitable for stakeholder communication

### 4. **Multi-Format Output**
- HTML reports for interactive viewing
- Text reports for automation and integration
- Markdown reports for documentation systems
- JSON exports for data analysis

---

## Next Steps

This custom templating system provides a powerful foundation for creating professional, audience-specific reports. Continue with:

1. **[Real-time Dashboard Integration](./04-realtime-dashboard-integration.md)** - Build live monitoring systems

### Key Takeaways

- ✅ **Template engines** provide flexibility for different report formats
- ✅ **Audience-specific customization** improves communication effectiveness
- ✅ **Professional branding** enhances stakeholder confidence
- ✅ **Multi-format support** serves diverse organizational needs
- ✅ **Reusable components** reduce maintenance overhead

You now have the tools to create sophisticated, branded reports tailored for any audience! 🎯

**[Continue to Example 04: Real-time Dashboard Integration →](./04-realtime-dashboard-integration.md)**