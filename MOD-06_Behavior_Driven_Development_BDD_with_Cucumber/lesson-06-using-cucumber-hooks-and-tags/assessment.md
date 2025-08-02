# Assessment: Using Cucumber Hooks and Tags

## Learning Objectives Validation

By completing this assessment, you will demonstrate your ability to:

- ✅ Implement all types of Cucumber hooks (BeforeAll, AfterAll, Before, After, BeforeStep, AfterStep)
- ✅ Design and implement effective tag strategies for test organization
- ✅ Configure conditional execution based on tags and environments
- ✅ Integrate hooks with Playwright browser automation
- ✅ Implement production-ready error handling and monitoring
- ✅ Apply performance optimization techniques for hook execution

## Assessment Structure

| Component | Weight | Duration | Format |
|-----------|---------|----------|---------|
| **Theoretical Knowledge** | 25% | 20 minutes | Multiple Choice + Short Answer |
| **Practical Implementation** | 50% | 60 minutes | Hands-on Coding |
| **Production Integration** | 25% | 30 minutes | Scenario-based Problem Solving |

---

## Part 1: Theoretical Knowledge (25 points)

### Multiple Choice Questions (15 points)

**Question 1:** Which hook executes once before all scenarios in a test suite?
- A) `Before`
- B) `BeforeAll` ✓
- C) `BeforeStep`
- D) `BeforeFeature`

**Question 2:** What is the correct tag expression to run critical tests but exclude work-in-progress scenarios?
- A) `@critical and @wip`
- B) `@critical or not @wip`
- C) `@critical and not @wip` ✓
- D) `not @critical and @wip`

**Question 3:** In a production environment, which hook is MOST appropriate for browser lifecycle management?
- A) `BeforeStep` and `AfterStep`
- B) `Before` and `After`
- C) `BeforeAll` and `AfterAll` ✓
- D) All hooks equally

**Question 4:** Which tag filtering strategy is best for CI/CD pipeline optimization?
- A) Run all tests every time
- B) Use environment-specific and priority-based tags ✓
- C) Only use feature-based tags
- D) Avoid tags in CI/CD

**Question 5:** When should you use conditional hook execution?
- A) Never, all hooks should always run
- B) When hooks are environment or test-type specific ✓
- C) Only in development environments
- D) Only for performance testing

### Short Answer Questions (10 points)

**Question 6:** (3 points) Explain the difference between `Before` and `BeforeAll` hooks in terms of execution frequency and resource management.

**Expected Answer:**
- `BeforeAll`: Executes once before all scenarios, ideal for expensive setup like browser initialization
- `Before`: Executes before each scenario, suitable for scenario-specific setup like creating fresh browser contexts
- Resource impact: `BeforeAll` for global resources, `Before` for per-test isolation

**Question 7:** (4 points) Design a tag strategy for an e-commerce application with the following requirements:
- Environment separation (dev, staging, prod)
- Test types (smoke, integration, e2e)
- Feature areas (login, checkout, search)
- Priority levels (critical, medium, low)

**Expected Answer:**
```
Environment: @dev, @staging, @prod
Test Types: @smoke, @integration, @e2e
Features: @login, @checkout, @search
Priority: @critical, @medium, @low

Example scenarios:
@smoke @critical @login @dev
@e2e @medium @checkout @staging
@integration @low @search @prod
```

**Question 8:** (3 points) List three essential elements that should be included in an error handling strategy for production hooks.

**Expected Answer:**
1. Screenshot capture and page source saving for debugging
2. Retry logic with exponential backoff for transient failures
3. Comprehensive logging with metrics integration for monitoring

---

## Part 2: Practical Implementation (50 points)

### Task 1: Hook Implementation (20 points)

**Scenario:** Create a comprehensive hook setup for a login feature test suite.

**Requirements:**
- Implement all hook types with proper error handling
- Integrate with Playwright for browser automation
- Include performance monitoring
- Add conditional execution based on tags

**Implementation Template:**

```typescript
// hooks/login-hooks.ts
import { BeforeAll, AfterAll, Before, After, BeforeStep, AfterStep } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { performance } from 'perf_hooks';

// Your implementation here
```

**Evaluation Criteria:**
- **Browser Lifecycle Management (5 points)**: Proper BeforeAll/AfterAll implementation
- **Scenario Isolation (5 points)**: Correct Before/After hook usage
- **Error Handling (5 points)**: Comprehensive try-catch with recovery
- **Performance Monitoring (3 points)**: Timing and metrics collection
- **Code Quality (2 points)**: TypeScript best practices and documentation

### Task 2: Tag Strategy Implementation (15 points)

**Scenario:** Design and implement a tag filtering system for the following test scenarios:

```gherkin
@smoke @critical @login @dev
Scenario: Successful login with valid credentials

@integration @medium @checkout @staging  
Scenario: Complete purchase flow

@e2e @low @search @prod
Scenario: Advanced search functionality

@api @critical @checkout @dev
Scenario: Payment API validation
```

**Requirements:**
- Create conditional hooks that execute based on tag combinations
- Implement environment-specific configuration
- Add CI/CD pipeline integration examples

**Evaluation Criteria:**
- **Tag Logic Implementation (5 points)**: Correct conditional execution
- **Environment Configuration (5 points)**: Proper environment handling
- **Pipeline Integration (3 points)**: CI/CD examples and configuration
- **Documentation (2 points)**: Clear usage instructions

### Task 3: Production Error Handling (15 points)

**Scenario:** Implement a production-ready error handling system for hooks.

**Requirements:**
- Handle different error types (browser, network, assertion, system)
- Implement retry mechanisms with backoff strategies
- Include monitoring integration (metrics, alerts)
- Provide graceful degradation patterns

**Test Cases to Handle:**
1. Browser crash during `BeforeAll`
2. Network timeout in `Before` hook
3. Page load failure in `BeforeStep`
4. Context creation failure in `After` hook

**Evaluation Criteria:**
- **Error Classification (4 points)**: Proper error type identification
- **Recovery Strategies (4 points)**: Effective retry and fallback logic
- **Monitoring Integration (4 points)**: Metrics and alerting implementation
- **Graceful Degradation (3 points)**: System stability under failure

---

## Part 3: Production Integration (25 points)

### Scenario-Based Problem Solving

**Context:** You're implementing hooks and tags for a large-scale e-commerce platform with the following requirements:

- **Scale**: 500+ test scenarios across 10 feature areas
- **Environments**: Development, Staging, Production
- **Team Structure**: 15 QA engineers across 3 time zones
- **CI/CD**: Multiple pipelines (PR validation, nightly regression, release verification)
- **Performance**: Tests must complete within SLA requirements
- **Reliability**: 99.5% success rate requirement

### Problem 1: Performance Optimization (10 points)

**Challenge:** Test suite execution time has increased from 45 minutes to 2.5 hours due to inefficient hook usage.

**Your Tasks:**
1. Analyze the performance bottlenecks in hook execution
2. Design an optimization strategy
3. Implement monitoring to prevent future performance degradation

**Deliverables:**
- Performance analysis report
- Optimization implementation plan
- Monitoring dashboard design

### Problem 2: Tag Strategy at Scale (10 points)

**Challenge:** With 15 QA engineers, tag usage has become inconsistent, leading to test execution conflicts and CI/CD pipeline failures.

**Your Tasks:**
1. Design a standardized tag taxonomy
2. Create governance guidelines
3. Implement automation to enforce tag consistency

**Deliverables:**
- Tag taxonomy documentation
- Team guidelines and training materials
- Automation script for tag validation

### Problem 3: Production Monitoring (5 points)

**Challenge:** Intermittent hook failures in production are causing test instability, but the team lacks visibility into failure patterns.

**Your Tasks:**
1. Design a comprehensive monitoring strategy
2. Implement alerting for critical failure patterns
3. Create dashboards for proactive issue detection

**Deliverables:**
- Monitoring architecture diagram
- Alert configuration
- Dashboard wireframes

---

## Assessment Rubric

### Scoring Guidelines

| Grade | Score Range | Criteria |
|-------|-------------|----------|
| **Excellent (A)** | 90-100 | Demonstrates mastery of all concepts with production-ready implementations |
| **Proficient (B)** | 80-89 | Shows solid understanding with minor gaps in advanced concepts |
| **Developing (C)** | 70-79 | Basic understanding present but needs improvement in complex scenarios |
| **Needs Improvement (D)** | 60-69 | Limited understanding with significant gaps in key concepts |
| **Insufficient (F)** | Below 60 | Major deficiencies requiring additional learning |

### Detailed Evaluation Criteria

#### Technical Implementation (40%)
- **Code Quality**: Clean, readable, maintainable TypeScript code
- **Best Practices**: Following Cucumber and Playwright conventions
- **Error Handling**: Comprehensive and production-ready error management
- **Performance**: Efficient resource usage and optimization

#### Problem-Solving Approach (30%)
- **Analysis**: Systematic approach to identifying issues
- **Solution Design**: Well-thought-out and scalable solutions
- **Implementation**: Practical and effective implementations
- **Testing**: Proper validation of solutions

#### Production Readiness (20%)
- **Scalability**: Solutions work at enterprise scale
- **Reliability**: High availability and fault tolerance
- **Monitoring**: Comprehensive observability and alerting
- **Documentation**: Clear and complete documentation

#### Collaboration and Communication (10%)
- **Documentation**: Clear explanation of design decisions
- **Knowledge Sharing**: Ability to teach concepts to others
- **Team Integration**: Solutions that work well in team environments
- **Standards Compliance**: Following established team practices

---

## Sample Solutions and Reference Implementations

### Hook Implementation Example

```typescript
// Production-ready hook implementation
import { BeforeAll, AfterAll, Before, After, BeforeStep, AfterStep } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { performance } from 'perf_hooks';

class HookManager {
  private static browser: Browser;
  private static contexts: Map<string, BrowserContext> = new Map();
  private static metrics: Map<string, number> = new Map();

  static async initializeBrowser(): Promise<void> {
    const startTime = performance.now();
    try {
      this.browser = await chromium.launch({
        headless: process.env.CI === 'true',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const duration = performance.now() - startTime;
      this.metrics.set('browser_init_duration', duration);
      console.log(`Browser initialized in ${duration.toFixed(2)}ms`);
    } catch (error) {
      console.error('Browser initialization failed:', error);
      throw error;
    }
  }

  static async createContext(scenarioName: string): Promise<BrowserContext> {
    const startTime = performance.now();
    try {
      const context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: process.env.RECORD_VIDEO === 'true' ? { dir: 'videos' } : undefined
      });
      
      this.contexts.set(scenarioName, context);
      const duration = performance.now() - startTime;
      this.metrics.set(`context_${scenarioName}_duration`, duration);
      
      return context;
    } catch (error) {
      console.error(`Context creation failed for ${scenarioName}:`, error);
      throw error;
    }
  }
}

BeforeAll(async function() {
  await HookManager.initializeBrowser();
});

Before(async function(scenario) {
  if (scenario.pickle.tags.some(tag => tag.name === '@browser')) {
    const context = await HookManager.createContext(scenario.pickle.name);
    this.context = context;
    this.page = await context.newPage();
  }
});

After(async function(scenario) {
  if (this.context) {
    if (scenario.result?.status === 'FAILED') {
      await this.page.screenshot({ 
        path: `screenshots/failed-${Date.now()}.png`,
        fullPage: true 
      });
    }
    await this.context.close();
  }
});

AfterAll(async function() {
  if (HookManager.browser) {
    await HookManager.browser.close();
  }
});
```

### Tag Strategy Example

```javascript
// cucumber.js configuration
module.exports = {
  default: {
    require: ['step-definitions/**/*.ts', 'hooks/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber_report.json'
    ],
    publishQuiet: true,
    tags: process.env.CUCUMBER_TAGS || '@smoke and not @wip'
  },
  
  // Environment-specific profiles
  dev: {
    tags: '@dev and (@smoke or @integration)'
  },
  
  staging: {
    tags: '@staging and (@integration or @e2e)'
  },
  
  prod: {
    tags: '@prod and @smoke and @critical'
  }
};
```

---

## Assessment Submission Guidelines

### Submission Format
- **Code Files**: All TypeScript implementations
- **Documentation**: README with setup and usage instructions
- **Test Reports**: Evidence of successful test execution
- **Reflection**: Brief analysis of your learning journey

### Evaluation Timeline
- **Submission Deadline**: End of lesson week
- **Initial Review**: Within 2 business days
- **Feedback Provided**: Within 3 business days
- **Revision Period**: 1 week if needed

### Resources Available During Assessment
- Official Cucumber.js documentation
- Playwright documentation
- Previous lesson materials
- Example implementations from exercises

---

## Post-Assessment Learning Path

Based on your assessment results, consider these next steps:

### For High Performers (90+)
- Explore advanced Cucumber patterns in Lesson 07
- Consider mentoring other learners
- Contribute to team hook libraries

### For Proficient Learners (80-89)
- Review complex error handling patterns
- Practice more production integration scenarios
- Focus on performance optimization techniques

### For Developing Learners (70-79)
- Revisit hook lifecycle concepts
- Practice tag filtering extensively
- Work through additional hands-on exercises

### For Those Needing Improvement (<70)
- Schedule one-on-one mentoring session
- Repeat key exercises from this lesson
- Review fundamental concepts before proceeding

---

## Additional Practice Resources

- **Interactive Hook Simulator**: [`visuals/10-hook-decision-tree.html`](visuals/10-hook-decision-tree.html)
- **Tag Strategy Playground**: Online tool for testing tag expressions
- **Performance Monitoring Dashboard**: Template for production monitoring
- **Error Handling Scenarios**: Additional practice problems

---

## Assessment Feedback Template

```markdown
# Assessment Feedback: [Student Name]

## Overall Score: [X]/100

### Strengths Demonstrated
- [Specific strengths observed]

### Areas for Improvement
- [Specific areas needing development]

### Specific Feedback by Section

#### Theoretical Knowledge
- Score: [X]/25
- Comments: [Detailed feedback]

#### Practical Implementation  
- Score: [X]/50
- Comments: [Detailed feedback]

#### Production Integration
- Score: [X]/25
- Comments: [Detailed feedback]

### Recommendations for Continued Learning
- [Specific recommendations]

### Next Steps
- [Action items for improvement]
```

This comprehensive assessment ensures learners have mastered the essential concepts of Cucumber hooks and tags while preparing them for real-world implementation challenges.