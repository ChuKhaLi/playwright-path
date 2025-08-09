// MOD-04 Lesson 09: Multi-Platform Reporting Orchestration
// Example: Comprehensive integration with multiple reporting platforms

import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import axios, { AxiosInstance } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

// Configuration interfaces for all supported platforms
interface ReportingPlatformConfig {
  enabled: boolean;
  priority: number; // 1-10, higher means more critical
  retries: number;
  timeout: number;
}

interface AllureConfig extends ReportingPlatformConfig {
  outputFolder: string;
  serverUrl?: string;
  projectId?: string;
  autoUpload?: boolean;
}

interface TestRailConfig extends ReportingPlatformConfig {
  baseUrl: string;
  username: string;
  apiKey: string;
  projectId: number;
  suiteId?: number;
  milestoneId?: number;
  createRun: boolean;
}

interface JiraConfig extends ReportingPlatformConfig {
  baseUrl: string;
  username: string;
  apiToken: string;
  projectKey: string;
  createIssues: boolean;
  updateIssues: boolean;
}

interface SlackConfig extends ReportingPlatformConfig {
  botToken: string;
  channel: string;
  mentionOnFailure?: string[];
  realTimeUpdates: boolean;
  threadedReports: boolean;
}

interface TeamsConfig extends ReportingPlatformConfig {
  webhookUrl: string;
  mentionOnFailure?: string[];
  includeScreenshots: boolean;
}

interface ReportPortalConfig extends ReportingPlatformConfig {
  endpoint: string;
  token: string;
  project: string;
  launch: string;
  mode?: 'DEBUG' | 'DEFAULT';
}

interface CustomWebhookConfig extends ReportingPlatformConfig {
  urls: string[];
  headers?: Record<string, string>;
  method: 'POST' | 'PUT';
  payload_template?: string;
}

// Main orchestration configuration
interface OrchestratedReporterConfig {
  allure?: AllureConfig;
  testRail?: TestRailConfig;
  jira?: JiraConfig;
  slack?: SlackConfig;
  teams?: TeamsConfig;
  reportPortal?: ReportPortalConfig;
  customWebhooks?: CustomWebhookConfig;
  
  // Global settings
  parallelExecution: boolean;
  failFast: boolean; // Stop on first critical platform failure
  healthCheck: boolean; // Test platform connectivity before starting
  summaryReport: boolean; // Generate consolidated summary
  backupStorage: {
    enabled: boolean;
    path: string;
    compress: boolean;
  };
}

// Test execution summary interface
interface TestExecutionSummary {
  testRunId: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  passRate: number;
  environment: string;
  browser: string;
  buildNumber: string;
  gitBranch: string;
  gitCommit: string;
  failedTests: Array<{
    title: string;
    error: string;
    duration: number;
    file: string;
    line?: number;
  }>;
  performanceMetrics: {
    averageTestDuration: number;
    slowestTest: { title: string; duration: number };
    fastestTest: { title: string; duration: number };
  };
  platformResults: Record<string, {
    success: boolean;
    error?: string;
    responseTime: number;
    dataUploaded: boolean;
  }>;
}

/**
 * Abstract base class for reporting platform integrations
 */
abstract class ReportingPlatform {
  protected config: ReportingPlatformConfig;
  protected client?: AxiosInstance;
  
  constructor(
    public readonly name: string,
    config: ReportingPlatformConfig
  ) {
    this.config = config;
  }
  
  abstract initialize(): Promise<void>;
  abstract healthCheck(): Promise<boolean>;
  abstract onTestBegin?(test: TestCase): Promise<void>;
  abstract onTestEnd?(test: TestCase, result: TestResult): Promise<void>;
  abstract onRunComplete(summary: TestExecutionSummary): Promise<void>;
  abstract cleanup(): Promise<void>;
  
  protected async withRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.retries + 1; attempt++) {
      try {
        return await Promise.race([
          operation(),
          this.timeoutPromise()
        ]);
      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️ ${this.name} ${context} attempt ${attempt} failed:`, error);
        
        if (attempt <= this.config.retries) {
          await this.delay(Math.pow(2, attempt - 1) * 1000); // Exponential backoff
        }
      }
    }
    
    throw new Error(`${this.name} ${context} failed after ${this.config.retries + 1} attempts: ${lastError.message}`);
  }
  
  private timeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${this.config.timeout}ms`));
      }, this.config.timeout);
    });
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Slack Integration Platform
 */
class SlackPlatform extends ReportingPlatform {
  private slackClient: AxiosInstance;
  private mainThreadTs?: string;
  
  constructor(config: SlackConfig) {
    super('Slack', config);
    this.slackClient = axios.create({
      baseURL: 'https://slack.com/api',
      headers: {
        'Authorization': `Bearer ${config.botToken}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  async initialize(): Promise<void> {
    console.log('🔵 Initializing Slack integration...');
    
    // Test authentication
    const response = await this.slackClient.get('/auth.test');
    if (!response.data.ok) {
      throw new Error(`Slack authentication failed: ${response.data.error}`);
    }
    
    console.log(`✅ Slack authenticated as ${response.data.user}`);
  }
  
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.slackClient.get('/auth.test');
      return response.data.ok;
    } catch (error) {
      console.error('❌ Slack health check failed:', error);
      return false;
    }
  }
  
  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {
    const config = this.config as SlackConfig;
    
    if (!config.realTimeUpdates || result.status === 'passed') {
      return;
    }
    
    await this.withRetry(async () => {
      if (result.status === 'failed') {
        await this.sendFailureAlert(test, result);\n      }\n    }, 'test failure notification');\n  }\n  \n  async onRunComplete(summary: TestExecutionSummary): Promise<void> {\n    await this.withRetry(async () => {\n      await this.sendTestSummary(summary);\n    }, 'test summary');\n  }\n  \n  async cleanup(): Promise<void> {\n    // No cleanup needed for Slack\n  }\n  \n  private async sendFailureAlert(test: TestCase, result: TestResult): Promise<void> {\n    const config = this.config as SlackConfig;\n    \n    const message = {\n      channel: config.channel,\n      thread_ts: config.threadedReports ? this.mainThreadTs : undefined,\n      text: `🔴 Test failed: ${test.title}`,\n      blocks: [\n        {\n          type: 'section',\n          text: {\n            type: 'mrkdwn',\n            text: `*🔴 Test Failed*\\n*Test:* ${test.title}\\n*Error:* \\`${result.error?.message || 'Unknown error'}\\`\\n*Duration:* ${Math.round((result.duration || 0) / 1000)}s`\n          }\n        }\n      ]\n    };\n    \n    const response = await this.slackClient.post('/chat.postMessage', message);\n    \n    if (!response.data.ok) {\n      throw new Error(`Failed to send Slack message: ${response.data.error}`);\n    }\n    \n    // Send screenshot if available\n    const screenshot = result.attachments?.find(a => a.name === 'screenshot');\n    if (screenshot && config.includeScreenshots) {\n      await this.uploadScreenshot(screenshot, response.data.ts);\n    }\n  }\n  \n  private async sendTestSummary(summary: TestExecutionSummary): Promise<void> {\n    const config = this.config as SlackConfig;\n    const emoji = summary.failed > 0 ? '❌' : '✅';\n    const color = summary.failed > 0 ? 'danger' : 'good';\n    \n    let mentionText = '';\n    if (summary.failed > 0 && config.mentionOnFailure) {\n      mentionText = config.mentionOnFailure.map(user => `<@${user}>`).join(' ') + ' ';\n    }\n    \n    const message = {\n      channel: config.channel,\n      text: `${mentionText}Test run completed: ${summary.passed}/${summary.totalTests} tests passed (${summary.passRate.toFixed(1)}%)`,\n      attachments: [\n        {\n          color,\n          blocks: [\n            {\n              type: 'header',\n              text: {\n                type: 'plain_text',\n                text: `${emoji} Test Execution Summary`\n              }\n            },\n            {\n              type: 'section',\n              fields: [\n                { type: 'mrkdwn', text: `*Total Tests:* ${summary.totalTests}` },\n                { type: 'mrkdwn', text: `*Passed:* ${summary.passed}` },\n                { type: 'mrkdwn', text: `*Failed:* ${summary.failed}` },\n                { type: 'mrkdwn', text: `*Skipped:* ${summary.skipped}` },\n                { type: 'mrkdwn', text: `*Pass Rate:* ${summary.passRate.toFixed(1)}%` },\n                { type: 'mrkdwn', text: `*Duration:* ${this.formatDuration(summary.duration)}` },\n                { type: 'mrkdwn', text: `*Environment:* ${summary.environment}` },\n                { type: 'mrkdwn', text: `*Build:* ${summary.buildNumber}` }\n              ]\n            }\n          ]\n        }\n      ]\n    };\n    \n    // Add failed tests details if any\n    if (summary.failed > 0) {\n      const failureText = summary.failedTests\n        .slice(0, 5)\n        .map(f => `• ${f.title}: ${f.error}`)\n        .join('\\n');\n      \n      message.attachments[0].blocks.push({\n        type: 'section',\n        text: {\n          type: 'mrkdwn',\n          text: `*Failed Tests:*\\n${failureText}${summary.failedTests.length > 5 ? `\\n... and ${summary.failedTests.length - 5} more` : ''}`\n        }\n      });\n    }\n    \n    // Add performance metrics\n    message.attachments[0].blocks.push({\n      type: 'section',\n      text: {\n        type: 'mrkdwn',\n        text: `*Performance:*\\n• Avg Duration: ${Math.round(summary.performanceMetrics.averageTestDuration)}ms\\n• Slowest: ${summary.performanceMetrics.slowestTest.title} (${Math.round(summary.performanceMetrics.slowestTest.duration)}ms)\\n• Fastest: ${summary.performanceMetrics.fastestTest.title} (${Math.round(summary.performanceMetrics.fastestTest.duration)}ms)`\n      }\n    });\n    \n    const response = await this.slackClient.post('/chat.postMessage', message);\n    \n    if (!response.data.ok) {\n      throw new Error(`Failed to send Slack summary: ${response.data.error}`);\n    }\n    \n    this.mainThreadTs = response.data.ts;\n  }\n  \n  private async uploadScreenshot(attachment: any, threadTs: string): Promise<void> {\n    try {\n      const config = this.config as SlackConfig;\n      \n      const formData = new FormData();\n      formData.append('channels', config.channel);\n      formData.append('thread_ts', threadTs);\n      formData.append('file', new Blob([attachment.body]), 'screenshot.png');\n      formData.append('filename', 'screenshot.png');\n      formData.append('title', 'Test Failure Screenshot');\n      \n      await this.slackClient.post('/files.upload', formData, {\n        headers: {\n          'Content-Type': 'multipart/form-data'\n        }\n      });\n    } catch (error) {\n      console.warn('⚠️ Failed to upload screenshot to Slack:', error);\n    }\n  }\n  \n  private formatDuration(ms: number): string {\n    const minutes = Math.floor(ms / 60000);\n    const seconds = Math.floor((ms % 60000) / 1000);\n    return `${minutes}m ${seconds}s`;\n  }\n}\n\n/**\n * Microsoft Teams Integration Platform\n */\nclass TeamsPlatform extends ReportingPlatform {\n  private webhookUrl: string;\n  \n  constructor(config: TeamsConfig) {\n    super('Teams', config);\n    this.webhookUrl = config.webhookUrl;\n  }\n  \n  async initialize(): Promise<void> {\n    console.log('🔵 Initializing Teams integration...');\n    // Teams doesn't require authentication, just webhook validation\n  }\n  \n  async healthCheck(): Promise<boolean> {\n    try {\n      // Send a minimal test message to validate webhook\n      const testCard = {\n        type: 'message',\n        attachments: [{\n          contentType: 'application/vnd.microsoft.card.adaptive',\n          content: {\n            type: 'AdaptiveCard',\n            body: [{\n              type: 'TextBlock',\n              text: 'Health check',\n              size: 'Small'\n            }],\n            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',\n            version: '1.2'\n          }\n        }]\n      };\n      \n      const response = await axios.post(this.webhookUrl, testCard, {\n        timeout: 5000\n      });\n      \n      return response.status === 200;\n    } catch (error) {\n      console.error('❌ Teams health check failed:', error);\n      return false;\n    }\n  }\n  \n  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {\n    // Teams doesn't typically handle individual test updates\n    // Only send summary at the end\n  }\n  \n  async onRunComplete(summary: TestExecutionSummary): Promise<void> {\n    await this.withRetry(async () => {\n      await this.sendTestSummary(summary);\n    }, 'test summary');\n  }\n  \n  async cleanup(): Promise<void> {\n    // No cleanup needed for Teams\n  }\n  \n  private async sendTestSummary(summary: TestExecutionSummary): Promise<void> {\n    const config = this.config as TeamsConfig;\n    const color = summary.failed > 0 ? 'attention' : 'good';\n    const title = summary.failed > 0 ? '❌ Test Run Failed' : '✅ Test Run Passed';\n    \n    let mentionText = '';\n    if (summary.failed > 0 && config.mentionOnFailure) {\n      mentionText = config.mentionOnFailure.map(user => `<at>${user}</at>`).join(' ') + ' ';\n    }\n    \n    const card = {\n      type: 'message',\n      attachments: [{\n        contentType: 'application/vnd.microsoft.card.adaptive',\n        content: {\n          type: 'AdaptiveCard',\n          body: [\n            {\n              type: 'TextBlock',\n              size: 'Large',\n              weight: 'Bolder',\n              text: title,\n              color: color\n            },\n            {\n              type: 'TextBlock',\n              text: `${mentionText}Test execution completed`,\n              wrap: true\n            },\n            {\n              type: 'FactSet',\n              facts: [\n                { title: 'Total Tests', value: summary.totalTests.toString() },\n                { title: 'Passed', value: summary.passed.toString() },\n                { title: 'Failed', value: summary.failed.toString() },\n                { title: 'Skipped', value: summary.skipped.toString() },\n                { title: 'Pass Rate', value: `${summary.passRate.toFixed(1)}%` },\n                { title: 'Duration', value: this.formatDuration(summary.duration) },\n                { title: 'Environment', value: summary.environment },\n                { title: 'Build Number', value: summary.buildNumber },\n                { title: 'Git Branch', value: summary.gitBranch }\n              ]\n            }\n          ],\n          actions: [\n            {\n              type: 'Action.OpenUrl',\n              title: 'View Detailed Report',\n              url: `${process.env.REPORT_BASE_URL || 'http://localhost:9323'}`\n            }\n          ],\n          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',\n          version: '1.2'\n        }\n      }]\n    };\n    \n    // Add failed tests section if any\n    if (summary.failed > 0) {\n      const failureItems = summary.failedTests\n        .slice(0, 5)\n        .map(f => `• **${f.title}**: ${f.error.substring(0, 100)}${f.error.length > 100 ? '...' : ''}`);\n      \n      card.attachments[0].content.body.push({\n        type: 'TextBlock',\n        text: `**Failed Tests:**\\n${failureItems.join('\\n')}${summary.failedTests.length > 5 ? `\\n... and ${summary.failedTests.length - 5} more failures` : ''}`,\n        wrap: true\n      });\n    }\n    \n    const response = await axios.post(this.webhookUrl, card);\n    \n    if (response.status !== 200) {\n      throw new Error(`Teams webhook failed with status: ${response.status}`);\n    }\n  }\n  \n  private formatDuration(ms: number): string {\n    const minutes = Math.floor(ms / 60000);\n    const seconds = Math.floor((ms % 60000) / 1000);\n    return `${minutes}m ${seconds}s`;\n  }\n}\n\n/**\n * Custom Webhook Integration Platform\n */\nclass WebhookPlatform extends ReportingPlatform {\n  private webhookUrls: string[];\n  private headers: Record<string, string>;\n  private method: 'POST' | 'PUT';\n  private client: AxiosInstance;\n  \n  constructor(config: CustomWebhookConfig) {\n    super('Custom Webhooks', config);\n    this.webhookUrls = config.urls;\n    this.headers = config.headers || {};\n    this.method = config.method;\n    \n    this.client = axios.create({\n      headers: {\n        'Content-Type': 'application/json',\n        ...this.headers\n      }\n    });\n  }\n  \n  async initialize(): Promise<void> {\n    console.log(`🔵 Initializing ${this.webhookUrls.length} custom webhook(s)...`);\n  }\n  \n  async healthCheck(): Promise<boolean> {\n    try {\n      const healthCheckPromises = this.webhookUrls.map(async (url) => {\n        try {\n          const response = await this.client.head(url, { timeout: 5000 });\n          return response.status < 400;\n        } catch (error) {\n          console.warn(`⚠️ Webhook health check failed for ${url}:`, error);\n          return false;\n        }\n      });\n      \n      const results = await Promise.all(healthCheckPromises);\n      return results.some(result => result); // At least one webhook should be healthy\n    } catch (error) {\n      console.error('❌ Webhook health check failed:', error);\n      return false;\n    }\n  }\n  \n  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {\n    // Only send failed test notifications to avoid spam\n    if (result.status === 'failed') {\n      await this.withRetry(async () => {\n        await this.sendTestFailure(test, result);\n      }, 'test failure notification');\n    }\n  }\n  \n  async onRunComplete(summary: TestExecutionSummary): Promise<void> {\n    await this.withRetry(async () => {\n      await this.sendTestSummary(summary);\n    }, 'test summary');\n  }\n  \n  async cleanup(): Promise<void> {\n    // No cleanup needed for webhooks\n  }\n  \n  private async sendTestFailure(test: TestCase, result: TestResult): Promise<void> {\n    const payload = {\n      event: 'test_failed',\n      timestamp: new Date().toISOString(),\n      test: {\n        title: test.title,\n        file: test.location?.file,\n        line: test.location?.line,\n        duration: result.duration,\n        error: result.error?.message,\n        stack: result.error?.stack\n      },\n      environment: {\n        browser: process.env.BROWSER_NAME || 'chromium',\n        os: process.platform,\n        nodeVersion: process.version,\n        buildNumber: process.env.BUILD_NUMBER || 'local',\n        gitBranch: process.env.GIT_BRANCH || 'main',\n        gitCommit: process.env.GIT_COMMIT || 'unknown'\n      }\n    };\n    \n    await this.sendToWebhooks(payload);\n  }\n  \n  private async sendTestSummary(summary: TestExecutionSummary): Promise<void> {\n    const payload = {\n      event: 'test_run_completed',\n      timestamp: new Date().toISOString(),\n      summary,\n      metadata: {\n        reportUrl: `${process.env.REPORT_BASE_URL || 'http://localhost:9323'}`,\n        ciUrl: process.env.CI_BUILD_URL,\n        triggeredBy: process.env.CI_TRIGGERED_BY || process.env.USER || 'unknown'\n      }\n    };\n    \n    await this.sendToWebhooks(payload);\n  }\n  \n  private async sendToWebhooks(payload: any): Promise<void> {\n    const promises = this.webhookUrls.map(async (url) => {\n      try {\n        const response = await this.client.request({\n          method: this.method,\n          url,\n          data: payload\n        });\n        \n        console.log(`✅ Webhook sent successfully to ${url}: ${response.status}`);\n        return { url, success: true, status: response.status };\n      } catch (error) {\n        console.error(`❌ Webhook failed for ${url}:`, error);\n        return { url, success: false, error: error.message };\n      }\n    });\n    \n    const results = await Promise.all(promises);\n    const successCount = results.filter(r => r.success).length;\n    \n    if (successCount === 0) {\n      throw new Error('All webhook deliveries failed');\n    }\n    \n    console.log(`📡 Webhooks delivered: ${successCount}/${this.webhookUrls.length} successful`);\n  }\n}\n\n/**\n * Main Orchestrated Reporter\n * Coordinates multiple reporting platforms with error handling and performance monitoring\n */\nexport class OrchestratedReporter implements Reporter {\n  private platforms: ReportingPlatform[] = [];\n  private config: OrchestratedReporterConfig;\n  private startTime: Date = new Date();\n  private testResults: Array<{ test: TestCase; result: TestResult }> = [];\n  private platformPerformance: Record<string, { calls: number; totalTime: number; errors: number }> = {};\n  \n  constructor(config: OrchestratedReporterConfig) {\n    this.config = config;\n    this.initializePlatforms();\n  }\n  \n  private initializePlatforms(): void {\n    console.log('🚀 Initializing orchestrated reporting platforms...');\n    \n    // Initialize platforms based on configuration\n    if (this.config.slack?.enabled) {\n      this.platforms.push(new SlackPlatform(this.config.slack));\n    }\n    \n    if (this.config.teams?.enabled) {\n      this.platforms.push(new TeamsPlatform(this.config.teams));\n    }\n    \n    if (this.config.customWebhooks?.enabled) {\n      this.platforms.push(new WebhookPlatform(this.config.customWebhooks));\n    }\n    \n    // Sort platforms by priority (higher priority first)\n    this.platforms.sort((a, b) => b.config.priority - a.config.priority);\n    \n    console.log(`📋 Initialized ${this.platforms.length} reporting platforms`);\n    \n    // Initialize performance tracking\n    this.platforms.forEach(platform => {\n      this.platformPerformance[platform.name] = {\n        calls: 0,\n        totalTime: 0,\n        errors: 0\n      };\n    });\n  }\n  \n  async onBegin(): Promise<void> {\n    console.log('🎬 Starting orchestrated test reporting...');\n    \n    if (this.config.healthCheck) {\n      await this.performHealthChecks();\n    }\n    \n    await this.executeOnPlatforms(async (platform) => {\n      await platform.initialize();\n    }, 'initialization');\n    \n    // Backup configuration if enabled\n    if (this.config.backupStorage.enabled) {\n      await this.backupConfiguration();\n    }\n  }\n  \n  async onTestBegin(test: TestCase): Promise<void> {\n    await this.executeOnPlatforms(async (platform) => {\n      if (platform.onTestBegin) {\n        await platform.onTestBegin(test);\n      }\n    }, 'test begin', false); // Non-critical operation\n  }\n  \n  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {\n    // Store result for summary generation\n    this.testResults.push({ test, result });\n    \n    await this.executeOnPlatforms(async (platform) => {\n      if (platform.onTestEnd) {\n        await platform.onTestEnd(test, result);\n      }\n    }, 'test end', false); // Non-critical operation\n  }\n  \n  async onEnd(result: FullResult): Promise<void> {\n    console.log('🏁 Finalizing orchestrated test reporting...');\n    \n    try {\n      // Generate comprehensive summary\n      const summary = this.generateTestExecutionSummary(result);\n      \n      // Send summary to all platforms\n      await this.executeOnPlatforms(async (platform) => {\n        await platform.onRunComplete(summary);\n      }, 'run completion');\n      \n      // Generate performance report\n      await this.generatePerformanceReport();\n      \n      // Backup results if enabled\n      if (this.config.backupStorage.enabled) {\n        await this.backupResults(summary);\n      }\n      \n      console.log('✅ Orchestrated reporting completed successfully');\n      \n    } finally {\n      // Cleanup all platforms\n      await this.executeOnPlatforms(async (platform) => {\n        await platform.cleanup();\n      }, 'cleanup', false);\n    }\n  }\n  \n  private async executeOnPlatforms(\n    operation: (platform: ReportingPlatform) => Promise<void>,\n    operationName: string,\n    critical: boolean = true\n  ): Promise<void> {\n    const promises = this.platforms.map(async (platform) => {\n      const startTime = Date.now();\n      const perfData = this.platformPerformance[platform.name];\n      \n      try {\n        perfData.calls++;\n        await operation(platform);\n        \n        const duration = Date.now() - startTime;\n        perfData.totalTime += duration;\n        \n        console.log(`✅ ${platform.name} ${operationName} completed in ${duration}ms`);\n        \n      } catch (error) {\n        perfData.errors++;\n        \n        const duration = Date.now() - startTime;\n        perfData.totalTime += duration;\n        \n        console.error(`❌ ${platform.name} ${operationName} failed:`, error);\n        \n        if (critical && this.config.failFast && platform.config.priority >= 8) {\n          throw new Error(`Critical platform ${platform.name} failed: ${error.message}`);\n        }\n      }\n    });\n    \n    if (this.config.parallelExecution) {\n      await Promise.allSettled(promises);\n    } else {\n      // Execute sequentially for better error handling\n      for (const promise of promises) {\n        await promise.catch(() => {}); // Swallow errors for non-critical operations\n      }\n    }\n  }\n  \n  private async performHealthChecks(): Promise<void> {\n    console.log('🏥 Performing platform health checks...');\n    \n    const healthPromises = this.platforms.map(async (platform) => {\n      try {\n        const isHealthy = await platform.healthCheck();\n        console.log(`${isHealthy ? '✅' : '❌'} ${platform.name} health check: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);\n        return { platform: platform.name, healthy: isHealthy };\n      } catch (error) {\n        console.error(`❌ ${platform.name} health check failed:`, error);\n        return { platform: platform.name, healthy: false };\n      }\n    });\n    \n    const healthResults = await Promise.all(healthPromises);\n    const unhealthyPlatforms = healthResults.filter(r => !r.healthy);\n    \n    if (unhealthyPlatforms.length > 0) {\n      console.warn(`⚠️ ${unhealthyPlatforms.length} platform(s) are unhealthy:`, unhealthyPlatforms.map(p => p.platform).join(', '));\n      \n      if (this.config.failFast) {\n        const criticalUnhealthy = unhealthyPlatforms.filter(p => {\n          const platform = this.platforms.find(pl => pl.name === p.platform);\n          return platform && platform.config.priority >= 8;\n        });\n        \n        if (criticalUnhealthy.length > 0) {\n          throw new Error(`Critical platforms are unhealthy: ${criticalUnhealthy.map(p => p.platform).join(', ')}`);\n        }\n      }\n    }\n  }\n  \n  private generateTestExecutionSummary(result: FullResult): TestExecutionSummary {\n    const endTime = new Date();\n    const passed = this.testResults.filter(r => r.result.status === 'passed').length;\n    const failed = this.testResults.filter(r => r.result.status === 'failed').length;\n    const skipped = this.testResults.filter(r => r.result.status === 'skipped').length;\n    const flaky = this.testResults.filter(r => r.result.status === 'flaky').length;\n    \n    const failedTests = this.testResults\n      .filter(r => r.result.status === 'failed')\n      .map(r => ({\n        title: r.test.title,\n        error: r.result.error?.message || 'Unknown error',\n        duration: r.result.duration || 0,\n        file: r.test.location?.file || 'unknown',\n        line: r.test.location?.line\n      }));\n    \n    const durations = this.testResults.map(r => r.result.duration || 0);\n    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;\n    const slowestTest = this.testResults.reduce((slowest, current) => \n      (current.result.duration || 0) > (slowest.result.duration || 0) ? current : slowest\n    );\n    const fastestTest = this.testResults.reduce((fastest, current) => \n      (current.result.duration || 0) < (fastest.result.duration || 0) ? current : fastest\n    );\n    \n    return {\n      testRunId: `run-${Date.now()}`,\n      startTime: this.startTime.toISOString(),\n      endTime: endTime.toISOString(),\n      duration: endTime.getTime() - this.startTime.getTime(),\n      totalTests: this.testResults.length,\n      passed,\n      failed,\n      skipped,\n      flaky,\n      passRate: this.testResults.length > 0 ? (passed / this.testResults.length) * 100 : 0,\n      environment: process.env.NODE_ENV || 'test',\n      browser: process.env.BROWSER_NAME || 'chromium',\n      buildNumber: process.env.BUILD_NUMBER || 'local',\n      gitBranch: process.env.GIT_BRANCH || 'main',\n      gitCommit: process.env.GIT_COMMIT || 'unknown',\n      failedTests,\n      performanceMetrics: {\n        averageTestDuration: avgDuration,\n        slowestTest: {\n          title: slowestTest.test.title,\n          duration: slowestTest.result.duration || 0\n        },\n        fastestTest: {\n          title: fastestTest.test.title,\n          duration: fastestTest.result.duration || 0\n        }\n      },\n      platformResults: Object.fromEntries(\n        this.platforms.map(platform => [\n          platform.name,\n          {\n            success: this.platformPerformance[platform.name].errors === 0,\n            error: this.platformPerformance[platform.name].errors > 0 ? 'Multiple errors occurred' : undefined,\n            responseTime: this.platformPerformance[platform.name].totalTime / Math.max(1, this.platformPerformance[platform.name].calls),\n            dataUploaded: this.platformPerformance[platform.name].calls > 0\n          }\n        ])\n      )\n    };\n  }\n  \n  private async generatePerformanceReport(): Promise<void> {\n    console.log('📊 Generating platform performance report...');\n    \n    const performanceReport = {\n      timestamp: new Date().toISOString(),\n      platforms: Object.entries(this.platformPerformance).map(([name, data]) => ({\n        name,\n        totalCalls: data.calls,\n        totalTime: data.totalTime,\n        averageTime: data.calls > 0 ? data.totalTime / data.calls : 0,\n        errorCount: data.errors,\n        successRate: data.calls > 0 ? ((data.calls - data.errors) / data.calls) * 100 : 0\n      }))\n    };\n    \n    console.table(performanceReport.platforms);\n    \n    // Save performance report\n    if (this.config.backupStorage.enabled) {\n      const reportPath = path.join(this.config.backupStorage.path, 'performance-report.json');\n      await fs.writeFile(reportPath, JSON.stringify(performanceReport, null, 2));\n    }\n  }\n  \n  private async backupConfiguration(): Promise<void> {\n    try {\n      const configBackup = {\n        timestamp: new Date().toISOString(),\n        config: {\n          ...this.config,\n          // Remove sensitive data\n          slack: this.config.slack ? { ...this.config.slack, botToken: '[REDACTED]' } : undefined,\n          testRail: this.config.testRail ? { ...this.config.testRail, apiKey: '[REDACTED]' } : undefined,\n          jira: this.config.jira ? { ...this.config.jira, apiToken: '[REDACTED]' } : undefined\n        },\n        platforms: this.platforms.map(p => p.name)\n      };\n      \n      const configPath = path.join(this.config.backupStorage.path, 'reporter-config-backup.json');\n      await fs.writeFile(configPath, JSON.stringify(configBackup, null, 2));\n      \n      console.log(`💾 Configuration backed up to ${configPath}`);\n    } catch (error) {\n      console.warn('⚠️ Failed to backup configuration:', error);\n    }\n  }\n  \n  private async backupResults(summary: TestExecutionSummary): Promise<void> {\n    try {\n      const backupPath = this.config.backupStorage.path;\n      \n      // Ensure backup directory exists\n      await fs.mkdir(backupPath, { recursive: true });\n      \n      // Save test summary\n      const summaryPath = path.join(backupPath, `test-summary-${summary.testRunId}.json`);\n      await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));\n      \n      // Save detailed test results\n      const resultsPath = path.join(backupPath, `test-results-${summary.testRunId}.json`);\n      await fs.writeFile(resultsPath, JSON.stringify(this.testResults, null, 2));\n      \n      // Compress if enabled\n      if (this.config.backupStorage.compress) {\n        // Implementation would add compression logic here\n        console.log('🗜️ Compression enabled but not implemented in this example');\n      }\n      \n      console.log(`💾 Test results backed up to ${backupPath}`);\n    } catch (error) {\n      console.warn('⚠️ Failed to backup test results:', error);\n    }\n  }\n}\n\n// Configuration factory functions\nexport function createOrchestratedReporterConfig(): OrchestratedReporterConfig {\n  return {\n    slack: process.env.SLACK_ENABLED === 'true' ? {\n      enabled: true,\n      priority: 7,\n      retries: 3,\n      timeout: 10000,\n      botToken: process.env.SLACK_BOT_TOKEN || '',\n      channel: process.env.SLACK_CHANNEL || '#qa-automation',\n      mentionOnFailure: process.env.SLACK_MENTION_ON_FAILURE?.split(','),\n      realTimeUpdates: process.env.SLACK_REAL_TIME_UPDATES === 'true',\n      threadedReports: process.env.SLACK_THREADED_REPORTS === 'true'\n    } : undefined,\n    \n    teams: process.env.TEAMS_ENABLED === 'true' ? {\n      enabled: true,\n      priority: 6,\n      retries: 3,\n      timeout: 10000,\n      webhookUrl: process.env.TEAMS_WEBHOOK_URL || '',\n      mentionOnFailure: process.env.TEAMS_MENTION_ON_FAILURE?.split(','),\n      includeScreenshots: process.env.TEAMS_INCLUDE_SCREENSHOTS === 'true'\n    } : undefined,\n    \n    customWebhooks: process.env.CUSTOM_WEBHOOKS_ENABLED === 'true' ? {\n      enabled: true,\n      priority: 5,\n      retries: 2,\n      timeout: 8000,\n      urls: process.env.CUSTOM_WEBHOOK_URLS?.split(',') || [],\n      method: 'POST',\n      headers: process.env.CUSTOM_WEBHOOK_HEADERS ? \n        JSON.parse(process.env.CUSTOM_WEBHOOK_HEADERS) : undefined\n    } : undefined,\n    \n    parallelExecution: process.env.PARALLEL_REPORTING === 'true',\n    failFast: process.env.REPORTING_FAIL_FAST === 'true',\n    healthCheck: process.env.REPORTING_HEALTH_CHECK !== 'false',\n    summaryReport: process.env.SUMMARY_REPORT !== 'false',\n    \n    backupStorage: {\n      enabled: process.env.BACKUP_ENABLED === 'true',\n      path: process.env.BACKUP_PATH || './test-backups',\n      compress: process.env.BACKUP_COMPRESS === 'true'\n    }\n  };\n}\n\n// Example usage configuration\nexport const exampleConfig: OrchestratedReporterConfig = {\n  slack: {\n    enabled: true,\n    priority: 8,\n    retries: 3,\n    timeout: 10000,\n    botToken: 'xoxb-your-bot-token',\n    channel: '#qa-automation',\n    mentionOnFailure: ['user1', 'user2'],\n    realTimeUpdates: true,\n    threadedReports: true\n  },\n  \n  teams: {\n    enabled: true,\n    priority: 7,\n    retries: 3,\n    timeout: 10000,\n    webhookUrl: 'https://company.webhook.office.com/webhookb2/...',\n    mentionOnFailure: ['QA Team'],\n    includeScreenshots: true\n  },\n  \n  customWebhooks: {\n    enabled: true,\n    priority: 6,\n    retries: 2,\n    timeout: 8000,\n    urls: [\n      'https://api.company.com/test-results',\n      'https://monitoring.company.com/webhooks/qa'\n    ],\n    method: 'POST',\n    headers: {\n      'Authorization': 'Bearer your-api-token',\n      'X-Source': 'playwright-tests'\n    }\n  },\n  \n  parallelExecution: true,\n  failFast: false,\n  healthCheck: true,\n  summaryReport: true,\n  \n  backupStorage: {\n    enabled: true,\n    path: './test-report-backups',\n    compress: true\n  }\n};\n