// report-analyzer-implementation.ts
/**
 * Complete HTML Report Analysis Implementation
 * 
 * This example demonstrates comprehensive report analysis including:
 * - Automated data extraction from HTML reports
 * - Trend analysis and historical comparison
 * - Performance metrics calculation
 * - Failure pattern identification
 * - Export capabilities for stakeholders
 */

import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

// Type definitions for comprehensive analysis
interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut';
  duration: number;
  project: string;
  browser: string;
  file: string;
  line: number;
  error?: ErrorDetails;
  retries: number;
  attachments: AttachmentInfo[];
  tags: string[];
  steps: TestStep[];
}

interface ErrorDetails {
  message: string;
  stack: string;
  category: ErrorCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AttachmentInfo {
  name: string;
  path: string;
  type: 'screenshot' | 'video' | 'trace' | 'log';
  size: number;
}

interface TestStep {
  name: string;
  duration: number;
  status: 'passed' | 'failed' | 'skipped';
  error?: string;
}

interface ReportSummary {
  metadata: ReportMetadata;
  overview: TestOverview;
  performance: PerformanceMetrics;
  projects: ProjectBreakdown[];
  trends: TrendAnalysis;
  insights: QualityInsights;
  recommendations: string[];
}

interface ReportMetadata {
  generatedAt: string;
  environment: string;
  buildNumber: string;
  gitCommit: string;
  totalExecutionTime: number;
  reportVersion: string;
}

interface TestOverview {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  timedOut: number;
  passRate: number;
  reliability: number; // percentage of tests that didn't need retries
}

interface PerformanceMetrics {
  averageDuration: number;
  medianDuration: number;
  p95Duration: number;
  fastestTest: { name: string; duration: number };
  slowestTest: { name: string; duration: number };
  parallelEfficiency: number;
  resourceUtilization: number;
}

interface ProjectBreakdown {
  name: string;
  browser: string;
  tests: number;
  passed: number;
  failed: number;
  duration: number;
  passRate: number;
  topFailures: FailureAnalysis[];
}

interface TrendAnalysis {
  passRateHistory: HistoryPoint[];
  durationHistory: HistoryPoint[];
  failurePatterns: FailurePattern[];
  flakyTests: FlakyTestInfo[];
  qualityTrend: 'improving' | 'stable' | 'declining';
}

interface HistoryPoint {
  date: string;
  value: number;
  buildNumber: string;
}

interface FailurePattern {
  pattern: string;
  count: number;
  category: ErrorCategory;
  impact: 'low' | 'medium' | 'high';
  examples: string[];
}

interface FlakyTestInfo {
  name: string;
  file: string;
  flakinessRate: number; // percentage of runs that failed
  lastFailures: string[];
  recommendation: string;
}

interface QualityInsights {
  testCoverage: number;
  codeHealthScore: number;
  maintainabilityIndex: number;
  technicalDebt: TechnicalDebtItem[];
  bestPracticesAdherence: number;
}

interface TechnicalDebtItem {
  type: 'flaky_test' | 'slow_test' | 'brittle_selector' | 'missing_assertion';
  description: string;
  severity: 'low' | 'medium' | 'high';
  estimatedEffort: string;
}

type ErrorCategory = 'timeout' | 'element_not_found' | 'network_error' | 'assertion_failed' | 
                    'permission_denied' | 'invalid_state' | 'browser_crash' | 'unknown';

interface FailureAnalysis {
  category: ErrorCategory;
  count: number;
  examples: string[];
  impact: 'low' | 'medium' | 'high' | 'critical';
}

class ComprehensiveReportAnalyzer {
  private reportPath: string;
  private historicalDataPath: string;
  private testResults: TestResult[] = [];
  private historicalData: ReportSummary[] = [];

  constructor(reportPath: string) {
    this.reportPath = reportPath;
    this.historicalDataPath = path.join(path.dirname(reportPath), 'report-history.json');
    this.loadHistoricalData();
  }

  /**
   * Main analysis method that processes the HTML report and generates comprehensive insights
   */
  async analyzeReport(): Promise<ReportSummary> {
    console.log('🔍 Starting comprehensive report analysis...');
    
    try {
      // Step 1: Extract test data from multiple sources
      await this.extractTestData();
      
      // Step 2: Generate comprehensive summary
      const summary = await this.generateComprehensiveSummary();
      
      // Step 3: Save historical data for trend analysis
      await this.saveHistoricalData(summary);
      
      // Step 4: Generate actionable insights
      await this.generateActionableInsights(summary);
      
      console.log('✅ Report analysis completed successfully');
      return summary;
      
    } catch (error) {
      console.error('❌ Report analysis failed:', error);
      throw error;
    }
  }

  /**
   * Extract test data from HTML report and JSON artifacts
   */
  private async extractTestData(): Promise<void> {
    // Extract from JSON data (most reliable)
    await this.extractFromJSON();
    
    // Enhance with HTML parsing for UI-specific data
    await this.extractFromHTML();
    
    // Process attachments and calculate sizes
    await this.processAttachments();
    
    console.log(`📊 Extracted data for ${this.testResults.length} tests`);
  }

  private async extractFromJSON(): Promise<void> {
    const jsonPath = path.join(this.reportPath, 'data', 'test-results.json');
    
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Test results JSON not found at: ${jsonPath}`);
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    // Process test suites recursively
    for (const suite of jsonData.suites || []) {
      this.processSuiteRecursively(suite);
    }
  }

  private processSuiteRecursively(suite: any, parentPath = ''): void {
    const currentPath = parentPath ? `${parentPath} > ${suite.title}` : suite.title;

    // Process tests in current suite
    for (const test of suite.tests || []) {
      for (const result of test.results || []) {
        const testResult: TestResult = {
          id: `${test.id}-${result.retry}`,
          name: test.title,
          status: result.status,
          duration: result.duration || 0,
          project: test.projectName || 'default',
          browser: this.extractBrowser(test.projectName),
          file: test.location?.file || '',
          line: test.location?.line || 0,
          error: result.error ? this.categorizeError(result.error) : undefined,
          retries: result.retry || 0,
          attachments: this.processAttachmentData(result.attachments || []),
          tags: this.extractTags(test.title, test.location?.file),
          steps: this.processSteps(result.steps || [])
        };

        this.testResults.push(testResult);
      }
    }

    // Process nested suites
    for (const nestedSuite of suite.suites || []) {
      this.processSuiteRecursively(nestedSuite, currentPath);
    }
  }

  private async extractFromHTML(): Promise<void> {
    const htmlPath = path.join(this.reportPath, 'index.html');
    
    if (!fs.existsSync(htmlPath)) {
      console.warn('HTML report not found, skipping HTML extraction');
      return;
    }

    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // Extract additional metadata from HTML
    this.extractUIMetadata(document);
  }

  private extractUIMetadata(document: Document): void {
    // Extract any additional UI-specific information
    const metaElements = document.querySelectorAll('meta[name^="test-"]');
    
    metaElements.forEach(meta => {
      const name = meta.getAttribute('name');
      const content = meta.getAttribute('content');
      console.log(`📋 Extracted metadata: ${name} = ${content}`);
    });
  }

  private async processAttachments(): Promise<void> {
    for (const test of this.testResults) {
      for (const attachment of test.attachments) {
        const fullPath = path.join(this.reportPath, attachment.path);
        
        try {
          const stats = fs.statSync(fullPath);
          attachment.size = stats.size;
        } catch (error) {
          console.warn(`Could not get size for attachment: ${attachment.path}`);
          attachment.size = 0;
        }
      }
    }
  }

  /**
   * Generate comprehensive analysis summary
   */
  private async generateComprehensiveSummary(): Promise<ReportSummary> {
    const metadata = this.extractMetadata();
    const overview = this.calculateOverview();
    const performance = this.calculatePerformanceMetrics();
    const projects = this.analyzeProjects();
    const trends = this.analyzeTrends();
    const insights = this.generateQualityInsights();
    const recommendations = this.generateRecommendations(overview, performance, trends);

    return {
      metadata,
      overview,
      performance,
      projects,
      trends,
      insights,
      recommendations
    };
  }

  private extractMetadata(): ReportMetadata {
    return {
      generatedAt: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      buildNumber: process.env.BUILD_NUMBER || 'local',
      gitCommit: (process.env.GIT_COMMIT || 'unknown').substring(0, 7),
      totalExecutionTime: this.testResults.reduce((sum, test) => sum + test.duration, 0),
      reportVersion: '2.0.0'
    };
  }

  private calculateOverview(): TestOverview {
    const total = this.testResults.length;
    const passed = this.testResults.filter(t => t.status === 'passed').length;
    const failed = this.testResults.filter(t => t.status === 'failed').length;
    const skipped = this.testResults.filter(t => t.status === 'skipped').length;
    const timedOut = this.testResults.filter(t => t.status === 'timedOut').length;
    
    const testsWithoutRetries = this.testResults.filter(t => t.retries === 0).length;
    
    return {
      totalTests: total,
      passed,
      failed,
      skipped,
      timedOut,
      passRate: total > 0 ? (passed / total) * 100 : 0,
      reliability: total > 0 ? (testsWithoutRetries / total) * 100 : 0
    };
  }

  private calculatePerformanceMetrics(): PerformanceMetrics {
    const durations = this.testResults.map(t => t.duration).sort((a, b) => a - b);
    const total = durations.length;
    
    if (total === 0) {
      return {
        averageDuration: 0,
        medianDuration: 0,
        p95Duration: 0,
        fastestTest: { name: '', duration: 0 },
        slowestTest: { name: '', duration: 0 },
        parallelEfficiency: 0,
        resourceUtilization: 0
      };
    }

    const sum = durations.reduce((a, b) => a + b, 0);
    const median = total % 2 === 0 
      ? (durations[total / 2 - 1] + durations[total / 2]) / 2
      : durations[Math.floor(total / 2)];
    
    const p95Index = Math.floor(total * 0.95);
    const p95 = durations[p95Index];
    
    const fastest = this.testResults.reduce((min, test) => 
      test.duration < min.duration ? test : min
    );
    
    const slowest = this.testResults.reduce((max, test) => 
      test.duration > max.duration ? test : max
    );

    return {
      averageDuration: sum / total,
      medianDuration: median,
      p95Duration: p95,
      fastestTest: { name: fastest.name, duration: fastest.duration },
      slowestTest: { name: slowest.name, duration: slowest.duration },
      parallelEfficiency: this.calculateParallelEfficiency(),
      resourceUtilization: this.calculateResourceUtilization()
    };
  }

  private analyzeProjects(): ProjectBreakdown[] {
    const projectMap = new Map<string, TestResult[]>();
    
    // Group tests by project-browser combination
    this.testResults.forEach(test => {
      const key = `${test.project}-${test.browser}`;
      if (!projectMap.has(key)) {
        projectMap.set(key, []);
      }
      projectMap.get(key)!.push(test);
    });

    return Array.from(projectMap.entries()).map(([key, tests]) => {
      const [project, browser] = key.split('-');
      const passed = tests.filter(t => t.status === 'passed').length;
      const failed = tests.filter(t => t.status === 'failed').length;
      const duration = tests.reduce((sum, t) => sum + t.duration, 0);

      return {
        name: project,
        browser,
        tests: tests.length,
        passed,
        failed,
        duration,
        passRate: tests.length > 0 ? (passed / tests.length) * 100 : 0,
        topFailures: this.analyzeTopFailures(tests.filter(t => t.status === 'failed'))
      };
    });
  }

  private analyzeTopFailures(failedTests: TestResult[]): FailureAnalysis[] {
    const failureMap = new Map<string, FailureAnalysis>();
    
    failedTests.forEach(test => {
      if (!test.error) return;
      
      const key = test.error.category;
      if (!failureMap.has(key)) {
        failureMap.set(key, {
          category: test.error.category,
          count: 0,
          examples: [],
          impact: test.error.severity
        });
      }
      
      const failure = failureMap.get(key)!;
      failure.count++;
      if (failure.examples.length < 3) {
        failure.examples.push(test.name);
      }
    });

    return Array.from(failureMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private analyzeTrends(): TrendAnalysis {
    const passRateHistory = this.historicalData.map(d => ({
      date: d.metadata.generatedAt,
      value: d.overview.passRate,
      buildNumber: d.metadata.buildNumber
    }));

    const durationHistory = this.historicalData.map(d => ({
      date: d.metadata.generatedAt,
      value: d.performance.averageDuration,
      buildNumber: d.metadata.buildNumber
    }));

    const failurePatterns = this.analyzeFailurePatterns();
    const flakyTests = this.identifyFlakyTests();
    const qualityTrend = this.determineQualityTrend(passRateHistory);

    return {
      passRateHistory,
      durationHistory,
      failurePatterns,
      flakyTests,
      qualityTrend
    };
  }

  private generateQualityInsights(): QualityInsights {
    return {
      testCoverage: this.calculateTestCoverage(),
      codeHealthScore: this.calculateCodeHealthScore(),
      maintainabilityIndex: this.calculateMaintainabilityIndex(),
      technicalDebt: this.identifyTechnicalDebt(),
      bestPracticesAdherence: this.calculateBestPracticesAdherence()
    };
  }

  private generateRecommendations(overview: TestOverview, performance: PerformanceMetrics, trends: TrendAnalysis): string[] {
    const recommendations: string[] = [];

    if (overview.passRate < 95) {
      recommendations.push(`🎯 Focus on improving pass rate: Currently at ${overview.passRate.toFixed(1)}%, target is 95%+`);
    }

    if (overview.reliability < 90) {
      recommendations.push(`🔧 Address flaky tests: ${(100 - overview.reliability).toFixed(1)}% of tests required retries`);
    }

    if (performance.p95Duration > 30000) {
      recommendations.push(`⚡ Optimize slow tests: 95th percentile duration is ${(performance.p95Duration / 1000).toFixed(1)}s`);
    }

    if (trends.qualityTrend === 'declining') {
      recommendations.push(`📉 Quality trend is declining: Investigate recent changes and increase test maintenance`);
    }

    const slowTests = this.testResults.filter(t => t.duration > 60000);
    if (slowTests.length > 0) {
      recommendations.push(`🐌 ${slowTests.length} tests take longer than 1 minute: Consider optimization or parallelization`);
    }

    return recommendations;
  }

  /**
   * Export report data in various formats
   */
  async exportReport(format: 'json' | 'csv' | 'html' = 'json'): Promise<string> {
    const summary = await this.analyzeReport();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = path.join(this.reportPath, `analysis-${timestamp}.${format}`);

    switch (format) {
      case 'json':
        fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
        break;
      case 'csv':
        const csvContent = this.generateCSV(summary);
        fs.writeFileSync(outputPath, csvContent);
        break;
      case 'html':
        const htmlContent = this.generateHTMLReport(summary);
        fs.writeFileSync(outputPath, htmlContent);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    console.log(`📄 Report exported to: ${outputPath}`);
    return outputPath;
  }

  // Helper methods
  private extractBrowser(projectName: string): string {
    if (projectName?.toLowerCase().includes('chrome')) return 'chromium';
    if (projectName?.toLowerCase().includes('firefox')) return 'firefox';
    if (projectName?.toLowerCase().includes('webkit') || projectName?.toLowerCase().includes('safari')) return 'webkit';
    return 'unknown';
  }

  private categorizeError(error: any): ErrorDetails {
    const message = error.message || '';
    const stack = error.stack || '';
    
    let category: ErrorCategory = 'unknown';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';

    if (message.includes('timeout') || message.includes('Timeout')) {
      category = 'timeout';
      severity = 'high';
    } else if (message.includes('not found') || message.includes('not visible')) {
      category = 'element_not_found';
      severity = 'medium';
    } else if (message.includes('network') || message.includes('fetch')) {
      category = 'network_error';
      severity = 'high';
    } else if (message.includes('expect') || message.includes('assertion')) {
      category = 'assertion_failed';
      severity = 'medium';
    }

    return { message, stack, category, severity };
  }

  private processAttachmentData(attachments: any[]): AttachmentInfo[] {
    return attachments.map(att => ({
      name: att.name,
      path: att.path,
      type: this.determineAttachmentType(att.name),
      size: 0 // Will be calculated later
    }));
  }

  private determineAttachmentType(name: string): 'screenshot' | 'video' | 'trace' | 'log' {
    if (name.includes('screenshot') || name.endsWith('.png')) return 'screenshot';
    if (name.includes('video') || name.endsWith('.webm')) return 'video';
    if (name.includes('trace') || name.endsWith('.zip')) return 'trace';
    return 'log';
  }

  private extractTags(title: string, file: string = ''): string[] {
    const tags: string[] = [];
    
    // Extract tags from test title
    const tagMatches = title.match(/@(\w+)/g);
    if (tagMatches) {
      tags.push(...tagMatches.map(tag => tag.substring(1)));
    }
    
    // Extract category from file path
    if (file.includes('/smoke/')) tags.push('smoke');
    if (file.includes('/regression/')) tags.push('regression');
    if (file.includes('/api/')) tags.push('api');
    if (file.includes('/e2e/')) tags.push('e2e');
    
    return tags;
  }

  private processSteps(steps: any[]): TestStep[] {
    return steps.map(step => ({
      name: step.title || step.name,
      duration: step.duration || 0,
      status: step.error ? 'failed' : 'passed',
      error: step.error?.message
    }));
  }

  private generateCSV(summary: ReportSummary): string {
    const headers = ['Test Name', 'Status', 'Duration (ms)', 'Project', 'Browser', 'File', 'Error'];
    const csvRows = [headers.join(',')];
    
    this.testResults.forEach(test => {
      const values = [
        this.escapeCSV(test.name),
        test.status,
        test.duration.toString(),
        test.project,
        test.browser,
        this.escapeCSV(test.file),
        this.escapeCSV(test.error?.message || '')
      ];
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }

  private generateHTMLReport(summary: ReportSummary): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; }
          .summary { background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
          th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #dee2e6; }
          th { background: #e9ecef; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>Test Analysis Report</h1>
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Tests:</strong> ${summary.overview.totalTests}</p>
          <p><strong>Pass Rate:</strong> ${summary.overview.passRate.toFixed(1)}%</p>
          <p><strong>Average Duration:</strong> ${(summary.performance.averageDuration / 1000).toFixed(1)}s</p>
        </div>
        
        <h2>Recommendations</h2>
        <ul>
          ${summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </body>
      </html>
    `;
  }

  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private loadHistoricalData(): void {
    try {
      if (fs.existsSync(this.historicalDataPath)) {
        const data = fs.readFileSync(this.historicalDataPath, 'utf-8');
        this.historicalData = JSON.parse(data);
      }
    } catch (error) {
      console.warn('Could not load historical data:', error);
      this.historicalData = [];
    }
  }

  private async saveHistoricalData(summary: ReportSummary): Promise<void> {
    this.historicalData.push(summary);
    this.historicalData = this.historicalData.slice(-50); // Keep last 50 reports
    
    try {
      fs.writeFileSync(this.historicalDataPath, JSON.stringify(this.historicalData, null, 2));
    } catch (error) {
      console.warn('Could not save historical data:', error);
    }
  }

  // Mock implementations for demonstration
  private calculateParallelEfficiency(): number { return 85; }
  private calculateResourceUtilization(): number { return 78; }
  private analyzeFailurePatterns(): FailurePattern[] { return []; }
  private identifyFlakyTests(): FlakyTestInfo[] { return []; }
  private determineQualityTrend(history: HistoryPoint[]): 'improving' | 'stable' | 'declining' { return 'stable'; }
  private calculateTestCoverage(): number { return 85; }
  private calculateCodeHealthScore(): number { return 92; }
  private calculateMaintainabilityIndex(): number { return 78; }
  private identifyTechnicalDebt(): TechnicalDebtItem[] { return []; }
  private calculateBestPracticesAdherence(): number { return 88; }
  private async generateActionableInsights(summary: ReportSummary): Promise<void> {
    console.log('💡 Generated insights for', summary.overview.totalTests, 'tests');
  }
}

// Usage example
export async function runReportAnalysis(reportPath: string): Promise<void> {
  const analyzer = new ComprehensiveReportAnalyzer(reportPath);
  
  try {
    const summary = await analyzer.analyzeReport();
    
    console.log('\n📊 ANALYSIS SUMMARY');
    console.log('==================');
    console.log(`Pass Rate: ${summary.overview.passRate.toFixed(1)}%`);
    console.log(`Reliability: ${summary.overview.reliability.toFixed(1)}%`);
    console.log(`Average Duration: ${(summary.performance.averageDuration / 1000).toFixed(1)}s`);
    console.log(`Quality Trend: ${summary.trends.qualityTrend}`);
    
    console.log('\n💡 RECOMMENDATIONS');
    console.log('==================');
    summary.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });
    
    // Export detailed report
    await analyzer.exportReport('json');
    await analyzer.exportReport('html');
    
  } catch (error) {
    console.error('Analysis failed:', error);
    process.exit(1);
  }
}

export { ComprehensiveReportAnalyzer, ReportSummary };