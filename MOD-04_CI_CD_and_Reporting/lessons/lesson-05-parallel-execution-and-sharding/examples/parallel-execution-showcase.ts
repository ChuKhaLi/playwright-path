/**
 * Parallel Execution Showcase
 * 
 * This file demonstrates advanced parallel execution configurations in Playwright,
 * showing different strategies for optimizing test performance across various environments.
 * 
 * Key Concepts Demonstrated:
 * - Dynamic worker allocation based on system resources
 * - Environment-specific configurations
 * - Resource management and optimization
 * - Performance monitoring integration
 * - Custom fixtures for parallel execution
 */

import { defineConfig, devices } from '@playwright/test';
import { cpus, totalmem, freemem, loadavg } from 'os';

// ================================
// 1. SYSTEM RESOURCE ANALYSIS
// ================================

/**
 * Analyzes system resources to determine optimal worker configuration
 */
class SystemResourceAnalyzer {
  private static instance: SystemResourceAnalyzer;
  
  public static getInstance(): SystemResourceAnalyzer {
    if (!SystemResourceAnalyzer.instance) {
      SystemResourceAnalyzer.instance = new SystemResourceAnalyzer();
    }
    return SystemResourceAnalyzer.instance;
  }

  /**
   * Calculate optimal number of workers based on system resources
   */
  calculateOptimalWorkers(): number {
    const cpuCount = cpus().length;
    const totalMemoryGB = totalmem() / (1024 * 1024 * 1024);
    const freeMemoryGB = freemem() / (1024 * 1024 * 1024);
    const currentLoad = loadavg()[0];
    
    console.log('📊 System Resource Analysis:');
    console.log(`   CPU Cores: ${cpuCount}`);
    console.log(`   Total Memory: ${totalMemoryGB.toFixed(2)}GB`);
    console.log(`   Available Memory: ${freeMemoryGB.toFixed(2)}GB`);
    console.log(`   Current Load: ${currentLoad.toFixed(2)}`);
    
    // Conservative approach if system is under stress
    if (currentLoad > cpuCount * 0.8 || freeMemoryGB < 2) {
      const conservativeWorkers = Math.max(1, Math.floor(cpuCount * 0.25));
      console.log(`   🚨 High system load detected, using conservative worker count: ${conservativeWorkers}`);
      return conservativeWorkers;
    }
    
    // Memory-based calculation (assume 1GB per worker minimum)
    const memoryBasedLimit = Math.floor(freeMemoryGB / 1.5);
    
    // CPU-based calculation (leave one core free for system)
    const cpuBasedLimit = Math.max(1, cpuCount - 1);
    
    // Take the more conservative limit
    const optimalWorkers = Math.min(memoryBasedLimit, cpuBasedLimit, 8); // Cap at 8 for stability
    
    console.log(`   ✅ Calculated optimal workers: ${optimalWorkers}`);
    return optimalWorkers;
  }

  /**
   * Get environment-specific worker configuration
   */
  getEnvironmentWorkers(): number {
    if (process.env.CI) {
      // CI environment: Use provided configuration or calculate based on runner specs
      if (process.env.GITHUB_ACTIONS) {
        // GitHub Actions runners typically have 2 cores, 7GB RAM
        return parseInt(process.env.PLAYWRIGHT_WORKERS || '2');
      }
      
      if (process.env.AZURE_PIPELINES) {
        // Azure DevOps agents vary, use conservative approach
        return parseInt(process.env.PLAYWRIGHT_WORKERS || '2');
      }
      
      // Generic CI environment
      return Math.min(4, this.calculateOptimalWorkers());
    }
    
    // Local development
    return this.calculateOptimalWorkers();
  }
}

// ================================
// 2. PERFORMANCE MONITORING
// ================================

interface WorkerMetrics {
  testsCompleted: number;
  totalDuration: number;
  averageDuration: number;
  peakMemoryUsage: number;
  errors: number;
}

/**
 * Performance monitoring utilities for parallel execution
 */
class PerformanceMonitor {
  private startTime: number = 0;
  private workerMetrics: Map<number, WorkerMetrics> = new Map();

  start(): void {
    this.startTime = Date.now();
    console.log('🚀 Performance monitoring started...');
  }

  recordWorkerTest(workerIndex: number, duration: number, memoryUsage: number, hasError: boolean): void {
    if (!this.workerMetrics.has(workerIndex)) {
      this.workerMetrics.set(workerIndex, {
        testsCompleted: 0,
        totalDuration: 0,
        averageDuration: 0,
        peakMemoryUsage: 0,
        errors: 0,
      });
    }
    
    const metrics = this.workerMetrics.get(workerIndex)!;
    metrics.testsCompleted++;
    metrics.totalDuration += duration;
    metrics.averageDuration = metrics.totalDuration / metrics.testsCompleted;
    metrics.peakMemoryUsage = Math.max(metrics.peakMemoryUsage, memoryUsage);
    
    if (hasError) {
      metrics.errors++;
    }
  }

  generateReport(): void {
    const totalExecutionTime = Date.now() - this.startTime;
    
    console.log('\n📈 Parallel Execution Performance Report:');
    console.log(`   Total Execution Time: ${(totalExecutionTime / 1000).toFixed(2)}s`);
    console.log(`   Active Workers: ${this.workerMetrics.size}`);
    
    let totalTests = 0;
    let totalErrors = 0;
    let maxMemoryUsage = 0;
    
    this.workerMetrics.forEach((metrics, workerIndex) => {
      console.log(`   \n   Worker ${workerIndex}:`);
      console.log(`     Tests Completed: ${metrics.testsCompleted}`);
      console.log(`     Average Duration: ${metrics.averageDuration.toFixed(2)}ms`);
      console.log(`     Peak Memory: ${(metrics.peakMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
      console.log(`     Errors: ${metrics.errors}`);
      
      totalTests += metrics.testsCompleted;
      totalErrors += metrics.errors;
      maxMemoryUsage = Math.max(maxMemoryUsage, metrics.peakMemoryUsage);
    });
    
    console.log(`   \n   📊 Summary:`);
    console.log(`     Total Tests: ${totalTests}`);
    console.log(`     Total Errors: ${totalErrors}`);
    console.log(`     Error Rate: ${((totalErrors / totalTests) * 100).toFixed(2)}%`);
    console.log(`     Peak Memory Usage: ${(maxMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
    console.log(`     Throughput: ${(totalTests / (totalExecutionTime / 1000)).toFixed(2)} tests/second`);
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// ================================
// 3. CONFIGURATION PROFILES
// ================================

/**
 * Development environment configuration
 * Optimized for local development with faster feedback
 */
const developmentConfig = defineConfig({
  testDir: './tests',
  
  // Conservative worker count for development
  workers: Math.min(2, SystemResourceAnalyzer.getInstance().getEnvironmentWorkers()),
  
  // Enable parallel execution within files
  fullyParallel: true,
  
  // Shorter timeouts for faster feedback
  timeout: 15000,
  expect: { timeout: 5000 },
  
  // No retries in development
  retries: 0,
  
  // Minimal reporting for development
  reporter: [
    ['line'],
    ['html', { open: 'never', outputFolder: 'dev-reports' }],
  ],
  
  use: {
    // Development browser settings
    headless: false, // Show browser for debugging
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Capture on failure only
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'dev-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

/**
 * CI environment configuration
 * Optimized for continuous integration with resource efficiency
 */
const ciConfig = defineConfig({
  testDir: './tests',
  
  // Optimized worker count for CI
  workers: SystemResourceAnalyzer.getInstance().getEnvironmentWorkers(),
  
  // Full parallelization for CI speed
  fullyParallel: true,
  
  // Extended timeouts for CI reliability
  timeout: 45000,
  expect: { timeout: 10000 },
  
  // Retry strategy for CI stability
  retries: process.env.CI ? 2 : 0,
  
  // Comprehensive CI reporting
  reporter: [
    ['github'], // GitHub Actions integration
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  
  use: {
    // CI browser settings
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Resource optimization for CI
    launchOptions: {
      args: [
        '--memory-pressure-off',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
      ],
    },
    
    // Minimal capture to save resources
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'ci-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'ci-firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});

/**
 * Enterprise environment configuration
 * Optimized for large-scale enterprise testing with monitoring
 */
const enterpriseConfig = defineConfig({
  testDir: './tests',
  
  // Dynamic worker allocation based on available resources
  workers: process.env.ENTERPRISE_WORKERS ? 
    parseInt(process.env.ENTERPRISE_WORKERS) : 
    SystemResourceAnalyzer.getInstance().getEnvironmentWorkers(),
  
  // Full parallelization for enterprise scale
  fullyParallel: true,
  
  // Extended timeouts for enterprise reliability
  timeout: 120000,
  expect: { timeout: 15000 },
  
  // Robust retry strategy
  retries: 3,
  
  // Enterprise-grade reporting
  reporter: [
    ['junit', { outputFile: 'enterprise-reports/junit-results.xml' }],
    ['json', { outputFile: 'enterprise-reports/detailed-results.json' }],
    ['html', { open: 'never', outputFolder: 'enterprise-reports/html' }],
    ['./reporters/enterprise-reporter.ts'], // Custom enterprise reporter
  ],
  
  // Global setup for enterprise monitoring
  globalSetup: require.resolve('./setup/enterprise-global-setup.ts'),
  globalTeardown: require.resolve('./setup/enterprise-global-teardown.ts'),
  
  use: {
    // Enterprise browser settings
    headless: true,
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    
    // Enterprise resource optimization
    launchOptions: {
      args: [
        '--memory-pressure-off',
        '--disable-background-timer-throttling',
        '--disable-dev-shm-usage', // Prevents crashes in Docker environments
        '--no-sandbox', // Required for some CI environments
        '--disable-gpu', // Reduces resource usage
      ],
    },
    
    // Comprehensive capture for enterprise debugging
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Custom headers for enterprise monitoring
    extraHTTPHeaders: {
      'X-Test-Environment': 'enterprise',
      'X-Performance-Monitor': 'enabled',
    },
  },
  
  projects: [
    {
      name: 'enterprise-smoke',
      testMatch: '**/smoke/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'enterprise-regression',
      testMatch: '**/regression/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['enterprise-smoke'], // Run after smoke tests
    },
    {
      name: 'enterprise-cross-browser',
      testMatch: '**/cross-browser/**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});

// ================================
// 4. CUSTOM TEST FIXTURES
// ================================

import { test as base, expect } from '@playwright/test';

interface WorkerInfo {
  index: number;
  totalWorkers: number;
  resourceAllocation: {
    memoryLimit: number;
    cpuAffinity?: number[];
  };
}

/**
 * Enhanced test fixture with performance monitoring
 */
type TestFixtures = {
  monitoredPage: any; // Page with performance monitoring
  workerInfo: WorkerInfo; // Worker-specific information
};

export const test = base.extend<TestFixtures>({
  // Worker information fixture
  workerInfo: [async ({}, use, testInfo) => {
    const workerInfo: WorkerInfo = {
      index: testInfo.workerIndex || 0,
      totalWorkers: parseInt(process.env.PLAYWRIGHT_WORKERS || '1'),
      resourceAllocation: {
        memoryLimit: 512, // MB per worker
      },
    };
    
    await use(workerInfo);
  }, { scope: 'worker' }],
  
  // Performance-monitored page fixture
  monitoredPage: async ({ page, workerInfo }, use, testInfo) => {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;
    
    // Add performance monitoring to page
    await page.addInitScript(() => {
      // Add performance markers
      (window as any).performance.mark('test-start');
      
      // Monitor resource usage
      window.addEventListener('beforeunload', () => {
        (window as any).performance.mark('test-end');
        (window as any).performance.measure('test-duration', 'test-start', 'test-end');
      });
    });
    
    // Network monitoring
    let networkRequests = 0;
    let failedRequests = 0;
    
    page.on('request', () => networkRequests++);
    page.on('requestfailed', () => failedRequests++);
    
    await use(page);
    
    // Calculate metrics
    const endTime = Date.now();
    const endMemory = process.memoryUsage().heapUsed;
    const duration = endTime - startTime;
    const memoryDelta = endMemory - startMemory;
    
    // Record performance metrics
    performanceMonitor.recordWorkerTest(
      workerInfo.index,
      duration,
      endMemory,
      testInfo.status === 'failed'
    );
    
    // Log test completion
    console.log(`✅ Worker ${workerInfo.index}: Test "${testInfo.title}" completed in ${duration}ms`);
    console.log(`   Memory delta: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Network requests: ${networkRequests} (${failedRequests} failed)`);
  },
});

// ================================
// 5. USAGE EXAMPLES
// ================================

/**
 * Example test demonstrating parallel execution with monitoring
 */
test.describe('Parallel Execution Showcase', () => {
  test.beforeAll(async () => {
    performanceMonitor.start();
  });
  
  test.afterAll(async () => {
    performanceMonitor.generateReport();
  });
  
  test('basic parallel test with monitoring', async ({ monitoredPage, workerInfo }) => {
    await monitoredPage.goto('https://playwright.dev');
    
    // Simulate different work based on worker
    const delay = workerInfo.index * 100; // Stagger worker execution
    await monitoredPage.waitForTimeout(delay);
    
    await expect(monitoredPage.locator('h1')).toBeVisible();
    
    console.log(`Worker ${workerInfo.index}: Test completed successfully`);
  });
  
  test('resource-intensive parallel test', async ({ monitoredPage, workerInfo }) => {
    await monitoredPage.goto('https://playwright.dev');
    
    // Simulate resource-intensive operations
    for (let i = 0; i < 5; i++) {
      await monitoredPage.locator('a').first().click();
      await monitoredPage.goBack();
      await monitoredPage.waitForLoadState('networkidle');
    }
    
    console.log(`Worker ${workerInfo.index}: Resource-intensive test completed`);
  });
  
  test('worker-specific data test', async ({ monitoredPage, workerInfo }) => {
    // Use worker-specific test data to avoid conflicts
    const uniqueId = `test-${workerInfo.index}-${Date.now()}`;
    
    await monitoredPage.goto('https://playwright.dev');
    await monitoredPage.evaluate((id: string) => {
      localStorage.setItem('testId', id);
    }, uniqueId);
    
    const storedId = await monitoredPage.evaluate(() => localStorage.getItem('testId'));
    expect(storedId).toBe(uniqueId);
    
    console.log(`Worker ${workerInfo.index}: Worker-specific test with ID ${uniqueId}`);
  });
});

// ================================
// 6. CONFIGURATION EXPORT
// ================================

/**
 * Export appropriate configuration based on environment
 */
function getConfig() {
  const environment = process.env.NODE_ENV || 'development';
  
  switch (environment) {
    case 'development':
    case 'dev':
      console.log('🔧 Using development configuration');
      return developmentConfig;
      
    case 'ci':
    case 'continuous-integration':
      console.log('🏗️ Using CI configuration');
      return ciConfig;
      
    case 'enterprise':
    case 'production':
      console.log('🏢 Using enterprise configuration');
      return enterpriseConfig;
      
    default:
      console.log('🔧 Using default development configuration');
      return developmentConfig;
  }
}

// Export the appropriate configuration
export default getConfig();

// Export individual configurations for testing
export {
  developmentConfig,
  ciConfig,
  enterpriseConfig,
  SystemResourceAnalyzer,
  PerformanceMonitor,
  test,
  expect,
};