# Examples: Implementing Step Definitions in TypeScript

## Overview

This directory contains comprehensive examples that demonstrate how to implement step definitions in TypeScript, connecting Gherkin feature files to executable test code. The examples progress from basic concepts to advanced implementation patterns used in professional BDD automation.

## Learning Progression

### **Phase 1: Foundation Examples**
Master the fundamentals of step definition implementation and TypeScript integration.

### **Phase 2: Parameter Handling**
Learn to extract and process data from Gherkin steps with proper type safety.

### **Phase 3: Integration Patterns**
Connect step definitions to Page Object Models and manage shared state.

### **Phase 4: Advanced Implementation**
Implement complex scenarios with error handling, debugging, and optimization techniques.

## Example Files

### **01-basic-step-definitions.md**
**Focus**: Fundamental step definition syntax and structure
**Duration**: 20 minutes
**Key Learning**:
- Basic Given/When/Then implementation
- TypeScript function structure
- Cucumber expression basics
- Step definition registration

**Topics Covered**:
- Step definition anatomy
- Function signatures and async patterns
- Basic assertion implementation
- Connecting to Playwright actions

### **02-parameter-handling.md**
**Focus**: Parameter extraction and type conversion
**Duration**: 25 minutes
**Key Learning**:
- Cucumber expression parameter types
- TypeScript parameter typing
- Data table handling
- Doc string processing

**Topics Covered**:
- String, integer, and float parameters
- Optional parameter handling
- Complex data structures
- Type safety implementation

### **03-page-object-integration.md**
**Focus**: Professional Page Object Model integration
**Duration**: 25 minutes
**Key Learning**:
- Page Object instantiation in steps
- World object usage for shared state
- Manager pattern implementation
- Service layer integration

**Topics Covered**:
- Page Object constructor patterns
- Dependency injection approaches
- State management strategies
- Cross-step data sharing

### **04-advanced-patterns.md**
**Focus**: Complex implementation and optimization
**Duration**: 30 minutes
**Key Learning**:
- Error handling strategies
- Performance optimization
- Debugging techniques
- Custom parameter types

**Topics Covered**:
- Exception handling patterns
- Timeout and retry logic
- Logging and screenshot capture
- Step definition organization

## Code Quality Standards

### **TypeScript Best Practices**
- **Strong Typing**: Use specific types instead of `any`
- **Interface Definition**: Create interfaces for complex data
- **Async/Await**: Proper promise handling throughout
- **Error Handling**: Comprehensive exception management

### **Step Definition Quality**
- **Single Responsibility**: Each step does one thing well
- **Clear Intent**: Step purpose is obvious from implementation
- **Reusability**: Common patterns extracted to shared functions
- **Maintainability**: Code is easy to modify and extend

### **Integration Patterns**
- **Loose Coupling**: Steps don't depend on implementation details
- **High Cohesion**: Related functionality grouped logically
- **State Management**: Proper handling of shared test state
- **Resource Cleanup**: Proper cleanup of test resources

## Implementation Patterns

### **Basic Pattern**
```typescript
Given('I am on the login page', async function () {
  await this.page.goto('/login');
});
```

### **Parameter Pattern**
```typescript
When('I enter {string} in the {string} field', 
  async function (value: string, fieldName: string) {
    await this.page.getByLabel(fieldName).fill(value);
  }
);
```

### **Data Table Pattern**
```typescript
When('I fill out the form:', async function (dataTable) {
  const formData = dataTable.hashes()[0];
  await this.formManager.fillForm(formData);
});
```

### **Assertion Pattern**
```typescript
Then('I should see {string}', async function (expectedText: string) {
  await expect(this.page.getByText(expectedText)).toBeVisible();
});
```

## Error Handling Strategies

### **Graceful Failure**
```typescript
When('I attempt a potentially failing action', async function () {
  try {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  } catch (error) {
    console.log('Expected failure occurred:', error.message);
    this.lastError = error;
  }
});
```

### **Detailed Debugging**
```typescript
Then('the operation should succeed', async function () {
  if (this.lastError) {
    await this.page.screenshot({ path: 'error-state.png' });
    throw new Error(`Operation failed: ${this.lastError.message}`);
  }
});
```

## Testing Strategies

### **Verification Approaches**
- **Immediate Verification**: Check results right after actions
- **State Verification**: Verify system state changes
- **UI Verification**: Confirm visual elements and content
- **Data Verification**: Validate data persistence and retrieval

### **Wait Strategies**
- **Explicit Waits**: Wait for specific conditions
- **Implicit Waits**: Use Playwright's auto-waiting
- **Custom Waits**: Implement domain-specific wait conditions
- **Timeout Management**: Handle long-running operations

## Performance Considerations

### **Optimization Techniques**
- **Efficient Locators**: Use fast, reliable element selection
- **Minimal Waits**: Avoid unnecessary delays
- **Parallel Execution**: Run independent steps concurrently
- **Resource Management**: Properly handle browser resources

### **Scalability Patterns**
- **Step Reusability**: Share common steps across features
- **Helper Functions**: Extract complex logic to utilities
- **Configuration Management**: Externalize environment settings
- **Data Management**: Efficient test data handling

## Debugging and Troubleshooting

### **Common Issues**
- **Step Matching Problems**: Mismatched patterns or expressions
- **Parameter Type Errors**: Incorrect type conversion
- **Timing Issues**: Race conditions and async problems
- **State Management**: Shared state corruption

### **Debugging Tools**
- **Console Logging**: Strategic log placement
- **Screenshot Capture**: Visual debugging assistance
- **Step-through Debugging**: IDE debugging support
- **Performance Profiling**: Identify bottlenecks

## Integration with Project Structure

### **File Organization**
```
step-definitions/
├── auth/           # Authentication-related steps
├── ecommerce/      # E-commerce domain steps
├── common/         # Shared utility steps
└── support/        # Helper functions and utilities
```

### **Import Patterns**
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { PageManager } from '../support/page-manager';
```

## Real-World Application

These examples prepare you for:
- **Enterprise BDD Implementation**: Large-scale test automation
- **Team Collaboration**: Shared step definition libraries
- **Continuous Integration**: Reliable automated testing
- **Maintenance and Evolution**: Long-term test suite sustainability

---

*Each example builds upon previous concepts while introducing new techniques, ensuring a comprehensive understanding of professional TypeScript step definition implementation.*