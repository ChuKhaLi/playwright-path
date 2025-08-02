# Exercise 03: Custom Template System

## 🎯 Objectives

By completing this exercise, you will:
- ✅ Create custom report templates using Handlebars and Mustache
- ✅ Build audience-specific reports for different stakeholders
- ✅ Implement template inheritance and component reuse
- ✅ Add professional branding and corporate styling
- ✅ Generate multi-format outputs from single templates
- ✅ Create internationalization support for global teams

**Estimated Time**: 75-90 minutes  
**Difficulty**: ⭐⭐⭐⭐☆ (Advanced)

---

## 📋 Prerequisites

### Required Knowledge
- ✅ Completion of Exercises 01 and 02
- ✅ Understanding of template engines (Handlebars/Mustache)
- ✅ Basic knowledge of JSON data structures
- ✅ Familiarity with CSS and responsive design
- ✅ Understanding of business reporting requirements

### Technical Setup
```bash
# Additional dependencies for template system
npm install --save-dev handlebars
npm install --save-dev mustache
npm install --save-dev puppeteer  # For PDF generation
npm install --save-dev markdown-it  # For markdown processing
npm install --save-dev i18next  # For internationalization
```

### Project Structure Extension
```
your-project/
├── templates/
│   ├── base/
│   │   ├── layout.hbs
│   │   ├── components/
│   │   └── partials/
│   ├── stakeholder-reports/
│   │   ├── executive-summary.hbs
│   │   ├── developer-details.hbs
│   │   ├── qa-dashboard.hbs
│   │   └── management-overview.hbs
│   ├── themes/
│   │   ├── corporate/
│   │   ├── dark-mode/
│   │   └── minimal/
│   └── locales/
│       ├── en.json
│       ├── es.json
│       └── zh.json
├── scripts/
│   └── template-engine.js
└── reports/
    ├── executive/
    ├── developer/
    ├── qa/
    └── management/
```

---

## 🛠️ Implementation Tasks

### Task 1: Template Engine Foundation (25 minutes)

Create a robust template engine that supports multiple template formats and inheritance.

**Step 1.1**: Create the main template engine

```javascript
// scripts/template-engine.js
const Handlebars = require('handlebars');
const Mustache = require('mustache');
const fs = require('fs-extra');
const path = require('path');
const puppeteer = require('puppeteer');
const MarkdownIt = require('markdown-it');
const i18next = require('i18next');

/**
 * Advanced Template Engine for Stakeholder Reports
 */
class TemplateEngine {
  constructor() {
    this.handlebars = Handlebars.create();
    this.markdown = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    });
    
    this.templatesDir = 'templates';
    this.reportsDir = 'reports';
    this.themesDir = path.join(this.templatesDir, 'themes');
    this.localesDir = path.join(this.templatesDir, 'locales');
    
    this.currentTheme = 'corporate';
    this.currentLocale = 'en';
    
    this.initializeEngine();
  }

  /**
   * Initialize the template engine
   */
  async initializeEngine() {
    console.log('🚀 Initializing Template Engine...');
    
    try {
      // Setup internationalization
      await this.initializeI18n();
      
      // Register Handlebars helpers
      this.registerHelpers();
      
      // Register partials
      await this.registerPartials();
      
      // Load themes
      await this.loadThemes();
      
      console.log('✅ Template Engine initialized successfully');
      
    } catch (error) {
      console.error('❌ Template Engine initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize internationalization
   */
  async initializeI18n() {
    const locales = await this.loadLocales();
    
    await i18next.init({
      lng: this.currentLocale,
      resources: locales,
      interpolation: {
        escapeValue: false
      }
    });
    
    console.log('🌍 Internationalization initialized');
  }

  /**
   * Load locale files
   */
  async loadLocales() {
    const locales = {};
    
    try {
      const localeFiles = await fs.readdir(this.localesDir);
      
      for (const file of localeFiles) {
        if (path.extname(file) === '.json') {
          const locale = path.basename(file, '.json');
          const content = await fs.readJson(path.join(this.localesDir, file));
          locales[locale] = { translation: content };
        }
      }
      
    } catch (error) {
      console.warn('⚠️ Could not load locales:', error.message);
    }
    
    return locales;
  }

  /**
   * Register Handlebars helpers
   */
  registerHelpers() {
    // Internationalization helper
    this.handlebars.registerHelper('t', (key, options) => {
      return i18next.t(key, options.hash);
    });

    // Date formatting helper
    this.handlebars.registerHelper('formatDate', (date, format = 'YYYY-MM-DD HH:mm:ss') => {
      if (!date) return 'N/A';
      return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
    });

    // Duration formatting helper
    this.handlebars.registerHelper('formatDuration', (nanoseconds) => {
      if (!nanoseconds) return '0.00ms';
      const milliseconds = nanoseconds / 1000000;
      
      if (milliseconds < 1000) {
        return `${milliseconds.toFixed(2)}ms`;
      } else if (milliseconds < 60000) {
        return `${(milliseconds / 1000).toFixed(2)}s`;
      } else {
        return `${(milliseconds / 60000).toFixed(2)}m`;
      }
    });

    // Status badge helper
    this.handlebars.registerHelper('statusBadge', (status, options) => {
      const classes = {
        passed: 'badge-success',
        failed: 'badge-danger',
        skipped: 'badge-warning',
        pending: 'badge-info'
      };
      
      const icons = {
        passed: 'fas fa-check',
        failed: 'fas fa-times',
        skipped: 'fas fa-minus',
        pending: 'fas fa-clock'
      };
      
      const badgeClass = classes[status] || 'badge-secondary';
      const icon = icons[status] || 'fas fa-question';
      
      return new this.handlebars.SafeString(
        `<span class="badge ${badgeClass}"><i class="${icon}"></i> ${status.toUpperCase()}</span>`
      );
    });

    // Percentage helper
    this.handlebars.registerHelper('percentage', (value, total) => {
      if (!total || total === 0) return '0%';
      return `${((value / total) * 100).toFixed(1)}%`;
    });

    // Chart data helper
    this.handlebars.registerHelper('chartData', (data, type = 'pie') => {
      return new this.handlebars.SafeString(
        JSON.stringify(this.prepareChartData(data, type))
      );
    });

    // Conditional helper
    this.handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
      switch (operator) {
        case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=': return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '<': return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=': return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=': return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default: return options.inverse(this);
      }
    });

    // Markdown helper
    this.handlebars.registerHelper('markdown', (text) => {
      if (!text) return '';
      return new this.handlebars.SafeString(this.markdown.render(text));
    });

    console.log('🔧 Handlebars helpers registered');
  }

  /**
   * Register partial templates
   */
  async registerPartials() {
    const partialsDir = path.join(this.templatesDir, 'base', 'partials');
    
    try {
      const partialFiles = await fs.readdir(partialsDir);
      
      for (const file of partialFiles) {
        if (path.extname(file) === '.hbs') {
          const partialName = path.basename(file, '.hbs');
          const partialContent = await fs.readFile(path.join(partialsDir, file), 'utf8');
          this.handlebars.registerPartial(partialName, partialContent);
        }
      }
      
      console.log('📝 Partials registered');
      
    } catch (error) {
      console.warn('⚠️ Could not register partials:', error.message);
    }
  }

  /**
   * Load available themes
   */
  async loadThemes() {
    try {
      const themes = await fs.readdir(this.themesDir);
      this.availableThemes = themes.filter(theme => 
        fs.statSync(path.join(this.themesDir, theme)).isDirectory()
      );
      
      console.log('🎨 Available themes:', this.availableThemes);
      
    } catch (error) {
      console.warn('⚠️ Could not load themes:', error.message);
      this.availableThemes = ['corporate'];
    }
  }

  /**
   * Generate stakeholder-specific reports
   */
  async generateStakeholderReports(testData, options = {}) {
    console.log('📊 Generating stakeholder reports...');
    
    const reports = {
      executive: await this.generateExecutiveReport(testData, options),
      developer: await this.generateDeveloperReport(testData, options),
      qa: await this.generateQAReport(testData, options),
      management: await this.generateManagementReport(testData, options)
    };
    
    // Generate multi-format outputs
    if (options.formats) {
      for (const [reportType, content] of Object.entries(reports)) {
        await this.generateMultiFormatOutputs(reportType, content, options.formats);
      }
    }
    
    console.log('✅ All stakeholder reports generated');
    return reports;
  }

  /**
   * Generate Executive Summary Report
   */
  async generateExecutiveReport(testData, options) {
    console.log('👔 Generating Executive Report...');
    
    const templatePath = path.join(this.templatesDir, 'stakeholder-reports', 'executive-summary.hbs');
    const template = await this.loadTemplate(templatePath);
    
    const data = {
      ...this.prepareExecutiveData(testData),
      theme: this.currentTheme,
      locale: this.currentLocale,
      generatedAt: new Date().toISOString(),
      options
    };
    
    const html = this.handlebars.compile(template)(data);
    
    // Save HTML version
    const outputPath = path.join(this.reportsDir, 'executive', 'summary.html');
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, html);
    
    return { html, data };
  }

  /**
   * Generate Developer Details Report
   */
  async generateDeveloperReport(testData, options) {
    console.log('💻 Generating Developer Report...');
    
    const templatePath = path.join(this.templatesDir, 'stakeholder-reports', 'developer-details.hbs');
    const template = await this.loadTemplate(templatePath);
    
    const data = {
      ...this.prepareDeveloperData(testData),
      theme: this.currentTheme,
      locale: this.currentLocale,
      generatedAt: new Date().toISOString(),
      options
    };
    
    const html = this.handlebars.compile(template)(data);
    
    // Save HTML version
    const outputPath = path.join(this.reportsDir, 'developer', 'details.html');
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, html);
    
    return { html, data };
  }

  /**
   * Generate QA Dashboard Report
   */
  async generateQAReport(testData, options) {
    console.log('🔍 Generating QA Report...');
    
    const templatePath = path.join(this.templatesDir, 'stakeholder-reports', 'qa-dashboard.hbs');
    const template = await this.loadTemplate(templatePath);
    
    const data = {
      ...this.prepareQAData(testData),
      theme: this.currentTheme,
      locale: this.currentLocale,
      generatedAt: new Date().toISOString(),
      options
    };
    
    const html = this.handlebars.compile(template)(data);
    
    // Save HTML version
    const outputPath = path.join(this.reportsDir, 'qa', 'dashboard.html');
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, html);
    
    return { html, data };
  }

  /**
   * Generate Management Overview Report
   */
  async generateManagementReport(testData, options) {
    console.log('📈 Generating Management Report...');
    
    const templatePath = path.join(this.templatesDir, 'stakeholder-reports', 'management-overview.hbs');
    const template = await this.loadTemplate(templatePath);
    
    const data = {
      ...this.prepareManagementData(testData),
      theme: this.currentTheme,
      locale: this.currentLocale,
      generatedAt: new Date().toISOString(),
      options
    };
    
    const html = this.handlebars.compile(template)(data);
    
    // Save HTML version
    const outputPath = path.join(this.reportsDir, 'management', 'overview.html');
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, html);
    
    return { html, data };
  }

  /**
   * Prepare data for executive report
   */
  prepareExecutiveData(testData) {
    const stats = this.calculateOverallStats(testData);
    
    return {
      title: i18next.t('reports.executive.title'),
      summary: {
        totalFeatures: stats.totalFeatures,
        totalScenarios: stats.totalScenarios,
        passRate: stats.passRate,
        executionTime: stats.totalDuration,
        quality: this.calculateQualityScore(stats),
        recommendation: this.generateRecommendation(stats)
      },
      keyMetrics: [
        {
          label: i18next.t('metrics.testCoverage'),
          value: `${stats.passRate}%`,
          trend: 'up',
          status: stats.passRate >= 95 ? 'excellent' : stats.passRate >= 80 ? 'good' : 'needs-attention'
        },
        {
          label: i18next.t('metrics.totalTests'),
          value: stats.totalScenarios,
          trend: 'stable',
          status: 'info'
        },
        {
          label: i18next.t('metrics.executionTime'),
          value: this.formatDuration(stats.totalDuration),
          trend: 'down',
          status: 'good'
        }
      ],
      riskAreas: this.identifyRiskAreas(testData),
      businessImpact: this.assessBusinessImpact(stats)
    };
  }

  /**
   * Prepare data for developer report
   */
  prepareDeveloperData(testData) {
    return {
      title: i18next.t('reports.developer.title'),
      features: testData.map(feature => ({
        ...feature,
        stats: this.calculateFeatureStats(feature),
        failedScenarios: this.getFailedScenariosWithDetails(feature),
        performanceIssues: this.identifyPerformanceIssues(feature),
        codeLocation: this.extractCodeLocations(feature)
      })),
      technicalMetrics: {
        averageStepDuration: this.calculateAverageStepDuration(testData),
        slowestSteps: this.getSlowTestSteps(testData, 10),
        flakyTests: this.identifyFlakyTests(testData),
        testMaintenance: this.assessTestMaintenance(testData)
      },
      debuggingInfo: {
        errorPatterns: this.analyzeErrorPatterns(testData),
        commonFailures: this.getCommonFailureReasons(testData),
        environmentIssues: this.identifyEnvironmentIssues(testData)
      }
    };
  }

  /**
   * Prepare data for QA report  
   */
  prepareQAData(testData) {
    return {
      title: i18next.t('reports.qa.title'),
      testExecution: {
        summary: this.calculateOverallStats(testData),
        featureBreakdown: testData.map(feature => ({
          name: feature.name,
          stats: this.calculateFeatureStats(feature),
          coverage: this.calculateFeatureCoverage(feature),
          priority: this.assessFeaturePriority(feature)
        }))
      },
      qualityMetrics: {
        testStability: this.calculateTestStability(testData),
        defectDetection: this.calculateDefectDetectionRate(testData),
        testEfficiency: this.calculateTestEfficiency(testData),
        automationROI: this.calculateAutomationROI(testData)
      },
      testStrategy: {
        coverageGaps: this.identifyCoverageGaps(testData),
        improvementAreas: this.identifyImprovementAreas(testData),
        recommendations: this.generateQARecommendations(testData)
      }
    };
  }

  /**
   * Prepare data for management report
   */
  prepareManagementData(testData) {
    const stats = this.calculateOverallStats(testData);
    
    return {
      title: i18next.t('reports.management.title'),
      executiveSummary: {
        overallHealth: this.calculateOverallHealth(stats),
        keyAchievements: this.identifyKeyAchievements(stats),
        criticalIssues: this.identifyCriticalIssues(testData),
        nextSteps: this.recommendNextSteps(stats)
      },
      businessMetrics: {
        qualityScore: this.calculateQualityScore(stats),
        velocityImpact: this.calculateVelocityImpact(stats),
        costOptimization: this.calculateCostOptimization(stats),
        riskMitigation: this.assessRiskMitigation(testData)
      },
      timeline: this.generateProjectTimeline(testData),
      resourceUtilization: this.calculateResourceUtilization(testData)
    };
  }

  /**
   * Generate multi-format outputs
   */
  async generateMultiFormatOutputs(reportType, content, formats) {
    for (const format of formats) {
      switch (format.toLowerCase()) {
        case 'pdf':
          await this.generatePDF(reportType, content.html);
          break;
        case 'docx':
          await this.generateDOCX(reportType, content.data);
          break;
        case 'json':
          await this.generateJSON(reportType, content.data);
          break;
        case 'csv':
          await this.generateCSV(reportType, content.data);
          break;
        default:
          console.warn(`⚠️ Unsupported format: ${format}`);
      }
    }
  }

  /**
   * Generate PDF from HTML
   */
  async generatePDF(reportType, html) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });
      
      await browser.close();
      
      const outputPath = path.join(this.reportsDir, reportType, `${reportType}-report.pdf`);
      await fs.writeFile(outputPath, pdfBuffer);
      
      console.log(`📄 PDF report generated: ${outputPath}`);
      
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
    }
  }

  /**
   * Generate JSON export
   */
  async generateJSON(reportType, data) {
    const outputPath = path.join(this.reportsDir, reportType, `${reportType}-data.json`);
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
    console.log(`📊 JSON data exported: ${outputPath}`);
  }

  /**
   * Generate CSV export
   */
  async generateCSV(reportType, data) {
    // Implementation would depend on specific data structure
    // This is a simplified example
    const csvContent = this.convertToCSV(data);
    const outputPath = path.join(this.reportsDir, reportType, `${reportType}-summary.csv`);
    await fs.writeFile(outputPath, csvContent);
    console.log(`📊 CSV data exported: ${outputPath}`);
  }

  /**
   * Load template file
   */
  async loadTemplate(templatePath) {
    try {
      return await fs.readFile(templatePath, 'utf8');
    } catch (error) {
      console.error(`❌ Could not load template: ${templatePath}`, error);
      throw error;
    }
  }

  /**
   * Calculate overall statistics
   */
  calculateOverallStats(testData) {
    let totalFeatures = testData.length;
    let totalScenarios = 0;
    let passedScenarios = 0;
    let failedScenarios = 0;
    let skippedScenarios = 0;
    let totalDuration = 0;

    testData.forEach(feature => {
      if (feature.elements) {
        feature.elements.forEach(scenario => {
          totalScenarios++;
          
          if (scenario.steps) {
            const scenarioDuration = scenario.steps.reduce((sum, step) => 
              sum + (step.result?.duration || 0), 0
            );
            totalDuration += scenarioDuration;
            
            const hasFailedStep = scenario.steps.some(step => 
              step.result?.status === 'failed'
            );
            const hasSkippedStep = scenario.steps.some(step => 
              step.result?.status === 'skipped'
            );
            
            if (hasFailedStep) {
              failedScenarios++;
            } else if (hasSkippedStep) {
              skippedScenarios++;
            } else {
              passedScenarios++;
            }
          }
        });
      }
    });

    return {
      totalFeatures,
      totalScenarios,
      passedScenarios,
      failedScenarios,
      skippedScenarios,
      passRate: totalScenarios > 0 ? (passedScenarios / totalScenarios * 100).toFixed(1) : 0,
      totalDuration: totalDuration / 1000000 // Convert to milliseconds
    };
  }

  /**
   * Calculate quality score based on various metrics
   */
  calculateQualityScore(stats) {
    const passRateScore = Math.min(stats.passRate, 100);
    const stabilityScore = 100 - (stats.failedScenarios / stats.totalScenarios * 100);
    const coverageScore = 85; // This would be calculated from actual coverage data
    
    const overallScore = (passRateScore * 0.4 + stabilityScore * 0.3 + coverageScore * 0.3);
    
    return {
      score: Math.round(overallScore),
      grade: overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : 'D',
      components: {
        passRate: Math.round(passRateScore),
        stability: Math.round(stabilityScore),
        coverage: Math.round(coverageScore)
      }
    };
  }

  /**
   * Helper method to format duration
   */
  formatDuration(nanoseconds) {
    const milliseconds = nanoseconds / 1000000;
    
    if (milliseconds < 1000) {
      return `${milliseconds.toFixed(2)}ms`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(2)}s`;
    } else {
      return `${(milliseconds / 60000).toFixed(2)}m`;
    }
  }

  /**
   * Set theme for report generation
   */
  setTheme(theme) {
    if (this.availableThemes.includes(theme)) {
      this.currentTheme = theme;
      console.log(`🎨 Theme changed to: ${theme}`);
    } else {
      console.warn(`⚠️ Theme '${theme}' not available. Available themes:`, this.availableThemes);
    }
  }

  /**
   * Set locale for internationalization
   */
  async setLocale(locale) {
    try {
      await i18next.changeLanguage(locale);
      this.currentLocale = locale;
      console.log(`🌍 Locale changed to: ${locale}`);
    } catch (error) {
      console.warn(`⚠️ Could not change locale to '${locale}':`, error.message);
    }
  }

  // Additional helper methods would be implemented here...
  // (Due to space constraints, showing representative examples)
  
  identifyRiskAreas(testData) {
    // Analyze test data to identify high-risk areas
    return [
      {
        area: 'Authentication Module',
        risk: 'High',
        reason: 'Multiple test failures detected',
        impact: 'User login functionality compromised'
      }
    ];
  }

  generateRecommendation(stats) {
    if (stats.passRate >= 95) {
      return {
        status: 'excellent',
        message: 'Test suite is performing exceptionally well. Continue monitoring.',
        actions: ['Maintain current testing practices', 'Consider expanding test coverage']
      };
    } else if (stats.passRate >= 80) {
      return {
        status: 'good',
        message: 'Test suite is stable with room for improvement.',
        actions: ['Investigate failing tests', 'Optimize slow-running tests']
      };
    } else {
      return {
        status: 'needs-attention',
        message: 'Test suite requires immediate attention.',
        actions: ['Priority fixing of failing tests', 'Review test strategy', 'Consider additional resources']
      };
    }
  }
}

// Export for use in other scripts
module.exports = TemplateEngine;

// CLI execution
if (require.main === module) {
  async function main() {
    try {
      const engine = new TemplateEngine();
      
      // Load test data
      const testData = JSON.parse(await fs.readFile('reports/json/cucumber-report.json', 'utf8'));
      
      // Generate all stakeholder reports
      await engine.generateStakeholderReports(testData, {
        formats: ['html', 'pdf', 'json'],
        theme: 'corporate',
        locale: 'en'
      });
      
      console.log('🎉 All reports generated successfully!');
      
    } catch (error) {
      console.error('❌ Report generation failed:', error);
      process.exit(1);
    }
  }
  
  main();
}
```

**Step 1.2**: Create base layout template

```handlebars
{{!-- templates/base/layout.hbs --}}
<!DOCTYPE html>
<html lang="{{locale}}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - {{t "reports.title"}}</title>
    
    <!-- Theme CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="../themes/{{theme}}/main.css" rel="stylesheet">
    
    <!-- Chart.js for visualizations -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <style>
        :root {
            --report-primary: {{themeColors.primary}};
            --report-secondary: {{themeColors.secondary}};
            --report-success: {{themeColors.success}};
            --report-danger: {{themeColors.danger}};
            --report-warning: {{themeColors.warning}};
        }
    </style>
</head>
<body class="{{theme}}-theme">
    <!-- Header -->
    <header class="report-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <div class="report-branding">
                        {{#if logo}}
                        <img src="{{logo}}" alt="Company Logo" class="logo">
                        {{/if}}
                        <h1 class="report-title">{{title}}</h1>
                    </div>
                </div>
                <div class="col-md-6 text-end">
                    <div class="report-meta">
                        <div class="generated-info">
                            <i class="fas fa-calendar"></i>
                            {{t "reports.generatedOn"}}: {{formatDate generatedAt}}
                        </div>
                        <div class="report-type">
                            <span class="badge badge-primary">{{reportType}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation (if multi-section report) -->
    {{#if sections}}
    <nav class="report-nav">
        <div class="container-fluid">
            <ul class="nav nav-pills">
                {{#each sections}}
                <li class="nav-item">
                    <a class="nav-link {{#if @first}}active{{/if}}" href="#{{id}}">
                        <i class="{{icon}}"></i> {{title}}
                    </a>
                </li>
                {{/each}}
            </ul>
        </div>
    </nav>
    {{/if}}

    <!-- Main Content -->
    <main class="report-content">
        <div class="container-fluid">
            {{{body}}}
        </div>
    </main>

    <!-- Footer -->
    <footer class="report-footer">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-6">
                    <p>&copy; {{currentYear}} {{companyName}}. {{t "reports.footer.rights"}}</p>
                </div>
                <div class="col-md-6 text-end">
                    <div class="footer-links">
                        <a href="#" class="footer-link">{{t "reports.footer.help"}}</a>
                        <a href="#" class="footer-link">{{t "reports.footer.feedback"}}</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/report-common.js"></script>
    
    {{#if customScripts}}
    {{#each customScripts}}
    <script src="{{this}}"></script>
    {{/each}}
    {{/if}}

    <script>
        // Initialize report functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize tooltips
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });

            // Initialize charts if present
            if (typeof initializeCharts === 'function') {
                initializeCharts();
            }

            // Print functionality
            window.printReport = function() {
                window.print();
            };

            // Export functionality
            window.exportReport = function(format) {
                // Implementation depends on format
                console.log('Exporting as:', format);
            };
        });
    </script>
</body>
</html>
```

**🔍 Validation**: Test the basic template engine by:
- Running the template engine script
- Verifying that templates load without errors
- Checking that Handlebars helpers work correctly
- Testing theme and locale switching

### Task 2: Stakeholder-Specific Templates (30 minutes)

Create specialized templates for different stakeholder groups.

**Step 2.1**: Executive Summary Template

```handlebars
{{!-- templates/stakeholder-reports/executive-summary.hbs --}}
{{#> layout title=(t "reports.executive.title") reportType="Executive Summary"}}

<!-- Executive Dashboard -->
<div class="executive-dashboard">
    <!-- Key Metrics Cards -->
    <div class="row mb-4">
        {{#each keyMetrics}}
        <div class="col-md-4 mb-3">
            <div class="metric-card {{status}}">
                <div class="metric-header">
                    <h5 class="metric-label">{{label}}</h5>
                    <div class="metric-trend">
                        {{#ifCond trend '==' 'up'}}
                        <i class="fas fa-arrow-up text-success"></i>
                        {{else ifCond trend '==' 'down'}}
                        <i class="fas fa-arrow-down text-danger"></i>
                        {{else}}
                        <i class="fas fa-minus text-muted"></i>
                        {{/ifCond}}
                    </div>
                </div>
                <div class="metric-value">{{value}}</div>
                <div class="metric-status">
                    <span class="status-indicator status-{{status}}"></span>
                    {{#ifCond status '==' 'excellent'}}{{t "status.excellent"}}
                    {{else ifCond status '==' 'good'}}{{t "status.good"}}
                    {{else ifCond status '==' 'needs-attention'}}{{t "status.needsAttention"}}
                    {{else}}{{t "status.info"}}{{/ifCond}}
                </div>
            </div>
        </div>
        {{/each}}
    </div>

    <!-- Summary Overview -->
    <div class="row mb-4">
        <div class="col-md-8">
            <div class="card summary-card">
                <div class="card-header">
                    <h4><i class="fas fa-chart-pie"></i> {{t "executive.testOverview"}}</h4>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <canvas id="summaryChart" width="400" height="200"></canvas>
                        </div>
                        <div class="col-md-4">
                            <div class="summary-stats">
                                <div class="stat-item">
                                    <div class="stat-label">{{t "metrics.totalFeatures"}}</div>
                                    <div class="stat-value">{{summary.totalFeatures}}</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">{{t "metrics.totalScenarios"}}</div>
                                    <div class="stat-value">{{summary.totalScenarios}}</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">{{t "metrics.passRate"}}</div>
                                    <div class="stat-value success">{{summary.passRate}}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card quality-card">
                <div class="card-header">
                    <h5><i class="fas fa-award"></i> {{t "executive.qualityScore"}}</h5>
                </div>
                <div class="card-body text-center">
                    <div class="quality-score {{summary.quality.grade}}">
                        <div class="score-circle">
                            <div class="score-number">{{summary.quality.score}}</div>
                            <div class="score-grade">{{summary.quality.grade}}</div>
                        </div>
                    </div>
                    <div class="score-breakdown">
                        <div class="breakdown-item">
                            <span class="breakdown-label">{{t "quality.passRate"}}:</span>
                            <span class="breakdown-value">{{summary.quality.components.passRate}}%</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">{{t "quality.stability"}}:</span>
                            <span class="breakdown-value">{{summary.quality.components.stability}}%</span>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">{{t "quality.coverage"}}:</span>
                            <span class="breakdown-value">{{summary.quality.components.coverage}}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Recommendations -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card recommendation-card {{summary.recommendation.status}}">
                <div class="card-header">
                    <h4>
                        <i class="fas fa-lightbulb"></i> 
                        {{t "executive.recommendations"}}
                    </h4>
                </div>
                <div class="card-body">
                    <div class="recommendation-message">
                        <div class="message-content">
                            {{summary.recommendation.message}}
                        </div>
                    </div>
                    <div class="recommended-actions">
                        <h6>{{t "executive.recommendedActions"}}:</h6>
                        <ul class="action-list">
                            {{#each summary.recommendation.actions}}
                            <li><i class="fas fa-check-circle"></i> {{this}}</li>
                            {{/each}}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Risk Areas -->
    {{#if riskAreas}}
    <div class="row mb-4">
        <div class="col-12">
            <div class="card risk-card">
                <div class="card-header">
                    <h4><i class="fas fa-exclamation-triangle"></i> {{t "executive.riskAreas"}}</h4>
                </div>
                <div class="card-body">
                    <div class="risk-list">
                        {{#each riskAreas}}
                        <div class="risk-item {{risk}}">
                            <div class="risk-header">
                                <div class="risk-area">{{area}}</div>
                                <div class="risk-level">
                                    <span class="risk-badge risk-{{risk}}">{{risk}} {{t "risk.level"}}</span>
                                </div>
                            </div>
                            <div class="risk-details">
                                <div class="risk-reason">{{reason}}</div>
                                <div class="risk-impact">{{impact}}</div>
                            </div>
                        </div>
                        {{/each}}
                    </div>
                </div>
            </div>
        </div>
    </div>
    {{/if}}

    <!-- Business Impact -->
    <div class="row">
        <div class="col-12">
            <div class="card impact-card">
                <div class="card-header">
                    <h4><i class="fas fa-business-time"></i> {{t "executive.businessImpact"}}</h4>
                </div>
                <div class="card-body">
                    <div class="impact-content">
                        {{markdown businessImpact}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function initializeCharts() {
    // Summary Chart
    const ctx = document.getElementById('summaryChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['{{t "status.passed"}}', '{{t "status.failed"}}', '{{t "status.skipped"}}'],
            datasets: [{
                data: [{{summary.passedScenarios}}, {{summary.failedScenarios}}, {{summary.skippedScenarios}}],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}
</script>

{{/layout}}
```

**Step 2.2**: Developer Details Template

```handlebars
{{!-- templates/stakeholder-reports/developer-details.hbs --}}
{{#> layout title=(t "reports.developer.title") reportType="Developer Report"}}

<div class="developer-report">
    <!-- Technical Metrics -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card metrics-card">
                <div class="card-header">
                    <h4><i class="fas fa-code"></i> {{t "developer.technicalMetrics"}}</h4>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="metric-box">
                                <div class="metric-label">{{t "metrics.averageStepDuration"}}</div>
                                <div class="metric-value">{{formatDuration technicalMetrics.averageStepDuration}}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="metric-box">
                                <div class="metric-label">{{t "metrics.slowestSteps"}}</div>
                                <div class="metric-value">{{technicalMetrics.slowestSteps.length}}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="metric-box">
                                <div class="metric-label">{{t "metrics.flakyTests"}}</div>
                                <div class="metric-value">{{technicalMetrics.flakyTests.length}}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="metric-box">
                                <div class="metric-label">{{t "metrics.maintenanceScore"}}</div>
                                <div class="metric-value">{{technicalMetrics.testMaintenance.score}}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Feature Details -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card features-card">
                <div class="card-header">
                    <h4><i class="fas fa-list"></i> {{t "developer.featureDetails"}}</h4>
                </div>
                <div class="card-body">
                    <div class="accordion" id="featuresAccordion">
                        {{#each features}}
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading{{@index}}">
                                <button class="accordion-button {{#unless @first}}collapsed{{/unless}}" 
                                        type="button" data-bs-toggle="collapse" 
                                        data-bs-target="#collapse{{@index}}" 
                                        aria-expanded="{{#if @first}}true{{else}}false{{/if}}" 
                                        aria-controls="collapse{{@index}}">
                                    <div class="feature-summary">
                                        <div class="feature-name">{{name}}</div>
                                        <div class="feature-stats">
                                            {{statusBadge stats.status}}
                                            <span class="duration">{{formatDuration stats.totalDuration}}</span>
                                        </div>
                                    </div>
                                </button>
                            </h2>
                            <div id="collapse{{@index}}" 
                                 class="accordion-collapse collapse {{#if @first}}show{{/if}}" 
                                 aria-labelledby="heading{{@index}}" 
                                 data-bs-parent="#featuresAccordion">
                                <div class="accordion-body">
                                    <!-- Failed Scenarios -->
                                    {{#if failedScenarios}}
                                    <div class="failed-scenarios mb-3">
                                        <h6><i class="fas fa-exclamation-circle"></i> {{t "developer.failedScenarios"}}</h6>
                                        {{#each failedScenarios}}
                                        <div class="scenario-error">
                                            <div class="scenario-name">{{name}}</div>
                                            <div class="error-details">
                                                <pre><code>{{errorMessage}}</code></pre>
                                            </div>
                                            {{#if stackTrace}}
                                            <div class="stack-trace">
                                                <details>
                                                    <summary>{{t "developer.stackTrace"}}</summary>
                                                    <pre><code>{{stackTrace}}</code></pre>
                                                </details>
                                            </div>
                                            {{/if}}
                                        </div>
                                        {{/each}}
                                    </div>
                                    {{/if}}

                                    <!-- Performance Issues -->
                                    {{#if performanceIssues}}
                                    <div class="performance-issues mb-3">
                                        <h6><i class="fas fa-tachometer-alt"></i> {{t "developer.performanceIssues"}}</h6>
                                        <div class="performance-list">
                                            {{#each performanceIssues}}
                                            <div class="performance-item">
                                                <div class="issue-type">{{type}}</div>
                                                <div class="issue-description">{{description}}</div>
                                                <div class="issue-impact">{{impact}}</div>
                                            </div>
                                            {{/each}}
                                        </div>
                                    </div>
                                    {{/if}}

                                    <!-- Code Locations -->
                                    {{#if codeLocation}}
                                    <div class="code-locations">
                                        <h6><i class="fas fa-map-marker-alt"></i> {{t "developer.codeLocations"}}</h6>
                                        <div class="location-list">
                                            {{#each codeLocation}}
                                            <div class="location-item">
                                                <div class="file-path">{{file}}</div>
                                                <div class="line-number">Line: {{line}}</div>
                                            </div>
                                            {{/each}}
                                        </div>
                                    </div>
                                    {{/if}}
                                </div>
                            </div>
                        </div>
                        {{/each}}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Debugging Information -->
    <div class="row">
        <div class="col-md-6">
            <div class="card debugging-card">
                <div class="card-header">
                    <h5><i class="fas fa-bug"></i> {{t "developer.commonErrors"}}</h5>
                </div>
                <div class="card-body">
                    <div class="error-patterns">
                        {{#each debuggingInfo.errorPatterns}}
                        <div class="error-pattern">
                            <div class="pattern-name">{{pattern}}</div>
                            <div class="pattern-count">{{count}} {{t "common.occurrences"}}</div>
                            <div class="pattern-solution">{{solution}}</div>
                        </div>
                        {{/each}}
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card environment-card">
                <div class="card-header">
                    <h5><i class="fas fa-server"></i> {{t "developer.environmentIssues"}}</h5>
                </div>
                <div class="card-body">
                    <div class="environment-issues">
                        {{#each debuggingInfo.environmentIssues}}
                        <div class="environment-issue">
                            <div class="issue-title">{{title}}</div>
                            <div class="issue-description">{{description}}</div>
                            <div class="issue-resolution">{{resolution}}</div>
                        </div>
                        {{/each}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{{/layout}}
```

**🔍 Validation**: Test stakeholder templates by:
- Generating executive and developer reports
- Verifying all data displays correctly
- Testing responsive design on different devices
- Checking that all interactive elements work

### Task 3: Corporate Branding and Themes (20 minutes)

Create professional themes and branding customization.

**Step 3.1**: Corporate theme CSS

```css
/* templates/themes/corporate/main.css */
:root {
  /* Corporate Brand Colors */
  --corporate-primary: #2c3e50;
  --corporate-secondary: #3498db;
  --corporate-success: #27ae60;
  --corporate-danger: #e74c3c;
  --corporate-warning: #f39c12;
  --corporate-info: #3498db;
  
  /* Corporate Typography */
  --corporate-font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --corporate-heading-font: 'Arial', sans-serif;
  
  /* Corporate Layout */
  --corporate-border-radius: 8px;
  --corporate-box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  --corporate-transition: all 0.3s ease;
}

/* Global Corporate Styling */
.corporate-theme {
  font-family: var(--corporate-font-family);
  color: #2c3e50;
  background-color: #f8f9fa;
}

.corporate-theme h1,
.corporate-theme h2,
.corporate-theme h3,
.corporate-theme h4,
.corporate-theme h5,
.corporate-theme h6 {
  font-family: var(--corporate-heading-font);
  font-weight: 600;
  color: var(--corporate-primary);
}

/* Header Styling */
.report-header {
  background: linear-gradient(135deg, var(--corporate-primary) 0%, var(--corporate-secondary) 100%);
  color: white;
  padding: 20px 0;
  box-shadow: var(--corporate-box-shadow);
}

.report-branding {
  display: flex;
  align-items: center;
  gap: 15px;
}

.report-branding .logo {
  height: 50px;
  width: auto;
}

.report-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.report-meta {
  text-align: right;
}

.generated-info {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 5px;
}

/* Navigation */
.report-nav {
  background: white;
  border-bottom: 1px solid #dee2e6;
  padding: 10px 0;
}

.report-nav .nav-pills .nav-link {
  border-radius: var(--corporate-border-radius);
  color: var(--corporate-primary);
  font-weight: 500;
  transition: var(--corporate-transition);
}

.report-nav .nav-pills .nav-link.active {
  background-color: var(--corporate-secondary);
  color: white;
}

.report-nav .nav-pills .nav-link:hover {
  background-color: rgba(52, 152, 219, 0.1);
}

/* Cards and Content */
.card {
  border: none;
  border-radius: var(--corporate-border-radius);
  box-shadow: var(--corporate-box-shadow);
  margin-bottom: 20px;
  transition: var(--corporate-transition);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 25px rgba(0,0,0,0.15);
}

.card-header {
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  border-bottom: 1px solid #dee2e6;
  font-weight: 600;
  color: var(--corporate-primary);
}

/* Metric Cards */
.metric-card {
  text-align: center;
  padding: 25px;
  border-radius: var(--corporate-border-radius);
  transition: var(--corporate-transition);
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--corporate-secondary);
}

.metric-card.excellent::before {
  background: var(--corporate-success);
}

.metric-card.good::before {
  background: var(--corporate-info);
}

.metric-card.needs-attention::before {
  background: var(--corporate-danger);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.metric-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6c757d;
  margin: 0;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--corporate-primary);
  margin-bottom: 10px;
}

.metric-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

/* Status Indicators */
.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.status-excellent {
  background: var(--corporate-success);
}

.status-indicator.status-good {
  background: var(--corporate-info);
}

.status-indicator.status-needs-attention {
  background: var(--corporate-danger);
}

.status-indicator.status-info {
  background: var(--corporate-warning);
}

/* Badges */
.badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: var(--corporate-border-radius);
}

.badge-success {
  background: var(--corporate-success);
  color: white;
}

.badge-danger {
  background: var(--corporate-danger);
  color: white;
}

.badge-warning {
  background: var(--corporate-warning);
  color: white;
}

.badge-primary {
  background: var(--corporate-primary);
  color: white;
}

/* Quality Score */
.quality-score {
  position: relative;
  display: inline-block;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 6px solid #e9ecef;
  position: relative;
  margin-bottom: 20px;
}

.quality-score.A .score-circle {
  border-color: var(--corporate-success);
  background: rgba(39, 174, 96, 0.1);
}

.quality-score.B .score-circle {
  border-color: var(--corporate-info);
  background: rgba(52, 152, 219, 0.1);
}

.quality-score.C .score-circle {
  border-color: var(--corporate-warning);
  background: rgba(243, 156, 18, 0.1);
}

.quality-score.D .score-circle {
  border-color: var(--corporate-danger);
  background: rgba(231, 76, 60, 0.1);
}

.score-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--corporate-primary);
}

.score-grade {
  font-size: 1.2rem;
  font-weight: 600;
  color: #6c757d;
}

.score-breakdown {
  text-align: left;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.breakdown-label {
  color: #6c757d;
}

.breakdown-value {
  font-weight: 600;
  color: var(--corporate-primary);
}

/* Recommendation Cards */
.recommendation-card {
  border-left: 5px solid var(--corporate-info);
}

.recommendation-card.excellent {
  border-left-color: var(--corporate-success);
}

.recommendation-card.good {
  border-left-color: var(--corporate-info);
}

.recommendation-card.needs-attention {
  border-left-color: var(--corporate-danger);
}

.recommendation-message {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: var(--corporate-primary);
}

.action-list {
  list-style: none;
  padding: 0;
}

.action-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-list li:last-child {
  border-bottom: none;
}

.action-list li i {
  color: var(--corporate-success);
}

/* Risk Areas */
.risk-item {
  padding: 15px;
  border-radius: var(--corporate-border-radius);
  margin-bottom: 15px;
  border-left: 5px solid #dee2e6;
}

.risk-item.High {
  border-left-color: var(--corporate-danger);
  background: rgba(231, 76, 60, 0.05);
}

.risk-item.Medium {
  border-left-color: var(--corporate-warning);
  background: rgba(243, 156, 18, 0.05);
}

.risk-item.Low {
  border-left-color: var(--corporate-success);
  background: rgba(39, 174, 96, 0.05);
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.risk-area {
  font-weight: 600;
  color: var(--corporate-primary);
}

.risk-badge {
  padding: 4px 8px;
  border-radius: var(--corporate-border-radius);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.risk-badge.risk-High {
  background: var(--corporate-danger);
  color: white;
}

.risk-badge.risk-Medium {
  background: var(--corporate-warning);
  color: white;
}

.risk-badge.risk-Low {
  background: var(--corporate-success);
  color: white;
}

.risk-details {
  font-size: 0.9rem;
  color: #6c757d;
}

.risk-reason {
  margin-bottom: 5px;
}

.risk-impact {
  font-style: italic;
}

/* Footer */
.report-footer {
  background: var(--corporate-primary);
  color: white;
  padding: 20px 0;
  margin-top: 40px;
}

.footer-links {
  display: flex;
  gap: 20px;
  justify-content: flex-end;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: var(--corporate-transition);
}

.footer-link:hover {
  color: white;
  text-decoration: underline;
}

/* Print Styles */
@media print {
  .report-nav,
  .report-footer {
    display: none;
  }
  
  .card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #dee2e6;
  }
  
  .metric-card {
    break-inside: avoid;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .report-branding {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .report-title {
    font-size: 1.5rem;
  }
  
  .report-meta {
    text-align: center;
    margin-top: 15px;
  }
  
  .metric-value {
    font-size: 2rem;
  }
  
  .score-circle {
    width: 100px;
    height: 100px;
  }
  
  .score-number {
    font-size: 2rem;
  }
}
```

**🔍 Validation**: Test the corporate theme by:
- Generating reports with the corporate theme applied
- Verifying all styling appears correctly
- Testing responsive behavior on mobile devices
- Checking print styles work properly

---

## ✅ Validation Criteria

### Core Requirements

1. **Template Engine** ✅
   - Handlebars templates compile without errors
   - All helpers function correctly
   - Internationalization works properly
   - Theme switching is functional

2. **Stakeholder Reports** ✅
   - Executive reports show high-level metrics
   - Developer reports include technical details
   - QA reports focus on testing metrics
   - Management reports provide strategic insights

3. **Branding and Themes** ✅
   - Corporate theme applies consistently
   - All visual elements align with brand guidelines
   - Responsive design works across devices
   - Print styles are professional

### Success Indicators

**Template Functionality:**
- [ ] All templates render without errors
- [ ] Data binding works correctly
- [ ] Conditional logic displays appropriately
- [ ] Charts and visualizations appear properly

**Multi-Format Output:**
- [ ] HTML reports display correctly
- [ ] PDF generation works without issues
- [ ] JSON exports contain complete data
- [ ] CSV exports are properly formatted

**Internationalization:**
- [ ] Text displays in selected language
- [ ] Date/time formats respect locale
- [ ] Number formats follow locale conventions
- [ ] Right-to-left languages work (if applicable)

---

## 🎉 Bonus Challenges

### Challenge 1: Custom Chart Components (Intermediate)
- Create reusable chart components
- Add interactive drill-down capabilities
- Implement custom color schemes

### Challenge 2: Real-time Template Updates (Advanced)
- Implement template hot-reloading
- Add live preview functionality
- Create template editor interface

### Challenge 3: Advanced Internationalization (Advanced)
- Add pluralization rules
- Implement context-aware translations
- Create translation management system

**Ready for the final exercise? Continue with [Exercise 04: Real-time Monitoring Dashboard →](./04-real-time-monitoring-dashboard.md)**

---

*You've successfully created a sophisticated template system that can generate professional, branded reports for different stakeholder groups! This system provides the foundation for enterprise-grade reporting.* 🚀