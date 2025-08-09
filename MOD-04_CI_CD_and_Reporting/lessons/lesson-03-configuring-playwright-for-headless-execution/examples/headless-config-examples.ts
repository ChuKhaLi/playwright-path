// Comprehensive Headless Configuration Examples for Playwright
// These examples demonstrate production-ready headless configurations

import { defineConfig, devices, BrowserContext, Page, Browser } from '@playwright/test';
import { chromium, firefox, webkit } from '@playwright/test';

// =============================================================================
// 1. ENVIRONMENT-AWARE CONFIGURATION
// =============================================================================

/**
 * Environment detection and configuration utility
 */
export class EnvironmentConfig {
  static isCI = !!process.env.CI;
  static isDebug = process.env.DEBUG === 'true';
  static environment = process.env.TEST_ENV || 'staging';
  
  static getBrowserConfig() {
    const isHeadless = this.isCI || process.env.HEADLESS === 'true';
    
    return {
      headless: isHeadless && !this.isDebug,
      slowMo: this.isDebug ? 1000 : 0,
      devtools: this.isDebug && !this.isCI,
      args: this.getOptimizedArgs(),
      timeout: this.isCI ? 45000 : 30000,
    };
  }
  
  private static getOptimizedArgs(): string[] {
    const baseArgs = [
      '--no-first-run',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-background-throttling',
      '--disable-features=TranslateUI',
      '--disable-default-apps',
    ];
    
    if (this.isCI) {
      return [
        ...baseArgs,
        // Security args (required for most CI environments)
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        
        // Performance optimization
        '--memory-pressure-off',
        '--max_old_space_size=4096',
        '--disable-gpu',
        '--disable-gpu-sandbox',
        '--disable-software-rasterizer',
        
        // Network optimization
        '--aggressive-cache-discard',
        '--disable-background-networking',
        '--disable-extensions',
        '--disable-plugins',
      ];
    }
    
    return baseArgs;
  }
}

// =============================================================================
// 2. PLAYWRIGHT CONFIG WITH HEADLESS OPTIMIZATION
// =============================================================================

const environmentConfig = EnvironmentConfig.getBrowserConfig();

export default defineConfig({
  testDir: './tests',
  timeout: environmentConfig.timeout,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['json', { 
      outputFile: 'test-results.json' 
    }],
    process.env.CI ? ['github'] : ['list'],
  ],
  
  use: {
    ...environmentConfig,
    
    // Global context options
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Headless-specific optimizations
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Font consistency
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        ...environmentConfig,
        
        // Chromium-specific headless args
        launchOptions: {
          args: [
            ...environmentConfig.args,
            '--force-device-scale-factor=1',
            '--font-render-hinting=none',
            '--disable-font-subpixel-positioning',
          ],
        },
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        headless: environmentConfig.headless,
        
        // Firefox-specific preferences
        firefoxUserPrefs: {
          'ui.prefersReducedMotion': 1,
          'browser.cache.disk.enable': false,
          'browser.cache.memory.enable': true,
          'gfx.font_rendering.cleartype_params.rendering_mode': 5,
        },
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        headless: environmentConfig.headless,
      },
    },
  ],
});

// =============================================================================
// 3. ADVANCED BROWSER CONTEXT MANAGER
// =============================================================================

export class HeadlessBrowserManager {
  private static contexts = new Map<string, BrowserContext>();
  
  /**
   * Create optimized browser context for headless execution
   */
  static async createOptimizedContext(
    browser: Browser,
    options: {
      viewport?: { width: number; height: number };
      blockImages?: boolean;
      blockVideos?: boolean;
      locale?: string;
      timezone?: string;
    } = {}
  ): Promise<BrowserContext> {
    
    const contextOptions = {
      viewport: options.viewport || { width: 1280, height: 720 },
      locale: options.locale || 'en-US',
      timezoneId: options.timezone || 'America/New_York',
      
      // Headless optimizations
      ignoreHTTPSErrors: true,
      
      // Font consistency
      extraHTTPHeaders: {
        'Accept-Language': `${options.locale || 'en-US'},en;q=0.9`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    };
    
    const context = await browser.newContext(contextOptions);
    
    // Configure resource blocking for performance
    if (options.blockImages || options.blockVideos) {
      await context.route('**/*', (route) => {
        const request = route.request();
        const resourceType = request.resourceType();
        const url = request.url();
        
        // Block images if requested
        if (options.blockImages && resourceType === 'image') {
          route.abort();
          return;
        }
        
        // Block videos if requested
        if (options.blockVideos && (resourceType === 'media' || url.includes('.mp4'))) {
          route.abort();
          return;
        }
        
        // Block common analytics and ads
        if (this.shouldBlockUrl(url)) {
          route.abort();
          return;
        }
        
        route.continue();
      });
    }
    
    return context;
  }
  
  private static shouldBlockUrl(url: string): boolean {
    const blockedDomains = [
      'google-analytics.com',
      'googletagmanager.com',
      'facebook.com/tr',
      'doubleclick.net',
      'adsystem.amazon.com',
      'scorecardresearch.com',
      'quantserve.com',
    ];
    
    return blockedDomains.some(domain => url.includes(domain));
  }
  
  /**
   * Get or create reusable context for performance
   */
  static async getOrCreateContext(
    browser: Browser,
    key: string,
    options: Parameters<typeof HeadlessBrowserManager.createOptimizedContext>[1] = {}
  ): Promise<BrowserContext> {
    
    if (this.contexts.has(key)) {
      const context = this.contexts.get(key)!;
      
      // Verify context is still valid
      try {
        const pages = context.pages();
        if (pages.length > 0) {
          await pages[0].evaluate(() => true);
        }
        return context;
      } catch {
        // Context is invalid, remove it
        this.contexts.delete(key);
        try {
          await context.close();
        } catch {
          // Ignore cleanup errors
        }
      }
    }
    
    const context = await this.createOptimizedContext(browser, options);
    this.contexts.set(key, context);
    
    return context;
  }
  
  /**
   * Cleanup all managed contexts
   */
  static async cleanup(): Promise<void> {
    const cleanupPromises = Array.from(this.contexts.values()).map(async (context) => {
      try {
        await context.close();
      } catch (error) {
        console.warn('Error closing context:', error);
      }
    });
    
    await Promise.all(cleanupPromises);
    this.contexts.clear();
  }
}

// =============================================================================
// 4. HEADLESS PAGE UTILITIES
// =============================================================================

export class HeadlessPageUtils {
  /**
   * Configure page for optimal headless performance
   */
  static async optimizePageForHeadless(page: Page): Promise<void> {
    // Enable comprehensive logging
    await this.enableLogging(page);
    
    // Ensure fonts are loaded consistently
    await this.ensureFontConsistency(page);
    
    // Wait for page to be fully ready
    await this.waitForPageReady(page);
  }
  
  private static async enableLogging(page: Page): Promise<void> {
    // Log console messages
    page.on('console', (msg) => {
      const type = msg.type();
      if (['error', 'warning'].includes(type)) {
        console.log(`[BROWSER ${type.toUpperCase()}] ${msg.text()}`);
      }
    });
    
    // Log page errors
    page.on('pageerror', (error) => {
      console.error('[PAGE ERROR]', error.message);
    });
    
    // Log failed requests
    page.on('requestfailed', (request) => {
      console.error('[REQUEST FAILED]', request.url(), request.failure()?.errorText);
    });
  }
  
  private static async ensureFontConsistency(page: Page): Promise<void> {
    // Inject consistent font CSS
    await page.addStyleTag({
      content: `
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        /* Hide scrollbars for consistent screenshots */
        * {
          scrollbar-width: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
        }
      `,
    });
    
    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
  }
  
  private static async waitForPageReady(page: Page): Promise<void> {
    // Wait for DOM content loaded
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for network idle
    await page.waitForLoadState('networkidle');
    
    // Wait for any loading indicators to disappear
    const loadingSelectors = [
      '[data-testid="loading"]',
      '.loading',
      '.spinner',
      '[aria-label*="loading" i]',
    ];
    
    for (const selector of loadingSelectors) {
      try {
        await page.waitForSelector(selector, { 
          state: 'detached', 
          timeout: 5000 
        });
      } catch {
        // Loading indicator might not exist, continue
      }
    }
  }
  
  /**
   * Take screenshot with headless optimizations
   */
  static async takeOptimizedScreenshot(
    page: Page,
    options: {
      path: string;
      fullPage?: boolean;
      hideScrollbars?: boolean;
      waitForStability?: boolean;
    }
  ): Promise<void> {
    
    if (options.waitForStability) {
      // Wait for page to be stable
      await this.waitForPageStability(page);
    }
    
    if (options.hideScrollbars) {
      // Hide scrollbars for clean screenshots
      await page.addStyleTag({
        content: `
          * { scrollbar-width: none !important; }
          *::-webkit-scrollbar { display: none !important; }
        `,
      });
    }
    
    await page.screenshot({
      path: options.path,
      fullPage: options.fullPage || false,
      animations: 'disabled',
      caret: 'hide',
    });
  }
  
  private static async waitForPageStability(page: Page): Promise<void> {
    // Wait for animations to complete
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        // Wait for any CSS animations/transitions to complete
        const elements = document.querySelectorAll('*');
        let animationsRunning = 0;
        
        elements.forEach((element) => {
          const computedStyle = window.getComputedStyle(element);
          const animationDuration = computedStyle.animationDuration;
          const transitionDuration = computedStyle.transitionDuration;
          
          if (animationDuration !== '0s' || transitionDuration !== '0s') {
            animationsRunning++;
          }
        });
        
        if (animationsRunning === 0) {
          resolve();
          return;
        }
        
        // Wait for animations to settle
        setTimeout(resolve, 1000);
      });
    });
    
    // Wait for the main content to be visible
    await page.locator('body').waitFor({ state: 'visible' });
  }
}

// =============================================================================
// 5. DEBUGGING UTILITIES FOR HEADLESS MODE
// =============================================================================

export class HeadlessDebugger {
  private static debugMode = process.env.DEBUG === 'true';
  
  /**
   * Enable comprehensive debugging for headless tests
   */
  static async enableDebugging(context: BrowserContext): Promise<void> {
    if (!this.debugMode) return;
    
    // Start tracing
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });
    
    console.log('[DEBUG] Tracing enabled for headless debugging');
  }
  
  /**
   * Save debug artifacts
   */
  static async saveDebugArtifacts(
    context: BrowserContext,
    testName: string
  ): Promise<void> {
    if (!this.debugMode) return;
    
    try {
      // Stop and save trace
      await context.tracing.stop({
        path: `debug-traces/${testName}-${Date.now()}.zip`,
      });
      
      console.log(`[DEBUG] Trace saved for test: ${testName}`);
    } catch (error) {
      console.warn('[DEBUG] Failed to save trace:', error);
    }
  }
  
  /**
   * Log page state for debugging
   */
  static async logPageState(page: Page, label: string): Promise<void> {
    if (!this.debugMode) return;
    
    const url = page.url();
    const title = await page.title().catch(() => 'Unable to get title');
    const viewport = page.viewportSize();
    
    console.log(`[DEBUG ${label}]`, {
      url,
      title,
      viewport,
      timestamp: new Date().toISOString(),
    });
  }
  
  /**
   * Take debug screenshot
   */
  static async takeDebugScreenshot(page: Page, name: string): Promise<void> {
    if (!this.debugMode) return;
    
    try {
      await page.screenshot({
        path: `debug-screenshots/${name}-${Date.now()}.png`,
        fullPage: true,
      });
      
      console.log(`[DEBUG] Screenshot saved: ${name}`);
    } catch (error) {
      console.warn('[DEBUG] Failed to take screenshot:', error);
    }
  }
}

// =============================================================================
// 6. PERFORMANCE MONITORING
// =============================================================================

export class PerformanceMonitor {
  /**
   * Measure page performance in headless mode
   */
  static async measurePageLoad(page: Page): Promise<{
    loadTime: number;
    resourceCount: number;
    totalSize: number;
    timeToInteractive: number;
  }> {
    const startTime = Date.now();
    let resourceCount = 0;
    let totalSize = 0;
    
    // Track resources
    page.on('response', (response) => {
      resourceCount++;
      const headers = response.headers();
      const contentLength = headers['content-length'] || headers['Content-Length'];
      if (contentLength) {
        totalSize += parseInt(contentLength, 10);
      }
    });
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Measure Time to Interactive
    const timeToInteractive = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        if (document.readyState === 'complete') {
          resolve(performance.now());
          return;
        }
        
        window.addEventListener('load', () => {
          resolve(performance.now());
        });
      });
    });
    
    return {
      loadTime,
      resourceCount,
      totalSize,
      timeToInteractive,
    };
  }
  
  /**
   * Log performance metrics
   */
  static logPerformanceMetrics(metrics: ReturnType<typeof PerformanceMonitor.measurePageLoad> extends Promise<infer T> ? T : never): void {
    console.log('[PERFORMANCE]', {
      loadTime: `${metrics.loadTime}ms`,
      resourceCount: metrics.resourceCount,
      totalSize: `${Math.round(metrics.totalSize / 1024)}KB`,
      timeToInteractive: `${Math.round(metrics.timeToInteractive)}ms`,
    });
  }
}

// =============================================================================
// 7. EXAMPLE USAGE
// =============================================================================

/**
 * Example test using optimized headless configuration
 */
export async function exampleHeadlessTest() {
  const browser = await chromium.launch(EnvironmentConfig.getBrowserConfig());
  
  try {
    // Create optimized context
    const context = await HeadlessBrowserManager.createOptimizedContext(browser, {
      blockImages: false, // Keep images for visual testing
      blockVideos: true,  // Block videos for performance
      locale: 'en-US',
      timezone: 'America/New_York',
    });
    
    // Enable debugging if needed
    await HeadlessDebugger.enableDebugging(context);
    
    const page = await context.newPage();
    
    // Optimize page for headless
    await HeadlessPageUtils.optimizePageForHeadless(page);
    
    // Navigate and measure performance
    const performancePromise = PerformanceMonitor.measurePageLoad(page);
    await page.goto('https://example.com');
    const metrics = await performancePromise;
    
    PerformanceMonitor.logPerformanceMetrics(metrics);
    
    // Take optimized screenshot
    await HeadlessPageUtils.takeOptimizedScreenshot(page, {
      path: 'example-screenshot.png',
      fullPage: true,
      hideScrollbars: true,
      waitForStability: true,
    });
    
    // Save debug artifacts
    await HeadlessDebugger.saveDebugArtifacts(context, 'example-test');
    
    await context.close();
  } finally {
    await browser.close();
    await HeadlessBrowserManager.cleanup();
  }
}

// Export configurations for use in tests
export { EnvironmentConfig };
export const headlessConfig = EnvironmentConfig.getBrowserConfig();