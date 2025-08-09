# Running Tests on Different Browsers and Operating Systems

## Learning Objectives

By the end of this lesson, you will be able to:

- **Configure Multi-Browser Testing**: Set up Playwright to run tests across Chromium, Firefox, and WebKit engines with optimized configurations
- **Implement Cross-Platform Strategies**: Design test suites that execute reliably across Windows, macOS, and Linux environments
- **Master Matrix Testing**: Create sophisticated CI/CD matrix configurations for comprehensive browser and OS coverage
- **Optimize Performance**: Balance test coverage with execution time and resource usage across different environments
- **Handle Browser-Specific Issues**: Identify, debug, and resolve compatibility issues unique to different browser engines

## Introduction

Cross-browser and cross-platform testing is essential for ensuring your application works consistently across the diverse environments your users will encounter. Modern web applications must function reliably whether accessed through Chrome on Windows, Safari on macOS, or Firefox on Linux. This lesson provides the comprehensive knowledge and practical skills needed to implement professional-grade multi-browser testing strategies in CI/CD environments.

### Why Multi-Browser Testing Matters

- **User Diversity**: Real users access applications through various browsers and operating systems
- **Engine Differences**: Chromium, Gecko, and WebKit engines handle JavaScript, CSS, and DOM differently
- **Performance Variations**: Applications may perform differently across browser engines
- **Compliance Requirements**: Enterprise applications often require specific browser support
- **Risk Mitigation**: Prevents costly production issues from browser-specific bugs

### Business Impact

Professional multi-browser testing strategies:
- **Reduce Production Issues**: Catch browser-specific bugs before they reach users
- **Improve User Experience**: Ensure consistent functionality across all target platforms
- **Meet Compliance Standards**: Satisfy regulatory requirements for browser compatibility
- **Optimize Performance**: Identify and resolve performance bottlenecks across browsers
- **Support Business Growth**: Enable expansion into markets with different browser preferences

## 1. Cross-Browser Testing Fundamentals

### Understanding Browser Engines

Modern browsers are built on different rendering engines, each with unique characteristics:

#### Chromium Engine (Blink)
- **Used by**: Chrome, Edge, Opera, Brave
- **Market Share**: ~65% globally
- **Characteristics**: 
  - Fast JavaScript execution (V8 engine)
  - Aggressive caching strategies
  - Strong developer tools support
  - Regular updates and feature additions

#### Gecko Engine
- **Used by**: Firefox
- **Market Share**: ~10% globally
- **Characteristics**:
  - Privacy-focused architecture
  - Different CSS rendering approach
  - SpiderMonkey JavaScript engine
  - Strong standards compliance

#### WebKit Engine
- **Used by**: Safari
- **Market Share**: ~20% globally (higher on mobile)
- **Characteristics**:
  - Optimized for Apple devices
  - Conservative feature adoption
  - JavaScriptCore engine
  - Tight integration with iOS/macOS

### Playwright Browser Support

Playwright provides excellent cross-browser support through dedicated browser engines:

```typescript
// playwright.config.ts - Multi-browser configuration
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Configure different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Global test configuration
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    // Global settings for all browsers
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

### Browser-Specific Configuration

Each browser engine requires specific optimizations:

```typescript
// configs/browser-configs.ts
import { devices, PlaywrightTestConfig } from '@playwright/test';

// Chromium-specific configuration
export const chromiumConfig = {
  name: 'chromium',
  use: {
    ...devices['Desktop Chrome'],
    // Chromium-specific settings
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
    },
    // Enhanced error handling for Chromium
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },
};

// Firefox-specific configuration
export const firefoxConfig = {
  name: 'firefox',
  use: {
    ...devices['Desktop Firefox'],
    // Firefox-specific settings
    launchOptions: {
      firefoxUserPrefs: {
        'media.navigator.streams.fake': true,
        'media.navigator.permission.disabled': true,
        'permissions.default.microphone': 1,
        'permissions.default.camera': 1,
      },
    },
    // Firefox tends to be slower
    actionTimeout: 45000,
    navigationTimeout: 45000,
  },
};

// WebKit-specific configuration
export const webkitConfig = {
  name: 'webkit',
  use: {
    ...devices['Desktop Safari'],
    // WebKit-specific settings
    launchOptions: {
      // WebKit requires specific permissions handling
    },
    // WebKit-specific timeouts
    actionTimeout: 40000,
    navigationTimeout: 40000,
    // WebKit-specific locale settings
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },
};
```

### Performance Considerations by Browser

Different browsers have varying performance characteristics:

```typescript
// utils/browser-performance.ts
export class BrowserPerformanceManager {
  private performanceMetrics: Map<string, any> = new Map();

  async measureBrowserPerformance(page: Page, browserName: string) {
    // Start performance measurement
    await page.evaluate(() => performance.mark('test-start'));

    // Execute test actions
    await this.runTestActions(page);

    // End performance measurement
    await page.evaluate(() => performance.mark('test-end'));

    // Collect metrics
    const metrics = await page.evaluate(() => {
      performance.measure('test-duration', 'test-start', 'test-end');
      const measure = performance.getEntriesByName('test-duration')[0];
      
      return {
        duration: measure.duration,
        memory: (performance as any).memory ? {
          usedJSMemory: (performance as any).memory.usedJSMemory,
          totalJSMemory: (performance as any).memory.totalJSMemory,
        } : null,
        timing: performance.timing,
      };
    });

    this.performanceMetrics.set(browserName, metrics);
    return metrics;
  }

  private async runTestActions(page: Page) {
    // Standardized test actions for performance comparison
    await page.goto('/complex-page');
    await page.waitForLoadState('networkidle');
    
    // Simulate user interactions
    await page.click('[data-testid="interactive-element"]');
    await page.fill('[data-testid="form-input"]', 'performance test data');
    await page.selectOption('[data-testid="dropdown"]', 'option-1');
    
    // Wait for dynamic content
    await page.waitForSelector('[data-testid="dynamic-content"]');
  }

  generatePerformanceReport(): string {
    let report = '# Browser Performance Comparison\n\n';
    
    for (const [browser, metrics] of this.performanceMetrics) {
      report += `## ${browser}\n`;
      report += `- Duration: ${metrics.duration.toFixed(2)}ms\n`;
      
      if (metrics.memory) {
        const memoryMB = (metrics.memory.usedJSMemory / 1024 / 1024).toFixed(2);
        report += `- Memory Usage: ${memoryMB}MB\n`;
      }
      
      report += `- Load Time: ${metrics.timing.loadEventEnd - metrics.timing.navigationStart}ms\n\n`;
    }
    
    return report;
  }
}
```

## 2. Cross-Platform Testing Implementation

### Operating System Considerations

Each operating system presents unique challenges for web application testing:

#### Windows-Specific Considerations
- **File Path Handling**: Backslashes vs forward slashes
- **Font Rendering**: ClearType and font smoothing differences
- **Browser Behavior**: Edge integration and Windows-specific features
- **Performance**: Different memory management and resource allocation

#### macOS-Specific Considerations
- **Safari Restrictions**: Stricter security policies and feature limitations
- **Retina Display**: High-DPI rendering and image scaling
- **System Integration**: macOS-specific notifications and permissions
- **Performance**: Metal graphics acceleration and optimized resource usage

#### Linux-Specific Considerations
- **Display Servers**: X11 vs Wayland compatibility
- **Font Systems**: Fontconfig and rendering differences
- **Package Management**: Distribution-specific browser installations
- **Permissions**: SELinux and AppArmor security contexts

### Cross-Platform Configuration Strategy

```typescript
// configs/platform-configs.ts
import { PlaywrightTestConfig } from '@playwright/test';
import * as os from 'os';

export function getPlatformConfig(): Partial<PlaywrightTestConfig> {
  const platform = os.platform();
  
  switch (platform) {
    case 'win32':
      return {
        use: {
          // Windows-specific settings
          launchOptions: {
            args: ['--disable-web-security', '--allow-running-insecure-content'],
          },
        },
        workers: process.env.CI ? 2 : 4, // Windows can handle more workers
        timeout: 30000,
      };
      
    case 'darwin':
      return {
        use: {
          // macOS-specific settings
          launchOptions: {
            args: ['--disable-dev-shm-usage'],
          },
        },
        workers: process.env.CI ? 1 : 3, // macOS resource optimization
        timeout: 40000, // macOS sometimes needs more time
      };
      
    case 'linux':
      return {
        use: {
          // Linux-specific settings
          launchOptions: {
            args: [
              '--no-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu',
              '--disable-setuid-sandbox',
            ],
          },
        },
        workers: process.env.CI ? 1 : 2, // Conservative for CI environments
        timeout: 35000,
      };
      
    default:
      return {
        timeout: 30000,
        workers: 1,
      };
  }
}

// Environment detection utility
export class PlatformUtils {
  static isWindows(): boolean {
    return os.platform() === 'win32';
  }
  
  static isMacOS(): boolean {
    return os.platform() === 'darwin';
  }
  
  static isLinux(): boolean {
    return os.platform() === 'linux';
  }
  
  static getDisplayDensity(): number {
    // Platform-specific display density detection
    if (this.isMacOS()) {
      // macOS Retina detection logic
      return 2;
    } else if (this.isWindows()) {
      // Windows high-DPI detection logic
      return 1.25;
    }
    return 1;
  }
  
  static getNormalizedPath(path: string): string {
    // Convert paths to platform-appropriate format
    if (this.isWindows()) {
      return path.replace(/\//g, '\\');
    }
    return path.replace(/\\/g, '/');
  }
}
```

### File System and Path Handling

```typescript
// utils/cross-platform-utils.ts
import * as path from 'path';
import * as fs from 'fs';

export class CrossPlatformFileManager {
  static async createTestDirectory(basePath: string): Promise<string> {
    const testDir = path.join(basePath, 'cross-platform-tests');
    
    try {
      await fs.promises.mkdir(testDir, { recursive: true });
      return testDir;
    } catch (error) {
      throw new Error(`Failed to create test directory: ${error.message}`);
    }
  }
  
  static async writeTestFile(filePath: string, content: string): Promise<void> {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    
    // Write with platform-appropriate line endings
    const normalizedContent = os.platform() === 'win32' 
      ? content.replace(/\n/g, '\r\n')
      : content.replace(/\r\n/g, '\n');
      
    await fs.promises.writeFile(filePath, normalizedContent, 'utf-8');
  }
  
  static getResourcePath(relativePath: string): string {
    // Convert relative paths to absolute platform-specific paths
    return path.resolve(__dirname, '..', 'resources', relativePath);
  }
  
  static async validateFileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }
}
```

## 3. CI/CD Matrix Testing Configuration

### GitHub Actions Matrix Strategy

Matrix testing allows you to run tests across multiple browser and OS combinations efficiently:

```yaml
# .github/workflows/cross-browser-testing.yml
name: Cross-Browser Testing

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        browser: [chromium, firefox, webkit]
        node-version: [18, 20]
        include:
          # Specific combinations for enhanced testing
          - os: ubuntu-latest
            browser: chromium
            node-version: 20
            run-performance-tests: true
          - os: windows-latest
            browser: chromium
            node-version: 20
            run-accessibility-tests: true
          - os: macos-latest
            browser: webkit
            node-version: 20
            run-mobile-tests: true
        exclude:
          # Exclude known incompatible combinations
          - os: ubuntu-latest
            browser: webkit
          - os: windows-latest
            browser: webkit
            
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps ${{ matrix.browser }}
      
    - name: Run tests on ${{ matrix.browser }}
      run: npx playwright test --project=${{ matrix.browser }}
      env:
        CI: true
        BROWSER: ${{ matrix.browser }}
        OS: ${{ matrix.os }}
        
    - name: Run performance tests
      if: matrix.run-performance-tests
      run: npx playwright test --project=${{ matrix.browser }} --grep="@performance"
      
    - name: Run accessibility tests
      if: matrix.run-accessibility-tests
      run: npx playwright test --project=${{ matrix.browser }} --grep="@accessibility"
      
    - name: Run mobile tests
      if: matrix.run-mobile-tests
      run: npx playwright test --project="Mobile Safari"
      
    - name: Upload test results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: test-results-${{ matrix.os }}-${{ matrix.browser }}-node${{ matrix.node-version }}
        path: |
          test-results/
          playwright-report/
        retention-days: 30
        
    - name: Upload performance metrics
      if: matrix.run-performance-tests && always()
      uses: actions/upload-artifact@v4
      with:
        name: performance-metrics-${{ matrix.os }}-${{ matrix.browser }}
        path: performance-metrics/
        retention-days: 7
```

### Advanced Matrix Configuration

```yaml
# .github/workflows/advanced-matrix.yml
name: Advanced Cross-Browser Matrix

on:
  schedule:
    - cron: '0 2 * * 1-5' # Weekdays at 2 AM UTC
  workflow_dispatch:
    inputs:
      browsers:
        description: 'Browsers to test'
        required: true
        default: 'chromium,firefox,webkit'
      os-list:
        description: 'Operating systems to test'
        required: true
        default: 'ubuntu-latest,windows-latest,macos-latest'

jobs:
  generate-matrix:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    steps:
      - name: Generate dynamic matrix
        id: set-matrix
        run: |
          BROWSERS="${{ github.event.inputs.browsers || 'chromium,firefox,webkit' }}"
          OS_LIST="${{ github.event.inputs.os-list || 'ubuntu-latest,windows-latest,macos-latest' }}"
          
          # Generate matrix JSON
          python3 << EOF
          import json
          import os
          
          browsers = os.environ['BROWSERS'].split(',')
          os_list = os.environ['OS_LIST'].split(',')
          
          matrix = []
          for os_item in os_list:
              for browser in browsers:
                  # Skip webkit on non-macOS
                  if browser == 'webkit' and 'macos' not in os_item:
                      continue
                  matrix.append({
                      'os': os_item,
                      'browser': browser,
                      'node-version': '20'
                  })
          
          print(f"matrix={json.dumps({'include': matrix})}")
          EOF
        env:
          BROWSERS: ${{ github.event.inputs.browsers || 'chromium,firefox,webkit' }}
          OS_LIST: ${{ github.event.inputs.os-list || 'ubuntu-latest,windows-latest,macos-latest' }}

  test:
    needs: generate-matrix
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix: ${{ fromJson(needs.generate-matrix.outputs.matrix) }}
      
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      
    - name: Setup test environment
      uses: ./.github/actions/setup-test-env
      with:
        node-version: ${{ matrix.node-version }}
        browser: ${{ matrix.browser }}
        
    - name: Run cross-browser tests
      run: |
        npx playwright test \
          --project=${{ matrix.browser }} \
          --reporter=github \
          --output-dir=test-results-${{ matrix.os }}-${{ matrix.browser }}
      env:
        PWTEST_SKIP_TEST_OUTPUT: 1
        
    - name: Generate browser-specific report
      if: always()
      run: |
        npx playwright show-report \
          --reporter=json \
          > browser-report-${{ matrix.os }}-${{ matrix.browser }}.json
          
    - name: Upload artifacts
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: results-${{ strategy.job-index }}
        path: |
          test-results-*/
          browser-report-*.json
```

### Resource Optimization Strategies

```typescript
// configs/ci-optimization.ts
export class CIOptimizationManager {
  static getOptimalWorkerCount(browser: string, os: string): number {
    const isCI = process.env.CI === 'true';
    
    if (!isCI) {
      // Local development - use more workers
      return os === 'win32' ? 4 : 3;
    }
    
    // CI environment optimization
    const optimizationMap = {
      'ubuntu-latest': {
        'chromium': 2,
        'firefox': 1,
        'webkit': 1,
      },
      'windows-latest': {
        'chromium': 2,
        'firefox': 2,
        'webkit': 1,
      },
      'macos-latest': {
        'chromium': 1,
        'firefox': 1,
        'webkit': 2, // WebKit optimized on macOS
      },
    };
    
    return optimizationMap[os]?.[browser] || 1;
  }
  
  static getTimeoutConfiguration(browser: string): {
    actionTimeout: number;
    navigationTimeout: number;
    globalTimeout: number;
  } {
    const baseTimeouts = {
      actionTimeout: 30000,
      navigationTimeout: 30000,
      globalTimeout: 300000,
    };
    
    // Browser-specific timeout adjustments
    const browserMultipliers = {
      'chromium': 1.0,
      'firefox': 1.3, // Firefox tends to be slower
      'webkit': 1.2,  // WebKit needs slightly more time
    };
    
    const multiplier = browserMultipliers[browser] || 1.0;
    
    return {
      actionTimeout: baseTimeouts.actionTimeout * multiplier,
      navigationTimeout: baseTimeouts.navigationTimeout * multiplier,
      globalTimeout: baseTimeouts.globalTimeout * multiplier,
    };
  }
  
  static shouldSkipBrowser(browser: string, os: string): boolean {
    // Define browser-OS compatibility rules
    const incompatibleCombinations = [
      { browser: 'webkit', os: 'ubuntu-latest' },
      { browser: 'webkit', os: 'windows-latest' },
    ];
    
    return incompatibleCombinations.some(
      combo => combo.browser === browser && combo.os === os
    );
  }
}
```

## 4. Browser-Specific Debugging and Optimization

### Browser-Specific Debugging Techniques

```typescript
// utils/browser-debugging.ts
export class BrowserDebugManager {
  async debugChromium(page: Page, context: BrowserContext) {
    // Chromium-specific debugging
    await context.addInitScript(() => {
      // Enable additional Chrome DevTools features
      window.__CHROMIUM_DEBUG__ = true;
      
      // Monitor resource loading
      window.addEventListener('beforeunload', () => {
        console.log('Chromium page unloading - resources:', performance.getEntries());
      });
    });
    
    // Enable Chrome DevTools Protocol
    const client = await context.newCDPSession(page);
    await client.send('Runtime.enable');
    await client.send('Network.enable');
    
    // Monitor network requests
    client.on('Network.requestWillBeSent', (params) => {
      console.log(`Chromium network request: ${params.request.url}`);
    });
    
    return client;
  }
  
  async debugFirefox(page: Page, context: BrowserContext) {
    // Firefox-specific debugging
    await context.addInitScript(() => {
      window.__FIREFOX_DEBUG__ = true;
      
      // Monitor Firefox-specific events
      window.addEventListener('mozfullscreenchange', () => {
        console.log('Firefox fullscreen change detected');
      });
    });
    
    // Set Firefox-specific preferences for debugging
    await context.addInitScript(() => {
      if (typeof netscape !== 'undefined') {
        // Firefox-specific debugging code
        console.log('Firefox debugging enabled');
      }
    });
  }
  
  async debugWebKit(page: Page, context: BrowserContext) {
    // WebKit-specific debugging
    await context.addInitScript(() => {
      window.__WEBKIT_DEBUG__ = true;
      
      // Monitor WebKit-specific events
      if (window.safari) {
        console.log('Safari-specific debugging enabled');
      }
      
      // WebKit performance monitoring
      if (window.performance && window.performance.measureUserAgentSpecificMemory) {
        window.performance.measureUserAgentSpecificMemory().then(result => {
          console.log('WebKit memory usage:', result);
        });
      }
    });
  }
  
  async capturePageInfo(page: Page): Promise<BrowserPageInfo> {
    const userAgent = await page.evaluate(() => navigator.userAgent);
    const browserName = this.getBrowserNameFromUserAgent(userAgent);
    
    const pageInfo = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      performance: {
        navigation: performance.navigation.type,
        timing: {
          loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        },
      },
      features: {
        webGL: !!(window as any).WebGLRenderingContext,
        webAssembly: typeof WebAssembly === 'object',
        serviceWorker: 'serviceWorker' in navigator,
        webRTC: !!(window as any).RTCPeerConnection,
      },
    }));
    
    return { ...pageInfo, browserName };
  }
  
  private getBrowserNameFromUserAgent(userAgent: string): string {
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'chromium';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'webkit';
    if (userAgent.includes('Edg')) return 'edge';
    return 'unknown';
  }
}

interface BrowserPageInfo {
  url: string;
  title: string;
  userAgent: string;
  browserName: string;
  viewport: { width: number; height: number };
  performance: {
    navigation: number;
    timing: {
      loadComplete: number;
      domReady: number;
    };
  };
  features: {
    webGL: boolean;
    webAssembly: boolean;
    serviceWorker: boolean;
    webRTC: boolean;
  };
}
```

### Performance Profiling Across Browsers

```typescript
// utils/cross-browser-profiling.ts
export class CrossBrowserProfiler {
  private profiles: Map<string, PerformanceProfile> = new Map();
  
  async profilePageLoad(page: Page, browserName: string, testName: string) {
    // Start profiling
    await page.evaluate(() => {
      performance.mark('profile-start');
      (window as any).__profileData = {
        resourceLoadTimes: [],
        scriptExecutionTimes: [],
        renderTimes: [],
      };
    });
    
    // Navigate to page
    const response = await page.goto(process.env.BASE_URL || 'http://localhost:3000');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Collect performance data
    const performanceData = await this.collectPerformanceMetrics(page, browserName);
    
    // Store profile
    this.profiles.set(`${browserName}-${testName}`, performanceData);
    
    return performanceData;
  }
  
  private async collectPerformanceMetrics(page: Page, browserName: string): Promise<PerformanceProfile> {
    const metrics = await page.evaluate((browser) => {
      performance.mark('profile-end');
      performance.measure('total-profile-time', 'profile-start', 'profile-end');
      
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource');
      const measures = performance.getEntriesByName('total-profile-time');
      
      return {
        browser,
        navigation: {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: (performance as any).getEntriesByType('paint')
            .find((entry: any) => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: (performance as any).getEntriesByType('paint')
            .find((entry: any) => entry.name === 'first-contentful-paint')?.startTime || 0,
        },
        resources: resources.map(resource => ({
          name: resource.name,
          duration: resource.duration,
          size: (resource as any).transferSize || 0,
          type: (resource as any).initiatorType || 'unknown',
        })),
        memory: (performance as any).memory ? {
          usedJSMemory: (performance as any).memory.usedJSMemory,
          totalJSMemory: (performance as any).memory.totalJSMemory,
          jsMemoryLimit: (performance as any).memory.jsMemoryLimit,
        } : null,
        totalTime: measures[0]?.duration || 0,
      };
    }, browserName);
    
    return metrics;
  }
  
  generateComparisonReport(): string {
    let report = '# Cross-Browser Performance Comparison\n\n';
    
    // Group profiles by test name
    const testGroups = new Map<string, PerformanceProfile[]>();
    
    for (const [key, profile] of this.profiles) {
      const testName = key.split('-').slice(1).join('-');
      if (!testGroups.has(testName)) {
        testGroups.set(testName, []);
      }
      testGroups.get(testName)!.push(profile);
    }
    
    // Generate comparison for each test
    for (const [testName, profiles] of testGroups) {
      report += `## ${testName}\n\n`;
      
      // Create comparison table
      report += '| Browser | Load Time | First Paint | Memory Usage | Resource Count |\n';
      report += '|---------|-----------|-------------|---------------|-----------------|\n';
      
      for (const profile of profiles) {
        const loadTime = profile.navigation.loadComplete.toFixed(2);
        const firstPaint = profile.navigation.firstPaint.toFixed(2);
        const memoryMB = profile.memory 
          ? (profile.memory.usedJSMemory / 1024 / 1024).toFixed(2) + 'MB'
          : 'N/A';
        const resourceCount = profile.resources.length;
        
        report += `| ${profile.browser} | ${loadTime}ms | ${firstPaint}ms | ${memoryMB} | ${resourceCount} |\n`;
      }
      
      report += '\n';
      
      // Add performance insights
      report += this.generatePerformanceInsights(testName, profiles);
      report += '\n';
    }
    
    return report;
  }
  
  private generatePerformanceInsights(testName: string, profiles: PerformanceProfile[]): string {
    let insights = `### Performance Insights for ${testName}\n\n`;
    
    // Find fastest and slowest browsers
    const sortedByLoadTime = profiles.sort((a, b) => a.navigation.loadComplete - b.navigation.loadComplete);
    const fastest = sortedByLoadTime[0];
    const slowest = sortedByLoadTime[sortedByLoadTime.length - 1];
    
    insights += `- **Fastest Browser**: ${fastest.browser} (${fastest.navigation.loadComplete.toFixed(2)}ms)\n`;
    insights += `- **Slowest Browser**: ${slowest.browser} (${slowest.navigation.loadComplete.toFixed(2)}ms)\n`;
    
    // Memory usage comparison
    const memoryProfiles = profiles.filter(p => p.memory);
    if (memoryProfiles.length > 0) {
      const sortedByMemory = memoryProfiles.sort((a, b) => a.memory!.usedJSMemory - b.memory!.usedJSMemory);
      const leastMemory = sortedByMemory[0];
      const mostMemory = sortedByMemory[sortedByMemory.length - 1];
      
      insights += `- **Lowest Memory Usage**: ${leastMemory.browser} (${(leastMemory.memory!.usedJSMemory / 1024 / 1024).toFixed(2)}MB)\n`;
      insights += `- **Highest Memory Usage**: ${mostMemory.browser} (${(mostMemory.memory!.usedJSMemory / 1024 / 1024).toFixed(2)}MB)\n`;
    }
    
    // Resource loading insights
    const avgResourceCounts = profiles.map(p => p.resources.length);
    const avgResourceCount = avgResourceCounts.reduce((a, b) => a + b, 0) / avgResourceCounts.length;
    
    insights += `- **Average Resource Count**: ${avgResourceCount.toFixed(0)}\n`;
    
    return insights;
  }
}

interface PerformanceProfile {
  browser: string;
  navigation: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
  resources: Array<{
    name: string;
    duration: number;
    size: number;
    type: string;
  }>;
  memory: {
    usedJSMemory: number;
    totalJSMemory: number;
    jsMemoryLimit: number;
  } | null;
  totalTime: number;
}
```

## Summary

Cross-browser and cross-platform testing is essential for ensuring your applications work reliably across diverse user environments. This lesson covered:

### Key Takeaways

1. **Browser Engine Understanding**: Each engine (Chromium, Gecko, WebKit) has unique characteristics requiring specific optimization strategies

2. **Platform-Specific Configuration**: Different operating systems require tailored approaches for file handling, permissions, and resource management

3. **CI/CD Matrix Implementation**: Advanced matrix configurations enable comprehensive testing while optimizing resource usage and execution time

4. **Performance Optimization**: Browser-specific performance profiling and optimization techniques ensure consistent user experience

5. **Debugging Strategies**: Specialized debugging approaches for each browser engine help identify and resolve compatibility issues

### Professional Applications

- **Enterprise Testing**: Implement comprehensive cross-browser strategies for large-scale applications
- **Performance Monitoring**: Establish continuous performance benchmarking across browser combinations
- **Risk Management**: Prioritize browser/OS combinations based on user analytics and business requirements
- **Cost Optimization**: Balance comprehensive coverage with CI/CD resource constraints
- **Quality Assurance**: Ensure consistent functionality and performance across all target environments

### Next Steps

In the next lesson, we'll explore parallel execution and sharding strategies to optimize test suite performance while maintaining comprehensive cross-browser coverage. You'll learn to implement advanced parallelization techniques that dramatically reduce execution time without compromising test reliability.

The skills you've developed in this lesson form the foundation for professional-grade test automation strategies used in enterprise environments, preparing you for senior QA automation engineer roles where cross-browser expertise is essential for success.