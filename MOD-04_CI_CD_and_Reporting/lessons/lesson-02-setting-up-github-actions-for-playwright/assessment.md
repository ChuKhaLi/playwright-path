# Assessment: Setting up GitHub Actions for Playwright

## Overview

This assessment evaluates your understanding of GitHub Actions workflows, CI/CD pipeline configuration, and best practices for automating Playwright tests. The assessment combines theoretical knowledge with practical implementation skills.

## Assessment Structure

- **Multiple Choice Questions**: 15 questions (45 points)
- **Practical Scenarios**: 5 scenario-based questions (30 points)  
- **Hands-on Implementation**: 1 practical project (25 points)
- **Total Points**: 100 points
- **Passing Score**: 75 points
- **Time Limit**: 90 minutes

---

## Part A: Multiple Choice Questions (45 points, 3 points each)

### Question 1
Which of the following is the correct location for GitHub Actions workflow files?

A) `.github/actions/`
B) `.github/workflows/`
C) `.workflows/`
D) `actions/workflows/`

### Question 2
What is the purpose of the `actions/checkout@v4` action in a Playwright workflow?

A) To install Playwright browsers
B) To download the repository code to the runner
C) To set up Node.js environment
D) To upload test artifacts

### Question 3
Which trigger configuration will run the workflow on pushes to main branch and pull requests targeting main?

A) 
```yaml
on:
  push: main
  pull_request: main
```

B)
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

C)
```yaml
on:
  branches: 
    - main
  events:
    - push
    - pull_request
```

D)
```yaml
on: [push, pull_request]
branches: main
```

### Question 4
What is the primary benefit of using `npm ci` instead of `npm install` in CI environments?

A) It's faster for development
B) It installs fewer dependencies
C) It provides consistent, reproducible builds
D) It automatically updates package versions

### Question 5
Which cache configuration is most appropriate for Playwright browsers?

A) Cache only the `node_modules` directory
B) Cache based on `package-lock.json` hash
C) Cache based on Playwright version and operating system
D) Don't cache browsers as they change frequently

### Question 6
What does the `if: always()` condition ensure in an artifact upload step?

A) The step runs only if all previous steps succeeded
B) The step runs regardless of previous step outcomes
C) The step runs only on failure
D) The step runs continuously in a loop

### Question 7
In a matrix strategy, what does `fail-fast: false` accomplish?

A) Makes the workflow run faster
B) Prevents any job failures
C) Allows other matrix combinations to continue if one fails
D) Stops the workflow immediately on first failure

### Question 8
Which environment variable should be set to ensure Playwright runs in headless mode in CI?

A) `HEADLESS=true`
B) `CI=true`
C) `PLAYWRIGHT_HEADLESS=1`
D) `NODE_ENV=ci`

### Question 9
What is the correct way to exclude certain matrix combinations?

A)
```yaml
matrix:
  exclude:
    - os: windows-latest
      browser: webkit
```

B)
```yaml
matrix:
  ignore:
    - windows-latest: webkit
```

C)
```yaml
strategy:
  exclude:
    os: windows-latest
    browser: webkit
```

D)
```yaml
exclude:
  matrix:
    - os: windows-latest
      browser: webkit
```

### Question 10
Which artifact retention period is most appropriate for test reports?

A) 1 day (minimize storage costs)
B) 7 days (short-term debugging)
C) 30 days (compliance and historical analysis)
D) 90 days (maximum retention)

### Question 11
What is the primary purpose of test sharding in CI/CD pipelines?

A) To reduce test complexity
B) To improve test reliability
C) To distribute tests across multiple runners for faster execution
D) To separate different types of tests

### Question 12
Which step should come first in a typical Playwright workflow?

A) Install dependencies
B) Install Playwright browsers
C) Checkout repository code
D) Setup Node.js

### Question 13
What does the `workflow_dispatch` trigger enable?

A) Automatic workflow execution on schedule
B) Manual workflow execution from GitHub UI
C) Workflow execution from external APIs
D) Workflow execution on repository events

### Question 14
Which reporter configuration is most suitable for CI environments?

A) Only HTML reporter for visual analysis
B) Only JSON reporter for programmatic analysis
C) Multiple reporters: HTML, JSON, and JUnit for comprehensive reporting
D) No reporters to save storage space

### Question 15
What is the recommended approach for handling secrets in GitHub Actions?

A) Store them directly in the workflow file
B) Store them in repository secrets and reference with `${{ secrets.SECRET_NAME }}`
C) Store them in environment variables within the workflow
D) Pass them as workflow parameters

---

## Part B: Practical Scenarios (30 points, 6 points each)

### Scenario 1: Performance Optimization
Your Playwright workflow is taking 45 minutes to complete, which is too slow for your development team. The workflow runs tests on 3 browsers and 2 operating systems without any optimization.

**Question**: Describe three specific strategies you would implement to reduce the workflow execution time to under 20 minutes. Include code examples for each strategy.

**Expected Answer Should Include**:
- Matrix optimization with strategic exclusions
- Browser caching implementation
- Test sharding across multiple runners
- Parallel execution strategies
- Selective test execution based on file changes

### Scenario 2: Environment-Specific Testing
Your company has three environments: development (localhost:3000), staging (https://staging.app.com), and production (https://app.com). Tests need to run against different environments based on the trigger.

**Question**: Design a workflow configuration that:
- Runs against development environment for feature branch pushes
- Runs against staging environment for pull requests to main
- Runs against production environment for pushes to main branch
- Allows manual selection of environment via workflow dispatch

**Expected Answer Should Include**:
- Conditional environment variable configuration
- Environment-specific base URL settings
- Proper secret management for different environments
- Trigger-based environment selection logic

### Scenario 3: Failure Handling and Debugging
Your Playwright tests are failing intermittently in CI but passing locally. The failures seem random and don't provide clear error messages.

**Question**: What debugging and failure handling strategies would you implement in your GitHub Actions workflow to identify and resolve these issues? Provide specific configuration examples.

**Expected Answer Should Include**:
- Enhanced logging and debugging configurations
- Screenshot and video capture on failures
- Trace collection for failed tests
- Retry strategies for flaky tests
- Artifact upload for debugging materials

### Scenario 4: Multi-Repository Testing
Your organization has multiple repositories that need to be tested together as an integrated system. Repository A contains the frontend, Repository B contains the backend API, and Repository C contains the E2E tests.

**Question**: Design a workflow strategy that:
- Triggers E2E tests when either frontend or backend changes
- Sets up the complete testing environment
- Handles cross-repository dependencies
- Provides consolidated reporting

**Expected Answer Should Include**:
- Workflow triggering mechanisms
- Repository checkout strategies
- Service orchestration
- Cross-repository artifact sharing
- Dependency management

### Scenario 5: Cost Optimization
Your GitHub Actions usage is exceeding budget due to extensive matrix testing across multiple browsers, operating systems, and Node.js versions.

**Question**: Propose a cost-optimization strategy that maintains adequate test coverage while reducing CI/CD costs by at least 40%. Include specific implementation details.

**Expected Answer Should Include**:
- Smart matrix reduction strategies
- Conditional execution based on change types
- Tiered testing approach (smoke vs. full regression)
- Resource optimization techniques
- Alternative testing strategies for comprehensive coverage

---

## Part C: Hands-on Implementation (25 points)

### Practical Project: E-Commerce CI/CD Pipeline

**Scenario**: You're setting up CI/CD for an e-commerce web application. The application has:
- User authentication and registration
- Product catalog with search functionality
- Shopping cart and checkout process
- Admin dashboard for inventory management
- Mobile-responsive design

**Requirements**: Create a complete GitHub Actions workflow that demonstrates professional CI/CD practices.

### Implementation Tasks (25 points total)

#### Task 1: Workflow Structure (5 points)
Create a workflow file that includes:
- Appropriate naming and documentation
- Multiple trigger configurations
- Global environment variables
- Job dependencies where appropriate

#### Task 2: Matrix Testing Configuration (8 points)
Implement a matrix strategy that:
- Tests on at least 2 operating systems
- Tests on 3 browsers (Chromium, Firefox, WebKit)
- Uses 2 Node.js versions
- Includes strategic exclusions
- Implements test sharding (minimum 2 shards)

#### Task 3: Environment Management (6 points)
Configure environment-specific testing that:
- Supports at least 2 environments (staging and production)
- Uses appropriate secrets management  
- Implements environment-specific base URLs
- Includes conditional test execution

#### Task 4: Reporting and Artifacts (4 points)
Set up comprehensive reporting that:
- Generates HTML and JSON reports
- Uploads artifacts with appropriate retention
- Merges reports from multiple shards
- Provides accessible test results

#### Task 5: Error Handling and Optimization (2 points)
Implement professional practices including:
- Appropriate timeout configurations
- Failure handling strategies
- Performance optimizations
- Clear documentation and comments

### Submission Requirements

1. **Complete workflow file** (`.github/workflows/playwright-e2e.yml`)
2. **Configuration documentation** explaining your design decisions
3. **Example test files** that demonstrate the workflow functionality
4. **Screenshots** of successful workflow execution
5. **Performance analysis** showing execution times and resource usage

### Evaluation Criteria

**Excellent (23-25 points)**:
- Workflow runs successfully with comprehensive matrix coverage
- Professional-grade error handling and optimization
- Clear documentation and best practices implementation
- Innovative solutions to complex requirements

**Good (18-22 points)**:
- Workflow runs successfully with adequate coverage
- Basic error handling and some optimization
- Reasonable documentation
- Meets most requirements

**Satisfactory (15-17 points)**:
- Workflow runs with basic functionality
- Minimal error handling
- Basic documentation
- Meets core requirements

**Needs Improvement (0-14 points)**:
- Workflow fails to execute or has significant issues
- Poor or missing error handling
- Inadequate documentation
- Does not meet core requirements

---

## Answer Key (For Instructor Use)

### Part A: Multiple Choice Answers
1. B - `.github/workflows/`
2. B - To download the repository code to the runner
3. B - Correct YAML syntax for branches
4. C - It provides consistent, reproducible builds
5. C - Cache based on Playwright version and operating system
6. B - The step runs regardless of previous step outcomes
7. C - Allows other matrix combinations to continue if one fails
8. B - `CI=true`
9. A - Correct exclude syntax under matrix
10. C - 30 days (compliance and historical analysis)
11. C - To distribute tests across multiple runners for faster execution
12. C - Checkout repository code
13. B - Manual workflow execution from GitHub UI
14. C - Multiple reporters: HTML, JSON, and JUnit
15. B - Store them in repository secrets and reference with `${{ secrets.SECRET_NAME }}`

### Part B: Scenario Grading Rubric

Each scenario is worth 6 points:
- **Technical Accuracy** (3 points): Correct understanding of concepts and implementation
- **Completeness** (2 points): Addresses all aspects of the scenario
- **Best Practices** (1 point): Demonstrates professional CI/CD practices

### Part C: Implementation Grading
Detailed rubric provided in evaluation criteria section above.

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [YAML Syntax Reference](https://yaml.org/spec/1.2.2/)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

## Time Management Tips

- **Part A (Multiple Choice)**: 25 minutes (1.5 minutes per question)
- **Part B (Scenarios)**: 40 minutes (8 minutes per scenario)
- **Part C (Implementation)**: 25 minutes
- **Review Time**: 5 minutes

## Assessment Completion

**Name**: ________________________
**Date**: ________________________
**Score**: _______ / 100 points
**Grade**: ________________________

**Instructor Comments**:
_________________________________
_________________________________
_________________________________
_________________________________

Good luck! This assessment validates your readiness to implement professional GitHub Actions workflows for Playwright testing in enterprise environments.