# Knowledge Check: Advanced Playwright Features and APIs

## Assessment Overview

This assessment validates your understanding of advanced Playwright features and APIs through a combination of theoretical knowledge checks and practical implementation tasks. Complete all sections to demonstrate mastery of the lesson objectives.

**Time Allocation**: 45 minutes
**Passing Score**: 80% (24/30 points)
**Assessment Type**: Mixed (Multiple Choice, Code Analysis, Practical Implementation)

## Section A: Conceptual Understanding (10 points)

### Question 1 (2 points)
**Multiple Choice**: Which of the following best describes the primary benefit of using browser contexts in Playwright?

a) Faster test execution through parallel processing
b) Isolated browser sessions that don't share cookies, localStorage, or cache
c) Reduced memory usage compared to multiple browser instances
d) Automatic cleanup of browser resources

**Correct Answer**: b) Isolated browser sessions that don't share cookies, localStorage, or cache

### Question 2 (2 points)
**Multiple Choice**: When implementing network interception in Playwright, which method allows you to modify request headers before they are sent?

a) `page.route()`
b) `page.on('request')`
c) `page.on('response')`
d) `page.setExtraHTTPHeaders()`

**Correct Answer**: a) `page.route()`

### Question 3 (3 points)
**Short Answer**: Explain the difference between `page.route()` and `page.on('request')` in terms of functionality and use cases. Provide a specific example of when you would use each.

**Sample Answer**: 
- `page.route()` allows you to intercept and modify requests before they are sent, including changing headers, body, or completely mocking responses. Use when you need to mock API responses or modify request data.
- `page.on('request')` is an event listener that monitors requests but cannot modify them. Use when you need to log, analyze, or validate requests without changing them.

**Example**: Use `page.route()` to mock a user API endpoint during testing, use `page.on('request')` to verify that analytics tracking requests are being sent correctly.

### Question 4 (3 points)
**Short Answer**: List three Core Web Vitals metrics that can be measured using Playwright's performance monitoring capabilities and explain why each is important for user experience.

**Sample Answer**:
1. **Largest Contentful Paint (LCP)**: Measures loading performance - important because it indicates when the main content becomes visible to users
2. **First Input Delay (FID)**: Measures interactivity - important because it shows how quickly users can interact with the page
3. **Cumulative Layout Shift (CLS)**: Measures visual stability - important because unexpected layout shifts can cause users to accidentally click wrong elements

## Section B: Code Analysis (10 points)

### Question 5 (5 points)
**Code Analysis**: Review the following code snippet and identify three issues or improvements. Explain each issue and provide the corrected code.

```typescript
// Problematic Code
import { test, expect } from '@playwright/test';

test('mobile testing', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('https://example.com');
  
  // Touch interaction
  await page.click('#menu-button');
  
  // Check mobile menu
  const menu = page.locator('.mobile-menu');
  await expect(menu).toBeVisible();
  
  // Performance check
  const loadTime = await page.evaluate(() => {
    return performance.timing.loadEventEnd - performance.timing.navigationStart;
  });
  
  console.log('Load time:', loadTime);
});
```

**Issues and Solutions**:

1. **Issue**: Using `page.click()` instead of touch-specific interaction
   **Solution**: Use `page.tap()` for mobile touch interactions
   ```typescript
   await page.tap('#menu-button');
   ```

2. **Issue**: Using deprecated `performance.timing` API
   **Solution**: Use modern Performance API
   ```typescript
   const loadTime = await page.evaluate(() => {
     const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
     return navigation.loadEventEnd - navigation.fetchStart;
   });
   ```

3. **Issue**: No proper device emulation configuration
   **Solution**: Use device presets or proper mobile configuration
   ```typescript
   test.use({ ...devices['iPhone 13'] });
   // OR
   await page.setViewportSize({ width: 375, height: 667 });
   await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)...');
   ```

### Question 6 (5 points)
**Code Analysis**: Examine this network interception code and explain what it does. Then, identify one potential issue and suggest an improvement.

```typescript
test('api mocking', async ({ page }) => {
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 1, name: 'Test User' }])
    });
  });
  
  await page.goto('/dashboard');
  const userList = page.locator('.user-list');
  await expect(userList).toContainText('Test User');
});
```

**Explanation**: This code intercepts all requests to endpoints matching `**/api/users` and returns a mocked response with a single test user instead of making the actual API call.

**Issue**: Missing Content-Type header in the mocked response
**Improvement**: 
```typescript
route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify([{ id: 1, name: 'Test User' }])
});
```

## Section C: Practical Implementation (10 points)

### Question 7 (10 points)
**Practical Task**: Implement a comprehensive test function that demonstrates the integration of multiple advanced Playwright features. Your implementation should include:

1. Browser context management (2 points)
2. Network interception with request monitoring (3 points)
3. Mobile device emulation (2 points)
4. Performance measurement (3 points)

**Requirements**:
- Create two browser contexts (admin and user)
- Mock at least one API endpoint
- Monitor network requests
- Test on a mobile device
- Measure and validate page load time
- Include proper error handling and cleanup

**Sample Solution**:

```typescript
import { test, expect, devices, Browser, BrowserContext } from '@playwright/test';

test('comprehensive advanced features integration', async ({ browser }) => {
  let adminContext: BrowserContext;
  let userContext: BrowserContext;
  const networkRequests: string[] = [];
  
  try {
    // 1. Browser Context Management (2 points)
    adminContext = await browser.newContext({
      ...devices['iPhone 13'],
      extraHTTPHeaders: {
        'Authorization': 'Bearer admin-token'
      }
    });
    
    userContext = await browser.newContext({
      ...devices['iPhone 13'],
      extraHTTPHeaders: {
        'Authorization': 'Bearer user-token'
      }
    });
    
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();
    
    // 2. Network Interception with Request Monitoring (3 points)
    await adminPage.route('**/api/admin/users', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          users: [{ id: 1, name: 'Admin User', role: 'admin' }]
        })
      });
    });
    
    adminPage.on('request', request => {
      networkRequests.push(request.url());
    });
    
    userPage.on('request', request => {
      networkRequests.push(request.url());
    });
    
    // 3. Mobile Device Emulation (2 points)
    // Already configured in context creation with iPhone 13 preset
    
    // 4. Performance Measurement (3 points)
    const startTime = Date.now();
    
    await Promise.all([
      adminPage.goto('/admin/dashboard'),
      userPage.goto('/user/dashboard')
    ]);
    
    const adminLoadTime = await adminPage.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation.loadEventEnd - navigation.fetchStart;
    });
    
    const userLoadTime = await userPage.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation.loadEventEnd - navigation.fetchStart;
    });
    
    // Validate performance
    expect(adminLoadTime).toBeLessThan(3000); // 3 second threshold
    expect(userLoadTime).toBeLessThan(3000);
    
    // Validate contexts are isolated
    const adminTitle = await adminPage.title();
    const userTitle = await userPage.title();
    
    expect(adminTitle).toContain('Admin');
    expect(userTitle).toContain('Dashboard');
    
    // Validate network monitoring
    expect(networkRequests.length).toBeGreaterThan(0);
    expect(networkRequests.some(url => url.includes('/api/admin/users'))).toBeTruthy();
    
  } finally {
    // Proper cleanup
    if (adminContext) await adminContext.close();
    if (userContext) await userContext.close();
  }
});
```

**Grading Criteria**:
- **Browser Context Management (2 points)**: Creates multiple contexts with proper configuration
- **Network Interception (3 points)**: Implements route mocking and request monitoring
- **Mobile Device Emulation (2 points)**: Uses device presets or proper mobile configuration
- **Performance Measurement (3 points)**: Measures load times and validates against thresholds
- **Bonus (1 point)**: Includes comprehensive error handling and cleanup

## Assessment Rubric

### Scoring Guide

| Score Range | Grade | Description |
|-------------|-------|-------------|
| 27-30 points | A | Excellent understanding of all concepts with high-quality implementation |
| 24-26 points | B | Good understanding with minor gaps or implementation issues |
| 21-23 points | C | Satisfactory understanding but needs improvement in some areas |
| 18-20 points | D | Basic understanding but significant gaps in knowledge or implementation |
| Below 18 | F | Insufficient understanding - requires additional study and practice |

### Detailed Rubric

**Section A - Conceptual Understanding (10 points)**
- **Excellent (9-10)**: All concepts clearly understood, accurate explanations
- **Good (7-8)**: Most concepts understood with minor inaccuracies
- **Satisfactory (5-6)**: Basic understanding but some confusion evident
- **Needs Improvement (0-4)**: Significant gaps in conceptual understanding

**Section B - Code Analysis (10 points)**
- **Excellent (9-10)**: Identifies all issues, provides correct solutions with explanations
- **Good (7-8)**: Identifies most issues with generally correct solutions
- **Satisfactory (5-6)**: Identifies some issues but solutions may be incomplete
- **Needs Improvement (0-4)**: Fails to identify major issues or provides incorrect solutions

**Section C - Practical Implementation (10 points)**
- **Excellent (9-10)**: Complete, working implementation with all requirements met
- **Good (7-8)**: Implementation works but missing some requirements or has minor issues
- **Satisfactory (5-6)**: Basic implementation but significant gaps or errors
- **Needs Improvement (0-4)**: Implementation doesn't work or missing major components

## Remediation Resources

If you score below 80%, review these resources before retaking the assessment:

### For Section A (Conceptual Understanding)
- Re-read the lesson content on browser contexts and network interception
- Review the official Playwright documentation on advanced features
- Complete the hands-on practice exercises again

### For Section B (Code Analysis)
- Practice identifying common Playwright anti-patterns
- Study the TypeScript best practices guide
- Review mobile testing and performance monitoring examples

### For Section C (Practical Implementation)
- Work through the hands-on exercises step by step
- Practice integrating multiple Playwright features
- Get feedback on your code from peers or instructors

## Next Steps

After successfully completing this assessment:

1. **Portfolio Development**: Add your comprehensive test implementation to your portfolio
2. **Peer Review**: Share your solutions with classmates for feedback
3. **Advanced Practice**: Try implementing these features in a real project
4. **Next Lesson**: Proceed to Lesson 3.2 - Page Object Model (POM) Design Pattern

---

**Assessment Completion**: Submit your answers and code implementations through the learning management system. You will receive detailed feedback within 48 hours.

**Retake Policy**: If needed, you may retake this assessment after a 24-hour waiting period and completing the recommended remediation activities.