# Exercise 04: Advanced Error Handling Workshop

## Overview

This comprehensive workshop focuses on mastering advanced error handling patterns in TypeScript step definitions. You'll implement robust error recovery strategies, sophisticated debugging techniques, and professional monitoring solutions that ensure reliable BDD automation in production environments.

## Learning Objectives

By completing this workshop, you will be able to:

### **Primary Objectives**
- Implement comprehensive error handling strategies for step definitions
- Create sophisticated debugging and diagnostic capabilities
- Build resilient automation with graceful failure recovery
- Design monitoring and alerting systems for production BDD tests
- Handle complex error scenarios with appropriate user feedback

### **Secondary Objectives**
- Optimize error handling performance and resource usage
- Create reusable error handling utilities and patterns
- Implement advanced logging and tracing capabilities
- Build error classification and analysis systems
- Design automated error reporting and escalation workflows

## Workshop Scenario

**Context**: You're architecting the error handling strategy for a mission-critical enterprise BDD automation suite that runs 24/7 in production environments. The system must handle failures gracefully, provide actionable diagnostics, and maintain high availability even when individual tests fail.

**Business Value**: Robust error handling ensures:
- Minimal test suite downtime
- Fast failure diagnosis and resolution
- Reliable reporting to stakeholders
- Proactive issue detection and prevention
- High confidence in automation results

**Your Role**: Senior QA Automation Architect designing enterprise-grade error handling infrastructure.

## Prerequisites

- Completed all previous exercises in this lesson
- Understanding of TypeScript error handling patterns
- Knowledge of monitoring and observability concepts
- Familiarity with logging frameworks and debugging tools

## Workshop Task 1: Error Classification Framework (30 minutes)

### **Objective**: Build a comprehensive error classification and handling system

### **Implementation**: Create sophisticated error handling infrastructure

#### **1. Error Types and Classifications** - `support/errors/error-types.ts`

```typescript
// Base error classes for different error categories
export abstract class BDDError extends Error {
  public readonly timestamp: Date;
  public readonly errorId: string;
  public readonly context: ErrorContext;
  
  constructor(
    message: string,
    public readonly category: ErrorCategory,
    public readonly severity: ErrorSeverity,
    context: Partial<ErrorContext> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.errorId = this.generateErrorId();
    this.context = { ...this.getDefaultContext(), ...context };
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  private generateErrorId(): string {
    return `${this.category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private getDefaultContext(): ErrorContext {
    return {
      userAgent: process.env.USER_AGENT || 'unknown',
      testEnvironment: process.env.NODE_ENV || 'development',
      buildId: process.env.BUILD_ID || 'local',
      timestamp: this.timestamp.toISOString()
    };
  }
  
  // Serialization for logging and reporting
  toJSON(): ErrorReport {
    return {
      errorId: this.errorId,
      name: this.name,
      message: this.message,
      category: this.category,
      severity: this.severity,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack || 'No stack trace available',
      context: this.context
    };
  }
  
  // Abstract methods for specific error handling
  abstract getRecoveryStrategy(): RecoveryStrategy;
  abstract getNotificationLevel(): NotificationLevel;
  abstract shouldRetry(): boolean;
}

// Specific error types
export class StepDefinitionError extends BDDError {
  constructor(
    message: string, 
    public readonly stepText: string,
    public readonly stepType: 'Given' | 'When' | 'Then',
    context: Partial<ErrorContext> = {}
  ) {
    super(message, ErrorCategory.STEP_DEFINITION, ErrorSeverity.HIGH, {
      ...context,
      stepText,
      stepType
    });
  }
  
  getRecoveryStrategy(): RecoveryStrategy {
    return {
      type: 'RETRY_WITH_DELAY',
      maxRetries: 2,
      delayMs: 1000,
      escalateAfter: 3
    };
  }
  
  getNotificationLevel(): NotificationLevel {
    return NotificationLevel.TEAM;
  }
  
  shouldRetry(): boolean {
    return this.severity !== ErrorSeverity.CRITICAL;
  }
}

export class PageObjectError extends BDDError {
  constructor(
    message: string,
    public readonly pageName: string,
    public readonly operation: string,
    public readonly selector?: string,
    context: Partial<ErrorContext> = {}
  ) {
    super(message, ErrorCategory.PAGE_OBJECT, ErrorSeverity.MEDIUM, {
      ...context,
      pageName,
      operation,
      selector
    });
  }
  
  getRecoveryStrategy(): RecoveryStrategy {
    return {
      type: 'REFRESH_AND_RETRY',
      maxRetries: 1,
      delayMs: 2000,
      escalateAfter: 2
    };
  }
  
  getNotificationLevel(): NotificationLevel {
    return NotificationLevel.DEVELOPER;
  }
  
  shouldRetry(): boolean {
    return this.operation !== 'navigate';
  }
}

export class NetworkError extends BDDError {
  constructor(
    message: string,
    public readonly url: string,
    public readonly statusCode?: number,
    public readonly responseTime?: number,
    context: Partial<ErrorContext> = {}
  ) {
    super(message, ErrorCategory.NETWORK, ErrorSeverity.HIGH, {
      ...context,
      url,
      statusCode: statusCode?.toString(),
      responseTime: responseTime?.toString()
    });
  }
  
  getRecoveryStrategy(): RecoveryStrategy {
    return {
      type: 'EXPONENTIAL_BACKOFF',
      maxRetries: 3,
      delayMs: 1000,
      escalateAfter: 3
    };
  }
  
  getNotificationLevel(): NotificationLevel {
    return this.statusCode && this.statusCode >= 500 
      ? NotificationLevel.OPERATIONS 
      : NotificationLevel.TEAM;
  }
  
  shouldRetry(): boolean {
    return !this.statusCode || this.statusCode >= 500;
  }
}

// Supporting types and enums
export enum ErrorCategory {
  STEP_DEFINITION = 'step-definition',
  PAGE_OBJECT = 'page-object',
  ENVIRONMENT = 'environment',
  DATA_VALIDATION = 'data-validation',
  NETWORK = 'network',
  BROWSER = 'browser',
  CONFIGURATION = 'configuration'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum NotificationLevel {
  NONE = 'none',
  DEVELOPER = 'developer',
  TEAM = 'team',
  OPERATIONS = 'operations',
  EXECUTIVE = 'executive'
}

export interface ErrorContext {
  userAgent: string;
  testEnvironment: string;
  buildId: string;
  timestamp: string;
  [key: string]: any;
}

export interface ErrorReport {
  errorId: string;
  name: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: string;
  stack: string;
  context: ErrorContext;
}

export interface RecoveryStrategy {
  type: 'RETRY_WITH_DELAY' | 'EXPONENTIAL_BACKOFF' | 'REFRESH_AND_RETRY' | 'SKIP_AND_CONTINUE' | 'ESCALATE_IMMEDIATELY';
  maxRetries: number;
  delayMs: number;
  escalateAfter: number;
}
```

#### **2. Error Handler Service** - `support/services/error-handler-service.ts`

```typescript
import { BDDError, ErrorReport, RecoveryStrategy, NotificationLevel } from '../errors/error-types';
import { Logger } from '../utils/logger';

export class ErrorHandlerService {
  private readonly logger: Logger;
  private readonly errorCounts: Map<string, number> = new Map();
  private readonly recoveryAttempts: Map<string, number> = new Map();
  
  constructor() {
    this.logger = new Logger('ErrorHandlerService');
  }
  
  async handleError(error: Error, context: any = {}): Promise<ErrorHandlingResult> {
    // Convert to BDD error if not already
    const bddError = this.convertToBDDError(error, context);
    
    try {
      // Log the error
      await this.logError(bddError);
      
      // Collect diagnostics
      const diagnostics = await this.collectDiagnostics(bddError, context);
      
      // Determine recovery strategy
      const recoveryStrategy = bddError.getRecoveryStrategy();
      
      // Check if we should attempt recovery
      const shouldAttemptRecovery = this.shouldAttemptRecovery(bddError, recoveryStrategy);
      
      if (shouldAttemptRecovery) {
        const recoveryResult = await this.attemptRecovery(bddError, recoveryStrategy, context);
        
        if (recoveryResult.success) {
          this.logger.info(`Successfully recovered from error: ${bddError.errorId}`);
          return {
            error: bddError,
            recovered: true,
            action: recoveryResult.action,
            diagnostics
          };
        }
      }
      
      // Recovery failed or not attempted, handle escalation
      await this.handleEscalation(bddError);
      
      return {
        error: bddError,
        recovered: false,
        action: 'escalated',
        diagnostics
      };
      
    } catch (handlingError) {
      this.logger.error(`Error handling failed: ${handlingError.message}`);
      
      return {
        error: bddError,
        recovered: false,
        action: 'failed-to-handle',
        diagnostics: {}
      };
    }
  }
  
  private convertToBDDError(error: Error, context: any): BDDError {
    if (error instanceof BDDError) {
      return error;
    }
    
    // Convert generic errors to appropriate BDD error types
    const { StepDefinitionError, PageObjectError, NetworkError } = require('../errors/error-types');
    
    if (error.message.includes('step definition')) {
      return new StepDefinitionError(
        error.message,
        context.stepText || 'unknown',
        context.stepType || 'Given',
        context
      );
    }
    
    if (error.message.includes('page') || error.message.includes('element')) {
      return new PageObjectError(
        error.message,
        context.pageName || 'unknown',
        context.operation || 'unknown',
        context.selector,
        context
      );
    }
    
    if (error.message.includes('network') || error.message.includes('timeout')) {
      return new NetworkError(
        error.message,
        context.url || 'unknown',
        context.statusCode,
        context.responseTime,
        context
      );
    }
    
    // Default to generic error
    return new StepDefinitionError(
      error.message,
      'unknown',
      'When',
      context
    );
  }
  
  private async logError(error: BDDError): Promise<void> {
    const errorReport = error.toJSON();
    
    switch (error.severity) {
      case 'critical':
        this.logger.error(`[CRITICAL] ${error.message}`, errorReport);
        break;
      case 'high':
        this.logger.error(`[HIGH] ${error.message}`, errorReport);
        break;
      case 'medium':
        this.logger.warn(`[MEDIUM] ${error.message}`, errorReport);
        break;
      case 'low':
        this.logger.info(`[LOW] ${error.message}`, errorReport);
        break;
    }
  }
  
  private async collectDiagnostics(error: BDDError, context: any): Promise<Record<string, any>> {
    return {
      errorId: error.errorId,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      context: context
    };
  }
  
  private shouldAttemptRecovery(error: BDDError, strategy: RecoveryStrategy): boolean {
    const errorKey = `${error.category}-${error.name}`;
    const currentAttempts = this.recoveryAttempts.get(errorKey) || 0;
    
    return error.shouldRetry() && currentAttempts < strategy.maxRetries;
  }
  
  private async attemptRecovery(
    error: BDDError, 
    strategy: RecoveryStrategy, 
    context: any
  ): Promise<RecoveryResult> {
    const errorKey = `${error.category}-${error.name}`;
    const currentAttempts = this.recoveryAttempts.get(errorKey) || 0;
    
    this.recoveryAttempts.set(errorKey, currentAttempts + 1);
    
    try {
      switch (strategy.type) {
        case 'RETRY_WITH_DELAY':
          await this.delay(strategy.delayMs);
          return { success: true, action: 'retried-with-delay' };
          
        case 'EXPONENTIAL_BACKOFF':
          const backoffDelay = strategy.delayMs * Math.pow(2, currentAttempts);
          await this.delay(backoffDelay);
          return { success: true, action: 'exponential-backoff' };
          
        case 'REFRESH_AND_RETRY':
          if (context.page) {
            await context.page.reload();
            await this.delay(strategy.delayMs);
          }
          return { success: true, action: 'refresh-and-retry' };
          
        case 'SKIP_AND_CONTINUE':
          this.logger.warn(`Skipping failed operation: ${error.message}`);
          return { success: true, action: 'skipped' };
          
        case 'ESCALATE_IMMEDIATELY':
          return { success: false, action: 'escalated' };
          
        default:
          return { success: false, action: 'unknown-strategy' };
      }
    } catch (recoveryError) {
      this.logger.error(`Recovery attempt failed: ${recoveryError.message}`);
      return { success: false, action: 'recovery-failed' };
    }
  }
  
  private async handleEscalation(error: BDDError): Promise<void> {
    const notificationLevel = error.getNotificationLevel();
    
    if (notificationLevel !== NotificationLevel.NONE) {
      this.logger.warn(`Escalating error ${error.errorId} to ${notificationLevel} level`);
    }
    
    // Check if error count exceeds escalation threshold
    const errorKey = `${error.category}-${error.name}`;
    const errorCount = (this.errorCounts.get(errorKey) || 0) + 1;
    this.errorCounts.set(errorKey, errorCount);
    
    const escalationThreshold = error.getRecoveryStrategy().escalateAfter;
    if (errorCount >= escalationThreshold) {
      this.logger.error(`Error pattern detected: ${errorKey} occurred ${errorCount} times`);
    }
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Cleanup method for resetting error counts
  resetErrorCounts(): void {
    this.errorCounts.clear();
    this.recoveryAttempts.clear();
  }
  
  // Get error statistics for reporting
  getErrorStatistics(): ErrorStatistics {
    const categories = new Map<string, number>();
    
    for (const [errorKey, count] of this.errorCounts) {
      const [category] = errorKey.split('-');
      categories.set(category, (categories.get(category) || 0) + count);
    }
    
    return {
      totalErrors: Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0),
      errorsByCategory: Object.fromEntries(categories),
      mostFrequentErrors: this.getMostFrequentErrors()
    };
  }
  
  private getMostFrequentErrors(): Array<{ errorType: string; count: number }> {
    return Array.from(this.errorCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([errorType, count]) => ({ errorType, count }));
  }
}

// Supporting interfaces
interface ErrorHandlingResult {
  error: BDDError;
  recovered: boolean;
  action: string;
  diagnostics: Record<string, any>;
}

interface RecoveryResult {
  success: boolean;
  action: string;
}

interface ErrorStatistics {
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  mostFrequentErrors: Array<{ errorType: string; count: number }>;
}
```

### **Validation Criteria**
- ✅ Comprehensive error classification system implemented
- ✅ Sophisticated recovery strategies defined
- ✅ Error handling service provides centralized management
- ✅ Analytics and reporting capabilities included

## Workshop Task 2: Integration with Step Definitions (35 minutes)

### **Objective**: Integrate advanced error handling into step definitions

### **Implementation**: Enhanced step definitions with comprehensive error handling

#### **Step Definitions** - `step-definitions/advanced-error-handling.steps.ts`

```typescript
import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { ErrorHandlerService } from '../support/services/error-handler-service';
import { StepDefinitionError, PageObjectError, NetworkError } from '../support/errors/error-types';

// Enhanced World with error handling
declare module '../support/world' {
  interface CustomWorld {
    errorHandler: ErrorHandlerService;
    lastError?: any;
    diagnosticData?: any;
  }
}

Before(async function (this: CustomWorld) {
  this.errorHandler = new ErrorHandlerService();
  this.lastError = undefined;
  this.diagnosticData = undefined;
});

After(async function (this: CustomWorld) {
  if (this.lastError) {
    const errorStats = this.errorHandler.getErrorStatistics();
    console.log('📊 Error Statistics for Scenario:', errorStats);
  }
  
  this.errorHandler.resetErrorCounts();
});

Given('I am on a page that may have loading issues', async function (this: CustomWorld) {
  try {
    await this.page!.goto('/slow-loading-page', { timeout: 5000 });
    await this.page!.waitForLoadState('networkidle');
    
    console.log('✅ Successfully navigated to potentially problematic page');
    
  } catch (error) {
    const handlingResult = await this.errorHandler.handleError(error, {
      operation: 'navigation',
      url: '/slow-loading-page',
      page: this.page,
      stepText: 'I am on a page that may have loading issues',
      stepType: 'Given'
    });
    
    this.lastError = handlingResult.error;
    this.diagnosticData = handlingResult.diagnostics;
    
    if (!handlingResult.recovered) {
      throw new StepDefinitionError(
        `Failed to navigate to page: ${error.message}`,
        'I am on a page that may have loading issues',
        'Given',
        { originalError: error.message, diagnostics: handlingResult.diagnostics }
      );
    }
    
    console.log(`✅ Recovered from navigation error using: ${handlingResult.action}`);
  }
});

When('I perform an action that might fail intermittently', async function (this: CustomWorld) {
  const maxRetries = 3;
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await this.performIntermittentOperation();
      
      console.log(`✅ Intermittent operation succeeded on attempt ${attempt}`);
      return;
      
    } catch (error) {
      lastError = error as Error;
      
      const handlingResult = await this.errorHandler.handleError(error, {
        operation: 'intermittent-action',
        attempt,
        maxRetries,
        page: this.page,
        stepText: 'I perform an action that might fail intermittently',
        stepType: 'When'
      });
      
      if (handlingResult.recovered && attempt < maxRetries) {
        console.log(`⚠️  Attempt ${attempt} failed, retrying... (${handlingResult.action})`);
        continue;
      }
      
      this.lastError = handlingResult.error;
      this.diagnosticData = handlingResult.diagnostics;
    }
  }
  
  throw new StepDefinitionError(
    `Operation failed after ${maxRetries} attempts: ${lastError?.message}`,
    'I perform an action that might fail intermittently',
    'When',
    { attempts: maxRetries, lastError: lastError?.message }
  );
});

When('I interact with an element that may not exist', async function (this: CustomWorld) {
  const selector = '[data-testid="optional-element"]';
  
  try {
    const element = this.page!.locator(selector);
    await element.waitFor({ state: 'visible', timeout: 2000 });
    await element.click();
    
    console.log('✅ Successfully interacted with optional element');
    
  } catch (error) {
    const handlingResult = await this.errorHandler.handleError(error, {
      operation: 'element-interaction',
      selector,
      page: this.page,
      stepText: 'I interact with an element that may not exist',
      stepType: 'When'
    });
    
    this.lastError = handlingResult.error;
    this.diagnosticData = handlingResult.diagnostics;
    
    if (handlingResult.action === 'skipped') {
      console.log('⚠️  Optional element not found, continuing test execution');
      return;
    }
    
    if (!handlingResult.recovered) {
      throw new PageObjectError(
        `Element interaction failed: ${error.message}`,
        'UnknownPage',
        'click',
        selector,
        { originalError: error.message, diagnostics: handlingResult.diagnostics }
      );
    }
  }
});

Then('the operation should complete successfully or be handled gracefully', async function (this: CustomWorld) {
  if (this.lastError) {
    expect(this.diagnosticData).toBeDefined();
    expect(this.lastError.errorId).toBeDefined();
    
    console.log(`✅ Error handled gracefully: ${this.lastError.errorId}`);
    console.log(`   Error category: ${this.lastError.category}`);
    
    if (this.diagnosticData) {
      expect(this.diagnosticData.environment).toBeDefined();
      expect(this.diagnosticData.timestamp).toBeDefined();
      
      console.log('✅ Comprehensive diagnostics collected');
    }
  } else {
    console.log('✅ Operation completed successfully without errors');
  }
});

Then('the error statistics should show the handled errors', async function (this: CustomWorld) {
  const errorStats = this.errorHandler.getErrorStatistics();
  
  expect(errorStats).toBeDefined();
  expect(errorStats.totalErrors).toBeGreaterThanOrEqual(0);
  
  if (errorStats.totalErrors > 0) {
    expect(errorStats.errorsByCategory).toBeDefined();
    expect(errorStats.mostFrequentErrors).toBeDefined();
    
    console.log('📊 Error Statistics Summary:');
    console.log(`   Total Errors: ${errorStats.totalErrors}`);
    console.log(`   Categories: ${Object.keys(errorStats.errorsByCategory).join(', ')}`);
  }
});

// Helper method for the World class
declare module '../support/world' {
  interface CustomWorld {
    performIntermittentOperation(): Promise<void>;
  }
}

CustomWorld.prototype.performIntermittentOperation = async function (): Promise<void> {
  const shouldFail = Math.random() < 0.6; // 60% chance of failure
  
  if (shouldFail) {
    throw new Error('Simulated intermittent failure');
  }
  
  await this.page!.waitForTimeout(100);
};
```

### **Feature File** - `features/advanced-error-handling.feature`

```gherkin
Feature: Advanced Error Handling
  As a QA automation engineer
  I want robust error handling in my BDD tests
  So that tests are reliable and failures are properly diagnosed

  Background:
    Given the application is running
    And error handling is enabled

  @error-handling @resilience
  Scenario: Graceful handling of intermittent failures
    Given I am on a page that may have loading issues
    When I perform an action that might fail intermittently
    Then the operation should complete successfully or be handled gracefully
    And the error statistics should show the handled errors

  @error-handling @optional-elements
  Scenario: Handling optional UI elements gracefully
    Given I am on the dashboard page
    When I interact with an element that may not exist
    Then the operation should complete successfully or be handled gracefully

  @error-handling @comprehensive
  Scenario: Comprehensive error handling workflow
    Given I am on a page that may have loading issues
    When I perform an action that might fail intermittently
    And I interact with an element that may not exist
    Then the operation should complete successfully or be handled gracefully
    And the error statistics should show the handled errors
```

### **Validation Criteria**
- ✅ Step definitions include comprehensive error handling
- ✅ Multiple error scenarios are handled appropriately
- ✅ Error recovery strategies are implemented
- ✅ Diagnostic data is collected and available
- ✅ Error statistics provide insights into test reliability

## Extension Challenge: Performance Monitoring (Optional - 20 minutes)

### **Implementation**: Add performance monitoring to error handling

```typescript
// support/utils/performance-monitor.ts
export class PerformanceMonitor {
  static async measureErrorHandlingImpact<T>(
    operation: () => Promise<T>,
    errorHandler: ErrorHandlerService
  ): Promise<{ result: T; performanceImpact: PerformanceMetrics }> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const endMemory = process.memoryUsage();
      
      return {
        result,
        performanceImpact: {
          executionTime: endTime - startTime,
          memoryDelta: endMemory.heapUsed - startMemory.heapUsed,
          successful: true
        }
      };
    } catch (error) {
      const errorStartTime = performance.now();
      await errorHandler.handleError(error);
      const errorEndTime = performance.now();
      
      throw new Error(`Operation failed. Error handling took ${errorEndTime - errorStartTime}ms`);
    }
  }
}

interface PerformanceMetrics {
  executionTime: number;
  memoryDelta: number;
  successful: boolean;
}
```

## Success Validation

### **Completion Checklist**
- [ ] Error classification system implemented
- [ ] Comprehensive error handling service created
- [ ] Step definitions integrate error handling
- [ ] Multiple error scenarios tested
- [ ] Error statistics and reporting functional
- [ ] Extension challenges attempted (optional)

### **Quality Metrics**
- [ ] Error handling doesn't significantly impact test performance (< 10% overhead)
- [ ] Error recovery success rate > 70% for recoverable errors
- [ ] Error classification accuracy > 90%
- [ ] False positive rate for error detection < 5%

## Running Your Implementation

```bash
# Run error handling tests
npx cucumber-js features/advanced-error-handling.feature

# Run with error statistics
ERROR_STATS=true npx cucumber-js

# Enable detailed diagnostics
DIAGNOSTICS_LEVEL=verbose npx cucumber-js

# Run resilience testing
npx cucumber-js --tags "@error-handling and @resilience"
```

---

## Summary

This workshop has established:

- ✅ **Professional Error Classification**: Comprehensive error categorization and handling
- ✅ **Advanced Recovery Strategies**: Intelligent error recovery with multiple approaches
- ✅ **Production-Ready Monitoring**: Error statistics, reporting, and analytics
- ✅ **Resilient Step Definitions**: BDD automation that gracefully handles failures
- ✅ **Enterprise-Grade Reliability**: Patterns suitable for mission-critical systems

You now have a sophisticated error handling framework that transforms fragile BDD automation into robust, production-ready test suites with comprehensive failure recovery and diagnostic capabilities.

*Time to complete: 60-90 minutes*  
*Difficulty: Expert*  
*Skills gained: Enterprise error handling, resilient automation, production monitoring*