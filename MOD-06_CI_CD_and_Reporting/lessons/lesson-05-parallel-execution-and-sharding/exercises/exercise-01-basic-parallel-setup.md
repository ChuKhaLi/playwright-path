# Exercise 01: Basic Parallel Execution Setup

## Overview

This exercise guides you through implementing basic parallel execution in Playwright, focusing on worker configuration, resource optimization, and performance monitoring. You'll learn to set up parallel execution for different environments and understand the impact of worker allocation on test performance.

## Learning Objectives

By completing this exercise, you will be able to:

- **Configure parallel workers** based on system resources and environment constraints
- **Implement dynamic worker allocation** that adapts to available hardware resources
- **Set up performance monitoring** to track parallel execution metrics
- **Optimize resource usage** for different execution environments
- **Debug common parallel execution issues** including race conditions and resource conflicts
- **Create environment-specific configurations** for development, CI, and production

## Prerequisites

- Completion of Lessons 01-04 (CI/CD fundamentals, GitHub Actions setup)
- Basic understanding of Playwright configuration
- Node.js and npm installed on your system
- A GitHub repository with Playwright tests set up

## Time Estimate

**Total Time:** 90-120 minutes
- Setup and configuration: 30 minutes
- Implementation: 45 minutes
- Testing and optimization: 30-45 minutes

---

## Step 1: Environment Setup and Analysis

### 1.1 Create System Resource Analyzer

First, create a utility to analyze your system resources for optimal worker configuration.

**Create:** `utils/system-analyzer.ts`

```typescript
/**
 * System Resource Analyzer for Parallel Execution
 * Analyzes available system resources to determine optimal worker configuration
 */

import { cpus, totalmem, freemem, loadavg } from 'os';

export interface SystemResources {
  cpuCores: number;
  totalMemoryGB: number;
  availableMemoryGB: number;
  currentLoad: number;
  recommendedWorkers: number;
  environment: 'development' | 'ci' | 'production';
}

export class SystemResourceAnalyzer {
  /**
   * Analyze current system resources
   */
  static analyzeSystem(): SystemResources {
    const cpuCores = cpus().length;
    const totalMemoryGB = totalmem() / (1024 * 1024 * 1024);
    const availableMemoryGB = freemem() / (1024 * 1024 * 1024);
    const currentLoad = loadavg()[0];
    const environment = this.detectEnvironment();
    
    const recommendedWorkers = this.calculateOptimalWorkers(
      cpuCores,
      availableMemoryGB,
      currentLoad,
      environment
    );

    return {
      cpuCores,
      totalMemoryGB: Math.round(totalMemoryGB * 100) / 100,
      availableMemoryGB: Math.round(availableMemoryGB * 100) / 100,
      currentLoad: Math.round(currentLoad * 100) / 100,
      recommendedWorkers,
      environment,
    };
  }

  /**
   * Calculate optimal number of workers based on system resources
   */
  private static calculateOptimalWorkers(
    cpuCores: number,
    availableMemoryGB: number,
    currentLoad: number,
    environment: string
  ): number {
    // Conservative approach if system is under stress
    if (currentLoad > cpuCores * 0.8 || availableMemoryGB < 2) {
      return Math.max(1, Math.floor(cpuCores * 0.25));
    }

    // Environment-specific calculations
    switch (environment) {
      case 'development':
        // Conservative for development to leave resources for IDE
        return Math.min(2, Math.max(1, cpuCores - 2));
        
      case 'ci':
        // Optimize for CI efficiency
        return Math.min(4, Math.max(1, cpuCores - 1));
        
      case 'production':
        // Maximum efficiency for production
        const memoryBasedLimit = Math.floor(availableMemoryGB / 1.5);
        const cpuBasedLimit = Math.max(1, cpuCores - 1);
        return Math.min(memoryBasedLimit, cpuBasedLimit, 8);
        
      default:
        return Math.min(2, cpuCores);
    }
  }

  /**
   * Detect current environment
   */
  private static detectEnvironment(): 'development' | 'ci' | 'production' {
    if (process.env.CI) {
      return 'ci';
    }
    
    if (process.env.NODE_ENV === 'production') {
      return 'production';
    }
    
    return 'development';
  }

  /**
   * Generate performance report
   */
  static generateReport(): void {
    const resources = this.analyzeSystem();
    
    console.log('\n🔍 System Resource Analysis:');
    console.log(`   Environment: ${resources.environment}`);
    console.log(`   CPU Cores: ${resources.cpuCores}`);
    console.log(`   Total Memory: ${resources.totalMemoryGB}GB`);
    console.log(`   Available Memory: ${resources.availableMemoryGB}GB`);
    console.log(`   Current Load: ${resources.currentLoad}`);
    console.log(`   Recommended Workers: ${resources.recommendedWorkers}`);
    
    // Provide recommendations
    if (resources.availableMemoryGB < 4) {
      console.log('   ⚠️ Warning: Low available memory detected');
      console.log('   💡 Recommendation: Consider closing other applications');
    }
    
    if (resources.currentLoad > resources.cpuCores * 0.7) {
      console.log('   ⚠️ Warning: High CPU load detected');
      console.log('   💡 Recommendation: Using reduced worker count');
    }
  }
}
```

### 1.2 Test Your System Analysis

**Create:** `scripts/analyze-system.ts`

```typescript
#!/usr/bin/env node
/**
 * System Analysis Script
 * Run this script to analyze your system and get worker recommendations
 */

import { SystemResourceAnalyzer } from '../utils/system-analyzer';

async function main() {
  console.log('🚀 Analyzing system for optimal parallel execution...\n');
  
  // Generate system analysis report
  SystemResourceAnalyzer.generateReport();
  
  // Get detailed resources
  const resources = SystemResourceAnalyzer.analyzeSystem();
  
  console.log('\n📊 Configuration Recommendations:');
  console.log(`   Development: workers: ${Math.min(2, resources.recommendedWorkers)}`);
  console.log(`   CI: workers: ${resources.recommendedWorkers}`);
  console.log(`   Production: workers: ${resources.recommendedWorkers}`);
  
  console.log('\n🔧 Next Steps:');
  console.log('   1. Update your playwright.config.ts with recommended worker count');
  console.log('   2. Test with different worker configurations');
  console.log('   3. Monitor performance and adjust as needed');
}

if (require.main === module) {
  main().catch(console.error);
}
```

**Run the analysis:**

```powershell
# Make the script executable and run it
npx ts-node scripts/analyze-system.ts
```

## Step 2: Basic Parallel Configuration

### 2.1 Create Environment-Specific Configurations

**Update:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';
import { SystemResourceAnalyzer } from './utils/system-analyzer';

// Get system resources for dynamic configuration
const resources = SystemResourceAnalyzer.analyzeSystem();

export default defineConfig({
  testDir: './tests',
  
  // Dynamic worker allocation based on environment and resources
  workers: process.env.PLAYWRIGHT_WORKERS ? 
    parseInt(process.env.PLAYWRIGHT_WORKERS) : 
    resources.recommendedWorkers,
  
  // Enable full parallelization
  fullyParallel: true,
  
  // Environment-specific timeouts
  timeout: resources.environment === 'development' ? 15000 : 30000,
  expect: { timeout: resources.environment === 'development' ? 5000 : 10000 },
  
  // Retry strategy based on environment
  retries: resources.environment === 'ci' ? 2 : 0,
  
  // Environment-specific reporting
  reporter: [
    ['line'],
    ['html', { 
      open: resources.environment === 'development' ? 'on-failure' : 'never',
      outputFolder: `playwright-report-${resources.environment}` 
    }],
    ['json', { outputFile: `test-results/results-${resources.environment}.json` }],
  ],
  
  use: {
    // Browser settings optimized for parallel execution
    headless: resources.environment !== 'development',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Resource optimization based on available memory
    launchOptions: {
      args: resources.availableMemoryGB < 4 ? [
        '--memory-pressure-off',
        '--disable-background-timer-throttling',
        '--max_old_space_size=2048',
      ] : [],
    },
    
    // Capture settings based on environment
    screenshot: resources.environment === 'development' ? 'only-on-failure' : 'only-on-failure',
    video: resources.environment === 'ci' ? 'retain-on-failure' : 'off',
    trace: resources.environment === 'ci' ? 'retain-on-failure' : 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add more browsers based on environment
    ...(resources.environment !== 'development' ? [
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
    ] : []),
  ],
});
```

### 2.2 Create Performance Monitoring Setup

**Create:** `utils/performance-monitor.ts`

```typescript
/**
 * Performance Monitor for Parallel Execution
 * Tracks and reports on parallel test execution performance
 */

export interface TestMetrics {
  testName: string;
  workerIndex: number;
  duration: number;
  memoryUsage: number;
  status: 'passed' | 'failed' | 'skipped';
  timestamp: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private startTime: number = 0;
  private testMetrics: TestMetrics[] = [];
  private workerStats: Map<number, {
    testsCompleted: number;
    totalDuration: number;
    errors: number;
    peakMemory: number;
  }> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMonitoring(): void {
    this.startTime = Date.now();
    console.log('🚀 Performance monitoring started...');
  }

  recordTest(metrics: TestMetrics): void {
    this.testMetrics.push(metrics);
    
    // Update worker statistics
    if (!this.workerStats.has(metrics.workerIndex)) {
      this.workerStats.set(metrics.workerIndex, {
        testsCompleted: 0,
        totalDuration: 0,
        errors: 0,
        peakMemory: 0,
      });
    }

    const stats = this.workerStats.get(metrics.workerIndex)!;
    stats.testsCompleted++;
    stats.totalDuration += metrics.duration;
    stats.peakMemory = Math.max(stats.peakMemory, metrics.memoryUsage);
    
    if (metrics.status === 'failed') {
      stats.errors++;
    }
  }

  generateReport(): void {
    const totalExecutionTime = Date.now() - this.startTime;
    const totalTests = this.testMetrics.length;
    
    console.log('\n📈 Parallel Execution Performance Report:');
    console.log(`   Total Execution Time: ${(totalExecutionTime / 1000).toFixed(2)}s`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Active Workers: ${this.workerStats.size}`);
    
    if (totalTests > 0) {
      const averageDuration = this.testMetrics.reduce((sum, m) => sum + m.duration, 0) / totalTests;
      const successRate = (this.testMetrics.filter(m => m.status === 'passed').length / totalTests) * 100;
      const throughput = totalTests / (totalExecutionTime / 1000);
      
      console.log(`   Average Test Duration: ${averageDuration.toFixed(2)}ms`);
      console.log(`   Success Rate: ${successRate.toFixed(2)}%`);
      console.log(`   Throughput: ${throughput.toFixed(2)} tests/second`);
    }

    // Worker-specific statistics
    console.log('\n👥 Worker Performance:');
    this.workerStats.forEach((stats, workerIndex) => {
      const avgDuration = stats.totalDuration / stats.testsCompleted;
      const errorRate = (stats.errors / stats.testsCompleted) * 100;
      
      console.log(`   Worker ${workerIndex}:`);
      console.log(`     Tests: ${stats.testsCompleted}`);
      console.log(`     Avg Duration: ${avgDuration.toFixed(2)}ms`);
      console.log(`     Error Rate: ${errorRate.toFixed(2)}%`);
      console.log(`     Peak Memory: ${(stats.peakMemory / 1024 / 1024).toFixed(2)}MB`);
    });

    // Performance insights
    this.generateInsights();
  }

  private generateInsights(): void {
    console.log('\n💡 Performance Insights:');
    
    const workerCount = this.workerStats.size;
    const totalTests = this.testMetrics.length;
    
    if (workerCount === 1) {
      console.log('   - Consider enabling parallel execution to improve performance');
    } else if (workerCount > 8) {
      console.log('   - High worker count detected - monitor resource usage');
    }
    
    // Check for load imbalance
    const testsPerWorker = Array.from(this.workerStats.values()).map(s => s.testsCompleted);
    const maxTests = Math.max(...testsPerWorker);
    const minTests = Math.min(...testsPerWorker);
    
    if (maxTests - minTests > totalTests * 0.2) {
      console.log('   - Load imbalance detected - consider test redistribution');
    }
    
    // Memory usage analysis
    const memoryUsages = Array.from(this.workerStats.values()).map(s => s.peakMemory);
    const maxMemory = Math.max(...memoryUsages);
    
    if (maxMemory > 1024 * 1024 * 1024) { // 1GB
      console.log('   - High memory usage detected - consider optimizing test data');
    }
  }

  exportMetrics(): string {
    return JSON.stringify({
      executionTime: Date.now() - this.startTime,
      totalTests: this.testMetrics.length,
      workerCount: this.workerStats.size,
      testMetrics: this.testMetrics,
      workerStats: Object.fromEntries(this.workerStats),
    }, null, 2);
  }
}
```

## Step 3: Implement Test Fixtures with Monitoring

### 3.1 Create Enhanced Test Fixtures

**Create:** `fixtures/parallel-fixtures.ts`

```typescript
import { test as base, expect } from '@playwright/test';
import { PerformanceMonitor } from '../utils/performance-monitor';

// Worker-specific information
export interface WorkerContext {
  index: number;
  totalWorkers: number;
  uniqueId: string;
}

// Enhanced test fixtures
type TestFixtures = {
  workerContext: WorkerContext;
  monitoredPage: any;
};

export const test = base.extend<TestFixtures>({
  // Worker context fixture
  workerContext: [async ({}, use, testInfo) => {
    const workerIndex = testInfo.workerIndex || 0;
    const totalWorkers = parseInt(process.env.PLAYWRIGHT_WORKERS || '1');
    const uniqueId = `worker-${workerIndex}-${Date.now()}`;
    
    const context: WorkerContext = {
      index: workerIndex,
      totalWorkers,
      uniqueId,
    };
    
    console.log(`🔄 Worker ${workerIndex} initialized (${uniqueId})`);
    
    await use(context);
  }, { scope: 'worker' }],

  // Performance-monitored page fixture
  monitoredPage: async ({ page, workerContext }, use, testInfo) => {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;
    const monitor = PerformanceMonitor.getInstance();
    
    console.log(`▶️ Worker ${workerContext.index}: Starting "${testInfo.title}"`);
    
    await use(page);
    
    // Record performance metrics
    const endTime = Date.now();
    const endMemory = process.memoryUsage().heapUsed;
    const duration = endTime - startTime;
    
    monitor.recordTest({
      testName: testInfo.title,
      workerIndex: workerContext.index,
      duration,
      memoryUsage: endMemory,
      status: testInfo.status as 'passed' | 'failed' | 'skipped',
      timestamp: endTime,
    });
    
    console.log(`✅ Worker ${workerContext.index}: Completed "${testInfo.title}" in ${duration}ms`);
  },
});

export { expect };
```

### 3.2 Create Sample Parallel Tests

**Create:** `tests/parallel/basic-parallel.spec.ts`

```typescript
import { test, expect } from '../../fixtures/parallel-fixtures';
import { PerformanceMonitor } from '../../utils/performance-monitor';

test.describe('Basic Parallel Execution', () => {
  test.beforeAll(async () => {
    PerformanceMonitor.getInstance().startMonitoring();
  });

  test.afterAll(async () => {
    PerformanceMonitor.getInstance().generateReport();
  });

  test('parallel test 1 - navigation', async ({ monitoredPage, workerContext }) => {
    await monitoredPage.goto('https://playwright.dev');
    
    // Add worker-specific delay to demonstrate parallel execution
    await monitoredPage.waitForTimeout(workerContext.index * 100);
    
    await expect(monitoredPage.locator('h1')).toBeVisible();
    
    console.log(`Worker ${workerContext.index}: Navigation test completed`);
  });

  test('parallel test 2 - search functionality', async ({ monitoredPage, workerContext }) => {
    await monitoredPage.goto('https://playwright.dev');
    
    // Simulate search interaction
    const searchButton = monitoredPage.locator('[aria-label="Search"]').first();
    if (await searchButton.isVisible()) {
      await searchButton.click();
      await monitoredPage.keyboard.press('Escape');
    }
    
    await expect(monitoredPage.locator('nav')).toBeVisible();
    
    console.log(`Worker ${workerContext.index}: Search test completed`);
  });

  test('parallel test 3 - documentation links', async ({ monitoredPage, workerContext }) => {
    await monitoredPage.goto('https://playwright.dev');
    
    // Navigate to docs
    const docsLink = monitoredPage.locator('text=Docs').first();
    await docsLink.click();
    
    await expect(monitoredPage.locator('h1')).toBeVisible();
    
    console.log(`Worker ${workerContext.index}: Documentation test completed`);
  });

  test('parallel test 4 - worker isolation', async ({ monitoredPage, workerContext }) => {
    await monitoredPage.goto('https://playwright.dev');
    
    // Use worker-specific data to test isolation
    const uniqueData = `test-data-${workerContext.uniqueId}`;
    
    await monitoredPage.evaluate((data) => {
      localStorage.setItem('workerTest', data);
    }, uniqueData);
    
    const storedData = await monitoredPage.evaluate(() => {
      return localStorage.getItem('workerTest');
    });
    
    expect(storedData).toBe(uniqueData);
    
    console.log(`Worker ${workerContext.index}: Isolation test completed with ${uniqueData}`);
  });

  test('parallel test 5 - resource management', async ({ monitoredPage, workerContext }) => {
    await monitoredPage.goto('https://playwright.dev');
    
    // Simulate resource-intensive operations
    for (let i = 0; i < 3; i++) {
      await monitoredPage.locator('a').first().hover();
      await monitoredPage.waitForTimeout(100);
    }
    
    const memoryUsage = process.memoryUsage();
    console.log(`Worker ${workerContext.index}: Memory usage - ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    
    await expect(monitoredPage.locator('body')).toBeVisible();
  });
});
```

## Step 4: Test and Optimize Configuration

### 4.1 Run Tests with Different Worker Configurations

**Create test script:** `scripts/test-parallel-configs.ps1`

```powershell
# Test Parallel Configurations Script
# Tests different worker configurations to find optimal settings

Write-Host "🧪 Testing Different Parallel Configurations..." -ForegroundColor Green

# Test configurations
$configurations = @(
    @{ workers = 1; name = "Sequential" },
    @{ workers = 2; name = "Dual Worker" },
    @{ workers = 4; name = "Quad Worker" },
    @{ workers = 8; name = "Octa Worker" }
)

$results = @()

foreach ($config in $configurations) {
    Write-Host "`n🔧 Testing $($config.name) configuration ($($config.workers) workers)..." -ForegroundColor Yellow
    
    $startTime = Get-Date
    
    # Set environment variable and run tests
    $env:PLAYWRIGHT_WORKERS = $config.workers
    
    try {
        npx playwright test tests/parallel/basic-parallel.spec.ts --reporter=json --output-file="test-results/results-$($config.workers)-workers.json"
        
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        
        $results += @{
            Workers = $config.workers
            Name = $config.name
            Duration = $duration
            Status = "Success"
        }
        
        Write-Host "✅ $($config.name): Completed in $duration seconds" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ $($config.name): Failed - $($_.Exception.Message)" -ForegroundColor Red
        
        $results += @{
            Workers = $config.workers
            Name = $config.name
            Duration = 0
            Status = "Failed"
        }
    }
}

# Display results summary
Write-Host "`n📊 Performance Comparison:" -ForegroundColor Cyan
Write-Host "Workers | Configuration | Duration | Status" -ForegroundColor White
Write-Host "--------|---------------|----------|--------" -ForegroundColor White

foreach ($result in $results) {
    $status_color = if ($result.Status -eq "Success") { "Green" } else { "Red" }
    Write-Host "$($result.Workers.ToString().PadRight(7)) | $($result.Name.PadRight(13)) | $($result.Duration.ToString("F2").PadRight(8)) | $($result.Status)" -ForegroundColor $status_color
}

# Find optimal configuration
$successfulResults = $results | Where-Object { $_.Status -eq "Success" -and $_.Duration -gt 0 }
if ($successfulResults.Count -gt 0) {
    $optimal = $successfulResults | Sort-Object Duration | Select-Object -First 1
    Write-Host "`n🎯 Optimal Configuration: $($optimal.Name) ($($optimal.Workers) workers) - $($optimal.Duration.ToString("F2")) seconds" -ForegroundColor Green
}

Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
Write-Host "1. Review the performance results above"
Write-Host "2. Update your playwright.config.ts with the optimal worker count"
Write-Host "3. Consider your system resources and adjust accordingly"
Write-Host "4. Run tests in CI environment to compare results"
```

**Run the performance test:**

```powershell
# Make script executable and run
powershell -ExecutionPolicy Bypass -File scripts/test-parallel-configs.ps1
```

### 4.2 Create Performance Analysis Report

**Create:** `scripts/analyze-performance.ts`

```typescript
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface TestResult {
  workers: number;
  duration: number;
  testsCount: number;
  passRate: number;
}

function analyzePerformanceResults(): void {
  console.log('📊 Analyzing parallel execution performance...\n');
  
  const results: TestResult[] = [];
  const workerCounts = [1, 2, 4, 8];
  
  // Read results from each configuration
  for (const workers of workerCounts) {
    const resultsFile = join('test-results', `results-${workers}-workers.json`);
    
    if (existsSync(resultsFile)) {
      try {
        const data = JSON.parse(readFileSync(resultsFile, 'utf8'));
        
        const duration = data.stats?.duration || 0;
        const testsCount = data.stats?.tests || 0;
        const passRate = testsCount > 0 ? (data.stats?.passed / testsCount) * 100 : 0;
        
        results.push({
          workers,
          duration: duration / 1000, // Convert to seconds
          testsCount,
          passRate,
        });
      } catch (error) {
        console.log(`⚠️ Could not parse results for ${workers} workers`);
      }
    }
  }
  
  if (results.length === 0) {
    console.log('❌ No test results found. Run the parallel configuration tests first.');
    return;
  }
  
  // Display results
  console.log('Configuration Performance Analysis:');
  console.log('Workers | Duration (s) | Tests | Pass Rate | Efficiency');
  console.log('--------|-------------|-------|-----------|------------');
  
  const baseline = results.find(r => r.workers === 1);
  
  results.forEach(result => {
    const efficiency = baseline ? (baseline.duration / result.duration).toFixed(2) : 'N/A';
    console.log(
      `${result.workers.toString().padStart(7)} | ${result.duration.toFixed(2).padStart(11)} | ${result.testsCount.toString().padStart(5)} | ${result.passRate.toFixed(1).padStart(8)}% | ${efficiency.padStart(10)}`
    );
  });
  
  // Find optimal configuration
  const validResults = results.filter(r => r.passRate >= 95);
  if (validResults.length > 0) {
    const optimal = validResults.reduce((best, current) => 
      current.duration < best.duration ? current : best
    );
    
    console.log(`\n🎯 Optimal Configuration: ${optimal.workers} workers`);
    console.log(`   Duration: ${optimal.duration.toFixed(2)}s`);
    console.log(`   Pass Rate: ${optimal.passRate.toFixed(1)}%`);
    
    if (baseline) {
      const speedup = (baseline.duration / optimal.duration).toFixed(2);
      console.log(`   Speedup: ${speedup}x faster than sequential`);
    }
  }
  
  // Provide recommendations
  console.log('\n💡 Recommendations:');
  
  if (results.length >= 2) {
    const best = results.reduce((best, current) => 
      current.duration < best.duration ? current : best
    );
    
    if (best.workers === 1) {
      console.log('   - Parallel execution may not benefit this test suite');
      console.log('   - Consider testing with more complex or longer-running tests');
    } else if (best.workers >= 8) {
      console.log('   - High worker count optimal - ensure sufficient system resources');
      console.log('   - Monitor memory usage and CPU utilization');
    } else {
      console.log(`   - Optimal worker count appears to be ${best.workers}`);
      console.log('   - Good balance between speed and resource usage');
    }
  }
  
  console.log('   - Test in CI environment to validate results');
  console.log('   - Monitor for resource contention issues');
  console.log('   - Consider test isolation and data management');
}

if (require.main === module) {
  analyzePerformanceResults();
}
```

**Run the analysis:**

```powershell
npx ts-node scripts/analyze-performance.ts
```

## Step 5: Validation and Testing

### 5.1 Create Validation Test Suite

**Create:** `tests/validation/parallel-validation.spec.ts`

```typescript
import { test, expect } from '../../fixtures/parallel-fixtures';

test.describe('Parallel Execution Validation', () => {
  test('worker isolation - local storage', async ({ monitoredPage, workerContext }) => {
    await monitoredPage.goto('data:text/html,<html><body><h1>Test Page</h1></body></html>');
    
    // Set worker-specific data
    const workerData = `worker-${workerContext.index}-${Date.now()}`;
    await monitoredPage.evaluate((data) => {
      localStorage.setItem('workerTest', data);
    }, workerData);
    
    // Verify isolation
    const retrievedData = await monitoredPage.evaluate(() => {
      return localStorage.getItem('workerTest');
    });
    
    expect(retrievedData).toBe(workerData);
  });

  test('worker isolation - session storage', async ({ monitoredPage, workerContext }) => {
    await monitoredPage.goto('data:text/html,<html><body><h1>Test Page</h1></body></html>');
    
    // Set worker-specific session data
    const sessionData = `session-${workerContext.uniqueId}`;
    await monitoredPage.evaluate((data) => {
      sessionStorage.setItem('sessionTest', data);
    }, sessionData);
    
    // Verify session isolation
    const retrievedSession = await monitoredPage.evaluate(() => {
      return sessionStorage.getItem('sessionTest');
    });
    
    expect(retrievedSession).toBe(sessionData);
  });

  test('resource management - memory tracking', async ({ monitoredPage, workerContext }) => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    await monitoredPage.goto('https://playwright.dev');
    
    // Perform operations that use memory
    for (let i = 0; i < 5; i++) {
      await monitoredPage.evaluate(() => {
        // Create some objects to test memory usage
        const tempArray = new Array(1000).fill('test data');
        return tempArray.length;
      });
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDelta = (finalMemory - initialMemory) / 1024 / 1024; // MB
    
    console.log(`Worker ${workerContext.index}: Memory delta: ${memoryDelta.toFixed(2)}MB`);
    
    // Ensure memory usage is reasonable (less than 100MB increase)
    expect(memoryDelta).toBeLessThan(100);
  });

  test('concurrent execution - timing validation', async ({ monitoredPage, workerContext }) => {
    const startTime = Date.now();
    
    await monitoredPage.goto('https://playwright.dev');
    
    // Add a delay proportional to worker index to test concurrency
    const delay = 500 + (workerContext.index * 100);
    await monitoredPage.waitForTimeout(delay);
    
    const endTime = Date.now();
    const actualDelay = endTime - startTime;
    
    console.log(`Worker ${workerContext.index}: Expected ~${delay}ms, actual ${actualDelay}ms`);
    
    // Verify timing is approximately correct (allowing for navigation time)
    expect(actualDelay).toBeGreaterThan(delay - 100);
    expect(actualDelay).toBeLessThan(delay + 2000); // Allow for navigation overhead
  });
});
```

### 5.2 Run Complete Validation

**Create final validation script:** `scripts/validate-parallel-setup.ps1`

```powershell
Write-Host "🔍 Validating Parallel Execution Setup..." -ForegroundColor Green

# Step 1: System Analysis
Write-Host "`n1️⃣ Running system analysis..." -ForegroundColor Yellow
npx ts-node scripts/analyze-system.ts

# Step 2: Run validation tests
Write-Host "`n2️⃣ Running parallel validation tests..." -ForegroundColor Yellow
npx playwright test tests/validation/parallel-validation.spec.ts --reporter=line

# Step 3: Run performance tests
Write-Host "`n3️⃣ Running performance comparison tests..." -ForegroundColor Yellow
npx playwright test tests/parallel/basic-parallel.spec.ts --reporter=html

# Step 4: Generate performance analysis
Write-Host "`n4️⃣ Generating performance analysis..." -ForegroundColor Yellow
npx ts-node scripts/analyze-performance.ts

Write-Host "`n✅ Parallel execution setup validation complete!" -ForegroundColor Green
Write-Host "`n📊 Next steps:" -ForegroundColor Cyan
Write-Host "1. Review the HTML report in playwright-report/"
Write-Host "2. Check performance analysis results"
Write-Host "3. Adjust worker configuration based on recommendations"
Write-Host "4. Test in your CI environment"
```

## Deliverables

Upon completion of this exercise, you should have:

1. **System Resource Analyzer** (`utils/system-analyzer.ts`)
   - Analyzes available system resources
   - Provides worker recommendations based on environment
   - Generates detailed resource analysis reports

2. **Performance Monitor** (`utils/performance-monitor.ts`)
   - Tracks parallel execution metrics
   - Monitors worker performance and resource usage
   - Provides optimization insights

3. **Enhanced Test Fixtures** (`fixtures/parallel-fixtures.ts`)
   - Worker context information
   - Performance monitoring integration
   - Test isolation utilities

4. **Validation Test Suite** (`tests/validation/parallel-validation.spec.ts`)
   - Worker isolation tests
   - Resource management validation
   - Concurrent execution verification

5. **Performance Analysis Scripts**
   - System analysis script
   - Performance comparison testing
   - Automated optimization recommendations

## Success Criteria

✅ **Configuration Success:**
- System resource analyzer correctly identifies optimal worker count
- Playwright configuration adapts to different environments
- Performance monitoring tracks execution metrics

✅ **Execution Success:**
- Tests run successfully in parallel across multiple workers
- Worker isolation is maintained (no test interference)
- Resource usage remains within acceptable limits

✅ **Performance Success:**
- Parallel execution shows measurable performance improvement
- Optimal worker configuration identified for your system
- Performance analysis provides actionable insights

✅ **Validation Success:**
- All validation tests pass
- No race conditions or resource conflicts detected
- Memory usage remains stable across test runs

## Troubleshooting

**Common Issues:**

1. **High Memory Usage:**
   - Reduce worker count
   - Add memory management launch options
   - Monitor for memory leaks in tests

2. **Test Failures in Parallel:**
   - Check for shared state between tests
   - Ensure proper test isolation
   - Verify unique test data per worker

3. **Performance Degradation:**
   - System may be over-allocated
   - Check for resource contention
   - Verify optimal worker count for your hardware

4. **Worker Communication Issues:**
   - Ensure tests don't depend on execution order
   - Verify proper fixture scoping
   - Check for global state dependencies

## Next Steps

After completing this exercise:

1. **Move to Exercise 02:** Advanced Sharding Implementation
2. **Test in CI Environment:** Validate configuration in GitHub Actions
3. **Optimize Further:** Fine-tune based on your specific test suite
4. **Document Configuration:** Create team guidelines for parallel execution

This exercise provides the foundation for implementing parallel execution in your Playwright test suite. The next exercise will build on this knowledge to implement advanced sharding strategies for enterprise-scale testing.