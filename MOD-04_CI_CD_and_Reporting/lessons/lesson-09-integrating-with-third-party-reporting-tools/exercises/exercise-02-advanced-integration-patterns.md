# Exercise 02: Advanced Integration Patterns

## Overview

This advanced exercise focuses on implementing sophisticated integration patterns with multiple third-party reporting platforms simultaneously. You'll build a comprehensive orchestrated reporting system that handles TestRail, Jira, and custom webhook integrations with robust error handling and performance monitoring.

## Learning Objectives

By completing this exercise, you will be able to:

- **Implement TestRail API integration** for comprehensive test case management
- **Create Jira integration** for issue tracking and requirement traceability  
- **Build custom webhook systems** for flexible third-party notifications
- **Design orchestrated multi-platform reporting** with priority-based execution
- **Implement advanced error handling** with circuit breaker patterns
- **Create performance monitoring** for integration health tracking
- **Build secure credential management** for enterprise environments
- **Design failover mechanisms** for critical reporting requirements

## Prerequisites

- Completion of Exercise 01 (Basic Third-Party Integrations)
- Understanding of REST APIs, authentication, and webhook concepts
- Access to TestRail and Jira instances (or mock servers for testing)
- Knowledge of enterprise security practices

## Exercise Structure

1. **TestRail Integration Development** (40 minutes)
2. **Jira/Xray Integration Implementation** (35 minutes)
3. **Custom Webhook System Creation** (30 minutes)
4. **Multi-Platform Orchestration** (35 minutes)
5. **Error Handling and Circuit Breakers** (25 minutes)
6. **Performance Monitoring and Health Checks** (20 minutes)
7. **Security and Credential Management** (15 minutes)

---

## Part 1: TestRail Integration Development (40 minutes)

### Step 1.1: Create TestRail API Client

Create `integrations/testrail-client.js`:

```javascript
// integrations/testrail-client.js
const axios = require('axios');
const crypto = require('crypto');

class TestRailClient {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.username = config.username;
    this.apiKey = config.apiKey;
    this.projectId = config.projectId;
    this.suiteId = config.suiteId;
    
    this.client = axios.create({
      baseURL: `${this.baseUrl}/index.php?/api/v2`,
      auth: {
        username: this.username,
        password: this.apiKey
      },
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    this.setupInterceptors();
  }
  
  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🔵 TestRail API: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ TestRail API: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ TestRail API Error: ${error.response?.status} ${error.config?.url}`);
        return Promise.reject(error);
      }
    );
  }
  
  async healthCheck() {
    try {
      const response = await this.client.get(`/get_project/${this.projectId}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
  
  async getTestCases() {
    const response = await this.client.get(
      `/get_cases/${this.projectId}&suite_id=${this.suiteId}`
    );
    return response.data;
  }
  
  async createTestRun(name, description, caseIds) {
    const runData = {
      name,
      description,
      suite_id: this.suiteId,
      include_all: false,
      case_ids: caseIds
    };
    
    const response = await this.client.post(`/add_run/${this.projectId}`, runData);
    return response.data;
  }
  
  async addTestResults(runId, results) {
    const response = await this.client.post(`/add_results/${runId}`, {
      results: results.map(result => ({
        case_id: result.caseId,
        status_id: this.mapStatusToTestRail(result.status),
        comment: result.comment,
        elapsed: result.elapsed,
        version: process.env.BUILD_NUMBER || 'local'
      }))
    });
    return response.data;
  }
  
  async closeTestRun(runId) {
    const response = await this.client.post(`/close_run/${runId}`, {});
    return response.data;
  }
  
  mapStatusToTestRail(status) {
    const statusMap = {
      'passed': 1,    // Passed
      'failed': 5,    // Failed
      'skipped': 2,   // Blocked
      'timedOut': 5,  // Failed
      'interrupted': 4 // Retest
    };
    return statusMap[status] || 5;
  }
  
  extractCaseIdFromTitle(title) {
    // Extract TestRail case ID from test title
    // Supports formats: C123, [TC-123], @testrail(123)
    const patterns = [
      /C(\d+):/,
      /\[TC-(\d+)\]/,
      /@testrail\((\d+)\)/
    ];
    
    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return null;
  }
}

module.exports = TestRailClient;
```

### Step 1.2: Create TestRail Reporter

Create `reporters/testrail-reporter.js`:

```javascript
// reporters/testrail-reporter.js
const TestRailClient = require('../integrations/testrail-client');
const IntegrationHelper = require('../utils/integration-helper');

class TestRailReporter {
  constructor(options = {}) {
    this.config = {
      baseUrl: options.baseUrl || process.env.TESTRAIL_BASE_URL,
      username: options.username || process.env.TESTRAIL_USERNAME,
      apiKey: options.apiKey || process.env.TESTRAIL_API_KEY,
      projectId: options.projectId || parseInt(process.env.TESTRAIL_PROJECT_ID),
      suiteId: options.suiteId || parseInt(process.env.TESTRAIL_SUITE_ID)
    };
    
    this.validateConfig();
    
    this.client = new TestRailClient(this.config);
    this.integrationHelper = new IntegrationHelper({
      maxRetries: 3,
      retryDelay: 2000,
      timeout: 15000
    });
    
    this.testRunId = null;
    this.testResults = [];
    this.caseMapping = new Map();
  }
  
  validateConfig() {
    const required = ['baseUrl', 'username', 'apiKey', 'projectId', 'suiteId'];
    const missing = required.filter(key => !this.config[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing TestRail configuration: ${missing.join(', ')}`);
    }
  }
  
  async onBegin() {
    console.log('🚀 Starting TestRail integration...');
    
    try {
      // Test connection
      const isHealthy = await this.integrationHelper.safeExecute(
        () => this.client.healthCheck(),
        false,
        'TestRail health check'
      );
      
      if (!isHealthy) {
        console.warn('⚠️ TestRail connection failed, disabling integration');
        this.disabled = true;
        return;
      }
      
      // Build case mapping from test titles
      await this.buildCaseMapping();
      
      if (this.caseMapping.size === 0) {
        console.log('ℹ️ No TestRail case IDs found in test titles');
        this.disabled = true;
        return;
      }
      
      // Create test run
      const runName = `Automated Run - ${new Date().toISOString()}`;
      const caseIds = Array.from(this.caseMapping.values());
      
      const testRun = await this.integrationHelper.withRetry(
        () => this.client.createTestRun(
          runName,
          this.generateRunDescription(),
          caseIds
        ),
        'TestRail run creation'
      );
      
      this.testRunId = testRun.id;
      console.log(`✅ Created TestRail run ${this.testRunId} with ${caseIds.length} cases`);
      
    } catch (error) {
      console.error('❌ TestRail initialization failed:', error);
      this.disabled = true;
    }
  }
  
  async onTestEnd(test, result) {
    if (this.disabled || !this.testRunId) return;
    
    const caseId = this.client.extractCaseIdFromTitle(test.title) || 
                   this.caseMapping.get(test.title);
    
    if (caseId) {
      this.testResults.push({
        caseId,
        status: result.status,
        comment: this.generateComment(test, result),
        elapsed: result.duration ? `${Math.round(result.duration / 1000)}s` : null
      });
    }
  }
  
  async onEnd() {
    if (this.disabled || !this.testRunId || this.testResults.length === 0) {
      return;
    }
    
    try {
      // Submit all results
      await this.integrationHelper.withRetry(
        () => this.client.addTestResults(this.testRunId, this.testResults),
        'TestRail results submission'
      );
      
      // Close run if configured
      if (process.env.TESTRAIL_CLOSE_RUN === 'true') {
        await this.integrationHelper.withRetry(
          () => this.client.closeTestRun(this.testRunId),
          'TestRail run closure'
        );
      }
      
      console.log(`✅ TestRail integration completed: ${this.testResults.length} results submitted`);
      
    } catch (error) {
      console.error('❌ TestRail finalization failed:', error);
    }
  }
  
  async buildCaseMapping() {
    // In a real implementation, this would scan test files
    // For this exercise, we'll use a simple mapping
    this.caseMapping.set('Login with valid credentials', 101);
    this.caseMapping.set('Login with invalid credentials', 102);
    this.caseMapping.set('User registration flow', 103);
  }
  
  generateComment(test, result) {
    let comment = result.status === 'passed' ? 
      'Test passed successfully' : 
      `Test failed: ${result.error?.message || 'Unknown error'}`;
    
    comment += `\n\nExecution Details:`;
    comment += `\nBrowser: ${process.env.BROWSER || 'chromium'}`;
    comment += `\nEnvironment: ${process.env.NODE_ENV || 'test'}`;
    comment += `\nBuild: ${process.env.BUILD_NUMBER || 'local'}`;
    comment += `\nExecuted: ${new Date().toISOString()}`;
    
    return comment;
  }
  
  generateRunDescription() {
    return `
Automated test run created by Playwright

Execution Details:
- Framework: Playwright
- Environment: ${process.env.NODE_ENV || 'test'}
- Build: ${process.env.BUILD_NUMBER || 'local'}
- Branch: ${process.env.GIT_BRANCH || 'main'}
- Commit: ${process.env.GIT_COMMIT || 'unknown'}
- Executed by: ${process.env.USER || 'automation'}
- Start Time: ${new Date().toISOString()}
    `.trim();
  }
}

module.exports = TestRailReporter;
```

---

## Part 2: Jira/Xray Integration Implementation (35 minutes)

### Step 2.1: Create Jira API Client

Create `integrations/jira-client.js`:

```javascript
// integrations/jira-client.js
const axios = require('axios');

class JiraClient {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.username = config.username;
    this.apiToken = config.apiToken;
    this.projectKey = config.projectKey;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      auth: {
        username: this.username,
        password: this.apiToken
      },
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });
    
    this.setupInterceptors();
  }
  
  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🔵 Jira API: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      }
    );
    
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ Jira API: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ Jira API Error: ${error.response?.status}`);
        return Promise.reject(error);
      }
    );
  }
  
  async healthCheck() {
    try {
      const response = await this.client.get('/rest/api/2/serverInfo');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
  
  async createTestExecution(summary, testResults) {
    // Create Test Execution issue
    const executionData = {
      fields: {
        project: { key: this.projectKey },
        summary,
        description: this.generateExecutionDescription(testResults),
        issuetype: { name: 'Test Execution' }
      }
    };
    
    const response = await this.client.post('/rest/api/2/issue', executionData);
    const executionKey = response.data.key;
    
    // Update with Xray test results
    await this.updateXrayResults(executionKey, testResults);
    
    return executionKey;
  }
  
  async updateXrayResults(executionKey, testResults) {
    const xrayPayload = {
      testExecutionKey: executionKey,
      tests: testResults.map(result => ({
        testKey: this.extractJiraKey(result.testTitle),
        status: this.mapStatusToXray(result.status),
        comment: result.comment,
        executedBy: this.username,
        finishedOn: new Date().toISOString()
      })).filter(test => test.testKey) // Only include tests with Jira keys
    };
    
    if (xrayPayload.tests.length === 0) {
      console.log('ℹ️ No Jira test keys found in test titles');
      return;
    }
    
    await this.client.post('/rest/raven/1.0/import/execution', xrayPayload);
  }
  
  async createBugForFailure(testTitle, errorMessage, executionKey) {
    const bugData = {
      fields: {
        project: { key: this.projectKey },
        summary: `Test Failure: ${testTitle}`,
        description: this.generateBugDescription(testTitle, errorMessage, executionKey),
        issuetype: { name: 'Bug' },
        priority: { name: 'High' },
        labels: ['automated-test', 'test-failure']
      }
    };
    
    const response = await this.client.post('/rest/api/2/issue', bugData);
    return response.data.key;
  }
  
  extractJiraKey(testTitle) {
    // Extract Jira key from test title (e.g., "PROJ-123: Test description")
    const match = testTitle.match(/([A-Z]+-\d+):/);
    return match ? match[1] : null;
  }
  
  mapStatusToXray(status) {
    const statusMap = {
      'passed': 'PASS',
      'failed': 'FAIL',
      'skipped': 'TODO',
      'timedOut': 'FAIL'
    };
    return statusMap[status] || 'FAIL';
  }
  
  generateExecutionDescription(testResults) {
    const summary = {
      total: testResults.length,
      passed: testResults.filter(r => r.status === 'passed').length,
      failed: testResults.filter(r => r.status === 'failed').length
    };
    
    return `
Automated test execution results:

Summary:
- Total Tests: ${summary.total}
- Passed: ${summary.passed}
- Failed: ${summary.failed}
- Pass Rate: ${((summary.passed / summary.total) * 100).toFixed(1)}%

Environment:
- Framework: Playwright
- Environment: ${process.env.NODE_ENV || 'test'}
- Build: ${process.env.BUILD_NUMBER || 'local'}
- Browser: ${process.env.BROWSER || 'chromium'}
- Executed: ${new Date().toISOString()}
    `.trim();
  }
  
  generateBugDescription(testTitle, errorMessage, executionKey) {
    return `
*Test Failure Report*

*Test:* ${testTitle}
*Error:* ${errorMessage}
*Test Execution:* ${executionKey}

*Environment Details:*
- Framework: Playwright
- Environment: ${process.env.NODE_ENV || 'test'}  
- Build: ${process.env.BUILD_NUMBER || 'local'}
- Browser: ${process.env.BROWSER || 'chromium'}
- Timestamp: ${new Date().toISOString()}

*Next Steps:*
1. Review test execution details
2. Analyze error logs and screenshots  
3. Verify if issue is environmental or code-related
4. Update test or application code as needed
    `.trim();
  }
}

module.exports = JiraClient;
```

### Step 2.2: Create Jira Reporter

Create `reporters/jira-reporter.js`:

```javascript
// reporters/jira-reporter.js
const JiraClient = require('../integrations/jira-client');
const IntegrationHelper = require('../utils/integration-helper');

class JiraReporter {
  constructor(options = {}) {
    this.config = {
      baseUrl: options.baseUrl || process.env.JIRA_BASE_URL,
      username: options.username || process.env.JIRA_USERNAME,
      apiToken: options.apiToken || process.env.JIRA_API_TOKEN,
      projectKey: options.projectKey || process.env.JIRA_PROJECT_KEY
    };
    
    this.createBugsForFailures = options.createBugsForFailures || false;
    this.validateConfig();
    
    this.client = new JiraClient(this.config);
    this.integrationHelper = new IntegrationHelper({
      maxRetries: 3,
      retryDelay: 2000,
      timeout: 20000
    });
    
    this.testResults = [];
  }
  
  validateConfig() {
    const required = ['baseUrl', 'username', 'apiToken', 'projectKey'];
    const missing = required.filter(key => !this.config[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing Jira configuration: ${missing.join(', ')}`);
    }
  }
  
  async onBegin() {
    console.log('🚀 Starting Jira integration...');
    
    const isHealthy = await this.integrationHelper.safeExecute(
      () => this.client.healthCheck(),
      false,
      'Jira health check'
    );
    
    if (!isHealthy) {
      console.warn('⚠️ Jira connection failed, disabling integration');
      this.disabled = true;
    }
  }
  
  async onTestEnd(test, result) {
    if (this.disabled) return;
    
    this.testResults.push({
      testTitle: test.title,
      status: result.status,
      error: result.error?.message,
      duration: result.duration,
      comment: this.generateTestComment(test, result)
    });
  }
  
  async onEnd() {
    if (this.disabled || this.testResults.length === 0) return;
    
    try {
      // Create test execution
      const executionSummary = `Automated Test Execution - ${new Date().toISOString()}`;
      
      const executionKey = await this.integrationHelper.withRetry(
        () => this.client.createTestExecution(executionSummary, this.testResults),
        'Jira test execution creation'
      );
      
      console.log(`✅ Created Jira test execution: ${executionKey}`);
      
      // Create bugs for failures if enabled
      if (this.createBugsForFailures) {
        await this.createBugsForFailures(executionKey);
      }
      
    } catch (error) {
      console.error('❌ Jira integration failed:', error);
    }
  }
  
  async createBugsForFailures(executionKey) {
    const failedTests = this.testResults.filter(r => r.status === 'failed');
    
    for (const failedTest of failedTests) {
      await this.integrationHelper.safeExecute(
        () => this.client.createBugForFailure(
          failedTest.testTitle,
          failedTest.error,
          executionKey
        ),
        null,
        `Bug creation for ${failedTest.testTitle}`
      );
    }
    
    if (failedTests.length > 0) {
      console.log(`✅ Created ${failedTests.length} bug reports in Jira`);
    }
  }
  
  generateTestComment(test, result) {
    let comment = result.status === 'passed' ? 
      'Test executed successfully' : 
      `Test failed with error: ${result.error?.message || 'Unknown error'}`;
    
    comment += `\n\nTest Details:`;
    comment += `\nDuration: ${result.duration ? Math.round(result.duration / 1000) + 's' : 'N/A'}`;
    comment += `\nFile: ${test.location?.file || 'Unknown'}`;
    comment += `\nEnvironment: ${process.env.NODE_ENV || 'test'}`;
    
    return comment;
  }
}

module.exports = JiraReporter;
```

---

## Part 3: Custom Webhook System Creation (30 minutes)

### Step 3.1: Create Webhook Client

Create `integrations/webhook-client.js`:

```javascript
// integrations/webhook-client.js
const axios = require('axios');
const crypto = require('crypto');

class WebhookClient {
  constructor(config) {
    this.webhooks = config.webhooks || [];
    this.secret = config.secret;
    this.defaultHeaders = config.headers || {};
    this.timeout = config.timeout || 10000;
    
    this.client = axios.create({
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Playwright-Webhook-Client/1.0',
        ...this.defaultHeaders
      }
    });
  }
  
  async sendWebhook(event, payload) {
    const webhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      source: 'playwright-tests',
      data: payload
    };
    
    // Add signature if secret is provided
    if (this.secret) {
      webhookPayload.signature = this.generateSignature(webhookPayload);
    }
    
    const results = await Promise.allSettled(
      this.webhooks.map(webhook => this.sendToWebhook(webhook, webhookPayload))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`📡 Webhook delivery: ${successful} successful, ${failed} failed`);
    
    return { successful, failed, results };
  }
  
  async sendToWebhook(webhook, payload) {
    const startTime = Date.now();
    
    try {
      const response = await this.client.post(webhook.url, payload, {
        headers: webhook.headers || {}
      });
      
      const duration = Date.now() - startTime;
      console.log(`✅ Webhook delivered to ${webhook.url} (${duration}ms)`);
      
      return {
        webhook: webhook.url,
        success: true,
        status: response.status,
        duration
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Webhook failed for ${webhook.url}: ${error.message}`);
      
      return {
        webhook: webhook.url,
        success: false,
        error: error.message,
        duration
      };
    }
  }
  
  generateSignature(payload) {
    const payloadString = JSON.stringify(payload);
    return crypto
      .createHmac('sha256', this.secret)
      .update(payloadString)
      .digest('hex');
  }
  
  async healthCheck() {
    console.log(`🏥 Testing ${this.webhooks.length} webhook endpoints...`);
    
    const healthResults = await Promise.allSettled(
      this.webhooks.map(async (webhook) => {
        try {
          // Send minimal health check payload
          const testPayload = {
            event: 'health_check',
            timestamp: new Date().toISOString(),
            source: 'playwright-webhook-client'
          };
          
          const result = await this.sendToWebhook(webhook, testPayload);
          return result.success;
        } catch (error) {
          return false;
        }
      })
    );
    
    const healthyCount = healthResults.filter(r => r.status === 'fulfilled' && r.value).length;
    console.log(`🏥 Webhook health: ${healthyCount}/${this.webhooks.length} healthy`);
    
    return healthyCount > 0; // At least one webhook should be healthy
  }
}

module.exports = WebhookClient;
```

### Step 3.2: Create Webhook Reporter

Create `reporters/webhook-reporter.js`:

```javascript
// reporters/webhook-reporter.js
const WebhookClient = require('../integrations/webhook-client');
const IntegrationHelper = require('../utils/integration-helper');

class WebhookReporter {
  constructor(options = {}) {
    this.config = {
      webhooks: options.webhooks || this.parseWebhooksFromEnv(),
      secret: options.secret || process.env.WEBHOOK_SECRET,
      headers: options.headers || {},
      timeout: options.timeout || 10000
    };
    
    if (this.config.webhooks.length === 0) {
      throw new Error('No webhook URLs configured');
    }
    
    this.client = new WebhookClient(this.config);
    this.integrationHelper = new IntegrationHelper({
      maxRetries: 2,
      retryDelay: 1000,
      timeout: this.config.timeout
    });
    
    this.testResults = [];
    this.startTime = new Date();
  }
  
  parseWebhooksFromEnv() {
    const webhookUrls = process.env.WEBHOOK_URLS?.split(',') || [];
    return webhookUrls.map(url => ({ url: url.trim() }));
  }
  
  async onBegin() {
    console.log('🚀 Starting webhook integration...');
    
    const isHealthy = await this.integrationHelper.safeExecute(
      () => this.client.healthCheck(),
      false,
      'Webhook health check'
    );
    
    if (!isHealthy) {
      console.warn('⚠️ All webhooks are unhealthy, but continuing...');
    }
    
    // Send test run started event
    await this.integrationHelper.safeExecute(
      () => this.client.sendWebhook('test_run_started', {
        startTime: this.startTime.toISOString(),
        environment: process.env.NODE_ENV || 'test',
        buildNumber: process.env.BUILD_NUMBER || 'local',
        gitBranch: process.env.GIT_BRANCH || 'main'
      }),
      null,
      'Test run started notification'
    );
  }
  
  async onTestEnd(test, result) {
    this.testResults.push({ test, result });
    
    // Send real-time failure notifications
    if (result.status === 'failed') {
      await this.integrationHelper.safeExecute(
        () => this.client.sendWebhook('test_failed', {
          testTitle: test.title,
          testFile: test.location?.file,
          error: result.error?.message,
          duration: result.duration,
          timestamp: new Date().toISOString()
        }),
        null,
        'Test failure notification'
      );
    }
  }
  
  async onEnd() {
    const endTime = new Date();
    const summary = this.generateSummary(endTime);
    
    // Send test run completed event
    await this.integrationHelper.safeExecute(
      () => this.client.sendWebhook('test_run_completed', summary),
      null,
      'Test run completed notification'
    );
    
    console.log('✅ Webhook integration completed');
  }
  
  generateSummary(endTime) {
    const passed = this.testResults.filter(r => r.result.status === 'passed').length;
    const failed = this.testResults.filter(r => r.result.status === 'failed').length;
    const skipped = this.testResults.filter(r => r.result.status === 'skipped').length;
    
    return {
      summary: {
        total: this.testResults.length,
        passed,
        failed, 
        skipped,
        passRate: this.testResults.length > 0 ? (passed / this.testResults.length) * 100 : 0,
        duration: endTime.getTime() - this.startTime.getTime()
      },
      execution: {
        startTime: this.startTime.toISOString(),
        endTime: endTime.toISOString(),
        environment: process.env.NODE_ENV || 'test',
        buildNumber: process.env.BUILD_NUMBER || 'local',
        gitBranch: process.env.GIT_BRANCH || 'main',
        gitCommit: process.env.GIT_COMMIT || 'unknown'
      },
      failures: this.testResults
        .filter(r => r.result.status === 'failed')
        .map(r => ({
          title: r.test.title,
          file: r.test.location?.file,
          error: r.result.error?.message,
          duration: r.result.duration
        }))
    };
  }
}

module.exports = WebhookReporter;
```

---

## Part 4: Multi-Platform Orchestration (35 minutes)

### Step 4.1: Create Integration Orchestrator

Create `reporters/orchestrated-reporter.js`:

```javascript
// reporters/orchestrated-reporter.js
const TestRailReporter = require('./testrail-reporter');
const JiraReporter = require('./jira-reporter');
const WebhookReporter = require('./webhook-reporter');
const SlackReporter = require('./slack-reporter');

class OrchestratedReporter {
  constructor(options = {}) {
    this.config = options;
    this.reporters = [];
    this.performanceMetrics = {};
    this.startTime = new Date();
    
    this.initializeReporters();
  }
  
  initializeReporters() {
    console.log('🎭 Initializing orchestrated reporting...');
    
    const reporterConfigs = [
      {
        name: 'TestRail',
        reporter: TestRailReporter,
        config: this.config.testRail,
        priority: 9
      },
      {
        name: 'Jira',
        reporter: JiraReporter, 
        config: this.config.jira,
        priority: 8
      },
      {
        name: 'Slack',
        reporter: SlackReporter,
        config: this.config.slack,
        priority: 7
      },
      {
        name: 'Webhooks',
        reporter: WebhookReporter,
        config: this.config.webhooks,
        priority: 6
      }
    ];
    
    for (const reporterConfig of reporterConfigs) {
      if (reporterConfig.config?.enabled !== false) {
        try {
          const reporterInstance = new reporterConfig.reporter(reporterConfig.config);
          this.reporters.push({
            name: reporterConfig.name,
            instance: reporterInstance,
            priority: reporterConfig.priority,
            enabled: true
          });
          
          this.performanceMetrics[reporterConfig.name] = {
            calls: 0,
            totalTime: 0,
            errors: 0
          };
          
        } catch (error) {
          console.warn(`⚠️ Failed to initialize ${reporterConfig.name}:`, error.message);
        }
      }
    }
    
    // Sort by priority (higher first)
    this.reporters.sort((a, b) => b.priority - a.priority);
    
    console.log(`📋 Initialized ${this.reporters.length} reporters:`, 
                this.reporters.map(r => `${r.name}(${r.priority})`).join(', '));
  }
  
  async onBegin() {
    console.log('🎬 Starting orchestrated reporting...');
    
    await this.executeOnReporters('onBegin', [], true);
  }
  
  async onTestEnd(test, result) {
    await this.executeOnReporters('onTestEnd', [test, result], false);
  }
  
  async onEnd(result) {
    await this.executeOnReporters('onEnd', [result], true);
    
    this.generatePerformanceReport();
  }
  
  async executeOnReporters(method, args, critical = false) {
    const promises = this.reporters.map(async (reporter) => {
      if (!reporter.enabled) return;
      
      const startTime = Date.now();
      const metrics = this.performanceMetrics[reporter.name];
      
      try {
        metrics.calls++;
        
        if (typeof reporter.instance[method] === 'function') {
          await reporter.instance[method](...args);
        }
        
        const duration = Date.now() - startTime;
        metrics.totalTime += duration;
        
        console.log(`✅ ${reporter.name}.${method} completed (${duration}ms)`);
        
      } catch (error) {
        metrics.errors++;
        
        const duration = Date.now() - startTime;
        metrics.totalTime += duration;
        
        console.error(`❌ ${reporter.name}.${method} failed:`, error.message);
        
        if (critical && reporter.priority >= 8) {
          // Disable reporter on critical failures for high-priority integrations
          reporter.enabled = false;
          console.warn(`🚨 Disabled ${reporter.name} due to critical failure`);
        }
      }
    });
    
    // Execute in parallel
    await Promise.allSettled(promises);
  }
  
  generatePerformanceReport() {
    console.log('📊 Reporter Performance Summary:');
    console.table(
      Object.entries(this.performanceMetrics).map(([name, metrics]) => ({
        Reporter: name,
        Calls: metrics.calls,
        'Total Time (ms)': metrics.totalTime,
        'Avg Time (ms)': metrics.calls > 0 ? Math.round(metrics.totalTime / metrics.calls) : 0,
        Errors: metrics.errors,
        'Success Rate (%)': metrics.calls > 0 ? Math.round(((metrics.calls - metrics.errors) / metrics.calls) * 100) : 0
      }))
    );
  }
}

module.exports = OrchestratedReporter;
```

### Step 4.2: Create Configuration Manager

Create `config/reporting-config.js`:

```javascript
// config/reporting-config.js
class ReportingConfig {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
  }
  
  getOrchestratedConfig() {
    return {
      testRail: {
        enabled: this.isEnabled('TESTRAIL'),
        baseUrl: process.env.TESTRAIL_BASE_URL,
        username: process.env.TESTRAIL_USERNAME,
        apiKey: process.env.TESTRAIL_API_KEY,
        projectId: parseInt(process.env.TESTRAIL_PROJECT_ID || '0'),
        suiteId: parseInt(process.env.TESTRAIL_SUITE_ID || '0')
      },
      
      jira: {
        enabled: this.isEnabled('JIRA'),
        baseUrl: process.env.JIRA_BASE_URL,
        username: process.env.JIRA_USERNAME,
        apiToken: process.env.JIRA_API_TOKEN,
        projectKey: process.env.JIRA_PROJECT_KEY,
        createBugsForFailures: process.env.JIRA_CREATE_BUGS === 'true'
      },
      
      slack: {
        enabled: this.isEnabled('SLACK'),
        botToken: process.env.SLACK_BOT_TOKEN,
        channel: process.env.SLACK_CHANNEL || '#qa-automation',
        realTimeUpdates: process.env.SLACK_REAL_TIME === 'true'
      },
      
      webhooks: {
        enabled: this.isEnabled('WEBHOOKS'),
        webhooks: this.parseWebhooks(),
        secret: process.env.WEBHOOK_SECRET,
        timeout: parseInt(process.env.WEBHOOK_TIMEOUT || '10000')
      }
    };
  }
  
  isEnabled(integration) {
    return process.env[`${integration}_ENABLED`] === 'true';
  }
  
  parseWebhooks() {
    const urls = process.env.WEBHOOK_URLS?.split(',') || [];
    return urls.map(url => ({ url: url.trim() }));
  }
}

module.exports = ReportingConfig;
```

---

## Part 5: Error Handling and Circuit Breakers (25 minutes)

### Step 5.1: Implement Circuit Breaker Pattern

Create `utils/circuit-breaker.js`:

```javascript
// utils/circuit-breaker.js
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 60000; // 1 minute
    this.monitoringPeriod = options.monitoringPeriod || 10000; // 10 seconds
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
  }
  
  async execute(operation, fallback = null) {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
        console.log('🔄 Circuit breaker: Attempting reset (HALF_OPEN)');
      } else {
        console.log('⚡ Circuit breaker: OPEN - Using fallback');
        return fallback;
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.successCount++;
    
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      console.log('✅ Circuit breaker: Reset to CLOSED');
    }
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      console.log('❌ Circuit breaker: Back to OPEN');
    } else if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.log(`🚨 Circuit breaker: OPENED after ${this.failureCount} failures`);
    }
  }
  
  shouldAttemptReset() {
    return Date.now() - this.lastFailureTime > this.timeout;
  }
  
  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime
    };
  }
}

module.exports = CircuitBreaker;
```

### Step 5.2: Update Integration Helper with Circuit Breaker

Update `utils/integration-helper.js`:

```javascript
// utils/integration-helper.js (updated)
const CircuitBreaker = require('./circuit-breaker');

class IntegrationHelper {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.timeout = options.timeout || 10000;
    
    this.circuitBreakers = new Map();
  }
  
  getCircuitBreaker(name) {
    if (!this.circuitBreakers.has(name)) {
      this.circuitBreakers.set(name, new CircuitBreaker({
        failureThreshold: 3,
        timeout: 30000,
        monitoringPeriod: 10000
      }));
    }
    return this.circuitBreakers.get(name);
  }
  
  async withCircuitBreaker(operation, name, fallback = null) {
    const circuitBreaker = this.getCircuitBreaker(name);
    return await circuitBreaker.execute(operation, fallback);
  }
  
  async withRetryAndCircuitBreaker(operation, context, fallback = null) {
    const circuitBreaker = this.getCircuitBreaker(context);
    
    return await circuitBreaker.execute(async () => {
      return await this.withRetry(operation, context);
    }, fallback);
  }
  
  // ... existing methods ...
  
  getCircuitBreakerStatuses() {
    const statuses = {};
    for (const [name, breaker] of this.circuitBreakers) {
      statuses[name] = breaker.getStatus();
    }
    return statuses;
  }
}

module.exports = IntegrationHelper;
```

---

## Part 6: Performance Monitoring and Health Checks (20 minutes)

### Step 6.1: Create Health Monitor

Create `utils/health-monitor.js`:

```javascript
// utils/health-monitor.js
class HealthMonitor {
  constructor() {
    this.checks = new Map();
    this.history = [];
    this.maxHistorySize = 100;
  }
  
  registerCheck(name, checkFunction, options = {}) {
    this.checks.set(name, {
      name,
      check: checkFunction,
      timeout: options.timeout || 5000,
      interval: options.interval || 30000,
      critical: options.critical || false,
      lastResult: null,
      lastChecked: null
    });
  }
  
  async runHealthChecks() {
    console.log('🏥 Running health checks...');
    
    const results = [];
    
    for (const [name, checkConfig] of this.checks) {
      const startTime = Date.now();
      
      try {
        const result = await Promise.race([
          checkConfig.check(),
          this.timeoutPromise(checkConfig.timeout)
        ]);\n        \n        const duration = Date.now() - startTime;\n        \n        const checkResult = {\n          name,\n          status: result ? 'HEALTHY' : 'UNHEALTHY',\n          duration,\n          timestamp: new Date().toISOString(),\n          critical: checkConfig.critical\n        };\n        \n        checkConfig.lastResult = checkResult;\n        checkConfig.lastChecked = Date.now();\n        \n        results.push(checkResult);\n        \n        console.log(`${result ? '✅' : '❌'} ${name}: ${checkResult.status} (${duration}ms)`);\n        \n      } catch (error) {\n        const duration = Date.now() - startTime;\n        \n        const checkResult = {\n          name,\n          status: 'ERROR',\n          error: error.message,\n          duration,\n          timestamp: new Date().toISOString(),\n          critical: checkConfig.critical\n        };\n        \n        checkConfig.lastResult = checkResult;\n        checkConfig.lastChecked = Date.now();\n        \n        results.push(checkResult);\n        \n        console.error(`❌ ${name}: ERROR - ${error.message} (${duration}ms)`);\n      }\n    }\n    \n    // Store in history\n    this.history.push({\n      timestamp: new Date().toISOString(),\n      results: [...results]\n    });\n    \n    // Trim history\n    if (this.history.length > this.maxHistorySize) {\n      this.history = this.history.slice(-this.maxHistorySize);\n    }\n    \n    return results;\n  }\n  \n  getHealthSummary() {\n    const latest = this.history[this.history.length - 1];\n    if (!latest) return null;\n    \n    const summary = {\n      timestamp: latest.timestamp,\n      overall: 'HEALTHY',\n      checks: latest.results.length,\n      healthy: latest.results.filter(r => r.status === 'HEALTHY').length,\n      unhealthy: latest.results.filter(r => r.status === 'UNHEALTHY').length,\n      errors: latest.results.filter(r => r.status === 'ERROR').length,\n      criticalIssues: latest.results.filter(r => r.critical && r.status !== 'HEALTHY').length\n    };\n    \n    // Determine overall status\n    if (summary.criticalIssues > 0) {\n      summary.overall = 'CRITICAL';\n    } else if (summary.errors > 0 || summary.unhealthy > 0) {\n      summary.overall = 'DEGRADED';\n    }\n    \n    return summary;\n  }\n  \n  timeoutPromise(timeout) {\n    return new Promise((_, reject) => {\n      setTimeout(() => {\n        reject(new Error(`Health check timed out after ${timeout}ms`));\n      }, timeout);\n    });\n  }\n}\n\nmodule.exports = HealthMonitor;\n```\n\n### Step 6.2: Create Performance Tracker\n\nCreate `utils/performance-tracker.js`:\n\n```javascript\n// utils/performance-tracker.js\nclass PerformanceTracker {\n  constructor() {\n    this.metrics = new Map();\n    this.thresholds = new Map();\n  }\n  \n  setThreshold(operation, maxDuration) {\n    this.thresholds.set(operation, maxDuration);\n  }\n  \n  async trackOperation(operation, operationName, context = {}) {\n    const startTime = Date.now();\n    const startMemory = process.memoryUsage();\n    \n    try {\n      const result = await operation();\n      \n      const endTime = Date.now();\n      const endMemory = process.memoryUsage();\n      const duration = endTime - startTime;\n      \n      this.recordMetric(operationName, {\n        duration,\n        status: 'success',\n        memoryDelta: {\n          heapUsed: endMemory.heapUsed - startMemory.heapUsed,\n          heapTotal: endMemory.heapTotal - startMemory.heapTotal\n        },\n        timestamp: new Date().toISOString(),\n        context\n      });\n      \n      this.checkThreshold(operationName, duration);\n      \n      return result;\n      \n    } catch (error) {\n      const endTime = Date.now();\n      const duration = endTime - startTime;\n      \n      this.recordMetric(operationName, {\n        duration,\n        status: 'error',\n        error: error.message,\n        timestamp: new Date().toISOString(),\n        context\n      });\n      \n      throw error;\n    }\n  }\n  \n  recordMetric(operationName, metric) {\n    if (!this.metrics.has(operationName)) {\n      this.metrics.set(operationName, []);\n    }\n    \n    const metrics = this.metrics.get(operationName);\n    metrics.push(metric);\n    \n    // Keep only last 100 metrics per operation\n    if (metrics.length > 100) {\n      metrics.shift();\n    }\n  }\n  \n  checkThreshold(operationName, duration) {\n    const threshold = this.thresholds.get(operationName);\n    if (threshold && duration > threshold) {\n      console.warn(`⚠️ Performance threshold exceeded for ${operationName}: ${duration}ms > ${threshold}ms`);\n    }\n  }\n  \n  getOperationStats(operationName) {\n    const metrics = this.metrics.get(operationName) || [];\n    if (metrics.length === 0) return null;\n    \n    const durations = metrics.map(m => m.duration);\n    const successful = metrics.filter(m => m.status === 'success').length;\n    \n    return {\n      operationName,\n      totalCalls: metrics.length,\n      successfulCalls: successful,\n      successRate: (successful / metrics.length) * 100,\n      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,\n      minDuration: Math.min(...durations),\n      maxDuration: Math.max(...durations),\n      medianDuration: this.calculateMedian(durations),\n      threshold: this.thresholds.get(operationName),\n      lastRun: metrics[metrics.length - 1].timestamp\n    };\n  }\n  \n  getAllStats() {\n    const stats = {};\n    for (const operationName of this.metrics.keys()) {\n      stats[operationName] = this.getOperationStats(operationName);\n    }\n    return stats;\n  }\n  \n  calculateMedian(values) {\n    const sorted = [...values].sort((a, b) => a - b);\n    const mid = Math.floor(sorted.length / 2);\n    return sorted.length % 2 === 0 \n      ? (sorted[mid - 1] + sorted[mid]) / 2 \n      : sorted[mid];\n  }\n  \n  generateReport() {\n    console.log('📊 Performance Report:');\n    console.table(\n      Object.values(this.getAllStats()).map(stat => ({\n        Operation: stat.operationName,\n        Calls: stat.totalCalls,\n        'Success Rate (%)': Math.round(stat.successRate),\n        'Avg (ms)': Math.round(stat.avgDuration),\n        'Min (ms)': stat.minDuration,\n        'Max (ms)': stat.maxDuration,\n        'Threshold (ms)': stat.threshold || 'N/A'\n      }))\n    );\n  }\n}\n\nmodule.exports = PerformanceTracker;\n```\n\n---\n\n## Part 7: Security and Credential Management (15 minutes)\n\n### Step 7.1: Create Secure Configuration Manager\n\nCreate `utils/secure-config.js`:\n\n```javascript\n// utils/secure-config.js\nconst crypto = require('crypto');\nconst fs = require('fs');\nconst path = require('path');\n\nclass SecureConfig {\n  constructor(options = {}) {\n    this.encryptionKey = options.encryptionKey || process.env.CONFIG_ENCRYPTION_KEY;\n    this.configPath = options.configPath || './.secure-config.json';\n  }\n  \n  encrypt(text) {\n    if (!this.encryptionKey) {\n      throw new Error('Encryption key not provided');\n    }\n    \n    const algorithm = 'aes-256-gcm';\n    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);\n    const iv = crypto.randomBytes(16);\n    \n    const cipher = crypto.createCipher(algorithm, key);\n    cipher.setAAD(Buffer.from('additional data'));\n    \n    let encrypted = cipher.update(text, 'utf8', 'hex');\n    encrypted += cipher.final('hex');\n    \n    const authTag = cipher.getAuthTag();\n    \n    return {\n      encrypted,\n      iv: iv.toString('hex'),\n      authTag: authTag.toString('hex')\n    };\n  }\n  \n  decrypt(encryptedData) {\n    if (!this.encryptionKey) {\n      throw new Error('Encryption key not provided');\n    }\n    \n    const algorithm = 'aes-256-gcm';\n    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);\n    \n    const decipher = crypto.createDecipher(algorithm, key);\n    decipher.setAAD(Buffer.from('additional data'));\n    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));\n    \n    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');\n    decrypted += decipher.final('utf8');\n    \n    return decrypted;\n  }\n  \n  storeSecureConfig(config) {\n    const sensitiveFields = [\n      'apiKey', 'apiToken', 'botToken', 'secret', 'password'\n    ];\n    \n    const secureConfig = JSON.parse(JSON.stringify(config));\n    \n    // Encrypt sensitive fields\n    this.encryptSensitiveFields(secureConfig, sensitiveFields);\n    \n    fs.writeFileSync(this.configPath, JSON.stringify(secureConfig, null, 2));\n    console.log('🔐 Secure configuration stored');\n  }\n  \n  loadSecureConfig() {\n    if (!fs.existsSync(this.configPath)) {\n      return null;\n    }\n    \n    const encryptedConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));\n    \n    // Decrypt sensitive fields\n    this.decryptSensitiveFields(encryptedConfig);\n    \n    console.log('🔓 Secure configuration loaded');\n    return encryptedConfig;\n  }\n  \n  encryptSensitiveFields(obj, sensitiveFields) {\n    for (const key in obj) {\n      if (typeof obj[key] === 'object' && obj[key] !== null) {\n        this.encryptSensitiveFields(obj[key], sensitiveFields);\n      } else if (sensitiveFields.includes(key) && typeof obj[key] === 'string') {\n        obj[key] = {\n          __encrypted: true,\n          ...this.encrypt(obj[key])\n        };\n      }\n    }\n  }\n  \n  decryptSensitiveFields(obj) {\n    for (const key in obj) {\n      if (typeof obj[key] === 'object' && obj[key] !== null) {\n        if (obj[key].__encrypted) {\n          obj[key] = this.decrypt(obj[key]);\n        } else {\n          this.decryptSensitiveFields(obj[key]);\n        }\n      }\n    }\n  }\n  \n  validateConfiguration(config) {\n    const errors = [];\n    \n    // Check required fields\n    if (config.testRail?.enabled && !config.testRail.apiKey) {\n      errors.push('TestRail API key is required when TestRail is enabled');\n    }\n    \n    if (config.jira?.enabled && !config.jira.apiToken) {\n      errors.push('Jira API token is required when Jira is enabled');\n    }\n    \n    if (config.slack?.enabled && !config.slack.botToken) {\n      errors.push('Slack bot token is required when Slack is enabled');\n    }\n    \n    if (errors.length > 0) {\n      throw new Error(`Configuration validation failed:\\n${errors.join('\\n')}`);\n    }\n    \n    console.log('✅ Configuration validation passed');\n    return true;\n  }\n}\n\nmodule.exports = SecureConfig;\n```\n\n---\n\n## Testing and Validation\n\n### Final Integration Test Script\n\nCreate `scripts/test-integrations.js`:\n\n```javascript\n// scripts/test-integrations.js\nconst OrchestratedReporter = require('../reporters/orchestrated-reporter');\nconst ReportingConfig = require('../config/reporting-config');\nconst HealthMonitor = require('../utils/health-monitor');\nconst PerformanceTracker = require('../utils/performance-tracker');\n\nasync function testIntegrations() {\n  console.log('🧪 Testing advanced integration patterns...');\n  \n  const config = new ReportingConfig();\n  const orchestratedConfig = config.getOrchestratedConfig();\n  \n  // Initialize performance tracking\n  const performanceTracker = new PerformanceTracker();\n  performanceTracker.setThreshold('reporter_initialization', 5000);\n  performanceTracker.setThreshold('test_notification', 2000);\n  \n  try {\n    // Test orchestrated reporter initialization\n    const reporter = await performanceTracker.trackOperation(\n      () => new OrchestratedReporter(orchestratedConfig),\n      'reporter_initialization'\n    );\n    \n    // Simulate test lifecycle\n    await performanceTracker.trackOperation(\n      () => reporter.onBegin(),\n      'test_begin'\n    );\n    \n    // Simulate some test results\n    const mockTests = [\n      {\n        title: 'C101: Login with valid credentials',\n        location: { file: 'auth.spec.ts' }\n      },\n      {\n        title: 'PROJ-123: User registration flow', \n        location: { file: 'registration.spec.ts' }\n      }\n    ];\n    \n    const mockResults = [\n      { status: 'passed', duration: 1500 },\n      { status: 'failed', duration: 2300, error: { message: 'Element not found' } }\n    ];\n    \n    for (let i = 0; i < mockTests.length; i++) {\n      await performanceTracker.trackOperation(\n        () => reporter.onTestEnd(mockTests[i], mockResults[i]),\n        'test_notification'\n      );\n    }\n    \n    await performanceTracker.trackOperation(\n      () => reporter.onEnd({ duration: 5000 }),\n      'test_end'\n    );\n    \n    // Generate performance report\n    performanceTracker.generateReport();\n    \n    console.log('✅ Integration testing completed successfully');\n    \n  } catch (error) {\n    console.error('❌ Integration testing failed:', error);\n    process.exit(1);\n  }\n}\n\nif (require.main === module) {\n  testIntegrations();\n}\n\nmodule.exports = testIntegrations;\n```\n\n## Summary\n\nThis advanced exercise demonstrated:\n\n- **Multi-platform integration** with TestRail, Jira, and custom webhooks\n- **Orchestrated reporting** with priority-based execution and error handling\n- **Circuit breaker patterns** for resilient integration management\n- **Performance monitoring** and health checks for production readiness\n- **Secure credential management** with encryption and validation\n- **Enterprise-grade error handling** with fallback mechanisms\n\nYou've built a comprehensive reporting system capable of handling complex enterprise requirements while maintaining reliability and security.\n