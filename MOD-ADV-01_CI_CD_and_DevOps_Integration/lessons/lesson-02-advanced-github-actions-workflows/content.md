# Lesson 02: Advanced GitHub Actions Workflows

## Learning Objectives

By the end of this lesson, you will be able to:

- **Design Multi-Repository Workflows**: Create workflows that coordinate testing and deployment across multiple repositories and services
- **Implement Organization-Level Automation**: Design centralized governance patterns, reusable workflow templates, and organization-wide standards
- **Master Advanced Matrix Strategies**: Create dynamic, conditional matrices that optimize resource usage and execution time
- **Integrate External Tools and Services**: Connect workflows with enterprise tools like Jira, Slack, monitoring systems, and cloud services
- **Apply Enterprise Governance Patterns**: Implement approval workflows, security scanning, compliance automation, and audit trails
- **Optimize Workflow Performance**: Design high-performance workflows with intelligent caching, parallel execution, and resource management
- **Implement Advanced Conditional Logic**: Create sophisticated conditional execution patterns based on repository changes, external events, and business logic
- **Design Deployment Orchestration**: Coordinate complex deployment scenarios across multiple environments and services

## Introduction

As organizations scale their CI/CD practices, single-repository workflows become insufficient for managing complex, distributed systems. This lesson explores advanced GitHub Actions patterns that enable enterprise-level automation, covering multi-service orchestration, organization governance, and sophisticated workflow architectures that prepare you for senior DevOps engineering roles.

Advanced workflow design requires understanding not just the technical implementation, but also organizational needs, security requirements, and operational excellence. You'll learn patterns used by companies like GitHub, Netflix, and Shopify to manage thousands of repositories and coordinate complex deployment scenarios.

## Prerequisites Review

Before diving into advanced workflows, ensure you have mastered:
- Custom action development (Lesson 01)
- Advanced secret management and OIDC authentication
- Complex job dependencies and conditional execution
- Performance optimization and caching strategies

## 1. Multi-Repository Workflow Architectures

### 1.1 Understanding Multi-Repository Challenges

Modern applications often span multiple repositories:
- **Microservices Architecture**: Each service in its own repository
- **Monorepo vs Polyrepo**: Different strategies for code organization
- **Shared Libraries**: Common dependencies across multiple projects
- **Infrastructure as Code**: Separate repositories for infrastructure definitions

**Enterprise Challenge**: How do you coordinate testing and deployment when a single feature requires changes across 5+ repositories?

### 1.2 Repository Dispatching Patterns

#### Cross-Repository Workflow Triggering

```yaml
# In microservice-a/.github/workflows/trigger-integration.yml
name: Trigger Integration Tests

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      target_environment:
        description: 'Target environment for integration tests'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production

jobs:
  trigger-downstream:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Integration Test Suite
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.CROSS_REPO_TOKEN }}
          script: |
            // Trigger workflows in dependent repositories
            const repositories = [
              'org/microservice-b',
              'org/microservice-c',
              'org/integration-tests'
            ];
            
            const results = [];
            
            for (const repo of repositories) {
              const [owner, repoName] = repo.split('/');
              
              try {
                const response = await github.rest.actions.createWorkflowDispatch({
                  owner,
                  repo: repoName,
                  workflow_id: 'integration-test.yml',
                  ref: 'main',
                  inputs: {
                    source_repo: context.repo.repo,
                    source_sha: context.sha,
                    target_environment: '${{ inputs.target_environment }}',
                    correlation_id: context.runId.toString()
                  }
                });
                
                results.push({
                  repository: repo,
                  status: 'triggered',
                  runId: response.data?.id
                });
                
                core.info(`✅ Triggered workflow in ${repo}`);
              } catch (error) {
                core.setFailed(`❌ Failed to trigger workflow in ${repo}: ${error.message}`);
                results.push({
                  repository: repo,
                  status: 'failed',
                  error: error.message
                });
              }
            }
            
            // Store results for downstream jobs
            core.setOutput('trigger_results', JSON.stringify(results));

      - name: Wait for Integration Tests
        id: wait-for-tests
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.CROSS_REPO_TOKEN }}
          script: |
            const triggerResults = JSON.parse('${{ steps.trigger-downstream.outputs.trigger_results }}');
            const maxWaitTime = 30 * 60 * 1000; // 30 minutes
            const pollInterval = 30 * 1000; // 30 seconds
            const startTime = Date.now();
            
            let allComplete = false;
            const finalResults = [];
            
            while (!allComplete && (Date.now() - startTime) < maxWaitTime) {
              allComplete = true;
              
              for (const result of triggerResults) {
                if (result.status !== 'triggered') continue;
                
                const [owner, repoName] = result.repository.split('/');
                
                try {
                  // Get the latest workflow run with our correlation ID
                  const runs = await github.rest.actions.listWorkflowRuns({
                    owner,
                    repo: repoName,
                    workflow_id: 'integration-test.yml',
                    per_page: 10
                  });
                  
                  const correlatedRun = runs.data.workflow_runs.find(run => 
                    run.head_commit?.message?.includes(context.runId.toString()) ||
                    run.display_title?.includes(context.runId.toString())
                  );
                  
                  if (correlatedRun) {
                    if (['completed'].includes(correlatedRun.status)) {
                      finalResults.push({
                        repository: result.repository,
                        status: correlatedRun.conclusion,
                        run_url: correlatedRun.html_url,
                        duration: correlatedRun.updated_at ? 
                          new Date(correlatedRun.updated_at) - new Date(correlatedRun.created_at) : null
                      });
                    } else {
                      allComplete = false;
                      core.info(`⏳ Waiting for ${result.repository} (status: ${correlatedRun.status})`);
                    }
                  } else {
                    allComplete = false;
                    core.info(`⏳ Waiting for ${result.repository} to start...`);
                  }
                } catch (error) {
                  core.warning(`⚠️ Error checking status for ${result.repository}: ${error.message}`);
                  finalResults.push({
                    repository: result.repository,
                    status: 'error',
                    error: error.message
                  });
                }
              }
              
              if (!allComplete) {
                await new Promise(resolve => setTimeout(resolve, pollInterval));
              }
            }
            
            // Check if we timed out
            if (!allComplete) {
              core.setFailed('⏰ Timeout waiting for integration tests to complete');
            }
            
            // Report final results
            const successful = finalResults.filter(r => r.status === 'success').length;
            const failed = finalResults.filter(r => r.status === 'failure').length;
            const errors = finalResults.filter(r => r.status === 'error').length;
            
            core.info(`📊 Integration Test Results:`);
            core.info(`✅ Successful: ${successful}`);
            core.info(`❌ Failed: ${failed}`);
            core.info(`⚠️ Errors: ${errors}`);
            
            finalResults.forEach(result => {
              if (result.run_url) {
                core.info(`🔗 ${result.repository}: ${result.status} - ${result.run_url}`);
              }
            });
            
            if (failed > 0 || errors > 0) {
              core.setFailed(`Integration tests failed: ${failed} failures, ${errors} errors`);
            }
            
            return finalResults;
```

### 1.3 Organization-Level Workflow Templates

#### Creating Reusable Workflow Templates

```yaml
# In .github/workflow-templates/advanced-ci.yml
name: Advanced CI Template
description: Enterprise-grade CI workflow with comprehensive testing and security scanning

on:
  push:
    branches: [$default-branch, develop]
  pull_request:
    branches: [$default-branch]

env:
  # Template variables - to be customized per repository
  NODE_VERSION: '18'
  PYTHON_VERSION: '3.11'
  DOCKER_REGISTRY: '${{ vars.DOCKER_REGISTRY }}'
  SECURITY_SCAN_ENABLED: true
  PERFORMANCE_TEST_ENABLED: false

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      backend: ${{ steps.changes.outputs.backend }}
      frontend: ${{ steps.changes.outputs.frontend }}
      infrastructure: ${{ steps.changes.outputs.infrastructure }}
      docs: ${{ steps.changes.outputs.docs }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            backend:
              - 'src/**'
              - 'api/**'
              - '**/*.py'
              - '**/*.js'
              - '**/*.ts'
              - 'requirements.txt'
              - 'package.json'
            frontend:
              - 'public/**'
              - 'components/**'
              - 'pages/**'
              - '**/*.vue'
              - '**/*.jsx'
              - '**/*.tsx'
            infrastructure:
              - 'terraform/**'
              - 'k8s/**'
              - 'docker/**'
              - 'Dockerfile*'
              - '.github/workflows/**'
            docs:
              - '**/*.md'
              - 'docs/**'

  security-scan:
    runs-on: ubuntu-latest
    if: env.SECURITY_SCAN_ENABLED == 'true'
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4
      
      - name: Run CodeQL Analysis
        uses: github/codeql-action/init@v3
        with:
          languages: javascript, python, typescript
          
      - name: Autobuild
        uses: github/codeql-action/autobuild@v3
        
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
```

## 2. Advanced Matrix Strategies and Dynamic Configuration

### 2.1 Dynamic Matrix Generation

```yaml
name: Dynamic Multi-Dimensional Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  generate-matrix:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.matrix.outputs.result }}
      total_jobs: ${{ steps.matrix.outputs.total_jobs }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate Dynamic Matrix
        id: matrix
        uses: actions/github-script@v7
        with:
          script: |
            // Analyze repository to determine optimal test matrix
            const fs = require('fs');
            const path = require('path');
            
            // Get changed files
            const { execSync } = require('child_process');
            let changedFiles = [];
            
            try {
              if (context.eventName === 'pull_request') {
                const output = execSync(`git diff --name-only origin/${context.payload.pull_request.base.ref}...HEAD`);
                changedFiles = output.toString().split('\n').filter(f => f.length > 0);
              } else {
                const output = execSync('git diff --name-only HEAD~1');
                changedFiles = output.toString().split('\n').filter(f => f.length > 0);
              }
            } catch (error) {
              core.warning(`Could not get changed files: ${error.message}`);
            }
            
            // Determine test requirements based on changes
            const testMatrix = [];
            const baseConfig = {
              node_version: ['16', '18', '20'],
              os: ['ubuntu-latest'],
              test_type: ['unit', 'integration']
            };
            
            // Analyze package.json for runtime requirements
            let packageConfig = {};
            try {
              const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
              packageConfig = {
                hasE2E: packageJson.scripts?.e2e || packageJson.devDependencies?.playwright,
                hasDocker: fs.existsSync('Dockerfile') || fs.existsSync('docker-compose.yml'),
                hasKubernetes: fs.existsSync('k8s') || changedFiles.some(f => f.includes('k8s'))
              };
              
              if (packageConfig.hasE2E) baseConfig.test_type.push('e2e');
              if (packageConfig.hasDocker) baseConfig.test_type.push('docker');
              
            } catch (error) {
              core.info('No package.json found or parsing failed');
            }
            
            // Check for infrastructure changes
            const infraChanges = changedFiles.some(f => 
              f.includes('terraform') || 
              f.includes('k8s') || 
              f.includes('docker') ||
              f.includes('.github/workflows')
            );
            
            if (infraChanges) {
              baseConfig.test_type.push('infrastructure');
              baseConfig.os.push('windows-latest', 'macos-latest');
            }
            
            // Generate matrix combinations with intelligent filtering
            for (const nodeVersion of baseConfig.node_version) {
              for (const os of baseConfig.os) {
                for (const testType of baseConfig.test_type) {
                  
                  // Skip expensive combinations for non-critical changes
                  if (!infraChanges && (os !== 'ubuntu-latest' || nodeVersion !== '18')) {
                    continue;
                  }
                  
                  // Skip E2E tests on older Node versions unless specifically needed
                  if (testType === 'e2e' && nodeVersion === '16' && !infraChanges) {
                    continue;
                  }
                  
                  const matrixItem = {
                    node_version: nodeVersion,
                    os: os,
                    test_type: testType,
                    cache_key: `${testType}-${os}-${nodeVersion}`,
                    timeout_minutes: testType === 'e2e' ? 30 : 15
                  };
                  
                  testMatrix.push(matrixItem);
                }
              }
            }
            
            // Optimize matrix for PR vs main branch
            if (context.eventName === 'pull_request' && testMatrix.length > 8) {
              // Limit matrix size for PRs to essential combinations
              const essentialMatrix = testMatrix.filter(item => 
                item.node_version === '18' && 
                item.os === 'ubuntu-latest'
              );
              
              core.info(`Reduced matrix from ${testMatrix.length} to ${essentialMatrix.length} jobs for PR`);
              core.setOutput('total_jobs', essentialMatrix.length);
              return essentialMatrix;
            }
            
            core.setOutput('total_jobs', testMatrix.length);
            core.info(`Generated matrix with ${testMatrix.length} jobs`);
            
            return testMatrix;

  execute-matrix:
    runs-on: ${{ matrix.os }}
    needs: generate-matrix
    timeout-minutes: ${{ matrix.timeout_minutes }}
    strategy:
      fail-fast: false
      matrix:
        include: ${{ fromJson(needs.generate-matrix.outputs.matrix) }}
    
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node_version }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Execute Tests
        run: |
          case "${{ matrix.test_type }}" in
            "unit")
              npm run test:unit -- --coverage
              ;;
            "integration")
              npm run test:integration
              ;;
            "e2e")
              npm run test:e2e
              ;;
            "docker")
              docker build -t test-image .
              docker run --rm test-image npm test
              ;;
            "infrastructure")
              npm run test:infrastructure
              ;;
          esac

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.test_type }}-${{ matrix.os }}-${{ matrix.node_version }}
          path: |
            test-results/
            coverage/
```

## 3. External Tool Integration Patterns

### 3.1 Jira Integration for Issue Tracking

```yaml
name: Jira Integration Workflow

on:
  pull_request:
    types: [opened, synchronize, closed]
  issues:
    types: [opened, closed]

env:
  JIRA_BASE_URL: ${{ vars.JIRA_BASE_URL }}
  JIRA_PROJECT_KEY: ${{ vars.JIRA_PROJECT_KEY }}

jobs:
  jira-integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Extract Jira Issue Key
        id: jira-key
        uses: actions/github-script@v7
        with:
          script: |
            // Extract Jira issue key from branch name, PR title, or commit message
            const branchName = context.payload.pull_request?.head?.ref || context.ref;
            const prTitle = context.payload.pull_request?.title || '';
            const commitMessage = context.payload.head_commit?.message || '';
            
            // Regex patterns for different Jira key formats
            const jiraKeyRegex = /([A-Z]+-\d+)/g;
            
            let jiraKey = null;
            
            // Try to find Jira key in different places
            const searchTexts = [branchName, prTitle, commitMessage];
            
            for (const text of searchTexts) {
              const matches = text.match(jiraKeyRegex);
              if (matches && matches.length > 0) {
                jiraKey = matches[0];
                break;
              }
            }
            
            if (jiraKey) {
              core.setOutput('jira_key', jiraKey);
              core.setOutput('has_jira_key', 'true');
              core.info(`Found Jira key: ${jiraKey}`);
            } else {
              core.setOutput('has_jira_key', 'false');
              core.warning('No Jira key found in branch name, PR title, or commit message');
            }
            
            return jiraKey;

      - name: Update Jira Issue
        if: steps.jira-key.outputs.has_jira_key == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            const jiraKey = '${{ steps.jira-key.outputs.jira_key }}';
            const jiraBaseUrl = process.env.JIRA_BASE_URL;
            
            // Prepare Jira API request
            const auth = Buffer.from(`${{ secrets.JIRA_USERNAME }}:${{ secrets.JIRA_API_TOKEN }}`).toString('base64');
            
            const headers = {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            };
            
            // Update based on event type
            let updateData = {};
            let comment = '';
            
            if (context.eventName === 'pull_request') {
              const action = context.payload.action;
              const prUrl = context.payload.pull_request.html_url;
              const prNumber = context.payload.pull_request.number;
              
              switch (action) {
                case 'opened':
                  comment = `Pull Request #${prNumber} created: ${prUrl}`;
                  updateData = {
                    update: {
                      comment: [{
                        add: {
                          body: comment
                        }
                      }]
                    },
                    transition: {
                      id: '21'  // Move to "In Review" status
                    }
                  };
                  break;
                  
                case 'closed':
                  if (context.payload.pull_request.merged) {
                    comment = `Pull Request #${prNumber} merged: ${prUrl}`;
                    updateData = {
                      transition: {
                        id: '31'  // Move to "Done" status
                      }
                    };
                  }
                  break;
              }
            }
            
            // Make API request to Jira
            try {
              const response = await fetch(`${jiraBaseUrl}/rest/api/3/issue/${jiraKey}/transitions`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(updateData)
              });
              
              if (response.ok) {
                core.info(`✅ Successfully updated Jira issue ${jiraKey}`);
              } else {
                const errorText = await response.text();
                core.warning(`⚠️ Failed to update Jira issue ${jiraKey}: ${response.status}`);
              }
            } catch (error) {
              core.warning(`⚠️ Error updating Jira issue ${jiraKey}: ${error.message}`);
            }
```

### 3.2 Slack Integration for Team Notifications

```yaml
name: Advanced Slack Notifications

on:
  workflow_run:
    workflows: ["CI", "Deploy"]
    types: [completed]
  deployment_status:
  pull_request:
    types: [opened, ready_for_review]

jobs:
  slack-notification:
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Determine Notification Context
        id: context
        uses: actions/github-script@v7
        with:
          script: |
            let context_info = {
              event_type: context.eventName,
              notification_type: 'info',
              channel: '#general',
              urgency: 'normal'
            };
            
            // Determine notification context based on event
            if (context.eventName === 'workflow_run') {
              const conclusion = context.payload.workflow_run.conclusion;
              const workflow_name = context.payload.workflow_run.name;
              
              context_info.workflow_name = workflow_name;
              context_info.conclusion = conclusion;
              
              if (conclusion === 'failure') {
                context_info.notification_type = 'error';
                context_info.channel = '#alerts';
                context_info.urgency = 'high';
              } else if (conclusion === 'success' && workflow_name === 'Deploy') {
                context_info.notification_type = 'success';
                context_info.channel = '#deployments';
              }
            }
            
            core.setOutput('context', JSON.stringify(context_info));
            return context_info;

      - name: Send Slack Notification
        uses: actions/github-script@v7
        with:
          script: |
            const context_info = JSON.parse('${{ steps.context.outputs.context }}');
            
            // Build notification payload based on context
            let payload = {
              channel: context_info.channel,
              username: 'GitHub Actions',
              icon_emoji: ':github:',
              attachments: []
            };
            
            // Create rich attachment based on event type
            let attachment = {
              fallback: '',
              fields: [],
              footer: 'GitHub Actions',
              footer_icon: 'https://github.com/favicon.ico',
              ts: Math.floor(Date.now() / 1000)
            };
            
            // Color coding based on notification type
            switch (context_info.notification_type) {
              case 'error':
                attachment.color = 'danger';
                attachment.pretext = '🚨 *Alert*';
                break;
              case 'success':
                attachment.color = 'good';
                attachment.pretext = '✅ *Success*';
                break;
              default:
                attachment.color = '#36a64f';
                attachment.pretext = 'ℹ️ *Information*';
            }
            
            // Build content based on event type
            if (context_info.event_type === 'workflow_run') {
              const run_url = context.payload.workflow_run.html_url;
              const repository = context.payload.repository.full_name;
              const branch = context.payload.workflow_run.head_branch;
              
              attachment.title = `${context_info.workflow_name} ${context_info.conclusion}`;
              attachment.title_link = run_url;
              attachment.fallback = `${context_info.workflow_name} ${context_info.conclusion} in ${repository}`;
              
              attachment.fields = [
                {
                  title: 'Repository',
                  value: `<https://github.com/${repository}|${repository}>`,
                  short: true
                },
                {
                  title: 'Branch',
                  value: branch,
                  short: true
                }
              ];
            }
            
            payload.attachments = [attachment];
            
            // Send to Slack
            try {
              const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
              });
              
              if (response.ok) {
                core.info('✅ Slack notification sent successfully');
              } else {
                core.warning(`⚠️ Failed to send Slack notification: ${response.status}`);
              }
            } catch (error) {
              core.warning(`⚠️ Error sending Slack notification: ${error.message}`);
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 4. Performance Optimization and Monitoring

### 4.1 Advanced Caching Strategies

```yaml
name: Performance Optimization

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  optimize-performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Multi-Layer Cache Strategy
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            ~/.cache/yarn
            node_modules
            .next/cache
            dist/
            build/
          key: ${{ runner.os }}-build-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.ts', '**/*.js') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ hashFiles('**/package-lock.json') }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-

      - name: Smart Dependency Installation
        run: |
          # Check if node_modules cache was hit
          if [ -d "node_modules" ] && [ -f "node_modules/.cache-hit" ]; then
            echo "Cache hit - skipping full npm install"
            npm prune
            npm install --prefer-offline --no-audit
          else
            echo "Cache miss - performing full install"
            npm ci --prefer-offline --no-audit
            touch node_modules/.cache-hit
          fi

      - name: Performance Monitoring
        uses: actions/github-script@v7
        with:
          script: |
            // Monitor workflow performance and provide optimization recommendations
            const workflowRun = await github.rest.actions.getWorkflowRun({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: context.runId
            });
            
            const jobs = await github.rest.actions.listJobsForWorkflowRun({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: context.runId
            });
            
            const performanceMetrics = {
              total_duration: 0,
              job_metrics: [],
              recommendations: []
            };
            
            // Calculate metrics for each job
            for (const job of jobs.data.jobs) {
              if (job.started_at && job.completed_at) {
                const duration = new Date(job.completed_at) - new Date(job.started_at);
                const durationMinutes = Math.round(duration / 1000 / 60);
                
                performanceMetrics.job_metrics.push({
                  name: job.name,
                  duration_minutes: durationMinutes,
                  status: job.conclusion
                });
                
                // Generate recommendations based on job performance
                if (durationMinutes > 15) {
                  performanceMetrics.recommendations.push(
                    `Consider optimizing ${job.name} - took ${durationMinutes} minutes`
                  );
                }
              }
            }
            
            // Generate performance summary
            core.summary.addHeading('⚡ Workflow Performance Analysis');
            core.summary.addTable([
              [{data: 'Metric', header: true}, {data: 'Value', header: true}],
              ['Total Duration', `${performanceMetrics.total_duration} minutes`],
              ['Parallel Jobs', jobs.data.jobs.length.toString()],
              ['Runner Efficiency', 'Good']
            ]);
            
            if (performanceMetrics.recommendations.length > 0) {
              core.summary.addHeading('🔧 Optimization Recommendations');
              for (const rec of performanceMetrics.recommendations) {
                core.summary.addRaw(`- ${rec}\n`);
              }
            }
            
            await core.summary.write();
```

## 5. Practical Exercise: Multi-Repository Integration

### Exercise Overview

Design and implement a complete multi-repository workflow system that coordinates testing and deployment across three repositories:
1. A backend API service
2. A frontend application
3. An integration test suite

### Requirements

1. **Cross-Repository Triggering**: When the backend API changes, automatically trigger integration tests
2. **Dynamic Matrix Testing**: Generate test matrices based on changed files and repository dependencies
3. **External Tool Integration**: Connect with Slack for notifications and Jira for issue tracking
4. **Performance Optimization**: Implement advanced caching and parallel execution strategies
5. **Governance Compliance**: Include security scanning and approval workflows

### Implementation Steps

1. Create workflow templates for each repository type
2. Implement cross-repository communication using GitHub API
3. Set up dynamic matrix generation based on repository analysis
4. Configure external tool integrations (Slack, Jira)
5. Add performance monitoring and optimization
6. Test the complete workflow end-to-end

### Success Criteria

- All three repositories can trigger workflows in dependent repositories
- Dynamic matrices optimize test execution time by at least 30%
- External integrations provide meaningful notifications and issue tracking
- Workflow performance is monitored and optimized automatically
- Security and governance requirements are met

## Assessment

### Knowledge Check

1. **Multi-Repository Coordination**: Explain how you would design a workflow system that coordinates deployment across 5 microservices with complex dependencies.

2. **Dynamic Matrix Optimization**: Design a matrix generation strategy that balances test coverage with execution time for a repository with multiple programming languages and deployment targets.

3. **External Integration Architecture**: Describe how you would integrate GitHub Actions with enterprise tools like ServiceNow, Splunk, and HashiCorp Vault.

4. **Performance Analysis**: Given a workflow that takes 45 minutes to complete, identify potential optimization strategies and estimate the performance improvements.

### Practical Assessment

Design a complete enterprise workflow system that includes:
- Multi-repository coordination
- Dynamic test matrices
- External tool integrations
- Performance optimization
- Security and compliance automation

The system should demonstrate understanding of advanced GitHub Actions patterns and enterprise DevOps practices.

## Summary

This lesson covered advanced GitHub Actions workflow patterns essential for enterprise-level CI/CD operations:

1. **Multi-Repository Orchestration**: Learned to design workflows that coordinate across multiple repositories, implement cross-repository triggering, and manage complex dependency chains.

2. **Organization-Level Governance**: Implemented centralized workflow templates, organization-wide compliance scanning, and automated governance reporting.

3. **Dynamic Matrix Optimization**: Created intelligent matrix generation based on code changes, conditional execution strategies, and resource optimization patterns.

4. **External Tool Integration**: Integrated with enterprise tools like Jira for issue tracking and Slack for advanced team notifications with rich context and automation.

5. **Performance Optimization**: Implemented advanced caching strategies, parallel job distribution, and workflow performance monitoring with actionable recommendations.

These patterns prepare you for senior DevOps engineering roles where you'll be responsible for designing and maintaining sophisticated CI/CD systems that serve hundreds of developers and coordinate complex deployment scenarios across multiple services and environments.

## Next Steps

In the next lesson, we'll explore Docker fundamentals for testing environments, focusing on containerization strategies that complement these advanced workflow patterns and enable consistent, scalable testing infrastructure.

## Further Reading

- [GitHub Actions Advanced Patterns Documentation](https://docs.github.com/en/actions/using-workflows/advanced-workflow-features)
- [Enterprise CI/CD Best Practices](https://github.blog/2021-04-28-deploying-to-production-with-github-actions/)
- [Workflow Security and Governance](https://docs.github.com/en/actions/security-guides)
- [Performance Optimization Guide](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)