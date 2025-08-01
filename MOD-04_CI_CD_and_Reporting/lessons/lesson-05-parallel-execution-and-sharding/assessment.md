# Lesson 05 Assessment: Parallel Execution and Sharding

## Overview

This comprehensive assessment evaluates your understanding and practical application of parallel execution and sharding strategies in Playwright test automation. The assessment combines theoretical knowledge with hands-on implementation to ensure you can design and implement enterprise-scale parallel testing solutions.

## Assessment Structure

- **Duration:** 90 minutes
- **Format:** Mixed (Multiple Choice, Short Answer, Practical Implementation)
- **Passing Score:** 80%
- **Prerequisites:** Completion of all lesson content and exercises

## Learning Objectives Assessed

By completing this assessment, you will demonstrate your ability to:

- **Configure parallel test execution** with optimal worker settings and resource management
- **Design intelligent sharding strategies** for enterprise-scale test distribution
- **Implement advanced CI/CD workflows** with dynamic shard allocation
- **Optimize performance** through load balancing and resource monitoring
- **Debug parallel test environments** and resolve common issues
- **Apply enterprise-scale solutions** for large test suites

---

## Part A: Theoretical Knowledge (25 points)

### Question 1: Parallel Execution Fundamentals (5 points)

**Multiple Choice:** Which of the following best describes the primary benefit of parallel test execution?

A) Reduces memory usage per test
B) Eliminates the need for test isolation
C) Decreases total execution time by running tests simultaneously
D) Simplifies test debugging and maintenance

**Answer:** C

---

### Question 2: Worker Configuration (5 points)

**Short Answer:** Explain how you would determine the optimal number of workers for a CI environment with 4 CPU cores and 8GB of RAM, considering that each test worker typically uses ~1GB of memory and you want to leave resources for the OS.

**Expected Answer:** 
- Calculate based on memory constraint: 8GB total - 2GB for OS = 6GB available
- Memory-based limit: 6GB ÷ 1GB per worker = 6 workers
- CPU-based limit: 4 cores - 1 for system = 3 workers  
- Choose the more conservative limit: 3 workers
- Consider load balancing and actual test complexity to fine-tune

---

### Question 3: Sharding Strategies (5 points)

**Multiple Choice:** Which sharding strategy would be most appropriate for a test suite with highly variable test execution times and different complexity levels?

A) File-based sharding (equal file distribution)
B) Round-robin test distribution
C) Duration-based sharding with longest-processing-time-first algorithm
D) Random distribution across shards

**Answer:** C

---

### Question 4: Load Balancing (5 points)

**Short Answer:** What is a load balance score and how would you calculate it for a set of shards with the following durations: [180s, 165s, 190s, 175s]?

**Expected Answer:**
- Load balance score measures how evenly work is distributed (0-1, higher is better)
- Calculate average duration: (180+165+190+175)/4 = 177.5s
- Calculate variance: ((180-177.5)² + (165-177.5)² + (190-177.5)² + (175-177.5)²)/4 = 89.375
- Standard deviation: √89.375 ≈ 9.46
- Load balance score: 1 - (9.46/177.5) ≈ 0.947 (excellent balance)

---

### Question 5: Enterprise Considerations (5 points)

**Multiple Choice:** In an enterprise environment with 500+ test files, which approach would provide the best scalability and maintainability?

A) Single monolithic test run with maximum workers
B) Hybrid sharding with complexity-based distribution and intelligent load balancing
C) Manual test file organization into fixed groups
D) Random sharding with equal file counts per shard

**Answer:** B

---

## Part B: Configuration Implementation (35 points)

### Scenario

You are tasked with optimizing a test suite containing:
- 150 test files
- 800 total test cases
- Mix of complexities: 30% low, 50% medium, 20% high
- Estimated total sequential runtime: 45 minutes
- Target: Reduce execution time to under 12 minutes

### Question 6: Playwright Configuration (15 points)

**Practical Implementation:** Write a `playwright.config.ts` file that implements dynamic worker allocation based on system resources and environment. Include comments explaining your decisions.

**Expected Solution:**
```typescript
import { defineConfig, devices } from '@playwright/test';
import { cpus, totalmem, freemem } from 'os';

// Dynamic worker calculation
function calculateOptimalWorkers(): number {
  const cpuCount = cpus().length;
  const totalMemoryGB = totalmem() / (1024 * 1024 * 1024);
  const freeMemoryGB = freemem() / (1024 * 1024 * 1024);
  
  if (process.env.CI) {
    // Conservative for CI environments
    return Math.min(4, Math.max(1, cpuCount - 1));
  } else {
    // More aggressive for local development
    const memoryBasedLimit = Math.floor(freeMemoryGB / 1.5);
    const cpuBasedLimit = Math.max(1, cpuCount - 1);
    return Math.min(memoryBasedLimit, cpuBasedLimit, 8);
  }
}

export default defineConfig({
  testDir: './tests',
  
  // Dynamic worker allocation
  workers: calculateOptimalWorkers(),
  
  // Enable full parallelization
  fullyParallel: true,
  
  // Environment-specific timeouts
  timeout: process.env.CI ? 60000 : 30000,
  expect: { timeout: process.env.CI ? 15000 : 10000 },
  
  // Retry strategy
  retries: process.env.CI ? 2 : 0,
  
  // Performance-optimized reporting
  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  
  use: {
    // Browser optimization for parallel execution
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Resource management
    launchOptions: {
      args: [
        '--memory-pressure-off',
        '--disable-background-timer-throttling',
      ],
    },
    
    // Efficient capture settings
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

**Scoring Criteria:**
- Dynamic worker calculation (4 points)
- Environment-specific configuration (4 points)
- Resource optimization settings (4 points)
- Proper commenting and explanation (3 points)

---

### Question 7: Sharding Strategy Design (20 points)

**Practical Implementation:** Given the scenario above, design a sharding strategy that would achieve the target execution time. Provide:

1. Recommended number of shards with justification
2. Distribution algorithm pseudocode  
3. Expected load balance score

**Expected Solution:**

**1. Shard Count Calculation:**
```
Target execution time: 12 minutes
Sequential runtime: 45 minutes
Required speedup: 45/12 = 3.75x
Accounting for overhead: Need ~4-5 shards minimum
Considering complexity distribution: Recommend 6 shards
```

**2. Distribution Algorithm:**
```pseudocode
ALGORITHM: HybridComplexitySharding
INPUT: testFiles[], targetShards
OUTPUT: shards[]

1. GROUP files by complexity (high, medium, low)
2. INITIALIZE shards[targetShards] with empty arrays
3. 
4. // Distribute high complexity first (one per shard)
5. FOR each highComplexityFile:
6.   shard = findShardWithMinimumDuration(shards)
7.   assignToShard(shard, highComplexityFile)
8.
9. // Sort remaining files by estimated duration (descending)
10. remainingFiles = SORT(mediumFiles + lowFiles, by duration DESC)
11.
12. // Use longest-processing-time-first for balance
13. FOR each file in remainingFiles:
14.   shard = findShardWithMinimumDuration(shards)
15.   assignToShard(shard, file)
16.
17. RETURN shards
```

**3. Expected Load Balance:**
With 6 shards and intelligent distribution:
- Expected shard durations: ~10-12 minutes each
- Estimated load balance score: 0.85-0.92 (good to excellent)

**Scoring Criteria:**
- Correct shard count calculation (5 points)
- Intelligent distribution algorithm (8 points)
- Realistic load balance estimation (4 points)
- Clear justification and reasoning (3 points)

---

## Part C: CI/CD Implementation (25 points)

### Question 8: GitHub Actions Workflow (25 points)

**Practical Implementation:** Create a GitHub Actions workflow that implements the sharding strategy from Question 7. Include job dependencies, artifact management, and failure handling.

**Expected Solution:**
```yaml
name: Advanced Parallel Testing with Sharding

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  analyze-and-shard:
    name: Analyze and Generate Sharding Configuration
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.generate-matrix.outputs.matrix }}
      total-shards: ${{ steps.calculate-shards.outputs.total-shards }}
      
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Calculate optimal shards
        id: calculate-shards
        run: |
          # Dynamic calculation based on test count
          TEST_COUNT=$(find tests -name "*.spec.ts" | wc -l)
          OPTIMAL_SHARDS=$(node -e "console.log(Math.min(6, Math.max(2, Math.ceil($TEST_COUNT / 25))))")
          echo "total-shards=$OPTIMAL_SHARDS" >> $GITHUB_OUTPUT
          
      - name: Generate matrix
        id: generate-matrix
        run: |
          SHARDS=${{ steps.calculate-shards.outputs.total-shards }}
          MATRIX=$(node -e "
            const shards = $SHARDS;
            const matrix = [];
            for (let i = 1; i <= shards; i++) {
              matrix.push({ shard: i, total: shards });
            }
            console.log(JSON.stringify({ include: matrix }));
          ")
          echo "matrix=$MATRIX" >> $GITHUB_OUTPUT

  execute-tests:
    name: 'Execute Shard ${{ matrix.shard }}/${{ matrix.total }}'
    runs-on: ubuntu-latest
    needs: analyze-and-shard
    timeout-minutes: 20
    
    strategy:
      fail-fast: false
      matrix: ${{ fromJSON(needs.analyze-and-shard.outputs.matrix) }}
      
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run shard tests
        run: |
          npx playwright test \
            --shard=${{ matrix.shard }}/${{ matrix.total }} \
            --workers=4 \
            --reporter=json,junit
            
      - name: Upload results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results-shard-${{ matrix.shard }}
          path: test-results/
          
  merge-results:
    name: Merge Test Results
    runs-on: ubuntu-latest
    needs: execute-tests
    if: always()
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: all-results
          pattern: test-results-shard-*
          
      - name: Merge HTML reports
        run: |
          npx playwright merge-reports all-results/test-results-shard-*/ \
            --reporter=html
            
      - name: Upload merged report
        uses: actions/upload-artifact@v4
        with:
          name: merged-test-report
          path: playwright-report/
```

**Scoring Criteria:**
- Dynamic shard calculation (5 points)
- Proper matrix strategy implementation (6 points)
- Artifact management (5 points)
- Job dependencies and workflow structure (5 points)
- Error handling and timeouts (4 points)

---

## Part D: Performance Optimization & Debugging (15 points)

### Question 9: Performance Analysis (8 points)

**Scenario:** After implementing parallel execution, you observe the following shard execution times:
- Shard 1: 15 minutes
- Shard 2: 8 minutes  
- Shard 3: 12 minutes
- Shard 4: 7 minutes

**Questions:**
1. Calculate the load balance score (3 points)
2. Identify the performance bottleneck (3 points)
3. Suggest two optimization strategies (2 points)

**Expected Answers:**
1. **Load Balance Score:**
   - Average: (15+8+12+7)/4 = 10.5 minutes
   - Variance: ((15-10.5)² + (8-10.5)² + (12-10.5)² + (7-10.5)²)/4 = 10.5
   - Standard deviation: √10.5 ≈ 3.24
   - Load balance score: 1 - (3.24/10.5) ≈ 0.69 (needs improvement)

2. **Bottleneck:** Shard 1 is significantly slower (15 min vs 7-12 min average), indicating poor load distribution

3. **Optimization Strategies:**
   - Redistribute high-complexity tests from Shard 1 to faster shards
   - Implement duration-based sharding instead of simple file-count distribution

---

### Question 10: Debugging Parallel Tests (7 points)

**Multiple Choice + Short Answer:** 

**Part A (3 points):** Which of the following is the most common cause of test failures in parallel execution?

A) Insufficient system memory
B) Race conditions and shared state between tests
C) Network latency issues
D) Browser compatibility problems

**Answer:** B

**Part B (4 points):** Describe how you would debug a test that passes when run individually but fails when run in parallel with other tests.

**Expected Answer:**
1. **Isolate the issue:** Run the failing test with different combinations of other tests to identify conflicts
2. **Check for shared state:** Look for global variables, shared files, or database records that tests might be modifying
3. **Examine test data:** Ensure each test uses unique test data (user accounts, file names, etc.)
4. **Review timing dependencies:** Check for hardcoded waits or assumptions about execution order
5. **Use worker-specific data:** Implement worker-scoped fixtures to ensure test isolation

---

## Assessment Scoring

### Scoring Breakdown
- **Part A (Theoretical):** 25 points
- **Part B (Configuration):** 35 points  
- **Part C (CI/CD Implementation):** 25 points
- **Part D (Performance & Debugging):** 15 points
- **Total:** 100 points

### Grade Scale
- **90-100 points:** Excellent (A) - Ready for enterprise implementation
- **80-89 points:** Proficient (B) - Minor gaps to address
- **70-79 points:** Developing (C) - Requires additional study
- **Below 70 points:** Needs Improvement - Retake recommended

### Success Criteria

To pass this assessment, you must demonstrate:

✅ **Technical Proficiency:**
- Configure parallel execution with appropriate worker settings
- Design effective sharding strategies for different scenarios
- Implement CI/CD workflows with proper artifact management

✅ **Performance Optimization:**
- Calculate and interpret load balance scores
- Identify performance bottlenecks and optimization opportunities
- Apply resource management techniques

✅ **Problem-Solving:**
- Debug parallel test execution issues
- Implement enterprise-scale solutions
- Handle edge cases and failure scenarios

✅ **Best Practices:**
- Apply security and isolation principles
- Document configuration decisions
- Consider maintainability and scalability

---

## Practical Lab Component (Optional Bonus: +10 points)

### Hands-On Implementation Challenge

**Scenario:** You have 30 minutes to implement a working parallel execution setup for a sample test suite.

**Requirements:**
1. Configure Playwright for optimal parallel execution
2. Create 3 sample test files with different complexity levels
3. Implement a simple sharding script
4. Run tests and measure performance improvement
5. Document your results

**Deliverables:**
- Working `playwright.config.ts`
- Sample test files
- Performance comparison (before/after parallel execution) 
- Brief optimization recommendations

**Bonus Scoring:**
- Working implementation (5 points)
- Performance measurement and analysis (3 points)
- Quality of recommendations (2 points)

---

## Next Steps

Upon successful completion of this assessment:

1. **Review Results:** Analyze your performance in each section
2. **Address Gaps:** Focus additional study on areas scoring below 80%
3. **Apply Knowledge:** Implement parallel execution in your own projects
4. **Advanced Topics:** Proceed to Lesson 06 - Integrating Playwright with CI/CD Pipelines

## Resources for Further Study

- [Playwright Parallel Execution Documentation](https://playwright.dev/docs/test-parallel)
- [GitHub Actions Matrix Strategies](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
- [Performance Testing Best Practices](https://playwright.dev/docs/test-performance)

**Assessment Version:** 1.0
**Last Updated:** January 2025
**Estimated Completion Time:** 90 minutes