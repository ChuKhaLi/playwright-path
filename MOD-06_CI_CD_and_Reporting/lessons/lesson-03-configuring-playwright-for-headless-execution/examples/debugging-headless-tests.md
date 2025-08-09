# Debugging Headless Tests: Complete Guide

This guide provides comprehensive strategies for debugging Playwright tests running in headless mode, where traditional visual debugging isn't available.

## 1. Enhanced Logging Setup

### Console and Error Capture

```typescript
// utils/headless-logger.ts
export class HeadlessLogger {
  private static logLevel = process.env.LOG_LEVEL || 'info';
  
  static async setupPageLogging(page: Page): Promise<void> {
    // Capture all console messages
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      const location = msg.location();
      
      // Format log message with context
      const logMessage = `[BROWSER-${type.toUpperCase()}] ${text}`;
      if (location.url) {
        console.log(`${logMessage} (${location.url}:${location.lineNumber})`);
      } else {
        console.log(logMessage);
      }
    });
    
    // Capture JavaScript errors
    page.on('pageerror', (error) => {
      console.error('[PAGE-ERROR]', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Capture dialog events
    page.on('dialog', (dialog) => {
      console.log('[DIALOG]', {
        type: dialog.type(),
        message: dialog.message(),
        defaultValue: dialog.defaultValue(),
      });
      dialog.accept(); // Auto-accept dialogs in headless mode
    });
    
    // Capture request failures
    page.on('requestfailed', (request) => {
      const failure = request.failure();
      console.error('[REQUEST-FAILED]', {
        url: request.url(),
        method: request.method(),
        errorText: failure?.errorText,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Capture response errors
    page.on('response', (response) => {
      if (response.status() >= 400) {
        console.error('[HTTP-ERROR]', {
          status: response.status(),
          statusText: response.statusText(),
          url: response.url(),
          headers: response.headers(),
        });
      }
    });
    
    // Capture frame navigation
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        console.log('[NAVIGATION]', {
          url: frame.url(),
          timestamp: new Date().toISOString(),
        });
      }
    });
  }
  
  // Custom logging with levels
  static log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    const currentLevel = levels[this.logLevel as keyof typeof levels] || 1;
    
    if (levels[level] >= currentLevel) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      
      if (data) {
        console.log(logMessage, JSON.stringify(data, null, 2));
      } else {
        console.log(logMessage);
      }
    }
  }
}
```

### Network Activity Monitoring

```typescript
// utils/network-monitor.ts
export class NetworkMonitor {
  private requests: Array<{
    url: string;
    method: string;
    timestamp: number;
    status?: number;
    duration?: number;
  }> = [];
  
  async startMonitoring(page: Page): Promise<void> {
    // Track request start
    page.on('request', (request) => {
      this.requests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now(),
      });
      
      console.log('[REQUEST]', {
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
      });
    });
    
    // Track request completion
    page.on('response', (response) => {
      const request = this.requests.find(r => 
        r.url === response.url() && !r.status
      );
      
      if (request) {
        request.status = response.status();
        request.duration = Date.now() - request.timestamp;
      }
      
      console.log('[RESPONSE]', {
        status: response.status(),
        url: response.url(),
        duration: request?.duration || 'unknown',
        size: response.headers()['content-length'] || 'unknown',
      });
    });
  }
  
  getNetworkReport(): {
    totalRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    slowRequests: Array<{ url: string; duration: number }>;
  } {
    const completedRequests = this.requests.filter(r => r.duration);
    const failedRequests = this.requests.filter(r => r.status && r.status >= 400);
    const slowRequests = completedRequests
      .filter(r => r.duration! > 2000)
      .map(r => ({ url: r.url, duration: r.duration! }))
      .sort((a, b) => b.duration - a.duration);
    
    const averageResponseTime = completedRequests.length > 0
      ? completedRequests.reduce((sum, r) => sum + r.duration!, 0) / completedRequests.length
      : 0;
    
    return {
      totalRequests: this.requests.length,
      failedRequests: failedRequests.length,
      averageResponseTime: Math.round(averageResponseTime),
      slowRequests: slowRequests.slice(0, 5), // Top 5 slowest
    };
  }
}
```

## 2. Screenshot and Visual Debugging

### Smart Screenshot Strategy

```typescript
// utils/screenshot-debugger.ts
export class ScreenshotDebugger {
  private static screenshotCounter = 0;
  
  static async takeDebugScreenshot(
    page: Page,
    name: string,
    options: {
      fullPage?: boolean;
      highlight?: string[]; // CSS selectors to highlight
      annotate?: { selector: string; text: string }[];
      hideElements?: string[]; // Elements to hide before screenshot
    } = {}
  ): Promise<string> {
    
    const timestamp = Date.now();
    const counter = ++this.screenshotCounter;
    const filename = `debug-${counter}-${name}-${timestamp}.png`;
    const path = `debug-screenshots/${filename}`;
    
    try {
      // Hide specified elements
      if (options.hideElements) {
        await page.addStyleTag({
          content: options.hideElements.map(selector => 
            `${selector} { visibility: hidden !important; }`
          ).join('\n')
        });
      }
      
      // Highlight specified elements
      if (options.highlight) {
        await page.addStyleTag({
          content: options.highlight.map(selector => 
            `${selector} { outline: 3px solid red !important; background-color: rgba(255, 0, 0, 0.1) !important; }`
          ).join('\n')
        });
      }
      
      // Add annotations
      if (options.annotate) {
        for (const annotation of options.annotate) {
          await page.locator(annotation.selector).first().evaluate((element, text) => {
            const label = document.createElement('div');
            label.textContent = text;
            label.style.cssText = `
              position: absolute;
              top: -25px;
              left: 0;
              background: red;
              color: white;
              padding: 2px 6px;
              font-size: 12px;
              font-weight: bold;
              z-index: 9999;
              border-radius: 3px;
            `;
            
            element.style.position = 'relative';
            element.appendChild(label);
          }, annotation.text);
        }
      }
      
      // Take screenshot
      await page.screenshot({
        path,
        fullPage: options.fullPage || true,
        animations: 'disabled',
        caret: 'hide',
      });
      
      console.log(`[DEBUG-SCREENSHOT] Saved: ${filename}`);
      return path;
      
    } catch (error) {
      console.error('[DEBUG-SCREENSHOT] Failed to take screenshot:', error);
      return '';
    }
  }
  
  static async takeElementScreenshot(
    page: Page,
    selector: string,
    name: string
  ): Promise<string> {
    const timestamp = Date.now();
    const filename = `element-${name}-${timestamp}.png`;
    const path = `debug-screenshots/${filename}`;
    
    try {
      const element = page.locator(selector).first();
      await element.screenshot({
        path,
        animations: 'disabled',
      });
      
      console.log(`[DEBUG-ELEMENT] Saved element screenshot: ${filename}`);
      return path;
    } catch (error) {
      console.error('[DEBUG-ELEMENT] Failed to take element screenshot:', error);
      return '';
    }
  }
  
  static async takeComparisonScreenshots(
    page: Page,
    name: string,
    actions: Array<{ name: string; action: () => Promise<void> }>
  ): Promise<string[]> {
    const screenshots: string[] = [];
    
    // Initial screenshot
    screenshots.push(await this.takeDebugScreenshot(page, `${name}-initial`));
    
    // Screenshots after each action
    for (const { name: actionName, action } of actions) {
      await action();
      screenshots.push(await this.takeDebugScreenshot(page, `${name}-after-${actionName}`));
    }
    
    return screenshots;
  }
}
```

## 3. Performance Profiling in Headless Mode

### Resource Usage Monitor

```powershell
# PowerShell script for monitoring Playwright resource usage
# save as: monitor-playwright-resources.ps1

param(
    [int]$IntervalSeconds = 5,
    [string]$OutputFile = "playwright-resource-usage.csv"
)

Write-Host "Monitoring Playwright resource usage..."
Write-Host "Press Ctrl+C to stop monitoring"

# Initialize CSV file
"timestamp,cpu_percent,memory_mb,browser_processes,test_processes" | Out-File $OutputFile -Encoding UTF8

try {
    while ($true) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        
        # Get Playwright/Node processes
        $playwrightProcesses = Get-Process | Where-Object { 
            $_.ProcessName -match "node|chrome|firefox|webkit" -and 
            $_.CommandLine -match "playwright|test" 
        }
        
        if ($playwrightProcesses) {
            $totalCpu = ($playwrightProcesses | Measure-Object CPU -Sum).Sum
            $totalMemory = ($playwrightProcesses | Measure-Object WorkingSet64 -Sum).Sum / 1MB
            $browserProcesses = ($playwrightProcesses | Where-Object { $_.ProcessName -match "chrome|firefox|webkit" }).Count
            $testProcesses = ($playwrightProcesses | Where-Object { $_.ProcessName -match "node" }).Count
            
            $logEntry = "$timestamp,$([math]::Round($totalCpu, 2)),$([math]::Round($totalMemory, 2)),$browserProcesses,$testProcesses"
            $logEntry | Out-File $OutputFile -Append -Encoding UTF8
            
            Write-Host "[$timestamp] CPU: $([math]::Round($totalCpu, 2))% | Memory: $([math]::Round($totalMemory, 2))MB | Browsers: $browserProcesses | Tests: $testProcesses"
        } else {
            Write-Host "[$timestamp] No Playwright processes found"
        }
        
        Start-Sleep $IntervalSeconds
    }
} catch {
    Write-Host "Monitoring stopped"
}

Write-Host "Resource usage log saved to: $OutputFile"
```

### Memory Leak Detection

```typescript
// utils/memory-monitor.ts
export class MemoryMonitor {
  private static measurements: Array<{
    timestamp: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  }> = [];
  
  static startMonitoring(): void {
    const interval = setInterval(() => {
      const memUsage = process.memoryUsage();
      
      this.measurements.push({
        timestamp: Date.now(),
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss,
      });
      
      // Keep only last 100 measurements
      if (this.measurements.length > 100) {
        this.measurements = this.measurements.slice(-100);
      }
    }, 1000);
    
    // Clear interval on process exit
    process.on('exit', () => clearInterval(interval));
  }
  
  static getMemoryReport(): {
    current: ReturnType<typeof process.memoryUsage>;
    trend: 'increasing' | 'stable' | 'decreasing';
    potentialLeak: boolean;
  } {
    const current = process.memoryUsage();
    
    if (this.measurements.length < 10) {
      return {
        current,
        trend: 'stable',
        potentialLeak: false,
      };
    }
    
    const recent = this.measurements.slice(-10);
    const older = this.measurements.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, m) => sum + m.heapUsed, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.heapUsed, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    const percentChange = (difference / olderAvg) * 100;
    
    let trend: 'increasing' | 'stable' | 'decreasing';
    if (percentChange > 5) {
      trend = 'increasing';
    } else if (percentChange < -5) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }
    
    // Detect potential memory leak (consistent increase over time)
    const potentialLeak = trend === 'increasing' && percentChange > 20;
    
    return {
      current,
      trend,
      potentialLeak,
    };
  }
  
  static logMemoryUsage(): void {
    const report = this.getMemoryReport();
    
    console.log('[MEMORY-USAGE]', {
      heapUsed: `${Math.round(report.current.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(report.current.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(report.current.rss / 1024 / 1024)}MB`,
      trend: report.trend,
      potentialLeak: report.potentialLeak,
    });
    
    if (report.potentialLeak) {
      console.warn('[MEMORY-WARNING] Potential memory leak detected!');
    }
  }
}
```

## 4. Advanced Debugging Techniques

### Page State Inspector

```typescript
// utils/page-inspector.ts
export class PageInspector {
  static async inspectPageState(page: Page, label: string): Promise<void> {
    const state = {
      url: page.url(),
      title: await page.title().catch(() => 'Unable to get title'),
      viewport: page.viewportSize(),
      readyState: await page.evaluate(() => document.readyState),
      activeElement: await page.evaluate(() => {
        const active = document.activeElement;
        return active ? {
          tagName: active.tagName,
          id: active.id,
          className: active.className,
          textContent: active.textContent?.slice(0, 50),
        } : null;
      }),
      visibleElements: await this.getVisibleElementsCount(page),
      errors: await this.getJavaScriptErrors(page),
      timestamp: new Date().toISOString(),
    };
    
    console.log(`[PAGE-STATE ${label}]`, JSON.stringify(state, null, 2));
  }
  
  private static async getVisibleElementsCount(page: Page): Promise<{
    total: number;
    visible: number;
    hidden: number;
  }> {
    return await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      let visible = 0;
      let hidden = 0;
      
      allElements.forEach((element) => {
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') {
          hidden++;
        } else {
          visible++;
        }
      });
      
      return {
        total: allElements.length,
        visible,
        hidden,
      };
    });
  }
  
  private static async getJavaScriptErrors(page: Page): Promise<string[]> {
    return await page.evaluate(() => {
      // @ts-ignore - accessing global error log
      return window.__playwrightErrors || [];
    });
  }
  
  static async inspectElement(page: Page, selector: string): Promise<void> {
    try {
      const element = page.locator(selector).first();
      
      const info = await element.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        
        return {
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          textContent: el.textContent?.slice(0, 100),
          attributes: Array.from(el.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {} as Record<string, string>),
          boundingBox: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
          styles: {
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity,
            position: computedStyle.position,
            zIndex: computedStyle.zIndex,
          },
          isVisible: rect.width > 0 && rect.height > 0 && 
                    computedStyle.visibility !== 'hidden' && 
                    computedStyle.display !== 'none',
        };
      });
      
      console.log(`[ELEMENT-INSPECT ${selector}]`, JSON.stringify(info, null, 2));
    } catch (error) {
      console.error(`[ELEMENT-INSPECT ${selector}] Failed:`, error);
    }
  }
}
```

### Test Debugging Wrapper

```typescript
// utils/debug-test-wrapper.ts
export class DebugTestWrapper {
  static async runWithDebugging<T>(
    testName: string,
    testFunction: (helpers: {
      page: Page;
      takeScreenshot: (name: string) => Promise<string>;
      inspectPage: (label: string) => Promise<void>;
      inspectElement: (selector: string) => Promise<void>;
      logNetwork: () => void;
    }) => Promise<T>
  ): Promise<T> {
    
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    
    let context: BrowserContext | null = null;
    let result: T;
    
    try {
      // Create isolated context
      context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        extraHTTPHeaders: {
          'X-Test-Name': testName,
        },
      });
      
      // Start tracing
      await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
      });
      
      const page = await context.newPage();
      
      // Set up logging
      await HeadlessLogger.setupPageLogging(page);
      
      // Set up network monitoring
      const networkMonitor = new NetworkMonitor();
      await networkMonitor.startMonitoring(page);
      
      // Start memory monitoring
      MemoryMonitor.startMonitoring();
      
      // Create helper functions
      const helpers = {
        page,
        takeScreenshot: (name: string) => ScreenshotDebugger.takeDebugScreenshot(page, name),
        inspectPage: (label: string) => PageInspector.inspectPageState(page, label),
        inspectElement: (selector: string) => PageInspector.inspectElement(page, selector),
        logNetwork: () => {
          const report = networkMonitor.getNetworkReport();
          console.log('[NETWORK-REPORT]', JSON.stringify(report, null, 2));
        },
      };
      
      // Run the test
      console.log(`[DEBUG-TEST] Starting: ${testName}`);
      result = await testFunction(helpers);
      console.log(`[DEBUG-TEST] Completed: ${testName}`);
      
      return result;
      
    } catch (error) {
      console.error(`[DEBUG-TEST] Failed: ${testName}`, error);
      
      // Take failure screenshot
      if (context) {
        const pages = context.pages();
        if (pages.length > 0) {
          await ScreenshotDebugger.takeDebugScreenshot(pages[0], `${testName}-FAILURE`);
        }
      }
      
      throw error;
    } finally {
      // Save debugging artifacts
      if (context) {
        const timestamp = Date.now();
        await context.tracing.stop({
          path: `debug-traces/${testName}-${timestamp}.zip`,
        });
        
        console.log(`[DEBUG] Trace saved: debug-traces/${testName}-${timestamp}.zip`);
        console.log(`[DEBUG] View with: npx playwright show-trace debug-traces/${testName}-${timestamp}.zip`);
        
        await context.close();
      }
      
      // Log final memory usage
      MemoryMonitor.logMemoryUsage();
      
      await browser.close();
    }
  }
}
```

## 5. Common Debugging Scenarios

### Scenario 1: Element Not Found

```typescript
// Debug helper for element visibility issues
export async function debugElementNotFound(page: Page, selector: string): Promise<void> {
  console.log(`[DEBUG] Investigating selector: ${selector}`);
  
  // Check if element exists in DOM
  const elementExists = await page.locator(selector).count();
  console.log(`[DEBUG] Elements matching selector: ${elementExists}`);
  
  if (elementExists === 0) {
    // Take screenshot to see current page state
    await ScreenshotDebugger.takeDebugScreenshot(page, 'element-not-found');
    
    // Log page state
    await PageInspector.inspectPageState(page, 'element-search');
    
    // Check for similar selectors
    const similarSelectors = await page.evaluate((targetSelector) => {
      const parts = targetSelector.split(/[\s>+~]/);
      const lastPart = parts[parts.length - 1];
      
      // Look for elements with similar classes or IDs
      const allElements = document.querySelectorAll('*');
      const similar: string[] = [];
      
      allElements.forEach((el) => {
        if (el.className && el.className.includes(lastPart.replace(/[.#]/, ''))) {
          similar.push(`${el.tagName.toLowerCase()}.${el.className}`);
        }
        if (el.id && el.id.includes(lastPart.replace(/[.#]/, ''))) {
          similar.push(`${el.tagName.toLowerCase()}#${el.id}`);
        }
      });
      
      return [...new Set(similar)].slice(0, 5);
    }, selector);
    
    console.log('[DEBUG] Similar selectors found:', similar);
  } else {
    // Element exists, check visibility
    for (let i = 0; i < elementExists; i++) {
      await PageInspector.inspectElement(page, `${selector}:nth-of-type(${i + 1})`);
    }
  }
}
```

### Scenario 2: Slow Test Performance

```typescript
// Performance debugging utility
export async function debugSlowTest(page: Page, testSteps: Array<{
  name: string;
  action: () => Promise<void>;
}>): Promise<void> {
  
  console.log('[PERF-DEBUG] Starting performance analysis');
  
  const startTime = Date.now();
  const stepTimes: Array<{ name: string; duration: number }> = [];
  
  for (const step of testSteps) {
    const stepStart = Date.now();
    
    console.log(`[PERF-DEBUG] Starting step: ${step.name}`);
    await step.action();
    
    const stepDuration = Date.now() - stepStart;
    stepTimes.push({ name: step.name, duration: stepDuration });
    
    console.log(`[PERF-DEBUG] Step completed: ${step.name} (${stepDuration}ms)`);
    
    // Take screenshot after slow steps
    if (stepDuration > 5000) {
      await ScreenshotDebugger.takeDebugScreenshot(page, `slow-step-${step.name}`);
    }
    
    // Log memory usage after each step
    MemoryMonitor.logMemoryUsage();
  }
  
  const totalTime = Date.now() - startTime;
  
  console.log('[PERF-DEBUG] Performance summary:', {
    totalTime: `${totalTime}ms`,
    steps: stepTimes.sort((a, b) => b.duration - a.duration),
    averageStepTime: `${Math.round(stepTimes.reduce((sum, s) => sum + s.duration, 0) / stepTimes.length)}ms`,
  });
}
```

## 6. Best Practices Summary

### Essential Debugging Checklist

- **Enable comprehensive logging** for all browser events
- **Take strategic screenshots** at key test points
- **Monitor network activity** to identify slow or failed requests
- **Use traces** for detailed step-by-step analysis
- **Profile performance** to identify bottlenecks
- **Monitor memory usage** to detect leaks
- **Maintain test isolation** to prevent interference
- **Clean up resources** properly after tests

### Windows-Specific Debugging Commands

```powershell
# View Playwright processes
Get-Process | Where-Object { $_.ProcessName -match "node|chrome|firefox|webkit" }

# Monitor resource usage
Get-Counter "\Process(*playwright*)\% Processor Time","\Process(*playwright*)\Working Set"

# Check port usage (if testing local servers)
netstat -ano | findstr :3000

# Clear Playwright cache
Remove-Item -Recurse -Force "$env:USERPROFILE\AppData\Local\ms-playwright"

# View detailed error logs
Get-EventLog -LogName Application -Source "Node.js" -Newest 10
```

### Debug Configuration Template

```typescript
// debug.config.ts - Use this configuration for debugging
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Increase timeouts for debugging
  timeout: 60000,
  expect: { timeout: 10000 },
  
  // Run tests serially for clearer debugging
  fullyParallel: false,
  workers: 1,
  
  // Enhanced reporting for debugging
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'debug-results.json' }],
  ],
  
  use: {
    // Enable debugging features
    headless: false, // Set to true for headless debugging
    slowMo: 1000,    // Slow down actions
    
    // Comprehensive artifact collection
    screenshot: 'on',
    video: 'on',
    trace: 'on',
    
    // Enhanced logging
    launchOptions: {
      args: ['--enable-logging', '--v=1'],
    },
  },
  
  projects: [
    {
      name: 'debug-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
```

This comprehensive debugging guide provides all the tools and techniques needed to effectively troubleshoot headless Playwright tests, ensuring you can identify and resolve issues quickly even without visual feedback.