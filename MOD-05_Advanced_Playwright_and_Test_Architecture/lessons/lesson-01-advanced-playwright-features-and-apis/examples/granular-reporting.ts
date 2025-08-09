/**
 * Advanced Granular Reporting and Test Insights
 * 
 * This example demonstrates sophisticated reporting mechanisms including
 * custom test result formatting, performance metrics collection, visual
 * evidence capture, and comprehensive test insight generation for
 * enterprise reporting requirements.
 * 
 * @author Playwright Learning Module
 * @version 1.0.0
 */

import { test, expect, Page, TestInfo } from '@playwright/test';

// =============================================================================
// PERFORMANCE METRICS COLLECTOR
// =============================================================================

/**
 * Collects detailed performance metrics during test execution
 */
export class PerformanceMetricsCollector {
  private metrics: Map<string, any> = new Map();
  private startTimes: Map<string, number> = new Map();

  /**
   * Start timing a specific operation
   */
  startTiming(operationName: string): void {
    this.startTimes.set(operationName, Date.now());
  }

  /**
   * End timing and record the duration
   */
  endTiming(operationName: string): number {
    const startTime = this.startTimes.get(operationName);
    if (!startTime) {
      throw new Error(`No start time found for operation: ${operationName}`);
    }

    const duration = Date.now() - startTime;
    this.recordMetric(operationName, { duration, unit: 'ms' });
    this.startTimes.delete(operationName);
    return duration;
  }

  /**
   * Record custom performance metric
   */
  recordMetric(name: string, value: any): void {
    const timestamp = new Date().toISOString();
    this.metrics.set(name, {
      ...value,
      timestamp,
      testRun: process.env.TEST_RUN_ID || 'unknown'
    });
  }

  /**
   * Collect page performance metrics
   */
  async collectPageMetrics(page: Page): Promise<void> {
    try {
      // Collect Core Web Vitals and performance timing
      const performanceData = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        return {
          // Navigation timing
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          loadComplete: navigation.loadEventEnd - navigation.navigationStart,
          domInteractive: navigation.domInteractive - navigation.navigationStart,
          
          // Paint timing
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          
          // Network timing
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcpConnect: navigation.connectEnd - navigation.connectStart,
          serverResponse: navigation.responseEnd - navigation.requestStart,
          
          // Resource counts
          resourceCount: performance.getEntriesByType('resource').length,
          
          // Memory usage (if available)
          memoryUsage: (performance as any).memory ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
          } : null
        };
      });

      this.recordMetric('pagePerformance', performanceData);
    } catch (error) {
      console.warn('Failed to collect page performance metrics:', error);
    }
  }

  /**
   * Collect network performance metrics
   */
  async collectNetworkMetrics(page: Page): Promise<void> {
    const networkRequests: any[] = [];
    
    page.on('response', (response) => {
      const request = response.request();
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        status: response.status(),
        contentType: response.headers()['content-type'],
        size: response.headers()['content-length'],
        timing: response.request().timing(),
        resourceType: request.resourceType()
      });
    });

    // Record network summary after test completion
    this.recordMetric('networkRequests', {
      totalRequests: networkRequests.length,
      requests: networkRequests,
      failedRequests: networkRequests.filter(r => r.status >= 400).length,
      slowRequests: networkRequests.filter(r => r.timing && r.timing.responseEnd > 2000).length
    });
  }

  /**
   * Get all collected metrics
   */
  getAllMetrics(): Map<string, any> {
    return new Map(this.metrics);
  }

  /**
   * Generate performance summary
   */
  generateSummary(): any {
    const allMetrics = Object.fromEntries(this.metrics);
    const pagePerf = this.metrics.get('pagePerformance');
    const networkData = this.metrics.get('networkRequests');

    return {
      testRun: process.env.TEST_RUN_ID || 'unknown',
      timestamp: new Date().toISOString(),
      performanceScore: this.calculatePerformanceScore(pagePerf),
      summary: {
        pageLoadTime: pagePerf?.loadComplete || 0,
        firstContentfulPaint: pagePerf?.firstContentfulPaint || 0,
        networkRequests: networkData?.totalRequests || 0,
        failedRequests: networkData?.failedRequests || 0,
        memoryUsage: pagePerf?.memoryUsage?.usedJSHeapSize || 0
      },
      detailed: allMetrics
    };
  }

  /**
   * Calculate overall performance score
   */
  private calculatePerformanceScore(pagePerf: any): number {
    if (!pagePerf) return 0;

    let score = 100;
    
    // Deduct points for slow loading
    if (pagePerf.loadComplete > 3000) score -= 20;
    if (pagePerf.loadComplete > 5000) score -= 30;
    
    // Deduct points for slow FCP
    if (pagePerf.firstContentfulPaint > 1500) score -= 15;
    if (pagePerf.firstContentfulPaint > 2500) score -= 25;
    
    // Deduct points for slow DOM interactive
    if (pagePerf.domInteractive > 2000) score -= 10;
    
    return Math.max(0, score);
  }
}

// =============================================================================
// VISUAL EVIDENCE COLLECTOR
// =============================================================================

/**
 * Collects visual evidence and test artifacts
 */
export class VisualEvidenceCollector {
  private testInfo: TestInfo;
  private screenshots: string[] = [];
  private videos: string[] = [];

  constructor(testInfo: TestInfo) {
    this.testInfo = testInfo;
  }

  /**
   * Capture screenshot with context
   */
  async captureScreenshot(page: Page, name: string, options: {
    fullPage?: boolean;
    annotations?: Array<{ type: string; text: string; x: number; y: number }>;
  } = {}): Promise<string> {
    const screenshotPath = this.testInfo.outputPath(`${name}-${Date.now()}.png`);
    
    await page.screenshot({
      path: screenshotPath,
      fullPage: options.fullPage || false
    });

    // Add annotations if provided
    if (options.annotations && options.annotations.length > 0) {
      await this.addAnnotationsToScreenshot(page, options.annotations);
    }

    this.screenshots.push(screenshotPath);
    
    // Attach to test results
    await this.testInfo.attach(name, {
      path: screenshotPath,
      contentType: 'image/png'
    });

    return screenshotPath;
  }

  /**
   * Add visual annotations to page
   */
  private async addAnnotationsToScreenshot(page: Page, annotations: Array<{ type: string; text: string; x: number; y: number }>): Promise<void> {
    await page.addStyleTag({
      content: `
        .test-annotation {
          position: absolute;
          background: rgba(255, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-family: Arial, sans-serif;
          z-index: 10000;
          pointer-events: none;
        }
        .test-annotation.success { background: rgba(0, 255, 0, 0.8); }
        .test-annotation.warning { background: rgba(255, 165, 0, 0.8); }
        .test-annotation.info { background: rgba(0, 123, 255, 0.8); }
      `
    });

    for (const annotation of annotations) {
      await page.evaluate((ann) => {
        const div = document.createElement('div');
        div.className = `test-annotation ${ann.type}`;
        div.textContent = ann.text;
        div.style.left = ann.x + 'px';
        div.style.top = ann.y + 'px';
        document.body.appendChild(div);
      }, annotation);
    }
  }

  /**
   * Capture element screenshot with highlight
   */
  async captureElementScreenshot(page: Page, selector: string, name: string): Promise<string> {
    const element = page.locator(selector);
    await element.highlight();
    
    const screenshotPath = this.testInfo.outputPath(`${name}-element-${Date.now()}.png`);
    await element.screenshot({ path: screenshotPath });

    this.screenshots.push(screenshotPath);
    
    await this.testInfo.attach(`${name} Element`, {
      path: screenshotPath,
      contentType: 'image/png'
    });

    return screenshotPath;
  }

  /**
   * Capture comparison screenshots (before/after)
   */
  async captureComparisonScreenshots(page: Page, name: string, action: () => Promise<void>): Promise<{ before: string; after: string }> {
    const beforePath = await this.captureScreenshot(page, `${name}-before`);
    
    await action();
    
    const afterPath = await this.captureScreenshot(page, `${name}-after`);
    
    return { before: beforePath, after: afterPath };
  }

  /**
   * Start video recording
   */
  async startVideoRecording(page: Page): Promise<void> {
    // Video recording is usually configured at the context level
    // This method serves as a marker for when video should be captured
    console.log('Video recording active for test steps');
  }

  /**
   * Capture HTML snapshot
   */
  async captureHTMLSnapshot(page: Page, name: string): Promise<string> {
    const htmlContent = await page.content();
    const htmlPath = this.testInfo.outputPath(`${name}-${Date.now()}.html`);
    
    require('fs').writeFileSync(htmlPath, htmlContent);
    
    await this.testInfo.attach(`${name} HTML`, {
      path: htmlPath,
      contentType: 'text/html'
    });

    return htmlPath;
  }

  /**
   * Get all collected evidence
   */
  getEvidence(): { screenshots: string[]; videos: string[] } {
    return {
      screenshots: [...this.screenshots],
      videos: [...this.videos]
    };
  }
}

// =============================================================================
// CUSTOM TEST REPORTER
// =============================================================================

/**
 * Custom test result formatter and reporter
 */
export class CustomTestReporter {
  private testResults: Map<string, any> = new Map();
  private performanceData: Map<string, any> = new Map();
  private visualEvidence: Map<string, any> = new Map();

  /**
   * Record test result with custom data
   */
  recordTestResult(testName: string, result: {
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
    steps?: Array<{ name: string; status: string; duration: number }>;
    customData?: any;
  }): void {
    this.testResults.set(testName, {
      ...result,
      timestamp: new Date().toISOString(),
      environment: {
        browser: process.env.BROWSER || 'chromium',
        viewport: process.env.VIEWPORT || '1920x1080',
        headless: process.env.HEADLESS !== 'false',
        platform: process.platform
      }
    });
  }

  /**
   * Add performance data for test
   */
  addPerformanceData(testName: string, performanceData: any): void {
    this.performanceData.set(testName, performanceData);
  }

  /**
   * Add visual evidence for test
   */
  addVisualEvidence(testName: string, evidence: any): void {
    this.visualEvidence.set(testName, evidence);
  }

  /**
   * Generate detailed test report
   */
  generateDetailedReport(): any {
    const report = {
      summary: this.generateSummary(),
      testResults: Object.fromEntries(this.testResults),
      performanceData: Object.fromEntries(this.performanceData),
      visualEvidence: Object.fromEntries(this.visualEvidence),
      metadata: {
        generatedAt: new Date().toISOString(),
        testRun: process.env.TEST_RUN_ID || 'unknown',
        environment: process.env.NODE_ENV || 'test',
        version: '1.0.0'
      }
    };

    return report;
  }

  /**
   * Generate executive summary
   */
  private generateSummary(): any {
    const allResults = Array.from(this.testResults.values());
    const totalTests = allResults.length;
    const passedTests = allResults.filter(r => r.status === 'passed').length;
    const failedTests = allResults.filter(r => r.status === 'failed').length;
    const skippedTests = allResults.filter(r => r.status === 'skipped').length;
    
    const totalDuration = allResults.reduce((sum, r) => sum + r.duration, 0);
    const averageDuration = totalTests > 0 ? totalDuration / totalTests : 0;

    return {
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      successRate: totalTests > 0 ? (passedTests / totalTests * 100).toFixed(2) + '%' : '0%',
      totalDuration,
      averageDuration,
      performanceScore: this.calculateOverallPerformanceScore()
    };
  }

  /**
   * Calculate overall performance score across all tests
   */
  private calculateOverallPerformanceScore(): number {
    const scores = Array.from(this.performanceData.values())
      .map(data => data.performanceScore)
      .filter(score => typeof score === 'number');

    if (scores.length === 0) return 0;
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  /**
   * Export report to JSON file
   */
  exportToJSON(filePath: string): void {
    const report = this.generateDetailedReport();
    require('fs').writeFileSync(filePath, JSON.stringify(report, null, 2));
  }

  /**
   * Export report to HTML
   */
  exportToHTML(filePath: string): void {
    const report = this.generateDetailedReport();
    const html = this.generateHTMLReport(report);
    require('fs').writeFileSync(filePath, html);
  }

  /**
   * Generate HTML report template
   */
  private generateHTMLReport(report: any): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - ${report.metadata.generatedAt}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
        .metric.success { border-left-color: #28a745; }
        .metric.warning { border-left-color: #ffc107; }
        .metric.danger { border-left-color: #dc3545; }
        .test-result { margin: 10px 0; padding: 15px; border-radius: 8px; }
        .test-result.passed { background: #d4edda; border-left: 4px solid #28a745; }
        .test-result.failed { background: #f8d7da; border-left: 4px solid #dc3545; }
        .test-result.skipped { background: #fff3cd; border-left: 4px solid #ffc107; }
        .performance-chart { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        h1, h2, h3 { color: #333; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .badge.success { background: #28a745; color: white; }
        .badge.danger { background: #dc3545; color: white; }
        .badge.warning { background: #ffc107; color: black; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 Playwright Test Report</h1>
            <p><strong>Generated:</strong> ${report.metadata.generatedAt}</p>
            <p><strong>Test Run:</strong> ${report.metadata.testRun}</p>
            <p><strong>Environment:</strong> ${report.metadata.environment}</p>
        </div>

        <div class="summary">
            <div class="metric ${report.summary.successRate === '100%' ? 'success' : report.summary.failedTests > 0 ? 'danger' : 'warning'}">
                <h3>Success Rate</h3>
                <div style="font-size: 24px; font-weight: bold;">${report.summary.successRate}</div>
            </div>
            <div class="metric">
                <h3>Total Tests</h3>
                <div style="font-size: 24px; font-weight: bold;">${report.summary.totalTests}</div>
            </div>
            <div class="metric success">
                <h3>Passed</h3>
                <div style="font-size: 24px; font-weight: bold;">${report.summary.passedTests}</div>
            </div>
            <div class="metric danger">
                <h3>Failed</h3>
                <div style="font-size: 24px; font-weight: bold;">${report.summary.failedTests}</div>
            </div>
            <div class="metric warning">
                <h3>Skipped</h3>
                <div style="font-size: 24px; font-weight: bold;">${report.summary.skippedTests}</div>
            </div>
            <div class="metric">
                <h3>Performance Score</h3>
                <div style="font-size: 24px; font-weight: bold;">${report.summary.performanceScore}/100</div>
            </div>
        </div>

        <h2>📊 Test Results</h2>
        ${Object.entries(report.testResults).map(([testName, result]: [string, any]) => `
        <div class="test-result ${result.status}">
            <h3>${testName} <span class="badge ${result.status === 'passed' ? 'success' : result.status === 'failed' ? 'danger' : 'warning'}">${result.status.toUpperCase()}</span></h3>
            <p><strong>Duration:</strong> ${result.duration}ms</p>
            <p><strong>Browser:</strong> ${result.environment.browser}</p>
            ${result.error ? `<p><strong>Error:</strong> <code>${result.error}</code></p>` : ''}
            ${result.steps ? `
            <details>
                <summary>Test Steps (${result.steps.length})</summary>
                ${result.steps.map((step: any) => `
                <div style="margin: 5px 0; padding: 5px; background: rgba(0,0,0,0.05); border-radius: 4px;">
                    <strong>${step.name}</strong> - ${step.status} (${step.duration}ms)
                </div>
                `).join('')}
            </details>
            ` : ''}
        </div>
        `).join('')}
    </div>
</body>
</html>
    `;
  }
}

// =============================================================================
// COMPREHENSIVE TEST INSIGHTS
// =============================================================================

/**
 * Generates comprehensive test insights and analytics
 */
export class TestInsightsGenerator {
  private reporter: CustomTestReporter;
  private metricsCollector: PerformanceMetricsCollector;

  constructor(reporter: CustomTestReporter, metricsCollector: PerformanceMetricsCollector) {
    this.reporter = reporter;
    this.metricsCollector = metricsCollector;
  }

  /**
   * Generate actionable insights from test results
   */
  generateInsights(): any {
    const report = this.reporter.generateDetailedReport();
    const insights = {
      performanceInsights: this.analyzePerformance(report),
      reliabilityInsights: this.analyzeReliability(report),
      coverageInsights: this.analyzeCoverage(report),
      recommendations: this.generateRecommendations(report)
    };

    return insights;
  }

  /**
   * Analyze performance patterns
   */
  private analyzePerformance(report: any): any {
    const performanceData = Object.values(report.performanceData);
    
    return {
      averagePageLoadTime: this.calculateAverage(performanceData, 'summary.pageLoadTime'),
      slowestTests: this.findSlowestTests(report.testResults, 3),
      performanceTrends: this.identifyPerformanceTrends(performanceData),
      bottlenecks: this.identifyBottlenecks(performanceData)
    };
  }

  /**
   * Analyze test reliability
   */
  private analyzeReliability(report: any): any {
    const testResults = Object.values(report.testResults);
    
    return {
      flakyTests: this.identifyFlakyTests(testResults),
      errorPatterns: this.analyzeErrorPatterns(testResults),
      successTrends: this.analyzeSuccessTrends(testResults)
    };
  }

  /**
   * Analyze test coverage insights
   */
  private analyzeCoverage(report: any): any {
    return {
      functionalCoverage: this.analyzeFunctionalCoverage(report),
      browserCoverage: this.analyzeBrowserCoverage(report),
      deviceCoverage: this.analyzeDeviceCoverage(report)
    };
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(report: any): string[] {
    const recommendations: string[] = [];
    
    // Performance recommendations
    if (report.summary.performanceScore < 70) {
      recommendations.push('🚀 Performance optimization needed - consider implementing page load performance budgets');
    }
    
    // Reliability recommendations
    if (report.summary.successRate < 95) {
      recommendations.push('🔧 Test reliability needs improvement - review and stabilize failing tests');
    }
    
    // Test coverage recommendations
    if (report.summary.totalTests < 50) {
      recommendations.push('📈 Expand test coverage - consider adding more comprehensive test scenarios');
    }

    return recommendations;
  }

  // Helper methods for analysis
  private calculateAverage(data: any[], path: string): number {
    const values = data.map(item => this.getNestedValue(item, path)).filter(v => typeof v === 'number');
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private findSlowestTests(testResults: any, count: number): any[] {
    return Object.entries(testResults)
      .sort(([, a]: [string, any], [, b]: [string, any]) => b.duration - a.duration)
      .slice(0, count)
      .map(([name, result]) => ({ name, duration: result.duration }));
  }

  private identifyPerformanceTrends(performanceData: any[]): string[] {
    // Simplified trend analysis
    return ['Performance data available for detailed analysis'];
  }

  private identifyBottlenecks(performanceData: any[]): string[] {
    // Simplified bottleneck identification
    return ['Network requests', 'JavaScript execution', 'DOM rendering'];
  }

  private identifyFlakyTests(testResults: any[]): string[] {
    // Simplified flaky test identification
    return testResults
      .filter((result: any) => result.status === 'failed' && result.error?.includes('timeout'))
      .map((result: any) => result.name || 'Unknown test');
  }

  private analyzeErrorPatterns(testResults: any[]): any {
    const errors = testResults
      .filter((result: any) => result.error)
      .map((result: any) => result.error);
    
    const errorCounts = errors.reduce((acc: any, error: string) => {
      const key = error.split(':')[0]; // Get error type
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return errorCounts;
  }

  private analyzeSuccessTrends(testResults: any[]): any {
    return {
      overallTrend: 'stable',
      patterns: ['Tests generally stable']
    };
  }

  private analyzeFunctionalCoverage(report: any): any {
    return {
      coveragePercentage: 85,
      areas: ['Login', 'Navigation', 'Forms', 'API Integration']
    };
  }

  private analyzeBrowserCoverage(report: any): any {
    const browsers = Object.values(report.testResults)
      .map((result: any) => result.environment?.browser)
      .filter(Boolean);
    
    const browserCounts = browsers.reduce((acc: any, browser: string) => {
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});

    return browserCounts;
  }

  private analyzeDeviceCoverage(report: any): any {
    return {
      desktop: 80,
      mobile: 60,
      tablet: 40
    };
  }
}

// =============================================================================
// PRACTICAL TEST EXAMPLES
// =============================================================================

test.describe('Advanced Granular Reporting Examples', () => {
  let performanceCollector: PerformanceMetricsCollector;
  let visualCollector: VisualEvidenceCollector;
  let reporter: CustomTestReporter;

  test.beforeEach(async ({ page }, testInfo) => {
    performanceCollector = new PerformanceMetricsCollector();
    visualCollector = new VisualEvidenceCollector(testInfo);
    reporter = new CustomTestReporter();

    // Start collecting network metrics
    await performanceCollector.collectNetworkMetrics(page);
  });

  test('comprehensive e-commerce flow with detailed reporting', async ({ page }, testInfo) => {
    const testName = 'e-commerce-flow-with-reporting';
    const startTime = Date.now();

    try {
      // Step 1: Navigate and capture initial state
      performanceCollector.startTiming('page-load');
      await page.goto('https://example.com/shop');
      performanceCollector.endTiming('page-load');

      await performanceCollector.collectPageMetrics(page);
      await visualCollector.captureScreenshot(page, 'shop-homepage', { fullPage: true });

      // Step 2: Search for products with performance tracking
      performanceCollector.startTiming('product-search');
      await page.fill('[data-testid="search-input"]', 'laptop');
      await page.click('[data-testid="search-button"]');
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
      performanceCollector.endTiming('product-search');

      await visualCollector.captureScreenshot(page, 'search-results', {
        annotations: [
          { type: 'success', text: 'Search executed successfully', x: 100, y: 50 }
        ]
      });

      // Step 3: Product selection with visual evidence
      const productLink = page.locator('[data-testid="product-item"]').first();
      await visualCollector.captureElementScreenshot(page, '[data-testid="product-item"]', 'selected-product');
      
      performanceCollector.startTiming('product-page-load');
      await productLink.click();
      await expect(page.locator('[data-testid="product-details"]')).toBeVisible();
      performanceCollector.endTiming('product-page-load');

      // Step 4: Add to cart with before/after comparison
      const addToCartComparison = await visualCollector.captureComparisonScreenshots(
        page,
        'add-to-cart',
        async () => {
          await page.click('[data-testid="add-to-cart"]');
          await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');
        }
      );

      // Step 5: Checkout process with detailed tracking
      performanceCollector.startTiming('checkout-process');
      await page.click('[data-testid="cart-icon"]');
      await page.click('[data-testid="checkout-button"]');
      
      // Fill checkout form
      await page.fill('[data-testid="billing-name"]', 'John Doe');
      await page.fill('[data-testid="billing-email"]', 'john@example.com');
      await page.fill('[data-testid="billing-address"]', '123 Test Street');
      
      await visualCollector.captureScreenshot(page, 'checkout-form-filled');
      
      await page.click('[data-testid="place-order"]');
      await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
      performanceCollector.endTiming('checkout-process');

      // Capture final confirmation
      await visualCollector.captureScreenshot(page, 'order-confirmation', {
        annotations: [
          { type: 'success', text: 'Order placed successfully', x: 200, y: 100 }
        ]
      });

      // Capture HTML snapshot for debugging
      await visualCollector.captureHTMLSnapshot(page, 'final-state');

      // Record successful test result
      const duration = Date.now() - startTime;
      reporter.recordTestResult(testName, {
        status: 'passed',
        duration,
        steps: [
          { name: 'Page Load', status: 'passed', duration: performanceCollector.getAllMetrics().get('page-load')?.duration || 0 },
          { name: 'Product Search', status: 'passed', duration: performanceCollector.getAllMetrics().get('product-search')?.duration || 0 },
          { name: 'Product Selection', status: 'passed', duration: performanceCollector.getAllMetrics().get('product-page-load')?.duration || 0 },
          { name: 'Add to Cart', status: 'passed', duration: 500 },
          { name: 'Checkout Process', status: 'passed', duration: performanceCollector.getAllMetrics().get('checkout-process')?.duration || 0 }
        ],
        customData: {
          productSearched: 'laptop',
          orderValue: '$999.99',
          paymentMethod: 'credit-card'
        }
      });

      // Add performance data to report
      reporter.addPerformanceData(testName, performanceCollector.generateSummary());
      
      // Add visual evidence to report
      reporter.addVisualEvidence(testName, visualCollector.getEvidence());

    } catch (error) {
      // Record failed test result with error details
      const duration = Date.now() - startTime;
      reporter.recordTestResult(testName, {
        status: 'failed',
        duration,
        error: error.message,
        customData: {
          failurePoint: 'checkout-process',
          browserInfo: await page.evaluate(() => navigator.userAgent)
        }
      });

      // Capture failure evidence
      await visualCollector.captureScreenshot(page, 'failure-state', {
        annotations: [
          { type: 'danger', text: `Failure: ${error.message}`, x: 50, y: 50 }
        ]
      });

      throw error;
    }
  });

  test('api integration with performance monitoring', async ({ page }, testInfo) => {
    const testName = 'api-integration-performance';
    const startTime = Date.now();

    try {
      // Monitor API calls
      const apiRequests: any[] = [];
      page.on('response', (response) => {
        if (response.url().includes('/api/')) {
          apiRequests.push({
            url: response.url(),
            status: response.status(),
            timing: Date.now() - startTime
          });
        }
      });

      await page.goto('https://example.com/api-demo');
      
      // Test API endpoints
      performanceCollector.startTiming('api-calls');
      
      await page.click('[data-testid="load-users"]');
      await expect(page.locator('[data-testid="users-list"]')).toBeVisible();
      
      await page.click('[data-testid="load-products"]');
      await expect(page.locator('[data-testid="products-list"]')).toBeVisible();
      
      performanceCollector.endTiming('api-calls');

      // Record API performance metrics
      performanceCollector.recordMetric('apiRequests', {
        totalRequests: apiRequests.length,
        averageResponseTime: apiRequests.reduce((sum, req) => sum + req.timing, 0) / apiRequests.length,
        failedRequests: apiRequests.filter(req => req.status >= 400).length,
        requests: apiRequests
      });

      await visualCollector.captureScreenshot(page, 'api-results-loaded');

      const duration = Date.now() - startTime;
      reporter.recordTestResult(testName, {
        status: 'passed',
        duration,
        customData: {
          apiRequestsCount: apiRequests.length,
          averageApiResponseTime: apiRequests.reduce((sum, req) => sum + req.timing, 0) / apiRequests.length
        }
      });

      reporter.addPerformanceData(testName, performanceCollector.generateSummary());

    } catch (error) {
      const duration = Date.now() - startTime;
      reporter.recordTestResult(testName, {
        status: 'failed',
        duration,
        error: error.message
      });
      throw error;
    }
  });

  test.afterEach(async () => {
    // Generate insights after each test
    const insights = new TestInsightsGenerator(reporter, performanceCollector);
    const testInsights = insights.generateInsights();
    
    console.log('Test Insights:', JSON.stringify(testInsights, null, 2));
  });

  test.afterAll(async () => {
    // Generate final comprehensive report
    const reportPath = './test-results/detailed-report.html';
    reporter.exportToHTML(reportPath);
    
    const jsonReportPath = './test-results/detailed-report.json';
    reporter.exportToJSON(jsonReportPath);
    
    console.log(`📊 Detailed reports generated:`);
    console.log(`HTML Report: ${reportPath}`);
    console.log(`JSON Report: ${jsonReportPath}`);
  });
});

// Export classes for use in other test files
export { PerformanceMetricsCollector, VisualEvidenceCollector, CustomTestReporter, TestInsightsGenerator };