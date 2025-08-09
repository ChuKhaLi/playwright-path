/**
 * Quality Gate Validator
 * Comprehensive validation system for CI/CD quality gates
 * Supports multiple platforms (GitHub Actions, Azure DevOps, GitLab CI)
 */

import { TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

// Types and interfaces
interface QualityMetrics {
  testResults: TestMetrics;
  codeQuality: CodeQualityMetrics;
  security: SecurityMetrics;
  performance: PerformanceMetrics;
}

interface TestMetrics {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
  duration: number;
  coverage?: number;
}

interface CodeQualityMetrics {
  lintErrors: number;
  lintWarnings: number;
  complexityScore: number;
  duplicateCodePercentage: number;
  technicalDebt: number;
}

interface SecurityMetrics {
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  licenseIssues: number;
}

interface PerformanceMetrics {
  averageResponseTime: number;
  p95ResponseTime: number;
  throughput: number;
  errorRate: number;
  resourceUtilization: number;
}

interface QualityGateRules {
  environment: 'development' | 'staging' | 'production';
  thresholds: {
    testPassRate: number;
    codeQualityScore: number;
    maxCriticalVulnerabilities: number;
    maxHighVulnerabilities: number;
    maxErrorRate: number;
    minCoverage?: number;
    maxResponseTime?: number;
  };
  requiredMetrics: string[];
  blockerConditions: string[];
  warningConditions: string[];
}

class QualityGateValidator {
  private rules: QualityGateRules;
  private metrics: QualityMetrics;
  private validationResults: ValidationResult[] = [];

  constructor(environment: string, configPath?: string) {
    this.rules = this.loadQualityGateRules(environment, configPath);
    this.metrics = this.initializeMetrics();
  }

  /**
   * Load quality gate rules for the specified environment
   */
  private loadQualityGateRules(environment: string, configPath?: string): QualityGateRules {
    const defaultRules: Record<string, QualityGateRules> = {
      development: {
        environment: 'development',
        thresholds: {
          testPassRate: 85,
          codeQualityScore: 70,
          maxCriticalVulnerabilities: 0,
          maxHighVulnerabilities: 5,
          maxErrorRate: 10,
          minCoverage: 70,
        },
        requiredMetrics: ['testResults', 'codeQuality'],
        blockerConditions: [
          'testResults.passRate < thresholds.testPassRate',
          'security.criticalVulnerabilities > thresholds.maxCriticalVulnerabilities'
        ],
        warningConditions: [
          'codeQuality.lintWarnings > 50',
          'security.highVulnerabilities > thresholds.maxHighVulnerabilities'
        ]
      },
      staging: {
        environment: 'staging',
        thresholds: {
          testPassRate: 95,
          codeQualityScore: 80,
          maxCriticalVulnerabilities: 0,
          maxHighVulnerabilities: 2,
          maxErrorRate: 5,
          minCoverage: 80,
          maxResponseTime: 2000,
        },
        requiredMetrics: ['testResults', 'codeQuality', 'security', 'performance'],
        blockerConditions: [
          'testResults.passRate < thresholds.testPassRate',
          'security.criticalVulnerabilities > thresholds.maxCriticalVulnerabilities',
          'security.highVulnerabilities > thresholds.maxHighVulnerabilities',
          'performance.errorRate > thresholds.maxErrorRate'
        ],
        warningConditions: [
          'performance.averageResponseTime > (thresholds.maxResponseTime * 0.8)',
          'codeQuality.technicalDebt > 1000'
        ]
      },
      production: {
        environment: 'production',
        thresholds: {
          testPassRate: 98,
          codeQualityScore: 90,
          maxCriticalVulnerabilities: 0,
          maxHighVulnerabilities: 0,
          maxErrorRate: 2,
          minCoverage: 85,
          maxResponseTime: 1500,
        },
        requiredMetrics: ['testResults', 'codeQuality', 'security', 'performance'],
        blockerConditions: [
          'testResults.passRate < thresholds.testPassRate',
          'security.criticalVulnerabilities > thresholds.maxCriticalVulnerabilities',
          'security.highVulnerabilities > thresholds.maxHighVulnerabilities',
          'performance.errorRate > thresholds.maxErrorRate',
          'performance.p95ResponseTime > thresholds.maxResponseTime'
        ],
        warningConditions: [
          'codeQuality.lintWarnings > 0',
          'security.mediumVulnerabilities > 5'
        ]
      }
    };

    if (configPath && fs.existsSync(configPath)) {
      const customRules = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return { ...defaultRules[environment], ...customRules };
    }

    return defaultRules[environment] || defaultRules.development;
  }

  /**
   * Initialize metrics structure
   */
  private initializeMetrics(): QualityMetrics {
    return {
      testResults: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        passRate: 0,
        duration: 0
      },
      codeQuality: {
        lintErrors: 0,
        lintWarnings: 0,
        complexityScore: 0,
        duplicateCodePercentage: 0,
        technicalDebt: 0
      },
      security: {
        criticalVulnerabilities: 0,
        highVulnerabilities: 0,
        mediumVulnerabilities: 0,
        lowVulnerabilities: 0,
        licenseIssues: 0
      },
      performance: {
        averageResponseTime: 0,
        p95ResponseTime: 0,
        throughput: 0,
        errorRate: 0,
        resourceUtilization: 0
      }
    };
  }

  /**
   * Load test results from Playwright JSON report
   */
  async loadPlaywrightResults(jsonReportPath: string): Promise<void> {
    try {
      if (!fs.existsSync(jsonReportPath)) {
        throw new Error(`Test results file not found: ${jsonReportPath}`);
      }

      const reportData = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
      
      this.metrics.testResults = {
        total: reportData.stats?.total || 0,
        passed: reportData.stats?.passed || 0,
        failed: reportData.stats?.failed || 0,
        skipped: reportData.stats?.skipped || 0,
        passRate: reportData.stats?.total > 0 
          ? (reportData.stats.passed / reportData.stats.total) * 100 
          : 0,
        duration: reportData.stats?.duration || 0
      };

      console.log('✅ Test results loaded successfully');
      console.log(`   Pass Rate: ${this.metrics.testResults.passRate.toFixed(2)}%`);
      console.log(`   Total Tests: ${this.metrics.testResults.total}`);
      
    } catch (error) {
      console.error('❌ Failed to load test results:', error);
      throw error;
    }
  }

  /**
   * Load code quality metrics from ESLint report
   */
  async loadCodeQualityMetrics(eslintReportPath: string): Promise<void> {
    try {
      if (!fs.existsSync(eslintReportPath)) {
        console.warn('⚠️ Code quality report not found, using defaults');
        return;
      }

      const eslintData = JSON.parse(fs.readFileSync(eslintReportPath, 'utf8'));
      
      const totalErrors = eslintData.reduce((sum: number, file: any) => sum + file.errorCount, 0);
      const totalWarnings = eslintData.reduce((sum: number, file: any) => sum + file.warningCount, 0);
      
      this.metrics.codeQuality = {
        lintErrors: totalErrors,
        lintWarnings: totalWarnings,
        complexityScore: Math.max(0, 100 - totalErrors * 5 - totalWarnings),
        duplicateCodePercentage: 0, // Would need additional tooling
        technicalDebt: totalErrors * 30 + totalWarnings * 10 // Rough estimate
      };

      console.log('✅ Code quality metrics loaded');
      console.log(`   Errors: ${totalErrors}, Warnings: ${totalWarnings}`);
      console.log(`   Quality Score: ${this.metrics.codeQuality.complexityScore}`);
      
    } catch (error) {
      console.error('❌ Failed to load code quality metrics:', error);
      throw error;
    }
  }

  /**
   * Load security metrics from npm audit report
   */
  async loadSecurityMetrics(auditReportPath: string): Promise<void> {
    try {
      if (!fs.existsSync(auditReportPath)) {
        console.warn('⚠️ Security audit report not found, using defaults');
        return;
      }

      const auditData = JSON.parse(fs.readFileSync(auditReportPath, 'utf8'));
      const metadata = auditData.metadata?.vulnerabilities || {};
      
      this.metrics.security = {
        criticalVulnerabilities: metadata.critical || 0,
        highVulnerabilities: metadata.high || 0,
        mediumVulnerabilities: metadata.moderate || 0,
        lowVulnerabilities: metadata.low || 0,
        licenseIssues: 0 // Would need additional tooling
      };

      console.log('✅ Security metrics loaded');
      console.log(`   Critical: ${this.metrics.security.criticalVulnerabilities}`);
      console.log(`   High: ${this.metrics.security.highVulnerabilities}`);
      
    } catch (error) {
      console.error('❌ Failed to load security metrics:', error);
      throw error;
    }
  }

  /**
   * Load performance metrics from custom performance report
   */
  async loadPerformanceMetrics(performanceReportPath: string): Promise<void> {
    try {
      if (!fs.existsSync(performanceReportPath)) {
        console.warn('⚠️ Performance report not found, using defaults');
        return;
      }

      const perfData = JSON.parse(fs.readFileSync(performanceReportPath, 'utf8'));
      
      this.metrics.performance = {
        averageResponseTime: perfData.averageResponseTime || 0,
        p95ResponseTime: perfData.p95ResponseTime || 0,
        throughput: perfData.throughput || 0,
        errorRate: perfData.errorRate || 0,
        resourceUtilization: perfData.resourceUtilization || 0
      };

      console.log('✅ Performance metrics loaded');
      console.log(`   Avg Response Time: ${this.metrics.performance.averageResponseTime}ms`);
      console.log(`   Error Rate: ${this.metrics.performance.errorRate}%`);
      
    } catch (error) {
      console.error('❌ Failed to load performance metrics:', error);
      throw error;
    }
  }

  /**
   * Validate all quality gates
   */
  async validateQualityGates(): Promise<QualityGateResult> {
    console.log(`\n🔍 Validating quality gates for ${this.rules.environment} environment...`);
    
    this.validationResults = [];
    let hasBlockers = false;
    let hasWarnings = false;

    // Validate required metrics are available
    await this.validateRequiredMetrics();

    // Validate blocker conditions
    for (const condition of this.rules.blockerConditions) {
      const result = this.evaluateCondition(condition, 'blocker');
      this.validationResults.push(result);
      if (!result.passed) {
        hasBlockers = true;
      }
    }

    // Validate warning conditions
    for (const condition of this.rules.warningConditions) {
      const result = this.evaluateCondition(condition, 'warning');
      this.validationResults.push(result);
      if (!result.passed) {
        hasWarnings = true;
      }
    }

    // Generate overall result
    const result: QualityGateResult = {
      passed: !hasBlockers,
      environment: this.rules.environment,
      summary: {
        blockers: this.validationResults.filter(r => r.severity === 'blocker' && !r.passed).length,
        warnings: this.validationResults.filter(r => r.severity === 'warning' && !r.passed).length,
        passed: this.validationResults.filter(r => r.passed).length,
        total: this.validationResults.length
      },
      details: this.validationResults,
      metrics: this.metrics,
      recommendations: this.generateRecommendations()
    };

    this.printValidationSummary(result);
    return result;
  }

  /**
   * Validate that required metrics are available
   */
  private async validateRequiredMetrics(): Promise<void> {
    for (const metric of this.rules.requiredMetrics) {
      const hasData = this.checkMetricAvailability(metric);
      this.validationResults.push({
        condition: `Required metric: ${metric}`,
        passed: hasData,
        severity: hasData ? 'info' : 'blocker',
        actualValue: hasData ? 'Available' : 'Missing',
        expectedValue: 'Available',
        message: hasData 
          ? `✅ ${metric} data is available`
          : `❌ ${metric} data is missing - quality gate validation incomplete`
      });
    }
  }

  /**
   * Check if a specific metric has data
   */
  private checkMetricAvailability(metric: string): boolean {
    switch (metric) {
      case 'testResults':
        return this.metrics.testResults.total > 0;
      case 'codeQuality':
        return this.metrics.codeQuality.complexityScore > 0;
      case 'security':
        return true; // Security metrics default to 0, which is valid
      case 'performance':
        return this.metrics.performance.averageResponseTime > 0;
      default:
        return false;
    }
  }

  /**
   * Evaluate a quality gate condition
   */
  private evaluateCondition(condition: string, severity: 'blocker' | 'warning'): ValidationResult {
    try {
      const { actualValue, expectedValue, passed } = this.parseAndEvaluate(condition);
      
      return {
        condition,
        passed,
        severity,
        actualValue: actualValue.toString(),
        expectedValue: expectedValue.toString(),
        message: passed 
          ? `✅ ${condition}: ${actualValue} (OK)`
          : `${severity === 'blocker' ? '❌' : '⚠️'} ${condition}: ${actualValue} vs expected ${expectedValue}`
      };
    } catch (error) {
      return {
        condition,
        passed: false,
        severity: 'blocker',
        actualValue: 'Error',
        expectedValue: 'Valid evaluation',
        message: `❌ Failed to evaluate condition: ${condition} - ${error}`
      };
    }
  }

  /**
   * Parse and evaluate a condition string
   */
  private parseAndEvaluate(condition: string): { actualValue: number, expectedValue: number, passed: boolean } {
    // Replace metric references with actual values
    let evaluatedCondition = condition;
    
    // Test results replacements
    evaluatedCondition = evaluatedCondition.replace(/testResults\.passRate/g, this.metrics.testResults.passRate.toString());
    evaluatedCondition = evaluatedCondition.replace(/testResults\.total/g, this.metrics.testResults.total.toString());
    
    // Security replacements
    evaluatedCondition = evaluatedCondition.replace(/security\.criticalVulnerabilities/g, this.metrics.security.criticalVulnerabilities.toString());
    evaluatedCondition = evaluatedCondition.replace(/security\.highVulnerabilities/g, this.metrics.security.highVulnerabilities.toString());
    evaluatedCondition = evaluatedCondition.replace(/security\.mediumVulnerabilities/g, this.metrics.security.mediumVulnerabilities.toString());
    
    // Performance replacements
    evaluatedCondition = evaluatedCondition.replace(/performance\.errorRate/g, this.metrics.performance.errorRate.toString());
    evaluatedCondition = evaluatedCondition.replace(/performance\.averageResponseTime/g, this.metrics.performance.averageResponseTime.toString());
    evaluatedCondition = evaluatedCondition.replace(/performance\.p95ResponseTime/g, this.metrics.performance.p95ResponseTime.toString());
    
    // Code quality replacements
    evaluatedCondition = evaluatedCondition.replace(/codeQuality\.lintWarnings/g, this.metrics.codeQuality.lintWarnings.toString());
    evaluatedCondition = evaluatedCondition.replace(/codeQuality\.technicalDebt/g, this.metrics.codeQuality.technicalDebt.toString());
    
    // Threshold replacements
    evaluatedCondition = evaluatedCondition.replace(/thresholds\.testPassRate/g, this.rules.thresholds.testPassRate.toString());
    evaluatedCondition = evaluatedCondition.replace(/thresholds\.maxCriticalVulnerabilities/g, this.rules.thresholds.maxCriticalVulnerabilities.toString());
    evaluatedCondition = evaluatedCondition.replace(/thresholds\.maxHighVulnerabilities/g, this.rules.thresholds.maxHighVulnerabilities.toString());
    evaluatedCondition = evaluatedCondition.replace(/thresholds\.maxErrorRate/g, this.rules.thresholds.maxErrorRate.toString());
    evaluatedCondition = evaluatedCondition.replace(/thresholds\.maxResponseTime/g, (this.rules.thresholds.maxResponseTime || 0).toString());
    
    // Extract actual and expected values for reporting
    const parts = condition.split(/(<|>|<=|>=|==|!=)/);
    if (parts.length >= 3) {
      const leftSide = parts[0].trim();
      const operator = parts[1].trim();
      const rightSide = parts[2].trim();
      
      const actualValue = this.getMetricValue(leftSide);
      const expectedValue = this.getMetricValue(rightSide);
      
      // Evaluate the condition
      const passed = !eval(evaluatedCondition);
      
      return { actualValue, expectedValue, passed };
    }
    
    throw new Error(`Invalid condition format: ${condition}`);
  }

  /**
   * Get the actual value of a metric reference
   */
  private getMetricValue(reference: string): number {
    const thresholdMatch = reference.match(/thresholds\.(\w+)/);
    if (thresholdMatch) {
      const thresholdKey = thresholdMatch[1] as keyof typeof this.rules.thresholds;
      return this.rules.thresholds[thresholdKey] as number || 0;
    }
    
    const metricMatch = reference.match(/(\w+)\.(\w+)/);
    if (metricMatch) {
      const [, category, metric] = metricMatch;
      return (this.metrics as any)[category]?.[metric] || 0;
    }
    
    return parseFloat(reference) || 0;
  }

  /**
   * Generate recommendations based on validation results
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Test-related recommendations
    if (this.metrics.testResults.passRate < this.rules.thresholds.testPassRate) {
      recommendations.push(`Improve test pass rate: Current ${this.metrics.testResults.passRate.toFixed(2)}% < Required ${this.rules.thresholds.testPassRate}%`);
      recommendations.push('Review failing tests and fix underlying issues');
      recommendations.push('Consider adding more robust error handling and retries');
    }
    
    // Security recommendations
    if (this.metrics.security.criticalVulnerabilities > 0) {
      recommendations.push(`Address ${this.metrics.security.criticalVulnerabilities} critical security vulnerabilities immediately`);
      recommendations.push('Run `npm audit fix` or manually update vulnerable dependencies');
    }
    
    if (this.metrics.security.highVulnerabilities > this.rules.thresholds.maxHighVulnerabilities) {
      recommendations.push(`Reduce high-severity vulnerabilities from ${this.metrics.security.highVulnerabilities} to ${this.rules.thresholds.maxHighVulnerabilities} or fewer`);
    }
    
    // Performance recommendations
    if (this.metrics.performance.errorRate > this.rules.thresholds.maxErrorRate) {
      recommendations.push(`Reduce error rate: Current ${this.metrics.performance.errorRate}% > Threshold ${this.rules.thresholds.maxErrorRate}%`);
      recommendations.push('Investigate and fix the root causes of application errors');
    }
    
    // Code quality recommendations
    if (this.metrics.codeQuality.lintErrors > 0) {
      recommendations.push(`Fix ${this.metrics.codeQuality.lintErrors} ESLint errors`);
      recommendations.push('Consider running `npm run lint -- --fix` for auto-fixable issues');
    }
    
    if (this.metrics.codeQuality.lintWarnings > 50) {
      recommendations.push(`Consider addressing ${this.metrics.codeQuality.lintWarnings} ESLint warnings to improve code quality`);
    }
    
    return recommendations.length > 0 ? recommendations : ['✅ All quality gates are meeting requirements'];
  }

  /**
   * Print validation summary to console
   */
  private printValidationSummary(result: QualityGateResult): void {
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 QUALITY GATE VALIDATION SUMMARY - ${result.environment.toUpperCase()}`);
    console.log('='.repeat(60));
    
    console.log(`\n📊 Overall Result: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`📈 Summary: ${result.summary.passed}/${result.summary.total} checks passed`);
    
    if (result.summary.blockers > 0) {
      console.log(`🚫 Blockers: ${result.summary.blockers}`);
    }
    
    if (result.summary.warnings > 0) {
      console.log(`⚠️ Warnings: ${result.summary.warnings}`);
    }
    
    console.log('\n📋 Detailed Results:');
    console.log('-'.repeat(40));
    
    result.details.forEach(detail => {
      console.log(`${detail.message}`);
    });
    
    if (result.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      console.log('-'.repeat(40));
      result.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
  }

  /**
   * Export results to file for CI/CD integration
   */
  async exportResults(result: QualityGateResult, outputPath: string): Promise<void> {
    try {
      await fs.promises.writeFile(outputPath, JSON.stringify(result, null, 2));
      console.log(`📄 Quality gate results exported to: ${outputPath}`);
    } catch (error) {
      console.error('❌ Failed to export results:', error);
      throw error;
    }
  }
}

// Supporting interfaces
interface ValidationResult {
  condition: string;
  passed: boolean;
  severity: 'blocker' | 'warning' | 'info';
  actualValue: string;
  expectedValue: string;
  message: string;
}

interface QualityGateResult {
  passed: boolean;
  environment: string;
  summary: {
    blockers: number;
    warnings: number;
    passed: number;
    total: number;
  };
  details: ValidationResult[];
  metrics: QualityMetrics;
  recommendations: string[];
}

// CLI usage example
async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: node quality-gate-validator.js <environment> [config-path]');
    console.log('Environments: development, staging, production');
    process.exit(1);
  }

  const environment = process.argv[2];
  const configPath = process.argv[3];

  try {
    const validator = new QualityGateValidator(environment, configPath);
    
    // Load all available reports
    await validator.loadPlaywrightResults('./test-results.json');
    await validator.loadCodeQualityMetrics('./eslint-results.json');
    await validator.loadSecurityMetrics('./security-audit.json');
    await validator.loadPerformanceMetrics('./performance-results.json');
    
    // Validate quality gates
    const result = await validator.validateQualityGates();
    
    // Export results
    await validator.exportResults(result, './quality-gate-results.json');
    
    // Set exit code based on result
    process.exit(result.passed ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Quality gate validation failed:', error);
    process.exit(1);
  }
}

// Export for use as module
export { QualityGateValidator, QualityMetrics, QualityGateResult };

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}