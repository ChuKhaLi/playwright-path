# Exercise 01: Hook Implementation Workshop

## 🎯 Exercise Overview

**Objective**: Master Cucumber hook fundamentals through hands-on implementation of all hook types with TypeScript integration, error handling, and state management patterns.

**Duration**: 30 minutes  
**Complexity**: Beginner  
**Skills Focus**: Hook types, execution order, error handling, TypeScript integration

## 📚 Learning Objectives

By completing this exercise, you will be able to:

1. **LO1**: Implement all six types of Cucumber hooks with proper TypeScript typing
2. **LO2**: Demonstrate understanding of hook execution order through practical implementation
3. **LO3**: Create robust error handling patterns for hook failures
4. **LO4**: Manage state effectively between hooks and step definitions
5. **LO5**: Apply TypeScript async/await patterns in hook implementations

## 🛠️ Setup Requirements

### **Prerequisites**
- Node.js 18+ installed
- TypeScript 4.8+ configured
- @cucumber/cucumber package available
- Basic understanding of TypeScript async patterns

### **Initial Setup**
```bash
# Create exercise directory
mkdir hook-implementation-workshop
cd hook-implementation-workshop

# Initialize project
npm init -y
npm install --save-dev @cucumber/cucumber typescript ts-node @types/node

# Create directory structure
mkdir -p {features,step-definitions,hooks,support}
```

### **TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📋 Workshop Tasks

### **Task 1: Basic Hook Implementation (10 minutes)**

Create a comprehensive hook implementation file that demonstrates all hook types.

**File**: `hooks/basic-hooks.ts`

```typescript
// hooks/basic-hooks.ts
import { 
    BeforeAll, 
    AfterAll, 
    Before, 
    After, 
    BeforeStep, 
    AfterStep,
    ITestCaseHookParameter,
    ITestStepHookParameter
} from '@cucumber/cucumber';

// TODO: Implement global test state interface
interface TestState {
    // Add properties for:
    // - Suite start time
    // - Current scenario information
    // - Step counter
    // - Error tracking
    // - Shared data storage
}

// TODO: Create global test state instance

/**
 * TODO: Implement BeforeAll hook
 * Requirements:
 * - Log suite initialization
 * - Record suite start time
 * - Initialize global resources
 * - Set up any required test data
 */

/**
 * TODO: Implement AfterAll hook
 * Requirements:
 * - Log suite completion
 * - Calculate total execution time
 * - Generate execution summary
 * - Clean up global resources
 */

/**
 * TODO: Implement Before hook
 * Requirements:
 * - Log scenario start
 * - Initialize scenario-specific data
 * - Reset step counter
 * - Access scenario name and tags
 */

/**
 * TODO: Implement After hook
 * Requirements:
 * - Log scenario completion
 * - Check scenario result status
 * - Handle failure scenarios
 * - Clean up scenario resources
 */

/**
 * TODO: Implement BeforeStep hook
 * Requirements:
 * - Log step execution start
 * - Increment step counter
 * - Record step start time
 * - Access step text
 */

/**
 * TODO: Implement AfterStep hook
 * Requirements:
 * - Log step completion
 * - Calculate step duration
 * - Handle step failures
 * - Track performance metrics
 */
```

**Expected Implementation:**
```typescript
// hooks/basic-hooks.ts - Solution
import { 
    BeforeAll, 
    AfterAll, 
    Before, 
    After, 
    BeforeStep, 
    AfterStep,
    ITestCaseHookParameter,
    ITestStepHookParameter
} from '@cucumber/cucumber';

interface TestState {
    suiteStartTime?: Date;
    scenarioStartTime?: Date;
    stepCounter: number;
    errors: string[];
    sharedData: Map<string, any>;
}

let testState: TestState = {
    stepCounter: 0,
    errors: [],
    sharedData: new Map()
};

BeforeAll(async function() {
    console.log('🚀 Starting test suite execution');
    testState.suiteStartTime = new Date();
    testState.sharedData.set('suiteId', `suite-${Date.now()}`);
    
    // Initialize global resources
    console.log(`📊 Suite initialized at: ${testState.suiteStartTime.toISOString()}`);
});

AfterAll(async function() {
    console.log('🏁 Completing test suite execution');
    
    const endTime = new Date();
    const duration = endTime.getTime() - (testState.suiteStartTime?.getTime() || 0);
    
    console.log(`📈 Suite Summary:`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Total Steps: ${testState.stepCounter}`);
    console.log(`   Errors: ${testState.errors.length}`);
    
    console.log('✅ Test suite completed');
});

Before(async function(this: ITestCaseHookParameter) {
    console.log(`🎬 Starting scenario: "${this.pickle.name}"`);
    testState.scenarioStartTime = new Date();
    testState.stepCounter = 0;
    
    const scenarioData = {
        id: `scenario-${Date.now()}`,
        name: this.pickle.name,
        tags: this.pickle.tags?.map(tag => tag.name) || [],
        startTime: testState.scenarioStartTime
    };
    
    testState.sharedData.set('currentScenario', scenarioData);
    console.log(`🏷️  Tags: ${scenarioData.tags.join(', ') || 'none'}`);
});

After(async function(this: ITestCaseHookParameter) {
    const scenario = testState.sharedData.get('currentScenario');
    const endTime = new Date();
    const duration = endTime.getTime() - (scenario?.startTime?.getTime() || 0);
    
    console.log(`🎭 Completing scenario: "${this.pickle.name}"`);
    console.log(`   Status: ${this.result?.status || 'unknown'}`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Steps executed: ${testState.stepCounter}`);
    
    if (this.result?.status === 'FAILED') {
        const errorMsg = `${this.pickle.name}: ${this.result.message}`;
        testState.errors.push(errorMsg);
        console.error(`❌ Scenario failed: ${this.result.message}`);
    }
    
    console.log(`✅ Scenario cleanup completed`);
});

BeforeStep(async function(this: ITestStepHookParameter) {
    testState.stepCounter++;
    const stepText = this.pickleStep.text;
    
    console.log(`👟 Step ${testState.stepCounter}: ${stepText}`);
    testState.sharedData.set(`step-${testState.stepCounter}-start`, Date.now());
});

AfterStep(async function(this: ITestStepHookParameter) {
    const stepText = this.pickleStep.text;
    const startTime = testState.sharedData.get(`step-${testState.stepCounter}-start`);
    const duration = Date.now() - (startTime || 0);
    
    console.log(`   ✨ Step ${testState.stepCounter} completed in ${duration}ms`);
    
    if (this.result?.status === 'FAILED') {
        console.error(`   ❌ Step failed: ${this.result.message}`);
    }
    
    if (duration > 1000) {
        console.warn(`   ⚠️  Slow step detected: ${duration}ms`);
    }
});
```

### **Task 2: Error Handling Implementation (10 minutes)**

Create robust error handling patterns for hook failures.

**File**: `hooks/error-handling.ts`

```typescript
// hooks/error-handling.ts
import { Before, After, ITestCaseHookParameter } from '@cucumber/cucumber';

interface ErrorContext {
    scenarioName: string;
    errorTime: Date;
    errorType: string;
    stackTrace?: string;
    recoveryActions: string[];
}

// TODO: Implement error handling hooks
// Requirements:
// 1. Create Before hook that might throw errors
// 2. Create After hook that handles failures gracefully
// 3. Implement recovery mechanisms
// 4. Log comprehensive error information
// 5. Demonstrate different error types

/**
 * TODO: Implement error-prone Before hook
 * Should simulate potential setup failures like:
 * - Database connection issues
 * - External service unavailability
 * - Configuration problems
 */

/**
 * TODO: Implement robust After hook
 * Should handle:
 * - Scenario failures
 * - Hook failures
 * - Recovery attempts
 * - Error logging
 */

/**
 * TODO: Implement recovery function
 * Should attempt:
 * - Resource cleanup
 * - State reset
 * - Connection recovery
 * - Graceful degradation
 */
```

**Expected Implementation:**
```typescript
// hooks/error-handling.ts - Solution
import { Before, After, ITestCaseHookParameter } from '@cucumber/cucumber';

interface ErrorContext {
    scenarioName: string;
    errorTime: Date;
    errorType: string;
    stackTrace?: string;
    recoveryActions: string[];
}

// Simulate error conditions for demonstration
let simulateErrors = false;
let errorCounter = 0;

Before({ tags: '@error-prone' }, async function() {
    console.log('🔧 Setting up error-prone scenario');
    
    if (simulateErrors && Math.random() < 0.3) {
        throw new Error('Simulated setup failure: Database connection timeout');
    }
    
    // Simulate other potential issues
    if (errorCounter++ % 5 === 0) {
        console.warn('⚠️  Warning: External service responding slowly');
    }
    
    console.log('✅ Setup completed successfully');
});

After(async function(this: ITestCaseHookParameter) {
    if (this.result?.status === 'FAILED') {
        const errorContext: ErrorContext = {
            scenarioName: this.pickle.name,
            errorTime: new Date(),
            errorType: 'SCENARIO_FAILURE',
            stackTrace: this.result.message,
            recoveryActions: []
        };
        
        try {
            await performRecoveryActions(errorContext);
            console.log(`🔧 Recovery completed for: ${errorContext.scenarioName}`);
        } catch (recoveryError) {
            console.error('❌ Recovery failed:', recoveryError);
            errorContext.recoveryActions.push('RECOVERY_FAILED');
        }
        
        await logErrorDetails(errorContext);
    }
});

async function performRecoveryActions(context: ErrorContext): Promise<void> {
    console.log(`🔧 Attempting recovery for: ${context.scenarioName}`);
    
    // Simulate various recovery actions
    try {
        await simulateResourceCleanup();
        context.recoveryActions.push('RESOURCE_CLEANUP');
    } catch (error) {
        console.warn('Resource cleanup failed:', error);
    }
    
    try {
        await simulateStateReset();
        context.recoveryActions.push('STATE_RESET');
    } catch (error) {
        console.warn('State reset failed:', error);
    }
    
    try {
        await simulateConnectionRecovery();
        context.recoveryActions.push('CONNECTION_RECOVERY');
    } catch (error) {
        console.warn('Connection recovery failed:', error);
    }
    
    console.log(`✅ Recovery actions: ${context.recoveryActions.join(', ')}`);
}

async function logErrorDetails(context: ErrorContext): Promise<void> {
    console.error('📋 Error Details:');
    console.error(`   Scenario: ${context.scenarioName}`);
    console.error(`   Time: ${context.errorTime.toISOString()}`);
    console.error(`   Type: ${context.errorType}`);
    console.error(`   Stack: ${context.stackTrace}`);
    console.error(`   Recovery: ${context.recoveryActions.join(', ')}`);
}

// Utility functions for recovery simulation
async function simulateResourceCleanup(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('   🧹 Resources cleaned up');
}

async function simulateStateReset(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log('   🔄 State reset completed');
}

async function simulateConnectionRecovery(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('   🔗 Connection recovery attempted');
}
```

### **Task 3: State Management Implementation (10 minutes)**

Create sophisticated state management patterns between hooks and steps.

**File**: `hooks/state-management.ts`

```typescript
// hooks/state-management.ts
import { Before, After, BeforeStep, AfterStep } from '@cucumber/cucumber';

// TODO: Design and implement comprehensive state management
// Requirements:
// 1. Create shared state interface
// 2. Implement state initialization
// 3. Create state sharing mechanisms
// 4. Handle state cleanup
// 5. Provide state validation

/**
 * TODO: Define shared state interface
 * Should include:
 * - User data
 * - Application state
 * - Test metadata
 * - Performance metrics
 */

/**
 * TODO: Implement state management class
 * Should provide:
 * - State initialization
 * - State sharing
 * - State validation
 * - State cleanup
 */

/**
 * TODO: Create hooks for state management
 * Should handle:
 * - State setup before scenarios
 * - State cleanup after scenarios
 * - State monitoring during steps
 */
```

**Expected Implementation:**
```typescript
// hooks/state-management.ts - Solution
import { Before, After, BeforeStep, AfterStep, ITestCaseHookParameter } from '@cucumber/cucumber';

interface SharedState {
    userData: {
        currentUser?: any;
        authToken?: string;
        permissions?: string[];
    };
    applicationState: {
        currentPage?: string;
        navigationHistory: string[];
        formData: Map<string, any>;
    };
    testMetadata: {
        scenarioId: string;
        startTime: Date;
        stepCount: number;
        tags: string[];
    };
    performanceMetrics: {
        pageLoadTimes: number[];
        apiResponseTimes: number[];
        stepDurations: number[];
    };
}

class StateManager {
    private static instance: StateManager;
    private state: SharedState;
    
    private constructor() {
        this.state = this.initializeState();
    }
    
    public static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }
    
    private initializeState(): SharedState {
        return {
            userData: {
                permissions: []
            },
            applicationState: {
                navigationHistory: [],
                formData: new Map()
            },
            testMetadata: {
                scenarioId: '',
                startTime: new Date(),
                stepCount: 0,
                tags: []
            },
            performanceMetrics: {
                pageLoadTimes: [],
                apiResponseTimes: [],
                stepDurations: []
            }
        };
    }
    
    public getState(): SharedState {
        return this.state;
    }
    
    public updateUserData(data: Partial<SharedState['userData']>): void {
        this.state.userData = { ...this.state.userData, ...data };
    }
    
    public updateApplicationState(data: Partial<SharedState['applicationState']>): void {
        this.state.applicationState = { ...this.state.applicationState, ...data };
    }
    
    public addMetric(type: keyof SharedState['performanceMetrics'], value: number): void {
        this.state.performanceMetrics[type].push(value);
    }
    
    public resetState(): void {
        this.state = this.initializeState();
    }
    
    public validateState(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        // Validate required fields
        if (!this.state.testMetadata.scenarioId) {
            errors.push('Scenario ID is required');
        }
        
        // Validate data consistency
        if (this.state.applicationState.navigationHistory.length > 100) {
            errors.push('Navigation history is too large');
        }
        
        // Validate performance metrics
        const avgPageLoad = this.state.performanceMetrics.pageLoadTimes
            .reduce((a, b) => a + b, 0) / this.state.performanceMetrics.pageLoadTimes.length;
        
        if (avgPageLoad > 5000) {
            errors.push('Average page load time exceeds threshold');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    public getStateSummary(): string {
        const state = this.state;
        return `
State Summary:
- Scenario: ${state.testMetadata.scenarioId}
- Steps: ${state.testMetadata.stepCount}
- User: ${state.userData.currentUser?.name || 'Anonymous'}
- Current Page: ${state.applicationState.currentPage || 'Unknown'}
- Performance: ${state.performanceMetrics.stepDurations.length} step metrics
        `.trim();
    }
}

// Hook implementations
Before(async function(this: ITestCaseHookParameter) {
    const stateManager = StateManager.getInstance();
    stateManager.resetState();
    
    const state = stateManager.getState();
    state.testMetadata.scenarioId = `scenario-${Date.now()}`;
    state.testMetadata.startTime = new Date();
    state.testMetadata.tags = this.pickle.tags?.map(tag => tag.name) || [];
    
    console.log('📊 State initialized for scenario:', this.pickle.name);
    console.log('🏷️  Tags:', state.testMetadata.tags.join(', '));
});

After(async function(this: ITestCaseHookParameter) {
    const stateManager = StateManager.getInstance();
    const validation = stateManager.validateState();
    
    if (!validation.isValid) {
        console.warn('⚠️  State validation warnings:');
        validation.errors.forEach(error => console.warn(`   - ${error}`));
    }
    
    console.log('📈 Final state summary:');
    console.log(stateManager.getStateSummary());
    
    console.log('🧹 State cleanup completed');
});

BeforeStep(async function() {
    const stateManager = StateManager.getInstance();
    const state = stateManager.getState();
    
    state.testMetadata.stepCount++;
    
    // Record step start time for performance tracking
    const stepStartTime = Date.now();
    state.applicationState.formData.set(`step-${state.testMetadata.stepCount}-start`, stepStartTime);
});

AfterStep(async function() {
    const stateManager = StateManager.getInstance();
    const state = stateManager.getState();
    
    // Calculate step duration
    const stepStartTime = state.applicationState.formData.get(`step-${state.testMetadata.stepCount}-start`);
    if (stepStartTime) {
        const duration = Date.now() - stepStartTime;
        stateManager.addMetric('stepDurations', duration);
        
        if (duration > 2000) {
            console.warn(`⚠️  Slow step detected: ${duration}ms`);
        }
    }
});

// Export for use in step definitions
export { StateManager, SharedState };
```

## 🧪 Test Scenarios

Create feature files to test your hook implementations:

**File**: `features/hook-testing.feature`

```gherkin
Feature: Hook Implementation Testing
  As a developer
  I want to test my hook implementations
  So that I can verify they work correctly

  @basic @fast
  Scenario: Basic hook execution
    Given I start a basic test
    When I perform a simple action
    Then the hooks should execute in correct order

  @error-prone @slow
  Scenario: Error handling demonstration
    Given I start an error-prone test
    When an error might occur
    Then the error should be handled gracefully

  @state-management @medium
  Scenario: State management validation
    Given I initialize shared state
    When I update state through multiple steps
    Then the state should be managed correctly
    And state validation should pass
```

**File**: `step-definitions/hook-test-steps.ts`

```typescript
// step-definitions/hook-test-steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { StateManager } from '../hooks/state-management';

Given('I start a basic test', async function() {
    console.log('🎯 Starting basic test');
});

When('I perform a simple action', async function() {
    console.log('⚡ Performing simple action');
    await new Promise(resolve => setTimeout(resolve, 100));
});

Then('the hooks should execute in correct order', async function() {
    console.log('✅ Hooks executed correctly');
});

Given('I start an error-prone test', async function() {
    console.log('🎯 Starting error-prone test');
});

When('an error might occur', async function() {
    if (Math.random() < 0.1) {
        throw new Error('Simulated random error');
    }
    console.log('⚡ Action completed without error');
});

Then('the error should be handled gracefully', async function() {
    console.log('✅ Error handling verified');
});

Given('I initialize shared state', async function() {
    const stateManager = StateManager.getInstance();
    stateManager.updateUserData({ currentUser: { name: 'Test User' } });
    console.log('📊 Shared state initialized');
});

When('I update state through multiple steps', async function() {
    const stateManager = StateManager.getInstance();
    stateManager.updateApplicationState({ currentPage: 'Test Page' });
    stateManager.addMetric('pageLoadTimes', 1500);
    console.log('🔄 State updated');
});

Then('the state should be managed correctly', async function() {
    const stateManager = StateManager.getInstance();
    const state = stateManager.getState();
    
    if (!state.userData.currentUser?.name) {
        throw new Error('User data not maintained');
    }
    
    if (!state.applicationState.currentPage) {
        throw new Error('Application state not maintained');
    }
    
    console.log('✅ State management verified');
});

Then('state validation should pass', async function() {
    const stateManager = StateManager.getInstance();
    const validation = stateManager.validateState();
    
    if (!validation.isValid) {
        throw new Error(`State validation failed: ${validation.errors.join(', ')}`);
    }
    
    console.log('✅ State validation passed');
});
```

## ✅ Verification Steps

Run your implementation and verify:

1. **Hook Execution Order**:
   ```bash
   npx cucumber-js features/hook-testing.feature --tags "@basic"
   ```
   Expected output should show hooks executing in correct order.

2. **Error Handling**:
   ```bash
   npx cucumber-js features/hook-testing.feature --tags "@error-prone"
   ```
   Verify graceful error handling and recovery.

3. **State Management**:
   ```bash
   npx cucumber-js features/hook-testing.feature --tags "@state-management"
   ```
   Confirm state is properly managed across steps.

## 📊 Assessment Criteria

### **Technical Implementation (40%)**
- ✅ All hook types implemented correctly
- ✅ Proper TypeScript typing and async patterns
- ✅ Error handling demonstrates best practices
- ✅ State management is robust and reliable

### **Code Quality (30%)**
- ✅ Clean, readable, and well-documented code
- ✅ Consistent naming conventions
- ✅ Proper separation of concerns
- ✅ Following TypeScript best practices

### **Functionality (20%)**
- ✅ Hooks execute in correct order
- ✅ Error scenarios are handled gracefully
- ✅ State is shared effectively between hooks and steps
- ✅ Performance monitoring works correctly

### **Documentation (10%)**
- ✅ Clear comments explaining implementation decisions
- ✅ Usage examples are provided
- ✅ Error handling strategies are documented
- ✅ State management patterns are explained

## 🎯 Success Criteria

**Minimum Requirements:**
- All six hook types implemented and working
- Basic error handling in place
- State can be shared between hooks and steps
- Tests pass successfully

**Excellence Indicators:**
- Sophisticated error recovery mechanisms
- Comprehensive state management with validation
- Performance monitoring and optimization
- Clean, production-ready code quality

## 🔗 Next Steps

After completing this exercise:
1. Review your implementation with peers or instructor
2. Identify areas for improvement or optimization
3. Move on to [Exercise 02: Tag Strategy Design Lab](./02-tag-strategy-design-lab.md)
4. Consider how hooks will integrate with more complex scenarios

---

**Estimated Completion Time**: 30 minutes  
**Difficulty Level**: Beginner  
**Skills Developed**: Hook implementation, error handling, state management, TypeScript integration