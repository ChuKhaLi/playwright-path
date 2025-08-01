/**
 * JSON to Dashboard Reporter Example
 * Demonstrates converting Playwright JSON reports to dashboard-friendly formats
 */

import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface DashboardReporterOptions {
  outputDir?: string;
  dashboardFormat: 'grafana' | 'tableau' | 'powerbi' | 'custom';
  includeScreenshots?: boolean;
  includeTraces?: boolean;
  historicalData?: boolean;
  customFields?: Record<string, (test: TestCase, result: TestResult) => any>;
  exportFormats?: ('json' | 'csv' | 'xml')[];
  realTimeUpdates?: boolean;
}

interface DashboardTestResult {
  id: string;
  title: string;
  project: string;
  file: string;
  line: number;
  column: number;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut';
  duration: number;
  startTime: string;
  endTime: string;
  retries: number;
  browser: string;
  platform: string;
  environment: string;
  tags: string[];
  errors: Array<{
    message: string;
    location?: string;
    stack?: string;
  }>;
  steps: Array<{
    title: string;
    duration: number;
    status: string;
  }>;
  attachments: Array<{
    name: string;
    path: string;
    contentType: string;
  }>;
  customData?: Record<string, any>;
}

interface DashboardSummary {
  runId: string;
  timestamp: string;
  environment: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  timedOut: number;
  duration: number;
  passRate: number;
  projects: Array<{
    name: string;
    tests: number;
    passed: number;
    failed: number;
    duration: number;
  }>;
  browsers: Array<{
    name: string;
    tests: number;
    passed: number;
    failed: number;
  }>;
  trends: {
    passRateChange: number;
    durationChange: number;
    failureRate: number;
  };
}

class JsonToDashboardReporter implements Reporter {
  private options: DashboardReporterOptions;
  private testResults: DashboardTestResult[] = [];
  private startTime: number = 0;
  private summary: Partial<DashboardSummary> = {};

  constructor(options: DashboardReporterOptions) {
    this.options = {
      outputDir: './dashboard-reports',
      includeScreenshots: true,
      includeTraces: false,
      historicalData: true,
      exportFormats: ['json'],
      realTimeUpdates: false,
      ...options
    };

    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir!)) {
      fs.mkdirSync(this.options.outputDir!, { recursive: true });
    }
  }

  onBegin(config: any, suite: any): void {
    this.startTime = Date.now();
    
    // Initialize summary
    this.summary = {
      runId: this.generateRunId(),
      timestamp: new Date().toISOString(),
      environment: process.env.ENVIRONMENT || 'test',
      totalTests: suite.allTests().length,
      passed: 0,
      failed: 0,
      skipped: 0,
      timedOut: 0,
      duration: 0,
      projects: [],
      browsers: []
    };

    console.log(`📊 Dashboard reporter initialized for ${this.summary.totalTests} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const dashboardResult = this.convertToDashboardFormat(test, result);
    this.testResults.push(dashboardResult);

    // Update summary counts
    switch (result.status) {
      case 'passed':
        this.summary.passed!++;
        break;
      case 'failed':
        this.summary.failed!++;
        break;
      case 'skipped':
        this.summary.skipped!++;
        break;
      case 'timedOut':
        this.summary.timedOut!++;
        break;
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    this.summary.duration = Date.now() - this.startTime;
    this.summary.passRate = this.summary.totalTests! > 0 
      ? (this.summary.passed! / this.summary.totalTests!) * 100 
      : 0;

    // Calculate project and browser summaries
    this.calculateProjectSummaries();
    this.calculateBrowserSummaries();
    
    // Calculate trends if historical data is available
    if (this.options.historicalData) {
      this.calculateTrends();
    }

    // Generate dashboard data in requested formats
    await this.generateDashboardData();

    console.log(`✅ Dashboard data generated: ${this.options.outputDir}`);
  }

  private convertToDashboardFormat(test: TestCase, result: TestResult): DashboardTestResult {
    const dashboardResult: DashboardTestResult = {
      id: this.generateTestId(test),
      title: test.title,
      project: test.project()?.name || 'default',
      file: test.location.file,
      line: test.location.line,
      column: test.location.column,
      status: result.status as any,
      duration: result.duration,
      startTime: new Date(result.startTime).toISOString(),
      endTime: new Date(result.startTime.getTime() + result.duration).toISOString(),
      retries: result.retry,
      browser: test.project()?.use?.browserName || 'unknown',
      platform: process.platform,
      environment: process.env.ENVIRONMENT || 'test',
      tags: this.extractTags(test),
      errors: result.errors.map(error => ({
        message: error.message || '',
        location: error.location ? `${error.location.file}:${error.location.line}` : undefined,
        stack: error.stack
      })),
      steps: result.steps.map(step => ({
        title: step.title,
        duration: step.duration,
        status: step.error ? 'failed' : 'passed'
      })),
      attachments: result.attachments.map(attachment => ({
        name: attachment.name,
        path: attachment.path || '',
        contentType: attachment.contentType
      }))
    };

    // Add custom fields if configured
    if (this.options.customFields) {
      dashboardResult.customData = {};
      for (const [fieldName, fieldExtractor] of Object.entries(this.options.customFields)) {
        dashboardResult.customData[fieldName] = fieldExtractor(test, result);
      }
    }

    return dashboardResult;
  }

  private async generateDashboardData(): Promise<void> {
    const dashboardData = {
      summary: this.summary,
      results: this.testResults,
      metadata: {
        generatedAt: new Date().toISOString(),
        format: this.options.dashboardFormat,
        version: '1.0.0'
      }
    };

    // Generate different formats based on configuration
    for (const format of this.options.exportFormats || ['json']) {
      switch (format) {
        case 'json':
          await this.generateJsonFormat(dashboardData);
          break;
        case 'csv':
          await this.generateCsvFormat();
          break;
        case 'xml':
          await this.generateXmlFormat(dashboardData);
          break;
      }
    }

    // Generate dashboard-specific formats
    switch (this.options.dashboardFormat) {
      case 'grafana':
        await this.generateGrafanaFormat();
        break;
      case 'tableau':
        await this.generateTableauFormat();
        break;
      case 'powerbi':
        await this.generatePowerBIFormat();
        break;
      case 'custom':
        await this.generateCustomFormat(dashboardData);
        break;
    }
  }

  private async generateJsonFormat(data: any): Promise<void> {
    const filePath = path.join(this.options.outputDir!, 'dashboard-data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  private async generateCsvFormat(): Promise<void> {
    const headers = [
      'Test ID', 'Title', 'Project', 'File', 'Status', 'Duration',
      'Browser', 'Platform', 'Start Time', 'End Time', 'Retries', 'Tags'
    ];

    const rows = this.testResults.map(result => [
      result.id,
      result.title,
      result.project,
      result.file,
      result.status,
      result.duration,
      result.browser,
      result.platform,
      result.startTime,
      result.endTime,
      result.retries,
      result.tags.join(';')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const filePath = path.join(this.options.outputDir!, 'dashboard-data.csv');
    fs.writeFileSync(filePath, csvContent);
  }

  private async generateXmlFormat(data: any): Promise<void> {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<dashboard-data>
  <summary>
    <runId>${data.summary.runId}</runId>
    <timestamp>${data.summary.timestamp}</timestamp>
    <totalTests>${data.summary.totalTests}</totalTests>
    <passed>${data.summary.passed}</passed>
    <failed>${data.summary.failed}</failed>
    <skipped>${data.summary.skipped}</skipped>
    <duration>${data.summary.duration}</duration>
    <passRate>${data.summary.passRate}</passRate>
  </summary>
  <results>
    ${data.results.map((result: DashboardTestResult) => `
    <test id="${result.id}">
      <title>${this.escapeXml(result.title)}</title>
      <project>${result.project}</project>
      <status>${result.status}</status>
      <duration>${result.duration}</duration>
      <browser>${result.browser}</browser>
      <startTime>${result.startTime}</startTime>
      <endTime>${result.endTime}</endTime>
    </test>`).join('')}
  </results>
</dashboard-data>`;

    const filePath = path.join(this.options.outputDir!, 'dashboard-data.xml');
    fs.writeFileSync(filePath, xmlContent);
  }

  private async generateGrafanaFormat(): Promise<void> {
    // Grafana-specific format for time series data
    const grafanaData = {
      dashboard: {
        id: null,
        title: "Playwright Test Results",
        panels: [
          {
            title: "Test Pass Rate",
            type: "stat",
            targets: [{
              expr: "playwright_pass_rate",
              format: "time_series"
            }]
          },
          {
            title: "Test Duration Trends",
            type: "graph",
            targets: [{
              expr: "playwright_test_duration",
              format: "time_series"
            }]
          }
        ]
      },
      metrics: this.testResults.map(result => ({
        name: "playwright_test_duration",
        value: result.duration,
        timestamp: new Date(result.startTime).getTime(),
        labels: {
          test: result.title,
          project: result.project,
          browser: result.browser,
          status: result.status
        }
      }))
    };

    const filePath = path.join(this.options.outputDir!, 'grafana-dashboard.json');
    fs.writeFileSync(filePath, JSON.stringify(grafanaData, null, 2));
  }

  private async generateTableauFormat(): Promise<void> {
    // Tableau-friendly format with flattened data
    const tableauData = this.testResults.map(result => ({
      'Test ID': result.id,
      'Test Title': result.title,
      'Project': result.project,
      'File Path': result.file,
      'Status': result.status,
      'Duration (ms)': result.duration,
      'Browser': result.browser,
      'Platform': result.platform,
      'Environment': result.environment,
      'Start Time': result.startTime,
      'End Time': result.endTime,
      'Retries': result.retries,
      'Tags': result.tags.join(', '),
      'Error Count': result.errors.length,
      'Step Count': result.steps.length,
      'Pass/Fail': result.status === 'passed' ? 1 : 0
    }));

    const filePath = path.join(this.options.outputDir!, 'tableau-data.json');
    fs.writeFileSync(filePath, JSON.stringify(tableauData, null, 2));
  }

  private async generatePowerBIFormat(): Promise<void> {
    // Power BI expects specific format with relationships
    const powerBIData = {
      tests: this.testResults.map(result => ({
        TestId: result.id,
        Title: result.title,
        ProjectId: result.project,
        Status: result.status,
        Duration: result.duration,
        StartTime: result.startTime,
        Browser: result.browser,
        Platform: result.platform
      })),
      projects: [...new Set(this.testResults.map(r => r.project))].map(project => ({
        ProjectId: project,
        ProjectName: project
      })),
      summary: {
        RunId: this.summary.runId,
        Timestamp: this.summary.timestamp,
        TotalTests: this.summary.totalTests,
        Passed: this.summary.passed,
        Failed: this.summary.failed,
        PassRate: this.summary.passRate
      }
    };

    const filePath = path.join(this.options.outputDir!, 'powerbi-data.json');
    fs.writeFileSync(filePath, JSON.stringify(powerBIData, null, 2));
  }

  private async generateCustomFormat(data: any): Promise<void> {
    // Custom format that can be easily customized
    const customData = {
      testRun: {
        id: data.summary.runId,
        timestamp: data.summary.timestamp,
        environment: data.summary.environment,
        metrics: {
          total: data.summary.totalTests,
          passed: data.summary.passed,
          failed: data.summary.failed,
          skipped: data.summary.skipped,
          passRate: data.summary.passRate,
          duration: data.summary.duration
        }
      },
      testDetails: data.results.map((result: DashboardTestResult) => ({
        id: result.id,
        name: result.title,
        suite: result.project,
        outcome: result.status,
        runtime: result.duration,
        browser: result.browser,
        timestamp: result.startTime,
        metadata: {
          file: result.file,
          retries: result.retries,
          tags: result.tags,
          hasErrors: result.errors.length > 0,
          stepCount: result.steps.length
        }
      }))
    };

    const filePath = path.join(this.options.outputDir!, 'custom-dashboard.json');
    fs.writeFileSync(filePath, JSON.stringify(customData, null, 2));
  }

  private calculateProjectSummaries(): void {
    const projectStats = new Map<string, any>();
    
    for (const result of this.testResults) {
      if (!projectStats.has(result.project)) {
        projectStats.set(result.project, {
          name: result.project,
          tests: 0,
          passed: 0,
          failed: 0,
          duration: 0
        });
      }
      
      const stats = projectStats.get(result.project);
      stats.tests++;
      stats.duration += result.duration;
      
      if (result.status === 'passed') stats.passed++;
      else if (result.status === 'failed') stats.failed++;
    }
    
    this.summary.projects = Array.from(projectStats.values());
  }

  private calculateBrowserSummaries(): void {
    const browserStats = new Map<string, any>();
    
    for (const result of this.testResults) {
      if (!browserStats.has(result.browser)) {
        browserStats.set(result.browser, {
          name: result.browser,
          tests: 0,
          passed: 0,
          failed: 0
        });
      }
      
      const stats = browserStats.get(result.browser);
      stats.tests++;
      
      if (result.status === 'passed') stats.passed++;
      else if (result.status === 'failed') stats.failed++;
    }
    
    this.summary.browsers = Array.from(browserStats.values());
  }

  private calculateTrends(): void {
    // Load historical data and calculate trends
    const historyFile = path.join(this.options.outputDir!, 'history.json');
    
    try {
      if (fs.existsSync(historyFile)) {
        const history = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
        const lastRun = history.runs[history.runs.length - 1];
        
        if (lastRun) {
          this.summary.trends = {
            passRateChange: this.summary.passRate! - lastRun.passRate,
            durationChange: this.summary.duration! - lastRun.duration,
            failureRate: (this.summary.failed! / this.summary.totalTests!) * 100
          };
        }
        
        // Add current run to history
        history.runs.push({
          runId: this.summary.runId,
          timestamp: this.summary.timestamp,
          passRate: this.summary.passRate,
          duration: this.summary.duration,
          totalTests: this.summary.totalTests
        });
        
        // Keep only last 50 runs
        history.runs = history.runs.slice(-50);
        
        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
      } else {
        // Create initial history file
        const initialHistory = {
          runs: [{
            runId: this.summary.runId,
            timestamp: this.summary.timestamp,
            passRate: this.summary.passRate,
            duration: this.summary.duration,
            totalTests: this.summary.totalTests
          }]
        };
        
        fs.writeFileSync(historyFile, JSON.stringify(initialHistory, null, 2));
      }
    } catch (error) {
      console.warn('Could not calculate trends:', error);
    }
  }

  private generateRunId(): string {
    return `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTestId(test: TestCase): string {
    return `${test.project()?.name || 'default'}-${test.title}`.replace(/[^a-zA-Z0-9]/g, '-');
  }

  private extractTags(test: TestCase): string[] {
    const tags: string[] = [];
    
    // Extract from file path
    const filePath = test.location.file;
    if (filePath.includes('/smoke/')) tags.push('smoke');
    if (filePath.includes('/regression/')) tags.push('regression');
    if (filePath.includes('/api/')) tags.push('api');
    if (filePath.includes('/e2e/')) tags.push('e2e');
    
    return tags;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

export default JsonToDashboardReporter;

/**
 * Usage Examples:
 * 
 * 1. Grafana dashboard integration:
 * 
 * reporter: [
 *   ['./reporters/json-to-dashboard-reporter.ts', {
 *     dashboardFormat: 'grafana',
 *     outputDir: './grafana-data',
 *     exportFormats: ['json', 'csv'],
 *     historicalData: true
 *   }]
 * ]
 * 
 * 2. Tableau integration with custom fields:
 * 
 * reporter: [
 *   ['./reporters/json-to-dashboard-reporter.ts', {
 *     dashboardFormat: 'tableau',
 *     customFields: {
 *       testComplexity: (test, result) => result.steps.length,
 *       errorCategory: (test, result) => result.errors[0]?.message.includes('timeout') ? 'timeout' : 'other'
 *     }
 *   }]
 * ]
 */