/**
 * Custom Slack Reporter Example
 * Demonstrates how to create a custom reporter that sends notifications to Slack
 */

import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

interface SlackReporterOptions {
  webhookUrl: string;
  channel?: string;
  username?: string;
  onlyOnFailures?: boolean;
  mentionOnFailures?: string[];
  includeScreenshots?: boolean;
  environment?: string;
}

class SlackReporter implements Reporter {
  private options: SlackReporterOptions;
  private failedTests: Array<{ test: TestCase; result: TestResult }> = [];
  private passedTests: number = 0;
  private skippedTests: number = 0;
  private startTime: number = 0;
  private testStats = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  };

  constructor(options: SlackReporterOptions) {
    this.options = {
      username: 'Playwright Bot',
      onlyOnFailures: false,
      includeScreenshots: true,
      environment: 'test',
      ...options
    };

    if (!this.options.webhookUrl) {
      throw new Error('Slack webhook URL is required');
    }
  }

  onBegin(config: any, suite: any): void {
    this.startTime = Date.now();
    this.testStats.total = suite.allTests().length;

    console.log(`🚀 Starting Slack reporter for ${this.testStats.total} tests`);

    // Send start notification (if not only on failures)
    if (!this.options.onlyOnFailures) {
      this.sendStartNotification(config, suite);
    }
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    switch (result.status) {
      case 'passed':
        this.testStats.passed++;
        break;
      case 'failed':
        this.testStats.failed++;
        this.failedTests.push({ test, result });
        break;
      case 'skipped':
        this.testStats.skipped++;
        break;
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    const duration = Date.now() - this.startTime;

    // Skip notification if only failures requested and no failures occurred
    if (this.options.onlyOnFailures && this.failedTests.length === 0) {
      console.log('✅ No failures to report to Slack');
      return;
    }

    try {
      await this.sendSummaryNotification(result, duration);
      
      // Send detailed failure notifications if there are failures
      if (this.failedTests.length > 0) {
        await this.sendFailureDetails();
      }

      console.log('📬 Slack notifications sent successfully');
    } catch (error) {
      console.error('❌ Failed to send Slack notifications:', error);
    }
  }

  private async sendStartNotification(config: any, suite: any): Promise<void> {
    const message = {
      text: '🚀 Playwright Test Execution Started',
      username: this.options.username,
      channel: this.options.channel,
      attachments: [{
        color: 'good',
        title: `Test Execution Started - ${this.options.environment}`,
        fields: [
          {
            title: 'Total Tests',
            value: this.testStats.total.toString(),
            short: true
          },
          {
            title: 'Projects',
            value: config.projects.map((p: any) => p.name).join(', '),
            short: true
          },
          {
            title: 'Environment',
            value: this.options.environment || 'Unknown',
            short: true
          },
          {
            title: 'Started At',
            value: new Date().toLocaleString(),
            short: true
          }
        ],
        footer: 'Playwright Test Reporter',
        ts: Math.floor(Date.now() / 1000)
      }]
    };

    await this.sendToSlack(message);
  }

  private async sendSummaryNotification(result: FullResult, duration: number): Promise<void> {
    const status = this.testStats.failed > 0 ? 'failed' : 'passed';
    const color = this.getStatusColor(status);
    const emoji = this.getStatusEmoji(status);
    
    // Calculate pass rate
    const passRate = this.testStats.total > 0 
      ? (this.testStats.passed / this.testStats.total * 100).toFixed(1)
      : '0';

    // Add mentions for failures
    let mentions = '';
    if (status === 'failed' && this.options.mentionOnFailures?.length) {
      mentions = this.options.mentionOnFailures.map(user => `<@${user}>`).join(' ') + ' ';
    }

    const message = {
      text: `${emoji} ${mentions}Playwright Test Execution ${status.toUpperCase()}`,
      username: this.options.username,
      channel: this.options.channel,
      attachments: [{
        color,
        title: `Test Results Summary - ${this.options.environment}`,
        fields: [
          {
            title: 'Total Tests',
            value: this.testStats.total.toString(),
            short: true
          },
          {
            title: 'Passed',
            value: `${this.testStats.passed} ✅`,
            short: true
          },
          {
            title: 'Failed',
            value: `${this.testStats.failed} ❌`,
            short: true
          },
          {
            title: 'Skipped',
            value: `${this.testStats.skipped} ⏭️`,
            short: true
          },
          {
            title: 'Pass Rate',
            value: `${passRate}%`,
            short: true
          },
          {
            title: 'Duration',
            value: this.formatDuration(duration),
            short: true
          }
        ],
        footer: 'Playwright Test Reporter',
        ts: Math.floor(Date.now() / 1000)
      }]
    };

    // Add failure summary if there are failures
    if (this.testStats.failed > 0) {
      message.attachments.push({
        color: 'danger',
        title: '⚠️ Failure Summary',
        text: `${this.testStats.failed} test(s) failed. See detailed report below.`,
        fields: this.getTopFailureProjects()
      });
    }

    await this.sendToSlack(message);
  }

  private async sendFailureDetails(): Promise<void> {
    // Group failures by project for better organization
    const failuresByProject = this.groupFailuresByProject();

    for (const [projectName, failures] of failuresByProject.entries()) {
      const attachment = {
        color: 'danger',
        title: `❌ Failed Tests in "${projectName}"`,
        fields: [] as any[],
        text: ''
      };

      // Show up to 5 failures per project to avoid message length limits
      const failuresToShow = failures.slice(0, 5);
      
      for (const { test, result } of failuresToShow) {
        const errorMessage = result.errors[0]?.message || 'Unknown error';
        const truncatedError = errorMessage.length > 200 
          ? errorMessage.substring(0, 200) + '...'
          : errorMessage;

        attachment.fields.push(
          {
            title: `🔍 ${test.title}`,
            value: `\`\`\`${truncatedError}\`\`\``,
            short: false
          },
          {
            title: 'Duration',
            value: `${result.duration}ms`,
            short: true
          },
          {
            title: 'Retries',
            value: result.retry.toString(),
            short: true
          }
        );
      }

      // Add note if there are more failures
      if (failures.length > 5) {
        attachment.text = `Showing 5 of ${failures.length} failures. See full report for details.`;
      }

      const message = {
        username: this.options.username,
        channel: this.options.channel,
        attachments: [attachment]
      };

      await this.sendToSlack(message);
      
      // Small delay between messages to avoid rate limiting
      await this.sleep(500);
    }
  }

  private groupFailuresByProject(): Map<string, Array<{ test: TestCase; result: TestResult }>> {
    const groups = new Map();

    for (const failure of this.failedTests) {
      const projectName = failure.test.project()?.name || 'Default Project';
      
      if (!groups.has(projectName)) {
        groups.set(projectName, []);
      }
      
      groups.get(projectName).push(failure);
    }

    return groups;
  }

  private getTopFailureProjects(): any[] {
    const projectCounts = new Map();
    
    for (const { test } of this.failedTests) {
      const projectName = test.project()?.name || 'Default';
      projectCounts.set(projectName, (projectCounts.get(projectName) || 0) + 1);
    }

    return Array.from(projectCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([project, count]) => ({
        title: project,
        value: `${count} failure(s)`,
        short: true
      }));
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'passed': return 'good';
      case 'failed': return 'danger';
      case 'skipped': return 'warning';
      default: return '#439FE0';
    }
  }

  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'skipped': return '⏭️';
      default: return '🔄';
    }
  }

  private formatDuration(duration: number): string {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  private async sendToSlack(message: any): Promise<void> {
    try {
      const response = await fetch(this.options.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();
      if (responseText !== 'ok') {
        throw new Error(`Slack API returned: ${responseText}`);
      }

    } catch (error) {
      console.error('Failed to send Slack message:', error);
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default SlackReporter;

/**
 * Usage Examples:
 * 
 * 1. Basic configuration in playwright.config.ts:
 * 
 * reporter: [
 *   ['./reporters/slack-reporter.ts', {
 *     webhookUrl: process.env.SLACK_WEBHOOK_URL,
 *     channel: '#qa-notifications'
 *   }]
 * ]
 * 
 * 2. Failure-only notifications:
 * 
 * reporter: [
 *   ['./reporters/slack-reporter.ts', {
 *     webhookUrl: process.env.SLACK_WEBHOOK_URL,
 *     onlyOnFailures: true,
 *     mentionOnFailures: ['U12345678', 'U87654321'], // User IDs
 *     channel: '#critical-alerts'
 *   }]
 * ]
 * 
 * 3. Environment-specific configuration:
 * 
 * reporter: [
 *   ['./reporters/slack-reporter.ts', {
 *     webhookUrl: process.env.SLACK_WEBHOOK_URL,
 *     environment: process.env.ENVIRONMENT || 'development',
 *     onlyOnFailures: process.env.ENVIRONMENT === 'production',
 *     mentionOnFailures: process.env.ENVIRONMENT === 'production' 
 *       ? ['@oncall-engineer'] 
 *       : []
 *   }]
 * ]
 */