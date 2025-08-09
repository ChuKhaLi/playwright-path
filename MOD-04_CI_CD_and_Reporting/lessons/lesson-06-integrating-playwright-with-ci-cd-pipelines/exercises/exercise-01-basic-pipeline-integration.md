# Exercise 01: Basic Pipeline Integration

## Objective
Create a basic CI/CD pipeline that integrates Playwright tests with automated deployment processes, implementing fundamental quality gates and monitoring.

## Prerequisites
- Understanding of [basic CI/CD concepts](../content.md#understanding-cicd-fundamentals)
- Knowledge of [Playwright configuration](../../lesson-03-configuring-playwright-for-headless-execution/content.md)
- Familiarity with [YAML syntax](../content.md#pipeline-configuration-basics)

## Exercise Overview
You will build a complete CI/CD pipeline that:
- Runs Playwright tests automatically on code changes
- Implements quality gates based on test results
- Deploys to a staging environment on successful tests
- Includes basic monitoring and notification systems

**Estimated Time:** 45-60 minutes  
**Difficulty Level:** Intermediate  
**Skills Focus:** Pipeline configuration, quality gates, basic deployment automation

---

## Part 1: Pipeline Foundation (15 minutes)

### Step 1: Create Basic Pipeline Structure

Create a new file `.github/workflows/playwright-integration.yml`:

```yaml
name: Playwright Integration Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
    
env:
  NODE_VERSION: '18.x'
  PLAYWRIGHT_VERSION: '1.40.0'

jobs:
  # Your pipeline jobs will go here
```

### Step 2: Setup Test Environment Job

Add the first job to install dependencies and prepare the test environment:

```yaml
  setup:
    runs-on: ubuntu-latest
    name: 'Setup Test Environment'
    outputs:
      cache-key: ${{ steps.cache-key.outputs.key }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Generate cache key
        id: cache-key
        run: echo "key=node-modules-${{ hashFiles('package-lock.json') }}" >> $GITHUB_OUTPUT
        
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
```

### Step 3: Create Test Configuration

Create `playwright-ci.config.ts` for CI-specific settings:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: process.env.CI ? 4 : 2,
  timeout: 30000,
  retries: 2,
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  reporter: [
    ['junit', { outputFile: 'test-results.xml' }],
    ['json', { outputFile: 'test-results.json' }],
    ['html', { open: 'never' }],
  ],
});
```

**📝 Task 1.1:** Set up your pipeline foundation by creating the workflow file and test configuration. Ensure the pipeline triggers on pushes to main/develop branches and pull requests to main.

---

## Part 2: Test Execution Job (15 minutes)

### Step 4: Add Test Execution Job

Add the test execution job with quality gate validation:

```yaml
  test:
    needs: setup
    runs-on: ubuntu-latest
    name: 'Run Playwright Tests'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
        
      - name: Run Playwright tests
        run: npx playwright test --config=playwright-ci.config.ts
        env:
          BASE_URL: ${{ vars.STAGING_URL || 'https://staging.example.com' }}
          
      - name: Validate test results
        if: always()
        run: |
          if [ -f "test-results.json" ]; then
            TOTAL_TESTS=$(jq '.stats.total' test-results.json)
            PASSED_TESTS=$(jq '.stats.passed' test-results.json)
            
            if [ "$TOTAL_TESTS" -gt 0 ]; then
              PASS_RATE=$(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc)
            else
              PASS_RATE=0
            fi
            
            echo "Test Results: $PASSED_TESTS/$TOTAL_TESTS passed ($PASS_RATE%)"
            
            if (( $(echo "$PASS_RATE >= 95" | bc -l) )); then
              echo "✅ Quality gate passed: $PASS_RATE% >= 95%"
              echo "QUALITY_GATE_PASSED=true" >> $GITHUB_ENV
            else
              echo "❌ Quality gate failed: $PASS_RATE% < 95%"
              echo "QUALITY_GATE_PASSED=false" >> $GITHUB_ENV
              exit 1
            fi
          else
            echo "❌ Test results file not found"
            exit 1
          fi
          
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-results
          path: |
            test-results.json
            test-results.xml
            playwright-report/
          retention-days: 7
```

### Step 5: Create Sample Tests

Create test files to validate your pipeline:

**tests/basic-functionality.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Basic Application Functionality', () => {
  test('homepage loads successfully @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Example/);
    await expect(page.locator('h1')).toBeVisible();
  });
  
  test('navigation works correctly @integration', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation
    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL(/about/);
    await expect(page.locator('h1')).toContainText('About');
  });
  
  test('search functionality @critical', async ({ page }) => {
    await page.goto('/');
    
    // Test search
    await page.fill('[data-testid="search-input"]', 'playwright');
    await page.click('[data-testid="search-button"]');
    
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-results"] li')).toHaveCountGreaterThan(0);
  });
});
```

**📝 Task 2.1:** Implement the test execution job with quality gate validation. Create sample tests that will run in your pipeline and validate that the pass rate calculation works correctly.

---

## Part 3: Deployment Integration (15 minutes)

### Step 6: Add Staging Deployment

Add a deployment job that runs only when quality gates pass:

```yaml
  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    name: 'Deploy to Staging'
    if: success() && github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup deployment environment
        run: |
          echo "🚀 Preparing staging deployment..."
          echo "Branch: ${{ github.ref }}"
          echo "Commit: ${{ github.sha }}"
          echo "Environment: staging"
          
      - name: Deploy to staging
        run: |
          echo "📦 Building application..."
          # npm run build
          
          echo "🌐 Deploying to staging environment..."
          # Deployment commands would go here
          # Example: kubectl apply -f k8s/staging/
          # Example: helm upgrade staging-app ./charts/app
          
          echo "✅ Staging deployment completed"
          
      - name: Run post-deployment health check
        run: |
          echo "🔍 Running post-deployment health checks..."
          
          HEALTH_URL="${{ vars.STAGING_URL }}/health"
          MAX_ATTEMPTS=30
          ATTEMPT=1
          
          while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
            echo "Health check attempt $ATTEMPT/$MAX_ATTEMPTS..."
            
            if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
              echo "✅ Staging environment is healthy"
              break
            fi
            
            if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
              echo "❌ Staging environment failed health check"
              exit 1
            fi
            
            sleep 10
            ATTEMPT=$((ATTEMPT + 1))
          done
          
      - name: Run smoke tests on staging
        run: |
          echo "💨 Running smoke tests on staging..."
          
          # Run critical tests against staging
          npx playwright test --config=playwright-ci.config.ts \
            --grep="@smoke|@critical" \
            --workers=2
        env:
          BASE_URL: ${{ vars.STAGING_URL }}
```

### Step 7: Add Production Deployment (Manual Approval)

Add a production deployment job with manual approval:

```yaml
  deploy-production:
    needs: [test, deploy-staging]
    runs-on: ubuntu-latest
    name: 'Deploy to Production'
    if: success() && github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Pre-deployment validation
        run: |
          echo "🔍 Running pre-deployment validation..."
          echo "All quality gates must pass for production deployment"
          echo "Manual approval required for production environment"
          
      - name: Deploy to production
        run: |
          echo "🚀 Deploying to production environment..."
          
          # Production deployment commands
          echo "📦 Building production application..."
          # npm run build:production
          
          echo "🌐 Deploying to production..."
          # Production deployment logic here
          
          echo "✅ Production deployment completed"
          
      - name: Post-deployment monitoring
        run: |
          echo "📊 Starting post-deployment monitoring..."
          
          # Monitor production for 5 minutes
          MONITORING_DURATION=300
          CHECK_INTERVAL=30
          START_TIME=$(date +%s)
          END_TIME=$((START_TIME + MONITORING_DURATION))
          
          while [ $(date +%s) -lt $END_TIME ]; do
            if curl -f "${{ vars.PRODUCTION_URL }}/health" > /dev/null 2>&1; then
              echo "✅ Production health check passed ($(date))"
            else
              echo "❌ Production health check failed ($(date))"
              exit 1
            fi
            
            sleep $CHECK_INTERVAL
          done
          
          echo "✅ Post-deployment monitoring completed successfully"
```

**📝 Task 3.1:** Implement the deployment jobs with proper environment gating. Test the staging deployment trigger and ensure production deployment requires manual approval.

---

## Part 4: Monitoring and Notifications (10 minutes)

### Step 8: Add Notification Job

Add a notification job that runs regardless of pipeline outcome:

```yaml
  notify:
    needs: [test, deploy-staging, deploy-production]
    runs-on: ubuntu-latest
    name: 'Send Notifications'
    if: always()
    
    steps:
      - name: Determine pipeline status
        id: status
        run: |
          if [[ "${{ needs.test.result }}" == "success" && 
                "${{ needs.deploy-staging.result }}" != "failure" && 
                "${{ needs.deploy-production.result }}" != "failure" ]]; then
            echo "status=success" >> $GITHUB_OUTPUT
            echo "message=Pipeline completed successfully" >> $GITHUB_OUTPUT
            echo "color=good" >> $GITHUB_OUTPUT
          else
            echo "status=failure" >> $GITHUB_OUTPUT
            echo "message=Pipeline failed - requires attention" >> $GITHUB_OUTPUT
            echo "color=danger" >> $GITHUB_OUTPUT
          fi
          
      - name: Send Slack notification
        if: vars.SLACK_WEBHOOK_URL
        run: |
          curl -X POST -H 'Content-type: application/json' \
            --data '{
              "text": "🤖 GitHub Actions Pipeline Completed",
              "attachments": [{
                "color": "${{ steps.status.outputs.color }}",
                "fields": [
                  {"title": "Repository", "value": "${{ github.repository }}", "short": true},
                  {"title": "Branch", "value": "${{ github.ref_name }}", "short": true},
                  {"title": "Status", "value": "${{ steps.status.outputs.status }}", "short": true},
                  {"title": "Commit", "value": "${{ github.sha }}", "short": true},
                  {"title": "Message", "value": "${{ steps.status.outputs.message }}", "short": false}
                ],
                "actions": [{
                  "type": "button",
                  "text": "View Pipeline",
                  "url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
                }]
              }]
            }' ${{ vars.SLACK_WEBHOOK_URL }}
            
      - name: Create pipeline summary
        run: |
          echo "# 🚀 Pipeline Execution Summary" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "## Status: ${{ steps.status.outputs.status }}" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Pipeline Details" >> $GITHUB_STEP_SUMMARY
          echo "- **Repository**: ${{ github.repository }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Branch**: ${{ github.ref_name }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Commit**: ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Workflow**: ${{ github.workflow }}" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Job Results" >> $GITHUB_STEP_SUMMARY
          echo "- **Tests**: ${{ needs.test.result }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Staging Deployment**: ${{ needs.deploy-staging.result }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Production Deployment**: ${{ needs.deploy-production.result }}" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "${{ steps.status.outputs.message }}" >> $GITHUB_STEP_SUMMARY
```

**📝 Task 4.1:** Implement the notification system and test it with your pipeline. Verify that the pipeline summary is generated correctly.

---

## Part 5: Testing and Validation (5 minutes)

### Step 9: Test Your Pipeline

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "feat: add basic CI/CD pipeline with Playwright integration"
   git push origin develop
   ```

2. **Monitor the pipeline execution:**
   - Go to GitHub Actions tab in your repository
   - Watch the pipeline execute each job
   - Verify quality gates are working correctly
   - Check that artifacts are uploaded

3. **Test different scenarios:**
   - **Passing tests**: Ensure deployment to staging occurs
   - **Failing tests**: Verify pipeline stops and doesn't deploy
   - **Main branch**: Test production deployment approval

4. **Validate outputs:**
   - Check test results in artifacts
   - Verify deployment logs
   - Review pipeline summary

**📝 Task 5.1:** Execute your pipeline and validate all components work correctly. Document any issues you encounter and their solutions.

---

## Deliverables

Submit the following files:

1. **`.github/workflows/playwright-integration.yml`** - Complete pipeline configuration
2. **`playwright-ci.config.ts`** - CI-specific Playwright configuration  
3. **`tests/basic-functionality.spec.ts`** - Sample test suite
4. **Pipeline execution screenshots** - Evidence of successful pipeline runs
5. **`PIPELINE_NOTES.md`** - Documentation of your implementation choices and any issues encountered

## Validation Criteria

Your exercise will be evaluated on:

- ✅ **Pipeline Structure** (25%): Proper job definition, dependencies, and conditional execution
- ✅ **Quality Gates** (25%): Correct implementation of test result validation and pass/fail logic
- ✅ **Deployment Logic** (25%): Proper environment gating and approval workflows
- ✅ **Error Handling** (15%): Appropriate failure scenarios and rollback considerations
- ✅ **Documentation** (10%): Clear documentation of implementation decisions

## Common Issues and Solutions

### Issue: Pipeline doesn't trigger
**Solution**: Check branch protection rules and webhook configuration

### Issue: Quality gate calculation errors
**Solution**: Ensure `bc` calculator is available and JSON parsing is correct

### Issue: Deployment fails silently
**Solution**: Add proper error handling and exit codes to deployment scripts

### Issue: Artifacts not uploading
**Solution**: Verify file paths exist and action permissions are correct

## Next Steps

After completing this exercise:
1. Review the [advanced pipeline patterns](exercise-02-advanced-deployment-strategies.md)
2. Explore [cross-platform testing integration](../../lesson-04-running-tests-on-different-browsers-and-oss/content.md)
3. Learn about [reporting and monitoring](../../lesson-08-generating-and-analyzing-html-reports/content.md)

---

**📚 Additional Resources:**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI/CD Guide](https://playwright.dev/docs/ci)
- [Quality Gate Best Practices](../content.md#quality-gate-implementation)