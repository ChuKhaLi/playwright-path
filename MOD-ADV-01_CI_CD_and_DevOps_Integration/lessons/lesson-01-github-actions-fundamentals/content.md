# Lesson 01: Advanced GitHub Actions Fundamentals

## Learning Objectives

By the end of this lesson, you will be able to:

- **Master GitHub Actions Architecture**: Understand advanced workflow patterns, job dependencies, and execution contexts
- **Develop Custom Actions**: Create, test, and publish reusable custom actions to the GitHub Marketplace
- **Implement Advanced Workflow Patterns**: Design complex workflows using matrices, conditionals, and dynamic configurations
- **Optimize Workflow Performance**: Apply caching strategies, parallel execution, and resource optimization techniques
- **Manage Enterprise Security**: Implement advanced secret management, OIDC authentication, and security hardening
- **Design Scalable CI/CD Architectures**: Create maintainable, enterprise-grade workflow systems

## Introduction

This lesson builds upon foundational CI/CD knowledge from MOD-04 to introduce advanced GitHub Actions capabilities essential for senior DevOps and automation engineering roles. While MOD-04 covered basic workflow creation, this module focuses on enterprise-level patterns, custom action development, and sophisticated automation strategies that enable you to lead DevOps transformations and architect production-grade CI/CD systems.

### Why Advanced GitHub Actions Skills Matter

In senior automation roles, you'll be expected to:
- **Architect Complex Systems**: Design CI/CD pipelines that scale across multiple teams and projects
- **Create Reusable Solutions**: Develop custom actions and templates that standardize processes organization-wide
- **Optimize for Performance**: Implement strategies that minimize build times and resource costs
- **Ensure Enterprise Security**: Apply advanced security practices for sensitive production environments
- **Lead Technical Initiatives**: Drive adoption of best practices and mentor other team members

## Part 1: Advanced GitHub Actions Architecture

### Understanding the GitHub Actions Ecosystem

GitHub Actions operates on a multi-layered architecture that enables complex automation scenarios:

```yaml
# Advanced workflow demonstrating architectural concepts
name: Enterprise CI/CD Pipeline
on:
  push:
    branches: [main, develop, 'release/*']
    paths-ignore: ['docs/**', '*.md']
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * 1-5'  # Weekdays at 2 AM UTC
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production
      run_e2e_tests:
        description: 'Run E2E tests'
        required: false
        default: true
        type: boolean

env:
  NODE_VERSION: '18'
  CACHE_VERSION: 'v1'
  
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}

jobs:
  setup:
    name: 'Setup and Validation'
    runs-on: ubuntu-latest
    outputs:
      cache-key: ${{ steps.cache-config.outputs.key }}
      matrix: ${{ steps.test-matrix.outputs.matrix }}
      skip-tests: ${{ steps.changes.outputs.skip-tests }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for proper change detection
          
      - name: Detect changes
        id: changes
        uses: dorny/paths-filter@v2
        with:
          filters: |
            src:
              - 'src/**'
              - 'tests/**'
              - 'package*.json'
              - 'playwright.config.ts'
            docs:
              - 'docs/**'
              - '*.md'
              
      - name: Configure cache key
        id: cache-config
        run: |
          echo "key=node-${{ env.NODE_VERSION }}-${{ hashFiles('package-lock.json') }}-${{ env.CACHE_VERSION }}" >> $GITHUB_OUTPUT
          
      - name: Generate test matrix
        id: test-matrix
        run: |
          if [[ "${{ steps.changes.outputs.src }}" == "true" ]]; then
            echo 'matrix={"browser":["chromium","firefox","webkit"],"os":["ubuntu-latest","windows-latest"],"node":["16","18","20"]}' >> $GITHUB_OUTPUT
          else
            echo 'matrix={"browser":["chromium"],"os":["ubuntu-latest"],"node":["18"]}' >> $GITHUB_OUTPUT
          fi
```

### Advanced Workflow Patterns

#### 1. Dynamic Matrix Generation

Traditional static matrices limit flexibility. Advanced implementations generate matrices dynamically based on repository changes, branch strategies, or external conditions:

```yaml
  generate-matrix:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate dynamic matrix
        id: set-matrix
        run: |
          # Analyze changed files and generate appropriate test matrix
          if git diff --name-only HEAD~1 | grep -q "src/api/"; then
            MATRIX='{"include":[
              {"test-suite":"api","browser":"chromium","os":"ubuntu-latest"},
              {"test-suite":"api","browser":"chromium","os":"windows-latest"},
              {"test-suite":"integration","browser":"chromium","os":"ubuntu-latest"}
            ]}'
          elif git diff --name-only HEAD~1 | grep -q "src/ui/"; then
            MATRIX='{"include":[
              {"test-suite":"ui","browser":"chromium","os":"ubuntu-latest"},
              {"test-suite":"ui","browser":"firefox","os":"ubuntu-latest"},
              {"test-suite":"ui","browser":"webkit","os":"ubuntu-latest"}
            ]}'
          else
            MATRIX='{"include":[{"test-suite":"smoke","browser":"chromium","os":"ubuntu-latest"}]}'
          fi
          echo "matrix=$MATRIX" >> $GITHUB_OUTPUT
```

#### 2. Job Dependencies and Conditional Execution

Advanced workflows use sophisticated job dependency chains with conditional execution:

```yaml
  security-scan:
    needs: [setup]
    if: ${{ needs.setup.outputs.skip-tests != 'true' }}
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      actions: read
      contents: read
    steps:
      - uses: actions/checkout@v4
      
      - name: Run CodeQL Analysis
        uses: github/codeql-action/init@v2
        with:
          languages: typescript, javascript
          
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

  dependency-check:
    needs: [setup]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Cache dependency check database
        uses: actions/cache@v3
        with:
          path: ~/.gradle/dependency-check-data
          key: dependency-check-${{ hashFiles('package-lock.json') }}
          
      - name: Run dependency vulnerability scan
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'playwright-automation'
          path: '.'
          format: 'ALL'
          
      - name: Upload dependency check results
        uses: actions/upload-artifact@v3
        with:
          name: dependency-check-report
          path: reports/

  test:
    needs: [setup, security-scan, dependency-check]
    if: ${{ always() && (needs.security-scan.result == 'success' || needs.security-scan.result == 'skipped') }}
    strategy:
      fail-fast: false
      matrix: ${{ fromJSON(needs.setup.outputs.matrix) }}
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}
        
      - name: Run tests
        run: |
          npm run test:${{ matrix.test-suite || 'all' }} -- --project=${{ matrix.browser }}
        env:
          CI: true
          
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results-${{ matrix.os }}-${{ matrix.browser }}-${{ matrix.node }}
          path: |
            test-results/
            playwright-report/
```

### Advanced Caching Strategies

Effective caching is crucial for performance optimization in enterprise environments:

```yaml
  setup-cache:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Multi-layer caching strategy
      - name: Cache Node.js modules
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            node_modules
            ~/.cache/ms-playwright
          key: ${{ runner.os }}-node-${{ env.NODE_VERSION }}-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-${{ env.NODE_VERSION }}-
            ${{ runner.os }}-node-
            
      # Cache Playwright browsers separately for better reuse
      - name: Cache Playwright browsers
        uses: actions/cache@v3
        with:
          path: ~/.cache/ms-playwright
          key: playwright-browsers-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            playwright-browsers-
            
      # Custom cache for test artifacts
      - name: Cache test dependencies
        uses: actions/cache@v3
        with:
          path: |
            test-data/
            fixtures/
          key: test-deps-${{ hashFiles('tests/**/*.ts') }}
          restore-keys: |
            test-deps-
```

## Part 2: Custom Action Development

### Creating Reusable Custom Actions

Custom actions enable code reuse across workflows and repositories. Here's how to create professional-grade custom actions:

#### JavaScript Action Structure

```typescript
// action.yml
name: 'Advanced Playwright Test Runner'
description: 'Run Playwright tests with advanced configuration and reporting'
branding:
  icon: 'play-circle'
  color: 'green'

inputs:
  test-command:
    description: 'Test command to execute'
    required: false
    default: 'npm test'
  browsers:
    description: 'Comma-separated list of browsers'
    required: false
    default: 'chromium,firefox,webkit'
  reporters:
    description: 'Test reporters to use'
    required: false
    default: 'html,json,github'
  upload-artifacts:
    description: 'Upload test artifacts'
    required: false
    default: 'true'
  artifact-retention-days:
    description: 'Days to retain artifacts'
    required: false
    default: '30'
  parallel-workers:
    description: 'Number of parallel workers'
    required: false
    default: 'auto'
  base-url:
    description: 'Base URL for tests'
    required: false
  environment:
    description: 'Test environment'
    required: false
    default: 'staging'

outputs:
  test-results:
    description: 'Test execution results'
  report-url:
    description: 'URL to test report'
  coverage-percentage:
    description: 'Code coverage percentage'

runs:
  using: 'node20'
  main: 'dist/index.js'
```

```typescript
// src/main.ts
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as artifact from '@actions/artifact';
import * as glob from '@actions/glob';
import { promises as fs } from 'fs';
import path from 'path';

interface TestConfig {
  command: string;
  browsers: string[];
  reporters: string[];
  uploadArtifacts: boolean;
  retentionDays: number;
  parallelWorkers: string;
  baseUrl?: string;
  environment: string;
}

interface TestResults {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  duration: number;
  coverage?: number;
}

export async function run(): Promise<void> {
  try {
    const config = getInputConfiguration();
    core.info(`Starting Playwright tests with configuration: ${JSON.stringify(config, null, 2)}`);

    // Validate environment
    await validateEnvironment();

    // Setup test configuration
    await setupTestConfiguration(config);

    // Execute tests
    const results = await executeTests(config);

    // Process results and generate reports
    await processTestResults(results, config);

    // Upload artifacts if requested
    if (config.uploadArtifacts) {
      await uploadTestArtifacts(config.retentionDays);
    }

    // Set outputs
    setActionOutputs(results);

    core.info('Test execution completed successfully');
  } catch (error) {
    core.setFailed(`Action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getInputConfiguration(): TestConfig {
  return {
    command: core.getInput('test-command'),
    browsers: core.getInput('browsers').split(',').map(b => b.trim()),
    reporters: core.getInput('reporters').split(',').map(r => r.trim()),
    uploadArtifacts: core.getBooleanInput('upload-artifacts'),
    retentionDays: parseInt(core.getInput('artifact-retention-days'), 10),
    parallelWorkers: core.getInput('parallel-workers'),
    baseUrl: core.getInput('base-url') || undefined,
    environment: core.getInput('environment')
  };
}

async function validateEnvironment(): Promise<void> {
  try {
    await exec.exec('node', ['--version']);
    await exec.exec('npm', ['--version']);
    
    // Check if Playwright is installed
    try {
      await exec.exec('npx', ['playwright', '--version']);
    } catch (error) {
      throw new Error('Playwright is not installed. Please install Playwright first.');
    }
  } catch (error) {
    throw new Error(`Environment validation failed: ${error}`);
  }
}

async function setupTestConfiguration(config: TestConfig): Promise<void> {
  // Generate dynamic Playwright configuration
  const playwrightConfig = generatePlaywrightConfig(config);
  
  await fs.writeFile('playwright.config.generated.js', playwrightConfig);
  core.info('Generated dynamic Playwright configuration');
}

function generatePlaywrightConfig(config: TestConfig): string {
  return `
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: ${config.parallelWorkers === 'auto' ? 'process.env.CI ? 1 : undefined' : config.parallelWorkers},
  reporter: [
    ${config.reporters.map(r => `['${r}']`).join(',\n    ')}
  ],
  use: {
    baseURL: '${config.baseUrl || 'http://localhost:3000'}',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    ${config.browsers.map(browser => `{
      name: '${browser}',
      use: { ...devices['Desktop ${browser.charAt(0).toUpperCase() + browser.slice(1)}'] }
    }`).join(',\n    ')}
  ],
  webServer: process.env.CI ? undefined : {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI
  }
});
  `.trim();
}

async function executeTests(config: TestConfig): Promise<TestResults> {
  const startTime = Date.now();
  
  try {
    let exitCode = 0;
    const output: string[] = [];
    
    await exec.exec(config.command, [], {
      listeners: {
        stdout: (data: Buffer) => {
          output.push(data.toString());
        },
        stderr: (data: Buffer) => {
          output.push(data.toString());
        }
      },
      ignoreReturnCode: true
    });

    const duration = Date.now() - startTime;
    const results = await parseTestResults(output.join('\n'));
    
    return {
      ...results,
      duration
    };
  } catch (error) {
    throw new Error(`Test execution failed: ${error}`);
  }
}

async function parseTestResults(output: string): Promise<Omit<TestResults, 'duration'>> {
  // Parse test output to extract results
  // This would be more sophisticated in a real implementation
  const passedMatch = output.match(/(\d+) passed/);
  const failedMatch = output.match(/(\d+) failed/);
  const skippedMatch = output.match(/(\d+) skipped/);
  
  const passed = passedMatch ? parseInt(passedMatch[1], 10) : 0;
  const failed = failedMatch ? parseInt(failedMatch[1], 10) : 0;
  const skipped = skippedMatch ? parseInt(skippedMatch[1], 10) : 0;
  
  return {
    passed,
    failed,
    skipped,
    total: passed + failed + skipped
  };
}

async function processTestResults(results: TestResults, config: TestConfig): Promise<void> {
  // Generate enhanced test report
  const reportData = {
    summary: results,
    environment: config.environment,
    timestamp: new Date().toISOString(),
    browsers: config.browsers,
    configuration: config
  };
  
  await fs.writeFile('test-results/enhanced-report.json', JSON.stringify(reportData, null, 2));
  core.info(`Test results processed: ${results.passed} passed, ${results.failed} failed`);
}

async function uploadTestArtifacts(retentionDays: number): Promise<void> {
  const artifactClient = artifact.create();
  
  // Upload test results
  const testResultsPattern = 'test-results/**/*';
  const testResultsFiles = await glob.create(testResultsPattern).then(g => g.glob());
  
  if (testResultsFiles.length > 0) {
    await artifactClient.uploadArtifact(
      'test-results',
      testResultsFiles,
      'test-results',
      { retentionDays }
    );
  }
  
  // Upload reports
  const reportsPattern = 'playwright-report/**/*';
  const reportFiles = await glob.create(reportsPattern).then(g => g.glob());
  
  if (reportFiles.length > 0) {
    await artifactClient.uploadArtifact(
      'playwright-report',
      reportFiles,
      'playwright-report',
      { retentionDays }
    );
  }
}

function setActionOutputs(results: TestResults): void {
  core.setOutput('test-results', JSON.stringify(results));
  core.setOutput('coverage-percentage', results.coverage?.toString() || '0');
  core.setOutput('report-url', `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`);
}

if (require.main === module) {
  run();
}
```

#### Composite Action Example

For simpler actions that orchestrate existing actions:

```yaml
# action.yml for composite action
name: 'Complete E2E Test Suite'
description: 'Run complete E2E test suite with reporting and notifications'

inputs:
  environment:
    description: 'Target environment'
    required: true
  notification-webhook:
    description: 'Webhook URL for notifications'
    required: false
  upload-to-s3:
    description: 'Upload reports to S3'
    required: false
    default: 'false'
  s3-bucket:
    description: 'S3 bucket name'
    required: false

runs:
  using: 'composite'
  steps:
    - name: Setup test environment
      uses: ./.github/actions/setup-test-env
      with:
        environment: ${{ inputs.environment }}
        
    - name: Run E2E tests
      uses: ./.github/actions/playwright-runner
      with:
        browsers: 'chromium,firefox,webkit'
        reporters: 'html,json,junit'
        parallel-workers: '4'
        
    - name: Generate enhanced reports
      shell: bash
      run: |
        npm run generate-report -- --format=enhanced --environment=${{ inputs.environment }}
        
    - name: Upload to S3
      if: inputs.upload-to-s3 == 'true'
      uses: aws-actions/aws-cli-action@v1
      with:
        args: s3 sync ./reports s3://${{ inputs.s3-bucket }}/test-reports/$(date +%Y%m%d-%H%M%S)/
        
    - name: Send notifications
      if: inputs.notification-webhook != ''
      shell: bash
      run: |
        curl -X POST ${{ inputs.notification-webhook }} \
          -H "Content-Type: application/json" \
          -d '{
            "text": "E2E tests completed for ${{ inputs.environment }}",
            "environment": "${{ inputs.environment }}",
            "results_url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
          }'
```

### Publishing to GitHub Marketplace

#### Preparing for Publication

```json
// package.json
{
  "name": "advanced-playwright-runner",
  "version": "1.0.0",
  "description": "Advanced Playwright test runner with enterprise features",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc && ncc build src/main.ts -o dist",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "package": "npm run build && npm run test"
  },
  "keywords": [
    "github-actions",
    "playwright",
    "testing",
    "ci-cd",
    "automation"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@actions/core": "^1.10.0",
    "@actions/exec": "^1.1.1",
    "@actions/artifact": "^1.1.2",
    "@actions/glob": "^0.4.0"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "@vercel/ncc": "^0.36.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "typescript": "^4.9.0"
  }
}
```

#### Action Metadata Best Practices

```yaml
# action.yml - Production-ready metadata
name: 'Advanced Playwright Test Runner'
description: 'Enterprise-grade Playwright test execution with advanced reporting, caching, and notifications'
author: 'Your Organization'

branding:
  icon: 'play-circle'
  color: 'green'

inputs:
  test-command:
    description: 'Custom test command to execute'
    required: false
    default: 'npm test'
  browsers:
    description: 'Comma-separated list of browsers (chromium,firefox,webkit)'
    required: false
    default: 'chromium'
  # ... other inputs

outputs:
  test-results:
    description: 'JSON object containing test execution results'
  report-url:
    description: 'URL to the generated test report'
  coverage-percentage:
    description: 'Code coverage percentage (if available)'
  
runs:
  using: 'node20'
  main: 'dist/index.js'
```

## Part 3: Enterprise Security and Authentication

### Advanced Secret Management

Enterprise environments require sophisticated secret management strategies:

```yaml
# Workflow demonstrating advanced secret management
name: Production Deployment
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    permissions:
      id-token: write  # Required for OIDC authentication
      contents: read
      
    steps:
      - uses: actions/checkout@v4
      
      # OIDC authentication with AWS
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          role-session-name: GitHubActions
          aws-region: us-east-1
          
      # Retrieve secrets from AWS Secrets Manager
      - name: Retrieve database credentials
        uses: aws-actions/aws-secretsmanager-get-secrets@v1
        with:
          secret-ids: |
            production/database
            production/api-keys
          parse-json-secrets: true
          
      # Use HashiCorp Vault for additional secrets
      - name: Import secrets from Vault
        uses: hashicorp/vault-action@v2
        with:
          url: ${{ secrets.VAULT_URL }}
          method: jwt
          role: github-actions
          secrets: |
            secret/data/production database_url | DATABASE_URL ;
            secret/data/production api_key | API_KEY
            
      # Secure test execution with secrets
      - name: Run integration tests
        run: |
          npm test -- --grep="integration"
        env:
          DATABASE_URL: ${{ env.DATABASE_URL }}
          API_KEY: ${{ env.API_KEY }}
          NODE_ENV: production
```

### Security Hardening Best Practices

```yaml
# Security-hardened workflow example
name: Secure CI/CD Pipeline
on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read
  security-events: write
  actions: read

jobs:
  security-analysis:
    runs-on: ubuntu-latest
    steps:
      - name: Harden Runner
        uses: step-security/harden-runner@v2
        with:
          egress-policy: audit
          allowed-endpoints: >
            api.github.com:443
            github.com:443
            registry.npmjs.org:443
            
      - uses: actions/checkout@v4
        with:
          persist-credentials: false
          
      # Dependency vulnerability scanning
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
          
      # Static application security testing
      - name: Run Semgrep SAST
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/secrets
            p/owasp-top-ten
            
      # Container security scanning
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          format: 'sarif'
          output: 'trivy-results.sarif'
          
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

## Part 4: Performance Optimization and Monitoring

### Advanced Caching Strategies

```yaml
# Multi-tier caching implementation
jobs:
  test-with-advanced-caching:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Layer 1: Dependency caching
      - name: Cache Node.js dependencies
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            node_modules
          key: deps-${{ runner.os }}-node${{ matrix.node }}-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            deps-${{ runner.os }}-node${{ matrix.node }}-
            deps-${{ runner.os }}-
            
      # Layer 2: Build artifact caching
      - name: Cache build artifacts
        uses: actions/cache@v3
        with:
          path: |
            dist/
            .next/cache
            .nuxt/
          key: build-${{ runner.os }}-${{ github.sha }}
          restore-keys: |
            build-${{ runner.os }}-
            
      # Layer 3: Test data caching
      - name: Cache test fixtures and data
        uses: actions/cache@v3
        with:
          path: |
            tests/fixtures/
            test-data/
          key: test-data-${{ hashFiles('tests/**/*.json', 'tests/**/*.ts') }}
          restore-keys: |
            test-data-
            
      # Layer 4: Browser binary caching
      - name: Cache Playwright browsers
        uses: actions/cache@v3
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            playwright-${{ runner.os }}-
```

### Workflow Performance Monitoring

```yaml
# Performance monitoring and metrics collection
jobs:
  performance-monitoring:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Start performance monitoring
        run: |
          echo "WORKFLOW_START_TIME=$(date +%s)" >> $GITHUB_ENV
          echo "STEP_TIMES=" >> $GITHUB_ENV
          
      - name: Monitor step performance
        run: |
          STEP_START=$(date +%s)
          # Your step logic here
          npm ci
          STEP_END=$(date +%s)
          DURATION=$((STEP_END - STEP_START))
          echo "STEP_TIMES=${STEP_TIMES}npm-install:${DURATION}," >> $GITHUB_ENV
          
      - name: Collect performance metrics
        if: always()
        run: |
          WORKFLOW_END_TIME=$(date +%s)
          TOTAL_DURATION=$((WORKFLOW_END_TIME - WORKFLOW_START_TIME))
          
          # Create performance report
          cat > performance-report.json << EOF
          {
            "workflow_duration": ${TOTAL_DURATION},
            "step_durations": "${STEP_TIMES}",
            "runner_os": "${RUNNER_OS}",
            "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
            "commit_sha": "${GITHUB_SHA}",
            "branch": "${GITHUB_REF_NAME}"
          }
          EOF
          
      - name: Upload performance data
        uses: actions/upload-artifact@v3
        with:
          name: performance-metrics
          path: performance-report.json
```

## Part 5: Workflow Orchestration and Dependencies

### Complex Job Dependencies

```yaml
# Advanced job dependency patterns
jobs:
  # Parallel preparation jobs
  setup-env:
    runs-on: ubuntu-latest
    outputs:
      cache-key: ${{ steps.cache.outputs.key }}
    steps:
      - uses: actions/checkout@v4
      - id: cache
        run: echo "key=env-${{ hashFiles('package*.json') }}" >> $GITHUB_OUTPUT
        
  setup-data:
    runs-on: ubuntu-latest
    outputs:
      data-version: ${{ steps.data.outputs.version }}
    steps:
      - uses: actions/checkout@v4
      - id: data
        run: echo "version=data-${{ hashFiles('test-data/**') }}" >> $GITHUB_OUTPUT
        
  # Jobs that depend on multiple setup jobs
  unit-tests:
    needs: [setup-env]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run test:unit
        
  integration-tests:
    needs: [setup-env, setup-data]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run test:integration
        
  e2e-tests:
    needs: [setup-env, setup-data]
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run test:e2e -- --project=${{ matrix.browser }}
        
  # Job that waits for multiple test types
  test-summary:
    needs: [unit-tests, integration-tests, e2e-tests]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - name: Check test results
        run: |
          if [[ "${{ needs.unit-tests.result }}" == "failure" || 
                "${{ needs.integration-tests.result }}" == "failure" || 
                "${{ needs.e2e-tests.result }}" == "failure" ]]; then
            echo "Some tests failed"
            exit 1
          fi
          echo "All tests passed"
          
  # Conditional deployment based on test results
  deploy:
    needs: [test-summary]
    if: needs.test-summary.result == 'success' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - run: npm run deploy
```

### Advanced Matrix Strategies

```yaml
# Sophisticated matrix configurations
jobs:
  test-matrix:
    strategy:
      fail-fast: false
      matrix:
        include:
          # Full browser testing for main branch
          - os: ubuntu-latest
            node: '18'
            browser: chromium
            test-type: full
            if: github.ref == 'refs/heads/main'
          - os: ubuntu-latest
            node: '18'
            browser: firefox
            test-type: full
            if: github.ref == 'refs/heads/main'
          - os: ubuntu-latest
            node: '18'
            browser: webkit
            test-type: full
            if: github.ref == 'refs/heads/main'
            
          # Cross-platform testing for releases
          - os: windows-latest
            node: '18'
            browser: chromium
            test-type: smoke
            if: startsWith(github.ref, 'refs/heads/release/')
          - os: macos-latest
            node: '18'
            browser: webkit
            test-type: smoke
            if: startsWith(github.ref, 'refs/heads/release/')
            
          # Quick validation for feature branches
          - os: ubuntu-latest
            node: '18'
            browser: chromium
            test-type: smoke
            if: github.event_name == 'pull_request'
            
    runs-on: ${{ matrix.os }}
    if: matrix.if
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
          
      - name: Run tests
        run: npm run test:${{ matrix.test-type }} -- --project=${{ matrix.browser }}
```

## Practical Exercises

### Exercise 1: Custom Action Development

**Objective**: Create a custom action that orchestrates Playwright testing with advanced features.

**Requirements**:
1. Create a JavaScript action that:
   - Accepts configuration for browsers, test types, and reporting
   - Implements dynamic test execution based on changed files
   - Generates enhanced reports with screenshots and videos
   - Uploads artifacts with configurable retention
   - Provides detailed outputs for downstream jobs

2. Include comprehensive error handling and logging
3. Write tests for your action using Jest
4. Create proper documentation and examples

**Starter Code**:
```typescript
// Create this action in a separate repository
// File: src/main.ts
import * as core from '@actions/core';
import * as exec from '@actions/exec';

interface ActionInputs {
  // Define your inputs here
}

export async function run(): Promise<void> {
  try {
    // Implement your action logic
    const inputs = getInputs();
    await executeTests(inputs);
    setOutputs();
  } catch (error) {
    core.setFailed(`Action failed: ${error}`);
  }
}

function getInputs(): ActionInputs {
  // Implementation here
}

async function executeTests(inputs: ActionInputs): Promise<void> {
  // Implementation here
}

function setOutputs(): void {
  // Implementation here
}

if (require.main === module) {
  run();
}
```

### Exercise 2: Enterprise Workflow Architecture

**Objective**: Design a production-ready workflow for a complex application.

**Scenario**: You're working for an e-commerce company with:
- Multiple microservices
- Web frontend and mobile app
- Multiple environments (dev, staging, production)
- Compliance requirements (SOX, PCI DSS)
- Global team working across timezones

**Requirements**:
1. Create a workflow that:
   - Handles different types of changes (frontend, backend, infrastructure)
   - Implements progressive deployment (dev → staging → production)
   - Includes security scanning and compliance checks
   - Supports emergency hotfix deployments
   - Provides comprehensive monitoring and alerting

2. Implement proper secret management and security hardening
3. Optimize for performance with advanced caching
4. Include failure recovery and rollback mechanisms

### Exercise 3: Marketplace Action Publication

**Objective**: Publish your custom action to the GitHub Marketplace.

**Steps**:
1. Prepare your action for publication:
   - Clean up code and add comprehensive documentation
   - Create examples and usage instructions
   - Add proper branding and metadata
   - Test thoroughly across different scenarios

2. Submit to GitHub Marketplace:
   - Create a public repository
   - Add marketplace metadata
   - Submit for review
   - Handle feedback and approval process

3. Maintain and update:
   - Monitor usage and feedback
   - Implement feature requests
   - Keep dependencies updated
   - Provide community support

## Assessment and Review

### Knowledge Check Questions

1. **Architecture Understanding**: Explain the difference between jobs, steps, and actions in GitHub Actions. How do job dependencies affect workflow execution?

2. **Custom Action Design**: When would you choose a JavaScript action over a composite action? What are the trade-offs?

3. **Security Implementation**: Describe how OIDC authentication works in GitHub Actions and why it's preferred over long-lived credentials.

4. **Performance Optimization**: What caching strategies would you implement for a large monorepo with multiple test suites?

5. **Matrix Strategy**: How would you design a matrix strategy that adapts based on the type of changes in a pull request?

### Practical Assessment

Create a comprehensive workflow that demonstrates:
- Custom action usage
- Advanced caching
- Security hardening
- Performance monitoring
- Complex job dependencies
- Error handling and recovery

### Professional Application

Prepare a presentation for your team covering:
- Benefits of advanced GitHub Actions patterns
- Migration strategy from existing CI/CD tools
- Cost optimization opportunities
- Security improvements
- Maintenance and support considerations

## Summary and Next Steps

This lesson covered advanced GitHub Actions capabilities essential for senior DevOps roles:

### Key Achievements
- **Advanced Architecture**: Understanding of complex workflow patterns and dependencies
- **Custom Action Development**: Ability to create, test, and publish reusable actions
- **Enterprise Security**: Implementation of advanced security and authentication patterns
- **Performance Optimization**: Strategies for efficient resource usage and fast execution
- **Professional Skills**: Preparation for leading DevOps transformations

### Next Lesson Preview
Lesson 02 will build on these fundamentals to explore:
- Multi-repository workflows and organization-level automation
- Advanced matrix strategies and dynamic configuration
- Integration with external tools and services
- Enterprise governance and compliance patterns
- Advanced debugging and troubleshooting techniques

### Recommended Practice
1. **Create Custom Actions**: Develop 2-3 custom actions for common tasks in your organization
2. **Optimize Existing Workflows**: Apply advanced patterns to improve current CI/CD pipelines
3. **Security Review**: Audit existing workflows for security improvements
4. **Documentation**: Create comprehensive documentation for your workflow architectures
5. **Community Contribution**: Contribute to open-source actions or create useful community tools

The skills learned in this lesson prepare you for senior automation engineering roles where you'll be expected to architect enterprise-grade CI/CD systems, lead technical initiatives, and mentor other team members in advanced DevOps practices.