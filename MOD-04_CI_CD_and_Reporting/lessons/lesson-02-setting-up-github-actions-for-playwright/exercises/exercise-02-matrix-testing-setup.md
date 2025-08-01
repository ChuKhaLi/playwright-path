# Exercise 02: Matrix Testing and Advanced Configurations

## Overview

Building on the basic workflow from Exercise 01, you'll now implement matrix testing to run your Playwright tests across multiple browsers, operating systems, and Node.js versions. This exercise simulates real-world enterprise testing requirements where comprehensive browser coverage is essential.

## Learning Objectives

By completing this exercise, you will be able to:
- Configure matrix testing strategies for comprehensive browser coverage
- Implement test sharding for improved performance
- Set up conditional workflows based on different triggers
- Configure environment-specific testing
- Optimize workflow performance with caching strategies
- Handle complex workflow scenarios with multiple job dependencies

## Prerequisites

- Completed Exercise 01 (Basic Workflow Setup)
- Understanding of YAML syntax and GitHub Actions basics
- Playwright project with multiple test files
- Basic knowledge of browser compatibility requirements

## Time Estimate

60-75 minutes

## Exercise Scenario

You're working for an e-commerce company that needs to ensure their web application works flawlessly across all major browsers and operating systems. The application has both desktop and mobile users, and different features need to be tested in different environments. Your task is to create a comprehensive CI/CD pipeline that covers all these requirements efficiently.

## Exercise Steps

### Step 1: Analyze Testing Requirements (10 minutes)

Your company has identified these testing requirements:

**Browser Coverage:**
- Chromium (primary - 70% of users)
- Firefox (secondary - 20% of users)  
- WebKit/Safari (mobile - 10% of users)

**Operating System Coverage:**
- Ubuntu (cost-effective for CI)
- Windows (for IE compatibility testing)
- macOS (for Safari/WebKit testing)

**Node.js Versions:**
- Node 18 (current LTS)
- Node 20 (latest stable)

**Test Categories:**
- Smoke tests (critical functionality, run on all combinations)
- Regression tests (comprehensive, run on main browser combinations)
- Mobile tests (run only on WebKit and Chromium)

### Step 2: Design Matrix Strategy (10 minutes)

1. **Create a strategy document** (`matrix-strategy.md`) that outlines:
   - Which combinations are essential vs. optional
   - How to handle failed combinations
   - Performance considerations (parallel vs. sequential)
   - Cost optimization strategies

2. **Plan your matrix dimensions**:
   ```yaml
   # Example matrix planning
   strategy:
     matrix:
       os: [ubuntu-latest, windows-latest, macos-latest]
       browser: [chromium, firefox, webkit]
       node: [18, 20]
       test-suite: [smoke, regression, mobile]
   ```

### Step 3: Implement Matrix Workflow (25 minutes)

1. **Create a new workflow file** `playwright-matrix.yml`:

2. **Configure the trigger section**:
   - Run full matrix on pushes to main branch
   - Run reduced matrix on pull requests
   - Allow manual dispatch with environment selection
   - Schedule daily regression runs

3. **Implement a pre-flight job** that:
   - Checks if tests should run based on file changes
   - Generates dynamic matrix based on the trigger type
   - Sets up environment-specific configurations

4. **Create the main matrix job**:
   - Configure the strategy with appropriate matrix dimensions
   - Add exclusions for invalid combinations (e.g., WebKit on Windows)
   - Implement job-level timeouts and failure handling

5. **Add matrix-specific steps**:
   - Checkout with appropriate fetch depth
   - Setup Node.js with matrix version
   - Install dependencies with caching
   - Install browser-specific Playwright dependencies
   - Run tests with matrix-appropriate parameters
   - Upload artifacts with matrix-specific naming

### Step 4: Implement Test Sharding (15 minutes)

1. **Add sharding to your matrix**:
   - Extend matrix to include shard numbers (1-4)
   - Configure Playwright to run with `--shard=X/4` parameter
   - Ensure each shard runs appropriate subset of tests

2. **Handle shard-specific configurations**:
   ```yaml
   strategy:
     matrix:
       os: [ubuntu-latest, windows-latest]
       browser: [chromium, firefox, webkit]
       node: [18, 20]
       shard: [1, 2, 3, 4]
       exclude:
         # Add smart exclusions to reduce unnecessary combinations
         - os: windows-latest
           browser: webkit
   ```

3. **Implement artifact naming** that includes shard information:
   ```yaml
   - name: Upload test results
     uses: actions/upload-artifact@v4
     if: always()
     with:
       name: results-${{ matrix.os }}-${{ matrix.browser }}-node${{ matrix.node }}-shard${{ matrix.shard }}
       path: |
         playwright-report/
         test-results/
   ```

### Step 5: Add Report Merging Job (10 minutes)

1. **Create a report merging job** that:
   - Depends on the matrix job completion
   - Downloads all shard artifacts
   - Merges HTML reports from all shards
   - Creates a consolidated report
   - Uploads the merged report with longer retention

2. **Implement error handling** for the merge process:
   ```yaml
   - name: Merge HTML reports
     run: |
       mkdir -p merged-report
       find artifacts -name "*.html" -exec cp {} merged-report/ \; || true
       npx playwright merge-reports --reporter=html artifacts/*/test-results
     continue-on-error: true
   ```

### Step 6: Configure Environment-Specific Testing (10 minutes)

1. **Add environment inputs** to your workflow dispatch:
   ```yaml
   workflow_dispatch:
     inputs:
       environment:
         description: 'Target Environment'
         required: true
         default: 'staging'
         type: choice
         options:
           - staging
           - production
           - development
   ```

2. **Configure environment-specific settings**:
   - Different base URLs for different environments
   - Environment-specific secrets and variables
   - Conditional test execution based on environment

3. **Update your test execution** to use environment variables:
   ```yaml
   - name: Run Playwright tests
     run: npx playwright test --project=${{ matrix.browser }} --shard=${{ matrix.shard }}/4
     env:
       BASE_URL: ${{ 
         github.event.inputs.environment == 'production' && 'https://app.example.com' ||
         github.event.inputs.environment == 'development' && 'http://localhost:3000' ||
         'https://staging.example.com'
       }}
   ```

## Verification Checklist

### Matrix Configuration
- [ ] Matrix includes all required browser/OS combinations
- [ ] Invalid combinations are properly excluded
- [ ] Matrix dimensions are optimized for cost vs. coverage
- [ ] Sharding is implemented correctly (tests distributed evenly)
- [ ] Matrix job names are descriptive and informative

### Performance Optimization
- [ ] Browser caching is implemented per OS/browser combination
- [ ] Dependencies are cached effectively
- [ ] Unnecessary combinations are excluded
- [ ] Jobs run in parallel where possible
- [ ] Reasonable timeouts are set for different matrix combinations

### Environment Handling
- [ ] Environment-specific configurations work correctly
- [ ] Secrets are properly configured for different environments
- [ ] Base URLs change appropriately based on environment
- [ ] Environment-specific test subsets run correctly

### Report Management
- [ ] All matrix combinations upload artifacts successfully
- [ ] Artifact names include matrix parameters for identification
- [ ] Report merging job successfully combines all reports
- [ ] Merged reports are comprehensive and accessible
- [ ] Retention policies are appropriate for different artifact types

### Error Handling and Monitoring
- [ ] Failed matrix combinations don't block other combinations
- [ ] Workflows provide clear feedback on failures
- [ ] Timeouts prevent hanging jobs
- [ ] Critical path failures are properly escalated

## Expected Outcomes

After completing this exercise, you should have:

1. **A comprehensive matrix workflow** that:
   - Tests across multiple browsers, OS, and Node.js versions
   - Uses sharding to improve performance
   - Handles environment-specific testing
   - Provides merged reporting from all matrix combinations

2. **Understanding of**:
   - Matrix testing strategies and optimization
   - Test sharding and parallel execution
   - Artifact management in complex workflows
   - Environment-specific CI/CD configurations

3. **Performance improvements**:
   - Faster overall test execution through parallelization
   - Efficient resource utilization through smart matrix design
   - Optimized caching strategies

## Troubleshooting Common Issues

### Issue 1: Matrix Explosion
**Problem**: Too many matrix combinations causing long execution times and high costs
**Solution**:
```yaml
# Use strategic exclusions
exclude:
  - os: windows-latest
    browser: webkit
  - os: macos-latest
    node: 18
    shard: 4
```

### Issue 2: Sharding Imbalance
**Problem**: Some shards finish much faster than others
**Solution**:
- Analyze test duration patterns
- Consider test-based sharding instead of file-based
- Use Playwright's built-in load balancing

### Issue 3: Report Merging Failures
**Problem**: Merged reports are incomplete or corrupted
**Solution**:
```yaml
- name: Debug artifact structure
  run: |
    find artifacts -type f -name "*.json" | head -20
    ls -la artifacts/
  continue-on-error: true

- name: Merge reports with error handling
  run: |
    npx playwright merge-reports --reporter=html artifacts/*/test-results 2>&1 | tee merge.log || {
      echo "Merge failed, creating fallback report"
      mkdir -p playwright-report
      echo "<h1>Test Results Available in Individual Artifacts</h1>" > playwright-report/index.html
    }
```

### Issue 4: Environment Configuration Conflicts
**Problem**: Tests fail in specific environments due to configuration issues
**Solution**:
- Add environment validation steps
- Use conditional test execution
- Implement environment-specific test data

## Bonus Challenges

### Challenge 1: Smart Matrix Generation
Create a pre-flight job that generates matrix configurations dynamically based on:
- Changed files (only test relevant browsers)
- Time of day (full matrix during off-hours)
- Branch type (reduced matrix for feature branches)

### Challenge 2: Performance Monitoring
Add steps to:
- Measure test execution time per matrix combination
- Track resource usage
- Generate performance reports over time

### Challenge 3: Flaky Test Detection
Implement logic to:
- Retry failed tests automatically
- Track test reliability across matrix combinations
- Generate flaky test reports

### Challenge 4: Cross-Environment Validation
Create workflows that:
- Test the same scenarios across multiple environments
- Compare results between environments
- Alert on environment-specific failures

## Advanced Configuration Example

Here's a template for your advanced matrix workflow:

```yaml
name: Advanced Matrix Testing

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Test Environment'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production, development]
      test_suite:
        description: 'Test Suite'
        required: true
        default: 'full'
        type: choice
        options: [smoke, regression, full, mobile]

jobs:
  generate_matrix:
    name: Generate Test Matrix
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.matrix.outputs.matrix }}
    steps:
      - name: Generate matrix
        id: matrix
        run: |
          # Your matrix generation logic here
          
  test_matrix:
    name: Test (${{ matrix.os }}, ${{ matrix.browser }}, Node ${{ matrix.node }})
    runs-on: ${{ matrix.os }}
    needs: generate_matrix
    strategy:
      fail-fast: false
      matrix: ${{ fromJson(needs.generate_matrix.outputs.matrix) }}
    steps:
      # Your matrix testing steps here
```

## Submission Requirements

1. **Working matrix workflow** that runs successfully
2. **Documentation** explaining your matrix strategy and decisions
3. **Screenshots** of successful matrix execution with multiple combinations
4. **Performance analysis** comparing single vs. matrix execution times
5. **Example merged report** demonstrating successful report aggregation

## Next Steps

After completing this exercise, you'll be ready to:
- Implement advanced workflow optimizations
- Configure custom reporting strategies
- Set up monitoring and alerting for CI/CD pipelines
- Handle complex deployment scenarios with multiple environments

Excellent work on implementing comprehensive matrix testing! This advanced setup forms the backbone of professional-grade CI/CD pipelines used in enterprise environments.