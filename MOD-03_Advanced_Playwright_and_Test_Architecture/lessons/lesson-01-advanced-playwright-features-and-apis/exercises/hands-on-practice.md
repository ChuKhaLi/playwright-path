# Hands-on Practice: Advanced Playwright Features and APIs

## Overview

These progressive exercises will help you master advanced Playwright features through practical implementation. Each exercise builds upon the previous one, culminating in a comprehensive test suite that demonstrates professional-level automation capabilities.

## Prerequisites

- Playwright Test framework installed and configured
- TypeScript development environment
- Basic understanding of async/await and Playwright fundamentals
- Access to a test application or public website for practice

## Exercise 1: Browser Context Management

### Objective
Implement multi-user testing scenarios using browser contexts to simulate different user roles and permissions.

### Instructions

1. **Create a Multi-Context Test Suite**

```typescript
// exercises/context-management.spec.ts
import { test, expect, Browser, BrowserContext } from '@playwright/test';

test.describe('Multi-User Context Management', () => {
  let browser: Browser;
  let adminContext: BrowserContext;
  let userContext: BrowserContext;
  let guestContext: BrowserContext;

  test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    
    // TODO: Create three different browser contexts
    // 1. Admin context with admin permissions
    // 2. User context with standard user permissions  
    // 3. Guest context with no authentication
  });

  test.afterAll(async () => {
    // TODO: Clean up all contexts
  });

  test('Admin can access admin panel', async () => {
    // TODO: Implement admin-specific functionality test
  });

  test('User cannot access admin panel', async () => {
    // TODO: Verify user access restrictions
  });

  test('Guest has limited access', async () => {
    // TODO: Test guest user limitations
  });

  test('Parallel user actions', async () => {
    // TODO: Implement simultaneous actions by different users
  });
});
```

2. **Implementation Requirements**
   - Create contexts with different viewport sizes
   - Configure different user agents for each context
   - Implement proper context cleanup
   - Test parallel execution without interference

### Expected Output
- Three independent browser contexts operating simultaneously
- Verification of role-based access control
- No cross-contamination between user sessions
- Proper resource cleanup

### Validation Steps
1. Run tests and verify all contexts are created successfully
2. Confirm that admin actions don't affect user context
3. Validate that contexts maintain separate authentication states
4. Check that all contexts are properly closed after tests

## Exercise 2: Network Interception and API Mocking

### Objective
Implement comprehensive network interception to mock API responses and monitor network traffic.

### Instructions

1. **Create Network Interception Test Suite**

```typescript
// exercises/network-interception.spec.ts
import { test, expect, Page } from '@playwright/test';

interface ApiResponse {
  status: string;
  data: any;
  timestamp: string;
}

class NetworkInterceptor {
  private page: Page;
  private requests: string[] = [];
  private responses: Map<string, number> = new Map();

  constructor(page: Page) {
    this.page = page;
  }

  async setupMonitoring(): Promise<void> {
    // TODO: Implement request monitoring
    // TODO: Implement response monitoring
    // TODO: Track failed requests
  }

  async mockApiEndpoint(endpoint: string, mockData: any): Promise<void> {
    // TODO: Implement API endpoint mocking
  }

  async simulateNetworkDelay(delayMs: number): Promise<void> {
    // TODO: Add network delay simulation
  }

  getNetworkStats(): { requests: string[], responses: Map<string, number> } {
    return { requests: this.requests, responses: this.responses };
  }
}

test.describe('Network Interception', () => {
  test('Mock API responses for testing', async ({ page }) => {
    const interceptor = new NetworkInterceptor(page);
    await interceptor.setupMonitoring();

    // TODO: Mock user data API
    const mockUserData = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin'
    };

    // TODO: Navigate to application and verify mocked data is used
  });

  test('Monitor and validate network requests', async ({ page }) => {
    // TODO: Implement comprehensive network monitoring
    // TODO: Validate request headers and payloads
    // TODO: Check response status codes and timing
  });

  test('Simulate network failures', async ({ page }) => {
    // TODO: Simulate API failures
    // TODO: Test application error handling
    // TODO: Verify graceful degradation
  });
});
```

2. **Implementation Requirements**
   - Monitor all network requests and responses
   - Mock at least 3 different API endpoints
   - Simulate network delays and failures
   - Validate request/response data

### Expected Output
- Successful API response mocking
- Comprehensive network traffic monitoring
- Proper error handling validation
- Network performance metrics collection

### Validation Steps
1. Verify mocked responses are returned correctly
2. Confirm network monitoring captures all requests
3. Test application behavior with simulated failures
4. Validate performance metrics are collected

## Exercise 3: Mobile Device Emulation

### Objective
Implement comprehensive mobile testing including touch interactions, device orientation, and responsive design validation.

### Instructions

1. **Create Mobile Testing Suite**

```typescript
// exercises/mobile-emulation.spec.ts
import { test, expect, devices } from '@playwright/test';

const mobileDevices = [
  'iPhone 13',
  'iPhone 13 Pro',
  'Pixel 5',
  'Galaxy S21'
];

class MobileTestHelper {
  static async performSwipeGesture(page: Page, direction: 'left' | 'right' | 'up' | 'down'): Promise<void> {
    // TODO: Implement swipe gesture simulation
  }

  static async testResponsiveBreakpoints(page: Page): Promise<void> {
    const breakpoints = [
      { width: 320, height: 568 },  // iPhone SE
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // iPad Landscape
      { width: 1920, height: 1080 } // Desktop
    ];

    // TODO: Test each breakpoint
    // TODO: Verify responsive design elements
  }

  static async testTouchInteractions(page: Page): Promise<void> {
    // TODO: Implement touch-specific interactions
    // TODO: Test tap, double-tap, long press
  }
}

for (const deviceName of mobileDevices) {
  test.describe(`Mobile Testing - ${deviceName}`, () => {
    test.use({ ...devices[deviceName] });

    test('Responsive design validation', async ({ page }) => {
      // TODO: Test responsive layout
      // TODO: Verify mobile-specific elements
      // TODO: Check touch target sizes
    });

    test('Touch interactions', async ({ page }) => {
      // TODO: Test touch gestures
      // TODO: Verify swipe navigation
      // TODO: Test pinch-to-zoom (if applicable)
    });

    test('Device orientation changes', async ({ page, context }) => {
      // TODO: Test portrait orientation
      // TODO: Change to landscape
      // TODO: Verify layout adaptation
    });
  });
}
```

2. **Implementation Requirements**
   - Test on at least 4 different mobile devices
   - Implement touch gesture simulation
   - Validate responsive design breakpoints
   - Test device orientation changes

### Expected Output
- Successful mobile device emulation
- Functional touch gesture interactions
- Responsive design validation across devices
- Proper orientation change handling

### Validation Steps
1. Verify tests run successfully on all device configurations
2. Confirm touch gestures work as expected
3. Validate responsive elements appear/disappear correctly
4. Test orientation changes don't break functionality

## Exercise 4: Performance Monitoring Integration

### Objective
Implement comprehensive performance monitoring that measures and validates application performance metrics.

### Instructions

1. **Create Performance Testing Suite**

```typescript
// exercises/performance-monitoring.spec.ts
import { test, expect, Page } from '@playwright/test';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

class PerformanceMonitor {
  private page: Page;
  private thresholds: PerformanceMetrics;

  constructor(page: Page, thresholds: PerformanceMetrics) {
    this.page = page;
    this.thresholds = thresholds;
  }

  async measurePagePerformance(url: string): Promise<PerformanceMetrics> {
    // TODO: Implement comprehensive performance measurement
    // TODO: Collect Core Web Vitals
    // TODO: Measure custom metrics
    throw new Error('Not implemented');
  }

  async validatePerformance(metrics: PerformanceMetrics): Promise<void> {
    // TODO: Compare metrics against thresholds
    // TODO: Generate performance report
  }

  async monitorResourceLoading(): Promise<void> {
    // TODO: Monitor resource loading times
    // TODO: Identify slow resources
    // TODO: Check for failed resources
  }
}

test.describe('Performance Monitoring', () => {
  const performanceThresholds: PerformanceMetrics = {
    loadTime: 3000,
    domContentLoaded: 1500,
    firstPaint: 1000,
    firstContentfulPaint: 1200,
    largestContentfulPaint: 2500,
    cumulativeLayoutShift: 0.1,
    firstInputDelay: 100
  };

  test('Measure and validate page load performance', async ({ page }) => {
    const monitor = new PerformanceMonitor(page, performanceThresholds);
    
    // TODO: Measure performance for main pages
    // TODO: Validate against thresholds
    // TODO: Generate performance report
  });

  test('Monitor resource loading performance', async ({ page }) => {
    // TODO: Track all resource loading
    // TODO: Identify performance bottlenecks
    // TODO: Validate resource optimization
  });

  test('Test performance under load', async ({ page }) => {
    // TODO: Simulate multiple concurrent users
    // TODO: Measure performance degradation
    // TODO: Validate scalability
  });
});
```

2. **Implementation Requirements**
   - Measure Core Web Vitals (LCP, FID, CLS)
   - Monitor resource loading times
   - Validate performance against thresholds
   - Generate performance reports

### Expected Output
- Comprehensive performance metrics collection
- Validation against performance thresholds
- Identification of performance bottlenecks
- Detailed performance reporting

### Validation Steps
1. Verify all performance metrics are collected accurately
2. Confirm threshold validation works correctly
3. Test performance monitoring under different conditions
4. Validate performance reports are generated

## Exercise 5: Comprehensive Integration

### Objective
Combine all advanced features into a comprehensive test suite that demonstrates professional-level automation capabilities.

### Instructions

1. **Create Integrated Test Suite**

```typescript
// exercises/comprehensive-integration.spec.ts
import { test, expect } from '@playwright/test';

class AdvancedTestFramework {
  // TODO: Integrate all previous exercises
  // TODO: Create a comprehensive test scenario
  // TODO: Demonstrate professional automation practices
}

test.describe('Comprehensive Advanced Features Integration', () => {
  test('End-to-end scenario with all advanced features', async ({ page, context, browser }) => {
    // TODO: Use browser contexts for multi-user scenario
    // TODO: Implement network interception for API mocking
    // TODO: Include mobile device testing
    // TODO: Monitor performance throughout the test
    // TODO: Use advanced debugging and tracing
  });
});
```

2. **Implementation Requirements**
   - Integrate all four previous exercises
   - Create a realistic end-to-end scenario
   - Demonstrate professional coding practices
   - Include comprehensive error handling

### Expected Output
- Fully integrated test suite using all advanced features
- Professional-quality code organization
- Comprehensive test coverage
- Detailed reporting and logging

### Validation Steps
1. Run the complete integrated test suite
2. Verify all advanced features work together
3. Confirm professional code quality standards
4. Validate comprehensive test reporting

## Success Criteria

You have successfully completed these exercises when:

- [ ] All five exercises run without errors
- [ ] Browser contexts are properly managed and isolated
- [ ] Network interception works for monitoring and mocking
- [ ] Mobile device emulation functions correctly
- [ ] Performance monitoring provides accurate metrics
- [ ] Integrated test suite demonstrates professional practices
- [ ] Code follows TypeScript and Playwright best practices
- [ ] All tests include proper error handling and cleanup

## Troubleshooting Guide

### Common Issues

1. **Context Management Problems**
   - Ensure contexts are properly closed
   - Check for memory leaks with multiple contexts
   - Verify context isolation is working

2. **Network Interception Issues**
   - Confirm route patterns match intended requests
   - Check for timing issues with async operations
   - Verify mock data format matches expected structure

3. **Mobile Emulation Problems**
   - Ensure device configurations are valid
   - Check viewport settings for responsive design
   - Verify touch events are properly simulated

4. **Performance Monitoring Challenges**
   - Confirm performance APIs are available
   - Check for timing measurement accuracy
   - Verify threshold values are realistic

### Getting Help

- Review the lesson content for detailed explanations
- Check the official Playwright documentation
- Use the Playwright Inspector for debugging
- Consult the troubleshooting resources in the module

---

**Next Steps**: After completing these exercises, proceed to the lesson assessment to validate your understanding, then continue to Lesson 3.2 to learn about organizing this advanced functionality using the Page Object Model design pattern.