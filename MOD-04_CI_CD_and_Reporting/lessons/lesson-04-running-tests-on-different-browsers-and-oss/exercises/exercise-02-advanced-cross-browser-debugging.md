# Exercise 02: Advanced Cross-Browser Debugging and Optimization

## Learning Objectives

By completing this exercise, you will:
- Implement advanced debugging strategies for cross-browser issues
- Create performance optimization techniques for different browser engines
- Build comprehensive error handling and recovery mechanisms
- Develop browser-specific diagnostic tools and utilities
- Master advanced CI/CD optimization for multi-browser testing

## Prerequisites

- Completed Exercise 01: Basic Cross-Browser Setup
- Understanding of browser DevTools and debugging concepts
- Experience with performance monitoring and optimization
- Advanced TypeScript and Playwright knowledge

## Exercise Overview

**Duration**: 60-75 minutes  
**Difficulty**: Advanced  
**Type**: Hands-on implementation with debugging focus

This exercise focuses on advanced cross-browser debugging, performance optimization, and sophisticated error handling strategies. You'll create diagnostic tools, implement performance monitoring, and build resilient test suites that can handle browser-specific quirks and limitations.

## Part 1: Advanced Browser Debugging Utilities (20 minutes)

### Step 1: Create Advanced Debugging Framework

Create `utils/advanced-browser-debugger.ts`:

```typescript
import { Page, BrowserContext, CDPSession } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class AdvancedBrowserDebugger {
  private debugData: Map<string, DebugSession> = new Map();
  private performanceMetrics: Map<string, PerformanceMetrics[]> = new Map();

  async startDebugging(page: Page, context: BrowserContext, browserName: string): Promise<DebugSession> {
    const sessionId = `${browserName}-${Date.now()}`;
    
    const session: DebugSession = {
      id: sessionId,
      browserName,
      startTime: Date.now(),
      cdpSession: null,
      console: [],
      networkRequests: [],
      errors: [],
      performance: [],
      screenshots: [],
    };

    // Set up console monitoring
    page.on('console', (msg) => {
      session.console.push({
        timestamp: Date.now(),
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
      });
    });

    // Set up error monitoring
    page.on('pageerror', (error) => {
      session.errors.push({
        timestamp: Date.now(),
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    });

    // Set up network monitoring
    page.on('request', (request) => {
      session.networkRequests.push({
        timestamp: Date.now(),
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        resourceType: request.resourceType(),
        status: 'pending',
      });
    });

    page.on('response', (response) => {
      const request = session.networkRequests.find(req => req.url === response.url());
      if (request) {
        request.status = response.status().toString();
        request.responseTime = Date.now() - request.timestamp;
        request.size = parseInt(response.headers()['content-length'] || '0');
      }
    });

    // Browser-specific debugging setup
    if (browserName === 'chromium') {
      session.cdpSession = await this.setupChromiumDebugging(page, context, session);
    } else if (browserName === 'firefox') {
      await this.setupFirefoxDebugging(page, context, session);
    } else if (browserName === 'webkit') {
      await this.setupWebKitDebugging(page, context, session);
    }

    this.debugData.set(sessionId, session);
    return session;
  }

  private async setupChromiumDebugging(page: Page, context: BrowserContext, session: DebugSession): Promise<CDPSession> {
    const cdpSession = await context.newCDPSession(page);
    
    // Enable various CDP domains
    await cdpSession.send('Runtime.enable');
    await cdpSession.send('Network.enable');
    await cdpSession.send('Performance.enable');

    // Monitor performance metrics
    cdpSession.on('Performance.metrics', (params) => {
      session.performance.push({
        timestamp: Date.now(),
        metrics: params.metrics,
        type: 'performance',
      });
    });

    // Monitor runtime exceptions
    cdpSession.on('Runtime.exceptionThrown', (params) => {
      session.errors.push({
        timestamp: Date.now(),
        message: params.exceptionDetails.text,
        stack: params.exceptionDetails.stackTrace?.callFrames.map(frame => 
          `${frame.functionName || 'anonymous'} (${frame.url}:${frame.lineNumber}:${frame.columnNumber})`
        ).join('\n') || '',
        name: params.exceptionDetails.exception?.className || 'RuntimeError',
      });
    });

    return cdpSession;
  }

  private async setupFirefoxDebugging(page: Page, context: BrowserContext, session: DebugSession): Promise<void> {
    // Firefox-specific debugging setup
    await context.addInitScript(() => {
      // Override console methods for better tracking
      const originalConsole = { ...console };
      Object.keys(originalConsole).forEach(method => {
        (console as any)[method] = function(...args: any[]) {
          (window as any).__firefoxDebugConsole = (window as any).__firefoxDebugConsole || [];
          (window as any).__firefoxDebugConsole.push({
            method,
            args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)),
            timestamp: Date.now(),
            stack: new Error().stack,
          });
          return (originalConsole as any)[method].apply(console, args);
        };
      });

      // Monitor unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        (window as any).__firefoxDebugErrors = (window as any).__firefoxDebugErrors || [];
        (window as any).__firefoxDebugErrors.push({
          type: 'unhandledRejection',
          reason: String(event.reason),
          timestamp: Date.now(),
        });
      });
    });
  }

  private async setupWebKitDebugging(page: Page, context: BrowserContext, session: DebugSession): Promise<void> {
    // WebKit-specific debugging setup
    await context.addInitScript(() => {
      // WebKit debugging utilities
      (window as any).__webkitDebugInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        vendor: navigator.vendor,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        language: navigator.language,
        languages: navigator.languages,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as any).deviceMemory,
      };

      // Monitor Safari-specific events
      if ((window as any).safari) {
        console.log('Safari-specific debugging enabled');
      }

      // Monitor WebKit-specific performance
      if (window.performance.getEntriesByType) {
        try {
          const observer = new PerformanceObserver((list) => {
            (window as any).__webkitPerformanceEntries = (window as any).__webkitPerformanceEntries || [];
            (window as any).__webkitPerformanceEntries.push(...list.getEntries());
          });
          observer.observe({ entryTypes: ['navigation', 'resource', 'measure', 'mark'] });
        } catch (error) {
          console.warn('WebKit performance observer failed:', error);
        }
      }
    });
  }

  async captureScreenshot(page: Page, sessionId: string, label: string): Promise<string> {
    const session = this.debugData.get(sessionId);
    if (!session) throw new Error(`Debug session ${sessionId} not found`);

    const screenshotPath = `debug-screenshots/${session.browserName}-${label}-${Date.now()}.png`;
    await fs.promises.mkdir('debug-screenshots', { recursive: true });
    await page.screenshot({ path: screenshotPath, fullPage: true });

    session.screenshots.push({
      timestamp: Date.now(),
      path: screenshotPath,
      label,
    });

    return screenshotPath;
  }

  async collectPerformanceMetrics(page: Page, sessionId: string): Promise<PerformanceReport> {
    const session = this.debugData.get(sessionId);
    if (!session) throw new Error(`Debug session ${sessionId} not found`);

    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource');

      return {
        navigation: navigation ? {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: (performance as any).getEntriesByType('paint')
            .find((entry: any) => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: (performance as any).getEntriesByType('paint')
            .find((entry: any) => entry.name === 'first-contentful-paint')?.startTime || 0,
        } : null,
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
      };
    });

    const report: PerformanceReport = {
      sessionId,
      browserName: session.browserName,
      timestamp: Date.now(),
      metrics,
      summary: {
        totalRequests: metrics.resources.length,
        totalSize: metrics.resources.reduce((sum, r) => sum + r.size, 0),
        avgResponseTime: metrics.resources.length > 0 
          ? metrics.resources.reduce((sum, r) => sum + r.duration, 0) / metrics.resources.length 
          : 0,
      },
    };

    return report;
  }

  async generateDebugReport(sessionId: string): Promise<string> {
    const session = this.debugData.get(sessionId);
    if (!session) throw new Error(`Debug session ${sessionId} not found`);

    const reportPath = `debug-reports/${session.browserName}-debug-report-${Date.now()}.json`;
    await fs.promises.mkdir('debug-reports', { recursive: true });

    const report = {
      sessionInfo: {
        id: session.id,
        browserName: session.browserName,
        startTime: session.startTime,
        duration: Date.now() - session.startTime,
      },
      console: session.console,
      errors: session.errors,
      networkRequests: session.networkRequests.map(req => ({
        ...req,
        headers: Object.keys(req.headers).length, // Summarize headers
      })),
      performance: session.performance,
      screenshots: session.screenshots,
      summary: {
        totalConsoleMessages: session.console.length,
        totalErrors: session.errors.length,
        totalNetworkRequests: session.networkRequests.length,
        totalScreenshots: session.screenshots.length,
        errorsByType: session.errors.reduce((acc, error) => {
          acc[error.name] = (acc[error.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };

    await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
    return reportPath;
  }
}

// Interface definitions
interface DebugSession {
  id: string;
  browserName: string;
  startTime: number;
  cdpSession: CDPSession | null;
  console: ConsoleMessage[];
  networkRequests: NetworkRequest[];
  errors: ErrorMessage[];
  performance: PerformanceEntry[];
  screenshots: Screenshot[];
}

interface ConsoleMessage {
  timestamp: number;
  type: string;
  text: string;
  location: { url: string; lineNumber: number };
}

interface NetworkRequest {
  timestamp: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  resourceType: string;
  status: string;
  responseTime?: number;
  size?: number;
}

interface ErrorMessage {
  timestamp: number;
  message: string;
  stack: string;
  name: string;
}

interface PerformanceEntry {
  timestamp: number;
  type: string;
  metrics: any;
}

interface Screenshot {
  timestamp: number;
  path: string;
  label: string;
}

interface PerformanceReport {
  sessionId: string;
  browserName: string;
  timestamp: number;
  metrics: {
    navigation: any;
    resources: any[];
    memory: any;
  };
  summary: {
    totalRequests: number;
    totalSize: number;
    avgResponseTime: number;
  };
}

interface PerformanceMetrics {
  timestamp: number;
  browserName: string;
  metrics: any;
}

export { DebugSession, PerformanceReport, PerformanceMetrics };
```

### Step 2: Create Performance Optimization Manager

Create `utils/performance-optimizer.ts`:

```typescript
import { Page, BrowserContext } from '@playwright/test';

export class PerformanceOptimizer {
  private optimizations: Map<string, OptimizationStrategy> = new Map();

  constructor() {
    this.setupOptimizationStrategies();
  }

  private setupOptimizationStrategies() {
    // Chromium optimizations
    this.optimizations.set('chromium', {
      launchOptions: {
        args: [
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-ipc-flooding-protection',
          '--disable-features=TranslateUI',
          '--disable-default-apps',
          '--disable-component-extensions-with-background-pages',
        ],
      },
      contextOptions: {
        bypassCSP: true,
        ignoreHTTPSErrors: true,
      },
      optimizations: [
        'disableImages',
        'disableCSS',
        'optimizeNetworking',
        'enableCaching',
      ],
    });

    // Firefox optimizations
    this.optimizations.set('firefox', {
      launchOptions: {
        firefoxUserPrefs: {
          'dom.webnotifications.enabled': false,
          'dom.push.enabled': false,
          'media.navigator.streams.fake': true,
          'media.navigator.permission.disabled': true,
          'network.http.speculative-parallel-limit': 0,
          'network.dns.disableIPv6': true,
          'network.http.pipelining': true,
          'network.http.proxy.pipelining': true,
          'network.http.pipelining.maxrequests': 8,
          'content.notify.interval': 500000,
          'content.max.tokenizing.time': 300000,
          'content.switch.threshold': 750000,
        },
      },
      contextOptions: {
        bypassCSP: true,
        ignoreHTTPSErrors: true,
      },
      optimizations: [
        'disableImages',
        'optimizeNetworking',
        'reduceTimeouts',
      ],
    });

    // WebKit optimizations
    this.optimizations.set('webkit', {
      launchOptions: {},
      contextOptions: {
        bypassCSP: true,
        ignoreHTTPSErrors: true,
      },
      optimizations: [
        'optimizeNetworking',
        'reduceAnimations',
        'enableCaching',
      ],
    });
  }

  async applyOptimizations(page: Page, browserName: string, level: 'minimal' | 'moderate' | 'aggressive' = 'moderate'): Promise<void> {
    const strategy = this.optimizations.get(browserName);
    if (!strategy) {
      console.warn(`No optimization strategy found for browser: ${browserName}`);
      return;
    }

    console.log(`Applying ${level} optimizations for ${browserName}`);

    // Apply optimizations based on level
    for (const optimization of strategy.optimizations) {
      switch (optimization) {
        case 'disableImages':
          if (level === 'moderate' || level === 'aggressive') {
            await this.disableImages(page);
          }
          break;
        case 'disableCSS':
          if (level === 'aggressive') {
            await this.disableCSS(page);
          }
          break;
        case 'optimizeNetworking':
          await this.optimizeNetworking(page);
          break;
        case 'enableCaching':
          await this.enableCaching(page);
          break;
        case 'reduceTimeouts':
          await this.reduceTimeouts(page);
          break;
        case 'reduceAnimations':
          await this.reduceAnimations(page);
          break;
      }
    }
  }

  private async disableImages(page: Page): Promise<void> {
    await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', route => route.abort());
    console.log('Images disabled for performance optimization');
  }

  private async disableCSS(page: Page): Promise<void> {
    await page.route('**/*.css', route => route.abort());
    console.log('CSS disabled for performance optimization');
  }

  private async optimizeNetworking(page: Page): Promise<void> {
    // Block unnecessary resources
    await page.route('**/*', route => {
      const url = route.request().url();
      const resourceType = route.request().resourceType();

      // Block analytics, ads, and tracking
      if (url.includes('google-analytics') || 
          url.includes('googletagmanager') ||
          url.includes('facebook.com') ||
          url.includes('twitter.com') ||
          resourceType === 'image' && url.includes('ads')) {
        route.abort();
        return;
      }

      route.continue();
    });

    console.log('Network optimization applied');
  }

  private async enableCaching(page: Page): Promise<void> {
    // Enable aggressive caching
    await page.addInitScript(() => {
      // Override fetch to add caching headers
      const originalFetch = window.fetch;
      window.fetch = function(input, init = {}) {
        const headers = new Headers(init.headers);
        headers.set('Cache-Control', 'max-age=3600');
        return originalFetch(input, { ...init, headers });
      };
    });

    console.log('Caching optimization enabled');
  }

  private async reduceTimeouts(page: Page): Promise<void> {
    // Reduce various timeout values
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(30000);
    console.log('Timeouts reduced for faster execution');
  }

  private async reduceAnimations(page: Page): Promise<void> {
    // Disable or speed up animations
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01s !important;
          animation-delay: 0s !important;
          transition-duration: 0.01s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });

    console.log('Animations optimized for performance');
  }

  async measurePerformanceImpact(page: Page, browserName: string): Promise<PerformanceImpact> {
    const startTime = Date.now();

    // Navigate and measure baseline performance
    await page.goto('/performance-test');
    await page.waitForLoadState('networkidle');

    const baselineMetrics = await this.collectMetrics(page);

    // Apply optimizations and measure again
    await this.applyOptimizations(page, browserName, 'moderate');
    await page.reload();
    await page.waitForLoadState('networkidle');

    const optimizedMetrics = await this.collectMetrics(page);

    const impact: PerformanceImpact = {
      browserName,
      baseline: baselineMetrics,
      optimized: optimizedMetrics,
      improvement: {
        loadTime: baselineMetrics.loadTime - optimizedMetrics.loadTime,
        domContentLoaded: baselineMetrics.domContentLoaded - optimizedMetrics.domContentLoaded,
        networkRequests: baselineMetrics.networkRequests - optimizedMetrics.networkRequests,
        totalSize: baselineMetrics.totalSize - optimizedMetrics.totalSize,
      },
      measurementTime: Date.now() - startTime,
    };

    return impact;
  }

  private async collectMetrics(page: Page): Promise<PerformanceMetrics> {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource');

      return {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        networkRequests: resources.length,
        totalSize: resources.reduce((sum, resource) => 
          sum + ((resource as any).transferSize || 0), 0),
        memoryUsage: (performance as any).memory ? {
          used: (performance as any).memory.usedJSMemory,
          total: (performance as any).memory.totalJSMemory,
        } : null,
      };
    });
  }
}

interface OptimizationStrategy {
  launchOptions: any;
  contextOptions: any;
  optimizations: string[];
}

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  networkRequests: number;
  totalSize: number;
  memoryUsage?: {
    used: number;
    total: number;
  } | null;
}

interface PerformanceImpact {
  browserName: string;
  baseline: PerformanceMetrics;
  optimized: PerformanceMetrics;
  improvement: {
    loadTime: number;
    domContentLoaded: number;
    networkRequests: number;
    totalSize: number;
  };
  measurementTime: number;
}

export { PerformanceMetrics, PerformanceImpact };
```

## Part 2: Advanced Error Recovery and Resilience (15 minutes)

### Step 3: Create Error Recovery System

Create `utils/error-recovery-manager.ts`:

```typescript
import { Page, BrowserContext, test } from '@playwright/test';

export class ErrorRecoveryManager {
  private recoveryStrategies: Map<string, RecoveryStrategy[]> = new Map();
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.setupRecoveryStrategies();
  }

  private setupRecoveryStrategies() {
    // Common recovery strategies for all browsers
    const commonStrategies: RecoveryStrategy[] = [
      {
        name: 'page-reload',
        condition: (error) => error.message.includes('navigation') || error.message.includes('timeout'),
        action: async (page) => {
          await page.reload({ waitUntil: 'networkidle' });
        },
        priority: 1,
      },
      {
        name: 'wait-and-retry',
        condition: (error) => error.message.includes('element') || error.message.includes('selector'),
        action: async (page) => {
          await page.waitForTimeout(2000);
        },
        priority: 2,
      },
      {
        name: 'clear-cache',
        condition: (error) => error.message.includes('network') || error.message.includes('resource'),
        action: async (page, context) => {
          if (context) {
            await context.clearCookies();
            await context.clearPermissions();
          }
        },
        priority: 3,
      },
    ];

    // Browser-specific strategies
    this.recoveryStrategies.set('chromium', [
      ...commonStrategies,
      {
        name: 'chromium-reset-viewport',
        condition: (error) => error.message.includes('viewport') || error.message.includes('screenshot'),
        action: async (page) => {
          await page.setViewportSize({ width: 1280, height: 720 });
        },
        priority: 2,
      },
    ]);

    this.recoveryStrategies.set('firefox', [
      ...commonStrategies,
      {
        name: 'firefox-disable-animations',
        condition: (error) => error.message.includes('click') || error.message.includes('hover'),
        action: async (page) => {
          await page.addStyleTag({
            content: `
              *, *::before, *::after {
                animation-duration: 0s !important;
                transition-duration: 0s !important;
              }
            `
          });
        },
        priority: 2,
      },
    ]);

    this.recoveryStrategies.set('webkit', [
      ...commonStrategies,
      {
        name: 'webkit-permission-reset',
        condition: (error) => error.message.includes('permission') || error.message.includes('denied'),
        action: async (page, context) => {
          if (context) {
            await context.grantPermissions(['camera', 'microphone', 'geolocation']);
          }
        },
        priority: 1,
      },
    ]);
  }

  async executeWithRecovery<T>(
    action: () => Promise<T>,
    page: Page,
    context?: BrowserContext,
    browserName: string = 'chromium'
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;
        console.log(`Attempt ${attempt + 1} failed:`, error.message);

        if (attempt < this.maxRetries) {
          await this.applyRecoveryStrategies(error as Error, page, context, browserName);
          await page.waitForTimeout(this.retryDelay * (attempt + 1));
        }
      }
    }

    throw new Error(`Action failed after ${this.maxRetries + 1} attempts. Last error: ${lastError?.message}`);
  }

  private async applyRecoveryStrategies(
    error: Error, 
    page: Page, 
    context?: BrowserContext, 
    browserName: string = 'chromium'
  ): Promise<void> {
    const strategies = this.recoveryStrategies.get(browserName) || [];
    const applicableStrategies = strategies
      .filter(strategy => strategy.condition(error))
      .sort((a, b) => a.priority - b.priority);

    console.log(`Applying ${applicableStrategies.length} recovery strategies for ${browserName}`);

    for (const strategy of applicableStrategies) {
      try {
        console.log(`Executing recovery strategy: ${strategy.name}`);
        await strategy.action(page, context);
        await page.waitForTimeout(500); // Small delay between strategies
      } catch (recoveryError) {
        console.warn(`Recovery strategy ${strategy.name} failed:`, recoveryError);
      }
    }
  }

  async createResilientAction<T>(
    actionName: string,
    action: (page: Page) => Promise<T>,
    options?: ResilientActionOptions
  ): Promise<(page: Page, context?: BrowserContext, browserName?: string) => Promise<T>> {
    const opts: Required<ResilientActionOptions> = {
      maxRetries: options?.maxRetries ?? this.maxRetries,
      retryDelay: options?.retryDelay ?? this.retryDelay,
      beforeRetry: options?.beforeRetry ?? (() => Promise.resolve()),
      afterFailure: options?.afterFailure ?? (() => Promise.resolve()),
      customRecovery: options?.customRecovery,
    };

    return async (page: Page, context?: BrowserContext, browserName: string = 'chromium'): Promise<T> => {
      return await this.executeWithRecovery(
        async () => {
          try {
            return await action(page);
          } catch (error) {
            // Apply custom recovery if provided
            if (opts.customRecovery) {
              await opts.customRecovery(error as Error, page, context);
            }
            throw error;
          }
        },
        page,
        context,
        browserName
      );
    };
  }
}

interface RecoveryStrategy {
  name: string;
  condition: (error: Error) => boolean;
  action: (page: Page, context?: BrowserContext) => Promise<void>;
  priority: number;
}

interface ResilientActionOptions {
  maxRetries?: number;
  retryDelay?: number;
  beforeRetry?: (attempt: number, error: Error) => Promise<void>;
  afterFailure?: (error: Error, attempts: number) => Promise<void>;
  customRecovery?: (error: Error, page: Page, context?: BrowserContext) => Promise<void>;
}

export { RecoveryStrategy, ResilientActionOptions };
```

## Part 3: Advanced Test Implementation (15 minutes)

### Step 4: Create Advanced Cross-Browser Tests

Create `tests/advanced-cross-browser/resilient-testing.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { AdvancedBrowserDebugger } from '../../utils/advanced-browser-debugger';
import { PerformanceOptimizer } from '../../utils/performance-optimizer';
import { ErrorRecoveryManager } from '../../utils/error-recovery-manager';

test.describe('Advanced Cross-Browser Resilient Testing', () => {
  let debugger: AdvancedBrowserDebugger;
  let optimizer: PerformanceOptimizer;
  let recoveryManager: ErrorRecoveryManager;

  test.beforeEach(async () => {
    debugger = new AdvancedBrowserDebugger();
    optimizer = new PerformanceOptimizer();
    recoveryManager = new ErrorRecoveryManager();
  });

  test('should handle complex scenarios with full debugging', async ({ page, context, browserName }) => {
    // Start advanced debugging
    const debugSession = await debugger.startDebugging(page, context, browserName);
    
    try {
      // Apply performance optimizations
      await optimizer.applyOptimizations(page, browserName, 'moderate');

      // Create resilient navigation action
      const resilientNavigation = await recoveryManager.createResilientAction(
        'navigate-to-complex-page',
        async (page) => {
          await page.goto('/complex-test-page');
          await page.waitForLoadState('networkidle');
          return page.locator('h1').textContent();
        },
        { maxRetries: 5, retryDelay: 2000 }
      );

      // Execute resilient navigation
      const pageTitle = await resilientNavigation(page, context, browserName);
      expect(pageTitle).toBeTruthy();

      // Capture performance metrics
      const performanceReport = await debugger.collectPerformanceMetrics(page, debugSession.id);
      console.log(`${browserName} performance:`, performanceReport.summary);

      // Test complex interactions with recovery
      await recoveryManager.executeWithRecovery(
        async () => {
          // Complex form interaction
          const form = page.locator('#complex-form');
          await form.locator('#dynamic-input').fill('test data');
          
          // Handle dynamic dropdown
          await form.locator('#async-dropdown').click();
          await page.waitForSelector('#dropdown-options');
          await page.locator('#dropdown-options li').first().click();
          
          // Submit with confirmation
          await form.locator('#submit-btn').click();
          await page.waitForSelector('#confirmation-modal');
          await page.locator('#confirm-yes').click();
          
          // Verify success
          await expect(page.locator('#success-message')).toBeVisible({ timeout: 10000 });
        },
        page,
        context,
        browserName
      );

      // Capture screenshot for verification
      await debugger.captureScreenshot(page, debugSession.id, 'test-completion');

    } finally {
      // Generate debug report
      const reportPath = await debugger.generateDebugReport(debugSession.id);
      console.log(`Debug report generated: ${reportPath}`);
    }
  });

  test('should measure and optimize performance across browsers', async ({ page, context, browserName }) => {
    // Measure performance impact of optimizations
    const performanceImpact = await optimizer.measurePerformanceImpact(page, browserName);
    
    console.log(`${browserName} performance improvement:`, {
      loadTime: `${performanceImpact.improvement.loadTime}ms`,
      networkRequests: performanceImpact.improvement.networkRequests,
      totalSize: `${(performanceImpact.improvement.totalSize / 1024).toFixed(2)}KB`,
    });

    // Verify performance improvements
    expect(performanceImpact.improvement.loadTime).toBeGreaterThanOrEqual(0);
    expect(performanceImpact.optimized.loadTime).toBeLessThan(performanceImpact.baseline.loadTime * 1.5);
  });

  test('should handle browser-specific edge cases', async ({ page, context, browserName }) => {
    const debugSession = await debugger.startDebugging(page, context, browserName);

    // Browser-specific edge case testing
    switch (browserName) {
      case 'chromium':
        await test.step('Chromium-specific tests', async () => {
          // Test Chrome DevTools Protocol features
          if (debugSession.cdpSession) {
            await debugSession.cdpSession.send('Runtime.evaluate', {
              expression: 'console.log("CDP test successful")'
            });
          }
          
          // Test Chromium-specific APIs
          const webGLSupport = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
          });
          expect(webGLSupport).toBe(true);
        });
        break;

      case 'firefox':
        await test.step('Firefox-specific tests', async () => {
          // Test Firefox-specific features
          const firefoxFeatures = await page.evaluate(() => ({
            mozInnerScreenX: typeof window.mozInnerScreenX !== 'undefined',
            mozInnerScreenY: typeof window.mozInnerScreenY !== 'undefined',
            InstallTrigger: typeof window.InstallTrigger !== 'undefined',
          }));
          
          console.log(`Firefox features detected:`, firefoxFeatures);
        });
        break;

      case 'webkit':
        await test.step('WebKit-specific tests', async () => {
          // Test WebKit-specific features
          const webkitFeatures = await page.evaluate(() => ({
            safari: !!(window as any).safari,
            webkitRequestAnimationFrame: typeof window.webkitRequestAnimationFrame !== 'undefined',
            webkitCancelAnimationFrame: typeof window.webkitCancelAnimationFrame !== 'undefined',
          }));
          
          console.log(`WebKit features detected:`, webkitFeatures);
          
          // Handle WebKit-specific restrictions
          if (process.env.CI) {
            console.log('Skipping WebKit file upload test in CI environment');
          } else {
            // Test file upload (local only)
            const fileInput = page.locator('input[type="file"]');
            if (await fileInput.isVisible()) {
              await fileInput.setInputFiles('./test-data/sample.txt');
            }
          }
        });
        break;
    }

    await debugger.generateDebugReport(debugSession.id);
  });
});
```

## Part 4: CI/CD Optimization and Monitoring (10 minutes)

### Step 5: Create Advanced CI/CD Configuration

Create `.github/workflows/advanced-cross-browser-debugging.yml`:

```yaml
name: Advanced Cross-Browser Debugging

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 6 * * 1' # Weekly comprehensive testing

jobs:
  advanced-testing:
    runs-on: ${{ matrix.os }}
    
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        browser: [chromium, firefox, webkit]
        optimization: [minimal, moderate, aggressive]
        exclude:
          - os: ubuntu-latest
            browser: webkit
          - os: windows-latest
            browser: webkit
          # Skip aggressive optimization for Firefox (known issues)
          - browser: firefox
            optimization: aggressive
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright browsers
      run: npx playwright install ${{ matrix.browser }} --with-deps
    
    - name: Create test data
      run: |
        mkdir -p test-data
        echo "Sample test file content" > test-data/sample.txt
    
    - name: Run advanced debugging tests
      run: |
        npx playwright test tests/advanced-cross-browser/ \
          --project=${{ matrix.browser }} \
          --reporter=html,json,junit
      env:
        CI: true
        BROWSER_NAME: ${{ matrix.browser }}
        OPTIMIZATION_LEVEL: ${{ matrix.optimization }}
        OS_NAME: ${{ matrix.os }}
    
    - name: Upload debug reports
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: debug-reports-${{ matrix.os }}-${{ matrix.browser }}-${{ matrix.optimization }}
        path: |
          debug-reports/
          debug-screenshots/
          test-results/
          playwright-report/
        retention-days: 14
    
    - name: Upload performance metrics
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: performance-${{ matrix.os }}-${{ matrix.browser }}-${{ matrix.optimization }}
        path: |
          performance-*.json
        retention-days: 7
```

## Part 5: Validation and Testing (10 minutes)

### Step 6: Run Advanced Tests and Validate Results

1. **Execute advanced debugging tests**:
   ```bash
   npx playwright test tests/advanced-cross-browser/ --headed
   ```

2. **Review debug reports** in the `debug-reports/` directory

3. **Analyze performance metrics** and optimization impacts

4. **Verify error recovery mechanisms** by introducing intentional failures

## Expected Outcomes

After completing this exercise, you should have:

1. ✅ **Advanced debugging framework** with browser-specific monitoring
2. ✅ **Performance optimization system** with measurable improvements
3. ✅ **Error recovery mechanisms** that handle browser-specific issues
4. ✅ **Comprehensive diagnostic tools** for cross-browser troubleshooting
5. ✅ **Optimized CI/CD pipeline** with advanced monitoring capabilities

## Verification Checklist

- [ ] Debug reports are generated with comprehensive browser information
- [ ] Performance optimizations show measurable improvements
- [ ] Error recovery successfully handles common browser issues
- [ ] Browser-specific features are correctly detected and handled
- [ ] CI/CD pipeline runs with advanced debugging enabled
- [ ] All artifacts are properly collected and uploaded

## Troubleshooting Advanced Issues

### Memory and Resource Management
- Monitor memory usage across browsers
- Implement cleanup procedures for long-running tests
- Use performance profiling to identify bottlenecks

### Browser-Specific Debugging
- **Chromium**: Leverage CDP for deep debugging
- **Firefox**: Use console override for better logging
- **WebKit**: Handle Safari-specific restrictions and features

### CI/CD Optimization
- Balance debugging depth with execution time
- Use matrix strategies to parallelize testing
- Implement intelligent artifact collection

## Summary

This advanced exercise demonstrated sophisticated cross-browser debugging and optimization techniques essential for enterprise-level test automation. You've implemented:

- **Advanced debugging frameworks** for comprehensive browser monitoring
- **Performance optimization strategies** tailored to each browser engine
- **Resilient error recovery mechanisms** that handle browser-specific issues
- **Sophisticated diagnostic tools** for troubleshooting complex scenarios

These skills are crucial for senior QA automation engineers working with complex, multi-browser applications in production environments.

Continue to the **Assessment** to validate your understanding of advanced cross-browser testing concepts and implementations.