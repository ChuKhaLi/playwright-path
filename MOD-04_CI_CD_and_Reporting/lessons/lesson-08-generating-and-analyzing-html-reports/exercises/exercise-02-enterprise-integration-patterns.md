# Exercise 02: Enterprise Integration and Distribution Patterns

## Objective
Master enterprise-scale HTML report integration, automated distribution, and comprehensive monitoring for professional QA automation environments.

## Prerequisites
- Completed Exercise 01: HTML Report Configuration and Customization Mastery
- Understanding of enterprise tools (Slack, Teams, JIRA, email systems)
- Basic knowledge of cloud services (AWS S3) and APIs
- Familiarity with webhook integrations

## Learning Outcomes
After completing this exercise, you will be able to:
- Design and implement enterprise report distribution systems
- Integrate HTML reports with popular enterprise tools
- Set up automated archival and retention policies
- Create comprehensive monitoring and alerting systems
- Implement scalable report processing for multiple environments

---

## Part 1: Enterprise Distribution System (45 minutes)

### Task 1.1: Multi-Channel Report Distribution

Create a comprehensive distribution system that sends reports to multiple stakeholders through different channels.

**Instructions:**

1. **Create enterprise configuration** (`config/enterprise.config.ts`):

```typescript
// enterprise.config.ts
export interface EnterpriseDistributionConfig {
  organization: string;
  environment: string;
  
  // TODO: Define email distribution settings
  email: {
    enabled: boolean;
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: { user: string; pass: string };
    };
    recipients: {
      // Define different recipient groups
      onSuccess: string[];
      onFailure: string[];
      daily: string[];
      executives: string[];
      developers: string[];
    };
    templates: {
      // Email template configurations
      success: string;
      failure: string;
      daily: string;
    };
  };
  
  // TODO: Define Slack integration settings
  slack: {
    enabled: boolean;
    webhookUrl: string;
    channels: {
      general: string;
      failures: string;
      executives: string;
      developers: string;
    };
    mentions: {
      onFailure: string[];
      critical: string[];
    };
  };
  
  // TODO: Define Teams integration settings
  teams: {
    enabled: boolean;
    webhookUrl: string;
    adaptiveCards: boolean;
  };
  
  // TODO: Define webhook integrations
  webhooks: Array<{
    name: string;
    url: string;
    method: 'POST' | 'PUT';
    headers: Record<string, string>;
    payload: 'summary' | 'full' | 'custom';
    conditions: string[]; // When to trigger
  }>;
}

// TODO: Create your enterprise configuration
export const enterpriseConfig: EnterpriseDistributionConfig = {
  organization: 'Your Company',
  environment: process.env.NODE_ENV || 'development',
  
  email: {
    enabled: true,
    smtp: {
      host: 'smtp.company.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    },
    recipients: {
      onSuccess: ['qa-team@company.com'],
      onFailure: ['qa-team@company.com', 'dev-team@company.com'],
      daily: ['qa-lead@company.com', 'project-manager@company.com'],
      executives: ['cto@company.com', 'qa-director@company.com'],
      developers: ['dev-team@company.com']
    },
    templates: {
      success: 'success-template.html',
      failure: 'failure-template.html',
      daily: 'daily-summary-template.html'
    }
  },
  
  slack: {
    enabled: true,
    webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
    channels: {
      general: '#qa-automation',
      failures: '#qa-failures',
      executives: '#qa-executive-summary',
      developers: '#development'
    },
    mentions: {
      onFailure: ['@qa-team', '@on-call-dev'],
      critical: ['@qa-lead', '@dev-lead', '@cto']
    }
  },
  
  teams: {
    enabled: false,
    webhookUrl: process.env.TEAMS_WEBHOOK_URL || '',
    adaptiveCards: true
  },
  
  webhooks: [
    {
      name: 'JIRA Integration',
      url: 'https://your-company.atlassian.net/rest/api/2/issue',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      payload: 'custom',
      conditions: ['critical_failures']
    },
    {
      name: 'Dashboard API',
      url: 'https://dashboard.company.com/api/test-results',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DASHBOARD_TOKEN}`,
        'Content-Type': 'application/json'
      },
      payload: 'summary',
      conditions: ['always']
    }
  ]
};
```

2. **Implement distribution manager** (`utils/distribution-manager.ts`):

```typescript
// distribution-manager.ts
import nodemailer from 'nodemailer';
import { EnterpriseDistributionConfig } from '../config/enterprise.config';

interface ReportMetrics {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  passRate: number;
  environment: string;
  buildNumber: string;
  timestamp: string;
  criticalFailures: Array<{
    name: string;
    error: string;
    severity: string;
  }>;
}

export class DistributionManager {
  private config: EnterpriseDistributionConfig;
  private emailTransporter?: nodemailer.Transporter;
  
  constructor(config: EnterpriseDistributionConfig) {
    this.config = config;
    this.initializeServices();
  }
  
  private initializeServices(): void {
    // TODO: Initialize email transporter
    if (this.config.email.enabled) {
      this.emailTransporter = nodemailer.createTransporter(
        this.config.email.smtp
      );
    }
    
    console.log(`📧 Distribution Manager initialized for ${this.config.organization}`);
  }
  
  async distributeReport(reportPath: string, metrics: ReportMetrics): Promise<void> {
    console.log('📤 Starting report distribution...');
    
    const distributionTasks: Promise<void>[] = [];
    
    // TODO: Add email distribution
    if (this.config.email.enabled) {
      distributionTasks.push(this.sendEmailNotification(reportPath, metrics));
    }
    
    // TODO: Add Slack distribution
    if (this.config.slack.enabled) {
      distributionTasks.push(this.sendSlackNotification(metrics));
    }
    
    // TODO: Add Teams distribution
    if (this.config.teams.enabled) {
      distributionTasks.push(this.sendTeamsNotification(metrics));
    }
    
    // TODO: Add webhook distributions
    for (const webhook of this.config.webhooks) {
      if (this.shouldTriggerWebhook(webhook, metrics)) {
        distributionTasks.push(this.sendWebhook(webhook, metrics));
      }
    }
    
    try {
      await Promise.all(distributionTasks);
      console.log('✅ Report distribution completed successfully');
    } catch (error) {
      console.error('❌ Report distribution failed:', error);
      throw error;
    }
  }
  
  private async sendEmailNotification(reportPath: string, metrics: ReportMetrics): Promise<void> {
    if (!this.emailTransporter) return;
    
    // TODO: Determine recipients based on test results
    const recipients = this.getEmailRecipients(metrics);
    
    // TODO: Generate email content
    const { subject, html } = this.generateEmailContent(metrics);
    
    // TODO: Prepare attachments
    const attachments = await this.prepareEmailAttachments(reportPath, metrics);
    
    // TODO: Send email
    await this.emailTransporter.sendMail({
      from: this.config.email.smtp.auth.user,
      to: recipients.join(', '),
      subject,
      html,
      attachments
    });
    
    console.log(`📧 Email sent to ${recipients.length} recipients`);
  }
  
  private getEmailRecipients(metrics: ReportMetrics): string[] {
    // TODO: Implement smart recipient selection
    let recipients: string[] = [];
    
    if (metrics.failed > 0) {
      recipients = [...recipients, ...this.config.email.recipients.onFailure];
      
      // Add executives for critical failures
      if (metrics.criticalFailures.length > 0) {
        recipients = [...recipients, ...this.config.email.recipients.executives];
      }
    } else {
      recipients = [...recipients, ...this.config.email.recipients.onSuccess];
    }
    
    // Remove duplicates
    return [...new Set(recipients)];
  }
  
  private generateEmailContent(metrics: ReportMetrics): { subject: string; html: string } {
    // TODO: Generate dynamic email content
    const status = metrics.failed > 0 ? 'FAILED' : 'PASSED';
    const emoji = metrics.failed > 0 ? '❌' : '✅';
    
    const subject = `${emoji} Test Results: ${this.config.environment.toUpperCase()} - ${metrics.passRate.toFixed(1)}% Pass Rate`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { background: ${metrics.failed > 0 ? '#dc3545' : '#28a745'}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
          .metric { background: white; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .metric-value { font-size: 2em; font-weight: bold; color: #007bff; }
          .failures { margin-top: 20px; }
          .failure-item { background: #ffe6e6; padding: 10px; margin: 5px 0; border-left: 4px solid #dc3545; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${emoji} Test Execution Report</h1>
          <p>${this.config.organization} - ${this.config.environment.toUpperCase()}</p>
        </div>
        
        <div class="content">
          <h2>📊 Test Metrics</h2>
          <div class="metrics">
            <div class="metric">
              <div class="metric-value">${metrics.totalTests}</div>
              <div>Total Tests</div>
            </div>
            <div class="metric">
              <div class="metric-value" style="color: #28a745">${metrics.passed}</div>
              <div>Passed</div>
            </div>
            <div class="metric">
              <div class="metric-value" style="color: #dc3545">${metrics.failed}</div>
              <div>Failed</div>
            </div>
            <div class="metric">
              <div class="metric-value">${metrics.passRate.toFixed(1)}%</div>
              <div>Pass Rate</div>
            </div>
            <div class="metric">
              <div class="metric-value">${(metrics.duration / 1000 / 60).toFixed(1)}m</div>
              <div>Duration</div>
            </div>
          </div>
          
          ${metrics.criticalFailures.length > 0 ? `
            <div class="failures">
              <h3>🚨 Critical Failures</h3>
              ${metrics.criticalFailures.map(failure => `
                <div class="failure-item">
                  <strong>${failure.name}</strong><br>
                  <code>${failure.error}</code>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <p><strong>Build:</strong> ${metrics.buildNumber}</p>
          <p><strong>Generated:</strong> ${new Date(metrics.timestamp).toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
    
    return { subject, html };
  }
  
  private async prepareEmailAttachments(reportPath: string, metrics: ReportMetrics): Promise<any[]> {
    // TODO: Prepare email attachments
    const attachments = [];
    
    // Always attach the HTML report
    attachments.push({
      filename: 'test-report.html',
      path: `${reportPath}/index.html`
    });
    
    // Attach summary CSV for executives
    if (metrics.criticalFailures.length > 0) {
      // Generate and attach executive summary
      const summaryCSV = this.generateExecutiveSummary(metrics);
      attachments.push({
        filename: 'executive-summary.csv',
        content: summaryCSV
      });
    }
    
    return attachments;
  }
  
  private async sendSlackNotification(metrics: ReportMetrics): Promise<void> {
    // TODO: Send Slack notification with rich formatting
    const channel = metrics.failed > 0 
      ? this.config.slack.channels.failures 
      : this.config.slack.channels.general;
    
    const color = this.getSlackColor(metrics.passRate);
    const emoji = metrics.failed === 0 ? '✅' : '❌';
    
    const payload = {
      channel,
      username: 'QA Automation Bot',
      icon_emoji: ':test_tube:',
      text: this.getSlackMentions(metrics),
      attachments: [{
        color,
        title: `${emoji} Test Results - ${this.config.environment.toUpperCase()}`,
        title_link: `https://reports.company.com/${metrics.buildNumber}`,
        fields: [
          { title: 'Pass Rate', value: `${metrics.passRate.toFixed(1)}%`, short: true },
          { title: 'Total Tests', value: metrics.totalTests.toString(), short: true },
          { title: 'Failed', value: metrics.failed.toString(), short: true },
          { title: 'Duration', value: `${(metrics.duration / 1000 / 60).toFixed(1)}m`, short: true }
        ],
        footer: `Build ${metrics.buildNumber} | ${new Date(metrics.timestamp).toLocaleString()}`,
        ts: Math.floor(Date.now() / 1000)
      }]
    };
    
    // TODO: Send to Slack
    await this.sendSlackWebhook(payload);
    
    console.log('💬 Slack notification sent');
  }
  
  private getSlackColor(passRate: number): string {
    if (passRate >= 95) return 'good';
    if (passRate >= 80) return 'warning';
    return 'danger';
  }
  
  private getSlackMentions(metrics: ReportMetrics): string {
    const mentions: string[] = [];
    
    if (metrics.failed > 0) {
      mentions.push(...this.config.slack.mentions.onFailure);
    }
    
    if (metrics.criticalFailures.length > 0) {
      mentions.push(...this.config.slack.mentions.critical);
    }
    
    return mentions.join(' ');
  }
  
  private async sendSlackWebhook(payload: any): Promise<void> {
    const response = await fetch(this.config.slack.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.statusText}`);
    }
  }
  
  // TODO: Implement remaining methods
  private async sendTeamsNotification(metrics: ReportMetrics): Promise<void> {
    console.log('💼 Sending Teams notification...');
  }
  
  private shouldTriggerWebhook(webhook: any, metrics: ReportMetrics): boolean {
    // TODO: Implement webhook trigger logic
    return webhook.conditions.includes('always') || 
           (webhook.conditions.includes('critical_failures') && metrics.criticalFailures.length > 0);
  }
  
  private async sendWebhook(webhook: any, metrics: ReportMetrics): Promise<void> {
    console.log(`🔗 Sending webhook: ${webhook.name}`);
  }
  
  private generateExecutiveSummary(metrics: ReportMetrics): string {
    // TODO: Generate CSV summary for executives
    return `Test Suite,Environment,Pass Rate,Total Tests,Failed Tests,Duration,Critical Issues
${this.config.organization},${metrics.environment},${metrics.passRate.toFixed(1)}%,${metrics.totalTests},${metrics.failed},${(metrics.duration / 1000 / 60).toFixed(1)}m,${metrics.criticalFailures.length}`;
  }
}
```

3. **Test your distribution system:**

```bash
# Set up environment variables
export SMTP_USER="your-smtp-user"
export SMTP_PASS="your-smtp-password"
export SLACK_WEBHOOK_URL="your-slack-webhook"

# Run tests
npm run test

# Test distribution
node -e "
const { DistributionManager } = require('./utils/distribution-manager.ts');
const { enterpriseConfig } = require('./config/enterprise.config.ts');

const manager = new DistributionManager(enterpriseConfig);
const mockMetrics = {
  totalTests: 150,
  passed: 140,
  failed: 10,
  skipped: 0,
  duration: 300000,
  passRate: 93.3,
  environment: 'staging',
  buildNumber: '123',
  timestamp: new Date().toISOString(),
  criticalFailures: []
};

manager.distributeReport('./playwright-report', mockMetrics);
"
```

**Expected Outcomes:**
- ✅ Email notifications sent to appropriate recipients
- ✅ Slack messages with rich formatting and mentions
- ✅ Webhooks triggered based on conditions
- ✅ Executive summaries attached for critical failures

---

## Part 2: Report Archival and Retention (30 minutes)

### Task 2.1: Automated Report Archival System

Implement comprehensive report archival with retention policies for compliance and historical analysis.

**Instructions:**

1. **Create archival manager** (`utils/archival-manager.ts`):

```typescript
// archival-manager.ts
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';

interface ArchivalConfig {
  local: {
    enabled: boolean;
    path: string;
    retentionDays: number;
    compress: boolean;
  };
  s3: {
    enabled: boolean;
    bucket: string;
    region: string;
    keyPrefix: string;
    retentionDays: number;
    storageClass: 'STANDARD' | 'GLACIER' | 'DEEP_ARCHIVE';
  };
}

export class ArchivalManager {
  private config: ArchivalConfig;
  private s3Client?: S3Client;
  
  constructor(config: ArchivalConfig) {
    this.config = config;
    
    if (this.config.s3.enabled) {
      this.s3Client = new S3Client({ region: this.config.s3.region });
    }
    
    console.log('📦 Archival Manager initialized');
  }
  
  async archiveReport(reportPath: string, metadata: any): Promise<void> {
    console.log('📦 Starting report archival...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveName = `report-${metadata.environment}-${metadata.buildNumber}-${timestamp}`;
    
    const archivalTasks: Promise<void>[] = [];
    
    // TODO: Local archival
    if (this.config.local.enabled) {
      archivalTasks.push(this.archiveLocally(reportPath, archiveName, metadata));
    }
    
    // TODO: S3 archival
    if (this.config.s3.enabled && this.s3Client) {
      archivalTasks.push(this.archiveToS3(reportPath, archiveName, metadata));
    }
    
    try {
      await Promise.all(archivalTasks);
      console.log('✅ Report archival completed');
    } catch (error) {
      console.error('❌ Report archival failed:', error);
      throw error;
    }
  }
  
  private async archiveLocally(reportPath: string, archiveName: string, metadata: any): Promise<void> {
    // TODO: Implement local archival
    const archiveDir = path.join(this.config.local.path, archiveName);
    
    // Create archive directory
    fs.mkdirSync(archiveDir, { recursive: true });
    
    // Copy report files
    await this.copyDirectory(reportPath, archiveDir);
    
    // Add metadata file
    fs.writeFileSync(
      path.join(archiveDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    // Compress if enabled
    if (this.config.local.compress) {
      await this.compressDirectory(archiveDir);
    }
    
    console.log(`📁 Report archived locally: ${archiveDir}`);
  }
  
  private async archiveToS3(reportPath: string, archiveName: string, metadata: any): Promise<void> {
    if (!this.s3Client) return;
    
    // TODO: Upload files to S3
    const s3KeyPrefix = `${this.config.s3.keyPrefix}/${archiveName}`;
    
    // Upload HTML report
    const htmlContent = fs.readFileSync(path.join(reportPath, 'index.html'));
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.config.s3.bucket,
      Key: `${s3KeyPrefix}/index.html`,
      Body: htmlContent,
      ContentType: 'text/html',
      StorageClass: this.config.s3.storageClass,
      Metadata: {
        environment: metadata.environment,
        buildNumber: metadata.buildNumber,
        passRate: metadata.passRate?.toString() || '0',
        totalTests: metadata.totalTests?.toString() || '0'
      }
    }));
    
    // Upload metadata
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.config.s3.bucket,
      Key: `${s3KeyPrefix}/metadata.json`,
      Body: JSON.stringify(metadata, null, 2),
      ContentType: 'application/json',
      StorageClass: this.config.s3.storageClass
    }));
    
    console.log(`☁️ Report archived to S3: s3://${this.config.s3.bucket}/${s3KeyPrefix}`);
  }
  
  async cleanupOldReports(): Promise<void> {
    console.log('🧹 Cleaning up old reports...');
    
    const cleanupTasks: Promise<void>[] = [];
    
    // TODO: Local cleanup
    if (this.config.local.enabled) {
      cleanupTasks.push(this.cleanupLocalReports());
    }
    
    // TODO: S3 cleanup
    if (this.config.s3.enabled && this.s3Client) {
      cleanupTasks.push(this.cleanupS3Reports());
    }
    
    try {
      await Promise.all(cleanupTasks);
      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }
  
  private async cleanupLocalReports(): Promise<void> {
    // TODO: Implement local cleanup based on retention policy
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.local.retentionDays);
    
    if (!fs.existsSync(this.config.local.path)) return;
    
    const entries = fs.readdirSync(this.config.local.path, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const dirPath = path.join(this.config.local.path, entry.name);
        const stats = fs.statSync(dirPath);
        
        if (stats.mtime < cutoffDate) {
          fs.rmSync(dirPath, { recursive: true, force: true });
          console.log(`🗑️ Removed old local archive: ${entry.name}`);
        }
      }
    }
  }
  
  private async cleanupS3Reports(): Promise<void> {
    if (!this.s3Client) return;
    
    // TODO: Implement S3 cleanup
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.s3.retentionDays);
    
    const listResponse = await this.s3Client.send(new ListObjectsV2Command({
      Bucket: this.config.s3.bucket,
      Prefix: this.config.s3.keyPrefix
    }));
    
    if (!listResponse.Contents) return;
    
    const objectsToDelete = listResponse.Contents.filter(
      obj => obj.LastModified && obj.LastModified < cutoffDate
    );
    
    for (const obj of objectsToDelete) {
      if (obj.Key) {
        await this.s3Client.send(new DeleteObjectCommand({
          Bucket: this.config.s3.bucket,
          Key: obj.Key
        }));
        console.log(`🗑️ Removed old S3 archive: ${obj.Key}`);
      }
    }
  }
  
  // Helper methods
  private async copyDirectory(src: string, dest: string): Promise<void> {
    // TODO: Implement directory copying
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  private async compressDirectory(dirPath: string): Promise<void> {
    // TODO: Implement directory compression
    console.log(`📦 Compressing directory: ${dirPath}`);
    // Implementation would use zlib or other compression library
  }
}
```

2. **Test archival system:**

```bash
# Configure AWS credentials (if using S3)
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"

# Test archival
node -e "
const { ArchivalManager } = require('./utils/archival-manager.ts');

const config = {
  local: {
    enabled: true,
    path: './archived-reports',
    retentionDays: 30,
    compress: true
  },
  s3: {
    enabled: false, // Set to true if using S3
    bucket: 'your-test-reports-bucket',
    region: 'us-east-1',
    keyPrefix: 'qa-reports',
    retentionDays: 90,
    storageClass: 'STANDARD'
  }
};

const manager = new ArchivalManager(config);
const metadata = {
  environment: 'production',
  buildNumber: '456',
  passRate: 98.5,
  totalTests: 200,
  timestamp: new Date().toISOString()
};

manager.archiveReport('./playwright-report', metadata);
"
```

**Expected Outcomes:**
- ✅ Reports archived locally with metadata
- ✅ S3 archival with proper storage classes
- ✅ Automated cleanup of old reports
- ✅ Compression for space efficiency

---

## Part 3: Monitoring and Alerting (40 minutes)

### Task 3.1: Comprehensive Monitoring System

Implement advanced monitoring with intelligent alerting based on test metrics and trends.

**Instructions:**

1. **Create monitoring manager** (`utils/monitoring-manager.ts`):

```typescript
// monitoring-manager.ts
interface MonitoringConfig {
  enabled: boolean;
  thresholds: {
    passRate: number;
    duration: number; // in minutes
    flakyTests: number;
    consecutiveFailures: number;
  };
  alerts: Array<{
    type: 'email' | 'slack' | 'webhook';
    condition: 'pass_rate_below' | 'duration_above' | 'flaky_tests_above' | 'consecutive_failures';
    threshold: number;
    recipients: string[];
    cooldown: number; // minutes between same alerts
  }>;
  trends: {
    enabled: boolean;
    windowDays: number;
    alertOnDegrading: boolean;
  };
}

interface AlertHistory {
  [key: string]: number; // Alert type -> last sent timestamp
}

export class MonitoringManager {
  private config: MonitoringConfig;
  private alertHistory: AlertHistory = {};
  
  constructor(config: MonitoringConfig) {
    this.config = config;
    console.log('🚨 Monitoring Manager initialized');
  }
  
  async monitorReport(metrics: any, historicalData?: any[]): Promise<string[]> {
    if (!this.config.enabled) return [];
    
    console.log('🔍 Monitoring report metrics...');
    
    const alerts: string[] = [];
    
    // TODO: Check thresholds
    alerts.push(...await this.checkThresholds(metrics));
    
    // TODO: Analyze trends if historical data available
    if (this.config.trends.enabled && historicalData) {
      alerts.push(...await this.analyzeTrends(metrics, historicalData));
    }
    
    // TODO: Send alerts
    if (alerts.length > 0) {
      await this.sendAlerts(alerts, metrics);
    }
    
    return alerts;
  }
  
  private async checkThresholds(metrics: any): Promise<string[]> {
    const alerts: string[] = [];
    
    // TODO: Pass rate threshold
    if (metrics.passRate < this.config.thresholds.passRate) {
      alerts.push(`Pass rate (${metrics.passRate.toFixed(1)}%) below threshold (${this.config.thresholds.passRate}%)`);
    }
    
    // TODO: Duration threshold
    const durationMinutes = metrics.duration / 1000 / 60;
    if (durationMinutes > this.config.thresholds.duration) {
      alerts.push(`Test duration (${durationMinutes.toFixed(1)}m) above threshold (${this.config.thresholds.duration}m)`);
    }
    
    // TODO: Flaky tests threshold
    const flakyCount = metrics.flakyTests?.length || 0;
    if (flakyCount > this.config.thresholds.flakyTests) {
      alerts.push(`Flaky tests count (${flakyCount}) above threshold (${this.config.thresholds.flakyTests})`);
    }
    
    return alerts;
  }
  
  private async analyzeTrends(currentMetrics: any, historicalData: any[]): Promise<string[]> {
    const alerts: string[] = [];
    
    if (!this.config.trends.alertOnDegrading || historicalData.length < 5) {
      return alerts;
    }
    
    // TODO: Calculate trend for pass rate
    const passRates = historicalData.map(d => d.passRate).slice(-this.config.trends.windowDays);
    const trendSlope = this.calculateTrend(passRates);
    
    // Alert if pass rate is consistently declining
    if (trendSlope < -0.5) { // Declining by more than 0.5% per day
      alerts.push(`Pass rate trending downward: ${trendSlope.toFixed(2)}% per day over ${passRates.length} days`);
    }
    
    // TODO: Calculate trend for duration
    const durations = historicalData.map(d => d.duration / 1000 / 60).slice(-this.config.trends.windowDays);
    const durationTrend = this.calculateTrend(durations);
    
    // Alert if duration is consistently increasing
    if (durationTrend > 2) { // Increasing by more than 2 minutes per day
      alerts.push(`Test duration trending upward: ${durationTrend.toFixed(1)} minutes per day`);
    }
    
    return alerts;
  }
  
  private calculateTrend(values: number[]): number {
    // TODO: Simple linear regression to calculate trend
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = values.reduce((sum, _, i) => sum + i, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + (i * val), 0);
    const sumXX = values.reduce((sum, _, i) => sum + (i * i), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }
  
  private async sendAlerts(alerts: string[], metrics: any): Promise<void> {
    console.log(`⚠️ Sending ${alerts.length} alerts...`);
    
    for (const alertConfig of this.config.alerts) {
      const alertKey = `${alertConfig.type}-${alertConfig.condition}`;
      const now = Date.now();
      const lastSent = this.alertHistory[alertKey] || 0;
      const cooldownMs = alertConfig.cooldown * 60 * 1000;
      
      // Check cooldown
      if (now - lastSent < cooldownMs) {
        console.log(`🔇 Alert ${alertKey} in cooldown, skipping...`);
        continue;
      }
      
      // Check if alert condition matches
      if (this.shouldSendAlert(alertConfig, alerts, metrics)) {
        await this.sendAlert(alertConfig, alerts, metrics);
        this.alertHistory[alertKey] = now;
      }
    }
  }
  
  private shouldSendAlert(alertConfig: any, alerts: string[], metrics: any): boolean {
    // TODO: Check if alert condition is met
    switch (alertConfig.condition) {
      case 'pass_rate_below':
        return metrics.passRate < alertConfig.threshold;
      case 'duration_above':
        return (metrics.duration / 1000 / 60) > alertConfig.threshold;
      case 'flaky_tests_above':
        return (metrics.flakyTests?.length || 0) > alertConfig.threshold;
      default:
        return alerts.length > 0;
    }
  }
  
  private async sendAlert(alertConfig: any, alerts: string[], metrics: any): Promise<void> {
    const alertMessage = this.formatAlertMessage(alerts, metrics);
    
    // TODO: Send alert based on type
    switch (alertConfig.type) {
      case 'email':
        await this.sendEmailAlert(alertConfig.recipients, alertMessage, metrics);
        break;
      case 'slack':
        await this.sendSlackAlert(alertConfig.recipients[0], alertMessage, metrics);
        break;
      case 'webhook':
        await this.sendWebhookAlert(alertConfig.recipients[0], alertMessage, metrics);
        break;
    }
    
    console.log(`🚨 ${alertConfig.type} alert sent`);
  }
  
  private formatAlertMessage(alerts: string[], metrics: any): string {
    return `
🚨 QA ALERT - ${metrics.environment?.toUpperCase() || 'UNKNOWN'}

${alerts.map(alert => `• ${alert}`).join('\n')}

📊 Current Metrics:
• Pass Rate: ${metrics.passRate?.toFixed(1) || 'N/A'}%
• Total Tests: ${metrics.totalTests || 'N/A'}
• Failed Tests: ${metrics.failed || 'N/A'}
• Duration: ${metrics.duration ? (metrics.duration / 1000 / 60).toFixed(1) + 'm' : 'N/A'}
• Build: ${metrics.buildNumber || 'N/A'}

Generated: ${new Date().toLocaleString()}
    `.trim();
  }
  
  // TODO: Implement alert senders
  private async sendEmailAlert(recipients: string[], message: string, metrics: any): Promise<void> {
    console.log(`📧 Email alert would be sent to: ${recipients.join(', ')}`);
  }
  
  private async sendSlackAlert(channel: string, message: string, metrics: any): Promise<void> {
    console.log(`💬 Slack alert would be sent to: ${channel}`);
  }
  
  private async sendWebhookAlert(url: string, message: string, metrics: any): Promise<void> {
    console.log(`🔗 Webhook alert would be sent to: ${url}`);
  }
}
```

2. **Test monitoring system:**

```javascript
// Test monitoring with mock data
const { MonitoringManager } = require('./utils/monitoring-manager.ts');

const config = {
  enabled: true,
  thresholds: {
    passRate: 90,
    duration: 20, // 20 minutes
    flakyTests: 5,
    consecutiveFailures: 3
  },
  alerts: [
    {
      type: 'email',
      condition: 'pass_rate_below',
      threshold: 85,
      recipients: ['qa-lead@company.com'],
      cooldown: 60 // 1 hour
    },
    {
      type: 'slack',
      condition: 'duration_above',
      threshold: 30,
      recipients: ['#qa-alerts'],
      cooldown: 30 // 30 minutes
    }
  ],
  trends: {
    enabled: true,
    windowDays: 7,
    alertOnDegrading: true
  }
};

const manager = new MonitoringManager(config);

// Test with failing metrics
const failingMetrics = {
  passRate: 75, // Below threshold
  totalTests: 100,
  failed: 25,
  duration: 1800000, // 30 minutes - above threshold
  flakyTests: [1, 2, 3, 4, 5, 6], // 6 flaky tests - above threshold
  environment: 'production',
  buildNumber: '789'
};

manager.monitorReport(failingMetrics).then(alerts => {
  console.log('Alerts generated:', alerts);
});
```

**Expected Outcomes:**
- ✅ Threshold-based alerting for critical metrics
- ✅ Trend analysis with degradation detection
- ✅ Multi-channel alert distribution
- ✅ Cooldown periods to prevent alert spam

---

## Part 4: Complete Integration Pipeline (30 minutes)

### Task 4.1: End-to-End Integration

Combine all components into a complete enterprise integration pipeline.

**Instructions:**

1. **Create integration orchestrator** (`integration/enterprise-orchestrator.ts`):

```typescript
// enterprise-orchestrator.ts
import { DistributionManager } from '../utils/distribution-manager';
import { ArchivalManager } from '../utils/archival-manager';
import { MonitoringManager } from '../utils/monitoring-manager';

export class EnterpriseOrchestrator {
  private distributionManager: DistributionManager;
  private archivalManager: ArchivalManager;
  private monitoringManager: MonitoringManager;
  
  constructor(configs: {
    distribution: any;
    archival: any;
    monitoring: any;
  }) {
    this.distributionManager = new DistributionManager(configs.distribution);
    this.archivalManager = new ArchivalManager(configs.archival);
    this.monitoringManager = new MonitoringManager(configs.monitoring);
    
    console.log('🎯 Enterprise Orchestrator initialized');
  }
  
  async processReport(reportPath: string, metrics: any): Promise<void> {
    console.log('🚀 Starting enterprise report processing...');
    
    try {
      // Step 1: Monitor and alert
      const alerts = await this.monitoringManager.monitorReport(metrics);
      
      // Step 2: Archive report
      await this.archivalManager.archiveReport(reportPath, metrics);
      
      // Step 3: Distribute report
      await this.distributionManager.distributeReport(reportPath, metrics);
      
      // Step 4: Cleanup old reports
      await this.archivalManager.cleanupOldReports();
      
      console.log('✅ Enterprise report processing completed');
      
    } catch (error) {
      console.error('❌ Enterprise report processing failed:', error);
      throw error;
    }
  }
}
```

2. **Create complete test script** (`scripts/test-enterprise-integration.js`):

```javascript
// test-enterprise-integration.js
const { EnterpriseOrchestrator } = require('../integration/enterprise-orchestrator.ts');

// Mock configurations
const configs = {
  distribution: {
    organization: 'Test Company',
    environment: 'staging',
    email: { enabled: false }, // Disable for testing
    slack: { enabled: false },
    teams: { enabled: false },
    webhooks: []
  },
  archival: {
    local: {
      enabled: true,
      path: './test-archives',
      retentionDays: 7,
      compress: false
    },
    s3: { enabled: false }
  },
  monitoring: {
    enabled: true,
    thresholds: {
      passRate: 95,
      duration: 10,
      flakyTests: 3,
      consecutiveFailures: 2
    },
    alerts: [],
    trends: { enabled: false }
  }
};

// Mock metrics
const mockMetrics = {
  totalTests: 50,
  passed: 45,
  failed: 5,
  skipped: 0,
  duration: 600000, // 10 minutes
  passRate: 90,
  environment: 'staging',
  buildNumber: 'test-123',
  timestamp: new Date().toISOString(),
  flakyTests: [],
  criticalFailures: []
};

// Test integration
async function testIntegration() {
  console.log('🧪 Testing enterprise integration...');
  
  const orchestrator = new EnterpriseOrchestrator(configs);
  
  try {
    await orchestrator.processReport('./playwright-report', mockMetrics);
    console.log('✅ Integration test completed successfully');
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  }
}

testIntegration();
```

3. **Run complete integration test:**

```bash
# Run the integration test
node scripts/test-enterprise-integration.js

# Verify results
ls -la test-archives/
echo "Check for archived reports and alerts"
```

**Expected Outcomes:**
- ✅ Complete pipeline execution without errors
- ✅ Reports archived with proper structure
- ✅ Monitoring alerts generated for threshold violations
- ✅ All components working together seamlessly

---

## Deliverables

### Required Files
1. `config/enterprise.config.ts` - Enterprise distribution configuration
2. `utils/distribution-manager.ts` - Multi-channel distribution system
3. `utils/archival-manager.ts` - Report archival and retention
4. `utils/monitoring-manager.ts` - Comprehensive monitoring and alerting
5. `integration/enterprise-orchestrator.ts` - Complete integration pipeline
6. `scripts/test-enterprise-integration.js` - Integration test script

### Testing Evidence
- Screenshots of email notifications received
- Slack/Teams message examples
- Archived report structure and metadata
- Monitoring alerts and trend analysis results
- Performance metrics and logs from complete pipeline execution

### Documentation
- Configuration guide for different enterprise tools
- Troubleshooting guide for common integration issues
- Security considerations and best practices
- Scaling recommendations for high-volume environments

---

## Bonus Challenges

### Challenge 1: JIRA Integration
Implement automatic JIRA ticket creation for critical test failures.

### Challenge 2: Dashboard API
Create a REST API endpoint that serves test metrics for external dashboards.

### Challenge 3: Mobile Notifications
Add push notification support for mobile devices using services like Pushover or Twilio.

### Challenge 4: Custom Metrics
Implement custom business metrics tracking (e.g., feature coverage, user journey success rates).

---

## Security and Best Practices

### Security Considerations
- Store API keys and passwords securely using environment variables
- Use service accounts with minimal required permissions
- Implement rate limiting for webhook endpoints
- Encrypt sensitive data in archived reports
- Use HTTPS for all external communications

### Best Practices
- Implement graceful error handling and retries
- Use structured logging for better debugging
- Set up health checks for integration components
- Monitor integration performance and reliability
- Regular security audits of credentials and permissions

### Scaling Considerations
- Implement queue-based processing for high-volume reports
- Use CDN for report distribution to global teams
- Consider multi-region archival for disaster recovery
- Implement caching for frequently accessed reports
- Use container orchestration for scalable deployments

This exercise provides hands-on experience with enterprise-scale report integration patterns that are essential for professional QA automation environments. The skills learned here directly apply to senior QA automation engineer roles in enterprise organizations.