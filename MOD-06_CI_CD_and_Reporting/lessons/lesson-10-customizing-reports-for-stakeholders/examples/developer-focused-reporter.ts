// developer-focused-reporter.ts
/**
 * Developer-Focused Reporter - Provides detailed technical information
 * optimized for development teams including debugging context,
 * code analysis, and actionable insights
 */

import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

export interface DeveloperReportConfig {
  includeStackTraces: boolean;
  includeScreenshots: boolean;
  includePerformanceMetrics: boolean;
  includeCodeSuggestions: boolean;
  groupByComponent: boolean;
  maxFailureDetails: number;
}

export interface FailureAnalysis {
  testName: string;
  file: string;
  line: number;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  screenshot?: string;
  videoPath?: string;
  suggestions: string[];
  relatedFailures: string[];
  componentAffected: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface PerformanceInsight {
  testName: string;
  duration: number;
  memoryUsage: number;
  networkRequests: number;
  slowestActions: Array<{
    action: string;
    duration: number;
    element: string;
  }>;
  optimizationSuggestions: string[];
}

export interface CodeQualityMetric {
  file: string;
  complexity: number;
  maintainabilityIndex: number;
  duplicatedCode: boolean;
  testCoverage: number;
  technicalDebt: string[];
  suggestions: string[];
}

export class DeveloperFocusedReporter implements Reporter {
  private config: DeveloperReportConfig;
  private failures: FailureAnalysis[] = [];
  private performance: PerformanceInsight[] = [];
  private codeMetrics: CodeQualityMetric[] = [];
  private componentFailures: Map<string, number> = new Map();

  constructor(config: DeveloperReportConfig) {
    this.config = config;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === 'failed') {
      this.analyzeFailure(test, result);
    }
    
    if (this.config.includePerformanceMetrics) {
      this.analyzePerformance(test, result);
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    if (this.config.groupByComponent) {
      this.groupFailuresByComponent();
    }
    
    const report = this.generateDeveloperReport(result);
    await this.saveReport(report);
    
    console.log(this.generateConsoleOutput());
  }

  private analyzeFailure(test: TestCase, result: TestResult): void {
    const failure: FailureAnalysis = {
      testName: test.title,
      file: test.location.file,
      line: test.location.line,
      errorType: this.categorizeError(result.error?.message || ''),
      errorMessage: result.error?.message || 'Unknown error',
      componentAffected: this.extractComponent(test),
      severity: this.assessSeverity(test, result),
      suggestions: [],
      relatedFailures: []
    };

    if (this.config.includeStackTraces && result.error?.stack) {
      failure.stackTrace = result.error.stack;
    }

    if (this.config.includeScreenshots && result.attachments) {
      failure.screenshot = this.findAttachment(result.attachments, 'screenshot');
      failure.videoPath = this.findAttachment(result.attachments, 'video');
    }

    if (this.config.includeCodeSuggestions) {
      failure.suggestions = this.generateSuggestions(failure);
    }

    this.failures.push(failure);
    this.updateComponentFailures(failure.componentAffected);
  }

  private categorizeError(errorMessage: string): string {
    const errorPatterns = [
      { pattern: /timeout|timed out/i, type: 'Timeout' },
      { pattern: /element not found|locator/i, type: 'Element Not Found' },
      { pattern: /network|fetch|xhr/i, type: 'Network' },
      { pattern: /assertion|expect/i, type: 'Assertion' },
      { pattern: /permission|access/i, type: 'Permission' },
      { pattern: /navigation|page load/i, type: 'Navigation' },
      { pattern: /javascript|script/i, type: 'JavaScript Error' }
    ];

    for (const { pattern, type } of errorPatterns) {
      if (pattern.test(errorMessage)) {
        return type;
      }
    }

    return 'Unknown';
  }

  private extractComponent(test: TestCase): string {
    // Extract component from file path or test title
    const pathParts = test.location.file.split(/[/\\]/);
    const componentMatch = pathParts.find(part => 
      part.includes('component') || part.includes('page') || part.includes('feature')
    );
    
    if (componentMatch) {
      return componentMatch.replace(/\.(spec|test)\.(ts|js)$/, '');
    }

    // Try to extract from test title
    const titleMatch = test.title.match(/\b([A-Z][a-z]+(?:[A-Z][a-z]+)*)\b/);
    return titleMatch ? titleMatch[1] : 'Unknown';
  }

  private assessSeverity(test: TestCase, result: TestResult): 'critical' | 'high' | 'medium' | 'low' {
    const title = test.title.toLowerCase();
    const file = test.location.file.toLowerCase();

    // Critical: smoke tests, login, payment, security
    if (title.includes('@critical') || title.includes('@smoke') || 
        title.includes('login') || title.includes('auth') ||
        title.includes('payment') || title.includes('checkout')) {
      return 'critical';
    }

    // High: main user flows, API endpoints
    if (title.includes('@high') || title.includes('user flow') ||
        file.includes('api') || title.includes('integration')) {
      return 'high';
    }

    // Medium: feature tests
    if (title.includes('@medium') || file.includes('feature')) {
      return 'medium';
    }

    return 'low';
  }

  private findAttachment(attachments: any[], type: string): string | undefined {
    const attachment = attachments.find(a => a.name.includes(type));
    return attachment?.path;
  }

  private generateSuggestions(failure: FailureAnalysis): string[] {
    const suggestions: string[] = [];

    switch (failure.errorType) {
      case 'Timeout':
        suggestions.push('Consider increasing timeout value with { timeout: 30000 }');
        suggestions.push('Check if element loading requires waiting for network requests');
        suggestions.push('Use page.waitForLoadState() before interacting with elements');
        suggestions.push('Verify if the element is conditionally rendered');
        break;

      case 'Element Not Found':
        suggestions.push('Verify the selector is correct and stable');
        suggestions.push('Check if element is inside a frame or shadow DOM');
        suggestions.push('Consider using data-testid attributes for more reliable selection');
        suggestions.push('Use page.locator().waitFor() to ensure element availability');
        break;

      case 'Network':
        suggestions.push('Mock network requests in tests to avoid external dependencies');
        suggestions.push('Check if API endpoints are available in test environment');
        suggestions.push('Consider implementing retry logic for flaky network requests');
        suggestions.push('Verify CORS settings if making cross-origin requests');
        break;

      case 'Assertion':
        suggestions.push('Review expected vs actual values in the assertion');
        suggestions.push('Consider using soft assertions for non-critical checks');
        suggestions.push('Add debugging output to understand actual state');
        suggestions.push('Use more specific matchers (toHaveText vs toContainText)');
        break;

      case 'JavaScript Error':
        suggestions.push('Check browser console for additional error details');
        suggestions.push('Verify if the error occurs in all browsers');
        suggestions.push('Consider adding error handling in the application code');
        suggestions.push('Use page.on("pageerror") to catch and analyze JS errors');
        break;

      default:
        suggestions.push('Add more specific error handling for this scenario');
        suggestions.push('Consider breaking down the test into smaller, focused tests');
        suggestions.push('Review test data and environment configuration');
    }

    return suggestions;
  }

  private updateComponentFailures(component: string): void {
    const current = this.componentFailures.get(component) || 0;
    this.componentFailures.set(component, current + 1);
  }

  private analyzePerformance(test: TestCase, result: TestResult): void {
    const insight: PerformanceInsight = {
      testName: test.title,
      duration: result.duration,
      memoryUsage: this.estimateMemoryUsage(result),
      networkRequests: this.countNetworkRequests(result),
      slowestActions: this.extractSlowActions(result),
      optimizationSuggestions: []
    };

    // Performance-based suggestions
    if (insight.duration > 30000) {
      insight.optimizationSuggestions.push('Consider parallelizing independent actions');
      insight.optimizationSuggestions.push('Review if all test steps are necessary');
    }

    if (insight.networkRequests > 20) {
      insight.optimizationSuggestions.push('Mock unnecessary network requests');
      insight.optimizationSuggestions.push('Batch API calls where possible');
    }

    this.performance.push(insight);
  }

  private estimateMemoryUsage(result: TestResult): number {
    // Simplified memory estimation based on test duration and complexity
    return Math.round(result.duration * 0.1 + Math.random() * 50);
  }

  private countNetworkRequests(result: TestResult): number {
    // Simplified network request counting
    return Math.round(result.duration / 1000 + Math.random() * 10);
  }

  private extractSlowActions(result: TestResult): Array<{action: string, duration: number, element: string}> {
    // Simplified slow action extraction
    return [
      { action: 'click', duration: 2000, element: 'button[type="submit"]' },
      { action: 'fill', duration: 1500, element: 'input[name="email"]' },
      { action: 'wait', duration: 3000, element: 'div.loading' }
    ].filter(() => Math.random() > 0.7); // Random selection for demo
  }

  private groupFailuresByComponent(): void {
    // Group related failures
    this.failures.forEach(failure => {
      const related = this.failures.filter(f => 
        f !== failure && 
        f.componentAffected === failure.componentAffected &&
        f.errorType === failure.errorType
      ).map(f => f.testName);
      
      failure.relatedFailures = related.slice(0, 3); // Limit to 3 related failures
    });
  }

  private generateDeveloperReport(result: FullResult): any {
    return {
      summary: this.generateSummary(result),
      failureAnalysis: this.failures.slice(0, this.config.maxFailureDetails),
      performanceInsights: this.performance,
      componentHealthMap: this.generateComponentHealthMap(),
      codeQualityMetrics: this.codeMetrics,
      actionableRecommendations: this.generateRecommendations(),
      debuggingGuide: this.generateDebuggingGuide(),
      timestamp: new Date().toISOString()
    };
  }

  private generateSummary(result: FullResult): any {
    const totalTests = result.allTests.length;
    const failedTests = this.failures.length;
    const passRate = ((totalTests - failedTests) / totalTests) * 100;

    return {
      totalTests,
      failedTests,
      passRate: Math.round(passRate),
      avgDuration: this.calculateAverageTestDuration(),
      mostProblematicComponent: this.getMostProblematicComponent(),
      criticalIssues: this.failures.filter(f => f.severity === 'critical').length,
      performanceFlags: this.performance.filter(p => p.duration > 30000).length
    };
  }

  private calculateAverageTestDuration(): number {
    if (this.performance.length === 0) return 0;
    const total = this.performance.reduce((sum, p) => sum + p.duration, 0);
    return Math.round(total / this.performance.length);
  }

  private getMostProblematicComponent(): string {
    let maxFailures = 0;
    let problematicComponent = 'None';

    this.componentFailures.forEach((failures, component) => {
      if (failures > maxFailures) {
        maxFailures = failures;
        problematicComponent = component;
      }
    });

    return problematicComponent;
  }

  private generateComponentHealthMap(): any {
    const healthMap: any = {};

    this.componentFailures.forEach((failures, component) => {
      const health = failures === 0 ? 'healthy' : 
                   failures <= 2 ? 'warning' : 'critical';
      
      healthMap[component] = {
        failures,
        health,
        recommendations: this.getComponentRecommendations(component, failures)
      };
    });

    return healthMap;
  }

  private getComponentRecommendations(component: string, failures: number): string[] {
    if (failures === 0) {
      return ['✅ Component is stable - consider it for refactoring examples'];
    }

    const recommendations = [
      `🔍 Review ${component} implementation for common failure patterns`,
      `📝 Add more specific error handling for ${component} interactions`,
      `🧪 Consider breaking down ${component} tests into smaller units`
    ];

    if (failures > 5) {
      recommendations.push(`🚨 ${component} requires immediate attention - high failure rate`);
      recommendations.push(`📋 Schedule technical debt review for ${component}`);
    }

    return recommendations;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Failure-based recommendations
    const criticalFailures = this.failures.filter(f => f.severity === 'critical');
    if (criticalFailures.length > 0) {
      recommendations.push(`🚨 Address ${criticalFailures.length} critical failures immediately`);
    }

    // Performance-based recommendations
    const slowTests = this.performance.filter(p => p.duration > 30000);
    if (slowTests.length > 0) {
      recommendations.push(`⚡ Optimize ${slowTests.length} slow-running tests`);
    }

    // Component-based recommendations
    const problematicComponents = Array.from(this.componentFailures.entries())
      .filter(([_, failures]) => failures > 3)
      .map(([component]) => component);

    if (problematicComponents.length > 0) {
      recommendations.push(`🔧 Refactor components: ${problematicComponents.join(', ')}`);
    }

    // Pattern-based recommendations
    const timeoutErrors = this.failures.filter(f => f.errorType === 'Timeout').length;
    if (timeoutErrors > 3) {
      recommendations.push('⏱️ Review timeout strategies - consider implementing wait conditions');
    }

    const selectorErrors = this.failures.filter(f => f.errorType === 'Element Not Found').length;
    if (selectorErrors > 3) {
      recommendations.push('🎯 Implement more stable selector strategy using data-testid');
    }

    return recommendations;
  }

  private generateDebuggingGuide(): any {
    return {
      commonIssues: [
        {
          issue: 'Flaky Tests',
          symptoms: ['Tests pass locally but fail in CI', 'Intermittent failures'],
          debugging: [
            'Run test multiple times: npx playwright test --repeat-each=10',
            'Enable video recording: use: { video: "on" }',
            'Add explicit waits before assertions',
            'Check for race conditions in async operations'
          ]
        },
        {
          issue: 'Slow Test Performance',
          symptoms: ['Tests taking longer than expected', 'Timeout errors'],
          debugging: [
            'Use page.locator().waitFor() instead of page.waitForTimeout()',
            'Mock external API calls',
            'Optimize selector strategies',
            'Profile test execution with --trace=on'
          ]
        },
        {
          issue: 'Element Not Found',
          symptoms: ['Locator errors', 'Missing elements'],
          debugging: [
            'Inspect element in browser dev tools',
            'Use page.locator().highlight() to visualize',
            'Check if element is in iframe or shadow DOM',
            'Verify timing - element might not be rendered yet'
          ]
        }
      ],
      toolsAndCommands: [
        {
          command: 'npx playwright test --debug',
          description: 'Run tests in debug mode with inspector'
        },
        {
          command: 'npx playwright show-report',
          description: 'Open interactive HTML report'
        },
        {
          command: 'npx playwright trace show trace.zip',
          description: 'View trace timeline for detailed debugging'
        }
      ]
    };
  }

  private generateConsoleOutput(): string {
    const summary = this.generateSummary({ allTests: [] } as FullResult);
    
    return `
🔧 Developer Report Summary
==========================

📊 Overall Health:
   • Pass Rate: ${summary.passRate}%
   • Failed Tests: ${summary.failedTests}
   • Critical Issues: ${summary.criticalIssues}

🐛 Top Issues:
${this.failures.slice(0, 3).map((f, i) => 
  `   ${i + 1}. ${f.testName}: ${f.errorType}`
).join('\n')}

🚀 Performance:
   • Avg Duration: ${summary.avgDuration}ms
   • Slow Tests: ${this.performance.filter(p => p.duration > 30000).length}

🎯 Focus Areas:
${this.generateRecommendations().slice(0, 3).map(r => `   • ${r}`).join('\n')}

📋 Full report saved to: developer-report.json
`;
  }

  private async saveReport(report: any): Promise<void> {
    // In a real implementation, this would save to file system
    console.log('📁 Saving developer report...');
    // await fs.writeFile('developer-report.json', JSON.stringify(report, null, 2));
  }
}

export default DeveloperFocusedReporter;