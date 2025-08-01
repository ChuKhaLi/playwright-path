# Exercise 02: Advanced Sharding Implementation

## Overview

This advanced exercise focuses on implementing sophisticated sharding strategies for enterprise-scale test automation. You'll build intelligent load balancing algorithms, create dynamic shard allocation systems, and implement comprehensive monitoring for parallel test execution.

## Learning Objectives

By completing this exercise, you will:

- **Design intelligent sharding algorithms** with complexity-based distribution
- **Implement dynamic load balancing** using longest-processing-time-first strategies
- **Create enterprise-scale GitHub Actions workflows** with adaptive shard allocation
- **Build comprehensive monitoring systems** for parallel execution metrics
- **Optimize resource utilization** across multiple CI/CD runners
- **Validate sharding effectiveness** through performance analysis

---

## Prerequisites

- Completion of Exercise 01: Basic Parallel Setup
- Understanding of GitHub Actions matrix strategies
- Familiarity with TypeScript and Node.js scripting
- Basic knowledge of load balancing algorithms

---

## Part A: Intelligent Sharding Algorithm Implementation

### Task 1: Complexity-Based Test Classification

Create a system that automatically classifies tests by complexity and execution time.

#### Step 1: Create Test Complexity Analyzer

Create a new file: `scripts/test-complexity-analyzer.ts`

```typescript
import * as fs from 'fs';
import * as path from 'path';

interface TestMetrics {
  filePath: string;
  estimatedDuration: number;
  complexityScore: number;
  dependencies: string[];
  resourceUsage: 'low' | 'medium' | 'high';
}

interface ComplexityRules {
  patterns: {
    highComplexity: RegExp[];
    mediumComplexity: RegExp[];
    lowComplexity: RegExp[];
  };
  weights: {
    fileSize: number;
    testCount: number;
    asyncOperations: number;
    networkCalls: number;
    domInteractions: number;
  };
}

class TestComplexityAnalyzer {
  private complexityRules: ComplexityRules = {
    patterns: {
      highComplexity: [
        /\.fill\(/g,
        /\.upload\(/g,
        /\.download\(/g,
        /page\.goto.*timeout.*\d{4,}/g,
        /page\.waitForTimeout\(\d{4,}\)/g,
        /expect.*toHaveScreenshot/g,
      ],
      mediumComplexity: [
        /\.click\(/g,
        /\.type\(/g,
        /page\.goto/g,
        /expect.*toBeVisible/g,
        /page\.locator/g,
      ],
      lowComplexity: [
        /expect.*toBe\(/g,
        /expect.*toEqual/g,
        /expect.*toContain/g,
      ],
    },
    weights: {
      fileSize: 0.1,
      testCount: 15,
      asyncOperations: 8,
      networkCalls: 12,
      domInteractions: 5,
    },
  };

  async analyzeTestFile(filePath: string): Promise<TestMetrics> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const fileSize = content.length;
    
    // Count different complexity indicators
    const metrics = {
      testCount: this.countTests(content),
      asyncOperations: this.countAsyncOperations(content),
      networkCalls: this.countNetworkCalls(content),
      domInteractions: this.countDomInteractions(content),
      highComplexityOps: this.countPatterns(content, this.complexityRules.patterns.highComplexity),
      mediumComplexityOps: this.countPatterns(content, this.complexityRules.patterns.mediumComplexity),
      lowComplexityOps: this.countPatterns(content, this.complexityRules.patterns.lowComplexity),
    };

    // Calculate complexity score
    const complexityScore = this.calculateComplexityScore(metrics, fileSize);
    
    // Estimate duration based on complexity
    const estimatedDuration = this.estimateDuration(complexityScore, metrics.testCount);
    
    // Determine resource usage
    const resourceUsage = this.determineResourceUsage(complexityScore);

    return {
      filePath,
      estimatedDuration,
      complexityScore,
      dependencies: this.extractDependencies(content),
      resourceUsage,
    };
  }

  private countTests(content: string): number {
    const testMatches = content.match(/test\(|test\.describe\(|test\.step\(/g);
    return testMatches ? testMatches.length : 0;
  }

  private countAsyncOperations(content: string): number {
    const asyncMatches = content.match(/await\s+/g);
    return asyncMatches ? asyncMatches.length : 0;
  }

  private countNetworkCalls(content: string): number {
    const networkMatches = content.match(/page\.goto|request\.|fetch\(|axios\./g);
    return networkMatches ? networkMatches.length : 0;
  }

  private countDomInteractions(content: string): number {
    const domMatches = content.match(/\.click\(|\.fill\(|\.type\(|\.hover\(|\.select\(/g);
    return domMatches ? domMatches.length : 0;
  }

  private countPatterns(content: string, patterns: RegExp[]): number {
    return patterns.reduce((count, pattern) => {
      const matches = content.match(pattern);
      return count + (matches ? matches.length : 0);
    }, 0);
  }

  private calculateComplexityScore(metrics: any, fileSize: number): number {
    const { weights } = this.complexityRules;
    
    return (
      (fileSize / 1000) * weights.fileSize +
      metrics.testCount * weights.testCount +
      metrics.asyncOperations * weights.asyncOperations +
      metrics.networkCalls * weights.networkCalls +
      metrics.domInteractions * weights.domInteractions +
      metrics.highComplexityOps * 20 +
      metrics.mediumComplexityOps * 10 +
      metrics.lowComplexityOps * 3
    );
  }

  private estimateDuration(complexityScore: number, testCount: number): number {
    // Base duration per test (seconds)
    const baseDurationPerTest = 5;
    
    // Complexity multiplier (1.0 to 5.0)
    const complexityMultiplier = Math.min(5.0, 1 + (complexityScore / 100));
    
    return Math.ceil(testCount * baseDurationPerTest * complexityMultiplier);
  }

  private determineResourceUsage(complexityScore: number): 'low' | 'medium' | 'high' {
    if (complexityScore > 200) return 'high';
    if (complexityScore > 100) return 'medium';
    return 'low';
  }

  private extractDependencies(content: string): string[] {
    const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g);
    if (!importMatches) return [];
    
    return importMatches
      .map(match => {
        const pathMatch = match.match(/from\s+['"]([^'"]+)['"]/);
        return pathMatch ? pathMatch[1] : null;
      })
      .filter(Boolean) as string[];
  }

  async analyzeTestSuite(testDir: string): Promise<TestMetrics[]> {
    const testFiles = await this.findTestFiles(testDir);
    const analyses = await Promise.all(
      testFiles.map(file => this.analyzeTestFile(file))
    );
    
    return analyses.sort((a, b) => b.complexityScore - a.complexityScore);
  }

  private async findTestFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    const scan = async (currentDir: string) => {
      const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (entry.name.endsWith('.spec.ts') || entry.name.endsWith('.test.ts')) {
          files.push(fullPath);
        }
      }
    };
    
    await scan(dir);
    return files;
  }
}

export { TestComplexityAnalyzer, TestMetrics };
```

#### Step 2: Create Intelligent Sharding Algorithm

Create: `scripts/intelligent-sharding.ts`

```typescript
import { TestComplexityAnalyzer, TestMetrics } from './test-complexity-analyzer';

interface ShardConfiguration {
  shardId: number;
  totalShards: number;
  tests: TestMetrics[];
  estimatedDuration: number;
  resourceRequirement: 'low' | 'medium' | 'high';
}

interface LoadBalanceReport {
  shards: ShardConfiguration[];
  totalEstimatedTime: number;
  maxShardDuration: number;
  minShardDuration: number;
  loadBalanceScore: number;
  efficiency: number;
}

class IntelligentShardingStrategy {
  private analyzer = new TestComplexityAnalyzer();

  async generateOptimalSharding(
    testDir: string,
    targetExecutionTime: number = 600 // 10 minutes default
  ): Promise<LoadBalanceReport> {
    console.log('🔍 Analyzing test suite complexity...');
    const testMetrics = await this.analyzer.analyzeTestSuite(testDir);
    
    console.log(`📊 Found ${testMetrics.length} test files`);
    console.log(`⏱️  Total sequential time: ${this.getTotalDuration(testMetrics)}s`);
    
    // Calculate optimal shard count
    const totalDuration = this.getTotalDuration(testMetrics);
    const minShards = Math.ceil(totalDuration / targetExecutionTime);
    const optimalShards = Math.max(minShards, 2);
    
    console.log(`🎯 Target execution time: ${targetExecutionTime}s`);
    console.log(`📈 Calculated optimal shards: ${optimalShards}`);
    
    // Try different shard counts to find best balance
    const candidates = [];
    for (let shardCount = Math.max(2, optimalShards - 1); shardCount <= optimalShards + 2; shardCount++) {
      const sharding = await this.createSharding(testMetrics, shardCount);
      candidates.push(sharding);
    }
    
    // Select best candidate based on load balance score
    const bestSharding = candidates.reduce((best, current) => 
      current.loadBalanceScore > best.loadBalanceScore ? current : best
    );
    
    console.log(`✅ Selected ${bestSharding.shards.length} shards with load balance score: ${bestSharding.loadBalanceScore.toFixed(3)}`);
    
    return bestSharding;
  }

  private async createSharding(testMetrics: TestMetrics[], shardCount: number): Promise<LoadBalanceReport> {
    // Initialize empty shards
    const shards: ShardConfiguration[] = Array.from({ length: shardCount }, (_, i) => ({
      shardId: i + 1,
      totalShards: shardCount,
      tests: [],
      estimatedDuration: 0,
      resourceRequirement: 'low',
    }));

    // Separate tests by complexity
    const highComplexity = testMetrics.filter(t => t.complexityScore > 200);
    const mediumComplexity = testMetrics.filter(t => t.complexityScore > 100 && t.complexityScore <= 200);
    const lowComplexity = testMetrics.filter(t => t.complexityScore <= 100);

    console.log(`📊 Complexity distribution: High(${highComplexity.length}), Medium(${mediumComplexity.length}), Low(${lowComplexity.length})`);

    // Phase 1: Distribute high complexity tests (one per shard)
    this.distributeHighComplexityTests(shards, highComplexity);

    // Phase 2: Use Longest Processing Time First for remaining tests
    const remainingTests = [...mediumComplexity, ...lowComplexity]
      .sort((a, b) => b.estimatedDuration - a.estimatedDuration);

    this.distributeLPTF(shards, remainingTests);

    // Calculate resource requirements for each shard
    this.calculateShardResourceRequirements(shards);

    // Generate load balance report
    return this.generateLoadBalanceReport(shards);
  }

  private distributeHighComplexityTests(shards: ShardConfiguration[], highComplexityTests: TestMetrics[]) {
    let shardIndex = 0;
    
    for (const test of highComplexityTests) {
      const shard = shards[shardIndex % shards.length];
      shard.tests.push(test);
      shard.estimatedDuration += test.estimatedDuration;
      shardIndex++;
    }
  }

  private distributeLPTF(shards: ShardConfiguration[], tests: TestMetrics[]) {
    for (const test of tests) {
      // Find shard with minimum current duration
      const targetShard = shards.reduce((min, current) => 
        current.estimatedDuration < min.estimatedDuration ? current : min
      );
      
      targetShard.tests.push(test);
      targetShard.estimatedDuration += test.estimatedDuration;
    }
  }

  private calculateShardResourceRequirements(shards: ShardConfiguration[]) {
    for (const shard of shards) {
      const highResourceTests = shard.tests.filter(t => t.resourceUsage === 'high').length;
      const mediumResourceTests = shard.tests.filter(t => t.resourceUsage === 'medium').length;
      
      if (highResourceTests > 2 || shard.estimatedDuration > 900) {
        shard.resourceRequirement = 'high';
      } else if (highResourceTests > 0 || mediumResourceTests > 3 || shard.estimatedDuration > 450) {
        shard.resourceRequirement = 'medium';
      } else {
        shard.resourceRequirement = 'low';
      }
    }
  }

  private generateLoadBalanceReport(shards: ShardConfiguration[]): LoadBalanceReport {
    const durations = shards.map(s => s.estimatedDuration);
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    // Calculate standard deviation
    const variance = durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Load balance score (0-1, higher is better)
    const loadBalanceScore = avgDuration > 0 ? 1 - (standardDeviation / avgDuration) : 0;
    
    // Efficiency (how much faster than sequential execution)
    const totalSequentialTime = this.getTotalDuration(shards.flatMap(s => s.tests));
    const efficiency = totalSequentialTime / maxDuration;

    return {
      shards,
      totalEstimatedTime: totalSequentialTime,
      maxShardDuration: maxDuration,
      minShardDuration: minDuration,
      loadBalanceScore: Math.max(0, loadBalanceScore),
      efficiency,
    };
  }

  private getTotalDuration(tests: TestMetrics[]): number {
    return tests.reduce((total, test) => total + test.estimatedDuration, 0);
  }

  async generateShardingReport(testDir: string, outputPath: string): Promise<void> {
    const sharding = await this.generateOptimalSharding(testDir);
    
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalTests: sharding.shards.reduce((sum, s) => sum + s.tests.length, 0),
        totalShards: sharding.shards.length,
        estimatedSpeedup: `${sharding.efficiency.toFixed(1)}x`,
        loadBalanceScore: sharding.loadBalanceScore.toFixed(3),
        maxExecutionTime: `${Math.ceil(sharding.maxShardDuration / 60)} minutes`,
      },
      shards: sharding.shards.map((shard, index) => ({
        shardId: shard.shardId,
        testCount: shard.tests.length,
        estimatedDuration: `${Math.ceil(shard.estimatedDuration / 60)} minutes`,
        resourceRequirement: shard.resourceRequirement,
        tests: shard.tests.map(t => ({
          file: t.filePath.replace(process.cwd(), '.'),
          duration: `${t.estimatedDuration}s`,
          complexity: t.complexityScore.toFixed(1),
          resourceUsage: t.resourceUsage,
        })),
      })),
      recommendations: this.generateRecommendations(sharding),
    };

    await require('fs').promises.writeFile(
      outputPath,
      JSON.stringify(report, null, 2),
      'utf-8'
    );

    console.log(`📋 Sharding report generated: ${outputPath}`);
  }

  private generateRecommendations(sharding: LoadBalanceReport): string[] {
    const recommendations = [];
    
    if (sharding.loadBalanceScore < 0.8) {
      recommendations.push('Consider redistributing high-complexity tests for better load balance');
    }
    
    if (sharding.efficiency < 3) {
      recommendations.push('Consider increasing the number of shards to improve parallelization efficiency');
    }
    
    const highResourceShards = sharding.shards.filter(s => s.resourceRequirement === 'high').length;
    if (highResourceShards > sharding.shards.length * 0.5) {
      recommendations.push('Consider using larger CI runners due to high resource requirements');
    }
    
    if (sharding.maxShardDuration > 1200) {
      recommendations.push('Maximum shard duration exceeds 20 minutes - consider more aggressive sharding');
    }

    return recommendations;
  }
}

export { IntelligentShardingStrategy, ShardConfiguration, LoadBalanceReport };
```

### Task 2: Dynamic GitHub Actions Integration

Create: `scripts/generate-dynamic-workflow.ts`

```typescript
import { IntelligentShardingStrategy } from './intelligent-sharding';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

interface WorkflowConfiguration {
  name: string;
  testDirectory: string;
  nodeVersion: string;
  browsers: string[];
  environmentSecrets: string[];
}

class DynamicWorkflowGenerator {
  private shardingStrategy = new IntelligentShardingStrategy();

  async generateWorkflow(config: WorkflowConfiguration): Promise<string> {
    const sharding = await this.shardingStrategy.generateOptimalSharding(config.testDirectory);
    
    const workflow = {
      name: config.name,
      on: {
        push: {
          branches: ['main', 'develop', 'feature/*'],
        },
        pull_request: {
          branches: ['main', 'develop'],
        },
        workflow_dispatch: {
          inputs: {
            'shard-count': {
              description: 'Number of shards (0 for auto)',
              required: false,
              default: '0',
              type: 'number',
            },
            'target-duration': {
              description: 'Target execution time in minutes',
              required: false,
              default: '10',
              type: 'number',
            },
          },
        },
      },
      
      env: {
        NODE_VERSION: config.nodeVersion,
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1',
      },

      jobs: {
        'analyze-and-prepare': {
          name: 'Analyze Test Suite and Prepare Sharding',
          'runs-on': 'ubuntu-latest',
          outputs: {
            'shard-matrix': '${{ steps.generate-matrix.outputs.matrix }}',
            'total-shards': '${{ steps.calculate-shards.outputs.total-shards }}',
            'estimated-duration': '${{ steps.calculate-shards.outputs.estimated-duration }}',
            'load-balance-score': '${{ steps.calculate-shards.outputs.load-balance-score }}',
          },
          
          steps: [
            {
              name: 'Checkout code',
              uses: 'actions/checkout@v4',
            },
            {
              name: 'Setup Node.js',
              uses: 'actions/setup-node@v4',
              with: {
                'node-version': '${{ env.NODE_VERSION }}',
                cache: 'npm',
              },
            },
            {
              name: 'Install dependencies',
              run: 'npm ci',
            },
            {
              name: 'Build sharding tools',
              run: 'npx tsc scripts/*.ts --outDir scripts/dist --target es2020 --module commonjs --esModuleInterop',
            },
            {
              name: 'Analyze test suite and calculate optimal sharding',
              id: 'calculate-shards',
              run: `
                # Use manual input or auto-calculate
                MANUAL_SHARDS=\${{ github.event.inputs.shard-count || '0' }}
                TARGET_DURATION=\${{ github.event.inputs.target-duration || '10' }}
                TARGET_SECONDS=$((TARGET_DURATION * 60))
                
                if [[ "$MANUAL_SHARDS" -gt 0 ]]; then
                  echo "Using manual shard count: $MANUAL_SHARDS"
                  OPTIMAL_SHARDS=$MANUAL_SHARDS
                else
                  echo "Auto-calculating optimal shard count..."
                  node -e "
                    const { IntelligentShardingStrategy } = require('./scripts/dist/intelligent-sharding.js');
                    const strategy = new IntelligentShardingStrategy();
                    strategy.generateOptimalSharding('${config.testDirectory}', $TARGET_SECONDS)
                      .then(result => {
                        console.log('OPTIMAL_SHARDS=' + result.shards.length);
                        console.log('ESTIMATED_DURATION=' + Math.ceil(result.maxShardDuration));
                        console.log('LOAD_BALANCE_SCORE=' + result.loadBalanceScore.toFixed(3));
                        
                        process.env.GITHUB_OUTPUT && require('fs').appendFileSync(process.env.GITHUB_OUTPUT, 
                          \`total-shards=\${result.shards.length}\\n\` +
                          \`estimated-duration=\${Math.ceil(result.maxShardDuration)}\\n\` +
                          \`load-balance-score=\${result.loadBalanceScore.toFixed(3)}\\n\`
                        );
                      })
                      .catch(console.error);
                  "
                fi
              `,
            },
            {
              name: 'Generate shard matrix',
              id: 'generate-matrix',
              run: `
                TOTAL_SHARDS=\${{ steps.calculate-shards.outputs.total-shards }}
                
                # Generate matrix for GitHub Actions
                MATRIX=$(node -e "
                  const shardCount = parseInt('$TOTAL_SHARDS');
                  const matrix = { include: [] };
                  
                  const resourceLevels = ['standard', 'standard', 'large']; // Rotate resource levels
                  
                  for (let i = 1; i <= shardCount; i++) {
                    const resourceIndex = (i - 1) % resourceLevels.length;
                    matrix.include.push({
                      shard: i,
                      total: shardCount,
                      'runner-size': resourceLevels[resourceIndex],
                      'timeout-minutes': i <= 2 ? 25 : 20, // Give first shards more time
                    });
                  }
                  
                  console.log(JSON.stringify(matrix));
                ")
                
                echo "matrix=$MATRIX" >> $GITHUB_OUTPUT
              `,
            },
            {
              name: 'Generate sharding report',
              run: `
                node -e "
                  const { IntelligentShardingStrategy } = require('./scripts/dist/intelligent-sharding.js');
                  const strategy = new IntelligentShardingStrategy();
                  strategy.generateShardingReport('${config.testDirectory}', 'sharding-report.json')
                    .catch(console.error);
                "
              `,
            },
            {
              name: 'Upload sharding report',
              uses: 'actions/upload-artifact@v4',
              with: {
                name: 'sharding-analysis',
                path: 'sharding-report.json',
                'retention-days': 7,
              },
            },
          ],
        },

        'execute-shard-tests': {
          name: 'Shard ${{ matrix.shard }}/${{ matrix.total }} (${{ matrix.runner-size }})',
          'runs-on': '${{ matrix.runner-size == "large" && "ubuntu-latest-4-cores" || "ubuntu-latest" }}',
          needs: 'analyze-and-prepare',
          'timeout-minutes': '${{ matrix.timeout-minutes }}',
          
          strategy: {
            'fail-fast': false,
            matrix: '${{ fromJSON(needs.analyze-and-prepare.outputs.shard-matrix) }}',
          },
          
          steps: [
            {
              name: 'Checkout code',
              uses: 'actions/checkout@v4',
            },
            {
              name: 'Setup Node.js',
              uses: 'actions/setup-node@v4',
              with: {
                'node-version': '${{ env.NODE_VERSION }}',
                cache: 'npm',
              },
            },
            {
              name: 'Install dependencies',
              run: 'npm ci',
            },
            {
              name: `Install Playwright browsers`,
              run: `npx playwright install --with-deps ${config.browsers.join(' ')}`,
            },
            {
              name: 'Run shard tests with performance monitoring',
              env: config.environmentSecrets.reduce((acc, secret) => {
                acc[secret] = `\${{ secrets.${secret} }}`;
                return acc;
              }, {} as Record<string, string>),
              run: `
                # Performance monitoring setup
                START_TIME=$(date +%s)
                MEMORY_BEFORE=$(free -m | awk 'NR==2{printf "%s", $3}')
                
                echo "🚀 Starting Shard ${{ matrix.shard }}/${{ matrix.total }}"
                echo "💾 Memory usage before: \${MEMORY_BEFORE}MB"
                echo "🕐 Start time: $(date)"
                
                # Run tests with optimized settings
                npx playwright test \\
                  --shard=${{ matrix.shard }}/${{ matrix.total }} \\
                  --workers=\${{ matrix.runner-size == "large" && "6" || "4" }} \\
                  --reporter=json,junit,html \\
                  --output-dir=test-results-shard-${{ matrix.shard }}
                
                # Performance monitoring cleanup
                END_TIME=$(date +%s)
                MEMORY_AFTER=$(free -m | awk 'NR==2{printf "%s", $3}')
                DURATION=$((END_TIME - START_TIME))
                MEMORY_DIFF=$((MEMORY_AFTER - MEMORY_BEFORE))
                
                echo "✅ Shard completed in \${DURATION}s"
                echo "💾 Memory delta: \${MEMORY_DIFF}MB"
                echo "🕐 End time: $(date)"
                
                # Store performance metrics
                echo "{\\"shard\\": ${{ matrix.shard }}, \\"duration\\": $DURATION, \\"memoryDelta\\": $MEMORY_DIFF}" > performance-metrics.json
              `,
            },
            {
              name: 'Upload test results',
              uses: 'actions/upload-artifact@v4',
              if: 'always()',
              with: {
                name: 'test-results-shard-${{ matrix.shard }}',
                path: 'test-results-shard-${{ matrix.shard }}/',
                'retention-days': 5,
              },
            },
            {
              name: 'Upload performance metrics',
              uses: 'actions/upload-artifact@v4',
              if: 'always()',
              with: {
                name: 'performance-metrics-shard-${{ matrix.shard }}',
                path: 'performance-metrics.json',
                'retention-days': 5,
              },
            },
          ],
        },

        'consolidate-results': {
          name: 'Consolidate Test Results and Generate Report',
          'runs-on': 'ubuntu-latest',
          needs: ['analyze-and-prepare', 'execute-shard-tests'],
          if: 'always()',
          
          steps: [
            {
              name: 'Checkout code',
              uses: 'actions/checkout@v4',
            },
            {
              name: 'Setup Node.js',
              uses: 'actions/setup-node@v4',
              with: {
                'node-version': '${{ env.NODE_VERSION }}',
                cache: 'npm',
              },
            },
            {
              name: 'Install dependencies',
              run: 'npm ci',
            },
            {
              name: 'Download all test results',
              uses: 'actions/download-artifact@v4',
              with: {
                path: 'all-results',
                pattern: 'test-results-shard-*',
              },
            },
            {
              name: 'Download performance metrics',
              uses: 'actions/download-artifact@v4',
              with: {
                path: 'performance-data',
                pattern: 'performance-metrics-shard-*',
              },
            },
            {
              name: 'Merge HTML reports',
              run: `
                # Merge all HTML reports
                npx playwright merge-reports all-results/test-results-shard-*/ \\
                  --reporter=html \\
                  --config=playwright.config.ts
                
                # Generate consolidated JSON report
                npx playwright merge-reports all-results/test-results-shard-*/ \\
                  --reporter=json \\
                  --config=playwright.config.ts > consolidated-results.json
              `,
            },
            {
              name: 'Generate performance analysis',
              run: `
                # Analyze performance across shards
                node -e "
                  const fs = require('fs');
                  const path = require('path');
                  
                  const performanceFiles = fs.readdirSync('performance-data')
                    .filter(dir => dir.startsWith('performance-metrics-shard-'))
                    .map(dir => path.join('performance-data', dir, 'performance-metrics.json'))
                    .filter(file => fs.existsSync(file));
                  
                  const metrics = performanceFiles.map(file => 
                    JSON.parse(fs.readFileSync(file, 'utf-8'))
                  );
                  
                  const totalDuration = Math.max(...metrics.map(m => m.duration));
                  const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
                  const totalMemory = metrics.reduce((sum, m) => sum + Math.abs(m.memoryDelta), 0);
                  
                  const loadBalanceScore = '${{ needs.analyze-and-prepare.outputs.load-balance-score }}';
                  const estimatedDuration = '${{ needs.analyze-and-prepare.outputs.estimated-duration }}';
                  
                  const analysis = {
                    summary: {
                      totalShards: metrics.length,
                      actualMaxDuration: totalDuration,
                      estimatedMaxDuration: parseInt(estimatedDuration),
                      estimationAccuracy: Math.abs(totalDuration - parseInt(estimatedDuration)) / parseInt(estimatedDuration),
                      loadBalanceScore: parseFloat(loadBalanceScore),
                      averageShardDuration: Math.round(avgDuration),
                      totalMemoryUsage: totalMemory
                    },
                    shardPerformance: metrics.sort((a, b) => a.shard - b.shard),
                    recommendations: []
                  };
                  
                  // Add performance recommendations
                  if (analysis.summary.estimationAccuracy > 0.2) {
                    analysis.recommendations.push('Test duration estimation needs improvement');
                  }
                  
                  if (analysis.summary.loadBalanceScore < 0.8) {
                    analysis.recommendations.push('Consider rebalancing shard distribution');
                  }
                  
                  if (totalMemory > 2000) {
                    analysis.recommendations.push('High memory usage detected - consider optimizing tests');
                  }
                  
                  fs.writeFileSync('performance-analysis.json', JSON.stringify(analysis, null, 2));
                  
                  console.log('📊 Performance Analysis Summary:');
                  console.log(\`   Total Execution Time: \${totalDuration}s\`);
                  console.log(\`   Load Balance Score: \${loadBalanceScore}\`);
                  console.log(\`   Estimation Accuracy: \${(100 - analysis.summary.estimationAccuracy * 100).toFixed(1)}%\`);
                "
              `,
            },
            {
              name: 'Upload consolidated report',
              uses: 'actions/upload-artifact@v4',
              with: {
                name: 'consolidated-test-report',
                path: |
                  playwright-report/
                  consolidated-results.json
                  performance-analysis.json
                'retention-days': 14,
              },
            },
            {
              name: 'Comment PR with results',
              if: 'github.event_name == "pull_request"',
              uses: 'actions/github-script@v7',
              with: {
                script: `
                  const fs = require('fs');
                  
                  try {
                    const performance = JSON.parse(fs.readFileSync('performance-analysis.json', 'utf-8'));
                    const loadBalance = parseFloat('${{ needs.analyze-and-prepare.outputs.load-balance-score }}');
                    
                    const body = \`## 🧪 Parallel Test Execution Results
                    
                    ### 📊 Performance Summary
                    - **Total Shards:** \${performance.summary.totalShards}
                    - **Execution Time:** \${performance.summary.actualMaxDuration}s
                    - **Load Balance Score:** \${loadBalance.toFixed(3)} (0-1, higher is better)
                    - **Estimation Accuracy:** \${(100 - performance.summary.estimationAccuracy * 100).toFixed(1)}%
                    
                    ### 🎯 Shard Distribution
                    \${performance.shardPerformance.map(shard => 
                      \`- Shard \${shard.shard}: \${shard.duration}s (Memory: \${shard.memoryDelta}MB)\`
                    ).join('\\n')}
                    
                    \${performance.recommendations.length > 0 ? 
                      \`### 💡 Recommendations\\n\${performance.recommendations.map(r => \`- \${r}\`).join('\\n')}\` : 
                      '### ✅ Excellent performance - no recommendations'
                    }
                    
                    [View detailed test report](https://github.com/\${context.repo.owner}/\${context.repo.repo}/actions/runs/\${context.runId})
                    \`;
                    
                    github.rest.issues.createComment({
                      issue_number: context.issue.number,
                      owner: context.repo.owner,
                      repo: context.repo.repo,
                      body: body
                    });
                  } catch (error) {
                    console.error('Failed to post comment:', error);
                  }
                `,
              },
            },
          ],
        },
      },
    };

    return yaml.dump(workflow, { 
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });
  }

  async generateWorkflowFile(
    config: WorkflowConfiguration,
    outputPath: string
  ): Promise<void> {
    const workflowContent = await this.generateWorkflow(config);
    await fs.promises.writeFile(outputPath, workflowContent, 'utf-8');
    console.log(`✅ Generated GitHub Actions workflow: ${outputPath}`);
  }
}

export { DynamicWorkflowGenerator, WorkflowConfiguration };
```

---

## Part B: Implementation and Testing

### Task 3: Create Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "sharding:analyze": "npx tsc scripts/*.ts --outDir scripts/dist --target es2020 --module commonjs --esModuleInterop && node scripts/dist/analyze-sharding.js",
    "sharding:generate-workflow": "npx tsc scripts/*.ts --outDir scripts/dist --target es2020 --module commonjs --esModuleInterop && node scripts/dist/generate-workflow.js",
    "test:parallel:local": "playwright test --workers=4",
    "test:shard": "playwright test --shard=1/4",
    "performance:measure": "node scripts/dist/measure-performance.js"
  }
}
```

### Task 4: Create CLI Scripts

Create: `scripts/analyze-sharding.js`

```javascript
const { IntelligentShardingStrategy } = require('./dist/intelligent-sharding.js');

async function main() {
  const testDir = process.argv[2] || 'tests';
  const targetDuration = parseInt(process.argv[3]) || 600; // 10 minutes
  
  console.log('🔍 Advanced Sharding Analysis');
  console.log('==============================');
  
  const strategy = new IntelligentShardingStrategy();
  
  try {
    await strategy.generateShardingReport(testDir, 'sharding-analysis.json');
    
    console.log('\n✅ Analysis complete!');
    console.log('📋 Report saved to: sharding-analysis.json');
    console.log('\n🚀 Next steps:');
    console.log('1. Review the generated sharding strategy');
    console.log('2. Run: npm run sharding:generate-workflow');
    console.log('3. Commit the generated workflow to .github/workflows/');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

main();
```

Create: `scripts/generate-workflow.js`

```javascript
const { DynamicWorkflowGenerator } = require('./dist/generate-dynamic-workflow.js');

async function main() {
  const config = {
    name: 'Advanced Playwright Testing with Intelligent Sharding',
    testDirectory: 'tests',
    nodeVersion: '18',
    browsers: ['chromium', 'firefox', 'webkit'],
    environmentSecrets: ['API_KEY', 'TEST_USER_PASSWORD'],
  };
  
  console.log('🏗️  Generating Advanced GitHub Actions Workflow');  
  console.log('===============================================');
  
  const generator = new DynamicWorkflowGenerator();
  
  try {
    await generator.generateWorkflowFile(
      config,
      '.github/workflows/intelligent-parallel-testing.yml'
    );
    
    console.log('\n✅ Workflow generated successfully!');
    console.log('📁 Location: .github/workflows/intelligent-parallel-testing.yml');
    console.log('\n🚀 Features included:');
    console.log('• Dynamic shard calculation based on test complexity');
    console.log('• Intelligent load balancing with LPTF algorithm');
    console.log('• Performance monitoring and analysis');
    console.log('• Adaptive resource allocation');
    console.log('• Comprehensive reporting with PR comments');
    console.log('\n📋 Next steps:');
    console.log('1. Review and customize the generated workflow');
    console.log('2. Commit to your repository');
    console.log('3. Push to trigger the advanced parallel testing');
    
  } catch (error) {
    console.error('❌ Workflow generation failed:', error.message);
    process.exit(1);
  }
}

main();
```

---

## Part C: Validation and Performance Testing

### Task 5: Implementation Validation

#### Step 1: Run Local Analysis

```powershell
# Build and analyze your test suite
npm run sharding:analyze tests

# Review the generated report
Get-Content sharding-analysis.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

#### Step 2: Generate Workflow

```powershell
# Generate the advanced workflow
npm run sharding:generate-workflow

# Review the generated workflow
Get-Content .github/workflows/intelligent-parallel-testing.yml
```

#### Step 3: Local Testing

Create a validation script: `scripts/validate-sharding.ts`

```typescript
import { IntelligentShardingStrategy } from './intelligent-sharding';
import * as fs from 'fs';

async function validateSharding() {
  console.log('🧪 Validating Advanced Sharding Implementation');
  console.log('==============================================');
  
  const strategy = new IntelligentShardingStrategy();
  
  // Test different scenarios
  const scenarios = [
    { testDir: 'tests', targetTime: 300, name: '5-minute target' },
    { testDir: 'tests', targetTime: 600, name: '10-minute target' },
    { testDir: 'tests', targetTime: 900, name: '15-minute target' },
  ];
  
  const results = [];
  
  for (const scenario of scenarios) {
    console.log(`\n📊 Testing scenario: ${scenario.name}`);
    
    try {
      const sharding = await strategy.generateOptimalSharding(
        scenario.testDir, 
        scenario.targetTime
      );
      
      const result = {
        scenario: scenario.name,
        shards: sharding.shards.length,
        loadBalanceScore: sharding.loadBalanceScore,
        efficiency: sharding.efficiency,
        maxDuration: sharding.maxShardDuration,
        estimatedSpeedup: `${sharding.efficiency.toFixed(1)}x`,
      };
      
      results.push(result);
      
      console.log(`   Shards: ${result.shards}`);
      console.log(`   Load Balance: ${result.loadBalanceScore.toFixed(3)}`);  
      console.log(`   Efficiency: ${result.estimatedSpeedup}`);
      console.log(`   Max Duration: ${Math.ceil(result.maxDuration / 60)} min`);
      
    } catch (error) {
      console.error(`   ❌ Scenario failed: ${error.message}`);
    }
  }
  
  // Save validation results
  await fs.promises.writeFile(
    'validation-results.json',
    JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2)
  );
  
  console.log('\n✅ Validation complete!');
  console.log('📋 Results saved to: validation-results.json');
  
  return results;
}

validateSharding().catch(console.error);
```

Run validation:

```powershell
npx ts-node scripts/validate-sharding.ts
```

---

## Part D: Advanced Performance Optimization

### Task 6: Create Performance Monitoring Dashboard

Create: `scripts/performance-dashboard.ts`

```typescript
interface PerformanceMetrics {
  timestamp: string;
  shardCount: number;
  totalDuration: number;
  loadBalanceScore: number;
  memoryUsage: number;
  cpuUtilization: number;
  testCount: number;
  successRate: number;
}

class PerformanceDashboard {
  private metrics: PerformanceMetrics[] = [];
  
  async collectMetrics(resultsDir: string): Promise<PerformanceMetrics> {
    // Implementation to collect and analyze performance data
    // This would parse test results, system metrics, etc.
    
    return {
      timestamp: new Date().toISOString(),
      shardCount: 0,
      totalDuration: 0,
      loadBalanceScore: 0,
      memoryUsage: 0,
      cpuUtilization: 0,
      testCount: 0,
      successRate: 0,
    };
  }
  
  generateTrendReport(): void {
    // Generate trend analysis and recommendations
    console.log('📈 Performance Trend Analysis');
    // Implementation details...
  }
}
```

---

## Deliverables

Upon completion of this exercise, you should have:

### 1. **Advanced Sharding System** (✅ Must Have)
- [ ] `TestComplexityAnalyzer` class with intelligent test classification
- [ ] `IntelligentShardingStrategy` with LPTF algorithm implementation
- [ ] Complexity-based test distribution logic
- [ ] Load balance scoring and optimization

### 2. **Dynamic GitHub Actions Workflow** (✅ Must Have)
- [ ] `DynamicWorkflowGenerator` class
- [ ] Auto-generating workflow based on test analysis
- [ ] Matrix strategy with adaptive resource allocation
- [ ] Performance monitoring integration

### 3. **CLI Tools and Scripts** (✅ Must Have)
- [ ] Package.json scripts for all operations
- [ ] Command-line interface for sharding analysis
- [ ] Workflow generation automation
- [ ] Validation and testing utilities

### 4. **Performance Analysis** (✅ Must Have)
- [ ] Comprehensive sharding report generation
- [ ] Load balance score calculations
- [ ] Performance trend analysis
- [ ] Optimization recommendations

### 5. **Documentation and Validation** (🎯 Excellence)
- [ ] Complete implementation with all TypeScript files
- [ ] Successful local validation of sharding algorithms
- [ ] Performance benchmarks showing improvement
- [ ] Generated GitHub Actions workflow file

---

## Assessment Criteria

### Technical Implementation (40 points)
- **Algorithm Correctness:** Does the LPTF algorithm properly distribute tests?
- **Load Balancing:** Are shards well-balanced with good scores (>0.8)?
- **Resource Management:** Are system resources efficiently utilized?
- **Error Handling:** Does the system handle edge cases gracefully?

### GitHub Actions Integration (25 points)
- **Dynamic Configuration:** Does the workflow adapt based on test analysis?
- **Matrix Strategy:** Is the matrix properly configured for parallel execution?
- **Performance Monitoring:** Are metrics collected and analyzed effectively?
- **Artifact Management:** Are results properly stored and consolidated?

### Performance Optimization (20 points)
- **Execution Speed:** Does the implementation achieve target execution times?
- **Memory Efficiency:** Is memory usage optimized across shards?
- **Scalability:** Can the system handle large test suites effectively?
- **Monitoring:** Are performance bottlenecks identified and addressed?

### Code Quality and Documentation (15 points)
- **TypeScript Best Practices:** Proper typing, interfaces, and error handling
- **Code Organization:** Clear separation of concerns and modularity
- **Documentation:** Comprehensive comments and usage instructions
- **Testing:** Validation scripts and performance benchmarks

---

## Success Metrics

To successfully complete this exercise:

✅ **Load Balance Score:** Achieve consistently >0.85 across different test scenarios
✅ **Performance Improvement:** Demonstrate >3x speedup compared to sequential execution
✅ **Resource Efficiency:** Memory usage <2GB per shard, optimal CPU utilization
✅ **Reliability:** <5% variation in shard execution times across runs
✅ **Scalability:** Successfully handle test suites with 100+ test files

---

## Troubleshooting Guide

### Common Issues and Solutions

**Issue: Poor load balance scores (<0.7)**
- **Solution:** Review test complexity analysis, adjust algorithm weights
- **Check:** Are high-complexity tests properly distributed?

**Issue: Excessive memory usage**
- **Solution:** Implement resource limits, optimize test data management
- **Check:** Are browser contexts properly cleaned up?

**Issue: Workflow generation fails**
- **Solution:** Verify TypeScript compilation, check file permissions
- **Check:** Are all dependencies installed correctly?

**Issue: Inaccurate duration estimates**
- **Solution:** Calibrate complexity scoring with actual test runs
- **Check:** Are baseline measurements recent and accurate?

---

## Extension Challenges (Optional)

For advanced learners who want to go further:

### 1. **Machine Learning Integration**
- Implement ML-based duration prediction using historical data
- Create adaptive algorithms that learn from past runs

### 2. **Multi-Environment Support**
- Extend sharding to work across different CI platforms (Azure DevOps, GitLab)
- Create environment-specific optimization strategies

### 3. **Advanced Analytics**
- Build real-time performance monitoring dashboard
- Implement predictive analysis for capacity planning

### 4. **Enterprise Features**
- Add support for cost optimization across cloud providers
- Implement quality gates based on performance metrics

---

## Next Steps

After completing this exercise:

1. **Deploy to Production:** Implement the advanced sharding in your organization's CI/CD pipeline
2. **Monitor and Optimize:** Use the performance metrics to continuously improve sharding strategies
3. **Share Knowledge:** Document lessons learned and best practices for your team
4. **Advanced Learning:** Proceed to Lesson 06 for deeper CI/CD pipeline integration

## Resources

- [Longest Processing Time First Algorithm](https://en.wikipedia.org/wiki/Longest-processing-time-first_scheduling)
- [GitHub Actions Matrix Builds](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
- [Playwright Test Sharding](https://playwright.dev/docs/test-sharding)
- [TypeScript Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

**Exercise Version:** 1.0  
**Estimated Completion Time:** 4-6 hours  
**Difficulty Level:** Advanced (Enterprise-Scale Implementation)