# Understanding and Configuring Playwright Reporters

## Introduction

Effective test reporting is crucial for maintaining high-quality software delivery pipelines. Playwright provides a comprehensive suite of built-in reporters and the flexibility to create custom reporting solutions that meet specific organizational needs. This lesson explores advanced reporting configurations, custom reporter development, and enterprise integration patterns.

**Why Reporting Matters:**
- **Visibility**: Clear communication of test results to all stakeholders
- **Debugging**: Rich context for faster issue identification and resolution
- **Metrics**: Data-driven insights for continuous improvement
- **Compliance**: Documentation for regulatory and audit requirements
- **Accountability**: Evidence of quality assurance processes

---

## Built-in Reporter Configuration

### Understanding Playwright Reporters

Playwright includes several built-in reporters, each optimized for different use cases:

**Reporter Types:**
- **HTML Reporter**: Interactive visual reports with rich media
- **JUnit Reporter**: XML format for CI/CD integration
- **JSON Reporter**: Structured data for programmatic processing
- **Line Reporter**: Concise terminal output during execution
- **List Reporter**: Detailed terminal output with test progress
- **Dot Reporter**: Minimal terminal output for large test suites

### HTML Reporter Configuration

The HTML reporter generates interactive reports with rich visual elements:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never',
      host: 'localhost',
      port: 9323,
      
      // Customize report appearance
      attachments: {
        mode: 'on-failure',
        // Include screenshots, videos, and traces
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      }
    }]
  ],
  
  use: {
    // Configure media capture
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  }
});
```

**Advanced HTML Reporter Features:**

```typescript
// Advanced HTML reporter configuration
export default defineConfig({
  reporter: [
    ['html', {
      outputFolder: 'reports/html',
      open: 'never',
      
      // Custom report title and metadata
      title: 'E-commerce Platform Test Results',
      
      // Include system information
      showSystemInfo: true,
      
      // Configure attachment handling
      attachments: {
        mode: 'on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      },
      
      // Custom CSS styling
      theme: 'dark', // 'light' or 'dark'
      
      // Filter test results
      showPassedTests: true,
      showSkippedTests: false,
      
      // Performance metrics
      showSlowTests: true,
      slowTestThreshold: 15000 // 15 seconds
    }]
  ]
});
```

### JUnit Reporter for CI/CD Integration

JUnit format is essential for CI/CD pipeline integration:

```typescript
// JUnit reporter configuration
export default defineConfig({
  reporter: [
    ['junit', {
      outputFile: 'test-results/junit-results.xml',
      
      // Include additional metadata
      includeProjectInTestName: true,
      
      // Merge results from different projects
      mergeReports: true,
      
      // Custom test suite name
      testSuiteName: 'Playwright E2E Tests',
      
      // Include system properties
      includeSystemProperties: true,
      
      // Strip ANSI colors from output
      stripANSIControlSequences: true
    }]
  ]
});
```

**JUnit Integration Example:**

```yaml
# GitHub Actions integration
- name: Run Playwright Tests
  run: npx playwright test
  
- name: Publish Test Results
  uses: dorny/test-reporter@v1
  if: always()
  with:
    name: Playwright Test Results
    path: test-results/junit-results.xml
    reporter: java-junit
    fail-on-error: true
```

### JSON Reporter for Data Processing

JSON reporter provides structured data for analysis:

```typescript
// JSON reporter configuration
export default defineConfig({
  reporter: [
    ['json', {
      outputFile: 'test-results/results.json',
      
      // Include detailed timing information
      includeTimings: true,
      
      // Include project information
      includeProjectNames: true,
      
      // Include attachment paths
      includeAttachments: true,
      
      // Pretty print JSON (development only)
      indent: process.env.NODE_ENV === 'development' ? 2 : 0
    }]
  ]
});
```

**Processing JSON Results:**

```typescript
// scripts/process-results.ts
interface TestResult {
  title: string;
  outcome: 'passed' | 'failed' | 'skipped';
  duration: number;
  project: string;
  errors?: string[];
  attachments?: Attachment[];
}

class ResultsProcessor {
  private results: TestResult[];
  
  constructor(resultsPath: string) {
    const rawData = require('fs').readFileSync(resultsPath, 'utf-8');
    const data = JSON.parse(rawData);
    this.results = this.parseResults(data);
  }
  
  generateSummary(): TestSummary {
    const total = this.results.length;
    const passed = this.results.filter(r => r.outcome === 'passed').length;
    const failed = this.results.filter(r => r.outcome === 'failed').length;
    const skipped = this.results.filter(r => r.outcome === 'skipped').length;
    
    const avgDuration = this.results
      .filter(r => r.outcome !== 'skipped')
      .reduce((acc, r) => acc + r.duration, 0) / (total - skipped);
    
    return {
      total,
      passed,
      failed,
      skipped,
      passRate: (passed / total) * 100,
      avgDuration,
      slowestTests: this.getSlowestTests(5)
    };
  }
  
  private getSlowestTests(count: number): TestResult[] {
    return this.results
      .filter(r => r.outcome !== 'skipped')
      .sort((a, b) => b.duration - a.duration)
      .slice(0, count);
  }
}
```

---

## Multi-Reporter Configurations

### Combining Multiple Reporters

Configure multiple reporters for different stakeholders:

```typescript
// Multi-reporter configuration
export default defineConfig({
  reporter: [
    // HTML report for developers and QA
    ['html', {
      outputFolder: 'reports/html',
      open: 'never',
      attachments: {
        mode: 'on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      }
    }],
    
    // JUnit for CI/CD integration
    ['junit', {
      outputFile: 'reports/junit.xml',
      includeProjectInTestName: true
    }],
    
    // JSON for metrics and analysis
    ['json', {
      outputFile: 'reports/results.json',
      includeTimings: true,
      includeAttachments: true
    }],
    
    // Line reporter for terminal output
    ['line'],
    
    // Custom reporter for notifications
    ['./reporters/slack-reporter.ts', {
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: '#qa-alerts',
      onlyOnFailures: true
    }]
  ]
});
```

### Environment-Specific Reporter Configuration

Adapt reporting based on execution environment:

```typescript
// Environment-specific configuration
function getReporters() {
  const baseReporters = [
    ['json', { outputFile: 'reports/results.json' }]
  ];
  
  if (process.env.CI) {
    // CI/CD environment
    return [
      ...baseReporters,
      ['junit', { outputFile: 'reports/junit.xml' }],
      ['github'], // GitHub Actions integration
      ['./reporters/ci-reporter.ts']
    ];
  } else if (process.env.NODE_ENV === 'development') {
    // Local development
    return [
      ...baseReporters,
      ['html', { open: 'on-failure' }],
      ['line']
    ];
  } else {
    // Production/staging
    return [
      ...baseReporters,
      ['html', { outputFolder: 'reports/html', open: 'never' }],
      ['./reporters/monitoring-reporter.ts']
    ];
  }
}

export default defineConfig({
  reporter: getReporters(),
  // ... other configuration
});
```

---

## Custom Reporter Development

### Understanding the Reporter API

Playwright's reporter API provides hooks into the test lifecycle:

```typescript
// reporters/base-custom-reporter.ts
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class CustomReporter implements Reporter {
  // Called at the start of test execution
  onBegin(config: FullConfig, suite: Suite): void {
    console.log(`Starting test execution with ${suite.allTests().length} tests`);
  }
  
  // Called when a test starts
  onTestBegin(test: TestCase, result: TestResult): void {
    console.log(`Starting test: ${test.title}`);
  }
  
  // Called when a test ends
  onTestEnd(test: TestCase, result: TestResult): void {
    console.log(`Test ${test.title}: ${result.status} (${result.duration}ms)`);
  }
  
  // Called at the end of test execution
  onEnd(result: FullResult): void {
    console.log(`Test execution completed: ${result.status}`);
  }
  
  // Called on stderr output
  onStdErr?(chunk: string | Buffer, test?: TestCase, result?: TestResult): void {
    process.stderr.write(chunk);
  }
  
  // Called on stdout output
  onStdOut?(chunk: string | Buffer, test?: TestCase, result?: TestResult): void {
    process.stdout.write(chunk);
  }
  
  // Called on step start/end (for detailed reporting)
  onStepBegin?(test: TestCase, result: TestResult, step: TestStep): void {
    // Track individual test steps
  }
  
  onStepEnd?(test: TestCase, result: TestResult, step: TestStep): void {
    // Process step results
  }
}

export default CustomReporter;
```

### Enterprise Monitoring Reporter

Create a reporter that sends metrics to monitoring systems:

```typescript
// reporters/monitoring-reporter.ts
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fetch from 'node-fetch';

interface MonitoringConfig {
  endpoint: string;
  apiKey: string;
  service: string;
  environment: string;
  batchSize?: number;
  retryAttempts?: number;
}

class MonitoringReporter implements Reporter {
  private config: MonitoringConfig;
  private metrics: TestMetric[] = [];
  private startTime: number = 0;
  
  constructor(options: MonitoringConfig) {
    this.config = {
      batchSize: 100,
      retryAttempts: 3,
      ...options
    };
  }
  
  onBegin(config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    
    // Send test session start event
    this.sendMetric({
      type: 'test_session_start',
      timestamp: this.startTime,
      metadata: {
        totalTests: suite.allTests().length,
        projects: config.projects.map(p => p.name),
        environment: this.config.environment
      }
    });
  }
  
  onTestEnd(test: TestCase, result: TestResult): void {
    const metric: TestMetric = {
      type: 'test_result',
      timestamp: Date.now(),
      testName: test.title,
      fullTitle: test.titlePath().join(' › '),
      project: test.project()?.name || 'default',
      status: result.status,
      duration: result.duration,
      retries: result.retry,
      errors: result.errors.map(e => e.message),
      annotations: test.annotations.map(a => ({ type: a.type, description: a.description }))
    };
    
    this.metrics.push(metric);
    
    // Send metrics in batches
    if (this.metrics.length >= this.config.batchSize!) {
      this.flushMetrics();
    }
    
    // Send immediate alert for critical failures
    if (result.status === 'failed' && test.annotations.some(a => a.type === 'critical')) {
      this.sendAlert({
        severity: 'critical',
        testName: test.title,
        error: result.errors[0]?.message || 'Unknown error',
        environment: this.config.environment
      });
    }
  }
  
  async onEnd(result: FullResult): Promise<void> {
    // Flush remaining metrics
    await this.flushMetrics();
    
    // Send session summary
    const summary = this.generateSummary(result);
    await this.sendMetric({
      type: 'test_session_end',
      timestamp: Date.now(),
      duration: Date.now() - this.startTime,
      summary
    });
    
    console.log(`📊 Monitoring metrics sent to ${this.config.endpoint}`);
  }
  
  private async flushMetrics(): Promise<void> {
    if (this.metrics.length === 0) return;
    
    const batch = [...this.metrics];
    this.metrics = [];
    
    await this.sendBatch(batch);
  }
  
  private async sendBatch(metrics: TestMetric[], attempt: number = 1): Promise<void> {
    try {
      const response = await fetch(`${this.config.endpoint}/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Service': this.config.service
        },
        body: JSON.stringify({
          metrics,
          timestamp: Date.now(),
          service: this.config.service,
          environment: this.config.environment
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to send metrics (attempt ${attempt}):`, error);
      
      if (attempt < this.config.retryAttempts!) {
        // Exponential backoff
        await this.sleep(Math.pow(2, attempt) * 1000);
        return this.sendBatch(metrics, attempt + 1);
      }
      
      // Save failed metrics for later retry
      require('fs').writeFileSync(
        `failed-metrics-${Date.now()}.json`,
        JSON.stringify(metrics, null, 2)
      );
    }
  }
  
  private async sendAlert(alert: AlertData): Promise<void> {
    try {
      await fetch(`${this.config.endpoint}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      console.error('❌ Failed to send alert:', error);
    }
  }
  
  private generateSummary(result: FullResult): TestSummary {
    const allTests = this.metrics.filter(m => m.type === 'test_result');
    const passed = allTests.filter(t => t.status === 'passed').length;
    const failed = allTests.filter(t => t.status === 'failed').length;
    const skipped = allTests.filter(t => t.status === 'skipped').length;
    
    return {
      total: allTests.length,
      passed,
      failed,
      skipped,
      passRate: (passed / allTests.length) * 100,
      avgDuration: allTests.reduce((acc, t) => acc + t.duration, 0) / allTests.length,
      totalDuration: Date.now() - this.startTime
    };
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

interface TestMetric {
  type: string;
  timestamp: number;
  testName?: string;
  fullTitle?: string;
  project?: string;
  status?: string;
  duration?: number;
  retries?: number;
  errors?: string[];
  annotations?: Array<{ type: string; description?: string }>;
  metadata?: any;
  summary?: TestSummary;
}

interface AlertData {
  severity: 'low' | 'medium' | 'high' | 'critical';
  testName: string;
  error: string;
  environment: string;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
  avgDuration: number;
  totalDuration: number;
}

export default MonitoringReporter;
```

### Slack Notification Reporter

Create a reporter that sends notifications to Slack:

```typescript
// reporters/slack-reporter.ts
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fetch from 'node-fetch';

interface SlackConfig {
  webhookUrl: string;
  channel?: string;
  username?: string;
  onlyOnFailures?: boolean;
  mentionOnFailures?: string[];
  includeScreenshots?: boolean;
}

class SlackReporter implements Reporter {
  private config: SlackConfig;
  private failedTests: Array<{ test: TestCase; result: TestResult }> = [];
  private startTime: number = 0;
  
  constructor(options: SlackConfig) {
    this.config = {
      username: 'Playwright Bot',
      onlyOnFailures: false,
      includeScreenshots: true,
      ...options
    };
  }
  
  onBegin(config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    
    if (!this.config.onlyOnFailures) {
      this.sendMessage({
        text: '🚀 Playwright Test Execution Started',
        attachments: [{
          color: 'good',
          fields: [
            { title: 'Total Tests', value: suite.allTests().length.toString(), short: true },
            { title: 'Projects', value: config.projects.map(p => p.name).join(', '), short: true },
            { title: 'Started At', value: new Date().toISOString(), short: true }
          ]
        }]
      });
    }
  }
  
  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === 'failed') {
      this.failedTests.push({ test, result });
    }
  }
  
  async onEnd(result: FullResult): Promise<void> {
    const duration = Date.now() - this.startTime;
    const summary = this.generateSummary();
    
    if (this.config.onlyOnFailures && this.failedTests.length === 0) {
      return; // Don't send message if only failures requested and no failures
    }
    
    const message = this.createSummaryMessage(summary, duration);
    await this.sendMessage(message);
    
    // Send detailed failure messages
    if (this.failedTests.length > 0) {
      await this.sendFailureDetails();
    }
  }
  
  private generateSummary() {
    // Implementation similar to monitoring reporter
    // ... (calculate test statistics)
  }
  
  private createSummaryMessage(summary: any, duration: number) {
    const status = summary.failed > 0 ? 'failed' : 'passed';
    const color = status === 'passed' ? 'good' : 'danger';
    const emoji = status === 'passed' ? '✅' : '❌';
    
    let mentions = '';
    if (status === 'failed' && this.config.mentionOnFailures?.length) {
      mentions = this.config.mentionOnFailures.map(user => `<@${user}>`).join(' ') + ' ';
    }
    
    return {
      text: `${emoji} ${mentions}Playwright Test Execution ${status.toUpperCase()}`,
      attachments: [{
        color,
        fields: [
          { title: 'Total Tests', value: summary.total.toString(), short: true },
          { title: 'Passed', value: summary.passed.toString(), short: true },
          { title: 'Failed', value: summary.failed.toString(), short: true },
          { title: 'Skipped', value: summary.skipped.toString(), short: true },
          { title: 'Pass Rate', value: `${summary.passRate.toFixed(1)}%`, short: true },
          { title: 'Duration', value: `${Math.round(duration / 1000)}s`, short: true }
        ],
        footer: 'Playwright Test Reporter',
        ts: Math.floor(Date.now() / 1000)
      }]
    };
  }
  
  private async sendFailureDetails(): Promise<void> {
    const failureGroups = this.groupFailuresByProject();
    
    for (const [project, failures] of failureGroups) {
      const message = {
        text: `❌ Test Failures in ${project}`,
        attachments: failures.slice(0, 5).map(({ test, result }) => ({
          color: 'danger',
          title: test.title,
          text: result.errors[0]?.message || 'Unknown error',
          fields: [
            { title: 'Duration', value: `${result.duration}ms`, short: true },
            { title: 'Retries', value: result.retry.toString(), short: true }
          ]
        }))
      };
      
      if (failures.length > 5) {
        message.attachments.push({
          color: 'warning',
          text: `... and ${failures.length - 5} more failures`
        });
      }
      
      await this.sendMessage(message);
    }
  }
  
  private groupFailuresByProject(): Map<string, Array<{ test: TestCase; result: TestResult }>> {
    const groups = new Map();
    
    for (const failure of this.failedTests) {
      const project = failure.test.project()?.name || 'default';
      if (!groups.has(project)) {
        groups.set(project, []);
      }
      groups.get(project).push(failure);
    }
    
    return groups;
  }
  
  private async sendMessage(message: any): Promise<void> {
    try {
      const payload = {
        ...message,
        channel: this.config.channel,
        username: this.config.username
      };
      
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        console.error(`Failed to send Slack message: ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('Error sending Slack notification:', error);
    }
  }
}

export default SlackReporter;
```

---

## Enterprise Integration Patterns

### Real-time Dashboard Integration

Integrate with monitoring dashboards for live test visibility:

```typescript
// reporters/dashboard-reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import WebSocket from 'ws';

class DashboardReporter implements Reporter {
  private ws?: WebSocket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  constructor(private dashboardUrl: string, private apiKey: string) {
    this.connectToDashboard();
  }
  
  private connectToDashboard(): void {
    try {
      this.ws = new WebSocket(`${this.dashboardUrl}?apiKey=${this.apiKey}`);
      
      this.ws.on('open', () => {
        console.log('📊 Connected to dashboard');
        this.reconnectAttempts = 0;
      });
      
      this.ws.on('close', () => {
        console.log('📊 Dashboard connection closed');
        this.reconnectWithBackoff();
      });
      
      this.ws.on('error', (error) => {
        console.error('📊 Dashboard connection error:', error);
      });
      
    } catch (error) {
      console.error('📊 Failed to connect to dashboard:', error);
    }
  }
  
  private reconnectWithBackoff(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      this.reconnectAttempts++;
      
      setTimeout(() => {
        console.log(`📊 Reconnecting to dashboard (attempt ${this.reconnectAttempts})...`);
        this.connectToDashboard();
      }, delay);
    }
  }
  
  onBegin(config: FullConfig, suite: Suite): void {
    this.sendTodashboard({
      type: 'session_start',
      data: {
        totalTests: suite.allTests().length,
        timestamp: Date.now(),
        projects: config.projects.map(p => p.name)
      }
    });
  }
  
  onTestBegin(test: TestCase, result: TestResult): void {
    this.sendTodashboard({
      type: 'test_start',
      data: {
        testId: this.getTestId(test),
        testName: test.title,
        project: test.project()?.name,
        timestamp: Date.now()
      }
    });
  }
  
  onTestEnd(test: TestCase, result: TestResult): void {
    this.sendToProgress({
      type: 'test_complete',
      data: {
        testId: this.getTestId(test),
        status: result.status,
        duration: result.duration,
        timestamp: Date.now()
      }
    });
  }
  
  private sendToProgress(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
  
  private getTestId(test: TestCase): string {
    return `${test.project()?.name || 'default'}-${test.titlePath().join('-')}`;
  }
}
```

### Historical Data Archive

Store test results for trend analysis:

```typescript
// reporters/archive-reporter.ts
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface ArchiveConfig {
  archivePath: string;
  retention: {
    days: number;
    maxFiles: number;
  };
  compression: boolean;
}

class ArchiveReporter implements Reporter {
  private config: ArchiveConfig;
  private sessionData: SessionData;
  
  constructor(options: Partial<ArchiveConfig> = {}) {
    this.config = {
      archivePath: 'test-archives',
      retention: { days: 30, maxFiles: 100 },
      compression: false,
      ...options
    };
    
    this.ensureArchiveDirectory();
    this.sessionData = this.initializeSession();
  }
  
  onBegin(config: FullConfig, suite: Suite): void {
    this.sessionData.startTime = Date.now();
    this.sessionData.totalTests = suite.allTests().length;
    this.sessionData.projects = config.projects.map(p => p.name);
  }
  
  onTestEnd(test: TestCase, result: TestResult): void {
    const testData: ArchivedTestResult = {
      title: test.title,
      fullTitle: test.titlePath().join(' › '),
      project: test.project()?.name || 'default',
      status: result.status,
      duration: result.duration,
      retry: result.retry,
      errors: result.errors.map(e => ({
        message: e.message,
        location: e.location
      })),
      annotations: test.annotations,
      timestamp: Date.now()
    };
    
    this.sessionData.tests.push(testData);
  }
  
  async onEnd(result: FullResult): Promise<void> {
    this.sessionData.endTime = Date.now();
    this.sessionData.totalDuration = this.sessionData.endTime - this.sessionData.startTime;
    this.sessionData.status = result.status;
    
    await this.archiveSession();
    await this.cleanupOldArchives();
    
    console.log(`📁 Test results archived to ${this.getArchiveFileName()}`);
  }
  
  private initializeSession(): SessionData {
    return {
      sessionId: this.generateSessionId(),
      startTime: 0,
      endTime: 0,
      totalDuration: 0,
      totalTests: 0,
      tests: [],
      projects: [],
      status: 'passed',
      environment: {
        os: process.platform,
        node: process.version,
        ci: !!process.env.CI,
        branch: process.env.GITHUB_REF_NAME || 'unknown'
      }
    };
  }
  
  private async archiveSession(): Promise<void> {
    const fileName = this.getArchiveFileName();
    const filePath = path.join(this.config.archivePath, fileName);
    
    let data = JSON.stringify(this.sessionData, null, 2);
    
    if (this.config.compression) {
      const zlib = require('zlib');
      data = zlib.gzipSync(data);
    }
    
    fs.writeFileSync(filePath, data);
  }
  
  private async cleanupOldArchives(): Promise<void> {
    const files = fs.readdirSync(this.config.archivePath)
      .filter(f => f.startsWith('test-session-'))
      .map(f => ({
        name: f,
        path: path.join(this.config.archivePath, f),
        stats: fs.statSync(path.join(this.config.archivePath, f))
      }))
      .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());
    
    // Remove old files based on retention policy
    const cutoffDate = Date.now() - (this.config.retention.days * 24 * 60 * 60 * 1000);
    const filesToDelete = files.filter((file, index) => 
      index >= this.config.retention.maxFiles || 
      file.stats.mtime.getTime() < cutoffDate
    );
    
    for (const file of filesToDelete) {
      fs.unlinkSync(file.path);
    }
    
    if (filesToDelete.length > 0) {
      console.log(`🗑️ Cleaned up ${filesToDelete.length} old archive files`);
    }
  }
  
  private ensureArchiveDirectory(): void {
    if (!fs.existsSync(this.config.archivePath)) {
      fs.mkdirSync(this.config.archivePath, { recursive: true });
    }
  }
  
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private getArchiveFileName(): string {
    const date = new Date().toISOString().split('T')[0];
    const extension = this.config.compression ? '.json.gz' : '.json';
    return `test-session-${date}-${this.sessionData.sessionId}${extension}`;
  }
}

interface SessionData {
  sessionId: string;
  startTime: number;
  endTime: number;
  totalDuration: number;
  totalTests: number;
  tests: ArchivedTestResult[];
  projects: string[];
  status: string;
  environment: {
    os: string;
    node: string;
    ci: boolean;
    branch: string;
  };
}

interface ArchivedTestResult {
  title: string;
  fullTitle: string;
  project: string;
  status: string;
  duration: number;
  retry: number;
  errors: Array<{
    message: string;
    location?: any;
  }>;
  annotations: any[];
  timestamp: number;
}

export default ArchiveReporter;
```

---

## Performance Optimization

### Efficient Report Generation

Optimize reporting performance for large test suites:

```typescript
// reporters/optimized-reporter.ts
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { Worker } from 'worker_threads';
import * as path from 'path';

class OptimizedReporter implements Reporter {
  private testBuffer: TestResult[] = [];
  private bufferSize = 100;
  private workers: Worker[] = [];
  private workerPool: WorkerPool;
  
  constructor(private options: OptimizedReporterOptions) {
    this.workerPool = new WorkerPool(4); // 4 worker threads
  }
  
  onBegin(config: FullConfig, suite: Suite): void {
    console.log(`🚀 Starting optimized reporting for ${suite.allTests().length} tests`);
  }
  
  onTestEnd(test: TestCase, result: TestResult): void {
    this.testBuffer.push(result);
    
    // Process results in batches to avoid memory pressure
    if (this.testBuffer.length >= this.bufferSize) {
      this.processBatch();
    }
  }
  
  async onEnd(result: FullResult): Promise<void> {
    // Process remaining results
    if (this.testBuffer.length > 0) {
      await this.processBatch();
    }
    
    // Wait for all workers to complete
    await this.workerPool.close();
    
    console.log('✅ Optimized reporting completed');
  }
  
  private async processBatch(): Promise<void> {
    const batch = [...this.testBuffer];
    this.testBuffer = [];
    
    // Offload processing to worker thread
    await this.workerPool.execute('processBatch', {
      tests: batch,
      options: this.options
    });
  }
}

class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{ resolve: Function; reject: Function; task: any }> = [];
  private busy: boolean[] = [];
  
  constructor(private size: number) {
    for (let i = 0; i < size; i++) {
      const worker = new Worker(path.join(__dirname, 'report-worker.js'));
      this.workers.push(worker);
      this.busy.push(false);
      
      worker.on('message', (result) => {
        this.busy[i] = false;
        this.processQueue();
        
        if (this.queue.length > 0) {
          const { resolve } = this.queue.shift()!;
          resolve(result);
        }
      });
      
      worker.on('error', (error) => {
        this.busy[i] = false;
        if (this.queue.length > 0) {
          const { reject } = this.queue.shift()!;
          reject(error);
        }
      });
    }
  }
  
  execute(task: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, task: { task, data } });
      this.processQueue();
    });
  }
  
  private processQueue(): void {
    if (this.queue.length === 0) return;
    
    const availableWorker = this.workers.findIndex((_, i) => !this.busy[i]);
    if (availableWorker === -1) return;
    
    const { task } = this.queue[0];
    this.busy[availableWorker] = true;
    this.workers[availableWorker].postMessage(task);
  }
  
  async close(): Promise<void> {
    await Promise.all(this.workers.map(worker => worker.terminate()));
  }
}
```

### Memory-Efficient Streaming

Stream large reports to avoid memory issues:

```typescript
// reporters/streaming-reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import { Transform } from 'stream';

class StreamingReporter implements Reporter {
  private outputStream: fs.WriteStream;
  private jsonStream: Transform;
  private testCount = 0;
  private isFirstTest = true;
  
  constructor(private outputPath: string) {
    this.outputStream = fs.createWriteStream(outputPath);
    this.initializeJsonStream();
  }
  
  onBegin(config: FullConfig, suite: Suite): void {
    this.outputStream.write('{\n  "testResults": [\n');
  }
  
  onTestEnd(test: TestCase, result: TestResult): void {
    const testResult = {
      title: test.title,
      status: result.status,
      duration: result.duration,
      timestamp: Date.now()
    };
    
    if (!this.isFirstTest) {
      this.outputStream.write(',\n');
    }
    this.isFirstTest = false;
    
    this.outputStream.write(`    ${JSON.stringify(testResult)}`);
    this.testCount++;
    
    // Flush every 100 tests to avoid memory buildup
    if (this.testCount % 100 === 0) {
      this.outputStream.cork();
      process.nextTick(() => this.outputStream.uncork());
    }
  }
  
  async onEnd(result: FullResult): Promise<void> {
    this.outputStream.write('\n  ],\n');
    this.outputStream.write(`  "summary": {\n`);
    this.outputStream.write(`    "totalTests": ${this.testCount},\n`);
    this.outputStream.write(`    "status": "${result.status}",\n`);
    this.outputStream.write(`    "timestamp": ${Date.now()}\n`);
    this.outputStream.write('  }\n}\n');
    
    return new Promise((resolve) => {
      this.outputStream.end(resolve);
    });
  }
  
  private initializeJsonStream(): void {
    this.jsonStream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        callback(null, JSON.stringify(chunk) + '\n');
      }
    });
    
    this.jsonStream.pipe(this.outputStream);
  }
}
```

---

## Troubleshooting Common Issues

### Reporter Configuration Issues

**Problem**: Multiple reporters not generating all outputs
```typescript
// ❌ Incorrect - missing array wrapper
reporter: 'html', 'junit'

// ✅ Correct - proper array format
reporter: [
  ['html', { outputFolder: 'html-report' }],
  ['junit', { outputFile: 'junit-results.xml' }]
]
```

**Problem**: Custom reporter not being loaded
```typescript
// ❌ Incorrect path resolution
reporter: ['./reporters/custom-reporter']

// ✅ Correct - explicit file extension
reporter: ['./reporters/custom-reporter.ts']

// ✅ Alternative - use require.resolve
reporter: [require.resolve('./reporters/custom-reporter')]
```

### Performance Issues

**Problem**: Large HTML reports causing browser crashes
```typescript
// ✅ Solution - limit artifacts and optimize settings
export default defineConfig({
  reporter: [
    ['html', {
      outputFolder: 'reports/html',
      open: 'never',
      attachments: {
        mode: 'on-failure', // Reduce artifact volume
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      }
    }]
  ],
  
  use: {
    // Optimize media capture
    screenshot: { mode: 'only-on-failure', fullPage: false },
    video: { mode: 'retain-on-failure', size: { width: 1280, height: 720 } }
  }
});
```

### Integration Problems

**Problem**: JUnit reporter not showing in CI/CD
```yaml
# ✅ Ensure proper test result publishing
- name: Publish Test Results
  uses: dorny/test-reporter@v1
  if: always() # Run even if tests fail
  with:
    name: Playwright Tests
    path: 'test-results/junit-results.xml'
    reporter: java-junit
    fail-on-error: true
```

---

## Summary

This lesson covered comprehensive Playwright reporting strategies:

### Key Takeaways:
1. **Built-in Reporters**: HTML, JUnit, JSON, and Line reporters serve different purposes
2. **Multi-Reporter Configurations**: Combine reporters for different stakeholder needs
3. **Custom Reporter Development**: Create specialized reporting solutions using the Reporter API
4. **Enterprise Integration**: Send metrics to monitoring systems and dashboards
5. **Performance Optimization**: Use streaming and worker threads for large-scale reporting
6. **Troubleshooting**: Common configuration and performance issues

### Best Practices:
- Use environment-specific reporter configurations
- Implement error handling and retry logic in custom reporters
- Optimize media capture settings for performance
- Archive historical data for trend analysis
- Provide multiple report formats for different audiences

### Next Steps:
- Practice configuring multiple reporters
- Develop custom reporters for specific organizational needs
- Integrate reporting with monitoring and alerting systems
- Implement performance optimizations for large test suites

Effective reporting transforms test execution from a technical process into actionable business intelligence, enabling data-driven decisions and continuous improvement in software quality.