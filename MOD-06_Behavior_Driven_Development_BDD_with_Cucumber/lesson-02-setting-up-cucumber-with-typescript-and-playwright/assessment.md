# Lesson 02 Assessment: Setting up Cucumber with TypeScript and Playwright

## 📋 Assessment Overview

This comprehensive assessment validates your understanding of BDD environment setup, configuration management, and troubleshooting skills acquired in Lesson 02.

**Assessment Type**: Mixed (Theory + Practical)  
**Duration**: 90 minutes  
**Passing Score**: 80% (32/40 points)  
**Format**: Progressive difficulty with practical validation

---

## Part A: Conceptual Understanding (15 points)

### Question A1: BDD Environment Architecture (5 points)

**Scenario**: You need to explain the BDD testing architecture to a new team member.

Draw and label a diagram showing the relationship between:
- Cucumber.js
- TypeScript compiler
- Playwright browser automation
- Test execution flow
- Configuration files

**Answer in the text box below:**
```
┌─────────────────────────────────────────────────────────────┐
│                    BDD Testing Architecture                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Feature Files (.feature)]                                 │
│            │                                                │
│            ▼                                                │
│  [Cucumber.js Runner] ←─── cucumber.json                    │
│            │                                                │
│            ▼                                                │
│  [Step Definitions (.ts)] ←─── tsconfig.json               │
│            │                                                │
│            ▼                                                │
│  [TypeScript Compiler]                                      │
│            │                                                │
│            ▼                                                │
│  [World/Context Object]                                     │
│            │                                                │
│            ▼                                                │
│  [Playwright Browser] ←─── playwright.config.ts            │
│            │                                                │
│            ▼                                                │
│  [Test Execution & Reporting]                              │
└─────────────────────────────────────────────────────────────┘
```

**Scoring Rubric:**
- 5 points: Complete architecture with correct relationships
- 3-4 points: Most components shown with minor gaps
- 1-2 points: Basic understanding with significant gaps
- 0 points: Incorrect or missing diagram

### Question A2: Configuration File Roles (5 points)

Match each configuration file with its primary purpose:

| Configuration File | Purpose |
|-------------------|------------|
| 1. `tsconfig.json` | A. Browser automation settings and test execution parameters |
| 2. `cucumber.json` | B. Environment variables and application URLs |
| 3. `playwright.config.ts` | C. TypeScript compilation options and module resolution |
| 4. `.env.development` | D. Cucumber test runner configuration and formatting options |
| 5. `package.json` | E. Project dependencies and npm script definitions |

**Your Answers:**
1. → ___
2. → ___
3. → ___
4. → ___
5. → ___

**Correct Answers:** 1→C, 2→D, 3→A, 4→B, 5→E

### Question A3: Environment Management Strategy (5 points)

**Scenario**: Your team needs to support development, testing, and CI environments with different configurations.

Explain the strategy for managing multiple environments:

1. **File Organization Approach** (2 points):
```
Your answer:
_________________________________________________
_________________________________________________
```

2. **Environment Switching Mechanism** (2 points):
```
Your answer:
_________________________________________________
_________________________________________________
```

3. **Configuration Validation Process** (1 point):
```
Your answer:
_________________________________________________
```

**Sample Answer:**
1. Create environment-specific files (`.env.development`, `.env.testing`, `.env.ci`) with corresponding Cucumber configs
2. Use scripts or environment variables to switch active configurations dynamically
3. Implement validation scripts to verify required variables and file consistency

---

## Part B: Configuration Mastery (15 points)

### Question B1: TypeScript Configuration Analysis (8 points)

**Given Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "baseUrl": "./",
    "paths": {
      "@src/*": ["src/*"],
      "@features/*": ["features/*"]
    }
  },
  "include": ["src/**/*", "features/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Tasks:**

1. **Identify Issues** (4 points):
   - Issue 1: ________________________________
   - Issue 2: ________________________________
   - Issue 3: ________________________________
   - Issue 4: ________________________________

2. **Provide Fixes** (4 points):
   - Fix 1: _________________________________
   - Fix 2: _________________________________
   - Fix 3: _________________________________
   - Fix 4: _________________________________

**Sample Issues & Fixes:**
1. Issue: `target: ES2018` too old → Fix: `target: ES2020`
2. Issue: `strict: false` reduces type safety → Fix: `strict: true`
3. Issue: Missing `allowSyntheticDefaultImports` → Fix: Add `allowSyntheticDefaultImports: true`
4. Issue: Missing `declaration` for library builds → Fix: Add `declaration: true` if needed

### Question B2: Cucumber Configuration Optimization (7 points)

**Scenario**: Configure Cucumber for optimal CI/CD performance.

**Requirements:**
- Parallel execution with 4 workers
- JSON and HTML reports
- JUnit XML for CI integration
- Retry flaky tests once
- Exclude manual tests
- Include progress and summary information

**Write the complete configuration:**

```json
{
  "default": {
    // Your configuration here
  }
}
```

**Sample Solution:**
```json
{
  "default": {
    "require": [
      "features/step_definitions/**/*.ts",
      "features/support/**/*.ts"
    ],
    "requireModule": ["ts-node/register"],
    "format": [
      "progress-bar",
      "summary",
      "json:reports/ci-results.json",
      "html:reports/ci-report.html",
      "junit:reports/junit.xml"
    ],
    "parallel": 4,
    "retry": 1,
    "retryTagFilter": "@flaky",
    "tags": "not @manual",
    "publishQuiet": true
  }
}
```

---

## Part C: Practical Implementation (10 points)

### Question C1: Environment Loader Implementation (10 points)

**Task**: Complete the missing functionality in the `EnvironmentLoader` class.

```typescript
export class EnvironmentLoader {
  private static instance: EnvironmentLoader;
  private config: EnvironmentConfig;
  
  static getInstance(): EnvironmentLoader {
    // Implementation needed (2 points)
    if (!EnvironmentLoader.instance) {
      EnvironmentLoader.instance = new EnvironmentLoader();
    }
    return EnvironmentLoader.instance;
  }
  
  private loadEnvironment(): void {
    // Implementation needed (4 points)
    const environment = process.env.NODE_ENV || 'development';
    const envFile = `.env.${environment}`;
    const envPath = path.resolve(process.cwd(), envFile);
    
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      console.log(`Environment loaded: ${environment}`);
    } else {
      console.warn(`Environment file not found: ${envFile}`);
      // Load default .env as fallback
      dotenv.config();
    }
  }
  
  validateEnvironment(): void {
    // Implementation needed (4 points)
    const required = ['BASE_URL', 'BROWSER'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    // Validate BASE_URL format
    const baseUrl = process.env.BASE_URL;
    if (baseUrl && !baseUrl.match(/^https?:\/\/.+/)) {
      throw new Error('BASE_URL must be a valid HTTP/HTTPS URL');
    }
  }
}
```

**Scoring:**
- Singleton pattern: 2 points
- Environment loading logic: 4 points  
- Validation implementation: 4 points

---

## Part D: Troubleshooting Scenarios (10 points)

### Question D1: Debug Failing Tests (Practical Exercise)

**Scenario**: Tests are failing intermittently with the following errors:

```
Error: Test failed: page.click: Target closed
Error: Test failed: page.goto: Navigation timeout exceeded
Error: Test failed: expect(locator).toBeVisible(): Locator resolved to hidden element
```

**Your Task**: For each error, provide:

1. **Root Cause Analysis** (3 points)
2. **Solution Implementation** (4 points)  
3. **Prevention Strategy** (3 points)

**Error 1: Target closed**
- Root Cause: _________________________________
- Solution: __________________________________
- Prevention: ________________________________

**Error 2: Navigation timeout**
- Root Cause: _________________________________
- Solution: __________________________________
- Prevention: ________________________________

**Error 3: Hidden element**
- Root Cause: _________________________________
- Solution: __________________________________
- Prevention: ________________________________

**Sample Answers:**

**Error 1: Target closed**
- Root Cause: Browser/page closed before interaction completion
- Solution: Ensure proper lifecycle management and await all operations
- Prevention: Implement proper cleanup in hooks and check object state

**Error 2: Navigation timeout**
- Root Cause: Page taking longer than default timeout to load
- Solution: Increase timeout or use proper wait conditions
- Prevention: Use `waitUntil: 'networkidle'` and implement retry logic

**Error 3: Hidden element**
- Root Cause: Element not visible due to CSS, animations, or loading states
- Solution: Wait for element visibility before interactions
- Prevention: Use web-first assertions and proper element state checks

---

## Practical Validation Tasks

### Task 1: Complete BDD Project Setup (Bonus)

**Time Limit**: 30 minutes

**Requirements**:
1. Initialize a new BDD project from scratch
2. Configure TypeScript with proper settings
3. Set up Cucumber with TypeScript integration
4. Configure Playwright for browser automation
5. Create a simple feature with step definitions
6. Implement environment switching
7. Validate the setup works

**Deliverables**:
- [ ] Working project structure
- [ ] All configuration files properly set
- [ ] Sample test passing
- [ ] Environment switching functional
- [ ] Documentation of setup process

### Task 2: Troubleshoot Provided Project (Bonus)

**Time Limit**: 20 minutes

**Scenario**: You receive a BDD project with multiple configuration issues. Fix all issues and document your solutions.

**Common Issues to Find**:
- TypeScript compilation errors
- Missing dependencies
- Incorrect path mappings
- Environment variable conflicts
- Cucumber configuration problems
- Browser automation setup issues

---

## Assessment Answer Key & Scoring

### Summary of Points

| Section | Points Available | Your Score |
|---------|------------------|------------|
| Part A: Conceptual Understanding | 15 | ___ / 15 |
| Part B: Configuration Mastery | 15 | ___ / 15 |
| Part C: Practical Implementation | 10 | ___ / 10 |
| Part D: Troubleshooting | 10 | ___ / 10 |
| **Total** | **40** | **___ / 40** |
| **Percentage** | **100%** | **___%** |

### Grading Scale

| Score Range | Grade | Status |
|-------------|-------|---------|
| 36-40 (90-100%) | A | Excellent - Ready for advanced topics |
| 32-35 (80-89%) | B | Good - Meets requirements |
| 28-31 (70-79%) | C | Satisfactory - Review recommended |
| Below 28 (< 70%) | F | Needs improvement - Restudy required |

### Required Score for Progression

**Minimum Passing Score**: 32/40 (80%)

### Next Steps Based on Score

**Score 36-40**: Proceed to Lesson 03 with confidence
**Score 32-35**: Proceed to Lesson 03, review weak areas  
**Score 28-31**: Review lesson content, retake assessment
**Score < 28**: Restudy entire lesson, complete additional exercises

---

## Self-Reflection Questions

After completing this assessment, reflect on:

1. **What concepts do I feel most confident about?**
   _________________________________________________

2. **Which areas need more practice?**
   _________________________________________________

3. **How will I apply this knowledge in real projects?**
   _________________________________________________

4. **What additional resources would be helpful?**
   _________________________________________________

---

## Assessment Completion Checklist

- [ ] All theoretical questions answered
- [ ] Practical implementations completed
- [ ] Code solutions tested and validated
- [ ] Score calculated and recorded
- [ ] Areas for improvement identified
- [ ] Next steps planned based on performance
- [ ] Self-reflection completed

**Assessment Date**: _______________  
**Time Taken**: _____ minutes  
**Final Score**: _____ / 40 (_____%)  
**Status**: [ ] Pass [ ] Needs Review [ ] Retake Required

---

## Instructor Feedback Section

**Strengths Demonstrated**:
_________________________________________________
_________________________________________________

**Areas for Improvement**:
_________________________________________________
_________________________________________________

**Recommendations**:
_________________________________________________
_________________________________________________

**Overall Assessment**: [ ] Exceeds Expectations [ ] Meets Expectations [ ] Below Expectations

**Instructor Signature**: _______________
**Date**: _______________

---

## Additional Resources for Review

If you scored below 80%, review these specific resources:

- **TypeScript Configuration**: [Lesson 02 Content Section 2](content.md#typescript-configuration)
- **Cucumber Setup**: [Example 01 - Complete Project Setup](examples/01-complete-project-setup.md)
- **Environment Management**: [Exercise 03 - Multi-Environment Setup](exercises/03-multi-environment-setup.md)
- **Troubleshooting**: [Exercise 04 - Advanced Troubleshooting Lab](exercises/04-advanced-troubleshooting-lab.md)

**Practice Recommendations**:
1. Set up 3 different BDD projects from scratch
2. Practice troubleshooting common configuration issues
3. Implement environment switching in existing projects
4. Join BDD community forums for real-world problem solving

Your BDD setup mastery is the foundation for all advanced testing scenarios. Take time to perfect these skills! 🎯