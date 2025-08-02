# Example 04: Playwright Integration with Hooks and Tags

## Overview

This example demonstrates advanced integration patterns combining Cucumber hooks and tags with Playwright for production-ready browser automation, including debugging workflows, performance monitoring, and sophisticated browser lifecycle management.

## Learning Focus

- **Browser Lifecycle Management**: Advanced Playwright integration with Cucumber hooks
- **Debugging Workflows**: Screenshot capture, video recording, and error analysis
- **Performance Monitoring**: Timing, resource usage, and bottleneck identification
- **Multi-Browser Testing**: Cross-browser testing strategies with tag-based execution

## Advanced Browser Management

### Global Browser Pool Management

```typescript
// hooks/playwright-browser-management.ts
import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';

interface BrowserPool {
    chromium?: Browser;
    firefox?: Browser;
    webkit?: Browser;
}

interface TestWorld {
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    browserName?: string;
    testMetrics?: TestMetrics;
}

interface TestMetrics {
    startTime: number;
    endTime?: number;
    pageLoadTime?: number;
    interactionTime?: number;
    networkRequests: number;
    errors: string[];
}

class PlaywrightManager {
    private static browserPool: BrowserPool = {};
    
    public static async initializeBrowsers(): Promise<void> {
        console.log('🚀 Initializing browser pool...');
        
        const browserPromises: Promise<void>[] = [];
        
        // Initialize browsers based on environment and tags
        const browsers = this.determineBrowsersToLaunch();
        
        if (browsers.includes('chromium')) {
            browserPromises.push(
                chromium.launch({
                    headless: process.env.CI === 'true',
                    args: [
                        '--no-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-web-security',
                        '--disable-extensions'
                    ]
                }).then(browser => {
                    this.browserPool.chromium = browser;
                    console.log('✅ Chromium browser ready');
                })
            );
        }
        
        if (browsers.includes('firefox')) {
            browserPromises.push(
                firefox.launch({
                    headless: process.env.CI === 'true'
                }).then(browser => {
                    this.browserPool.firefox = browser;
                    console.log('✅ Firefox browser ready');
                })
            );
        }
        
        if (browsers.includes('webkit')) {
            browserPromises.push(
                webkit.launch({
                    headless: process.env.CI === 'true'
                }).then(browser => {
                    this.browserPool.webkit = browser;
                    console.log('✅ WebKit browser ready');
                })
            );
        }
        
        await Promise.all(browserPromises);
        console.log('🎯 Browser pool initialization complete');
    }
    
    private static determineBrowsersToLaunch(): string[] {
        const envBrowsers = process.env.BROWSERS?.split(',') || ['chromium'];
        
        // Check for tag-based browser requirements
        const tagBrowsers: string[] = [];
        
        if (process.env.CUCUMBER_TAGS?.includes('@chrome')) {
            tagBrowsers.push('chromium');
        }
        if (process.env.CUCUMBER_TAGS?.includes('@firefox')) {
            tagBrowsers.push('firefox');
        }
        if (process.env.CUCUMBER_TAGS?.includes('@safari')) {
            tagBrowsers.push('webkit');
        }
        
        return [...new Set([...envBrowsers, ...tagBrowsers])];
    }
    
    public static getBrowser(browserName: string): Browser | undefined {
        return this.browserPool[browserName as keyof BrowserPool];
    }
    
    public static async closeBrowsers(): Promise<void> {
        console.log('🔧 Closing browser pool...');
        
        const closePromises = Object.entries(this.browserPool).map(async ([name, browser]) => {
            if (browser) {
                await browser.close();
                console.log(`✅ ${name} browser closed`);
            }
        });
        
        await Promise.all(closePromises);
        this.browserPool = {};
        console.log('🏁 Browser pool closed');
    }
}

// Global browser initialization
BeforeAll(async function () {
    await PlaywrightManager.initializeBrowsers();
});

AfterAll(async function () {
    await PlaywrightManager.closeBrowsers();
});

export { PlaywrightManager, TestWorld, TestMetrics };
```

### Browser-Specific Context Setup

```typescript
// hooks/browser-context-hooks.ts
import { Before, After } from '@cucumber/cucumber';
import { PlaywrightManager, TestWorld } from './playwright-browser-management';

// Default browser setup for all scenarios
Before(async function (this: TestWorld, scenario) {
    console.log(`🎬 Setting up browser for: ${scenario.pickle.name}`);
    
    // Determine browser based on tags
    this.browserName = this.determineBrowserFromTags(scenario.pickle.tags);
    this.browser = PlaywrightManager.getBrowser(this.browserName);
    
    if (!this.browser) {
        throw new Error(`Browser ${this.browserName} not available`);
    }
    
    // Initialize test metrics
    this.testMetrics = {
        startTime: Date.now(),
        networkRequests: 0,
        errors: []
    };
    
    console.log(`🌐 Using ${this.browserName} browser`);
});

// Desktop browser context
Before({ tags: '@desktop' }, async function (this: TestWorld) {
    console.log('🖥️ Setting up desktop browser context');
    
    this.context = await this.browser!.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Desktop Test Agent (Cucumber BDD)',
        locale: 'en-US',
        timezoneId: 'America/New_York'
    });
    
    this.page = await this.context.newPage();
    await this.setupPageMonitoring();
});

// Mobile browser context
Before({ tags: '@mobile' }, async function (this: TestWorld) {
    console.log('📱 Setting up mobile browser context');
    
    this.context = await this.browser!.newContext({
        viewport: { width: 375, height: 667 }, // iPhone SE
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        locale: 'en-US'
    });
    
    this.page = await this.context.newPage();
    await this.setupPageMonitoring();
});

// Tablet browser context
Before({ tags: '@tablet' }, async function (this: TestWorld) {
    console.log('📟 Setting up tablet browser context');
    
    this.context = await this.browser!.newContext({
        viewport: { width: 768, height: 1024 }, // iPad
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
    });
    
    this.page = await this.context.newPage();
    await this.setupPageMonitoring();
});

// Performance testing context
Before({ tags: '@performance' }, async function (this: TestWorld) {
    console.log('📊 Setting up performance testing context');
    
    this.context = await this.browser!.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: {
            dir: 'test-results/videos',
            size: { width: 1280, height: 720 }
        }
    });
    
    this.page = await this.context.newPage();
    
    // Enable detailed performance monitoring
    await this.page.addInitScript(() => {
        window.performanceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    console.log('Navigation timing:', entry.toJSON());
                }
                if (entry.entryType === 'resource') {
                    console.log('Resource timing:', entry.name, entry.duration);
                }
            }
        });
        window.performanceObserver.observe({ entryTypes: ['navigation', 'resource'] });
    });
    
    await this.setupPageMonitoring();
});

// Accessibility testing context
Before({ tags: '@accessibility' }, async function (this: TestWorld) {
    console.log('♿ Setting up accessibility testing context');
    
    this.context = await this.browser!.newContext({
        viewport: { width: 1280, height: 720 },
        reducedMotion: 'reduce', // Respect reduced motion preferences
        forcedColors: 'none',
        colorScheme: 'light'
    });
    
    this.page = await this.context.newPage();
    
    // Inject axe-core for accessibility testing
    await this.page.addInitScript(() => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/axe-core@4.4.3/axe.min.js';
        document.head.appendChild(script);
    });
    
    await this.setupPageMonitoring();
});

// Setup comprehensive page monitoring
TestWorld.prototype.setupPageMonitoring = async function () {
    if (!this.page) return;
    
    // Network request monitoring
    this.page.on('request', (request) => {
        this.testMetrics!.networkRequests++;
        console.log(`🌐 Request: ${request.method()} ${request.url()}`);
    });
    
    // Response monitoring
    this.page.on('response', (response) => {
        if (!response.ok()) {
            console.log(`❌ Failed response: ${response.status()} ${response.url()}`);
        }
    });
    
    // Error monitoring
    this.page.on('pageerror', (error) => {
        const errorMessage = `Page error: ${error.message}`;
        this.testMetrics!.errors.push(errorMessage);
        console.log(`🚨 ${errorMessage}`);
    });
    
    // Console log monitoring
    this.page.on('console', (msg) => {
        if (msg.type() === 'error') {
            const errorMessage = `Console error: ${msg.text()}`;
            this.testMetrics!.errors.push(errorMessage);
            console.log(`🔴 ${errorMessage}`);
        }
    });
    
    // Dialog handling
    this.page.on('dialog', async (dialog) => {
        console.log(`💬 Dialog: ${dialog.type()} - ${dialog.message()}`);
        await dialog.accept();
    });
};

// Browser selection logic
TestWorld.prototype.determineBrowserFromTags = function (tags: any[]): string {
    const tagNames = tags.map(tag => tag.name);
    
    if (tagNames.includes('@firefox')) return 'firefox';
    if (tagNames.includes('@safari') || tagNames.includes('@webkit')) return 'webkit';
    
    // Default to chromium
    return 'chromium';
};
```

### Advanced Screenshot and Video Capture

```typescript
// hooks/media-capture-hooks.ts
import { After, AfterStep } from '@cucumber/cucumber';
import { TestWorld } from './playwright-browser-management';
import * as fs from 'fs';
import * as path from 'path';

// Comprehensive screenshot capture strategy
After(async function (this: TestWorld, scenario) {
    if (!this.page) return;
    
    const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const status = scenario.result?.status || 'unknown';
    
    console.log(`📸 Capturing final screenshot for: ${scenarioName} (${status})`);
    
    try {
        // Always capture final screenshot
        const screenshot = await this.page.screenshot({
            fullPage: true,
            type: 'png',
            animations: 'disabled'
        });
        
        // Attach to Cucumber report
        this.attach(screenshot, 'image/png', `final-screenshot-${status}`);
        
        // Save to file system for debugging
        const screenshotDir = path.join('test-results', 'screenshots', this.browserName || 'unknown');
        fs.mkdirSync(screenshotDir, { recursive: true });
        
        const screenshotPath = path.join(screenshotDir, `${scenarioName}-${timestamp}-${status}.png`);
        fs.writeFileSync(screenshotPath, screenshot);
        
        console.log(`💾 Screenshot saved: ${screenshotPath}`);
        
        // Capture additional debugging info for failed scenarios
        if (status === 'FAILED') {
            await this.captureFailureArtifacts(scenarioName, timestamp);
        }
        
    } catch (error) {
        console.log(`⚠️ Failed to capture screenshot: ${error}`);
    }
});

// Step-by-step screenshot capture for debugging
AfterStep({ tags: '@step-screenshots' }, async function (this: TestWorld, { pickleStep }) {
    if (!this.page) return;
    
    const stepText = pickleStep.text.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    const stepNumber = this.stepCounter = (this.stepCounter || 0) + 1;
    
    try {
        const screenshot = await this.page.screenshot({
            type: 'png',
            animations: 'disabled'
        });
        
        this.attach(screenshot, 'image/png', `step-${stepNumber}-${stepText}`);
        console.log(`📷 Step screenshot captured: ${stepText}`);
    } catch (error) {
        console.log(`⚠️ Failed to capture step screenshot: ${error}`);
    }
});

// Performance monitoring screenshots
AfterStep({ tags: '@performance' }, async function (this: TestWorld, { pickleStep, result }) {
    if (!this.page || result.status === 'FAILED') return;
    
    try {
        // Capture performance metrics
        const performanceMetrics = await this.page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
                loadComplete: navigation.loadEventEnd - navigation.navigationStart,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
                largestContentfulPaint: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0
            };
        });
        
        // Attach performance data
        this.attach(
            JSON.stringify(performanceMetrics, null, 2),
            'application/json',
            'performance-metrics'
        );
        
        // Log slow operations
        if (performanceMetrics.loadComplete > 3000) {
            console.log(`⚠️ Slow page load detected: ${performanceMetrics.loadComplete}ms`);
            
            // Capture network timeline for slow loads
            const networkLogs = await this.page.evaluate(() => {
                return performance.getEntriesByType('resource').map(entry => ({
                    name: entry.name,
                    duration: entry.duration,
                    transferSize: (entry as PerformanceResourceTiming).transferSize
                })).sort((a, b) => b.duration - a.duration).slice(0, 10);
            });
            
            this.attach(
                JSON.stringify(networkLogs, null, 2),
                'application/json',
                'slow-resources'
            );
        }
        
    } catch (error) {
        console.log(`⚠️ Failed to capture performance metrics: ${error}`);
    }
});

// Comprehensive failure artifact capture
TestWorld.prototype.captureFailureArtifacts = async function (scenarioName: string, timestamp: string) {
    if (!this.page) return;
    
    console.log('🔍 Capturing comprehensive failure artifacts...');
    
    try {
        // Capture page HTML source
        const htmlContent = await this.page.content();
        this.attach(htmlContent, 'text/html', 'page-source');
        
        // Capture browser console logs
        const consoleLogs = await this.page.evaluate(() => {
            return (window as any).consoleLogs || [];
        });
        
        if (consoleLogs.length > 0) {
            this.attach(
                JSON.stringify(consoleLogs, null, 2),
                'application/json',
                'console-logs'
            );
        }
        
        // Capture network HAR file
        const harPath = path.join('test-results', 'har', `${scenarioName}-${timestamp}.har`);
        fs.mkdirSync(path.dirname(harPath), { recursive: true });
        
        // Note: HAR capture would require starting context with recordHar option
        
        // Capture accessibility violations if axe is available
        const axeResults = await this.page.evaluate(() => {
            if (typeof window.axe !== 'undefined') {
                return window.axe.run();
            }
            return null;
        });
        
        if (axeResults && axeResults.violations.length > 0) {
            this.attach(
                JSON.stringify(axeResults.violations, null, 2),
                'application/json',
                'accessibility-violations'
            );
        }
        
        // Capture current URL and navigation state
        const navigationInfo = {
            url: this.page.url(),
            title: await this.page.title(),
            userAgent: await this.page.evaluate(() => navigator.userAgent),
            viewport: this.page.viewportSize(),
            cookies: await this.context?.cookies(),
            localStorage: await this.page.evaluate(() => ({ ...localStorage })),
            sessionStorage: await this.page.evaluate(() => ({ ...sessionStorage }))
        };
        
        this.attach(
            JSON.stringify(navigationInfo, null, 2),
            'application/json',
            'navigation-info'
        );
        
        console.log('✅ Failure artifacts captured successfully');
        
    } catch (error) {
        console.log(`⚠️ Failed to capture some failure artifacts: ${error}`);
    }
};

// Cleanup browser context
After(async function (this: TestWorld, scenario) {
    const duration = Date.now() - (this.testMetrics?.startTime || Date.now());
    
    console.log(`🏁 Scenario completed: ${scenario.pickle.name}`);
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log(`🌐 Network requests: ${this.testMetrics?.networkRequests || 0}`);
    console.log(`❌ Errors: ${this.testMetrics?.errors.length || 0}`);
    
    // Log test metrics
    if (this.testMetrics) {
        this.testMetrics.endTime = Date.now();
        
        const metrics = {
            scenario: scenario.pickle.name,
            browser: this.browserName,
            duration,
            networkRequests: this.testMetrics.networkRequests,
            errors: this.testMetrics.errors,
            status: scenario.result?.status
        };
        
        this.attach(
            JSON.stringify(metrics, null, 2),
            'application/json',
            'test-metrics'
        );
    }
    
    // Close browser context
    try {
        if (this.context) {
            await this.context.close();
            console.log('🔧 Browser context closed');
        }
    } catch (error) {
        console.log(`⚠️ Error closing context: ${error}`);
    }
    
    // Reset world state
    this.page = undefined;
    this.context = undefined;
    this.testMetrics = undefined;
});
```

## Cross-Browser Testing Strategy

### Browser-Specific Feature Files

```gherkin
# features/cross-browser-compatibility.feature

@cross-browser @compatibility
Feature: Cross-Browser Compatibility Testing

  Background:
    Given the e-commerce platform is available

  @chrome @desktop @smoke
  Scenario: Chrome desktop user can complete purchase
    Given I am using Chrome on desktop
    When I add items to cart and checkout
    Then the purchase should complete successfully
    And the confirmation page should display correctly

  @firefox @desktop @regression
  Scenario: Firefox desktop user experiences consistent UI
    Given I am using Firefox on desktop
    When I navigate through the product catalog
    Then all UI elements should render consistently
    And interactive features should work properly

  @safari @webkit @mobile @ios
  Scenario: Safari mobile user can browse products
    Given I am using Safari on iOS mobile
    When I browse the product catalog
    Then the mobile interface should be fully functional
    And touch interactions should work smoothly

  @edge @desktop @accessibility
  Scenario: Edge browser supports accessibility features
    Given I am using Edge browser with accessibility tools
    When I navigate the site with keyboard only
    Then all functionality should be accessible
    And screen reader compatibility should be maintained

  @performance @chrome @desktop
  Scenario: Performance benchmarks in Chrome
    Given I am using Chrome for performance testing
    When I measure page load times
    Then pages should load within acceptable thresholds
    And resource usage should be optimized
```

### Browser-Specific Hook Configuration

```typescript
// hooks/browser-specific-hooks.ts
import { Before, After } from '@cucumber/cucumber';
import { TestWorld } from './playwright-browser-management';

// Chrome-specific optimizations
Before({ tags: '@chrome' }, async function (this: TestWorld) {
    console.log('🔧 Applying Chrome-specific optimizations');
    
    if (this.context) {
        // Enable Chrome DevTools features
        await this.context.addInitScript(() => {
            // Chrome-specific performance monitoring
            if ('chrome' in window) {
                console.log('Chrome DevTools available');
            }
        });
    }
});

// Firefox-specific configurations
Before({ tags: '@firefox' }, async function (this: TestWorld) {
    console.log('🦊 Applying Firefox-specific configurations');
    
    if (this.page) {
        // Firefox-specific workarounds
        await this.page.addInitScript(() => {
            // Handle Firefox-specific behaviors
            if (navigator.userAgent.includes('Firefox')) {
                console.log('Firefox-specific scripts loaded');
            }
        });
    }
});

// Safari/WebKit specific setup
Before({ tags: '@safari or @webkit' }, async function (this: TestWorld) {
    console.log('🧭 Applying Safari/WebKit configurations');
    
    if (this.page) {
        // Safari-specific handling
        await this.page.addInitScript(() => {
            // Handle Safari quirks
            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                console.log('Safari-specific handlers applied');
            }
        });
    }
});

// Performance testing specific setup
Before({ tags: '@performance' }, async function (this: TestWorld) {
    console.log('📊 Setting up performance monitoring');
    
    if (this.page) {
        // Clear cache for consistent performance testing
        await this.context?.clearCookies();
        await this.context?.clearPermissions();
        
        // Enable performance monitoring
        await this.page.addInitScript(() => {
            window.performanceData = {
                marks: [],
                measures: [],
                resources: []
            };
            
            // Mark test start
            performance.mark('test-start');
        });
    }
});

// Accessibility testing setup
Before({ tags: '@accessibility' }, async function (this: TestWorld) {
    console.log('♿ Setting up accessibility testing');
    
    if (this.page) {
        // Wait for axe-core to load
        await this.page.waitForFunction(() => typeof window.axe !== 'undefined', { timeout: 5000 });
        console.log('✅ Axe-core accessibility engine loaded');
    }
});
```

## Real-World Integration Example

### E-commerce Platform Testing

```gherkin
# features/e-commerce-comprehensive.feature

@e-commerce @integration
Feature: Comprehensive E-commerce Platform Testing

  Background:
    Given the e-commerce platform is available
    And I have test data prepared

  @smoke @critical @desktop @chrome @fast
  Scenario: Quick smoke test - Product search and view
    Given I am on the homepage
    When I search for "laptop"
    And I click on the first product
    Then I should see the product details page
    And all essential elements should be visible

  @regression @checkout @payment @integration @desktop
  @step-screenshots @performance
  Scenario: Complete purchase workflow with monitoring
    Given I have items in my shopping cart
    And I am logged in as a valid user
    When I proceed to checkout
    And I enter valid shipping information
    And I select a payment method
    And I complete the purchase
    Then I should see the order confirmation
    And I should receive an order confirmation email
    And the order should be stored in the database

  @mobile @ios @safari @responsive @accessibility
  Scenario: Mobile accessibility compliance check
    Given I am using an iOS device with Safari
    And I have accessibility features enabled
    When I navigate through the mobile site
    Then all content should be accessible via screen reader
    And touch targets should meet minimum size requirements
    And color contrast should meet WCAG guidelines

  @cross-browser @compatibility @regression
  Scenario Outline: Cross-browser user registration
    Given I am using <browser> on <platform>
    When I attempt to register a new account
    And I fill in all required information
    And I submit the registration form
    Then my account should be created successfully
    And I should receive a welcome email

    Examples:
      | browser | platform |
      | Chrome  | desktop  |
      | Firefox | desktop  |
      | Safari  | mobile   |
      | Edge    | desktop  |

  @performance @load-testing @slow @monitoring
  Scenario: Performance under simulated load
    Given the system is under simulated load
    When I perform typical user actions
    Then response times should remain acceptable
    And no performance degradation should occur
    And system resources should stay within limits
```

### Production Monitoring Integration

```typescript
// hooks/production-monitoring-hooks.ts
import { Before, After } from '@cucumber/cucumber';
import { TestWorld } from './playwright-browser-management';

// Production monitoring setup
Before({ tags: '@monitoring' }, async function (this: TestWorld) {
    console.log('📈 Setting up production monitoring');
    
    if (this.page) {
        // Setup Real User Monitoring (RUM)
        await this.page.addInitScript(() => {
            // Simulate RUM setup
            window.rumData = {
                pageViews: [],
                interactions: [],
                errors: [],
                performance: {}
            };
            
            // Track page views
            window.rumData.pageViews.push({
                url: location.href,
                timestamp: Date.now(),
                userAgent: navigator.userAgent
            });
        });
        
        // Monitor for critical user journeys
        this.page.on('response', (response) => {
            if (response.url().includes('/api/checkout') || 
                response.url().includes('/api/payment')) {
                console.log(`💳 Critical API response: ${response.status()} ${response.url()}`);
                
                if (!response.ok()) {
                    console.log('🚨 Critical API failure detected!');
                }
            }
        });
    }
});

// SLA monitoring
After({ tags: '@monitoring' }, async function (this: TestWorld, scenario) {
    if (!this.page || !this.testMetrics) return;
    
    const duration = Date.now() - this.testMetrics.startTime;
    
    // Check SLA compliance
    const slaThresholds = {
        '@fast': 2000,      // 2 seconds
        '@medium': 5000,    // 5 seconds
        '@slow': 15000      // 15 seconds
    };
    
    const tagNames = scenario.pickle.tags.map(tag => tag.name);
    let slaThreshold = 10000; // Default 10 seconds
    
    for (const [tag, threshold] of Object.entries(slaThresholds)) {
        if (tagNames.includes(tag)) {
            slaThreshold = threshold;
            break;
        }
    }
    
    const slaCompliant = duration <= slaThreshold;
    
    console.log(`⏱️ SLA Check: ${duration}ms (threshold: ${slaThreshold}ms) - ${slaCompliant ? '✅ PASS' : '❌ FAIL'}`);
    
    // Report SLA violations
    if (!slaCompliant) {
        const slaViolation = {
            scenario: scenario.pickle.name,
            actualDuration: duration,
            slaThreshold: slaThreshold,
            violation: duration - slaThreshold,
            browser: this.browserName,
            timestamp: new Date().toISOString()
        };
        
        this.attach(
            JSON.stringify(slaViolation, null, 2),
            'application/json',
            'sla-violation'
        );
        
        console.log('🚨 SLA violation reported');
    }
});
```

## Advanced Debugging Workflows

### Interactive Debugging Support

```typescript
// hooks/debugging-hooks.ts
import { Before, After, BeforeStep, AfterStep } from '@cucumber/cucumber';
import { TestWorld } from './playwright-browser-management';

// Interactive debugging setup
Before({ tags: '@debug' }, async function (this: TestWorld) {
    console.log('🐛 Debug mode enabled');
    
    if (this.page) {
        // Enable verbose logging
        await this.page.addInitScript(() => {
            window.debugMode = true;
            console.log('Debug mode active - verbose logging enabled');
        });
        
        // Add debug helper functions
        await this.page.exposeFunction('debugInfo', () => {
            return {
                url: this.page?.url(),
                title: this.page?.title(),
                viewport: this.page?.viewportSize()
            };
        });
    }
});

// Step-by-step execution with pauses
BeforeStep({ tags: '@step-by-step' }, async function (this: TestWorld, { pickleStep }) {
    console.log(`🔍 About to execute: ${pickleStep.text}`);
    
    if (process.env.INTERACTIVE_DEBUG === 'true') {
        console.log('Press Enter to continue...');
        await new Promise(resolve => {
            process.stdin.once('data', () => resolve(undefined));
        });
    }
});

// Comprehensive step debugging
AfterStep({ tags: '@debug' }, async function (this: TestWorld, { pickleStep, result }) {
    const stepText = pickleStep.text;
    const status = result.status;
    
    console.log(`🔍 Step completed: ${stepText} - ${status}`);
    
    if (this.page) {
        // Capture step state
        const stepState = await this.page.evaluate(() => ({
            url: location.href,
            title: document.title,
            activeElement: document.activeElement?.tagName,
            visibleText: document.body.innerText.substring(0, 200)
        }));
        
        console.log('📊 Step state:', JSON.stringify(stepState, null, 2));
        
        // Capture screenshot for debugging
        if (process.env.DEBUG_SCREENSHOTS === 'true') {
            const screenshot = await this.page.screenshot({ type: 'png' });
            this.attach(screenshot, 'image/png', `debug-step-${stepText.substring(0, 30)}`);
        }
    }
});

// Error analysis and recovery
After({ tags: '@debug' }, async function (this: TestWorld, scenario) {
    if (scenario.result?.status === 'FAILED' && this.page) {
        console.log('🔍 Performing detailed error analysis...');
        
        try {
            // Capture detailed error context
            const errorContext = await this.page.evaluate(() => {
                return {
                    currentUrl: location.href,
                    documentReadyState: document.readyState,
                    activeElement: {
                        tagName: document.activeElement?.tagName,
                        id: document.activeElement?.id,
                        className: document.activeElement?.className
                    },
                    visibleElements: Array.from(document.querySelectorAll('*'))
                        .filter(el => el.offsetParent !== null)
                        .slice(0, 10)
                        .map(el => ({
                            tagName: el.tagName,
                            id: el.id,
                            className: el.className
                        })),
                    lastError: window.lastError || null,
                    consoleErrors: window.consoleErrors || []
                };
            });
            
            this.attach(
                JSON.stringify(errorContext, null, 2),
                'application/json',
                'error-context'
            );
            
            console.log('✅ Error analysis complete');
            
        } catch (analysisError) {
            console.log('⚠️ Error during error analysis:', analysisError);
        }
    }
});
```

## Best Practices Summary

### 1. **Browser Lifecycle Management**
- Use global browser pools for efficiency
- Create fresh contexts for each scenario
- Implement proper cleanup patterns

### 2. **Tag-Based Configuration**
- Design tags for browser, platform, and feature targeting
- Use conditional hooks for environment-specific setup
- Implement tag-based performance thresholds

### 3. **Debugging and Monitoring**
- Capture comprehensive failure artifacts
- Implement performance monitoring with thresholds
- Provide interactive debugging capabilities

### 4. **Production Readiness**
- Monitor SLA compliance
- Implement cross-browser compatibility testing
- Provide comprehensive error reporting

### 5. **Performance Optimization**
- Use parallel execution where appropriate
- Implement smart screenshot and video capture
- Monitor resource usage and network activity

This comprehensive integration approach ensures robust, maintainable, and production-ready BDD test suites that effectively combine Cucumber's organizational capabilities with Playwright's powerful browser automation features.