# Exercise 02: Advanced Deployment Strategies

## Objective
Implement advanced deployment patterns using blue-green and canary strategies with Playwright test integration, automated rollback capabilities, and comprehensive monitoring.

## Prerequisites
- Completion of [Exercise 01: Basic Pipeline Integration](exercise-01-basic-pipeline-integration.md)
- Understanding of [deployment strategies](../content.md#advanced-deployment-strategies)
- Knowledge of [quality gate implementation](../content.md#quality-gate-implementation)
- Familiarity with [monitoring concepts](../content.md#monitoring-and-observability)

## Exercise Overview
You will implement sophisticated deployment strategies that:
- Deploy using blue-green and canary patterns
- Integrate automated health checks and monitoring
- Implement intelligent rollback mechanisms
- Use progressive traffic shifting with validation
- Create comprehensive deployment reports

**Estimated Time:** 90-120 minutes  
**Difficulty Level:** Advanced  
**Skills Focus:** Advanced deployment patterns, automated rollback, traffic management, comprehensive monitoring

---

## Part 1: Blue-Green Deployment Implementation (30 minutes)

### Step 1: Create Blue-Green Pipeline Configuration

Create `.github/workflows/blue-green-deployment.yml`:

```yaml
name: Blue-Green Deployment Pipeline

on:
  push:
    branches: [ main ]
  workflow_dispatch:
    inputs:
      deployment_strategy:
        description: 'Deployment strategy'
        required: true
        default: 'blue-green'
        type: choice
        options:
          - blue-green
          - canary
          - rolling
      traffic_percentage:
        description: 'Initial traffic percentage (canary only)'
        required: false
        default: '10'

env:
  NODE_VERSION: '18.x'
  DEPLOYMENT_TIMEOUT: '300'
  HEALTH_CHECK_RETRIES: '10'

jobs:
  prepare-deployment:
    runs-on: ubuntu-latest
    name: 'Prepare Advanced Deployment'
    outputs:
      deployment-id: ${{ steps.deployment-id.outputs.id }}
      current-environment: ${{ steps.environment-detection.outputs.current }}
      target-environment: ${{ steps.environment-detection.outputs.target }}
      strategy: ${{ steps.strategy.outputs.type }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate deployment ID
        id: deployment-id
        run: |
          DEPLOYMENT_ID="deploy-$(date +%Y%m%d-%H%M%S)-${{ github.run_number }}"
          echo "id=$DEPLOYMENT_ID" >> $GITHUB_OUTPUT
          echo "🔄 Generated deployment ID: $DEPLOYMENT_ID"
          
      - name: Detect current environment
        id: environment-detection
        run: |
          # Simulate environment detection
          CURRENT_ENV="blue"
          if [ -f ".deployment-state" ]; then
            CURRENT_ENV=$(cat .deployment-state || echo "blue")
          fi
          
          if [ "$CURRENT_ENV" = "blue" ]; then
            TARGET_ENV="green"
          else
            TARGET_ENV="blue"
          fi
          
          echo "current=$CURRENT_ENV" >> $GITHUB_OUTPUT
          echo "target=$TARGET_ENV" >> $GITHUB_OUTPUT
          
          echo "🔍 Current environment: $CURRENT_ENV"
          echo "🎯 Target environment: $TARGET_ENV"
          
      - name: Determine deployment strategy
        id: strategy
        run: |
          STRATEGY="${{ github.event.inputs.deployment_strategy || 'blue-green' }}"
          echo "type=$STRATEGY" >> $GITHUB_OUTPUT
          echo "📋 Deployment strategy: $STRATEGY"

  build-and-test:
    needs: prepare-deployment
    runs-on: ubuntu-latest
    name: 'Build and Test Application'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: |
          echo "🏗️ Building application for deployment..."
          # npm run build:production
          
          # Create build artifacts
          mkdir -p dist
          echo "Built application $(date)" > dist/build-info.txt
          echo "Deployment ID: ${{ needs.prepare-deployment.outputs.deployment-id }}" >> dist/build-info.txt
          echo "Target Environment: ${{ needs.prepare-deployment.outputs.target-environment }}" >> dist/build-info.txt
          
      - name: Run comprehensive test suite
        run: |
          echo "🧪 Running comprehensive test suite..."
          
          # Install Playwright
          npx playwright install --with-deps
          
          # Run all tests with detailed reporting
          npx playwright test \
            --config=playwright-ci.config.ts \
            --reporter=junit,json,html \
            --output-dir=test-results
            
      - name: Validate test results for deployment
        run: |
          if [ -f "test-results.json" ]; then
            TOTAL_TESTS=$(jq '.stats.total' test-results.json)
            PASSED_TESTS=$(jq '.stats.passed' test-results.json)
            SKIPPED_TESTS=$(jq '.stats.skipped' test-results.json)
            
            PASS_RATE=$(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc)
            
            echo "📊 Test Results Summary:"
            echo "   Total: $TOTAL_TESTS"
            echo "   Passed: $PASSED_TESTS"
            echo "   Skipped: $SKIPPED_TESTS"
            echo "   Pass Rate: $PASS_RATE%"
            
            # Strict quality gate for production deployment
            if (( $(echo "$PASS_RATE >= 98" | bc -l) )); then
              echo "✅ Quality gate passed for production deployment"
              echo "DEPLOYMENT_APPROVED=true" >> $GITHUB_ENV
            else
              echo "❌ Quality gate failed - pass rate below 98%"
              echo "DEPLOYMENT_APPROVED=false" >> $GITHUB_ENV
              exit 1
            fi
          else
            echo "❌ Test results not found"
            exit 1
          fi
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: deployment-package-${{ needs.prepare-deployment.outputs.deployment-id }}
          path: |
            dist/
            test-results/
          retention-days: 30

  deploy-blue-green:
    needs: [prepare-deployment, build-and-test]
    runs-on: ubuntu-latest
    name: 'Deploy Blue-Green'
    if: needs.prepare-deployment.outputs.strategy == 'blue-green'
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download deployment artifacts
        uses: actions/download-artifact@v4
        with:
          name: deployment-package-${{ needs.prepare-deployment.outputs.deployment-id }}
          
      - name: Deploy to target environment
        id: deploy
        run: |
          TARGET_ENV="${{ needs.prepare-deployment.outputs.target-environment }}"
          DEPLOYMENT_ID="${{ needs.prepare-deployment.outputs.deployment-id }}"
          
          echo "🚀 Starting blue-green deployment..."
          echo "   Target Environment: $TARGET_ENV"
          echo "   Deployment ID: $DEPLOYMENT_ID"
          
          # Simulate deployment to target environment
          echo "📦 Deploying application to $TARGET_ENV environment..."
          
          # Deploy application (replace with actual deployment commands)
          # kubectl apply -f k8s/$TARGET_ENV/
          # helm upgrade app-$TARGET_ENV ./charts/app --set image.tag=$DEPLOYMENT_ID
          
          # Simulate deployment completion
          sleep 30
          
          echo "✅ Application deployed to $TARGET_ENV environment"
          echo "deployed=true" >> $GITHUB_OUTPUT
          
      - name: Wait for application startup
        run: |
          TARGET_ENV="${{ needs.prepare-deployment.outputs.target-environment }}"
          TARGET_URL="https://$TARGET_ENV.example.com"
          
          echo "⏳ Waiting for application startup in $TARGET_ENV environment..."
          
          MAX_ATTEMPTS=30
          ATTEMPT=1
          
          while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
            echo "Startup check $ATTEMPT/$MAX_ATTEMPTS..."
            
            if curl -f "$TARGET_URL/health" > /dev/null 2>&1; then
              echo "✅ Application started successfully in $TARGET_ENV"
              break
            fi
            
            if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
              echo "❌ Application failed to start in $TARGET_ENV"
              exit 1
            fi
            
            sleep 10
            ATTEMPT=$((ATTEMPT + 1))
          done
          
      - name: Run smoke tests on target environment
        run: |
          TARGET_ENV="${{ needs.prepare-deployment.outputs.target-environment }}"
          TARGET_URL="https://$TARGET_ENV.example.com"
          
          echo "💨 Running smoke tests on $TARGET_ENV environment..."
          
          # Run critical smoke tests
          npx playwright test \
            --config=playwright-ci.config.ts \
            --grep="@smoke" \
            --base-url="$TARGET_URL" \
            --reporter=json \
            --output-dir=smoke-test-results
            
          # Validate smoke test results
          if [ -f "smoke-test-results.json" ]; then
            SMOKE_PASSED=$(jq '.stats.passed' smoke-test-results.json)
            SMOKE_TOTAL=$(jq '.stats.total' smoke-test-results.json)
            
            if [ "$SMOKE_PASSED" -eq "$SMOKE_TOTAL" ] && [ "$SMOKE_TOTAL" -gt 0 ]; then
              echo "✅ All smoke tests passed on $TARGET_ENV"
              echo "SMOKE_TESTS_PASSED=true" >> $GITHUB_ENV
            else
              echo "❌ Smoke tests failed on $TARGET_ENV"
              echo "SMOKE_TESTS_PASSED=false" >> $GITHUB_ENV
              exit 1
            fi
          fi

  traffic-switch:
    needs: [prepare-deployment, deploy-blue-green]
    runs-on: ubuntu-latest
    name: 'Switch Traffic'
    if: success()
    
    steps:
      - name: Switch traffic to new environment
        run: |
          TARGET_ENV="${{ needs.prepare-deployment.outputs.target-environment }}"
          CURRENT_ENV="${{ needs.prepare-deployment.outputs.current-environment }}"
          
          echo "🔄 Switching traffic from $CURRENT_ENV to $TARGET_ENV..."
          
          # Update load balancer configuration
          # aws elbv2 modify-target-group --target-group-arn $TARGET_GROUP_ARN
          # kubectl patch service production-service -p '{"spec":{"selector":{"version":"'$TARGET_ENV'"}}}'
          
          echo "✅ Traffic switched to $TARGET_ENV environment"
          
          # Update deployment state
          echo "$TARGET_ENV" > .deployment-state
          
      - name: Monitor production traffic
        run: |
          TARGET_ENV="${{ needs.prepare-deployment.outputs.target-environment }}"
          
          echo "📊 Monitoring production traffic on $TARGET_ENV..."
          
          # Monitor for 5 minutes
          MONITORING_DURATION=300
          CHECK_INTERVAL=30
          START_TIME=$(date +%s)
          END_TIME=$((START_TIME + MONITORING_DURATION))
          
          ERROR_THRESHOLD=5  # Maximum allowed error percentage
          
          while [ $(date +%s) -lt $END_TIME ]; do
            # Check application health
            if ! curl -f "https://production.example.com/health" > /dev/null 2>&1; then
              echo "❌ Health check failed - initiating rollback"
              echo "ROLLBACK_REQUIRED=true" >> $GITHUB_ENV
              exit 1
            fi
            
            # Simulate error rate check
            ERROR_RATE=$(( RANDOM % 10 ))
            echo "Current error rate: $ERROR_RATE%"
            
            if [ $ERROR_RATE -gt $ERROR_THRESHOLD ]; then
              echo "❌ Error rate too high ($ERROR_RATE% > $ERROR_THRESHOLD%) - initiating rollback"
              echo "ROLLBACK_REQUIRED=true" >> $GITHUB_ENV
              exit 1
            fi
            
            echo "✅ Traffic monitoring check passed ($(date))"
            sleep $CHECK_INTERVAL
          done
          
          echo "✅ Production monitoring completed successfully"
```

**📝 Task 1.1:** Implement the blue-green deployment pipeline with comprehensive health checking and traffic switching logic.

### Step 2: Create Rollback Automation

Add rollback capability to your pipeline:

```yaml
  rollback:
    needs: [prepare-deployment, traffic-switch]
    runs-on: ubuntu-latest
    name: 'Automatic Rollback'
    if: failure() || env.ROLLBACK_REQUIRED == 'true'
    
    steps:
      - name: Execute automatic rollback
        run: |
          CURRENT_ENV="${{ needs.prepare-deployment.outputs.current-environment }}"
          TARGET_ENV="${{ needs.prepare-deployment.outputs.target-environment }}"
          
          echo "🔄 Executing automatic rollback..."
          echo "   Rolling back from: $TARGET_ENV"
          echo "   Rolling back to: $CURRENT_ENV"
          
          # Switch traffic back to previous environment
          echo "🔄 Switching traffic back to $CURRENT_ENV..."
          
          # Rollback load balancer configuration
          # kubectl patch service production-service -p '{"spec":{"selector":{"version":"'$CURRENT_ENV'"}}}'
          
          echo "✅ Traffic rolled back to $CURRENT_ENV"
          
          # Keep current deployment state
          echo "$CURRENT_ENV" > .deployment-state
          
      - name: Validate rollback success
        run: |
          CURRENT_ENV="${{ needs.prepare-deployment.outputs.current-environment }}"
          
          echo "🔍 Validating rollback success..."
          
          # Wait for rollback to take effect
          sleep 60
          
          # Run health checks on rolled back environment
          MAX_ATTEMPTS=10
          ATTEMPT=1
          
          while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
            if curl -f "https://production.example.com/health" > /dev/null 2>&1; then
              echo "✅ Rollback successful - $CURRENT_ENV environment is healthy"
              break
            fi
            
            if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
              echo "❌ Rollback failed - manual intervention required"
              exit 1
            fi
            
            sleep 10
            ATTEMPT=$((ATTEMPT + 1))
          done
          
      - name: Send rollback notification
        run: |
          echo "📢 Sending rollback notification..."
          
          # Send notification to team
          curl -X POST -H 'Content-type: application/json' \
            --data '{
              "text": "🚨 Automatic Rollback Executed",
              "attachments": [{
                "color": "warning",
                "fields": [
                  {"title": "Repository", "value": "${{ github.repository }}", "short": true},
                  {"title": "Deployment ID", "value": "${{ needs.prepare-deployment.outputs.deployment-id }}", "short": true},
                  {"title": "Rolled Back To", "value": "${{ needs.prepare-deployment.outputs.current-environment }}", "short": true},
                  {"title": "Reason", "value": "Health check failure or error rate threshold exceeded", "short": false}
                ]
              }]
            }' ${{ vars.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/dummy' }}
```

**📝 Task 1.2:** Test the rollback mechanism by simulating deployment failures and validating automatic recovery.

---

## Part 2: Canary Deployment Implementation (30 minutes)

### Step 3: Create Canary Deployment Job

Add canary deployment capability:

```yaml
  deploy-canary:
    needs: [prepare-deployment, build-and-test]
    runs-on: ubuntu-latest
    name: 'Deploy Canary'
    if: needs.prepare-deployment.outputs.strategy == 'canary'
    environment: production
    
    strategy:
      matrix:
        traffic_percentage: [10, 25, 50, 100]
        
    steps:
      - uses: actions/checkout@v4
      
      - name: Download deployment artifacts
        uses: actions/download-artifact@v4
        with:
          name: deployment-package-${{ needs.prepare-deployment.outputs.deployment-id }}
          
      - name: Deploy canary version
        if: matrix.traffic_percentage == 10
        run: |
          DEPLOYMENT_ID="${{ needs.prepare-deployment.outputs.deployment-id }}"
          
          echo "🐦 Deploying canary version..."
          echo "   Deployment ID: $DEPLOYMENT_ID"
          echo "   Initial Traffic: ${{ matrix.traffic_percentage }}%"
          
          # Deploy canary version
          # kubectl apply -f k8s/canary/
          # helm upgrade app-canary ./charts/app --set image.tag=$DEPLOYMENT_ID
          
          echo "✅ Canary version deployed"
          
      - name: Configure traffic splitting
        run: |
          TRAFFIC_PERCENTAGE="${{ matrix.traffic_percentage }}"
          
          echo "🔀 Configuring traffic splitting: $TRAFFIC_PERCENTAGE% to canary"
          
          # Configure traffic splitting (Istio example)
          # kubectl apply -f - <<EOF
          # apiVersion: networking.istio.io/v1beta1
          # kind: VirtualService
          # metadata:
          #   name: production-traffic-split
          # spec:
          #   http:
          #   - match:
          #     - headers:
          #         canary:
          #           exact: "true"
          #     route:
          #     - destination:
          #         host: app-canary
          #       weight: 100
          #   - route:
          #     - destination:
          #         host: app-production
          #       weight: $((100 - TRAFFIC_PERCENTAGE))
          #     - destination:
          #         host: app-canary
          #       weight: $TRAFFIC_PERCENTAGE
          # EOF
          
          echo "✅ Traffic splitting configured"
          
      - name: Monitor canary deployment
        run: |
          TRAFFIC_PERCENTAGE="${{ matrix.traffic_percentage }}"
          MONITORING_DURATION=600  # 10 minutes
          
          echo "📊 Monitoring canary deployment ($TRAFFIC_PERCENTAGE% traffic)..."
          
          START_TIME=$(date +%s)
          END_TIME=$((START_TIME + MONITORING_DURATION))
          
          # Key metrics to monitor
          ERROR_THRESHOLD=2
          LATENCY_THRESHOLD_MS=500
          
          while [ $(date +%s) -lt $END_TIME ]; do
            # Check canary health
            if ! curl -f "https://canary.example.com/health" > /dev/null 2>&1; then
              echo "❌ Canary health check failed"
              echo "CANARY_FAILED=true" >> $GITHUB_ENV
              exit 1
            fi
            
            # Simulate metrics collection
            ERROR_RATE=$(( RANDOM % 5 ))
            AVG_LATENCY=$(( 200 + RANDOM % 400 ))
            
            echo "Canary metrics: Error Rate: $ERROR_RATE%, Avg Latency: ${AVG_LATENCY}ms"
            
            # Check thresholds
            if [ $ERROR_RATE -gt $ERROR_THRESHOLD ]; then
              echo "❌ Canary error rate too high: $ERROR_RATE% > $ERROR_THRESHOLD%"
              echo "CANARY_FAILED=true" >> $GITHUB_ENV
              exit 1
            fi
            
            if [ $AVG_LATENCY -gt $LATENCY_THRESHOLD_MS ]; then
              echo "❌ Canary latency too high: ${AVG_LATENCY}ms > ${LATENCY_THRESHOLD_MS}ms"
              echo "CANARY_FAILED=true" >> $GITHUB_ENV
              exit 1
            fi
            
            sleep 60
          done
          
          echo "✅ Canary monitoring passed for $TRAFFIC_PERCENTAGE% traffic"
          
      - name: Run targeted tests on canary
        run: |
          echo "🧪 Running targeted tests on canary deployment..."
          
          # Run tests specifically against canary version
          npx playwright test \
            --config=playwright-ci.config.ts \
            --grep="@canary|@critical" \
            --base-url="https://canary.example.com" \
            --reporter=json \
            --output-dir=canary-test-results
            
          # Validate canary test results
          if [ -f "canary-test-results.json" ]; then
            CANARY_PASSED=$(jq '.stats.passed' canary-test-results.json)
            CANARY_TOTAL=$(jq '.stats.total' canary-test-results.json)
            
            if [ "$CANARY_PASSED" -eq "$CANARY_TOTAL" ] && [ "$CANARY_TOTAL" -gt 0 ]; then
              echo "✅ All canary tests passed"
            else
              echo "❌ Canary tests failed"
              echo "CANARY_FAILED=true" >> $GITHUB_ENV
              exit 1
            fi
          fi
```

**📝 Task 2.1:** Implement the canary deployment with progressive traffic shifting and comprehensive monitoring.

### Step 4: Create Advanced Monitoring Script

Create `scripts/deployment-monitor.ts`:

```typescript
#!/usr/bin/env npx tsx

/**
 * Advanced Deployment Monitoring Script
 * Monitors deployment health, performance metrics, and user experience
 */

interface MetricThresholds {
  errorRate: number;
  responseTime: number;
  throughput: number;
  cpuUsage: number;
  memoryUsage: number;
}

interface DeploymentMetrics {
  timestamp: string;
  errorRate: number;
  averageResponseTime: number;
  requestsPerSecond: number;
  cpuUsage: number;
  memoryUsage: number;
  activeUsers: number;
}

interface MonitoringConfig {
  environment: string;
  duration: number;
  interval: number;
  thresholds: MetricThresholds;
  endpoints: string[];
}

class DeploymentMonitor {
  private config: MonitoringConfig;
  private metrics: DeploymentMetrics[] = [];
  private alertCount = 0;
  
  constructor(config: MonitoringConfig) {
    this.config = config;
  }
  
  async startMonitoring(): Promise<boolean> {
    console.log(`🔍 Starting deployment monitoring for ${this.config.environment}`);
    console.log(`   Duration: ${this.config.duration}s`);
    console.log(`   Interval: ${this.config.interval}s`);
    console.log(`   Endpoints: ${this.config.endpoints.length}`);
    
    const startTime = Date.now();
    const endTime = startTime + (this.config.duration * 1000);
    
    while (Date.now() < endTime) {
      try {
        const metrics = await this.collectMetrics();
        this.metrics.push(metrics);
        
        const isHealthy = this.evaluateHealth(metrics);
        if (!isHealthy) {
          console.error('❌ Health check failed - deployment monitoring stopped');
          return false;
        }
        
        this.logMetrics(metrics);
        await this.sleep(this.config.interval * 1000);
        
      } catch (error) {
        console.error('❌ Error during monitoring:', error);
        this.alertCount++;
        
        if (this.alertCount >= 3) {
          console.error('❌ Too many monitoring errors - stopping');
          return false;
        }
      }
    }
    
    console.log('✅ Deployment monitoring completed successfully');
    await this.generateReport();
    return true;
  }
  
  private async collectMetrics(): Promise<DeploymentMetrics> {
    // Simulate metric collection
    const baseErrorRate = 0.5;
    const baseResponseTime = 150;
    
    // Add some variability
    const errorRate = baseErrorRate + (Math.random() - 0.5) * 2;
    const responseTime = baseResponseTime + (Math.random() - 0.5) * 100;
    
    return {
      timestamp: new Date().toISOString(),
      errorRate: Math.max(0, errorRate),
      averageResponseTime: Math.max(50, responseTime),
      requestsPerSecond: 100 + Math.random() * 50,
      cpuUsage: 30 + Math.random() * 40,
      memoryUsage: 50 + Math.random() * 30,
      activeUsers: 1000 + Math.random() * 500
    };
  }
  
  private evaluateHealth(metrics: DeploymentMetrics): boolean {
    const failures = [];
    
    if (metrics.errorRate > this.config.thresholds.errorRate) {
      failures.push(`Error rate too high: ${metrics.errorRate.toFixed(2)}% > ${this.config.thresholds.errorRate}%`);
    }
    
    if (metrics.averageResponseTime > this.config.thresholds.responseTime) {
      failures.push(`Response time too high: ${metrics.averageResponseTime.toFixed(0)}ms > ${this.config.thresholds.responseTime}ms`);
    }
    
    if (metrics.cpuUsage > this.config.thresholds.cpuUsage) {
      failures.push(`CPU usage too high: ${metrics.cpuUsage.toFixed(1)}% > ${this.config.thresholds.cpuUsage}%`);
    }
    
    if (metrics.memoryUsage > this.config.thresholds.memoryUsage) {
      failures.push(`Memory usage too high: ${metrics.memoryUsage.toFixed(1)}% > ${this.config.thresholds.memoryUsage}%`);
    }
    
    if (failures.length > 0) {
      console.error('❌ Health check failures:');
      failures.forEach(failure => console.error(`   - ${failure}`));
      return false;
    }
    
    return true;
  }
  
  private logMetrics(metrics: DeploymentMetrics): void {
    console.log(`📊 ${metrics.timestamp}: ` +
      `Errors: ${metrics.errorRate.toFixed(2)}%, ` +
      `Response: ${metrics.averageResponseTime.toFixed(0)}ms, ` +
      `RPS: ${metrics.requestsPerSecond.toFixed(0)}, ` +
      `CPU: ${metrics.cpuUsage.toFixed(1)}%, ` +
      `Memory: ${metrics.memoryUsage.toFixed(1)}%`
    );
  }
  
  private async generateReport(): Promise<void> {
    if (this.metrics.length === 0) {
      console.log('⚠️ No metrics collected for report');
      return;
    }
    
    const avgErrorRate = this.average(this.metrics.map(m => m.errorRate));
    const avgResponseTime = this.average(this.metrics.map(m => m.averageResponseTime));
    const avgThroughput = this.average(this.metrics.map(m => m.requestsPerSecond));
    const maxCpuUsage = Math.max(...this.metrics.map(m => m.cpuUsage));
    const maxMemoryUsage = Math.max(...this.metrics.map(m => m.memoryUsage));
    
    console.log('\n📊 Deployment Monitoring Report');
    console.log('================================');
    console.log(`Environment: ${this.config.environment}`);
    console.log(`Duration: ${this.config.duration}s`);
    console.log(`Data Points: ${this.metrics.length}`);
    console.log('');
    console.log('Performance Metrics:');
    console.log(`  Average Error Rate: ${avgErrorRate.toFixed(2)}%`);
    console.log(`  Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`  Average Throughput: ${avgThroughput.toFixed(0)} RPS`);
    console.log(`  Peak CPU Usage: ${maxCpuUsage.toFixed(1)}%`);
    console.log(`  Peak Memory Usage: ${maxMemoryUsage.toFixed(1)}%`);
    console.log('');
    
    // Write detailed report to file
    const report = {
      environment: this.config.environment,
      duration: this.config.duration,
      metrics: this.metrics,
      summary: {
        avgErrorRate,
        avgResponseTime,
        avgThroughput,
        maxCpuUsage,
        maxMemoryUsage
      }
    };
    
    require('fs').writeFileSync(
      `deployment-report-${this.config.environment}-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );
    
    console.log('✅ Detailed report saved to deployment-report-*.json');
  }
  
  private average(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI usage
async function main(): Promise<void> {
  const environment = process.argv[2] || 'production';
  const duration = parseInt(process.argv[3] || '300');
  
  const config: MonitoringConfig = {
    environment,
    duration,
    interval: 30,
    thresholds: {
      errorRate: 2.0,
      responseTime: 500,
      throughput: 50,
      cpuUsage: 80,
      memoryUsage: 85
    },
    endpoints: [
      `https://${environment}.example.com/health`,
      `https://${environment}.example.com/api/status`
    ]
  };
  
  const monitor = new DeploymentMonitor(config);
  const success = await monitor.startMonitoring();
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Monitoring failed:', error);
    process.exit(1);
  });
}
```

**📝 Task 2.2:** Implement the advanced monitoring script and integrate it with your canary deployment pipeline.

---

## Part 3: Cross-Platform Integration Testing (20 minutes)

### Step 5: Create Multi-Platform Test Matrix

Create `playwright-deployment-validation.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/deployment-validation',
  timeout: 60000,
  workers: process.env.CI ? 8 : 4,
  retries: 3,
  
  use: {
    baseURL: process.env.DEPLOYMENT_URL || 'https://production.example.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  
  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.(spec|test)\.ts$/,
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /.*\.(spec|test)\.ts$/,
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
      testMatch: /.*\.(spec|test)\.ts$/,
    },
    
    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: /.*mobile.*\.(spec|test)\.ts$/,
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
      testMatch: /.*mobile.*\.(spec|test)\.ts$/,
    },
    
    // API tests
    {
      name: 'api-validation',
      testMatch: /.*api.*\.(spec|test)\.ts$/,
    }
  ],
  
  reporter: [
    ['html', { outputFolder: 'deployment-validation-report', open: 'never' }],
    ['json', { outputFile: 'deployment-validation-results.json' }],
    ['junit', { outputFile: 'deployment-validation-junit.xml' }],
  ],
});
```

### Step 6: Create Deployment Validation Tests

Create `tests/deployment-validation/post-deployment.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Post-Deployment Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Add deployment-specific setup
    await page.setExtraHTTPHeaders({
      'X-Deployment-Validation': 'true',
      'X-Test-Environment': process.env.TEST_ENVIRONMENT || 'production'
    });
  });
  
  test('application loads successfully @smoke @critical', async ({ page }) => {
    await page.goto('/');
    
    // Check page loads
    await expect(page).toHaveTitle(/Example Application/);
    
    // Check critical elements
    await expect(page.locator('[data-testid="main-navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="footer"]')).toBeVisible();
    
    // Check no error messages
    await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
  });
  
  test('user authentication works @auth @critical', async ({ page }) => {
    await page.goto('/login');
    
    // Perform login
    await page.fill('[data-testid="username"]', 'test-user');
    await page.fill('[data-testid="password"]', 'test-password');
    await page.click('[data-testid="login-button"]');
    
    // Verify successful login
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
  
  test('search functionality works @search @integration', async ({ page }) => {
    await page.goto('/');
    
    // Perform search
    await page.fill('[data-testid="search-input"]', 'playwright');
    await page.click('[data-testid="search-button"]');
    
    // Verify results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-results"] .result-item')).toHaveCountGreaterThan(0);
  });
  
  test('payment processing works @payment @critical', async ({ page }) => {
    await page.goto('/checkout');
    
    // Fill payment form
    await page.fill('[data-testid="card-number"]', '4111111111111111');
    await page.fill('[data-testid="expiry"]', '12/25');
    await page.fill('[data-testid="cvv"]', '123');
    await page.fill('[data-testid="name"]', 'Test User');
    
    // Process payment
    await page.click('[data-testid="pay-button"]');
    
    // Verify success
    await expect(page.locator('[data-testid="payment-success"]')).toBeVisible();
  });
  
  test('performance meets requirements @performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check performance metrics
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const navEntries = JSON.parse(performanceEntries);
    const loadCompleteTime = navEntries[0]?.loadEventEnd - navEntries[0]?.loadEventStart;
    
    expect(loadCompleteTime).toBeLessThan(2000);
  });
});
```

**📝 Task 3.1:** Create comprehensive deployment validation tests that verify critical functionality across multiple browsers and devices.

---

## Part 4: Monitoring and Alerting Integration (10 minutes)

### Step 7: Create Monitoring Dashboard Configuration

Create `monitoring/grafana-dashboard.json`:

```json
{
  "dashboard": {
    "title": "Deployment Monitoring Dashboard",
    "tags": ["deployment", "monitoring", "playwright"],
    "timezone": "browser",
    "panels": [
      {
        "title": "Deployment Status",
        "type": "stat",
        "targets": [
          {
            "expr": "deployment_status{environment=\"production\"}",
            "legendFormat": "{{environment}}"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            },
            "thresholds": {
              "steps": [
                {"color": "red", "value": 0},
                {"color": "yellow", "value": 1},
                {"color": "green", "value": 2}
              ]
            }
          }
        }
      },
      {
        "title": "Test Success Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(playwright_tests_passed_total[5m]) / rate(playwright_tests_total[5m]) * 100",
            "legendFormat": "Success Rate %"
          }
        ]
      },
      {
        "title": "Deployment Duration",
        "type": "graph",
        "targets": [
          {
            "expr": "deployment_duration_seconds",
            "legendFormat": "{{strategy}}"
          }
        ]
      },
      {
        "title": "Error Rate by Environment",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_errors_total[5m]) / rate(http_requests_total[5m]) * 100",
            "legendFormat": "{{environment}} Error Rate %"
          }
        ]
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "30s"
  }
}
```

**📝 Task 4.1:** Set up monitoring dashboards and alerts for your deployment pipeline.

---

## Deliverables

Submit the following files and documentation:

1. **`.github/workflows/blue-green-deployment.yml`** - Complete blue-green deployment pipeline
2. **`.github/workflows/canary-deployment.yml`** - Canary deployment pipeline with traffic splitting
3. **`scripts/deployment-monitor.ts`** - Advanced monitoring script
4. **`playwright-deployment-validation.config.ts`** - Multi-platform test configuration
5. **`tests/deployment-validation/`** - Comprehensive validation test suite
6. **`monitoring/grafana-dashboard.json`** - Monitoring dashboard configuration
7. **`DEPLOYMENT_STRATEGY_ANALYSIS.md`** - Analysis of different deployment strategies with pros/cons
8. **Pipeline execution screenshots** - Evidence of successful advanced deployments
9. **Performance metrics reports** - Generated monitoring reports

## Validation Criteria

Your exercise will be evaluated on:

- ✅ **Advanced Deployment Patterns** (30%): Proper implementation of blue-green and canary strategies
- ✅ **Automated Rollback** (25%): Effective failure detection and recovery mechanisms  
- ✅ **Monitoring Integration** (20%): Comprehensive health checking and performance monitoring
- ✅ **Cross-Platform Validation** (15%): Multi-browser and device testing integration
- ✅ **Documentation Quality** (10%): Clear analysis and documentation of deployment strategies

## Common Issues and Solutions

### Issue: Traffic splitting not working
**Solution**: Verify load balancer configuration and service mesh setup

### Issue: Rollback triggers too frequently
**Solution**: Adjust monitoring thresholds and add stabilization periods

### Issue: Canary deployment stuck at low traffic
**Solution**: Implement automatic progression based on success metrics

### Issue: Cross-browser tests failing inconsistently
**Solution**: Add proper wait conditions and retry logic for different browsers

## Next Steps

After completing this exercise:
1. Explore [advanced reporting strategies](../../lesson-08-generating-and-analyzing-html-reports/content.md)
2. Learn about [CI/CD troubleshooting](../../lesson-11-troubleshooting-ci-cd-failures/content.md)
3. Study [pipeline optimization techniques](../../lesson-12-module-recap-and-pipeline-optimization/content.md)

---

**📚 Additional Resources:**
- [Blue-Green Deployment Patterns](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- [Canary Release Strategy](https://martinfowler.com/bliki/CanaryRelease.html)  
- [Deployment Pipeline Best Practices](../content.md#deployment-best-practices)