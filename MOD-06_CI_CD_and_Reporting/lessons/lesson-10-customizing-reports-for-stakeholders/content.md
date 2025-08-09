# Customizing Reports for Stakeholders

## Learning Objectives

By the end of this lesson, you will be able to:

- Design reports that meet the specific needs of different stakeholder groups
- Create executive dashboards with high-level KPIs and trend analysis
- Build developer-focused reports with detailed failure information and debugging context
- Implement automated report distribution and notification systems
- Customize report formats for different communication channels
- Apply data visualization best practices for test reporting
- Create interactive reports with drill-down capabilities
- Implement role-based access control for sensitive test information

## Introduction

Effective test reporting goes beyond simply displaying pass/fail results. Different stakeholders within an organization require different levels of detail, focus areas, and presentation formats. A successful QA automation engineer must understand how to transform raw test data into actionable insights tailored for each audience.

This lesson explores how to create stakeholder-specific reporting solutions that drive informed decision-making across your organization.

## 1. Stakeholder Analysis and Requirements

### 1.1 Understanding Your Audience

Different stakeholders have distinct needs when it comes to test reporting:

#### Executive Leadership
- **Primary Concerns**: Business impact, risk assessment, ROI metrics
- **Key Metrics**: Test coverage percentage, critical bug trends, release readiness
- **Format Preferences**: High-level dashboards, trend charts, executive summaries
- **Frequency**: Weekly/monthly reports, on-demand for critical issues

#### Product Managers
- **Primary Concerns**: Feature quality, release timeline impact, user experience
- **Key Metrics**: Feature-specific test results, user story coverage, regression status
- **Format Preferences**: Feature-focused reports, release readiness indicators
- **Frequency**: Per sprint/release, real-time for critical features

#### Development Teams
- **Primary Concerns**: Bug details, debugging information, code quality
- **Key Metrics**: Failure details, stack traces, affected components, flakiness rates
- **Format Preferences**: Detailed technical reports, interactive debugging tools
- **Frequency**: Real-time notifications, daily summaries

#### QA Teams
- **Primary Concerns**: Test coverage, execution efficiency, automation health
- **Key Metrics**: Test execution times, automation coverage, maintenance needs
- **Format Preferences**: Comprehensive dashboards, detailed execution logs
- **Frequency**: Daily reports, real-time monitoring

### 1.2 Requirements Gathering Framework

```typescript
// stakeholder-requirements.ts
export interface StakeholderRequirements {
  stakeholderType: 'executive' | 'product' | 'development' | 'qa';
  reportingFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'ondemand';
  keyMetrics: string[];
  presentationFormat: 'dashboard' | 'email' | 'slack' | 'pdf' | 'json';
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential';
  interactivityNeeds: 'static' | 'interactive' | 'realtime';
}

export const stakeholderProfiles: Record<string, StakeholderRequirements> = {
  ceo: {
    stakeholderType: 'executive',
    reportingFrequency: 'weekly',
    keyMetrics: ['overall_health', 'critical_issues', 'release_readiness'],
    presentationFormat: 'dashboard',
    accessLevel: 'confidential',
    interactivityNeeds: 'interactive'
  },
  productManager: {
    stakeholderType: 'product',
    reportingFrequency: 'daily',
    keyMetrics: ['feature_coverage', 'user_story_status', 'regression_impact'],
    presentationFormat: 'email',
    accessLevel: 'internal',
    interactivityNeeds: 'interactive'
  },
  developer: {
    stakeholderType: 'development',
    reportingFrequency: 'realtime',
    keyMetrics: ['failure_details', 'stack_traces', 'component_health'],
    presentationFormat: 'slack',
    accessLevel: 'internal',
    interactivityNeeds: 'realtime'
  }
};
```

## 2. Executive Dashboard Creation

### 2.1 High-Level KPI Design

Executive dashboards should focus on business-critical metrics that drive strategic decisions:

```typescript
// executive-dashboard-reporter.ts
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { createWriteStream } from 'fs';
import { join } from 'path';

export interface ExecutiveMetrics {
  overallHealth: {
    score: number;
    trend: 'improving' | 'stable' | 'declining';
    criticalIssues: number;
  };
  releaseReadiness: {
    percentage: number;
    blockers: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
  qualityTrends: {
    passRate: number[];
    coverage: number[];
    executionTime: number[];
    dates: string[];
  };
  businessImpact: {
    featuresAtRisk: string[];
    customerImpact: 'none' | 'low' | 'medium' | 'high';
    costOfDelay: number;
  };
}

class ExecutiveDashboardReporter implements Reporter {
  private metrics: ExecutiveMetrics;
  private historicalData: ExecutiveMetrics[] = [];

  constructor() {
    this.metrics = this.initializeMetrics();
    this.loadHistoricalData();
  }

  private initializeMetrics(): ExecutiveMetrics {
    return {
      overallHealth: { score: 0, trend: 'stable', criticalIssues: 0 },
      releaseReadiness: { percentage: 0, blockers: [], riskLevel: 'low' },
      qualityTrends: { passRate: [], coverage: [], executionTime: [], dates: [] },
      businessImpact: { featuresAtRisk: [], customerImpact: 'none', costOfDelay: 0 }
    };
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.updateRealTimeMetrics(test, result);
  }

  async onEnd(result: FullResult): Promise<void> {
    await this.calculateExecutiveMetrics(result);
    await this.generateExecutiveDashboard();
    await this.sendExecutiveNotification();
  }

  private async calculateExecutiveMetrics(result: FullResult): Promise<void> {
    const totalTests = result.allTests.length;
    const passedTests = result.allTests.filter(test => 
      test.results[0]?.status === 'passed'
    ).length;
    
    const criticalFailures = result.allTests.filter(test => 
      test.results[0]?.status === 'failed' && 
      this.isCriticalTest(test)
    ).length;

    // Calculate overall health score (0-100)
    this.metrics.overallHealth.score = Math.round(
      (passedTests / totalTests) * 100 * (1 - (criticalFailures / totalTests))
    );

    // Determine trend based on historical data
    this.metrics.overallHealth.trend = this.calculateTrend();
    this.metrics.overallHealth.criticalIssues = criticalFailures;

    // Calculate release readiness
    this.metrics.releaseReadiness = this.calculateReleaseReadiness(result);

    // Update quality trends
    this.updateQualityTrends(passedTests / totalTests);

    // Assess business impact
    this.metrics.businessImpact = this.assessBusinessImpact(result);
  }

  private calculateReleaseReadiness(result: FullResult): ExecutiveMetrics['releaseReadiness'] {
    const blockers: string[] = [];
    const criticalTests = result.allTests.filter(test => this.isCriticalTest(test));
    const failedCritical = criticalTests.filter(test => 
      test.results[0]?.status === 'failed'
    );

    failedCritical.forEach(test => {
      blockers.push(`Critical test failed: ${test.title}`);
    });

    const readinessPercentage = Math.round(
      ((criticalTests.length - failedCritical.length) / criticalTests.length) * 100
    );

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (readinessPercentage < 70) riskLevel = 'high';
    else if (readinessPercentage < 90) riskLevel = 'medium';

    return {
      percentage: readinessPercentage,
      blockers,
      riskLevel
    };
  }

  private async generateExecutiveDashboard(): Promise<void> {
    const dashboardHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Executive Quality Dashboard</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f7fa; }
            .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
            .metric-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .metric-value { font-size: 2.5em; font-weight: bold; margin: 10px 0; }
            .health-score { color: ${this.getHealthColor()}; }
            .trend-${this.metrics.overallHealth.trend} { color: ${this.getTrendColor()}; }
            .risk-${this.metrics.releaseReadiness.riskLevel} { color: ${this.getRiskColor()}; }
            .chart-container { height: 300px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Quality Executive Dashboard</h1>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>Overall Health Score</h3>
                <div class="metric-value health-score">${this.metrics.overallHealth.score}%</div>
                <p class="trend-${this.metrics.overallHealth.trend}">
                    Trend: ${this.metrics.overallHealth.trend.toUpperCase()}
                </p>
                <p>Critical Issues: ${this.metrics.overallHealth.criticalIssues}</p>
            </div>
            
            <div class="metric-card">
                <h3>Release Readiness</h3>
                <div class="metric-value risk-${this.metrics.releaseReadiness.riskLevel}">
                    ${this.metrics.releaseReadiness.percentage}%
                </div>
                <p>Risk Level: ${this.metrics.releaseReadiness.riskLevel.toUpperCase()}</p>
                <p>Blockers: ${this.metrics.releaseReadiness.blockers.length}</p>
            </div>
            
            <div class="metric-card">
                <h3>Business Impact</h3>
                <div class="metric-value">${this.metrics.businessImpact.customerImpact.toUpperCase()}</div>
                <p>Features at Risk: ${this.metrics.businessImpact.featuresAtRisk.length}</p>
                <p>Cost of Delay: $${this.metrics.businessImpact.costOfDelay.toLocaleString()}</p>
            </div>
        </div>
        
        <div class="metric-card">
            <h3>Quality Trends (30 Days)</h3>
            <div class="chart-container">
                <canvas id="trendsChart"></canvas>
            </div>
        </div>
        
        <script>
            const ctx = document.getElementById('trendsChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ${JSON.stringify(this.metrics.qualityTrends.dates)},
                    datasets: [{
                        label: 'Pass Rate %',
                        data: ${JSON.stringify(this.metrics.qualityTrends.passRate)},
                        borderColor: '#27ae60',
                        fill: false
                    }, {
                        label: 'Coverage %',
                        data: ${JSON.stringify(this.metrics.qualityTrends.coverage)},
                        borderColor: '#3498db',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 100 }
                    }
                }
            });
        </script>
    </body>
    </html>`;

    const dashboardPath = join(process.cwd(), 'test-results', 'executive-dashboard.html');
    const stream = createWriteStream(dashboardPath);
    stream.write(dashboardHtml);
    stream.end();
  }

  private getHealthColor(): string {
    if (this.metrics.overallHealth.score >= 90) return '#27ae60';
    if (this.metrics.overallHealth.score >= 70) return '#f39c12';
    return '#e74c3c';
  }

  private getTrendColor(): string {
    switch (this.metrics.overallHealth.trend) {
      case 'improving': return '#27ae60';
      case 'declining': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  private getRiskColor(): string {
    switch (this.metrics.releaseReadiness.riskLevel) {
      case 'low': return '#27ae60';
      case 'medium': return '#f39c12';
      case 'high': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  private isCriticalTest(test: TestCase): boolean {
    return test.title.includes('@critical') || 
           test.title.includes('@smoke') ||
           test.location.file.includes('critical');
  }

  private calculateTrend(): 'improving' | 'stable' | 'declining' {
    if (this.historicalData.length < 2) return 'stable';
    
    const current = this.metrics.overallHealth.score;
    const previous = this.historicalData[this.historicalData.length - 1].overallHealth.score;
    const difference = current - previous;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  private updateQualityTrends(passRate: number): void {
    this.metrics.qualityTrends.passRate.push(Math.round(passRate * 100));
    this.metrics.qualityTrends.dates.push(new Date().toLocaleDateString());
    
    // Keep only last 30 data points
    if (this.metrics.qualityTrends.passRate.length > 30) {
      this.metrics.qualityTrends.passRate.shift();
      this.metrics.qualityTrends.dates.shift();
    }
  }

  private assessBusinessImpact(result: FullResult): ExecutiveMetrics['businessImpact'] {
    const featuresAtRisk: string[] = [];
    let customerImpact: 'none' | 'low' | 'medium' | 'high' = 'none';
    let costOfDelay = 0;

    // Extract features from failed tests
    result.allTests.forEach(test => {
      if (test.results[0]?.status === 'failed') {
        const feature = this.extractFeatureFromTest(test);
        if (feature && !featuresAtRisk.includes(feature)) {
          featuresAtRisk.push(feature);
        }
      }
    });

    // Calculate customer impact based on critical features affected
    const criticalFeaturesAffected = featuresAtRisk.filter(feature => 
      this.isCriticalFeature(feature)
    ).length;

    if (criticalFeaturesAffected > 3) customerImpact = 'high';
    else if (criticalFeaturesAffected > 1) customerImpact = 'medium';
    else if (criticalFeaturesAffected > 0) customerImpact = 'low';

    // Estimate cost of delay (simplified calculation)
    costOfDelay = criticalFeaturesAffected * 50000; // $50k per critical feature delay

    return { featuresAtRisk, customerImpact, costOfDelay };
  }

  private extractFeatureFromTest(test: TestCase): string | null {
    const titleParts = test.title.split(' ');
    for (const part of titleParts) {
      if (part.startsWith('@feature:')) {
        return part.replace('@feature:', '');
      }
    }
    return null;
  }

  private isCriticalFeature(feature: string): boolean {
    const criticalFeatures = ['login', 'payment', 'checkout', 'security', 'data-protection'];
    return criticalFeatures.some(critical => feature.toLowerCase().includes(critical));
  }

  private async sendExecutiveNotification(): Promise<void> {
    // Implementation for sending executive notifications via email/Slack
    console.log('Executive dashboard generated and notifications sent');
  }

  private loadHistoricalData(): void {
    // Load historical metrics from storage
    // This would typically read from a database or file system
  }

  private updateRealTimeMetrics(test: TestCase, result: TestResult): void {
    // Update real-time metrics as tests complete
  }
}

export default ExecutiveDashboardReporter;
```

## 3. Developer-Focused Reporting

### 3.1 Detailed Failure Information

Developers need comprehensive debugging information to quickly identify and fix issues:

```typescript
// developer-focused-reporter.ts
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface DeveloperReport {
  summary: {
    totalTests: number;
    failed: number;
    flaky: number;
    newFailures: number;
    fixedTests: number;
  };
  failures: DetailedFailure[];
  flakyTests: FlakyTestInfo[];
  performance: PerformanceMetrics;
  codeHealth: CodeHealthMetrics;
}

export interface DetailedFailure {
  testName: string;
  file: string;
  line: number;
  error: {
    message: string;
    stack: string;
    type: string;
  };
  screenshot?: string;
  video?: string;
  trace?: string;
  previousRuns: TestHistoryEntry[];
  suggestedFixes: string[];
  affectedComponents: string[];
  relatedCommits: CommitInfo[];
}

export interface FlakyTestInfo {
  testName: string;
  flakinessRate: number;
  lastFailures: Date[];
  commonFailureReasons: string[];
  stabilityTrend: 'improving' | 'stable' | 'worsening';
}

export interface PerformanceMetrics {
  slowestTests: Array<{ name: string; duration: number; trend: string }>;
  averageExecutionTime: number;
  timeoutTests: string[];
  resourceUsage: {
    memory: number;
    cpu: number;
  };
}

export interface CodeHealthMetrics {
  testCoverage: number;
  maintainabilityIndex: number;
  technicalDebt: string[];
  duplicatedTests: string[];
}

class DeveloperFocusedReporter implements Reporter {
  private report: DeveloperReport;
  private testHistory: Map<string, TestHistoryEntry[]> = new Map();

  constructor() {
    this.report = this.initializeReport();
    this.loadTestHistory();
  }

  private initializeReport(): DeveloperReport {
    return {
      summary: { totalTests: 0, failed: 0, flaky: 0, newFailures: 0, fixedTests: 0 },
      failures: [],
      flakyTests: [],
      performance: {
        slowestTests: [],
        averageExecutionTime: 0,
        timeoutTests: [],
        resourceUsage: { memory: 0, cpu: 0 }
      },
      codeHealth: {
        testCoverage: 0,
        maintainabilityIndex: 0,
        technicalDebt: [],
        duplicatedTests: []
      }
    };
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.updateTestHistory(test, result);
    
    if (result.status === 'failed') {
      this.processFailure(test, result);
    }
    
    this.updatePerformanceMetrics(test, result);
  }

  async onEnd(result: FullResult): Promise<void> {
    await this.analyzeFlakyTests();
    await this.calculateCodeHealth();
    await this.generateDeveloperReport();
    await this.sendDeveloperNotifications();
  }

  private async processFailure(test: TestCase, result: TestResult): Promise<void> {
    const failure: DetailedFailure = {
      testName: test.title,
      file: test.location.file,
      line: test.location.line,
      error: {
        message: result.error?.message || 'Unknown error',
        stack: result.error?.stack || '',
        type: this.categorizeError(result.error?.message || '')
      },
      screenshot: result.attachments.find(a => a.name === 'screenshot')?.path,
      video: result.attachments.find(a => a.name === 'video')?.path,
      trace: result.attachments.find(a => a.name === 'trace')?.path,
      previousRuns: this.testHistory.get(test.title) || [],
      suggestedFixes: await this.generateSuggestedFixes(test, result),
      affectedComponents: this.identifyAffectedComponents(test),
      relatedCommits: await this.findRelatedCommits(test)
    };

    this.report.failures.push(failure);
  }

  private categorizeError(errorMessage: string): string {
    if (errorMessage.includes('timeout')) return 'timeout';
    if (errorMessage.includes('network')) return 'network';
    if (errorMessage.includes('element not found')) return 'locator';
    if (errorMessage.includes('assertion')) return 'assertion';
    if (errorMessage.includes('page crash')) return 'browser';
    return 'unknown';
  }

  private async generateSuggestedFixes(test: TestCase, result: TestResult): Promise<string[]> {
    const suggestions: string[] = [];
    const errorMessage = result.error?.message || '';

    if (errorMessage.includes('timeout')) {
      suggestions.push('Consider increasing timeout or adding wait conditions');
      suggestions.push('Check if element loading is dependent on network requests');
    }

    if (errorMessage.includes('element not found')) {
      suggestions.push('Verify the locator strategy is robust');
      suggestions.push('Add explicit waits for element visibility');
      suggestions.push('Check if the element is within a frame or shadow DOM');
    }

    if (errorMessage.includes('network')) {
      suggestions.push('Implement network retry logic');
      suggestions.push('Mock network responses for stability');
      suggestions.push('Verify test environment connectivity');
    }

    // AI-powered suggestions (placeholder)
    const aiSuggestions = await this.getAISuggestedFixes(test, result);
    suggestions.push(...aiSuggestions);

    return suggestions;
  }

  private identifyAffectedComponents(test: TestCase): string[] {
    const components: string[] = [];
    
    // Extract components from test file path
    const pathParts = test.location.file.split('/');
    components.push(...pathParts.filter(part => 
      part.includes('component') || part.includes('page') || part.includes('feature')
    ));

    // Extract components from test title
    const titleWords = test.title.toLowerCase().split(' ');
    const potentialComponents = titleWords.filter(word => 
      word.length > 3 && !['test', 'should', 'when', 'then'].includes(word)
    );
    components.push(...potentialComponents);

    return [...new Set(components)];
  }

  private async findRelatedCommits(test: TestCase): Promise<CommitInfo[]> {
    // Implementation to find recent commits that might have affected this test
    // This would typically use git commands or API calls
    return [];
  }

  private async getAISuggestedFixes(test: TestCase, result: TestResult): Promise<string[]> {
    // Placeholder for AI-powered fix suggestions
    // This could integrate with GitHub Copilot, OpenAI API, or custom ML models
    return ['Consider reviewing recent code changes in related components'];
  }

  private async analyzeFlakyTests(): Promise<void> {
    for (const [testName, history] of this.testHistory.entries()) {
      if (history.length < 5) continue; // Need sufficient data

      const failures = history.filter(entry => entry.status === 'failed').length;
      const flakinessRate = failures / history.length;

      if (flakinessRate > 0.1 && flakinessRate < 0.9) { // 10-90% failure rate indicates flakiness
        const flakyTest: FlakyTestInfo = {
          testName,
          flakinessRate,
          lastFailures: history
            .filter(entry => entry.status === 'failed')
            .map(entry => entry.timestamp)
            .slice(-5),
          commonFailureReasons: this.analyzeFailureReasons(history),
          stabilityTrend: this.calculateStabilityTrend(history)
        };

        this.report.flakyTests.push(flakyTest);
      }
    }
  }

  private analyzeFailureReasons(history: TestHistoryEntry[]): string[] {
    const reasons: { [key: string]: number } = {};
    
    history.forEach(entry => {
      if (entry.status === 'failed' && entry.errorType) {
        reasons[entry.errorType] = (reasons[entry.errorType] || 0) + 1;
      }
    });

    return Object.entries(reasons)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([reason]) => reason);
  }

  private calculateStabilityTrend(history: TestHistoryEntry[]): 'improving' | 'stable' | 'worsening' {
    if (history.length < 10) return 'stable';

    const recent = history.slice(-5);
    const older = history.slice(-10, -5);

    const recentFailureRate = recent.filter(e => e.status === 'failed').length / recent.length;
    const olderFailureRate = older.filter(e => e.status === 'failed').length / older.length;

    if (recentFailureRate < olderFailureRate - 0.2) return 'improving';
    if (recentFailureRate > olderFailureRate + 0.2) return 'worsening';
    return 'stable';
  }

  private async generateDeveloperReport(): Promise<void> {
    const reportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Developer Test Report</title>
        <style>
            body { font-family: 'JetBrains Mono', monospace; margin: 0; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
            .header { background: #252526; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .failure-card { background: #2f1b1b; border-left: 4px solid #f14c4c; padding: 15px; margin: 10px 0; border-radius: 4px; }
            .flaky-card { background: #2f2a1b; border-left: 4px solid #ffa500; padding: 15px; margin: 10px 0; border-radius: 4px; }
            .code-block { background: #1e1e1e; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px; }
            .suggestion { background: #1b2f1b; padding: 8px; margin: 5px 0; border-radius: 4px; }
            .metric { display: inline-block; margin: 10px; padding: 10px; background: #252526; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔧 Developer Test Report</h1>
            <p>Generated: ${new Date().toISOString()}</p>
            <div>
                <span class="metric">Total Tests: ${this.report.summary.totalTests}</span>
                <span class="metric">Failed: ${this.report.summary.failed}</span>
                <span class="metric">Flaky: ${this.report.summary.flaky}</span>
                <span class="metric">New Failures: ${this.report.summary.newFailures}</span>
            </div>
        </div>

        <h2>🚨 Test Failures</h2>
        ${this.report.failures.map(failure => `
            <div class="failure-card">
                <h3>${failure.testName}</h3>
                <p><strong>File:</strong> ${failure.file}:${failure.line}</p>
                <p><strong>Error Type:</strong> ${failure.error.type}</p>
                
                <h4>Error Details:</h4>
                <div class="code-block">${failure.error.message}</div>
                
                <h4>Stack Trace:</h4>
                <div class="code-block">${failure.error.stack}</div>
                
                <h4>💡 Suggested Fixes:</h4>
                ${failure.suggestedFixes.map(fix => `<div class="suggestion">${fix}</div>`).join('')}
                
                <h4>🔗 Attachments:</h4>
                <p>
                    ${failure.screenshot ? `<a href="${failure.screenshot}">Screenshot</a> | ` : ''}
                    ${failure.video ? `<a href="${failure.video}">Video</a> | ` : ''}
                    ${failure.trace ? `<a href="${failure.trace}">Trace</a>` : ''}
                </p>
            </div>
        `).join('')}

        <h2>🔄 Flaky Tests</h2>
        ${this.report.flakyTests.map(flaky => `
            <div class="flaky-card">
                <h3>${flaky.testName}</h3>
                <p><strong>Flakiness Rate:</strong> ${(flaky.flakinessRate * 100).toFixed(1)}%</p>
                <p><strong>Stability Trend:</strong> ${flaky.stabilityTrend}</p>
                <p><strong>Common Failure Reasons:</strong> ${flaky.commonFailureReasons.join(', ')}</p>
            </div>
        `).join('')}

        <h2>⚡ Performance Metrics</h2>
        <div class="metric">Average Execution Time: ${this.report.performance.averageExecutionTime}ms</div>
        <div class="metric">Timeout Tests: ${this.report.performance.timeoutTests.length}</div>
        
        <h3>Slowest Tests:</h3>
        ${this.report.performance.slowestTests.map(test => `
            <div class="metric">${test.name}: ${test.duration}ms (${test.trend})</div>
        `).join('')}
    </body>
    </html>`;

    const reportPath = join(process.cwd(), 'test-results', 'developer-report.html');
    await fs.writeFile(reportPath, reportHtml);
  }

  private updateTestHistory(test: TestCase, result: TestResult): void {
    const testName = test.title;
    if (!this.testHistory.has(testName)) {
      this.testHistory.set(testName, []);
    }

    const history = this.testHistory.get(testName)!;
    history.push({
      timestamp: new Date(),
      status: result.status,
      duration: result.duration,
      errorType: result.error ? this.categorizeError(result.error.message) : undefined
    });

    // Keep only last 50 entries per test
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
  }

  private updatePerformanceMetrics(test: TestCase, result: TestResult): void {
    if (result.duration > 30000) { // Tests over 30 seconds
      this.report.performance.slowestTests.push({
        name: test.title,
        duration: result.duration,
        trend: 'stable' // Would calculate based on history
      });
    }

    if (result.status === 'timedOut') {
      this.report.performance.timeoutTests.push(test.title);
    }
  }

  private async calculateCodeHealth(): Promise<void> {
    // Implementation for code health metrics
    // This would analyze test code quality, duplication, etc.
  }

  private async sendDeveloperNotifications(): Promise<void> {
    // Send notifications to developers about failures
    console.log('Developer notifications sent');
  }

  private loadTestHistory(): void {
    // Load test history from persistent storage
  }
}

interface TestHistoryEntry {
  timestamp: Date;
  status: string;
  duration: number;
  errorType?: string;
}

interface CommitInfo {
  hash: string;
  author: string;
  message: string;
  timestamp: Date;
}

export default DeveloperFocusedReporter;
```

## 4. Automated Distribution Systems

### 4.1 Multi-Channel Report Distribution

```typescript
// report-distribution-system.ts
import nodemailer from 'nodemailer';
import { WebClient } from '@slack/web-api';
import { promises as fs } from 'fs';
import puppeteer from 'puppeteer';

export interface DistributionConfig {
  channels: DistributionChannel[];
  schedules: DistributionSchedule[];
  templates: ReportTemplate[];
  recipients: RecipientGroup[];
}

export interface DistributionChannel {
  type: 'email' | 'slack' | 'teams' | 'webhook' | 'file';
  config: EmailConfig | SlackConfig | TeamsConfig | WebhookConfig | FileConfig;
  enabled: boolean;
}

export interface DistributionSchedule {
  name: string;
  channels: string[];
  recipients: string[];
  trigger: 'immediate' | 'daily' | 'weekly' | 'on-failure' | 'on-success';
  time?: string; // For scheduled distributions
  conditions?: DistributionCondition[];
}

export interface ReportTemplate {
  name: string;
  format: 'html' | 'pdf' | 'json' | 'slack-blocks' | 'teams-adaptive';
  content: string;
  variables: { [key: string]: any };
}

export interface RecipientGroup {
  name: string;
  stakeholderType: 'executive' | 'product' | 'development' | 'qa';
  recipients: Recipient[];
}

export interface Recipient {
  name: string;
  email?: string;
  slackId?: string;
  teamsId?: string;
  preferences: {
    frequency: 'immediate' | 'daily' | 'weekly';
    formats: string[];
    conditions: string[];
  };
}

class ReportDistributionSystem {
  private config: DistributionConfig;
  private emailTransporter: nodemailer.Transporter;
  private slackClient: WebClient;

  constructor(config: DistributionConfig) {
    this.config = config;
    this.initializeClients();
  }

  private initializeClients(): void {
    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Initialize Slack client
    this.slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async distributeReport(
    reportData: any,
    trigger: string,
    context: { testResults?: any; buildInfo?: any }
  ): Promise<void> {
    const applicableSchedules = this.config.schedules.filter(schedule =>
      schedule.trigger === trigger && this.evaluateConditions(schedule.conditions, context)
    );

    for (const schedule of applicableSchedules) {
      await this.executeDistribution(schedule, reportData, context);
    }
  }

  private async executeDistribution(
    schedule: DistributionSchedule,
    reportData: any,
    context: any
  ): Promise<void> {
    const recipients = this.resolveRecipients(schedule.recipients);
    const channels = this.resolveChannels(schedule.channels);

    for (const channel of channels) {
      if (!channel.enabled) continue;

      try {
        switch (channel.type) {
          case 'email':
            await this.distributeViaEmail(channel.config as EmailConfig, recipients, reportData);
            break;
          case 'slack':
            await this.distributeViaSlack(channel.config as SlackConfig, recipients, reportData);
            break;
          case 'teams':
            await this.distributeViaTeams(channel.config as TeamsConfig, recipients, reportData);
            break;
          case 'webhook':
            await this.distributeViaWebhook(channel.config as WebhookConfig, reportData);
            break;
          case 'file':
            await this.distributeViaFile(channel.config as FileConfig, reportData);
            break;
        }
      } catch (error) {
        console.error(`Failed to distribute via ${channel.type}:`, error);
      }
    }
  }

  private async distributeViaEmail(
    config: EmailConfig,
    recipients: Recipient[],
    reportData: any
  ): Promise<void> {
    const template = this.config.templates.find(t => t.name === config.template);
    if (!template) return;

    const renderedContent = this.renderTemplate(template, reportData);
    const pdf = await this.generatePDFAttachment(renderedContent);

    for (const recipient of recipients) {
      if (!recipient.email) continue;

      const mailOptions = {
        from: config.from,
        to: recipient.email,
        subject: this.renderSubject(config.subject, reportData),
        html: renderedContent,
        attachments: [
          {
            filename: 'test-report.pdf',
            content: pdf
          }
        ]
      };

      await this.emailTransporter.sendMail(mailOptions);
    }
  }

  private async distributeViaSlack(
    config: SlackConfig,
    recipients: Recipient[],
    reportData: any
  ): Promise<void> {
    const template = this.config.templates.find(t => t.name === config.template);
    if (!template) return;

    const blocks = this.renderSlackBlocks(template, reportData);

    // Send to channels
    if (config.channels) {
      for (const channel of config.channels) {
        await this.slackClient.chat.postMessage({
          channel: channel,
          blocks: blocks,
          text: 'Test Report'
        });
      }
    }

    // Send direct messages
    for (const recipient of recipients) {
      if (!recipient.slackId) continue;

      await this.slackClient.chat.postMessage({
        channel: recipient.slackId,
        blocks: blocks,
        text: 'Test Report'
      });
    }
  }

  private async distributeViaTeams(
    config: TeamsConfig,
    recipients: Recipient[],
    reportData: any
  ): Promise<void> {
    // Implementation for Microsoft Teams distribution
    console.log('Teams distribution not implemented yet');
  }

  private async distributeViaWebhook(
    config: WebhookConfig,
    reportData: any
  ): Promise<void> {
    const payload = {
      timestamp: new Date().toISOString(),
      reportData,
      metadata: {
        version: '1.0',
        source: 'playwright-test-suite'
      }
    };

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }
  }

  private async distributeViaFile(
    config: FileConfig,
    reportData: any
  ): Promise<void> {
    const template = this.config.templates.find(t => t.name === config.template);
    if (!template) return;

    const content = this.renderTemplate(template, reportData);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${config.filename}-${timestamp}.${template.format}`;
    
    await fs.writeFile(config.path + '/' + filename, content);
  }

  private renderTemplate(template: ReportTemplate, data: any): string {
    let content = template.content;
    
    // Simple template variable replacement
    Object.keys(template.variables).forEach(key => {
      const value = this.getNestedValue(data, template.variables[key]) || '';
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return content;
  }

  private renderSlackBlocks(template: ReportTemplate, data: any): any[] {
    // Convert template to Slack blocks format
    return [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Test Report'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Total Tests:* ${data.summary?.total || 0}`
          },
          {
            type: 'mrkdwn',
            text: `*Failed:* ${data.summary?.failed || 0}`
          },
          {
            type: 'mrkdwn',
            text: `*Pass Rate:* ${data.summary?.passRate || 0}%`
          },
          {
            type: 'mrkdwn',
            text: `*Duration:* ${data.summary?.duration || 0}ms`
          }
        ]
      }
    ];
  }

  private async generatePDFAttachment(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setContent(htmlContent);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });
    
    await browser.close();
    return pdf;
  }

  private evaluateConditions(conditions: DistributionCondition[] | undefined, context: any): boolean {
    if (!conditions) return true;
    
    return conditions.every(condition => {
      const value = this.getNestedValue(context, condition.field);
      
      switch (condition.operator) {
        case 'equals': return value === condition.value;
        case 'not_equals': return value !== condition.value;
        case 'greater_than': return value > condition.value;
        case 'less_than': return value < condition.value;
        case 'contains': return String(value).includes(condition.value);
        default: return true;
      }
    });
  }

  private resolveRecipients(recipientNames: string[]): Recipient[] {
    const recipients: Recipient[] = [];
    
    for (const name of recipientNames) {
      const group = this.config.recipients.find(g => g.name === name);
      if (group) {
        recipients.push(...group.recipients);
      }
    }
    
    return recipients;
  }

  private resolveChannels(channelNames: string[]): DistributionChannel[] {
    return this.config.channels.filter(channel => 
      channelNames.includes(channel.type) || channelNames.includes((channel.config as any).name)
    );
  }

  private renderSubject(template: string, data: any): string {
    return template.replace(/{{(\w+)}}/g, (match, key) => {
      return this.getNestedValue(data, key) || match;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Configuration interfaces
interface EmailConfig {
  template: string;
  from: string;
  subject: string;
}

interface SlackConfig {
  template: string;
  channels?: string[];
}

interface TeamsConfig {
  template: string;
  webhookUrl: string;
}

interface WebhookConfig {
  url: string;
  headers?: { [key: string]: string };
}

interface FileConfig {
  template: string;
  path: string;
  filename: string;
}

interface DistributionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export default ReportDistributionSystem;
```

## 5. Interactive Report Implementation

### 5.1 Real-Time Dashboard with WebSocket Integration

```typescript
// interactive-dashboard-server.ts
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface DashboardMetrics {
  realTimeStats: {
    activeTests: number;
    completedTests: number;
    failedTests: number;
    currentExecutionTime: number;
  };
  historicalData: {
    passRates: number[];
    executionTimes: number[];
    timestamps: string[];
  };
  testResults: TestResult[];
  systemHealth: {
    cpuUsage: number;
    memoryUsage: number;
    diskSpace: number;
  };
}

export interface TestResult {
  id: string;
  name: string;
  status: 'running' | 'passed' | 'failed' | 'skipped';
  duration: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
  retries: number;
}

class InteractiveDashboardServer {
  private app: express.Application;
  private server: any;
  private io: SocketIOServer;
  private metrics: DashboardMetrics;
  private connectedClients: Set<string> = new Set();

  constructor(private port: number = 3000) {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.metrics = this.initializeMetrics();
    this.setupRoutes();
    this.setupSocketHandlers();
    this.startMetricsCollection();
  }

  private initializeMetrics(): DashboardMetrics {
    return {
      realTimeStats: {
        activeTests: 0,
        completedTests: 0,
        failedTests: 0,
        currentExecutionTime: 0
      },
      historicalData: {
        passRates: [],
        executionTimes: [],
        timestamps: []
      },
      testResults: [],
      systemHealth: {
        cpuUsage: 0,
        memoryUsage: 0,
        diskSpace: 0
      }
    };
  }

  private setupRoutes(): void {
    this.app.use(express.static(join(__dirname, 'public')));
    this.app.use(express.json());

    // Serve the main dashboard
    this.app.get('/', (req, res) => {
      res.sendFile(join(__dirname, 'dashboard.html'));
    });

    // API endpoints
    this.app.get('/api/metrics', (req, res) => {
      res.json(this.metrics);
    });

    this.app.get('/api/test-results', (req, res) => {
      const { status, limit = 50 } = req.query;
      let results = this.metrics.testResults;
      
      if (status) {
        results = results.filter(test => test.status === status);
      }
      
      res.json(results.slice(0, Number(limit)));
    });

    this.app.post('/api/test-update', (req, res) => {
      const testUpdate = req.body;
      this.updateTestResult(testUpdate);
      res.json({ success: true });
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        uptime: process.uptime(),
        connectedClients: this.connectedClients.size
      });
    });
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.connectedClients.add(socket.id);

      // Send initial data
      socket.emit('metrics-update', this.metrics);

      // Handle client requests
      socket.on('request-test-details', (testId: string) => {
        const test = this.metrics.testResults.find(t => t.id === testId);
        if (test) {
          socket.emit('test-details', test);
        }
      });

      socket.on('request-historical-data', (range: string) => {
        const historicalData = this.getHistoricalData(range);
        socket.emit('historical-data', historicalData);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });
    });
  }

  public updateTestResult(testUpdate: Partial<TestResult>): void {
    const existingIndex = this.metrics.testResults.findIndex(t => t.id === testUpdate.id);
    
    if (existingIndex >= 0) {
      // Update existing test
      this.metrics.testResults[existingIndex] = {
        ...this.metrics.testResults[existingIndex],
        ...testUpdate
      };
    } else if (testUpdate.id && testUpdate.name) {
      // Add new test
      this.metrics.testResults.push({
        id: testUpdate.id,
        name: testUpdate.name,
        status: testUpdate.status || 'running',
        duration: testUpdate.duration || 0,
        startTime: testUpdate.startTime || new Date(),
        endTime: testUpdate.endTime,
        error: testUpdate.error,
        retries: testUpdate.retries || 0
      });
    }

    this.updateRealTimeStats();
    this.broadcastUpdate();
  }

  private updateRealTimeStats(): void {
    const activeTests = this.metrics.testResults.filter(t => t.status === 'running').length;
    const completedTests = this.metrics.testResults.filter(t => 
      ['passed', 'failed', 'skipped'].includes(t.status)
    ).length;
    const failedTests = this.metrics.testResults.filter(t => t.status === 'failed').length;
    
    const currentTime = Date.now();
    const currentExecutionTime = this.metrics.testResults
      .filter(t => t.status === 'running')
      .reduce((total, test) => total + (currentTime - test.startTime.getTime()), 0);

    this.metrics.realTimeStats = {
      activeTests,
      completedTests,
      failedTests,
      currentExecutionTime
    };
  }

  private broadcastUpdate(): void {
    this.io.emit('metrics-update', this.metrics);
  }

  private startMetricsCollection(): void {
    // Update system health metrics every 5 seconds
    setInterval(() => {
      this.updateSystemHealth();
    }, 5000);

    // Update historical data every minute
    setInterval(() => {
      this.updateHistoricalData();
    }, 60000);
  }

  private updateSystemHealth(): void {
    const used = process.memoryUsage();
    this.metrics.systemHealth = {
      cpuUsage: Math.random() * 100, // Placeholder - would use actual CPU monitoring
      memoryUsage: (used.heapUsed / used.heapTotal) * 100,
      diskSpace: Math.random() * 100 // Placeholder - would use actual disk monitoring
    };

    this.io.emit('system-health-update', this.metrics.systemHealth);
  }

  private updateHistoricalData(): void {
    const completedTests = this.metrics.testResults.filter(t => 
      ['passed', 'failed', 'skipped'].includes(t.status)
    );
    
    if (completedTests.length > 0) {
      const passRate = (completedTests.filter(t => t.status === 'passed').length / completedTests.length) * 100;
      const avgExecutionTime = completedTests.reduce((sum, test) => sum + test.duration, 0) / completedTests.length;
      
      this.metrics.historicalData.passRates.push(passRate);
      this.metrics.historicalData.executionTimes.push(avgExecutionTime);
      this.metrics.historicalData.timestamps.push(new Date().toISOString());
      
      // Keep only last 100 data points
      if (this.metrics.historicalData.passRates.length > 100) {
        this.metrics.historicalData.passRates.shift();
        this.metrics.historicalData.executionTimes.shift();
        this.metrics.historicalData.timestamps.shift();
      }
    }
  }

  private getHistoricalData(range: string): any {
    const now = new Date();
    let cutoffDate: Date;
    
    switch (range) {
      case '1h': cutoffDate = new Date(now.getTime() - 60 * 60 * 1000); break;
      case '24h': cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); break;
      case '7d': cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      default: cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    const cutoffTime = cutoffDate.toISOString();
    const relevantIndices = this.metrics.historicalData.timestamps
      .map((timestamp, index) => ({ timestamp, index }))
      .filter(({ timestamp }) => timestamp >= cutoffTime)
      .map(({ index }) => index);
    
    return {
      passRates: relevantIndices.map(i => this.metrics.historicalData.passRates[i]),
      executionTimes: relevantIndices.map(i => this.metrics.historicalData.executionTimes[i]),
      timestamps: relevantIndices.map(i => this.metrics.historicalData.timestamps[i])
    };
  }

  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Interactive dashboard server running on port ${this.port}`);
    });
  }

  public stop(): void {
    this.server.close();
  }

  // Integration with Playwright reporter
  public static createPlaywrightIntegration(): any {
    return class PlaywrightDashboardReporter {
      private dashboardServer: InteractiveDashboardServer;

      constructor() {
        this.dashboardServer = new InteractiveDashboardServer();
        this.dashboardServer.start();
      }

      onTestBegin(test: any): void {
        this.dashboardServer.updateTestResult({
          id: test.id,
          name: test.title,
          status: 'running',
          startTime: new Date(),
          duration: 0,
          retries: 0
        });
      }

      onTestEnd(test: any, result: any): void {
        this.dashboardServer.updateTestResult({
          id: test.id,
          status: result.status,
          duration: result.duration,
          endTime: new Date(),
          error: result.error?.message,
          retries: result.retry
        });
      }

      async onEnd(): Promise<void> {
        // Keep server running for continued monitoring
        console.log('Test execution completed. Dashboard remains active.');
      }
    };
  }
}

export default InteractiveDashboardServer;
```

## 6. Security and Access Control

### 6.1 Role-Based Access Control Implementation

```typescript
// security-access-control.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  lastLogin?: Date;
  active: boolean;
}

export interface UserRole {
  name: 'admin' | 'qa_manager' | 'qa_engineer' | 'developer' | 'product_manager' | 'executive' | 'viewer';
  level: number; // 1-10, higher = more permissions
  defaultPermissions: Permission[];
}

export interface Permission {
  resource: 'reports' | 'dashboards' | 'settings' | 'users' | 'raw_data' | 'system';
  actions: ('read' | 'write' | 'delete' | 'admin')[];
  conditions?: AccessCondition[];
}

export interface AccessCondition {
  field: string;
  operator: 'equals' | 'in' | 'startsWith';
  value: any;
}

export interface ReportAccessControl {
  reportId: string;
  ownerRole: string;
  accessRules: AccessRule[];
  sensitiveFields: string[];
  redactionRules: RedactionRule[];
}

export interface AccessRule {
  role: string;
  permissions: ('read' | 'write' | 'share' | 'export')[];
  conditions?: AccessCondition[];
  fieldRestrictions?: string[];
}

export interface RedactionRule {
  field: string;
  roles: string[];
  redactionType: 'hide' | 'mask' | 'aggregate';
  maskPattern?: string;
}

class SecurityAccessControl {
  private jwtSecret: string;
  private users: Map<string, User> = new Map();
  private roles: Map<string, UserRole> = new Map();
  private reportAccess: Map<string, ReportAccessControl> = new Map();

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.initializeDefaultRoles();
    this.initializeDefaultUsers();
  }

  private initializeDefaultRoles(): void {
    const roles: UserRole[] = [
      {
        name: 'admin',
        level: 10,
        defaultPermissions: [
          { resource: 'reports', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'dashboards', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'settings', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'users', actions: ['read', 'write', 'delete', 'admin'] },
          { resource: 'raw_data', actions: ['read', 'write', 'delete'] },
          { resource: 'system', actions: ['read', 'write', 'admin'] }
        ]
      },
      {
        name: 'qa_manager',
        level: 8,
        defaultPermissions: [
          { resource: 'reports', actions: ['read', 'write'] },
          { resource: 'dashboards', actions: ['read', 'write'] },
          { resource: 'settings', actions: ['read', 'write'] },
          { resource: 'raw_data', actions: ['read'] },
          { resource: 'system', actions: ['read'] }
        ]
      },
      {
        name: 'qa_engineer',
        level: 6,
        defaultPermissions: [
          { resource: 'reports', actions: ['read', 'write'] },
          { resource: 'dashboards', actions: ['read'] },
          { resource: 'raw_data', actions: ['read'] }
        ]
      },
      {
        name: 'developer',
        level: 5,
        defaultPermissions: [
          { 
            resource: 'reports', 
            actions: ['read'],
            conditions: [{ field: 'reportType', operator: 'in', value: ['technical', 'failure'] }]
          },
          { resource: 'dashboards', actions: ['read'] }
        ]
      },
      {
        name: 'product_manager',
        level: 5,
        defaultPermissions: [
          { 
            resource: 'reports', 
            actions: ['read'],
            conditions: [{ field: 'reportType', operator: 'in', value: ['summary', 'feature'] }]
          },
          { resource: 'dashboards', actions: ['read'] }
        ]
      },
      {
        name: 'executive',
        level: 7,
        defaultPermissions: [
          { 
            resource: 'reports', 
            actions: ['read'],
            conditions: [{ field: 'reportType', operator: 'in', value: ['executive', 'summary'] }]
          },
          { resource: 'dashboards', actions: ['read'] }
        ]
      },
      {
        name: 'viewer',
        level: 1,
        defaultPermissions: [
          { 
            resource: 'reports', 
            actions: ['read'],
            conditions: [{ field: 'confidentiality', operator: 'equals', value: 'public' }]
          }
        ]
      }
    ];

    roles.forEach(role => this.roles.set(role.name, role));
  }

  private initializeDefaultUsers(): void {
    // This would typically be loaded from a database
    const defaultUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@company.com',
        role: this.roles.get('admin')!,
        permissions: this.roles.get('admin')!.defaultPermissions,
        active: true
      }
    ];

    defaultUsers.forEach(user => this.users.set(user.id, user));
  }

  public generateToken(user: User): string {
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role.name,
      permissions: user.permissions
    };

    return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
  }

  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  public authenticateMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      try {
        const decoded = this.verifyToken(token);
        (req as any).user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    };
  }

  public authorizeMiddleware(resource: string, action: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const hasPermission = this.checkPermission(user, resource, action, req.body || req.query);
      
      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  }

  public checkPermission(user: any, resource: string, action: string, context?: any): boolean {
    const userPermissions = user.permissions || [];
    
    const relevantPermission = userPermissions.find((perm: Permission) => 
      perm.resource === resource && perm.actions.includes(action as any)
    );
    
    if (!relevantPermission) return false;

    // Check conditions if they exist
    if (relevantPermission.conditions && context) {
      return this.evaluateConditions(relevantPermission.conditions, context);
    }

    return true;
  }

  public filterReportData(reportData: any, user: any, reportId?: string): any {
    const accessControl = reportId ? this.reportAccess.get(reportId) : null;
    
    if (!accessControl) return reportData;

    const userRole = user.role;
    const accessRule = accessControl.accessRules.find(rule => rule.role === userRole);
    
    if (!accessRule) return null; // No access

    // Apply field restrictions
    let filteredData = { ...reportData };
    
    if (accessRule.fieldRestrictions) {
      filteredData = this.filterFields(filteredData, accessRule.fieldRestrictions);
    }

    // Apply redaction rules
    filteredData = this.applyRedactionRules(filteredData, accessControl.redactionRules, userRole);

    return filteredData;
  }

  private filterFields(data: any, allowedFields: string[]): any {
    if (Array.isArray(data)) {
      return data.map(item => this.filterFields(item, allowedFields));
    }
    
    if (typeof data === 'object' && data !== null) {
      const filtered: any = {};
      allowedFields.forEach(field => {
        if (data[field] !== undefined) {
          filtered[field] = data[field];
        }
      });
      return filtered;
    }
    
    return data;
  }

  private applyRedactionRules(data: any, rules: RedactionRule[], userRole: string): any {
    if (!rules || rules.length === 0) return data;
    
    let redactedData = JSON.parse(JSON.stringify(data)); // Deep clone
    
    rules.forEach(rule => {
      if (rule.roles.includes(userRole)) {
        redactedData = this.redactField(redactedData, rule);
      }
    });
    
    return redactedData;
  }

  private redactField(data: any, rule: RedactionRule): any {
    if (Array.isArray(data)) {
      return data.map(item => this.redactField(item, rule));
    }
    
    if (typeof data === 'object' && data !== null) {
      const redacted = { ...data };
      
      if (redacted[rule.field] !== undefined) {
        switch (rule.redactionType) {
          case 'hide':
            delete redacted[rule.field];
            break;
          case 'mask':
            redacted[rule.field] = this.maskValue(redacted[rule.field], rule.maskPattern);
            break;
          case 'aggregate':
            redacted[rule.field] = this.aggregateValue(redacted[rule.field]);
            break;
        }
      }
      
      return redacted;
    }
    
    return data;
  }

  private maskValue(value: any, pattern?: string): string {
    const strValue = String(value);
    const defaultPattern = '*'.repeat(strValue.length);
    return pattern || defaultPattern;
  }

  private aggregateValue(value: any): string {
    if (typeof value === 'number') {
      return value > 100 ? '>100' : value > 50 ? '50-100' : value > 10 ? '10-50' : '<10';
    }
    return '[AGGREGATED]';
  }

  private evaluateConditions(conditions: AccessCondition[], context: any): boolean {
    return conditions.every(condition => {
      const contextValue = context[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return contextValue === condition.value;
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(contextValue);
        case 'startsWith':
          return String(contextValue).startsWith(condition.value);
        default:
          return false;
      }
    });
  }

  public setReportAccessControl(reportId: string, accessControl: ReportAccessControl): void {
    this.reportAccess.set(reportId, accessControl);
  }

  public async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const id = Date.now().toString();
    const user: User = { ...userData, id };
    
    this.users.set(id, user);
    return user;
  }

  public async updateUserRole(userId: string, roleName: string): Promise<User | null> {
    const user = this.users.get(userId);
    const role = this.roles.get(roleName);
    
    if (!user || !role) return null;
    
    user.role = role;
    user.permissions = role.defaultPermissions;
    
    return user;
  }

  public getAuditLog(): any[] {
    // Implementation for audit logging
    // This would track all access attempts, modifications, etc.
    return [];
  }
}

export default SecurityAccessControl;
```

## Summary

This lesson covered the essential aspects of creating stakeholder-specific reporting solutions:

1. **Stakeholder Analysis**: Understanding different audience needs and requirements
2. **Executive Dashboards**: High-level KPIs, trends, and business impact metrics
3. **Developer-Focused Reports**: Detailed failure information, debugging context, and suggested fixes
4. **Automated Distribution**: Multi-channel report delivery with intelligent scheduling
5. **Interactive Dashboards**: Real-time monitoring with WebSocket integration
6. **Security & Access Control**: Role-based permissions and data redaction

### Key Takeaways

- **Audience-First Design**: Always start by understanding your stakeholders' specific needs and constraints
- **Data Visualization**: Use appropriate charts and visual elements to make data actionable
- **Automation**: Implement intelligent distribution systems to deliver the right information at the right time
- **Security**: Protect sensitive information with proper access controls and data redaction
- **Interactivity**: Provide drill-down capabilities and real-time updates where valuable
- **Maintainability**: Design systems that scale and can be easily modified as requirements evolve

### Next Steps

In the next lesson, we'll explore troubleshooting CI/CD failures and implementing robust error handling strategies that ensure your automated testing pipeline remains reliable and maintainable.

The skills learned in this lesson prepare you for senior QA automation roles where effective stakeholder communication and custom reporting solutions are essential for driving organizational decision-making and maintaining high-quality software delivery processes.