# Example 04: Advanced Patterns and Debugging

## Overview

This example covers advanced step definition patterns, debugging techniques, performance optimization, and error handling strategies. You'll learn professional-level techniques for creating robust, maintainable, and debuggable step definitions that can handle complex scenarios and edge cases.

## Learning Objectives

- Implement advanced error handling and recovery strategies
- Master debugging techniques for step definitions
- Apply performance optimization patterns
- Create custom parameter types and transformations
- Handle complex async operations and timing issues
- Implement logging and monitoring for step definitions

## Advanced Error Handling

### Comprehensive Error Management

```typescript
// step-definitions/advanced-error-handling.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

class StepExecutionError extends Error {
  constructor(
    message: string,
    public stepType: string,
    public stepText: string,
    public context?: any
  ) {
    super(message);
    this.name = 'StepExecutionError';
  }
}

When('I attempt a risky operation that might fail', async function (this: CustomWorld) {
  const stepContext = {
    stepType: 'When',
    stepText: 'I attempt a risky operation that might fail',
    timestamp: new Date().toISOString(),
    url: this.page?.url(),
    userAgent: await this.page?.evaluate(() => navigator.userAgent)
  };

  try {
    // Simulate a potentially failing operation
    await this.performRiskyOperation();
    
  } catch (error) {
    // Enhanced error logging
    const enhancedError = new StepExecutionError(
      `Risky operation failed: ${error.message}`,
      stepContext.stepType,
      stepContext.stepText,
      {
        ...stepContext,
        originalError: error,
        stackTrace: error.stack
      }
    );

    // Store error in World for later analysis
    this.errors.push(enhancedError);
    
    // Take diagnostic screenshot
    await this.captureErrorDiagnostics(enhancedError);
    
    // Attempt recovery
    const recovered = await this.attemptErrorRecovery();
    
    if (!recovered) {
      throw enhancedError;
    }
    
    console.log('✅ Recovered from error, continuing execution');
  }
});

// Error recovery implementation
async function attemptErrorRecovery(this: CustomWorld): Promise<boolean> {
  try {
    // Try to get back to a known good state
    await this.page?.goto('/dashboard');
    await this.page?.waitForSelector('[data-testid="dashboard-loaded"]', { timeout: 5000 });
    
    // Verify recovery was successful
    const isRecovered = await this.page?.isVisible('[data-testid="dashboard-loaded"]');
    return isRecovered || false;
    
  } catch (recoveryError) {
    console.error('Recovery failed:', recoveryError);
    return false;
  }
}

async function captureErrorDiagnostics(this: CustomWorld, error: StepExecutionError): Promise<void> {
  const timestamp = Date.now();
  
  try {
    // Capture screenshot
    await this.page?.screenshot({
      path: `screenshots/error-${timestamp}.png`,
      fullPage: true
    });
    
    // Capture page HTML
    const html = await this.page?.content();
    if (html) {
      require('fs').writeFileSync(`debug/page-content-${timestamp}.html`, html);
    }
    
    // Capture console logs
    const consoleLogs = this.testData.consoleLogs || [];
    require('fs').writeFileSync(
      `debug/console-logs-${timestamp}.json`, 
      JSON.stringify(consoleLogs, null, 2)
    );
    
    // Log comprehensive error information
    console.error('Error Diagnostics:', {
      error: error.message,
      context: error.context,
      screenshot: `screenshots/error-${timestamp}.png`,
      htmlDump: `debug/page-content-${timestamp}.html`,
      consoleLogs: `debug/console-logs-${timestamp}.json`
    });
    
  } catch (diagnosticError) {
    console.error('Failed to capture diagnostics:', diagnosticError);
  }
}
```

### Retry Mechanisms

```typescript
// Advanced retry patterns
When('I perform operation with retry logic', async function (this: CustomWorld) {
  const maxRetries = 3;
  const retryDelay = 1000;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await this.performComplexOperation();
      console.log(`✅ Operation succeeded on attempt ${attempt}`);
      return; // Success, exit retry loop
      
    } catch (error) {
      console.warn(`⚠️ Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        // Final attempt failed
        await this.captureFailureState();
        throw new Error(`Operation failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retrying
      await this.page?.waitForTimeout(retryDelay * attempt);
      
      // Optional: Perform recovery actions between retries
      await this.prepareForRetry();
    }
  }
});

async function prepareForRetry(this: CustomWorld): Promise<void> {
  // Refresh page or reset state before retry
  await this.page?.reload();
  await this.page?.waitForLoadState('networkidle');
}
```

## Advanced Debugging Techniques

### Debug Mode Implementation

```typescript
// support/debug-helper.ts
export class DebugHelper {
  constructor(private world: CustomWorld) {}

  async enableDebugMode(): Promise<void> {
    if (process.env.DEBUG_MODE === 'true') {
      // Enable verbose logging
      console.log('🐛 Debug mode enabled');
      
      // Slow down execution for observation
      await this.world.page?.addInitScript(() => {
        (window as any).debugMode = true;
      });
      
      // Add visual debugging indicators
      await this.world.page?.addStyleTag({
        content: `
          .cucumber-debug-highlight {
            border: 3px solid red !important;
            background-color: rgba(255, 0, 0, 0.1) !important;
          }
        `
      });
    }
  }

  async highlightElement(selector: string): Promise<void> {
    if (process.env.DEBUG_MODE === 'true') {
      await this.world.page?.locator(selector).evaluate(element => {
        element.classList.add('cucumber-debug-highlight');
        setTimeout(() => element.classList.remove('cucumber-debug-highlight'), 2000);
      });
    }
  }

  async logStepExecution(stepText: string, stepType: string): Promise<void> {
    if (process.env.DEBUG_MODE === 'true') {
      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] ${stepType}: ${stepText}`);
      
      // Log current page state
      const url = this.world.page?.url();
      const title = await this.world.page?.title();
      console.log(`   📍 URL: ${url}`);
      console.log(`   📄 Title: ${title}`);
    }
  }

  async pauseForInspection(message?: string): Promise<void> {
    if (process.env.DEBUG_MODE === 'true') {
      console.log(`⏸️ Pausing for inspection: ${message || 'Manual inspection'}`);
      await this.world.page?.pause();
    }
  }
}

// Usage in step definitions
When('I debug the current page state', async function (this: CustomWorld) {
  const debugHelper = new DebugHelper(this);
  
  await debugHelper.logStepExecution('Debug page state', 'When');
  await debugHelper.pauseForInspection('Inspecting page state');
  
  // Log comprehensive page information
  const pageInfo = {
    url: this.page?.url(),
    title: await this.page?.title(),
    elementCount: await this.page?.locator('*').count(),
    visibleElements: await this.page?.locator(':visible').count(),
    forms: await this.page?.locator('form').count(),
    buttons: await this.page?.locator('button').count(),
    links: await this.page?.locator('a').count()
  };
  
  console.log('📊 Page Statistics:', pageInfo);
});
```

### Performance Monitoring

```typescript
// Performance monitoring for step definitions
class PerformanceMonitor {
  private stepStartTime: number = 0;
  private stepMetrics: Map<string, number[]> = new Map();

  startStepTimer(stepText: string): void {
    this.stepStartTime = Date.now();
    console.log(`⏱️ Starting timer for: ${stepText}`);
  }

  endStepTimer(stepText: string): number {
    const duration = Date.now() - this.stepStartTime;
    
    // Store metrics
    if (!this.stepMetrics.has(stepText)) {
      this.stepMetrics.set(stepText, []);
    }
    this.stepMetrics.get(stepText)!.push(duration);
    
    console.log(`⏱️ Step completed in ${duration}ms: ${stepText}`);
    
    // Warn on slow steps
    if (duration > 5000) {
      console.warn(`🐌 Slow step detected (${duration}ms): ${stepText}`);
    }
    
    return duration;
  }

  getStepStatistics(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [stepText, durations] of this.stepMetrics) {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);
      
      stats[stepText] = {
        executions: durations.length,
        averageMs: Math.round(avg),
        minMs: min,
        maxMs: max,
        totalMs: durations.reduce((a, b) => a + b, 0)
      };
    }
    
    return stats;
  }
}

// Usage with performance monitoring
const performanceMonitor = new PerformanceMonitor();

When('I perform a monitored operation', async function (this: CustomWorld) {
  const stepText = 'I perform a monitored operation';
  performanceMonitor.startStepTimer(stepText);
  
  try {
    // Actual operation
    await this.performComplexOperation();
    
  } finally {
    performanceMonitor.endStepTimer(stepText);
  }
});
```

## Custom Parameter Types and Transformations

### Advanced Parameter Types

```typescript
// support/advanced-parameter-types.ts
import { defineParameterType } from '@cucumber/cucumber';

// Complex date parameter type with multiple formats
defineParameterType({
  name: 'flexible_date',
  regexp: /(?:today|tomorrow|yesterday|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/,
  transformer: (dateString: string): Date => {
    const today = new Date();
    
    switch (dateString.toLowerCase()) {
      case 'today':
        return today;
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday;
      default:
        // Handle ISO format (YYYY-MM-DD) or US format (MM/DD/YYYY)
        if (dateString.includes('-')) {
          return new Date(dateString);
        } else {
          // Assume MM/DD/YYYY format
          const [month, day, year] = dateString.split('/').map(Number);
          return new Date(year, month - 1, day);
        }
    }
  }
});

// Complex user specification parameter
defineParameterType({
  name: 'user_spec',
  regexp: /(?:admin|manager|customer|guest)(?:\s+with\s+(\w+(?:\s+\w+)*))*/,
  transformer: (userSpec: string): UserSpecification => {
    const parts = userSpec.split(' with ');
    const role = parts[0].trim();
    const attributes = parts[1] ? parts[1].split(' ') : [];
    
    return {
      role,
      attributes: attributes.map(attr => attr.toLowerCase()),
      permissions: getPermissionsForRole(role),
      createdAt: new Date()
    };
  }
});

interface UserSpecification {
  role: string;
  attributes: string[];
  permissions: string[];
  createdAt: Date;
}

function getPermissionsForRole(role: string): string[] {
  const permissionMap: Record<string, string[]> = {
    'admin': ['read', 'write', 'delete', 'manage_users'],
    'manager': ['read', 'write', 'manage_team'],
    'customer': ['read', 'write_own'],
    'guest': ['read']
  };
  
  return permissionMap[role.toLowerCase()] || [];
}

// Usage in step definitions
Given('I am a {user_spec}', async function (this: CustomWorld, userSpec: UserSpecification) {
  // Create user with specified role and attributes
  await this.serviceManager?.userService.createUser({
    role: userSpec.role,
    attributes: userSpec.attributes,
    permissions: userSpec.permissions
  });
  
  console.log(`✅ Created ${userSpec.role} user with attributes: ${userSpec.attributes.join(', ')}`);
});

When('I schedule an event for {flexible_date}', async function (this: CustomWorld, eventDate: Date) {
  // Format date for form input
  const formattedDate = eventDate.toISOString().split('T')[0];
  
  await this.page?.getByLabel('Event Date').fill(formattedDate);
  
  console.log(`✅ Scheduled event for: ${formattedDate}`);
});
```

### Dynamic Parameter Processing

```typescript
// Dynamic parameter handling with validation
defineParameterType({
  name: 'validated_email',
  regexp: /[^\s@]+@[^\s@]+\.[^\s@]+/,
  transformer: (email: string): ValidatedEmail => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
    
    // Extract domain information
    const [localPart, domain] = email.split('@');
    const [domainName, tld] = domain.split('.');
    
    return {
      email,
      localPart,
      domain,
      domainName,
      tld,
      isValid: true,
      isTestEmail: domain.includes('example') || domain.includes('test')
    };
  }
});

interface ValidatedEmail {
  email: string;
  localPart: string;
  domain: string;
  domainName: string;
  tld: string;
  isValid: boolean;
  isTestEmail: boolean;
}

// Usage with enhanced email validation
When('I register with email {validated_email}', async function (this: CustomWorld, emailData: ValidatedEmail) {
  if (!emailData.isTestEmail && process.env.NODE_ENV === 'test') {
    console.warn(`⚠️ Using non-test email in test environment: ${emailData.email}`);
  }
  
  await this.page?.getByLabel('Email').fill(emailData.email);
  
  // Store email data for later verification
  this.testData.registrationEmail = emailData;
  
  console.log(`✅ Registered with ${emailData.isTestEmail ? 'test' : 'production'} email: ${emailData.email}`);
});
```

## Complex Async Operations

### Advanced Promise Handling

```typescript
// Complex async operations with proper error handling
When('I perform concurrent operations', async function (this: CustomWorld) {
  const operations = [
    this.loadUserProfile(),
    this.loadNotifications(),
    this.loadDashboardData()
  ];
  
  try {
    // Execute operations concurrently
    const results = await Promise.allSettled(operations);
    
    // Process results
    const [profileResult, notificationsResult, dashboardResult] = results;
    
    // Handle each result
    if (profileResult.status === 'fulfilled') {
      this.testData.userProfile = profileResult.value;
      console.log('✅ User profile loaded');
    } else {
      console.error('❌ Profile loading failed:', profileResult.reason);
    }
    
    if (notificationsResult.status === 'fulfilled') {
      this.testData.notifications = notificationsResult.value;
      console.log('✅ Notifications loaded');
    } else {
      console.error('❌ Notifications loading failed:', notificationsResult.reason);
    }
    
    if (dashboardResult.status === 'fulfilled') {
      this.testData.dashboardData = dashboardResult.value;
      console.log('✅ Dashboard data loaded');
    } else {
      console.error('❌ Dashboard loading failed:', dashboardResult.reason);
    }
    
    // Verify at least critical operations succeeded
    const criticalOperationsFailed = profileResult.status === 'rejected' || 
                                   dashboardResult.status === 'rejected';
    
    if (criticalOperationsFailed) {
      throw new Error('Critical operations failed during concurrent execution');
    }
    
  } catch (error) {
    await this.captureErrorDiagnostics(error as any);
    throw new Error(`Concurrent operations failed: ${error.message}`);
  }
});

async function loadUserProfile(this: CustomWorld): Promise<any> {
  await this.page?.goto('/profile');
  await this.page?.waitForSelector('[data-testid="profile-loaded"]');
  
  return {
    name: await this.page?.getByTestId('user-name').textContent(),
    email: await this.page?.getByTestId('user-email').textContent(),
    loadedAt: new Date()
  };
}

async function loadNotifications(this: CustomWorld): Promise<any> {
  const response = await this.page?.request.get('/api/notifications');
  return await response?.json();
}

async function loadDashboardData(this: CustomWorld): Promise<any> {
  await this.page?.goto('/dashboard');
  await this.page?.waitForSelector('[data-testid="dashboard-loaded"]');
  
  return {
    widgets: await this.page?.locator('[data-widget]').count(),
    notifications: await this.page?.locator('.notification').count(),
    loadedAt: new Date()
  };
}
```

### Timeout and Race Condition Handling

```typescript
// Advanced timeout handling
When('I wait for dynamic content with timeout handling', async function (this: CustomWorld) {
  const timeoutMs = 10000;
  const pollingInterval = 500;
  
  try {
    await this.waitForDynamicContent(timeoutMs, pollingInterval);
    console.log('✅ Dynamic content loaded successfully');
    
  } catch (error) {
    // Enhanced timeout error with diagnostic information
    const diagnostics = await this.gatherTimeoutDiagnostics();
    
    throw new Error(`Dynamic content loading timed out after ${timeoutMs}ms. Diagnostics: ${JSON.stringify(diagnostics)}`);
  }
});

async function waitForDynamicContent(this: CustomWorld, timeoutMs: number, pollingInterval: number): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    try {
      // Check multiple conditions for content readiness
      const contentReady = await this.page?.evaluate(() => {
        // Custom readiness check
        const hasMainContent = document.querySelector('[data-main-content]') !== null;
        const hasNoLoadingSpinners = document.querySelectorAll('.loading').length === 0;
        const hasCompletedAjax = (window as any).ajaxRequestsCompleted === true;
        
        return hasMainContent && hasNoLoadingSpinners && hasCompletedAjax;
      });
      
      if (contentReady) {
        return; // Content is ready
      }
      
      // Wait before next check
      await this.page?.waitForTimeout(pollingInterval);
      
    } catch (error) {
      console.warn(`Polling check failed: ${error.message}`);
      // Continue polling despite individual check failures
    }
  }
  
  throw new Error('Dynamic content readiness timeout');
}

async function gatherTimeoutDiagnostics(this: CustomWorld): Promise<any> {
  try {
    return {
      url: this.page?.url(),
      title: await this.page?.title(),
      elementCount: await this.page?.locator('*').count(),
      loadingElements: await this.page?.locator('.loading').count(),
      errorElements: await this.page?.locator('.error').count(),
      networkState: await this.page?.evaluate(() => {
        return {
          readyState: document.readyState,
          ajaxActive: (window as any).ajaxRequestsActive || 0
        };
      })
    };
  } catch (error) {
    return { diagnosticError: error.message };
  }
}
```

## Advanced Logging and Monitoring

### Comprehensive Logging System

```typescript
// support/advanced-logger.ts
export class AdvancedLogger {
  private logEntries: LogEntry[] = [];
  
  constructor(private world: CustomWorld) {}
  
  async logStepStart(stepType: string, stepText: string, parameters?: any): Promise<void> {
    const entry: LogEntry = {
      type: 'step_start',
      stepType,
      stepText,
      parameters,
      timestamp: new Date(),
      url: this.world.page?.url(),
      sessionId: this.world.currentSession?.userId || 'unknown'
    };
    
    this.logEntries.push(entry);
    
    if (process.env.VERBOSE_LOGGING === 'true') {
      console.log(`🚀 [${entry.timestamp.toISOString()}] ${stepType}: ${stepText}`);
      if (parameters) {
        console.log(`   📝 Parameters:`, parameters);
      }
    }
  }
  
  async logStepEnd(stepType: string, stepText: string, success: boolean, duration: number, error?: Error): Promise<void> {
    const entry: LogEntry = {
      type: 'step_end',
      stepType,
      stepText,
      success,
      duration,
      error: error?.message,
      timestamp: new Date(),
      url: this.world.page?.url(),
      sessionId: this.world.currentSession?.userId || 'unknown'
    };
    
    this.logEntries.push(entry);
    
    const status = success ? '✅' : '❌';
    console.log(`${status} [${entry.timestamp.toISOString()}] ${stepType} completed in ${duration}ms`);
    
    if (error) {
      console.error(`   💥 Error: ${error.message}`);
    }
  }
  
  async logPageInteraction(action: string, element: string, value?: string): Promise<void> {
    const entry: LogEntry = {
      type: 'page_interaction',
      action,
      element,
      value,
      timestamp: new Date(),
      url: this.world.page?.url()
    };
    
    this.logEntries.push(entry);
    
    if (process.env.VERBOSE_LOGGING === 'true') {
      console.log(`🖱️ ${action} on ${element}${value ? ` with value: ${value}` : ''}`);
    }
  }
  
  getLogSummary(): LogSummary {
    const steps = this.logEntries.filter(entry => entry.type === 'step_end');
    const interactions = this.logEntries.filter(entry => entry.type === 'page_interaction');
    
    return {
      totalSteps: steps.length,
      successfulSteps: steps.filter(step => step.success).length,
      failedSteps: steps.filter(step => !step.success).length,
      totalInteractions: interactions.length,
      averageStepDuration: steps.length > 0 ? 
        steps.reduce((sum, step) => sum + (step.duration || 0), 0) / steps.length : 0,
      logEntries: this.logEntries
    };
  }
}

interface LogEntry {
  type: 'step_start' | 'step_end' | 'page_interaction';
  stepType?: string;
  stepText?: string;
  parameters?: any;
  success?: boolean;
  duration?: number;
  error?: string;
  action?: string;
  element?: string;
  value?: string;
  timestamp: Date;
  url?: string;
  sessionId?: string;
}

interface LogSummary {
  totalSteps: number;
  successfulSteps: number;
  failedSteps: number;
  totalInteractions: number;
  averageStepDuration: number;
  logEntries: LogEntry[];
}
```

## Best Practices Summary

### **Error Handling Excellence**
- Implement comprehensive error recovery strategies
- Capture detailed diagnostic information on failures
- Use meaningful error messages with context
- Implement retry mechanisms for flaky operations

### **Debugging Mastery**
- Create debug modes for detailed inspection
- Implement performance monitoring and alerting
- Use visual debugging aids when needed
- Provide detailed logging for troubleshooting

### **Advanced Patterns**
- Create custom parameter types for domain-specific data
- Handle complex async operations with proper error handling
- Implement timeout and race condition handling
- Use performance monitoring to identify bottlenecks

### **Professional Quality**
- Implement comprehensive logging and monitoring
- Create reusable debugging utilities
- Use proper TypeScript typing throughout
- Follow consistent error handling patterns

---

*These advanced patterns enable you to create enterprise-grade step definitions that are robust, debuggable, and maintainable in complex real-world scenarios.*