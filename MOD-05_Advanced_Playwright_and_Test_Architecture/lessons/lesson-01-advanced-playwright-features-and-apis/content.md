# Advanced Playwright Features and APIs

## Introduction

While basic Playwright operations like clicking buttons and filling forms are essential, professional test automation requires mastering advanced features that enable sophisticated testing scenarios. This lesson explores powerful Playwright capabilities that distinguish professional-grade automation from simple scripts.

Think of basic Playwright as learning to drive a car in an empty parking lot, while advanced features are like mastering highway driving, parallel parking, and navigating complex traffic situations. Both are necessary, but the advanced skills make you a truly capable driver.

## 1. Browser Contexts: Isolation and Parallel Execution

### Understanding Browser Contexts

A browser context is like having multiple independent browser sessions within a single browser instance. Each context maintains its own:
- Cookies and session storage
- Local storage and cache
- Authentication state
- Permissions and settings

```typescript
import { test, expect, Browser, BrowserContext } from '@playwright/test';

// Creating multiple contexts for different user scenarios
test('Multiple user contexts example', async ({ browser }) => {
  // Create context for admin user
  const adminContext: BrowserContext = await browser.newContext({
    storageState: 'admin-auth.json', // Pre-saved authentication
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Admin-Test-Agent'
  });
  
  // Create context for regular user
  const userContext: BrowserContext = await browser.newContext({
    storageState: 'user-auth.json',
    viewport: { width: 1366, height: 768 }
  });
  
  // Both contexts operate independently
  const adminPage = await adminContext.newPage();
  const userPage = await userContext.newPage();
  
  // Navigate both users simultaneously
  await Promise.all([
    adminPage.goto('https://example.com/admin'),
    userPage.goto('https://example.com/dashboard')
  ]);
  
  // Verify different access levels
  await expect(adminPage.locator('[data-testid="admin-panel"]')).toBeVisible();
  await expect(userPage.locator('[data-testid="admin-panel"]')).not.toBeVisible();
  
  // Clean up contexts
  await adminContext.close();
  await userContext.close();
});
```

### Context Configuration Options

```typescript
// Comprehensive context configuration
const context = await browser.newContext({
  // Viewport and device settings
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
  isMobile: false,
  hasTouch: false,
  
  // Network and security
  ignoreHTTPSErrors: true,
  bypassCSP: true,
  
  // Permissions
  permissions: ['geolocation', 'notifications'],
  geolocation: { latitude: 37.7749, longitude: -122.4194 },
  
  // Media and recording
  recordVideo: { dir: 'test-videos/' },
  recordHar: { path: 'network-logs.har' },
  
  // Authentication and storage
  storageState: 'saved-session.json',
  
  // Custom headers
  extraHTTPHeaders: {
    'X-Test-Environment': 'automation',
    'Authorization': 'Bearer test-token'
  }
});
```

## 2. Network Interception and Manipulation

### Request and Response Interception

Network interception allows you to monitor, modify, or mock HTTP traffic, enabling powerful testing scenarios:

```typescript
test('Network interception examples', async ({ page }) => {
  // Monitor all network requests
  const requests: string[] = [];
  page.on('request', request => {
    requests.push(`${request.method()} ${request.url()}`);
    console.log(`Request: ${request.method()} ${request.url()}`);
  });
  
  // Monitor responses and check status codes
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`Error response: ${response.status()} ${response.url()}`);
    }
  });
  
  // Intercept and modify requests
  await page.route('**/api/users', async (route, request) => {
    // Modify request headers
    const headers = {
      ...request.headers(),
      'X-Custom-Header': 'test-value',
      'Authorization': 'Bearer mock-token'
    };
    
    // Continue with modified request
    await route.continue({ headers });
  });
  
  // Mock API responses
  await page.route('**/api/config', async (route) => {
    const mockResponse = {
      environment: 'test',
      features: {
        newFeature: true,
        betaFeature: false
      },
      apiVersion: '2.0'
    };
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponse)
    });
  });
  
  await page.goto('https://example.com');
  
  // Verify network interactions
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.some(req => req.includes('/api/config'))).toBeTruthy();
});
```

### Advanced Network Scenarios

```typescript
// Simulating network conditions
test('Network condition simulation', async ({ page }) => {
  // Simulate slow network
  await page.route('**/*', async (route) => {
    // Add delay to simulate slow connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    await route.continue();
  });
  
  // Simulate network failures
  await page.route('**/api/unreliable', async (route) => {
    // Randomly fail requests to test error handling
    if (Math.random() < 0.3) {
      await route.abort('failed');
    } else {
      await route.continue();
    }
  });
  
  const startTime = Date.now();
  await page.goto('https://example.com');
  const loadTime = Date.now() - startTime;
  
  // Verify application handles slow network gracefully
  expect(loadTime).toBeGreaterThan(1000);
  await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
});
```

## 3. Mobile Device Emulation

### Device Configuration

```typescript
import { devices } from '@playwright/test';

test('Mobile device emulation', async ({ browser }) => {
  // Use predefined device configurations
  const iPhone13 = devices['iPhone 13'];
  const context = await browser.newContext({
    ...iPhone13,
    // Override specific settings
    locale: 'en-US',
    timezoneId: 'America/New_York'
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com');
  
  // Verify mobile-specific elements
  await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  await expect(page.locator('[data-testid="desktop-nav"]')).not.toBeVisible();
  
  await context.close();
});

// Custom mobile configuration
test('Custom mobile setup', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page = await context.newPage();
  
  // Test touch interactions
  await page.goto('https://example.com/touch-demo');
  
  // Tap gesture
  await page.locator('[data-testid="touch-target"]').tap();
  
  // Swipe gesture simulation
  const element = page.locator('[data-testid="swipeable"]');
  const box = await element.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 100, box.y + box.height / 2);
    await page.mouse.up();
  }
  
  await context.close();
});
```

### Geolocation and Device Features

```typescript
test('Geolocation and device features', async ({ browser }) => {
  const context = await browser.newContext({
    geolocation: { latitude: 37.7749, longitude: -122.4194 },
    permissions: ['geolocation']
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com/location-app');
  
  // Test geolocation functionality
  await page.click('[data-testid="get-location"]');
  await expect(page.locator('[data-testid="location-display"]')).toContainText('San Francisco');
  
  // Change location during test
  await context.setGeolocation({ latitude: 40.7128, longitude: -74.0060 });
  await page.click('[data-testid="refresh-location"]');
  await expect(page.locator('[data-testid="location-display"]')).toContainText('New York');
  
  await context.close();
});
```

## 4. Advanced Debugging and Tracing

### Playwright Inspector Integration

```typescript
test('Advanced debugging techniques', async ({ page }) => {
  // Enable tracing for detailed execution analysis
  await page.context().tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
  });
  
  try {
    await page.goto('https://example.com');
    
    // Pause execution for manual inspection
    // Uncomment for interactive debugging
    // await page.pause();
    
    // Take screenshots at key points
    await page.screenshot({ path: 'debug-step-1.png', fullPage: true });
    
    await page.click('[data-testid="complex-interaction"]');
    await page.screenshot({ path: 'debug-step-2.png', fullPage: true });
    
    // Verify expected outcome
    await expect(page.locator('[data-testid="result"]')).toBeVisible();
    
  } finally {
    // Save trace for analysis
    await page.context().tracing.stop({ path: 'trace.zip' });
  }
});
```

### Performance Profiling

```typescript
test('Performance monitoring', async ({ page }) => {
  // Start performance monitoring
  await page.coverage.startJSCoverage();
  await page.coverage.startCSSCoverage();
  
  const startTime = Date.now();
  await page.goto('https://example.com');
  
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  
  // Get performance metrics
  const performanceMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
      firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
    };
  });
  
  // Get code coverage
  const jsCoverage = await page.coverage.stopJSCoverage();
  const cssCoverage = await page.coverage.stopCSSCoverage();
  
  // Assert performance criteria
  expect(loadTime).toBeLessThan(5000); // Page should load within 5 seconds
  expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
  
  // Log coverage information
  console.log(`JS Coverage: ${jsCoverage.length} files`);
  console.log(`CSS Coverage: ${cssCoverage.length} files`);
  console.log(`Performance metrics:`, performanceMetrics);
});
```

## 5. Performance Monitoring Integration

### Comprehensive Performance Testing

```typescript
class PerformanceMonitor {
  private page: Page;
  private metrics: Map<string, number> = new Map();
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async startMonitoring(): Promise<void> {
    // Monitor network requests
    this.page.on('response', (response) => {
      const url = response.url();
      const status = response.status();
      const timing = response.timing();
      
      if (timing.responseEnd > 1000) {
        console.warn(`Slow response: ${url} took ${timing.responseEnd}ms`);
      }
      
      if (status >= 400) {
        console.error(`Failed request: ${url} returned ${status}`);
      }
    });
    
    // Monitor console errors
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`Console error: ${msg.text()}`);
      }
    });
  }
  
  async measurePageLoad(url: string): Promise<PerformanceMetrics> {
    const startTime = Date.now();
    
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const totalLoadTime = endTime - startTime;
    
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      return {
        navigationStart: navigation.navigationStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        totalLoadTime
      };
    });
    
    return metrics;
  }
  
  async assertPerformanceThresholds(metrics: PerformanceMetrics): Promise<void> {
    expect(metrics.totalLoadTime).toBeLessThan(5000);
    expect(metrics.domContentLoaded).toBeLessThan(2000);
    expect(metrics.firstContentfulPaint).toBeLessThan(1500);
  }
}

interface PerformanceMetrics {
  navigationStart: number;
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  totalLoadTime: number;
}

test('Comprehensive performance testing', async ({ page }) => {
  const monitor = new PerformanceMonitor(page);
  await monitor.startMonitoring();
  
  const metrics = await monitor.measurePageLoad('https://example.com');
  await monitor.assertPerformanceThresholds(metrics);
  
  console.log('Performance metrics:', metrics);
});
```

## Best Practices and Common Pitfalls

### Best Practices

1. **Context Management**: Always close contexts to prevent memory leaks
2. **Network Interception**: Use specific route patterns to avoid intercepting unnecessary requests
3. **Mobile Testing**: Test on multiple device configurations, not just one
4. **Performance Monitoring**: Set realistic thresholds based on your application's requirements
5. **Debugging**: Use tracing and screenshots strategically, not for every test

### Common Pitfalls

1. **Over-intercepting**: Intercepting too many requests can slow down tests
2. **Context Pollution**: Reusing contexts between tests can cause unexpected behavior
3. **Unrealistic Performance Expectations**: Setting thresholds too strict for the testing environment
4. **Debugging in Production**: Leaving debug code enabled in production test runs

## Summary

Advanced Playwright features transform basic automation scripts into sophisticated testing solutions. Browser contexts enable complex multi-user scenarios, network interception allows API mocking and monitoring, mobile emulation ensures responsive design validation, and performance monitoring provides insights into application behavior.

These capabilities are essential for professional test automation that can handle real-world complexity and provide valuable insights beyond simple pass/fail results. In the next lesson, we'll explore how to organize this advanced functionality using the Page Object Model design pattern.

## Key Takeaways

- **Browser contexts** provide isolation and enable parallel testing scenarios
- **Network interception** allows request/response manipulation and API mocking
- **Mobile emulation** ensures comprehensive responsive design testing
- **Advanced debugging** tools provide detailed insights into test execution
- **Performance monitoring** validates application performance under test conditions
- **Professional practices** require careful resource management and realistic expectations