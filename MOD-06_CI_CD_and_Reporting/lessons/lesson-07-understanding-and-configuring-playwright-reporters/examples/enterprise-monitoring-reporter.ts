/**
 * Enterprise Monitoring Reporter Example
 * Demonstrates integration with enterprise monitoring systems (DataDog, New Relic, etc.)
 */

import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

interface MonitoringReporterOptions {
  // DataDog configuration
  dataDog?: {
    apiKey: string;
    apiHost?: string;
    service: string;
    environment: string;
    tags?: string[];
  };
  
  // New Relic configuration
  newRelic?: {
    licenseKey: string;
    apiEndpoint?: string;
    applicationId: string;
  };
  
  // Custom webhook for internal monitoring
  webhook?: {
    url: string;
    headers?: Record<string, string>;
    auth?: {
      type: 'bearer' | 'basic';
      token: string;
    };
  };
  
  // General settings
  batchSize?: number;
  flushInterval?: number;
  enablePerformanceMetrics?: boolean;
}

interface TestMetric {
  timestamp: number;
  testName: string;
  projectName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  retries: number;
  browser: string;
  platform: string;
  environment: string;
  tags: string[];
  errors?: string[];
}

class EnterpriseMonitoringReporter implements Reporter {
  private options: MonitoringReporterOptions;
  private metrics: TestMetric[] = [];
  private startTime: number = 0;
  private batchTimer?: NodeJS.Timeout;

  constructor(options: MonitoringReporterOptions) {
    this.options = {
      batchSize: 50,
      flushInterval: 30000, // 30 seconds
      enablePerformanceMetrics: true,
      ...options
    };
    
    // Start batch timer for periodic flushing
    if (this.options.flushInterval && this.options.flushInterval > 0) {
      this.batchTimer = setInterval(() => {
        this.flushMetrics();
      }, this.options.flushInterval);
    }
  }

  onBegin(config: any, suite: any): void {
    this.startTime = Date.now();
    console.log('🔧 Enterprise Monitoring Reporter initialized');
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const metric: TestMetric = {
      timestamp: Date.now(),
      testName: test.title,
      projectName: test.project()?.name || 'default',
      status: result.status as 'passed' | 'failed' | 'skipped',
      duration: result.duration,
      retries: result.retry,
      browser: this.getBrowserName(test),
      platform: process.platform,
      environment: this.getEnvironment(),
      tags: this.getTestTags(test),
      errors: result.errors.map(error => error.message)
    };
    
    this.metrics.push(metric);
    
    // Flush if batch size reached
    if (this.metrics.length >= (this.options.batchSize || 50)) {
      this.flushMetrics();
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    // Final flush of all metrics
    await this.flushMetrics();
    
    // Clean up timer
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
    
    console.log('📊 Enterprise monitoring data sent successfully');
  }

  private async flushMetrics(): Promise<void> {
    if (this.metrics.length === 0) return;
    
    const promises: Promise<void>[] = [];
    
    // Send to DataDog
    if (this.options.dataDog) {
      promises.push(this.sendToDataDog());
    }
    
    // Send to New Relic
    if (this.options.newRelic) {
      promises.push(this.sendToNewRelic());
    }
    
    // Send to webhook
    if (this.options.webhook) {
      promises.push(this.sendToWebhook());
    }
    
    try {
      await Promise.all(promises);
      this.metrics = []; // Clear metrics after successful send
    } catch (error) {
      console.error('❌ Failed to send monitoring data:', error);
    }
  }

  private async sendToDataDog(): Promise<void> {
    const { dataDog } = this.options;
    if (!dataDog) return;
    
    const series = this.metrics.map(metric => ({
      metric: 'playwright.test.duration',
      points: [[metric.timestamp / 1000, metric.duration]],
      tags: [
        `test:${metric.testName}`,
        `status:${metric.status}`,
        `browser:${metric.browser}`,
        `project:${metric.projectName}`,
        `environment:${metric.environment}`,
        ...(dataDog.tags || [])
      ]
    }));
    
    const payload = { series };
    
    const response = await fetch(`${dataDog.apiHost || 'https://api.datadoghq.com'}/api/v1/series`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': dataDog.apiKey
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`DataDog API error: ${response.status}`);
    }
  }

  private async sendToNewRelic(): Promise<void> {
    const { newRelic } = this.options;
    if (!newRelic) return;
    
    const events = this.metrics.map(metric => ({
      eventType: 'PlaywrightTest',
      timestamp: metric.timestamp,
      testName: metric.testName,
      projectName: metric.projectName,
      status: metric.status,
      duration: metric.duration,
      retries: metric.retries,
      browser: metric.browser,
      platform: metric.platform,
      environment: metric.environment
    }));
    
    const response = await fetch(`${newRelic.apiEndpoint || 'https://insights-collector.newrelic.com'}/v1/accounts/${newRelic.applicationId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-License-Key': newRelic.licenseKey
      },
      body: JSON.stringify(events)
    });
    
    if (!response.ok) {
      throw new Error(`New Relic API error: ${response.status}`);
    }
  }

  private async sendToWebhook(): Promise<void> {
    const { webhook } = this.options;
    if (!webhook) return;
    
    const payload = {
      timestamp: Date.now(),
      testMetrics: this.metrics,
      summary: {
        total: this.metrics.length,
        passed: this.metrics.filter(m => m.status === 'passed').length,
        failed: this.metrics.filter(m => m.status === 'failed').length,
        skipped: this.metrics.filter(m => m.status === 'skipped').length
      }
    };
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...webhook.headers
    };
    
    // Add authentication if configured
    if (webhook.auth) {
      if (webhook.auth.type === 'bearer') {
        headers['Authorization'] = `Bearer ${webhook.auth.token}`;
      } else if (webhook.auth.type === 'basic') {
        headers['Authorization'] = `Basic ${Buffer.from(webhook.auth.token).toString('base64')}`;
      }
    }
    
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }
  }

  private getBrowserName(test: TestCase): string {
    return test.project()?.use?.browserName || 'unknown';
  }

  private getEnvironment(): string {
    return process.env.ENVIRONMENT || process.env.NODE_ENV || 'test';
  }

  private getTestTags(test: TestCase): string[] {
    const tags: string[] = [];
    
    // Add tags from test file path
    const filePath = test.location.file;
    if (filePath.includes('/api/')) tags.push('api');
    if (filePath.includes('/e2e/')) tags.push('e2e');
    if (filePath.includes('/smoke/')) tags.push('smoke');
    if (filePath.includes('/regression/')) tags.push('regression');
    
    return tags;
  }
}

export default EnterpriseMonitoringReporter;

/**
 * Usage Examples:
 * 
 * 1. DataDog integration:
 * 
 * reporter: [
 *   ['./reporters/enterprise-monitoring-reporter.ts', {
 *     dataDog: {
 *       apiKey: process.env.DATADOG_API_KEY,
 *       service: 'playwright-tests',
 *       environment: process.env.ENVIRONMENT,
 *       tags: ['team:qa', 'service:web-app']
 *     }
 *   }]
 * ]
 * 
 * 2. Multi-platform monitoring:
 * 
 * reporter: [
 *   ['./reporters/enterprise-monitoring-reporter.ts', {
 *     dataDog: {
 *       apiKey: process.env.DATADOG_API_KEY,
 *       service: 'playwright-tests',
 *       environment: process.env.ENVIRONMENT
 *     },
 *     newRelic: {
 *       licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
 *       applicationId: process.env.NEW_RELIC_APP_ID
 *     }
 *   }]
 * ]
 */